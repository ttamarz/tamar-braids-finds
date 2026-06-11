
-- 1. Schema additions to stylists
ALTER TABLE public.stylists
  ADD COLUMN IF NOT EXISTS owner_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS verified boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS featured boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS email text,
  ADD COLUMN IF NOT EXISTS booking_url text;

-- Existing seeded rows keep behaving as before (visible & approved)
UPDATE public.stylists SET verified = true WHERE owner_id IS NULL AND verified = false;

CREATE INDEX IF NOT EXISTS stylists_owner_id_idx ON public.stylists(owner_id);

-- 2. Replace stylists write policies
DROP POLICY IF EXISTS "Admins can insert stylists" ON public.stylists;
DROP POLICY IF EXISTS "Admins can update stylists" ON public.stylists;
DROP POLICY IF EXISTS "Admins can delete stylists" ON public.stylists;

-- Owners insert their own row
CREATE POLICY "Owners can insert their own stylist"
  ON public.stylists FOR INSERT TO authenticated
  WITH CHECK (owner_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

-- Owners can update their own row
CREATE POLICY "Owners can update their own stylist"
  ON public.stylists FOR UPDATE TO authenticated
  USING (owner_id = auth.uid())
  WITH CHECK (owner_id = auth.uid());

-- Admins can update any row
CREATE POLICY "Admins can update any stylist"
  ON public.stylists FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Only admins delete
CREATE POLICY "Admins can delete stylists"
  ON public.stylists FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- 3. Triggers preventing non-admins from setting verified/featured/owner_id
CREATE OR REPLACE FUNCTION public.stylists_guard_privileged_fields()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  is_admin boolean := public.has_role(auth.uid(), 'admin');
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NOT is_admin THEN
      NEW.verified := false;
      NEW.featured := false;
      NEW.owner_id := auth.uid();
    END IF;
  ELSIF TG_OP = 'UPDATE' THEN
    IF NOT is_admin THEN
      NEW.verified := OLD.verified;
      NEW.featured := OLD.featured;
      NEW.owner_id := OLD.owner_id;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;
REVOKE EXECUTE ON FUNCTION public.stylists_guard_privileged_fields() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS stylists_guard_privileged_fields_ins ON public.stylists;
DROP TRIGGER IF EXISTS stylists_guard_privileged_fields_upd ON public.stylists;
CREATE TRIGGER stylists_guard_privileged_fields_ins
  BEFORE INSERT ON public.stylists
  FOR EACH ROW EXECUTE FUNCTION public.stylists_guard_privileged_fields();
CREATE TRIGGER stylists_guard_privileged_fields_upd
  BEFORE UPDATE ON public.stylists
  FOR EACH ROW EXECUTE FUNCTION public.stylists_guard_privileged_fields();

-- updated_at triggers
DROP TRIGGER IF EXISTS stylists_set_updated_at ON public.stylists;
CREATE TRIGGER stylists_set_updated_at
  BEFORE UPDATE ON public.stylists
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS stylist_requests_set_updated_at ON public.stylist_requests;
CREATE TRIGGER stylist_requests_set_updated_at
  BEFORE UPDATE ON public.stylist_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 4. SECURITY DEFINER hygiene
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;

REVOKE EXECUTE ON FUNCTION public.bootstrap_first_admin() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
