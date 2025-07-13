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
exports.Header = Header;
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var lucide_react_1 = require("lucide-react");
var button_1 = require("@/components/ui/button");
var input_1 = require("@/components/ui/input");
var badge_1 = require("@/components/ui/badge");
var sheet_1 = require("@/components/ui/sheet");
var dropdown_menu_1 = require("@/components/ui/dropdown-menu");
var react_visually_hidden_1 = require("@radix-ui/react-visually-hidden");
var lucide_react_2 = require("lucide-react");
var supabase_1 = require("@/lib/supabase");
var useCart_1 = require("@/hooks/useCart");
var AuthContext_1 = require("@/contexts/AuthContext");
function Header() {
    var _this = this;
    var _a = (0, react_1.useState)([]), menuItems = _a[0], setMenuItems = _a[1];
    var _b = (0, react_1.useState)([]), categories = _b[0], setCategories = _b[1];
    var _c = (0, react_1.useState)({}), siteSettings = _c[0], setSiteSettings = _c[1];
    var _d = (0, react_1.useState)(false), isSearchOpen = _d[0], setIsSearchOpen = _d[1];
    var _e = (0, react_1.useState)(""), searchQuery = _e[0], setSearchQuery = _e[1];
    var _f = (0, react_1.useState)([]), searchResults = _f[0], setSearchResults = _f[1];
    var _g = (0, react_1.useState)(false), isSearching = _g[0], setIsSearching = _g[1];
    var _h = (0, react_1.useState)(false), showSearchResults = _h[0], setShowSearchResults = _h[1];
    var _j = (0, react_1.useState)(null), expandedMobileMenu = _j[0], setExpandedMobileMenu = _j[1];
    var _k = (0, react_1.useState)(false), isMobileMenuOpen = _k[0], setIsMobileMenuOpen = _k[1];
    var items = (0, useCart_1.useCart)().items;
    var _l = (0, AuthContext_1.useAuth)(), user = _l.user, isAuthenticated = _l.isAuthenticated, isAdmin = _l.isAdmin, logout = _l.logout;
    var navigate = (0, react_router_dom_1.useNavigate)();
    var searchRef = (0, react_1.useRef)(null);
    var mobileSearchRef = (0, react_1.useRef)(null);
    var debounceRef = (0, react_1.useRef)();
    var cartItemsCount = items.reduce(function (sum, item) { return sum + item.quantity; }, 0);
    // Function to close mobile menu when link is clicked
    var closeMobileMenu = function () {
        setIsMobileMenuOpen(false);
        setExpandedMobileMenu(null);
    };
    var handleLogout = function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, logout()];
                case 1:
                    _a.sent();
                    navigate("/");
                    return [2 /*return*/];
            }
        });
    }); };
    (0, react_1.useEffect)(function () {
        fetchMenuItems();
        fetchSiteSettings();
    }, []);
    function fetchMenuItems() {
        return __awaiter(this, void 0, void 0, function () {
            var _a, menuItemsData, error, menuItemsWithSubcategories, categoriesFromMenu;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, supabase_1.supabase
                            .from("menu_items")
                            .select("*, product_categories(*)")
                            .eq("is_active", true)
                            .is("parent_id", null)
                            .order("sort_order")];
                    case 1:
                        _a = _b.sent(), menuItemsData = _a.data, error = _a.error;
                        if (error) {
                            console.error("Error fetching menu items:", error);
                            setMenuItems([]);
                            setCategories([]);
                            return [2 /*return*/];
                        }
                        if (!(menuItemsData && menuItemsData.length > 0)) return [3 /*break*/, 3];
                        return [4 /*yield*/, Promise.all(menuItemsData.map(function (item) { return __awaiter(_this, void 0, void 0, function () {
                                var subcategories;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            if (!(item.category_id && item.product_categories)) return [3 /*break*/, 2];
                                            return [4 /*yield*/, supabase_1.supabase
                                                    .from("product_categories")
                                                    .select("*")
                                                    .eq("parent_id", item.category_id)
                                                    .eq("is_active", true)
                                                    .order("sort_order")];
                                        case 1:
                                            subcategories = (_a.sent()).data;
                                            return [2 /*return*/, __assign(__assign({}, item), { product_categories: __assign(__assign({}, item.product_categories), { subcategories: subcategories || [] }) })];
                                        case 2: return [2 /*return*/, item];
                                    }
                                });
                            }); }))];
                    case 2:
                        menuItemsWithSubcategories = _b.sent();
                        setMenuItems(menuItemsWithSubcategories);
                        categoriesFromMenu = menuItemsWithSubcategories
                            .filter(function (item) { return item.product_categories; })
                            .map(function (item) { return item.product_categories; });
                        setCategories(categoriesFromMenu);
                        return [3 /*break*/, 4];
                    case 3:
                        // No active menu items configured - show empty menu
                        setMenuItems([]);
                        setCategories([]);
                        _b.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    }
    function fetchSiteSettings() {
        return __awaiter(this, void 0, void 0, function () {
            var settingsData, settingsMap_1, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, supabase_1.supabase
                                .from("site_settings")
                                .select("*")
                                .in("key", [
                                "site_name",
                                "site_tagline",
                                "logo_url",
                                "contact_phone",
                                "contact_email",
                                "header_banner_text",
                                "header_banner_enabled",
                            ])];
                    case 1:
                        settingsData = (_a.sent()).data;
                        if (settingsData) {
                            settingsMap_1 = {};
                            settingsData.forEach(function (setting) {
                                settingsMap_1[setting.key] = setting.value;
                            });
                            setSiteSettings(settingsMap_1);
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        console.error("Failed to fetch site settings:", error_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    }
    // Search functionality
    var performSearch = (0, react_1.useCallback)(function (query) { return __awaiter(_this, void 0, void 0, function () {
        var products, categories_1, results_1, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!query.trim()) {
                        setSearchResults([]);
                        setShowSearchResults(false);
                        return [2 /*return*/];
                    }
                    setIsSearching(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, 5, 6]);
                    return [4 /*yield*/, supabase_1.supabase
                            .from("products")
                            .select("id, name, slug, images, price, sale_price")
                            .eq("is_active", true)
                            .or("name.ilike.%".concat(query, "%, description.ilike.%").concat(query, "%"))
                            .limit(5)];
                case 2:
                    products = (_a.sent()).data;
                    return [4 /*yield*/, supabase_1.supabase
                            .from("product_categories")
                            .select("id, name, slug, image_url")
                            .eq("is_active", true)
                            .ilike("name", "%".concat(query, "%"))
                            .limit(5)];
                case 3:
                    categories_1 = (_a.sent()).data;
                    results_1 = [];
                    // Add product results
                    if (products) {
                        products.forEach(function (product) {
                            var _a;
                            results_1.push({
                                type: "product",
                                id: product.id,
                                name: product.name,
                                slug: product.slug,
                                image: (_a = product.images) === null || _a === void 0 ? void 0 : _a[0],
                                price: product.price,
                                sale_price: product.sale_price,
                            });
                        });
                    }
                    // Add category results
                    if (categories_1) {
                        categories_1.forEach(function (category) {
                            results_1.push({
                                type: "category",
                                id: category.id,
                                name: category.name,
                                slug: category.slug,
                                image: category.image_url,
                            });
                        });
                    }
                    setSearchResults(results_1);
                    setShowSearchResults(true);
                    return [3 /*break*/, 6];
                case 4:
                    error_2 = _a.sent();
                    console.error("Search error:", error_2);
                    setSearchResults([]);
                    return [3 /*break*/, 6];
                case 5:
                    setIsSearching(false);
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); }, []);
    // Debounced search
    var handleSearchChange = (0, react_1.useCallback)(function (value) {
        setSearchQuery(value);
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }
        debounceRef.current = setTimeout(function () {
            performSearch(value);
        }, 300);
    }, [performSearch]);
    // Handle search result click
    var handleResultClick = function (result) {
        setSearchQuery("");
        setShowSearchResults(false);
        if (result.type === "product") {
            navigate("/products/".concat(result.slug));
        }
        else {
            navigate("/category/".concat(result.slug));
        }
    };
    // Close search results when clicking outside
    (0, react_1.useEffect)(function () {
        var handleClickOutside = function (event) {
            var target = event.target;
            var isOutsideDesktop = searchRef.current && !searchRef.current.contains(target);
            var isOutsideMobile = mobileSearchRef.current && !mobileSearchRef.current.contains(target);
            // Only close if clicking outside both desktop and mobile search areas
            if (isOutsideDesktop && isOutsideMobile) {
                setShowSearchResults(false);
                setIsSearchOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return function () { return document.removeEventListener("mousedown", handleClickOutside); };
    }, []);
    return (<div className="bg-background border-b sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-primary text-primary-foreground">
        <div className="container flex items-center justify-between py-2 text-sm">
          <div className="flex items-center gap-4">
            {siteSettings.contact_phone && (<span className="flex items-center gap-1">
                <lucide_react_1.Phone className="w-3 h-3"/>
                {siteSettings.contact_phone}
              </span>)}
            {siteSettings.contact_email && (<span className="flex items-center gap-1">
                <lucide_react_1.Mail className="w-3 h-3"/>
                {siteSettings.contact_email}
              </span>)}
          </div>
          {siteSettings.header_banner_enabled === "true" &&
            siteSettings.header_banner_text && (<div className="hidden sm:block">
                {siteSettings.header_banner_text}
              </div>)}
        </div>
      </div>

      {/* Main Header */}
      <div className="container py-4">
        <div className="flex items-center gap-4">
          {/* Mobile Menu */}
          <sheet_1.Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <sheet_1.SheetTrigger asChild>
              <button_1.Button variant="ghost" size="icon" className="lg:hidden">
                <lucide_react_1.Menu className="h-5 w-5"/>
              </button_1.Button>
            </sheet_1.SheetTrigger>
            <sheet_1.SheetContent side="left" className="w-80">
              <react_visually_hidden_1.VisuallyHidden>
                <sheet_1.SheetTitle>Navigation Menu</sheet_1.SheetTitle>
              </react_visually_hidden_1.VisuallyHidden>
              <div className="py-4">
                <h2 className="text-lg font-semibold mb-4">Menu</h2>
                <nav className="flex flex-col gap-2">
                  {menuItems.map(function (item) {
            var _a, _b;
            var href = item.category_id && item.product_categories
                ? "/category/".concat(item.product_categories.slug)
                : item.url || "#";
            var hasSubcategories = ((_a = item.product_categories) === null || _a === void 0 ? void 0 : _a.subcategories) &&
                item.product_categories.subcategories.length > 0;
            return (<div key={item.id}>
                        {hasSubcategories ? (<div>
                            <button onClick={function () {
                        return setExpandedMobileMenu(expandedMobileMenu === item.id
                            ? null
                            : item.id);
                    }} className="w-full px-3 py-2 rounded-md hover:bg-accent text-left flex items-center justify-between">
                              <span>{item.name}</span>
                              <lucide_react_2.ChevronDown className={"w-4 h-4 transition-transform ".concat(expandedMobileMenu === item.id
                        ? "rotate-180"
                        : "")}/>
                            </button>

                            {expandedMobileMenu === item.id && (<div className="ml-4 mt-2 space-y-1">
                                <react_router_dom_1.Link to={href} target={item.target} onClick={closeMobileMenu} className="block px-3 py-2 rounded-md hover:bg-accent text-sm text-muted-foreground">
                                  View All {item.name}
                                </react_router_dom_1.Link>
                                {(_b = item.product_categories.subcategories) === null || _b === void 0 ? void 0 : _b.map(function (subcategory) { return (<react_router_dom_1.Link key={subcategory.id} to={"/category/".concat(subcategory.slug)} onClick={closeMobileMenu} className="block px-3 py-2 rounded-md hover:bg-accent text-sm">
                                      {subcategory.name}
                                    </react_router_dom_1.Link>); })}
                              </div>)}
                          </div>) : (<react_router_dom_1.Link to={href} target={item.target} onClick={closeMobileMenu} className="block px-3 py-2 rounded-md hover:bg-accent text-left">
                            {item.name}
                          </react_router_dom_1.Link>)}
                      </div>);
        })}
                </nav>
              </div>
            </sheet_1.SheetContent>
          </sheet_1.Sheet>

          {/* Logo */}
          <react_router_dom_1.Link to="/" className="flex items-center gap-2">
            {siteSettings.logo_url ? (<img src={siteSettings.logo_url} alt={siteSettings.site_name || "Logo"} className="w-10 h-10 object-contain"/>) : (<div className="w-10 h-10 bg-gradient-rose rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">🌹</span>
              </div>)}
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-gradient-rose">
                {siteSettings.site_name || "Florist in India"}
              </h1>
              <p className="text-xs text-muted-foreground -mt-1">
                {siteSettings.site_tagline || "Premium Flower Delivery"}
              </p>
            </div>
          </react_router_dom_1.Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-0.5 flex-1 ml-4 xl:ml-6">
            {menuItems.map(function (item) {
            var _a, _b;
            var href = item.category_id && item.product_categories
                ? "/category/".concat(item.product_categories.slug)
                : item.url || "#";
            var hasSubcategories = ((_a = item.product_categories) === null || _a === void 0 ? void 0 : _a.subcategories) &&
                item.product_categories.subcategories.length > 0;
            return hasSubcategories ? (<div key={item.id} className="relative group">
                  <react_router_dom_1.Link to={href} target={item.target} className="px-2 xl:px-2.5 py-1.5 xl:py-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors inline-flex items-center text-sm xl:text-base whitespace-nowrap">
                    <span className="truncate max-w-[100px] xl:max-w-none">
                      {item.name}
                    </span>
                    <lucide_react_2.ChevronDown className="w-3 h-3 xl:w-4 xl:h-4 ml-0.5 xl:ml-1 transition-transform group-hover:rotate-180 flex-shrink-0"/>
                  </react_router_dom_1.Link>

                  {/* Invisible hover bridge */}
                  <div className="absolute top-full left-0 w-48 xl:w-56 h-2 bg-transparent group-hover:block hidden"></div>

                  {/* Hover Dropdown */}
                  <div className="absolute top-full left-0 mt-2 w-48 xl:w-56 hover-dropdown rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-in-out transform translate-y-2 group-hover:translate-y-0 z-50">
                    <div className="py-3">
                      <react_router_dom_1.Link to={href} target={item.target} className="hover-dropdown-item block px-3 xl:px-4 py-2 xl:py-2.5 text-xs xl:text-sm font-medium text-primary border-b border-border mb-2">
                        View All {item.name}
                      </react_router_dom_1.Link>
                      {(_b = item.product_categories.subcategories) === null || _b === void 0 ? void 0 : _b.map(function (subcategory) { return (<react_router_dom_1.Link key={subcategory.id} to={"/category/".concat(subcategory.slug)} className="hover-dropdown-item block px-3 xl:px-4 py-1.5 xl:py-2 text-xs xl:text-sm text-foreground rounded-md mx-2">
                            {subcategory.name}
                          </react_router_dom_1.Link>); })}
                    </div>
                  </div>
                </div>) : (<react_router_dom_1.Link key={item.id} to={href} target={item.target} className="px-2 xl:px-2.5 py-1.5 xl:py-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors text-sm xl:text-base whitespace-nowrap">
                  <span className="truncate max-w-[100px] xl:max-w-none">
                    {item.name}
                  </span>
                </react_router_dom_1.Link>);
        })}
          </nav>

          {/* Tablet Navigation */}
          <nav className="hidden md:flex lg:hidden items-center gap-0.5 flex-1 ml-3 overflow-x-auto scrollbar-hide">
            {menuItems.map(function (item) {
            var _a, _b;
            var href = item.category_id && item.product_categories
                ? "/category/".concat(item.product_categories.slug)
                : item.url || "#";
            var hasSubcategories = ((_a = item.product_categories) === null || _a === void 0 ? void 0 : _a.subcategories) &&
                item.product_categories.subcategories.length > 0;
            return hasSubcategories ? (<div key={item.id} className="relative group flex-shrink-0">
                  <react_router_dom_1.Link to={href} target={item.target} className="px-1.5 py-1.5 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors inline-flex items-center text-xs whitespace-nowrap">
                    <span className="truncate max-w-[80px]">{item.name}</span>
                    <lucide_react_2.ChevronDown className="w-3 h-3 ml-0.5 transition-transform group-hover:rotate-180 flex-shrink-0"/>
                  </react_router_dom_1.Link>

                  {/* Hover Dropdown for Tablet */}
                  <div className="absolute top-full left-0 mt-2 w-44 hover-dropdown rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-in-out transform translate-y-2 group-hover:translate-y-0 z-50">
                    <div className="py-2">
                      <react_router_dom_1.Link to={href} target={item.target} className="hover-dropdown-item block px-3 py-2 text-xs font-medium text-primary border-b border-border mb-1">
                        View All {item.name}
                      </react_router_dom_1.Link>
                      {(_b = item.product_categories.subcategories) === null || _b === void 0 ? void 0 : _b.map(function (subcategory) { return (<react_router_dom_1.Link key={subcategory.id} to={"/category/".concat(subcategory.slug)} className="hover-dropdown-item block px-3 py-1.5 text-xs text-foreground rounded-md mx-2">
                            {subcategory.name}
                          </react_router_dom_1.Link>); })}
                    </div>
                  </div>
                </div>) : (<react_router_dom_1.Link key={item.id} to={href} target={item.target} className="px-1.5 py-1.5 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors text-xs whitespace-nowrap flex-shrink-0">
                  <span className="truncate max-w-[80px]">{item.name}</span>
                </react_router_dom_1.Link>);
        })}
          </nav>

          {/* Actions - Always aligned to the right */}
          <div className="flex items-center gap-2 ml-auto">
            {/* Search Icon - Desktop only (lg+) */}
            <button_1.Button variant="ghost" size="icon" className="hidden lg:flex relative" onClick={function () { return setIsSearchOpen(!isSearchOpen); }}>
              {isSearchOpen ? (<lucide_react_1.X className="h-5 w-5"/>) : (<lucide_react_1.Search className="h-5 w-5"/>)}
            </button_1.Button>

            {/* Search Icon - Tablet and Mobile */}
            <button_1.Button variant="ghost" size="icon" className="lg:hidden" onClick={function () { return setIsSearchOpen(!isSearchOpen); }}>
              {isSearchOpen ? (<lucide_react_1.X className="h-5 w-5"/>) : (<lucide_react_1.Search className="h-5 w-5"/>)}
            </button_1.Button>

            {/* Wishlist */}
            <react_router_dom_1.Link to="/wishlist">
              <button_1.Button variant="ghost" size="icon" className="relative">
                <lucide_react_1.Heart className="h-5 w-5"/>
                <badge_1.Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-rose text-white">
                  0
                </badge_1.Badge>
              </button_1.Button>
            </react_router_dom_1.Link>

            {/* Cart */}
            <react_router_dom_1.Link to="/cart">
              <button_1.Button variant="ghost" size="icon" className="relative">
                <lucide_react_1.ShoppingCart className="h-5 w-5"/>
                {cartItemsCount > 0 && (<badge_1.Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-primary text-primary-foreground">
                    {cartItemsCount}
                  </badge_1.Badge>)}
              </button_1.Button>
            </react_router_dom_1.Link>

            {/* Profile Dropdown */}
            {isAuthenticated ? (<dropdown_menu_1.DropdownMenu>
                <dropdown_menu_1.DropdownMenuTrigger asChild>
                  <button_1.Button variant="ghost" size="icon" className="relative">
                    <lucide_react_1.User className="h-5 w-5"/>
                  </button_1.Button>
                </dropdown_menu_1.DropdownMenuTrigger>
                <dropdown_menu_1.DropdownMenuContent align="end" className="w-56">
                  <dropdown_menu_1.DropdownMenuLabel className="flex flex-col">
                    <span>My Account</span>
                    <span className="text-xs text-muted-foreground font-normal">
                      {user === null || user === void 0 ? void 0 : user.email}
                    </span>
                  </dropdown_menu_1.DropdownMenuLabel>
                  <dropdown_menu_1.DropdownMenuSeparator />

                  {/* Admin access */}
                  {isAdmin && (<>
                      <dropdown_menu_1.DropdownMenuItem asChild>
                        <react_router_dom_1.Link to="/admin" className="flex items-center cursor-pointer">
                          <lucide_react_1.Settings className="mr-2 h-4 w-4"/>
                          Admin Panel
                        </react_router_dom_1.Link>
                      </dropdown_menu_1.DropdownMenuItem>
                      <dropdown_menu_1.DropdownMenuSeparator />
                    </>)}

                  {/* Customer options */}
                  {!isAdmin && (<>
                      <dropdown_menu_1.DropdownMenuItem asChild>
                        <react_router_dom_1.Link to="/account" className="flex items-center cursor-pointer">
                          <lucide_react_1.UserCog className="mr-2 h-4 w-4"/>
                          Profile Settings
                        </react_router_dom_1.Link>
                      </dropdown_menu_1.DropdownMenuItem>
                      <dropdown_menu_1.DropdownMenuItem asChild>
                        <react_router_dom_1.Link to="/account?tab=orders" className="flex items-center cursor-pointer">
                          <lucide_react_1.Package className="mr-2 h-4 w-4"/>
                          My Orders
                        </react_router_dom_1.Link>
                      </dropdown_menu_1.DropdownMenuItem>
                      <dropdown_menu_1.DropdownMenuItem asChild>
                        <react_router_dom_1.Link to="/account?tab=wishlist" className="flex items-center cursor-pointer">
                          <lucide_react_1.Heart className="mr-2 h-4 w-4"/>
                          Wishlist
                        </react_router_dom_1.Link>
                      </dropdown_menu_1.DropdownMenuItem>
                      <dropdown_menu_1.DropdownMenuItem asChild>
                        <react_router_dom_1.Link to="/account?tab=addresses" className="flex items-center cursor-pointer">
                          <lucide_react_1.MapPin className="mr-2 h-4 w-4"/>
                          Addresses
                        </react_router_dom_1.Link>
                      </dropdown_menu_1.DropdownMenuItem>
                      <dropdown_menu_1.DropdownMenuItem asChild>
                        <react_router_dom_1.Link to="/track-order" className="flex items-center cursor-pointer">
                          <lucide_react_1.Search className="mr-2 h-4 w-4"/>
                          Track Order
                        </react_router_dom_1.Link>
                      </dropdown_menu_1.DropdownMenuItem>
                      <dropdown_menu_1.DropdownMenuSeparator />
                      <dropdown_menu_1.DropdownMenuItem asChild>
                        <react_router_dom_1.Link to="/help" className="flex items-center cursor-pointer">
                          <lucide_react_1.HeadphonesIcon className="mr-2 h-4 w-4"/>
                          Help & Support
                        </react_router_dom_1.Link>
                      </dropdown_menu_1.DropdownMenuItem>
                      <dropdown_menu_1.DropdownMenuSeparator />
                    </>)}

                  <dropdown_menu_1.DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600 cursor-pointer">
                    <lucide_react_1.LogOut className="mr-2 h-4 w-4"/>
                    Logout
                  </dropdown_menu_1.DropdownMenuItem>
                </dropdown_menu_1.DropdownMenuContent>
              </dropdown_menu_1.DropdownMenu>) : (<react_router_dom_1.Link to="/login">
                <button_1.Button variant="ghost" size="icon">
                  <lucide_react_1.User className="h-5 w-5"/>
                </button_1.Button>
              </react_router_dom_1.Link>)}
          </div>
        </div>

        {/* Desktop Dropdown Search */}
        {isSearchOpen && (<div className="hidden md:block mt-4 transition-all duration-300 ease-in-out" ref={searchRef}>
            <div className="relative max-w-lg mx-auto">
              <lucide_react_1.Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4"/>
              <input_1.Input placeholder="Search flowers, occasions..." value={searchQuery} onChange={function (e) { return handleSearchChange(e.target.value); }} className="pl-10 pr-10 shadow-md border-2 focus:border-primary" autoFocus onFocus={function () { return searchQuery && setShowSearchResults(true); }} onKeyDown={function (e) {
                if (e.key === "Escape") {
                    setIsSearchOpen(false);
                    setShowSearchResults(false);
                }
            }}/>
              {searchQuery && (<button_1.Button variant="ghost" size="sm" className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-muted" onMouseDown={function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    setSearchQuery("");
                    setSearchResults([]);
                    setShowSearchResults(false);
                    setIsSearchOpen(false);
                }}>
                  <lucide_react_1.X className="h-4 w-4"/>
                </button_1.Button>)}

              {/* Desktop Search Results */}
              {showSearchResults && (<div className="absolute top-full left-0 w-full mt-1 bg-background border border-border rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
                  {isSearching ? (<div className="p-4 text-center text-muted-foreground">
                      <lucide_react_1.Search className="w-4 h-4 animate-spin mx-auto mb-2"/>
                      Searching...
                    </div>) : searchResults.length > 0 ? (<div className="py-2">
                      {/* Products Section */}
                      {searchResults.filter(function (result) { return result.type === "product"; }).length > 0 && (<div>
                          <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide border-b">
                            Products
                          </div>
                          {searchResults
                            .filter(function (result) { return result.type === "product"; })
                            .map(function (result) { return (<button key={"desktop-product-".concat(result.id)} onClick={function () {
                                handleResultClick(result);
                                setIsSearchOpen(false);
                            }} className="w-full px-4 py-3 text-left hover:bg-accent transition-colors flex items-center gap-3">
                                <div className="w-10 h-10 bg-muted rounded-md flex-shrink-0 overflow-hidden">
                                  {result.image ? (<img src={result.image} alt={result.name} className="w-full h-full object-cover"/>) : (<lucide_react_1.Package className="w-6 h-6 text-muted-foreground m-auto mt-2"/>)}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium text-sm truncate">
                                    {result.name}
                                  </div>
                                  {result.price && (<div className="text-xs text-muted-foreground">
                                      {result.sale_price &&
                                    result.sale_price < result.price ? (<>
                                          <span className="font-medium text-green-600">
                                            ₹{result.sale_price}
                                          </span>
                                          <span className="line-through ml-1">
                                            ₹{result.price}
                                          </span>
                                        </>) : (<span>₹{result.price}</span>)}
                                    </div>)}
                                </div>
                              </button>); })}
                        </div>)}

                      {/* Categories Section */}
                      {searchResults.filter(function (result) { return result.type === "category"; }).length > 0 && (<div>
                          <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide border-b border-t">
                            Categories
                          </div>
                          {searchResults
                            .filter(function (result) { return result.type === "category"; })
                            .map(function (result) { return (<button key={"desktop-category-".concat(result.id)} onClick={function () {
                                handleResultClick(result);
                                setIsSearchOpen(false);
                            }} className="w-full px-4 py-3 text-left hover:bg-accent transition-colors flex items-center gap-3">
                                <div className="w-10 h-10 bg-muted rounded-md flex-shrink-0 overflow-hidden">
                                  {result.image ? (<img src={result.image} alt={result.name} className="w-full h-full object-cover"/>) : (<lucide_react_1.Tag className="w-6 h-6 text-muted-foreground m-auto mt-2"/>)}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium text-sm truncate">
                                    {result.name}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    Category
                                  </div>
                                </div>
                              </button>); })}
                        </div>)}
                    </div>) : (searchQuery && (<div className="p-4 text-center text-muted-foreground">
                        <lucide_react_1.Search className="w-8 h-8 mx-auto mb-2 opacity-50"/>
                        <div className="text-sm">No matching results</div>
                        <div className="text-xs">
                          Try searching for flowers, categories, or occasions
                        </div>
                      </div>))}
                </div>)}
            </div>
          </div>)}

        {/* Mobile Search */}
        {isSearchOpen && (<div className="mt-4 md:hidden" ref={mobileSearchRef}>
            <div className="relative">
              <lucide_react_1.Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4"/>
              <input_1.Input placeholder="Search flowers, occasions..." value={searchQuery} onChange={function (e) { return handleSearchChange(e.target.value); }} className="pl-10 pr-10" autoFocus onFocus={function () { return searchQuery && setShowSearchResults(true); }}/>
              {searchQuery && (<button_1.Button variant="ghost" size="sm" className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-muted" onMouseDown={function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    setSearchQuery("");
                    setSearchResults([]);
                    setShowSearchResults(false);
                    setIsSearchOpen(false);
                }}>
                  <lucide_react_1.X className="h-4 w-4"/>
                </button_1.Button>)}

              {/* Mobile Search Results */}
              {showSearchResults && (<div className="absolute top-full left-0 w-full mt-1 bg-background border border-border rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
                  {isSearching ? (<div className="p-4 text-center text-muted-foreground">
                      <lucide_react_1.Search className="w-4 h-4 animate-spin mx-auto mb-2"/>
                      Searching...
                    </div>) : searchResults.length > 0 ? (<div className="py-2">
                      {/* Products Section */}
                      {searchResults.filter(function (result) { return result.type === "product"; }).length > 0 && (<div>
                          <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide border-b">
                            Products
                          </div>
                          {searchResults
                            .filter(function (result) { return result.type === "product"; })
                            .map(function (result) { return (<button key={"mobile-product-".concat(result.id)} onClick={function () {
                                handleResultClick(result);
                                setIsSearchOpen(false);
                            }} className="w-full px-4 py-3 text-left hover:bg-accent transition-colors flex items-center gap-3">
                                <div className="w-8 h-8 bg-muted rounded-md flex-shrink-0 overflow-hidden">
                                  {result.image ? (<img src={result.image} alt={result.name} className="w-full h-full object-cover"/>) : (<lucide_react_1.Package className="w-4 h-4 text-muted-foreground m-auto mt-2"/>)}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium text-sm truncate">
                                    {result.name}
                                  </div>
                                  {result.price && (<div className="text-xs text-muted-foreground">
                                      {result.sale_price &&
                                    result.sale_price < result.price ? (<>
                                          <span className="font-medium text-green-600">
                                            ₹{result.sale_price}
                                          </span>
                                          <span className="line-through ml-1">
                                            ₹{result.price}
                                          </span>
                                        </>) : (<span>₹{result.price}</span>)}
                                    </div>)}
                                </div>
                              </button>); })}
                        </div>)}

                      {/* Categories Section */}
                      {searchResults.filter(function (result) { return result.type === "category"; }).length > 0 && (<div>
                          <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide border-b border-t">
                            Categories
                          </div>
                          {searchResults
                            .filter(function (result) { return result.type === "category"; })
                            .map(function (result) { return (<button key={"mobile-category-".concat(result.id)} onClick={function () {
                                handleResultClick(result);
                                setIsSearchOpen(false);
                            }} className="w-full px-4 py-3 text-left hover:bg-accent transition-colors flex items-center gap-3">
                                <div className="w-8 h-8 bg-muted rounded-md flex-shrink-0 overflow-hidden">
                                  {result.image ? (<img src={result.image} alt={result.name} className="w-full h-full object-cover"/>) : (<lucide_react_1.Tag className="w-4 h-4 text-muted-foreground m-auto mt-2"/>)}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium text-sm truncate">
                                    {result.name}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    Category
                                  </div>
                                </div>
                              </button>); })}
                        </div>)}
                    </div>) : (searchQuery && (<div className="p-4 text-center text-muted-foreground">
                        <lucide_react_1.Search className="w-6 h-6 mx-auto mb-2 opacity-50"/>
                        <div className="text-sm">No matching results</div>
                        <div className="text-xs">
                          Try searching for flowers or categories
                        </div>
                      </div>))}
                </div>)}
            </div>
          </div>)}
      </div>
    </div>);
}
