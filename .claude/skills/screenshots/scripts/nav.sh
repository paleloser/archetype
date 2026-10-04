#!/usr/bin/env bash
# nav.sh <url> [--expect <visible text>] [--settle <ms>]
#
# Navigate and leave the page in a shootable state: dev indicator hidden, network idle, nothing
# focused, pointer parked off-canvas. Run from `webapp/`, once before every capture — the style
# tag and the blur do not survive a navigation.
#
# --expect waits for a string that only exists once the page has really rendered in the current
# locale. Worth passing: the dev server compiles a route on first visit, and a screenshot taken
# during that window catches a skeleton.
set -euo pipefail
. "$(dirname "$0")/lib.sh"

url=''
expect=''
settle=250

while [ $# -gt 0 ]; do
  case "$1" in
    --expect) expect="$(js_string "$2")"; shift 2 ;;
    --settle) settle="$2"; shift 2 ;;
    -*) echo "unknown option: $1" >&2; exit 2 ;;
    *) url="$(js_string "$1")"; shift ;;
  esac
done
[ -n "$url" ] || { echo 'usage: nav.sh <url> [--expect <text>] [--settle <ms>]' >&2; exit 2; }

run_code <<EOF
async page => {
  await page.goto('$url', { waitUntil: 'networkidle' })
  // The Next.js dev indicator renders in a custom element outside the app tree and would sit in
  // the corner of every full-viewport shot.
  await page.addStyleTag({ content: 'nextjs-portal { display: none !important }' })
  const expect = '$expect'
  if (expect) await page.getByText(expect).first().waitFor({ state: 'visible', timeout: 30000 })
  // A focus ring left over from the previous page, or a hover state under a parked cursor, both
  // read as "someone was clicking here" in the final asset.
  await page.evaluate(() => document.activeElement instanceof HTMLElement && document.activeElement.blur())
  const size = page.viewportSize()
  await page.mouse.move(size.width - 1, size.height - 1)
  await page.waitForLoadState('networkidle')
  await page.waitForTimeout($settle)
  return { url: page.url(), title: await page.title() }
}
EOF
