---
name: discovery-synth
description: Interview synthesis. Takes pasted notes or a transcript from a customer call and extracts pains, workarounds, spend, objections and commitments, grades each one, writes discovery/interviews/<date>-<account>/synthesis.md and updates the evidence log. Commits to the discovery/log branch. Run after each call.
argument-hint: "[account=<name>] [date=YYYY-MM-DD] <notes or transcript>"
context: fork
agent: discovery
---

Synthesize this interview: `$ARGUMENTS`.

## 1. Set up

Follow **Saving your work** in your agent definition to check out `discovery/log`.

**Which interview.** Use `account=` and `date=` if given. Otherwise, infer the account from
the notes and match it to a kit in `discovery/interviews/`; take the date from the
kit's directory. If neither works, use `unknown-account` and today's date, and say so
at the top of the synthesis and in your reply. Never invent an account name.

Read the kit if there is one, plus `PRODUCT.md`, this skill's [learnings.md](learnings.md),
`discovery/assumptions.md` and `discovery/evidence.md`.

## 2. Extract

Go through the notes and pull out every observation of these kinds:

- **Pains**: problems they have today. Each with how often and what it costs, if they
  said.
- **Workarounds**: what they do about it today: tools, spreadsheets, messaging apps,
  memory, a colleague who "just knows". A workaround is proof the pain is real enough to act
  on. Its absence is a warning sign.
- **Spend**: money and time they spend today, with the numbers as said: software
  subscriptions, hours per week on the problem, the cost of the problem when it bites,
  their own prices.
- **Objections**: reasons they gave for not doing something, or doubts about the
  idea: capacity, cost, privacy, "our customers won't do that", "we tried X".
- **Commitments**: what they agreed to at the end, or refused: intro, second call,
  pilot, payment. Record refusals too.
- **Surprises**: anything that contradicts `What we expect to hear` in the kit, or an
  assumption.

Grade every observation (`commitment`, `behavior`, `pain`, `opinion`) per the Evidence
rules. Be strict: "we lose a lot of customers that way" is `pain`. "Two customers left
last spring after it happened" is `behavior`. "I'd pay for that" is `opinion`,
however enthusiastic.

Only extract what the notes say. If the notes are thin on something the kit asked
about, it goes under Open questions, not into an inferred answer.

## 3. Write the synthesis

Write `discovery/interviews/<date>-<account-slug>/synthesis.md`:

```markdown
# Synthesis · <Account name> · <YYYY-MM-DD>

- Segment: <focus/size> · Speaker(s): <roles> · Language: <es|en>
- Kit: <link, or "none"> · Input: <notes | transcript>, <approximate length>

## Summary

<3 lines: what we learned that we didn't know, and what it does to the assumptions.>

## Pains

- <observation> · `<grade>` · <A# ±>

## Workarounds

## Spend

## Objections

## Commitments

## Surprises

## Quotes

> <verbatim, original language, max 6 quotes, the ones that carry the most evidence>

## Kit coverage

- Q<n>: answered | partly | not asked

## Open questions

<What to ask this account next time, or ask other accounts, because the notes left it open.>

## Evidence log changes

- <E-id>: new | +1 source (count <old> → <new>) | confidence <old> → <new>
```

Every section is always present. Write `None.` in an empty one. People are named by
role only. Remove names, emails and phone numbers from quotes. Don't save the raw
notes or transcript anywhere.

## 4. Update the evidence log

Merge each observation that bears on an assumption into `discovery/evidence.md`, per
the Evidence rules. The source is `[<account-slug>](interviews/<dir>/synthesis.md)`.
An account is one independent source, however many times it said the same thing.
Then fill in **Evidence log changes** above to match.

## 5. Save

Commit and push per **Saving your work**, with the message
`[discovery] Synthesize interview with <Account name>`. Reply with the Summary, the
Commitments, the Surprises, the evidence log changes, and the PR URL.
