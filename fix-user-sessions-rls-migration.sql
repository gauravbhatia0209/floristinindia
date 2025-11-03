-- Fix RLS policy on user_sessions table
-- The previous policy required auth.uid() to match user_id, but our custom
-- session authentication doesn't use Supabase auth, so auth.uid() is NULL.
-- This caused sessions to be rejected and users to be logged out.

-- Drop the restrictive RLS policy that was blocking session reads
DROP POLICY IF EXISTS "Users can manage their own sessions" ON user_sessions;

-- Create policies that work with custom session token authentication
CREATE POLICY "Sessions are readable" ON user_sessions
  FOR SELECT USING (true);

CREATE POLICY "Sessions can be created" ON user_sessions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Sessions can be updated" ON user_sessions
  FOR UPDATE USING (true);

CREATE POLICY "Sessions can be deleted" ON user_sessions
  FOR DELETE USING (true);
