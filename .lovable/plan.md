
# Tamar Finds MVP — finish without redesigning

No visual changes to home, cards, CMS, fonts, or colors. All work is data, auth, and small functional additions reusing existing styles.

## 1. Database migration

Single migration covering schema, grants, RLS, and security hardening.

**`stylists` — add columns**
- `owner_id uuid REFERENCES auth.users(id) ON DELETE SET NULL` (nullable so existing seeded rows stay)
- `verified boolean NOT NULL DEFAULT false`
- `featured boolean NOT NULL DEFAULT false` (used for "Sponsored/Featured")
- `email text`, `booking_url text` (new submission fields)
- Backfill: mark all existing seeded rows `verified = true` so current site looks unchanged.

**`stylists` RLS — replace current admin-only writes**
- `SELECT`: public (unchanged).
- `INSERT (authenticated)`: `WITH CHECK (owner_id = auth.uid())` — stylists create their own row; force `verified=false, featured=false` via a `BEFORE INSERT` trigger that resets those two fields unless `has_role(auth.uid(),'admin')`.
- `UPDATE (authenticated)`: `USING (owner_id = auth.uid()) WITH CHECK (owner_id = auth.uid())` for owners, **plus** a separate admin policy `USING/CHECK has_role(...)`. A `BEFORE UPDATE` trigger blocks non-admins from changing `verified`, `featured`, `owner_id`.
- `DELETE`: admin-only.

**`stylist_requests` — already correct** (anon insert, admin read/update/delete). Keep.

**`user_roles` — tighten**
- Keep existing `SELECT` policy (`auth.uid() = user_id`).
- No INSERT/UPDATE/DELETE policies (already denied). Role grants done via migration or service-role only.

**SECURITY DEFINER hygiene**
- `has_role(uuid, app_role)` — keep `EXECUTE` to `authenticated` only (needed by RLS as the calling role); REVOKE from `anon` and `public`. RLS evaluation works because it runs as the table owner regardless.
- `bootstrap_first_admin()` — trigger function, REVOKE EXECUTE from `anon, authenticated, public`.
- `update_updated_at_column()` — trigger function, REVOKE EXECUTE from `anon, authenticated, public`.

**Triggers**
- `stylists_force_unverified_on_insert` — set `verified=false, featured=false, owner_id=auth.uid()` when caller is not admin.
- `stylists_block_privileged_updates` — if not admin, reset `verified/featured/owner_id` to OLD values.
- `set_updated_at` on `stylists` and `stylist_requests`.

## 2. Server functions

`src/lib/stylists.functions.ts` — extend:
- `listStylists` — order by `featured DESC, verified DESC, created_at DESC` (so featured/verified surface first; unverified still listed but lower). Add `verified`, `featured`, `owner_id`, `email`, `booking_url` to select + type.
- `createStylist` — drop admin assertion; require auth (`requireSupabaseAuth`), set `owner_id = context.userId`. DB trigger enforces verified/featured=false.
- `updateStylist` — drop admin assertion; rely on RLS + trigger. Two callers (owner editing self, admin editing anyone) both go through same function.
- `deleteStylist` — keep admin assertion.
- New `getMyStylist` — returns the caller's own listing (or null).
- New admin-only `setStylistFlags({ id, verified?, featured? })` — uses `assertAdmin`.

`src/lib/stylists.functions.ts` types extended with `verified`, `featured`, `owner_id`.

## 3. Routes

**`src/routes/_authenticated/my-listing.tsx`** (new) — stylist self-service form. Same field set as admin form minus rating/reviews. Uses `getMyStylist` + `createStylist`/`updateStylist`. Shows "Unverified — under review" banner when `verified=false`.

**`src/routes/for-stylists.tsx`** — replace the demo client-only form submit with: if not logged in → "Maak een account aan" CTA to `/auth?next=/my-listing`; if logged in → redirect to `/my-listing`. Keeps page design, just rewires the submit/CTA.

**`src/routes/auth.tsx`** — read `?next=` search param, redirect there after sign-in (fallback `/my-listing` for non-admins, `/admin/stylists` for admins via `checkIsAdmin`).

**`src/routes/_authenticated/admin.stylists.tsx`** — add columns: Verified toggle, Featured toggle, owner email (small). Wire to `setStylistFlags`. No layout overhaul.

**`src/routes/saved.tsx`** & cards in `index.tsx`/`city.$citySlug.tsx`** — already wired via `useSavedStylists`. Verify they work; add an "Unverified" pill on cards when `!s.verified` (small badge, same blush style as rating badge but neutral). Add subtle "Featured" pill when `s.featured`.

**Search** — home search already filters by name/city/specialty/bio. Header search button already scrolls to `/#results`. No changes unless QA shows a bug.

## 4. Sponsored/Featured surfacing

On homepage, when not searching, show featured stylists first (already covered by new `listStylists` ordering). Add a tiny `Featured` label on those cards. No new section, no payments.

## 5. Files touched

- New: `supabase/migrations/<ts>_stylist_ownership_verification.sql`, `src/routes/_authenticated/my-listing.tsx`
- Edited: `src/lib/stylists.functions.ts`, `src/routes/_authenticated/admin.stylists.tsx`, `src/routes/for-stylists.tsx`, `src/routes/auth.tsx`, `src/routes/index.tsx` (badges + featured ordering already from query), `src/routes/city.$citySlug.tsx` (badges), `src/integrations/supabase/types.ts` (regenerated post-migration)

## 6. Out of scope (per request)

- No hair profile feature.
- No payments for sponsored.
- No design/CMS/layout changes beyond small Verified/Featured badges and one new self-service form page reusing existing styles.

## Open question

For the first time a logged-in non-admin lands at `/my-listing` with no row yet — auto-create a draft row, or show an empty form and create on first save? I'll go with **empty form, create on first save** unless you'd rather have an auto-draft.
