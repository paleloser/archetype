---
name: docs-sync
description: Bring the multilingual user docs on the public site (web/content/docs/<locale>) up to date with what shipped. Given a PR, a branch, or the current /release-notes entry, it finds the affected pages, writes the source locale first and translates to the others in the same pass, creates new pages (and meta.json entries) for new user flows, builds, commits and opens a PR. Runs manually.
argument-hint: "pr=<n> | branch=<name> | release-notes[=<slug>]"
---

Update the `web` docs so they describe what the product does now, in every locale at once.
Input: `$ARGUMENTS`.

Read `PRODUCT.md` (locales, app URL, audiences, branches) and this skill's
[learnings.md](learnings.md) first. Below, **source locale** and **trunk** are the ones it names.

Read [`references/terminology.md`](references/terminology.md) before writing a word. It fixes
the vocabulary in each locale and how UI labels are quoted. If it has no rows yet, build them
from `GLOSSARY.md` and the words the docs and the webapp's dictionaries already use, and ask
the maintainer to confirm the ones you had to choose (Learning protocol, `.claude/README.md`).

## What this produces

Edits to `web/content/docs/<locale>/**` for every locale: changed sections, new pages, and
matching `meta.json` entries. They land as commits on a branch with an open PR. Nothing is
proposed for approval first. The human reviews the diff on the PR, so the diff has to be easy
to review: every locale of a change sits in the same commit.

## Conventions

**The source locale is the source.** Write it first, as if no other locale existed, then
translate it into the others. Don't draft in another language and translate backwards: the
maintainer writes and reviews in the source locale, and a translated page reads like one.

**The locales mirror each other.** Every page exists in every locale. Headings, `<Steps>`,
`<Alert>`s, images and links appear in the same order and number. Only the language changes.
Heading anchors differ per locale (`#importaciones-múltiples` vs `#bulk-imports`), so rewrite
in-page and cross-page anchor links for each locale rather than copying them. Prefer relative
file links (`./other-page.mdx`) between docs pages: they resolve per locale on their own.

**Tone follows the section.** Read two or three neighbouring pages in the section you're
editing and match them. Don't import the voice of another section, and don't import the
marketing voice of `/release-notes` either. Docs explain how to do something. They don't sell
it.

**Terminology.** Glossary terms and their fixed Spanish translations come from
[`references/terminology.md`](references/terminology.md). UI labels are quoted verbatim from
the webapp's dictionaries (`*.i18n.ts`, `i18n.ts`) for that locale.

**Page skeleton.** Copy the existing pages: frontmatter `title: '<Title>'` plus a one-line
`description` (the layout renders both: don't repeat the title as a `#` heading), then the imports
the page needs (`Steps` from `fumadocs-ui/components/steps`, `ThemedImage` from
`@/components/ThemedImage`...). `Callout`, `Card` and `Cards` need no import. Deep links into the
app use `PRODUCT.md`'s App URL plus the route.

## 1. Resolve the input and the branch

GitHub is reached through the REST helper (`.claude/README.md` → GitHub access; the `gh` CLI
isn't available in cloud sessions): `GH=.claude/skills/pm-scan/scripts/gh-rest.sh`, `REPO` from
`git remote`.

- **`pr=<n>`**, still open: this is the "docs ship with the feature" path. Check out the PR's
  head branch (`$GH GET repos/$REPO/pulls/<n> | jq -r .head.ref`, then `git fetch` and
  `git checkout` it) and commit the docs there. Don't open a second PR.
- **`pr=<n>`**, already merged, or **`release-notes[=<slug>]`**: the "separate docs PR" path.
  Create `docs-sync-<short-topic>` from an up-to-date trunk.
- **`branch=<name>`**: check it out. Its changes are `git diff <trunk>...<name>`. If it already
  has an open PR, commit there. If it doesn't, you're on the feature path with no PR yet, so
  commit and leave the PR to whoever opens it.
- **`release-notes`** with no slug means the current draft entry under
  `web/content/blog/<source locale>/` (see *Drafts and releases* in the `release-notes` skill).
  Its `changes:` frontmatter is the feature list. For the details behind a change, re-query the
  PRs in its `since..until` range the way `release-notes` does.

Never commit to the trunk or the release branch directly (AGENTS.md → *Mandatory rules*).

## 2. Understand what changed for a user

For each PR (or release-notes change):

- `$GH GET repos/$REPO/pulls/<n>` (title, body) and `$GH GET repos/$REPO/pulls/<n>/files` for
  intent and scope.
- Go from the changed files to what a user sees (with `codegraph_explore` when the CodeGraph
  MCP server is available, otherwise `grep`): the route, the component, and its dictionary for
  the exact labels in every locale.
- Write down one line per user-visible behaviour: who does it (which audience from `PRODUCT.md`), where, and
  what's new. Internal changes (refactors, infra, CI, server-only behaviour with no visible
  effect) get marked **skip** with the reason. They don't need docs.

## 3. Map each behaviour to the docs

List the current pages (`web/content/docs/<source locale>/**`, including each folder's `meta.json`) and read
the ones that could be affected. Each behaviour ends up in exactly one bucket:

- **Already documented.** The page already describes it correctly in every locale. Nothing to
  write, but check the touched page for the drift below.
- **Edit.** An existing page covers the area. Add or change a section there.
- **New page.** The behaviour is a user task in its own right: a multi-step flow someone would
  look up by name, like "import customers from a spreadsheet". A new option on an existing flow is
  an edit, not a page. Put it in the section of whoever performs the task (docs are usually split by audience,
  plus one for integrations). If no section fits, propose one and ask.
- **Skip.** Not user-visible (from step 2).

**Drift on pages you touch.** While you're on a page, fix what's already wrong on it: a
structural mismatch between locales (a step or section present in one locale only), or
off-glossary wording. Stay on the pages this run touches. A full sweep of the site is
out of scope.

## 4. Write

For each page, in this order:

1. The source-locale page (edit or create).
2. Every other locale's page, translated from the one you just wrote, same structure.
3. For a new page: add its file name (without `.mdx`) to the `pages` array of **every**
   locale's `meta.json` of its folder, at the same position. A new folder gets its own
   `meta.json` per locale, with a translated `title`.
4. If a section's landing page (`<section>/index.mdx`) lists its pages as cards, add a card for
   the new page there too, in every locale.

When a term you need isn't in the terminology table, follow *Adding a term* there.

## 5. Screenshots: ask

Once the text is written, list the spots where a picture would help: new `<Steps>` flows, a
screen the text describes at length, an existing screenshot the change made outdated. Ask the
human which ones, if any, to shoot. For each yes, run the `screenshots` skill with a brief that
names the destination, e.g. `the review step of bulk imports, for web docs
<section>/<page> (every locale)`. That skill picks its own keepers and places
the assets and their `<Image>` markup per its `references/placement.md`. If the human says no,
move on. Don't leave placeholder images behind.

## 6. Validate

From `web`:

```sh
npm run lint && npm run build
```

Both must pass. The build is what catches a broken `meta.json`, invalid frontmatter or a bad MDX import. Fix and
re-run. Don't commit a docs change that doesn't build.

## 7. Commit, push, PR

- One commit per coherent change (a page, or a page plus its `meta.json`/card), with **every
  locale in the same commit**. Prefix the subject with `[web]`, and add the `Co-Authored-By`
  trailer.
- Push the branch.
- Separate-docs path: open a **draft** PR against the trunk (`$GH POST repos/$REPO/pulls` with
  `draft: true`, body built with `jq --rawfile`). The
  description opens with the AI-generated notice (AGENTS.md → *Mandatory rules*). Mark it ready
  only once step 6 has passed locally.
- Feature path: the commits go onto the existing PR. Don't touch its draft/ready state.

## 8. Report

End with a short table, one row per behaviour: the bucket, the page(s) touched, and one line of
why. Add three lists after the table if they have entries: **skipped** changes and the reason,
**drift fixed** on touched pages, and **UI label mismatches** with the terminology table
(webapp issues to file, not docs issues). Then the PR link.
