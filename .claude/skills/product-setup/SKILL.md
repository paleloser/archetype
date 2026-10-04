---
name: product-setup
description: Onboarding interview for a product built on the archetype. Asks the maintainer about the product (identity, audiences, principles, market, integrations, competitors, channels, assumptions) and writes the answers into PRODUCT.md, GLOSSARY.md, discovery/assumptions.md and the skills' sources, channels and editorial files, so every agent and skill works for this product. Re-runnable: it only asks about what is still TODO, or about the sections you name. Runs manually.
argument-hint: "[section ...]  e.g. 'audiences channels', or nothing for everything still TODO"
---

Teach the agents and skills in `.claude/` about this product. Arguments: `$ARGUMENTS`.

Everything product-specific the skills need lives in files they read (see the table in
`.claude/README.md`). This skill fills them in by interviewing the maintainer, so that nobody has
to edit a skill's instructions to adapt it to a product.

## Ground rules

- **Propose, don't interrogate.** Before asking anything, read what's already there: `README.md`,
  `PRODUCT.md`, `GLOSSARY.md`, `server/backend/src/main/resources/api/v1.yml`, `web/content/`,
  `web/site.config.ts`, `webapp/lib/i18n/config.ts`, `git remote get-url origin`. Pre-fill every
  answer you can infer and ask the maintainer to confirm or correct it, instead of asking blank
  questions.
- **Batch the questions.** One message per round, grouped by section, numbered, each with your
  proposal. Three rounds at most: identity and audiences first (everything else depends on them),
  then market, principles and research sources, then channels and voice. Use AskUserQuestion for
  closed choices; plain numbered questions for open ones.
- **The maintainer's words are the answer.** Write what they said, tightened, never embellished.
  Don't invent principles, competitors or assumptions they didn't confirm.
- **Research is a proposal too.** You may use WebSearch to propose competitors, trade press,
  communities and provider changelogs, but each one is confirmed by the maintainer before it is
  written down, and each one carries its URL.
- **Only what's missing.** With no arguments, cover every section that still has `TODO`s. With
  arguments, cover only those sections (`identity`, `repository`, `audiences`, `principles`,
  `market`, `integrations`, `competitors`, `glossary`, `assumptions`, `sources`, `listening`,
  `channels`, `voice`, `terminology`), even if already filled, showing the current values as the
  proposals.

## 1. Identity, repository and audiences → `PRODUCT.md`

Name and brand casing, one-liner, site/app/API URLs, contact email; GitHub repository, trunk and
release branches, visibility; the customer (who pays), the user (if different), and an audience
marker for each.

If the name or URLs differ from the ones in the code (`web/site.config.ts`, the API spec's
`servers`, `server/backend/src/main/resources/application-production.yml`'s CORS origins, the
webapp's `.env.example`), offer to update those too, in the same branch.

## 2. Market, principles, integrations, competitors → `PRODUCT.md`

First market and its language, source locale and other locales (they must match
`web/site.config.ts` and `webapp/lib/i18n/config.ts`: if they don't, say so and offer to align
the code), agents' working language, social media locale and form of address. Principles as hard
rules ideas are filtered by. Integrations with their changelog URLs. Competitors with one line
each. Publishing rules.

## 3. The language → `GLOSSARY.md`

Propose the domain terms you found in the API spec, the docs and the maintainer's answers: one
`## Term` per concept, with a two-to-four-sentence definition in the maintainer's words. Ask which
are right, which are missing, and which words must never be used for them. Then seed
`.claude/skills/docs-sync/references/terminology.md` with one row per term and one column per
locale, asking for the translations you're unsure of.

## 4. The bets → `discovery/assumptions.md`

Help the maintainer write the assumptions the product rests on (aim for 5–10), as statements that
could be false, each with why it matters, **Confirm if** and **Kill if** criteria written before
any evidence, and a test order (riskiest and least known first). Propose a small segment
taxonomy for tagging evidence. Push back on criteria that are easy to meet: they should feel
uncomfortable. The maintainer owns this file; write only what they confirm.

## 5. Where to look → `sources.md` files

- `.claude/skills/pm-scan/sources.md`: provider changelogs (one per integration), competitors'
  blogs or changelogs, trade press for the customer's industry, consumer press for the user's,
  YouTube channels. Prefer feeds. Check that each URL loads (WebFetch) and say which don't.
- `.claude/skills/discovery-listen/sources.md`: public communities where customers and users
  talk (in the first market's language and in English), and searches tied to the assumptions,
  including disconfirming ones.

## 6. Channels and voice → `.claude/skills/cm/`

- `channels.md`: each social channel with its handle, locale, format and audience rules.
- `editorial-guide.md`: keep the rules; ask whether any doesn't fit the brand, and replace the
  illustrative examples (written for "Pedalo", a bike-maintenance product) with ones from this
  product, built from the maintainer's own descriptions.
- `examples/`: ask for one or two posts they've published or like, and save each as described in
  `examples/README.md`.

## 7. Save

Work on a branch from the trunk (`git checkout -b product-setup`), unless already on a feature
branch. Commit each file group separately (`[claude] Product profile`, `[claude] Glossary`,
`[discovery] First assumptions`...), with a `Co-Authored-By:` trailer. Push, and open a draft PR
against the trunk if the repository has a remote, opening its description with the AI-generated
notice from `AGENTS.md`.

Finish with a short summary: what was filled in, what is still `TODO` (and which skill will ask
for it when it needs it), and the PR link. Record in [learnings.md](learnings.md) anything the
maintainer said about how they want to be asked.
