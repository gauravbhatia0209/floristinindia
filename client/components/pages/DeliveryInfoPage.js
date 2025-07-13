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
exports.default = DeliveryInfoPage;
var react_1 = require("react");
var card_1 = require("@/components/ui/card");
var lucide_react_1 = require("lucide-react");
var supabase_1 = require("@/lib/supabase");
function DeliveryInfoPage() {
    var _a, _b, _c, _d, _e, _f;
    var _g = (0, react_1.useState)(null), pageData = _g[0], setPageData = _g[1];
    var _h = (0, react_1.useState)(true), isLoading = _h[0], setIsLoading = _h[1];
    (0, react_1.useEffect)(function () {
        fetchDeliveryPage();
    }, []);
    function fetchDeliveryPage() {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 5, 6, 7]);
                        return [4 /*yield*/, supabase_1.supabase
                                .from("pages")
                                .select("*")
                                .eq("slug", "delivery-info")
                                .eq("is_active", true)
                                .single()];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (!(error && error.code === "PGRST116")) return [3 /*break*/, 3];
                        // No data found, create default record
                        return [4 /*yield*/, createDefaultDeliveryPage()];
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
                        console.error("Failed to fetch delivery page:", error_1);
                        return [3 /*break*/, 7];
                    case 6:
                        setIsLoading(false);
                        return [7 /*endfinally*/];
                    case 7: return [2 /*return*/];
                }
            });
        });
    }
    function createDefaultDeliveryPage() {
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
                                    content: "Delivery Information",
                                },
                                {
                                    type: "hero_description",
                                    content: "Everything you need to know about our delivery services across India",
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
                        return [4 /*yield*/, supabase_1.supabase
                                .from("pages")
                                .insert({
                                title: "Delivery Information",
                                slug: "delivery-info",
                                content: defaultContent,
                                meta_title: "Delivery Information - Coverage & Timings",
                                meta_description: "Complete delivery information including coverage areas, timings, charges and tracking.",
                                is_active: true,
                                show_in_footer: true,
                                sort_order: 6,
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
                        console.error("Failed to create default delivery page:", error_2);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    }
    // Set SEO meta tags
    (0, react_1.useEffect)(function () {
        var title = (pageData === null || pageData === void 0 ? void 0 : pageData.meta_title) || "Delivery Information - Coverage & Timings";
        var description = (pageData === null || pageData === void 0 ? void 0 : pageData.meta_description) ||
            "Complete delivery information including coverage areas, timings, charges and tracking.";
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
    var defaultDeliverySections = [
        {
            id: "coverage",
            title: "Delivery Coverage",
            icon: <lucide_react_1.Globe className="h-5 w-5"/>,
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
            icon: <lucide_react_1.Clock className="h-5 w-5"/>,
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
            icon: <lucide_react_1.CreditCard className="h-5 w-5"/>,
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
            icon: <lucide_react_1.Package className="h-5 w-5"/>,
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
    var getDeliverySections = function () {
        var _a;
        if (!((_a = pageData === null || pageData === void 0 ? void 0 : pageData.content) === null || _a === void 0 ? void 0 : _a.blocks)) {
            return defaultDeliverySections;
        }
        var blocks = pageData.content.blocks;
        var parsedSections = [];
        // Try to find section-specific content from database
        blocks.forEach(function (block, index) {
            if (block.type === "delivery_section" && block.section_id) {
                var defaultSection = defaultDeliverySections.find(function (s) { return s.id === block.section_id; });
                if (defaultSection) {
                    parsedSections.push(__assign(__assign({}, defaultSection), { title: block.title || defaultSection.title, content: {
                            intro: block.intro || defaultSection.content.intro,
                            points: block.points || defaultSection.content.points,
                        } }));
                }
            }
        });
        // If no sections found in database, use defaults
        return parsedSections.length > 0 ? parsedSections : defaultDeliverySections;
    };
    var deliverySections = getDeliverySections();
    if (isLoading) {
        return (<div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
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
    return (<div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Banner */}
      <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 text-white py-20">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black opacity-20"></div>
          <div className="absolute top-10 left-10 w-20 h-20 bg-white opacity-10 rounded-full"></div>
          <div className="absolute bottom-10 right-10 w-16 h-16 bg-white opacity-10 rounded-full"></div>
          <div className="absolute top-1/2 right-1/4 w-12 h-12 bg-white opacity-10 rounded-full"></div>
        </div>
        <div className="relative container mx-auto px-4 text-center">
          <lucide_react_1.Truck className="h-16 w-16 mx-auto mb-6 opacity-90"/>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            {((_c = (_b = (_a = pageData === null || pageData === void 0 ? void 0 : pageData.content) === null || _a === void 0 ? void 0 : _a.blocks) === null || _b === void 0 ? void 0 : _b.find(function (b) { return b.type === "hero_title"; })) === null || _c === void 0 ? void 0 : _c.content) ||
            (pageData === null || pageData === void 0 ? void 0 : pageData.title) ||
            "Delivery Information"}
          </h1>
          <p className="text-xl md:text-2xl max-w-4xl mx-auto opacity-90">
            {((_f = (_e = (_d = pageData === null || pageData === void 0 ? void 0 : pageData.content) === null || _d === void 0 ? void 0 : _d.blocks) === null || _e === void 0 ? void 0 : _e.find(function (b) { return b.type === "hero_description"; })) === null || _f === void 0 ? void 0 : _f.content) ||
            "Everything you need to know about our delivery services across India"}
          </p>
          <div className="mt-8 bg-white/10 rounded-xl p-4 max-w-md mx-auto backdrop-blur-sm">
            <p className="text-sm opacity-90">
              Updated:{" "}
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
              Reliable Delivery Across India
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">
              We take pride in our efficient delivery network that ensures your
              flowers reach their destination fresh and on time. Our
              comprehensive delivery service covers major cities and remote
              areas across India.
            </p>
          </card_1.CardContent>
        </card_1.Card>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          {[
            {
                icon: <lucide_react_1.Globe className="h-6 w-6"/>,
                title: "100+ Cities",
                subtitle: "Pan-India coverage",
                color: "bg-blue-500",
            },
            {
                icon: <lucide_react_1.Clock className="h-6 w-6"/>,
                title: "Same Day",
                subtitle: "Delivery available",
                color: "bg-green-500",
            },
            {
                icon: <lucide_react_1.Shield className="h-6 w-6"/>,
                title: "Safe Delivery",
                subtitle: "Contactless options",
                color: "bg-purple-500",
            },
            {
                icon: <lucide_react_1.Star className="h-6 w-6"/>,
                title: "4.8★ Rating",
                subtitle: "Delivery excellence",
                color: "bg-orange-500",
            },
        ].map(function (stat, index) { return (<card_1.Card key={index} className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
              <card_1.CardContent className="p-6">
                <div className={"".concat(stat.color, " rounded-full p-3 w-12 h-12 mx-auto mb-4")}>
                  <div className="text-white">{stat.icon}</div>
                </div>
                <div className="text-2xl font-bold text-gray-800 mb-1">
                  {stat.title}
                </div>
                <div className="text-gray-600 text-sm">{stat.subtitle}</div>
              </card_1.CardContent>
            </card_1.Card>); })}
        </div>

        {/* Delivery Sections */}
        <div className="space-y-8">
          {deliverySections.map(function (section, index) { return (<card_1.Card key={section.id} className="border-0 shadow-lg">
              <card_1.CardHeader className="bg-blue-50 rounded-t-lg">
                <card_1.CardTitle className="flex items-center gap-3 text-2xl">
                  <div className="bg-blue-100 rounded-full p-2">
                    <div className="text-blue-600">{section.icon}</div>
                  </div>
                  <span>{section.title}</span>
                </card_1.CardTitle>
              </card_1.CardHeader>
              <card_1.CardContent className="p-8">
                <p className="text-gray-600 mb-6 leading-relaxed text-lg">
                  {section.content.intro}
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  {section.content.points.map(function (point, pointIndex) { return (<div key={pointIndex} className="flex items-start gap-3 text-gray-700">
                      <lucide_react_1.CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0"/>
                      <span className="leading-relaxed">{point}</span>
                    </div>); })}
                </div>
              </card_1.CardContent>
            </card_1.Card>); })}
        </div>

        {/* Contact Section */}
        <card_1.Card className="mt-12 border-0 shadow-2xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
          <card_1.CardContent className="p-12 text-center">
            <h2 className="text-3xl font-bold mb-6">Need Delivery Help?</h2>
            <p className="text-xl mb-8 opacity-90">
              Our delivery team is here to assist with all your questions
            </p>

            <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
              <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
                <lucide_react_1.Phone className="h-8 w-8 mx-auto mb-4"/>
                <h3 className="font-semibold mb-2">Call Us</h3>
                <p className="opacity-90">+91 98765 43210</p>
                <p className="text-sm opacity-75 mt-2">Delivery support team</p>
              </div>

              <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
                <lucide_react_1.Package className="h-8 w-8 mx-auto mb-4"/>
                <h3 className="font-semibold mb-2">Track Order</h3>
                <p className="opacity-90">Real-time updates</p>
                <p className="text-sm opacity-75 mt-2">SMS & Email alerts</p>
              </div>
            </div>

            <div className="mt-8 bg-white/10 rounded-xl p-4 max-w-lg mx-auto">
              <div className="flex items-center justify-center gap-2 mb-2">
                <lucide_react_1.Calendar className="h-4 w-4"/>
                <p className="text-sm font-semibold">Delivery Hours</p>
              </div>
              <p className="text-sm opacity-90">9:00 AM - 9:00 PM (All days)</p>
            </div>
          </card_1.CardContent>
        </card_1.Card>
      </div>
    </div>);
}
