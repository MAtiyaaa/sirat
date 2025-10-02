-- Add translation_enabled and tafsir_enabled columns
ALTER TABLE user_settings ADD COLUMN IF NOT EXISTS translation_enabled BOOLEAN DEFAULT true;
ALTER TABLE user_settings ADD COLUMN IF NOT EXISTS tafsir_enabled BOOLEAN DEFAULT true;