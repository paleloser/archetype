# Placement

Where the keepers go, once you've picked them (see step 7 of the skill). For the
[`screenshots`](../SKILL.md) skill.

Everything starts in the run's output directory —
`<repo root>/.screenshots/<feature-slug>/<asset>-<locale>-<theme>-<viewport>.{png,webm}` unless the
brief named somewhere else. That's scratch: the rejected takes stay there, it's gitignored, and
nothing in it is committed from where it lies.

**The rule that governs all of this: an asset is placed only when the file and the page
referencing it land in the same commit.** Never write a `src` that points at the output
directory, and never point a page at a file you haven't copied into the repo. A docs page
referencing an uncommitted capture is a broken image on a live site.

## `web` docs pages

- Stills → `web/public/images/screenshots/<feature-slug>/<asset>-<locale>-<theme>.png`
- Recordings → `web/public/videos/<feature-slug>/<asset>-<locale>.webm`

One asset per locale: each locale's page gets the capture in its own language.

**Stills come in both themes.** The docs site follows the reader's light/dark setting (Fumadocs'
theme switch, defaulting to the system one), so every still is shot twice, light and dark, with
the same framing and the same record. Shoot the dark take right after the light one on the same
route (`npx playwright cli localstorage-set theme dark`, then `nav.sh` again) so both match.
Recordings stay light-only: a second recording doubles the slowest part of a run for little gain.

Stills are embedded with `ThemedImage` (`web/components/ThemedImage.tsx`), which renders both
variants and shows the one matching the reader's theme, with no flash on load:

```mdx
import ThemedImage from '@/components/ThemedImage'

<ThemedImage
  alt='<what it shows, written in the page's own language>'
  light='/images/screenshots/<feature-slug>/<asset>-en-light.png'
  dark='/images/screenshots/<feature-slug>/<asset>-en-dark.png'
  width={ 1528 }
  height={ 852 } />
```

The `@/` alias works from any MDX file, at any depth. The component keeps the image at its natural
aspect ratio in a rounded, bordered frame. Don't wrap UI captures in a fixed-height box with
`object-cover`: it crops them.

The frame is never wider than the image's natural size (pixel width ÷ 2, since captures are 2×)
and is centred, so screen-sized captures fill the column while an isolated component shows at
its own size. Its radius is the webapp's surface radius (24px), which is why `isolate` cuts
edge to edge by default: the frame hugs the component corner to corner. Don't pass `--pad` to an
isolated asset bound for the docs — the padding shows up as a gap inside the frame.

`width`/`height` must be the asset's **actual** pixel dimensions (both themes share them) —
read them, don't copy the numbers above. `alt` is written in the page's language and describes what the reader is looking
at, not the filename.

Recordings use a plain `<video>`; there is no `<Video>` component in `web` and no need to invent
one for a single embed:

```mdx
<div className='relative mt-6 w-full overflow-hidden rounded-2xl'>
  <video className='w-full' controls muted loop playsInline preload='metadata'
    src='/videos/<feature-slug>/<asset>-en.webm' />
</div>
```

Muted and loop, never `autoPlay` — a docs page that starts making motion on load is hostile.

Then `npm run lint && npm run build` from `web/`. Frontend style is ESLint-enforced: single
quotes, no semicolons, spaced JSX curly braces.

## Release-notes blog entry

Same public directories and the same markup (same `@/components/ThemedImage` import), with the
asset placed right after the paragraph of the story it illustrates, in every locale's file.

A release-notes entry is a short article, and its visuals are sized accordingly:

- **Isolated component stills only** (`shot.sh isolate`) — the new menu item, the new
  row, the new badge. Not a page shot, not an annotated screen, not a sequence, not a
  recording. If the change can't be framed as one component, it doesn't get an asset
  here; say so and leave the entry as prose.
- **A detail, not a screen.** `ThemedImage` caps the frame at the asset's natural size
  (pixel width ÷ 2), so a tight crop renders small and centred, exactly as intended. An
  asset wider than roughly 700 image pixels is a sign the crop was too generous — reshoot
  tighter rather than letting it dominate a 500-word article.
- **Two or three per entry, at most.** The `illustrate: true` markers in the entry's
  `changes:` frontmatter say which ones; don't add assets for changes that aren't marked,
  and don't illustrate a roundup bullet.

Two more constraints inherited from the `release-notes` skill:

- **Don't rewrite the entry's copy.** Illustrating an entry is not editing it. If a bullet needs
  rewording to match the asset, say so rather than doing it — that's `/release-notes`' job, and
  released entries are permanent.
- **Never reference GitHub** anywhere: not in an `alt`, not in a filename, not in a caption. The
  entry is published publicly and the repository is private.

Only the current *draft* entry can be illustrated. An entry that has reached `main` is released
and is never touched again.

## Outside the repo

Social, a deck, a portfolio, "just tell me where they are": **commit nothing**. Leave the assets
in the output directory and report their absolute paths. Binary files with no consumer in the repo don't
belong in git history.

## Anywhere else

If a brief points somewhere none of the above covers, ask before inventing a convention. A new
directory under `web/public/` or a new embed pattern is a decision for the human, not a
side-effect of a screenshot run.
