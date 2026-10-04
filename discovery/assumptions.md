# Assumptions

The bets the product rests on. Each one says what evidence would confirm it and what would
kill it, written *before* looking, so the evidence can't be read to fit afterwards.

**The maintainer owns this file's statements, criteria and taxonomy**, and is the only one
who sets `Confirmed` or `Killed`. The discovery agent updates only the `Status`,
`Confidence` and `Evidence` lines, and proposes everything else in the digest.

Status: `Untested` → `Leaning true` / `Leaning false` / `Reshaped` → `Confirmed` / `Killed`.

> Run `/product-setup` to draft the first assumptions with Claude, then tune the thresholds
> before the first interviews. They should feel uncomfortable to meet, not easy.

## Segment taxonomy

How evidence is tagged by who it comes from, as `<dimension>/<dimension>`. Keep it small.

- TODO <!-- e.g. focus: `retail`, `online`, `chain`; size by staff: `solo` (1), `small` (2–5), `large` (6+) -->
- `user` for evidence from users rather than customers. `?` for unknown parts, e.g. `retail/?`.

## Test order

Riskiest first: the ones that would sink the product if wrong, and that we know least
about. The agent uses this order to pick what to ask when evidence is equally thin.

| Priority | Assumption | Why now |
| --- | --- | --- |
| 1 | A1 · TODO | TODO |

Some assumptions can be measured from the product's own data. Numbers from product data
count as `behavior` evidence. Log them with `/discovery-log`.

## A1 · TODO <!-- the assumption, as a statement that could be false -->

- **Why it matters:** TODO <!-- what breaks if it's false -->
- **Confirm if:** TODO <!-- e.g. "3+ customers describe a specific, costly instance in the last 6 months" -->
- **Kill if:** TODO <!-- e.g. "most customers can't recall the last time it happened" -->
- **Status:** Untested
- **Confidence:** —
- **Evidence:** —
