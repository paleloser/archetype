---
name: screenshots
description: Produce visual assets built around a specific feature or flow — a component still, an annotated crop, a step sequence, a screen recording — by driving the local webapp as an agent. Takes a brief ("showcase the new progress bar", "supporting assets for the docs page of X", "a video showing customers how to Y"), works out what to shoot, shoots it, reviews its own takes, and places the keepers wherever you say. Runs manually.
argument-hint: "<brief: what to showcase, and what it's for>"
---

Turn a brief into visual content **about a feature**, not a generic page shot. Brief: `$ARGUMENTS`.

## What this is

You drive a real browser against a local `webapp` yourself, with
[`playwright-cli`](../../../webapp/node_modules/playwright-core/lib/tools/skills/playwright-cli/SKILL.md)
(already installed — `npx playwright cli <command>` from `webapp/`). There is no fixed list of
views and no capture script: what gets shot is decided per brief, and the unit is the feature —
the new component, the new flow, the new page — not the screen it happens to live on.

A brief arrives in prose and can point anywhere: at a release ("screenshots showcasing this
release's features" — the draft entry the `release-notes` skill maintains), at one change
("showcase the new progress bar"), at a purpose ("supporting assets for the docs page of bulk
invitations", "a video showing customers how to import their contacts"). Your first job is to turn it
into a shot list; your last is to put the keepers somewhere useful.

Read `PRODUCT.md` (audiences, locales) and this skill's [learnings.md](learnings.md) first.
How to start *this* product, check its demo data and log in lives in
[`project.env`](project.env): if it still has the archetype's defaults or empty values that this
run needs, confirm them with the maintainer once and write them back (Learning protocol,
`.claude/README.md`).

Two references carry the mechanics, so this file stays about judgement:

- [`references/driving-the-app.md`](references/driving-the-app.md) — prerequisites, the page
  hygiene every capture must apply, and the `playwright-cli` recipes for each medium.
- [`references/placement.md`](references/placement.md) — where assets go per destination, and
  how they get embedded.

## 1. Resolve the brief

Pin down four things. Ask about whatever the brief leaves open — in one message, not four:

- **Subject.** Which feature, flow or page. A release brief means several subjects: the entry's
  `changes:` frontmatter marks them `illustrate: true`, and that's the list — shoot those, not
  every bullet. If nothing is marked (an older entry, or a brief that didn't come from
  `/release-notes`), ask which ones are worth illustrating rather than shooting all of them.
- **Audience.** Which of `PRODUCT.md`'s audiences. They may see different UI, and a flow shown
  to the wrong one is wasted work.
- **Medium.** Usually yours to choose (see [3](#3-choose-the-medium)) — unless the brief already
  says "a video", in which case take it.
- **Destination.** **Always confirm this explicitly, never assume it.** Docs page, release-notes
  entry, social/marketing, a deck, or just "put them somewhere and tell me where". It decides
  locale, theme, aspect and whether anything gets committed at all.

## 2. Understand the feature before opening a browser

Shooting blind is how you end up with a picture of the wrong card.

**Start `scripts/setup.sh` in the background before you read anything** (see
[5](#5-shoot) for what it does). The backend takes a couple of minutes to come up and this step
doesn't need it — run them at the same time rather than one after the other.

- **From a release brief:** read the current draft entry under `web/content/blog/<source locale>/` (the one
  `release-notes` keeps, per its "Drafts and releases" section). Its `changes:` frontmatter is
  the feature list — the `illustrate: true` ones are your subjects — and the `##` section each
  one belongs to is the angle: shoot the thing that paragraph is about, and nothing wider than
  it. Blog assets are always rung 1, and small; see
  [`references/placement.md`](references/placement.md).
- **From a PR:** `$GH GET repos/$REPO/pulls/<n>` and `.../files` for what changed and where (REST
  helper, see `.claude/README.md` → GitHub access).
- **Either way:** go from changed files to the UI (with `codegraph_explore` when available,
  otherwise `grep`) — the component, and then the route(s) that render it. That's the step that
  turns "the progress feature" into "`/projects/<id>`, the progress bar inside `ProjectCard`".
  Read the component's dictionary (`*.i18n.ts`) too: it tells you the exact strings to look for
  on the page in each locale.
- **Pick the seeded record that shows the feature at its most interesting** — a record with
  history rather than a fresh one, a list with several items rather than none (`SEED_DOCS` in
  `project.env` says where the demo data is described). Never add seed rows to make a shot work; if no
  seeded record shows the feature, say so — that's a gap in the demo data worth reporting, and
  usually a sign the screenshot would have been unconvincing anyway.
- **If the feature isn't visible in the UI at all** (a server-side change, a background job),
  stop and say so instead of shooting a page that looks identical before and after.

## 3. Choose the medium

Pick the **smallest rung that carries the change**. Escalate only when the smaller one genuinely
doesn't show it — a recording of something that is one static badge is worse, not better.

1. **Component still.** The component alone over a transparent background — no page, no
   neighbours, not even its label when the text it's published with already names it. The
   default: a new badge, field, card, dropdown, modal, empty state, or a restyled component. Keep
   only the parts that show the feature: for a picker, the selection and its open menu.
2. **Annotated still.** The component in its page context with a highlight or callout on the new
   part — when *where it lives* matters as much as what it is.
3. **Sequence.** Two to four stills that read in order: before/after, or step 1–2–3. For a flow
   whose value survives being frozen, and for docs, which read better with stills than with a
   video the reader has to scrub.
4. **Recording** (`.webm`). Only when the value *is* the motion: a multi-screen flow, a
   drag-and-drop, something that updates live, or a "show me how to do X" brief. Keep it under
   ~30 seconds, with chapter cards naming the steps.

A new *page* is still usually rung 1 or 2 at the page level — the whole page is the component.

## 4. Write the shot list

Before shooting anything, put the plan in chat as a short table: asset name, subject, route,
target element, medium, annotation, locale/theme/viewport. Don't wait for approval: it's a
record of what you're about to shoot, so the human can interrupt if they see something wrong,
and a check for you that every asset serves the brief. Keep the list short — three good assets beat
twelve mediocre ones.

## 5. Shoot

Five scripts do the repetitive parts — read
[`references/driving-the-app.md`](references/driving-the-app.md) for their options, and fix them
in place rather than writing your own variants in the working tree:

```sh
scripts/setup.sh --locale es --theme light   # prerequisites, in order; started in step 2
scripts/nav.sh <url> --expect '<visible string>'          # before every capture
scripts/shot.sh isolate|element|range|page ... <out>.png  # the capture itself
scripts/record.sh <recording>.js                          # a recording, with the cursor
scripts/teardown.sh                                       # last, always: see 8
```

`setup.sh` starts the `webapp` **and** the backend (with `BACKEND_ENV` applied, which must switch
outgoing notifications off — demo contact details are fictional and must stay unreachable),
verifies the demo data, and loads the saved session. Two things stay human:

- **Seeding.** It may write to real third-party services (the identity provider, for one). If
  the data isn't there, point at `SEED_DOCS` and stop; never run it yourself.
- **Login.** A hosted login page (Auth0's, or any identity provider's) can't be scripted. When there's no session, **open the
  browser yourself and hand it over**: tell the human a window is waiting for them to log in, and
  save the session once they confirm. Don't ask them to run commands you can run.

**If a prerequisite can't be met, say so and stop. Never fake, mock or substitute an asset, and
never report one as captured when it wasn't.**

Shoot into the output directory, naming files `<asset>-<locale>-<theme>-<viewport>.png` (or
`.webm`). Work route by route rather than asset by asset — every first visit to a route costs a
dev-server compile — and keep an eye on the wall clock: "Keeping a run short" in the reference is
the list of things that made an earlier run take fifteen minutes.

## 6. Review your own takes

Read each asset back — you can view PNGs — and hold it to this bar. **Re-shoot before showing
anything to the human.** A first take is rarely the keeper.

- Someone who has never seen the feature can point at the new thing without being told.
- Destination-matched: the locale of the page it's going on, a viewport that matches where it's
  embedded, and for `web` stills a light *and* a dark take with identical framing (the docs
  site follows the reader's theme, see [`references/placement.md`](references/placement.md)).
- No dev artifacts: no Next.js dev indicator, no stray onboarding checklist, no half-faded
  tooltip, no leftover focus ring, no hover state on something the reader isn't hovering.
- No empty states, no untranslated string, no `N/A`/`N/D` where the content is the point.
- A crop has breathing room — the element plus a little padding, not a hairline cut. (Isolated
  components are the exception: they're cut edge to edge for the docs frame.)
- A component still shows the component and nothing else: transparent around it, no stray
  label, helper text or neighbour at the edges, and its own surface intact (contents floating over
  nothing means the wrong element was kept). No focus ring on an option nobody tabbed to.
- **A crop that fills much of the screen shouldn't have been a crop.** Past roughly half of the
  viewport, shoot the whole thing: shaving the edges off a page doesn't make it a component still,
  it just makes it a page screenshot that looks badly framed. `shot.sh` promotes those
  automatically and says so; when it does, check the result reads as a deliberate page shot.
  A page shot is the page's content only: no browser window, tab strip or address bar around it.
- Sharp: captured at 2× device pixels (`shot.sh` enforces it). A soft-looking asset means the
  browser wasn't opened by `setup.sh`, not that it needs sharpening.
- Nothing that looks like real personal data. The seeds are fictional; confirm it anyway.
- Recordings: page settled before each action, no dead air at the ends, no cursor wandering, no
  visible mistake-and-retry. Screens are reached by clicking through the UI with the cursor,
  not by jump cuts.

## 7. Pick and place

Pick the keepers yourself, one take per asset, against the bar in
[6](#6-review-your-own-takes). Don't ask the human to choose. Then place them per
[`references/placement.md`](references/placement.md).

**An asset is only placed when the file and the page referencing it are committed together.**
Never reference a path that isn't in the repo — a docs page pointing at an uncommitted capture is
a broken image on a live site. For destinations outside the repo, commit nothing and report the absolute
output paths instead.

## 8. Tear down

Run `scripts/teardown.sh` (from `webapp/`) as the last command of **every** run — finished,
abandoned, or stopped on a missing prerequisite. It stops exactly what `setup.sh` started (the
webapp, the backend, the Postgres container, the browser) and nothing the human already had
running. Report what it stopped. Never stop those by hand or by port: a server you didn't start
isn't yours to kill.

## Definition of done

- Every kept asset is either committed alongside its consumer, or reported as an absolute
  output path for an out-of-repo destination. No dangling references either way.
- Each one was read back and held to the bar in [6](#6-review-your-own-takes) — verified, not
  assumed.
- `npm run lint && npm run build` pass in `web` if `web` was touched.
- Nothing was claimed that wasn't captured: a missing prerequisite is reported as a blocker, not
  worked around.
- `scripts/teardown.sh` ran: nothing `setup.sh` started is left running in the background.
