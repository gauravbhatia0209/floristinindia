import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Shield,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
  Phone,
  Mail,
  AlertTriangle,
  FileText,
  CreditCard,
  Calendar,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

interface RefundPageData {
  id: string;
  title: string;
  content: any;
  meta_title?: string;
  meta_description?: string;
  is_active: boolean;
}

export default function ReturnRefundPage() {
  const [pageData, setPageData] = useState<RefundPageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRefundPage();
  }, []);

  async function fetchRefundPage() {
    try {
      const { data, error } = await supabase
        .from("pages")
        .select("*")
        .eq("slug", "return-refunds")
        .eq("is_active", true)
        .single();

      if (error && error.code === "PGRST116") {
        // No data found, create default record
        await createDefaultRefundPage();
      } else if (error) {
        console.error("Database error:", error);
      } else if (data) {
        setPageData(data);
      }
    } catch (error) {
      console.error("Failed to fetch refund page:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function createDefaultRefundPage() {
    try {
      const defaultContent = {
        blocks: [
          {
            type: "hero_title",
            content: "Return & Refunds Policy",
          },
          {
            type: "hero_description",
            content:
              "Fair refund and replacement policies for flower delivery orders",
          },
          {
            type: "policy_section",
            title: "Refund Eligibility",
            content:
              "We offer refunds for orders that don't meet our quality standards or delivery commitments. Refunds are processed within 5-7 business days.",
          },
          {
            type: "policy_section",
            title: "Replacement Policy",
            content:
              "If you receive damaged or poor quality flowers, we'll provide a free replacement within 6 hours of delivery notification.",
          },
          {
            type: "contact_info",
            phone: "+91 98765 43210",
            email: "refunds@floristinindia.com",
          },
        ],
      };

      const { data, error } = await supabase
        .from("pages")
        .insert({
          title: "Return & Refunds Policy",
          slug: "return-refunds",
          content: defaultContent,
          meta_title: "Return & Refunds Policy",
          meta_description:
            "Fair refund and replacement policies for flower delivery orders.",
          is_active: true,
          show_in_footer: true,
          sort_order: 3,
        })
        .select()
        .single();

      if (data && !error) {
        setPageData(data);
      }
    } catch (error) {
      console.error("Failed to create default refund page:", error);
    }
  }

  // Set SEO meta tags
  useEffect(() => {
    const title = pageData?.meta_title || "Return & Refunds Policy";
    const description =
      pageData?.meta_description ||
      "Fair refund and replacement policies for flower delivery orders.";

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
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="h-16 bg-gray-200 rounded animate-pulse w-96 mx-auto"></div>
            <div className="grid md:grid-cols-2 gap-8">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="h-64 bg-gray-200 rounded animate-pulse"
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Hero Banner */}
      <div className="relative bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white py-20">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black opacity-20"></div>
          <div className="absolute top-10 left-10 w-20 h-20 bg-white opacity-10 rounded-full"></div>
          <div className="absolute bottom-10 right-10 w-16 h-16 bg-white opacity-10 rounded-full"></div>
        </div>
        <div className="relative container mx-auto px-4 text-center">
          <Shield className="h-16 w-16 mx-auto mb-6 opacity-90" />
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            {pageData?.content?.blocks?.find(
              (b: any) => b.type === "hero_title",
            )?.content ||
              pageData?.title ||
              "Return & Refunds Policy"}
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90">
            {pageData?.content?.blocks?.find(
              (b: any) => b.type === "hero_description",
            )?.content ||
              "Your satisfaction is our priority. Learn about our fair and transparent refund policies."}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-6xl">
        {/* Policy Overview */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            Our Commitment to You
          </h2>
          <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
            At Florist in India, customer satisfaction is our top priority. We
            stand behind the quality of our products and services with a fair
            and transparent refund policy.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          {[
            {
              icon: <Clock className="h-6 w-6" />,
              title: "24 Hours",
              subtitle: "To report issues",
              color: "bg-blue-500",
            },
            {
              icon: <RefreshCw className="h-6 w-6" />,
              title: "6 Hours",
              subtitle: "For replacements",
              color: "bg-green-500",
            },
            {
              icon: <CreditCard className="h-6 w-6" />,
              title: "5-7 Days",
              subtitle: "Refund processing",
              color: "bg-purple-500",
            },
            {
              icon: <Shield className="h-6 w-6" />,
              title: "100%",
              subtitle: "Quality guarantee",
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

        {/* Main Content Sections */}
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Refund Eligibility */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-green-50 rounded-t-lg">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <CheckCircle className="h-6 w-6 text-green-600" />
                Refund Eligibility
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <p className="text-gray-600 mb-6">
                We offer refunds under the following circumstances:
              </p>
              <div className="space-y-4">
                {[
                  "Flowers delivered are significantly different from the ordered product",
                  "Delivery was not completed within the promised timeframe",
                  "Flowers arrive in poor condition due to handling issues",
                  "Wrong product was delivered",
                  "Order was cancelled before preparation began",
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-700">{item}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Non-Refundable Items */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-red-50 rounded-t-lg">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <XCircle className="h-6 w-6 text-red-600" />
                Non-Refundable Items
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <p className="text-gray-600 mb-6">
                Please note that we cannot offer refunds for:
              </p>
              <div className="space-y-4">
                {[
                  "Perishable items that have been delivered successfully",
                  "Orders cancelled after flower preparation has begun",
                  "Delivery issues due to incorrect address provided by customer",
                  "Orders delayed due to recipient unavailability",
                  "Natural variations in flower color and size",
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <XCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-700">{item}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Refund Process */}
        <Card className="mt-12 border-0 shadow-lg">
          <CardHeader className="bg-blue-50 rounded-t-lg">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <FileText className="h-6 w-6 text-blue-600" />
              Refund Process
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                  <Phone className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="font-bold text-lg mb-3">1. Contact Support</h3>
                <p className="text-gray-600">
                  Reach out to our customer support within 24 hours of delivery
                  with your order details and photos if applicable.
                </p>
              </div>

              <div className="text-center">
                <div className="bg-purple-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                  <AlertTriangle className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="font-bold text-lg mb-3">2. Review Process</h3>
                <p className="text-gray-600">
                  Our team will review your request and may ask for additional
                  information or photos to process your claim.
                </p>
              </div>

              <div className="text-center">
                <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                  <CreditCard className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-bold text-lg mb-3">3. Resolution</h3>
                <p className="text-gray-600">
                  Once approved, refunds will be processed within 5-7 business
                  days to your original payment method.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Replacement Policy */}
        <Card className="mt-12 border-0 shadow-lg">
          <CardHeader className="bg-orange-50 rounded-t-lg">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <RefreshCw className="h-6 w-6 text-orange-600" />
              Replacement Policy
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <p className="text-lg text-gray-700 mb-4">
                  For quality issues, we offer free replacements subject to
                  availability and location.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-orange-600" />
                    <span className="font-medium">
                      Request within 6 hours of delivery
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-orange-600" />
                    <span className="font-medium">
                      Subject to product availability
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-orange-600" />
                    <span className="font-medium">No additional charges</span>
                  </div>
                </div>
              </div>
              <div className="bg-orange-50 rounded-xl p-6">
                <h4 className="font-bold text-lg mb-3">Quick Replacement</h4>
                <p className="text-gray-600 mb-4">
                  For urgent situations, we prioritize replacement requests to
                  ensure your special moments aren't missed.
                </p>
                <Badge className="bg-orange-500 text-white">
                  Same-day replacement available
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Section */}
        <Card className="mt-12 border-0 shadow-2xl bg-gradient-to-r from-green-500 to-emerald-600 text-white">
          <CardContent className="p-12 text-center">
            <h2 className="text-3xl font-bold mb-6">
              Need to Request a Refund?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Our support team is ready to help you with your refund request
            </p>

            <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
              <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
                <Phone className="h-8 w-8 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Call Us</h3>
                <p className="opacity-90 text-lg">+91 98765 43210</p>
                <p className="text-sm opacity-75 mt-2">
                  Monday to Sunday: 9:00 AM - 9:00 PM
                </p>
              </div>

              <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
                <Mail className="h-8 w-8 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Email Us</h3>
                <p className="opacity-90 text-lg">refunds@floristinindia.com</p>
                <p className="text-sm opacity-75 mt-2">
                  Response within 2 hours
                </p>
              </div>
            </div>

            <div className="mt-8 bg-white/10 rounded-xl p-4 max-w-md mx-auto">
              <p className="text-sm opacity-90">
                <strong>Pro Tip:</strong> Have your order number ready for
                faster processing
              </p>
            </div>

            <Button
              className="mt-8 bg-white text-green-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold"
              size="lg"
            >
              Contact Support Now
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
