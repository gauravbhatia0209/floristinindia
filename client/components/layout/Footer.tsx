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
  const [footerSections, setFooterSections] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Dynamic column configuration - loaded from database
  const [MAX_COLUMNS, setMaxColumns] = useState(6); // Default value
  const COMPANY_COLUMN = 1; // Column 1 is always reserved for company info
  const [DYNAMIC_COLUMNS, setDynamicColumns] = useState<number[]>([
    2, 3, 4, 5, 6,
  ]);

  useEffect(() => {
    // Load configuration and fetch data
    loadFooterConfig();
    fetchFooterData();

    // Set up real-time subscription for footer sections
    const footerSubscription = supabase
      .channel("footer_sections_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "footer_sections",
        },
        () => {
          console.log("Footer sections changed - refetching...");
          fetchFooterData();
        },
      )
      .subscribe();

    // Also fetch data when window gets focus (to catch changes made in admin)
    const handleFocus = () => {
      console.log("Window focused - refetching footer data...");
      fetchFooterData();
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      supabase.removeChannel(footerSubscription);
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  async function loadFooterConfig() {
    try {
      const { data, error } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "footer_max_columns")
        .maybeSingle(); // Use maybeSingle() to handle when no records exist

      if (!error && data) {
        const maxCols = parseInt(data.value) || 6;
        setMaxColumns(maxCols);
        setDynamicColumns(Array.from({ length: maxCols - 1 }, (_, i) => i + 2));
        console.log("Footer config loaded:", maxCols, "columns");
      } else {
        console.log("Using default footer configuration - no setting found");
      }
    } catch (error) {
      console.log("Footer config error, using defaults:", error);
    }
  }

  async function fetchFooterData() {
    try {
      setIsLoading(true);

      // Fetch footer sections with error handling (force fresh data)
      console.log("Fetching footer sections at:", new Date().toISOString());
      const { data: footerData, error: footerError } = await supabase
        .from("footer_sections")
        .select("*")
        .eq("is_active", true)
        .order("column_position", { ascending: true })
        .order("sort_order", { ascending: true });

      // Fetch categories for footer links
      const { data: categoriesData, error: categoriesError } = await supabase
        .from("product_categories")
        .select("*")
        .eq("is_active", true)
        .order("sort_order")
        .limit(10);

      // Fetch site settings
      const { data: settingsData, error: settingsError } = await supabase
        .from("site_settings")
        .select("*");

      if (footerError) {
        console.error("Error fetching footer sections:", footerError);
      } else if (footerData) {
        console.log("Footer sections fetched:", footerData);
        console.log("Number of active footer sections:", footerData.length);

        // Debug: Show details of each section
        footerData.forEach((section, index) => {
          console.log(`Section ${index + 1}:`, {
            title: section.title,
            column_position: section.column_position,
            sort_order: section.sort_order,
            is_active: section.is_active,
          });
        });

        setFooterSections(footerData);
      }

      if (categoriesError) {
        console.error("Error fetching categories:", categoriesError);
      } else if (categoriesData) {
        setCategories(categoriesData);
      }

      if (settingsError) {
        console.error("Error fetching settings:", settingsError);
      } else if (settingsData) {
        const settingsMap = settingsData.reduce(
          (acc, setting) => {
            acc[setting.key] = setting.value;
            return acc;
          },
          {} as Record<string, string>,
        );
        setSettings(settingsMap);
      }
    } catch (error) {
      console.error("Error fetching footer data:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const currentYear = new Date().getFullYear();

  // Loading state
  if (isLoading) {
    return (
      <footer className="bg-muted/50 border-t">
        <div className="container py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-4">
                <div className="h-6 bg-gray-200 rounded animate-pulse w-32"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </footer>
    );
  }

  function renderFooterSection(section: any) {
    // Safe content parsing with fallbacks
    const content = section.content || {};
    const contentType = content.type || "text";

    // Safety function to render text content
    const safeText = (text: string) => {
      if (!text || typeof text !== "string") return null;
      return text.replace(/[<>]/g, ""); // Basic XSS protection
    };

    switch (contentType) {
      case "links":
        if (!Array.isArray(content.links)) {
          return (
            <div className="text-sm text-muted-foreground">
              No links configured
            </div>
          );
        }
        return (
          <ul className="space-y-2 text-sm">
            {content.links
              .filter((link: any) => link && link.text && link.url)
              .map((link: any, index: number) => (
                <li key={index}>
                  <Link
                    to={safeText(link.url) || "#"}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {safeText(link.text)}
                  </Link>
                </li>
              ))}
          </ul>
        );

      case "category_links":
        if (categories.length === 0) {
          return (
            <div className="text-sm text-muted-foreground">
              No categories available
            </div>
          );
        }
        const showCount = Math.max(1, Math.min(content.show_count || 6, 20)); // Limit between 1-20
        return (
          <ul className="space-y-2 text-sm">
            {categories.slice(0, showCount).map((category) => (
              <li key={category.id}>
                <Link
                  to={`/category/${category.slug}`}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {safeText(category.name)}
                </Link>
              </li>
            ))}
          </ul>
        );

      case "contact":
        const hasContactInfo =
          content.phone || content.email || content.address;
        if (!hasContactInfo) {
          return (
            <div className="text-sm text-muted-foreground">
              No contact information configured
            </div>
          );
        }
        return (
          <div className="space-y-2 text-sm">
            {content.phone && (
              <div className="flex items-start gap-2 text-muted-foreground">
                <Phone className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <span>{safeText(content.phone)}</span>
              </div>
            )}
            {content.email && (
              <div className="flex items-start gap-2 text-muted-foreground">
                <Mail className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <span>{safeText(content.email)}</span>
              </div>
            )}
            {content.address && (
              <div className="flex items-start gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <span>{safeText(content.address)}</span>
              </div>
            )}
          </div>
        );

      case "text":
        const textContent = safeText(content.text);
        if (!textContent) {
          return (
            <div className="text-sm text-muted-foreground">
              No content available
            </div>
          );
        }
        return (
          <div className="text-sm text-muted-foreground leading-relaxed">
            {textContent.split("\n").map((line, index) => (
              <div key={index}>{line}</div>
            ))}
          </div>
        );

      default:
        return (
          <div className="text-sm text-muted-foreground">
            Content type not supported
          </div>
        );
    }
  }

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
        <div
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${Math.min(MAX_COLUMNS, 6)} gap-8`}
        >
          {/* Company Info - Column 1 (Always show) */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-rose rounded-full flex items-center justify-center">
                <span className="text-white font-bold">🌹</span>
              </div>
              <span className="text-lg font-bold text-gradient-rose">
                {settings.site_name || "Florist in India"}
              </span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {settings.site_description ||
                "India's premium flower delivery service, spreading joy and love through beautiful, fresh flowers delivered right to your doorstep."}
            </p>

            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <span>
                  {settings.contact_address ||
                    "Delhi NCR, Mumbai, Bangalore & 100+ Cities"}
                </span>
              </div>
              <div className="flex items-start gap-2 text-muted-foreground">
                <Phone className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <span>{settings.contact_phone || "+91 98765 43210"}</span>
              </div>
              <div className="flex items-start gap-2 text-muted-foreground">
                <Mail className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <span>
                  {settings.contact_email || "orders@floristinindia.com"}
                </span>
              </div>
              <div className="flex items-start gap-2 text-muted-foreground">
                <Clock className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <span>24/7 Customer Support</span>
              </div>
            </div>

            {/* Social Media */}
            <div className="mt-6">
              <h5 className="font-medium mb-3">Follow Us</h5>
              <div className="flex gap-2">
                {settings.social_facebook && (
                  <Button
                    size="icon"
                    variant="outline"
                    className="w-8 h-8"
                    asChild
                  >
                    <a
                      href={settings.social_facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Facebook"
                    >
                      <Facebook className="w-4 h-4" />
                    </a>
                  </Button>
                )}
                {settings.social_instagram && (
                  <Button
                    size="icon"
                    variant="outline"
                    className="w-8 h-8"
                    asChild
                  >
                    <a
                      href={settings.social_instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Instagram"
                    >
                      <Instagram className="w-4 h-4" />
                    </a>
                  </Button>
                )}
                {settings.social_twitter && (
                  <Button
                    size="icon"
                    variant="outline"
                    className="w-8 h-8"
                    asChild
                  >
                    <a
                      href={settings.social_twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Twitter"
                    >
                      <Twitter className="w-4 h-4" />
                    </a>
                  </Button>
                )}
                {settings.social_youtube && (
                  <Button
                    size="icon"
                    variant="outline"
                    className="w-8 h-8"
                    asChild
                  >
                    <a
                      href={settings.social_youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="YouTube"
                    >
                      <Youtube className="w-4 h-4" />
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Dynamic Footer Sections - Organized by columns */}
          {DYNAMIC_COLUMNS.map((columnPosition) => {
            const sectionsInColumn = footerSections.filter(
              (section) => section.column_position === columnPosition,
            );

            // Count total active sections to determine if we should show fallback
            const totalActiveSections = footerSections.length;

            // Debug logging for all columns
            console.log(`Column ${columnPosition} processing:`, {
              totalActiveSections,
              sectionsInThisColumn: sectionsInColumn.length,
              sectionTitles: sectionsInColumn.map((s) => s.title),
            });

            if (sectionsInColumn.length === 0) {
              // When admin makes all sections inactive, show empty columns (no fallback)
              console.log(
                `Column ${columnPosition} - Showing empty (no fallback content)`,
              );
              return null; // Always show nothing when no sections in column
            }

            return (
              <div key={columnPosition} className="space-y-8">
                {sectionsInColumn.map((section) => (
                  <div key={section.id}>
                    <h4 className="font-semibold mb-4">{section.title}</h4>
                    {renderFooterSection(section)}
                  </div>
                ))}
              </div>
            );
          })}
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
