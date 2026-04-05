---
name: project-context
description: General context about the My Garage Sale project — architecture, tech stack, data model, components, data flow, and key gotchas. Use when starting work on the project or when you need architectural understanding.
user-invocable: true
allowed-tools: Read, Glob, Grep
---

# My Garage Sale — Implementation Context

> For project overview, tech stack, structure, and gotchas, read `README.md` first.

## Key Architectural Decisions

- **CMS will be deployed.** Payload CMS runs both locally and in production. The deployed site uses ISR (`revalidate = 60`) so content updates appear within ~60 seconds.
- **Sequential queries required.** `Promise.all` with many queries exceeds Supabase session pooler max clients. Run queries sequentially.
- **Select enum + contains:** Payload's `contains` operator does `ILIKE` which breaks on Postgres enum types. Filter `hasMany` select fields in JS instead.

## Data Model

### Collections

**Categories** (`collections/Categories.ts`)
- Fields: `name` (required), `slug` (auto-generated, unique), `cover_image` (→ Media), `sort_order`
- Default sort: `sort_order` ascending

**Products** (`collections/Products.ts`)
- Fields: `name`, `brand`, `category` (→ Categories, required), `description`, `price`, `condition` (select: new/like_new/good/fair), `size`, `images` (→ Media, hasMany), `tags` (select hasMany: sale/offer/new_arrival/last_chance), `details` (array of label/value), `status` (available/sold)
- Default sort: `-createdAt`

**Media** (`collections/Media.ts`)
- Fields: `alt` (required)
- Image sizes: `thumbnail` (400x300), `card` (768x1024)
- Storage: S3 adapter → Supabase Storage

**Users** (`collections/Users.ts`)
- Auth-enabled, fields: `role` (select: admin/editor, default editor)
- `access.admin`: only `admin` role can access the Payload admin panel
- CRUD: read/create/delete admin-only, update allows self-update or admin
- Field-level access: only admins can create or update the `role` field

### Globals (singletons)

**Hero** (`globals/Hero.ts`) — `title`, `subtitle`, `cta_label`, `cta_link`, `background_image` (→ Media)

**Settings** (`globals/Settings.ts`) — `store_name`, `whatsapp_number`, `logo_desktop` (→ Media), `logo_mobile` (→ Media)

**SiteContent** (`globals/SiteContent.ts`) — CMS-managed site customization:
- `marquee` (group): `enabled` (checkbox), `messages` (array, max 3, each with `text`)
- `faq` (group): `sections` (array, each with `title`, `show_on_product_page` checkbox, `questions` array of `question`/`answer`)

## Components

All in `/components/`. Client components: `MobileMenu.tsx`, `ProductImages.tsx`, `Accordion.tsx`.

### Admin Components (`/components/admin/`)

| Component | Purpose |
|-----------|---------|
| AIImageGenerator | Drawer UI — upload model + product images, call Gemini API, preview/accept result |
| AIImageGeneratorField | Thin `ui` field wrapper for Payload field registration |

API route: `app/(payload)/api/generate-image/route.ts` — server-side Gemini proxy (admin-only, with prompt length limit, MIME whitelist, and base64 size cap).

### Site Components

| Component | Purpose |
|-----------|---------|
| AnnouncementBar | Dark bar with CSS marquee scrolling messages (driven by SiteContent global, falls back to translations) |
| Header | Sticky header, store name, desktop nav, wraps MobileMenu |
| MobileMenu | Hamburger toggle + slide-out overlay (client) |
| Footer | Store name, WhatsApp link, copyright |
| HeroSection | Full-width bg image, title, subtitle, CTA |
| SectionHeader | Reusable: title left + optional CTA link right |
| Badge | Pill badge (sale=red, sold=red, new=green, condition=gray) |
| CategoryCard | Cover image with gradient overlay, "Shop Now" link |
| CategoryGrid | "Shop by Category" — 2-col mobile / 4-col desktop |
| ProductCard | Image, badges, brand, name, condition, size, price |
| ProductGrid | Reusable grid — 2-col mobile / 5-col desktop |
| ValueProps | 4 hardcoded trust items (landing page) |
| SpotlightSection | 3 large featured category cards |
| BrandMarquee | CSS marquee with brand names |
| Breadcrumbs | Breadcrumb nav trail (Home > Category > Product) |
| ProductImages | Infinite image carousel with thumbnails + mobile swipe (client) |
| ProductInfo | Product brand, name, badges, price, Add to Cart / Purchase Now buttons |
| TrustBadges | 4 compact trust icons for PDP |
| Accordion | Reusable collapsible sections (client) |
| ReviewCard | Single customer review card (name, stars, text, date) |
| ReviewsSection | Store-wide reviews grid (hardcoded) |
| FAQSection | FAQ accordion — accepts `sections` prop from SiteContent global (grouped by section title, filterable by `show_on_product_page`) |

## Access Control

- Shared helper: `lib/access.ts` exports `isAdmin` — checks `req.user?.role === 'admin'`
- All collection CUD (create/update/delete) restricted to admin role via `isAdmin`
- Public read access (`read: () => true`) on all collections and globals
- Global updates (Hero, Settings, SiteContent) restricted to admin
- Admin panel access restricted to admin role via `access.admin` on Users collection
- Only admins can change the `role` field (field-level access)

## Data Fetching

- All public pages use ISR with `revalidate = 60` (content updates within ~60s)
- Dynamic routes use `dynamicParams = true` (new items render on-demand)
- `lib/payload.ts` exports `getPayloadClient()` — factory for Payload local API
- `lib/types.ts` — TypeScript interfaces (Media, Category, Product, HeroData, SettingsData)
- Layout fetches: `settings` global + `categories` collection (for nav)
- Home page fetches: `hero` global, `categories`, `justAdded` products, `allProducts` (then filters sale/offer in JS)
- PDP fetches: product by ID, category, related products (same category), recent products, settings

## Image Strategy

| Context | Size Used | `next/image` sizes |
|---------|----------|-------------------|
| Hero bg | Original | `100vw`, priority |
| Category cards | `card` (768x1024) | `(max-width: 640px) 50vw, 25vw` |
| Spotlight cards | `card` (768x1024) | `(max-width: 640px) 100vw, 33vw` |
| Product cards | `thumbnail` (400x300) | `(max-width: 640px) 50vw, 20vw` |
| PDP carousel | `card` (768x1024) | `50vw` desktop, `100vw` mobile |
| PDP thumbnails | `thumbnail` (400x300) | `80px` |

Images served from: `https://seswpytxueftfgvipzcb.supabase.co/storage/v1/object/public/garage-sale-media/...`

## Trello Board

Board ID: `kKHQBiTG`

| List | ID | Description |
|------|----|-------------|
| Submitted | `69c8304dccdffe02a9f7d342` | New feature requests or bug reports, not yet reviewed |
| Backlog | `69c8304e3a5e6e9e833dd4cf` | Triaged and accepted, waiting to be picked up |
| In Progress | `69c8304f645772d231998691` | Actively being worked on |
| Done | `69c830501c94674b620bf2a1` | Completed and shipped |

Credentials (`TRELLO_API_KEY`, `TRELLO_TOKEN`) are in `.env.local`. See `trello-api` skill for API usage.

## CSS Theme

Defined in `app/(site)/globals.css`:
- Light-only (no dark mode)
- Color tokens: `--accent` (black), `--muted` (gray), `--sale`/`--sold` (red), `--new` (green), `--surface` (light gray)
- `@keyframes marquee` for announcement bar + brand marquee
- Font: Geist Sans
