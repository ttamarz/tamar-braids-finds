# Tamar Finds — Functionality Update Plan

Scope: functionality + small content edits only. No visual redesign. Keep current pink/feminine layout, fonts, and colors.

## 1. Functional search bar (homepage)

In `src/routes/index.tsx`:
- Convert the hero search into a controlled input with React state (`query`).
- Filter the "Featured Stylists" grid live by matching `query` (case-insensitive) against:
  - braider `name`
  - city `name`
  - any entry in `styles`
  - braider `bio` (keyword catch-all)
- When `query` is non-empty:
  - Rename the section heading from "Featured Stylists" to "Search results" and show a result count.
  - Show all matches across cities (not capped at 8).
  - Render an empty-state message ("Geen resultaten — probeer een andere stad of stijl") when zero matches.
- "Popular" city chips: convert from `<Link>` to buttons that set `query` to the city name (and scroll to the results grid). This makes them act as filters per the request.

No data shape changes to `src/data/cities.ts`.

## 2. Remove "Browse by city" section

In `src/routes/index.tsx`, delete the entire `{/* CITIES */}` section (heading + the grid mapping `cities` to large image cards). City pages (`/city/$citySlug`) and the data file stay intact so existing routes keep working and search can still surface city matches.

## 3. Blog: clickable items + overview + article pages

- Extract blog posts into `src/data/blog.ts` with: `slug`, `title`, `tag`, `readTime`, `image`, `excerpt`, `body` (a few paragraphs of placeholder Dutch copy per post). Seed with the 3 existing items.
- New route `src/routes/blog.index.tsx` → `/blog`: overview grid of all posts, same card styling as current teaser, keeps the pink aesthetic.
- New route `src/routes/blog.$slug.tsx` → `/blog/$slug`: simple article page (hero image, tag, title, read time, body paragraphs, back link). Uses `notFound()` for unknown slugs, plus `head()` per post for SEO.
- In `src/routes/index.tsx`, wrap each blog teaser in `<Link to="/blog/$slug">` and point "View all" to `/blog`.

## 4. "Are you a braider?" → For Stylists page

- Wrap the existing CTA card in `src/routes/index.tsx` with `<Link to="/for-stylists">` (preserve styling).
- New route `src/routes/for-stylists.tsx` → `/for-stylists`:
  - Short intro explaining how Tamar Finds curates and lists braiders (free listing, vetted, photo reviews, etc.) — Dutch copy, matching tone.
  - Form fields: Naam, Bedrijfsnaam, Stad, Instagram-link, Specialiteiten (textarea/tags), Prijsklasse (select: €, €€, €€€), Contact e-mail.
  - Client-side validation with `zod` + react-hook-form (already in the stack via shadcn `form`). On submit, show a success toast ("Bedankt! We nemen binnen 5 werkdagen contact op.") and reset the form. No backend — submission stays client-side for now (can be wired to Lovable Cloud later if desired).

## 5. Footer copy

In `src/components/SiteHeader.tsx` (`SiteFooter`):
- Replace the Dutch tagline paragraph with: "Tamar Finds helpt je betrouwbare braiders en hairstylists in Nederland ontdekken — zonder eindeloos zoeken op Instagram."
- Replace "crowns woven with care" with "Find your next crown."

## Files touched

- edit `src/routes/index.tsx` (search state, remove cities section, blog/CTA links)
- edit `src/components/SiteHeader.tsx` (footer copy)
- new `src/data/blog.ts`
- new `src/routes/blog.index.tsx`
- new `src/routes/blog.$slug.tsx`
- new `src/routes/for-stylists.tsx`
- auto-regenerated `src/routeTree.gen.ts`

## Out of scope

- No changes to color tokens, fonts, hero layout, sidebar, trust badges, or city detail pages.
- No backend wiring for the stylist form (client-only success state).
