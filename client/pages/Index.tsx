import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Truck,
  Shield,
  HeartHandshake,
  ShoppingCart,
} from "lucide-react";
import { StarRating } from "@/components/ui/star-rating";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import { useCart } from "@/hooks/useCart";
import { toast } from "@/hooks/use-toast";
import { HeroCarousel } from "@/components/HeroCarousel";
import {
  ProductCategory,
  Product,
  ProductVariant,
  HomepageSection,
} from "@/types/database.types";
import { getProductEffectivePriceSync } from "@/lib/productUtils";

interface ProductWithVariants extends Product {
  variants?: ProductVariant[];
}

export default function Index() {
  const [sections, setSections] = useState<HomepageSection[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<
    ProductWithVariants[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addItem } = useCart();

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
      // Add empty variants array for fallback products
      setFeaturedProducts(fallbackData.map((p) => ({ ...p, variants: [] })));
    } else {
      console.warn("⚠️ No fallback products found either");
      setFeaturedProducts([]);
    }
  }

  function handleAddToCart(product: ProductWithVariants, e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    try {
      addItem({
        product_id: product.id,
        product: product, // Include full product data
        variant_id: null, // No variant selected from product showcase
        quantity: 1,
      });

      console.log("✅ Successfully added to cart:", product.name);

      // Show success notification
      toast({
        title: "Added to cart!",
        description: `${product.name} has been added to your cart.`,
        variant: "default",
      });
    } catch (error) {
      console.error("�� Failed to add to cart:", error);

      // Show error notification
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      });
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

          console.log(
            "������ Product Showcase: Raw query results:",
            productsData,
          );
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
              .map((id: string) => {
                const product = productsData.find((prod) => prod.id === id);
                if (!product) {
                  console.warn(
                    "⚠️ Product Showcase: Product not found for ID:",
                    id,
                  );
                }
                return product;
              })
              .filter((product) => {
                if (!product) {
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
              // Always add variants data to all products
              try {
                // Get all product IDs
                const allProductIds = sortedProducts.map((p) => p.id);

                // Fetch variants for all products (whether they have variations or not)
                const { data: allVariants, error: variantsError } = await supabase
                  .from("product_variants")
                  .select("*")
                  .in("product_id", allProductIds)
                  .eq("is_active", true)
                  .order("sort_order", { ascending: true })
                  .order("display_order", { ascending: true });

                if (variantsError) {
                  console.warn("Error fetching variants:", variantsError);
                }

                // Group variants by product_id
                const variantsByProduct = (allVariants || []).reduce(
                  (acc, variant) => {
                    if (!acc[variant.product_id]) {
                      acc[variant.product_id] = [];
                    }
                    acc[variant.product_id].push(variant);
                    return acc;
                  },
                  {} as Record<string, ProductVariant[]>,
                );

                // Add variants to all products
                const productsWithVariants = sortedProducts.map((product) => ({
                  ...product,
                  variants: variantsByProduct[product.id] || [],
                }));

                setFeaturedProducts(productsWithVariants);
              } catch (variantError) {
                console.warn("Error processing variants:", variantError);
                // Fallback: add empty variants array
                setFeaturedProducts(
                  sortedProducts.map((p) => ({ ...p, variants: [] })),
                );
              }
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
      case "hero_carousel":
        return renderHeroCarousel(section);
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

    // Check if this is a carousel hero section
    if (content?.carousel_mode && content?.images?.length > 0) {
      return renderHeroCarousel(section);
    }

    return (
      <section
        className="relative min-h-[450px] md:min-h-[500px] overflow-hidden"
        style={{
          backgroundImage: content?.background_image
            ? `url(${content.background_image})`
            : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Fallback gradient if no background image */}
        {!content?.background_image && (
          <div className="absolute inset-0 bg-gradient-rose" />
        )}

        {/* Modern diagonal overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/40 to-transparent" />

        <div className="container relative z-20 h-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[450px] md:min-h-[500px]">
            {/* Content Section - Left Side */}
            <div className="space-y-8 text-white py-16 lg:py-0">
              {/* Badge/Subtitle */}
              {section.subtitle && (
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/15 backdrop-blur-md rounded-full border border-white/30 animate-entrance">
                  <div className="w-2 h-2 bg-peach rounded-full animate-pulse" />
                  <span className="text-sm font-medium text-peach uppercase tracking-wide">
                    {section.subtitle}
                  </span>
                </div>
              )}

              {/* Main Heading */}
              <h1
                className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.1] animate-entrance"
                style={{ animationDelay: "0.2s" }}
              >
                {section.title || "Fresh Flowers"}
              </h1>

              {/* Description */}
              {content?.description && (
                <p
                  className="text-lg md:text-xl text-gray-200 leading-relaxed max-w-lg animate-entrance"
                  style={{ animationDelay: "0.4s" }}
                >
                  {content.description}
                </p>
              )}

              {/* CTA Buttons */}
              <div
                className="flex flex-col sm:flex-row gap-4 animate-entrance"
                style={{ animationDelay: "0.6s" }}
              >
                <Button
                  size="lg"
                  className="bg-white text-primary hover:bg-gray-100 text-lg px-10 py-4 h-auto font-bold shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 rounded-full"
                  asChild
                >
                  <Link to={content?.button_link || "/products"}>
                    {content?.button_text || "Shop Now"}
                    <ArrowRight className="ml-3 w-5 h-5" />
                  </Link>
                </Button>

                {content?.secondary_button_text && (
                  <Button
                    size="lg"
                    variant="ghost"
                    className="border-2 border-white/70 text-white hover:bg-white hover:text-primary text-lg px-10 py-4 h-auto font-bold backdrop-blur-sm transition-all duration-300 hover:scale-105 rounded-full"
                    asChild
                  >
                    <Link to={content?.secondary_button_link || "/products"}>
                      {content.secondary_button_text}
                    </Link>
                  </Button>
                )}
              </div>

              {/* Trust Indicators */}
              {(content?.feature_1 || content?.feature_2) && (
                <div
                  className="flex items-center gap-6 pt-4 animate-entrance"
                  style={{ animationDelay: "0.8s" }}
                >
                  {content?.feature_1 && (
                    <div className="flex items-center gap-2 text-sm text-white/80">
                      <Truck className="w-4 h-4" />
                      {content.feature_1}
                    </div>
                  )}
                  {content?.feature_1 && content?.feature_2 && (
                    <div className="w-px h-4 bg-white/30" />
                  )}
                  {content?.feature_2 && (
                    <div className="flex items-center gap-2 text-sm text-white/80">
                      <Shield className="w-4 h-4" />
                      {content.feature_2}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Visual Section - Right Side */}
            <div className="relative hidden lg:flex items-center justify-center">
              <div className="relative w-96 h-96">
                {/* Main floating card */}
                <div className="absolute inset-0 bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl animate-gentle-float">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-3xl" />

                  {/* Content inside card */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center space-y-4 p-8">
                      <div className="w-20 h-20 mx-auto rounded-full bg-white/20 flex items-center justify-center text-4xl">
                        {content?.feature_box_emoji || "🌺"}
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-white font-semibold text-lg">
                          {content?.feature_box_title || "Premium Quality"}
                        </h3>
                        <p className="text-white/70 text-sm">
                          {content?.feature_box_description ||
                            "Hand-picked fresh flowers"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating decorative elements */}
                <div className="absolute -inset-20">
                  {content?.floating_emoji_1 && (
                    <div
                      className="absolute top-8 right-4 w-16 h-16 bg-white/15 backdrop-blur-xl rounded-2xl border border-white/30 flex items-center justify-center shadow-xl animate-float"
                      style={{ animationDelay: "0s", animationDuration: "6s" }}
                    >
                      <span className="text-2xl">
                        {content.floating_emoji_1}
                      </span>
                    </div>
                  )}

                  {content?.floating_emoji_2 && (
                    <div
                      className="absolute bottom-12 left-8 w-20 h-20 bg-white/15 backdrop-blur-xl rounded-2xl border border-white/30 flex items-center justify-center shadow-xl animate-float"
                      style={{ animationDelay: "2s", animationDuration: "8s" }}
                    >
                      <span className="text-3xl">
                        {content.floating_emoji_2}
                      </span>
                    </div>
                  )}

                  {content?.floating_emoji_3 && (
                    <div
                      className="absolute top-20 left-4 w-12 h-12 bg-white/15 backdrop-blur-xl rounded-xl border border-white/30 flex items-center justify-center shadow-xl animate-float"
                      style={{ animationDelay: "4s", animationDuration: "10s" }}
                    >
                      <span className="text-xl">
                        {content.floating_emoji_3}
                      </span>
                    </div>
                  )}

                  {content?.floating_emoji_4 && (
                    <div
                      className="absolute bottom-4 right-16 w-14 h-14 bg-white/15 backdrop-blur-xl rounded-xl border border-white/30 flex items-center justify-center shadow-xl animate-float"
                      style={{ animationDelay: "1s", animationDuration: "7s" }}
                    >
                      <span className="text-2xl">
                        {content.floating_emoji_4}
                      </span>
                    </div>
                  )}
                </div>

                {/* Background glow effects */}
                <div className="absolute inset-0 bg-white/5 rounded-full blur-3xl animate-glow-pulse" />
                <div
                  className="absolute inset-8 bg-rose-300/10 rounded-full blur-2xl animate-glow-pulse"
                  style={{ animationDelay: "2s" }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  function renderHeroCarousel(section: HomepageSection) {
    const content = section.content as any;

    if (!content?.images || content.images.length === 0) {
      return null;
    }

    // Filter out empty strings
    const validImages = content.images.filter(
      (img: string) => img && img.trim() !== "",
    );

    if (validImages.length === 0) {
      return null;
    }

    return (
      <section className="w-full">
        <HeroCarousel
          images={validImages}
          autoplay={content.autoplay !== false}
          autoplayDelay={content.autoplay_delay || 5000}
          showNavigation={content.show_navigation !== false}
          showDots={content.show_dots !== false}
          height={content.height || 500}
        />
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
      <section className="py-16 bg-cream/30">
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

    // Only use title/subtitle if they exist and are not empty
    const hasTitle = section.title && section.title.trim() !== "";
    const hasSubtitle = section.subtitle && section.subtitle.trim() !== "";
    const hasAnyText = hasTitle || hasSubtitle;

    // Filter out any invalid categories and limit display count
    const validCategories = categories
      .filter(
        (category) => category && category.id && category.name && category.slug,
      )
      .slice(0, showCount);

    if (validCategories.length === 0) {
      return (
        <section className={`${hasAnyText ? "py-20" : "py-8"}`}>
          <div className="container">
            {hasAnyText && (
              <div className="text-center mb-12">
                {hasTitle && (
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    {section.title}
                  </h2>
                )}
                {hasSubtitle && (
                  <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    {section.subtitle}
                  </p>
                )}
              </div>
            )}
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
      <section className={`${hasAnyText ? "py-20" : "py-8"}`}>
        <div className="container">
          {hasAnyText && (
            <div className="text-center mb-12">
              {hasTitle && (
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  {section.title}
                </h2>
              )}
              {hasSubtitle && (
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  {section.subtitle}
                </p>
              )}
            </div>
          )}

          <div className="flex justify-center">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 max-w-6xl">
              {validCategories.map((category) => (
                <Link
                  key={category.id}
                  to={`/category/${category.slug}`}
                  className="group"
                >
                  <Card className="border-0 shadow-lg overflow-hidden h-full">
                    <div className="aspect-square bg-gradient-to-br from-rose/20 to-peach/20 flex items-center justify-center text-4xl">
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
                            if (placeholder)
                              (placeholder as HTMLElement).style.display =
                                "block";
                          }}
                        />
                      ) : null}
                      <span
                        className={`fallback-emoji animate-pulse ${category.image_url ? "hidden" : "block"}`}
                      >
                        🌸
                      </span>
                    </div>
                    <CardContent className="p-3 text-center">
                      <h3 className="text-sm font-semibold leading-tight">
                        {category.name}
                      </h3>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
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
        <section className="py-20 bg-muted/30">
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
      <section className="py-20 bg-muted/30">
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
                <Card className="border-0 shadow-lg overflow-hidden">
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
                              (placeholder as HTMLElement).style.display =
                                "block";
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
                    {(() => {
                      const effectivePrice = getProductEffectivePriceSync(
                        product,
                        product.variants,
                      );
                      const hasDiscount =
                        effectivePrice.salePrice &&
                        effectivePrice.salePrice < effectivePrice.price;

                      return (
                        hasDiscount && (
                          <Badge className="absolute top-2 left-2 bg-destructive text-destructive-foreground">
                            SALE
                          </Badge>
                        )
                      );
                    })()}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2 line-clamp-2">
                      {product.name}
                    </h3>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {(() => {
                          const effectivePrice = getProductEffectivePriceSync(
                            product,
                            product.variants,
                          );
                          const displayPrice =
                            effectivePrice.salePrice || effectivePrice.price;
                          const hasDiscount =
                            effectivePrice.salePrice &&
                            effectivePrice.salePrice < effectivePrice.price;

                          // Debug logging
                          console.log(`🔍 Pricing for ${product.name}:`, {
                            has_variations: product.has_variations,
                            variants_count: product.variants?.length || 0,
                            base_price: product.price,
                            base_sale_price: product.sale_price,
                            effective_price: effectivePrice.price,
                            effective_sale_price: effectivePrice.salePrice,
                            display_price: displayPrice,
                            has_discount: hasDiscount
                          });

                          return (
                            <>
                              <span className="text-lg font-bold text-primary">
                                ₹{displayPrice.toFixed(2)}
                              </span>
                              {hasDiscount && (
                                <span className="text-sm text-muted-foreground line-through">
                                  ₹{effectivePrice.price.toFixed(2)}
                                </span>
                              )}
                            </>
                          );
                        })()}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      className="w-full"
                      onClick={(e) => handleAddToCart(product, e)}
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
      <section className="py-20">
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
                  <div className="mb-4">
                    <StarRating rating={testimonial.rating || 5} size="md" />
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
      <section className="py-20 bg-gradient-rose text-white">
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
      {sections.map((section) => (
        <div key={section.id}>{renderSection(section)}</div>
      ))}

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
