# archetype

The starting point for new products: the conventions, tooling and AI agents that [sincrona](https://github.com/paleloser/sincrona)
grew, extracted so the next product starts where sincrona is today instead of where it began.

It is a working monorepo, not a set of snippets: every app builds, lints and passes its tests as it is, with a small
sample resource (`Note`) going through every layer so each convention has a real example to copy.

| Path | What | Stack |
| --- | --- | --- |
| [`server`](./server) | REST API: contract-first, layered (domain / infra / api / boot), Checkstyle + Spotbugs failing the build | Java 21, Spring Boot 4, Maven, PostgreSQL, Testcontainers |
| [`webapp`](./webapp) | The app behind the login, bilingual, with a client generated from the server's API spec | Next.js 16, TypeScript, HeroUI v3, Tailwind 4, Auth0 |
| [`web`](./web) | The public site: landing page, docs and blog, bilingual MDX | Next.js 16, Fumadocs, HeroUI v3 |
| [`.claude`](./.claude) | Agents and skills for product work (PM scan, discovery, release notes, docs, screenshots, social), product-agnostic and learning from you | Claude Code |
| [`discovery`](./discovery) | Templates for the assumption register and evidence log the discovery agent keeps | Markdown |
| [`scripts`](./scripts) | `new-product.sh`: scaffolds a product from this repository | Bash, Python |

Plus Renovate (grouped weekly, majors monthly), image builds in one `docker-bake.hcl`, issue templates written for coding agents, and
the house rules for humans and agents in [`AGENTS.md`](./AGENTS.md) and [`CONTRIBUTING.md`](./CONTRIBUTING.md).

## Starting a product

```sh
scripts/new-product.sh --target ../tandem --name Tandem --slug tandem --package io.tandem --domain tandem.app
```

or, from Claude Code in this repository, `/new-product ../tandem`. The script copies everything (or only the apps you
pass with `--apps`), renames the placeholder identity (`acme`, `com.acme`, `acme.example`) and makes a first commit.
Then, in the new repository:

1. Build every app (`mvn verify`, `npm install && npm run lint && npm run build`) to check the scaffold.
2. Create the GitHub repository, push `main`, and create the `develop` trunk.
3. Run **`/product-setup`**: it interviews you about the product and fills `PRODUCT.md`, `GLOSSARY.md`, the
   assumption register and the skills' sources and channels. Until then, every agent stops to ask.
4. Replace the `Note` sample with your first aggregate (`server/README.md` → Replacing the sample lists every file).

## Decisions

### `web` is on Fumadocs, not Nextra

sincrona's site runs on Nextra 4. Its last release was in December 2025, it needs a `postinstall` patch to its own
layout to build, and its theme config is where most of sincrona's site workarounds live. Fumadocs is released several
times a month, is built for the App Router, and covers natively what sincrona patched or bolted on:

| Need | Nextra (sincrona) | Fumadocs (archetype) |
| --- | --- | --- |
| Locale-prefixed URLs and redirect | `nextra/locales` middleware | `fumadocs-core/i18n` proxy + per-locale page trees |
| Search | Pagefind, as a `postbuild` step | Built-in Orama, one index per locale |
| Blog frontmatter agents read (`changes:`) | Free-form, unchecked | Zod schema: a typo fails the build |
| Navigation | `_meta.ts` (with an `index` pitfall) | `meta.json` |
| Sitemap with hreflang | `next-sitemap`, postbuild | Next's `app/sitemap.ts` |
| HeroUI in MDX, `ThemedImage`, raw MDX for agents | ✔ | ✔ (unchanged) |

The trade-off: Fumadocs gives more building blocks and less out-of-the-box theme, so the landing page and blog
layouts are ours (`web/app/[lang]/(home)`). That's code we already wrote around Nextra anyway.

### What stayed in sincrona

The deployment stack (`deploy/`: VPS Docker Compose, release scripts, Grafana/Loki), the seed data, ADRs and the
in-memory Spring Cloud Stream binder are tied to how sincrona runs and what it does. Port them when a product needs
them; `docker-bake.hcl` and the Dockerfiles are here so images build the same way.

## No CI, on purpose

There are no GitHub Actions workflows, here or in generated products: they spend Actions minutes. Each app's build
(`mvn verify`, `npm run lint && npm run build`) is the definition of done and runs locally before a PR is marked
ready (see [`CONTRIBUTING.md`](./CONTRIBUTING.md#local-verification)).

## Working on the archetype itself

Every app validates the same way it would in a product (see [`AGENTS.md`](./AGENTS.md) → Build, test, lint). A change
to a convention belongs here first, then in the products that want it. When you change the placeholder identity or add
a file type, check `scripts/new-product.sh` still renames everything: scaffold into a scratch directory and build it.
