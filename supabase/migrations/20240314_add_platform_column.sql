-- Add platform column to content table
ALTER TABLE content 
ADD COLUMN platform TEXT NOT NULL DEFAULT 'facebook' 
CHECK (platform IN ('facebook', 'linkedin', 'instagram', 'twitter'));