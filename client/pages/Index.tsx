import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Star,
  Truck,
  Shield,
  HeartHandshake,
  ShoppingCart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import {
  ProductCategory,
  Product,
  HomepageSection,
} from "@shared/database.types";

export default function Index() {
  const [sections, setSections] = useState<HomepageSection[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchHomepageData();
  }, []);

  async function loadFallbackProducts() {
    console.log("🔄 Loading fallback featured products...");
    const { data: fallbackData, error: fallbackError } = await supabase
      .from("products")
      .select(
        `
        id,
        name,
        slug,
        price,
        sale_price,
        images,
        is_active
      `,
      )
      .eq("is_active", true)
      .eq("is_featured", true)
      .limit(8);

    if (fallbackError) {
      console.error("🚨 Fallback products error:");
      console.error(
        "Fallback error details:",
        JSON.stringify(fallbackError, null, 2),
      );
      console.error("Fallback error message:", fallbackError?.message);
      console.error("Fallback error code:", fallbackError?.code);
      console.error("Fallback error hint:", fallbackError?.hint);
    }

    if (fallbackData && fallbackData.length > 0) {
      console.log("✅ Loaded fallback featured products:", fallbackData);
      setFeaturedProducts(fallbackData);
    } else {
      console.warn("⚠️ No fallback products found either");
      setFeaturedProducts([]);
    }
  }

  async function fetchHomepageData() {
    try {
      console.log("🔍 Starting to fetch homepage sections...");

      // First, let's try a simple query to test connection
      const { data: testData, error: testError } = await supabase
        .from("homepage_sections")
        .select("id, type")
        .limit(1);

      console.log("🔍 Test query result:", { testData, testError });

      // Fetch active homepage sections in order
      const { data: sectionsData, error: sectionsError } = await supabase
        .from("homepage_sections")
        .select("*")
        .eq("is_active", true)
        .order("sort_order");

      if (sectionsError) {
        console.error("🚨 Homepage: Error fetching sections:");
        console.error("Error details:", JSON.stringify(sectionsError, null, 2));
        console.error("Error message:", sectionsError.message);
        console.error("Error code:", sectionsError.code);
        return;
      }

      if (sectionsData) {
        console.log("Homepage: Loaded sections from database:", sectionsData);
        setSections(sectionsData);

        // Extract selected category and product IDs from sections
        const categorySection = sectionsData.find(
          (s) => s.type === "category_grid",
        );
        const productSection = sectionsData.find(
          (s) => s.type === "product_carousel",
        );

        console.log("🏠 Homepage: All sections loaded:", sectionsData);
        console.log(
          "🏠 Homepage: Section types found:",
          sectionsData.map((s) => s.type),
        );
        console.log("🏠 Homepage: Category section found:", categorySection);
        console.log("🏠 Homepage: Product section found:", productSection);

        // Debug the product section content structure
        if (productSection) {
          console.log(
            "🔍 Product section full content:",
            JSON.stringify(productSection.content, null, 2),
          );
          console.log(
            "🔍 Product section selected_products:",
            productSection.content?.selected_products,
          );
        } else {
          console.warn(
            "⚠️ No product_carousel section found in sections:",
            sectionsData.map((s) => ({ type: s.type, title: s.title })),
          );
        }

        // Fetch admin-selected categories
        if (categorySection?.content?.selected_categories?.length > 0) {
          const { data: categoriesData } = await supabase
            .from("product_categories")
            .select("*")
            .in("id", categorySection.content.selected_categories)
            .eq("is_active", true);

          if (categoriesData) {
            // Sort categories by the order they were selected
            const sortedCategories = categorySection.content.selected_categories
              .map((id: string) => categoriesData.find((cat) => cat.id === id))
              .filter(Boolean);
            setCategories(sortedCategories);
          }
        } else {
          // Fallback to featured categories if none selected
          const { data: categoriesData } = await supabase
            .from("product_categories")
            .select("*")
            .eq("is_active", true)
            .eq("show_in_menu", true)
            .order("sort_order")
            .limit(8);
          if (categoriesData) setCategories(categoriesData);
        }

        // Fetch admin-selected products
        if (productSection?.content?.selected_products?.length > 0) {
          const selectedProductIds = productSection.content.selected_products;
          console.log(
            "🎯 Product Showcase: Found product section with content:",
            productSection,
          );
          console.log(
            "🎯 Product Showcase: Admin-selected product IDs:",
            selectedProductIds,
          );
          console.log(
            "🎯 Product Showcase: ID types:",
            selectedProductIds.map((id: any) => typeof id),
          );
          console.log(
            "🎯 Product Showcase: Fetching products with query - product.id IN",
            selectedProductIds,
          );

          // First, let's check what products exist in the database
          const { data: allProducts, error: allProductsError } = await supabase
            .from("products")
            .select("id, name, is_active")
            .eq("is_active", true);

          console.log("🔍 All active products in database:", allProducts);
          console.log("🔍 All products error:", allProductsError);

          const { data: productsData, error: productsError } = await supabase
            .from("products")
            .select(
              `
              id,
              name,
              slug,
              price,
              sale_price,
              images,
              is_active
            `,
            )
            .in("id", selectedProductIds)
            .eq("is_active", true);

          console.log("🎯 Product Showcase: Raw query results:", productsData);
          console.log(
            "🎯 Product Showcase: Query error (if any):",
            productsError,
          );
          console.log("🕐 Query executed at:", new Date().toISOString());

          if (productsError) {
            console.error("🚨 Product Showcase: Database error:");
            console.error(
              "Products error details:",
              JSON.stringify(productsError, null, 2),
            );
            console.error("Products error message:", productsError?.message);
            console.error("Products error code:", productsError?.code);
            console.error("Products error hint:", productsError?.hint);
            await loadFallbackProducts();
            return;
          }

          console.log(
            "📊 Product Showcase: Query returned",
            productsData?.length || 0,
            "products",
          );

          if (productsData && productsData.length > 0) {
            // Sort products by the order they were selected in admin
            const sortedProducts = selectedProductIds
              .map((id: string) => productsData.find((prod) => prod.id === id))
              .filter((product) => {
                if (!product) {
                  console.warn(
                    "⚠️ Product Showcase: Product not found for ID:",
                    id,
                  );
                  return false;
                }
                if (!product.images || product.images.length === 0) {
                  console.warn(
                    "⚠️ Product Showcase: Product has no images:",
                    product.name,
                  );
                }
                return true;
              });

            console.log(
              "✅ Product Showcase: Final sorted products to render:",
              sortedProducts,
            );
            console.log(
              "📝 Product Showcase: Product titles to render:",
              sortedProducts.map((p) => p.name),
            );
            console.log(
              "🖼��� Product Showcase: Product images:",
              sortedProducts.map((p) => ({
                name: p.name,
                hasImages: p.images && p.images.length > 0,
                firstImage: p.images?.[0] || "No image",
              })),
            );

            if (sortedProducts.length > 0) {
              setFeaturedProducts(sortedProducts);
            } else {
              console.warn(
                "⚠️ Product Showcase: All selected products filtered out, using fallback",
              );
              await loadFallbackProducts();
            }
          } else {
            console.warn(
              "⚠️ Product Showcase: No products returned from database query for selected IDs:",
              selectedProductIds,
            );
            console.warn(
              "🔍 Available product IDs in database:",
              allProducts?.map((p) => p.id) || [],
            );
            await loadFallbackProducts();
          }
        } else {
          console.log(
            "🔄 Product Showcase: No admin-selected products, using fallback featured products",
          );
          await loadFallbackProducts();
        }
      }
    } catch (error) {
      console.error("🚨 Failed to fetch homepage data:");
      console.error("Error details:", JSON.stringify(error, null, 2));
      console.error("Error object:", error);
      if (error instanceof Error) {
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
      }
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // Render individual section components
  function renderSection(section: HomepageSection) {
    console.log(
      `Homepage: Rendering section of type "${section.type}" with data:`,
      section,
    );

    if (!section.is_active) {
      console.log(
        `Homepage: Section "${section.type}" is not active, skipping render`,
      );
      return null;
    }

    switch (section.type) {
      case "hero":
        return renderHeroSection(section);
      case "features":
        return renderFeaturesSection(section);
      case "category_grid":
        return renderCategoryGrid(section);
      case "product_carousel":
        return renderProductCarousel(section);
      case "testimonials":
        return renderTestimonials(section);
      case "newsletter":
        return renderNewsletter(section);
      default:
        console.log(`Homepage: Unknown section type "${section.type}"`);
        return null;
    }
  }

  function renderHeroSection(section: HomepageSection) {
    const content = section.content as any;
    return (
      <section
        key={section.id}
        className="relative bg-gradient-rose text-white overflow-hidden"
      >
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container relative py-24 lg:py-32">
          <div className="max-w-4xl relative z-20">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              {section.title || "Fresh Flowers"}
              <br />
              <span className="text-peach">
                {section.subtitle || "Delivered Daily"}
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-rose-100 max-w-2xl">
              {content?.description ||
                "Experience the joy of premium flower delivery across India. Same-day delivery available in 100+ cities."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                variant="secondary"
                className="text-lg px-8"
                asChild
              >
                <Link to={content?.button_link || "/products"}>
                  {content?.button_text || "Shop Now"}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 border-white text-white hover:bg-white hover:text-primary"
                asChild
              >
                <Link to="/products">Explore Collections</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Right Side Decorative Image */}
        {content?.right_image_url && (
          <div className="absolute inset-0 pointer-events-none hidden lg:block overflow-hidden">
            {/* Background gradient effect */}
            <div
              className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 opacity-15 blur-2xl animate-glow-pulse"
              style={{
                background: `radial-gradient(circle, rgba(233,28,99,0.3) 0%, rgba(255,179,128,0.2) 50%, transparent 80%)`,
              }}
            />

            {/* Main decorative image container */}
            <div className="absolute right-6 top-1/2 -translate-y-1/2 lg:right-12 xl:right-16 animate-entrance">
              <div className="relative animate-gentle-float">
                {/* Multiple layered glow effects */}
                <div
                  className="absolute inset-0 bg-white/10 rounded-full blur-3xl scale-125 opacity-60 animate-glow-pulse"
                  style={{ animationDelay: "1s" }}
                />
                <div
                  className="absolute inset-0 bg-rose-300/20 rounded-full blur-2xl scale-110 opacity-40 animate-glow-pulse"
                  style={{ animationDelay: "0.5s" }}
                />

                {/* Main image with enhanced styling */}
                <img
                  src={content.right_image_url}
                  alt="Decorative"
                  className="relative w-48 h-48 lg:w-56 lg:h-56 xl:w-64 xl:h-64 object-contain opacity-85 transition-all duration-700 hover:opacity-95 hover:scale-105"
                  style={{
                    filter:
                      "drop-shadow(0 8px 32px rgba(233,28,99,0.15)) drop-shadow(0 0 60px rgba(255,255,255,0.1))",
                  }}
                  onError={(e) => {
                    console.warn(
                      "Hero right image failed to load:",
                      content.right_image_url,
                    );
                    e.currentTarget.parentElement?.parentElement?.parentElement?.remove();
                  }}
                />

                {/* Floating decorative elements */}
                <div className="absolute -inset-12">
                  {/* Floating sparkles */}
                  <div
                    className="absolute top-8 right-12 w-2 h-2 bg-gradient-to-r from-white to-rose-200 rounded-full animate-float opacity-60"
                    style={{ animationDelay: "0s", animationDuration: "5s" }}
                  />
                  <div
                    className="absolute bottom-12 left-8 w-1.5 h-1.5 bg-gradient-to-r from-peach to-gold rounded-full animate-float opacity-50"
                    style={{ animationDelay: "2s", animationDuration: "6s" }}
                  />
                  <div
                    className="absolute top-1/4 left-4 w-1 h-1 bg-gradient-to-r from-rose-300 to-rose-100 rounded-full animate-float opacity-70"
                    style={{ animationDelay: "1s", animationDuration: "7s" }}
                  />
                  <div
                    className="absolute bottom-1/3 right-6 w-1.5 h-1.5 bg-gradient-to-r from-white to-peach rounded-full animate-float opacity-40"
                    style={{ animationDelay: "3s", animationDuration: "5.5s" }}
                  />
                  <div
                    className="absolute top-1/2 left-12 w-1 h-1 bg-white/60 rounded-full animate-float opacity-50"
                    style={{ animationDelay: "4s", animationDuration: "6.5s" }}
                  />

                  {/* Larger floating elements */}
                  <div
                    className="absolute top-16 left-16 w-3 h-3 bg-gradient-to-br from-white/30 to-rose-200/30 rounded-full blur-sm animate-float opacity-30"
                    style={{ animationDelay: "1.5s", animationDuration: "8s" }}
                  />
                  <div
                    className="absolute bottom-8 right-20 w-2 h-2 bg-gradient-to-br from-peach/40 to-gold/40 rounded-full blur-sm animate-float opacity-40"
                    style={{
                      animationDelay: "2.5s",
                      animationDuration: "7.5s",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Subtle light rays effect */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-full h-full opacity-5">
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-1 bg-gradient-to-l from-white to-transparent blur-sm" />
              <div className="absolute right-0 top-1/2 -translate-y-1/2 rotate-12 w-96 h-0.5 bg-gradient-to-l from-rose-200 to-transparent blur-sm" />
              <div className="absolute right-0 top-1/2 -translate-y-1/2 -rotate-12 w-96 h-0.5 bg-gradient-to-l from-peach to-transparent blur-sm" />
            </div>
          </div>
        )}

        {/* Floating Flowers Animation - repositioned to not conflict with image */}
        <div className="absolute top-10 left-10 text-6xl animate-float opacity-20 lg:left-1/4">
          🌸
        </div>
        <div
          className="absolute top-32 left-1/3 text-4xl animate-float opacity-30 lg:left-1/2"
          style={{ animationDelay: "2s" }}
        >
          🌺
        </div>
        <div
          className="absolute bottom-20 left-16 text-5xl animate-float opacity-25 lg:left-1/3"
          style={{ animationDelay: "4s" }}
        >
          🌻
        </div>
      </section>
    );
  }

  function renderFeaturesSection(section: HomepageSection) {
    const content = section.content as any;
    const features = content?.features || [
      {
        icon: "truck",
        title: "Same Day Delivery",
        description:
          "Order before 2 PM and get fresh flowers delivered the same day",
      },
      {
        icon: "shield",
        title: "Fresh Guarantee",
        description: "100% fresh flowers guaranteed or your money back",
      },
      {
        icon: "heart",
        title: "24/7 Support",
        description: "Our customer care team is always here to help you",
      },
    ];

    const getIcon = (iconName: string) => {
      switch (iconName) {
        case "truck":
          return Truck;
        case "shield":
          return Shield;
        case "heart":
          return HeartHandshake;
        default:
          return Truck;
      }
    };

    return (
      <section key={section.id} className="py-16 bg-cream/30">
        <div className="container">
          {section.title && (
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {section.title}
              </h2>
              {section.subtitle && (
                <p className="text-xl text-muted-foreground">
                  {section.subtitle}
                </p>
              )}
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature: any, index: number) => {
              const IconComponent = getIcon(feature.icon);
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-gradient-rose rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    );
  }

  function renderCategoryGrid(section: HomepageSection) {
    const content = section.content as any;
    const showCount = content?.show_count || 8;
    const displayTitle = section.title || "Shop by Occasion";
    const displaySubtitle =
      section.subtitle ||
      "Find the perfect flowers for every special moment in life";

    // Filter out any invalid categories and limit display count
    const validCategories = categories
      .filter(
        (category) => category && category.id && category.name && category.slug,
      )
      .slice(0, showCount);

    if (validCategories.length === 0) {
      return (
        <section key={section.id} className="py-20">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {displayTitle}
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                {displaySubtitle}
              </p>
            </div>
            <div className="text-center py-12 bg-muted/30 rounded-xl">
              <div className="text-6xl mb-4">🌸</div>
              <h3 className="text-xl font-semibold mb-2 text-muted-foreground">
                Categories Coming Soon
              </h3>
              <p className="text-muted-foreground">
                We're preparing beautiful categories for you to explore.
              </p>
            </div>
          </div>
        </section>
      );
    }

    return (
      <section key={section.id} className="py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {displayTitle}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {displaySubtitle}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {validCategories.map((category) => (
              <Link
                key={category.id}
                to={`/category/${category.slug}`}
                className="group"
              >
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105 overflow-hidden">
                  <div className="aspect-square bg-gradient-to-br from-rose/20 to-peach/20 flex items-center justify-center text-6xl">
                    {category.image_url ? (
                      <img
                        src={category.image_url}
                        alt={category.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                          const placeholder =
                            e.currentTarget.parentElement?.querySelector(
                              ".fallback-emoji",
                            );
                          if (placeholder) placeholder.style.display = "block";
                        }}
                      />
                    ) : null}
                    <span
                      className={`fallback-emoji animate-pulse ${category.image_url ? "hidden" : "block"}`}
                    >
                      🌸
                    </span>
                  </div>
                  <CardContent className="p-4 text-center">
                    <h3 className="font-semibold group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
    );
  }

  function renderProductCarousel(section: HomepageSection) {
    const content = section.content as any;
    const showCount = content?.show_count || 8;
    const displayTitle = section.title || "Bestselling Flowers";
    const displaySubtitle =
      section.subtitle ||
      "Handpicked fresh flowers loved by thousands of customers";

    console.log(
      "🎨 Product Carousel: Starting render with featuredProducts:",
      featuredProducts,
    );
    console.log("🎨 Product Carousel: Display count set to:", showCount);

    // Filter out any invalid products and limit display count
    const validProducts = featuredProducts
      .filter((product) => {
        const isValid =
          product &&
          product.id &&
          product.name &&
          product.slug &&
          product.price;

        if (!isValid) {
          console.warn(
            "❌ Product Carousel: Invalid product filtered out:",
            product,
          );
        }

        return isValid;
      })
      .slice(0, showCount);

    console.log(
      "✅ Product Carousel: Valid products to render:",
      validProducts,
    );
    console.log(
      "🏷️ Product Carousel: Product titles being rendered:",
      validProducts.map((p) => p.name),
    );
    console.log(
      "🖼️ Product Carousel: Image status for each product:",
      validProducts.map((p) => ({
        name: p.name,
        hasImages: p.images && Array.isArray(p.images) && p.images.length > 0,
        imageUrl: p.images?.[0] || "No image URL",
        imageCount: p.images?.length || 0,
      })),
    );

    if (validProducts.length === 0) {
      return (
        <section key={section.id} className="py-20 bg-muted/30">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {displayTitle}
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                {displaySubtitle}
              </p>
            </div>
            <div className="text-center py-12 bg-white rounded-xl shadow-lg">
              <div className="text-6xl mb-4">🌺</div>
              <h3 className="text-xl font-semibold mb-2 text-muted-foreground">
                Products Coming Soon
              </h3>
              <p className="text-muted-foreground mb-6">
                We're curating beautiful flowers for you to discover.
              </p>
              <Button asChild>
                <Link to="/products">Browse All Products</Link>
              </Button>
            </div>
          </div>
        </section>
      );
    }

    console.log(
      "��� Product Carousel: Rendering section with title:",
      displayTitle,
    );
    console.log(
      "🎨 Product Carousel: Will render",
      validProducts.length,
      "products",
    );

    return (
      <section key={section.id} className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {displayTitle}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {displaySubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {validProducts.map((product) => (
              <Link
                key={product.id}
                to={`/product/${product.slug}`}
                className="group"
              >
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105 overflow-hidden">
                  <div className="aspect-square bg-gradient-to-br from-cream to-peach/30 flex items-center justify-center relative overflow-hidden">
                    {(() => {
                      const hasValidImage =
                        product.images &&
                        Array.isArray(product.images) &&
                        product.images.length > 0 &&
                        product.images[0];

                      if (!hasValidImage) {
                        console.log(
                          `⚠️ Product "${product.name}" has no valid images:`,
                          product.images,
                        );
                      }

                      return hasValidImage ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover image-hover"
                          onLoad={() => {
                            console.log(
                              `✅ Product image loaded successfully for "${product.name}":`,
                              product.images[0],
                            );
                          }}
                          onError={(e) => {
                            console.error(
                              `❌ Product image failed to load for "${product.name}":`,
                              product.images[0],
                            );
                            e.currentTarget.style.display = "none";
                            const placeholder =
                              e.currentTarget.parentElement?.querySelector(
                                ".fallback-emoji",
                              );
                            if (placeholder) {
                              placeholder.style.display = "block";
                              placeholder.classList.remove("hidden");
                            }
                          }}
                        />
                      ) : null;
                    })()}
                    <span
                      className={`fallback-emoji text-6xl animate-pulse ${
                        product.images &&
                        Array.isArray(product.images) &&
                        product.images.length > 0 &&
                        product.images[0]
                          ? "hidden"
                          : "block"
                      }`}
                    >
                      🌺
                    </span>
                    {product.sale_price &&
                      product.sale_price < product.price && (
                        <Badge className="absolute top-2 left-2 bg-destructive text-destructive-foreground">
                          SALE
                        </Badge>
                      )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-4 h-4 fill-gold text-gold"
                          />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        (4.8)
                      </span>
                    </div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-primary">
                          ₹
                          {product.sale_price &&
                          product.sale_price < product.price
                            ? product.sale_price.toFixed(2)
                            : product.price.toFixed(2)}
                        </span>
                        {product.sale_price &&
                          product.sale_price < product.price && (
                            <span className="text-sm text-muted-foreground line-through">
                              ₹{product.price.toFixed(2)}
                            </span>
                          )}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      className="w-full"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        // Add to cart functionality here
                        console.log("Adding to cart:", product.name);
                      }}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Add to Cart
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button size="lg" asChild>
              <Link to="/products">
                View All Products
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    );
  }

  function renderTestimonials(section: HomepageSection) {
    const content = section.content as any;
    const testimonials = content?.testimonials || [
      {
        name: "Priya Sharma",
        location: "Mumbai",
        rating: 5,
        review:
          "Absolutely stunning flowers! Delivered fresh and on time. Made my anniversary perfect.",
        image: "",
      },
      {
        name: "Rajesh Kumar",
        location: "Delhi",
        rating: 5,
        review:
          "Best flower delivery service in India. Quality is amazing and customer service is excellent.",
        image: "",
      },
      {
        name: "Anita Patel",
        location: "Bangalore",
        rating: 5,
        review:
          "I've been ordering for years. Never disappointed! Fresh flowers every single time.",
        image: "",
      },
    ];

    return (
      <section key={section.id} className="py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What Our Customers Say
            </h2>
            {section.subtitle && (
              <p className="text-xl text-muted-foreground">
                {section.subtitle}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial: any, index: number) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-gold text-gold" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 italic">
                    "{testimonial.review}"
                  </p>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.location}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  function renderNewsletter(section: HomepageSection) {
    const content = section.content as any;

    return (
      <section key={section.id} className="py-20 bg-gradient-rose text-white">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {section.title || "Stay Blooming with Our Updates"}
          </h2>
          <p className="text-xl mb-8 text-rose-100 max-w-2xl mx-auto">
            {section.subtitle ||
              "Get exclusive offers, flower care tips, and be the first to know about new arrivals"}
          </p>
          <div className="flex gap-2 max-w-md mx-auto">
            <Input
              placeholder={content?.placeholder || "Enter your email"}
              className="bg-white/10 border-white/20 text-white placeholder:text-rose-100"
            />
            <Button variant="secondary" className="whitespace-nowrap">
              {content?.button_text || "Subscribe"}
            </Button>
          </div>
        </div>
      </section>
    );
  }

  console.log("Homepage: Rendering with sections:", sections);
  console.log("Homepage: Categories loaded:", categories);
  console.log("Homepage: Products loaded:", featuredProducts);

  return (
    <div className="min-h-screen">
      {sections.map((section) => renderSection(section))}

      {/* CTA Section - Always show at end */}
      <section className="py-20 bg-gradient-rose text-white">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Spread Joy?
          </h2>
          <p className="text-xl mb-8 text-rose-100 max-w-2xl mx-auto">
            Order now and let us deliver fresh, beautiful flowers to your loved
            ones
          </p>
          <Button
            size="lg"
            variant="secondary"
            className="text-lg px-8"
            asChild
          >
            <Link to="/products">
              Start Shopping
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
