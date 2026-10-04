// recording.js — the cursor for screen recordings. Not run on its own: `record.sh` wraps a
// recording script with it and passes the result in as its second argument.
//
// A recording should navigate the way a person would: a pointer (or, in `touch` mode, a finger
// dot) glides to each control, presses it, and the page reacts. The cursor is drawn inside the
// page, so the screencast captures it, and every click it shows is also a real Playwright click
// on the same element. `install` also applies the recording hygiene on every page load, before
// first paint: the dev indicator and the header avatar (the logged-in account is real) hidden.
(page) => {
  let mode = 'pointer'
  let pos = null

  // Runs in the page, on every load. The cursor starts where the last page left it (same-origin
  // navigations, through sessionStorage); after a cross-origin hop it stays hidden until the
  // next action puts it back where the recording last had it.
  const init = ({ mode }) => {
    const mount = () => {
      if (!document.getElementById('__rec_style')) {
        const style = document.createElement('style')
        style.id = '__rec_style'
        style.textContent = 'nextjs-portal { display: none !important } header .avatar { visibility: hidden !important }'
        document.head.appendChild(style)
      }
      // Init scripts outlive a recording (the browser is reused between runs), so an earlier
      // install may already have mounted a cursor: the latest install's mode wins.
      const existing = document.getElementById('__cursor')
      if (existing && existing.dataset.mode === mode) return
      existing?.remove()
      let saved = null
      try { saved = JSON.parse(sessionStorage.getItem('__cursor')) } catch { saved = null }
      const el = document.createElement('div')
      el.id = '__cursor'
      el.dataset.mode = mode
      el.style.cssText = 'position:fixed;left:0;top:0;z-index:2147483647;pointer-events:none;will-change:transform'
      el.innerHTML = mode === 'touch'
        ? '<div data-body style="width:36px;height:36px;margin:-18px 0 0 -18px;border-radius:50%;background:rgba(255,255,255,.28);border:2px solid rgba(255,255,255,.9);box-shadow:0 2px 12px rgba(0,0,0,.45);transition:transform 120ms"></div>'
        : '<svg data-body width="30" height="30" viewBox="0 0 24 24" style="margin:-3px 0 0 -5px;filter:drop-shadow(0 2px 3px rgba(0,0,0,.5));transition:transform 120ms;transform-origin:5px 3px"><path d="M5 3l13.5 8.6-6.1 1.3 3.7 7.1-2.7 1.3-3.6-7.2L5 18.6z" fill="#fff" stroke="#111" stroke-width="1.3" stroke-linejoin="round"/></svg>'
      el.style.transform = saved ? `translate(${ saved.x }px, ${ saved.y }px)` : 'translate(-100px, -100px)'
      el.style.opacity = saved ? '1' : '0'
      document.documentElement.appendChild(el)
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount)
    else mount()
  }

  const place = (p, ms) => page.evaluate(({ x, y, ms }) => {
    const el = document.getElementById('__cursor')
    if (!el) return
    el.style.transition = ms ? `transform ${ ms }ms cubic-bezier(.45,0,.2,1)` : 'none'
    el.style.opacity = '1'
    el.style.transform = `translate(${ x }px, ${ y }px)`
    try { sessionStorage.setItem('__cursor', JSON.stringify({ x, y })) } catch { /* storage blocked */ }
  }, { ...p, ms })

  const api = {
    /** Call once, before navigating. `mode`: 'pointer' (desktop) or 'touch' (phone). */
    async install(options = {}) {
      mode = options.mode || 'pointer'
      await page.addInitScript(init, { mode })
      await page.evaluate(init, { mode })
    },

    /** Put the cursor back where the recording last had it, e.g. after a cross-origin hop. */
    async show() {
      if (!pos) {
        const size = page.viewportSize()
        pos = { x: Math.round(size.width * 0.62), y: Math.round(size.height * 0.7) }
      }
      await place(pos, 0)
    },

    /** Glide to a point. Duration scales with the distance unless given. */
    async moveTo(x, y, ms) {
      await api.show()
      const distance = Math.hypot(x - pos.x, y - pos.y)
      const duration = ms ?? Math.round(Math.min(1100, Math.max(450, 300 + distance * 0.55)))
      await place({ x, y }, duration)
      pos = { x, y }
      await page.waitForTimeout(duration)
      await page.mouse.move(x, y)
    },

    /** Smoothly scroll an element into view, as a reader would, before pointing at it. */
    async scroll(locator, block = 'center') {
      const inView = await locator.evaluate(el => {
        const r = el.getBoundingClientRect()
        return r.top >= 0 && r.bottom <= innerHeight
      })
      if (inView && block === 'center') return
      await locator.evaluate((el, b) => el.scrollIntoView({ behavior: 'smooth', block: b }), block)
      await page.waitForTimeout(900)
    },

    /** Glide to an element, press it with a ripple, and really click it. */
    async click(locator, options = {}) {
      await locator.waitFor({ state: 'visible' })
      await api.scroll(locator)
      const box = await locator.boundingBox()
      const x = Math.round(box.x + box.width / 2)
      const y = Math.round(box.y + box.height / 2)
      await api.moveTo(x, y)
      await page.waitForTimeout(options.hover ?? 250)
      await page.evaluate(({ x, y, touch }) => {
        const body = document.querySelector('#__cursor [data-body]')
        if (body) {
          body.style.transform = 'scale(.82)'
          setTimeout(() => { body.style.transform = '' }, 160)
        }
        const ring = document.createElement('div')
        ring.style.cssText = `position:fixed;left:${ x - 22 }px;top:${ y - 22 }px;width:44px;height:44px;border-radius:50%;` +
          `border:2px solid rgba(255,255,255,${ touch ? '.9' : '.75' });pointer-events:none;z-index:2147483646`
        document.documentElement.appendChild(ring)
        ring.animate([{ transform: 'scale(.3)', opacity: 1 }, { transform: 'scale(1.5)', opacity: 0 }],
          { duration: 450, easing: 'ease-out' }).finished.then(() => ring.remove())
      }, { x, y, touch: mode === 'touch' })
      await page.waitForTimeout(170)
      await locator.click()
      await page.waitForTimeout(options.after ?? 200)
    },
  }

  return api
}
