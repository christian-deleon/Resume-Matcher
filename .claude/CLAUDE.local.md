# Personal Context

## Purpose

This is my personal fork of Resume Matcher. I use it for:

1. **Personal use** — tailoring my own resumes to job descriptions
2. **Open source contributions** — fixing bugs and submitting PRs to upstream

## Workflow

- Personal changes stay on my branch and are NOT submitted upstream
- Bug fixes and enhancements each get their own topic branch off `upstream/main` for clean PRs
- Use `/contribute` skill to submit changes upstream (creates draft PRs)
- Files like Dockerfile.dev, docker-compose.dev.yml, justfile, op.env are personal dev setup — do not include in upstream PRs
- Commit changes to the fork first, then cherry-pick onto topic branches for upstream PRs

## Upstream Contribution Rules

- **Never commit to an upstream topic branch until changes are fully tested**
- Run `npm run lint` and `npm run format` (frontend changes)
- Run `black .` (backend changes)
- Pre-commit hooks must pass
- All upstream PRs are created as drafts for review before marking ready
- Follow upstream CONTRIBUTING.md: test changes before submitting

## Commit Style

Use [Conventional Commits](https://www.conventionalcommits.org/) for all commit messages.

Format: `<type>(<scope>): <description>`

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `build`, `ci`, `perf`

Examples:
- `fix(backend): handle missing resume fields in parser`
- `feat(frontend): add job description paste support`
- `chore: update .gitignore for local claude config`

## Task Runner

Always prefer using `just` recipes from the `justfile` when available. Run `just --list` to see available recipes before falling back to raw commands.

## Remotes

- `origin` — my fork
- `upstream` — srbhr/Resume-Matcher (the original repo)
