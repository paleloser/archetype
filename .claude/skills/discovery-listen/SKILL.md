---
name: discovery-listen
description: Weekly community listening. Searches the public communities where customers and users talk in sources.md for pain signals that bear on the assumptions in discovery/assumptions.md, logs them in the evidence log, and writes a listening report. Commits to the discovery/log branch. Runs manually, weekly, before /discovery-digest.
argument-hint: "[since=YYYY-MM-DD]"
context: fork
agent: discovery
---

Run the weekly community listening for the product in `PRODUCT.md`. Arguments: `$ARGUMENTS`.

This is not the PM scan. `/pm-scan` reads news and competitors looking for features.
This skill reads what customers and users say in public, looking for evidence
that confirms or weakens an assumption. A post is only useful here if it tells you
what someone did, paid, lost or complained about.

## 1. Set up

Follow **Saving your work** in your agent definition to check out `discovery/log`.
Then `mkdir -p /tmp/discovery-listen discovery/listening`.

**Window.** It always ends today. It starts at `since=<YYYY-MM-DD>` if given,
otherwise the day after the end date of the latest report in `discovery/listening/`,
otherwise 7 days ago. The report is named after the ISO week of the window's end:
`discovery/listening/<YYYY>-W<ww>.md`. If that file exists, extend it instead of
creating a second one.

## 2. Ground yourself

Read `PRODUCT.md`, this skill's [learnings.md](learnings.md), `discovery/assumptions.md` and
`discovery/evidence.md`, and collect every URL
already in the log so no post is logged twice. Read the "Listening queries to add"
section of the latest digest in `discovery/digests/`, if any: those queries run this
week on top of [sources.md](sources.md).

**Learning.** If [sources.md](sources.md) has no communities or searches yet (only `TODO`s),
follow the Learning protocol in `.claude/README.md`: propose communities where the customer
and the user talk in public (forums, subreddits, groups), in the first market's language and in
English, plus searches tied to the assumptions; ask the maintainer to confirm them in one
message; and write them to `sources.md`. Record any later correction ("that subreddit is
all vendors") in `learnings.md`.

## 3. Read the communities

Go through [sources.md](sources.md) and collect posts and comments published inside the
window.

- **Feeds** (Reddit RSS): fetch with WebFetch. Reddit rate-limits hard. If you get a
  429, wait and retry once, then move on and note it for Run health. For a promising
  post, fetch its comments too (`<post url>.rss`): customers often answer there.
- **Search**: run every query in sources.md with WebSearch, restricted to the window
  when the tool allows it. For communities the network can't fetch directly, the
  `site:` queries are the only way in.
- Never guess the content of a page you couldn't load.

## 4. Keep only signals

A **signal** is a first-hand account from a customer (or, for assumptions about users, a
user) that bears on at least one assumption. For each candidate, decide:

- **Who speaks**: their role (e.g. owner, staff, user), or unknown. Drop it if it's a vendor, a
  journalist or a third-hand story.
- **What it bears on**: which assumption(s), and `+`, `−` or `~` (see Evidence rules).
- **Grade**: `commitment`, `behavior`, `pain` or `opinion`. Most community posts are
  `pain` or `opinion`. A post with specifics ("I send 40 reminders a month, maybe 5
  answer") is `behavior`.
- **Segment**, if the post or the poster's history makes it clear. Otherwise `?`.

Drop generic how-to questions, sales posts and anything that doesn't bear on an
assumption. Look as hard for posts that **weaken** an
assumption as for posts that support it. A week with no signals is a fine result.

## 5. Update the evidence log

For each signal, merge it into an existing row or add a new one, per the Evidence rules
in your agent definition. Community sources are written as `[<community>](<url>)`,
e.g. `[r/<sub>](https://www.reddit.com/r/<sub>/comments/…)`. Remember that
community-only rows stay `Low`.

## 6. Write the report

Write `discovery/listening/<YYYY>-W<ww>.md`:

```markdown
# Listening · <YYYY>-W<ww> (<Mon d>–<Mon d>)

## Signals

- <YYYY-MM-DD> · **<community>** (<speaker role>, <segment>, <grade>[, <n> upvotes/comments]) · [<title>](<url>) — <what it says, one line> → <E-id> <A# +/−/~>
  > <verbatim quote, max 25 words, original language>

## Evidence log changes

- <E-id>: new | +1 source (count <old> → <new>) | confidence <old> → <new>

## For the PM

<Feature ideas or competitor mentions you came across, one line each with a link, or "Nothing this week.">

## Run health

- Window: <YYYY-MM-DD> → <YYYY-MM-DD>
- Posts read: <n> · signals kept: <n>
- Queries run: <n> (<n> from last digest)
- Sources that failed: <source — reason, or "none">
```

Every section is always present. Write `Nothing this week.` in an empty one.

## 7. Save

Commit and push per **Saving your work**, with the message
`[discovery] Listening <YYYY>-W<ww>`. Reply with the signal count, the evidence rows
that changed, and the PR URL.
