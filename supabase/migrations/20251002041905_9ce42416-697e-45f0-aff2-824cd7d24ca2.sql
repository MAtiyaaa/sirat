-- Add DELETE policy for reading_progress table
CREATE POLICY "Users can delete their own progress"
ON public.reading_progress
FOR DELETE
USING (auth.uid() = user_id);

-- Add DELETE policy for ayah_interactions table  
CREATE POLICY "Users can delete their own interactions"
ON public.ayah_interactions
FOR DELETE
USING (auth.uid() = user_id);

-- Add DELETE policy for last_viewed_surah table
CREATE POLICY "Users can delete their own last viewed surah"
ON public.last_viewed_surah
FOR DELETE
USING (auth.uid() = user_id);