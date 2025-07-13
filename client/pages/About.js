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
exports.default = About;
var react_1 = require("react");
var supabase_1 = require("@/lib/supabase");
var card_1 = require("@/components/ui/card");
var badge_1 = require("@/components/ui/badge");
var lucide_react_1 = require("lucide-react");
function About() {
    var _a = (0, react_1.useState)(null), pageData = _a[0], setPageData = _a[1];
    var _b = (0, react_1.useState)(true), isLoading = _b[0], setIsLoading = _b[1];
    (0, react_1.useEffect)(function () {
        fetchAboutPage();
    }, []);
    function fetchAboutPage() {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, 3, 4]);
                        return [4 /*yield*/, supabase_1.supabase
                                .from("pages")
                                .select("*")
                                .eq("slug", "about")
                                .eq("is_active", true)
                                .single()];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error) {
                            console.error("Database error:", error);
                            // If no page found, that's okay, we'll use fallback content
                            if (error.code !== "PGRST116") {
                                // PGRST116 is "no rows returned"
                                console.error("Unexpected database error:", error);
                            }
                        }
                        else if (data) {
                            console.log("About page data loaded:", data);
                            console.log("Content type:", typeof data.content);
                            console.log("Content value:", data.content);
                            setPageData(data);
                        }
                        return [3 /*break*/, 4];
                    case 2:
                        error_1 = _b.sent();
                        console.error("Failed to fetch about page:", error_1);
                        return [3 /*break*/, 4];
                    case 3:
                        setIsLoading(false);
                        return [7 /*endfinally*/];
                    case 4: return [2 /*return*/];
                }
            });
        });
    }
    (0, react_1.useEffect)(function () {
        // Set default SEO or use data from database
        var title = (pageData === null || pageData === void 0 ? void 0 : pageData.meta_title) ||
            "About Florist in India – Premium Flower Delivery Across India";
        var description = (pageData === null || pageData === void 0 ? void 0 : pageData.meta_description) ||
            "Florist in India offers premium flowers, cakes, and gifts delivered across 100+ Indian cities with love, care, and speed. Learn more about our story.";
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
        return (<div className="min-h-screen bg-gradient-to-b from-rose-50 to-white">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="h-12 bg-gray-200 rounded animate-pulse w-96 mx-auto"></div>
            <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="h-48 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-48 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>);
    }
    var renderContentBlocks = function (content) {
        if (!content || !content.blocks || !Array.isArray(content.blocks)) {
            return (<div className="text-center py-12">
          <h1 className="text-3xl font-bold mb-4">About Us</h1>
          <p className="text-lg text-gray-600">
            About Us content is being updated. Please check back soon.
          </p>
        </div>);
        }
        return (<div className="max-w-6xl mx-auto">
        {content.blocks.map(function (block, index) {
                switch (block.type) {
                    case "heading":
                        return (<h1 key={index} className="text-4xl font-bold mb-8 text-center">
                  {block.content}
                </h1>);
                    case "text":
                    case "paragraph":
                        return (<p key={index} className="text-lg text-gray-700 mb-6 leading-relaxed">
                  {block.content}
                </p>);
                    case "image":
                        return (<img key={index} src={block.url || block.content} alt={block.alt || ""} className="w-full max-w-4xl mx-auto rounded-lg mb-8"/>);
                    case "button":
                        return (<div key={index} className="text-center mb-8">
                  <a href={block.url || "#"} className="inline-block bg-rose-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-rose-600 transition-colors">
                    {block.content || block.text}
                  </a>
                </div>);
                    case "list":
                        return (<ul key={index} className="list-disc list-inside mb-8 text-lg">
                  {(block.items || []).map(function (item, itemIndex) { return (<li key={itemIndex} className="text-gray-700 mb-2">
                        {item}
                      </li>); })}
                </ul>);
                    default:
                        return (<div key={index} className="text-lg text-gray-700 mb-6">
                  {block.content || ""}
                </div>);
                }
            })}
      </div>);
    };
    // If page data exists from database, use it
    if (pageData && pageData.content) {
        // Handle different content formats
        if (typeof pageData.content === "string") {
            // If content is a string, render as HTML
            return (<div className="min-h-screen bg-gradient-to-b from-rose-50 to-white">
          <div className="container mx-auto px-4 py-12">
            <div className="max-w-6xl mx-auto">
              <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: pageData.content }}/>
            </div>
          </div>
        </div>);
        }
        else {
            // If content is an object with blocks, render using block renderer
            return (<div className="min-h-screen bg-gradient-to-b from-rose-50 to-white">
          <div className="container mx-auto px-4 py-12">
            {renderContentBlocks(pageData.content)}
          </div>
        </div>);
        }
    }
    // Fallback content if no database content exists
    return (<div className="min-h-screen bg-gradient-to-b from-rose-50 to-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-rose-500 to-pink-600 text-white py-20">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            About Florist in India
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90">
            Your trusted destination for premium flowers, cakes, and gifts
            delivered across India with love and care.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-6xl space-y-16">
        {/* Who We Are */}
        <section className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8">
            Who We Are
          </h2>
          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              Florist in India is your trusted destination for premium flower,
              cake, and gift delivery services across India. With a strong
              presence in over 100+ cities including Delhi NCR, Mumbai,
              Bangalore, and Jalandhar, we ensure every celebration feels
              special—no matter the distance.
            </p>
            <div className="flex justify-center items-center gap-8 flex-wrap">
              <div className="text-center">
                <div className="text-3xl font-bold text-rose-500">100+</div>
                <div className="text-gray-600">Cities Covered</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-rose-500">20,000+</div>
                <div className="text-gray-600">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-rose-500">4.8★</div>
                <div className="text-gray-600">Average Rating</div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-12 text-center">
            Why Choose Us
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-rose-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <lucide_react_1.Clock className="h-8 w-8 text-rose-600"/>
              </div>
              <h3 className="font-semibold text-lg mb-2">Same Day Delivery</h3>
              <p className="text-gray-600">
                Express delivery for your urgent celebrations
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-rose-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <lucide_react_1.MapPin className="h-8 w-8 text-rose-600"/>
              </div>
              <h3 className="font-semibold text-lg mb-2">
                100+ Cities Covered
              </h3>
              <p className="text-gray-600">Nationwide presence across India</p>
            </div>

            <div className="text-center p-6">
              <div className="bg-rose-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <lucide_react_1.Phone className="h-8 w-8 text-rose-600"/>
              </div>
              <h3 className="font-semibold text-lg mb-2">24/7 Support</h3>
              <p className="text-gray-600">
                Round-the-clock customer assistance
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-rose-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <lucide_react_1.Gift className="h-8 w-8 text-rose-600"/>
              </div>
              <h3 className="font-semibold text-lg mb-2">Custom Gift Combos</h3>
              <p className="text-gray-600">
                Personalized gifts for every occasion
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-rose-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <lucide_react_1.CreditCard className="h-8 w-8 text-rose-600"/>
              </div>
              <h3 className="font-semibold text-lg mb-2">Secure Payments</h3>
              <p className="text-gray-600">
                Safe and encrypted payment options
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-rose-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <lucide_react_1.Heart className="h-8 w-8 text-rose-600"/>
              </div>
              <h3 className="font-semibold text-lg mb-2">Fresh Flowers</h3>
              <p className="text-gray-600">Handpicked fresh blooms daily</p>
            </div>
          </div>
        </section>

        {/* Our Mission */}
        <section className="text-center bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-2xl p-8 md:p-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">Our Mission</h2>
          <p className="text-xl leading-relaxed max-w-4xl mx-auto">
            We aim to connect emotions through fresh blooms. Whether it's a
            birthday, anniversary, wedding, or a simple "thinking of you"—we
            help you say it beautifully. Our mission is to spread joy, love, and
            happiness through the universal language of flowers.
          </p>
        </section>

        {/* Customer Love & Trust */}
        <section>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-12 text-center">
            Customer Love & Trust
          </h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="bg-yellow-100 rounded-full p-3">
                    <lucide_react_1.Star className="h-6 w-6 text-yellow-600"/>
                  </div>
                  <div>
                    <div className="font-semibold text-lg">
                      4.8+ Star Reviews
                    </div>
                    <div className="text-gray-600">
                      Consistently rated excellent by customers
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="bg-blue-100 rounded-full p-3">
                    <lucide_react_1.Users className="h-6 w-6 text-blue-600"/>
                  </div>
                  <div>
                    <div className="font-semibold text-lg">
                      20,000+ Happy Customers
                    </div>
                    <div className="text-gray-600">
                      Trusted by families across India
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="bg-green-100 rounded-full p-3">
                    <lucide_react_1.Truck className="h-6 w-6 text-green-600"/>
                  </div>
                  <div>
                    <div className="font-semibold text-lg">
                      99% On-Time Delivery
                    </div>
                    <div className="text-gray-600">
                      Reliable and punctual service
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <card_1.Card className="p-6">
              <card_1.CardContent className="p-0">
                <blockquote className="text-lg italic text-gray-700 mb-4">
                  "Florist in India made my anniversary extra special! The
                  flowers were fresh, beautiful, and delivered right on time.
                  Highly recommended!"
                </blockquote>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-rose-500 rounded-full flex items-center justify-center text-white font-semibold">
                    S
                  </div>
                  <div>
                    <div className="font-semibold">Shreya Patel</div>
                    <div className="text-sm text-gray-600">Mumbai</div>
                  </div>
                </div>
              </card_1.CardContent>
            </card_1.Card>
          </div>
        </section>

        {/* Nationwide Delivery */}
        <section className="bg-gray-50 rounded-2xl p-8 md:p-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8 text-center">
            Delivered Across India
          </h2>
          <p className="text-center text-lg text-gray-600 mb-8">
            We proudly serve customers in major cities and towns across India
          </p>

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
        ].map(function (city) { return (<badge_1.Badge key={city} variant="outline" className="p-3 text-sm">
                {city}
              </badge_1.Badge>); })}
          </div>

          <div className="text-center mt-8">
            <p className="text-lg font-semibold text-gray-700">
              ...and 100+ more locations!
            </p>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <div className="bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-2xl p-8 md:p-12">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Spread Some Joy?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Browse our collection and send love to your dear ones today!
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <a href="/products" className="bg-white text-rose-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors">
                Shop Flowers
              </a>
              <a href="/contact" className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-rose-600 transition-colors">
                Contact Us
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>);
}
