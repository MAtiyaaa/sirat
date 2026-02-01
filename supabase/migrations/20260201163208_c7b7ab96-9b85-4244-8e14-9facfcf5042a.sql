-- Change word_by_word_display from boolean to text to support 'off', 'click', 'under' modes
ALTER TABLE public.user_settings 
ALTER COLUMN word_by_word_display TYPE text 
USING CASE 
  WHEN word_by_word_display = true THEN 'under'
  WHEN word_by_word_display = false THEN 'click'
  ELSE 'off'
END;