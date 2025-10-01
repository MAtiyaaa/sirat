-- Create bookmarks table for ayahs and surahs
CREATE TABLE public.bookmarks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  surah_number INTEGER NOT NULL,
  ayah_number INTEGER,
  bookmark_type TEXT NOT NULL CHECK (bookmark_type IN ('ayah', 'surah')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, surah_number, ayah_number, bookmark_type)
);

-- Enable RLS
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own bookmarks"
ON public.bookmarks
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own bookmarks"
ON public.bookmarks
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bookmarks"
ON public.bookmarks
FOR DELETE
USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX idx_bookmarks_user_surah ON public.bookmarks(user_id, surah_number);

-- Create a table to track the last viewed surah
CREATE TABLE public.last_viewed_surah (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  surah_number INTEGER NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.last_viewed_surah ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own last viewed surah"
ON public.last_viewed_surah
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own last viewed surah"
ON public.last_viewed_surah
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own last viewed surah"
ON public.last_viewed_surah
FOR UPDATE
USING (auth.uid() = user_id);