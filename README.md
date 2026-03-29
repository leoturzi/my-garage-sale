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
├── (payload)/                          # Payload CMS admin + API routes (own layout)
│   ├── admin/                          # Admin UI
│   └── api/
│       ├── [...slug]/                  # Payload REST API (auto-generated)
│       └── generate-image/             # AI image generation endpoint (Gemini)
└── (site)/                             # Public storefront (own layout)
    ├── page.tsx                        # Landing page
    └── categories/
        ├── page.tsx                    # All categories listing
        ├── [slug]/page.tsx             # Products in a category
        └── [slug]/[productId]/page.tsx # Product detail page (PDP)
collections/            # Payload collection definitions (Categories, Products, Media, Users)
globals/                # Payload globals (Hero, Settings)
components/             # UI components (site + admin)
lib/                    # Payload client, types, access helpers
payload.config.ts       # Payload config (DB, collections, editor)
next.config.ts          # Wrapped with withPayload()
```

Each route group has its own root layout (`<html>/<body>`) to avoid hydration conflicts between Payload's admin UI and the public site.

---

## Gotchas

### Node.js 22 required

Payload CMS v3 requires Node.js 22+. The project includes an `.nvmrc` file — run `nvm use` to switch.

### Next.js version pinned to 15.4.11

Payload CMS v3 has a strict peer dependency on Next.js: `>=15.4.11 <15.5.0 || >=16.2.0-canary.10 <17.0.0`. The project is pinned to **15.4.11**.

When Payload releases support for a newer Next.js stable, upgrade both together.

### Supabase direct connection is IPv6-only

The default Supabase direct connection string (`db.<ref>.supabase.co`) uses IPv6. Most local networks and platforms like Vercel are IPv4-only, so DNS won't resolve it. Use the **Session pooler** connection string instead. Find it in the Supabase dashboard via the **Connect** button at the top → select **Session mode**.

### Payload migrations CLI vs push

For development, Payload uses Drizzle `push` (enabled by default) to auto-sync the schema on `next dev`. The `npx payload migrate` CLI has a known incompatibility with Node 22 + tsx (top-level await in ESM). For production migrations, use Node 20 to run the CLI.

---

## Deployment

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URI` | Yes | Supabase Postgres connection string (use **Session pooler**) |
| `PAYLOAD_SECRET` | Yes | Secret key for Payload CMS authentication |
| `S3_BUCKET` | Yes | Supabase Storage bucket name |
| `S3_ACCESS_KEY_ID` | Yes | Supabase Storage access key |
| `S3_SECRET_ACCESS_KEY` | Yes | Supabase Storage secret key |
| `S3_REGION` | Yes | Supabase Storage region |
| `S3_ENDPOINT` | Yes | Supabase Storage endpoint URL |
| `NEXT_PUBLIC_SITE_URL` | Yes | Public URL of the deployed site (used for CORS, CSRF, OG metadata) |
| `GEMINI_API_KEY` | No | Google Gemini API key (only needed for AI image generation) |

All required variables are validated at startup — the app will throw if any are missing.

### Vercel Setup

1. Connect the GitHub repo to a Vercel project.
2. Set all environment variables above in the Vercel dashboard.
3. Ensure the build command is `npm run build` and output directory is `.next`.
4. Deploy — Vercel handles the rest.

### Security Model

- **Admin panel** (`/admin`): restricted to users with `role: admin`.
- **Collections**: all create/update/delete operations require admin role. Public read is open.
- **Globals**: updates require admin role.
- **REST API** (`/api/*`): enforces the same collection-level access controls.
- **AI image generation** (`/api/generate-image`): admin-only, with prompt/MIME/size validation.
- **CORS/CSRF**: configured to allow only `NEXT_PUBLIC_SITE_URL` and `localhost:3000`.
- **Security headers**: CSP, HSTS, X-Frame-Options, etc. Split policy for public vs admin routes.
- **ISR**: public pages revalidate every 60 seconds — content updates appear without a full rebuild.
