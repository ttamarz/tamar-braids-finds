# Editable stylists with admin panel

Replace the hard-coded stylist data with a real database you control from an admin page protected by email/password login. The public homepage, search, and city pages all read from the same database.

## 1. Enable Lovable Cloud

Turn on Lovable Cloud (database + auth + storage). This is the backend for everything below — no external accounts needed.

## 2. Database

Create one table:

**`stylists`**
- `id` (uuid, primary key)
- `name` (text)
- `city` (text) — e.g. "Amsterdam", "Rotterdam"
- `instagram_url` (text)
- `image_url` (text) — pasted URL
- `rating` (numeric, 0–5)
- `reviews_count` (integer)
- `price_min` (integer, EUR)
- `price_max` (integer, EUR)
- `specialties` (text array) — e.g. ["Box Braids", "Knotless"]
- `bio` (text)
- `created_at` (timestamptz)

**Security (RLS):**
- Anyone (anon + authenticated) can `SELECT` — the public site needs to read.
- Only authenticated users can `INSERT` / `UPDATE` / `DELETE` — that's you, once logged in.

**Seed:** insert the ~11 current placeholder stylists so the site isn't empty on first load. You can edit or delete each from the admin page.

## 3. Auth (email + password)

- Add a single sign-in page at `/admin/login`.
- Email/password only — no Google, no signup link in the UI (you'll create your account once via the Cloud user panel, or via a one-time signup screen we hide afterwards).
- Logging in unlocks `/admin`. Logging out returns to the public site.

## 4. Admin page `/admin/stylists` (protected)

- Table/list of all stylists with: photo thumb, name, city, rating, edit + delete buttons.
- "Add stylist" button opens a form (same form used for edits) with every field from section 2 plus:
  - Specialties: tag input (type + enter, comma-separated)
  - Price range: two number inputs (min / max EUR)
  - Image URL: text field with a live preview thumbnail
- Form uses react-hook-form + zod validation (Instagram URL format, rating 0–5, price_min ≤ price_max, required fields).
- Delete shows a confirm dialog.
- Toast notifications on success/error.

## 5. Public site reads from the database

- Homepage "Search results" grid: fetch all stylists from DB, run the existing client-side search filter against this live list (name / city / specialties / bio).
- City pages (`/city/$citySlug`): fetch stylists filtered by `city` matching the city name.
- Popular city chips and "Browse by style" circles keep working — they just set the same search query.
- Remove `src/data/cities.ts` braider arrays; keep only the city name list (used for chips + city page routes).

## 6. Header

Add a small "Admin" link in the header that goes to `/admin/stylists` when logged in, or `/admin/login` when not.

---

### Technical notes

- TanStack Start server functions (`createServerFn`) for all DB reads/writes. Public reads use a public server fn with `supabaseAdmin` + safe column projection; writes use `requireSupabaseAuth`.
- Loader pattern: `ensureQueryData(stylistsQueryOptions)` in route loader, `useSuspenseQuery` in component.
- Protected admin routes live under `src/routes/_authenticated/admin.stylists.tsx` using the integration-managed auth gate.
- Image uploads are out of scope — image is a pasted URL string only.
- No changes to fonts, colors, hero layout, or visual identity.

### Out of scope

- Image file uploads (URL only, per your choice).
- Multi-user roles — single admin account.
- Approval workflow for the "For Stylists" public submission form (still saves nowhere; that's a follow-up).
