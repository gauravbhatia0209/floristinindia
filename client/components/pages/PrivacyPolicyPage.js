"use strict";
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
exports.default = PrivacyPolicyPage;
var react_1 = require("react");
var card_1 = require("@/components/ui/card");
var accordion_1 = require("@/components/ui/accordion");
var lucide_react_1 = require("lucide-react");
var supabase_1 = require("@/lib/supabase");
function PrivacyPolicyPage() {
    var _a, _b, _c, _d, _e, _f;
    var _g = (0, react_1.useState)(null), pageData = _g[0], setPageData = _g[1];
    var _h = (0, react_1.useState)(true), isLoading = _h[0], setIsLoading = _h[1];
    (0, react_1.useEffect)(function () {
        fetchPrivacyPage();
    }, []);
    function fetchPrivacyPage() {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 5, 6, 7]);
                        return [4 /*yield*/, supabase_1.supabase
                                .from("pages")
                                .select("*")
                                .eq("slug", "privacy-policy")
                                .eq("is_active", true)
                                .single()];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (!(error && error.code === "PGRST116")) return [3 /*break*/, 3];
                        // No data found, create default record
                        return [4 /*yield*/, createDefaultPrivacyPage()];
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
                        console.error("Failed to fetch privacy page:", error_1);
                        return [3 /*break*/, 7];
                    case 6:
                        setIsLoading(false);
                        return [7 /*endfinally*/];
                    case 7: return [2 /*return*/];
                }
            });
        });
    }
    function createDefaultPrivacyPage() {
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
                                    content: "Privacy Policy",
                                },
                                {
                                    type: "hero_description",
                                    content: "How we collect, use, and protect your personal information",
                                },
                                {
                                    type: "privacy_section",
                                    title: "Information We Collect",
                                    content: "We collect personal details like name, email, phone, and address to process your orders. Payment information is securely handled by our payment partners.",
                                },
                                {
                                    type: "privacy_section",
                                    title: "How We Use Information",
                                    content: "Your information helps us process orders, provide customer support, improve our services, and send promotional offers with your consent.",
                                },
                                {
                                    type: "privacy_section",
                                    title: "Data Security",
                                    content: "We use encryption and secure systems to protect your information. We do not sell your data to third parties.",
                                },
                                {
                                    type: "contact_info",
                                    phone: "+91 98765 43210",
                                    email: "privacy@floristinindia.com",
                                },
                            ],
                        };
                        return [4 /*yield*/, supabase_1.supabase
                                .from("pages")
                                .insert({
                                title: "Privacy Policy",
                                slug: "privacy-policy",
                                content: defaultContent,
                                meta_title: "Privacy Policy - Data Protection",
                                meta_description: "How we collect, use, and protect your personal information.",
                                is_active: true,
                                show_in_footer: true,
                                sort_order: 4,
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
                        console.error("Failed to create default privacy page:", error_2);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    }
    // Set SEO meta tags
    (0, react_1.useEffect)(function () {
        var title = (pageData === null || pageData === void 0 ? void 0 : pageData.meta_title) || "Privacy Policy - Data Protection";
        var description = (pageData === null || pageData === void 0 ? void 0 : pageData.meta_description) ||
            "How we collect, use, and protect your personal information.";
        document.title = title;
        var metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
            metaDesc = document.createElement("meta");
            metaDesc.setAttribute("name", "description");
            document.head.appendChild(metaDesc);
        }
        metaDesc.setAttribute("content", description);
    }, [pageData]);
    var privacySections = [
        {
            id: "collection",
            title: "Information We Collect",
            icon: <lucide_react_1.Database className="h-5 w-5"/>,
            content: {
                intro: "We collect information you provide directly to us when using our services:",
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
            icon: <lucide_react_1.Settings className="h-5 w-5"/>,
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
            icon: <lucide_react_1.Users className="h-5 w-5"/>,
            content: {
                intro: "We do not sell, trade, or rent your personal information to third parties. We may share information only in limited circumstances:",
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
            icon: <lucide_react_1.Lock className="h-5 w-5"/>,
            content: {
                intro: "We implement appropriate security measures to protect your personal information:",
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
            icon: <lucide_react_1.Shield className="h-5 w-5"/>,
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
            icon: <lucide_react_1.Globe className="h-5 w-5"/>,
            content: {
                intro: "We use cookies and similar technologies to enhance your experience:",
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
        return (<div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="h-16 bg-gray-200 rounded animate-pulse w-96 mx-auto"></div>
            <div className="space-y-4">
              {[1, 2, 3, 4].map(function (i) { return (<div key={i} className="h-16 bg-gray-200 rounded animate-pulse"></div>); })}
            </div>
          </div>
        </div>
      </div>);
    }
    return (<div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      {/* Hero Banner */}
      <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white py-20">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black opacity-20"></div>
          <div className="absolute top-10 right-10 w-24 h-24 bg-white opacity-10 rounded-full"></div>
          <div className="absolute bottom-10 left-10 w-16 h-16 bg-white opacity-10 rounded-full"></div>
          <div className="absolute top-1/3 left-1/4 w-12 h-12 bg-white opacity-10 rounded-full"></div>
        </div>
        <div className="relative container mx-auto px-4 text-center">
          <lucide_react_1.Shield className="h-16 w-16 mx-auto mb-6 opacity-90"/>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            {((_c = (_b = (_a = pageData === null || pageData === void 0 ? void 0 : pageData.content) === null || _a === void 0 ? void 0 : _a.blocks) === null || _b === void 0 ? void 0 : _b.find(function (b) { return b.type === "hero_title"; })) === null || _c === void 0 ? void 0 : _c.content) ||
            (pageData === null || pageData === void 0 ? void 0 : pageData.title) ||
            "Privacy Policy"}
          </h1>
          <p className="text-xl md:text-2xl max-w-4xl mx-auto opacity-90">
            {((_f = (_e = (_d = pageData === null || pageData === void 0 ? void 0 : pageData.content) === null || _d === void 0 ? void 0 : _d.blocks) === null || _e === void 0 ? void 0 : _e.find(function (b) { return b.type === "hero_description"; })) === null || _f === void 0 ? void 0 : _f.content) ||
            "We are committed to protecting your privacy and personal information"}
          </p>
          <div className="mt-8 bg-white/10 rounded-xl p-4 max-w-md mx-auto backdrop-blur-sm">
            <p className="text-sm opacity-90">
              Last updated:{" "}
              {(pageData === null || pageData === void 0 ? void 0 : pageData.updated_at)
            ? new Date(pageData.updated_at).toLocaleDateString()
            : new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-5xl">
        {/* Introduction */}
        <card_1.Card className="mb-12 border-0 shadow-lg">
          <card_1.CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Your Privacy Matters
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">
              At Florist in India, we respect your privacy and are committed to
              protecting your personal information. This policy explains how we
              collect, use, and safeguard your data when you use our services.
            </p>
          </card_1.CardContent>
        </card_1.Card>

        {/* Privacy Highlights */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {[
            {
                icon: <lucide_react_1.Lock className="h-6 w-6"/>,
                title: "Secure Data",
                description: "All information encrypted & protected",
                color: "bg-green-500",
            },
            {
                icon: <lucide_react_1.Eye className="h-6 w-6"/>,
                title: "Transparent",
                description: "Clear policies, no hidden practices",
                color: "bg-blue-500",
            },
            {
                icon: <lucide_react_1.CheckCircle className="h-6 w-6"/>,
                title: "Your Control",
                description: "Manage your data preferences",
                color: "bg-purple-500",
            },
        ].map(function (highlight, index) { return (<card_1.Card key={index} className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
              <card_1.CardContent className="p-6">
                <div className={"".concat(highlight.color, " rounded-full p-3 w-12 h-12 mx-auto mb-4")}>
                  <div className="text-white">{highlight.icon}</div>
                </div>
                <h3 className="font-bold text-lg mb-2">{highlight.title}</h3>
                <p className="text-gray-600 text-sm">{highlight.description}</p>
              </card_1.CardContent>
            </card_1.Card>); })}
        </div>

        {/* Privacy Sections */}
        <card_1.Card className="border-0 shadow-lg">
          <card_1.CardHeader className="bg-indigo-50 rounded-t-lg">
            <card_1.CardTitle className="text-2xl">Privacy Policy Details</card_1.CardTitle>
          </card_1.CardHeader>
          <card_1.CardContent className="p-8">
            <accordion_1.Accordion type="single" collapsible className="space-y-4">
              {privacySections.map(function (section, index) { return (<accordion_1.AccordionItem key={section.id} value={section.id} className="border border-gray-200 rounded-lg px-6">
                  <accordion_1.AccordionTrigger className="text-left font-medium hover:no-underline py-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-indigo-100 rounded-full p-2">
                        <div className="text-indigo-600">{section.icon}</div>
                      </div>
                      <span className="text-lg">{section.title}</span>
                    </div>
                  </accordion_1.AccordionTrigger>
                  <accordion_1.AccordionContent className="pb-4">
                    <div className="pl-12">
                      <p className="text-gray-600 mb-4 leading-relaxed">
                        {section.content.intro}
                      </p>
                      <ul className="space-y-2">
                        {section.content.items.map(function (item, itemIndex) { return (<li key={itemIndex} className="flex items-start gap-3 text-gray-700">
                            <lucide_react_1.CheckCircle className="h-4 w-4 text-indigo-500 mt-0.5 flex-shrink-0"/>
                            <span>{item}</span>
                          </li>); })}
                      </ul>
                    </div>
                  </accordion_1.AccordionContent>
                </accordion_1.AccordionItem>); })}
            </accordion_1.Accordion>
          </card_1.CardContent>
        </card_1.Card>

        {/* Data Retention */}
        <card_1.Card className="mt-12 border-0 shadow-lg">
          <card_1.CardHeader className="bg-orange-50 rounded-t-lg">
            <card_1.CardTitle className="flex items-center gap-3 text-2xl">
              <lucide_react_1.FileText className="h-6 w-6 text-orange-600"/>
              Data Retention
            </card_1.CardTitle>
          </card_1.CardHeader>
          <card_1.CardContent className="p-8">
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
                <lucide_react_1.AlertCircle className="h-8 w-8 text-orange-600 mb-4"/>
                <h4 className="font-bold text-lg mb-3">Your Rights</h4>
                <p className="text-gray-600">
                  You can request deletion of your personal data at any time.
                  Some information may be retained for legal or security
                  purposes as required by law.
                </p>
              </div>
            </div>
          </card_1.CardContent>
        </card_1.Card>

        {/* Contact Section */}
        <card_1.Card className="mt-12 border-0 shadow-2xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
          <card_1.CardContent className="p-12 text-center">
            <h2 className="text-3xl font-bold mb-6">Privacy Questions?</h2>
            <p className="text-xl mb-8 opacity-90">
              Contact our privacy team for any questions about your data
            </p>

            <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
              <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
                <lucide_react_1.Mail className="h-8 w-8 mx-auto mb-4"/>
                <h3 className="font-semibold mb-2">Email Us</h3>
                <p className="opacity-90">privacy@floristinindia.com</p>
                <p className="text-sm opacity-75 mt-2">
                  Dedicated privacy team
                </p>
              </div>

              <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
                <lucide_react_1.Phone className="h-8 w-8 mx-auto mb-4"/>
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
          </card_1.CardContent>
        </card_1.Card>
      </div>
    </div>);
}
