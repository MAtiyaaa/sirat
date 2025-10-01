-- Add unique constraint to ayah_interactions table
ALTER TABLE ayah_interactions 
ADD CONSTRAINT ayah_interactions_unique 
UNIQUE (user_id, surah_number, ayah_number, interaction_type);