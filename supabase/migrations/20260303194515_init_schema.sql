-- Shows table
CREATE TABLE shows (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  gig_name TEXT NOT NULL,
  date DATE NOT NULL,
  time TIME,
  venue TEXT NOT NULL,
  city TEXT NOT NULL,
  ticket_link TEXT,
  poster_url TEXT,
  visible BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE shows ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read visible shows"
  ON shows FOR SELECT
  USING (visible = true);

CREATE POLICY "Authenticated users can do everything"
  ON shows FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Posters storage bucket (public read)
INSERT INTO storage.buckets (id, name, public)
VALUES ('posters', 'posters', true);

CREATE POLICY "Public can read posters"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'posters');

CREATE POLICY "Authenticated users can upload posters"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'posters');

CREATE POLICY "Authenticated users can update posters"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'posters');

CREATE POLICY "Authenticated users can delete posters"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'posters');
