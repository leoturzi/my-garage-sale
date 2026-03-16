# My Garage Sale — Project Plan

## Goal

A clean, fast-loading public storefront for selling clothes and sneakers, backed by Payload CMS v3 for content management, with Supabase as the database and storage layer.

---

## CMS: Payload CMS v3

After evaluating the options (Strapi, Directus, Keystatic, Sanity, React Admin), **Payload CMS v3** is the right fit for this project.

Why:
- **Embeds directly into the Next.js app** — no second process, no Docker. One `next dev` runs both `/admin` and the public site.
- **Native Postgres adapter** — official Supabase integration via `@payloadcms/db-postgres`.
- **Image uploads to Supabase Storage** — via `@payloadcms/storage-s3` (Supabase exposes an S3-compatible API).
- **Built-in auth** — admin is password-protected and accessible from anywhere, including mobile. Mark items as sold right after a sale from your phone.
- **TypeScript-first** — collections are code files, version-controlled, no vendor lock-in.

---

## Architecture

```
┌──────────────────────────────────────┐
│  One Next.js app (deployed to Vercel)│
│                                      │
│  /admin  ──▶  Payload CMS (authed)   │
│  /        ──▶  Public storefront     │
└────────────────┬─────────────────────┘
                 │ read/write
         ┌───────▼────────┐
         │   Supabase     │
         │  Postgres DB   │
         │  Storage (S3)  │
         └────────────────┘
```

- Single Next.js app deployed to Vercel.
- `/admin` is Payload's admin panel — password-protected, accessible from anywhere (laptop, phone).
- Public site reads content via Payload's local API (zero HTTP overhead in server components).
- Supabase holds all data (products, categories, hero) and all media (images).

---

## Decisions

| Topic | Decision |
|---|---|
| Purchase flow | WhatsApp link per product, pre-filled with product name + description |
| Sold items | Keep visible with a "SOLD" badge; available items listed first |
| Pricing | Show price publicly on each product |
| Admin access | Payload built-in auth — deployed to Vercel, accessible from anywhere |
| Hosting | Vercel (public site + admin) + Supabase (DB + Storage) |

---

## Data Model (Payload Collections)

### `categories` collection
| field | type | notes |
|---|---|---|
| name | text | e.g. "Sneakers", "Jackets" |
| slug | text (auto) | URL-safe, auto-generated from name |
| cover_image | upload (Media) | Stored in Supabase Storage |
| sort_order | number | Controls display order on homepage |

### `products` collection
| field | type | notes |
|---|---|---|
| name | text | |
| brand | text | Optional — works for any product type |
| category | relationship | → categories |
| description | textarea | Used in WhatsApp message pre-fill |
| price | number | Displayed publicly |
| condition | select | "New", "Like new", "Good", "Fair" |
| size | text | Free-form ("M", "42", "XL", "15 inch") — optional |
| images | upload (Media, many) | Multiple photos |
| tags | select (many) | "Sale", "Offer", "New arrival", "Last chance" — shown as badges |
| details | array | Key/value pairs for flexible specs (e.g. Color: White, RAM: 16GB) |
| status | select | "available" \| "sold" |

### `media` collection (Payload built-in upload)
Handles all image uploads. Files land in Supabase Storage via the S3 adapter.

### `hero` global (singleton)
| field | type | notes |
|---|---|---|
| title | text | Main headline |
| subtitle | text | Supporting line |
| cta_label | text | Button text |
| cta_link | text | Button destination (e.g. "#categories") |
| background_image | upload (Media) | |

### `settings` global (singleton)
| field | type | notes |
|---|---|---|
| whatsapp_number | text | Your WA number in international format |
| store_name | text | Displayed in header/meta |

---

## WhatsApp Link Format

Each product will have a "Contact on WhatsApp" button that opens:

```
https://wa.me/{whatsapp_number}?text=Hi!%20I'm%20interested%20in%3A%20{product_name}%20-%20{brand}%20(Size%3A%20{size}%2C%20{price})
```

This is generated at render time in the server component — no API call needed.

---

## Site Pages

### `/` — Landing page
- Hero section (from `hero` global)
- Category grid with cover images

### `/[categorySlug]` — Category page
- Product grid for that category
- Available items first, sold items at the bottom with "SOLD" badge overlay
- Each card shows: image, name, brand, size, condition, price, WA button

### `/[categorySlug]/[productId]` — Product detail *(Phase 2)*
- Full image gallery
- Full description
- WhatsApp CTA

---

## Project Structure

```
my-garage-sale/
├── app/
│   ├── (payload)/                  # Payload admin routes
│   │   ├── admin/[[...segments]]/  # Admin UI pages
│   │   ├── api/[...slug]/          # REST/GraphQL API
│   │   ├── layout.tsx              # Payload root layout (own <html>)
│   │   └── custom.scss
│   └── (site)/                     # Public storefront
│       ├── layout.tsx              # Site root layout (own <html>)
│       ├── globals.css
│       ├── page.tsx                # Landing page
│       └── [category]/
│           └── page.tsx            # Category page
├── collections/
│   └── Users.ts                    # Admin auth (registered)
├── payload.config.ts
├── .env.local                      # DB URI, Payload secret (never committed)
└── next.config.ts                  # Wrapped with withPayload()
```

---

## Environment Variables

```bash
# Supabase
DATABASE_URI=postgresql://...        # Supabase Postgres connection string
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=...

# Supabase Storage (S3-compatible)
S3_BUCKET=garage-sale-media
S3_ACCESS_KEY_ID=...
S3_SECRET_ACCESS_KEY=...
S3_ENDPOINT=https://xxx.supabase.co/storage/v1/s3
S3_REGION=eu-central-1              # Match your Supabase region

# Payload
PAYLOAD_SECRET=...                  # Random string, used to sign tokens
```

---

## Phased Rollout

### Phase 1 — MVP

| # | Task | Description |
|---|---|---|
| 1 | ~~Scaffold Next.js + Payload CMS v3 app~~ | ✅ Done — Next.js 15.4.11 scaffolded with Tailwind CSS. |
| 2 | ~~Connect Payload to Supabase Postgres~~ | ✅ Done — Payload CMS v3 installed, wired to Supabase Postgres via `@payloadcms/db-postgres`. Admin panel live at `/admin`, first user registered. Schema auto-synced via Drizzle `push`. |
| 3 | ~~Configure Supabase Storage (S3)~~ | ✅ Done — `@payloadcms/storage-s3@3.79.0` installed, `collections/Media.ts` created, S3 plugin configured in `payload.config.ts` with `forcePathStyle: true`. `garage-sale-media` bucket created (public) in Supabase Storage. S3 env vars added to `.env.local` — user needs to fill in access keys from Supabase dashboard. |
| 4 | ~~Define collections: Media, Categories, Products~~ | ✅ Done — `collections/Categories.ts` and `collections/Products.ts` created with all fields, access control, and slug auto-generation hook. Registered in `payload.config.ts`. |
| 5 | ~~Define globals: Hero, Settings~~ | ✅ Done — `globals/Hero.ts` and `globals/Settings.ts` created and registered in `payload.config.ts`. |
| 6 | Build landing page | `(site)/page.tsx` — hero section + category grid via Payload local API. |
| 7 | Build category page | `(site)/[category]/page.tsx` — product grid, available-first, sold badge, WhatsApp button per product. |
| 8 | Smoke-test CMS with admin user | Create first admin user, add a category + product with image, verify public site renders correctly. |
| 9 | Deploy to Vercel | Push to GitHub, create Vercel project, add all env vars, verify `/admin` and public site on live URL. |

### Phase 2 — Polish
- [ ] Product detail page with image gallery
- [ ] Mobile layout refinement
- [ ] Sort / filter by condition or size on category page

### Phase 3 — Optional
- [ ] Payload `afterChange` hook → Vercel deploy webhook (instant revalidation when marking sold)
- [ ] Vercel Analytics
