-- Add new settings columns
ALTER TABLE public.user_settings 
ADD COLUMN IF NOT EXISTS prayer_time_region TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS reading_tracking_mode TEXT DEFAULT 'scroll' CHECK (reading_tracking_mode IN ('scroll', 'bookmark', 'reciting', 'click'));

-- Add tracking table for ayah interactions
CREATE TABLE IF NOT EXISTS public.ayah_interactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  surah_number INTEGER NOT NULL,
  ayah_number INTEGER NOT NULL,
  interaction_type TEXT NOT NULL CHECK (interaction_type IN ('click', 'recite', 'bookmark')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.ayah_interactions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own interactions"
ON public.ayah_interactions
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own interactions"
ON public.ayah_interactions
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own interactions"
ON public.ayah_interactions
FOR UPDATE
USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_ayah_interactions_user_surah ON public.ayah_interactions(user_id, surah_number, interaction_type);

-- Create trigger for updating updated_at
CREATE TRIGGER update_ayah_interactions_updated_at
BEFORE UPDATE ON public.ayah_interactions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();