-- Create bookmarks table for hadiths
CREATE TABLE IF NOT EXISTS public.hadith_bookmarks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  hadith_number INTEGER NOT NULL,
  book_slug TEXT NOT NULL,
  book_name TEXT,
  hadith_english TEXT,
  hadith_arabic TEXT,
  narrator TEXT,
  chapter_english TEXT,
  chapter_arabic TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, hadith_number, book_slug)
);

-- Enable Row Level Security
ALTER TABLE public.hadith_bookmarks ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own hadith bookmarks" 
ON public.hadith_bookmarks 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own hadith bookmarks" 
ON public.hadith_bookmarks 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own hadith bookmarks" 
ON public.hadith_bookmarks 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX idx_hadith_bookmarks_user_id ON public.hadith_bookmarks(user_id);
CREATE INDEX idx_hadith_bookmarks_book_slug ON public.hadith_bookmarks(book_slug);