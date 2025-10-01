-- Drop the old check constraint
ALTER TABLE user_settings 
DROP CONSTRAINT IF EXISTS user_settings_reading_tracking_mode_check;

-- Add new check constraint including 'auto'
ALTER TABLE user_settings 
ADD CONSTRAINT user_settings_reading_tracking_mode_check 
CHECK (reading_tracking_mode IN ('auto', 'scroll', 'bookmark', 'reciting', 'click'));

-- Update default reading_tracking_mode to 'auto'
ALTER TABLE user_settings 
ALTER COLUMN reading_tracking_mode SET DEFAULT 'auto';

-- Update existing users to 'auto' if they haven't changed it from the old default
UPDATE user_settings 
SET reading_tracking_mode = 'auto' 
WHERE reading_tracking_mode = 'scroll';