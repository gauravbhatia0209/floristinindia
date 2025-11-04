-- Create visitor_sessions table
CREATE TABLE IF NOT EXISTS visitor_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL UNIQUE,
  device_type TEXT NOT NULL,
  referrer_source TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create page_views table
CREATE TABLE IF NOT EXISTS page_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL REFERENCES visitor_sessions(session_id) ON DELETE CASCADE,
  page_url TEXT NOT NULL,
  page_title TEXT,
  time_on_page INTEGER DEFAULT 0,
  is_bounce BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (session_id) REFERENCES visitor_sessions(session_id)
);

-- Create indices for faster queries
CREATE INDEX IF NOT EXISTS idx_page_views_session_id ON page_views(session_id);
CREATE INDEX IF NOT EXISTS idx_page_views_created_at ON page_views(created_at);
CREATE INDEX IF NOT EXISTS idx_page_views_page_url ON page_views(page_url);
CREATE INDEX IF NOT EXISTS idx_visitor_sessions_created_at ON visitor_sessions(created_at);
CREATE INDEX IF NOT EXISTS idx_visitor_sessions_device_type ON visitor_sessions(device_type);

-- Enable RLS (Row Level Security)
ALTER TABLE visitor_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;

-- Create policies for visitor_sessions
CREATE POLICY "Allow public to insert visitor sessions" ON visitor_sessions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public to update visitor sessions" ON visitor_sessions
  FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated users to read visitor sessions" ON visitor_sessions
  FOR SELECT USING (auth.role() = 'authenticated');

-- Create policies for page_views
CREATE POLICY "Allow public to insert page views" ON page_views
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated users to read page views" ON page_views
  FOR SELECT USING (auth.role() = 'authenticated');

-- Grant permissions
GRANT INSERT, UPDATE ON visitor_sessions TO anon;
GRANT SELECT ON visitor_sessions TO authenticated;
GRANT INSERT ON page_views TO anon;
GRANT SELECT ON page_views TO authenticated;
