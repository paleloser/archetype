# Terminology

The fixed vocabulary of the `web` docs, per locale. For the [`docs-sync`](../SKILL.md) skill, and read by
`/release-notes` and the `community-manager` agent too.

The glossary column comes from [`GLOSSARY.md`](../../../../GLOSSARY.md); each locale column is the one word every page
uses for it. Don't vary it for style: a reader who has learned a word on one page shouldn't meet a synonym on the next.
Add one column per locale in `PRODUCT.md`.

| Glossary | en (docs prose) | es (docs prose) | Notes |
|---|---|---|---|
| TODO | | | <!-- e.g. "Provider | sports app | aplicación deportiva | Name the app when the page is about one. Never 'provider' in docs prose." --> |

## UI labels are quoted, not translated

When a page names a button, a menu entry or a column, write it exactly as the webapp shows it in that locale, read
from the component's dictionary (`*.i18n.ts` / `i18n.ts`), even when it disagrees with the table above. The label is
correct for the screen. The mismatch is a webapp issue: report it at the end of the run instead of rewording the docs
around it.

## Adding a term

When a change introduces a concept with no row here, check `GLOSSARY.md` first. If the glossary has it, add the row in
the same commit as the page that first uses it, and ask the maintainer to confirm the translation you chose. If the
glossary doesn't have it either, ask before inventing a term (AGENTS.md → *Recommendations*).
