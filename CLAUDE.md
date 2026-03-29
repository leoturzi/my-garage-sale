# My Garage Sale — Rules

## Workflow rules

- Run `nvm use` before running any commands (Node 22 required).
- Use the **Session pooler** connection string for Supabase, not the direct connection (IPv6-only, won't resolve on most networks). Find it in the dashboard via **Connect** → **Session mode**.

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
