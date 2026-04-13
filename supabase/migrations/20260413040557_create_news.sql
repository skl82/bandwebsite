-- News articles table
CREATE TABLE news (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  excerpt TEXT,
  body TEXT NOT NULL,
  image_url TEXT,
  link TEXT,
  date DATE DEFAULT CURRENT_DATE,
  visible BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE news ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read visible news"
  ON news FOR SELECT
  USING (visible = true);

CREATE POLICY "Authenticated users can do everything"
  ON news FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- News images storage bucket (public read)
INSERT INTO storage.buckets (id, name, public)
VALUES ('news-images', 'news-images', true);

CREATE POLICY "Public can read news images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'news-images');

CREATE POLICY "Authenticated users can upload news images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'news-images');

CREATE POLICY "Authenticated users can update news images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'news-images');

CREATE POLICY "Authenticated users can delete news images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'news-images');
