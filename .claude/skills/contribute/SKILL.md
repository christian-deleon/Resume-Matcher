---
name: contribute
description: Workflow for contributing changes (bug fixes, enhancements, features) to the upstream repo via a clean topic branch and PR.
argument-hint: "[commit hash or description of changes to contribute]"
disable-model-invocation: true
---

# Contribute to Upstream

## Usage

```
/contribute                         — interactive: ask which change to contribute
/contribute the bug fix             — contribute a specific change by description
/contribute fix for resume parser   — contribute a specific change by description
/contribute commit abc123           — contribute a specific commit by hash
```

When `$ARGUMENTS` is provided, use it to identify which committed changes to include.
Search the git log for commits matching the description and scope the
contribution to ONLY those commits.

If no arguments are provided, check `git log` for recent commits and ask
the user which one(s) they want to contribute.

Changes MUST be committed to the fork (origin) first before contributing.
If there are uncommitted changes, ask the user to commit them first.

## IMPORTANT: Never Assume Scope

Do NOT guess which files, commits, or changes belong to a contribution.

- If the description is vague or could match multiple changes, **ask the user to clarify**
- If a commit touches multiple unrelated things, **ask which parts to include**
- If unsure whether a file is part of the contribution, **ask — don't include it**
- Always confirm the final set of changes with the user before committing or pushing

## Prerequisites

Ensure remotes are configured:

```
git remote -v
```

- `origin` = personal fork
- `upstream` = srbhr/Resume-Matcher

If `upstream` is missing:

```
git remote add upstream https://github.com/srbhr/Resume-Matcher.git
```

Ensure pre-commit hooks are installed (required by upstream):

```
pip install pre-commit
pre-commit install
```

## Finding Issues to Work On

Check upstream for issues labeled `good first issue` or `help wanted`:

```
gh issue list --repo srbhr/Resume-Matcher --label "good first issue"
gh issue list --repo srbhr/Resume-Matcher --label "help wanted"
```

## Step-by-Step Workflow

```
WHEN contributing to upstream:

1. DETERMINE the contribution type
   - fix:      Bug fix
   - feat:     New feature or capability
   - refactor: Code improvement without behavior change
   - docs:     Documentation update
   - perf:     Performance improvement
   - chore:    Maintenance (deps, config, etc.)

2. FETCH latest upstream
   git fetch upstream

3. CREATE a topic branch off upstream/main
   Branch name: <type>/<short-description>
   Examples:
     git checkout -b fix/missing-resume-fields upstream/main
     git checkout -b feat/bulk-resume-export upstream/main
     git checkout -b refactor/simplify-llm-wrapper upstream/main

4. CHERRY-PICK the committed changes
   git cherry-pick <hash>
   - Only cherry-pick commits that are already on your fork
   - If a commit touches unrelated things, ask the user which parts to include,
     then manually re-apply only the relevant changes instead of cherry-picking
   - Do NOT include personal config files (Dockerfile.dev, docker-compose.dev.yml, justfile, op.env)

5. VERIFY the changes — ALL checks must pass BEFORE committing
   - Code compiles without errors
   - npm run lint passes (if frontend changes)
   - npm run format passes (if frontend changes)
   - black . passes (if backend changes — required by upstream)
   - Python functions have type hints (if backend changes)
   - UI changes follow Swiss International Style
   - Test your changes (required by upstream)
   - Do NOT commit until all verification steps pass

6. REBASE onto latest upstream/main
   git fetch upstream
   git rebase upstream/main

7. PUSH the topic branch
   git push origin <type>/<short-description>

8. CREATE the PR in DRAFT mode
   - Target: upstream/main (srbhr/Resume-Matcher)
   - Source: origin/<type>/<short-description>
   - Title: Short, under 70 characters
   - Body: Use the appropriate PR template below
   - ALWAYS use --draft so the user can review before marking ready
   - Use: gh pr create --repo srbhr/Resume-Matcher --draft

9. RETURN to previous branch
   git checkout -
```

## Rules

- **One logical change per branch, one branch per PR** — keeps reviews focused
- **Never include personal/local files** in upstream PRs
- **Always branch from `upstream/main`** — not from your personal branch
- **Always rebase before pushing** to avoid merge conflicts
- **Follow upstream project conventions** from .claude/CLAUDE.md (linting, type hints, style guide)
- **Run `black .`** on any Python changes (upstream uses Black for formatting)
- **Pre-commit hooks must pass** — they run automatically on commit if installed
- **Test before submitting** — upstream requires changes to be tested before PR
- **Always create PRs as drafts** — use `--draft` so you can review before marking ready
- **Changes must be committed to fork first** — never contribute uncommitted work

## PR Body Templates

### Bug Fix

```markdown
## Summary
- [1-2 sentences describing what was broken and what this fixes]

## Root Cause
- [Brief explanation of why the bug occurred]

## Changes
- [Bulleted list of what was changed]
```

### Enhancement / Feature

```markdown
## Summary
- [1-2 sentences describing what this adds or improves]

## Motivation
- [Why this change is useful]

## Changes
- [Bulleted list of what was changed]
```
