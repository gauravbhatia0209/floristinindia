-- SEO Settings Update Script
-- Run this in your Supabase SQL editor to set default SEO values

-- Update or insert default SEO settings
INSERT INTO site_settings (key, value, description, group_name, is_public) VALUES
  ('site_name', 'Florist in India', 'Website name', 'general', true),
  ('site_tagline', 'Fresh Flowers Delivered with Love', 'Website tagline', 'general', true),
  ('site_description', 'Premium flower delivery service across India. Same-day delivery available in 100+ cities. Fresh flowers for all occasions with 100% freshness guarantee.', 'Website description', 'general', true),
  ('default_meta_title', 'Florist in India - Premium Fresh Flower Delivery', 'Default meta title for SEO', 'seo', false),
  ('default_meta_description', 'Order fresh flowers online for same-day delivery across India. Premium flower arrangements for all occasions with 100% freshness guarantee. Available in 100+ cities.', 'Default meta description for SEO', 'seo', false)
ON CONFLICT (key) DO UPDATE SET
  value = EXCLUDED.value,
  description = EXCLUDED.description,
  updated_at = NOW();

-- Also ensure the existing meta_title and meta_description are set
UPDATE site_settings SET 
  value = 'Florist in India - Premium Fresh Flower Delivery'
WHERE key = 'meta_title' AND (value = '' OR value IS NULL);

UPDATE site_settings SET 
  value = 'Order fresh flowers online for same-day delivery across India. Premium flower arrangements for all occasions with 100% freshness guarantee. Available in 100+ cities.'
WHERE key = 'meta_description' AND (value = '' OR value IS NULL);

-- Verify the settings
SELECT key, value, description 
FROM site_settings 
WHERE key IN ('site_name', 'site_tagline', 'site_description', 'default_meta_title', 'default_meta_description', 'meta_title', 'meta_description')
ORDER BY key;
