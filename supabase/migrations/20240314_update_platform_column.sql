-- Modify platform column to platforms
ALTER TABLE content 
RENAME COLUMN platform TO platforms;

-- Remove the check constraint if it exists
ALTER TABLE content 
DROP CONSTRAINT IF EXISTS content_platform_check;

-- Modify the column type to TEXT
ALTER TABLE content 
ALTER COLUMN platforms TYPE TEXT;