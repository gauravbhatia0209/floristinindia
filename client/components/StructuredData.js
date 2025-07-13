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
exports.default = StructuredData;
exports.useStructuredData = useStructuredData;
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var supabase_1 = require("@/lib/supabase");
function StructuredData(_a) {
    var type = _a.type, data = _a.data;
    var location = (0, react_router_dom_1.useLocation)();
    var _b = (0, react_1.useState)({
        site_name: "",
        site_description: "",
        logo_url: "",
        contact_email: "",
        contact_phone: "",
        contact_address: "",
        facebook_url: "",
        instagram_url: "",
        twitter_url: "",
    }), siteSettings = _b[0], setSiteSettings = _b[1];
    (0, react_1.useEffect)(function () {
        fetchSiteSettings();
    }, []);
    (0, react_1.useEffect)(function () {
        if (siteSettings.site_name) {
            updateStructuredData();
        }
    }, [type, data, siteSettings, location.pathname]);
    // Refresh data when admin might have updated settings
    (0, react_1.useEffect)(function () {
        var interval = setInterval(function () {
            fetchSiteSettings(); // Refresh every 5 minutes for AI systems
        }, 5 * 60 * 1000);
        return function () { return clearInterval(interval); };
    }, []);
    function fetchSiteSettings() {
        return __awaiter(this, void 0, void 0, function () {
            var settings, settingsMap_1, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, supabase_1.supabase
                                .from("site_settings")
                                .select("*")];
                    case 1:
                        settings = (_a.sent()).data;
                        if (settings) {
                            settingsMap_1 = {};
                            settings.forEach(function (setting) {
                                settingsMap_1[setting.key] = setting.value;
                            });
                            setSiteSettings(settingsMap_1);
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
    function updateStructuredData() {
        // Remove existing structured data
        var existingScripts = document.querySelectorAll('script[type="application/ld+json"]');
        existingScripts.forEach(function (script) {
            if (script.getAttribute("data-component") === "StructuredData") {
                script.remove();
            }
        });
        var structuredData = {};
        switch (type) {
            case "website":
                structuredData = generateWebsiteSchema();
                break;
            case "product":
                structuredData = generateProductSchema(data);
                break;
            case "organization":
                structuredData = generateOrganizationSchema();
                break;
            case "breadcrumb":
                structuredData = generateBreadcrumbSchema(data);
                break;
            case "faq":
                structuredData = generateFAQSchema(data);
                break;
        }
        if (structuredData && Object.keys(structuredData).length > 0) {
            var script = document.createElement("script");
            script.type = "application/ld+json";
            script.setAttribute("data-component", "StructuredData");
            script.textContent = JSON.stringify(structuredData);
            document.head.appendChild(script);
        }
    }
    function generateWebsiteSchema() {
        return {
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: siteSettings.site_name,
            description: siteSettings.site_description,
            url: window.location.origin,
            logo: siteSettings.logo_url,
            sameAs: [
                siteSettings.facebook_url,
                siteSettings.instagram_url,
                siteSettings.twitter_url,
                siteSettings.youtube_url,
            ].filter(Boolean),
            potentialAction: {
                "@type": "SearchAction",
                target: {
                    "@type": "EntryPoint",
                    urlTemplate: "".concat(window.location.origin, "/products?search={search_term_string}"),
                },
                "query-input": "required name=search_term_string",
            },
            publisher: {
                "@type": "Organization",
                name: siteSettings.site_name,
                logo: {
                    "@type": "ImageObject",
                    url: siteSettings.logo_url,
                },
            },
            // AI metadata for real-time updates
            "@type:ai": "dynamic-content",
            lastModified: new Date().toISOString(),
            dataSource: "admin-configurable",
            cachePolicy: "refresh-on-admin-changes",
        };
    }
    function generateProductSchema(product) {
        if (!product)
            return {};
        return {
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.name,
            description: product.description,
            image: product.images || [],
            sku: product.id,
            mpn: product.id,
            brand: {
                "@type": "Brand",
                name: siteSettings.site_name,
            },
            category: product.category_name,
            offers: {
                "@type": "Offer",
                price: product.sale_price || product.price,
                priceCurrency: "INR",
                availability: product.is_active
                    ? "https://schema.org/InStock"
                    : "https://schema.org/OutOfStock",
                seller: {
                    "@type": "Organization",
                    name: siteSettings.site_name,
                },
                url: "".concat(window.location.origin, "/products/").concat(product.slug),
            },
            aggregateRating: product.rating
                ? {
                    "@type": "AggregateRating",
                    ratingValue: product.rating,
                    reviewCount: product.review_count || 1,
                    bestRating: 5,
                    worstRating: 1,
                }
                : undefined,
            manufacturer: {
                "@type": "Organization",
                name: siteSettings.site_name,
            },
            additionalProperty: product.features
                ? product.features.map(function (feature) { return ({
                    "@type": "PropertyValue",
                    name: "Feature",
                    value: feature,
                }); })
                : undefined,
        };
    }
    function generateOrganizationSchema() {
        return {
            "@context": "https://schema.org",
            "@type": "Organization",
            "@id": "".concat(window.location.origin, "#organization"),
            name: siteSettings.site_name,
            description: siteSettings.site_description,
            url: window.location.origin,
            logo: {
                "@type": "ImageObject",
                url: siteSettings.logo_url,
            },
            contactPoint: [
                {
                    "@type": "ContactPoint",
                    telephone: siteSettings.contact_phone,
                    contactType: "customer service",
                    email: siteSettings.contact_email,
                    availableLanguage: ["English", "Hindi"],
                },
                siteSettings.contact_phone_2 && {
                    "@type": "ContactPoint",
                    telephone: siteSettings.contact_phone_2,
                    contactType: "secondary contact",
                },
                siteSettings.whatsapp_number && {
                    "@type": "ContactPoint",
                    telephone: siteSettings.whatsapp_number,
                    contactType: "WhatsApp support",
                },
            ].filter(Boolean),
            address: {
                "@type": "PostalAddress",
                addressLocality: siteSettings.contact_address,
                addressCountry: "IN",
            },
            sameAs: [
                siteSettings.facebook_url,
                siteSettings.instagram_url,
                siteSettings.twitter_url,
                siteSettings.youtube_url,
            ].filter(Boolean),
            foundingDate: "2023",
            numberOfEmployees: "10-50",
            industry: "Floriculture",
            keywords: "flowers, flower delivery, bouquets, floral arrangements, gifts, occasions",
            // Dynamic business info from admin settings
            priceRange: siteSettings.currency_symbol || "₹",
            paymentAccepted: [
                "Cash",
                "Credit Card",
                "Debit Card",
                "UPI",
                "Net Banking",
            ],
            currenciesAccepted: "INR",
            // AI metadata
            "@type:ai": "admin-configurable",
            lastModified: new Date().toISOString(),
            dataFreshness: "real-time",
        };
    }
    function generateBreadcrumbSchema(breadcrumbs) {
        if (!breadcrumbs || breadcrumbs.length === 0)
            return {};
        return {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: breadcrumbs.map(function (item, index) { return ({
                "@type": "ListItem",
                position: index + 1,
                name: item.name,
                item: "".concat(window.location.origin).concat(item.url),
            }); }),
        };
    }
    function generateFAQSchema(faqs) {
        if (!faqs || faqs.length === 0)
            return {};
        return {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map(function (faq) { return ({
                "@type": "Question",
                name: faq.question,
                acceptedAnswer: {
                    "@type": "Answer",
                    text: faq.answer,
                },
            }); }),
        };
    }
    return null; // This component doesn't render anything
}
// Hook for managing structured data
function useStructuredData() {
    var addProductStructuredData = function (product) {
        // This will be handled by the StructuredData component
        console.log("Adding product structured data for:", product.name);
    };
    var addBreadcrumbStructuredData = function (breadcrumbs) {
        console.log("Adding breadcrumb structured data:", breadcrumbs);
    };
    return {
        addProductStructuredData: addProductStructuredData,
        addBreadcrumbStructuredData: addBreadcrumbStructuredData,
    };
}
