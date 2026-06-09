## Goal
Make stylist create/edit/delete work from `/admin/stylists` for your account, without touching the UI or data.

## What I verified
- Your user (`tecletamar1@gmail.com`) already has `role = 'admin'` in `public.user_roles`.
- `stylists` RLS policies allow `authenticated` users with `has_role(..., 'admin')` to insert/update/delete. These are correct.
- `attachSupabaseAuth` is registered in `src/start.ts`, so the bearer token should reach server fns.

So the most likely culprits for the "permission" errors are:
1. The custom `assertAdmin()` helper in `src/lib/stylists.functions.ts` queries `user_roles` directly with the user-scoped client. If anything trips that select (RLS edge case, stale session, multi-row response), it throws "Forbidden: admin role required" even though RLS on `stylists` itself would have allowed the write.
2. Server fns surface raw `Error(...)` messages from Supabase as the toast text, which makes RLS errors look like generic save failures.

## Plan

### 1. Make admin check authoritative and database-driven
Replace the manual `assertAdmin()` lookup with the existing `public.has_role()` SECURITY DEFINER function via an RPC call:

```ts
const { data: ok, error } = await context.supabase.rpc('has_role', {
  _user_id: context.userId, _role: 'admin',
});
if (error) throw new Error(error.message);
if (!ok) throw new Error('Forbidden: admin role required');
```

This bypasses any RLS quirk on `user_roles`, uses the same function the table policies use, and removes a class of false-negative failures. Apply to `createStylist`, `updateStylist`, `deleteStylist`, and `checkIsAdmin`.

### 2. Re-confirm admin role for your user
Re-run the bootstrap insert idempotently so there is zero doubt:

```sql
INSERT INTO public.user_roles (user_id, role)
VALUES ('43c31cd0-8314-47ed-a5e9-3c8d0a73b66a', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;
```

### 3. Sanity-check RLS + grants (no schema redesign)
Run the linter and, if anything is missing, add only what's needed:
- Ensure `GRANT SELECT, INSERT, UPDATE, DELETE ON public.stylists TO authenticated` exists (it does per the schema, but re-grant defensively).
- Ensure `GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated` so the RPC call in step 1 works.

### 4. Better error surfacing in admin UI
In `src/routes/_authenticated/admin.stylists.tsx`, when a mutation fails, show the actual server error string in the toast (already partially done). Add a one-time visible banner if `checkIsAdmin` returns `{ isAdmin: false }` so future debugging is obvious.

### 5. Verify
- Sign out and sign back in at `/auth` (refreshes the JWT).
- Open `/admin/stylists`, create a test stylist, edit it, delete it.
- Confirm no console / network 401 / 403.

## Out of scope
- No UI redesign.
- No changes to `stylists` columns or seed data.
- No changes to auth provider configuration.
