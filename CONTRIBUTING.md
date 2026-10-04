# Contribution Guidelines

Below you will find the minimal steps you should follow before contributing to this project.
These should be enough to guide any newcomer on their first contribution.
If you find something that you think could be useful in this file, please don't hesitate opening an issue so we can address it.

## Ubiquitous Language

This is the set of key terms that we'll use through the project (source code, documentation sites, databases...).
A single dictionary helps us (developers and users) staying on the same page.
**Use these words rigorously**. You can find it at [GLOSSARY.md](GLOSSARY.md).

## Issues

Shall you find a bug in the product that should be fixed, or perhaps a new feature it could be interesting to implement?

GitHub issues are the main form of communication between the product owners, developers and agents.
If you are on any of the escenarios mentioned above, feel free to create a new one.
But first, make sure you follow these:

- Search for potential preexisting issues about your topic. If so, do not create a new one, but add context to the existing one if needed.
- Please use the issue templates. Templates are designed to be well understood by humans and development agents, with a clear structure for proble statements, solutions, steps to reproduce or acceptance criterias.
- If the issue was created by a coding agent, it should state so at the bottom line.
- If the issue was created by a coding agent, it must add a bottom line describing the best model of the agent's suite to address it.
- If applies, provide context that might not be straightforward just from the issue description. This could be helpful for debugging.

## Git

There is a minimal `git` configuration required. We need to know who contributors are
If your contribution involves source code changes, please make sure that:

- You have configured your user name and email.
- If possible, sign your commits.
- If the contribution was made by a coding agent, it must include a `Co-authored-by`, including the agent name and email.

Now, in terms of commit messages, we're not very restrictive. The only points to take into account here are:

- If you are submitting a big change, please think about splitting it into unitary, independent commits. So the review process is easier to follow. We even suggest you to open multiple PRs if that helps the process.
- Write meaningful messages. We strongly suggest following [this article](https://cbea.ms/git-commit/#seven-rules) if this is your very first time contributing to an OSS project.
- Always include the affected module in the commit message. Like this: `[webapp] Improved the NoteCard component`.

## Pull Requests

Every pull request should be linked to an existing issue, however this is not mandatory.
If the pull request is not associated to an issue, make sure the PR body contains enough context, motivation, proposal details, etc.

**Open your PR as a draft**, and mark it ready for review only once the branch builds locally:

```sh
gh pr create --draft --base develop
# ... then, when it is green locally:
gh pr ready
```

This is not ceremony. On a private repository every CI minute is billed against a finite
monthly allowance, and the `verify-` workflows below do not run at all while a PR is a draft.
Iterating in draft costs nothing; iterating in a ready PR costs a full build per push.

## Branching Strategy

When contributing with features, bugfixes, or any other code contribution type, just name the branch after the issue type and purpose.
For example `feat/improve-NoteCard-component`. If there's a specific issue that this branch resolves, or it is related to, include the issue
 identifier in the branch name (i.e. `feat/#1234-improve-NoteCard-component`) so it'll be easy to link them.

### `develop`

This is the main development branch, this has all of the most recent changes. This means that if you're going to contribute, you'll want to create your branch **from** this one and **to** this one.

The merge strategy for the PRs made to this branch is **squash**. This way, we end up with just one commit per contribution.

### `main`

**TL;DR**: the latest commit of this branch should point to the latest productive release. And this branch should contain only released commits.

The merge strategy for the PRs made to this branch is **merge**. This way we do not lose track of the contributions commits.

## Code Review

Every PR will need be reviewed and approved before getting merged. Code review is a praxis we trust on. It keeps the whole team in the loop, helps supporters and team members grow personal and technically, helps sharing concerns and best practices, etc. We strongly suggest doing this in any mature project.

### `verify-` jobs

In addition to the code review, each PR will trigger a `verify-` workflow (slash job, slash step, you name it).
These CI pipelines will ensure that all contributions are buildable and reliable. You can think of it as a definition of done.

Two things to know about when they run:

- **Not while the PR is a draft.** They start when you mark it ready for review, and re-run on every
  push after that. Verify locally first (`mvn verify` for `server`, `npm run lint && npm run build`
  for `webapp`/`web`) so the first CI run is also the last one.
- **A new push cancels the run it supersedes**, so amending and force-pushing a ready PR will not
  leave three builds racing each other.
