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
import { ChevronDown } from "lucide-react";
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

interface MenuItem {
  id: string;
  name: string;
  category_id?: string;
  url?: string;
  is_active: boolean;
  sort_order: number;
  target: "_self" | "_blank";
  parent_id?: string;
  product_categories?: ProductCategory & {
    subcategories?: ProductCategory[];
  };
}

export function Header() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettingsMap>({});
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedMobileMenu, setExpandedMobileMenu] = useState<string | null>(
    null,
  );
  const { items } = useCart();

  const cartItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    fetchMenuItems();
    fetchSiteSettings();
  }, []);

  async function fetchMenuItems() {
    // Fetch menu items from database (only active items, sorted by custom order)
    const { data: menuItemsData, error } = await supabase
      .from("menu_items")
      .select("*, product_categories(*)")
      .eq("is_active", true)
      .is("parent_id", null)
      .order("sort_order");

    if (error) {
      console.error("Error fetching menu items:", error);
      setMenuItems([]);
      setCategories([]);
      return;
    }

    if (menuItemsData && menuItemsData.length > 0) {
      // For each menu item linked to a category, fetch its subcategories
      const menuItemsWithSubcategories = await Promise.all(
        menuItemsData.map(async (item) => {
          if (item.category_id && item.product_categories) {
            // Fetch active subcategories for this category
            const { data: subcategories } = await supabase
              .from("product_categories")
              .select("*")
              .eq("parent_id", item.category_id)
              .eq("is_active", true)
              .order("sort_order");

            return {
              ...item,
              product_categories: {
                ...item.product_categories,
                subcategories: subcategories || [],
              },
            };
          }
          return item;
        }),
      );

      setMenuItems(menuItemsWithSubcategories);

      // Also store categories for backward compatibility (if needed elsewhere)
      const categoriesFromMenu = menuItemsWithSubcategories
        .filter((item) => item.product_categories)
        .map((item) => item.product_categories);
      setCategories(categoriesFromMenu);
    } else {
      // No active menu items configured - show empty menu
      setMenuItems([]);
      setCategories([]);
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
                <h2 className="text-lg font-semibold mb-4">Menu</h2>
                <nav className="flex flex-col gap-2">
                  {menuItems.map((item) => {
                    const href =
                      item.category_id && item.product_categories
                        ? `/category/${item.product_categories.slug}`
                        : item.url || "#";

                    const hasSubcategories =
                      item.product_categories?.subcategories &&
                      item.product_categories.subcategories.length > 0;

                    return (
                      <div key={item.id}>
                        {hasSubcategories ? (
                          <div>
                            <button
                              onClick={() =>
                                setExpandedMobileMenu(
                                  expandedMobileMenu === item.id
                                    ? null
                                    : item.id,
                                )
                              }
                              className="w-full px-3 py-2 rounded-md hover:bg-accent text-left flex items-center justify-between"
                            >
                              <span>{item.name}</span>
                              <ChevronDown
                                className={`w-4 h-4 transition-transform ${
                                  expandedMobileMenu === item.id
                                    ? "rotate-180"
                                    : ""
                                }`}
                              />
                            </button>

                            {expandedMobileMenu === item.id && (
                              <div className="ml-4 mt-2 space-y-1">
                                <Link
                                  to={href}
                                  target={item.target}
                                  className="block px-3 py-2 rounded-md hover:bg-accent text-sm text-muted-foreground"
                                >
                                  View All {item.name}
                                </Link>
                                {item.product_categories.subcategories?.map(
                                  (subcategory) => (
                                    <Link
                                      key={subcategory.id}
                                      to={`/category/${subcategory.slug}`}
                                      className="block px-3 py-2 rounded-md hover:bg-accent text-sm"
                                    >
                                      {subcategory.name}
                                    </Link>
                                  ),
                                )}
                              </div>
                            )}
                          </div>
                        ) : (
                          <Link
                            to={href}
                            target={item.target}
                            className="block px-3 py-2 rounded-md hover:bg-accent text-left"
                          >
                            {item.name}
                          </Link>
                        )}
                      </div>
                    );
                  })}
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
            {menuItems.slice(0, 6).map((item) => {
              const href =
                item.category_id && item.product_categories
                  ? `/category/${item.product_categories.slug}`
                  : item.url || "#";

              const hasSubcategories =
                item.product_categories?.subcategories &&
                item.product_categories.subcategories.length > 0;

              return hasSubcategories ? (
                <div
                  key={item.id}
                  className="relative group"
                  onMouseEnter={() => {}}
                  onMouseLeave={() => {}}
                >
                  <Link
                    to={href}
                    target={item.target}
                    className="px-3 py-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors inline-flex items-center"
                  >
                    {item.name}
                    <ChevronDown className="w-4 h-4 ml-1 transition-transform group-hover:rotate-180" />
                  </Link>

                  {/* Hover Dropdown */}
                  <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-border rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-in-out transform translate-y-2 group-hover:translate-y-0 z-50">
                    <div className="py-2">
                      <Link
                        to={href}
                        target={item.target}
                        className="block px-4 py-2 text-sm font-medium text-primary hover:bg-accent hover:text-accent-foreground transition-colors"
                      >
                        View All {item.name}
                      </Link>
                      <div className="border-t border-border my-1"></div>
                      {item.product_categories.subcategories?.map(
                        (subcategory) => (
                          <Link
                            key={subcategory.id}
                            to={`/category/${subcategory.slug}`}
                            className="block px-4 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                          >
                            {subcategory.name}
                          </Link>
                        ),
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={item.id}
                  to={href}
                  target={item.target}
                  className="px-3 py-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  {item.name}
                </Link>
              );
            })}
            {menuItems.length > 6 && (
              <Link
                to="/products"
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
