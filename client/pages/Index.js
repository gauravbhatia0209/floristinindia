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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Index;
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var lucide_react_1 = require("lucide-react");
var button_1 = require("@/components/ui/button");
var card_1 = require("@/components/ui/card");
var badge_1 = require("@/components/ui/badge");
var input_1 = require("@/components/ui/input");
var supabase_1 = require("@/lib/supabase");
var useCart_1 = require("@/hooks/useCart");
var use_toast_1 = require("@/hooks/use-toast");
var HeroCarousel_1 = require("@/components/HeroCarousel");
function Index() {
    var _a = (0, react_1.useState)([]), sections = _a[0], setSections = _a[1];
    var _b = (0, react_1.useState)([]), categories = _b[0], setCategories = _b[1];
    var _c = (0, react_1.useState)([]), featuredProducts = _c[0], setFeaturedProducts = _c[1];
    var _d = (0, react_1.useState)(true), isLoading = _d[0], setIsLoading = _d[1];
    var addItem = (0, useCart_1.useCart)().addItem;
    (0, react_1.useEffect)(function () {
        fetchHomepageData();
    }, []);
    function loadFallbackProducts() {
        return __awaiter(this, void 0, void 0, function () {
            var _a, fallbackData, fallbackError;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        console.log("🔄 Loading fallback featured products...");
                        return [4 /*yield*/, supabase_1.supabase
                                .from("products")
                                .select("\n        id,\n        name,\n        slug,\n        price,\n        sale_price,\n        images,\n        is_active\n      ")
                                .eq("is_active", true)
                                .eq("is_featured", true)
                                .limit(8)];
                    case 1:
                        _a = _b.sent(), fallbackData = _a.data, fallbackError = _a.error;
                        if (fallbackError) {
                            console.error("🚨 Fallback products error:");
                            console.error("Fallback error details:", JSON.stringify(fallbackError, null, 2));
                            console.error("Fallback error message:", fallbackError === null || fallbackError === void 0 ? void 0 : fallbackError.message);
                            console.error("Fallback error code:", fallbackError === null || fallbackError === void 0 ? void 0 : fallbackError.code);
                            console.error("Fallback error hint:", fallbackError === null || fallbackError === void 0 ? void 0 : fallbackError.hint);
                        }
                        if (fallbackData && fallbackData.length > 0) {
                            console.log("✅ Loaded fallback featured products:", fallbackData);
                            setFeaturedProducts(fallbackData);
                        }
                        else {
                            console.warn("⚠️ No fallback products found either");
                            setFeaturedProducts([]);
                        }
                        return [2 /*return*/];
                }
            });
        });
    }
    function handleAddToCart(product, e) {
        e.preventDefault();
        e.stopPropagation();
        try {
            addItem({
                product_id: product.id,
                product: product, // Include full product data
                variant_id: null, // No variant selected from product showcase
                quantity: 1,
            });
            console.log("✅ Successfully added to cart:", product.name);
            // Show success notification
            (0, use_toast_1.toast)({
                title: "Added to cart!",
                description: "".concat(product.name, " has been added to your cart."),
                variant: "default",
            });
        }
        catch (error) {
            console.error("�� Failed to add to cart:", error);
            // Show error notification
            (0, use_toast_1.toast)({
                title: "Error",
                description: "Failed to add item to cart. Please try again.",
                variant: "destructive",
            });
        }
    }
    function fetchHomepageData() {
        return __awaiter(this, void 0, void 0, function () {
            var _a, testData, testError, _b, sectionsData, sectionsError, categorySection, productSection, categoriesData_1, sortedCategories, categoriesData, selectedProductIds, _c, allProducts, allProductsError, _d, productsData_1, productsError, sortedProducts, error_1;
            var _e, _f, _g, _h, _j;
            return __generator(this, function (_k) {
                switch (_k.label) {
                    case 0:
                        _k.trys.push([0, 20, 21, 22]);
                        console.log("🔍 Starting to fetch homepage sections...");
                        return [4 /*yield*/, supabase_1.supabase
                                .from("homepage_sections")
                                .select("id, type")
                                .limit(1)];
                    case 1:
                        _a = _k.sent(), testData = _a.data, testError = _a.error;
                        console.log("🔍 Test query result:", { testData: testData, testError: testError });
                        return [4 /*yield*/, supabase_1.supabase
                                .from("homepage_sections")
                                .select("*")
                                .eq("is_active", true)
                                .order("sort_order")];
                    case 2:
                        _b = _k.sent(), sectionsData = _b.data, sectionsError = _b.error;
                        if (sectionsError) {
                            console.error("🚨 Homepage: Error fetching sections:");
                            console.error("Error details:", JSON.stringify(sectionsError, null, 2));
                            console.error("Error message:", sectionsError.message);
                            console.error("Error code:", sectionsError.code);
                            return [2 /*return*/];
                        }
                        if (!sectionsData) return [3 /*break*/, 19];
                        console.log("Homepage: Loaded sections from database:", sectionsData);
                        setSections(sectionsData);
                        categorySection = sectionsData.find(function (s) { return s.type === "category_grid"; });
                        productSection = sectionsData.find(function (s) { return s.type === "product_carousel"; });
                        console.log("🏠 Homepage: All sections loaded:", sectionsData);
                        console.log("🏠 Homepage: Section types found:", sectionsData.map(function (s) { return s.type; }));
                        console.log("🏠 Homepage: Category section found:", categorySection);
                        console.log("🏠 Homepage: Product section found:", productSection);
                        // Debug the product section content structure
                        if (productSection) {
                            console.log("🔍 Product section full content:", JSON.stringify(productSection.content, null, 2));
                            console.log("🔍 Product section selected_products:", (_e = productSection.content) === null || _e === void 0 ? void 0 : _e.selected_products);
                        }
                        else {
                            console.warn("⚠️ No product_carousel section found in sections:", sectionsData.map(function (s) { return ({ type: s.type, title: s.title }); }));
                        }
                        if (!(((_g = (_f = categorySection === null || categorySection === void 0 ? void 0 : categorySection.content) === null || _f === void 0 ? void 0 : _f.selected_categories) === null || _g === void 0 ? void 0 : _g.length) > 0)) return [3 /*break*/, 4];
                        return [4 /*yield*/, supabase_1.supabase
                                .from("product_categories")
                                .select("*")
                                .in("id", categorySection.content.selected_categories)
                                .eq("is_active", true)];
                    case 3:
                        categoriesData_1 = (_k.sent()).data;
                        if (categoriesData_1) {
                            sortedCategories = categorySection.content.selected_categories
                                .map(function (id) { return categoriesData_1.find(function (cat) { return cat.id === id; }); })
                                .filter(Boolean);
                            setCategories(sortedCategories);
                        }
                        return [3 /*break*/, 6];
                    case 4: return [4 /*yield*/, supabase_1.supabase
                            .from("product_categories")
                            .select("*")
                            .eq("is_active", true)
                            .eq("show_in_menu", true)
                            .order("sort_order")
                            .limit(8)];
                    case 5:
                        categoriesData = (_k.sent()).data;
                        if (categoriesData)
                            setCategories(categoriesData);
                        _k.label = 6;
                    case 6:
                        if (!(((_j = (_h = productSection === null || productSection === void 0 ? void 0 : productSection.content) === null || _h === void 0 ? void 0 : _h.selected_products) === null || _j === void 0 ? void 0 : _j.length) > 0)) return [3 /*break*/, 17];
                        selectedProductIds = productSection.content.selected_products;
                        console.log("🎯 Product Showcase: Found product section with content:", productSection);
                        console.log("🎯 Product Showcase: Admin-selected product IDs:", selectedProductIds);
                        console.log("🎯 Product Showcase: ID types:", selectedProductIds.map(function (id) { return typeof id; }));
                        console.log("🎯 Product Showcase: Fetching products with query - product.id IN", selectedProductIds);
                        return [4 /*yield*/, supabase_1.supabase
                                .from("products")
                                .select("id, name, is_active")
                                .eq("is_active", true)];
                    case 7:
                        _c = _k.sent(), allProducts = _c.data, allProductsError = _c.error;
                        console.log("🔍 All active products in database:", allProducts);
                        console.log("🔍 All products error:", allProductsError);
                        return [4 /*yield*/, supabase_1.supabase
                                .from("products")
                                .select("\n              id,\n              name,\n              slug,\n              price,\n              sale_price,\n              images,\n              is_active\n            ")
                                .in("id", selectedProductIds)
                                .eq("is_active", true)];
                    case 8:
                        _d = _k.sent(), productsData_1 = _d.data, productsError = _d.error;
                        console.log("������ Product Showcase: Raw query results:", productsData_1);
                        console.log("🎯 Product Showcase: Query error (if any):", productsError);
                        console.log("🕐 Query executed at:", new Date().toISOString());
                        if (!productsError) return [3 /*break*/, 10];
                        console.error("🚨 Product Showcase: Database error:");
                        console.error("Products error details:", JSON.stringify(productsError, null, 2));
                        console.error("Products error message:", productsError === null || productsError === void 0 ? void 0 : productsError.message);
                        console.error("Products error code:", productsError === null || productsError === void 0 ? void 0 : productsError.code);
                        console.error("Products error hint:", productsError === null || productsError === void 0 ? void 0 : productsError.hint);
                        return [4 /*yield*/, loadFallbackProducts()];
                    case 9:
                        _k.sent();
                        return [2 /*return*/];
                    case 10:
                        console.log("📊 Product Showcase: Query returned", (productsData_1 === null || productsData_1 === void 0 ? void 0 : productsData_1.length) || 0, "products");
                        if (!(productsData_1 && productsData_1.length > 0)) return [3 /*break*/, 14];
                        sortedProducts = selectedProductIds
                            .map(function (id) {
                            var product = productsData_1.find(function (prod) { return prod.id === id; });
                            if (!product) {
                                console.warn("⚠️ Product Showcase: Product not found for ID:", id);
                            }
                            return product;
                        })
                            .filter(function (product) {
                            if (!product) {
                                return false;
                            }
                            if (!product.images || product.images.length === 0) {
                                console.warn("⚠️ Product Showcase: Product has no images:", product.name);
                            }
                            return true;
                        });
                        console.log("✅ Product Showcase: Final sorted products to render:", sortedProducts);
                        console.log("📝 Product Showcase: Product titles to render:", sortedProducts.map(function (p) { return p.name; }));
                        console.log("🖼��� Product Showcase: Product images:", sortedProducts.map(function (p) {
                            var _a;
                            return ({
                                name: p.name,
                                hasImages: p.images && p.images.length > 0,
                                firstImage: ((_a = p.images) === null || _a === void 0 ? void 0 : _a[0]) || "No image",
                            });
                        }));
                        if (!(sortedProducts.length > 0)) return [3 /*break*/, 11];
                        setFeaturedProducts(sortedProducts);
                        return [3 /*break*/, 13];
                    case 11:
                        console.warn("⚠️ Product Showcase: All selected products filtered out, using fallback");
                        return [4 /*yield*/, loadFallbackProducts()];
                    case 12:
                        _k.sent();
                        _k.label = 13;
                    case 13: return [3 /*break*/, 16];
                    case 14:
                        console.warn("⚠️ Product Showcase: No products returned from database query for selected IDs:", selectedProductIds);
                        console.warn("🔍 Available product IDs in database:", (allProducts === null || allProducts === void 0 ? void 0 : allProducts.map(function (p) { return p.id; })) || []);
                        return [4 /*yield*/, loadFallbackProducts()];
                    case 15:
                        _k.sent();
                        _k.label = 16;
                    case 16: return [3 /*break*/, 19];
                    case 17:
                        console.log("🔄 Product Showcase: No admin-selected products, using fallback featured products");
                        return [4 /*yield*/, loadFallbackProducts()];
                    case 18:
                        _k.sent();
                        _k.label = 19;
                    case 19: return [3 /*break*/, 22];
                    case 20:
                        error_1 = _k.sent();
                        console.error("🚨 Failed to fetch homepage data:");
                        console.error("Error details:", JSON.stringify(error_1, null, 2));
                        console.error("Error object:", error_1);
                        if (error_1 instanceof Error) {
                            console.error("Error message:", error_1.message);
                            console.error("Error stack:", error_1.stack);
                        }
                        return [3 /*break*/, 22];
                    case 21:
                        setIsLoading(false);
                        return [7 /*endfinally*/];
                    case 22: return [2 /*return*/];
                }
            });
        });
    }
    if (isLoading) {
        return (<div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full"></div>
      </div>);
    }
    // Render individual section components
    function renderSection(section) {
        console.log("Homepage: Rendering section of type \"".concat(section.type, "\" with data:"), section);
        if (!section.is_active) {
            console.log("Homepage: Section \"".concat(section.type, "\" is not active, skipping render"));
            return null;
        }
        switch (section.type) {
            case "hero":
                return renderHeroSection(section);
            case "hero_carousel":
                return renderHeroCarousel(section);
            case "features":
                return renderFeaturesSection(section);
            case "category_grid":
                return renderCategoryGrid(section);
            case "product_carousel":
                return renderProductCarousel(section);
            case "testimonials":
                return renderTestimonials(section);
            case "newsletter":
                return renderNewsletter(section);
            default:
                console.log("Homepage: Unknown section type \"".concat(section.type, "\""));
                return null;
        }
    }
    function renderHeroSection(section) {
        var _a;
        var content = section.content;
        // Check if this is a carousel hero section
        if ((content === null || content === void 0 ? void 0 : content.carousel_mode) && ((_a = content === null || content === void 0 ? void 0 : content.images) === null || _a === void 0 ? void 0 : _a.length) > 0) {
            return renderHeroCarousel(section);
        }
        return (<section className="relative min-h-[450px] md:min-h-[500px] overflow-hidden" style={{
                backgroundImage: (content === null || content === void 0 ? void 0 : content.background_image)
                    ? "url(".concat(content.background_image, ")")
                    : undefined,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
            }}>
        {/* Fallback gradient if no background image */}
        {!(content === null || content === void 0 ? void 0 : content.background_image) && (<div className="absolute inset-0 bg-gradient-rose"/>)}

        {/* Modern diagonal overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/40 to-transparent"/>

        <div className="container relative z-20 h-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[450px] md:min-h-[500px]">
            {/* Content Section - Left Side */}
            <div className="space-y-8 text-white py-16 lg:py-0">
              {/* Badge/Subtitle */}
              {section.subtitle && (<div className="inline-flex items-center gap-2 px-4 py-2 bg-white/15 backdrop-blur-md rounded-full border border-white/30 animate-entrance">
                  <div className="w-2 h-2 bg-peach rounded-full animate-pulse"/>
                  <span className="text-sm font-medium text-peach uppercase tracking-wide">
                    {section.subtitle}
                  </span>
                </div>)}

              {/* Main Heading */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.1] animate-entrance" style={{ animationDelay: "0.2s" }}>
                {section.title || "Fresh Flowers"}
              </h1>

              {/* Description */}
              {(content === null || content === void 0 ? void 0 : content.description) && (<p className="text-lg md:text-xl text-gray-200 leading-relaxed max-w-lg animate-entrance" style={{ animationDelay: "0.4s" }}>
                  {content.description}
                </p>)}

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 animate-entrance" style={{ animationDelay: "0.6s" }}>
                <button_1.Button size="lg" className="bg-white text-primary hover:bg-gray-100 text-lg px-10 py-4 h-auto font-bold shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 rounded-full" asChild>
                  <react_router_dom_1.Link to={(content === null || content === void 0 ? void 0 : content.button_link) || "/products"}>
                    {(content === null || content === void 0 ? void 0 : content.button_text) || "Shop Now"}
                    <lucide_react_1.ArrowRight className="ml-3 w-5 h-5"/>
                  </react_router_dom_1.Link>
                </button_1.Button>

                {(content === null || content === void 0 ? void 0 : content.secondary_button_text) && (<button_1.Button size="lg" variant="ghost" className="border-2 border-white/70 text-white hover:bg-white hover:text-primary text-lg px-10 py-4 h-auto font-bold backdrop-blur-sm transition-all duration-300 hover:scale-105 rounded-full" asChild>
                    <react_router_dom_1.Link to={(content === null || content === void 0 ? void 0 : content.secondary_button_link) || "/products"}>
                      {content.secondary_button_text}
                    </react_router_dom_1.Link>
                  </button_1.Button>)}
              </div>

              {/* Trust Indicators */}
              {((content === null || content === void 0 ? void 0 : content.feature_1) || (content === null || content === void 0 ? void 0 : content.feature_2)) && (<div className="flex items-center gap-6 pt-4 animate-entrance" style={{ animationDelay: "0.8s" }}>
                  {(content === null || content === void 0 ? void 0 : content.feature_1) && (<div className="flex items-center gap-2 text-sm text-white/80">
                      <lucide_react_1.Truck className="w-4 h-4"/>
                      {content.feature_1}
                    </div>)}
                  {(content === null || content === void 0 ? void 0 : content.feature_1) && (content === null || content === void 0 ? void 0 : content.feature_2) && (<div className="w-px h-4 bg-white/30"/>)}
                  {(content === null || content === void 0 ? void 0 : content.feature_2) && (<div className="flex items-center gap-2 text-sm text-white/80">
                      <lucide_react_1.Shield className="w-4 h-4"/>
                      {content.feature_2}
                    </div>)}
                </div>)}
            </div>

            {/* Visual Section - Right Side */}
            <div className="relative hidden lg:flex items-center justify-center">
              <div className="relative w-96 h-96">
                {/* Main floating card */}
                <div className="absolute inset-0 bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl animate-gentle-float">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-3xl"/>

                  {/* Content inside card */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center space-y-4 p-8">
                      <div className="w-20 h-20 mx-auto rounded-full bg-white/20 flex items-center justify-center text-4xl">
                        {(content === null || content === void 0 ? void 0 : content.feature_box_emoji) || "🌺"}
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-white font-semibold text-lg">
                          {(content === null || content === void 0 ? void 0 : content.feature_box_title) || "Premium Quality"}
                        </h3>
                        <p className="text-white/70 text-sm">
                          {(content === null || content === void 0 ? void 0 : content.feature_box_description) ||
                "Hand-picked fresh flowers"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating decorative elements */}
                <div className="absolute -inset-20">
                  {(content === null || content === void 0 ? void 0 : content.floating_emoji_1) && (<div className="absolute top-8 right-4 w-16 h-16 bg-white/15 backdrop-blur-xl rounded-2xl border border-white/30 flex items-center justify-center shadow-xl animate-float" style={{ animationDelay: "0s", animationDuration: "6s" }}>
                      <span className="text-2xl">
                        {content.floating_emoji_1}
                      </span>
                    </div>)}

                  {(content === null || content === void 0 ? void 0 : content.floating_emoji_2) && (<div className="absolute bottom-12 left-8 w-20 h-20 bg-white/15 backdrop-blur-xl rounded-2xl border border-white/30 flex items-center justify-center shadow-xl animate-float" style={{ animationDelay: "2s", animationDuration: "8s" }}>
                      <span className="text-3xl">
                        {content.floating_emoji_2}
                      </span>
                    </div>)}

                  {(content === null || content === void 0 ? void 0 : content.floating_emoji_3) && (<div className="absolute top-20 left-4 w-12 h-12 bg-white/15 backdrop-blur-xl rounded-xl border border-white/30 flex items-center justify-center shadow-xl animate-float" style={{ animationDelay: "4s", animationDuration: "10s" }}>
                      <span className="text-xl">
                        {content.floating_emoji_3}
                      </span>
                    </div>)}

                  {(content === null || content === void 0 ? void 0 : content.floating_emoji_4) && (<div className="absolute bottom-4 right-16 w-14 h-14 bg-white/15 backdrop-blur-xl rounded-xl border border-white/30 flex items-center justify-center shadow-xl animate-float" style={{ animationDelay: "1s", animationDuration: "7s" }}>
                      <span className="text-2xl">
                        {content.floating_emoji_4}
                      </span>
                    </div>)}
                </div>

                {/* Background glow effects */}
                <div className="absolute inset-0 bg-white/5 rounded-full blur-3xl animate-glow-pulse"/>
                <div className="absolute inset-8 bg-rose-300/10 rounded-full blur-2xl animate-glow-pulse" style={{ animationDelay: "2s" }}/>
              </div>
            </div>
          </div>
        </div>
      </section>);
    }
    function renderHeroCarousel(section) {
        var content = section.content;
        if (!(content === null || content === void 0 ? void 0 : content.images) || content.images.length === 0) {
            return null;
        }
        // Filter out empty strings
        var validImages = content.images.filter(function (img) { return img && img.trim() !== ""; });
        if (validImages.length === 0) {
            return null;
        }
        return (<section className="w-full">
        <HeroCarousel_1.HeroCarousel images={validImages} autoplay={content.autoplay !== false} autoplayDelay={content.autoplay_delay || 5000} showNavigation={content.show_navigation !== false} showDots={content.show_dots !== false} height={content.height || 500}/>
      </section>);
    }
    function renderFeaturesSection(section) {
        var content = section.content;
        var features = (content === null || content === void 0 ? void 0 : content.features) || [
            {
                icon: "truck",
                title: "Same Day Delivery",
                description: "Order before 2 PM and get fresh flowers delivered the same day",
            },
            {
                icon: "shield",
                title: "Fresh Guarantee",
                description: "100% fresh flowers guaranteed or your money back",
            },
            {
                icon: "heart",
                title: "24/7 Support",
                description: "Our customer care team is always here to help you",
            },
        ];
        var getIcon = function (iconName) {
            switch (iconName) {
                case "truck":
                    return lucide_react_1.Truck;
                case "shield":
                    return lucide_react_1.Shield;
                case "heart":
                    return lucide_react_1.HeartHandshake;
                default:
                    return lucide_react_1.Truck;
            }
        };
        return (<section className="py-16 bg-cream/30">
        <div className="container">
          {section.title && (<div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {section.title}
              </h2>
              {section.subtitle && (<p className="text-xl text-muted-foreground">
                  {section.subtitle}
                </p>)}
            </div>)}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map(function (feature, index) {
                var IconComponent = getIcon(feature.icon);
                return (<div key={index} className="text-center">
                  <div className="w-16 h-16 bg-gradient-rose rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="w-8 h-8 text-white"/>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>);
            })}
          </div>
        </div>
      </section>);
    }
    function renderCategoryGrid(section) {
        var content = section.content;
        var showCount = (content === null || content === void 0 ? void 0 : content.show_count) || 8;
        // Only use title/subtitle if they exist and are not empty
        var hasTitle = section.title && section.title.trim() !== "";
        var hasSubtitle = section.subtitle && section.subtitle.trim() !== "";
        var hasAnyText = hasTitle || hasSubtitle;
        // Filter out any invalid categories and limit display count
        var validCategories = categories
            .filter(function (category) { return category && category.id && category.name && category.slug; })
            .slice(0, showCount);
        if (validCategories.length === 0) {
            return (<section className={"".concat(hasAnyText ? "py-20" : "py-8")}>
          <div className="container">
            {hasAnyText && (<div className="text-center mb-12">
                {hasTitle && (<h2 className="text-3xl md:text-4xl font-bold mb-4">
                    {section.title}
                  </h2>)}
                {hasSubtitle && (<p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    {section.subtitle}
                  </p>)}
              </div>)}
            <div className="text-center py-12 bg-muted/30 rounded-xl">
              <div className="text-6xl mb-4">🌸</div>
              <h3 className="text-xl font-semibold mb-2 text-muted-foreground">
                Categories Coming Soon
              </h3>
              <p className="text-muted-foreground">
                We're preparing beautiful categories for you to explore.
              </p>
            </div>
          </div>
        </section>);
        }
        return (<section className={"".concat(hasAnyText ? "py-20" : "py-8")}>
        <div className="container">
          {hasAnyText && (<div className="text-center mb-12">
              {hasTitle && (<h2 className="text-3xl md:text-4xl font-bold mb-4">
                  {section.title}
                </h2>)}
              {hasSubtitle && (<p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  {section.subtitle}
                </p>)}
            </div>)}

          <div className="flex justify-center">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 max-w-6xl">
              {validCategories.map(function (category) { return (<react_router_dom_1.Link key={category.id} to={"/category/".concat(category.slug)} className="group">
                  <card_1.Card className="border-0 shadow-lg overflow-hidden h-full">
                    <div className="aspect-square bg-gradient-to-br from-rose/20 to-peach/20 flex items-center justify-center text-4xl">
                      {category.image_url ? (<img src={category.image_url} alt={category.name} className="w-full h-full object-cover" onError={function (e) {
                        var _a;
                        e.currentTarget.style.display = "none";
                        var placeholder = (_a = e.currentTarget.parentElement) === null || _a === void 0 ? void 0 : _a.querySelector(".fallback-emoji");
                        if (placeholder)
                            placeholder.style.display =
                                "block";
                    }}/>) : null}
                      <span className={"fallback-emoji animate-pulse ".concat(category.image_url ? "hidden" : "block")}>
                        🌸
                      </span>
                    </div>
                    <card_1.CardContent className="p-3 text-center">
                      <h3 className="text-sm font-semibold leading-tight">
                        {category.name}
                      </h3>
                    </card_1.CardContent>
                  </card_1.Card>
                </react_router_dom_1.Link>); })}
            </div>
          </div>
        </div>
      </section>);
    }
    function renderProductCarousel(section) {
        var content = section.content;
        var showCount = (content === null || content === void 0 ? void 0 : content.show_count) || 8;
        var displayTitle = section.title || "Bestselling Flowers";
        var displaySubtitle = section.subtitle ||
            "Handpicked fresh flowers loved by thousands of customers";
        console.log("🎨 Product Carousel: Starting render with featuredProducts:", featuredProducts);
        console.log("🎨 Product Carousel: Display count set to:", showCount);
        // Filter out any invalid products and limit display count
        var validProducts = featuredProducts
            .filter(function (product) {
            var isValid = product &&
                product.id &&
                product.name &&
                product.slug &&
                product.price;
            if (!isValid) {
                console.warn("❌ Product Carousel: Invalid product filtered out:", product);
            }
            return isValid;
        })
            .slice(0, showCount);
        console.log("✅ Product Carousel: Valid products to render:", validProducts);
        console.log("🏷️ Product Carousel: Product titles being rendered:", validProducts.map(function (p) { return p.name; }));
        console.log("🖼️ Product Carousel: Image status for each product:", validProducts.map(function (p) {
            var _a, _b;
            return ({
                name: p.name,
                hasImages: p.images && Array.isArray(p.images) && p.images.length > 0,
                imageUrl: ((_a = p.images) === null || _a === void 0 ? void 0 : _a[0]) || "No image URL",
                imageCount: ((_b = p.images) === null || _b === void 0 ? void 0 : _b.length) || 0,
            });
        }));
        if (validProducts.length === 0) {
            return (<section className="py-20 bg-muted/30">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {displayTitle}
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                {displaySubtitle}
              </p>
            </div>
            <div className="text-center py-12 bg-white rounded-xl shadow-lg">
              <div className="text-6xl mb-4">🌺</div>
              <h3 className="text-xl font-semibold mb-2 text-muted-foreground">
                Products Coming Soon
              </h3>
              <p className="text-muted-foreground mb-6">
                We're curating beautiful flowers for you to discover.
              </p>
              <button_1.Button asChild>
                <react_router_dom_1.Link to="/products">Browse All Products</react_router_dom_1.Link>
              </button_1.Button>
            </div>
          </div>
        </section>);
        }
        console.log("��� Product Carousel: Rendering section with title:", displayTitle);
        console.log("🎨 Product Carousel: Will render", validProducts.length, "products");
        return (<section className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {displayTitle}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {displaySubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {validProducts.map(function (product) { return (<react_router_dom_1.Link key={product.id} to={"/product/".concat(product.slug)} className="group">
                <card_1.Card className="border-0 shadow-lg overflow-hidden">
                  <div className="aspect-square bg-gradient-to-br from-cream to-peach/30 flex items-center justify-center relative overflow-hidden">
                    {(function () {
                    var hasValidImage = product.images &&
                        Array.isArray(product.images) &&
                        product.images.length > 0 &&
                        product.images[0];
                    if (!hasValidImage) {
                        console.log("\u26A0\uFE0F Product \"".concat(product.name, "\" has no valid images:"), product.images);
                    }
                    return hasValidImage ? (<img src={product.images[0]} alt={product.name} className="w-full h-full object-cover image-hover" onLoad={function () {
                            console.log("\u2705 Product image loaded successfully for \"".concat(product.name, "\":"), product.images[0]);
                        }} onError={function (e) {
                            var _a;
                            console.error("\u274C Product image failed to load for \"".concat(product.name, "\":"), product.images[0]);
                            e.currentTarget.style.display = "none";
                            var placeholder = (_a = e.currentTarget.parentElement) === null || _a === void 0 ? void 0 : _a.querySelector(".fallback-emoji");
                            if (placeholder) {
                                placeholder.style.display =
                                    "block";
                                placeholder.classList.remove("hidden");
                            }
                        }}/>) : null;
                })()}
                    <span className={"fallback-emoji text-6xl animate-pulse ".concat(product.images &&
                    Array.isArray(product.images) &&
                    product.images.length > 0 &&
                    product.images[0]
                    ? "hidden"
                    : "block")}>
                      🌺
                    </span>
                    {product.sale_price &&
                    product.sale_price < product.price && (<badge_1.Badge className="absolute top-2 left-2 bg-destructive text-destructive-foreground">
                          SALE
                        </badge_1.Badge>)}
                  </div>
                  <card_1.CardContent className="p-4">
                    <h3 className="font-semibold mb-2 line-clamp-2">
                      {product.name}
                    </h3>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-primary">
                          ₹
                          {product.sale_price &&
                    product.sale_price < product.price
                    ? product.sale_price.toFixed(2)
                    : product.price.toFixed(2)}
                        </span>
                        {product.sale_price &&
                    product.sale_price < product.price && (<span className="text-sm text-muted-foreground line-through">
                              ₹{product.price.toFixed(2)}
                            </span>)}
                      </div>
                    </div>
                    <button_1.Button size="sm" className="w-full" onClick={function (e) { return handleAddToCart(product, e); }}>
                      <lucide_react_1.ShoppingCart className="w-4 h-4 mr-2"/>
                      Add to Cart
                    </button_1.Button>
                  </card_1.CardContent>
                </card_1.Card>
              </react_router_dom_1.Link>); })}
          </div>

          <div className="text-center mt-12">
            <button_1.Button size="lg" asChild>
              <react_router_dom_1.Link to="/products">
                View All Products
                <lucide_react_1.ArrowRight className="ml-2 w-5 h-5"/>
              </react_router_dom_1.Link>
            </button_1.Button>
          </div>
        </div>
      </section>);
    }
    function renderTestimonials(section) {
        var content = section.content;
        var testimonials = (content === null || content === void 0 ? void 0 : content.testimonials) || [
            {
                name: "Priya Sharma",
                location: "Mumbai",
                rating: 5,
                review: "Absolutely stunning flowers! Delivered fresh and on time. Made my anniversary perfect.",
                image: "",
            },
            {
                name: "Rajesh Kumar",
                location: "Delhi",
                rating: 5,
                review: "Best flower delivery service in India. Quality is amazing and customer service is excellent.",
                image: "",
            },
            {
                name: "Anita Patel",
                location: "Bangalore",
                rating: 5,
                review: "I've been ordering for years. Never disappointed! Fresh flowers every single time.",
                image: "",
            },
        ];
        return (<section className="py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What Our Customers Say
            </h2>
            {section.subtitle && (<p className="text-xl text-muted-foreground">
                {section.subtitle}
              </p>)}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map(function (testimonial, index) { return (<card_1.Card key={index} className="border-0 shadow-lg">
                <card_1.CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-4">
                    {__spreadArray([], Array(testimonial.rating), true).map(function (_, i) { return (<lucide_react_1.Star key={i} className="w-5 h-5 fill-gold text-gold"/>); })}
                  </div>
                  <p className="text-muted-foreground mb-4 italic">
                    "{testimonial.review}"
                  </p>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.location}
                    </p>
                  </div>
                </card_1.CardContent>
              </card_1.Card>); })}
          </div>
        </div>
      </section>);
    }
    function renderNewsletter(section) {
        var content = section.content;
        return (<section className="py-20 bg-gradient-rose text-white">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {section.title || "Stay Blooming with Our Updates"}
          </h2>
          <p className="text-xl mb-8 text-rose-100 max-w-2xl mx-auto">
            {section.subtitle ||
                "Get exclusive offers, flower care tips, and be the first to know about new arrivals"}
          </p>
          <div className="flex gap-2 max-w-md mx-auto">
            <input_1.Input placeholder={(content === null || content === void 0 ? void 0 : content.placeholder) || "Enter your email"} className="bg-white/10 border-white/20 text-white placeholder:text-rose-100"/>
            <button_1.Button variant="secondary" className="whitespace-nowrap">
              {(content === null || content === void 0 ? void 0 : content.button_text) || "Subscribe"}
            </button_1.Button>
          </div>
        </div>
      </section>);
    }
    console.log("Homepage: Rendering with sections:", sections);
    console.log("Homepage: Categories loaded:", categories);
    console.log("Homepage: Products loaded:", featuredProducts);
    return (<div className="min-h-screen">
      {sections.map(function (section) { return (<div key={section.id}>{renderSection(section)}</div>); })}

      {/* CTA Section - Always show at end */}
      <section className="py-20 bg-gradient-rose text-white">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Spread Joy?
          </h2>
          <p className="text-xl mb-8 text-rose-100 max-w-2xl mx-auto">
            Order now and let us deliver fresh, beautiful flowers to your loved
            ones
          </p>
          <button_1.Button size="lg" variant="secondary" className="text-lg px-8" asChild>
            <react_router_dom_1.Link to="/products">
              Start Shopping
              <lucide_react_1.ArrowRight className="ml-2 w-5 h-5"/>
            </react_router_dom_1.Link>
          </button_1.Button>
        </div>
      </section>
    </div>);
}
