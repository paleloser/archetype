---
name: discovery-digest
description: Weekly discovery digest. Runs community listening if it hasn't run this week, then writes discovery/digests/<year>-W<week>.md with the top themes, what changed in the evidence log, which assumptions got stronger or weaker (and whether any is ready to confirm or kill), and what to ask next week. Updates the assumption register's status lines. Commits to the discovery/log branch. Runs manually, weekly.
argument-hint: "[since=YYYY-MM-DD] [skip-listening]"
context: fork
agent: discovery
---

Write the weekly discovery digest. Arguments: `$ARGUMENTS`.

## 1. Set up

Follow **Saving your work** in your agent definition to check out `discovery/log`.
Then `mkdir -p discovery/digests`.

**Window.** It always ends today. It starts at `since=<YYYY-MM-DD>` if given,
otherwise the day after the end date of the latest digest in `discovery/digests/`,
otherwise 7 days ago. The digest is named after the ISO week of the window's end:
`discovery/digests/<YYYY>-W<ww>.md`. If it exists, rewrite it (re-running is safe).

## 2. Listen first

Unless the arguments contain `skip-listening`, check whether
`discovery/listening/<YYYY>-W<ww>.md` exists for this week. If it doesn't, read
`.claude/skills/discovery-listen/SKILL.md` and follow its steps 2–6 now, for the same
window (skip its set-up and save steps: this run already did the one and will do the
other).

## 3. Gather the week

- The evidence log, `discovery/evidence.md`. Rows with an `Updated` date inside the
  window are this week's changes. To say exactly what changed on them (new, count or
  confidence moved), diff against the previous digest's commit:
  `git log -1 --format=%H -- discovery/digests/<previous>.md`, then
  `git diff <sha> -- discovery/evidence.md`. If there's no previous digest, every row
  is new.
- Syntheses in `discovery/interviews/` dated inside the window, and this week's
  listening report.
- The previous digest's **Assumptions** table, which is the baseline for trends.

## 4. Score the assumptions

For each assumption in `discovery/assumptions.md`:

1. **Weigh the rows** that test it: `+`, `−` and `~`, by confidence. One `High` row
   outweighs any number of `Low` ones. Rows resting only on `opinion` don't count
   towards strength.
2. **Status** (your call, one of): `Untested` (no `Medium`+ rows), `Leaning true`,
   `Leaning false`, `Reshaped` (the `~` rows dominate: the assumption is true in a
   different form than written). Never set `Confirmed` or `Killed`: those are the
   maintainer's.
3. **Confidence**: the highest confidence among the rows that drive the status.
4. **Trend** against the previous digest: `↑ stronger`, `↓ weaker`, `→ unchanged`,
   with the row IDs that moved it. "Stronger" means more certain in *either*
   direction, as long as the status leans the same way. A move toward the opposite
   lean counts as `↓ weaker`.
5. **Ready to decide?** Compare the evidence to the assumption's own "Confirm if" and
   "Kill if" criteria. If one is met, flag it: `ready to confirm` or `ready to kill`,
   quoting the criterion and the rows that meet it.

Update the `Status`, `Confidence` and `Evidence` lines (and any `Price band` line, only
from `behavior` or `commitment` rows) in `discovery/assumptions.md`. Touch nothing
else there. If the evidence suggests a new assumption, or rewording an existing one,
propose it in the digest instead.

## 5. Pick the themes

A theme is a cluster of rows that tell one story, e.g. "customers don't chase their own users
in peak season because they're full". Rank candidates by independent sources × confidence,
with this week's movement as a tie-break, and keep the top 3–5. A theme can span
assumptions. Don't turn every row into a theme: three strong themes beat five thin
ones.

## 6. Decide what to ask next week

This is the part that makes next week better than this one. Work it out from the gaps:

- Assumptions still `Untested`, or whose evidence is all `Low` or all one segment.
- Themes resting on `pain` or `opinion` that a `behavior` question could confirm.
- Contradictions between rows.
- Open questions from this week's syntheses.
- The **Test order** table in `assumptions.md`, to break ties towards the riskiest.

Write 5–8 questions, each in past-behavior form (the same rules and banned patterns
as `/discovery-kit`), with the assumption it tests and the segments to ask. Say
which segments to recruit next, and add new listening queries if a theme deserves a
wider search.

## 7. Write the digest

Write it from [templates/digest.md](templates/digest.md). Every section is always
present. Write `Nothing this week.` in an empty one.

## 8. Save

Commit and push per **Saving your work**, with the message
`[discovery] Digest <YYYY>-W<ww>`. Reply with the full digest and the PR URL.
