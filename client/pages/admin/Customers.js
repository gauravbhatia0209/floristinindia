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
exports.default = Customers;
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var button_1 = require("@/components/ui/button");
var card_1 = require("@/components/ui/card");
var input_1 = require("@/components/ui/input");
var badge_1 = require("@/components/ui/badge");
var dialog_1 = require("@/components/ui/dialog");
var tabs_1 = require("@/components/ui/tabs");
var supabase_1 = require("@/lib/supabase");
function Customers() {
    var _a = (0, react_1.useState)([]), customers = _a[0], setCustomers = _a[1];
    var _b = (0, react_1.useState)([]), filteredCustomers = _b[0], setFilteredCustomers = _b[1];
    var _c = (0, react_1.useState)(true), isLoading = _c[0], setIsLoading = _c[1];
    var _d = (0, react_1.useState)(null), selectedCustomer = _d[0], setSelectedCustomer = _d[1];
    var _e = (0, react_1.useState)(""), searchQuery = _e[0], setSearchQuery = _e[1];
    (0, react_1.useEffect)(function () {
        fetchCustomers();
    }, []);
    (0, react_1.useEffect)(function () {
        filterCustomers();
    }, [customers, searchQuery]);
    function fetchCustomers() {
        return __awaiter(this, void 0, void 0, function () {
            var data, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, 3, 4]);
                        return [4 /*yield*/, supabase_1.supabase
                                .from("customers")
                                .select("*")
                                .order("created_at", { ascending: false })];
                    case 1:
                        data = (_a.sent()).data;
                        if (data) {
                            setCustomers(data);
                        }
                        return [3 /*break*/, 4];
                    case 2:
                        error_1 = _a.sent();
                        console.error("Failed to fetch customers:", error_1);
                        return [3 /*break*/, 4];
                    case 3:
                        setIsLoading(false);
                        return [7 /*endfinally*/];
                    case 4: return [2 /*return*/];
                }
            });
        });
    }
    function fetchCustomerOrders(customerId) {
        return __awaiter(this, void 0, void 0, function () {
            var data, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, supabase_1.supabase
                                .from("orders")
                                .select("*")
                                .eq("customer_id", customerId)
                                .order("created_at", { ascending: false })
                                .limit(10)];
                    case 1:
                        data = (_a.sent()).data;
                        return [2 /*return*/, data || []];
                    case 2:
                        error_2 = _a.sent();
                        console.error("Failed to fetch customer orders:", error_2);
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    }
    function filterCustomers() {
        var filtered = customers;
        if (searchQuery) {
            filtered = filtered.filter(function (customer) {
                return customer.first_name
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                    customer.last_name
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                    customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    (customer.phone &&
                        customer.phone.includes(searchQuery.toLowerCase()));
            });
        }
        setFilteredCustomers(filtered);
    }
    function handleCustomerClick(customer) {
        return __awaiter(this, void 0, void 0, function () {
            var orders;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetchCustomerOrders(customer.id)];
                    case 1:
                        orders = _a.sent();
                        setSelectedCustomer(__assign(__assign({}, customer), { recent_orders: orders }));
                        return [2 /*return*/];
                }
            });
        });
    }
    function formatDate(dateString) {
        return new Date(dateString).toLocaleDateString("en-IN", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    }
    function getCustomerTier(totalSpent) {
        if (totalSpent >= 10000)
            return { tier: "Gold", color: "bg-yellow-500" };
        if (totalSpent >= 5000)
            return { tier: "Silver", color: "bg-gray-400" };
        if (totalSpent >= 1000)
            return { tier: "Bronze", color: "bg-orange-600" };
        return { tier: "New", color: "bg-blue-500" };
    }
    if (isLoading) {
        return (<div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded animate-pulse w-48"></div>
        <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
      </div>);
    }
    var stats = {
        total: customers.length,
        verified: customers.filter(function (c) { return c.email_verified && c.phone_verified; })
            .length,
        active: customers.filter(function (c) { return c.is_active; }).length,
        totalSpent: customers.reduce(function (sum, c) { return sum + c.total_spent; }, 0),
        avgOrderValue: customers.reduce(function (sum, c) { return sum + c.total_spent; }, 0) /
            customers.reduce(function (sum, c) { return sum + c.total_orders; }, 0) || 0,
    };
    return (<div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Customer Management</h1>
          <p className="text-muted-foreground">
            View and manage customer information
          </p>
        </div>
        <div className="flex gap-2">
          <button_1.Button variant="outline">
            <lucide_react_1.Download className="w-4 h-4 mr-2"/>
            Export
          </button_1.Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <card_1.Card>
          <card_1.CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-sm text-muted-foreground">Total Customers</p>
            </div>
          </card_1.CardContent>
        </card_1.Card>
        <card_1.Card>
          <card_1.CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {stats.verified}
              </p>
              <p className="text-sm text-muted-foreground">Verified</p>
            </div>
          </card_1.CardContent>
        </card_1.Card>
        <card_1.Card>
          <card_1.CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{stats.active}</p>
              <p className="text-sm text-muted-foreground">Active</p>
            </div>
          </card_1.CardContent>
        </card_1.Card>
        <card_1.Card>
          <card_1.CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold">
                ₹{stats.totalSpent.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">Total Revenue</p>
            </div>
          </card_1.CardContent>
        </card_1.Card>
        <card_1.Card>
          <card_1.CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold">
                ₹{Math.round(stats.avgOrderValue).toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">Avg Order Value</p>
            </div>
          </card_1.CardContent>
        </card_1.Card>
      </div>

      {/* Search */}
      <card_1.Card>
        <card_1.CardContent className="p-4">
          <div className="relative">
            <lucide_react_1.Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4"/>
            <input_1.Input placeholder="Search customers by name, email, or phone..." value={searchQuery} onChange={function (e) { return setSearchQuery(e.target.value); }} className="pl-10"/>
          </div>
        </card_1.CardContent>
      </card_1.Card>

      {/* Customers List */}
      <card_1.Card>
        <card_1.CardHeader>
          <card_1.CardTitle>Customers ({filteredCustomers.length})</card_1.CardTitle>
        </card_1.CardHeader>
        <card_1.CardContent>
          <div className="space-y-4">
            {filteredCustomers.map(function (customer) {
            var tierInfo = getCustomerTier(customer.total_spent);
            return (<div key={customer.id} className="border rounded-lg p-4 cursor-pointer hover:bg-accent/50 transition-colors" onClick={function () { return handleCustomerClick(customer); }}>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-gradient-rose rounded-full flex items-center justify-center text-white font-semibold">
                          {customer.first_name.charAt(0)}
                          {customer.last_name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-semibold">
                            {customer.first_name} {customer.last_name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {customer.email}
                          </p>
                        </div>
                        <div className={"w-2 h-2 rounded-full ".concat(tierInfo.color)} title={"".concat(tierInfo.tier, " Customer")}></div>
                        <badge_1.Badge variant="outline" className="text-xs">
                          {tierInfo.tier}
                        </badge_1.Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <lucide_react_1.Phone className="w-4 h-4 text-muted-foreground"/>
                          <span>
                            {customer.phone || "No phone"}
                            {customer.phone_verified && (<badge_1.Badge variant="outline" className="ml-1 text-xs">
                                ✓
                              </badge_1.Badge>)}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <lucide_react_1.ShoppingBag className="w-4 h-4 text-muted-foreground"/>
                          <span>
                            {customer.total_orders} orders • ₹
                            {customer.total_spent.toLocaleString()}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <lucide_react_1.Calendar className="w-4 h-4 text-muted-foreground"/>
                          <span>
                            Joined {formatDate(customer.created_at)}
                            {customer.last_order_date && (<span className="text-muted-foreground">
                                {" "}
                                • Last order{" "}
                                {formatDate(customer.last_order_date)}
                              </span>)}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <badge_1.Badge variant={customer.is_active ? "default" : "secondary"}>
                            {customer.is_active ? "Active" : "Inactive"}
                          </badge_1.Badge>
                          {customer.email_verified && (<badge_1.Badge variant="outline" className="text-xs">
                              Email ✓
                            </badge_1.Badge>)}
                        </div>
                      </div>
                    </div>

                    <button_1.Button variant="ghost" size="icon">
                      <lucide_react_1.Eye className="w-4 h-4"/>
                    </button_1.Button>
                  </div>
                </div>);
        })}
          </div>
        </card_1.CardContent>
      </card_1.Card>

      {/* Customer Details Dialog */}
      <dialog_1.Dialog open={!!selectedCustomer} onOpenChange={function () { return setSelectedCustomer(null); }}>
        <dialog_1.DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <dialog_1.DialogHeader>
            <dialog_1.DialogTitle>
              Customer Details -{" "}
              {selectedCustomer &&
            "".concat(selectedCustomer.first_name, " ").concat(selectedCustomer.last_name)}
            </dialog_1.DialogTitle>
          </dialog_1.DialogHeader>

          {selectedCustomer && (<tabs_1.Tabs defaultValue="profile" className="w-full">
              <tabs_1.TabsList className="grid w-full grid-cols-4">
                <tabs_1.TabsTrigger value="profile">Profile</tabs_1.TabsTrigger>
                <tabs_1.TabsTrigger value="orders">Orders</tabs_1.TabsTrigger>
                <tabs_1.TabsTrigger value="addresses">Addresses</tabs_1.TabsTrigger>
                <tabs_1.TabsTrigger value="preferences">Preferences</tabs_1.TabsTrigger>
              </tabs_1.TabsList>

              <tabs_1.TabsContent value="profile" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <card_1.Card>
                    <card_1.CardHeader>
                      <card_1.CardTitle>Personal Information</card_1.CardTitle>
                    </card_1.CardHeader>
                    <card_1.CardContent className="space-y-3">
                      <div>
                        <p className="text-sm font-medium">Full Name</p>
                        <p>
                          {selectedCustomer.first_name}{" "}
                          {selectedCustomer.last_name}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Email</p>
                        <div className="flex items-center gap-2">
                          <p>{selectedCustomer.email}</p>
                          {selectedCustomer.email_verified && (<badge_1.Badge variant="outline" className="text-xs">
                              Verified
                            </badge_1.Badge>)}
                        </div>
                      </div>
                      {selectedCustomer.phone && (<div>
                          <p className="text-sm font-medium">Phone</p>
                          <div className="flex items-center gap-2">
                            <p>{selectedCustomer.phone}</p>
                            {selectedCustomer.phone_verified && (<badge_1.Badge variant="outline" className="text-xs">
                                Verified
                              </badge_1.Badge>)}
                          </div>
                        </div>)}
                      {selectedCustomer.gender && (<div>
                          <p className="text-sm font-medium">Gender</p>
                          <p className="capitalize">
                            {selectedCustomer.gender}
                          </p>
                        </div>)}
                      {selectedCustomer.date_of_birth && (<div>
                          <p className="text-sm font-medium">Date of Birth</p>
                          <p>{formatDate(selectedCustomer.date_of_birth)}</p>
                        </div>)}
                      {selectedCustomer.anniversary_date && (<div>
                          <p className="text-sm font-medium">Anniversary</p>
                          <p>{formatDate(selectedCustomer.anniversary_date)}</p>
                        </div>)}
                    </card_1.CardContent>
                  </card_1.Card>

                  <card_1.Card>
                    <card_1.CardHeader>
                      <card_1.CardTitle>Account Statistics</card_1.CardTitle>
                    </card_1.CardHeader>
                    <card_1.CardContent className="space-y-3">
                      <div>
                        <p className="text-sm font-medium">Customer Since</p>
                        <p>{formatDate(selectedCustomer.created_at)}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Total Orders</p>
                        <p className="text-2xl font-bold">
                          {selectedCustomer.total_orders}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Total Spent</p>
                        <p className="text-2xl font-bold">
                          ₹{selectedCustomer.total_spent.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          Average Order Value
                        </p>
                        <p className="text-xl font-semibold">
                          ₹
                          {selectedCustomer.total_orders > 0
                ? Math.round(selectedCustomer.total_spent /
                    selectedCustomer.total_orders).toLocaleString()
                : 0}
                        </p>
                      </div>
                      {selectedCustomer.last_order_date && (<div>
                          <p className="text-sm font-medium">Last Order</p>
                          <p>{formatDate(selectedCustomer.last_order_date)}</p>
                        </div>)}
                      <div>
                        <p className="text-sm font-medium">Customer Tier</p>
                        <badge_1.Badge className={getCustomerTier(selectedCustomer.total_spent)
                .color + " text-white"}>
                          {getCustomerTier(selectedCustomer.total_spent).tier}
                        </badge_1.Badge>
                      </div>
                    </card_1.CardContent>
                  </card_1.Card>
                </div>
              </tabs_1.TabsContent>

              <tabs_1.TabsContent value="orders" className="space-y-4">
                <card_1.Card>
                  <card_1.CardHeader>
                    <card_1.CardTitle>Recent Orders</card_1.CardTitle>
                  </card_1.CardHeader>
                  <card_1.CardContent>
                    {selectedCustomer.recent_orders &&
                selectedCustomer.recent_orders.length > 0 ? (<div className="space-y-4">
                        {selectedCustomer.recent_orders.map(function (order) { return (<div key={order.id} className="border rounded-lg p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium">
                                  #{order.order_number}
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                  {formatDate(order.created_at)}
                                </p>
                                <p className="text-sm">
                                  {order.items.length} item
                                  {order.items.length !== 1 ? "s" : ""}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold">
                                  ₹{order.total_amount.toLocaleString()}
                                </p>
                                <badge_1.Badge className="text-xs">
                                  {order.status.toUpperCase()}
                                </badge_1.Badge>
                              </div>
                            </div>
                          </div>); })}
                      </div>) : (<p className="text-center text-muted-foreground py-8">
                        No orders found
                      </p>)}
                  </card_1.CardContent>
                </card_1.Card>
              </tabs_1.TabsContent>

              <tabs_1.TabsContent value="addresses" className="space-y-4">
                <card_1.Card>
                  <card_1.CardHeader>
                    <card_1.CardTitle>Saved Addresses</card_1.CardTitle>
                  </card_1.CardHeader>
                  <card_1.CardContent>
                    {selectedCustomer.addresses &&
                selectedCustomer.addresses.length > 0 ? (<div className="space-y-4">
                        {selectedCustomer.addresses.map(function (address, index) { return (<div key={index} className="border rounded-lg p-4">
                              <div className="flex items-start gap-2">
                                <lucide_react_1.MapPin className="w-4 h-4 mt-1 text-muted-foreground"/>
                                <div>
                                  <p className="font-medium">{address.name}</p>
                                  <p className="text-sm">
                                    {address.address_line_1}
                                  </p>
                                  {address.address_line_2 && (<p className="text-sm">
                                      {address.address_line_2}
                                    </p>)}
                                  <p className="text-sm">
                                    {address.city}, {address.state}{" "}
                                    {address.pincode}
                                  </p>
                                  {address.phone && (<p className="text-sm text-muted-foreground">
                                      Phone: {address.phone}
                                    </p>)}
                                </div>
                              </div>
                            </div>); })}
                      </div>) : (<p className="text-center text-muted-foreground py-8">
                        No saved addresses
                      </p>)}
                  </card_1.CardContent>
                </card_1.Card>
              </tabs_1.TabsContent>

              <tabs_1.TabsContent value="preferences" className="space-y-4">
                <card_1.Card>
                  <card_1.CardHeader>
                    <card_1.CardTitle>Customer Preferences</card_1.CardTitle>
                  </card_1.CardHeader>
                  <card_1.CardContent>
                    {selectedCustomer.preferences ? (<div className="space-y-3">
                        {Object.entries(selectedCustomer.preferences).map(function (_a) {
                    var key = _a[0], value = _a[1];
                    return (<div key={key}>
                              <p className="text-sm font-medium capitalize">
                                {key.replace(/_/g, " ")}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {typeof value === "boolean"
                            ? value
                                ? "Yes"
                                : "No"
                            : String(value)}
                              </p>
                            </div>);
                })}
                      </div>) : (<p className="text-center text-muted-foreground py-8">
                        No preferences set
                      </p>)}
                  </card_1.CardContent>
                </card_1.Card>
              </tabs_1.TabsContent>
            </tabs_1.Tabs>)}
        </dialog_1.DialogContent>
      </dialog_1.Dialog>
    </div>);
}
