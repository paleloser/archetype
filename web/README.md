The `web` archetype: the product's public site (landing page, user docs, blog, legal pages), built with
[Next.js](https://nextjs.org/) 16 and [Fumadocs](https://fumadocs.dev/), written in MDX with
[HeroUI](https://heroui.com/) components, in Spanish and English.

## Why Fumadocs (and not Nextra)

sincrona's site was on Nextra 4, whose last release was in December 2025 and which needed a `postinstall` patch to its
own layout to build. Fumadocs is actively released (several times a month), built for the App Router, and gives us
natively what we were patching or bolting on: i18n with per-locale page trees and a locale proxy, built-in Orama search
(no Pagefind postbuild), typed and validated frontmatter (Zod) for the blog's agent-readable `changes:`, and Tailwind
4 styles that coexist with HeroUI. The conventions (bilingual MDX content, HeroUI in MDX, `ThemedImage`, raw MDX
served for agents, hreflang alternates) carry over unchanged.

## Getting started

Switch to the pinned Node version (`nvm use`), then:

```sh
npm install
npm run dev        # http://localhost:3000, redirects to /es or /en from your browser's language
npm run lint && npm run build   # the validation bar; there are no unit tests
```

## Layout

* `site.config.ts`: the site's name, URLs, locales and default locale. The single source for i18n, the sitemap and
  every page's hreflang alternates.
* `content/`: all content, one folder per locale.
  * `pages/<locale>/`: standalone pages with the marketing layout. `index.mdx` is the landing page (`full: true` lets
    it control its own layout), plus `about.mdx`, `legal.mdx`...
  * `docs/<locale>/`: the user documentation, ordered by `meta.json`.
  * `blog/<locale>/<YYYY-MM-DD>-<slug>.mdx`: release notes, written by the `/release-notes` skill.
* `lib/source.ts`: the three content collections and their frontmatter schemas. `lib/i18n.ts`: languages and URL
  strategy (locale prefix always). `lib/i18n-ui.ts`: Fumadocs' UI strings per locale. `lib/layout.shared.tsx`:
  navigation shared by both layouts. `lib/dictionaries.ts` + `i18n/<locale>.json`: the site chrome's strings.
* `app/[lang]/(home)`: marketing layout (`HomeLayout`): pages, blog index and entries. `app/[lang]/docs`: docs layout
  (`DocsLayout`) with sidebar, table of contents and search.
* `app/api/search`: built-in search over the docs, one index per locale. `app/sitemap.ts`, `app/robots.ts`: generated,
  with hreflang alternates.
* `components/`: `ThemedImage` (light/dark screenshots, see the `screenshots` skill), `Heading`, MDX defaults.
* `proxy.ts`: redirects locale-less URLs to the visitor's language.
* `scripts/prebuild.mjs`: copies every `.mdx` to `public/raw/`, so `/raw/<collection>/<locale>/<path>.mdx` serves the
  source of any page to agents.

## Adding a language

Add it to `locales` in `site.config.ts`, add `i18n/<locale>.json` and its entry in `lib/i18n-ui.ts` and
`lib/dictionaries.ts`, add the Orama language to `app/api/search/route.ts`, and translate every file under `content/`.
