-- Add GST rate setting to site_settings table
-- This will insert the GST rate setting with a default value of 0%
-- The admin can then configure the correct GST rate from the admin panel

INSERT INTO site_settings (key, value, type, description) 
VALUES ('gst_rate', '0', 'number', 'GST rate percentage') 
ON CONFLICT (key) DO NOTHING;
