# Database Schema Documentation

## Overview

The application uses **Supabase** (PostgreSQL) as the primary database with Row Level Security (RLS) enabled for data protection. The schema supports a full-featured e-commerce platform with authentication, product management, order processing, and content management.

## Database Connection

```typescript
// Supabase Client Configuration
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

---

## Core Tables

### Products Table

```sql
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  slug VARCHAR(200) UNIQUE NOT NULL,
  description TEXT,
  short_description VARCHAR(500),
  price DECIMAL(10,2) NOT NULL,
  sale_price DECIMAL(10,2),
  images TEXT[] DEFAULT '{}',
  category_id UUID REFERENCES categories(id),
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  stock_quantity INTEGER DEFAULT 0,
  sku VARCHAR(100) UNIQUE,
  weight DECIMAL(8,2),
  dimensions JSONB, -- {length, width, height}
  meta_title VARCHAR(200),
  meta_description VARCHAR(500),
  has_variations BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_active ON products(is_active);
CREATE INDEX idx_products_featured ON products(is_featured);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_search ON products USING gin(to_tsvector('english', name || ' ' || COALESCE(description, '')));
```

**Key Features:**

- Full-text search capability
- SEO-friendly slugs
- Product variations support
- Stock management
- Image array storage
- Pricing with sale support

---

### Categories Table

```sql
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  image_url VARCHAR(500),
  parent_id UUID REFERENCES categories(id),
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  meta_title VARCHAR(200),
  meta_description VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Self-referencing for category hierarchy
CREATE INDEX idx_categories_parent ON categories(parent_id);
CREATE INDEX idx_categories_active ON categories(is_active);
CREATE INDEX idx_categories_sort ON categories(sort_order);
```

**Key Features:**

- Hierarchical structure (parent-child)
- SEO optimization
- Active/inactive status
- Custom sorting

---

### Product Variations Table

```sql
CREATE TABLE product_variations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  name VARCHAR(200) NOT NULL,
  attributes JSONB NOT NULL, -- {size: "Large", color: "Red"}
  price DECIMAL(10,2) NOT NULL,
  sale_price DECIMAL(10,2),
  stock_quantity INTEGER DEFAULT 0,
  sku VARCHAR(100) UNIQUE,
  images TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_variations_product ON product_variations(product_id);
CREATE INDEX idx_variations_active ON product_variations(is_active);
```

**Key Features:**

- Dynamic attributes (JSON)
- Independent pricing per variation
- Separate stock tracking
- Variation-specific images

---

### Orders Table

```sql
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number VARCHAR(50) UNIQUE NOT NULL,
  customer_id UUID REFERENCES customers(id),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')),
  payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  payment_method VARCHAR(50),
  payment_reference VARCHAR(200),
  subtotal DECIMAL(10,2) NOT NULL,
  shipping_cost DECIMAL(10,2) DEFAULT 0,
  tax_amount DECIMAL(10,2) DEFAULT 0,
  discount_amount DECIMAL(10,2) DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL,
  items JSONB NOT NULL, -- Array of order items
  shipping_address JSONB NOT NULL,
  billing_address JSONB,
  delivery_date DATE,
  delivery_slot VARCHAR(50),
  special_instructions TEXT,
  tracking_number VARCHAR(100),
  notes TEXT, -- Admin notes
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for order management
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_payment_status ON orders(payment_status);
CREATE INDEX idx_orders_date ON orders(created_at);
CREATE INDEX idx_orders_number ON orders(order_number);
```

**Order Items Structure (JSONB):**

```json
[
  {
    "product_id": "uuid",
    "product_name": "Red Rose Bouquet",
    "variant_id": "uuid",
    "variant_name": "Large",
    "quantity": 2,
    "price": 1500.0,
    "total_price": 3000.0,
    "sku": "RRB-L-001"
  }
]
```

**Address Structure (JSONB):**

```json
{
  "name": "John Doe",
  "phone": "+91 9876543210",
  "email": "john@example.com",
  "line1": "123 Main Street",
  "line2": "Apartment 4B",
  "city": "Mumbai",
  "state": "Maharashtra",
  "postal_code": "400001",
  "country": "India",
  "landmark": "Near City Mall"
}
```

---

### Customers Table

```sql
CREATE TABLE customers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  name VARCHAR(200) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone VARCHAR(20),
  date_of_birth DATE,
  gender VARCHAR(10) CHECK (gender IN ('male', 'female', 'other')),
  is_active BOOLEAN DEFAULT true,
  email_verified BOOLEAN DEFAULT false,
  phone_verified BOOLEAN DEFAULT false,
  total_orders INTEGER DEFAULT 0,
  total_spent DECIMAL(10,2) DEFAULT 0,
  last_login TIMESTAMP WITH TIME ZONE,
  failed_login_attempts INTEGER DEFAULT 0,
  locked_until TIMESTAMP WITH TIME ZONE,
  password_reset_token VARCHAR(255),
  password_reset_expires TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_customers_phone ON customers(phone);
CREATE INDEX idx_customers_active ON customers(is_active);
```

---

### Admins Table

```sql
CREATE TABLE admins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(200) NOT NULL,
  role VARCHAR(20) DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  is_active BOOLEAN DEFAULT true,
  is_verified BOOLEAN DEFAULT false,
  last_login TIMESTAMP WITH TIME ZONE,
  failed_login_attempts INTEGER DEFAULT 0,
  locked_until TIMESTAMP WITH TIME ZONE,
  password_reset_token VARCHAR(255),
  password_reset_expires TIMESTAMP WITH TIME ZONE,
  email_verification_token VARCHAR(255),
  email_verification_expires TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_admins_email ON admins(email);
CREATE INDEX idx_admins_role ON admins(role);
```

**Admin Roles:**

- `super_admin`: Full system access, user management
- `admin`: Standard admin access, no user management

---

## Authentication Tables

### User Sessions Table

```sql
CREATE TABLE user_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  user_type VARCHAR(20) NOT NULL CHECK (user_type IN ('admin', 'customer')),
  session_token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_sessions_token ON user_sessions(session_token);
CREATE INDEX idx_sessions_user ON user_sessions(user_id, user_type);
CREATE INDEX idx_sessions_expires ON user_sessions(expires_at);
```

### Login Attempts Table

```sql
CREATE TABLE login_attempts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  user_type VARCHAR(20) NOT NULL CHECK (user_type IN ('admin', 'customer')),
  ip_address INET,
  user_agent TEXT,
  success BOOLEAN NOT NULL,
  failure_reason VARCHAR(200),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_login_attempts_email ON login_attempts(email);
CREATE INDEX idx_login_attempts_ip ON login_attempts(ip_address);
CREATE INDEX idx_login_attempts_date ON login_attempts(created_at);
```

---

## Content Management Tables

### Pages Table

```sql
CREATE TABLE pages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  slug VARCHAR(200) UNIQUE NOT NULL,
  content TEXT,
  excerpt VARCHAR(500),
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  is_active BOOLEAN DEFAULT true,
  meta_title VARCHAR(200),
  meta_description VARCHAR(500),
  featured_image VARCHAR(500),
  template VARCHAR(50) DEFAULT 'default',
  author_id UUID REFERENCES admins(id),
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_pages_slug ON pages(slug);
CREATE INDEX idx_pages_status ON pages(status);
CREATE INDEX idx_pages_active ON pages(is_active);
```

### Homepage Sections Table

```sql
CREATE TABLE homepage_sections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(200),
  subtitle VARCHAR(500),
  section_type VARCHAR(50) NOT NULL, -- 'hero', 'featured_products', 'categories', etc.
  content JSONB, -- Configuration for the section
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_homepage_sections_type ON homepage_sections(section_type);
CREATE INDEX idx_homepage_sections_order ON homepage_sections(sort_order);
```

---

## Utility Tables

### Coupons Table

```sql
CREATE TABLE coupons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  type VARCHAR(20) NOT NULL CHECK (type IN ('percentage', 'fixed')),
  value DECIMAL(10,2) NOT NULL,
  minimum_amount DECIMAL(10,2),
  maximum_discount DECIMAL(10,2),
  usage_limit INTEGER,
  used_count INTEGER DEFAULT 0,
  per_customer_limit INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  starts_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_coupons_code ON coupons(code);
CREATE INDEX idx_coupons_active ON coupons(is_active);
```

### Site Settings Table

```sql
CREATE TABLE site_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key VARCHAR(100) UNIQUE NOT NULL,
  value TEXT,
  type VARCHAR(20) DEFAULT 'string' CHECK (type IN ('string', 'number', 'boolean', 'json')),
  description TEXT,
  group_name VARCHAR(50) DEFAULT 'general',
  is_public BOOLEAN DEFAULT false, -- Can be accessed by frontend
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_site_settings_key ON site_settings(key);
CREATE INDEX idx_site_settings_group ON site_settings(group_name);
```

**Common Settings:**

```sql
INSERT INTO site_settings (key, value, type, description, group_name, is_public) VALUES
('site_name', 'Florist in India', 'string', 'Website name', 'general', true),
('site_tagline', 'Fresh Flowers, Delivered with Love', 'string', 'Website tagline', 'general', true),
('contact_email', 'info@floristinindia.com', 'string', 'Contact email', 'contact', true),
('contact_phone', '+91 9876543210', 'string', 'Contact phone', 'contact', true),
('google_analytics_id', 'GA-XXXXXXXXX', 'string', 'Google Analytics ID', 'analytics', false),
('facebook_pixel_id', '1234567890', 'string', 'Facebook Pixel ID', 'analytics', false),
('razorpay_key_id', 'rzp_test_xxxxxx', 'string', 'Razorpay Key ID', 'payment', false);
```

---

## Row Level Security (RLS) Policies

### Products Policies

```sql
-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Public read access for active products
CREATE POLICY "Public read access for active products" ON products
  FOR SELECT USING (is_active = true);

-- Admin full access
CREATE POLICY "Admin full access to products" ON products
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_sessions s
      JOIN admins a ON s.user_id = a.id
      WHERE s.session_token = current_setting('request.jwt.claims', true)::json->>'session_token'
      AND s.user_type = 'admin'
      AND s.is_active = true
      AND s.expires_at > NOW()
      AND a.is_active = true
    )
  );
```

### Orders Policies

```sql
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Customers can read their own orders
CREATE POLICY "Customers can read own orders" ON orders
  FOR SELECT USING (
    customer_id = (
      SELECT s.user_id FROM user_sessions s
      WHERE s.session_token = current_setting('request.jwt.claims', true)::json->>'session_token'
      AND s.user_type = 'customer'
      AND s.is_active = true
      AND s.expires_at > NOW()
    )
  );

-- Admin full access to orders
CREATE POLICY "Admin full access to orders" ON orders
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_sessions s
      JOIN admins a ON s.user_id = a.id
      WHERE s.session_token = current_setting('request.jwt.claims', true)::json->>'session_token'
      AND s.user_type = 'admin'
      AND s.is_active = true
      AND s.expires_at > NOW()
      AND a.is_active = true
    )
  );
```

---

## Database Functions

### Update Timestamps Function

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to all tables with updated_at
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### Generate Order Number Function

```sql
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
  next_number INTEGER;
  order_number TEXT;
BEGIN
  -- Get next sequence number
  SELECT COALESCE(MAX(CAST(SUBSTRING(order_number FROM 4) AS INTEGER)), 0) + 1
  INTO next_number
  FROM orders
  WHERE order_number LIKE 'FII%';

  -- Format as FII + 5 digit number
  order_number := 'FII' || LPAD(next_number::TEXT, 5, '0');

  RETURN order_number;
END;
$$ LANGUAGE plpgsql;
```

### Update Customer Stats Function

```sql
CREATE OR REPLACE FUNCTION update_customer_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Update customer order count and total spent
    UPDATE customers
    SET
      total_orders = total_orders + 1,
      total_spent = total_spent + NEW.total_amount
    WHERE id = NEW.customer_id;

  ELSIF TG_OP = 'UPDATE' THEN
    -- If order status changed to cancelled/refunded, adjust stats
    IF OLD.status != NEW.status AND NEW.status IN ('cancelled', 'refunded') THEN
      UPDATE customers
      SET
        total_orders = total_orders - 1,
        total_spent = total_spent - NEW.total_amount
      WHERE id = NEW.customer_id;
    END IF;
  END IF;

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_customer_stats_trigger
  AFTER INSERT OR UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_customer_stats();
```

---

## Database Setup Instructions

### 1. Initial Setup

```sql
-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create database (if not using Supabase)
CREATE DATABASE florist_db;
```

### 2. Run Schema Migration

Execute the SQL files in order:

1. `auth-tables.sql` - Authentication tables
2. `database-setup.sql` - Core product/order tables
3. `database-migration.sql` - Additional features

### 3. Seed Data

```sql
-- Insert default admin user
INSERT INTO admins (email, password_hash, name, role, is_verified) VALUES
('admin@floristinindia.com', '$2b$12$hashed_password_here', 'Super Admin', 'super_admin', true);

-- Insert default categories
INSERT INTO categories (name, slug, description, is_active) VALUES
('Flowers', 'flowers', 'Fresh flowers for all occasions', true),
('Cakes', 'cakes', 'Delicious cakes for celebrations', true),
('Plants', 'plants', 'Beautiful plants for home and office', true),
('Gifts', 'gifts', 'Special gifts for loved ones', true);

-- Insert site settings
INSERT INTO site_settings (key, value, description, group_name, is_public) VALUES
('site_name', 'Florist in India', 'Website name', 'general', true),
('currency', 'INR', 'Default currency', 'general', true),
('default_shipping_cost', '50', 'Default shipping cost', 'shipping', false);
```

### 4. Environment Variables

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Database URL (if using direct connection)
DATABASE_URL=postgresql://user:password@host:port/database
```

---

## Performance Optimization

### Database Indexes

Key indexes for optimal performance:

```sql
-- Product search optimization
CREATE INDEX idx_products_fulltext ON products
USING gin(to_tsvector('english', name || ' ' || COALESCE(description, '')));

-- Category hierarchy queries
CREATE INDEX idx_categories_hierarchy ON categories(parent_id, sort_order);

-- Order filtering
CREATE INDEX idx_orders_customer_date ON orders(customer_id, created_at DESC);
CREATE INDEX idx_orders_status_date ON orders(status, created_at DESC);

-- Session management
CREATE INDEX idx_sessions_cleanup ON user_sessions(expires_at) WHERE is_active = true;
```

### Query Optimization

```sql
-- Efficient product fetching with category
SELECT p.*, c.name as category_name
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
WHERE p.is_active = true
ORDER BY p.created_at DESC
LIMIT 20;

-- Order details with customer info
SELECT o.*, c.name as customer_name, c.email as customer_email
FROM orders o
LEFT JOIN customers c ON o.customer_id = c.id
WHERE o.order_number = $1;
```

### Maintenance Tasks

```sql
-- Clean up expired sessions
DELETE FROM user_sessions
WHERE expires_at < NOW() - INTERVAL '7 days';

-- Update product search vectors
UPDATE products
SET search_vector = to_tsvector('english', name || ' ' || COALESCE(description, ''))
WHERE updated_at > NOW() - INTERVAL '1 day';

-- Analyze tables for query optimization
ANALYZE products;
ANALYZE orders;
ANALYZE customers;
```

For additional database operations and maintenance, refer to the admin dashboard's database management tools.
