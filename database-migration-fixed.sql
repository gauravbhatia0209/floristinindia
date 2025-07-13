-- Florist in India - Fixed Database Migration Script
-- This script safely adds new tables and columns without breaking existing data

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Update existing site_settings table structure
DO $$
BEGIN
    -- Add new columns to site_settings if they don't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'type') THEN
        ALTER TABLE site_settings ADD COLUMN type VARCHAR(20) DEFAULT 'text' CHECK (type IN ('text', 'json', 'boolean', 'number', 'image'));
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'description') THEN
        ALTER TABLE site_settings ADD COLUMN description TEXT;
    END IF;
END $$;

-- Update existing product_categories table structure
DO $$
BEGIN
    -- Add new columns to product_categories if they don't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'product_categories' AND column_name = 'parent_id') THEN
        ALTER TABLE product_categories ADD COLUMN parent_id UUID REFERENCES product_categories(id) ON DELETE SET NULL;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'product_categories' AND column_name = 'meta_title') THEN
        ALTER TABLE product_categories ADD COLUMN meta_title VARCHAR(255);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'product_categories' AND column_name = 'meta_description') THEN
        ALTER TABLE product_categories ADD COLUMN meta_description TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'product_categories' AND column_name = 'show_in_menu') THEN
        ALTER TABLE product_categories ADD COLUMN show_in_menu BOOLEAN DEFAULT TRUE;
    END IF;
END $$;

-- Update existing products table structure
DO $$
BEGIN
    -- Add new columns to products if they don't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'is_featured') THEN
        ALTER TABLE products ADD COLUMN is_featured BOOLEAN DEFAULT FALSE;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'subcategory_id') THEN
        ALTER TABLE products ADD COLUMN subcategory_id UUID REFERENCES product_categories(id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'upload_file_types') THEN
        ALTER TABLE products ADD COLUMN upload_file_types TEXT[] DEFAULT '{}';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'meta_title') THEN
        ALTER TABLE products ADD COLUMN meta_title VARCHAR(255);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'meta_description') THEN
        ALTER TABLE products ADD COLUMN meta_description TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'weight') THEN
        ALTER TABLE products ADD COLUMN weight DECIMAL(8, 2);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'dimensions') THEN
        ALTER TABLE products ADD COLUMN dimensions JSONB;
    END IF;
END $$;

-- Create Product Variants Table if it doesn't exist
CREATE TABLE IF NOT EXISTS product_variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    sale_price DECIMAL(10, 2),
    sku VARCHAR(100),
    stock_quantity INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Update existing customers table structure (FIXED)
DO $$
BEGIN
    -- Handle address/addresses column situation properly
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'customers' AND column_name = 'address')
       AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'customers' AND column_name = 'addresses') THEN
        -- Only rename if addresses column doesn't exist
        ALTER TABLE customers RENAME COLUMN address TO addresses;
    ELSIF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'customers' AND column_name = 'address')
          AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'customers' AND column_name = 'addresses') THEN
        -- Both exist, drop the old address column
        ALTER TABLE customers DROP COLUMN address;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'customers' AND column_name = 'addresses') THEN
        -- Neither exists, create addresses column
        ALTER TABLE customers ADD COLUMN addresses JSONB DEFAULT '[]';
    END IF;

    -- Add other new columns if they don't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'customers' AND column_name = 'gender') THEN
        ALTER TABLE customers ADD COLUMN gender VARCHAR(10) CHECK (gender IN ('male', 'female', 'other'));
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'customers' AND column_name = 'preferences') THEN
        ALTER TABLE customers ADD COLUMN preferences JSONB;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'customers' AND column_name = 'is_active') THEN
        ALTER TABLE customers ADD COLUMN is_active BOOLEAN DEFAULT TRUE;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'customers' AND column_name = 'email_verified') THEN
        ALTER TABLE customers ADD COLUMN email_verified BOOLEAN DEFAULT FALSE;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'customers' AND column_name = 'phone_verified') THEN
        ALTER TABLE customers ADD COLUMN phone_verified BOOLEAN DEFAULT FALSE;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'customers' AND column_name = 'total_orders') THEN
        ALTER TABLE customers ADD COLUMN total_orders INTEGER DEFAULT 0;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'customers' AND column_name = 'total_spent') THEN
        ALTER TABLE customers ADD COLUMN total_spent DECIMAL(12, 2) DEFAULT 0;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'customers' AND column_name = 'last_order_date') THEN
        ALTER TABLE customers ADD COLUMN last_order_date TIMESTAMP WITH TIME ZONE;
    END IF;
END $$;

-- Update existing orders table structure
DO $$
BEGIN
    -- Add new columns to orders if they don't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'order_number') THEN
        ALTER TABLE orders ADD COLUMN order_number VARCHAR(50);
        -- Generate order numbers for existing orders
        UPDATE orders SET order_number = 'ORD-' || to_char(created_at, 'YYYYMMDD') || '-' || LPAD((ROW_NUMBER() OVER (ORDER BY created_at))::text, 4, '0') WHERE order_number IS NULL;
        ALTER TABLE orders ALTER COLUMN order_number SET NOT NULL;
        ALTER TABLE orders ADD CONSTRAINT orders_order_number_unique UNIQUE (order_number);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'tax_amount') THEN
        ALTER TABLE orders ADD COLUMN tax_amount DECIMAL(10, 2) DEFAULT 0;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'delivery_zone_id') THEN
        ALTER TABLE orders ADD COLUMN delivery_zone_id UUID;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'special_instructions') THEN
        ALTER TABLE orders ADD COLUMN special_instructions TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'payment_reference') THEN
        ALTER TABLE orders ADD COLUMN payment_reference VARCHAR(255);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'coupon_code') THEN
        ALTER TABLE orders ADD COLUMN coupon_code VARCHAR(50);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'tracking_number') THEN
        ALTER TABLE orders ADD COLUMN tracking_number VARCHAR(100);
    END IF;
END $$;

-- Create new tables that don't exist yet

-- Coupons Table
CREATE TABLE IF NOT EXISTS coupons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    discount_type VARCHAR(10) NOT NULL CHECK (discount_type IN ('flat', 'percentage')),
    discount_value DECIMAL(8, 2) NOT NULL,
    minimum_order_amount DECIMAL(10, 2),
    maximum_discount_amount DECIMAL(10, 2),
    usage_limit INTEGER,
    usage_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    starts_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    applicable_categories TEXT[] DEFAULT '{}',
    applicable_products TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Shipping Zones Table
CREATE TABLE IF NOT EXISTS shipping_zones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    pincodes TEXT[] NOT NULL DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Shipping Methods Table
CREATE TABLE IF NOT EXISTS shipping_methods (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    zone_id UUID REFERENCES shipping_zones(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(20) NOT NULL CHECK (type IN ('same_day', 'next_day', 'standard', 'express', 'scheduled')),
    price DECIMAL(8, 2) NOT NULL,
    free_shipping_minimum DECIMAL(10, 2),
    delivery_time VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Dynamic Pages Table
CREATE TABLE IF NOT EXISTS pages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    content JSONB NOT NULL DEFAULT '{}',
    meta_title VARCHAR(255),
    meta_description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    show_in_footer BOOLEAN DEFAULT FALSE,
    footer_column INTEGER,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Update existing homepage_sections table structure
DO $$
BEGIN
    -- Add new columns to homepage_sections if they don't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'homepage_sections' AND column_name = 'subtitle') THEN
        ALTER TABLE homepage_sections ADD COLUMN subtitle VARCHAR(255);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'homepage_sections' AND column_name = 'settings') THEN
        ALTER TABLE homepage_sections ADD COLUMN settings JSONB DEFAULT '{}';
    END IF;

    -- Update type constraint to include new types (drop and recreate to avoid conflicts)
    ALTER TABLE homepage_sections DROP CONSTRAINT IF EXISTS homepage_sections_type_check;
    ALTER TABLE homepage_sections ADD CONSTRAINT homepage_sections_type_check
        CHECK (type IN ('hero', 'category_grid', 'product_carousel', 'product_grid', 'text_block', 'image_block', 'testimonials', 'newsletter', 'features', 'banner'));
END $$;

-- Menu Items Table
CREATE TABLE IF NOT EXISTS menu_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    url VARCHAR(500),
    target VARCHAR(10) DEFAULT '_self' CHECK (target IN ('_self', '_blank')),
    parent_id UUID REFERENCES menu_items(id) ON DELETE CASCADE,
    category_id UUID REFERENCES product_categories(id) ON DELETE CASCADE,
    page_id UUID REFERENCES pages(id) ON DELETE CASCADE,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Footer Sections Table
CREATE TABLE IF NOT EXISTS footer_sections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    content JSONB NOT NULL DEFAULT '{}',
    column_position INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sub-users Table
CREATE TABLE IF NOT EXISTS sub_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'manager', 'editor', 'viewer')),
    permissions JSONB NOT NULL DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP WITH TIME ZONE,
    created_by UUID REFERENCES sub_users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for new tables (skip if they already exist)
CREATE INDEX IF NOT EXISTS idx_product_variants_product ON product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_categories_parent ON product_categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_categories_menu ON product_categories(show_in_menu);
CREATE INDEX IF NOT EXISTS idx_products_subcategory ON products(subcategory_id);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured);
CREATE INDEX IF NOT EXISTS idx_shipping_methods_zone ON shipping_methods(zone_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_parent ON menu_items(parent_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_category ON menu_items(category_id);

-- Insert additional site settings (skip if they already exist)
INSERT INTO site_settings (key, value, type, description) VALUES
('currency', 'INR', 'text', 'Default currency'),
('currency_symbol', '₹', 'text', 'Currency symbol'),
('gst_rate', '18', 'number', 'GST rate percentage'),
('gst_number', '07AAACZ1234C1Z5', 'text', 'GST registration number'),
('logo_url', '', 'image', 'Website logo'),
('favicon_url', '', 'image', 'Website favicon'),
('social_facebook', 'https://facebook.com/floristinindia', 'text', 'Facebook page URL'),
('social_instagram', 'https://instagram.com/floristinindia', 'text', 'Instagram profile URL'),
('social_twitter', 'https://twitter.com/floristinindia', 'text', 'Twitter profile URL'),
('social_youtube', 'https://youtube.com/@floristinindia', 'text', 'YouTube channel URL'),
('free_shipping_minimum', '999', 'number', 'Minimum amount for free shipping'),
('default_delivery_charge', '99', 'number', 'Default delivery charge'),
('same_day_delivery_cutoff', '14:00', 'text', 'Same day delivery order cutoff time'),
('business_hours', '{"monday": "9:00-21:00", "tuesday": "9:00-21:00", "wednesday": "9:00-21:00", "thursday": "9:00-21:00", "friday": "9:00-21:00", "saturday": "9:00-21:00", "sunday": "9:00-21:00"}', 'json', 'Business operating hours'),
('meta_title', 'Florist in India - Premium Fresh Flower Delivery', 'text', 'Default meta title'),
('meta_description', 'Order fresh flowers online for same-day delivery across India. Premium flower arrangements for all occasions with 100% freshness guarantee.', 'text', 'Default meta description'),
('google_analytics_id', '', 'text', 'Google Analytics tracking ID (G-XXXXXXXXXX)'),
('facebook_pixel_id', '', 'text', 'Facebook Pixel ID for tracking and Facebook Shop'),
('facebook_app_id', '', 'text', 'Facebook App ID for enhanced social sharing'),
('meta_title_template', '%title% | %sitename%', 'text', 'Template for page titles'),
('og_image_url', '', 'image', 'Default Open Graph image for social sharing'),
('twitter_card_type', 'summary_large_image', 'text', 'Twitter card type for social sharing'),
('twitter_site', '', 'text', 'Twitter site handle (@username)'),
('canonical_url', '', 'text', 'Canonical URL for the website'),
('robots_txt_content', '', 'text', 'Custom robots.txt content'),
('schema_org_organization', '', 'text', 'JSON-LD organization schema markup'),
('custom_head_tags', '', 'text', 'Custom HTML tags for the head section'),
('sitemap_enabled', 'true', 'boolean', 'Enable automatic XML sitemap generation'),
('breadcrumbs_enabled', 'true', 'boolean', 'Enable breadcrumb navigation');
ON CONFLICT (key) DO NOTHING;

-- Insert shipping zones and methods (only if they don't exist)
INSERT INTO shipping_zones (name, description, pincodes) VALUES
('Delhi NCR', 'Delhi, Gurgaon, Noida, Faridabad, Ghaziabad', ARRAY['110001', '110002', '110003', '110004', '110005', '201301', '201302', '122001', '122002', '121001']),
('Mumbai Metropolitan', 'Mumbai, Thane, Navi Mumbai, Kalyan', ARRAY['400001', '400002', '400003', '400004', '400005', '401101', '401102', '410206', '421301']),
('Bangalore Urban', 'Bangalore city and surrounding areas', ARRAY['560001', '560002', '560003', '560004', '560005', '560078', '560100', '562157']),
('Chennai Metro', 'Chennai and surrounding areas', ARRAY['600001', '600002', '600003', '600004', '600005', '600028', '600100']),
('Hyderabad Metro', 'Hyderabad and Secunderabad', ARRAY['500001', '500002', '500003', '500004', '500005', '500081', '500100']),
('Pune Metro', 'Pune and PCMC areas', ARRAY['411001', '411002', '411003', '411004', '411005', '411014', '411057'])
ON CONFLICT (name) DO NOTHING;

-- Insert shipping methods for each zone
DO $$
DECLARE
    zone_record RECORD;
BEGIN
    FOR zone_record IN SELECT id, name FROM shipping_zones LOOP
        INSERT INTO shipping_methods (zone_id, name, description, type, price, delivery_time, sort_order) VALUES
        (zone_record.id, 'Same Day Delivery', 'Order before 2 PM for same day delivery', 'same_day', 149.00, '4-6 hours', 1),
        (zone_record.id, 'Next Day Delivery', 'Delivered next day', 'next_day', 99.00, 'Next day', 2)
        ON CONFLICT DO NOTHING;

        -- Add scheduled delivery for major metros
        IF zone_record.name IN ('Delhi NCR', 'Mumbai Metropolitan', 'Bangalore Urban') THEN
            INSERT INTO shipping_methods (zone_id, name, description, type, price, delivery_time, sort_order) VALUES
            (zone_record.id, 'Scheduled Delivery', 'Choose your preferred date and time', 'scheduled', 199.00, 'As per schedule', 3)
            ON CONFLICT DO NOTHING;
        END IF;
    END LOOP;
END $$;

-- Insert sample coupons
INSERT INTO coupons (code, name, description, discount_type, discount_value, minimum_order_amount, usage_limit, is_active, expires_at) VALUES
('WELCOME10', 'Welcome Discount', 'Get 10% off on your first order', 'percentage', 10.00, 500.00, 1000, TRUE, '2024-12-31 23:59:59'),
('FLAT100', 'Flat ₹100 Off', 'Get ₹100 off on orders above ₹999', 'flat', 100.00, 999.00, 5000, TRUE, '2024-12-31 23:59:59'),
('LOVE20', 'Love Special', '20% off on anniversary and romantic flowers', 'percentage', 20.00, 799.00, 2000, TRUE, '2024-12-31 23:59:59'),
('BIRTHDAY15', 'Birthday Special', '15% off on birthday flower arrangements', 'percentage', 15.00, 599.00, 3000, TRUE, '2024-12-31 23:59:59')
ON CONFLICT (code) DO NOTHING;

-- Create updated_at triggers for new tables
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers (only if they don't exist)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_timestamp_product_variants') THEN
        CREATE TRIGGER set_timestamp_product_variants BEFORE UPDATE ON product_variants FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_timestamp_coupons') THEN
        CREATE TRIGGER set_timestamp_coupons BEFORE UPDATE ON coupons FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_timestamp_shipping_zones') THEN
        CREATE TRIGGER set_timestamp_shipping_zones BEFORE UPDATE ON shipping_zones FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_timestamp_shipping_methods') THEN
        CREATE TRIGGER set_timestamp_shipping_methods BEFORE UPDATE ON shipping_methods FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_timestamp_pages') THEN
        CREATE TRIGGER set_timestamp_pages BEFORE UPDATE ON pages FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_timestamp_menu_items') THEN
        CREATE TRIGGER set_timestamp_menu_items BEFORE UPDATE ON menu_items FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_timestamp_footer_sections') THEN
        CREATE TRIGGER set_timestamp_footer_sections BEFORE UPDATE ON footer_sections FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_timestamp_sub_users') THEN
        CREATE TRIGGER set_timestamp_sub_users BEFORE UPDATE ON sub_users FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();
    END IF;
END $$;

-- Insert a default admin user (only if sub_users table is empty)
INSERT INTO sub_users (email, first_name, last_name, role, permissions)
SELECT 'admin@floristinindia.com', 'Super', 'Admin', 'admin', '{
  "products": {"view": true, "create": true, "edit": true, "delete": true},
  "orders": {"view": true, "create": true, "edit": true, "delete": true},
  "customers": {"view": true, "create": true, "edit": true, "delete": true},
  "categories": {"view": true, "create": true, "edit": true, "delete": true},
  "coupons": {"view": true, "create": true, "edit": true, "delete": true},
  "shipping": {"view": true, "create": true, "edit": true, "delete": true},
  "pages": {"view": true, "create": true, "edit": true, "delete": true},
  "homepage": {"view": true, "edit": true},
  "settings": {"view": true, "edit": true},
  "users": {"view": true, "create": true, "edit": true, "delete": true}
}'
WHERE NOT EXISTS (SELECT 1 FROM sub_users);
