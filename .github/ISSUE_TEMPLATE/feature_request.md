---
name: Feature request
about: Propose a feature in a way a coding agent can pick up and implement
title: '[app] short description of the feature'
labels: enhancement
assignees: ''

---

<!--
This template is meant to be filled in by a human and then handed to a coding
agent (Claude, Copilot, etc.) to implement. Be explicit about scope: an agent
will implement exactly what's asked, so an unstated boundary is a boundary
that gets crossed or missed.
-->

## Affected app

<!-- Pick exactly one; this determines which build/test commands and layering
rules from AGENTS.md apply. If a feature spans apps, open one issue per app
and link them. -->

- [ ] server (Java/Spring Boot)
- [ ] webapp (Next.js app)
- [ ] web (Next.js/Fumadocs public site)

## Problem / motivation

What's missing or frustrating today, and for whom. If this traces back to a
user complaint, support thread, or another issue, link it instead of
paraphrasing.

## Proposed solution

Describe the desired end state concretely: new endpoints/fields, new UI
elements and where they live, new config options, etc. Use terms from
[`GLOSSARY.md`](../../GLOSSARY.md) rather than inventing new ones. If a
term you need isn't in the glossary yet, say so explicitly instead of coining
one.

## Out of scope

Things this issue deliberately does *not* cover, even if related (e.g. "no
migration of existing data", "UI only, no new API field yet"). This is the
most important section for an agent — list anything a reasonable
implementation might be tempted to include but shouldn't.

## Acceptance criteria

What must be true for this to be considered done. The agent should verify
each of these before opening a PR.

- [ ] ...
- [ ] Relevant build passes: `mvn verify` for `server`, `npm run lint && npm run build` for `webapp`/`web`
- [ ] If `server/backend/src/main/resources/api/v1.yml` changed, `webapp` was reinstalled (`npm install`) and still builds

## Additional context

Mockups, API sketches, related issues/PRs, or prior discussion. Link, don't
summarize, when possible.
