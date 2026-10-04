# Driving the app

Mechanics for the [`screenshots`](../SKILL.md) skill: what has to be running, what every capture
must do to the page before shooting it, and the recipes per medium.

Five scripts in [`../scripts/`](../scripts) carry the parts that are the same every run — don't
reinvent them per session, and fix them in place when they're wrong:

| Script | What it does |
| --- | --- |
| `setup.sh` | Every prerequisite below, in order, including starting the webapp and the backend. |
| `nav.sh <url>` | One navigation, left in a shootable state. Before **every** capture. |
| `shot.sh` | The capture itself: `isolate`, `element`, `range` or `page`, with padding. |
| `record.sh <script.js>` | Runs a screen recording with the simulated cursor (`recording.js`). |
| `teardown.sh` | Stops what `setup.sh` started, and only that. Last command of every run. |

Run them from the webapp directory. Everything underneath is `playwright-cli`, installed with `webapp`'s
`@playwright/test` dependency (`npx playwright cli <command>`); its own reference is at
`webapp/node_modules/playwright-core/lib/tools/skills/playwright-cli/SKILL.md`, with deeper notes
under `.../playwright-cli/references/` (`video-recording.md` and `storage-state.md` especially).
Read it rather than guessing flags — for anything the scripts don't cover, like recordings.

## Prerequisites

`scripts/setup.sh [--locale <locale>] [--theme light|dark]` does every check below, as configured
in [`../project.env`](../project.env), and leaves the browser open on a blank app page. It is the
first command of a shooting run. Start it **before** step 2 of the skill, not after: the backend
can take a minute or two to boot, and that is time you can spend reading the feature's code instead
of watching a log.

Each check is cheap to make and expensive to discover halfway through a shot list, so `setup.sh`
stops on the first failure. When it stops, stop with it — an asset captured against an unseeded
database or a logged-out app is worse than no asset.

### 1. Chromium

`npx playwright install chromium`, once per machine. Harmless to re-run. In Claude Code cloud
sessions Chromium is preinstalled.

### 2. A running `webapp` and backend

**Both are yours to start**, in the background, and yours to stop at the end of the run.
`setup.sh` records each one it launches (its process group, and the compose services if it had to
bring them up) in `.screenshots/.started`, and `teardown.sh` stops exactly those — including the
children. Anything already running when `setup.sh` probed is the human's and isn't recorded, so it
survives the teardown. Probes: `WEBAPP_URL` and `BACKEND_URL`; anything but `000` means up (a
logged-out webapp redirects, and an unauthenticated API answers 401: both are signs of life).

**`BACKEND_ENV` is the part that matters.** It must switch off every outgoing notification
(email, SMS, messaging): demo data carries fictional contact details, and a backend started with
the real providers wired up would try to deliver to them. If a product's backend can notify anyone,
never start it without that environment. If a backend is already running, `setup.sh` leaves it
alone and assumes the human knows what they started it with.

### 3. Demo data — verify, don't assume

The records you'll be shooting come from the product's demo data. Without them the app is a wall
of empty states. `SEED_CHECK` is a command that prints how many demo records exist; if it prints
`0`, point the human at `SEED_DOCS` and stop. Seeding may write to real third-party services (the
identity provider holding users' names, for one), so it's a deliberate act for a human to
perform, never something to trigger unattended.

Data that lives outside the database (names in the identity provider, files in storage) has no
equally cheap probe, so verify it visually on the first page you open: if records appear with
blank or placeholder fields, report that — every shot would carry the same hole.

### 4. A logged-in session

Hosted login pages are third-party and can't be scripted, so a human logs in once and the session
is reused after that. It's kept **outside the repository**, at `SESSION_FILE` — it's a credential,
and nothing that can be committed by accident should be inside a working tree.

If the file is missing or the app bounces to the login page during a run, **open the browser and
hand it over**: don't attempt the login, and don't ask the human to run the commands themselves.

```sh
npx playwright cli open "$WEBAPP_URL"
```

Then tell them, plainly, that a browser window is open and you need them to complete the login,
and to say so when they land back on the webapp. Once they confirm:

```sh
mkdir -p "$(dirname "$SESSION_FILE")"
npx playwright cli state-save "$SESSION_FILE"
chmod 600 "$SESSION_FILE"
```

Every later run starts from `npx playwright cli state-load "$SESSION_FILE"` (`setup.sh` does it).

## Where captures go

`<output-dir>` throughout this file is `<repo root>/.screenshots/<feature-slug>/`, created on
demand — unless the brief named somewhere else, in which case use that. It's a scratch area:
shoot freely, re-shoot freely, nothing in it is precious, and the rejected takes stay there.

Both that directory and `.playwright-cli/` — the CLI's own console logs, network logs and browser
profile, written in whatever directory it runs from — are gitignored at the repo root. They are
untracked scratch and must stay that way: never `git add` them, and don't try to redirect the
CLI's. Assets enter the repository only through [`placement.md`](placement.md), copied
deliberately to a path a page references. `.playwright-cli/` is also where the CLI's error output
points when a navigation misbehaves, so it's worth reading rather than just tolerating.

## Page hygiene

`setup.sh` covers the session-level half (viewport, locale, theme, `EXTRA_LOCAL_STORAGE`), and
`nav.sh` covers the per-page half. The per-page half has to be re-applied after **every**
navigation — an injected style tag and a blurred element don't survive one. Both are listed here
because each item is a defect that shipped in an earlier capture, not polish.

```sh
scripts/nav.sh http://localhost:3000/<route> --expect '<a string only that page shows>'
```

- **The dev indicator.** These run against a dev server, which plants its devtools bubble in a
  corner. It's hidden with a style rule rather than removed, because it mounts late.
- **Settling.** `nav.sh` waits for network idle and, with `--expect`, for a string that only
  appears once the page has really rendered *in the current locale*. Pass it. The dev server
  compiles a route on first visit and a shot taken in that window catches a skeleton — which is
  also why an apparently missing translation is usually just compile lag, not a bug. Re-check
  before reporting one.
- **The logged-in account is real.** The saved session may belong to the maintainer's own
  account, so its email shows wherever contact details do, and its avatar may sit in the header.
  Keep those out of frame: pick another route, or hide them with an injected style
  (`header .avatar { visibility: hidden }`). Hiding it is hygiene, like
  the dev indicator; it doesn't fake the feature.
- **Focus and hover.** `nav.sh` blurs the active element and parks the pointer in the corner. If
  you click something before shooting, do it again by hand — a leftover focus ring reads as
  "someone was clicking here".

Locale and theme must be set before the app's first paint: next-themes reads `theme` from
localStorage pre-paint, and the locale comes from the `LOCALE_COOKIE` cookie (see
`webapp/lib/i18n/config.ts`). To switch locale mid-run, re-set the cookie and navigate again.

Standard viewports: **desktop 1920 × 1080** (16:9), **mobile 414 × 736** (9:16)
(`npx playwright cli resize`), both at **2× device pixels** — a desktop still is 3840 × 2160,
a mobile one 828 × 1472. Both are exact 16:9 / 9:16 so recordings fit social video formats
(Reels, LinkedIn) without cropping or letterboxing.
At 1× every asset looks soft on a HiDPI screen, or wherever the page scales it up. The density
is fixed when the browser context is created, so it comes from `scripts/cli.config.json`, which
`setup.sh` opens the browser with (closing any browser left over from an earlier run first).
`resize` keeps it. `shot.sh` refuses to shoot below 2×: if it complains, re-run `setup.sh` rather
than opening the browser by hand.

## Keeping a run short

A twelve-asset run is about fifteen minutes of wall clock if you let it be. Most of that is
waiting, and most of the waiting is avoidable:

- **Start `setup.sh` first, in the background, and research the feature while it boots.** The
  backend is the long pole; step 2 of the skill is reading, and the two overlap perfectly.
- **Order the shot list by route, not by asset.** Each route costs a dev-server compile on first
  visit and nothing on the second. Shoot every asset for a route — both locales, both viewports —
  before moving on, flipping the locale cookie and re-navigating in place.
- **Don't sleep, wait for something.** `nav.sh --expect '<string on the page>'` returns the moment
  the page is ready instead of after a fixed guess that is either too short or too long.
- **Frame from the accessibility tree, not from trial and error.** `snapshot --boxes` gives you
  every element's box in one call; pick the selectors from it and the first crop is usually the
  keeper. Re-shooting because a crop was 40px short is the other half of the lost time.
- **Batch the multi-step ones.** A capture that needs three clicks and a hover is one `run-code`
  script, not six round trips.

## Recipes

### Component still

Find the element, then shoot the element — never the page cropped afterwards.

```sh
npx playwright cli find "<visible text>"              # locate by visible text; returns refs with context
npx playwright cli snapshot --boxes         # or the full tree, with bounding boxes

scripts/shot.sh isolate '[data-testid="progress-card"]' <output-dir>/progress-en-light-desktop.png
scripts/shot.sh isolate '[data-open] > [data-slot="select-trigger"]' <out>.png \
  --with '[data-slot="select-popover"]'                         # trigger + its open menu
scripts/shot.sh element '[data-testid="progress-card"]' <out>.png   # the element with its page around it
scripts/shot.sh range 'h1' '#last-row' <out>.png                # top of one to bottom of another
scripts/shot.sh page <out>.png                                  # the whole viewport
```

**`isolate` is the default for a component still**: the component and nothing else, over a
transparent background, so the asset carries no page, no neighbours and no labels pulling the
reader's eye — the text it's published next to supplies the context. Everything outside the kept
elements stops painting (page background included) while the kept ones paint exactly as in the
app: own surface, corners, border and shadow. The clip is the union of the kept elements, edge
to edge (no padding: the docs frame hugs it, see [`placement.md`](placement.md); pass `--pad` for
destinations with no frame, where the shadow needs room), and it is never promoted, whatever its
size. The page is restored afterwards.

- **Keep exactly the parts that show the feature, no more.** For a theme picker that's the
  trigger and its open menu — not the `Select` wrapper, which drags its label and helper text
  along. `--with` adds each extra part; overlays (menus, popovers, modals) are portalled away from
  their trigger, so they're always a `--with` of their own.
- **Keep the element that paints the surface**, not a transparent wrapper around it, or the
  contents float over nothing. Check the take: a component without its background is a wrong
  selector, not a style. HeroUI overlays are the usual trap — `[role="dialog"]`
  (`[data-slot="popover-dialog"]`) is the transparent inner box, and `.popover` around it is what
  draws the background, radius and shadow. `shot.sh` warns when a kept element paints nothing and
  an ancestor does, and names the ancestor; treat that warning as a re-shoot, not a note. On a
  light take the missing surface is invisible — white contents over nothing still read fine — so
  it only surfaces in the dark take, after both locales have already been shot.
- **Kept elements show at their own height.** A grid or flex row stretches a card to match its
  tallest neighbour, which in isolation reads as a hole inside the component; `isolate` releases
  that stretch (nothing else moves). A gap that remains belongs to the component itself.
- **Selectors can't match text.** When the only handle is the visible content (the card of one
  particular record), tag it after `nav.sh` with a one-line `run-code`
  (`locator(...).filter({ hasText }).evaluate(el => el.setAttribute('data-shot-target', ''))`) and
  isolate `[data-shot-target]`. The tag goes away with the next navigation.
- **`--hide` is for small things inside a kept surface** (a stray link, a badge that isn't the
  point). A hidden part still takes its space, so hiding a label from a wrapper leaves a gap —
  pick narrower targets instead.
- **Open overlays with a real mouse click** — `npx playwright cli click '[data-shot-target]'` —
  never by keyboard and never with `el.click()` from inside an `eval`. A scripted DOM click leaves
  react-aria in keyboard mode, so it marks the first option `data-focused` and HeroUI draws the
  blue ring a reader takes for a keyboard user; a real pointer click marks nothing. Keep the
  tagging `eval` to tagging, and click as a separate command. Don't press `Escape` to close
  something first either: re-run `nav.sh`.
- `isolate` suppresses focus rings inside the kept subtrees anyway (moving focus off the option is
  not enough — react-aria re-applies the attribute, and removing it by hand takes the trigger's own
  surface with it, so the ring is overridden in CSS). That's a backstop for the state you can't
  avoid, not a licence to open things by keyboard.
- Once an overlay is open, `[data-open]` marks its component and HeroUI's `data-slot`s name the
  parts (`select-trigger`, `select-popover`, …) — stable selectors, no text matching needed.

`element` clips the element plus padding (`--pad`, default 24) — the plain
`playwright cli screenshot <ref>` has no breathing room, and a hairline crop always looks like a
mistake. `range` is for panels whose container box is far taller than the part worth showing:
it clips from the top of the first element to the bottom of the second, across the horizontal
union of both. Selectors can't contain single quotes; use `[attr="value"]` with double ones.

Two behaviours worth knowing before you plan a shot list:

- **A crop that covers more than 50% of the viewport is promoted to a full-viewport shot**
  (`--threshold` to change it, and the script prints which it took). Past that size a crop stops
  reading as a component still and starts reading as a page screenshot with its edges shaved off.
  When you see `promoted-to-viewport`, that's the intended outcome, not a failure — but take it as
  a hint that the *page* is the subject, and frame the rest of that asset accordingly.
- **`element` and `range` keep the page around the target** — its background, its neighbours in
  the padding. Use them when the component should read as part of a screen, which is rare for a
  still about one component; otherwise `isolate`.

### Annotated still

```sh
npx playwright cli highlight e42 --style="outline: 3px solid #e11d48; border-radius: 12px"
npx playwright cli screenshot --filename=...   # page-level, so the callout has context
npx playwright cli highlight --hide
```

Keep annotations to one per asset. Two callouts mean two assets, or the wrong medium.

### Sequence

Same recipe as a still, once per step, named `<asset>-1-<step>`, `<asset>-2-<step>`… so the order
survives the filename. Reset the page state between steps deliberately: a sequence that only
works because of leftover state from the previous shot won't reproduce.

### Recording

Don't drive a recording command by command — the pauses and mistakes end up in the video. Work
the flow out with the CLI first, note the locators, then write the whole thing as one script and
run it once, through `record.sh`:

```sh
scripts/record.sh /tmp/<slug>-video.js
```

**Navigate the way a person would, with the cursor.** `record.sh` hands the script a `cursor`
(from `scripts/recording.js`) as its second argument: a pointer, or a finger dot for the
phone-width cut, drawn inside the page so the screencast captures it. `cursor.click(locator)`
scrolls the target into view if needed, glides to it, presses with a ripple, and then really
clicks it. So the video shows *how* you get from one screen to the next, and every step is a real
interaction, never a staged one. Reach each screen by clicking through the UI (a link, a card's
details button, the bell) rather than `page.goto`, which reads as a jump cut. Keep `goto` for setting
the stage off camera, before `screencast.start`.

```js
async (page, cursor) => {
  await page.setViewportSize({ width: 1920, height: 1080 })
  await cursor.install({ mode: 'pointer' })     // 'touch' for the 608 × 1080 vertical cut
  await page.goto('http://localhost:3000/')      // off camera
  await page.screencast.start({ path: '<output-dir>/<asset>.webm', size: { width: 1920, height: 1080 } })
  await cursor.show()                            // the cursor appears where it last was
  await page.waitForTimeout(1500)
  await cursor.click(page.getByRole('button', { name: '<label>' }))
  await page.getByRole('heading', { name: '<heading>' }).waitFor()
  await cursor.scroll(page.getByText('...'), 'start')   // a smooth scroll, for reading
  await page.screencast.stop()
}
```

`install` also hides the dev indicator and the header avatar on every page load, before first
paint, so no frame shows them. The cursor keeps its position across same-origin navigations.
After a cross-origin hop (the public site into the app) it stays hidden until `cursor.show()` or
the next click puts it back. `cursor.moveTo(x, y)` is there for a gesture that isn't a click.

The rest is `page.screencast` (see the CLI's `references/video-recording.md`):
`screencast.start({ path, size })`, `pressSequentially(text, { delay: 60 })` so typing reads as
human, deliberate `waitForTimeout` pauses so the viewer can follow, and `screencast.stop()`.
For docs, `screencast.showChapter(title, { description, duration })` between steps and
`screencast.showOverlay(html)` for callouts can help; social video uses neither (see below).

Write it to `<output-dir>/<asset>.webm`. Overlays are `pointer-events:
none`, so they never interfere with the interactions underneath.

**`screencast.start`'s `size` must equal the viewport.** It doesn't scale the page: a larger
`size` draws the viewport at 1× in the top-left corner and pads the rest with grey. Record at
the viewport size and scale afterwards with `ffmpeg`, which is installed (the `/cm` skill's
conversion step does this). `.webm` stays the deliverable for docs.

**Social video uses its own viewports**, larger than the standard ones so each frame shows more
of the app and the output has more pixels (a recording is 1 CSS pixel per video pixel, whatever
the browser's density):

- Horizontal 16:9: **1920 × 1080**, native Full HD.
- Vertical 9:16: **608 × 1080**, the largest 9:16 size that still gets the phone layout
  (Tailwind's `sm` breakpoint is 640), scaled up to 1080 × 1920.

Social video is **dark theme** and carries **no on-screen text**: no `showChapter` cards, no
caption overlays. The app tells the story. For a tour that starts on the public site and moves
into the app, route the site's app links to the local webapp, so the flow is one continuous
take: `page.route('<App URL>/**', r => r.fulfill({ status: 302, headers: { location:
r.request().url().replace('<App URL>', 'http://localhost:3000') } }))`, with the App URL from
`PRODUCT.md`.
