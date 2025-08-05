-- Add additional_sitemap_urls setting to site_settings table
-- This migration is idempotent and safe to run multiple times

-- Add additional_sitemap_urls setting if it doesn't exist
INSERT INTO site_settings (key, value, description)
VALUES ('additional_sitemap_urls', '', 'Additional URLs to include in sitemap.xml (one per line)')
ON CONFLICT (key) DO NOTHING;

-- Ensure sitemap_enabled setting exists
INSERT INTO site_settings (key, value, description)
VALUES ('sitemap_enabled', 'true', 'Enable or disable XML sitemap generation')
ON CONFLICT (key) DO NOTHING;

-- Ensure robots_txt_content setting exists
INSERT INTO site_settings (key, value, description)
VALUES ('robots_txt_content', '', 'Custom robots.txt content (leave empty for auto-generated)')
ON CONFLICT (key) DO NOTHING;
