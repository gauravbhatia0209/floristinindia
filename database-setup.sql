-- Florist in India Database Schema
-- This script sets up the complete database structure for the e-commerce platform

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Site Settings Table
CREATE TABLE site_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(255) UNIQUE NOT NULL,
    value TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Product Categories Table
CREATE TABLE product_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    image_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products Table
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
    category_id UUID REFERENCES product_categories(id),
    images TEXT[] DEFAULT '{}',
    tags TEXT[] DEFAULT '{}',
    requires_file_upload BOOLEAN DEFAULT FALSE,
    delivery_zones TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Homepage Sections Table
CREATE TABLE homepage_sections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type VARCHAR(50) NOT NULL CHECK (type IN ('hero', 'category_grid', 'product_carousel', 'text_block', 'image_block', 'testimonials')),
    title VARCHAR(255),
    content JSONB NOT NULL DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Customers Table
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE,
    anniversary_date DATE,
    address JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders Table
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES customers(id),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
    total_amount DECIMAL(10, 2) NOT NULL,
    shipping_amount DECIMAL(10, 2) DEFAULT 0,
    discount_amount DECIMAL(10, 2) DEFAULT 0,
    items JSONB NOT NULL DEFAULT '[]',
    shipping_address JSONB NOT NULL,
    billing_address JSONB NOT NULL,
    delivery_date DATE,
    delivery_slot VARCHAR(50),
    notes TEXT,
    payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
    payment_method VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert Sample Data

-- Site Settings
INSERT INTO site_settings (key, value) VALUES
('site_name', 'Florist in India'),
('site_description', 'Premium Flower Delivery Service'),
('contact_phone', '+91 98765 43210'),
('contact_email', 'orders@floristinindia.com'),
('address', 'Delhi NCR, Mumbai, Bangalore & 100+ Cities'),
('currency', 'INR'),
('logo_url', ''),
('social_facebook', 'https://facebook.com/floristinindia'),
('social_instagram', 'https://instagram.com/floristinindia'),
('social_twitter', 'https://twitter.com/floristinindia');

-- Product Categories
INSERT INTO product_categories (name, slug, description, is_active, sort_order) VALUES
('Birthday Flowers', 'birthday-flowers', 'Beautiful flowers perfect for birthday celebrations', TRUE, 1),
('Anniversary Flowers', 'anniversary-flowers', 'Romantic flower arrangements for anniversaries', TRUE, 2),
('Wedding Flowers', 'wedding-flowers', 'Elegant wedding bouquets and decorations', TRUE, 3),
('Sympathy Flowers', 'sympathy-flowers', 'Thoughtful arrangements for sympathy and condolences', TRUE, 4),
('Roses', 'roses', 'Classic roses in various colors and arrangements', TRUE, 5),
('Lilies', 'lilies', 'Elegant lily arrangements for all occasions', TRUE, 6),
('Orchids', 'orchids', 'Exotic orchid plants and arrangements', TRUE, 7),
('Mixed Bouquets', 'mixed-bouquets', 'Beautiful mixed flower bouquets', TRUE, 8);

-- Sample Products
INSERT INTO products (name, slug, description, short_description, price, sale_price, category_id, is_active, stock_quantity, tags) VALUES
('Red Rose Bouquet', 'red-rose-bouquet', 'A classic bouquet of 12 fresh red roses wrapped in elegant paper with ribbon.', 'Classic red rose bouquet - perfect for expressing love', 899.00, 699.00, (SELECT id FROM product_categories WHERE slug = 'roses'), TRUE, 50, ARRAY['roses', 'romantic', 'red']),
('Pink Lily Arrangement', 'pink-lily-arrangement', 'Stunning pink lilies arranged in a beautiful vase with greenery.', 'Elegant pink lily arrangement in decorative vase', 1299.00, NULL, (SELECT id FROM product_categories WHERE slug = 'lilies'), TRUE, 30, ARRAY['lilies', 'pink', 'vase']),
('Mixed Flower Bouquet', 'mixed-flower-bouquet', 'A vibrant mix of seasonal flowers including roses, carnations, and chrysanthemums.', 'Colorful mixed flower bouquet for any occasion', 1099.00, 899.00, (SELECT id FROM product_categories WHERE slug = 'mixed-bouquets'), TRUE, 40, ARRAY['mixed', 'colorful', 'seasonal']),
('White Orchid Plant', 'white-orchid-plant', 'Beautiful white orchid plant in ceramic pot - perfect for home decoration.', 'Elegant white orchid plant in ceramic pot', 1599.00, NULL, (SELECT id FROM product_categories WHERE slug = 'orchids'), TRUE, 20, ARRAY['orchids', 'white', 'plant']),
('Birthday Special Bouquet', 'birthday-special-bouquet', 'Cheerful birthday bouquet with bright flowers and a birthday card.', 'Special birthday bouquet with greeting card', 1199.00, 999.00, (SELECT id FROM product_categories WHERE slug = 'birthday-flowers'), TRUE, 35, ARRAY['birthday', 'bright', 'card']),
('Anniversary Rose Box', 'anniversary-rose-box', 'Premium roses arranged in an elegant box - perfect for anniversaries.', 'Luxury rose box arrangement for anniversaries', 1899.00, 1599.00, (SELECT id FROM product_categories WHERE slug = 'anniversary-flowers'), TRUE, 25, ARRAY['anniversary', 'luxury', 'box']);

-- Create indexes for better performance
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_active ON products(is_active);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_categories_active ON product_categories(is_active);
CREATE INDEX idx_categories_slug ON product_categories(slug);
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(status);

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_timestamp_site_settings
    BEFORE UPDATE ON site_settings
    FOR EACH ROW
    EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp_product_categories
    BEFORE UPDATE ON product_categories
    FOR EACH ROW
    EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp_products
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp_customers
    BEFORE UPDATE ON customers
    FOR EACH ROW
    EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp_orders
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE PROCEDURE trigger_set_timestamp();
