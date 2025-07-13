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
exports.default = FacebookShopMeta;
exports.useFacebookShop = useFacebookShop;
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var supabase_1 = require("@/lib/supabase");
function FacebookShopMeta(_a) {
    var product = _a.product;
    var location = (0, react_router_dom_1.useLocation)();
    var _b = (0, react_1.useState)({}), siteSettings = _b[0], setSiteSettings = _b[1];
    (0, react_1.useEffect)(function () {
        fetchSiteSettings();
    }, []);
    (0, react_1.useEffect)(function () {
        updateMetaTags();
    }, [product, siteSettings, location.pathname]);
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
        // Remove existing Facebook meta tags
        removeExistingMetaTags();
        // Add new meta tags based on current page
        if (product) {
            addProductMetaTags();
        }
        else {
            addGeneralMetaTags();
        }
    }
    function removeExistingMetaTags() {
        var existingTags = document.querySelectorAll('meta[property^="og:"], meta[property^="fb:"], meta[property^="product:"]');
        existingTags.forEach(function (tag) { return tag.remove(); });
    }
    function addProductMetaTags() {
        if (!product)
            return;
        var metaTags = __spreadArray([
            // Open Graph Product Tags
            { property: "og:type", content: "product" },
            { property: "og:title", content: product.name },
            {
                property: "og:description",
                content: product.description || "Buy ".concat(product.name, " online"),
            },
            {
                property: "og:url",
                content: "".concat(window.location.origin, "/products/").concat(product.slug),
            },
            { property: "og:site_name", content: siteSettings.site_name || "Shop" },
            // Product specific tags
            {
                property: "product:price:amount",
                content: (product.sale_price || product.price).toString(),
            },
            { property: "product:price:currency", content: "INR" },
            { property: "product:availability", content: "in stock" },
            { property: "product:condition", content: "new" },
            { property: "product:retailer_item_id", content: product.id }
        ], (siteSettings.facebook_app_id
            ? [{ property: "fb:app_id", content: siteSettings.facebook_app_id }]
            : []), true);
        // Add product images
        if (product.images && product.images.length > 0) {
            product.images.slice(0, 4).forEach(function (image) {
                metaTags.push({ property: "og:image", content: image });
            });
        }
        // Add category if available
        if (product.category_name) {
            metaTags.push({
                property: "product:category",
                content: product.category_name,
            });
        }
        // Create and append meta tags
        metaTags.forEach(function (tag) {
            var meta = document.createElement("meta");
            meta.setAttribute("property", tag.property);
            meta.setAttribute("content", tag.content);
            document.head.appendChild(meta);
        });
    }
    function addGeneralMetaTags() {
        var metaTags = __spreadArray([
            { property: "og:type", content: "website" },
            {
                property: "og:title",
                content: siteSettings.site_name || "Online Shop",
            },
            {
                property: "og:description",
                content: siteSettings.site_description || "Premium online shopping experience",
            },
            { property: "og:url", content: window.location.href },
            { property: "og:site_name", content: siteSettings.site_name || "Shop" }
        ], (siteSettings.facebook_app_id
            ? [{ property: "fb:app_id", content: siteSettings.facebook_app_id }]
            : []), true);
        // Add site logo if available
        if (siteSettings.logo_url) {
            metaTags.push({ property: "og:image", content: siteSettings.logo_url });
        }
        // Create and append meta tags
        metaTags.forEach(function (tag) {
            var meta = document.createElement("meta");
            meta.setAttribute("property", tag.property);
            meta.setAttribute("content", tag.content);
            document.head.appendChild(meta);
        });
    }
    return null; // This component doesn't render anything
}
// Facebook Shop Catalog Integration
function useFacebookShop() {
    var _this = this;
    var syncProductToFacebook = function (product) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            // This would typically sync with Facebook Catalog API
            // For now, we'll just ensure proper meta tags are in place
            console.log("Syncing product to Facebook Shop:", product.name);
            return [2 /*return*/];
        });
    }); };
    var syncCatalogToFacebook = function (products) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            // This would sync entire catalog to Facebook
            console.log("Syncing catalog to Facebook Shop:", products.length, "products");
            return [2 /*return*/];
        });
    }); };
    return {
        syncProductToFacebook: syncProductToFacebook,
        syncCatalogToFacebook: syncCatalogToFacebook,
    };
}
