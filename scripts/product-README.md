# Acme

<!-- One paragraph: what Acme does, for whom, and what changes for them. /product-setup writes it from PRODUCT.md. -->

It's live at [app.acme.example](https://app.acme.example), with user docs at [acme.example](https://acme.example).

# Repository

A monorepo with three apps that are built and deployed independently:

| Path | What | Stack |
| --- | --- | --- |
| [`server`](./server) | REST API behind [api.acme.example](https://api.acme.example) | Java 21, Spring Boot, Maven, PostgreSQL |
| [`webapp`](./webapp) | The app behind [app.acme.example](https://app.acme.example) | Next.js, TypeScript, HeroUI, Tailwind |
| [`web`](./web) | Landing page, blog and user docs behind [acme.example](https://acme.example) | Next.js, Fumadocs |
| [`discovery`](./discovery) | Customer discovery: the assumptions Acme rests on, and the evidence for or against them | Markdown |
| [`.claude`](./.claude) | AI agents and skills used to run the product (see [its README](./.claude/README.md)) | Markdown |

# Getting started

Each app's README has its local setup (environment variables, ports, credentials): [`server`](./server/README.md),
[`webapp`](./webapp/README.md), [`web`](./web/README.md).

```sh
mvn verify                    # server: compile, Checkstyle, Spotbugs, unit + integration tests
npm run lint && npm run build # webapp and web (there are no JS unit tests: this is the bar)
```

Before writing code, read:

- [`PRODUCT.md`](./PRODUCT.md): what the product is, for whom, and the rules every idea and text is held to.
- [`GLOSSARY.md`](./GLOSSARY.md): the ubiquitous language. Code, docs, issues and API fields all use these terms exactly.
- [`CONTRIBUTING.md`](./CONTRIBUTING.md): issues, commits, branching and code review.
- [`AGENTS.md`](./AGENTS.md): the rules for AI coding agents. Most of them apply to humans too.

# How work flows

- **`develop` is the trunk.** Branch from it, open PRs against it, squash-merge. `main` only tracks released commits.
- **PRs start as drafts.** There is no CI: build every app you touched locally, then mark the PR ready.
- **Image builds** are defined only in [`docker-bake.hcl`](./docker-bake.hcl).

Built from the [archetype](https://github.com/paleloser/archetype).
