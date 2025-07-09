import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Star, Truck, Shield, HeartHandshake } from "lucide-react";
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

  async function fetchHomepageData() {
    try {
      // Fetch active homepage sections in order
      const { data: sectionsData, error: sectionsError } = await supabase
        .from("homepage_sections")
        .select("*")
        .eq("is_active", true)
        .order("sort_order");

      if (sectionsError) {
        console.error("Homepage: Error fetching sections:", sectionsError);
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

        console.log("Homepage: Category section found:", categorySection);
        console.log("Homepage: Product section found:", productSection);

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
            "🎯 Product Showcase: Admin-selected product IDs:",
            selectedProductIds,
          );
          console.log(
            "🎯 Product Showcase: Fetching products with query - product.id IN",
            selectedProductIds,
          );

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
              is_active,
              product_categories(name)
            `,
            )
            .in("id", selectedProductIds)
            .eq("is_active", true);

          console.log("🎯 Product Showcase: Raw query results:", productsData);
          console.log(
            "🎯 Product Showcase: Query error (if any):",
            productsError,
          );

          if (productsError) {
            console.error(
              "🚨 Product Showcase: Database error:",
              productsError,
            );
          }

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

            setFeaturedProducts(sortedProducts);
          } else {
            console.warn(
              "⚠️ Product Showcase: No products found for selected IDs, using fallback",
            );
            // If selected products not found, fall back to featured
            const { data: fallbackData } = await supabase
              .from("products")
              .select(
                `
                id,
                name,
                slug,
                price,
                sale_price,
                images,
                is_active,
                product_categories(name)
              `,
              )
              .eq("is_active", true)
              .eq("is_featured", true)
              .limit(8);

            if (fallbackData) {
              console.log(
                "🔄 Product Showcase: Using fallback featured products:",
                fallbackData,
              );
              setFeaturedProducts(fallbackData);
            }
          }
        } else {
          console.log(
            "🔄 Product Showcase: No admin-selected products, using fallback featured products",
          );
          // Fallback to featured products if none selected by admin
          const { data: productsData, error: fallbackError } = await supabase
            .from("products")
            .select(
              `
              id,
              name,
              slug,
              price,
              sale_price,
              images,
              is_active,
              product_categories(name)
            `,
            )
            .eq("is_active", true)
            .eq("is_featured", true)
            .limit(8);

          if (fallbackError) {
            console.error(
              "🚨 Product Showcase: Fallback query error:",
              fallbackError,
            );
          }

          if (productsData) {
            console.log(
              "✅ Product Showcase: Loaded fallback featured products:",
              productsData,
            );
            console.log(
              "📝 Product Showcase: Fallback product titles:",
              productsData.map((p) => p.name),
            );
            setFeaturedProducts(productsData);
          }
        }
      }
    } catch (error) {
      console.error("Failed to fetch homepage data:", error);
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
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              {section.title || "Fresh Flowers"}
              <br />
              <span className="text-peach">
                {section.subtitle || "Delivered Daily"}
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-rose-100">
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

        {/* Floating Flowers Animation */}
        <div className="absolute top-10 right-10 text-6xl animate-float opacity-20">
          🌸
        </div>
        <div
          className="absolute top-32 right-32 text-4xl animate-float opacity-30"
          style={{ animationDelay: "2s" }}
        >
          🌺
        </div>
        <div
          className="absolute bottom-20 right-20 text-5xl animate-float opacity-25"
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
      "🎨 Product Carousel: Rendering section with title:",
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
                            ��{product.price.toFixed(2)}
                          </span>
                        )}
                    </div>
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
