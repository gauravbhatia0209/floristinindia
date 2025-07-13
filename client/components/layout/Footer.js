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
exports.Footer = Footer;
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var lucide_react_1 = require("lucide-react");
var button_1 = require("@/components/ui/button");
var supabase_1 = require("@/lib/supabase");
function Footer() {
    var _a = (0, react_1.useState)([]), categories = _a[0], setCategories = _a[1];
    var _b = (0, react_1.useState)({}), settings = _b[0], setSettings = _b[1];
    var _c = (0, react_1.useState)([]), footerSections = _c[0], setFooterSections = _c[1];
    var _d = (0, react_1.useState)(true), isLoading = _d[0], setIsLoading = _d[1];
    // Dynamic column configuration - loaded from database
    var _e = (0, react_1.useState)(6), MAX_COLUMNS = _e[0], setMaxColumns = _e[1]; // Default value
    var COMPANY_COLUMN = 1; // Column 1 is always reserved for company info
    var _f = (0, react_1.useState)([
        2, 3, 4, 5, 6,
    ]), DYNAMIC_COLUMNS = _f[0], setDynamicColumns = _f[1];
    (0, react_1.useEffect)(function () {
        // Load configuration and fetch data
        loadFooterConfig();
        fetchFooterData();
        // Set up real-time subscription for footer sections
        var footerSubscription = supabase_1.supabase
            .channel("footer_sections_changes")
            .on("postgres_changes", {
            event: "*",
            schema: "public",
            table: "footer_sections",
        }, function () {
            console.log("Footer sections changed - refetching...");
            fetchFooterData();
        })
            .subscribe();
        // Also fetch data when window gets focus (to catch changes made in admin)
        var handleFocus = function () {
            console.log("Window focused - refetching footer data...");
            fetchFooterData();
        };
        window.addEventListener("focus", handleFocus);
        return function () {
            supabase_1.supabase.removeChannel(footerSubscription);
            window.removeEventListener("focus", handleFocus);
        };
    }, []);
    function loadFooterConfig() {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error, maxCols, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, supabase_1.supabase
                                .from("site_settings")
                                .select("value")
                                .eq("key", "footer_max_columns")
                                .maybeSingle()];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (!error && data) {
                            maxCols = parseInt(data.value) || 6;
                            setMaxColumns(maxCols);
                            setDynamicColumns(Array.from({ length: maxCols - 1 }, function (_, i) { return i + 2; }));
                            console.log("Footer config loaded:", maxCols, "columns");
                        }
                        else {
                            console.log("Using default footer configuration - no setting found");
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _b.sent();
                        console.log("Footer config error, using defaults:", error_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    }
    function fetchFooterData() {
        return __awaiter(this, void 0, void 0, function () {
            var _a, footerData, footerError, _b, categoriesData, categoriesError, _c, settingsData, settingsError, settingsMap, error_2;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 4, 5, 6]);
                        setIsLoading(true);
                        // Fetch footer sections with error handling (force fresh data)
                        console.log("Fetching footer sections at:", new Date().toISOString());
                        return [4 /*yield*/, supabase_1.supabase
                                .from("footer_sections")
                                .select("*")
                                .eq("is_active", true)
                                .order("column_position", { ascending: true })
                                .order("sort_order", { ascending: true })];
                    case 1:
                        _a = _d.sent(), footerData = _a.data, footerError = _a.error;
                        return [4 /*yield*/, supabase_1.supabase
                                .from("product_categories")
                                .select("*")
                                .eq("is_active", true)
                                .order("sort_order")
                                .limit(10)];
                    case 2:
                        _b = _d.sent(), categoriesData = _b.data, categoriesError = _b.error;
                        return [4 /*yield*/, supabase_1.supabase
                                .from("site_settings")
                                .select("*")];
                    case 3:
                        _c = _d.sent(), settingsData = _c.data, settingsError = _c.error;
                        if (footerError) {
                            console.error("🚨 Footer: Error fetching footer sections:");
                            console.error("Footer error details:", JSON.stringify(footerError, null, 2));
                            console.error("Footer error message:", footerError === null || footerError === void 0 ? void 0 : footerError.message);
                            console.error("Footer error code:", footerError === null || footerError === void 0 ? void 0 : footerError.code);
                        }
                        else if (footerData) {
                            console.log("Footer sections fetched:", footerData);
                            console.log("Number of active footer sections:", footerData.length);
                            // Debug: Show details of each section
                            footerData.forEach(function (section, index) {
                                console.log("Section ".concat(index + 1, ":"), {
                                    title: section.title,
                                    column_position: section.column_position,
                                    sort_order: section.sort_order,
                                    is_active: section.is_active,
                                });
                            });
                            setFooterSections(footerData);
                        }
                        if (categoriesError) {
                            console.error("🚨 Footer: Error fetching categories:");
                            console.error("Categories error details:", JSON.stringify(categoriesError, null, 2));
                            console.error("Categories error message:", categoriesError === null || categoriesError === void 0 ? void 0 : categoriesError.message);
                            console.error("Categories error code:", categoriesError === null || categoriesError === void 0 ? void 0 : categoriesError.code);
                        }
                        else if (categoriesData) {
                            setCategories(categoriesData);
                        }
                        if (settingsError) {
                            console.error("🚨 Footer: Error fetching settings:");
                            console.error("Settings error details:", JSON.stringify(settingsError, null, 2));
                            console.error("Settings error message:", settingsError === null || settingsError === void 0 ? void 0 : settingsError.message);
                            console.error("Settings error code:", settingsError === null || settingsError === void 0 ? void 0 : settingsError.code);
                        }
                        else if (settingsData) {
                            settingsMap = settingsData.reduce(function (acc, setting) {
                                acc[setting.key] = setting.value;
                                return acc;
                            }, {});
                            setSettings(settingsMap);
                        }
                        return [3 /*break*/, 6];
                    case 4:
                        error_2 = _d.sent();
                        console.error("🚨 Footer: Error fetching footer data:");
                        console.error("General error details:", JSON.stringify(error_2, null, 2));
                        console.error("General error object:", error_2);
                        if (error_2 instanceof Error) {
                            console.error("General error message:", error_2.message);
                            console.error("General error stack:", error_2.stack);
                        }
                        return [3 /*break*/, 6];
                    case 5:
                        setIsLoading(false);
                        return [7 /*endfinally*/];
                    case 6: return [2 /*return*/];
                }
            });
        });
    }
    var currentYear = new Date().getFullYear();
    // Loading state
    if (isLoading) {
        return (<footer className="bg-muted/50 border-t">
        <div className="container py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map(function (i) { return (<div key={i} className="space-y-4">
                <div className="h-6 bg-gray-200 rounded animate-pulse w-32"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
                </div>
              </div>); })}
          </div>
        </div>
      </footer>);
    }
    function renderFooterSection(section) {
        // Safe content parsing with fallbacks
        var content = section.content || {};
        var contentType = content.type || "text";
        // Safety function to render text content
        var safeText = function (text) {
            if (!text || typeof text !== "string")
                return null;
            return text.replace(/[<>]/g, ""); // Basic XSS protection
        };
        switch (contentType) {
            case "links":
                if (!Array.isArray(content.links)) {
                    return (<div className="text-sm text-muted-foreground">
              No links configured
            </div>);
                }
                return (<ul className="space-y-2 text-sm">
            {content.links
                        .filter(function (link) { return link && link.text && link.url; })
                        .map(function (link, index) { return (<li key={index}>
                  <react_router_dom_1.Link to={safeText(link.url) || "#"} className="text-muted-foreground hover:text-primary transition-colors">
                    {safeText(link.text)}
                  </react_router_dom_1.Link>
                </li>); })}
          </ul>);
            case "category_links":
                if (categories.length === 0) {
                    return (<div className="text-sm text-muted-foreground">
              No categories available
            </div>);
                }
                var showCount = Math.max(1, Math.min(content.show_count || 6, 20)); // Limit between 1-20
                return (<ul className="space-y-2 text-sm">
            {categories.slice(0, showCount).map(function (category) { return (<li key={category.id}>
                <react_router_dom_1.Link to={"/category/".concat(category.slug)} className="text-muted-foreground hover:text-primary transition-colors">
                  {safeText(category.name)}
                </react_router_dom_1.Link>
              </li>); })}
          </ul>);
            case "contact":
                var hasContactInfo = content.phone || content.email || content.address;
                if (!hasContactInfo) {
                    return (<div className="text-sm text-muted-foreground">
              No contact information configured
            </div>);
                }
                return (<div className="space-y-2 text-sm">
            {content.phone && (<div className="flex items-start gap-2 text-muted-foreground">
                <lucide_react_1.Phone className="w-4 h-4 text-primary mt-0.5 flex-shrink-0"/>
                <span>{safeText(content.phone)}</span>
              </div>)}
            {content.email && (<div className="flex items-start gap-2 text-muted-foreground">
                <lucide_react_1.Mail className="w-4 h-4 text-primary mt-0.5 flex-shrink-0"/>
                <span>{safeText(content.email)}</span>
              </div>)}
            {content.address && (<div className="flex items-start gap-2 text-muted-foreground">
                <lucide_react_1.MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0"/>
                <span>{safeText(content.address)}</span>
              </div>)}
          </div>);
            case "text":
                var textContent = safeText(content.text);
                if (!textContent) {
                    return (<div className="text-sm text-muted-foreground">
              No content available
            </div>);
                }
                return (<div className="text-sm text-muted-foreground leading-relaxed">
            {textContent.split("\n").map(function (line, index) { return (<div key={index}>{line}</div>); })}
          </div>);
            default:
                return (<div className="text-sm text-muted-foreground">
            Content type not supported
          </div>);
        }
    }
    return (<footer className="bg-muted/50 border-t">
      {/* Main Footer Content */}
      <div className="container py-12">
        <div className={"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-".concat(Math.min(MAX_COLUMNS, 6), " gap-8")}>
          {/* Company Info - Column 1 (Always show) */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-rose rounded-full flex items-center justify-center">
                <span className="text-white font-bold">🌹</span>
              </div>
              <span className="text-lg font-bold text-gradient-rose">
                {settings.site_name || "Florist in India"}
              </span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {settings.site_description ||
            "India's premium flower delivery service, spreading joy and love through beautiful, fresh flowers delivered right to your doorstep."}
            </p>

            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2 text-muted-foreground">
                <lucide_react_1.MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0"/>
                <span>
                  {settings.contact_address ||
            "Delhi NCR, Mumbai, Bangalore & 100+ Cities"}
                </span>
              </div>
              <div className="flex items-start gap-2 text-muted-foreground">
                <lucide_react_1.Phone className="w-4 h-4 text-primary mt-0.5 flex-shrink-0"/>
                <span>{settings.contact_phone || "+91 98765 43210"}</span>
              </div>
              <div className="flex items-start gap-2 text-muted-foreground">
                <lucide_react_1.Mail className="w-4 h-4 text-primary mt-0.5 flex-shrink-0"/>
                <span>
                  {settings.contact_email || "orders@floristinindia.com"}
                </span>
              </div>
              <div className="flex items-start gap-2 text-muted-foreground">
                <lucide_react_1.Clock className="w-4 h-4 text-primary mt-0.5 flex-shrink-0"/>
                <span>24/7 Customer Support</span>
              </div>
            </div>

            {/* Social Media */}
            <div className="mt-6">
              <h5 className="font-medium mb-3">Follow Us</h5>
              <div className="flex gap-2">
                {settings.social_facebook && (<button_1.Button size="icon" variant="outline" className="w-8 h-8" asChild>
                    <a href={settings.social_facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                      <lucide_react_1.Facebook className="w-4 h-4"/>
                    </a>
                  </button_1.Button>)}
                {settings.social_instagram && (<button_1.Button size="icon" variant="outline" className="w-8 h-8" asChild>
                    <a href={settings.social_instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                      <lucide_react_1.Instagram className="w-4 h-4"/>
                    </a>
                  </button_1.Button>)}
                {settings.social_twitter && (<button_1.Button size="icon" variant="outline" className="w-8 h-8" asChild>
                    <a href={settings.social_twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                      <lucide_react_1.Twitter className="w-4 h-4"/>
                    </a>
                  </button_1.Button>)}
                {settings.social_youtube && (<button_1.Button size="icon" variant="outline" className="w-8 h-8" asChild>
                    <a href={settings.social_youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                      <lucide_react_1.Youtube className="w-4 h-4"/>
                    </a>
                  </button_1.Button>)}
              </div>
            </div>
          </div>

          {/* Dynamic Footer Sections - Organized by columns */}
          {DYNAMIC_COLUMNS.map(function (columnPosition) {
            var sectionsInColumn = footerSections.filter(function (section) { return section.column_position === columnPosition; });
            // Count total active sections to determine if we should show fallback
            var totalActiveSections = footerSections.length;
            // Debug logging for all columns
            console.log("Column ".concat(columnPosition, " processing:"), {
                totalActiveSections: totalActiveSections,
                sectionsInThisColumn: sectionsInColumn.length,
                sectionTitles: sectionsInColumn.map(function (s) { return s.title; }),
            });
            if (sectionsInColumn.length === 0) {
                // When admin makes all sections inactive, show empty columns (no fallback)
                console.log("Column ".concat(columnPosition, " - Showing empty (no fallback content)"));
                return null; // Always show nothing when no sections in column
            }
            return (<div key={columnPosition} className="space-y-8">
                {sectionsInColumn.map(function (section) { return (<div key={section.id}>
                    <h4 className="font-semibold mb-4">{section.title}</h4>
                    {renderFooterSection(section)}
                  </div>); })}
              </div>);
        })}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t bg-background">
        <div className="container py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <div>© {currentYear} Florist in India. All rights reserved.</div>
            <div className="flex items-center gap-4">
              <span>🔒 Secure Payments</span>
              <span>🚚 Same Day Delivery</span>
              <span>🌱 Fresh Guarantee</span>
            </div>
          </div>
        </div>
      </div>
    </footer>);
}
