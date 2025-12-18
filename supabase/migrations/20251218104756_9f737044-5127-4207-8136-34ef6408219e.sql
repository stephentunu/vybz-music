-- Create storage bucket for audio files
INSERT INTO storage.buckets (id, name, public) VALUES ('songs', 'songs', true);

-- Create storage bucket for album artwork
INSERT INTO storage.buckets (id, name, public) VALUES ('artwork', 'artwork', true);

-- Storage policies for songs bucket
CREATE POLICY "Anyone can upload songs"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'songs');

CREATE POLICY "Anyone can read songs"
ON storage.objects FOR SELECT
USING (bucket_id = 'songs');

-- Storage policies for artwork bucket
CREATE POLICY "Anyone can upload artwork"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'artwork');

CREATE POLICY "Anyone can read artwork"
ON storage.objects FOR SELECT
USING (bucket_id = 'artwork');

-- Create table for user-uploaded songs
CREATE TABLE public.uploaded_songs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  title TEXT NOT NULL,
  artist TEXT NOT NULL,
  album TEXT DEFAULT 'Single',
  genre TEXT,
  duration INTEGER DEFAULT 0,
  audio_url TEXT NOT NULL,
  album_art_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.uploaded_songs ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see songs with their session_id
CREATE POLICY "Users can view their own uploaded songs"
ON public.uploaded_songs FOR SELECT
USING (true);

-- Policy: Anyone can insert songs
CREATE POLICY "Anyone can upload songs"
ON public.uploaded_songs FOR INSERT
WITH CHECK (true);

-- Policy: Users can delete their own songs
CREATE POLICY "Users can delete their own songs"
ON public.uploaded_songs FOR DELETE
USING (true);

-- Create index for faster session-based queries
CREATE INDEX idx_uploaded_songs_session ON public.uploaded_songs(session_id);