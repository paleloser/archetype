# Discovery

Evidence for or against the assumptions the product is built on, collected before building
more. It's maintained by the `discovery` agent (`.claude/agents/discovery.md`) through
these skills:

| Skill | When | What it does |
| --- | --- | --- |
| `/discovery-listen` | Weekly | Searches public communities for pain signals, and logs them. |
| `/discovery-kit <account> [date=YYYY-MM-DD] [lang=<locale>]` | Before each call | Researches the account and drafts 8–10 past-behavior questions. |
| `/discovery-synth <notes or transcript>` | After each call | Extracts pains, workarounds, spend, objections and commitments, and logs them. |
| `/discovery-log [question or evidence]` | Anytime | Answers questions about the log, or adds evidence from somewhere else (a chat, an email). |
| `/discovery-digest` | Weekly, after listening | Top themes, what changed, which assumptions got stronger or weaker, what to ask next. |

A typical week: `/discovery-kit` and `/discovery-synth` around each call,
`/discovery-listen` and then `/discovery-digest` at the end of the week. `/discovery-digest`
runs the listening step itself if it hasn't run for the week.

## Files

- [`assumptions.md`](assumptions.md): the assumptions, what would confirm or kill each one, the
  test order and the segment taxonomy. **You own the statements and criteria**, and you're the
  one who marks an assumption confirmed or killed. The agent only proposes. `/product-setup`
  helps you write the first version.
- [`evidence.md`](evidence.md): the running evidence log.
- `interviews/<date>-<account>/`: `kit.md` and `synthesis.md` per call. Raw transcripts are
  never committed. People are named by role, not by name.
- `listening/<year>-W<week>.md`: weekly community listening reports.
- `digests/<year>-W<week>.md`: weekly digests.

## Where the work lands

Every run commits to the `discovery/log` branch and keeps one draft PR against the trunk
branch open. Merge it whenever you want to close a batch. The next run starts the branch
again from the trunk.
