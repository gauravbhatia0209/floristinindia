import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Truck,
  Clock,
  MapPin,
  CreditCard,
  Phone,
  CheckCircle,
  Package,
  Star,
  Globe,
  Shield,
  Calendar,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

interface DeliveryPageData {
  id: string;
  title: string;
  content: any;
  meta_title?: string;
  meta_description?: string;
  is_active: boolean;
  updated_at?: string;
}

export default function DeliveryInfoPage() {
  const [pageData, setPageData] = useState<DeliveryPageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDeliveryPage();
  }, []);

  async function fetchDeliveryPage() {
    try {
      const { data, error } = await supabase
        .from("pages")
        .select("*")
        .eq("slug", "delivery-info")
        .eq("is_active", true)
        .single();

      if (error && error.code === "PGRST116") {
        // No data found, create default record
        await createDefaultDeliveryPage();
      } else if (error) {
        console.error("Database error:", error);
      } else if (data) {
        setPageData(data);
      }
    } catch (error) {
      console.error("Failed to fetch delivery page:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function createDefaultDeliveryPage() {
    try {
      const defaultContent = {
        blocks: [
          {
            type: "hero_title",
            content: "Delivery Information",
          },
          {
            type: "hero_description",
            content:
              "Everything you need to know about our delivery services across India",
          },
          {
            type: "delivery_section",
            section_id: "coverage",
            title: "Delivery Coverage",
            intro: "We deliver fresh flowers across India:",
            points: [
              "100+ cities covered nationwide",
              "Metro cities: Same-day delivery available",
              "Tier-2 cities: Next-day delivery guaranteed",
              "Remote areas: 2-3 days delivery time",
              "Check pincode availability at checkout",
            ],
          },
          {
            type: "delivery_section",
            section_id: "timings",
            title: "Delivery Timings",
            intro: "Our standard delivery schedule:",
            points: [
              "Standard delivery: 9:00 AM to 9:00 PM",
              "Morning slot: 9:00 AM to 1:00 PM",
              "Afternoon slot: 1:00 PM to 5:00 PM",
              "Evening slot: 5:00 PM to 9:00 PM",
              "Midnight delivery available in select cities",
            ],
          },
        ],
      };

      const { data, error } = await supabase
        .from("pages")
        .insert({
          title: "Delivery Information",
          slug: "delivery-info",
          content: defaultContent,
          meta_title: "Delivery Information - Coverage & Timings",
          meta_description:
            "Complete delivery information including coverage areas, timings, charges and tracking.",
          is_active: true,
          show_in_footer: true,
          sort_order: 6,
        })
        .select()
        .single();

      if (data && !error) {
        setPageData(data);
      }
    } catch (error) {
      console.error("Failed to create default delivery page:", error);
    }
  }

  // Set SEO meta tags
  useEffect(() => {
    const title =
      pageData?.meta_title || "Delivery Information - Coverage & Timings";
    const description =
      pageData?.meta_description ||
      "Complete delivery information including coverage areas, timings, charges and tracking.";

    document.title = title;

    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.setAttribute("name", "description");
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute("content", description);
  }, [pageData]);

  // Default sections structure for fallback
  const defaultDeliverySections = [
    {
      id: "coverage",
      title: "Delivery Coverage",
      icon: <Globe className="h-5 w-5" />,
      content: {
        intro: "We deliver fresh flowers across India:",
        points: [
          "100+ cities covered nationwide",
          "Metro cities: Same-day delivery available",
          "Tier-2 cities: Next-day delivery guaranteed",
          "Remote areas: 2-3 days delivery time",
          "Check pincode availability at checkout",
        ],
      },
    },
    {
      id: "timings",
      title: "Delivery Timings",
      icon: <Clock className="h-5 w-5" />,
      content: {
        intro: "Our standard delivery schedule:",
        points: [
          "Standard delivery: 9:00 AM to 9:00 PM",
          "Morning slot: 9:00 AM to 1:00 PM",
          "Afternoon slot: 1:00 PM to 5:00 PM",
          "Evening slot: 5:00 PM to 9:00 PM",
          "Midnight delivery available in select cities",
        ],
      },
    },
    {
      id: "charges",
      title: "Delivery Charges",
      icon: <CreditCard className="h-5 w-5" />,
      content: {
        intro: "Transparent pricing for delivery:",
        points: [
          "Free delivery on orders above ₹999",
          "Standard delivery: ₹99 within city limits",
          "Express delivery: ₹199 (same-day)",
          "Remote area delivery: ₹149 additional",
          "Midnight delivery: ₹299 surcharge",
        ],
      },
    },
    {
      id: "tracking",
      title: "Order Tracking",
      icon: <Package className="h-5 w-5" />,
      content: {
        intro: "Stay updated on your delivery:",
        points: [
          "SMS notifications at each delivery stage",
          "Real-time tracking link via email",
          "Delivery partner contact details shared",
          "Photo confirmation upon delivery",
          "24/7 customer support for queries",
        ],
      },
    },
  ];

  // Parse content from database and merge with default sections
  const getDeliverySections = () => {
    if (!pageData?.content?.blocks) {
      return defaultDeliverySections;
    }

    const blocks = pageData.content.blocks;
    const parsedSections = [];

    // Try to find section-specific content from database
    blocks.forEach((block: any, index: number) => {
      if (block.type === "delivery_section" && block.section_id) {
        const defaultSection = defaultDeliverySections.find(
          (s) => s.id === block.section_id,
        );
        if (defaultSection) {
          parsedSections.push({
            ...defaultSection,
            title: block.title || defaultSection.title,
            content: {
              intro: block.intro || defaultSection.content.intro,
              points: block.points || defaultSection.content.points,
            },
          });
        }
      }
    });

    // If no sections found in database, use defaults
    return parsedSections.length > 0 ? parsedSections : defaultDeliverySections;
  };

  const deliverySections = getDeliverySections();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="h-16 bg-gray-200 rounded animate-pulse w-96 mx-auto"></div>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-16 bg-gray-200 rounded animate-pulse"
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Banner */}
      <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 text-white py-20">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black opacity-20"></div>
          <div className="absolute top-10 left-10 w-20 h-20 bg-white opacity-10 rounded-full"></div>
          <div className="absolute bottom-10 right-10 w-16 h-16 bg-white opacity-10 rounded-full"></div>
          <div className="absolute top-1/2 right-1/4 w-12 h-12 bg-white opacity-10 rounded-full"></div>
        </div>
        <div className="relative container mx-auto px-4 text-center">
          <Truck className="h-16 w-16 mx-auto mb-6 opacity-90" />
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            {pageData?.content?.blocks?.find(
              (b: any) => b.type === "hero_title",
            )?.content ||
              pageData?.title ||
              "Delivery Information"}
          </h1>
          <p className="text-xl md:text-2xl max-w-4xl mx-auto opacity-90">
            {pageData?.content?.blocks?.find(
              (b: any) => b.type === "hero_description",
            )?.content ||
              "Everything you need to know about our delivery services across India"}
          </p>
          <div className="mt-8 bg-white/10 rounded-xl p-4 max-w-md mx-auto backdrop-blur-sm">
            <p className="text-sm opacity-90">
              Updated:{" "}
              {pageData?.updated_at
                ? new Date(pageData.updated_at).toLocaleDateString()
                : new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-5xl">
        {/* Introduction */}
        <Card className="mb-12 border-0 shadow-lg">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Reliable Delivery Across India
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">
              We take pride in our efficient delivery network that ensures your
              flowers reach their destination fresh and on time. Our
              comprehensive delivery service covers major cities and remote
              areas across India.
            </p>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          {[
            {
              icon: <Globe className="h-6 w-6" />,
              title: "100+ Cities",
              subtitle: "Pan-India coverage",
              color: "bg-blue-500",
            },
            {
              icon: <Clock className="h-6 w-6" />,
              title: "Same Day",
              subtitle: "Delivery available",
              color: "bg-green-500",
            },
            {
              icon: <Shield className="h-6 w-6" />,
              title: "Safe Delivery",
              subtitle: "Contactless options",
              color: "bg-purple-500",
            },
            {
              icon: <Star className="h-6 w-6" />,
              title: "4.8★ Rating",
              subtitle: "Delivery excellence",
              color: "bg-orange-500",
            },
          ].map((stat, index) => (
            <Card
              key={index}
              className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow"
            >
              <CardContent className="p-6">
                <div
                  className={`${stat.color} rounded-full p-3 w-12 h-12 mx-auto mb-4`}
                >
                  <div className="text-white">{stat.icon}</div>
                </div>
                <div className="text-2xl font-bold text-gray-800 mb-1">
                  {stat.title}
                </div>
                <div className="text-gray-600 text-sm">{stat.subtitle}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Delivery Sections */}
        <div className="space-y-8">
          {deliverySections.map((section, index) => (
            <Card key={section.id} className="border-0 shadow-lg">
              <CardHeader className="bg-blue-50 rounded-t-lg">
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <div className="bg-blue-100 rounded-full p-2">
                    <div className="text-blue-600">{section.icon}</div>
                  </div>
                  <span>{section.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <p className="text-gray-600 mb-6 leading-relaxed text-lg">
                  {section.content.intro}
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  {section.content.points.map((point, pointIndex) => (
                    <div
                      key={pointIndex}
                      className="flex items-start gap-3 text-gray-700"
                    >
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="leading-relaxed">{point}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Contact Section */}
        <Card className="mt-12 border-0 shadow-2xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
          <CardContent className="p-12 text-center">
            <h2 className="text-3xl font-bold mb-6">Need Delivery Help?</h2>
            <p className="text-xl mb-8 opacity-90">
              Our delivery team is here to assist with all your questions
            </p>

            <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
              <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
                <Phone className="h-8 w-8 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Call Us</h3>
                <p className="opacity-90">+91 98765 43210</p>
                <p className="text-sm opacity-75 mt-2">Delivery support team</p>
              </div>

              <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
                <Package className="h-8 w-8 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Track Order</h3>
                <p className="opacity-90">Real-time updates</p>
                <p className="text-sm opacity-75 mt-2">SMS & Email alerts</p>
              </div>
            </div>

            <div className="mt-8 bg-white/10 rounded-xl p-4 max-w-lg mx-auto">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Calendar className="h-4 w-4" />
                <p className="text-sm font-semibold">Delivery Hours</p>
              </div>
              <p className="text-sm opacity-90">9:00 AM - 9:00 PM (All days)</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
