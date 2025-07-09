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
      const { data: sectionsData } = await supabase
        .from("homepage_sections")
        .select("*")
        .eq("is_active", true)
        .order("sort_order");

      // Fetch categories for category grid
      const { data: categoriesData } = await supabase
        .from("product_categories")
        .select("*")
        .eq("is_active", true)
        .eq("show_in_menu", true)
        .order("sort_order")
        .limit(8);

      // Fetch featured products
      const { data: productsData } = await supabase
        .from("products")
        .select("*, product_categories(name)")
        .eq("is_active", true)
        .eq("is_featured", true)
        .limit(12);

      if (sectionsData) setSections(sectionsData);
      if (categoriesData) setCategories(categoriesData);
      if (productsData) setFeaturedProducts(productsData);
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

    return (
      <section key={section.id} className="py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Shop by Occasion
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {section.subtitle ||
                "Find the perfect flowers for every special moment in life"}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.slice(0, showCount).map((category) => (
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
                      />
                    ) : (
                      <span className="animate-pulse">🌸</span>
                    )}
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

    return (
      <section key={section.id} className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Bestselling Flowers
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {section.subtitle ||
                "Handpicked fresh flowers loved by thousands of customers"}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.slice(0, showCount).map((product) => (
              <Link
                key={product.id}
                to={`/product/${product.slug}`}
                className="group"
              >
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105 overflow-hidden">
                  <div className="aspect-square bg-gradient-to-br from-cream to-peach/30 flex items-center justify-center relative overflow-hidden">
                    {product.images.length > 0 ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover image-hover"
                      />
                    ) : (
                      <span className="text-6xl animate-pulse">🌺</span>
                    )}
                    {product.sale_price && (
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
                        ₹{product.sale_price || product.price}
                      </span>
                      {product.sale_price && (
                        <span className="text-sm text-muted-foreground line-through">
                          ₹{product.price}
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
