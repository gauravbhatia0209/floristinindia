import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Database, AlertTriangle } from "lucide-react";

export default function DatabaseSetup() {
  const [copied, setCopied] = useState<string | null>(null);

  const contactSubmissionsSQL = `-- Create contact_submissions table
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS (Row Level Security) policy
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read and insert
CREATE POLICY "Allow authenticated read access" ON contact_submissions
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow public insert access" ON contact_submissions
  FOR INSERT WITH CHECK (true);

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_contact_submissions_submitted_at
  ON contact_submissions(submitted_at DESC);

CREATE INDEX IF NOT EXISTS idx_contact_submissions_is_read
  ON contact_submissions(is_read);`;

  const pagesTableSQL = `
-- Create pages table
CREATE TABLE IF NOT EXISTS pages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT,
  meta_title TEXT,
  meta_description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  show_in_footer BOOLEAN DEFAULT FALSE,
  footer_column INTEGER,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policy
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;

-- Allow public read access for active pages
CREATE POLICY "Allow public read access for active pages" ON pages
  FOR SELECT USING (is_active = true);

-- Allow authenticated users full access
CREATE POLICY "Allow authenticated full access" ON pages
  FOR ALL USING (auth.role() = 'authenticated');

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_pages_slug ON pages(slug);
CREATE INDEX IF NOT EXISTS idx_pages_active ON pages(is_active);
CREATE INDEX IF NOT EXISTS idx_pages_footer ON pages(show_in_footer);
`.trim();

  const siteSettingsSQL = `
-- Create site_settings table
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  type TEXT DEFAULT 'text' CHECK (type IN ('text', 'json', 'boolean', 'number', 'image')),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policy
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access" ON site_settings
  FOR SELECT USING (true);

-- Allow authenticated users full access
CREATE POLICY "Allow authenticated full access" ON site_settings
  FOR ALL USING (auth.role() = 'authenticated');

-- Create index
CREATE INDEX IF NOT EXISTS idx_site_settings_key ON site_settings(key);

-- Insert default site settings
INSERT INTO site_settings (key, value, type, description) VALUES
  ('business_name', 'Florist in India', 'text', 'Business name'),
  ('contact_phone', '', 'text', 'Primary contact phone'),
  ('contact_phone_2', '', 'text', 'Secondary contact phone'),
  ('contact_email', '', 'text', 'Contact email address'),
  ('contact_address', '', 'text', 'Business address'),
  ('business_hours', 'Monday - Sunday: 9:00 AM - 9:00 PM', 'text', 'Business operating hours'),
  ('google_maps_embed', '', 'text', 'Google Maps embed code')
ON CONFLICT (key) DO NOTHING;
`.trim();

  function copyToClipboard(text: string, type: string) {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Database Setup</h1>
        <p className="text-muted-foreground">
          Run these SQL commands in your Supabase SQL Editor to create required
          tables
        </p>
      </div>

      <div className="grid gap-6">
        {/* Contact Submissions Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Contact Submissions Table
              <Badge variant="outline">Required for Contact Form</Badge>
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              This table stores contact form submissions from the website
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-orange-500" />
                <span className="text-sm">
                  Run this SQL in Supabase → SQL Editor → New Query
                </span>
              </div>
              <div className="relative">
                <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                  <code>{contactSubmissionsSQL}</code>
                </pre>
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() =>
                    copyToClipboard(contactSubmissionsSQL, "contact")
                  }
                >
                  <Copy className="h-4 w-4 mr-1" />
                  {copied === "contact" ? "Copied!" : "Copy"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pages Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Pages Table
              <Badge variant="outline">Required for CMS Pages</Badge>
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              This table stores dynamic pages (About Us, Privacy Policy, etc.)
            </p>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                <code>{pagesTableSQL}</code>
              </pre>
              <Button
                variant="outline"
                size="sm"
                className="absolute top-2 right-2"
                onClick={() => copyToClipboard(pagesTableSQL, "pages")}
              >
                <Copy className="h-4 w-4 mr-1" />
                {copied === "pages" ? "Copied!" : "Copy"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Site Settings Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Site Settings Table
              <Badge variant="outline">Required for Global Settings</Badge>
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              This table stores global site configuration and contact
              information
            </p>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                <code>{siteSettingsSQL}</code>
              </pre>
              <Button
                variant="outline"
                size="sm"
                className="absolute top-2 right-2"
                onClick={() => copyToClipboard(siteSettingsSQL, "settings")}
              >
                <Copy className="h-4 w-4 mr-1" />
                {copied === "settings" ? "Copied!" : "Copy"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-green-200 bg-green-50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Database className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-green-800">
                Setup Instructions:
              </h3>
              <ol className="mt-2 text-sm text-green-700 space-y-1">
                <li>1. Go to your Supabase Dashboard</li>
                <li>2. Navigate to SQL Editor</li>
                <li>3. Click "New Query"</li>
                <li>4. Copy and paste each SQL block above</li>
                <li>5. Run each query individually</li>
                <li>6. Test the Contact Form on your website</li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
