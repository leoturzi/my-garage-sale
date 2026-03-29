# My Garage Sale — Rules

## Workflow rules

- Run `nvm use` before running any commands (Node 22 required).
- Use the **Session pooler** connection string for Supabase, not the direct connection (IPv6-only, won't resolve on most networks). Find it in the dashboard via **Connect** → **Session mode**.

## Task workflow

### Per task

1. **Pick the task** — read the task description with technical details.
2. **Sync with main** — always `git checkout main && git pull` before starting any work (new branch or existing).
3. **Create or rebase branch** — new task: branch from up-to-date main. Existing branch: `git rebase main`. Use worktrees for parallel work.
4. **Plan** — outline the implementation approach.
5. **Implement** — write the code.
6. **Test** — verify changes work before committing.
7. **Update docs** — check if your changes trigger a doc update (see checklist below).
8. **Push + open PR** — push the branch and create a PR to `main`.

### Parallel vs sequential

- **Independent tasks** (no shared files/dependencies): run in parallel using worktrees, one branch per task.
- **Dependent tasks** (sequential chain): complete and merge the dependency first, then start the next task.

### Critical: always sync before any work

Never start work — on a new branch OR an existing one — without pulling `main` first. For existing branches, rebase on main to pick up merged changes. Stale branches cause merge conflicts and missed fixes.

## Keeping docs up to date

Before pushing, check if your changes match any trigger below. Update the relevant doc **in the same branch/PR** — do not defer to a later task.

### Doc update checklist

**Update `README.md`** (project overview) if you:
- Added/removed/renamed files, routes, pages, or API endpoints
- Changed the project structure tree
- Added new env vars or setup steps
- Changed the tech stack or dependencies

**Update `.claude/skills/project-context/SKILL.md`** (Claude context) if you:
- Changed access control patterns or auth behavior
- Changed the data model (new fields, relationships)
- Changed data fetching patterns (SSG, ISR, caching)
- Added/removed/renamed components, collections, or globals

Do not duplicate information that already lives in `README.md` — SKILL.md should reference the README for project overview and focus only on implementation details Claude needs to work autonomously.
