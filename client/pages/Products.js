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
exports.default = Products;
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var lucide_react_1 = require("lucide-react");
var button_1 = require("@/components/ui/button");
var card_1 = require("@/components/ui/card");
var badge_1 = require("@/components/ui/badge");
var select_1 = require("@/components/ui/select");
var dropdown_menu_1 = require("@/components/ui/dropdown-menu");
var popover_1 = require("@/components/ui/popover");
var label_1 = require("@/components/ui/label");
var slider_1 = require("@/components/ui/slider");
var supabase_1 = require("@/lib/supabase");
var useCart_1 = require("@/hooks/useCart");
var use_toast_1 = require("@/hooks/use-toast");
var productUtils_1 = require("@/lib/productUtils");
var AIMetaTags_1 = require("@/components/AIMetaTags");
var GoogleAnalytics_1 = require("@/components/GoogleAnalytics");
var FacebookPixel_1 = require("@/components/FacebookPixel");
function Products() {
    var _a = (0, react_1.useState)([]), products = _a[0], setProducts = _a[1];
    var _b = (0, react_1.useState)([]), categories = _b[0], setCategories = _b[1];
    var _c = (0, react_1.useState)([]), filteredProducts = _c[0], setFilteredProducts = _c[1];
    var _d = (0, react_1.useState)(null), currentCategory = _d[0], setCurrentCategory = _d[1];
    var _e = (0, react_1.useState)(true), isLoading = _e[0], setIsLoading = _e[1];
    var _f = (0, react_1.useState)("grid"), viewMode = _f[0], setViewMode = _f[1];
    var _g = (0, react_1.useState)([0, 5000]), priceRange = _g[0], setPriceRange = _g[1];
    var _h = (0, react_1.useState)([]), selectedCategories = _h[0], setSelectedCategories = _h[1];
    var _j = (0, react_1.useState)("name"), sortBy = _j[0], setSortBy = _j[1];
    var _k = (0, react_1.useState)(false), isFilterExpanded = _k[0], setIsFilterExpanded = _k[1];
    var categorySlug = (0, react_router_dom_1.useParams)().slug;
    var addItem = (0, useCart_1.useCart)().addItem;
    var toast = (0, use_toast_1.useToast)().toast;
    var trackAddToCart = (0, GoogleAnalytics_1.useGoogleAnalytics)().trackAddToCart;
    var trackFBAddToCart = (0, FacebookPixel_1.useFacebookPixel)().trackAddToCart;
    (0, react_1.useEffect)(function () {
        fetchData();
    }, [categorySlug]); // Refetch when category slug changes
    (0, react_1.useEffect)(function () {
        filterAndSortProducts();
    }, [products, selectedCategories, priceRange, sortBy, categorySlug]);
    function fetchData() {
        return __awaiter(this, void 0, void 0, function () {
            var productsData, _a, currentCategoryData, categoryError, _b, assignments, assignmentError, _c, legacyProducts, legacyError, allProducts, categoriesWithCounts, error_1, allProducts, categoriesData, fallbackError_1;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 12, 18, 19]);
                        if (import.meta.env.DEV) {
                            console.log("fetchData called with categorySlug:", categorySlug);
                        }
                        productsData = [];
                        if (!categorySlug) return [3 /*break*/, 8];
                        if (import.meta.env.DEV) {
                            console.log("Fetching products for category:", categorySlug);
                        }
                        return [4 /*yield*/, supabase_1.supabase
                                .from("product_categories")
                                .select("*")
                                .eq("slug", categorySlug)
                                .single()];
                    case 1:
                        _a = _d.sent(), currentCategoryData = _a.data, categoryError = _a.error;
                        if (import.meta.env.DEV) {
                            console.log("Category lookup result:", {
                                currentCategoryData: currentCategoryData,
                                categoryError: categoryError,
                            });
                        }
                        if (!currentCategoryData) return [3 /*break*/, 6];
                        setCurrentCategory(currentCategoryData);
                        setSelectedCategories([currentCategoryData.id]);
                        // Fetch products for this specific category - try direct approach first
                        if (import.meta.env.DEV) {
                            console.log("Fetching products for category ID:", currentCategoryData.id);
                        }
                        return [4 /*yield*/, supabase_1.supabase
                                .from("product_category_assignments")
                                .select("\n              product_id,\n              products!inner(*)\n            ")
                                .eq("category_id", currentCategoryData.id)];
                    case 2:
                        _b = _d.sent(), assignments = _b.data, assignmentError = _b.error;
                        if (import.meta.env.DEV) {
                            console.log("Multi-category assignments:", {
                                assignments: assignments,
                                assignmentError: assignmentError,
                            });
                        }
                        if (!(assignments && assignments.length > 0)) return [3 /*break*/, 3];
                        // Use multi-category data
                        productsData = assignments
                            .map(function (a) { return a.products; })
                            .filter(function (p) { return p && p.is_active; });
                        if (import.meta.env.DEV) {
                            console.log("Using multi-category data, found products:", productsData.length);
                        }
                        return [3 /*break*/, 5];
                    case 3:
                        // Fall back to legacy single category
                        if (import.meta.env.DEV) {
                            console.log("Falling back to legacy single category");
                        }
                        return [4 /*yield*/, supabase_1.supabase
                                .from("products")
                                .select("*")
                                .eq("category_id", currentCategoryData.id)
                                .eq("is_active", true)];
                    case 4:
                        _c = _d.sent(), legacyProducts = _c.data, legacyError = _c.error;
                        if (import.meta.env.DEV) {
                            console.log("Legacy products:", { legacyProducts: legacyProducts, legacyError: legacyError });
                        }
                        productsData = legacyProducts || [];
                        _d.label = 5;
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        if (import.meta.env.DEV) {
                            console.log("Category not found for slug:", categorySlug);
                        }
                        _d.label = 7;
                    case 7: return [3 /*break*/, 10];
                    case 8:
                        if (import.meta.env.DEV) {
                            console.log("No category slug, fetching all products");
                        }
                        return [4 /*yield*/, supabase_1.supabase
                                .from("products")
                                .select("*")
                                .eq("is_active", true)];
                    case 9:
                        allProducts = (_d.sent()).data;
                        productsData = allProducts || [];
                        setCurrentCategory(null);
                        setSelectedCategories([]);
                        _d.label = 10;
                    case 10: return [4 /*yield*/, (0, productUtils_1.getCategoriesWithProductCount)()];
                    case 11:
                        categoriesWithCounts = _d.sent();
                        setCategories(categoriesWithCounts);
                        if (import.meta.env.DEV) {
                            console.log("Setting products data:", productsData.length, "products");
                        }
                        setProducts(productsData);
                        return [3 /*break*/, 19];
                    case 12:
                        error_1 = _d.sent();
                        console.error("Failed to fetch products:", error_1);
                        _d.label = 13;
                    case 13:
                        _d.trys.push([13, 16, , 17]);
                        if (import.meta.env.DEV) {
                            console.log("Using fallback queries");
                        }
                        return [4 /*yield*/, supabase_1.supabase
                                .from("products")
                                .select("*")
                                .eq("is_active", true)];
                    case 14:
                        allProducts = (_d.sent()).data;
                        return [4 /*yield*/, supabase_1.supabase
                                .from("product_categories")
                                .select("*")
                                .eq("is_active", true)
                                .order("sort_order")];
                    case 15:
                        categoriesData = (_d.sent()).data;
                        if (import.meta.env.DEV) {
                            console.log("Fallback data:", {
                                productsCount: (allProducts === null || allProducts === void 0 ? void 0 : allProducts.length) || 0,
                                categoriesCount: (categoriesData === null || categoriesData === void 0 ? void 0 : categoriesData.length) || 0,
                            });
                        }
                        setProducts(allProducts || []);
                        setCategories(categoriesData || []);
                        return [3 /*break*/, 17];
                    case 16:
                        fallbackError_1 = _d.sent();
                        console.error("Fallback query also failed:", fallbackError_1);
                        return [3 /*break*/, 17];
                    case 17: return [3 /*break*/, 19];
                    case 18:
                        setIsLoading(false);
                        return [7 /*endfinally*/];
                    case 19: return [2 /*return*/];
                }
            });
        });
    }
    function filterAndSortProducts() {
        var filtered = __spreadArray([], products, true);
        if (import.meta.env.DEV) {
            console.log("filterAndSortProducts called with:", {
                productsCount: products.length,
                selectedCategories: selectedCategories.length,
                categorySlug: categorySlug,
                currentCategory: currentCategory === null || currentCategory === void 0 ? void 0 : currentCategory.name,
            });
        }
        // When on a category page, products are already filtered by fetchData
        // Only apply additional category filtering if:
        // 1. We're NOT on a category page (categorySlug is null) AND user selected categories
        // 2. OR we're on a category page AND user selected different/additional categories
        if (!categorySlug && selectedCategories.length > 0) {
            // On "All Products" page with manual category selection
            filtered = filtered.filter(function (product) {
                return selectedCategories.includes(product.category_id);
            });
            if (import.meta.env.DEV) {
                console.log("Applied manual category filtering, result:", filtered.length);
            }
        }
        // If on category page, don't apply additional category filtering unless user deliberately changes selection
        // Filter by price range
        filtered = filtered.filter(function (product) {
            var price = product.sale_price || product.price;
            return price >= priceRange[0] && price <= priceRange[1];
        });
        // Sort products
        filtered.sort(function (a, b) {
            switch (sortBy) {
                case "price_low":
                    return (a.sale_price || a.price) - (b.sale_price || b.price);
                case "price_high":
                    return (b.sale_price || b.price) - (a.sale_price || a.price);
                case "name":
                default:
                    return a.name.localeCompare(b.name);
            }
        });
        setFilteredProducts(filtered);
    }
    function handleAddToCart(product) {
        addItem({
            product_id: product.id,
            product: product,
        });
        trackAddToCart(product.id, product.name, product.sale_price || product.price);
        trackFBAddToCart(product.name, product.id, product.sale_price || product.price, "INR");
        toast({
            title: "Added to cart!",
            description: "".concat(product.name, " has been added to your cart."),
            variant: "default",
        });
    }
    if (isLoading) {
        return (<div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {__spreadArray([], Array(12), true).map(function (_, i) { return (<div key={i} className="aspect-square bg-muted rounded-lg animate-pulse"></div>); })}
        </div>
      </div>);
    }
    return (<div className="container py-8">
      <AIMetaTags_1.default page={currentCategory ? "category" : "products"} category={currentCategory}/>
      {/* Header */}
      <div className="mb-8">
        {/* Breadcrumb */}
        {currentCategory && (<nav className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
            <react_router_dom_1.Link to="/" className="hover:text-primary">
              Home
            </react_router_dom_1.Link>
            <span>/</span>
            <react_router_dom_1.Link to="/products" className="hover:text-primary">
              Products
            </react_router_dom_1.Link>
            <span>/</span>
            <span className="text-foreground">{currentCategory.name}</span>
          </nav>)}

        <h1 className="text-3xl font-bold mb-2">
          {currentCategory ? currentCategory.name : "All Products"}
        </h1>
        <p className="text-muted-foreground">
          {currentCategory
            ? currentCategory.description ||
                "Discover our beautiful collection of ".concat(currentCategory.name.toLowerCase())
            : "Discover our beautiful collection of fresh flowers"}
        </p>

        {/* Product count */}
        <div className="mt-4"/>
      </div>

      {/* Unified Horizontal Filter Bar */}
      <div className="bg-white border rounded-lg mb-6 shadow-sm border-border/50">
        {/* Mobile Filter Header */}
        <div className="lg:hidden">
          <button onClick={function () { return setIsFilterExpanded(!isFilterExpanded); }} className="w-full flex items-center justify-between p-4 text-sm font-medium text-muted-foreground">
            <div className="flex items-center gap-2">
              <lucide_react_1.Filter className="w-4 h-4"/>
              <span>Filters</span>
              {(selectedCategories.length > 0 ||
            priceRange[0] > 0 ||
            priceRange[1] < 5000) && (<badge_1.Badge variant="secondary" className="ml-2 h-4 px-1.5 text-xs">
                  {selectedCategories.length +
                (priceRange[0] > 0 || priceRange[1] < 5000 ? 1 : 0)}
                </badge_1.Badge>)}
            </div>
            {isFilterExpanded ? (<lucide_react_1.ChevronUp className="w-4 h-4"/>) : (<lucide_react_1.ChevronDown className="w-4 h-4"/>)}
          </button>
        </div>

        {/* Filter Content */}
        <div className={"".concat(isFilterExpanded ? "block" : "hidden", " lg:block p-4 ").concat(isFilterExpanded ? "border-t border-border/50" : "")}>
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Filter Title - Desktop Only */}
            <div className="hidden lg:flex items-center gap-2 text-sm font-medium text-muted-foreground flex-shrink-0 h-9">
              <lucide_react_1.Filter className="w-4 h-4"/>
              <span>Filters:</span>
            </div>

            {/* Main Filter Bar Container */}
            <div className="flex flex-col sm:flex-row gap-4 sm:justify-between sm:items-center flex-1">
              {/* Left Group: Filter Controls */}
              <div className="flex flex-wrap items-center gap-4">
                {/* Categories Dropdown */}
                <dropdown_menu_1.DropdownMenu>
                  <dropdown_menu_1.DropdownMenuTrigger asChild>
                    <button_1.Button variant="outline" className="h-9 gap-2 w-fit max-w-[180px] min-w-[110px] flex-shrink-0 px-3">
                      <span className="truncate">Categories</span>
                      {selectedCategories.length > 0 && (<badge_1.Badge variant="secondary" className="ml-1 h-4 min-w-[16px] px-1.5 text-xs">
                          {selectedCategories.length}
                        </badge_1.Badge>)}
                      <lucide_react_1.ChevronDown className="w-4 h-4 flex-shrink-0"/>
                    </button_1.Button>
                  </dropdown_menu_1.DropdownMenuTrigger>
                  <dropdown_menu_1.DropdownMenuContent className="w-56" align="start">
                    <dropdown_menu_1.DropdownMenuLabel>Select Categories</dropdown_menu_1.DropdownMenuLabel>
                    <dropdown_menu_1.DropdownMenuSeparator />
                    {categories.map(function (category) { return (<dropdown_menu_1.DropdownMenuCheckboxItem key={category.id} checked={selectedCategories.includes(category.id)} onCheckedChange={function (checked) {
                if (checked) {
                    setSelectedCategories(__spreadArray(__spreadArray([], selectedCategories, true), [
                        category.id,
                    ], false));
                }
                else {
                    setSelectedCategories(selectedCategories.filter(function (id) { return id !== category.id; }));
                }
            }}>
                        <div className="flex justify-between items-center w-full">
                          <span>{category.name}</span>
                          {category.product_count !== undefined && (<badge_1.Badge variant="outline" className="text-xs ml-2">
                              {category.product_count}
                            </badge_1.Badge>)}
                        </div>
                      </dropdown_menu_1.DropdownMenuCheckboxItem>); })}
                    {selectedCategories.length > 0 && (<>
                        <dropdown_menu_1.DropdownMenuSeparator />
                        <button_1.Button variant="ghost" size="sm" className="w-full h-8 text-xs" onClick={function () {
                if (categorySlug && currentCategory) {
                    // If on category page, reset to just the current category
                    setSelectedCategories([currentCategory.id]);
                }
                else {
                    // If on all products page, clear all selections
                    setSelectedCategories([]);
                }
            }}>
                          {categorySlug
                ? "Reset to Current Category"
                : "Clear All"}
                        </button_1.Button>
                      </>)}
                  </dropdown_menu_1.DropdownMenuContent>
                </dropdown_menu_1.DropdownMenu>

                {/* Price Range Popover */}
                <popover_1.Popover>
                  <popover_1.PopoverTrigger asChild>
                    <button_1.Button variant="outline" className="h-9 gap-2 w-fit max-w-[200px] min-w-[130px] flex-shrink-0 px-3">
                      <span className="truncate">Price Range</span>
                      {(priceRange[0] > 0 || priceRange[1] < 5000) && (<badge_1.Badge variant="secondary" className="ml-1 h-4 px-1.5 text-xs">
                          ₹{priceRange[0]}-₹{priceRange[1]}
                        </badge_1.Badge>)}
                      <lucide_react_1.ChevronDown className="w-4 h-4 flex-shrink-0"/>
                    </button_1.Button>
                  </popover_1.PopoverTrigger>
                  <popover_1.PopoverContent className="w-80" align="start">
                    <div className="space-y-4">
                      <div>
                        <label_1.Label className="text-sm font-medium">
                          Price Range
                        </label_1.Label>
                        <div className="mt-4 px-3 py-2">
                          <slider_1.Slider value={priceRange} onValueChange={setPriceRange} max={5000} min={0} step={100} className="w-full"/>
                        </div>
                        <div className="flex justify-between text-sm text-muted-foreground mt-3 px-1">
                          <span className="font-medium">
                            ₹{priceRange[0].toLocaleString()}
                          </span>
                          <span className="text-xs text-muted-foreground/70">
                            to
                          </span>
                          <span className="font-medium">
                            ₹{priceRange[1].toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button_1.Button variant="outline" size="sm" className="flex-1 h-8" onClick={function () { return setPriceRange([0, 5000]); }}>
                          Reset
                        </button_1.Button>
                      </div>
                    </div>
                  </popover_1.PopoverContent>
                </popover_1.Popover>

                {/* Sort By Dropdown */}
                <select_1.Select value={sortBy} onValueChange={setSortBy}>
                  <select_1.SelectTrigger className="h-9 w-fit max-w-[220px] min-w-[120px] gap-2 flex-shrink-0 px-3">
                    <select_1.SelectValue placeholder="Sort by"/>
                  </select_1.SelectTrigger>
                  <select_1.SelectContent>
                    <select_1.SelectItem value="name">Sort by Name</select_1.SelectItem>
                    <select_1.SelectItem value="price_low">
                      Price: Low to High
                    </select_1.SelectItem>
                    <select_1.SelectItem value="price_high">
                      Price: High to Low
                    </select_1.SelectItem>
                  </select_1.SelectContent>
                </select_1.Select>

                {/* Clear All Filters Button */}
                {(selectedCategories.length > 0 ||
            priceRange[0] > 0 ||
            priceRange[1] < 5000) && (<button_1.Button variant="ghost" size="sm" className="h-9 px-3 text-xs flex-shrink-0 w-fit" onClick={function () {
                if (categorySlug && currentCategory) {
                    // If on category page, reset to just the current category
                    setSelectedCategories([currentCategory.id]);
                }
                else {
                    // If on all products page, clear all selections
                    setSelectedCategories([]);
                }
                setPriceRange([0, 5000]);
            }}>
                    <lucide_react_1.X className="w-3 h-3 mr-1"/>
                    {categorySlug ? "Reset Filters" : "Clear All"}
                  </button_1.Button>)}
              </div>

              {/* Right Group: View Mode Toggle */}
              <div className="flex items-center justify-end ml-auto flex-shrink-0">
                <div className="flex items-center border rounded-md h-9">
                  <button_1.Button variant={viewMode === "grid" ? "default" : "ghost"} size="sm" onClick={function () { return setViewMode("grid"); }} className="rounded-r-none h-9 w-9 p-0 border-0" title="Grid View">
                    <lucide_react_1.Grid className="w-4 h-4"/>
                  </button_1.Button>
                  <button_1.Button variant={viewMode === "list" ? "default" : "ghost"} size="sm" onClick={function () { return setViewMode("list"); }} className="rounded-l-none h-9 w-9 p-0 border-0" title="List View">
                    <lucide_react_1.List className="w-4 h-4"/>
                  </button_1.Button>
                </div>
              </div>
            </div>
          </div>

          {/* Active Filter Tags (Mobile-friendly) */}
          {(selectedCategories.length > 0 ||
            priceRange[0] > 0 ||
            priceRange[1] < 5000) && (<div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-border/50">
              <span className="text-xs text-muted-foreground font-medium">
                Active filters:
              </span>
              {selectedCategories.map(function (categoryId) {
                var category = categories.find(function (c) { return c.id === categoryId; });
                return (<badge_1.Badge key={categoryId} variant="secondary" className="text-xs gap-1 h-6">
                    {category === null || category === void 0 ? void 0 : category.name}
                    <button onClick={function () {
                        return setSelectedCategories(selectedCategories.filter(function (id) { return id !== categoryId; }));
                    }} className="hover:bg-muted-foreground/20 rounded-full p-0.5 ml-1">
                      <lucide_react_1.X className="w-3 h-3"/>
                    </button>
                  </badge_1.Badge>);
            })}
              {(priceRange[0] > 0 || priceRange[1] < 5000) && (<badge_1.Badge variant="secondary" className="text-xs gap-1 h-6">
                  ��{priceRange[0]} - ₹{priceRange[1]}
                  <button onClick={function () { return setPriceRange([0, 5000]); }} className="hover:bg-muted-foreground/20 rounded-full p-0.5 ml-1">
                    <lucide_react_1.X className="w-3 h-3"/>
                  </button>
                </badge_1.Badge>)}
            </div>)}
        </div>
      </div>

      {/* Products Section */}
      <div>
        {/* Product Count Display */}
        <div className="mb-6">
          <span className="text-sm text-muted-foreground">
            {filteredProducts.length} products found
          </span>
        </div>

        {/* Products Grid */}
        <div className={viewMode === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            : "space-y-4"}>
          {filteredProducts.map(function (product) { return (<card_1.Card key={product.id} className={"border-0 shadow-lg overflow-hidden ".concat(viewMode === "list" ? "flex" : "")}>
              <div className={"bg-gradient-to-br from-cream to-peach/30 flex items-center justify-center relative overflow-hidden ".concat(viewMode === "list" ? "w-48 flex-shrink-0" : "aspect-square")}>
                {product.images.length > 0 ? (<img src={product.images[0]} alt={product.name} className="w-full h-full object-cover image-hover"/>) : (<span className="text-6xl animate-pulse">🌺</span>)}
                {product.sale_price && (<badge_1.Badge className="absolute top-2 left-2 bg-destructive text-destructive-foreground">
                    SALE
                  </badge_1.Badge>)}
              </div>

              <card_1.CardContent className="p-4 flex-1">
                <react_router_dom_1.Link to={"/product/".concat(product.slug)}>
                  <h3 className="font-semibold mb-2 line-clamp-2">
                    {product.name}
                  </h3>
                </react_router_dom_1.Link>

                {viewMode === "list" && product.short_description && (<p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {product.short_description}
                  </p>)}

                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-primary">
                      ₹{product.sale_price || product.price}
                    </span>
                    {product.sale_price && (<span className="text-sm text-muted-foreground line-through">
                        ₹{product.price}
                      </span>)}
                  </div>
                </div>

                {/* Add to Cart Button - Always Visible */}
                <button_1.Button onClick={function () { return handleAddToCart(product); }} size="sm" className="w-full">
                  <lucide_react_1.ShoppingCart className="w-4 h-4 mr-2"/>
                  Add to Cart
                </button_1.Button>
              </card_1.CardContent>
            </card_1.Card>); })}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (<div className="text-center py-12">
            <div className="text-6xl mb-4">🌸</div>
            <h3 className="text-xl font-semibold mb-2">No flowers found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your filters or search criteria
            </p>
            <button_1.Button onClick={function () {
                setSelectedCategories([]);
                setPriceRange([0, 5000]);
            }}>
              Clear Filters
            </button_1.Button>
          </div>)}
      </div>
    </div>);
}
