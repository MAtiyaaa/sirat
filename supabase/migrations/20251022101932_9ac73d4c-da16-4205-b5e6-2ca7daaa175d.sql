-- Update user_settings table to split theme into mode and color
ALTER TABLE user_settings 
  DROP COLUMN IF EXISTS theme;

ALTER TABLE user_settings 
  ADD COLUMN theme_mode text DEFAULT 'system',
  ADD COLUMN theme_color text DEFAULT 'blue';

-- Migrate existing data if needed (not necessary since we dropped the column)
COMMENT ON COLUMN user_settings.theme_mode IS 'Theme mode: system, light, or dark';
COMMENT ON COLUMN user_settings.theme_color IS 'Theme color: blue, green, gold, pink, or red';