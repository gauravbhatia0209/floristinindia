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
exports.default = Page;
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var supabase_1 = require("@/lib/supabase");
var ContactUs_1 = require("@/components/pages/ContactUs");
var AboutUsPage_1 = require("@/components/pages/AboutUsPage");
var HelpCenterPage_1 = require("@/components/pages/HelpCenterPage");
var ReturnRefundPage_1 = require("@/components/pages/ReturnRefundPage");
var PrivacyPolicyPage_1 = require("@/components/pages/PrivacyPolicyPage");
var TermsConditionsPage_1 = require("@/components/pages/TermsConditionsPage");
var DeliveryInfoPage_1 = require("@/components/pages/DeliveryInfoPage");
var ErrorBoundary_1 = require("@/components/ErrorBoundary");
var NotFound_1 = require("@/pages/NotFound");
var SectionRenderer_1 = require("@/components/SectionRenderer");
function Page() {
    var slug = (0, react_router_dom_1.useParams)().slug;
    var _a = (0, react_1.useState)(null), pageData = _a[0], setPageData = _a[1];
    var _b = (0, react_1.useState)(true), isLoading = _b[0], setIsLoading = _b[1];
    var _c = (0, react_1.useState)(false), notFound = _c[0], setNotFound = _c[1];
    // Determine the actual slug - either from URL params or from current path
    var currentPath = window.location.pathname.replace(/^\//, "");
    var actualSlug = slug || currentPath;
    console.log("Page component: useParams slug =", slug);
    console.log("Page component: currentPath =", currentPath);
    console.log("Page component: actualSlug =", actualSlug);
    console.log("Page component: URL slug =", slug, "Current path =", currentPath, "Actual slug =", actualSlug);
    (0, react_1.useEffect)(function () {
        if (actualSlug) {
            console.log("Page component: Fetching page for slug:", actualSlug);
            // For 'about' slug, skip database fetch since AboutUsPage handles its own content
            if (actualSlug === "about") {
                setIsLoading(false);
                setPageData({
                    id: "about",
                    title: "About Florist in India",
                    slug: "about",
                    content: "",
                    is_active: true,
                    show_in_footer: true,
                    sort_order: 1,
                    created_at: "",
                    updated_at: "",
                });
            }
            else {
                fetchPage(actualSlug);
            }
        }
    }, [actualSlug]);
    function fetchPage(pageSlug) {
        return __awaiter(this, void 0, void 0, function () {
            var actualSlug_1, _a, data, error, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, 3, 4]);
                        setIsLoading(true);
                        setNotFound(false);
                        actualSlug_1 = pageSlug;
                        if (pageSlug === "help") {
                            actualSlug_1 = "help-center";
                        }
                        if (pageSlug === "terms") {
                            actualSlug_1 = "terms-conditions";
                        }
                        return [4 /*yield*/, supabase_1.supabase
                                .from("pages")
                                .select("*")
                                .eq("slug", actualSlug_1)
                                .eq("is_active", true)
                                .single()];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error || !data) {
                            console.log("Page component: No data found or error for slug:", pageSlug, error);
                            setNotFound(true);
                        }
                        else {
                            console.log("Page component: Setting page data for slug:", pageSlug, data);
                            // Set the original slug for routing logic
                            setPageData(__assign(__assign({}, data), { slug: pageSlug }));
                        }
                        return [3 /*break*/, 4];
                    case 2:
                        error_1 = _b.sent();
                        console.error("Failed to fetch page:", error_1);
                        setNotFound(true);
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
        if (pageData) {
            // Update page title and meta tags
            document.title = pageData.meta_title || pageData.title;
            // Update meta description
            var metaDesc = document.querySelector('meta[name="description"]');
            if (!metaDesc) {
                metaDesc = document.createElement("meta");
                metaDesc.setAttribute("name", "description");
                document.head.appendChild(metaDesc);
            }
            if (pageData.meta_description) {
                metaDesc.setAttribute("content", pageData.meta_description);
            }
        }
        // Cleanup function to reset title when component unmounts
        return function () {
            document.title = "Florist in India";
        };
    }, [pageData]);
    if (isLoading) {
        return (<div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="h-8 bg-gray-200 rounded animate-pulse w-64 mb-6"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
          </div>
        </div>
      </div>);
    }
    if (notFound || !pageData) {
        return <NotFound_1.default />;
    }
    // Handle specialized page types with professional UI
    console.log("Page component: Routing to component for slug:", pageData.slug);
    switch (pageData.slug) {
        case "about":
            console.log("Page component: Rendering AboutUsPage");
            return (<ErrorBoundary_1.default>
          <AboutUsPage_1.default />
        </ErrorBoundary_1.default>);
        case "help-center":
        case "help":
            console.log("Page component: Rendering HelpCenterPage");
            return <HelpCenterPage_1.default />;
        case "return-refunds":
            console.log("Page component: Rendering ReturnRefundPage");
            return <ReturnRefundPage_1.default />;
        case "privacy-policy":
            console.log("Page component: Rendering PrivacyPolicyPage");
            return <PrivacyPolicyPage_1.default />;
        case "terms-conditions":
        case "terms":
            console.log("Page component: Rendering TermsConditionsPage");
            return <TermsConditionsPage_1.default />;
        case "delivery-info":
            console.log("Page component: Rendering DeliveryInfoPage");
            return <DeliveryInfoPage_1.default />;
        case "contact-us":
        case "contact":
            console.log("Page component: Rendering ContactUs");
            return <ContactUs_1.default pageContent={pageData.content}/>;
    }
    return (<div className="container mx-auto px-4 pt-2 pb-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8"></header>

        <main>
          {(function () {
            // Handle different content formats
            console.log("Page content type:", typeof pageData.content);
            console.log("Page content:", pageData.content);
            // Check if content is the new section format (array of Section objects)
            if (Array.isArray(pageData.content) &&
                pageData.content.length > 0 &&
                pageData.content[0].id &&
                pageData.content[0].type) {
                console.log("Rendering with SectionRenderer");
                return (<SectionRenderer_1.SectionRenderer sections={pageData.content}/>);
            }
            // Handle legacy string HTML content
            else if (typeof pageData.content === "string") {
                console.log("Rendering legacy HTML content");
                return (<div className="prose prose-lg max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: pageData.content }} className="break-words"/>
                </div>);
            }
            // Handle legacy structured content with blocks
            else if (typeof pageData.content === "object" &&
                pageData.content &&
                pageData.content.blocks) {
                console.log("Rendering legacy blocks content");
                return (<div className="prose prose-lg max-w-none">
                  {pageData.content.blocks.map(function (block, index) {
                        switch (block.type) {
                            case "heading":
                                return (<h1 key={index} className="text-2xl font-bold mb-4">
                            {block.content}
                          </h1>);
                            case "text":
                            case "paragraph":
                                return (<p key={index} className="text-base text-gray-700 mb-2">
                            {block.content}
                          </p>);
                            case "image":
                                return (<img key={index} src={block.url || block.content} alt={block.alt || ""} className="w-full max-w-md mx-auto rounded-lg mb-4"/>);
                            case "button":
                                return (<a key={index} href={block.url || "#"} className="inline-block bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors mb-4">
                            {block.content || block.text}
                          </a>);
                            case "list":
                                return (<ul key={index} className="list-disc list-inside mb-4">
                            {(block.items || []).map(function (item, itemIndex) { return (<li key={itemIndex} className="text-base text-gray-700 mb-1">
                                  {item}
                                </li>); })}
                          </ul>);
                            default:
                                return (<div key={index} className="text-base text-gray-700 mb-2">
                            {block.content || ""}
                          </div>);
                        }
                    })}
                </div>);
            }
            // Fallback for empty or unrecognized content
            else {
                console.log("No valid content found");
                return (<div className="text-center py-8">
                  <p className="text-gray-600">
                    Page content is being updated. Please check back soon.
                  </p>
                </div>);
            }
        })()}
        </main>
      </div>
    </div>);
}
