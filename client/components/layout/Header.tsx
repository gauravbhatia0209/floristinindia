import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  Menu,
  X,
  Phone,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { supabase } from "@/lib/supabase";
import { ProductCategory } from "@shared/database.types";
import { useCart } from "@/hooks/useCart";

interface SiteSettingsMap {
  site_name?: string;
  site_tagline?: string;
  logo_url?: string;
  contact_phone?: string;
  contact_email?: string;
  header_banner_text?: string;
  header_banner_enabled?: string;
}

export function Header() {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettingsMap>({});
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { items } = useCart();

  const cartItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    fetchCategories();
    fetchSiteSettings();
  }, []);

  async function fetchCategories() {
    // First try to get menu items from database
    const { data: menuItems } = await supabase
      .from("menu_items")
      .select("*, product_categories(*)")
      .eq("is_active", true)
      .is("parent_id", null)
      .order("sort_order");

    if (menuItems && menuItems.length > 0) {
      // Use menu items if available
      const categoriesFromMenu = menuItems
        .filter((item) => item.product_categories)
        .map((item) => item.product_categories);
      setCategories(categoriesFromMenu);
    } else {
      // Fallback to categories with show_in_menu = true
      const { data: categoriesData } = await supabase
        .from("product_categories")
        .select("*")
        .eq("is_active", true)
        .eq("show_in_menu", true)
        .order("sort_order");

      if (categoriesData) setCategories(categoriesData);
    }
  }

  async function fetchSiteSettings() {
    try {
      const { data: settingsData } = await supabase
        .from("site_settings")
        .select("*")
        .in("key", [
          "site_name",
          "site_tagline",
          "logo_url",
          "contact_phone",
          "contact_email",
          "header_banner_text",
          "header_banner_enabled",
        ]);

      if (settingsData) {
        const settingsMap: SiteSettingsMap = {};
        settingsData.forEach((setting) => {
          settingsMap[setting.key as keyof SiteSettingsMap] = setting.value;
        });
        setSiteSettings(settingsMap);
      }
    } catch (error) {
      console.error("Failed to fetch site settings:", error);
    }
  }

  return (
    <div className="bg-background border-b sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-primary text-primary-foreground">
        <div className="container flex items-center justify-between py-2 text-sm">
          <div className="flex items-center gap-4">
            {siteSettings.contact_phone && (
              <span className="flex items-center gap-1">
                <Phone className="w-3 h-3" />
                {siteSettings.contact_phone}
              </span>
            )}
            {siteSettings.contact_email && (
              <span className="flex items-center gap-1">
                <Mail className="w-3 h-3" />
                {siteSettings.contact_email}
              </span>
            )}
          </div>
          {siteSettings.header_banner_enabled === "true" &&
            siteSettings.header_banner_text && (
              <div className="hidden sm:block">
                {siteSettings.header_banner_text}
              </div>
            )}
        </div>
      </div>

      {/* Main Header */}
      <div className="container py-4">
        <div className="flex items-center gap-4">
          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80">
              <div className="py-4">
                <h2 className="text-lg font-semibold mb-4">Categories</h2>
                <nav className="flex flex-col gap-2">
                  {categories.map((category) => (
                    <Link
                      key={category.id}
                      to={`/category/${category.slug}`}
                      className="px-3 py-2 rounded-md hover:bg-accent text-left"
                    >
                      {category.name}
                    </Link>
                  ))}
                </nav>
              </div>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            {siteSettings.logo_url ? (
              <img
                src={siteSettings.logo_url}
                alt={siteSettings.site_name || "Logo"}
                className="w-10 h-10 object-contain"
              />
            ) : (
              <div className="w-10 h-10 bg-gradient-rose rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">🌹</span>
              </div>
            )}
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-gradient-rose">
                {siteSettings.site_name || "Florist in India"}
              </h1>
              <p className="text-xs text-muted-foreground -mt-1">
                {siteSettings.site_tagline || "Premium Flower Delivery"}
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 flex-1 ml-8">
            {categories.slice(0, 6).map((category) => (
              <Link
                key={category.id}
                to={`/category/${category.slug}`}
                className="px-3 py-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                {category.name}
              </Link>
            ))}
            {categories.length > 6 && (
              <Link
                to="/categories"
                className="px-3 py-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                More...
              </Link>
            )}
          </nav>

          {/* Search */}
          <div className="hidden md:flex flex-1 max-w-md relative">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search flowers, occasions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Mobile Search */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              {isSearchOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Search className="h-5 w-5" />
              )}
            </Button>

            {/* Wishlist */}
            <Link to="/wishlist">
              <Button variant="ghost" size="icon" className="relative">
                <Heart className="h-5 w-5" />
                <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-rose text-white">
                  0
                </Badge>
              </Button>
            </Link>

            {/* Cart */}
            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cartItemsCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-primary text-primary-foreground">
                    {cartItemsCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* Profile */}
            <Link to="/account">
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Mobile Search */}
        {isSearchOpen && (
          <div className="mt-4 md:hidden">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search flowers, occasions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4"
                autoFocus
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
