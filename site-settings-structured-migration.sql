-- Migration to add structured site settings fields
-- This script is idempotent and safe to run multiple times

-- Insert default structured meta tag settings
INSERT INTO site_settings (key, value, type, description) VALUES
('defaultMetaTitle', 'Florist in India - Fresh Flowers Delivered Daily', 'text', 'Default meta title for pages without custom titles'),
('defaultMetaDescription', 'Premium flower delivery service across India. Same-day delivery available in 100+ cities. Fresh flowers for all occasions with 100% freshness guarantee.', 'text', 'Default meta description for pages without custom descriptions'),
('defaultOgImage', '', 'text', 'Default Open Graph image for social media sharing')
ON CONFLICT (key) DO NOTHING;

-- Insert business information settings
INSERT INTO site_settings (key, value, type, description) VALUES
('businessName', 'Florist in India', 'text', 'Official business name for schema markup'),
('phone', '', 'text', 'Primary business phone number'),
('streetAddress', '', 'text', 'Street address for schema markup and contact info'),
('locality', '', 'text', 'City or locality for business address'),
('region', '', 'text', 'State or region for business address'),
('postalCode', '', 'text', 'Postal/ZIP code for business address'),
('countryCode', 'IN', 'text', 'Country code (e.g., IN, US, UK)'),
('openingHours', '', 'text', 'Business hours in Schema.org format (e.g., Mo-Fr 09:00-17:00)'),
('serviceArea', '', 'text', 'Geographic areas where services are available')
ON CONFLICT (key) DO NOTHING;

-- Migrate existing data from legacy fields to new structured fields if new fields are empty
UPDATE site_settings 
SET value = (SELECT value FROM site_settings WHERE key = 'default_meta_title' LIMIT 1)
WHERE key = 'defaultMetaTitle' 
AND (value = '' OR value IS NULL)
AND EXISTS (SELECT 1 FROM site_settings WHERE key = 'default_meta_title' AND value != '');

UPDATE site_settings 
SET value = (SELECT value FROM site_settings WHERE key = 'default_meta_description' LIMIT 1)
WHERE key = 'defaultMetaDescription' 
AND (value = '' OR value IS NULL)
AND EXISTS (SELECT 1 FROM site_settings WHERE key = 'default_meta_description' AND value != '');

UPDATE site_settings 
SET value = (SELECT value FROM site_settings WHERE key = 'og_image_url' LIMIT 1)
WHERE key = 'defaultOgImage' 
AND (value = '' OR value IS NULL)
AND EXISTS (SELECT 1 FROM site_settings WHERE key = 'og_image_url' AND value != '');

UPDATE site_settings 
SET value = (SELECT value FROM site_settings WHERE key = 'site_name' LIMIT 1)
WHERE key = 'businessName' 
AND (value = '' OR value IS NULL)
AND EXISTS (SELECT 1 FROM site_settings WHERE key = 'site_name' AND value != '');

UPDATE site_settings 
SET value = (SELECT value FROM site_settings WHERE key = 'contact_phone' LIMIT 1)
WHERE key = 'phone' 
AND (value = '' OR value IS NULL)
AND EXISTS (SELECT 1 FROM site_settings WHERE key = 'contact_phone' AND value != '');

-- Extract address components from contact_address if it exists and new fields are empty
UPDATE site_settings 
SET value = (SELECT value FROM site_settings WHERE key = 'contact_address' LIMIT 1)
WHERE key = 'streetAddress' 
AND (value = '' OR value IS NULL)
AND EXISTS (SELECT 1 FROM site_settings WHERE key = 'contact_address' AND value != '');

UPDATE site_settings 
SET value = (SELECT value FROM site_settings WHERE key = 'business_hours' LIMIT 1)
WHERE key = 'openingHours' 
AND (value = '' OR value IS NULL)
AND EXISTS (SELECT 1 FROM site_settings WHERE key = 'business_hours' AND value != '');

-- Add some helpful indexes for better performance
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_site_settings_key_type ON site_settings(key, type);

-- Add comments for documentation
COMMENT ON TABLE site_settings IS 'Singleton content model for site-wide settings including SEO, business info, and metadata';

-- Update existing comments and add new ones
UPDATE site_settings SET description = 'Default meta title for pages without custom titles (new structured field)' WHERE key = 'defaultMetaTitle';
UPDATE site_settings SET description = 'Default meta description for pages without custom descriptions (new structured field)' WHERE key = 'defaultMetaDescription';
UPDATE site_settings SET description = 'Default Open Graph image for social media sharing (new structured field)' WHERE key = 'defaultOgImage';

-- Show migration results
SELECT 
    'Migration completed successfully. New structured site settings added:' as status,
    COUNT(*) as total_settings
FROM site_settings;

SELECT 
    key,
    CASE 
        WHEN value = '' OR value IS NULL THEN 'Empty (needs configuration)'
        ELSE 'Configured'
    END as status,
    description
FROM site_settings 
WHERE key IN (
    'defaultMetaTitle', 'defaultMetaDescription', 'defaultOgImage',
    'businessName', 'phone', 'streetAddress', 'locality', 'region', 
    'postalCode', 'countryCode', 'openingHours', 'serviceArea'
)
ORDER BY key;
