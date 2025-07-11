-- Authentication Tables Setup
-- Complete authentication system with admin and customer login

-- Admins table for admin users
CREATE TABLE IF NOT EXISTS admins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  is_active BOOLEAN DEFAULT true,
  is_verified BOOLEAN DEFAULT false,
  last_login TIMESTAMP WITH TIME ZONE,
  failed_login_attempts INTEGER DEFAULT 0,
  locked_until TIMESTAMP WITH TIME ZONE,
  password_reset_token TEXT,
  password_reset_expires TIMESTAMP WITH TIME ZONE,
  email_verification_token TEXT,
  email_verification_expires TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Customers table (enhanced from existing if any)
CREATE TABLE IF NOT EXISTS customers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  date_of_birth DATE,
  gender TEXT CHECK (gender IN ('male', 'female', 'other')),
  is_active BOOLEAN DEFAULT true,
  is_verified BOOLEAN DEFAULT false,
  last_login TIMESTAMP WITH TIME ZONE,
  failed_login_attempts INTEGER DEFAULT 0,
  locked_until TIMESTAMP WITH TIME ZONE,
  password_reset_token TEXT,
  password_reset_expires TIMESTAMP WITH TIME ZONE,
  email_verification_token TEXT,
  email_verification_expires TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sessions table for secure session management
CREATE TABLE IF NOT EXISTS user_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  user_type TEXT NOT NULL CHECK (user_type IN ('admin', 'customer')),
  session_token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  ip_address INET,
  user_agent TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Login attempts table for security tracking
CREATE TABLE IF NOT EXISTS login_attempts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  user_type TEXT NOT NULL CHECK (user_type IN ('admin', 'customer')),
  ip_address INET,
  user_agent TEXT,
  success BOOLEAN NOT NULL,
  failure_reason TEXT,
  attempted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Password reset requests table
CREATE TABLE IF NOT EXISTS password_reset_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  user_type TEXT NOT NULL CHECK (user_type IN ('admin', 'customer')),
  email TEXT NOT NULL,
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used BOOLEAN DEFAULT false,
  used_at TIMESTAMP WITH TIME ZONE,
  ip_address INET,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_admins_email ON admins(email);
CREATE INDEX IF NOT EXISTS idx_admins_password_reset_token ON admins(password_reset_token);
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
CREATE INDEX IF NOT EXISTS idx_customers_password_reset_token ON customers(password_reset_token);
CREATE INDEX IF NOT EXISTS idx_user_sessions_session_token ON user_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_login_attempts_email ON login_attempts(email);
CREATE INDEX IF NOT EXISTS idx_login_attempts_attempted_at ON login_attempts(attempted_at);
CREATE INDEX IF NOT EXISTS idx_password_reset_requests_token ON password_reset_requests(token);
CREATE INDEX IF NOT EXISTS idx_password_reset_requests_expires_at ON password_reset_requests(expires_at);

-- Add foreign key constraints for sessions
ALTER TABLE user_sessions ADD CONSTRAINT fk_admin_sessions 
  FOREIGN KEY (user_id) REFERENCES admins(id) ON DELETE CASCADE
  NOT VALID;

-- Enable RLS (Row Level Security)
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE login_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE password_reset_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies for admins table
CREATE POLICY "Admins can manage their own records" ON admins
  FOR ALL USING (auth.uid()::text = id::text);

CREATE POLICY "Super admins can manage all admin records" ON admins
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admins 
      WHERE id::text = auth.uid()::text AND role = 'super_admin'
    )
  );

-- RLS Policies for customers table  
CREATE POLICY "Customers can manage their own records" ON customers
  FOR ALL USING (auth.uid()::text = id::text);

CREATE POLICY "Admins can read customer records" ON customers
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM admins 
      WHERE id::text = auth.uid()::text AND is_active = true
    )
  );

-- RLS Policies for sessions table
CREATE POLICY "Users can manage their own sessions" ON user_sessions
  FOR ALL USING (user_id::text = auth.uid()::text);

-- RLS Policies for login attempts (admin read-only)
CREATE POLICY "Admins can read login attempts" ON login_attempts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM admins 
      WHERE id::text = auth.uid()::text AND is_active = true
    )
  );

-- RLS Policies for password reset requests
CREATE POLICY "Users can manage their own password resets" ON password_reset_requests
  FOR ALL USING (user_id::text = auth.uid()::text);

-- Insert default super admin (CHANGE THESE CREDENTIALS IMMEDIATELY)
-- Password: 'admin123' - MUST BE CHANGED IN PRODUCTION
INSERT INTO admins (email, password_hash, name, role, is_active, is_verified) 
VALUES (
  'admin@floristinindia.com',
  '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewrBILSE7l8e5qYK', -- admin123
  'System Administrator',
  'super_admin',
  true,
  true
) ON CONFLICT (email) DO NOTHING;

-- Update timestamps trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add update triggers
CREATE TRIGGER update_admins_updated_at BEFORE UPDATE ON admins
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_sessions_updated_at BEFORE UPDATE ON user_sessions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
