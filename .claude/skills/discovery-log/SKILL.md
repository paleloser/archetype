---
name: discovery-log
description: Query or add to the discovery evidence log. With a question ("what do we know about A4?", "which rows rest only on community posts?"), it answers from discovery/evidence.md. With evidence from somewhere else (a chat with an account, an email, a trade fair conversation), it grades and logs it. With no arguments, it prints the per-assumption summary. Runs manually.
argument-hint: "[question | evidence to log]"
context: fork
agent: discovery
---

Work with the evidence log. Arguments: `$ARGUMENTS`.

Follow **Saving your work** in your agent definition to check out `discovery/log`, then
read `discovery/assumptions.md` and `discovery/evidence.md`. Then do one of these.

## No arguments: summary

For each assumption, reply with its status, and its supporting (`+`), weakening (`−`)
and reshaping (`~`) rows, counted and split by confidence, e.g.
`A2 · Leaning true · + 3 (1 High, 2 Low) · − 1 (Medium) · ~ 0`. Then list the
`Low` rows that one more interview could lift to `Medium`. Change nothing.

## A question

Answer it from the log only, citing row IDs and their sources. Say plainly when the log
can't answer it, and which question to ask in the next interview so it can. Change
nothing.

## Evidence to log

The arguments describe something someone said or did outside an interview or a
community post, e.g. "the owner of Acme Norte told me at the fair they pay €60/month
for their booking system".

1. Work out the source (who, where, when), the segment, the grade and the
   assumption(s) it bears on. If the source can't be identified at all, don't log it:
   say what's missing.
2. Merge it into the log per the Evidence rules. The source is written as plain text,
   `<account-slug or role> (<channel>, <YYYY-MM-DD>)`, e.g.
   `acme-norte (trade fair, 2026-09-20)`, since there's no file or URL to link.
   Numbers from the product's own data (e.g. an activation or retention rate) are `behavior`
   evidence, written as `the product (product data: <metric>, <YYYY-MM-DD>)`, with the
   metric's value and sample size in the insight. Their count is the number of
   accounts the metric covers.
3. Commit and push per **Saving your work**, with the message
   `[discovery] Log evidence from <source>`. Reply with the row(s) as they now read
   and the PR URL.

If it's unclear whether the arguments are a question or evidence, treat them as a
question and change nothing.
