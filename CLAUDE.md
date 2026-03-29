# My Garage Sale — Rules

## Workflow rules

- Run `nvm use` before running any commands (Node 22 required).
- Use different Supabase connection strings for local vs production:
  - **Local** (`.env.local`): **Session pooler** (port 5432) — Connect → Session mode.
  - **Production** (Vercel env vars): **Transaction pooler** (port 6543) — Connect → Transaction mode. Required for serverless: each Vercel function invocation creates its own pg-pool, and session mode exhausts connection limits under concurrent load.
  - Never use the Direct Connection (IPv6-only, won't resolve on most networks).

## Task workflow

### Trello board

All tasks live on the Trello board (ID: `kKHQBiTG`). Lists:

| List | ID |
|------|----|
| Submitted | `69c8304dccdffe02a9f7d342` |
| Backlog | `69c8304e3a5e6e9e833dd4cf` |
| In Progress | `69c8304f645772d231998691` |
| Done | `69c830501c94674b620bf2a1` |

Use the `trello-api` skill for all board operations. Credentials (`TRELLO_API_KEY`, `TRELLO_TOKEN`) are in `.env.local`.

### Per task

1. **Pick the task** — read the card in Backlog for technical details.
2. **Move card to In Progress** — update `idList` to the In Progress list ID.
3. **Sync with develop** — always `git checkout develop && git pull` before starting any work (new branch or existing).
4. **Create or rebase branch** — new task: branch from up-to-date `develop`. Existing branch: `git rebase develop`. Use worktrees for parallel work.
5. **Plan** — outline the implementation approach.
6. **Implement** — write the code.
7. **Test** — verify changes work before committing.
8. **Update docs** — check if your changes trigger a doc update (see checklist below).
9. **Push + open PR** — push the branch and create a PR to `develop` (not `main` — pushes to main trigger a production deploy).
10. **Move card to Done** — once the PR is merged, move the card to Done.

### New tasks discovered during work

If you identify a new task while working (bug, missing feature, follow-up), create a card in **Backlog** before starting on it. Do not fix things silently without a card.

### Parallel vs sequential

- **Independent tasks** (no shared files/dependencies): run in parallel using worktrees, one branch per task.
- **Dependent tasks** (sequential chain): complete and merge the dependency first, then start the next task.

### Branch model

- `main` → production deploy triggers on every push. **Never push feature/fix work directly to main.**
- `develop` → integration branch. All feature/fix PRs target `develop`.
- `feat/*` / `fix/*` → short-lived task branches, always cut from `develop`.
- To release: open a PR from `develop` → `main`.

### Critical: always sync before any work

Never start work — on a new branch OR an existing one — without pulling `develop` first. For existing branches, rebase on `develop` to pick up merged changes. Stale branches cause merge conflicts and missed fixes.

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
