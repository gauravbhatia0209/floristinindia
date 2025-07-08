import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Star, Truck, Shield, HeartHandshake } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
      // Fetch homepage sections
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
        .order("sort_order")
        .limit(8);

      // Fetch featured products
      const { data: productsData } = await supabase
        .from("products")
        .select("*")
        .eq("is_active", true)
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

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-rose text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container relative py-24 lg:py-32">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Fresh Flowers
              <br />
              <span className="text-peach">Delivered Daily</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-rose-100">
              Experience the joy of premium flower delivery across India.
              Same-day delivery available in 100+ cities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" variant="secondary" className="text-lg px-8">
                Shop Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 border-white text-white hover:bg-white hover:text-primary"
              >
                Explore Collections
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

      {/* Features Section */}
      <section className="py-16 bg-cream/30">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-rose rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Same Day Delivery</h3>
              <p className="text-muted-foreground">
                Order before 2 PM and get fresh flowers delivered the same day
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-lavender rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Fresh Guarantee</h3>
              <p className="text-muted-foreground">
                100% fresh flowers guaranteed or your money back
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-sunset rounded-full flex items-center justify-center mx-auto mb-4">
                <HeartHandshake className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
              <p className="text-muted-foreground">
                Our customer care team is always here to help you
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Shop by <span className="text-gradient-rose">Occasion</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Find the perfect flowers for every special moment in life
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category) => (
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

      {/* Featured Products */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Bestselling <span className="text-gradient-rose">Flowers</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Handpicked fresh flowers loved by thousands of customers
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.slice(0, 8).map((product) => (
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

      {/* Testimonials */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What Our <span className="text-gradient-rose">Customers Say</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Priya Sharma",
                city: "Mumbai",
                review:
                  "Absolutely stunning flowers! Delivered fresh and on time. Made my anniversary perfect.",
                rating: 5,
              },
              {
                name: "Rajesh Kumar",
                city: "Delhi",
                review:
                  "Best flower delivery service in India. Quality is amazing and customer service is excellent.",
                rating: 5,
              },
              {
                name: "Anita Patel",
                city: "Bangalore",
                review:
                  "I've been ordering for years. Never disappointed! Fresh flowers every single time.",
                rating: 5,
              },
            ].map((testimonial, index) => (
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
                      {testimonial.city}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-rose text-white">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Spread Joy?
          </h2>
          <p className="text-xl mb-8 text-rose-100 max-w-2xl mx-auto">
            Order now and let us deliver fresh, beautiful flowers to your loved
            ones
          </p>
          <Button size="lg" variant="secondary" className="text-lg px-8">
            Start Shopping
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>
    </div>
  );
}
