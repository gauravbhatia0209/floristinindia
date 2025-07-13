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
exports.default = AboutUsPage;
var react_1 = require("react");
var card_1 = require("@/components/ui/card");
var badge_1 = require("@/components/ui/badge");
var lucide_react_1 = require("lucide-react");
var supabase_1 = require("@/lib/supabase");
function AboutUsPage() {
    var _a, _b, _c, _d, _e, _f;
    var _g = (0, react_1.useState)(null), pageData = _g[0], setPageData = _g[1];
    var _h = (0, react_1.useState)(true), isLoading = _h[0], setIsLoading = _h[1];
    (0, react_1.useEffect)(function () {
        fetchAboutPage();
        // Fallback timeout to prevent infinite loading
        var timeout = setTimeout(function () {
            if (isLoading) {
                console.warn("AboutUsPage: Fetch timeout, showing default content");
                setIsLoading(false);
                setPageData(null);
            }
        }, 10000); // 10 second timeout
        return function () { return clearTimeout(timeout); };
    }, [isLoading]);
    function fetchAboutPage() {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 5, 6, 7]);
                        console.log("AboutUsPage: Fetching about page data...");
                        return [4 /*yield*/, supabase_1.supabase
                                .from("pages")
                                .select("*")
                                .eq("slug", "about")
                                .eq("is_active", true)
                                .single()];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        console.log("AboutUsPage: Query result:", { data: data, error: error });
                        if (!(error && error.code === "PGRST116")) return [3 /*break*/, 3];
                        // No data found, create default record
                        console.log("AboutUsPage: No data found, creating default page...");
                        return [4 /*yield*/, createDefaultAboutPage()];
                    case 2:
                        _b.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        if (error) {
                            console.error("AboutUsPage: Database error:", error);
                            // Continue with fallback content instead of failing
                            setPageData(null);
                        }
                        else if (data) {
                            console.log("AboutUsPage: Setting page data:", data);
                            setPageData(data);
                        }
                        _b.label = 4;
                    case 4: return [3 /*break*/, 7];
                    case 5:
                        error_1 = _b.sent();
                        console.error("AboutUsPage: Failed to fetch about page:", error_1);
                        // Set pageData to null so component renders with default content
                        setPageData(null);
                        return [3 /*break*/, 7];
                    case 6:
                        console.log("AboutUsPage: Setting loading to false");
                        setIsLoading(false);
                        return [7 /*endfinally*/];
                    case 7: return [2 /*return*/];
                }
            });
        });
    }
    function createDefaultAboutPage() {
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
                                    content: "About Florist in India",
                                },
                                {
                                    type: "hero_description",
                                    content: "Your trusted destination for premium flowers, cakes, and gifts delivered across India with love and care.",
                                },
                                {
                                    type: "story_section",
                                    title: "Our Story",
                                    content: "Founded with a passion for bringing people closer through beautiful flowers, Florist in India has been serving customers across the nation with fresh, premium quality flowers and thoughtful gifts. We believe every occasion deserves to be celebrated with the perfect floral arrangement.",
                                },
                                {
                                    type: "mission_section",
                                    title: "Our Mission",
                                    content: "To make every celebration special by delivering fresh, beautiful flowers and gifts that express your emotions perfectly. We strive to connect hearts and spread joy through our carefully curated floral arrangements.",
                                },
                                {
                                    type: "contact_info",
                                    phone: "+91 98765 43210",
                                    email: "care@floristinindia.com",
                                },
                            ],
                        };
                        return [4 /*yield*/, supabase_1.supabase
                                .from("pages")
                                .insert({
                                title: "About Florist in India",
                                slug: "about",
                                content: defaultContent,
                                meta_title: "About Florist in India – Premium Flower Delivery",
                                meta_description: "Learn about Florist in India, your trusted partner for fresh flower delivery across 100+ Indian cities.",
                                is_active: true,
                                show_in_footer: true,
                                sort_order: 1,
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
                        console.error("Failed to create default about page:", error_2);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    }
    // Set SEO meta tags
    (0, react_1.useEffect)(function () {
        var title = (pageData === null || pageData === void 0 ? void 0 : pageData.meta_title) ||
            "About Florist in India – Premium Flower Delivery";
        var description = (pageData === null || pageData === void 0 ? void 0 : pageData.meta_description) ||
            "Learn about Florist in India, your trusted partner for fresh flower delivery across 100+ Indian cities.";
        document.title = title;
        var metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
            metaDesc = document.createElement("meta");
            metaDesc.setAttribute("name", "description");
            document.head.appendChild(metaDesc);
        }
        metaDesc.setAttribute("content", description);
    }, [pageData]);
    var renderContentBlocks = function (content) {
        if (!content || !content.blocks || !Array.isArray(content.blocks)) {
            return <DefaultAboutContent />;
        }
        return content.blocks.map(function (block, index) {
            switch (block.type) {
                case "heading":
                    return (<h2 key={index} className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 text-center">
              {typeof block.content === "string" ? block.content : ""}
            </h2>);
                case "text":
                case "paragraph":
                    var textContent_1 = typeof block.content === "string" ? block.content : "";
                    return (<div key={index} className="prose prose-lg max-w-none mb-8">
              <p className="text-lg text-gray-600 leading-relaxed text-center">
                {textContent_1.split("\\n").map(function (line, i) { return (<span key={i}>
                    {line}
                    {i < textContent_1.split("\\n").length - 1 && <br />}
                  </span>); })}
              </p>
            </div>);
                default:
                    return null;
            }
        });
    };
    console.log("AboutUsPage: Rendering with state:", {
        isLoading: isLoading,
        pageData: !!pageData,
    });
    if (isLoading) {
        return (<div className="min-h-screen bg-gradient-to-b from-rose-50 to-white">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="h-16 bg-gray-200 rounded animate-pulse w-96 mx-auto"></div>
            <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
            <div className="grid md:grid-cols-3 gap-8">
              {[1, 2, 3].map(function (i) { return (<div key={i} className="h-48 bg-gray-200 rounded animate-pulse"></div>); })}
            </div>
          </div>
        </div>
      </div>);
    }
    return (<div className="min-h-screen bg-gradient-to-b from-rose-50 to-white">
      {/* Hero Banner */}
      <div className="relative bg-gradient-to-r from-rose-500 via-pink-500 to-red-500 text-white py-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black opacity-20"></div>
          <div className="absolute top-10 left-10 w-20 h-20 bg-white opacity-10 rounded-full"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-white opacity-10 rounded-full"></div>
          <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-white opacity-10 rounded-full"></div>
        </div>
        <div className="relative container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
            {((_c = (_b = (_a = pageData === null || pageData === void 0 ? void 0 : pageData.content) === null || _a === void 0 ? void 0 : _a.blocks) === null || _b === void 0 ? void 0 : _b.find(function (b) { return b.type === "hero_title"; })) === null || _c === void 0 ? void 0 : _c.content) ||
            (pageData === null || pageData === void 0 ? void 0 : pageData.title) ||
            "About Florist in India"}
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90 leading-relaxed">
            {((_f = (_e = (_d = pageData === null || pageData === void 0 ? void 0 : pageData.content) === null || _d === void 0 ? void 0 : _d.blocks) === null || _e === void 0 ? void 0 : _e.find(function (b) { return b.type === "hero_description"; })) === null || _f === void 0 ? void 0 : _f.content) ||
            "Your trusted destination for premium flowers, cakes, and gifts delivered across India with love and care."}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-6xl">
        {/* Database Content or Default */}
        {(pageData === null || pageData === void 0 ? void 0 : pageData.content) ? (<div className="space-y-16">
            {renderContentBlocks(pageData.content)}
          </div>) : (<DefaultAboutContent />)}

        {/* Why Choose Us - Enhanced UI */}
        <section className="mt-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              Why Choose Florist in India?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We're committed to delivering not just flowers, but moments of joy
              and memories that last forever.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
            {
                icon: <lucide_react_1.Clock className="h-8 w-8 text-rose-600"/>,
                title: "Same Day Delivery",
                description: "Express delivery for your urgent celebrations across 100+ cities",
            },
            {
                icon: <lucide_react_1.Shield className="h-8 w-8 text-rose-600"/>,
                title: "Quality Guarantee",
                description: "Fresh flowers sourced daily with 100% quality assurance",
            },
            {
                icon: <lucide_react_1.Phone className="h-8 w-8 text-rose-600"/>,
                title: "24/7 Support",
                description: "Round-the-clock customer support for all your queries",
            },
            {
                icon: <lucide_react_1.Truck className="h-8 w-8 text-rose-600"/>,
                title: "PAN India Coverage",
                description: "Delivering happiness to 100+ cities across India",
            },
            {
                icon: <lucide_react_1.Heart className="h-8 w-8 text-rose-600"/>,
                title: "Custom Arrangements",
                description: "Personalized flower arrangements for every special occasion",
            },
            {
                icon: <lucide_react_1.Award className="h-8 w-8 text-rose-600"/>,
                title: "Trusted Brand",
                description: "4.8+ star rating from 20,000+ satisfied customers",
            },
        ].map(function (feature, index) { return (<card_1.Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                <card_1.CardContent className="p-8 text-center">
                  <div className="bg-rose-100 rounded-full p-4 w-16 h-16 mx-auto mb-6 group-hover:bg-rose-200 transition-colors">
                    {feature.icon}
                  </div>
                  <h3 className="font-bold text-xl mb-4 text-gray-800">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </card_1.CardContent>
              </card_1.Card>); })}
          </div>
        </section>

        {/* Statistics Section */}
        <section className="mt-20 bg-gradient-to-r from-rose-500 to-pink-600 rounded-3xl p-12 text-white">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Impact in Numbers</h2>
            <p className="text-xl opacity-90">
              Spreading joy across India, one flower at a time
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
            { number: "100+", label: "Cities Covered" },
            { number: "20K+", label: "Happy Customers" },
            { number: "4.8★", label: "Average Rating" },
            { number: "24/7", label: "Customer Support" },
        ].map(function (stat, index) { return (<div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold mb-2">
                  {stat.number}
                </div>
                <div className="text-lg opacity-90">{stat.label}</div>
              </div>); })}
          </div>
        </section>

        {/* Customer Testimonial */}
        <section className="mt-20">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-12">
              What Our Customers Say
            </h2>

            <card_1.Card className="border-0 shadow-2xl">
              <card_1.CardContent className="p-12">
                <div className="flex justify-center mb-6">
                  {[1, 2, 3, 4, 5].map(function (star) { return (<lucide_react_1.Star key={star} className="h-6 w-6 text-yellow-400 fill-current"/>); })}
                </div>
                <blockquote className="text-xl text-gray-700 mb-8 leading-relaxed italic">
                  "Florist in India made my anniversary extra special! The
                  flowers were incredibly fresh, beautifully arranged, and
                  delivered exactly on time. The quality exceeded my
                  expectations, and my wife was absolutely delighted. Highly
                  recommended!"
                </blockquote>
                <div className="flex items-center justify-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-rose-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    R
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-gray-800">
                      Rahul Sharma
                    </div>
                    <div className="text-sm text-gray-600">
                      Mumbai, Maharashtra
                    </div>
                  </div>
                </div>
              </card_1.CardContent>
            </card_1.Card>
          </div>
        </section>

        {/* Coverage Map */}
        <section className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              <lucide_react_1.MapPin className="inline h-8 w-8 text-rose-600 mr-3"/>
              Delivered Across India
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We proudly serve customers in major cities and towns across India
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 text-center">
            {[
            "Delhi NCR",
            "Mumbai",
            "Bangalore",
            "Pune",
            "Hyderabad",
            "Chennai",
            "Kolkata",
            "Ahmedabad",
            "Jalandhar",
            "Chandigarh",
            "Lucknow",
            "Jaipur",
            "Indore",
            "Bhopal",
            "Nagpur",
            "Surat",
            "Vadodara",
            "Agra",
        ].map(function (city) { return (<badge_1.Badge key={city} variant="outline" className="p-3 text-sm border-rose-200 hover:bg-rose-50 transition-colors">
                {city}
              </badge_1.Badge>); })}
          </div>

          <div className="text-center mt-8">
            <p className="text-lg font-semibold text-gray-700">
              ...and 100+ more locations!
            </p>
          </div>
        </section>
      </div>
    </div>);
}
// Default content component when no database content is available
function DefaultAboutContent() {
    return (<div className="space-y-16">
      <section className="text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8">
          Who We Are
        </h2>
        <div className="max-w-4xl mx-auto">
          <p className="text-lg text-gray-600 leading-relaxed mb-8">
            Florist in India is your premier destination for fresh flower
            delivery services across India. With over 5 years of experience in
            the floral industry, we have built a reputation for excellence,
            reliability, and customer satisfaction. Our journey began with a
            simple mission: to spread joy and love through the beauty of fresh
            flowers.
          </p>
        </div>
      </section>

      <section className="text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8">
          Our Mission
        </h2>
        <div className="max-w-4xl mx-auto">
          <p className="text-lg text-gray-600 leading-relaxed">
            We aim to connect hearts and emotions through the universal language
            of flowers. Whether celebrating love, expressing sympathy,
            congratulating achievements, or simply brightening someone's day, we
            believe every moment deserves to be made special with beautiful
            blooms.
          </p>
        </div>
      </section>
    </div>);
}
