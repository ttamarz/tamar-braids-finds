
CREATE TABLE public.stylists (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  instagram_url TEXT,
  image_url TEXT,
  rating NUMERIC(2,1) NOT NULL DEFAULT 5.0 CHECK (rating >= 0 AND rating <= 5),
  reviews_count INTEGER NOT NULL DEFAULT 0 CHECK (reviews_count >= 0),
  price_min INTEGER NOT NULL DEFAULT 0 CHECK (price_min >= 0),
  price_max INTEGER NOT NULL DEFAULT 0 CHECK (price_max >= 0),
  specialties TEXT[] NOT NULL DEFAULT '{}',
  bio TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.stylists TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.stylists TO authenticated;
GRANT ALL ON public.stylists TO service_role;

ALTER TABLE public.stylists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read stylists"
  ON public.stylists FOR SELECT
  USING (true);

CREATE POLICY "Authenticated can insert stylists"
  ON public.stylists FOR INSERT
  TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated can update stylists"
  ON public.stylists FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated can delete stylists"
  ON public.stylists FOR DELETE
  TO authenticated USING (true);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_stylists_updated_at
BEFORE UPDATE ON public.stylists
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX stylists_city_idx ON public.stylists (city);
