-- Add password column to sub_users table
ALTER TABLE sub_users ADD COLUMN password VARCHAR(255);

-- Add password_changed_at column to track last password change
ALTER TABLE sub_users ADD COLUMN password_changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
