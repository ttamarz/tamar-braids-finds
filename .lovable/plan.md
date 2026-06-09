# Plan: Functional updates to Tamar Finds (no redesign)

Scope: behavior only. Reuse existing components, colors, fonts, and layout.

## 1. Homepage: swap blog section for "Can't find a stylist?"

- Remove the "Latest from the blog" section from `src/routes/index.tsx` (keep `/blog` route untouched so existing links don't break).
- Replace with a section using the same card styling (`rounded-[1.5rem] bg-card border border-border/60 p-6 sm:p-8`):
  - H2: "Can't find a stylist?"
  - Text: "Tell us what you're looking for and we'll help you find a trusted braider near you."
  - Button: "Request a Stylist" → links to new `/request-stylist` route.

## 2. New request form page (`/request-stylist`)

- New route `src/routes/request-stylist.tsx` reusing the visual pattern from `for-stylists.tsx` (same `Field` component, same input styling, same hero block — just different copy).
- Fields: name, email, city, hairstyle needed, budget (select: €/€€/€€€/Flexibel), extra notes (textarea).
- Validation via zod + react-hook-form (same as For Stylists).
- Submit writes to a new `stylist_requests` table in Lovable Cloud via a `createServerFn`. Public insert allowed (no auth needed to submit); only admins can read.
- Toast on success, reset form.

## 3. Make "List Your Business" CTA work

- In `src/routes/index.tsx`, the "Are you a braider?" card is already a `<Link to="/for-stylists">` but the inner CTA looks like a non-clickable span. Verify the whole card navigates — it does (outer Link wraps). No change needed beyond visual confirmation. If the user reports it not working, it's likely fine already; will keep as is.

## 4. Navbar fixes (`src/components/SiteHeader.tsx`)

- **Search button**: convert to a `Link to="/#results"` that scrolls to homepage results (same search input the Discover/home page already exposes). On mobile/desktop, clicking jumps to the homepage search bar.
- **Saved button**: convert to `Link to="/saved"`.
- Remove the standalone "Blog" nav link (since blog is being de-emphasized) — keep `/blog` route accessible but drop from nav. (Will confirm with user if they prefer to keep it.)

## 5. Saved stylists (bookmarks)

- Implement client-side persistence using `localStorage` (key `tf:saved`) — no auth required, instant, matches the existing heart icons on cards.
- New `src/hooks/useSavedStylists.ts` exposing `{ saved: string[], toggle(id), isSaved(id) }` with a storage event listener so all tabs/components stay in sync.
- Wire the bookmark icon on each stylist card in `src/routes/index.tsx` and `src/routes/city.$citySlug.tsx` to call `toggle(stylist.id)` (stopPropagation so the parent Link doesn't navigate). Filled vs outline state reflects `isSaved`.
- New route `src/routes/saved.tsx`:
  - Reads saved IDs from the hook.
  - Uses existing `stylistsQueryOptions` to fetch all stylists, then filters by saved IDs.
  - Renders the same stylist card grid used on the homepage. Empty state: "Je hebt nog geen stylists opgeslagen."

## Technical details

**Database migration** (one new table):
- `stylist_requests` (name, email, city, hairstyle, budget, notes, status default 'new')
- GRANT INSERT to anon + authenticated (public form), GRANT SELECT/UPDATE/DELETE to authenticated admins only
- RLS: anyone can insert; only admins (`has_role(auth.uid(), 'admin')`) can select/update/delete

**New files:**
- `src/routes/request-stylist.tsx`
- `src/routes/saved.tsx`
- `src/hooks/useSavedStylists.ts`
- `src/lib/stylistRequests.functions.ts` (server fn for insert)
- migration for `stylist_requests`

**Edited files:**
- `src/routes/index.tsx` (remove blog block, add "Can't find a stylist?" block, wire bookmark toggle)
- `src/routes/city.$citySlug.tsx` (wire bookmark toggle)
- `src/components/SiteHeader.tsx` (Search → link to /#results, Saved → /saved, drop Blog link)

**Out of scope:** no design changes, no CMS changes, no changes to stylist card visuals beyond making the heart button interactive, no auth changes.

## Open question

The Blog page (`/blog`) still exists. Drop it from the top nav (cleaner, matches the homepage change) or keep the nav link so users can still reach blog posts?
