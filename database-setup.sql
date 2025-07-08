-- Florist in India - Comprehensive CMS Database Schema
-- Dynamic, database-driven e-commerce platform with full admin control

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Site Settings Table - Global configuration
CREATE TABLE site_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(255) UNIQUE NOT NULL,
    value TEXT NOT NULL,
    type VARCHAR(20) DEFAULT 'text' CHECK (type IN ('text', 'json', 'boolean', 'number', 'image')),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Product Categories Table - Hierarchical structure
CREATE TABLE product_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    image_url TEXT,
    parent_id UUID REFERENCES product_categories(id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    meta_title VARCHAR(255),
    meta_description TEXT,
    show_in_menu BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products Table - Enhanced with variants and delivery zones
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    short_description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    sale_price DECIMAL(10, 2),
    sku VARCHAR(100),
    stock_quantity INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    category_id UUID REFERENCES product_categories(id),
    subcategory_id UUID REFERENCES product_categories(id),
    images TEXT[] DEFAULT '{}',
    tags TEXT[] DEFAULT '{}',
    requires_file_upload BOOLEAN DEFAULT FALSE,
    upload_file_types TEXT[] DEFAULT '{}',
    delivery_zones TEXT[] DEFAULT '{}',
    meta_title VARCHAR(255),
    meta_description TEXT,
    weight DECIMAL(8, 2),
    dimensions JSONB, -- {length, width, height}
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Product Variants Table
CREATE TABLE product_variants (
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

-- Customers Table - Enhanced with birthday/anniversary
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE,
    anniversary_date DATE,
    gender VARCHAR(10) CHECK (gender IN ('male', 'female', 'other')),
    addresses JSONB DEFAULT '[]',
    preferences JSONB,
    is_active BOOLEAN DEFAULT TRUE,
    email_verified BOOLEAN DEFAULT FALSE,
    phone_verified BOOLEAN DEFAULT FALSE,
    total_orders INTEGER DEFAULT 0,
    total_spent DECIMAL(12, 2) DEFAULT 0,
    last_order_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders Table - Enhanced with delivery zones
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(50) UNIQUE NOT NULL,
    customer_id UUID REFERENCES customers(id),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')),
    total_amount DECIMAL(10, 2) NOT NULL,
    shipping_amount DECIMAL(10, 2) DEFAULT 0,
    discount_amount DECIMAL(10, 2) DEFAULT 0,
    tax_amount DECIMAL(10, 2) DEFAULT 0,
    items JSONB NOT NULL DEFAULT '[]',
    shipping_address JSONB NOT NULL,
    billing_address JSONB NOT NULL,
    delivery_date DATE,
    delivery_slot VARCHAR(50),
    delivery_zone_id UUID,
    special_instructions TEXT,
    payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded', 'partially_refunded')),
    payment_method VARCHAR(50),
    payment_reference VARCHAR(255),
    coupon_code VARCHAR(50),
    tracking_number VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Coupons Table
CREATE TABLE coupons (
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
CREATE TABLE shipping_zones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    pincodes TEXT[] NOT NULL DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Shipping Methods Table
CREATE TABLE shipping_methods (
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

-- Dynamic Pages Table (CMS)
CREATE TABLE pages (
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

-- Homepage Sections Table - Dynamic and reorderable
CREATE TABLE homepage_sections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type VARCHAR(50) NOT NULL CHECK (type IN ('hero', 'category_grid', 'product_carousel', 'product_grid', 'text_block', 'image_block', 'testimonials', 'newsletter', 'features', 'banner')),
    title VARCHAR(255),
    subtitle VARCHAR(255),
    content JSONB NOT NULL DEFAULT '{}',
    settings JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Menu Items Table - Dynamic header navigation
CREATE TABLE menu_items (
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

-- Footer Sections Table - Admin manageable
CREATE TABLE footer_sections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    content JSONB NOT NULL DEFAULT '{}',
    column_position INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sub-users Table - Role-based permissions
CREATE TABLE sub_users (
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

-- Create indexes for better performance
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_subcategory ON products(subcategory_id);
CREATE INDEX idx_products_active ON products(is_active);
CREATE INDEX idx_products_featured ON products(is_featured);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_product_variants_product ON product_variants(product_id);
CREATE INDEX idx_categories_parent ON product_categories(parent_id);
CREATE INDEX idx_categories_active ON product_categories(is_active);
CREATE INDEX idx_categories_slug ON product_categories(slug);
CREATE INDEX idx_categories_menu ON product_categories(show_in_menu);
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_date ON orders(created_at);
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_customers_phone ON customers(phone);
CREATE INDEX idx_shipping_methods_zone ON shipping_methods(zone_id);
CREATE INDEX idx_menu_items_parent ON menu_items(parent_id);
CREATE INDEX idx_menu_items_category ON menu_items(category_id);
CREATE INDEX idx_homepage_sections_active ON homepage_sections(is_active);
CREATE INDEX idx_homepage_sections_order ON homepage_sections(sort_order);

-- Insert Sample Data

-- Site Settings
INSERT INTO site_settings (key, value, type, description) VALUES
('site_name', 'Florist in India', 'text', 'Website name'),
('site_description', 'Premium Flower Delivery Service Across India', 'text', 'Website description'),
('contact_phone', '+91 98765 43210', 'text', 'Primary contact phone'),
('contact_email', 'orders@floristinindia.com', 'text', 'Primary contact email'),
('contact_address', 'Delhi NCR, Mumbai, Bangalore & 100+ Cities', 'text', 'Business address'),
('currency', 'INR', 'text', 'Default currency'),
('currency_symbol', '₹', 'text', 'Currency symbol'),
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
('meta_description', 'Order fresh flowers online for same-day delivery across India. Premium flower arrangements for all occasions with 100% freshness guarantee.', 'text', 'Default meta description');

-- Product Categories (Hierarchical)
INSERT INTO product_categories (name, slug, description, is_active, sort_order, show_in_menu) VALUES
('Birthday Flowers', 'birthday-flowers', 'Beautiful flowers perfect for birthday celebrations', TRUE, 1, TRUE),
('Anniversary Flowers', 'anniversary-flowers', 'Romantic flower arrangements for anniversaries', TRUE, 2, TRUE),
('Wedding Flowers', 'wedding-flowers', 'Elegant wedding bouquets and decorations', TRUE, 3, TRUE),
('Sympathy Flowers', 'sympathy-flowers', 'Thoughtful arrangements for sympathy and condolences', TRUE, 4, TRUE),
('Roses', 'roses', 'Classic roses in various colors and arrangements', TRUE, 5, TRUE),
('Lilies', 'lilies', 'Elegant lily arrangements for all occasions', TRUE, 6, TRUE),
('Orchids', 'orchids', 'Exotic orchid plants and arrangements', TRUE, 7, TRUE),
('Mixed Bouquets', 'mixed-bouquets', 'Beautiful mixed flower bouquets', TRUE, 8, TRUE),
('Plants', 'plants', 'Indoor and outdoor plants for home and office', TRUE, 9, TRUE),
('Corporate Gifts', 'corporate-gifts', 'Professional flower arrangements for corporate events', TRUE, 10, TRUE);

-- Subcategories
INSERT INTO product_categories (name, slug, description, parent_id, is_active, sort_order, show_in_menu) VALUES
('Red Roses', 'red-roses', 'Classic red roses for love and romance', (SELECT id FROM product_categories WHERE slug = 'roses'), TRUE, 1, FALSE),
('Pink Roses', 'pink-roses', 'Delicate pink roses for appreciation', (SELECT id FROM product_categories WHERE slug = 'roses'), TRUE, 2, FALSE),
('White Roses', 'white-roses', 'Pure white roses for sympathy and purity', (SELECT id FROM product_categories WHERE slug = 'roses'), TRUE, 3, FALSE),
('Asiatic Lilies', 'asiatic-lilies', 'Vibrant asiatic lily arrangements', (SELECT id FROM product_categories WHERE slug = 'lilies'), TRUE, 1, FALSE),
('Oriental Lilies', 'oriental-lilies', 'Fragrant oriental lily bouquets', (SELECT id FROM product_categories WHERE slug = 'lilies'), TRUE, 2, FALSE);

-- Shipping Zones
INSERT INTO shipping_zones (name, description, pincodes) VALUES
('Delhi NCR', 'Delhi, Gurgaon, Noida, Faridabad, Ghaziabad', ARRAY['110001', '110002', '110003', '110004', '110005', '201301', '201302', '122001', '122002', '121001']),
('Mumbai Metropolitan', 'Mumbai, Thane, Navi Mumbai, Kalyan', ARRAY['400001', '400002', '400003', '400004', '400005', '401101', '401102', '410206', '421301']),
('Bangalore Urban', 'Bangalore city and surrounding areas', ARRAY['560001', '560002', '560003', '560004', '560005', '560078', '560100', '562157']),
('Chennai Metro', 'Chennai and surrounding areas', ARRAY['600001', '600002', '600003', '600004', '600005', '600028', '600100']),
('Hyderabad Metro', 'Hyderabad and Secunderabad', ARRAY['500001', '500002', '500003', '500004', '500005', '500081', '500100']),
('Pune Metro', 'Pune and PCMC areas', ARRAY['411001', '411002', '411003', '411004', '411005', '411014', '411057']);

-- Shipping Methods
INSERT INTO shipping_methods (zone_id, name, description, type, price, delivery_time, sort_order) VALUES
((SELECT id FROM shipping_zones WHERE name = 'Delhi NCR'), 'Same Day Delivery', 'Order before 2 PM for same day delivery', 'same_day', 149.00, '4-6 hours', 1),
((SELECT id FROM shipping_zones WHERE name = 'Delhi NCR'), 'Next Day Delivery', 'Delivered next day', 'next_day', 99.00, 'Next day', 2),
((SELECT id FROM shipping_zones WHERE name = 'Delhi NCR'), 'Scheduled Delivery', 'Choose your preferred date and time', 'scheduled', 199.00, 'As per schedule', 3),
((SELECT id FROM shipping_zones WHERE name = 'Mumbai Metropolitan'), 'Same Day Delivery', 'Order before 2 PM for same day delivery', 'same_day', 149.00, '4-6 hours', 1),
((SELECT id FROM shipping_zones WHERE name = 'Mumbai Metropolitan'), 'Next Day Delivery', 'Delivered next day', 'next_day', 99.00, 'Next day', 2),
((SELECT id FROM shipping_zones WHERE name = 'Bangalore Urban'), 'Same Day Delivery', 'Order before 2 PM for same day delivery', 'same_day', 149.00, '4-6 hours', 1),
((SELECT id FROM shipping_zones WHERE name = 'Bangalore Urban'), 'Next Day Delivery', 'Delivered next day', 'next_day', 99.00, 'Next day', 2);

-- Sample Products
INSERT INTO products (name, slug, description, short_description, price, sale_price, category_id, subcategory_id, is_active, is_featured, stock_quantity, tags, delivery_zones) VALUES
('Red Rose Bouquet - 12 Pieces', 'red-rose-bouquet-12', 'A classic bouquet of 12 fresh red roses wrapped in elegant paper with ribbon. Perfect for expressing love and romance.', 'Classic red rose bouquet - perfect for expressing love', 1199.00, 899.00, (SELECT id FROM product_categories WHERE slug = 'roses'), (SELECT id FROM product_categories WHERE slug = 'red-roses'), TRUE, TRUE, 50, ARRAY['roses', 'romantic', 'red', 'love'], ARRAY['Delhi NCR', 'Mumbai Metropolitan', 'Bangalore Urban']),
('Pink Lily Arrangement', 'pink-lily-arrangement', 'Stunning pink lilies arranged in a beautiful ceramic vase with complementary greenery.', 'Elegant pink lily arrangement in decorative vase', 1499.00, NULL, (SELECT id FROM product_categories WHERE slug = 'lilies'), (SELECT id FROM product_categories WHERE slug = 'asiatic-lilies'), TRUE, TRUE, 30, ARRAY['lilies', 'pink', 'vase', 'elegant'], ARRAY['Delhi NCR', 'Mumbai Metropolitan']),
('Mixed Flower Bouquet', 'mixed-flower-bouquet', 'A vibrant mix of seasonal flowers including roses, carnations, chrysanthemums and alstroemeria.', 'Colorful mixed flower bouquet for any occasion', 1299.00, 999.00, (SELECT id FROM product_categories WHERE slug = 'mixed-bouquets'), NULL, TRUE, TRUE, 40, ARRAY['mixed', 'colorful', 'seasonal', 'versatile'], ARRAY['Delhi NCR', 'Mumbai Metropolitan', 'Bangalore Urban', 'Chennai Metro']),
('White Orchid Plant', 'white-orchid-plant', 'Beautiful white orchid plant in premium ceramic pot - perfect for home and office decoration.', 'Elegant white orchid plant in ceramic pot', 1899.00, NULL, (SELECT id FROM product_categories WHERE slug = 'orchids'), NULL, TRUE, FALSE, 20, ARRAY['orchids', 'white', 'plant', 'long-lasting'], ARRAY['Delhi NCR', 'Mumbai Metropolitan', 'Bangalore Urban']),
('Birthday Special Bouquet', 'birthday-special-bouquet', 'Cheerful birthday bouquet with bright gerberas, roses and carnations with a special birthday card.', 'Special birthday bouquet with greeting card', 1399.00, 1099.00, (SELECT id FROM product_categories WHERE slug = 'birthday-flowers'), NULL, TRUE, TRUE, 35, ARRAY['birthday', 'bright', 'card', 'celebration'], ARRAY['Delhi NCR', 'Mumbai Metropolitan', 'Bangalore Urban', 'Chennai Metro', 'Hyderabad Metro']),
('Anniversary Rose Box', 'anniversary-rose-box', 'Premium roses arranged in an elegant black box - perfect for anniversary celebrations.', 'Luxury rose box arrangement for anniversaries', 2199.00, 1799.00, (SELECT id FROM product_categories WHERE slug = 'anniversary-flowers'), (SELECT id FROM product_categories WHERE slug = 'red-roses'), TRUE, TRUE, 25, ARRAY['anniversary', 'luxury', 'box', 'premium'], ARRAY['Delhi NCR', 'Mumbai Metropolitan']),
('Sympathy Wreath', 'sympathy-wreath', 'Thoughtful white lily and rose wreath for expressing condolences and sympathy.', 'White lily and rose sympathy wreath', 2499.00, NULL, (SELECT id FROM product_categories WHERE slug = 'sympathy-flowers'), NULL, TRUE, FALSE, 15, ARRAY['sympathy', 'white', 'wreath', 'condolence'], ARRAY['Delhi NCR', 'Mumbai Metropolitan', 'Bangalore Urban', 'Chennai Metro']),
('Corporate Desk Plant', 'corporate-desk-plant', 'Low-maintenance desk plant perfect for office environments. Includes decorative planter.', 'Professional desk plant for offices', 899.00, 699.00, (SELECT id FROM product_categories WHERE slug = 'corporate-gifts'), NULL, TRUE, FALSE, 60, ARRAY['corporate', 'office', 'desk', 'low-maintenance'], ARRAY['Delhi NCR', 'Mumbai Metropolitan', 'Bangalore Urban', 'Chennai Metro', 'Hyderabad Metro', 'Pune Metro']);

-- Product Variants
INSERT INTO product_variants (product_id, name, price, sale_price, stock_quantity) VALUES
((SELECT id FROM products WHERE slug = 'red-rose-bouquet-12'), '6 Roses', 699.00, 549.00, 30),
((SELECT id FROM products WHERE slug = 'red-rose-bouquet-12'), '12 Roses', 1199.00, 899.00, 50),
((SELECT id FROM products WHERE slug = 'red-rose-bouquet-12'), '24 Roses', 2199.00, 1799.00, 20),
((SELECT id FROM products WHERE slug = 'mixed-flower-bouquet'), 'Small', 899.00, 699.00, 25),
((SELECT id FROM products WHERE slug = 'mixed-flower-bouquet'), 'Medium', 1299.00, 999.00, 40),
((SELECT id FROM products WHERE slug = 'mixed-flower-bouquet'), 'Large', 1799.00, 1399.00, 15);

-- Sample Coupons
INSERT INTO coupons (code, name, description, discount_type, discount_value, minimum_order_amount, usage_limit, is_active, expires_at) VALUES
('WELCOME10', 'Welcome Discount', 'Get 10% off on your first order', 'percentage', 10.00, 500.00, 1000, TRUE, '2024-12-31 23:59:59'),
('FLAT100', 'Flat ₹100 Off', 'Get ₹100 off on orders above ₹999', 'flat', 100.00, 999.00, 5000, TRUE, '2024-12-31 23:59:59'),
('LOVE20', 'Love Special', '20% off on anniversary and romantic flowers', 'percentage', 20.00, 799.00, 2000, TRUE, '2024-12-31 23:59:59'),
('BIRTHDAY15', 'Birthday Special', '15% off on birthday flower arrangements', 'percentage', 15.00, 599.00, 3000, TRUE, '2024-12-31 23:59:59');

-- Homepage Sections
INSERT INTO homepage_sections (type, title, subtitle, content, settings, sort_order) VALUES
('hero', 'Fresh Flowers Delivered Daily', 'Experience the joy of premium flower delivery across India', '{"background_image": "", "button_text": "Shop Now", "button_link": "/products", "features": ["Same-day delivery", "100+ cities", "Fresh guarantee"]}', '{"background_color": "gradient-rose", "text_color": "white"}', 1),
('features', 'Why Choose Us', 'We deliver happiness with every flower', '{"features": [{"icon": "truck", "title": "Same Day Delivery", "description": "Order before 2 PM and get fresh flowers delivered the same day"}, {"icon": "shield", "title": "Fresh Guarantee", "description": "100% fresh flowers guaranteed or your money back"}, {"icon": "heart", "title": "24/7 Support", "description": "Our customer care team is always here to help you"}]}', '{}', 2),
('category_grid', 'Shop by Occasion', 'Find the perfect flowers for every special moment', '{"show_count": 8, "layout": "grid", "show_product_count": true}', '{}', 3),
('product_carousel', 'Bestselling Flowers', 'Handpicked fresh flowers loved by thousands', '{"product_filter": "featured", "show_count": 8, "autoplay": true}', '{}', 4),
('testimonials', 'What Our Customers Say', 'Real reviews from happy customers', '{"testimonials": [{"name": "Priya Sharma", "location": "Mumbai", "rating": 5, "review": "Absolutely stunning flowers! Delivered fresh and on time. Made my anniversary perfect.", "image": ""}, {"name": "Rajesh Kumar", "location": "Delhi", "rating": 5, "review": "Best flower delivery service in India. Quality is amazing and customer service is excellent.", "image": ""}, {"name": "Anita Patel", "location": "Bangalore", "rating": 5, "review": "I have been ordering for years. Never disappointed! Fresh flowers every single time.", "image": ""}]}', '{}', 5),
('newsletter', 'Stay Blooming with Our Updates', 'Get exclusive offers, flower care tips, and new arrivals', '{"background": "gradient-rose", "placeholder": "Enter your email", "button_text": "Subscribe"}', '{}', 6);

-- Menu Items (Dynamic Navigation)
INSERT INTO menu_items (name, category_id, is_active, sort_order) VALUES
('Birthday Flowers', (SELECT id FROM product_categories WHERE slug = 'birthday-flowers'), TRUE, 1),
('Anniversary Flowers', (SELECT id FROM product_categories WHERE slug = 'anniversary-flowers'), TRUE, 2),
('Wedding Flowers', (SELECT id FROM product_categories WHERE slug = 'wedding-flowers'), TRUE, 3),
('Roses', (SELECT id FROM product_categories WHERE slug = 'roses'), TRUE, 4),
('Lilies', (SELECT id FROM product_categories WHERE slug = 'lilies'), TRUE, 5),
('Plants', (SELECT id FROM product_categories WHERE slug = 'plants'), TRUE, 6);

-- Dynamic Pages
INSERT INTO pages (title, slug, content, is_active, show_in_footer, footer_column, sort_order) VALUES
('About Us', 'about', '{"blocks": [{"type": "heading", "content": "About Florist in India"}, {"type": "text", "content": "We are India''s leading premium flower delivery service, dedicated to spreading joy and love through beautiful, fresh flowers."}, {"type": "text", "content": "Founded with a passion for flowers and customer satisfaction, we have been serving customers across 100+ cities in India with same-day delivery and 100% freshness guarantee."}]}', TRUE, TRUE, 1, 1),
('Contact Us', 'contact', '{"blocks": [{"type": "heading", "content": "Contact Us"}, {"type": "text", "content": "Get in touch with our customer care team for any queries or assistance."}, {"type": "contact_info", "content": {"phone": "+91 98765 43210", "email": "orders@floristinindia.com", "address": "Delhi NCR, Mumbai, Bangalore & 100+ Cities", "hours": "24/7 Customer Support"}}]}', TRUE, TRUE, 1, 2),
('Delivery Information', 'delivery-info', '{"blocks": [{"type": "heading", "content": "Delivery Information"}, {"type": "text", "content": "We offer same-day delivery in major cities. Order before 2 PM for same-day delivery."}]}', TRUE, TRUE, 2, 1),
('Return Policy', 'returns', '{"blocks": [{"type": "heading", "content": "Return & Refund Policy"}, {"type": "text", "content": "We offer 100% satisfaction guarantee. If you are not satisfied with your order, contact us within 24 hours."}]}', TRUE, TRUE, 2, 2),
('Privacy Policy', 'privacy', '{"blocks": [{"type": "heading", "content": "Privacy Policy"}, {"type": "text", "content": "Your privacy is important to us. We protect your personal information and never share it with third parties."}]}', TRUE, TRUE, 3, 1),
('Terms & Conditions', 'terms', '{"blocks": [{"type": "heading", "content": "Terms & Conditions"}, {"type": "text", "content": "By using our website, you agree to our terms and conditions."}]}', TRUE, TRUE, 3, 2);

-- Footer Sections
INSERT INTO footer_sections (title, content, column_position, sort_order) VALUES
('Quick Links', '{"type": "links", "links": [{"text": "About Us", "url": "/about"}, {"text": "Contact Us", "url": "/contact"}, {"text": "Delivery Info", "url": "/delivery-info"}, {"text": "Track Order", "url": "/track-order"}]}', 1, 1),
('Customer Service', '{"type": "links", "links": [{"text": "Help Center", "url": "/help"}, {"text": "Returns & Refunds", "url": "/returns"}, {"text": "Privacy Policy", "url": "/privacy"}, {"text": "Terms & Conditions", "url": "/terms"}]}', 2, 1),
('Popular Categories', '{"type": "category_links", "show_count": 6}', 3, 1),
('Contact Info', '{"type": "contact", "phone": "+91 98765 43210", "email": "orders@floristinindia.com", "address": "Delhi NCR, Mumbai, Bangalore & 100+ Cities"}', 4, 1);

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers to all tables
CREATE TRIGGER set_timestamp_site_settings BEFORE UPDATE ON site_settings FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();
CREATE TRIGGER set_timestamp_product_categories BEFORE UPDATE ON product_categories FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();
CREATE TRIGGER set_timestamp_products BEFORE UPDATE ON products FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();
CREATE TRIGGER set_timestamp_product_variants BEFORE UPDATE ON product_variants FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();
CREATE TRIGGER set_timestamp_customers BEFORE UPDATE ON customers FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();
CREATE TRIGGER set_timestamp_orders BEFORE UPDATE ON orders FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();
CREATE TRIGGER set_timestamp_coupons BEFORE UPDATE ON coupons FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();
CREATE TRIGGER set_timestamp_shipping_zones BEFORE UPDATE ON shipping_zones FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();
CREATE TRIGGER set_timestamp_shipping_methods BEFORE UPDATE ON shipping_methods FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();
CREATE TRIGGER set_timestamp_pages BEFORE UPDATE ON pages FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();
CREATE TRIGGER set_timestamp_homepage_sections BEFORE UPDATE ON homepage_sections FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();
CREATE TRIGGER set_timestamp_menu_items BEFORE UPDATE ON menu_items FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();
CREATE TRIGGER set_timestamp_footer_sections BEFORE UPDATE ON footer_sections FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();
CREATE TRIGGER set_timestamp_sub_users BEFORE UPDATE ON sub_users FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();

-- Insert a default admin user
INSERT INTO sub_users (email, first_name, last_name, role, permissions) VALUES
('admin@floristinindia.com', 'Super', 'Admin', 'admin', '{
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
}');
