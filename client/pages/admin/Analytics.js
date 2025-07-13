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
exports.default = Analytics;
var react_1 = require("react");
var card_1 = require("@/components/ui/card");
var button_1 = require("@/components/ui/button");
var badge_1 = require("@/components/ui/badge");
var tabs_1 = require("@/components/ui/tabs");
var select_1 = require("@/components/ui/select");
var recharts_1 = require("recharts");
var lucide_react_1 = require("lucide-react");
var supabase_1 = require("@/lib/supabase");
var date_fns_1 = require("date-fns");
var COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];
function Analytics() {
    var _a = (0, react_1.useState)(null), data = _a[0], setData = _a[1];
    var _b = (0, react_1.useState)(true), isLoading = _b[0], setIsLoading = _b[1];
    var _c = (0, react_1.useState)("7d"), dateRange = _c[0], setDateRange = _c[1];
    var _d = (0, react_1.useState)("overview"), selectedTab = _d[0], setSelectedTab = _d[1];
    (0, react_1.useEffect)(function () {
        fetchAnalyticsData();
    }, [dateRange]);
    function fetchAnalyticsData() {
        return __awaiter(this, void 0, void 0, function () {
            var endDate, startDate, _a, salesData, customerData, productData, ordersData, analyticsData, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, 3, 4]);
                        setIsLoading(true);
                        console.log("Starting analytics data fetch for date range:", dateRange);
                        endDate = new Date();
                        startDate = new Date();
                        switch (dateRange) {
                            case "1d":
                                startDate = (0, date_fns_1.startOfDay)(new Date());
                                break;
                            case "7d":
                                startDate = (0, date_fns_1.subDays)(endDate, 7);
                                break;
                            case "30d":
                                startDate = (0, date_fns_1.subDays)(endDate, 30);
                                break;
                            case "90d":
                                startDate = (0, date_fns_1.subDays)(endDate, 90);
                                break;
                            default:
                                startDate = (0, date_fns_1.subDays)(endDate, 7);
                        }
                        console.log("Date range calculated:", { startDate: startDate, endDate: endDate });
                        return [4 /*yield*/, Promise.allSettled([
                                fetchSalesData(startDate, endDate),
                                fetchCustomerData(startDate, endDate),
                                fetchProductData(startDate, endDate),
                                fetchOrdersData(startDate, endDate),
                            ]).then(function (results) {
                                return results.map(function (result, index) {
                                    if (result.status === "fulfilled") {
                                        return result.value;
                                    }
                                    else {
                                        console.error("Error in analytics function ".concat(index, ":"), result.reason);
                                        // Return default empty data based on function index
                                        switch (index) {
                                            case 0: // salesData
                                                return {
                                                    totalRevenue: 0,
                                                    totalOrders: 0,
                                                    avgOrderValue: 0,
                                                    topProducts: [],
                                                    conversionRate: 0,
                                                    refunds: 0,
                                                    revenueByCategory: [],
                                                };
                                            case 1: // customerData
                                                return {
                                                    newCustomers: 0,
                                                    returningCustomers: 0,
                                                    avgOrderFrequency: 0,
                                                    topLocations: [],
                                                    cltv: 0,
                                                };
                                            case 2: // productData
                                                return {
                                                    topViewed: [],
                                                    cartAdds: [],
                                                    lowStock: [],
                                                    outOfStock: 0,
                                                };
                                            case 3: // ordersData
                                                return {
                                                    totalOrders: 0,
                                                };
                                            default:
                                                return {};
                                        }
                                    }
                                });
                            })];
                    case 1:
                        _a = _b.sent(), salesData = _a[0], customerData = _a[1], productData = _a[2], ordersData = _a[3];
                        console.log("Analytics data fetched:", {
                            salesData: salesData,
                            customerData: customerData,
                            productData: productData,
                            ordersData: ordersData,
                        });
                        analyticsData = {
                            visitors: {
                                total: 0,
                                unique: 0,
                                pageViews: 0,
                                bounceRate: 0,
                                avgTimeOnSite: 0,
                                topPages: [],
                                devices: [],
                                referrers: [],
                            },
                            sales: __assign({ totalRevenue: 0, totalOrders: 0, avgOrderValue: 0, topProducts: [], conversionRate: 0, refunds: 0, revenueByCategory: [] }, salesData),
                            customers: __assign({ newCustomers: 0, returningCustomers: 0, avgOrderFrequency: 0, topLocations: [], cltv: 0 }, customerData),
                            products: __assign({ topViewed: [], cartAdds: [], lowStock: [], outOfStock: 0 }, productData),
                            funnel: {
                                homepage: 0,
                                category: 0,
                                product: 0,
                                cart: 0,
                                checkout: 0,
                                complete: (ordersData === null || ordersData === void 0 ? void 0 : ordersData.totalOrders) || 0,
                            },
                        };
                        setData(analyticsData);
                        console.log("Analytics data set successfully");
                        return [3 /*break*/, 4];
                    case 2:
                        error_1 = _b.sent();
                        console.error("Failed to fetch analytics data:", error_1.message || error_1);
                        // Set empty data on error
                        setData({
                            visitors: {
                                total: 0,
                                unique: 0,
                                pageViews: 0,
                                bounceRate: 0,
                                avgTimeOnSite: 0,
                                topPages: [],
                                devices: [],
                                referrers: [],
                            },
                            sales: {
                                totalRevenue: 0,
                                totalOrders: 0,
                                avgOrderValue: 0,
                                topProducts: [],
                                conversionRate: 0,
                                refunds: 0,
                                revenueByCategory: [],
                            },
                            customers: {
                                newCustomers: 0,
                                returningCustomers: 0,
                                avgOrderFrequency: 0,
                                topLocations: [],
                                cltv: 0,
                            },
                            products: {
                                topViewed: [],
                                cartAdds: [],
                                lowStock: [],
                                outOfStock: 0,
                            },
                            funnel: {
                                homepage: 0,
                                category: 0,
                                product: 0,
                                cart: 0,
                                checkout: 0,
                                complete: 0,
                            },
                        });
                        return [3 /*break*/, 4];
                    case 3:
                        setIsLoading(false);
                        return [7 /*endfinally*/];
                    case 4: return [2 /*return*/];
                }
            });
        });
    }
    function fetchSalesData(startDate, endDate) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, orders, ordersError, totalRevenue, totalOrders, avgOrderValue, refunds, topProducts, _b, orderItems, itemsError, productSales_1, itemsError_1, error_2;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 6, , 7]);
                        console.log("Fetching sales data for date range:", {
                            startDate: startDate,
                            endDate: endDate,
                        });
                        return [4 /*yield*/, supabase_1.supabase
                                .from("orders")
                                .select("*")
                                .gte("created_at", startDate.toISOString())
                                .lte("created_at", endDate.toISOString())];
                    case 1:
                        _a = _c.sent(), orders = _a.data, ordersError = _a.error;
                        if (ordersError) {
                            console.error("Error fetching orders:", ordersError);
                            // If orders table doesn't exist or has permission issues, return empty data
                            return [2 /*return*/, {
                                    totalRevenue: 0,
                                    totalOrders: 0,
                                    avgOrderValue: 0,
                                    topProducts: [],
                                    conversionRate: 0,
                                    refunds: 0,
                                    revenueByCategory: [],
                                }];
                        }
                        console.log("Found orders:", (orders === null || orders === void 0 ? void 0 : orders.length) || 0);
                        totalRevenue = (orders === null || orders === void 0 ? void 0 : orders.reduce(function (sum, order) { return sum + (order.total_amount || 0); }, 0)) || 0;
                        totalOrders = (orders === null || orders === void 0 ? void 0 : orders.length) || 0;
                        avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
                        refunds = (orders === null || orders === void 0 ? void 0 : orders.filter(function (order) {
                            return order.status === "cancelled" || order.status === "refunded";
                        }).length) || 0;
                        topProducts = [];
                        _c.label = 2;
                    case 2:
                        _c.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, supabase_1.supabase
                                .from("order_items")
                                .select("*")
                                .in("order_id", (orders === null || orders === void 0 ? void 0 : orders.map(function (order) { return order.id; })) || [])];
                    case 3:
                        _b = _c.sent(), orderItems = _b.data, itemsError = _b.error;
                        if (!itemsError && orderItems) {
                            productSales_1 = {};
                            orderItems.forEach(function (item) {
                                if (!productSales_1[item.product_id]) {
                                    productSales_1[item.product_id] = {
                                        sales: 0,
                                        revenue: 0,
                                        name: item.product_name || "Unknown Product",
                                    };
                                }
                                productSales_1[item.product_id].sales += item.quantity || 0;
                                productSales_1[item.product_id].revenue +=
                                    (item.quantity || 0) * (item.price || 0);
                            });
                            topProducts = Object.values(productSales_1)
                                .sort(function (a, b) { return b.revenue - a.revenue; })
                                .slice(0, 5);
                        }
                        return [3 /*break*/, 5];
                    case 4:
                        itemsError_1 = _c.sent();
                        console.log("Order items table not available yet:", itemsError_1);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/, {
                            totalRevenue: totalRevenue,
                            totalOrders: totalOrders,
                            avgOrderValue: avgOrderValue,
                            topProducts: topProducts,
                            conversionRate: 0, // Would need visitor tracking
                            refunds: refunds,
                            revenueByCategory: [], // Would need product categories
                        }];
                    case 6:
                        error_2 = _c.sent();
                        console.error("Error fetching sales data:", error_2.message || error_2);
                        return [2 /*return*/, {
                                totalRevenue: 0,
                                totalOrders: 0,
                                avgOrderValue: 0,
                                topProducts: [],
                                conversionRate: 0,
                                refunds: 0,
                                revenueByCategory: [],
                            }];
                    case 7: return [2 /*return*/];
                }
            });
        });
    }
    function fetchCustomerData(startDate, endDate) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, newCustomers, newError, returningCustomers, _b, allCustomers, allError, _c, orderCounts, ordersError, customerOrderCounts_1, error_3, error_4;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 8, , 9]);
                        console.log("Fetching customer data for date range:", {
                            startDate: startDate,
                            endDate: endDate,
                        });
                        return [4 /*yield*/, supabase_1.supabase
                                .from("customers")
                                .select("*")
                                .gte("created_at", startDate.toISOString())
                                .lte("created_at", endDate.toISOString())];
                    case 1:
                        _a = _d.sent(), newCustomers = _a.data, newError = _a.error;
                        if (newError) {
                            console.error("Error fetching new customers:", newError);
                            return [2 /*return*/, {
                                    newCustomers: 0,
                                    returningCustomers: 0,
                                    avgOrderFrequency: 0,
                                    topLocations: [],
                                    cltv: 0,
                                }];
                        }
                        console.log("Found new customers:", (newCustomers === null || newCustomers === void 0 ? void 0 : newCustomers.length) || 0);
                        returningCustomers = 0;
                        _d.label = 2;
                    case 2:
                        _d.trys.push([2, 6, , 7]);
                        return [4 /*yield*/, supabase_1.supabase
                                .from("customers")
                                .select("id")];
                    case 3:
                        _b = _d.sent(), allCustomers = _b.data, allError = _b.error;
                        if (!(!allError && allCustomers)) return [3 /*break*/, 5];
                        return [4 /*yield*/, supabase_1.supabase
                                .from("orders")
                                .select("customer_id")
                                .in("customer_id", allCustomers.map(function (c) { return c.id; }))];
                    case 4:
                        _c = _d.sent(), orderCounts = _c.data, ordersError = _c.error;
                        if (!ordersError && orderCounts) {
                            customerOrderCounts_1 = {};
                            orderCounts.forEach(function (order) {
                                if (order.customer_id) {
                                    customerOrderCounts_1[order.customer_id] =
                                        (customerOrderCounts_1[order.customer_id] || 0) + 1;
                                }
                            });
                            returningCustomers = Object.values(customerOrderCounts_1).filter(function (count) { return count > 1; }).length;
                        }
                        _d.label = 5;
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        error_3 = _d.sent();
                        console.log("Could not calculate returning customers:", error_3);
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/, {
                            newCustomers: (newCustomers === null || newCustomers === void 0 ? void 0 : newCustomers.length) || 0,
                            returningCustomers: returningCustomers,
                            avgOrderFrequency: 0, // Would need more complex calculation
                            topLocations: [], // Would need address data
                            cltv: 0, // Customer Lifetime Value calculation
                        }];
                    case 8:
                        error_4 = _d.sent();
                        console.error("Error fetching customer data:", error_4.message || error_4);
                        return [2 /*return*/, {
                                newCustomers: 0,
                                returningCustomers: 0,
                                avgOrderFrequency: 0,
                                topLocations: [],
                                cltv: 0,
                            }];
                    case 9: return [2 /*return*/];
                }
            });
        });
    }
    function fetchProductData(startDate, endDate) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, products, error, lowStock, outOfStock, error_5;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        console.log("Fetching product data");
                        return [4 /*yield*/, supabase_1.supabase
                                .from("products")
                                .select("id, name, stock_quantity")];
                    case 1:
                        _a = _b.sent(), products = _a.data, error = _a.error;
                        if (error) {
                            console.error("Error fetching products:", error);
                            return [2 /*return*/, {
                                    topViewed: [],
                                    cartAdds: [],
                                    lowStock: [],
                                    outOfStock: 0,
                                }];
                        }
                        console.log("Found products:", (products === null || products === void 0 ? void 0 : products.length) || 0);
                        lowStock = (products === null || products === void 0 ? void 0 : products.filter(function (product) {
                            return product.stock_quantity !== null &&
                                product.stock_quantity > 0 &&
                                product.stock_quantity < 5;
                        })) || [];
                        outOfStock = (products === null || products === void 0 ? void 0 : products.filter(function (product) { return product.stock_quantity === 0; }).length) || 0;
                        return [2 /*return*/, {
                                topViewed: [], // Would need view tracking
                                cartAdds: [], // Would need cart tracking
                                lowStock: lowStock.map(function (product) { return ({
                                    name: product.name,
                                    stock: product.stock_quantity || 0,
                                }); }),
                                outOfStock: outOfStock,
                            }];
                    case 2:
                        error_5 = _b.sent();
                        console.error("Error fetching product data:", error_5.message || error_5);
                        return [2 /*return*/, {
                                topViewed: [],
                                cartAdds: [],
                                lowStock: [],
                                outOfStock: 0,
                            }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    }
    function fetchOrdersData(startDate, endDate) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, orders, error, error_6;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        console.log("Fetching orders data for date range:", {
                            startDate: startDate,
                            endDate: endDate,
                        });
                        return [4 /*yield*/, supabase_1.supabase
                                .from("orders")
                                .select("id, created_at")
                                .gte("created_at", startDate.toISOString())
                                .lte("created_at", endDate.toISOString())];
                    case 1:
                        _a = _b.sent(), orders = _a.data, error = _a.error;
                        if (error) {
                            console.error("Error fetching orders:", error);
                            return [2 /*return*/, {
                                    totalOrders: 0,
                                }];
                        }
                        console.log("Found orders:", (orders === null || orders === void 0 ? void 0 : orders.length) || 0);
                        return [2 /*return*/, {
                                totalOrders: (orders === null || orders === void 0 ? void 0 : orders.length) || 0,
                            }];
                    case 2:
                        error_6 = _b.sent();
                        console.error("Error fetching orders data:", error_6.message || error_6);
                        return [2 /*return*/, {
                                totalOrders: 0,
                            }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    }
    var formatCurrency = function (amount) {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
        }).format(amount);
    };
    if (isLoading) {
        return (<div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded animate-pulse w-48"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map(function (_, i) { return (<div key={i} className="h-32 bg-gray-200 rounded animate-pulse"></div>); })}
        </div>
        <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
      </div>);
    }
    if (!data) {
        return (<div className="text-center py-12">
        <lucide_react_1.AlertTriangle className="w-12 h-12 mx-auto mb-4 text-red-500"/>
        <h3 className="text-lg font-semibold mb-2">Failed to Load Analytics</h3>
        <p className="text-muted-foreground">Please try refreshing the page.</p>
      </div>);
    }
    return (<div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Analytics & Statistics</h1>
          <p className="text-muted-foreground">
            Real-time insights and performance metrics for your store
          </p>
        </div>
        <div className="flex gap-2">
          <select_1.Select value={dateRange} onValueChange={setDateRange}>
            <select_1.SelectTrigger className="w-40">
              <select_1.SelectValue />
            </select_1.SelectTrigger>
            <select_1.SelectContent>
              <select_1.SelectItem value="1d">Today</select_1.SelectItem>
              <select_1.SelectItem value="7d">Last 7 days</select_1.SelectItem>
              <select_1.SelectItem value="30d">Last 30 days</select_1.SelectItem>
              <select_1.SelectItem value="90d">Last 90 days</select_1.SelectItem>
            </select_1.SelectContent>
          </select_1.Select>
          <button_1.Button variant="outline">
            <lucide_react_1.Download className="w-4 h-4 mr-2"/>
            Export
          </button_1.Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <card_1.Card>
          <card_1.CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(data.sales.totalRevenue)}
                </p>
              </div>
              <lucide_react_1.DollarSign className="w-8 h-8 text-green-600"/>
            </div>
          </card_1.CardContent>
        </card_1.Card>

        <card_1.Card>
          <card_1.CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Orders</p>
                <p className="text-2xl font-bold">{data.sales.totalOrders}</p>
              </div>
              <lucide_react_1.ShoppingCart className="w-8 h-8 text-blue-600"/>
            </div>
          </card_1.CardContent>
        </card_1.Card>

        <card_1.Card>
          <card_1.CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">New Customers</p>
                <p className="text-2xl font-bold">
                  {data.customers.newCustomers}
                </p>
              </div>
              <lucide_react_1.Users className="w-8 h-8 text-purple-600"/>
            </div>
          </card_1.CardContent>
        </card_1.Card>

        <card_1.Card>
          <card_1.CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Order Value</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(data.sales.avgOrderValue)}
                </p>
              </div>
              <lucide_react_1.TrendingUp className="w-8 h-8 text-orange-600"/>
            </div>
          </card_1.CardContent>
        </card_1.Card>
      </div>

      {/* Analytics Tabs */}
      <tabs_1.Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <tabs_1.TabsList className="grid w-full grid-cols-5">
          <tabs_1.TabsTrigger value="overview">Overview</tabs_1.TabsTrigger>
          <tabs_1.TabsTrigger value="visitors">Visitors</tabs_1.TabsTrigger>
          <tabs_1.TabsTrigger value="sales">Sales</tabs_1.TabsTrigger>
          <tabs_1.TabsTrigger value="products">Products</tabs_1.TabsTrigger>
          <tabs_1.TabsTrigger value="customers">Customers</tabs_1.TabsTrigger>
        </tabs_1.TabsList>

        <tabs_1.TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Products */}
            <card_1.Card>
              <card_1.CardHeader>
                <card_1.CardTitle>Top Selling Products</card_1.CardTitle>
              </card_1.CardHeader>
              <card_1.CardContent>
                {data.sales.topProducts.length > 0 ? (<div className="space-y-4">
                    {data.sales.topProducts.map(function (product, index) { return (<div key={index} className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {product.sales} sold
                          </p>
                        </div>
                        <p className="font-bold">
                          {formatCurrency(product.revenue)}
                        </p>
                      </div>); })}
                  </div>) : (<div className="text-center py-8">
                    <lucide_react_1.Package className="w-12 h-12 mx-auto mb-4 text-muted-foreground"/>
                    <p className="text-muted-foreground">No sales data yet</p>
                  </div>)}
              </card_1.CardContent>
            </card_1.Card>

            {/* Low Stock Alert */}
            <card_1.Card>
              <card_1.CardHeader>
                <card_1.CardTitle className="flex items-center gap-2">
                  <lucide_react_1.AlertTriangle className="w-5 h-5 text-orange-500"/>
                  Inventory Alerts
                </card_1.CardTitle>
              </card_1.CardHeader>
              <card_1.CardContent>
                {data.products.lowStock.length > 0 ||
            data.products.outOfStock > 0 ? (<div className="space-y-4">
                    {data.products.outOfStock > 0 && (<div className="p-3 bg-red-50 rounded-lg border border-red-200">
                        <p className="text-red-800 font-medium">
                          {data.products.outOfStock} products out of stock
                        </p>
                      </div>)}
                    {data.products.lowStock
                .slice(0, 5)
                .map(function (product, index) { return (<div key={index} className="flex justify-between items-center">
                          <p className="font-medium">{product.name}</p>
                          <badge_1.Badge variant="destructive">
                            {product.stock} left
                          </badge_1.Badge>
                        </div>); })}
                  </div>) : (<div className="text-center py-8">
                    <lucide_react_1.Package className="w-12 h-12 mx-auto mb-4 text-green-600"/>
                    <p className="text-muted-foreground">
                      All products well stocked
                    </p>
                  </div>)}
              </card_1.CardContent>
            </card_1.Card>
          </div>
        </tabs_1.TabsContent>

        <tabs_1.TabsContent value="visitors" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <card_1.Card>
              <card_1.CardContent className="p-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    Total Visitors
                  </p>
                  <p className="text-3xl font-bold">{data.visitors.total}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Visitor tracking not yet implemented
                  </p>
                </div>
              </card_1.CardContent>
            </card_1.Card>

            <card_1.Card>
              <card_1.CardContent className="p-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Page Views</p>
                  <p className="text-3xl font-bold">
                    {data.visitors.pageViews}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Page tracking coming soon
                  </p>
                </div>
              </card_1.CardContent>
            </card_1.Card>

            <card_1.Card>
              <card_1.CardContent className="p-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Bounce Rate</p>
                  <p className="text-3xl font-bold">
                    {data.visitors.bounceRate}%
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Analytics setup required
                  </p>
                </div>
              </card_1.CardContent>
            </card_1.Card>
          </div>

          <card_1.Card>
            <card_1.CardHeader>
              <card_1.CardTitle>Visitor Analytics Setup Required</card_1.CardTitle>
            </card_1.CardHeader>
            <card_1.CardContent>
              <div className="text-center py-8">
                <lucide_react_1.Eye className="w-16 h-16 mx-auto mb-4 text-muted-foreground"/>
                <h3 className="text-lg font-semibold mb-2">
                  No Visitor Data Yet
                </h3>
                <p className="text-muted-foreground mb-4">
                  To track visitors, page views, and user behavior, we need to
                  implement analytics tracking.
                </p>
                <div className="text-left max-w-md mx-auto">
                  <p className="text-sm text-muted-foreground mb-2">
                    Features to implement:
                  </p>
                  <ul className="text-sm space-y-1">
                    <li>• Page view tracking</li>
                    <li>• Session management</li>
                    <li>• Device/browser detection</li>
                    <li>• Referrer tracking</li>
                    <li>• Time on site measurement</li>
                  </ul>
                </div>
              </div>
            </card_1.CardContent>
          </card_1.Card>
        </tabs_1.TabsContent>

        <tabs_1.TabsContent value="sales" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <card_1.Card>
              <card_1.CardHeader>
                <card_1.CardTitle>Sales Performance</card_1.CardTitle>
              </card_1.CardHeader>
              <card_1.CardContent>
                {data.sales.totalOrders > 0 ? (<div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Total Revenue
                        </p>
                        <p className="text-2xl font-bold">
                          {formatCurrency(data.sales.totalRevenue)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Total Orders
                        </p>
                        <p className="text-2xl font-bold">
                          {data.sales.totalOrders}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Avg Order Value
                        </p>
                        <p className="text-xl font-semibold">
                          {formatCurrency(data.sales.avgOrderValue)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Refunds</p>
                        <p className="text-xl font-semibold">
                          {data.sales.refunds}
                        </p>
                      </div>
                    </div>
                  </div>) : (<div className="text-center py-8">
                    <lucide_react_1.ShoppingCart className="w-12 h-12 mx-auto mb-4 text-muted-foreground"/>
                    <p className="text-muted-foreground">No sales data yet</p>
                  </div>)}
              </card_1.CardContent>
            </card_1.Card>

            <card_1.Card>
              <card_1.CardHeader>
                <card_1.CardTitle>Revenue by Product</card_1.CardTitle>
              </card_1.CardHeader>
              <card_1.CardContent>
                {data.sales.topProducts.length > 0 ? (<recharts_1.ResponsiveContainer width="100%" height={200}>
                    <recharts_1.BarChart data={data.sales.topProducts}>
                      <recharts_1.CartesianGrid strokeDasharray="3 3"/>
                      <recharts_1.XAxis dataKey="name"/>
                      <recharts_1.YAxis />
                      <recharts_1.Tooltip formatter={function (value) { return formatCurrency(Number(value)); }}/>
                      <recharts_1.Bar dataKey="revenue" fill="#8884d8"/>
                    </recharts_1.BarChart>
                  </recharts_1.ResponsiveContainer>) : (<div className="text-center py-8">
                    <recharts_1.BarChart className="w-12 h-12 mx-auto mb-4 text-muted-foreground"/>
                    <p className="text-muted-foreground">
                      No product sales yet
                    </p>
                  </div>)}
              </card_1.CardContent>
            </card_1.Card>
          </div>
        </tabs_1.TabsContent>

        <tabs_1.TabsContent value="products" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <card_1.Card>
              <card_1.CardHeader>
                <card_1.CardTitle>Inventory Status</card_1.CardTitle>
              </card_1.CardHeader>
              <card_1.CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                    <span>Out of Stock</span>
                    <badge_1.Badge variant="destructive">
                      {data.products.outOfStock} products
                    </badge_1.Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                    <span>Low Stock (&lt;5 items)</span>
                    <badge_1.Badge variant="secondary">
                      {data.products.lowStock.length} products
                    </badge_1.Badge>
                  </div>
                </div>
              </card_1.CardContent>
            </card_1.Card>

            <card_1.Card>
              <card_1.CardHeader>
                <card_1.CardTitle>Product Performance</card_1.CardTitle>
              </card_1.CardHeader>
              <card_1.CardContent>
                <div className="text-center py-8">
                  <lucide_react_1.MousePointer className="w-12 h-12 mx-auto mb-4 text-muted-foreground"/>
                  <h3 className="text-lg font-semibold mb-2">
                    Product Tracking Needed
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    To track product views and cart additions, implement product
                    analytics
                  </p>
                </div>
              </card_1.CardContent>
            </card_1.Card>
          </div>
        </tabs_1.TabsContent>

        <tabs_1.TabsContent value="customers" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <card_1.Card>
              <card_1.CardContent className="p-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">New Customers</p>
                  <p className="text-3xl font-bold">
                    {data.customers.newCustomers}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    In selected time period
                  </p>
                </div>
              </card_1.CardContent>
            </card_1.Card>

            <card_1.Card>
              <card_1.CardContent className="p-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    Returning Customers
                  </p>
                  <p className="text-3xl font-bold">
                    {data.customers.returningCustomers}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Customers with multiple orders
                  </p>
                </div>
              </card_1.CardContent>
            </card_1.Card>
          </div>

          <card_1.Card>
            <card_1.CardHeader>
              <card_1.CardTitle>Customer Insights</card_1.CardTitle>
            </card_1.CardHeader>
            <card_1.CardContent>
              <div className="text-center py-8">
                <lucide_react_1.Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground"/>
                <h3 className="text-lg font-semibold mb-2">
                  Enhanced Customer Analytics Coming Soon
                </h3>
                <p className="text-muted-foreground text-sm">
                  Features like customer location tracking, lifetime value, and
                  behavior analysis will be added
                </p>
              </div>
            </card_1.CardContent>
          </card_1.Card>
        </tabs_1.TabsContent>
      </tabs_1.Tabs>
    </div>);
}
