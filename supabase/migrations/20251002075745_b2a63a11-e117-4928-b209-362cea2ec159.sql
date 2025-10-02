-- Add translation_source column
ALTER TABLE user_settings ADD COLUMN IF NOT EXISTS translation_source TEXT DEFAULT 'en.sahih';

-- Migrate existing data: if translation_enabled is false, set to transliteration
UPDATE user_settings 
SET translation_source = CASE 
  WHEN translation_enabled = false THEN 'transliteration'
  ELSE 'en.sahih'
END;

-- Drop old columns
ALTER TABLE user_settings DROP COLUMN IF EXISTS qari;
ALTER TABLE user_settings DROP COLUMN IF EXISTS translation_enabled;
ALTER TABLE user_settings DROP COLUMN IF EXISTS transliteration_enabled;