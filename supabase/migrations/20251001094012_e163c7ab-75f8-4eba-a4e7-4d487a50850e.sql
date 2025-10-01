-- Update default language in user_settings table
ALTER TABLE public.user_settings 
ALTER COLUMN language SET DEFAULT 'en';