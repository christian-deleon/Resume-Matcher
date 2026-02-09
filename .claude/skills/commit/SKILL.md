---
name: commit
description: Categorize all uncommitted changes into logical buckets and commit each one separately using conventional commits.
argument-hint: "[description of changes to commit]"
disable-model-invocation: true
---

# Smart Commit

## Usage

```
/commit                — analyze all changes, bucket them, and commit each bucket
/commit just backend   — only commit backend-related changes
/commit the dialog fix — only commit changes matching the description
```

When `$ARGUMENTS` is provided, scope the analysis to only changes matching
the description. If the description is vague or matches multiple unrelated
changes, ask the user to clarify.

If no arguments are provided, analyze ALL uncommitted changes.

## Autonomy

Use best judgment to bucket and commit changes without prompting for approval.
Only ask the user if the description provided is too vague to determine scope.

## Step-by-Step Workflow

```
1. GATHER all uncommitted changes
   git status
   git diff
   git diff --staged

2. ANALYZE each changed file
   - What type of change is it? (fix, feat, refactor, docs, style, chore, etc.)
   - What scope does it belong to? (backend, frontend, config, docs, etc.)
   - What is the logical purpose of the change?

3. BUCKET changes into logical groups
   Group files that:
   - Solve the same bug
   - Implement the same feature
   - Belong to the same refactor
   - Are part of the same config/chore update
   Each bucket = one commit. Never mix unrelated changes in a bucket.

4. COMMIT each bucket
   For each bucket:
   a. Stage ONLY the files in that bucket (git add <specific files>)
   b. Commit with a conventional commit message
   c. Never use git add -A or git add .

6. SHOW the results
   Run git log --oneline to show the new commits with their hashes.
   Remind the user they can use /contribute <hash> to submit any of
   these commits upstream.
```

## Bucketing Rules

### Group Together
- Frontend component + its styles if changed for the same reason
- Backend router + service + schema changes for the same endpoint
- Multiple files touched by the same bug fix
- Related config file changes (e.g., updating deps across package files)

### Keep Separate
- Bug fixes vs. feature additions — always separate commits
- Frontend vs. backend changes — separate unless tightly coupled
- Code changes vs. documentation — separate commits
- Personal config files (Dockerfile.dev, docker-compose.dev.yml, justfile, op.env) — their own bucket, never mixed with code changes
- Formatting/lint fixes — separate from logic changes

### Commit Message Format

Use conventional commits: `<type>(<scope>): <description>`

**Subject line only** (no conversation context about the change):
- `fix(backend): handle missing resume fields in parser`
- `chore: update .gitignore for local claude config`

**Subject + body** (conversation context exists about the issue, feature, or motivation):
When the conversation leading up to `/commit` discusses an issue, feature,
bug, or any context explaining *why* the change was made, include a commit
body separated by a blank line. Pull the context from the conversation —
do not ask the user to re-explain.

```
fix(backend): handle missing resume fields in parser

The parser crashed when optional fields (certifications, volunteer) were
absent from uploaded PDFs. Default to empty lists so downstream enrichment
can proceed without errors.
```

```
feat(frontend): add job description paste support

Users needed a way to paste raw job description text instead of only
uploading files. Adds a textarea to the tailor page with paste detection
and auto-formatting.
```

Keep the body concise (2-4 sentences). Focus on *why* the change was made
and any non-obvious decisions, not a line-by-line summary of *what* changed.

### Scope Guidelines

| Scope | When to use |
|-------|-------------|
| `backend` | Changes in `apps/backend/` |
| `frontend` | Changes in `apps/frontend/` |
| `routers` | API route changes |
| `services` | Business logic changes |
| `schemas` | Pydantic model changes |
| `ui` | Component/styling changes |
| `config` | Configuration file changes |
| `deps` | Dependency updates |
| _(omit)_ | Cross-cutting or root-level changes |
