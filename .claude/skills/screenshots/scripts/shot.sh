#!/usr/bin/env bash
# shot.sh element <selector> <out.png> [options]
# shot.sh range   <top-selector> <bottom-selector> <out.png> [options]
# shot.sh isolate <selector> <out.png> [--with <selector>]... [--hide <selector>]... [options]
# shot.sh page    <out.png> [options]
#
#   --pad <px>        breathing room around the clip (default 24; 0 for isolate)
#   --threshold <0-1> area above which a clip is promoted to a full-viewport shot (default 0.5)
#   --with <selector> isolate only: another element to keep, e.g. a popover portalled elsewhere
#   --hide <selector> isolate only: a part inside a kept element to leave out, e.g. its label
#
# Run from `webapp/`, after scripts/nav.sh. Prints the mode it chose, the clip and the fraction
# of the viewport it covered. Refuses to shoot below 2x device pixels: a 1x capture looks soft on
# any HiDPI screen, and that is what setup.sh's cli.config.json is there to prevent.
#
# `element` clips one element plus padding; `range` clips from the top of one element to the
# bottom of another, across the horizontal union of the two — for panels whose container box is
# far taller than the part worth showing.
#
# A clip that covers more than --threshold of the viewport is promoted to a full-viewport shot
# automatically: at that size the crop no longer reads as a component still, just as a page
# screenshot with its edges shaved off.
#
# `isolate` shoots a component and nothing else, over a transparent background: every element
# that is not a kept one (the target plus each --with) or inside one stops painting, the page
# background included, and the clip is the union of the kept elements, edge to edge. The kept
# elements paint exactly as on the page — their own background, corners, border and shadow — so
# pick the element that draws the component's surface, not a wrapper around it. Nothing moves:
# hidden elements keep their layout — except that a kept element stretched by a grid or flex-row
# parent to its neighbours' height is shown at its own. Page styles are restored afterwards.
# Never promoted: an isolated component is a component still at any size.
set -euo pipefail
. "$(dirname "$0")/lib.sh"

mode="${1:-}"; shift || true
top=''; bottom=''; out=''
pad=''; threshold=0.5
keep=''; hide=''

case "$mode" in
  element) top="$(js_string "${1:?selector}")"; out="${2:?output path}"; shift 2 ;;
  range) top="$(js_string "${1:?top selector}")"; bottom="$(js_string "${2:?bottom selector}")"; out="${3:?output path}"; shift 3 ;;
  isolate) top="$(js_string "${1:?selector}")"; out="${2:?output path}"; keep="'$top'"; shift 2 ;;
  page) out="${1:?output path}"; shift ;;
  *) echo 'usage: shot.sh element|range|isolate|page ... — see the header of this file' >&2; exit 2 ;;
esac

while [ $# -gt 0 ]; do
  case "$1" in
    --pad) pad="$2"; shift 2 ;;
    --threshold) threshold="$2"; shift 2 ;;
    --with) keep="$keep, '$(js_string "$2")'"; shift 2 ;;
    --hide) hide="$hide'$(js_string "$2")', "; shift 2 ;;
    *) echo "unknown option: $1" >&2; exit 2 ;;
  esac
done
# An isolated component is cut edge to edge: the docs frame (ThemedImage) hugs it with the app's
# own radius, and padding would only show up as a transparent gap inside that frame.
if [ -z "$pad" ]; then
  if [ "$mode" = 'isolate' ]; then pad=0; else pad=24; fi
fi
if [ "$mode" != 'isolate' ] && [ -n "$keep$hide" ]; then
  echo '--with and --hide only apply to isolate' >&2; exit 2
fi

mkdir -p "$(dirname "$out")"

run_code <<EOF
async page => {
  const mode = '$mode'
  const pad = $pad
  const size = page.viewportSize()
  const dpr = await page.evaluate(() => window.devicePixelRatio)
  if (dpr < 2) throw new Error('device pixel ratio is ' + dpr + ', captures would be blurry: re-run scripts/setup.sh')
  let clip
  let warnings = []

  if (mode === 'isolate') {
    warnings = await page.evaluate(({ keep, hide }) => {
      const mark = (selector, attribute) => {
        const el = document.querySelector(selector)
        if (!el) throw new Error('no element for ' + selector)
        el.setAttribute(attribute, '')
        return el
      }
      // A kept element that paints no background of its own, inside a parent that does, is almost
      // always the wrong selector: the transparent inner box of the component (HeroUI's
      // popover-dialog section inside its .popover parent, say). Isolated, its contents float
      // over nothing — invisible on a light take, obvious only once the same shot is taken in
      // dark. Warned about here rather than left for the review pass, where it has been missed.
      const opaque = el => {
        const bg = getComputedStyle(el).backgroundColor
        const alpha = /rgba?\([^)]*?,\s*([\d.]+)\s*\)$/.exec(bg)
        return bg !== 'transparent' && (!alpha || Number(alpha[1]) > 0)
      }
      const warnings = []
      for (const el of keep.map(s => mark(s, 'data-shot-keep'))) {
        if (!opaque(el)) {
          for (let p = el.parentElement; p; p = p.parentElement) {
            if (!opaque(p)) continue
            warnings.push('kept element ' + el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') +
              ' paints no background; its ancestor ' + p.tagName.toLowerCase() + '.' +
              (p.className || '').toString().split(' ')[0] + ' does — keep that one instead')
            break
          }
        }
        for (let p = el.parentElement; p; p = p.parentElement) p.setAttribute('data-shot-ancestor', '')
        // A grid or a flex row stretches a card to the height of its tallest neighbour, which on
        // its own reads as a gap inside the component. Only those parents: in a flex column the
        // same property would shrink the width instead.
        const parent = el.parentElement && getComputedStyle(el.parentElement)
        if (parent && (/grid/.test(parent.display) || (/flex/.test(parent.display) && parent.flexDirection.startsWith('row')))) {
          el.setAttribute('data-shot-natural', '')
        }
      }
      hide.forEach(s => mark(s, 'data-shot-hide'))
      // Opening a Select, Menu or Combobox makes react-aria focus an option, which HeroUI draws as
      // a ring a reader takes for a keyboard user. Focusing the list keeps the overlay open.
      const focused = document.activeElement
      if (focused && focused.closest('[data-shot-keep]') && focused.matches('[role="option"], [role^="menuitem"]')) {
        focused.closest('[role="listbox"], [role="menu"]')?.focus()
      }
      // Moving DOM focus is not enough on its own: react-aria draws the ring from the data-focus*
      // attributes it keeps on the element across re-renders, and stripping those makes React
      // re-apply them (and takes the trigger's own hover/pressed surface with them). So the ring is
      // suppressed in CSS instead, only inside the kept subtrees and only on elements that actually
      // carry a focus attribute — a focused component whose surface is a box-shadow loses it here,
      // which is the right trade against shipping a blue ring nobody tabbed to.
      const ring = ':is([data-focus-visible], [data-focused], [data-focus], :focus-visible)'
      // Ancestors and everything outside the kept subtrees stop painting; the kept subtrees are
      // left alone, so anything the component itself hides stays hidden. visibility, unlike
      // display or opacity, lets a descendant paint through a hidden ancestor and keeps layout.
      const style = document.createElement('style')
      style.id = 'shot-isolate'
      style.textContent =
        'html, body { background: transparent !important }' +
        '[data-shot-ancestor], :not([data-shot-ancestor]):not([data-shot-keep]):not([data-shot-keep] *) { visibility: hidden !important }' +
        '[data-shot-keep] { visibility: visible !important }' +
        '[data-shot-hide] { visibility: hidden !important }' +
        '[data-shot-natural] { align-self: start !important }' +
        '[data-shot-keep]' + ring + ', [data-shot-keep] ' + ring + ' {' +
        ' outline: none !important; box-shadow: none !important;' +
        ' --tw-ring-shadow: 0 0 #0000 !important; --tw-ring-offset-shadow: 0 0 #0000 !important }'
      document.head.appendChild(style)
      return warnings
    }, { keep: [$keep], hide: [$hide] })
    await page.waitForTimeout(300)
  }

  if (mode !== 'page') {
    const boxes = mode === 'isolate'
      ? await page.locator('[data-shot-keep]').evaluateAll(els => els.map(el => {
        const r = el.getBoundingClientRect()
        return { x: r.x, y: r.y, width: r.width, height: r.height }
      }))
      : [
        await page.locator('$top').first().boundingBox({ timeout: 5000 }),
        mode === 'range' ? await page.locator('$bottom').first().boundingBox({ timeout: 5000 }) : null,
      ].filter(b => b !== null)
    if (!boxes.length || boxes.some(b => !b || !b.width || !b.height)) throw new Error('target not found or not visible: $top $bottom')
    const left = Math.min(...boxes.map(b => b.x))
    const right = Math.max(...boxes.map(b => b.x + b.width))
    const top = Math.min(...boxes.map(b => b.y))
    const bottom = Math.max(...boxes.map(b => b.y + b.height))
    const x = Math.max(0, left - pad)
    const y = Math.max(0, top - pad)
    clip = {
      x,
      y,
      width: Math.min(size.width - x, right + pad - x),
      height: Math.min(size.height - y, bottom + pad - y),
    }
  }

  const coverage = clip ? (clip.width * clip.height) / (size.width * size.height) : 1
  let chosen = clip ? 'clip' : 'viewport'
  if (mode === 'isolate') {
    chosen = 'isolated'
  } else if (clip && coverage > $threshold) {
    clip = undefined
    chosen = 'promoted-to-viewport'
  }

  const transparent = mode === 'isolate'
  await page.screenshot({ path: '$out', scale: 'device', clip, omitBackground: transparent })

  if (transparent) {
    await page.evaluate(() => {
      document.getElementById('shot-isolate')?.remove()
      for (const a of [ 'data-shot-keep', 'data-shot-ancestor', 'data-shot-hide', 'data-shot-natural' ]) {
        document.querySelectorAll('[' + a + ']').forEach(el => el.removeAttribute(a))
      }
    })
  }
  return { mode: chosen, coverage: Number(coverage.toFixed(2)), clip, transparent, dpr, ...(warnings.length ? { warnings } : {}) }
}
EOF
