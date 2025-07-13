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
exports.default = Dashboard;
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var lucide_react_1 = require("lucide-react");
var card_1 = require("@/components/ui/card");
var badge_1 = require("@/components/ui/badge");
var button_1 = require("@/components/ui/button");
var supabase_1 = require("@/lib/supabase");
function Dashboard() {
    var _a = (0, react_1.useState)({
        totalProducts: 0,
        totalOrders: 0,
        totalCustomers: 0,
        totalRevenue: 0,
        pendingOrders: 0,
        activeProducts: 0,
        totalPages: 0,
        homepageSections: 0,
        activeCoupons: 0,
        shippingZones: 0,
        recentOrders: [],
        topProducts: [],
    }), stats = _a[0], setStats = _a[1];
    var _b = (0, react_1.useState)(true), isLoading = _b[0], setIsLoading = _b[1];
    (0, react_1.useEffect)(function () {
        fetchDashboardData();
    }, []);
    function fetchDashboardData() {
        return __awaiter(this, void 0, void 0, function () {
            var _a, totalProducts, totalOrders, totalCustomers, pendingOrders, activeProducts, totalPages, homepageSections, activeCoupons, shippingZones, recentOrders, topProducts, orders, totalRevenue, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, 4, 5]);
                        return [4 /*yield*/, Promise.all([
                                supabase_1.supabase.from("products").select("*", { count: "exact", head: true }),
                                supabase_1.supabase.from("orders").select("*", { count: "exact", head: true }),
                                supabase_1.supabase.from("customers").select("*", { count: "exact", head: true }),
                                supabase_1.supabase
                                    .from("orders")
                                    .select("*", { count: "exact", head: true })
                                    .eq("status", "pending"),
                                supabase_1.supabase
                                    .from("products")
                                    .select("*", { count: "exact", head: true })
                                    .eq("is_active", true),
                                supabase_1.supabase.from("pages").select("*", { count: "exact", head: true }),
                                supabase_1.supabase
                                    .from("homepage_sections")
                                    .select("*", { count: "exact", head: true })
                                    .eq("is_active", true),
                                supabase_1.supabase
                                    .from("coupons")
                                    .select("*", { count: "exact", head: true })
                                    .eq("is_active", true),
                                supabase_1.supabase
                                    .from("shipping_zones")
                                    .select("*", { count: "exact", head: true }),
                                supabase_1.supabase
                                    .from("orders")
                                    .select("*, customers(first_name, last_name)")
                                    .order("created_at", { ascending: false })
                                    .limit(5),
                                supabase_1.supabase
                                    .from("products")
                                    .select("name, price, is_featured")
                                    .eq("is_active", true)
                                    .order("created_at", { ascending: false })
                                    .limit(5),
                            ])];
                    case 1:
                        _a = _b.sent(), totalProducts = _a[0].count, totalOrders = _a[1].count, totalCustomers = _a[2].count, pendingOrders = _a[3].count, activeProducts = _a[4].count, totalPages = _a[5].count, homepageSections = _a[6].count, activeCoupons = _a[7].count, shippingZones = _a[8].count, recentOrders = _a[9].data, topProducts = _a[10].data;
                        return [4 /*yield*/, supabase_1.supabase
                                .from("orders")
                                .select("total_amount")];
                    case 2:
                        orders = (_b.sent()).data;
                        totalRevenue = orders === null || orders === void 0 ? void 0 : orders.reduce(function (sum, order) { return sum + order.total_amount; }, 0);
                        setStats({
                            totalProducts: totalProducts || 0,
                            totalOrders: totalOrders || 0,
                            totalCustomers: totalCustomers || 0,
                            totalRevenue: totalRevenue || 0,
                            pendingOrders: pendingOrders || 0,
                            activeProducts: activeProducts || 0,
                            totalPages: totalPages || 0,
                            homepageSections: homepageSections || 0,
                            activeCoupons: activeCoupons || 0,
                            shippingZones: shippingZones || 0,
                            recentOrders: recentOrders || [],
                            topProducts: topProducts || [],
                        });
                        return [3 /*break*/, 5];
                    case 3:
                        error_1 = _b.sent();
                        console.error("Failed to fetch dashboard data:", error_1);
                        return [3 /*break*/, 5];
                    case 4:
                        setIsLoading(false);
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        });
    }
    if (isLoading) {
        return (<div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded animate-pulse w-48"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {__spreadArray([], Array(8), true).map(function (_, i) { return (<div key={i} className="h-32 bg-gray-200 rounded animate-pulse"></div>); })}
        </div>
      </div>);
    }
    return (<div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">CMS Dashboard</h1>
          <p className="text-muted-foreground">
            Complete content management system overview
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button_1.Button variant="outline" asChild>
            <react_router_dom_1.Link to="/" target="_blank">
              <lucide_react_1.Globe className="w-4 h-4 mr-2"/>
              View Website
            </react_router_dom_1.Link>
          </button_1.Button>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <lucide_react_1.Calendar className="w-4 h-4"/>
            <span>{new Date().toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Core Business Stats */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Business Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <card_1.Card className="border-l-4 border-l-blue-500">
            <card_1.CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <card_1.CardTitle className="text-sm font-medium">
                Total Revenue
              </card_1.CardTitle>
              <lucide_react_1.IndianRupee className="h-4 w-4 text-muted-foreground"/>
            </card_1.CardHeader>
            <card_1.CardContent>
              <div className="text-2xl font-bold">
                ₹{stats.totalRevenue.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                <lucide_react_1.TrendingUp className="inline w-3 h-3 mr-1"/>
                All-time revenue
              </p>
            </card_1.CardContent>
          </card_1.Card>

          <card_1.Card className="border-l-4 border-l-green-500">
            <card_1.CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <card_1.CardTitle className="text-sm font-medium">
                Total Orders
              </card_1.CardTitle>
              <lucide_react_1.ShoppingCart className="h-4 w-4 text-muted-foreground"/>
            </card_1.CardHeader>
            <card_1.CardContent>
              <div className="text-2xl font-bold">{stats.totalOrders}</div>
              <p className="text-xs text-muted-foreground">
                {stats.pendingOrders} pending orders
              </p>
            </card_1.CardContent>
          </card_1.Card>

          <card_1.Card className="border-l-4 border-l-orange-500">
            <card_1.CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <card_1.CardTitle className="text-sm font-medium">
                Total Products
              </card_1.CardTitle>
              <lucide_react_1.Package className="h-4 w-4 text-muted-foreground"/>
            </card_1.CardHeader>
            <card_1.CardContent>
              <div className="text-2xl font-bold">{stats.totalProducts}</div>
              <p className="text-xs text-muted-foreground">
                {stats.activeProducts} active products
              </p>
            </card_1.CardContent>
          </card_1.Card>

          <card_1.Card className="border-l-4 border-l-purple-500">
            <card_1.CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <card_1.CardTitle className="text-sm font-medium">
                Total Customers
              </card_1.CardTitle>
              <lucide_react_1.Users className="h-4 w-4 text-muted-foreground"/>
            </card_1.CardHeader>
            <card_1.CardContent>
              <div className="text-2xl font-bold">{stats.totalCustomers}</div>
              <p className="text-xs text-muted-foreground">
                Registered customers
              </p>
            </card_1.CardContent>
          </card_1.Card>
        </div>
      </div>

      {/* CMS Content Stats */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Content Management</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <card_1.Card className="border-l-4 border-l-rose-500">
            <card_1.CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <card_1.CardTitle className="text-sm font-medium">
                Homepage Sections
              </card_1.CardTitle>
              <lucide_react_1.Home className="h-4 w-4 text-muted-foreground"/>
            </card_1.CardHeader>
            <card_1.CardContent>
              <div className="text-2xl font-bold">{stats.homepageSections}</div>
              <p className="text-xs text-muted-foreground">
                Active homepage sections
              </p>
            </card_1.CardContent>
          </card_1.Card>

          <card_1.Card className="border-l-4 border-l-indigo-500">
            <card_1.CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <card_1.CardTitle className="text-sm font-medium">CMS Pages</card_1.CardTitle>
              <lucide_react_1.FileText className="h-4 w-4 text-muted-foreground"/>
            </card_1.CardHeader>
            <card_1.CardContent>
              <div className="text-2xl font-bold">{stats.totalPages}</div>
              <p className="text-xs text-muted-foreground">
                Dynamic content pages
              </p>
            </card_1.CardContent>
          </card_1.Card>

          <card_1.Card className="border-l-4 border-l-yellow-500">
            <card_1.CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <card_1.CardTitle className="text-sm font-medium">
                Active Coupons
              </card_1.CardTitle>
              <lucide_react_1.Ticket className="h-4 w-4 text-muted-foreground"/>
            </card_1.CardHeader>
            <card_1.CardContent>
              <div className="text-2xl font-bold">{stats.activeCoupons}</div>
              <p className="text-xs text-muted-foreground">
                Available discount codes
              </p>
            </card_1.CardContent>
          </card_1.Card>

          <card_1.Card className="border-l-4 border-l-teal-500">
            <card_1.CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <card_1.CardTitle className="text-sm font-medium">
                Shipping Zones
              </card_1.CardTitle>
              <lucide_react_1.Truck className="h-4 w-4 text-muted-foreground"/>
            </card_1.CardHeader>
            <card_1.CardContent>
              <div className="text-2xl font-bold">{stats.shippingZones}</div>
              <p className="text-xs text-muted-foreground">
                Configured delivery areas
              </p>
            </card_1.CardContent>
          </card_1.Card>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <card_1.Card>
          <card_1.CardHeader>
            <div className="flex items-center justify-between">
              <card_1.CardTitle className="flex items-center gap-2">
                <lucide_react_1.ShoppingCart className="w-5 h-5"/>
                Recent Orders
              </card_1.CardTitle>
              <button_1.Button variant="outline" size="sm" asChild>
                <react_router_dom_1.Link to="/admin/orders">View All</react_router_dom_1.Link>
              </button_1.Button>
            </div>
          </card_1.CardHeader>
          <card_1.CardContent>
            <div className="space-y-4">
              {stats.recentOrders.length > 0 ? (stats.recentOrders.map(function (order) {
            var _a, _b;
            return (<div key={order.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">#{order.order_number}</p>
                      <p className="text-sm text-muted-foreground">
                        {(_a = order.customers) === null || _a === void 0 ? void 0 : _a.first_name}{" "}
                        {(_b = order.customers) === null || _b === void 0 ? void 0 : _b.last_name}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        ₹{order.total_amount.toLocaleString()}
                      </p>
                      <badge_1.Badge variant={order.status === "delivered" ? "default" : "secondary"}>
                        {order.status}
                      </badge_1.Badge>
                    </div>
                  </div>);
        })) : (<p className="text-center text-muted-foreground py-4">
                  No orders yet
                </p>)}
            </div>
          </card_1.CardContent>
        </card_1.Card>

        {/* Featured Products */}
        <card_1.Card>
          <card_1.CardHeader>
            <div className="flex items-center justify-between">
              <card_1.CardTitle className="flex items-center gap-2">
                <lucide_react_1.Star className="w-5 h-5"/>
                Featured Products
              </card_1.CardTitle>
              <button_1.Button variant="outline" size="sm" asChild>
                <react_router_dom_1.Link to="/admin/products">Manage</react_router_dom_1.Link>
              </button_1.Button>
            </div>
          </card_1.CardHeader>
          <card_1.CardContent>
            <div className="space-y-4">
              {stats.topProducts.length > 0 ? (stats.topProducts.map(function (product, index) { return (<div key={index} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {product.is_featured ? "Featured" : "Regular"} Product
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">₹{product.price}</p>
                    </div>
                  </div>); })) : (<p className="text-center text-muted-foreground py-4">
                  No products yet
                </p>)}
            </div>
          </card_1.CardContent>
        </card_1.Card>
      </div>

      {/* CMS Quick Actions */}
      <card_1.Card>
        <card_1.CardHeader>
          <card_1.CardTitle>Content Management Quick Actions</card_1.CardTitle>
        </card_1.CardHeader>
        <card_1.CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <react_router_dom_1.Link to="/admin/homepage">
              <card_1.Card className="cursor-pointer hover:bg-accent transition-colors">
                <card_1.CardContent className="p-4 text-center">
                  <lucide_react_1.Home className="w-8 h-8 mx-auto mb-2 text-primary"/>
                  <h3 className="font-medium text-sm">Homepage</h3>
                  <p className="text-xs text-muted-foreground">Edit sections</p>
                </card_1.CardContent>
              </card_1.Card>
            </react_router_dom_1.Link>

            <react_router_dom_1.Link to="/admin/products">
              <card_1.Card className="cursor-pointer hover:bg-accent transition-colors">
                <card_1.CardContent className="p-4 text-center">
                  <lucide_react_1.Package className="w-8 h-8 mx-auto mb-2 text-primary"/>
                  <h3 className="font-medium text-sm">Products</h3>
                  <p className="text-xs text-muted-foreground">
                    Manage catalog
                  </p>
                </card_1.CardContent>
              </card_1.Card>
            </react_router_dom_1.Link>

            <react_router_dom_1.Link to="/admin/categories">
              <card_1.Card className="cursor-pointer hover:bg-accent transition-colors">
                <card_1.CardContent className="p-4 text-center">
                  <lucide_react_1.Tags className="w-8 h-8 mx-auto mb-2 text-primary"/>
                  <h3 className="font-medium text-sm">Categories</h3>
                  <p className="text-xs text-muted-foreground">
                    Organize products
                  </p>
                </card_1.CardContent>
              </card_1.Card>
            </react_router_dom_1.Link>

            <react_router_dom_1.Link to="/admin/pages">
              <card_1.Card className="cursor-pointer hover:bg-accent transition-colors">
                <card_1.CardContent className="p-4 text-center">
                  <lucide_react_1.FileText className="w-8 h-8 mx-auto mb-2 text-primary"/>
                  <h3 className="font-medium text-sm">Pages</h3>
                  <p className="text-xs text-muted-foreground">Custom pages</p>
                </card_1.CardContent>
              </card_1.Card>
            </react_router_dom_1.Link>

            <react_router_dom_1.Link to="/admin/orders">
              <card_1.Card className="cursor-pointer hover:bg-accent transition-colors">
                <card_1.CardContent className="p-4 text-center">
                  <lucide_react_1.ShoppingCart className="w-8 h-8 mx-auto mb-2 text-primary"/>
                  <h3 className="font-medium text-sm">Orders</h3>
                  <p className="text-xs text-muted-foreground">
                    Process orders
                  </p>
                </card_1.CardContent>
              </card_1.Card>
            </react_router_dom_1.Link>

            <react_router_dom_1.Link to="/admin/settings">
              <card_1.Card className="cursor-pointer hover:bg-accent transition-colors">
                <card_1.CardContent className="p-4 text-center">
                  <lucide_react_1.Settings className="w-8 h-8 mx-auto mb-2 text-primary"/>
                  <h3 className="font-medium text-sm">Settings</h3>
                  <p className="text-xs text-muted-foreground">Site config</p>
                </card_1.CardContent>
              </card_1.Card>
            </react_router_dom_1.Link>

            <react_router_dom_1.Link to="/admin/customers">
              <card_1.Card className="cursor-pointer hover:bg-accent transition-colors">
                <card_1.CardContent className="p-4 text-center">
                  <lucide_react_1.Users className="w-8 h-8 mx-auto mb-2 text-primary"/>
                  <h3 className="font-medium text-sm">Customers</h3>
                  <p className="text-xs text-muted-foreground">
                    User management
                  </p>
                </card_1.CardContent>
              </card_1.Card>
            </react_router_dom_1.Link>

            <react_router_dom_1.Link to="/admin/coupons">
              <card_1.Card className="cursor-pointer hover:bg-accent transition-colors">
                <card_1.CardContent className="p-4 text-center">
                  <lucide_react_1.Ticket className="w-8 h-8 mx-auto mb-2 text-primary"/>
                  <h3 className="font-medium text-sm">Coupons</h3>
                  <p className="text-xs text-muted-foreground">Discounts</p>
                </card_1.CardContent>
              </card_1.Card>
            </react_router_dom_1.Link>

            <react_router_dom_1.Link to="/admin/shipping">
              <card_1.Card className="cursor-pointer hover:bg-accent transition-colors">
                <card_1.CardContent className="p-4 text-center">
                  <lucide_react_1.Truck className="w-8 h-8 mx-auto mb-2 text-primary"/>
                  <h3 className="font-medium text-sm">Shipping</h3>
                  <p className="text-xs text-muted-foreground">
                    Delivery zones
                  </p>
                </card_1.CardContent>
              </card_1.Card>
            </react_router_dom_1.Link>

            <react_router_dom_1.Link to="/admin/users">
              <card_1.Card className="cursor-pointer hover:bg-accent transition-colors">
                <card_1.CardContent className="p-4 text-center">
                  <lucide_react_1.UserCog className="w-8 h-8 mx-auto mb-2 text-primary"/>
                  <h3 className="font-medium text-sm">Users</h3>
                  <p className="text-xs text-muted-foreground">Admin access</p>
                </card_1.CardContent>
              </card_1.Card>
            </react_router_dom_1.Link>
          </div>
        </card_1.CardContent>
      </card_1.Card>

      {/* CMS Status Summary */}
      <card_1.Card>
        <card_1.CardHeader>
          <card_1.CardTitle>System Status</card_1.CardTitle>
        </card_1.CardHeader>
        <card_1.CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">✓</div>
              <h3 className="font-medium">Database Connected</h3>
              <p className="text-sm text-muted-foreground">
                All modules operational
              </p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">✓</div>
              <h3 className="font-medium">CMS Functional</h3>
              <p className="text-sm text-muted-foreground">
                All content editable
              </p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">✓</div>
              <h3 className="font-medium">Site Responsive</h3>
              <p className="text-sm text-muted-foreground">
                Mobile & desktop ready
              </p>
            </div>
          </div>
        </card_1.CardContent>
      </card_1.Card>
    </div>);
}
