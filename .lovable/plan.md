## Launch readiness — Tamar Finds

Scope: stability, polish, no redesign. No new features.

### 1. Admin permissions
- **Migration**:
  - Drop the `bootstrap_first_admin` function (and any trigger that calls it) so new signups never auto-promote.
  - Seed `public.user_roles` with an `admin` row for `tecletamar1@gmail.com` (lookup via `auth.users.email`, insert only if not exists, `ON CONFLICT DO NOTHING`).
- No code change needed to `has_role`, RLS, or admin UI — they already key off `user_roles`.
- Update the empty-state copy in `admin.stylists.tsx` from "first person to register becomes admin" to "Contact the site owner for admin access".

### 2. Listing form (`/my-listing`)
Required (add `required` to inputs + tighten Zod in `stylists.functions.ts`):
- name, city, email, instagram_url, specialties (≥1), bio (≥10 chars)

Optional (relax):
- image_url, price_min, price_max, booking_url

Zod changes in `stylistInput`:
- `email`: required email
- `instagram_url`: required URL
- `bio`: required, min 10
- `specialties`: min length 1
- `price_min`/`price_max`: default 0, optional
- Keep refine `price_max >= price_min`

UI: mark required fields with `*` and `required`; remove `required` from price fields.

### 3. Cities — free-text
- `my-listing.tsx`: city input already uses a `<datalist>` (free text allowed) — keep as is, just confirm.
- `index.tsx` search already filters across `s.city` text, so newly added cities are searchable.
- `citySlugFor` already falls back to `slugify(name)` so any city links work.
- `city.$citySlug.tsx`: when `getCity(slug)` returns undefined, derive a display city from the stylists matching that slug (use first matching stylist's `city`) instead of 404, with a generic tagline. Filter stylist list by `slugify(s.city) === params.citySlug`.

### 4. Navigation
- `SiteHeader` "Search" already links to `/#results`. Update it to also focus the search input: scroll to `#results` and dispatch focus on `#discover-search` (add that id to the input in `index.tsx`).
- Confirm `/saved` route loads saved stylists from localStorage (already implemented). No change unless bug found during smoke test.

### 5. Keep as-is
- Verified/Featured admin toggles, ownership RLS, `setStylistFlags`, `_authenticated` gate, CMS structure, stylist cards, colors, fonts.

### 6. Cleanup
- Delete: `src/routes/blog.index.tsx`, `src/routes/blog.$slug.tsx`, `src/data/blog.ts`.
- Remove any remaining links to `/blog` (none currently in SiteHeader, confirm in footer + index).
- Keep `/request-stylist` (it's wired in from the homepage CTA).
- Leave `Toaster` and existing pages alone otherwise.

### Technical details

**Files edited/created**:
- New migration: drop `bootstrap_first_admin`, drop any trigger calling it, insert admin row for tecletamar1@gmail.com.
- `src/lib/stylists.functions.ts`: tighten Zod (email/instagram/bio required, prices optional).
- `src/routes/_authenticated/my-listing.tsx`: update field `required` flags, add `*` to required labels.
- `src/routes/_authenticated/admin.stylists.tsx`: update copy in empty admin state.
- `src/routes/city.$citySlug.tsx`: support unknown cities by reading from stylist data.
- `src/routes/index.tsx`: add `id="discover-search"` to the search input.
- `src/components/SiteHeader.tsx`: keep `/#results` link; no logic change beyond confirming.
- Delete: `src/routes/blog.index.tsx`, `src/routes/blog.$slug.tsx`, `src/data/blog.ts`.

**Open question**: For city pages with no preset cover image (e.g. Nijmegen), is it OK to show a neutral gradient header instead of a stock photo? Proposed: yes, reuse the existing blush gradient used elsewhere.
