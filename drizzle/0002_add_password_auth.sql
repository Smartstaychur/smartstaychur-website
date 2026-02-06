-- Add password-based authentication fields to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS username VARCHAR(128) UNIQUE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS passwordHash VARCHAR(256);
