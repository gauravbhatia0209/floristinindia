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
exports.default = TermsConditionsPage;
var react_1 = require("react");
var card_1 = require("@/components/ui/card");
var accordion_1 = require("@/components/ui/accordion");
var lucide_react_1 = require("lucide-react");
var supabase_1 = require("@/lib/supabase");
function TermsConditionsPage() {
    var _a, _b, _c, _d, _e, _f;
    var _g = (0, react_1.useState)(null), pageData = _g[0], setPageData = _g[1];
    var _h = (0, react_1.useState)(true), isLoading = _h[0], setIsLoading = _h[1];
    (0, react_1.useEffect)(function () {
        fetchTermsPage();
    }, []);
    function fetchTermsPage() {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 5, 6, 7]);
                        return [4 /*yield*/, supabase_1.supabase
                                .from("pages")
                                .select("*")
                                .eq("slug", "terms-conditions")
                                .eq("is_active", true)
                                .single()];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (!(error && error.code === "PGRST116")) return [3 /*break*/, 3];
                        // No data found, create default record
                        return [4 /*yield*/, createDefaultTermsPage()];
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
                        console.error("Failed to fetch terms page:", error_1);
                        return [3 /*break*/, 7];
                    case 6:
                        setIsLoading(false);
                        return [7 /*endfinally*/];
                    case 7: return [2 /*return*/];
                }
            });
        });
    }
    function createDefaultTermsPage() {
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
                                    content: "Terms & Conditions",
                                },
                                {
                                    type: "hero_description",
                                    content: "These terms govern your use of our services. Please read them carefully.",
                                },
                                {
                                    type: "section",
                                    section_id: "acceptance",
                                    title: "Acceptance of Terms",
                                    intro: "By accessing our website and placing orders, you accept and agree to be bound by these Terms & Conditions.",
                                    points: [
                                        "These terms apply to all users and customers",
                                        "By placing an order, you confirm acceptance of these terms",
                                        "If you disagree with any terms, please discontinue use",
                                        "We may update terms periodically with notice",
                                    ],
                                },
                                {
                                    type: "section",
                                    section_id: "services",
                                    title: "Our Services",
                                    intro: "Florist in India provides fresh flower delivery services across India. Our services include:",
                                    points: [
                                        "Fresh flower bouquets and arrangements",
                                        "Same-day and scheduled delivery",
                                        "Custom floral arrangements",
                                        "Gift combinations with flowers",
                                        "Flowers for occasions and events",
                                        "Customer support and assistance",
                                    ],
                                },
                                {
                                    type: "section",
                                    section_id: "ordering",
                                    title: "Ordering & Payment",
                                    intro: "Order placement and payment terms that govern your transactions:",
                                    points: [
                                        "Orders are confirmed upon payment completion",
                                        "Prices include applicable taxes unless specified",
                                        "Delivery charges are additional unless noted",
                                        "We reserve the right to modify prices without prior notice",
                                        "Payment must be made at the time of ordering",
                                        "All transactions are subject to verification",
                                    ],
                                },
                            ],
                        };
                        return [4 /*yield*/, supabase_1.supabase
                                .from("pages")
                                .insert({
                                title: "Terms & Conditions",
                                slug: "terms-conditions",
                                content: defaultContent,
                                meta_title: "Terms & Conditions",
                                meta_description: "Service terms and conditions for flower delivery.",
                                is_active: true,
                                show_in_footer: true,
                                sort_order: 5,
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
                        console.error("Failed to create default terms page:", error_2);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    }
    // Set SEO meta tags
    (0, react_1.useEffect)(function () {
        var title = (pageData === null || pageData === void 0 ? void 0 : pageData.meta_title) || "Terms & Conditions";
        var description = (pageData === null || pageData === void 0 ? void 0 : pageData.meta_description) ||
            "Service terms and conditions for flower delivery.";
        document.title = title;
        var metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
            metaDesc = document.createElement("meta");
            metaDesc.setAttribute("name", "description");
            document.head.appendChild(metaDesc);
        }
        metaDesc.setAttribute("content", description);
    }, [pageData]);
    // Default sections structure for fallback
    var defaultTermsSections = [
        {
            id: "acceptance",
            title: "Acceptance of Terms",
            icon: <lucide_react_1.CheckCircle className="h-5 w-5"/>,
            content: {
                intro: "By accessing our website and placing orders, you accept and agree to be bound by these Terms & Conditions.",
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
            icon: <lucide_react_1.ShoppingCart className="h-5 w-5"/>,
            content: {
                intro: "Florist in India provides fresh flower delivery services across India. Our services include:",
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
            icon: <lucide_react_1.FileText className="h-5 w-5"/>,
            content: {
                intro: "Order placement and payment terms that govern your transactions:",
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
            icon: <lucide_react_1.Truck className="h-5 w-5"/>,
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
            icon: <lucide_react_1.Shield className="h-5 w-5"/>,
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
            icon: <lucide_react_1.Users className="h-5 w-5"/>,
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
    // Parse content from database and merge with default sections
    var getTermsSections = function () {
        var _a;
        if (!((_a = pageData === null || pageData === void 0 ? void 0 : pageData.content) === null || _a === void 0 ? void 0 : _a.blocks)) {
            return defaultTermsSections;
        }
        var blocks = pageData.content.blocks;
        var parsedSections = [];
        // Try to find section-specific content from database
        blocks.forEach(function (block, index) {
            if (block.type === "section" && block.section_id) {
                var defaultSection = defaultTermsSections.find(function (s) { return s.id === block.section_id; });
                if (defaultSection) {
                    parsedSections.push(__assign(__assign({}, defaultSection), { title: block.title || defaultSection.title, content: {
                            intro: block.intro || defaultSection.content.intro,
                            points: block.points || defaultSection.content.points,
                        } }));
                }
            }
        });
        // If no sections found in database, use defaults
        return parsedSections.length > 0 ? parsedSections : defaultTermsSections;
    };
    var termsSections = getTermsSections();
    if (isLoading) {
        return (<div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
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
    return (<div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Banner */}
      <div className="relative bg-gradient-to-r from-slate-700 via-gray-700 to-zinc-700 text-white py-20">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black opacity-30"></div>
          <div className="absolute top-10 left-10 w-20 h-20 bg-white opacity-10 rounded-full"></div>
          <div className="absolute bottom-10 right-10 w-16 h-16 bg-white opacity-10 rounded-full"></div>
          <div className="absolute top-1/2 right-1/4 w-12 h-12 bg-white opacity-10 rounded-full"></div>
        </div>
        <div className="relative container mx-auto px-4 text-center">
          <lucide_react_1.Scale className="h-16 w-16 mx-auto mb-6 opacity-90"/>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            {((_c = (_b = (_a = pageData === null || pageData === void 0 ? void 0 : pageData.content) === null || _a === void 0 ? void 0 : _a.blocks) === null || _b === void 0 ? void 0 : _b.find(function (b) { return b.type === "hero_title"; })) === null || _c === void 0 ? void 0 : _c.content) ||
            (pageData === null || pageData === void 0 ? void 0 : pageData.title) ||
            "Terms & Conditions"}
          </h1>
          <p className="text-xl md:text-2xl max-w-4xl mx-auto opacity-90">
            {((_f = (_e = (_d = pageData === null || pageData === void 0 ? void 0 : pageData.content) === null || _d === void 0 ? void 0 : _d.blocks) === null || _e === void 0 ? void 0 : _e.find(function (b) { return b.type === "hero_description"; })) === null || _f === void 0 ? void 0 : _f.content) ||
            "These terms govern your use of our services. Please read them carefully."}
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
              Agreement Overview
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">
              These terms and conditions govern your use of Florist in India
              services. By placing an order or using our website, you agree to
              these terms. Please read them carefully before proceeding.
            </p>
          </card_1.CardContent>
        </card_1.Card>

        {/* Key Highlights */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {[
            {
                icon: <lucide_react_1.Scale className="h-6 w-6"/>,
                title: "Legal Agreement",
                description: "Binding terms for all users",
                color: "bg-blue-500",
            },
            {
                icon: <lucide_react_1.Shield className="h-6 w-6"/>,
                title: "Your Protection",
                description: "Clear rights and responsibilities",
                color: "bg-green-500",
            },
            {
                icon: <lucide_react_1.AlertTriangle className="h-6 w-6"/>,
                title: "Important Info",
                description: "Key policies and limitations",
                color: "bg-orange-500",
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

        {/* Terms Sections */}
        <card_1.Card className="border-0 shadow-lg">
          <card_1.CardHeader className="bg-slate-50 rounded-t-lg">
            <card_1.CardTitle className="text-2xl">
              Terms & Conditions Details
            </card_1.CardTitle>
          </card_1.CardHeader>
          <card_1.CardContent className="p-8">
            <accordion_1.Accordion type="single" collapsible className="space-y-4">
              {termsSections.map(function (section, index) { return (<accordion_1.AccordionItem key={section.id} value={section.id} className="border border-gray-200 rounded-lg px-6">
                  <accordion_1.AccordionTrigger className="text-left font-medium hover:no-underline py-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-slate-100 rounded-full p-2">
                        <div className="text-slate-600">{section.icon}</div>
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
                        {section.content.points.map(function (point, pointIndex) { return (<li key={pointIndex} className="flex items-start gap-3 text-gray-700">
                            <div className="w-2 h-2 bg-slate-400 rounded-full mt-2 flex-shrink-0"></div>
                            <span>{point}</span>
                          </li>); })}
                      </ul>
                    </div>
                  </accordion_1.AccordionContent>
                </accordion_1.AccordionItem>); })}
            </accordion_1.Accordion>
          </card_1.CardContent>
        </card_1.Card>

        {/* Product Disclaimer */}
        <card_1.Card className="mt-12 border-0 shadow-lg">
          <card_1.CardHeader className="bg-yellow-50 rounded-t-lg">
            <card_1.CardTitle className="flex items-center gap-3 text-2xl">
              <lucide_react_1.AlertTriangle className="h-6 w-6 text-yellow-600"/>
              Product Disclaimer
            </card_1.CardTitle>
          </card_1.CardHeader>
          <card_1.CardContent className="p-8">
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
                    <lucide_react_1.CheckCircle className="h-4 w-4 text-green-500"/>
                    <span className="text-sm">
                      We strive to match arrangements as closely as possible
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <lucide_react_1.CheckCircle className="h-4 w-4 text-green-500"/>
                    <span className="text-sm">
                      Substitutions may occur for unavailable flowers
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <lucide_react_1.CheckCircle className="h-4 w-4 text-green-500"/>
                    <span className="text-sm">
                      Equal or greater value maintained in substitutions
                    </span>
                  </div>
                </div>
              </div>
              <div className="bg-yellow-50 rounded-xl p-6">
                <lucide_react_1.AlertTriangle className="h-8 w-8 text-yellow-600 mb-4"/>
                <h4 className="font-bold text-lg mb-3">Important Notice</h4>
                <p className="text-gray-600">
                  While we make every effort to fulfill orders exactly as
                  requested, seasonal availability and quality standards may
                  require reasonable substitutions.
                </p>
              </div>
            </div>
          </card_1.CardContent>
        </card_1.Card>

        {/* Governing Law */}
        <card_1.Card className="mt-12 border-0 shadow-lg">
          <card_1.CardHeader className="bg-blue-50 rounded-t-lg">
            <card_1.CardTitle className="flex items-center gap-3 text-2xl">
              <lucide_react_1.Globe className="h-6 w-6 text-blue-600"/>
              Governing Law & Jurisdiction
            </card_1.CardTitle>
          </card_1.CardHeader>
          <card_1.CardContent className="p-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="font-bold text-lg mb-4">Legal Framework</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <lucide_react_1.Scale className="h-5 w-5 text-blue-600"/>
                    <span>Governed by Indian law</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <lucide_react_1.Globe className="h-5 w-5 text-blue-600"/>
                    <span>Mumbai, Maharashtra jurisdiction</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <lucide_react_1.FileText className="h-5 w-5 text-blue-600"/>
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
          </card_1.CardContent>
        </card_1.Card>

        {/* Contact Section */}
        <card_1.Card className="mt-12 border-0 shadow-2xl bg-gradient-to-r from-slate-600 to-gray-700 text-white">
          <card_1.CardContent className="p-12 text-center">
            <h2 className="text-3xl font-bold mb-6">Questions About Terms?</h2>
            <p className="text-xl mb-8 opacity-90">
              Contact our legal team for clarification on any terms
            </p>

            <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
              <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
                <lucide_react_1.Mail className="h-8 w-8 mx-auto mb-4"/>
                <h3 className="font-semibold mb-2">Email Us</h3>
                <p className="opacity-90">legal@floristinindia.com</p>
                <p className="text-sm opacity-75 mt-2">Legal department</p>
              </div>

              <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
                <lucide_react_1.Phone className="h-8 w-8 mx-auto mb-4"/>
                <h3 className="font-semibold mb-2">Call Us</h3>
                <p className="opacity-90">+91 98765 43210</p>
                <p className="text-sm opacity-75 mt-2">Business hours</p>
              </div>
            </div>

            <div className="mt-8 bg-white/10 rounded-xl p-4 max-w-lg mx-auto">
              <div className="flex items-center justify-center gap-2 mb-2">
                <lucide_react_1.Calendar className="h-4 w-4"/>
                <p className="text-sm font-semibold">Terms Effective Date</p>
              </div>
              <p className="text-sm opacity-90">
                These terms are effective as of{" "}
                {new Date().toLocaleDateString()}
              </p>
            </div>
          </card_1.CardContent>
        </card_1.Card>
      </div>
    </div>);
}
