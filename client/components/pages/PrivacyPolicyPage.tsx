import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Shield,
  Lock,
  Eye,
  Users,
  Database,
  Settings,
  Mail,
  Phone,
  FileText,
  AlertCircle,
  CheckCircle,
  Globe,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

interface PrivacyPageData {
  id: string;
  title: string;
  content: any;
  meta_title?: string;
  meta_description?: string;
  is_active: boolean;
}

export default function PrivacyPolicyPage() {
  const [pageData, setPageData] = useState<PrivacyPageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPrivacyPage();
  }, []);

  async function fetchPrivacyPage() {
    try {
      const { data, error } = await supabase
        .from("pages")
        .select("*")
        .eq("slug", "privacy-policy")
        .eq("is_active", true)
        .single();

      if (error && error.code === "PGRST116") {
        // No data found, create default record
        await createDefaultPrivacyPage();
      } else if (error) {
        console.error("Database error:", error);
      } else if (data) {
        setPageData(data);
      }
    } catch (error) {
      console.error("Failed to fetch privacy page:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function createDefaultPrivacyPage() {
    try {
      const defaultContent = {
        blocks: [
          {
            type: "hero_title",
            content: "Privacy Policy",
          },
          {
            type: "hero_description",
            content:
              "How we collect, use, and protect your personal information",
          },
          {
            type: "privacy_section",
            title: "Information We Collect",
            content:
              "We collect personal details like name, email, phone, and address to process your orders. Payment information is securely handled by our payment partners.",
          },
          {
            type: "privacy_section",
            title: "How We Use Information",
            content:
              "Your information helps us process orders, provide customer support, improve our services, and send promotional offers with your consent.",
          },
          {
            type: "privacy_section",
            title: "Data Security",
            content:
              "We use encryption and secure systems to protect your information. We do not sell your data to third parties.",
          },
          {
            type: "contact_info",
            phone: "+91 98765 43210",
            email: "privacy@floristinindia.com",
          },
        ],
      };

      const { data, error } = await supabase
        .from("pages")
        .insert({
          title: "Privacy Policy",
          slug: "privacy-policy",
          content: defaultContent,
          meta_title: "Privacy Policy - Data Protection",
          meta_description:
            "How we collect, use, and protect your personal information.",
          is_active: true,
          show_in_footer: true,
          sort_order: 4,
        })
        .select()
        .single();

      if (data && !error) {
        setPageData(data);
      }
    } catch (error) {
      console.error("Failed to create default privacy page:", error);
    }
  }

  // Set SEO meta tags
  useEffect(() => {
    const title = pageData?.meta_title || "Privacy Policy - Data Protection";
    const description =
      pageData?.meta_description ||
      "How we collect, use, and protect your personal information.";

    document.title = title;

    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.setAttribute("name", "description");
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute("content", description);
  }, [pageData]);

  const privacySections = [
    {
      id: "collection",
      title: "Information We Collect",
      icon: <Database className="h-5 w-5" />,
      content: {
        intro:
          "We collect information you provide directly to us when using our services:",
        items: [
          "Personal details: Name, email, phone number, address",
          "Payment information: Card details, billing address (securely processed)",
          "Order information: Delivery details, preferences, special instructions",
          "Communication records: Support conversations, feedback",
          "Usage data: Website interactions, device information, IP address",
        ],
      },
    },
    {
      id: "usage",
      title: "How We Use Your Information",
      icon: <Settings className="h-5 w-5" />,
      content: {
        intro: "Your information is used to:",
        items: [
          "Process and deliver your orders",
          "Communicate about your orders and account",
          "Provide customer support and assistance",
          "Improve our products and services",
          "Send promotional offers (with your consent)",
          "Comply with legal obligations",
        ],
      },
    },
    {
      id: "sharing",
      title: "Information Sharing",
      icon: <Users className="h-5 w-5" />,
      content: {
        intro:
          "We do not sell, trade, or rent your personal information to third parties. We may share information only in limited circumstances:",
        items: [
          "With delivery partners to fulfill orders",
          "With payment processors for transaction security",
          "With service providers who assist our operations",
          "When required by law or legal process",
          "To protect our rights and prevent fraud",
        ],
      },
    },
    {
      id: "security",
      title: "Data Security",
      icon: <Lock className="h-5 w-5" />,
      content: {
        intro:
          "We implement appropriate security measures to protect your personal information:",
        items: [
          "SSL encryption for all data transmission",
          "Secure payment gateways for financial information",
          "Regular security audits and updates",
          "Limited access to personal data on a need-to-know basis",
          "Industry-standard security protocols",
        ],
      },
    },
    {
      id: "rights",
      title: "Your Rights",
      icon: <Shield className="h-5 w-5" />,
      content: {
        intro: "You have the following rights regarding your personal data:",
        items: [
          "Access your personal information",
          "Correct inaccurate information",
          "Delete your account and data",
          "Opt out of marketing communications",
          "Request data portability",
          "Withdraw consent at any time",
        ],
      },
    },
    {
      id: "cookies",
      title: "Cookies & Tracking",
      icon: <Globe className="h-5 w-5" />,
      content: {
        intro:
          "We use cookies and similar technologies to enhance your experience:",
        items: [
          "Essential cookies for website functionality",
          "Analytics cookies to understand user behavior",
          "Preference cookies to remember your settings",
          "Marketing cookies for personalized advertising",
          "You can control cookie preferences through your browser",
        ],
      },
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
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
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      {/* Hero Banner */}
      <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white py-20">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black opacity-20"></div>
          <div className="absolute top-10 right-10 w-24 h-24 bg-white opacity-10 rounded-full"></div>
          <div className="absolute bottom-10 left-10 w-16 h-16 bg-white opacity-10 rounded-full"></div>
          <div className="absolute top-1/3 left-1/4 w-12 h-12 bg-white opacity-10 rounded-full"></div>
        </div>
        <div className="relative container mx-auto px-4 text-center">
          <Shield className="h-16 w-16 mx-auto mb-6 opacity-90" />
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Privacy Policy
          </h1>
          <p className="text-xl md:text-2xl max-w-4xl mx-auto opacity-90">
            We are committed to protecting your privacy and personal information
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
              Your Privacy Matters
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">
              At Florist in India, we respect your privacy and are committed to
              protecting your personal information. This policy explains how we
              collect, use, and safeguard your data when you use our services.
            </p>
          </CardContent>
        </Card>

        {/* Privacy Highlights */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {[
            {
              icon: <Lock className="h-6 w-6" />,
              title: "Secure Data",
              description: "All information encrypted & protected",
              color: "bg-green-500",
            },
            {
              icon: <Eye className="h-6 w-6" />,
              title: "Transparent",
              description: "Clear policies, no hidden practices",
              color: "bg-blue-500",
            },
            {
              icon: <CheckCircle className="h-6 w-6" />,
              title: "Your Control",
              description: "Manage your data preferences",
              color: "bg-purple-500",
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

        {/* Privacy Sections */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-indigo-50 rounded-t-lg">
            <CardTitle className="text-2xl">Privacy Policy Details</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <Accordion type="single" collapsible className="space-y-4">
              {privacySections.map((section, index) => (
                <AccordionItem
                  key={section.id}
                  value={section.id}
                  className="border border-gray-200 rounded-lg px-6"
                >
                  <AccordionTrigger className="text-left font-medium hover:no-underline py-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-indigo-100 rounded-full p-2">
                        <div className="text-indigo-600">{section.icon}</div>
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
                        {section.content.items.map((item, itemIndex) => (
                          <li
                            key={itemIndex}
                            className="flex items-start gap-3 text-gray-700"
                          >
                            <CheckCircle className="h-4 w-4 text-indigo-500 mt-0.5 flex-shrink-0" />
                            <span>{item}</span>
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

        {/* Data Retention */}
        <Card className="mt-12 border-0 shadow-lg">
          <CardHeader className="bg-orange-50 rounded-t-lg">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <FileText className="h-6 w-6 text-orange-600" />
              Data Retention
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-bold text-lg mb-4">
                  How Long We Keep Data
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <span>
                      <strong>Account data:</strong> Until account deletion
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <span>
                      <strong>Order history:</strong> 7 years for legal
                      compliance
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <span>
                      <strong>Marketing data:</strong> Until you unsubscribe
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <span>
                      <strong>Analytics data:</strong> 26 months maximum
                    </span>
                  </div>
                </div>
              </div>
              <div className="bg-orange-50 rounded-xl p-6">
                <AlertCircle className="h-8 w-8 text-orange-600 mb-4" />
                <h4 className="font-bold text-lg mb-3">Your Rights</h4>
                <p className="text-gray-600">
                  You can request deletion of your personal data at any time.
                  Some information may be retained for legal or security
                  purposes as required by law.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Section */}
        <Card className="mt-12 border-0 shadow-2xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
          <CardContent className="p-12 text-center">
            <h2 className="text-3xl font-bold mb-6">Privacy Questions?</h2>
            <p className="text-xl mb-8 opacity-90">
              Contact our privacy team for any questions about your data
            </p>

            <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
              <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
                <Mail className="h-8 w-8 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Email Us</h3>
                <p className="opacity-90">privacy@floristinindia.com</p>
                <p className="text-sm opacity-75 mt-2">
                  Dedicated privacy team
                </p>
              </div>

              <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
                <Phone className="h-8 w-8 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Call Us</h3>
                <p className="opacity-90">+91 98765 43210</p>
                <p className="text-sm opacity-75 mt-2">Privacy helpline</p>
              </div>
            </div>

            <div className="mt-8 bg-white/10 rounded-xl p-4 max-w-lg mx-auto">
              <p className="text-sm opacity-90">
                <strong>Data Subject Rights:</strong> Exercise your rights under
                applicable data protection laws
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
