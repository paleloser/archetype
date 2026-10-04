# Product profile

The facts about **this** product that the agents and skills in [`.claude`](./.claude) need and can't read from the code.
They read this file before every run instead of having them hardcoded, which is what makes them reusable across
products.

**How it gets filled in.** Run `/product-setup` once, right after creating the product: it interviews you and writes
the answers here. After that, any skill that needs a value still marked `TODO` asks you for it and writes your answer
back (see [Learning](./.claude/README.md#learning)). Edit it by hand whenever something changes; it's plain Markdown.

> Every `TODO` below is a question a skill will ask you. Leave the headings and keys as they are: skills look them up
> by name.

## Identity

- **Name:** acme <!-- TODO: product name, as the brand writes it -->
- **Brand casing:** TODO <!-- e.g. "always lowercase, even at the start of a sentence" -->
- **One-liner:** TODO <!-- what it does, for whom, in one sentence a customer would understand -->
- **Site:** https://acme.example <!-- the `web` app -->
- **App:** https://app.acme.example <!-- the `webapp` -->
- **API:** https://api.acme.example <!-- the `server` -->
- **Contact email:** hello@acme.example

## Repository

- **GitHub:** TODO <!-- owner/repo; skills fall back to `git remote get-url origin` -->
- **Trunk branch:** develop <!-- PRs target it -->
- **Release branch:** main <!-- only released commits; release notes on it are final -->
- **Visibility:** private <!-- private: published content must never link to issues, PRs or commits -->

## Audiences

Who the product serves, in the glossary's terms. Skills write for, research and prioritise by these.

- **Customer (pays):** TODO <!-- e.g. "Workshop: a bike repair shop" -->
- **User (doesn't pay, or not directly):** TODO <!-- e.g. "Rider: the workshop's customer"; "none" if the same as above -->
- **Audience markers:** TODO <!-- emoji per audience when a post speaks to both, e.g. "💼 workshop, 🚴 rider" -->

## Principles

Hard filters every idea, post and doc is held to. Write them as rules.

- TODO <!-- e.g. "Low effort for the customer: reject ideas that add manual work or data entry for them." -->

## Market and language

- **First market:** TODO <!-- country/region; drives discovery sources and the interview language -->
- **Source locale:** es <!-- content is written in it first; must match web/site.config.ts and webapp/lib/i18n/config.ts -->
- **Other locales:** en
- **Agents' working language:** en <!-- issues, digests and internal docs -->
- **Social media locale:** TODO
- **Form of address:** TODO <!-- e.g. "tú, never usted" -->

## Integrations

External providers the product depends on. `/pm-scan` watches their changelogs for risks.

- TODO <!-- e.g. "Strava: ride provider, https://developers.strava.com/docs/changelog/" -->

## Competitors

- TODO <!-- name, URL, one line on how they differ -->

## Publishing rules

- **Pricing on social media:** TODO <!-- allowed | never -->
- **Words to avoid:** TODO <!-- product-specific, on top of the editorial guide's list -->
