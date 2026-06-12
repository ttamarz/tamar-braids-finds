
-- 1. Remove first-user-becomes-admin bootstrap
DROP TRIGGER IF EXISTS bootstrap_first_admin_trigger ON auth.users;
DROP FUNCTION IF EXISTS public.bootstrap_first_admin() CASCADE;

-- 2. Grant permanent admin to tecletamar1@gmail.com (no-op if user not yet registered;
--    re-run this migration once they sign up, OR we'll seed on first sign-in via a fresh trigger below).
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::public.app_role
FROM auth.users
WHERE lower(email) = 'tecletamar1@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;

-- 3. Auto-grant admin to that specific email on signup (idempotent, scoped to one email).
CREATE OR REPLACE FUNCTION public.grant_designated_admin()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF lower(NEW.email) = 'tecletamar1@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin'::public.app_role)
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS grant_designated_admin_trigger ON auth.users;
CREATE TRIGGER grant_designated_admin_trigger
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.grant_designated_admin();
