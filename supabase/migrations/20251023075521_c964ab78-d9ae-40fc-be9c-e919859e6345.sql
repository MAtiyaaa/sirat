-- Add first_name and last_name columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN first_name TEXT,
ADD COLUMN last_name TEXT;

-- Migrate existing full_name data to first_name (best effort)
UPDATE public.profiles 
SET first_name = SPLIT_PART(full_name, ' ', 1),
    last_name = CASE 
      WHEN array_length(string_to_array(full_name, ' '), 1) > 1 
      THEN substring(full_name from position(' ' in full_name) + 1)
      ELSE ''
    END
WHERE full_name IS NOT NULL;

-- Update the handle_new_user function to use first_name and last_name
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, first_name, last_name, full_name)
  VALUES (
    new.id, 
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name',
    CONCAT_WS(' ', new.raw_user_meta_data->>'first_name', new.raw_user_meta_data->>'last_name')
  );
  
  INSERT INTO public.user_settings (user_id)
  VALUES (new.id);
  
  RETURN new;
END;
$$;