-- Add word_by_word_display setting to user_settings table
ALTER TABLE public.user_settings
ADD COLUMN word_by_word_display boolean DEFAULT false;