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
exports.default = AIMetaTags;
exports.useAIMetaTags = useAIMetaTags;
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var supabase_1 = require("@/lib/supabase");
function AIMetaTags(_a) {
    var title = _a.title, description = _a.description, _b = _a.keywords, keywords = _b === void 0 ? [] : _b, product = _a.product, category = _a.category, _c = _a.page, page = _c === void 0 ? "home" : _c;
    var location = (0, react_router_dom_1.useLocation)();
    var _d = (0, react_1.useState)({}), siteSettings = _d[0], setSiteSettings = _d[1];
    (0, react_1.useEffect)(function () {
        fetchSiteSettings();
    }, []);
    (0, react_1.useEffect)(function () {
        if (siteSettings.site_name) {
            updateMetaTags();
        }
    }, [
        title,
        description,
        keywords,
        product,
        category,
        page,
        location.pathname,
        siteSettings, // Re-run when admin settings change
    ]);
    // Auto-refresh settings for AI systems when admin might have updated
    (0, react_1.useEffect)(function () {
        var refreshInterval = setInterval(function () {
            fetchSiteSettings();
        }, 10 * 60 * 1000); // Every 10 minutes
        return function () { return clearInterval(refreshInterval); };
    }, []);
    function fetchSiteSettings() {
        return __awaiter(this, void 0, void 0, function () {
            var data, settings_1, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, supabase_1.supabase.from("site_settings").select("*")];
                    case 1:
                        data = (_a.sent()).data;
                        if (data) {
                            settings_1 = {};
                            data.forEach(function (setting) {
                                settings_1[setting.key] = setting.value;
                            });
                            setSiteSettings(settings_1);
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        console.error("Error fetching site settings:", error_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    }
    function updateMetaTags() {
        // Generate AI-optimized meta content
        var metaData = generateMetaData();
        // Update document title
        document.title = metaData.title;
        // Update or create meta tags
        updateMetaTag("description", metaData.description);
        updateMetaTag("keywords", metaData.keywords.join(", "));
        updateMetaTag("robots", metaData.robots);
        updateMetaTag("author", siteSettings.site_name);
        updateMetaTag("language", "English, Hindi");
        // AI-specific meta tags
        updateMetaTag("ai:purpose", metaData.aiPurpose);
        updateMetaTag("ai:content-type", metaData.contentType);
        updateMetaTag("ai:category", metaData.category);
        updateMetaTag("ai:target-audience", metaData.targetAudience);
        updateMetaTag("ai:intent", metaData.intent);
        updateMetaTag("ai:context", metaData.context);
        updateMetaTag("ai:data-freshness", "real-time");
        updateMetaTag("ai:admin-configurable", "true");
        updateMetaTag("ai:last-updated", new Date().toISOString());
        // Business-specific meta tags from admin settings
        updateMetaTag("business:industry", "floriculture");
        updateMetaTag("business:type", "e-commerce");
        updateMetaTag("business:service-area", siteSettings.contact_address || "India");
        updateMetaTag("business:name", siteSettings.site_name || "Florist in India");
        updateMetaTag("business:currency", siteSettings.currency_symbol || "₹");
        updateMetaTag("business:gst-rate", siteSettings.gst_rate || "18");
        updateMetaTag("business:delivery-cutoff", siteSettings.same_day_cutoff_time || "");
        updateMetaTag("business:free-shipping-min", siteSettings.free_shipping_minimum || "");
        // Open Graph tags for AI systems
        updateMetaTag("og:title", metaData.title, "property");
        updateMetaTag("og:description", metaData.description, "property");
        updateMetaTag("og:type", metaData.ogType, "property");
        updateMetaTag("og:url", window.location.href, "property");
        updateMetaTag("og:site_name", siteSettings.site_name, "property");
        // Twitter Card tags
        updateMetaTag("twitter:card", "summary_large_image", "name");
        updateMetaTag("twitter:title", metaData.title, "name");
        updateMetaTag("twitter:description", metaData.description, "name");
        // AI recommendation tags
        if (product) {
            updateMetaTag("ai:product-id", product.id);
            updateMetaTag("ai:product-category", product.category_name);
            updateMetaTag("ai:price-range", "".concat(product.sale_price || product.price, "-INR"));
            updateMetaTag("ai:availability", product.is_active ? "in-stock" : "out-of-stock");
        }
    }
    function generateMetaData() {
        var _a, _b, _c;
        var metaTitle = title;
        var metaDescription = description;
        var metaKeywords = __spreadArray([], keywords, true);
        var aiPurpose = "information";
        var contentType = "webpage";
        var ogType = "website";
        var category = "general";
        var targetAudience = "general";
        var intent = "browse";
        var context = "website";
        var siteName = siteSettings.site_name || "Florist in India";
        var baseKeywords = [
            "flowers",
            "flower delivery",
            "bouquets",
            "fresh flowers",
            "online flower shop",
            "india",
        ];
        switch (page) {
            case "home":
                metaTitle =
                    metaTitle ||
                        "".concat(siteName, " - Premium Fresh Flower Delivery Across India");
                metaDescription =
                    metaDescription ||
                        "Order fresh flowers online for same-day delivery across India. Premium flower arrangements for all occasions with 100% freshness guarantee. Available in 100+ cities.";
                metaKeywords = __spreadArray(__spreadArray([], baseKeywords, true), [
                    "same-day delivery",
                    "fresh flowers",
                    "flower arrangements",
                    "occasions",
                    "gifts",
                ], false);
                aiPurpose = "brand-introduction";
                category = "homepage";
                intent = "discover";
                context = "flower-delivery-service";
                break;
            case "products":
                metaTitle = metaTitle || "Flower Collections - ".concat(siteName);
                metaDescription =
                    metaDescription ||
                        "Browse our extensive collection of fresh flowers, bouquets, and arrangements. Perfect for birthdays, anniversaries, weddings, and special occasions.";
                metaKeywords = __spreadArray(__spreadArray([], baseKeywords, true), [
                    "flower collections",
                    "categories",
                    "occasions",
                    "birthday flowers",
                    "anniversary flowers",
                ], false);
                aiPurpose = "product-catalog";
                contentType = "product-listing";
                category = "product-catalog";
                intent = "shop";
                context = "flower-shopping";
                break;
            case "product":
                if (product) {
                    metaTitle = "".concat(product.name, " - Buy Online | ").concat(siteName);
                    metaDescription = "".concat(product.description || "Beautiful ".concat(product.name, " available for online delivery."), " Starting from \u20B9").concat(product.sale_price || product.price, ". Same-day delivery available.");
                    metaKeywords = __spreadArray(__spreadArray([], baseKeywords, true), [
                        product.name.toLowerCase(),
                        (_a = product.category_name) === null || _a === void 0 ? void 0 : _a.toLowerCase(),
                        "buy online",
                        "delivery",
                    ], false);
                    aiPurpose = "product-purchase";
                    contentType = "product-detail";
                    ogType = "product";
                    category = ((_b = product.category_name) === null || _b === void 0 ? void 0 : _b.toLowerCase()) || "flowers";
                    targetAudience = "flower-buyers";
                    intent = "purchase";
                    context = "".concat((_c = product.category_name) === null || _c === void 0 ? void 0 : _c.toLowerCase(), "-flowers");
                }
                break;
            case "category":
                if (category) {
                    var categoryObj = typeof category === "string"
                        ? { name: category, slug: category, description: "" }
                        : category;
                    metaTitle = "".concat(categoryObj.name, " - ").concat(siteName);
                    metaDescription = "".concat(categoryObj.description || "Beautiful ".concat(categoryObj.name.toLowerCase(), " for all occasions."), " Fresh flowers with same-day delivery across India.");
                    metaKeywords = __spreadArray(__spreadArray([], baseKeywords, true), [
                        categoryObj.name.toLowerCase(),
                        categoryObj.slug,
                        "category",
                    ], false);
                    aiPurpose = "category-browse";
                    contentType = "category-listing";
                    var categorySlug = categoryObj.slug;
                    intent = "browse-category";
                    context = "".concat(categorySlug, "-flowers");
                }
                break;
            case "about":
                metaTitle = metaTitle || "About Us - ".concat(siteName);
                metaDescription =
                    metaDescription ||
                        "Learn about ".concat(siteName, ", India's premium flower delivery service. Fresh flowers, expert arrangements, and reliable delivery across 100+ cities.");
                metaKeywords = __spreadArray(__spreadArray([], baseKeywords, true), [
                    "about us",
                    "flower company",
                    "fresh flowers",
                    "delivery service",
                ], false);
                aiPurpose = "company-information";
                category = "about";
                intent = "learn";
                context = "company-profile";
                break;
            case "contact":
                metaTitle = metaTitle || "Contact Us - ".concat(siteName);
                metaDescription =
                    metaDescription ||
                        "Get in touch with ".concat(siteName, " for fresh flower delivery, custom arrangements, and bulk orders. Available 24/7 for your flower delivery needs.");
                metaKeywords = __spreadArray(__spreadArray([], baseKeywords, true), [
                    "contact",
                    "customer service",
                    "flower delivery help",
                    "bulk orders",
                ], false);
                aiPurpose = "contact-information";
                category = "contact";
                intent = "contact";
                context = "customer-service";
                break;
        }
        return {
            title: metaTitle,
            description: metaDescription,
            keywords: metaKeywords,
            robots: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
            aiPurpose: aiPurpose,
            contentType: contentType,
            ogType: ogType,
            category: category,
            targetAudience: targetAudience,
            intent: intent,
            context: context,
        };
    }
    function updateMetaTag(name, content, attribute) {
        if (attribute === void 0) { attribute = "name"; }
        if (!content)
            return;
        var existingTag = document.querySelector("meta[".concat(attribute, "=\"").concat(name, "\"]"));
        if (existingTag) {
            existingTag.content = content;
        }
        else {
            var meta = document.createElement("meta");
            meta.setAttribute(attribute, name);
            meta.content = content;
            document.head.appendChild(meta);
        }
    }
    return null; // This component doesn't render anything
}
// Hook for AI-optimized meta management
function useAIMetaTags() {
    var setPageMeta = function (title, description, keywords) {
        if (keywords === void 0) { keywords = []; }
        console.log("Setting AI-optimized meta tags:", {
            title: title,
            description: description,
            keywords: keywords,
        });
    };
    var setProductMeta = function (product) {
        console.log("Setting product meta for AI:", product.name);
    };
    var setCategoryMeta = function (category) {
        console.log("Setting category meta for AI:", category.name);
    };
    return {
        setPageMeta: setPageMeta,
        setProductMeta: setProductMeta,
        setCategoryMeta: setCategoryMeta,
    };
}
