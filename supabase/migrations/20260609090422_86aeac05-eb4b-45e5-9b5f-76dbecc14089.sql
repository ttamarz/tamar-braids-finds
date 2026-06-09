
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, anon, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.stylists TO authenticated;
GRANT ALL ON public.stylists TO service_role;
GRANT SELECT ON public.stylists TO anon;
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

INSERT INTO public.user_roles (user_id, role)
VALUES ('43c31cd0-8314-47ed-a5e9-3c8d0a73b66a', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;
