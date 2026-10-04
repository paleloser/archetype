---
name: Bug report
about: Report a bug in a way a coding agent can pick up and fix
title: '[app] short description of the bug'
labels: bug
assignees: ''

---

<!--
This template is meant to be filled in by a human and then handed to a coding
agent (Claude, Copilot, etc.) to fix. Be concrete and literal: exact commands,
exact error text, exact file paths if known. Avoid vague language like "it's
broken" — the agent cannot infer what it cannot observe.
-->

## Affected app

<!-- Pick exactly one; this determines which build/test commands and layering
rules from AGENTS.md apply. -->

- [ ] server (Java/Spring Boot)
- [ ] webapp (Next.js app)
- [ ] web (Next.js/Fumadocs public site)

## Summary

One or two sentences describing what is broken.

## Steps to reproduce

Exact, numbered steps starting from a known state (e.g. a clean checkout, a
specific page/URL, a specific API request). Include request payloads, form
inputs, or CLI commands verbatim.

1. ...
2. ...
3. ...

## Expected behavior

What should have happened instead.

## Actual behavior

What actually happened. Paste the exact error message, stack trace, HTTP
status/response body, or screenshot text — do not paraphrase it.

## Relevant code pointers (if known)

File paths, class/component names, or API endpoints where the bug likely
lives. Leave blank if unknown — say so explicitly rather than guessing.

## Environment

- Version/commit (or "latest `develop`"):
- OS / browser / device (only if relevant to a `webapp`/`web` bug):

## Acceptance criteria

What must be true for this to be considered fixed. The agent should verify
each of these before opening a PR.

- [ ] Reproduction steps above no longer produce the actual behavior
- [ ] Existing tests still pass (`mvn verify` for `server`, `npm run lint && npm run build` for `webapp`/`web`)
- [ ] A regression test covering this bug was added, if practical

## Additional context

Logs, screenshots, related issues/PRs, or anything else that narrows down the
cause. Link, don't summarize, when possible.
