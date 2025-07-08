import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Heart,
  Award,
  Globe,
  Clock,
  Shield,
  Truck,
  Phone,
  Star,
  MapPin,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

interface AboutPageData {
  id: string;
  title: string;
  content: any;
  meta_title?: string;
  meta_description?: string;
  is_active: boolean;
}

export default function AboutUsPage() {
  const [pageData, setPageData] = useState<AboutPageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAboutPage();

    // Fallback timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      if (isLoading) {
        console.warn("AboutUsPage: Fetch timeout, showing default content");
        setIsLoading(false);
        setPageData(null);
      }
    }, 10000); // 10 second timeout

    return () => clearTimeout(timeout);
  }, [isLoading]);

  async function fetchAboutPage() {
    try {
      console.log("AboutUsPage: Fetching about page data...");
      const { data, error } = await supabase
        .from("pages")
        .select("*")
        .eq("slug", "about")
        .eq("is_active", true)
        .single();

      console.log("AboutUsPage: Query result:", { data, error });

      if (error && error.code === "PGRST116") {
        // No data found, create default record
        console.log("AboutUsPage: No data found, creating default page...");
        await createDefaultAboutPage();
      } else if (error) {
        console.error("AboutUsPage: Database error:", error);
        // Continue with fallback content instead of failing
        setPageData(null);
      } else if (data) {
        console.log("AboutUsPage: Setting page data:", data);
        setPageData(data);
      }
    } catch (error) {
      console.error("AboutUsPage: Failed to fetch about page:", error);
      // Set pageData to null so component renders with default content
      setPageData(null);
    } finally {
      console.log("AboutUsPage: Setting loading to false");
      setIsLoading(false);
    }
  }

  async function createDefaultAboutPage() {
    try {
      const defaultContent = {
        blocks: [
          {
            type: "hero_title",
            content: "About Florist in India",
          },
          {
            type: "hero_description",
            content:
              "Your trusted destination for premium flowers, cakes, and gifts delivered across India with love and care.",
          },
          {
            type: "story_section",
            title: "Our Story",
            content:
              "Founded with a passion for bringing people closer through beautiful flowers, Florist in India has been serving customers across the nation with fresh, premium quality flowers and thoughtful gifts. We believe every occasion deserves to be celebrated with the perfect floral arrangement.",
          },
          {
            type: "mission_section",
            title: "Our Mission",
            content:
              "To make every celebration special by delivering fresh, beautiful flowers and gifts that express your emotions perfectly. We strive to connect hearts and spread joy through our carefully curated floral arrangements.",
          },
          {
            type: "contact_info",
            phone: "+91 98765 43210",
            email: "care@floristinindia.com",
          },
        ],
      };

      const { data, error } = await supabase
        .from("pages")
        .insert({
          title: "About Florist in India",
          slug: "about",
          content: defaultContent,
          meta_title: "About Florist in India – Premium Flower Delivery",
          meta_description:
            "Learn about Florist in India, your trusted partner for fresh flower delivery across 100+ Indian cities.",
          is_active: true,
          show_in_footer: true,
          sort_order: 1,
        })
        .select()
        .single();

      if (data && !error) {
        setPageData(data);
      }
    } catch (error) {
      console.error("Failed to create default about page:", error);
    }
  }

  // Set SEO meta tags
  useEffect(() => {
    const title =
      pageData?.meta_title ||
      "About Florist in India – Premium Flower Delivery";
    const description =
      pageData?.meta_description ||
      "Learn about Florist in India, your trusted partner for fresh flower delivery across 100+ Indian cities.";

    document.title = title;

    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.setAttribute("name", "description");
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute("content", description);
  }, [pageData]);

  const renderContentBlocks = (content: any) => {
    if (!content || !content.blocks || !Array.isArray(content.blocks)) {
      return <DefaultAboutContent />;
    }

    return content.blocks.map((block: any, index: number) => {
      switch (block.type) {
        case "heading":
          return (
            <h2
              key={index}
              className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 text-center"
            >
              {typeof block.content === "string" ? block.content : ""}
            </h2>
          );
        case "text":
        case "paragraph":
          const textContent =
            typeof block.content === "string" ? block.content : "";
          return (
            <div key={index} className="prose prose-lg max-w-none mb-8">
              <p className="text-lg text-gray-600 leading-relaxed text-center">
                {textContent.split("\\n").map((line: string, i: number) => (
                  <span key={i}>
                    {line}
                    {i < textContent.split("\\n").length - 1 && <br />}
                  </span>
                ))}
              </p>
            </div>
          );
        default:
          return null;
      }
    });
  };

  console.log("AboutUsPage: Rendering with state:", {
    isLoading,
    pageData: !!pageData,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="h-16 bg-gray-200 rounded animate-pulse w-96 mx-auto"></div>
            <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
            <div className="grid md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-48 bg-gray-200 rounded animate-pulse"
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white">
      {/* Hero Banner */}
      <div className="relative bg-gradient-to-r from-rose-500 via-pink-500 to-red-500 text-white py-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black opacity-20"></div>
          <div className="absolute top-10 left-10 w-20 h-20 bg-white opacity-10 rounded-full"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-white opacity-10 rounded-full"></div>
          <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-white opacity-10 rounded-full"></div>
        </div>
        <div className="relative container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
            {pageData?.content?.blocks?.find(
              (b: any) => b.type === "hero_title",
            )?.content ||
              pageData?.title ||
              "About Florist in India"}
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90 leading-relaxed">
            {pageData?.content?.blocks?.find(
              (b: any) => b.type === "hero_description",
            )?.content ||
              "Your trusted destination for premium flowers, cakes, and gifts delivered across India with love and care."}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-6xl">
        {/* Database Content or Default */}
        {pageData?.content ? (
          <div className="space-y-16">
            {renderContentBlocks(pageData.content)}
          </div>
        ) : (
          <DefaultAboutContent />
        )}

        {/* Why Choose Us - Enhanced UI */}
        <section className="mt-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              Why Choose Florist in India?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We're committed to delivering not just flowers, but moments of joy
              and memories that last forever.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Clock className="h-8 w-8 text-rose-600" />,
                title: "Same Day Delivery",
                description:
                  "Express delivery for your urgent celebrations across 100+ cities",
              },
              {
                icon: <Shield className="h-8 w-8 text-rose-600" />,
                title: "Quality Guarantee",
                description:
                  "Fresh flowers sourced daily with 100% quality assurance",
              },
              {
                icon: <Phone className="h-8 w-8 text-rose-600" />,
                title: "24/7 Support",
                description:
                  "Round-the-clock customer support for all your queries",
              },
              {
                icon: <Truck className="h-8 w-8 text-rose-600" />,
                title: "PAN India Coverage",
                description: "Delivering happiness to 100+ cities across India",
              },
              {
                icon: <Heart className="h-8 w-8 text-rose-600" />,
                title: "Custom Arrangements",
                description:
                  "Personalized flower arrangements for every special occasion",
              },
              {
                icon: <Award className="h-8 w-8 text-rose-600" />,
                title: "Trusted Brand",
                description:
                  "4.8+ star rating from 20,000+ satisfied customers",
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg"
              >
                <CardContent className="p-8 text-center">
                  <div className="bg-rose-100 rounded-full p-4 w-16 h-16 mx-auto mb-6 group-hover:bg-rose-200 transition-colors">
                    {feature.icon}
                  </div>
                  <h3 className="font-bold text-xl mb-4 text-gray-800">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Statistics Section */}
        <section className="mt-20 bg-gradient-to-r from-rose-500 to-pink-600 rounded-3xl p-12 text-white">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Impact in Numbers</h2>
            <p className="text-xl opacity-90">
              Spreading joy across India, one flower at a time
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: "100+", label: "Cities Covered" },
              { number: "20K+", label: "Happy Customers" },
              { number: "4.8★", label: "Average Rating" },
              { number: "24/7", label: "Customer Support" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold mb-2">
                  {stat.number}
                </div>
                <div className="text-lg opacity-90">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Customer Testimonial */}
        <section className="mt-20">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-12">
              What Our Customers Say
            </h2>

            <Card className="border-0 shadow-2xl">
              <CardContent className="p-12">
                <div className="flex justify-center mb-6">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="h-6 w-6 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <blockquote className="text-xl text-gray-700 mb-8 leading-relaxed italic">
                  "Florist in India made my anniversary extra special! The
                  flowers were incredibly fresh, beautifully arranged, and
                  delivered exactly on time. The quality exceeded my
                  expectations, and my wife was absolutely delighted. Highly
                  recommended!"
                </blockquote>
                <div className="flex items-center justify-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-rose-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    R
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-gray-800">
                      Rahul Sharma
                    </div>
                    <div className="text-sm text-gray-600">
                      Mumbai, Maharashtra
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Coverage Map */}
        <section className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              <MapPin className="inline h-8 w-8 text-rose-600 mr-3" />
              Delivered Across India
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We proudly serve customers in major cities and towns across India
            </p>
          </div>

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
              <Badge
                key={city}
                variant="outline"
                className="p-3 text-sm border-rose-200 hover:bg-rose-50 transition-colors"
              >
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
      </div>
    </div>
  );
}

// Default content component when no database content is available
function DefaultAboutContent() {
  return (
    <div className="space-y-16">
      <section className="text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8">
          Who We Are
        </h2>
        <div className="max-w-4xl mx-auto">
          <p className="text-lg text-gray-600 leading-relaxed mb-8">
            Florist in India is your premier destination for fresh flower
            delivery services across India. With over 5 years of experience in
            the floral industry, we have built a reputation for excellence,
            reliability, and customer satisfaction. Our journey began with a
            simple mission: to spread joy and love through the beauty of fresh
            flowers.
          </p>
        </div>
      </section>

      <section className="text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8">
          Our Mission
        </h2>
        <div className="max-w-4xl mx-auto">
          <p className="text-lg text-gray-600 leading-relaxed">
            We aim to connect hearts and emotions through the universal language
            of flowers. Whether celebrating love, expressing sympathy,
            congratulating achievements, or simply brightening someone's day, we
            believe every moment deserves to be made special with beautiful
            blooms.
          </p>
        </div>
      </section>
    </div>
  );
}
