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
exports.default = ReturnRefundPage;
var react_1 = require("react");
var card_1 = require("@/components/ui/card");
var badge_1 = require("@/components/ui/badge");
var button_1 = require("@/components/ui/button");
var lucide_react_1 = require("lucide-react");
var supabase_1 = require("@/lib/supabase");
function ReturnRefundPage() {
    var _a, _b, _c, _d, _e, _f;
    var _g = (0, react_1.useState)(null), pageData = _g[0], setPageData = _g[1];
    var _h = (0, react_1.useState)(true), isLoading = _h[0], setIsLoading = _h[1];
    (0, react_1.useEffect)(function () {
        fetchRefundPage();
    }, []);
    function fetchRefundPage() {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 5, 6, 7]);
                        return [4 /*yield*/, supabase_1.supabase
                                .from("pages")
                                .select("*")
                                .eq("slug", "return-refunds")
                                .eq("is_active", true)
                                .single()];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (!(error && error.code === "PGRST116")) return [3 /*break*/, 3];
                        // No data found, create default record
                        return [4 /*yield*/, createDefaultRefundPage()];
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
                        console.error("Failed to fetch refund page:", error_1);
                        return [3 /*break*/, 7];
                    case 6:
                        setIsLoading(false);
                        return [7 /*endfinally*/];
                    case 7: return [2 /*return*/];
                }
            });
        });
    }
    function createDefaultRefundPage() {
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
                                    content: "Return & Refunds Policy",
                                },
                                {
                                    type: "hero_description",
                                    content: "Fair refund and replacement policies for flower delivery orders",
                                },
                                {
                                    type: "policy_section",
                                    title: "Refund Eligibility",
                                    content: "We offer refunds for orders that don't meet our quality standards or delivery commitments. Refunds are processed within 5-7 business days.",
                                },
                                {
                                    type: "policy_section",
                                    title: "Replacement Policy",
                                    content: "If you receive damaged or poor quality flowers, we'll provide a free replacement within 6 hours of delivery notification.",
                                },
                                {
                                    type: "contact_info",
                                    phone: "+91 98765 43210",
                                    email: "refunds@floristinindia.com",
                                },
                            ],
                        };
                        return [4 /*yield*/, supabase_1.supabase
                                .from("pages")
                                .insert({
                                title: "Return & Refunds Policy",
                                slug: "return-refunds",
                                content: defaultContent,
                                meta_title: "Return & Refunds Policy",
                                meta_description: "Fair refund and replacement policies for flower delivery orders.",
                                is_active: true,
                                show_in_footer: true,
                                sort_order: 3,
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
                        console.error("Failed to create default refund page:", error_2);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    }
    // Set SEO meta tags
    (0, react_1.useEffect)(function () {
        var title = (pageData === null || pageData === void 0 ? void 0 : pageData.meta_title) || "Return & Refunds Policy";
        var description = (pageData === null || pageData === void 0 ? void 0 : pageData.meta_description) ||
            "Fair refund and replacement policies for flower delivery orders.";
        document.title = title;
        var metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
            metaDesc = document.createElement("meta");
            metaDesc.setAttribute("name", "description");
            document.head.appendChild(metaDesc);
        }
        metaDesc.setAttribute("content", description);
    }, [pageData]);
    if (isLoading) {
        return (<div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="h-16 bg-gray-200 rounded animate-pulse w-96 mx-auto"></div>
            <div className="grid md:grid-cols-2 gap-8">
              {[1, 2].map(function (i) { return (<div key={i} className="h-64 bg-gray-200 rounded animate-pulse"></div>); })}
            </div>
          </div>
        </div>
      </div>);
    }
    return (<div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Hero Banner */}
      <div className="relative bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white py-20">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black opacity-20"></div>
          <div className="absolute top-10 left-10 w-20 h-20 bg-white opacity-10 rounded-full"></div>
          <div className="absolute bottom-10 right-10 w-16 h-16 bg-white opacity-10 rounded-full"></div>
        </div>
        <div className="relative container mx-auto px-4 text-center">
          <lucide_react_1.Shield className="h-16 w-16 mx-auto mb-6 opacity-90"/>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            {((_c = (_b = (_a = pageData === null || pageData === void 0 ? void 0 : pageData.content) === null || _a === void 0 ? void 0 : _a.blocks) === null || _b === void 0 ? void 0 : _b.find(function (b) { return b.type === "hero_title"; })) === null || _c === void 0 ? void 0 : _c.content) ||
            (pageData === null || pageData === void 0 ? void 0 : pageData.title) ||
            "Return & Refunds Policy"}
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90">
            {((_f = (_e = (_d = pageData === null || pageData === void 0 ? void 0 : pageData.content) === null || _d === void 0 ? void 0 : _d.blocks) === null || _e === void 0 ? void 0 : _e.find(function (b) { return b.type === "hero_description"; })) === null || _f === void 0 ? void 0 : _f.content) ||
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
                icon: <lucide_react_1.Clock className="h-6 w-6"/>,
                title: "24 Hours",
                subtitle: "To report issues",
                color: "bg-blue-500",
            },
            {
                icon: <lucide_react_1.RefreshCw className="h-6 w-6"/>,
                title: "6 Hours",
                subtitle: "For replacements",
                color: "bg-green-500",
            },
            {
                icon: <lucide_react_1.CreditCard className="h-6 w-6"/>,
                title: "5-7 Days",
                subtitle: "Refund processing",
                color: "bg-purple-500",
            },
            {
                icon: <lucide_react_1.Shield className="h-6 w-6"/>,
                title: "100%",
                subtitle: "Quality guarantee",
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

        {/* Main Content Sections */}
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Refund Eligibility */}
          <card_1.Card className="border-0 shadow-lg">
            <card_1.CardHeader className="bg-green-50 rounded-t-lg">
              <card_1.CardTitle className="flex items-center gap-3 text-2xl">
                <lucide_react_1.CheckCircle className="h-6 w-6 text-green-600"/>
                Refund Eligibility
              </card_1.CardTitle>
            </card_1.CardHeader>
            <card_1.CardContent className="p-8">
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
        ].map(function (item, index) { return (<div key={index} className="flex items-start gap-3">
                    <lucide_react_1.CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0"/>
                    <p className="text-gray-700">{item}</p>
                  </div>); })}
              </div>
            </card_1.CardContent>
          </card_1.Card>

          {/* Non-Refundable Items */}
          <card_1.Card className="border-0 shadow-lg">
            <card_1.CardHeader className="bg-red-50 rounded-t-lg">
              <card_1.CardTitle className="flex items-center gap-3 text-2xl">
                <lucide_react_1.XCircle className="h-6 w-6 text-red-600"/>
                Non-Refundable Items
              </card_1.CardTitle>
            </card_1.CardHeader>
            <card_1.CardContent className="p-8">
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
        ].map(function (item, index) { return (<div key={index} className="flex items-start gap-3">
                    <lucide_react_1.XCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0"/>
                    <p className="text-gray-700">{item}</p>
                  </div>); })}
              </div>
            </card_1.CardContent>
          </card_1.Card>
        </div>

        {/* Refund Process */}
        <card_1.Card className="mt-12 border-0 shadow-lg">
          <card_1.CardHeader className="bg-blue-50 rounded-t-lg">
            <card_1.CardTitle className="flex items-center gap-3 text-2xl">
              <lucide_react_1.FileText className="h-6 w-6 text-blue-600"/>
              Refund Process
            </card_1.CardTitle>
          </card_1.CardHeader>
          <card_1.CardContent className="p-8">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                  <lucide_react_1.Phone className="h-8 w-8 text-blue-600"/>
                </div>
                <h3 className="font-bold text-lg mb-3">1. Contact Support</h3>
                <p className="text-gray-600">
                  Reach out to our customer support within 24 hours of delivery
                  with your order details and photos if applicable.
                </p>
              </div>

              <div className="text-center">
                <div className="bg-purple-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                  <lucide_react_1.AlertTriangle className="h-8 w-8 text-purple-600"/>
                </div>
                <h3 className="font-bold text-lg mb-3">2. Review Process</h3>
                <p className="text-gray-600">
                  Our team will review your request and may ask for additional
                  information or photos to process your claim.
                </p>
              </div>

              <div className="text-center">
                <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                  <lucide_react_1.CreditCard className="h-8 w-8 text-green-600"/>
                </div>
                <h3 className="font-bold text-lg mb-3">3. Resolution</h3>
                <p className="text-gray-600">
                  Once approved, refunds will be processed within 5-7 business
                  days to your original payment method.
                </p>
              </div>
            </div>
          </card_1.CardContent>
        </card_1.Card>

        {/* Replacement Policy */}
        <card_1.Card className="mt-12 border-0 shadow-lg">
          <card_1.CardHeader className="bg-orange-50 rounded-t-lg">
            <card_1.CardTitle className="flex items-center gap-3 text-2xl">
              <lucide_react_1.RefreshCw className="h-6 w-6 text-orange-600"/>
              Replacement Policy
            </card_1.CardTitle>
          </card_1.CardHeader>
          <card_1.CardContent className="p-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <p className="text-lg text-gray-700 mb-4">
                  For quality issues, we offer free replacements subject to
                  availability and location.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <lucide_react_1.Calendar className="h-5 w-5 text-orange-600"/>
                    <span className="font-medium">
                      Request within 6 hours of delivery
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <lucide_react_1.CheckCircle className="h-5 w-5 text-orange-600"/>
                    <span className="font-medium">
                      Subject to product availability
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <lucide_react_1.Shield className="h-5 w-5 text-orange-600"/>
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
                <badge_1.Badge className="bg-orange-500 text-white">
                  Same-day replacement available
                </badge_1.Badge>
              </div>
            </div>
          </card_1.CardContent>
        </card_1.Card>

        {/* Contact Section */}
        <card_1.Card className="mt-12 border-0 shadow-2xl bg-gradient-to-r from-green-500 to-emerald-600 text-white">
          <card_1.CardContent className="p-12 text-center">
            <h2 className="text-3xl font-bold mb-6">
              Need to Request a Refund?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Our support team is ready to help you with your refund request
            </p>

            <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
              <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
                <lucide_react_1.Phone className="h-8 w-8 mx-auto mb-4"/>
                <h3 className="font-semibold mb-2">Call Us</h3>
                <p className="opacity-90 text-lg">+91 98765 43210</p>
                <p className="text-sm opacity-75 mt-2">
                  Monday to Sunday: 9:00 AM - 9:00 PM
                </p>
              </div>

              <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
                <lucide_react_1.Mail className="h-8 w-8 mx-auto mb-4"/>
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

            <button_1.Button className="mt-8 bg-white text-green-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold" size="lg">
              Contact Support Now
            </button_1.Button>
          </card_1.CardContent>
        </card_1.Card>
      </div>
    </div>);
}
