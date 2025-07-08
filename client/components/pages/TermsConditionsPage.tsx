import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  FileText,
  Scale,
  ShoppingCart,
  Truck,
  Shield,
  Users,
  AlertTriangle,
  CheckCircle,
  Mail,
  Phone,
  Globe,
  Calendar,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

interface TermsPageData {
  id: string;
  title: string;
  content: any;
  meta_title?: string;
  meta_description?: string;
  is_active: boolean;
}

export default function TermsConditionsPage() {
  const [pageData, setPageData] = useState<TermsPageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTermsPage();
  }, []);

  async function fetchTermsPage() {
    try {
      const { data, error } = await supabase
        .from("pages")
        .select("*")
        .eq("slug", "terms-conditions")
        .eq("is_active", true)
        .single();

      if (error && error.code !== "PGRST116") {
        console.error("Database error:", error);
      } else if (data) {
        setPageData(data);
      }
    } catch (error) {
      console.error("Failed to fetch terms page:", error);
    } finally {
      setIsLoading(false);
    }
  }

  // Set SEO meta tags
  useEffect(() => {
    const title = pageData?.meta_title || "Terms & Conditions";
    const description =
      pageData?.meta_description ||
      "Service terms and conditions for flower delivery.";

    document.title = title;

    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.setAttribute("name", "description");
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute("content", description);
  }, [pageData]);

  const termsSections = [
    {
      id: "acceptance",
      title: "Acceptance of Terms",
      icon: <CheckCircle className="h-5 w-5" />,
      content: {
        intro:
          "By accessing our website and placing orders, you accept and agree to be bound by these Terms & Conditions.",
        points: [
          "These terms apply to all users and customers",
          "By placing an order, you confirm acceptance of these terms",
          "If you disagree with any terms, please discontinue use",
          "We may update terms periodically with notice",
        ],
      },
    },
    {
      id: "services",
      title: "Our Services",
      icon: <ShoppingCart className="h-5 w-5" />,
      content: {
        intro:
          "Florist in India provides fresh flower delivery services across India. Our services include:",
        points: [
          "Fresh flower bouquets and arrangements",
          "Same-day and scheduled delivery",
          "Custom floral arrangements",
          "Gift combinations with flowers",
          "Flowers for occasions and events",
          "Customer support and assistance",
        ],
      },
    },
    {
      id: "ordering",
      title: "Ordering & Payment",
      icon: <FileText className="h-5 w-5" />,
      content: {
        intro:
          "Order placement and payment terms that govern your transactions:",
        points: [
          "Orders are confirmed upon payment completion",
          "Prices include applicable taxes unless specified",
          "Delivery charges are additional unless noted",
          "We reserve the right to modify prices without prior notice",
          "Payment must be made at the time of ordering",
          "All transactions are subject to verification",
        ],
      },
    },
    {
      id: "delivery",
      title: "Delivery Terms",
      icon: <Truck className="h-5 w-5" />,
      content: {
        intro: "Important delivery terms and conditions:",
        points: [
          "Delivery times are estimates and may vary due to external factors",
          "Same-day delivery requires orders placed before 12 PM",
          "Delivery address must be accurate and accessible",
          "Additional charges may apply for remote areas",
          "We are not responsible for delays due to recipient unavailability",
          "Weather conditions may affect delivery schedules",
        ],
      },
    },
    {
      id: "liability",
      title: "Limitation of Liability",
      icon: <Shield className="h-5 w-5" />,
      content: {
        intro: "Our liability limitations and disclaimers:",
        points: [
          "Our liability is limited to the value of the order",
          "We are not responsible for indirect or consequential damages",
          "Natural product variations are not grounds for liability",
          "Force majeure events are beyond our control",
          "Customer satisfaction is our priority within reasonable limits",
        ],
      },
    },
    {
      id: "conduct",
      title: "User Responsibilities",
      icon: <Users className="h-5 w-5" />,
      content: {
        intro: "As a user of our services, you agree not to:",
        points: [
          "Provide false or misleading information",
          "Use our services for any illegal purposes",
          "Violate any applicable laws or regulations",
          "Interfere with website security or functionality",
          "Abuse our customer support team",
          "Attempt to gain unauthorized access to our systems",
        ],
      },
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Banner */}
      <div className="relative bg-gradient-to-r from-slate-700 via-gray-700 to-zinc-700 text-white py-20">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black opacity-30"></div>
          <div className="absolute top-10 left-10 w-20 h-20 bg-white opacity-10 rounded-full"></div>
          <div className="absolute bottom-10 right-10 w-16 h-16 bg-white opacity-10 rounded-full"></div>
          <div className="absolute top-1/2 right-1/4 w-12 h-12 bg-white opacity-10 rounded-full"></div>
        </div>
        <div className="relative container mx-auto px-4 text-center">
          <Scale className="h-16 w-16 mx-auto mb-6 opacity-90" />
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Terms & Conditions
          </h1>
          <p className="text-xl md:text-2xl max-w-4xl mx-auto opacity-90">
            These terms govern your use of our services. Please read them
            carefully.
          </p>
          <div className="mt-8 bg-white/10 rounded-xl p-4 max-w-md mx-auto backdrop-blur-sm">
            <p className="text-sm opacity-90">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-5xl">
        {/* Introduction */}
        <Card className="mb-12 border-0 shadow-lg">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Agreement Overview
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">
              These terms and conditions govern your use of Florist in India
              services. By placing an order or using our website, you agree to
              these terms. Please read them carefully before proceeding.
            </p>
          </CardContent>
        </Card>

        {/* Key Highlights */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {[
            {
              icon: <Scale className="h-6 w-6" />,
              title: "Legal Agreement",
              description: "Binding terms for all users",
              color: "bg-blue-500",
            },
            {
              icon: <Shield className="h-6 w-6" />,
              title: "Your Protection",
              description: "Clear rights and responsibilities",
              color: "bg-green-500",
            },
            {
              icon: <AlertTriangle className="h-6 w-6" />,
              title: "Important Info",
              description: "Key policies and limitations",
              color: "bg-orange-500",
            },
          ].map((highlight, index) => (
            <Card
              key={index}
              className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow"
            >
              <CardContent className="p-6">
                <div
                  className={`${highlight.color} rounded-full p-3 w-12 h-12 mx-auto mb-4`}
                >
                  <div className="text-white">{highlight.icon}</div>
                </div>
                <h3 className="font-bold text-lg mb-2">{highlight.title}</h3>
                <p className="text-gray-600 text-sm">{highlight.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Terms Sections */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-slate-50 rounded-t-lg">
            <CardTitle className="text-2xl">
              Terms & Conditions Details
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <Accordion type="single" collapsible className="space-y-4">
              {termsSections.map((section, index) => (
                <AccordionItem
                  key={section.id}
                  value={section.id}
                  className="border border-gray-200 rounded-lg px-6"
                >
                  <AccordionTrigger className="text-left font-medium hover:no-underline py-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-slate-100 rounded-full p-2">
                        <div className="text-slate-600">{section.icon}</div>
                      </div>
                      <span className="text-lg">{section.title}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-4">
                    <div className="pl-12">
                      <p className="text-gray-600 mb-4 leading-relaxed">
                        {section.content.intro}
                      </p>
                      <ul className="space-y-2">
                        {section.content.points.map((point, pointIndex) => (
                          <li
                            key={pointIndex}
                            className="flex items-start gap-3 text-gray-700"
                          >
                            <div className="w-2 h-2 bg-slate-400 rounded-full mt-2 flex-shrink-0"></div>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        {/* Product Disclaimer */}
        <Card className="mt-12 border-0 shadow-lg">
          <CardHeader className="bg-yellow-50 rounded-t-lg">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <AlertTriangle className="h-6 w-6 text-yellow-600" />
              Product Disclaimer
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-bold text-lg mb-4">
                  Natural Product Variations
                </h3>
                <p className="text-gray-600 mb-4">
                  Flowers are natural products and may vary in color, size, and
                  appearance from photos displayed on our website.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">
                      We strive to match arrangements as closely as possible
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">
                      Substitutions may occur for unavailable flowers
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">
                      Equal or greater value maintained in substitutions
                    </span>
                  </div>
                </div>
              </div>
              <div className="bg-yellow-50 rounded-xl p-6">
                <AlertTriangle className="h-8 w-8 text-yellow-600 mb-4" />
                <h4 className="font-bold text-lg mb-3">Important Notice</h4>
                <p className="text-gray-600">
                  While we make every effort to fulfill orders exactly as
                  requested, seasonal availability and quality standards may
                  require reasonable substitutions.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Governing Law */}
        <Card className="mt-12 border-0 shadow-lg">
          <CardHeader className="bg-blue-50 rounded-t-lg">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <Globe className="h-6 w-6 text-blue-600" />
              Governing Law & Jurisdiction
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="font-bold text-lg mb-4">Legal Framework</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Scale className="h-5 w-5 text-blue-600" />
                    <span>Governed by Indian law</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Globe className="h-5 w-5 text-blue-600" />
                    <span>Mumbai, Maharashtra jurisdiction</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <span>Consumer protection laws apply</span>
                  </div>
                </div>
              </div>
              <div className="bg-blue-50 rounded-xl p-6">
                <h4 className="font-bold text-lg mb-3">Dispute Resolution</h4>
                <p className="text-gray-600 mb-4">
                  Any disputes will be resolved through courts of Mumbai,
                  Maharashtra. We encourage direct communication to resolve
                  issues amicably.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Section */}
        <Card className="mt-12 border-0 shadow-2xl bg-gradient-to-r from-slate-600 to-gray-700 text-white">
          <CardContent className="p-12 text-center">
            <h2 className="text-3xl font-bold mb-6">Questions About Terms?</h2>
            <p className="text-xl mb-8 opacity-90">
              Contact our legal team for clarification on any terms
            </p>

            <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
              <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
                <Mail className="h-8 w-8 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Email Us</h3>
                <p className="opacity-90">legal@floristinindia.com</p>
                <p className="text-sm opacity-75 mt-2">Legal department</p>
              </div>

              <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
                <Phone className="h-8 w-8 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Call Us</h3>
                <p className="opacity-90">+91 98765 43210</p>
                <p className="text-sm opacity-75 mt-2">Business hours</p>
              </div>
            </div>

            <div className="mt-8 bg-white/10 rounded-xl p-4 max-w-lg mx-auto">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Calendar className="h-4 w-4" />
                <p className="text-sm font-semibold">Terms Effective Date</p>
              </div>
              <p className="text-sm opacity-90">
                These terms are effective as of{" "}
                {new Date().toLocaleDateString()}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
