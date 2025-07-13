"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = HelpCenterPage;
var react_1 = require("react");
var card_1 = require("@/components/ui/card");
var badge_1 = require("@/components/ui/badge");
var button_1 = require("@/components/ui/button");
var accordion_1 = require("@/components/ui/accordion");
var lucide_react_1 = require("lucide-react");
var supabase_1 = require("@/lib/supabase");
function HelpCenterPage() {
    var _a, _b, _c, _d, _e, _f;
    var _g = (0, react_1.useState)(null), pageData = _g[0], setPageData = _g[1];
    var _h = (0, react_1.useState)(true), isLoading = _h[0], setIsLoading = _h[1];
    var _j = (0, react_1.useState)(""), searchQuery = _j[0], setSearchQuery = _j[1];
    (0, react_1.useEffect)(function () {
        fetchHelpPage();
    }, []);
    function fetchHelpPage() {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 5, 6, 7]);
                        return [4 /*yield*/, supabase_1.supabase
                                .from("pages")
                                .select("*")
                                .eq("slug", "help-center")
                                .eq("is_active", true)
                                .single()];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (!(error && error.code === "PGRST116")) return [3 /*break*/, 3];
                        // No data found, create default record
                        return [4 /*yield*/, createDefaultHelpPage()];
                    case 2:
                        // No data found, create default record
                        _b.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        if (error) {
                            console.error("Database error:", error);
                        }
                        else if (data) {
                            setPageData(data);
                        }
                        _b.label = 4;
                    case 4: return [3 /*break*/, 7];
                    case 5:
                        error_1 = _b.sent();
                        console.error("Failed to fetch help page:", error_1);
                        return [3 /*break*/, 7];
                    case 6:
                        setIsLoading(false);
                        return [7 /*endfinally*/];
                    case 7: return [2 /*return*/];
                }
            });
        });
    }
    function createDefaultHelpPage() {
        return __awaiter(this, void 0, void 0, function () {
            var defaultContent, _a, data, error, error_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        defaultContent = {
                            blocks: [
                                {
                                    type: "hero_title",
                                    content: "Help Center",
                                },
                                {
                                    type: "hero_description",
                                    content: "Find answers to your questions and get the support you need",
                                },
                                {
                                    type: "faq_category",
                                    category: "Ordering & Payment",
                                    items: [
                                        {
                                            question: "How do I place an order?",
                                            answer: "You can place an order through our website by selecting your desired flowers, choosing delivery date and time, and completing payment.",
                                        },
                                        {
                                            question: "What payment methods do you accept?",
                                            answer: "We accept all major credit cards, debit cards, net banking, UPI payments, and digital wallets.",
                                        },
                                    ],
                                },
                                {
                                    type: "faq_category",
                                    category: "Delivery Information",
                                    items: [
                                        {
                                            question: "Do you offer same-day delivery?",
                                            answer: "Yes, we offer same-day delivery for orders placed before 12 PM, subject to availability in your area.",
                                        },
                                        {
                                            question: "Which areas do you deliver to?",
                                            answer: "We deliver to 100+ cities across India. Enter your pincode during checkout to check delivery availability.",
                                        },
                                    ],
                                },
                            ],
                        };
                        return [4 /*yield*/, supabase_1.supabase
                                .from("pages")
                                .insert({
                                title: "Help Center",
                                slug: "help-center",
                                content: defaultContent,
                                meta_title: "Help Center - Customer Support & FAQ",
                                meta_description: "Get help with flower delivery orders. FAQs about ordering, payment, delivery and more.",
                                is_active: true,
                                show_in_footer: true,
                                sort_order: 2,
                            })
                                .select()
                                .single()];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (data && !error) {
                            setPageData(data);
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _b.sent();
                        console.error("Failed to create default help page:", error_2);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    }
    // Set SEO meta tags
    (0, react_1.useEffect)(function () {
        var title = (pageData === null || pageData === void 0 ? void 0 : pageData.meta_title) || "Help Center - Customer Support & FAQ";
        var description = (pageData === null || pageData === void 0 ? void 0 : pageData.meta_description) ||
            "Get help with flower delivery orders. FAQs about ordering, payment, delivery and more.";
        document.title = title;
        var metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
            metaDesc = document.createElement("meta");
            metaDesc.setAttribute("name", "description");
            document.head.appendChild(metaDesc);
        }
        metaDesc.setAttribute("content", description);
    }, [pageData]);
    // Default FAQ categories for fallback
    var defaultFaqCategories = [
        {
            id: "ordering",
            title: "Ordering & Payment",
            icon: <lucide_react_1.ShoppingCart className="h-5 w-5"/>,
            questions: [
                {
                    question: "How do I place an order?",
                    answer: "Simply browse our collection, select your preferred flowers, add to cart, and proceed to checkout. Enter delivery details and make payment to confirm your order.",
                },
                {
                    question: "What payment methods do you accept?",
                    answer: "We accept all major credit/debit cards, UPI, net banking, and digital wallets including Google Pay, PhonePe, and Paytm.",
                },
                {
                    question: "Is my payment information secure?",
                    answer: "Yes, all payments are processed through secure payment gateways with SSL encryption to protect your financial information.",
                },
                {
                    question: "Can I modify my order after placing it?",
                    answer: "Orders can be modified within 2 hours of placement, subject to availability. Contact our support team immediately for modifications.",
                },
            ],
        },
        {
            id: "delivery",
            title: "Delivery Information",
            icon: <lucide_react_1.Truck className="h-5 w-5"/>,
            questions: [
                {
                    question: "Do you offer same-day delivery?",
                    answer: "Yes, we offer same-day delivery in most cities. Orders placed before 12 PM can be delivered the same day.",
                },
                {
                    question: "What are your delivery timings?",
                    answer: "We deliver between 9:00 AM to 9:00 PM on all days. For specific time slots, please contact our customer support.",
                },
                {
                    question: "Do you deliver to all areas?",
                    answer: "We deliver to 100+ cities across India. Enter your pincode during checkout to check delivery availability in your area.",
                },
                {
                    question: "How can I track my order?",
                    answer: "You'll receive a tracking link via SMS and email once your order is dispatched. You can also track your order in the 'My Orders' section.",
                },
            ],
        },
        {
            id: "products",
            title: "Products & Quality",
            icon: <lucide_react_1.Package className="h-5 w-5"/>,
            questions: [
                {
                    question: "How do you ensure flower freshness?",
                    answer: "Our flowers are sourced daily from trusted gardens and stored in temperature-controlled environments. We guarantee freshness for at least 3-5 days.",
                },
                {
                    question: "Can I customize my flower arrangement?",
                    answer: "Yes, we offer custom arrangements. Contact our support team with your requirements, and we'll create something special for you.",
                },
                {
                    question: "What if the flowers don't match the picture?",
                    answer: "We strive to match arrangements closely, but natural variations may occur. If you're unsatisfied, contact us within 6 hours for a replacement.",
                },
            ],
        },
        {
            id: "account",
            title: "Account Help",
            icon: <lucide_react_1.User className="h-5 w-5"/>,
            questions: [
                {
                    question: "How do I create an account?",
                    answer: "Click 'Sign Up' on our homepage and fill in your details. You can also create an account during checkout.",
                },
                {
                    question: "I forgot my password. How do I reset it?",
                    answer: "Click 'Forgot Password' on the login page and enter your email. You'll receive a password reset link within minutes.",
                },
                {
                    question: "How do I update my profile information?",
                    answer: "Log in to your account and go to 'My Profile' to update your personal information, addresses, and preferences.",
                },
            ],
        },
    ];
    // Parse FAQ categories from database or use defaults
    var getFaqCategories = function () {
        var _a;
        if (!((_a = pageData === null || pageData === void 0 ? void 0 : pageData.content) === null || _a === void 0 ? void 0 : _a.blocks)) {
            return defaultFaqCategories;
        }
        var faqBlocks = pageData.content.blocks.filter(function (block) { return block.type === "faq_category"; });
        if (faqBlocks.length === 0) {
            return defaultFaqCategories;
        }
        return faqBlocks.map(function (block) { return ({
            id: block.category.toLowerCase().replace(/\s+/g, "-"),
            title: block.category,
            icon: getIconForCategory(block.category),
            questions: block.items || [],
        }); });
    };
    var getIconForCategory = function (category) {
        var categoryLower = category.toLowerCase();
        if (categoryLower.includes("order") || categoryLower.includes("payment")) {
            return <lucide_react_1.ShoppingCart className="h-5 w-5"/>;
        }
        if (categoryLower.includes("delivery")) {
            return <lucide_react_1.Truck className="h-5 w-5"/>;
        }
        if (categoryLower.includes("product") ||
            categoryLower.includes("quality")) {
            return <lucide_react_1.Package className="h-5 w-5"/>;
        }
        if (categoryLower.includes("account") || categoryLower.includes("help")) {
            return <lucide_react_1.User className="h-5 w-5"/>;
        }
        return <lucide_react_1.HelpCircle className="h-5 w-5"/>;
    };
    var faqCategories = getFaqCategories();
    // Filter FAQs based on search query
    var filteredCategories = faqCategories.map(function (category) { return (__assign(__assign({}, category), { questions: category.questions.filter(function (q) {
            return q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                q.answer.toLowerCase().includes(searchQuery.toLowerCase());
        }) })); });
    if (isLoading) {
        return (<div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="h-16 bg-gray-200 rounded animate-pulse w-96 mx-auto"></div>
            <div className="h-12 bg-gray-200 rounded animate-pulse w-full"></div>
            <div className="space-y-4">
              {[1, 2, 3, 4].map(function (i) { return (<div key={i} className="h-16 bg-gray-200 rounded animate-pulse"></div>); })}
            </div>
          </div>
        </div>
      </div>);
    }
    return (<div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Banner */}
      <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-20">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black opacity-20"></div>
          <div className="absolute top-10 right-10 w-24 h-24 bg-white opacity-10 rounded-full"></div>
          <div className="absolute bottom-10 left-10 w-16 h-16 bg-white opacity-10 rounded-full"></div>
        </div>
        <div className="relative container mx-auto px-4 text-center">
          <lucide_react_1.HelpCircle className="h-16 w-16 mx-auto mb-6 opacity-90"/>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            {((_c = (_b = (_a = pageData === null || pageData === void 0 ? void 0 : pageData.content) === null || _a === void 0 ? void 0 : _a.blocks) === null || _b === void 0 ? void 0 : _b.find(function (b) { return b.type === "hero_title"; })) === null || _c === void 0 ? void 0 : _c.content) ||
            (pageData === null || pageData === void 0 ? void 0 : pageData.title) ||
            "Help Center"}
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90">
            {((_f = (_e = (_d = pageData === null || pageData === void 0 ? void 0 : pageData.content) === null || _d === void 0 ? void 0 : _d.blocks) === null || _e === void 0 ? void 0 : _e.find(function (b) { return b.type === "hero_description"; })) === null || _f === void 0 ? void 0 : _f.content) ||
            "Find answers to your questions and get the support you need"}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-6xl">
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-16">
          <div className="relative">
            <lucide_react_1.Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5"/>
            <input type="text" placeholder="Search for help topics..." value={searchQuery} onChange={function (e) { return setSearchQuery(e.target.value); }} className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none shadow-lg"/>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          {[
            {
                title: "Track Order",
                icon: <lucide_react_1.Package className="h-6 w-6"/>,
                description: "Check your order status",
                color: "bg-green-500",
            },
            {
                title: "Delivery Info",
                icon: <lucide_react_1.Clock className="h-6 w-6"/>,
                description: "Delivery times & areas",
                color: "bg-blue-500",
            },
            {
                title: "Payment Help",
                icon: <lucide_react_1.CreditCard className="h-6 w-6"/>,
                description: "Payment methods & issues",
                color: "bg-purple-500",
            },
            {
                title: "Contact Support",
                icon: <lucide_react_1.Phone className="h-6 w-6"/>,
                description: "Speak with our team",
                color: "bg-red-500",
            },
        ].map(function (action, index) { return (<card_1.Card key={index} className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-0 shadow-lg">
              <card_1.CardContent className="p-6 text-center">
                <div className={"".concat(action.color, " rounded-full p-3 w-12 h-12 mx-auto mb-4 group-hover:scale-110 transition-transform")}>
                  <div className="text-white">{action.icon}</div>
                </div>
                <h3 className="font-bold text-lg mb-2">{action.title}</h3>
                <p className="text-gray-600 text-sm">{action.description}</p>
              </card_1.CardContent>
            </card_1.Card>); })}
        </div>

        {/* FAQ Categories */}
        <div className="space-y-8">
          {filteredCategories.map(function (category) { return (<card_1.Card key={category.id} className="border-0 shadow-lg">
              <card_1.CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-blue-100 rounded-full p-3">
                    <div className="text-blue-600">{category.icon}</div>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {category.title}
                  </h2>
                  <badge_1.Badge variant="secondary" className="ml-auto">
                    {category.questions.length} questions
                  </badge_1.Badge>
                </div>

                <accordion_1.Accordion type="single" collapsible className="space-y-4">
                  {category.questions.map(function (faq, index) { return (<accordion_1.AccordionItem key={index} value={"".concat(category.id, "-").concat(index)} className="border border-gray-200 rounded-lg px-6">
                      <accordion_1.AccordionTrigger className="text-left font-medium hover:no-underline py-4">
                        {faq.question}
                      </accordion_1.AccordionTrigger>
                      <accordion_1.AccordionContent className="pb-4 text-gray-600 leading-relaxed">
                        {faq.answer}
                      </accordion_1.AccordionContent>
                    </accordion_1.AccordionItem>); })}
                </accordion_1.Accordion>
              </card_1.CardContent>
            </card_1.Card>); })}
        </div>

        {/* Contact Support Section */}
        <div className="mt-16">
          <card_1.Card className="border-0 shadow-2xl bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            <card_1.CardContent className="p-12 text-center">
              <lucide_react_1.MessageCircle className="h-16 w-16 mx-auto mb-6 opacity-90"/>
              <h2 className="text-3xl font-bold mb-4">Still Need Help?</h2>
              <p className="text-xl mb-8 opacity-90">
                Our customer support team is here to assist you 24/7
              </p>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
                  <lucide_react_1.Phone className="h-8 w-8 mx-auto mb-4"/>
                  <h3 className="font-semibold mb-2">Call Us</h3>
                  <p className="opacity-90">+91 98765 43210</p>
                  <p className="text-sm opacity-75 mt-1">24/7 Support</p>
                </div>

                <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
                  <lucide_react_1.Mail className="h-8 w-8 mx-auto mb-4"/>
                  <h3 className="font-semibold mb-2">Email Us</h3>
                  <p className="opacity-90">support@floristinindia.com</p>
                  <p className="text-sm opacity-75 mt-1">
                    Response within 2 hours
                  </p>
                </div>

                <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
                  <lucide_react_1.MessageCircle className="h-8 w-8 mx-auto mb-4"/>
                  <h3 className="font-semibold mb-2">Live Chat</h3>
                  <p className="opacity-90">Chat with us now</p>
                  <p className="text-sm opacity-75 mt-1">Instant support</p>
                </div>
              </div>

              <button_1.Button className="mt-8 bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold" size="lg">
                Contact Support Now
              </button_1.Button>
            </card_1.CardContent>
          </card_1.Card>
        </div>
      </div>
    </div>);
}
