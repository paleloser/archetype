---
name: discovery-kit
description: Interview kit for a discovery call with a customer. Researches the account (website, services and prices, reviews, tools it uses) and drafts 8–10 questions about past behavior, not hypotheticals, aimed at the weakest assumptions. Writes discovery/interviews/<date>-<account>/kit.md on the discovery/log branch. Run before each call.
argument-hint: "<account name, URL or both> [date=YYYY-MM-DD] [lang=es|en] [notes...]"
context: fork
agent: discovery
---

Prepare an interview kit for: `$ARGUMENTS`.

`date=` is the call date (default: today). `lang=` is the interview language (default:
the first market's language from `PRODUCT.md` for accounts there, otherwise `en`). Anything else is the maintainer's notes about
the account or the call. Treat them as facts from the maintainer.

## 1. Set up

Follow **Saving your work** in your agent definition to check out `discovery/log`. The
kit goes in `discovery/interviews/<date>-<account-slug>/kit.md`, where `<account-slug>` is
the account's name, lowercase, ASCII, hyphenated. If a kit or synthesis for the same account
already exists (any date), read it: this is a follow-up, so don't re-ask what was
answered, and do dig into what was left open.

## 2. Decide what this call is for

Read `PRODUCT.md`, this skill's [learnings.md](learnings.md), `discovery/assumptions.md`, `discovery/evidence.md` and the "What to ask next
week" section of the latest digest in `discovery/digests/`. Pick the 2–3 assumptions
this call should push hardest on: the ones with the least or weakest evidence, the
ones where this account's type is under-represented in the log, and the ones the digest
flagged. Break ties with the **Test order** table in `assumptions.md`.

## 3. Research the account

Use WebSearch and WebFetch. Look for:

- **What they do**: their focus and offering, which segment of the taxonomy they fall
  in, and their size if you can tell.
- **Prices**: a published price list is direct evidence of what their work is worth to
  them. Quote it with the link.
- **Tools**: the software and services they already pay for in the area the product
  covers. These tell you what they spend today and how they work around the problem.
- **Reviews** (maps, social, marketplaces): mentions of the pain the assumptions are about.
- **Social activity**: do they already do what the product would help them do?

Every fact links to where you found it. If a fact isn't findable, say so. Don't guess,
and don't pad the snapshot with generic filler.

## 4. Draft the questions

Write 8–10 questions in the interview language, grouped from broad to specific, each
tied to an assumption. **Every question asks about something that already happened.**

- Anchor in a specific, recent instance: "the last time…", "tell me about the last
  customer who…", "walk me through what happened when…".
- Ask for specifics that can't be made up politely: when, how many, how much, who did
  it, what tool, what happened next.
- Use this account's research to make questions concrete ("your site lists a €45 basic
  plan: when did a customer last ask for something it doesn't cover?").

**Banned:** anything about the future or a hypothetical, and anything that pitches
the product. Before writing the file, check every question against these patterns and
rewrite any that match: "would you", "could you see", "do you think", "how likely",
"if there were", "imagine", "would it help", "how much would you pay", "¿usarías?",
"¿pagarías?", "¿te gustaría?", "¿crees que?", "¿estarías dispuesto?", "¿si
existiera?". Rewrite them into the past: "how much would you pay for X" becomes "what
do you pay today for the software you use for Y, and who decided on it?".

Also write, per question, 1–2 follow-ups ("¿y qué pasó después?", "¿cuánto os costó?")
and what answer would weaken the assumption, so the interviewer notices it in the
moment.

## 5. Write the kit

Write `kit.md`:

```markdown
# Interview kit · <Account name> · <YYYY-MM-DD>

- Language: <es|en> · Follow-up of: <link to earlier synthesis, or "first call">
- Focus: <A#, A#> — <one line on why these>

## Account snapshot

<5–10 bullets, each with its source link: focus, size, services and prices, tools,
review signals. End with "Not found: …" for what you looked for and couldn't find.>

## What we expect to hear

<One line per focus assumption: what we expect, and what would surprise us. Written
down so a surprise gets noticed rather than explained away.>

## Rules for the call

- Ask about the past, never the future. When they drift into "we would…", bring them
  back: "¿y la última vez que pasó, qué hicisteis?"
- Don't pitch the product until the questions are done. Compliments and "sounds great"
  are not data.
- Ask for numbers and dates. Let silences run.
- Write down exact words when they say something surprising.

## Questions

### 1. <question in the interview language>

- Tests: <A# ±> · Why here: <one line tied to the account snapshot>
- Follow-ups: <1–2>
- Weakens <A#> if: <what answer>

<…8–10 in total…>

## Closing

- "¿Hay algo que debería haberte preguntado y no he preguntado?"
- A real next step that costs them something, to test commitment: an introduction to
  another prospect, a second call with a colleague, or trying a pilot with their own users.
  Write down exactly what they agree to, or decline.
```

The closing lines are in the interview language.

## 6. Save

Commit and push per **Saving your work**, with the message
`[discovery] Interview kit for <Account name>`. Reply with the full kit (it's needed
for the call) and the PR URL.
