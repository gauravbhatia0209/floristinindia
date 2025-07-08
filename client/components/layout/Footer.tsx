import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import { ProductCategory, SiteSettings } from "@shared/database.types";

export function Footer() {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [settings, setSettings] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchFooterData();
  }, []);

  async function fetchFooterData() {
    // Fetch categories for footer links
    const { data: categoriesData } = await supabase
      .from("product_categories")
      .select("*")
      .eq("is_active", true)
      .order("sort_order")
      .limit(8);

    // Fetch site settings
    const { data: settingsData } = await supabase
      .from("site_settings")
      .select("*");

    if (categoriesData) setCategories(categoriesData);

    if (settingsData) {
      const settingsMap = settingsData.reduce(
        (acc, setting) => {
          acc[setting.key] = setting.value;
          return acc;
        },
        {} as Record<string, string>,
      );
      setSettings(settingsMap);
    }
  }

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted/50 border-t">
      {/* Newsletter Section */}
      <div className="bg-gradient-rose text-white">
        <div className="container py-12">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-2">
              Stay Blooming with Our Updates 🌸
            </h3>
            <p className="text-rose-100 mb-6">
              Get exclusive offers, flower care tips, and be the first to know
              about new arrivals
            </p>
            <div className="flex gap-2 max-w-md mx-auto">
              <Input
                placeholder="Enter your email"
                className="bg-white/10 border-white/20 text-white placeholder:text-rose-100"
              />
              <Button variant="secondary" className="whitespace-nowrap">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-rose rounded-full flex items-center justify-center">
                <span className="text-white font-bold">🌹</span>
              </div>
              <span className="text-lg font-bold text-gradient-rose">
                Florist in India
              </span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              India's premium flower delivery service, spreading joy and love
              through beautiful, fresh flowers delivered right to your doorstep.
            </p>

            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4 text-primary" />
                <span>Delhi NCR, Mumbai, Bangalore & 100+ Cities</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="w-4 h-4 text-primary" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="w-4 h-4 text-primary" />
                <span>orders@floristinindia.com</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="w-4 h-4 text-primary" />
                <span>24/7 Customer Support</span>
              </div>
            </div>
          </div>

          {/* Popular Categories */}
          <div>
            <h4 className="font-semibold mb-4">Popular Categories</h4>
            <ul className="space-y-2">
              {categories.slice(0, 6).map((category) => (
                <li key={category.id}>
                  <Link
                    to={`/category/${category.slug}`}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/about"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/delivery-info"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Delivery Information
                </Link>
              </li>
              <li>
                <Link
                  to="/care-guide"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Flower Care Guide
                </Link>
              </li>
              <li>
                <Link
                  to="/corporate"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Corporate Gifts
                </Link>
              </li>
              <li>
                <Link
                  to="/track-order"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/help"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  to="/returns"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Returns & Refunds
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link
                  to="/sitemap"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Sitemap
                </Link>
              </li>
            </ul>

            {/* Social Media */}
            <div className="mt-6">
              <h5 className="font-medium mb-3">Follow Us</h5>
              <div className="flex gap-2">
                <Button size="icon" variant="outline" className="w-8 h-8">
                  <Facebook className="w-4 h-4" />
                </Button>
                <Button size="icon" variant="outline" className="w-8 h-8">
                  <Instagram className="w-4 h-4" />
                </Button>
                <Button size="icon" variant="outline" className="w-8 h-8">
                  <Twitter className="w-4 h-4" />
                </Button>
                <Button size="icon" variant="outline" className="w-8 h-8">
                  <Youtube className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t bg-background">
        <div className="container py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <div>© {currentYear} Florist in India. All rights reserved.</div>
            <div className="flex items-center gap-4">
              <span>🔒 Secure Payments</span>
              <span>🚚 Same Day Delivery</span>
              <span>🌱 Fresh Guarantee</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
