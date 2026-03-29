# My Garage Sale — Rules

## Workflow rules

- Run `nvm use` before running any commands (Node 22 required).
- Use the **Session pooler** connection string for Supabase, not the direct connection (IPv6-only, won't resolve on most networks). Find it in the dashboard via **Connect** → **Session mode**.

## Task workflow

### Per task

1. **Pick the task** — read the task description with technical details.
2. **Pull fresh main** — always `git checkout main && git pull` before creating a branch.
3. **Create branch** — branch from up-to-date main. Use worktrees for parallel work.
4. **Plan** — outline the implementation approach.
5. **Implement** — write the code.
6. **Test** — verify changes work before committing.
7. **Push + open PR** — push the branch and create a PR to `main`.

### Parallel vs sequential

- **Independent tasks** (no shared files/dependencies): run in parallel using worktrees, one branch per task.
- **Dependent tasks** (sequential chain): complete and merge the dependency first, then start the next task.

### Critical: always pull before branching

Never create a feature branch without pulling `main` first. Stale branches cause merge conflicts on PRs.

## Keeping docs up to date

After any task that changes the project's structure, update the relevant doc:

### `README.md` (source of truth for project overview)

Update when:
- Adding/removing/renaming routes, pages, or API endpoints
- Changes to the project structure tree
- New gotchas or setup steps
- Changes to the tech stack or dependencies

### `.claude/skills/project-context/SKILL.md` (deep context for Claude)

Update when:
- Adding/removing/renaming components, collections, or globals
- Changing the data model (new fields, new relationships)
- Changes to data fetching patterns, image strategy, or CSS theme

Do not duplicate information that already lives in `README.md` — SKILL.md should reference the README for project overview and focus only on implementation details Claude needs to work autonomously.
