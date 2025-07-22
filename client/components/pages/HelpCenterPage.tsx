import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  HelpCircle,
  Package,
  Clock,
  CreditCard,
  Truck,
  Phone,
  Mail,
  MessageCircle,
  Search,
  ShoppingCart,
  User,
  RefreshCw,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

interface HelpPageData {
  id: string;
  title: string;
  content: any;
  meta_title?: string;
  meta_description?: string;
  is_active: boolean;
}

export default function HelpCenterPage() {
  const navigate = useNavigate();
  const [pageData, setPageData] = useState<HelpPageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchHelpPage();
  }, []);

  async function fetchHelpPage() {
    try {
      const { data, error } = await supabase
        .from("pages")
        .select("*")
        .eq("slug", "help-center")
        .eq("is_active", true)
        .single();

      if (error && error.code === "PGRST116") {
        // No data found, create default record
        await createDefaultHelpPage();
      } else if (error) {
        console.error("Database error:", error);
      } else if (data) {
        setPageData(data);
      }
    } catch (error) {
      console.error("Failed to fetch help page:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function createDefaultHelpPage() {
    try {
      const defaultContent = {
        blocks: [
          {
            type: "hero_title",
            content: "Help Center",
          },
          {
            type: "hero_description",
            content:
              "Find answers to your questions and get the support you need",
          },
          {
            type: "faq_category",
            category: "Ordering & Payment",
            items: [
              {
                question: "How do I place an order?",
                answer:
                  "You can place an order through our website by selecting your desired flowers, choosing delivery date and time, and completing payment.",
              },
              {
                question: "What payment methods do you accept?",
                answer:
                  "We accept all major credit cards, debit cards, net banking, UPI payments, and digital wallets.",
              },
            ],
          },
          {
            type: "faq_category",
            category: "Delivery Information",
            items: [
              {
                question: "Do you offer same-day delivery?",
                answer:
                  "Yes, we offer same-day delivery for orders placed before 12 PM, subject to availability in your area.",
              },
              {
                question: "Which areas do you deliver to?",
                answer:
                  "We deliver to 100+ cities across India. Enter your pincode during checkout to check delivery availability.",
              },
            ],
          },
        ],
      };

      const { data, error } = await supabase
        .from("pages")
        .insert({
          title: "Help Center",
          slug: "help-center",
          content: defaultContent,
          meta_title: "Help Center - Customer Support & FAQ",
          meta_description:
            "Get help with flower delivery orders. FAQs about ordering, payment, delivery and more.",
          is_active: true,
          show_in_footer: true,
          sort_order: 2,
        })
        .select()
        .single();

      if (data && !error) {
        setPageData(data);
      }
    } catch (error) {
      console.error("Failed to create default help page:", error);
    }
  }

  // Set SEO meta tags
  useEffect(() => {
    const title =
      pageData?.meta_title || "Help Center - Customer Support & FAQ";
    const description =
      pageData?.meta_description ||
      "Get help with flower delivery orders. FAQs about ordering, payment, delivery and more.";

    document.title = title;

    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.setAttribute("name", "description");
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute("content", description);
  }, [pageData]);

  // Default FAQ categories for fallback
  const defaultFaqCategories = [
    {
      id: "ordering",
      title: "Ordering & Payment",
      icon: <ShoppingCart className="h-5 w-5" />,
      questions: [
        {
          question: "How do I place an order?",
          answer:
            "Simply browse our collection, select your preferred flowers, add to cart, and proceed to checkout. Enter delivery details and make payment to confirm your order.",
        },
        {
          question: "What payment methods do you accept?",
          answer:
            "We accept all major credit/debit cards, UPI, net banking, and digital wallets including Google Pay, PhonePe, and Paytm.",
        },
        {
          question: "Is my payment information secure?",
          answer:
            "Yes, all payments are processed through secure payment gateways with SSL encryption to protect your financial information.",
        },
        {
          question: "Can I modify my order after placing it?",
          answer:
            "Orders can be modified within 2 hours of placement, subject to availability. Contact our support team immediately for modifications.",
        },
      ],
    },
    {
      id: "delivery",
      title: "Delivery Information",
      icon: <Truck className="h-5 w-5" />,
      questions: [
        {
          question: "Do you offer same-day delivery?",
          answer:
            "Yes, we offer same-day delivery in most cities. Orders placed before 12 PM can be delivered the same day.",
        },
        {
          question: "What are your delivery timings?",
          answer:
            "We deliver between 9:00 AM to 9:00 PM on all days. For specific time slots, please contact our customer support.",
        },
        {
          question: "Do you deliver to all areas?",
          answer:
            "We deliver to 100+ cities across India. Enter your pincode during checkout to check delivery availability in your area.",
        },
        {
          question: "How can I track my order?",
          answer:
            "You'll receive a tracking link via SMS and email once your order is dispatched. You can also track your order in the 'My Orders' section.",
        },
      ],
    },
    {
      id: "products",
      title: "Products & Quality",
      icon: <Package className="h-5 w-5" />,
      questions: [
        {
          question: "How do you ensure flower freshness?",
          answer:
            "Our flowers are sourced daily from trusted gardens and stored in temperature-controlled environments. We guarantee freshness for at least 3-5 days.",
        },
        {
          question: "Can I customize my flower arrangement?",
          answer:
            "Yes, we offer custom arrangements. Contact our support team with your requirements, and we'll create something special for you.",
        },
        {
          question: "What if the flowers don't match the picture?",
          answer:
            "We strive to match arrangements closely, but natural variations may occur. If you're unsatisfied, contact us within 6 hours for a replacement.",
        },
      ],
    },
    {
      id: "account",
      title: "Account Help",
      icon: <User className="h-5 w-5" />,
      questions: [
        {
          question: "How do I create an account?",
          answer:
            "Click 'Sign Up' on our homepage and fill in your details. You can also create an account during checkout.",
        },
        {
          question: "I forgot my password. How do I reset it?",
          answer:
            "Click 'Forgot Password' on the login page and enter your email. You'll receive a password reset link within minutes.",
        },
        {
          question: "How do I update my profile information?",
          answer:
            "Log in to your account and go to 'My Profile' to update your personal information, addresses, and preferences.",
        },
      ],
    },
  ];

  // Parse FAQ categories from database or use defaults
  const getFaqCategories = () => {
    if (!pageData?.content?.blocks) {
      return defaultFaqCategories;
    }

    const faqBlocks = pageData.content.blocks.filter(
      (block: any) => block.type === "faq_category",
    );
    if (faqBlocks.length === 0) {
      return defaultFaqCategories;
    }

    return faqBlocks.map((block: any) => ({
      id: block.category.toLowerCase().replace(/\s+/g, "-"),
      title: block.category,
      icon: getIconForCategory(block.category),
      questions: block.items || [],
    }));
  };

  const getIconForCategory = (category: string) => {
    const categoryLower = category.toLowerCase();
    if (categoryLower.includes("order") || categoryLower.includes("payment")) {
      return <ShoppingCart className="h-5 w-5" />;
    }
    if (categoryLower.includes("delivery")) {
      return <Truck className="h-5 w-5" />;
    }
    if (
      categoryLower.includes("product") ||
      categoryLower.includes("quality")
    ) {
      return <Package className="h-5 w-5" />;
    }
    if (categoryLower.includes("account") || categoryLower.includes("help")) {
      return <User className="h-5 w-5" />;
    }
    return <HelpCircle className="h-5 w-5" />;
  };

  const faqCategories = getFaqCategories();

  // Filter FAQs based on search query
  const filteredCategories = faqCategories.map((category) => ({
    ...category,
    questions: category.questions.filter(
      (q) =>
        q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.answer.toLowerCase().includes(searchQuery.toLowerCase()),
    ),
  }));

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="h-16 bg-gray-200 rounded animate-pulse w-96 mx-auto"></div>
            <div className="h-12 bg-gray-200 rounded animate-pulse w-full"></div>
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
      <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-20">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black opacity-20"></div>
          <div className="absolute top-10 right-10 w-24 h-24 bg-white opacity-10 rounded-full"></div>
          <div className="absolute bottom-10 left-10 w-16 h-16 bg-white opacity-10 rounded-full"></div>
        </div>
        <div className="relative container mx-auto px-4 text-center">
          <HelpCircle className="h-16 w-16 mx-auto mb-6 opacity-90" />
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            {pageData?.content?.blocks?.find(
              (b: any) => b.type === "hero_title",
            )?.content ||
              pageData?.title ||
              "Help Center"}
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90">
            {pageData?.content?.blocks?.find(
              (b: any) => b.type === "hero_description",
            )?.content ||
              "Find answers to your questions and get the support you need"}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-6xl">
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-16">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search for help topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none shadow-lg"
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          {[
            {
              title: "Track Order",
              icon: <Package className="h-6 w-6" />,
              description: "Check your order status",
              color: "bg-green-500",
            },
            {
              title: "Delivery Info",
              icon: <Clock className="h-6 w-6" />,
              description: "Delivery times & areas",
              color: "bg-blue-500",
            },
            {
              title: "Payment Help",
              icon: <CreditCard className="h-6 w-6" />,
              description: "Payment methods & issues",
              color: "bg-purple-500",
            },
            {
              title: "Contact Support",
              icon: <Phone className="h-6 w-6" />,
              description: "Speak with our team",
              color: "bg-red-500",
            },
          ].map((action, index) => (
            <Card
              key={index}
              className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-0 shadow-lg"
            >
              <CardContent className="p-6 text-center">
                <div
                  className={`${action.color} rounded-full p-3 w-12 h-12 mx-auto mb-4 group-hover:scale-110 transition-transform`}
                >
                  <div className="text-white">{action.icon}</div>
                </div>
                <h3 className="font-bold text-lg mb-2">{action.title}</h3>
                <p className="text-gray-600 text-sm">{action.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ Categories */}
        <div className="space-y-8">
          {filteredCategories.map((category) => (
            <Card key={category.id} className="border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-blue-100 rounded-full p-3">
                    <div className="text-blue-600">{category.icon}</div>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {category.title}
                  </h2>
                  <Badge variant="secondary" className="ml-auto">
                    {category.questions.length} questions
                  </Badge>
                </div>

                <Accordion type="single" collapsible className="space-y-4">
                  {category.questions.map((faq, index) => (
                    <AccordionItem
                      key={index}
                      value={`${category.id}-${index}`}
                      className="border border-gray-200 rounded-lg px-6"
                    >
                      <AccordionTrigger className="text-left font-medium hover:no-underline py-4">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="pb-4 text-gray-600 leading-relaxed">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Contact Support Section */}
        <div className="mt-16">
          <Card className="border-0 shadow-2xl bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            <CardContent className="p-12 text-center">
              <MessageCircle className="h-16 w-16 mx-auto mb-6 opacity-90" />
              <h2 className="text-3xl font-bold mb-4">Still Need Help?</h2>
              <p className="text-xl mb-8 opacity-90">
                Our customer support team is here to assist you 24/7
              </p>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
                  <Phone className="h-8 w-8 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Call Us</h3>
                  <p className="opacity-90">+91 98765 43210</p>
                  <p className="text-sm opacity-75 mt-1">24/7 Support</p>
                </div>

                <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
                  <Mail className="h-8 w-8 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Email Us</h3>
                  <p className="opacity-90">support@floristinindia.com</p>
                  <p className="text-sm opacity-75 mt-1">
                    Response within 2 hours
                  </p>
                </div>

                <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
                  <MessageCircle className="h-8 w-8 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Live Chat</h3>
                  <p className="opacity-90">Chat with us now</p>
                  <p className="text-sm opacity-75 mt-1">Instant support</p>
                </div>
              </div>

              <Button
                className="mt-8 bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold"
                size="lg"
              >
                Contact Support Now
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
