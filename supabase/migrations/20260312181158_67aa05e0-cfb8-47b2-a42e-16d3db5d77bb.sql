
-- Create storage bucket for portfolio assets (photos, logos, CVs, project images)
INSERT INTO storage.buckets (id, name, public) VALUES ('portfolio', 'portfolio', true);

-- Public read access
CREATE POLICY "Public read portfolio" ON storage.objects FOR SELECT USING (bucket_id = 'portfolio');

-- Authenticated upload/update/delete
CREATE POLICY "Auth upload portfolio" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'portfolio');
CREATE POLICY "Auth update portfolio" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'portfolio') WITH CHECK (bucket_id = 'portfolio');
CREATE POLICY "Auth delete portfolio" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'portfolio');
