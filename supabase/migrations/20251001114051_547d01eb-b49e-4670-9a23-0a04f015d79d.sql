-- Add UPDATE policy for bookmarks table
CREATE POLICY "Users can update their own bookmarks"
ON public.bookmarks
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);