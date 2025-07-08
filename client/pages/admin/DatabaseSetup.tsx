import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Database, AlertTriangle, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function DatabaseSetup() {
  const [copied, setCopied] = useState<string | null>(null);
  const [isClearing, setIsClearing] = useState(false);
  const [clearSuccess, setClearSuccess] = useState(false);
  const [isCreatingFooter, setIsCreatingFooter] = useState(false);

  const rlsFixSQL = `-- Fix RLS policies for pages table (run this if you get RLS errors)
-- This allows public read access and authenticated user full access

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public read access for active pages" ON pages;
DROP POLICY IF EXISTS "Allow authenticated full access" ON pages;

-- Create new policies
CREATE POLICY "Allow public read access for active pages" ON pages
  FOR SELECT USING (is_active = true);

CREATE POLICY "Allow authenticated full access" ON pages
  FOR ALL USING (auth.role() = 'authenticated');

-- Alternative: Temporarily disable RLS for setup (re-enable after)
-- ALTER TABLE pages DISABLE ROW LEVEL SECURITY;`;

  const clearOldPages = async () => {
    try {
      setIsClearing(true);
      setClearSuccess(false);

      // Delete specific page records
      const { error } = await supabase
        .from("pages")
        .delete()
        .in("slug", [
          "about",
          "help-center",
          "returns",
          "return-refunds",
          "privacy",
          "privacy-policy",
          "terms",
          "terms-conditions",
          "delivery-info",
        ]);

      if (error) {
        console.error("Error clearing pages:", error);
        alert("Error clearing pages: " + error.message);
      } else {
        setClearSuccess(true);
        alert("Page records cleared! Now creating new structured content...");
        // Automatically rebuild pages after clearing
        await rebuildAllPages();
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error clearing pages");
    } finally {
      setIsClearing(false);
    }
  };

  const rebuildAllPages = async () => {
    try {
      // First, try to fix RLS policies if needed
      try {
        await supabase.rpc("create_pages_policy", {});
      } catch (rpcError) {
        // RPC might not exist, continue with normal insert
        console.log("RPC call failed, continuing with direct insert");
      }

      const pages = [
        {
          title: "About Florist in India",
          slug: "about",
          content: {
            blocks: [
              {
                type: "hero_title",
                content: "About Florist in India",
              },
              {
                type: "hero_description",
                content:
                  "Your trusted destination for premium flowers, cakes, and gifts delivered across India with love and care.",
              },
              {
                type: "story_section",
                title: "Our Story",
                content:
                  "Founded with a passion for bringing people closer through beautiful flowers, Florist in India has been serving customers across the nation with fresh, premium quality flowers and thoughtful gifts. We believe every occasion deserves to be celebrated with the perfect floral arrangement.",
              },
              {
                type: "mission_section",
                title: "Our Mission",
                content:
                  "To make every celebration special by delivering fresh, beautiful flowers and gifts that express your emotions perfectly. We strive to connect hearts and spread joy through our carefully curated floral arrangements.",
              },
              {
                type: "values_section",
                title: "Our Values",
                content:
                  "Quality, freshness, and customer satisfaction are at the heart of everything we do. We source our flowers from the finest gardens and ensure they reach you in perfect condition.",
              },
            ],
          },
          meta_title: "About Florist in India – Premium Flower Delivery",
          meta_description:
            "Learn about Florist in India, your trusted partner for fresh flower delivery across 100+ Indian cities.",
          is_active: true,
          show_in_footer: true,
          sort_order: 1,
        },
        {
          title: "Help Center",
          slug: "help-center",
          content: {
            blocks: [
              {
                type: "hero_title",
                content: "Help Center",
              },
              {
                type: "hero_description",
                content:
                  "Find answers to your questions and get the support you need",
              },
              {
                type: "faq_category",
                category: "Ordering & Payment",
                items: [
                  {
                    question: "How do I place an order?",
                    answer:
                      "Simply browse our collection, select your preferred flowers, add to cart, and proceed to checkout. Enter delivery details and make payment to confirm your order.",
                  },
                  {
                    question: "What payment methods do you accept?",
                    answer:
                      "We accept all major credit/debit cards, UPI, net banking, and digital wallets including Google Pay, PhonePe, and Paytm.",
                  },
                  {
                    question: "Is my payment information secure?",
                    answer:
                      "Yes, all payments are processed through secure payment gateways with SSL encryption to protect your financial information.",
                  },
                ],
              },
              {
                type: "faq_category",
                category: "Delivery Information",
                items: [
                  {
                    question: "Do you offer same-day delivery?",
                    answer:
                      "Yes, we offer same-day delivery for orders placed before 12 PM, subject to availability in your area.",
                  },
                  {
                    question: "Which areas do you deliver to?",
                    answer:
                      "We deliver to 100+ cities across India. Enter your pincode during checkout to check delivery availability.",
                  },
                  {
                    question: "What are your delivery timings?",
                    answer:
                      "We deliver between 9:00 AM to 9:00 PM on all days. For specific time slots, please contact our customer support.",
                  },
                ],
              },
              {
                type: "faq_category",
                category: "Products & Quality",
                items: [
                  {
                    question: "How do you ensure flower freshness?",
                    answer:
                      "Our flowers are sourced daily from trusted gardens and stored in temperature-controlled environments. We guarantee freshness for at least 3-5 days.",
                  },
                  {
                    question: "Can I customize my flower arrangement?",
                    answer:
                      "Yes, we offer custom arrangements. Contact our support team with your requirements, and we'll create something special for you.",
                  },
                ],
              },
            ],
          },
          meta_title: "Help Center - Customer Support & FAQ",
          meta_description:
            "Get help with flower delivery orders. FAQs about ordering, payment, delivery and more.",
          is_active: true,
          show_in_footer: true,
          sort_order: 2,
        },
        {
          title: "Return & Refunds Policy",
          slug: "return-refunds",
          content: {
            blocks: [
              {
                type: "hero_title",
                content: "Return & Refunds Policy",
              },
              {
                type: "hero_description",
                content:
                  "Your satisfaction is our priority. Learn about our fair and transparent refund policies.",
              },
              {
                type: "policy_section",
                section_id: "eligibility",
                title: "Refund Eligibility",
                intro: "We offer refunds under the following circumstances:",
                points: [
                  "Flowers delivered are significantly different from the order",
                  "Flowers are damaged or wilted upon delivery",
                  "Order was not delivered on the specified date",
                  "Wrong arrangement or incorrect delivery address (our error)",
                  "Quality issues reported within 6 hours of delivery",
                ],
              },
              {
                type: "policy_section",
                section_id: "process",
                title: "Refund Process",
                intro: "Steps to request a refund:",
                points: [
                  "Contact us within 24 hours of delivery",
                  "Provide order details and photos of the issue",
                  "Our team will review your request within 24 hours",
                  "Approved refunds are processed within 5-7 business days",
                  "Refund amount will be credited to original payment method",
                ],
              },
              {
                type: "policy_section",
                section_id: "replacement",
                title: "Replacement Policy",
                intro: "For quality issues, we offer free replacements:",
                points: [
                  "Report issues within 6 hours of delivery",
                  "Replacement flowers delivered within 24 hours",
                  "No additional charges for replacement orders",
                  "Replacement guaranteed to meet quality standards",
                ],
              },
            ],
          },
          meta_title: "Return & Refunds Policy",
          meta_description:
            "Fair refund and replacement policies for flower delivery orders.",
          is_active: true,
          show_in_footer: true,
          sort_order: 3,
        },
        {
          title: "Privacy Policy",
          slug: "privacy-policy",
          content: {
            blocks: [
              {
                type: "hero_title",
                content: "Privacy Policy",
              },
              {
                type: "hero_description",
                content:
                  "Your privacy matters to us. Learn how we collect, use, and protect your personal information.",
              },
              {
                type: "privacy_section",
                section_id: "collection",
                title: "Information We Collect",
                intro:
                  "We collect information you provide directly to us when using our services:",
                points: [
                  "Personal details: Name, email, phone number, address",
                  "Payment information: Card details, billing address (securely processed)",
                  "Order information: Delivery details, preferences, special instructions",
                  "Communication records: Support conversations, feedback",
                  "Usage data: Website interactions, device information, IP address",
                ],
              },
              {
                type: "privacy_section",
                section_id: "usage",
                title: "How We Use Your Information",
                intro: "Your information is used to:",
                points: [
                  "Process and deliver your orders",
                  "Communicate about your orders and account",
                  "Provide customer support and assistance",
                  "Improve our products and services",
                  "Send promotional offers (with your consent)",
                  "Comply with legal obligations",
                ],
              },
              {
                type: "privacy_section",
                section_id: "security",
                title: "Data Security",
                intro:
                  "We implement appropriate security measures to protect your personal information:",
                points: [
                  "SSL encryption for all data transmission",
                  "Secure payment gateways for financial information",
                  "Regular security audits and updates",
                  "Limited access to personal data on a need-to-know basis",
                  "Industry-standard security protocols",
                ],
              },
              {
                type: "privacy_section",
                section_id: "rights",
                title: "Your Rights",
                intro:
                  "You have the following rights regarding your personal data:",
                points: [
                  "Access your personal information",
                  "Correct inaccurate information",
                  "Delete your account and data",
                  "Opt out of marketing communications",
                  "Request data portability",
                  "Withdraw consent at any time",
                ],
              },
            ],
          },
          meta_title: "Privacy Policy - Data Protection",
          meta_description:
            "How we collect, use, and protect your personal information.",
          is_active: true,
          show_in_footer: true,
          sort_order: 4,
        },
        {
          title: "Terms & Conditions",
          slug: "terms-conditions",
          content: {
            blocks: [
              {
                type: "hero_title",
                content: "Terms & Conditions",
              },
              {
                type: "hero_description",
                content:
                  "These terms govern your use of our services. Please read them carefully.",
              },
              {
                type: "section",
                section_id: "acceptance",
                title: "Acceptance of Terms",
                intro:
                  "By accessing our website and placing orders, you accept and agree to be bound by these Terms & Conditions.",
                points: [
                  "These terms apply to all users and customers",
                  "By placing an order, you confirm acceptance of these terms",
                  "If you disagree with any terms, please discontinue use",
                  "We may update terms periodically with notice",
                ],
              },
              {
                type: "section",
                section_id: "services",
                title: "Our Services",
                intro:
                  "Florist in India provides fresh flower delivery services across India. Our services include:",
                points: [
                  "Fresh flower bouquets and arrangements",
                  "Same-day and scheduled delivery",
                  "Custom floral arrangements",
                  "Gift combinations with flowers",
                  "Flowers for occasions and events",
                  "Customer support and assistance",
                ],
              },
              {
                type: "section",
                section_id: "ordering",
                title: "Ordering & Payment",
                intro:
                  "Order placement and payment terms that govern your transactions:",
                points: [
                  "Orders are confirmed upon payment completion",
                  "Prices include applicable taxes unless specified",
                  "Delivery charges are additional unless noted",
                  "We reserve the right to modify prices without prior notice",
                  "Payment must be made at the time of ordering",
                  "All transactions are subject to verification",
                ],
              },
              {
                type: "section",
                section_id: "delivery",
                title: "Delivery Terms",
                intro: "Important delivery terms and conditions:",
                points: [
                  "Delivery times are estimates and may vary due to external factors",
                  "Same-day delivery requires orders placed before 12 PM",
                  "Delivery address must be accurate and accessible",
                  "Additional charges may apply for remote areas",
                  "We are not responsible for delays due to recipient unavailability",
                  "Weather conditions may affect delivery schedules",
                ],
              },
              {
                type: "section",
                section_id: "liability",
                title: "Limitation of Liability",
                intro: "Our liability limitations and disclaimers:",
                points: [
                  "Our liability is limited to the value of the order",
                  "We are not responsible for indirect or consequential damages",
                  "Natural product variations are not grounds for liability",
                  "Force majeure events are beyond our control",
                  "Customer satisfaction is our priority within reasonable limits",
                ],
              },
            ],
          },
          meta_title: "Terms & Conditions",
          meta_description: "Service terms and conditions for flower delivery.",
          is_active: true,
          show_in_footer: true,
          sort_order: 5,
        },
        {
          title: "Delivery Information",
          slug: "delivery-info",
          content: {
            blocks: [
              {
                type: "hero_title",
                content: "Delivery Information",
              },
              {
                type: "hero_description",
                content:
                  "Everything you need to know about our delivery services across India",
              },
              {
                type: "delivery_section",
                section_id: "coverage",
                title: "Delivery Coverage",
                intro: "We deliver fresh flowers across India:",
                points: [
                  "100+ cities covered nationwide",
                  "Metro cities: Same-day delivery available",
                  "Tier-2 cities: Next-day delivery guaranteed",
                  "Remote areas: 2-3 days delivery time",
                  "Check pincode availability at checkout",
                ],
              },
              {
                type: "delivery_section",
                section_id: "timings",
                title: "Delivery Timings",
                intro: "Our standard delivery schedule:",
                points: [
                  "Standard delivery: 9:00 AM to 9:00 PM",
                  "Morning slot: 9:00 AM to 1:00 PM",
                  "Afternoon slot: 1:00 PM to 5:00 PM",
                  "Evening slot: 5:00 PM to 9:00 PM",
                  "Midnight delivery available in select cities",
                ],
              },
              {
                type: "delivery_section",
                section_id: "charges",
                title: "Delivery Charges",
                intro: "Transparent pricing for delivery:",
                points: [
                  "Free delivery on orders above ₹999",
                  "Standard delivery: ₹99 within city limits",
                  "Express delivery: ₹199 (same-day)",
                  "Remote area delivery: ₹149 additional",
                  "Midnight delivery: ₹299 surcharge",
                ],
              },
              {
                type: "delivery_section",
                section_id: "tracking",
                title: "Order Tracking",
                intro: "Stay updated on your delivery:",
                points: [
                  "SMS notifications at each delivery stage",
                  "Real-time tracking link via email",
                  "Delivery partner contact details shared",
                  "Photo confirmation upon delivery",
                  "24/7 customer support for queries",
                ],
              },
            ],
          },
          meta_title: "Delivery Information - Coverage & Timings",
          meta_description:
            "Complete delivery information including coverage areas, timings, charges and tracking.",
          is_active: true,
          show_in_footer: true,
          sort_order: 6,
        },
      ];

      // Insert pages one by one with upsert to handle conflicts and RLS
      let successCount = 0;
      let errorCount = 0;
      const errors = [];

      for (const page of pages) {
        try {
          const { error } = await supabase.from("pages").upsert(page, {
            onConflict: "slug",
            ignoreDuplicates: false,
          });

          if (error) {
            console.error(`Error creating page ${page.slug}:`, error);
            errors.push(`${page.slug}: ${error.message}`);
            errorCount++;
          } else {
            successCount++;
          }
        } catch (err) {
          console.error(`Exception creating page ${page.slug}:`, err);
          errors.push(`${page.slug}: ${err.message}`);
          errorCount++;
        }
      }

      if (errorCount === 0) {
        alert(
          `All ${successCount} pages rebuilt successfully with professional layouts!`,
        );
      } else if (successCount > 0) {
        alert(
          `${successCount} pages created successfully, ${errorCount} failed. Check console for details.`,
        );
        console.error("Page creation errors:", errors);
      } else {
        alert(
          `Failed to create pages. This might be an RLS issue. Try running the RLS fix SQL above first, then try again.`,
        );
        console.error("All page creation failed:", errors);
      }
    } catch (error) {
      console.error("Error rebuilding pages:", error);
      alert("Error rebuilding pages");
    }
  };

  const createSampleFooterSections = async () => {
    try {
      setIsCreatingFooter(true);
      // Sample footer sections
      const footerSections = [
        {
          title: "Quick Links",
          content: {
            type: "links",
            links: [
              { text: "About Us", url: "/about" },
              { text: "Help Center", url: "/help" },
              { text: "Delivery Info", url: "/delivery-info" },
              { text: "Track Order", url: "/track-order" },
              { text: "Gift Cards", url: "/gift-cards" },
            ],
          },
          column_position: 2,
          is_active: true,
          sort_order: 1,
        },
        {
          title: "Popular Categories",
          content: {
            type: "category_links",
            show_count: 6,
          },
          column_position: 3,
          is_active: true,
          sort_order: 1,
        },
        {
          title: "Customer Support",
          content: {
            type: "contact",
            phone: "+91 98765 43210",
            email: "support@floristinindia.com",
            address: "Available 24/7 for assistance",
          },
          column_position: 4,
          is_active: true,
          sort_order: 1,
        },
      ];

      const { error } = await supabase
        .from("footer_sections")
        .upsert(footerSections, { onConflict: "title" });

      if (error) {
        console.error("Error creating footer sections:", error);
        alert("Error creating footer sections: " + error.message);
      } else {
        alert("Sample footer sections created successfully!");
      }
    } catch (error) {
      console.error("Error creating footer sections:", error);
      alert("Error creating footer sections");
    } finally {
      setIsCreatingFooter(false);
    }
  };

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
                  Run this SQL in Supabase ��� SQL Editor → New Query
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

      {/* RLS Fix Section */}
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-800">
            <AlertTriangle className="h-5 w-5" />
            Fix RLS Policy Error
            <Badge variant="outline" className="bg-red-100">
              If Getting RLS Errors
            </Badge>
          </CardTitle>
          <p className="text-sm text-red-700">
            If you get "row-level security policy" errors when rebuilding pages,
            run this SQL first
          </p>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto max-h-48">
              <code>{rlsFixSQL}</code>
            </pre>
            <Button
              variant="outline"
              size="sm"
              className="absolute top-2 right-2"
              onClick={() => copyToClipboard(rlsFixSQL, "rls")}
            >
              <Copy className="h-4 w-4 mr-1" />
              {copied === "rls" ? "Copied!" : "Copy"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Clear Old Pages */}
      <Card className="border-orange-200 bg-orange-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-800">
            <Trash2 className="h-5 w-5" />
            Clear Old Page Data
            <Badge variant="outline" className="bg-orange-100">
              Maintenance Tool
            </Badge>
          </CardTitle>
          <p className="text-sm text-orange-700">
            If pages are showing old content format, clear existing records to
            trigger creation of new structured content
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Button
              onClick={clearOldPages}
              disabled={isClearing}
              variant="destructive"
              size="sm"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {isClearing ? "Rebuilding..." : "Rebuild All 6 Pages"}
            </Button>
            {clearSuccess && (
              <Badge variant="outline" className="bg-green-100 text-green-800">
                ✓ Cleared! Visit pages to create new content
              </Badge>
            )}
          </div>
          <p className="text-xs text-orange-600 mt-2">
            ⚠️ This will delete all existing page content. New structured
            content will be created when you visit each page.
          </p>
        </CardContent>
      </Card>

      {/* Sample Footer Sections */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <Database className="h-5 w-5" />
            Create Sample Footer Sections
            <Badge variant="outline" className="bg-blue-100">
              Optional
            </Badge>
          </CardTitle>
          <p className="text-sm text-blue-700">
            Create sample footer sections to get started with the Footer Editor
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Button
              onClick={createSampleFooterSections}
              disabled={isCreatingFooter}
              variant="default"
              size="sm"
            >
              <Database className="h-4 w-4 mr-2" />
              {isCreatingFooter
                ? "Creating..."
                : "Create Sample Footer Sections"}
            </Button>
          </div>
          <p className="text-xs text-blue-600 mt-2">
            📋 Creates: Quick Links, Popular Categories, Customer Support
            sections
          </p>
        </CardContent>
      </Card>

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
              <h3 className="font-medium text-blue-800">Complete Page Set:</h3>
              <p className="mt-2 text-sm text-blue-700">
                After running the Pages table SQL, comprehensive pages will be
                created:
                <strong>
                  About Us, Help Center, Return & Refunds, Privacy Policy, and
                  Terms & Conditions
                </strong>
                . All content is fully editable through{" "}
                <strong>Admin → Pages</strong> using the content block editor.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
