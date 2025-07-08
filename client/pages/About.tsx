import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Truck,
  Clock,
  Phone,
  Gift,
  CreditCard,
  Star,
  Users,
  MapPin,
  Heart,
} from "lucide-react";

interface AboutPageData {
  id: string;
  title: string;
  content: string;
  meta_title?: string;
  meta_description?: string;
  is_active: boolean;
}

export default function About() {
  const [pageData, setPageData] = useState<AboutPageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAboutPage();
  }, []);

  async function fetchAboutPage() {
    try {
      const { data } = await supabase
        .from("pages")
        .select("*")
        .eq("slug", "about")
        .eq("is_active", true)
        .single();

      if (data) {
        setPageData(data);
      }
    } catch (error) {
      console.error("Failed to fetch about page:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    // Set default SEO or use data from database
    const title =
      pageData?.meta_title ||
      "About Florist in India – Premium Flower Delivery Across India";
    const description =
      pageData?.meta_description ||
      "Florist in India offers premium flowers, cakes, and gifts delivered across 100+ Indian cities with love, care, and speed. Learn more about our story.";

    document.title = title;

    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.setAttribute("name", "description");
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute("content", description);
  }, [pageData]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="h-12 bg-gray-200 rounded animate-pulse w-96 mx-auto"></div>
            <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="h-48 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-48 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If page data exists from database, use it
  if (pageData && pageData.content) {
    // Handle different content formats
    let htmlContent = "";

    if (typeof pageData.content === "string") {
      // If content is already a string, use it directly
      htmlContent = pageData.content;
    } else if (typeof pageData.content === "object") {
      // If content is an object (JSONB), try to extract HTML
      htmlContent =
        pageData.content.body ||
        pageData.content.html ||
        pageData.content.content ||
        JSON.stringify(pageData.content); // fallback to string representation
    }

    return (
      <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            {htmlContent && htmlContent !== "[object Object]" ? (
              <div
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: htmlContent }}
              />
            ) : (
              <div className="text-center py-12">
                <h1 className="text-3xl font-bold mb-4">About Us</h1>
                <p className="text-lg text-gray-600">
                  Content is being loaded. Please edit the About page in the
                  Admin Panel to add content.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Fallback content if no database content exists
  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-rose-500 to-pink-600 text-white py-20">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            About Florist in India
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90">
            Your trusted destination for premium flowers, cakes, and gifts
            delivered across India with love and care.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-6xl space-y-16">
        {/* Who We Are */}
        <section className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8">
            Who We Are
          </h2>
          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              Florist in India is your trusted destination for premium flower,
              cake, and gift delivery services across India. With a strong
              presence in over 100+ cities including Delhi NCR, Mumbai,
              Bangalore, and Jalandhar, we ensure every celebration feels
              special—no matter the distance.
            </p>
            <div className="flex justify-center items-center gap-8 flex-wrap">
              <div className="text-center">
                <div className="text-3xl font-bold text-rose-500">100+</div>
                <div className="text-gray-600">Cities Covered</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-rose-500">20,000+</div>
                <div className="text-gray-600">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-rose-500">4.8★</div>
                <div className="text-gray-600">Average Rating</div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-12 text-center">
            Why Choose Us
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-rose-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Clock className="h-8 w-8 text-rose-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Same Day Delivery</h3>
              <p className="text-gray-600">
                Express delivery for your urgent celebrations
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-rose-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <MapPin className="h-8 w-8 text-rose-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">
                100+ Cities Covered
              </h3>
              <p className="text-gray-600">Nationwide presence across India</p>
            </div>

            <div className="text-center p-6">
              <div className="bg-rose-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Phone className="h-8 w-8 text-rose-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">24/7 Support</h3>
              <p className="text-gray-600">
                Round-the-clock customer assistance
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-rose-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Gift className="h-8 w-8 text-rose-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Custom Gift Combos</h3>
              <p className="text-gray-600">
                Personalized gifts for every occasion
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-rose-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <CreditCard className="h-8 w-8 text-rose-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Secure Payments</h3>
              <p className="text-gray-600">
                Safe and encrypted payment options
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-rose-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Heart className="h-8 w-8 text-rose-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Fresh Flowers</h3>
              <p className="text-gray-600">Handpicked fresh blooms daily</p>
            </div>
          </div>
        </section>

        {/* Our Mission */}
        <section className="text-center bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-2xl p-8 md:p-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">Our Mission</h2>
          <p className="text-xl leading-relaxed max-w-4xl mx-auto">
            We aim to connect emotions through fresh blooms. Whether it's a
            birthday, anniversary, wedding, or a simple "thinking of you"—we
            help you say it beautifully. Our mission is to spread joy, love, and
            happiness through the universal language of flowers.
          </p>
        </section>

        {/* Customer Love & Trust */}
        <section>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-12 text-center">
            Customer Love & Trust
          </h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="bg-yellow-100 rounded-full p-3">
                    <Star className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-lg">
                      4.8+ Star Reviews
                    </div>
                    <div className="text-gray-600">
                      Consistently rated excellent by customers
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="bg-blue-100 rounded-full p-3">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-lg">
                      20,000+ Happy Customers
                    </div>
                    <div className="text-gray-600">
                      Trusted by families across India
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="bg-green-100 rounded-full p-3">
                    <Truck className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-lg">
                      99% On-Time Delivery
                    </div>
                    <div className="text-gray-600">
                      Reliable and punctual service
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Card className="p-6">
              <CardContent className="p-0">
                <blockquote className="text-lg italic text-gray-700 mb-4">
                  "Florist in India made my anniversary extra special! The
                  flowers were fresh, beautiful, and delivered right on time.
                  Highly recommended!"
                </blockquote>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-rose-500 rounded-full flex items-center justify-center text-white font-semibold">
                    S
                  </div>
                  <div>
                    <div className="font-semibold">Shreya Patel</div>
                    <div className="text-sm text-gray-600">Mumbai</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Nationwide Delivery */}
        <section className="bg-gray-50 rounded-2xl p-8 md:p-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8 text-center">
            Delivered Across India
          </h2>
          <p className="text-center text-lg text-gray-600 mb-8">
            We proudly serve customers in major cities and towns across India
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 text-center">
            {[
              "Delhi NCR",
              "Mumbai",
              "Bangalore",
              "Pune",
              "Hyderabad",
              "Chennai",
              "Kolkata",
              "Ahmedabad",
              "Jalandhar",
              "Chandigarh",
              "Lucknow",
              "Jaipur",
              "Indore",
              "Bhopal",
              "Nagpur",
              "Surat",
              "Vadodara",
              "Agra",
            ].map((city) => (
              <Badge key={city} variant="outline" className="p-3 text-sm">
                {city}
              </Badge>
            ))}
          </div>

          <div className="text-center mt-8">
            <p className="text-lg font-semibold text-gray-700">
              ...and 100+ more locations!
            </p>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <div className="bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-2xl p-8 md:p-12">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Spread Some Joy?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Browse our collection and send love to your dear ones today!
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <a
                href="/products"
                className="bg-white text-rose-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
              >
                Shop Flowers
              </a>
              <a
                href="/contact"
                className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-rose-600 transition-colors"
              >
                Contact Us
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
