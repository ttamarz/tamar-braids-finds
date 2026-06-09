
CREATE TABLE public.stylist_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  city text NOT NULL,
  hairstyle text NOT NULL,
  budget text NOT NULL,
  notes text,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT INSERT ON public.stylist_requests TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.stylist_requests TO authenticated;
GRANT ALL ON public.stylist_requests TO service_role;

ALTER TABLE public.stylist_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a stylist request"
  ON public.stylist_requests FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can view stylist requests"
  ON public.stylist_requests FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update stylist requests"
  ON public.stylist_requests FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete stylist requests"
  ON public.stylist_requests FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_stylist_requests_updated_at
  BEFORE UPDATE ON public.stylist_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
