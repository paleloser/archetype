# web conventions

The public site: landing page, user docs and blog, in every locale. See the [README](./README.md) for the layout. The
rules that change how you write here:

- **Content is MDX, one file per locale, mirrored.** `content/<collection>/<locale>/<path>.mdx` exists for every
  locale, with the same headings, steps, callouts, images and links in the same order. Only the language changes.
  Write the source locale (`es`) first, then translate it in the same commit.
- **Navigation lives in `meta.json`.** Each docs folder orders its pages with a `meta.json` per locale (`"pages": [...]`,
  translated `"title"`). Adding a page means adding it to both `meta.json` files.
- **Links carry the locale** (`/es/docs/...`), or are relative file links (`./other-page.mdx`) inside docs.
- **Components in MDX are imported explicitly** (HeroUI, `@iconify/react`, `@/components/ThemedImage`, Fumadocs' `Steps`), except
  Fumadocs' defaults (`Card`, `Cards`, `Callout`, code blocks), which every page gets.
- **Site chrome strings** (navigation, footer) live in `i18n/<locale>.json`, never in components. `es.json` is the
  source shape.
- **Page titles are plain** ("Getting started"): the layout appends ` · <site name>`.
- **Blog entries keep structured frontmatter** (`date`, `since`, `until`, `changes[]`, validated in `lib/source.ts`):
  agents read it instead of the prose. Don't drop fields to make an entry build.
- **Never reference private repositories** (issues, PRs, commits) in published content: the raw MDX of every page is
  served at `/raw/...`.
- **Style is ESLint's** (also on MDX): single quotes, no semicolons, 2-space indent, spaced JSX curly braces.
  `npm run lint && npm run build` is the validation bar.
