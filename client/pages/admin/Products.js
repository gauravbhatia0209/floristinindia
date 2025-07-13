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
exports.default = AdminProducts;
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var lucide_react_1 = require("lucide-react");
var button_1 = require("@/components/ui/button");
var input_1 = require("@/components/ui/input");
var card_1 = require("@/components/ui/card");
var badge_1 = require("@/components/ui/badge");
var table_1 = require("@/components/ui/table");
var dropdown_menu_1 = require("@/components/ui/dropdown-menu");
var select_1 = require("@/components/ui/select");
var supabase_1 = require("@/lib/supabase");
function AdminProducts() {
    var _a = (0, react_1.useState)([]), products = _a[0], setProducts = _a[1];
    var _b = (0, react_1.useState)([]), categories = _b[0], setCategories = _b[1];
    var _c = (0, react_1.useState)(true), isLoading = _c[0], setIsLoading = _c[1];
    var _d = (0, react_1.useState)(""), searchQuery = _d[0], setSearchQuery = _d[1];
    var _e = (0, react_1.useState)("all"), selectedCategory = _e[0], setSelectedCategory = _e[1];
    var _f = (0, react_1.useState)("all"), selectedStatus = _f[0], setSelectedStatus = _f[1];
    (0, react_1.useEffect)(function () {
        fetchData();
    }, []);
    function fetchData() {
        return __awaiter(this, void 0, void 0, function () {
            var results, productsData, categoriesData, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, 3, 4]);
                        console.log("Fetching products and categories...");
                        return [4 /*yield*/, Promise.allSettled([
                                supabase_1.supabase.from("products").select("*").order("created_at", {
                                    ascending: false,
                                }),
                                supabase_1.supabase
                                    .from("product_categories")
                                    .select("*")
                                    .eq("is_active", true)
                                    .order("name"),
                            ])];
                    case 1:
                        results = _a.sent();
                        productsData = results[0].status === "fulfilled" ? results[0].value.data || [] : [];
                        categoriesData = results[1].status === "fulfilled" ? results[1].value.data || [] : [];
                        console.log("Fetched:", {
                            products: productsData.length,
                            categories: categoriesData.length,
                        });
                        setProducts(productsData);
                        setCategories(categoriesData);
                        return [3 /*break*/, 4];
                    case 2:
                        error_1 = _a.sent();
                        console.error("Failed to fetch data:", error_1);
                        // Set empty arrays on error
                        setProducts([]);
                        setCategories([]);
                        return [3 /*break*/, 4];
                    case 3:
                        setIsLoading(false);
                        return [7 /*endfinally*/];
                    case 4: return [2 /*return*/];
                }
            });
        });
    }
    var filteredProducts = products.filter(function (product) {
        var matchesSearch = product.name
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
        var matchesCategory = selectedCategory === "all" || product.category_id === selectedCategory;
        var matchesStatus = selectedStatus === "all" ||
            (selectedStatus === "active" && product.is_active) ||
            (selectedStatus === "inactive" && !product.is_active);
        return matchesSearch && matchesCategory && matchesStatus;
    });
    function getCategoryName(categoryId) {
        var category = categories.find(function (cat) { return cat.id === categoryId; });
        return (category === null || category === void 0 ? void 0 : category.name) || "Unknown";
    }
    function getStockStatus(stock) {
        if (stock === 0)
            return { label: "Out of Stock", variant: "destructive" };
        if (stock < 10)
            return { label: "Low Stock", variant: "secondary" };
        return { label: "In Stock", variant: "default" };
    }
    function handleDeleteProduct(productId) {
        return __awaiter(this, void 0, void 0, function () {
            var error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!confirm("Are you sure you want to delete this product?"))
                            return [2 /*return*/];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, supabase_1.supabase.from("products").delete().eq("id", productId)];
                    case 2:
                        _a.sent();
                        setProducts(products.filter(function (p) { return p.id !== productId; }));
                        return [3 /*break*/, 4];
                    case 3:
                        error_2 = _a.sent();
                        console.error("Failed to delete product:", error_2);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    }
    function toggleProductStatus(productId, currentStatus) {
        return __awaiter(this, void 0, void 0, function () {
            var error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, supabase_1.supabase
                                .from("products")
                                .update({ is_active: !currentStatus })
                                .eq("id", productId)];
                    case 1:
                        _a.sent();
                        setProducts(products.map(function (p) {
                            return p.id === productId ? __assign(__assign({}, p), { is_active: !currentStatus }) : p;
                        }));
                        return [3 /*break*/, 3];
                    case 2:
                        error_3 = _a.sent();
                        console.error("Failed to update product status:", error_3);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    }
    if (isLoading) {
        return (<div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded animate-pulse w-48"></div>
        <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
      </div>);
    }
    return (<div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-muted-foreground">
            Manage your flower catalog and inventory
          </p>
        </div>
        <button_1.Button asChild>
          <react_router_dom_1.Link to="/admin/products/new">
            <lucide_react_1.Plus className="h-4 w-4 mr-2"/>
            Add Product
          </react_router_dom_1.Link>
        </button_1.Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <card_1.Card>
          <card_1.CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <card_1.CardTitle className="text-sm font-medium">
              Total Products
            </card_1.CardTitle>
            <lucide_react_1.Package className="h-4 w-4 text-muted-foreground"/>
          </card_1.CardHeader>
          <card_1.CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
          </card_1.CardContent>
        </card_1.Card>
        <card_1.Card>
          <card_1.CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <card_1.CardTitle className="text-sm font-medium">Active</card_1.CardTitle>
            <div className="h-2 w-2 bg-green-500 rounded-full"></div>
          </card_1.CardHeader>
          <card_1.CardContent>
            <div className="text-2xl font-bold">
              {products.filter(function (p) { return p.is_active; }).length}
            </div>
          </card_1.CardContent>
        </card_1.Card>
        <card_1.Card>
          <card_1.CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <card_1.CardTitle className="text-sm font-medium">Low Stock</card_1.CardTitle>
            <div className="h-2 w-2 bg-orange-500 rounded-full"></div>
          </card_1.CardHeader>
          <card_1.CardContent>
            <div className="text-2xl font-bold">
              {products.filter(function (p) { return p.stock_quantity < 10; }).length}
            </div>
          </card_1.CardContent>
        </card_1.Card>
        <card_1.Card>
          <card_1.CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <card_1.CardTitle className="text-sm font-medium">Out of Stock</card_1.CardTitle>
            <div className="h-2 w-2 bg-red-500 rounded-full"></div>
          </card_1.CardHeader>
          <card_1.CardContent>
            <div className="text-2xl font-bold">
              {products.filter(function (p) { return p.stock_quantity === 0; }).length}
            </div>
          </card_1.CardContent>
        </card_1.Card>
      </div>

      {/* Filters */}
      <card_1.Card>
        <card_1.CardHeader>
          <card_1.CardTitle className="text-lg">Filter Products</card_1.CardTitle>
        </card_1.CardHeader>
        <card_1.CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <lucide_react_1.Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4"/>
                <input_1.Input placeholder="Search products..." value={searchQuery} onChange={function (e) { return setSearchQuery(e.target.value); }} className="pl-10"/>
              </div>
            </div>
            <select_1.Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <select_1.SelectTrigger className="w-full md:w-48">
                <select_1.SelectValue placeholder="All Categories"/>
              </select_1.SelectTrigger>
              <select_1.SelectContent>
                <select_1.SelectItem value="all">All Categories</select_1.SelectItem>
                {categories.map(function (category) { return (<select_1.SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </select_1.SelectItem>); })}
              </select_1.SelectContent>
            </select_1.Select>
            <select_1.Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <select_1.SelectTrigger className="w-full md:w-32">
                <select_1.SelectValue placeholder="Status"/>
              </select_1.SelectTrigger>
              <select_1.SelectContent>
                <select_1.SelectItem value="all">All Status</select_1.SelectItem>
                <select_1.SelectItem value="active">Active</select_1.SelectItem>
                <select_1.SelectItem value="inactive">Inactive</select_1.SelectItem>
              </select_1.SelectContent>
            </select_1.Select>
          </div>
        </card_1.CardContent>
      </card_1.Card>

      {/* Products Table */}
      <card_1.Card>
        <card_1.CardHeader>
          <card_1.CardTitle>Products ({filteredProducts.length})</card_1.CardTitle>
        </card_1.CardHeader>
        <card_1.CardContent>
          {filteredProducts.length === 0 ? (<div className="text-center py-12">
              <lucide_react_1.Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground"/>
              <h3 className="text-lg font-semibold mb-2">No products found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery
                ? "Try adjusting your search or filters"
                : "Get started by adding your first product"}
              </p>
              <button_1.Button asChild>
                <react_router_dom_1.Link to="/admin/products/new">
                  <lucide_react_1.Plus className="h-4 w-4 mr-2"/>
                  Add Product
                </react_router_dom_1.Link>
              </button_1.Button>
            </div>) : (<div className="overflow-x-auto">
              <table_1.Table>
                <table_1.TableHeader>
                  <table_1.TableRow>
                    <table_1.TableHead>Product</table_1.TableHead>
                    <table_1.TableHead>Category</table_1.TableHead>
                    <table_1.TableHead>Price</table_1.TableHead>
                    <table_1.TableHead>Stock</table_1.TableHead>
                    <table_1.TableHead>Status</table_1.TableHead>
                    <table_1.TableHead className="w-12"></table_1.TableHead>
                  </table_1.TableRow>
                </table_1.TableHeader>
                <table_1.TableBody>
                  {filteredProducts.map(function (product) { return (<table_1.TableRow key={product.id}>
                      <table_1.TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-cream to-peach/30 rounded-lg flex items-center justify-center">
                            {product.images.length > 0 ? (<img src={product.images[0]} alt={product.name} className="w-full h-full object-cover rounded-lg"/>) : (<span className="text-2xl">🌸</span>)}
                          </div>
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {product.sku || "No SKU"}
                            </p>
                          </div>
                        </div>
                      </table_1.TableCell>
                      <table_1.TableCell>
                        {getCategoryName(product.category_id)}
                      </table_1.TableCell>
                      <table_1.TableCell>
                        <div>
                          <span className="font-medium">
                            ₹{product.sale_price || product.price}
                          </span>
                          {product.sale_price && (<span className="text-sm text-muted-foreground line-through ml-2">
                              ₹{product.price}
                            </span>)}
                        </div>
                      </table_1.TableCell>
                      <table_1.TableCell>
                        <div className="flex items-center gap-2">
                          <span>{product.stock_quantity}</span>
                          <badge_1.Badge {...getStockStatus(product.stock_quantity)}>
                            {getStockStatus(product.stock_quantity).label}
                          </badge_1.Badge>
                        </div>
                      </table_1.TableCell>
                      <table_1.TableCell>
                        <badge_1.Badge variant={product.is_active ? "default" : "secondary"}>
                          {product.is_active ? "Active" : "Inactive"}
                        </badge_1.Badge>
                      </table_1.TableCell>
                      <table_1.TableCell>
                        <dropdown_menu_1.DropdownMenu>
                          <dropdown_menu_1.DropdownMenuTrigger asChild>
                            <button_1.Button variant="ghost" size="icon">
                              <lucide_react_1.MoreHorizontal className="h-4 w-4"/>
                            </button_1.Button>
                          </dropdown_menu_1.DropdownMenuTrigger>
                          <dropdown_menu_1.DropdownMenuContent align="end">
                            <dropdown_menu_1.DropdownMenuItem asChild>
                              <react_router_dom_1.Link to={"/product/".concat(product.slug)}>
                                <lucide_react_1.Eye className="h-4 w-4 mr-2"/>
                                View
                              </react_router_dom_1.Link>
                            </dropdown_menu_1.DropdownMenuItem>
                            <dropdown_menu_1.DropdownMenuItem asChild>
                              <react_router_dom_1.Link to={"/admin/products/".concat(product.id, "/edit")}>
                                <lucide_react_1.Edit className="h-4 w-4 mr-2"/>
                                Edit
                              </react_router_dom_1.Link>
                            </dropdown_menu_1.DropdownMenuItem>
                            <dropdown_menu_1.DropdownMenuItem onClick={function () {
                    return toggleProductStatus(product.id, product.is_active);
                }}>
                              {product.is_active ? "Deactivate" : "Activate"}
                            </dropdown_menu_1.DropdownMenuItem>
                            <dropdown_menu_1.DropdownMenuItem className="text-red-600" onClick={function () { return handleDeleteProduct(product.id); }}>
                              <lucide_react_1.Trash2 className="h-4 w-4 mr-2"/>
                              Delete
                            </dropdown_menu_1.DropdownMenuItem>
                          </dropdown_menu_1.DropdownMenuContent>
                        </dropdown_menu_1.DropdownMenu>
                      </table_1.TableCell>
                    </table_1.TableRow>); })}
                </table_1.TableBody>
              </table_1.Table>
            </div>)}
        </card_1.CardContent>
      </card_1.Card>
    </div>);
}
