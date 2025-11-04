-- Drop existing policies first (if they exist)
DROP POLICY IF EXISTS "Allow public to insert visitor sessions" ON visitor_sessions;
DROP POLICY IF EXISTS "Allow public to read visitor sessions" ON visitor_sessions;
DROP POLICY IF EXISTS "Allow public to update visitor sessions" ON visitor_sessions;
DROP POLICY IF EXISTS "Allow authenticated users to read visitor sessions" ON visitor_sessions;
DROP POLICY IF EXISTS "Allow public to insert page views" ON page_views;
DROP POLICY IF EXISTS "Allow public to update page views" ON page_views;
DROP POLICY IF EXISTS "Allow authenticated users to read page views" ON page_views;
DROP POLICY IF EXISTS "Allow public to read page views" ON page_views;

-- Drop existing tables first (if they exist)
DROP TABLE IF EXISTS page_views CASCADE;
DROP TABLE IF EXISTS visitor_sessions CASCADE;

-- Create visitor_sessions table
CREATE TABLE visitor_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL UNIQUE,
  device_type TEXT NOT NULL DEFAULT 'desktop',
  referrer_source TEXT DEFAULT 'direct',
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create page_views table
CREATE TABLE page_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL REFERENCES visitor_sessions(session_id) ON DELETE CASCADE,
  page_url TEXT NOT NULL,
  page_title TEXT,
  time_on_page INTEGER DEFAULT 0,
  is_bounce BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indices for faster queries
CREATE INDEX idx_page_views_session_id ON page_views(session_id);
CREATE INDEX idx_page_views_created_at ON page_views(created_at);
CREATE INDEX idx_page_views_page_url ON page_views(page_url);
CREATE INDEX idx_visitor_sessions_created_at ON visitor_sessions(created_at);
CREATE INDEX idx_visitor_sessions_device_type ON visitor_sessions(device_type);
CREATE INDEX idx_visitor_sessions_session_id ON visitor_sessions(session_id);

-- Enable RLS (Row Level Security)
ALTER TABLE visitor_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;

-- Create policies for visitor_sessions (allow public access)
CREATE POLICY "Allow public to insert visitor sessions" ON visitor_sessions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public to read visitor sessions" ON visitor_sessions
  FOR SELECT USING (true);

CREATE POLICY "Allow public to update visitor sessions" ON visitor_sessions
  FOR UPDATE USING (true) WITH CHECK (true);

-- Create policies for page_views (allow public access)
CREATE POLICY "Allow public to insert page views" ON page_views
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public to read page views" ON page_views
  FOR SELECT USING (true);

CREATE POLICY "Allow public to update page views" ON page_views
  FOR UPDATE USING (true) WITH CHECK (true);

-- Grant permissions to anon role (public/unauthenticated users)
GRANT ALL ON visitor_sessions TO anon;
GRANT ALL ON page_views TO anon;

-- Grant permissions to authenticated role
GRANT SELECT ON visitor_sessions TO authenticated;
GRANT SELECT ON page_views TO authenticated;
