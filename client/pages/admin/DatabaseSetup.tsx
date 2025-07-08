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

  const pagesTableSQL = `-- Create pages table
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

-- Insert default About page
INSERT INTO pages (title, slug, content, meta_title, meta_description, is_active, show_in_footer, sort_order) VALUES

-- About Us Page
(
  'About Florist in India',
  'about',
  '{"blocks": [
    {"type": "heading", "content": "About Florist in India"},
    {"type": "text", "content": "Your trusted destination for premium flowers, cakes, and gifts delivered across India with love and care."},
    {"type": "heading", "content": "Who We Are"},
    {"type": "text", "content": "Florist in India is your premier destination for fresh flower delivery services across India. With over 5 years of experience in the floral industry, we have built a reputation for excellence, reliability, and customer satisfaction."},
    {"type": "heading", "content": "Our Mission"},
    {"type": "text", "content": "We aim to connect hearts and emotions through the universal language of flowers. Whether celebrating love, expressing sympathy, or brightening someone''s day, we believe every moment deserves beautiful blooms."},
    {"type": "heading", "content": "Why Choose Us"},
    {"type": "text", "content": "🌸 Fresh flowers sourced daily\\n🚚 Same-day delivery in 100+ cities\\n💬 24/7 customer support\\n💝 Custom arrangements\\n💳 Secure payments\\n⭐ 4.8+ star rating from 20,000+ customers"},
    {"type": "heading", "content": "Our Coverage"},
    {"type": "text", "content": "We serve customers across India including Delhi NCR, Mumbai, Bangalore, Pune, Hyderabad, Chennai, Kolkata, Ahmedabad, Jalandhar, Chandigarh, and 100+ more locations."}
  ]}',
  'About Florist in India – Premium Flower Delivery Across India',
  'Learn about Florist in India, your trusted partner for fresh flower delivery across 100+ Indian cities.',
  TRUE,
  TRUE,
  1
),

-- Help Center Page
(
  'Help Center',
  'help-center',
  '{"blocks": [
    {"type": "heading", "content": "Help Center"},
    {"type": "text", "content": "Find answers to frequently asked questions and get support for all your flower delivery needs."},
    {"type": "heading", "content": "Ordering & Payment"},
    {"type": "text", "content": "How do I place an order?\\nBrowse our collection, select flowers, add to cart, and checkout with your delivery details.\\n\\nWhat payment methods do you accept?\\nWe accept all major cards, UPI, net banking, and digital wallets.\\n\\nIs payment secure?\\nYes, all payments use SSL encryption and secure gateways."},
    {"type": "heading", "content": "Delivery Information"},
    {"type": "text", "content": "Do you offer same-day delivery?\\nYes, orders before 12 PM can be delivered same day.\\n\\nDelivery timings?\\n9:00 AM to 9:00 PM daily.\\n\\nDelivery areas?\\nWe deliver to 100+ cities across India."},
    {"type": "heading", "content": "Product & Quality"},
    {"type": "text", "content": "How do you ensure freshness?\\nFlowers are sourced daily and stored in temperature-controlled environments.\\n\\nCan I customize arrangements?\\nYes, contact support for custom arrangements."},
    {"type": "heading", "content": "Contact Support"},
    {"type": "text", "content": "Need help? Contact us at +91 98765 43210 or orders@floristinindia.com"}
  ]}',
  'Help Center - Customer Support & FAQ',
  'Get help with flower delivery orders. FAQs about ordering, payment, delivery and more.',
  TRUE,
  TRUE,
  2
),

-- Return & Refunds Page
(
  'Return & Refunds',
  'return-refunds',
  '{"blocks": [
    {"type": "heading", "content": "Return & Refunds Policy"},
    {"type": "text", "content": "Customer satisfaction is our priority. We stand behind our products and services."},
    {"type": "heading", "content": "Refund Eligibility"},
    {"type": "text", "content": "• Flowers significantly different from order\\n• Delivery not completed on time\\n• Poor condition due to handling\\n• Wrong product delivered\\n• Order cancelled before preparation"},
    {"type": "heading", "content": "Refund Process"},
    {"type": "text", "content": "1. Contact support within 24 hours with order details\\n2. Our team reviews your request\\n3. Approved refunds processed in 5-7 business days"},
    {"type": "heading", "content": "Replacement Policy"},
    {"type": "text", "content": "Free replacements offered for quality issues. Request within 6 hours of delivery."},
    {"type": "heading", "content": "How to Request"},
    {"type": "text", "content": "Contact +91 98765 43210 or refunds@floristinindia.com with your order number."}
  ]}',
  'Return & Refunds Policy',
  'Fair refund and replacement policies for flower delivery orders.',
  TRUE,
  TRUE,
  3
),

-- Privacy Policy Page
(
  'Privacy Policy',
  'privacy-policy',
  '{"blocks": [
    {"type": "heading", "content": "Privacy Policy"},
    {"type": "text", "content": "We are committed to protecting your privacy and personal information."},
    {"type": "heading", "content": "Information We Collect"},
    {"type": "text", "content": "• Personal details: Name, email, phone, address\\n• Payment info: Securely processed card details\\n• Order details: Delivery preferences\\n• Usage data: Website interactions"},
    {"type": "heading", "content": "How We Use Information"},
    {"type": "text", "content": "• Process and deliver orders\\n• Provide customer support\\n• Improve our services\\n• Send promotional offers (with consent)\\n• Legal compliance"},
    {"type": "heading", "content": "Information Sharing"},
    {"type": "text", "content": "We do not sell your data. Limited sharing only with:\\n• Delivery partners for order fulfillment\\n• Payment processors for security\\n• When required by law"},
    {"type": "heading", "content": "Data Security"},
    {"type": "text", "content": "We use encryption and secure systems to protect your information."},
    {"type": "heading", "content": "Your Rights"},
    {"type": "text", "content": "• Access your data\\n• Correct information\\n• Delete account\\n• Opt out of marketing"},
    {"type": "heading", "content": "Contact"},
    {"type": "text", "content": "Privacy questions: privacy@floristinindia.com"}
  ]}',
  'Privacy Policy - Data Protection',
  'How we collect, use, and protect your personal information.',
  TRUE,
  TRUE,
  4
),

-- Terms & Conditions Page
(
  'Terms & Conditions',
  'terms-conditions',
  '{"blocks": [
    {"type": "heading", "content": "Terms & Conditions"},
    {"type": "text", "content": "These terms govern your use of our services. By ordering, you agree to these terms."},
    {"type": "heading", "content": "Our Services"},
    {"type": "text", "content": "• Fresh flower delivery across India\\n• Same-day and scheduled delivery\\n• Custom arrangements\\n• Gift combinations"},
    {"type": "heading", "content": "Orders & Payment"},
    {"type": "text", "content": "Orders confirmed upon payment. Prices include taxes but exclude delivery charges unless specified."},
    {"type": "heading", "content": "Delivery Terms"},
    {"type": "text", "content": "• Delivery times are estimates\\n• Same-day delivery needs orders before 12 PM\\n• Address must be accurate\\n• Additional charges for remote areas"},
    {"type": "heading", "content": "Product Disclaimer"},
    {"type": "text", "content": "Flowers are natural products and may vary from photos. We may substitute with equal or greater value."},
    {"type": "heading", "content": "Liability"},
    {"type": "text", "content": "Our liability is limited to order value. Not responsible for indirect damages."},
    {"type": "heading", "content": "User Conduct"},
    {"type": "text", "content": "Do not provide false info, use for illegal purposes, or abuse support."},
    {"type": "heading", "content": "Contact"},
    {"type": "text", "content": "Questions: legal@floristinindia.com or +91 98765 43210"}
  ]}',
  'Terms & Conditions',
  'Service terms and conditions for flower delivery.',
  TRUE,
  TRUE,
  5
)
ON CONFLICT (slug) DO UPDATE SET
  meta_title = EXCLUDED.meta_title,
  meta_description = EXCLUDED.meta_description,
  updated_at = NOW();`;

  const siteSettingsSQL = `-- Create site_settings table
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
ON CONFLICT (key) DO NOTHING;`;

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
                <li>6. Go to Admin → Pages to edit About page content</li>
                <li>7. Test the Contact Form and About page</li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-800">About Page Content:</h3>
              <p className="mt-2 text-sm text-blue-700">
                After running the Pages table SQL, a professional About page
                will be automatically created. You can edit the content, add
                images, and customize sections through the
                <strong> Admin → Pages </strong> section using the content block
                editor.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
