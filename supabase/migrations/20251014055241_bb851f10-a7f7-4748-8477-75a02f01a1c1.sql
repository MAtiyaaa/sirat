-- Add dua_bookmarks table for bookmarking duas
CREATE TABLE IF NOT EXISTS public.dua_bookmarks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  dua_title TEXT NOT NULL,
  dua_arabic TEXT,
  dua_english TEXT,
  dua_transliteration TEXT,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.dua_bookmarks ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own dua bookmarks" 
ON public.dua_bookmarks 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own dua bookmarks" 
ON public.dua_bookmarks 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own dua bookmarks" 
ON public.dua_bookmarks 
FOR DELETE 
USING (auth.uid() = user_id);