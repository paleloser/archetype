---
name: release-notes
description: Turn merged PRs from a commit range into a short, magazine-style release article, illustrated with component stills from /screenshots and published in every locale as a blog entry on the public site (web). Foundation for /docs-sync, the CM agent and /screenshots, which all read its output instead of re-deriving what shipped. Runs manually.
argument-hint: "[since=<ref>] [until=<ref>]"
---

Turn the pull requests merged into the trunk branch in a range into a short article the
product's audiences would actually want to read — a page of a magazine, not a `CHANGELOG.md` —
and publish it to the `web` blog in every locale. Arguments: `$ARGUMENTS`.

Read `PRODUCT.md` (audiences, locales, repository branches, brand casing) and this skill's
[learnings.md](learnings.md) first. Below, **trunk** and **release branch** are the ones
`PRODUCT.md` names (`develop` and `main` by default), and **locales** are its source locale
followed by the others.

## What this produces

One file per locale, at `web/content/blog/<locale>/<slug>.mdx`, plus — for the two or three
changes that earn one — small inline visuals captured by
[`/screenshots`](../screenshots/SKILL.md) (see [Visuals](#visuals)). The blog index lists
entries by their `date` on its own: there is no index or navigation file to update.

Each file is two things at once, and both matter:

- **For people:** a short article, three to five hundred words, with a headline per
  featured change and a roundup at the end. Prose, not a bullet dump.
- **For agents:** the structured frontmatter (see
  [Structured frontmatter](#structured-frontmatter)) — that, not a separate JSON file,
  is what downstream skills read: `/docs-sync` to find what needs documenting, the
  Community Manager agent for what shipped, and `/screenshots` to know which features
  are worth illustrating. Every change is in there, including the ones the prose folds
  into a single line, so nothing is lost by the article being short.

The raw markdown of any `web` page is already served as-is (under `/raw/`), so an `.mdx` file
is enough for a coding agent to consume without a JSON export. If a downstream skill needs the
underlying PRs, it can re-query them (see [2. Gather merged PRs](#2-gather-merged-prs))
against the same range recorded in the frontmatter (see [Never reference GitHub](#never-reference-github) for why they aren't
in it directly).

## Drafts and releases

The release branch only ever holds *released* notes, so once an entry reaches it it's
permanent and this skill never touches it again. The trunk (and any branch cut from it)
holds at most one *draft* entry at a time: the accumulating notes for whatever hasn't been released yet. Running this skill
with no `since=`/`until=` never creates a second, competing entry for
still-in-development work — it keeps extending and overwriting that one draft, so
there is only ever one "what's coming" entry to read, not several overlapping ones. A
draft becomes a release, and a new one can start, the normal way: by the trunk (with
the draft in it) being merged into the release branch through the project's own release
process —
this skill doesn't drive that, it only checks where things stand each time it runs.

Explicit `since=`/`until=` (backfills, tests) bypass all of this and always produce a
plain, new, one-off entry — see [1. Determine the range and mode](#1-determine-the-range-and-mode).

## Conventions

**Voice.** This is an article for the product's audiences, not a `CHANGELOG.md`. Write
like you're genuinely excited to tell a customer about it: lead with the benefit
("Never lose a customer's before-and-after photos again" beats "Added attachment
support"), keep sentences short, use "you", and don't be afraid of an exclamation mark,
a light emoji, or a small aside when it earns its place. If a sentence reads like a PR
title, rewrite it. Say what changed *for the reader*, and say it once — no recap
paragraph at the end.

**Shape.** One lede, a handful of featured stories, one roundup. Nothing else:

1. **Lede** — two or three sentences under the heading picture, giving the release an
   angle: what this batch of work is *about* ("this one's all about first impressions").
   Not a table of contents, and never "here's what's new".
2. **Featured stories** — **two to four**, no more, each a `##` heading and one short
   paragraph (two to four sentences), ordered by how much a reader will care rather
   than by category. The heading is a claim in the reader's words ("Invite your whole
   client list in one go"), not a noun phrase ("Bulk invitations") and not a category
   name. Some of these carry a visual — see [Visuals](#visuals).
3. **Also in this update** — everything else, as terse one-line bullets: the smaller
   improvements, the fixes, the renamed button, the changed default. Prefix each with
   its kind in bold where it isn't obvious (**Fixed** — ...). Six bullets is plenty; if
   there are more, the least interesting ones stay in the frontmatter only.

Nothing gets its own section for being new, and nothing is promoted to a featured story
just to fill the quota: a release with one genuinely interesting change is one featured
story and a roundup. Omit the roundup entirely when there's nothing small to report, and
never write "no fixes this week" — this is user-facing copy, not an internal digest.

**Length.** Under ~500 words of prose per locale, and it should read in under a minute.
If it's longer, the cut is almost always a featured story that should have been a
roundup bullet.

**Categories live in the frontmatter, not in the prose.** Every change still carries a
`type` of `new`, `improved`, `fixed` or `misc` in `changes:` — that's what agents read —
but the article never groups by it. A featured story and a roundup bullet are both just
changes; which one a change gets is an editorial call about how interesting it is, not a
function of its `type`.

**Excluded.** Never turn these into an entry, however they're labelled:
- Dependency/Renovate PRs (title starts with `Update dependency`, `Bump `, or is
  prefixed `[<app>](renovate)`).
- CI, deploy-only, or build-tooling changes with no product-visible effect.
- Docs-only PRs (`[docs]`), refactors, and agent tooling under `.claude/`.
- A change that is technical even when it touches user-facing code, e.g. a UI library
  migration with no visible difference, or an API URL change.

A PR can mix an excluded change with a real one (e.g. a feature PR that also bumps a
dependency) — extract only the user-facing part.

**Reverts and short-lived features.** Before writing anything, scan every included
PR's title and body for "Revert" and for `Closes #<n>` / `Fixes #<n>` references to
another PR in the same range. If a PR reverts or removes something another PR added —
whether that PR is in this run's incremental range or already sitting in the draft
you're extending — drop *both* from the merged entry: from the reader's perspective
neither ever shipped. Don't mention the revert either.

**Language.** Use the terms in [`GLOSSARY.md`](../../../GLOSSARY.md), never implementation
names (entities, endpoints, table names). In every locale, don't translate from scratch: use
[`terminology.md`](../docs-sync/references/terminology.md), and grep
`web/content/docs/<locale>` for how a term is already used there, and stay consistent with it.
Write the brand name as `PRODUCT.md` says.

**Never reference GitHub.** The product's source may live in a private repository, but this
entry is published on the public site — including its raw markdown, which `web`
already serves for every page. Never link or point to a GitHub issue, PR, commit, or
username anywhere in the entry, in either locale, or in its frontmatter: no `(#1234)`,
no `github.com/...` links, no "thanks @handle". Internally, while drafting, it's fine
to keep track of which PR each bullet came from (you'll want it for step 3); it just
never makes it into the files you publish.

**Only ever edit the current draft.** A released entry (one that has reached the release branch,
per [Drafts and releases](#drafts-and-releases)) is permanent — never rewrite one, even
to fix a typo. The one entry that hasn't reached the release branch yet is the single exception:
that's the draft, and overwriting *it* in place, run after run, is the whole point.

**Do not include emojis in the title**, or in the `##` headings of the featured
stories. In the prose itself, one or two across the whole entry, where they earn it.

**Include the generation date on the title.**

## Visuals

Two different things, don't mix them up:

- **The heading picture** — one per entry, a photo from `web/public/images`, set as the
  entry's `image` frontmatter and rendered under the title. See
  [4. Write every locale](#4-write-every-locale).
- **Inline visuals** — at most **one per featured story, two or three per entry**, and
  only where seeing the thing is better than reading about it. They're captured by
  [`/screenshots`](../screenshots/SKILL.md) in
  [step 7](#7-illustrate-the-featured-stories), after the copy is written and published,
  never before.

An inline visual here is **a detail, not a screen**: the new item in the account
dropdown, the attachments row on a service, the wear badge — a component still shot with
`shot.sh isolate`, cut edge to edge over a transparent background. A screen-sized
screenshot has no place in a piece this short; it buries the copy and takes the reader
out of the article. If the thing worth showing can't be framed as one component, that
change doesn't get a visual — write the sentence and move on.

Which ones earn it:

- **Yes:** a new control the reader has to find (a new menu item, a new tab), a new
  component with a shape of its own (an upload preview, an attachments list), a visible
  restyle of something they use daily.
- **No:** anything server-side or invisible, anything in the roundup (roundup bullets
  never carry a visual), a flow that needs three frames to make sense — that's a docs
  page, and `/docs-sync` will get to it — and anything whose picture would just be "a
  page, with a small difference somewhere".

Not every entry ends up with one, and an entry with zero visuals is a perfectly good
entry. Two well-chosen ones beat five.

## 1. Determine the range and mode

If `$ARGUMENTS` contains `since=<ref>` and/or `until=<ref>` (a git SHA, a tag, or an
`YYYY-MM-DD` date), use them as given — `until` defaults to the tip of the trunk
(`git rev-parse origin/<trunk>`) — and skip to
[2. Gather merged PRs](#2-gather-merged-prs). This always makes a new, standalone
entry; it never reads or overwrites a draft.

Otherwise, work out whether you're continuing a draft or starting fresh:

1. Find the latest entry under `web/content/blog/<source locale>/*.mdx` (by frontmatter
   `date`) **on the branch you're working from** — this repo's convention is to branch off
   the trunk for any change, so that's effectively the trunk's content. Call its slug
   `draft-slug`, if one exists.
2. Check whether that same slug is already released:
   ```sh
   git show origin/<release branch>:web/content/blog/<source locale>/<draft-slug>.mdx >/dev/null 2>&1
   ```
   `git show` exits **zero when the file exists on the release branch** — i.e. when it has already
   been released. So:

   - **Exits zero:** `draft-slug` is **released** and permanent. Nothing is in
     development. Start a **new entry**. `since` = that released entry's `until` (read
     the same way from the release branch), or — if it has no entry at all — this is the
     very first release: "everything since the last preexisting release", i.e. since
     the repository's first commit. That can be far too many PRs to triage responsibly in
     one pass. **Don't guess a start.** Stop and ask the maintainer for an explicit
     `since=` instead — a date, a tag, or confirmation that they really do want the
     whole history in one entry (it can always be split into several afterwards).
     `until` defaults to the trunk's tip as above.
   - **Exits non-zero:** `draft-slug` isn't on the release branch, so it's still a draft. You're
     **continuing it**. (No `draft-slug` at all means no blog entries exist yet: start a
     new entry, as above.) Read its frontmatter and prose in full. This run's
     incremental range is
     `since` = that draft's own `until`, `until` = the trunk's tip. Keep the
     draft's original `since` and `slug` — those don't change until the draft is
     actually released; only `until`, `date`, and the merged content do.

## 2. Gather merged PRs

With the REST helper (the `gh` CLI isn't available in cloud sessions; see
`.claude/README.md` → GitHub access):

```sh
GH=.claude/skills/pm-scan/scripts/gh-rest.sh
REPO=$(git remote get-url origin | sed -E 's#^.*github\.com[:/]##; s#\.git$##')
$GH GET "search/issues?q=repo:$REPO+is:pr+is:merged+base:<trunk>+merged:<since-date>..<until-date>&per_page=100" \
  | jq -c '.items[] | {number, title, body, labels: [.labels[].name], merged_at: .pull_request.merged_at, url: .html_url}'
```

Page with `&page=2`, `3`... while a page returns 100 items.

Sort ascending by `mergedAt`. Read each PR's labels and title prefix (`[server]`,
`[webapp]`, `[web]`...) to record which apps it touched — labels say *where*, never *whether* or
*how* to categorize; that's decided by reading the title and body against the
Conventions above.

## 3. Classify, then pick the running order

For every included PR, write one change: a `type`, and a one-line summary in glossary
terms. This list is the frontmatter, and it's complete — everything user-facing that
shipped is in it, however small. Keep the PR number(s) next to each line as you work —
you'll need them to apply the revert rule below and to fill in `apps` — but they're
scaffolding, not something that ends up in the published files (see Never reference
GitHub).

Merge PRs that are really one user-facing change split across commits (e.g. a webapp
PR and the server PR it depends on) into a single change, rather than writing
near-duplicate lines.

**If you're continuing a draft** (per step 1), this new batch joins the draft's existing
changes into one combined list before the next step — don't just append a second round
of sections underneath the old ones, the published entry should still read as one
coherent piece covering the whole `since`–`until` span. A change that was a featured
story last run can become a roundup bullet this run if something better arrived; that's
a re-edit of the whole article, not an append.

Then apply the revert rule from Conventions to the full combined list (new changes and,
when continuing a draft, its existing ones together).

Now make the two editorial calls the article depends on, before writing a word of prose:

- **Which two to four changes are the featured stories**, and in what order. Ask what one
  customer would tell another customer about. A tiny fix that removes daily
  friction can outrank a big feature most readers won't touch.
- **Which of those deserve an inline visual**, per [Visuals](#visuals) — and, for each,
  the one component you'd point at. Note it down; it becomes the brief in
  [step 7](#7-illustrate-the-featured-stories) and an `illustrate: true` marker in the
  frontmatter.

## 4. Write every locale

The source locale (`PRODUCT.md`) is the source. Write a short, inviting title and one-line description for the
entry (what shipped, not "release notes for..."), a heading picture (see below), then
the lede, the featured stories and the roundup, in the Shape and Voice from Conventions.
The prose covers the full combined list from step 3 — the whole `since`–`until` span,
not just what's new in this run — but it covers it at the right altitude: featured
stories get a paragraph, everything else gets a roundup line or, if it's too small even
for that, lives only in `changes:`.

Translate the whole entry into every other locale as a human editor would, not
word-for-word, matching the same warm Voice, using [`templates/entry.mdx`](templates/entry.mdx)
as the starting structure and the terms already established in `web/content/docs/<locale>`.

**Heading picture.** Every entry opens with a photo, rendered by the blog page right under the
title from the `image` frontmatter (a path under `web/public/images`). Pick the one that fits the
entry's mood; same picture in every locale. If `web/public/images` has no suitable photo yet,
ask the maintainer once which pictures to use (Learning protocol), and record the answer in
[learnings.md](learnings.md); until then, leave `image` out rather than inventing one. When
continuing a draft, keep its existing picture unless the merged content now fits another one
better.

## Structured frontmatter

Every locale file carries this frontmatter, validated by `web/lib/source.ts` (a build fails
on a missing or mistyped field). It's the agent-readable half of the entry: the
`changes` list is **complete** even where the prose is selective, so a downstream skill
never has to re-derive what shipped from the article's editing decisions.

```yaml
---
title: '<short, inviting title, e.g. "Say hello to bulk invitations">'
description: '<one line, used as the page/link description>'
date: <YYYY-MM-DD>           # last time this entry was written or updated, i.e. today
image: /images/<photo>       # optional — the heading picture
since: <ref — fixed for a draft's whole lifetime, only set once, at creation>
until: <ref used for this run>
changes:
  - type: new | improved | fixed | misc
    summary: '<one line, glossary terms, no GitHub references>'
    apps: [server, webapp, web, deploy]
    featured: true           # optional — it has its own section in the article
    illustrate: true         # optional — worth an inline visual, per Visuals
---
```

`featured` marks the two to four changes with a `##` section of their own; everything
else is a roundup bullet or frontmatter-only. `illustrate` marks the ones
[`/screenshots`](../screenshots/SKILL.md) should shoot, and stays `true` once the asset
is placed — it records the judgement, not the to-do. Only a `featured` change can be
`illustrate`d.

See [`templates/entry.mdx`](templates/entry.mdx).

## 5. Publish

- Slug: `<since-date>-<kebab-case-title-words>`, same slug in every locale, decided
  once when an entry is first created and never renamed afterwards — see
  [Drafts and releases](#drafts-and-releases) for why a draft's slug must stay put
  across runs (`until` moves, `since` and the slug don't).
- **New entry:** write `web/content/blog/<locale>/<slug>.mdx` for every locale.
- **Continuing a draft:** overwrite the same files in place (same slug).
- Either way, nothing else needs registering: the blog index (`/<locale>/blog`) lists every
  entry by `date`, and the sitemap picks it up.

## 6. Validate the copy

Run `npm run lint && npm run build` from `web/`. Fix anything that fails — an invalid
frontmatter fails the build. Commit the entry at this
point: the article stands on its own, and the visuals land on top of a version that
already builds.

## 7. Illustrate the featured stories

If step 3 marked nothing `illustrate: true`, you're done — say so and stop.

Otherwise hand the marked changes to [`/screenshots`](../screenshots/SKILL.md) and
**run it — this step is part of the skill, not an offer to make afterwards.** An entry
that stops here is unfinished: the markers are a decision you already took in step 3,
and leaving them unshot means someone has to come back and finish your work.

The run drives a real browser against a local `webapp` and takes a few minutes. That's
expected, not a reason to check in first. There is exactly one thing worth stopping for:
Auth0's Universal Login can't be scripted, so if there's no saved session, `/screenshots`
opens a window and hands it over — tell the human it's waiting for them and carry on
once they've logged in. Any other missing prerequisite is reported and the entry ships
with the copy it already has.

Give it one brief covering all the marked changes at once, and be specific enough that
it doesn't have to come back with questions — it resolves subject, audience, medium and
destination up front:

> Inline visuals for the current draft release-notes entry, `<slug>`. Two subjects:
> (1) `<change summary>` — the `<component>` in `<where the reader finds it>`;
> (2) `<change summary>` — `<component>`. Audience: `<one of PRODUCT.md's audiences>` for each.
> Medium: isolated component stills only, no page shots, no sequences, no recordings —
> these sit inline in a short article, so each one is a detail, not a screen. Every
> locale (the copy around them is translated) and both themes. Destination: the
> release-notes blog entry, placed next to the story it illustrates in every locale
> file and committed with them.

Then let it do its job. Two rules from
[its placement reference](../screenshots/references/placement.md) are yours to respect
from this side too:

- **The copy doesn't bend to the assets.** If a shot comes back showing something the
  paragraph doesn't quite say, the fix is a one-line edit to *this draft's* prose — and
  only while it is still a draft. A released entry is never touched, not even to fit a
  better picture.
- **If an asset can't be captured** — the feature isn't visible, the seeds don't show it
  well, a prerequisite is missing — the entry ships without it. Never substitute a page
  screenshot for the component still you asked for, and never describe a visual that
  isn't there.

Re-run `npm run lint && npm run build` from `web/` once the assets are placed.

## Definition of done

- Every locale's file exists, builds cleanly, and is reachable from `/<locale>/blog`.
- Exactly one draft entry per locale exists for whatever the release branch hasn't released yet —
  running the skill again didn't create a second one.
- Each carries the same heading picture from `web/public/images`, unless none is available yet.
- The article reads as an article: a lede, two to four featured stories with their own
  headlines, an optional roundup, under ~500 words. No category headings, no wall of
  bullets, nothing that reads like a PR title.
- `changes:` lists **every** user-facing change in the range, including the ones the
  prose folded into a roundup line or left out entirely.
- Every `illustrate: true` change either carries its asset or has a stated reason why it
  couldn't be captured. "I offered to shoot them" is not a reason.
- Inline visuals, if any, are isolated component stills sitting next to the story they
  illustrate in every locale, in both themes, with their files committed alongside the
  entry — no reference to an asset that isn't in the repo.
- No GitHub issue, PR, commit, or username appears anywhere in either file.
- No reverted-and-removed feature is mentioned.
- `npm run lint && npm run build` pass in `web`.
