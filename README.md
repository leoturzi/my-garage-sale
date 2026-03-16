# My Garage Sale

A clean, fast-loading public storefront for selling clothes and sneakers.

**Stack:** Next.js 15 · Payload CMS v3 · Supabase (Postgres + Storage) · Tailwind CSS · Vercel

---

## Getting Started

Requires **Node.js 22** (see `.nvmrc`).

```bash
nvm use           # switches to Node 22
npm install
npm run dev
```

- Public site: [http://localhost:3000](http://localhost:3000)
- Admin panel: [http://localhost:3000/admin](http://localhost:3000/admin)

Copy `.env.local.example` to `.env.local` and fill in your Supabase and Payload credentials before running.

---

## Project Structure

```
app/
├── (payload)/          # Payload CMS admin + API routes (own layout)
│   ├── admin/          # Admin UI
│   └── api/            # REST API
└── (site)/             # Public storefront (own layout)
collections/            # Payload collection definitions
payload.config.ts       # Payload config (DB, collections, editor)
next.config.ts          # Wrapped with withPayload()
```

Each route group has its own root layout (`<html>/<body>`) to avoid hydration conflicts between Payload's admin UI and the public site.

See `PLAN.md` for the full architecture, data model, and phased rollout plan.

---

## Gotchas

### Node.js 22 required

Payload CMS v3 requires Node.js 22+. The project includes an `.nvmrc` file — run `nvm use` to switch.

### Next.js version pinned to 15.4.11

Payload CMS v3 has a strict peer dependency on Next.js: `>=15.4.11 <15.5.0 || >=16.2.0-canary.10 <17.0.0`. The project is pinned to **15.4.11**.

When Payload releases support for a newer Next.js stable, upgrade both together.

### Payload migrations CLI vs push

For development, Payload uses Drizzle `push` (enabled by default) to auto-sync the schema on `next dev`. The `npx payload migrate` CLI has a known incompatibility with Node 22 + tsx (top-level await in ESM). For production migrations, use Node 20 to run the CLI.
