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
exports.default = Orders;
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var button_1 = require("@/components/ui/button");
var card_1 = require("@/components/ui/card");
var input_1 = require("@/components/ui/input");
var badge_1 = require("@/components/ui/badge");
var dialog_1 = require("@/components/ui/dialog");
var select_1 = require("@/components/ui/select");
var tabs_1 = require("@/components/ui/tabs");
var supabase_1 = require("@/lib/supabase");
function Orders() {
    var _a = (0, react_1.useState)([]), orders = _a[0], setOrders = _a[1];
    var _b = (0, react_1.useState)([]), filteredOrders = _b[0], setFilteredOrders = _b[1];
    var _c = (0, react_1.useState)(true), isLoading = _c[0], setIsLoading = _c[1];
    var _d = (0, react_1.useState)(null), selectedOrder = _d[0], setSelectedOrder = _d[1];
    var _e = (0, react_1.useState)("all"), statusFilter = _e[0], setStatusFilter = _e[1];
    var _f = (0, react_1.useState)(""), searchQuery = _f[0], setSearchQuery = _f[1];
    var _g = (0, react_1.useState)({}), productImages = _g[0], setProductImages = _g[1];
    var _h = (0, react_1.useState)(null), selectedImage = _h[0], setSelectedImage = _h[1];
    (0, react_1.useEffect)(function () {
        fetchOrders();
    }, []);
    (0, react_1.useEffect)(function () {
        filterOrders();
    }, [orders, statusFilter, searchQuery]);
    function fetchOrders() {
        return __awaiter(this, void 0, void 0, function () {
            var data, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, 5, 6]);
                        return [4 /*yield*/, supabase_1.supabase
                                .from("orders")
                                .select("\n          *,\n          customer:customers(*)\n        ")
                                .order("created_at", { ascending: false })];
                    case 1:
                        data = (_a.sent()).data;
                        if (!data) return [3 /*break*/, 3];
                        setOrders(data);
                        return [4 /*yield*/, fetchProductImagesForOrders(data)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [3 /*break*/, 6];
                    case 4:
                        error_1 = _a.sent();
                        console.error("Failed to fetch orders:", error_1);
                        return [3 /*break*/, 6];
                    case 5:
                        setIsLoading(false);
                        return [7 /*endfinally*/];
                    case 6: return [2 /*return*/];
                }
            });
        });
    }
    function fetchProductImagesForOrders(orders) {
        return __awaiter(this, void 0, void 0, function () {
            var productIds_1, products, imageMap_1, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        productIds_1 = new Set();
                        orders.forEach(function (order) {
                            order.items.forEach(function (item) {
                                if (item.product_id) {
                                    productIds_1.add(item.product_id);
                                }
                            });
                        });
                        if (!(productIds_1.size > 0)) return [3 /*break*/, 2];
                        return [4 /*yield*/, supabase_1.supabase
                                .from("products")
                                .select("id, image_url")
                                .in("id", Array.from(productIds_1))];
                    case 1:
                        products = (_a.sent()).data;
                        if (products) {
                            imageMap_1 = {};
                            products.forEach(function (product) {
                                imageMap_1[product.id] = product.image_url;
                            });
                            setProductImages(imageMap_1);
                        }
                        _a.label = 2;
                    case 2: return [3 /*break*/, 4];
                    case 3:
                        error_2 = _a.sent();
                        console.error("Failed to fetch product images:", error_2);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    }
    function filterOrders() {
        var filtered = orders;
        // Filter by status
        if (statusFilter !== "all") {
            filtered = filtered.filter(function (order) { return order.status === statusFilter; });
        }
        // Filter by search query
        if (searchQuery) {
            filtered = filtered.filter(function (order) {
                return order.order_number
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                    order.customer.first_name
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                    order.customer.last_name
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                    order.customer.email
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase());
            });
        }
        setFilteredOrders(filtered);
    }
    function updateOrderStatus(orderId, newStatus) {
        return __awaiter(this, void 0, void 0, function () {
            var error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, supabase_1.supabase
                                .from("orders")
                                .update({ status: newStatus })
                                .eq("id", orderId)];
                    case 1:
                        _a.sent();
                        // Update local state
                        setOrders(orders.map(function (order) {
                            return order.id === orderId ? __assign(__assign({}, order), { status: newStatus }) : order;
                        }));
                        if (selectedOrder && selectedOrder.id === orderId) {
                            setSelectedOrder(__assign(__assign({}, selectedOrder), { status: newStatus }));
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_3 = _a.sent();
                        console.error("Failed to update order status:", error_3);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    }
    function getStatusColor(status) {
        switch (status) {
            case "pending":
                return "bg-yellow-100 text-yellow-800";
            case "confirmed":
                return "bg-blue-100 text-blue-800";
            case "processing":
                return "bg-purple-100 text-purple-800";
            case "shipped":
                return "bg-indigo-100 text-indigo-800";
            case "delivered":
                return "bg-green-100 text-green-800";
            case "cancelled":
                return "bg-red-100 text-red-800";
            case "refunded":
                return "bg-gray-100 text-gray-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    }
    function formatDate(dateString) {
        return new Date(dateString).toLocaleDateString("en-IN", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    }
    if (isLoading) {
        return (<div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded animate-pulse w-48"></div>
        <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
      </div>);
    }
    var stats = {
        total: orders.length,
        pending: orders.filter(function (o) { return o.status === "pending"; }).length,
        processing: orders.filter(function (o) {
            return ["confirmed", "processing"].includes(o.status);
        }).length,
        shipped: orders.filter(function (o) { return o.status === "shipped"; }).length,
        delivered: orders.filter(function (o) { return o.status === "delivered"; }).length,
        totalRevenue: orders.reduce(function (sum, order) { return sum + order.total_amount; }, 0),
    };
    return (<div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Orders Management</h1>
          <p className="text-muted-foreground">
            Track and manage customer orders
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
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <card_1.Card>
          <card_1.CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-sm text-muted-foreground">Total Orders</p>
            </div>
          </card_1.CardContent>
        </card_1.Card>
        <card_1.Card>
          <card_1.CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">
                {stats.pending}
              </p>
              <p className="text-sm text-muted-foreground">Pending</p>
            </div>
          </card_1.CardContent>
        </card_1.Card>
        <card_1.Card>
          <card_1.CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {stats.processing}
              </p>
              <p className="text-sm text-muted-foreground">Processing</p>
            </div>
          </card_1.CardContent>
        </card_1.Card>
        <card_1.Card>
          <card_1.CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-indigo-600">
                {stats.shipped}
              </p>
              <p className="text-sm text-muted-foreground">Shipped</p>
            </div>
          </card_1.CardContent>
        </card_1.Card>
        <card_1.Card>
          <card_1.CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {stats.delivered}
              </p>
              <p className="text-sm text-muted-foreground">Delivered</p>
            </div>
          </card_1.CardContent>
        </card_1.Card>
        <card_1.Card>
          <card_1.CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold">
                ₹{stats.totalRevenue.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">Revenue</p>
            </div>
          </card_1.CardContent>
        </card_1.Card>
      </div>

      {/* Filters */}
      <card_1.Card>
        <card_1.CardContent className="p-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <lucide_react_1.Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4"/>
                <input_1.Input placeholder="Search orders by number, customer name, or email..." value={searchQuery} onChange={function (e) { return setSearchQuery(e.target.value); }} className="pl-10"/>
              </div>
            </div>
            <select_1.Select value={statusFilter} onValueChange={setStatusFilter}>
              <select_1.SelectTrigger className="w-48">
                <select_1.SelectValue placeholder="Filter by status"/>
              </select_1.SelectTrigger>
              <select_1.SelectContent>
                <select_1.SelectItem value="all">All Orders</select_1.SelectItem>
                <select_1.SelectItem value="pending">Pending</select_1.SelectItem>
                <select_1.SelectItem value="confirmed">Confirmed</select_1.SelectItem>
                <select_1.SelectItem value="processing">Processing</select_1.SelectItem>
                <select_1.SelectItem value="shipped">Shipped</select_1.SelectItem>
                <select_1.SelectItem value="delivered">Delivered</select_1.SelectItem>
                <select_1.SelectItem value="cancelled">Cancelled</select_1.SelectItem>
                <select_1.SelectItem value="refunded">Refunded</select_1.SelectItem>
              </select_1.SelectContent>
            </select_1.Select>
          </div>
        </card_1.CardContent>
      </card_1.Card>

      {/* Orders List */}
      <card_1.Card>
        <card_1.CardHeader>
          <card_1.CardTitle>Orders ({filteredOrders.length})</card_1.CardTitle>
        </card_1.CardHeader>
        <card_1.CardContent>
          <div className="space-y-4">
            {filteredOrders.map(function (order) { return (<div key={order.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold">#{order.order_number}</h3>
                      <badge_1.Badge className={getStatusColor(order.status)}>
                        {order.status.toUpperCase()}
                      </badge_1.Badge>
                      <badge_1.Badge variant="outline">
                        {order.payment_status.toUpperCase()}
                      </badge_1.Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="font-medium">Customer</p>
                        <p>
                          {order.customer.first_name} {order.customer.last_name}
                        </p>
                        <p className="text-muted-foreground">
                          {order.customer.email}
                        </p>
                        {order.customer.phone && (<p className="text-muted-foreground">
                            {order.customer.phone}
                          </p>)}
                        {order.receiver_name &&
                order.receiver_name !==
                    "".concat(order.customer.first_name, " ").concat(order.customer.last_name) && (<p className="text-sm font-medium text-blue-600">
                              📧 Receiver: {order.receiver_name}
                            </p>)}
                      </div>

                      <div>
                        <p className="font-medium">Order Details</p>
                        <p>₹{order.total_amount.toLocaleString()}</p>
                        <p className="text-muted-foreground">
                          {order.items.length} item
                          {order.items.length !== 1 ? "s" : ""}
                        </p>
                        <p className="text-muted-foreground">
                          {formatDate(order.created_at)}
                        </p>
                      </div>

                      <div>
                        <p className="font-medium">Delivery</p>
                        {order.delivery_date && (<p>
                            Date:{" "}
                            {new Date(order.delivery_date).toLocaleDateString()}
                          </p>)}
                        {order.delivery_slot && (<p>Slot: {order.delivery_slot}</p>)}
                        {order.tracking_number && (<p className="text-muted-foreground">
                            Track: {order.tracking_number}
                          </p>)}
                        {order.customer_message && (<p className="text-sm text-blue-600">
                            💬 Has Message
                          </p>)}
                        {order.uploaded_files &&
                order.uploaded_files.length > 0 && (<p className="text-sm text-green-600">
                              📎 {order.uploaded_files.length} File
                              {order.uploaded_files.length !== 1 ? "s" : ""}
                            </p>)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <select_1.Select value={order.status} onValueChange={function (value) {
                return updateOrderStatus(order.id, value);
            }}>
                      <select_1.SelectTrigger className="w-32">
                        <select_1.SelectValue />
                      </select_1.SelectTrigger>
                      <select_1.SelectContent>
                        <select_1.SelectItem value="pending">Pending</select_1.SelectItem>
                        <select_1.SelectItem value="confirmed">Confirmed</select_1.SelectItem>
                        <select_1.SelectItem value="processing">Processing</select_1.SelectItem>
                        <select_1.SelectItem value="shipped">Shipped</select_1.SelectItem>
                        <select_1.SelectItem value="delivered">Delivered</select_1.SelectItem>
                        <select_1.SelectItem value="cancelled">Cancelled</select_1.SelectItem>
                        <select_1.SelectItem value="refunded">Refunded</select_1.SelectItem>
                      </select_1.SelectContent>
                    </select_1.Select>

                    <button_1.Button variant="ghost" size="icon" onClick={function () { return setSelectedOrder(order); }}>
                      <lucide_react_1.Eye className="w-4 h-4"/>
                    </button_1.Button>
                  </div>
                </div>
              </div>); })}
          </div>
        </card_1.CardContent>
      </card_1.Card>

      {/* Order Details Dialog */}
      <dialog_1.Dialog open={!!selectedOrder} onOpenChange={function () { return setSelectedOrder(null); }}>
        <dialog_1.DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <dialog_1.DialogHeader>
            <dialog_1.DialogTitle>
              Order Details - #{selectedOrder === null || selectedOrder === void 0 ? void 0 : selectedOrder.order_number}
            </dialog_1.DialogTitle>
          </dialog_1.DialogHeader>

          {selectedOrder && (<tabs_1.Tabs defaultValue="overview" className="w-full">
              <tabs_1.TabsList className="grid w-full grid-cols-4">
                <tabs_1.TabsTrigger value="overview">Overview</tabs_1.TabsTrigger>
                <tabs_1.TabsTrigger value="items">Items</tabs_1.TabsTrigger>
                <tabs_1.TabsTrigger value="shipping">Shipping</tabs_1.TabsTrigger>
                <tabs_1.TabsTrigger value="payment">Payment</tabs_1.TabsTrigger>
              </tabs_1.TabsList>

              <tabs_1.TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <card_1.Card>
                    <card_1.CardHeader>
                      <card_1.CardTitle className="flex items-center gap-2">
                        <lucide_react_1.Phone className="w-4 h-4"/>
                        Customer Information
                      </card_1.CardTitle>
                    </card_1.CardHeader>
                    <card_1.CardContent className="space-y-2">
                      <p>
                        <span className="font-medium">Name:</span>{" "}
                        {selectedOrder.customer.first_name}{" "}
                        {selectedOrder.customer.last_name}
                      </p>
                      <p>
                        <span className="font-medium">Email:</span>{" "}
                        {selectedOrder.customer.email}
                      </p>
                      {selectedOrder.customer.phone && (<p>
                          <span className="font-medium">Phone:</span>{" "}
                          {selectedOrder.customer.phone}
                        </p>)}
                      <p>
                        <span className="font-medium">Total Orders:</span>{" "}
                        {selectedOrder.customer.total_orders}
                      </p>
                      <p>
                        <span className="font-medium">Total Spent:</span> ₹
                        {selectedOrder.customer.total_spent.toLocaleString()}
                      </p>
                    </card_1.CardContent>
                  </card_1.Card>

                  <card_1.Card>
                    <card_1.CardHeader>
                      <card_1.CardTitle>Order Summary</card_1.CardTitle>
                    </card_1.CardHeader>
                    <card_1.CardContent className="space-y-2">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>
                          ₹
                          {(selectedOrder.total_amount -
                selectedOrder.shipping_amount -
                selectedOrder.tax_amount +
                selectedOrder.discount_amount).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Shipping:</span>
                        <span>
                          ₹{selectedOrder.shipping_amount.toLocaleString()}
                        </span>
                      </div>
                      {selectedOrder.discount_amount > 0 && (<div className="flex justify-between text-green-600">
                          <span>Discount:</span>
                          <span>
                            -₹{selectedOrder.discount_amount.toLocaleString()}
                          </span>
                        </div>)}
                      <div className="flex justify-between">
                        <span>Tax:</span>
                        <span>
                          ₹{selectedOrder.tax_amount.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between font-bold text-lg border-t pt-2">
                        <span>Total:</span>
                        <span>
                          ₹{selectedOrder.total_amount.toLocaleString()}
                        </span>
                      </div>
                    </card_1.CardContent>
                  </card_1.Card>
                </div>
              </tabs_1.TabsContent>

              <tabs_1.TabsContent value="items" className="space-y-4">
                <card_1.Card>
                  <card_1.CardHeader>
                    <card_1.CardTitle>Order Items</card_1.CardTitle>
                  </card_1.CardHeader>
                  <card_1.CardContent>
                    <div className="space-y-4">
                      {selectedOrder.items.map(function (item, index) { return (<div key={index} className="flex gap-4 border-b pb-4">
                          {/* Product Image */}
                          <div className="flex-shrink-0">
                            {productImages[item.product_id] ? (<div className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden cursor-pointer group hover:shadow-md transition-shadow" onClick={function () {
                        return setSelectedImage(productImages[item.product_id]);
                    }}>
                                <img src={productImages[item.product_id]} alt={item.product_name} className="w-full h-full object-cover"/>
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity flex items-center justify-center">
                                  <lucide_react_1.ZoomIn className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity"/>
                                </div>
                              </div>) : (<div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                                <lucide_react_1.Eye className="w-6 h-6 text-gray-400"/>
                              </div>)}
                          </div>

                          {/* Product Details */}
                          <div className="flex-1">
                            <h4 className="font-medium">{item.product_name}</h4>
                            {item.variant_name && (<p className="text-sm text-muted-foreground">
                                Variant: {item.variant_name}
                              </p>)}
                            <p className="text-sm text-muted-foreground">
                              Quantity: {item.quantity}
                            </p>
                            {item.uploaded_file_name && (<div className="mt-2 p-3 bg-blue-50 rounded border-l-4 border-blue-400">
                                <p className="text-sm font-medium text-blue-800">
                                  📎 Customer Uploaded File
                                </p>
                                <p className="text-sm text-blue-600 font-mono">
                                  {item.uploaded_file_name}
                                </p>
                                {item.uploaded_file_size && (<p className="text-xs text-blue-500">
                                    Size:{" "}
                                    {(item.uploaded_file_size /
                            1024 /
                            1024).toFixed(2)}{" "}
                                    MB
                                  </p>)}
                                {item.uploaded_file_type && (<p className="text-xs text-blue-500">
                                    Type: {item.uploaded_file_type}
                                  </p>)}
                                {item.uploaded_file_url &&
                        item.uploaded_file_url !== "pending-upload" ? (<div className="mt-2">
                                    <a href={item.uploaded_file_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded transition-colors">
                                      📁 Download File
                                    </a>
                                  </div>) : item.upload_status ? (<p className="text-xs text-red-500 mt-1">
                                    ❌ Upload Status: {item.upload_status}
                                  </p>) : (<p className="text-xs text-gray-500 mt-1">
                                    File information available
                                  </p>)}
                              </div>)}
                          </div>

                          {/* Price */}
                          <div className="text-right flex-shrink-0">
                            <p className="font-medium">
                              ₹{item.total_price.toLocaleString()}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              ₹{item.unit_price} each
                            </p>
                          </div>
                        </div>); })}
                    </div>
                  </card_1.CardContent>
                </card_1.Card>
              </tabs_1.TabsContent>

              <tabs_1.TabsContent value="shipping" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <card_1.Card>
                    <card_1.CardHeader>
                      <card_1.CardTitle className="flex items-center gap-2">
                        <lucide_react_1.MapPin className="w-4 h-4"/>
                        Shipping Address
                      </card_1.CardTitle>
                    </card_1.CardHeader>
                    <card_1.CardContent>
                      <div className="space-y-1">
                        <p>
                          <strong>Receiver:</strong>{" "}
                          {selectedOrder.receiver_name ||
                selectedOrder.shipping_address.name}
                        </p>
                        <p>{selectedOrder.shipping_address.address_line_1}</p>
                        {selectedOrder.shipping_address.address_line_2 && (<p>{selectedOrder.shipping_address.address_line_2}</p>)}
                        <p>
                          {selectedOrder.shipping_address.city},{" "}
                          {selectedOrder.shipping_address.state}{" "}
                          {selectedOrder.shipping_address.pincode}
                        </p>
                        {(selectedOrder.receiver_phone ||
                selectedOrder.shipping_address.phone) && (<p>
                            Phone:{" "}
                            {selectedOrder.receiver_phone ||
                    selectedOrder.shipping_address.phone}
                          </p>)}
                        {(selectedOrder.alternate_phone ||
                selectedOrder.shipping_address.alternate_phone) && (<p>
                            Alternate Phone:{" "}
                            {selectedOrder.alternate_phone ||
                    selectedOrder.shipping_address.alternate_phone}
                          </p>)}
                      </div>
                    </card_1.CardContent>
                  </card_1.Card>

                  <card_1.Card>
                    <card_1.CardHeader>
                      <card_1.CardTitle className="flex items-center gap-2">
                        <lucide_react_1.Truck className="w-4 h-4"/>
                        Delivery Information
                      </card_1.CardTitle>
                    </card_1.CardHeader>
                    <card_1.CardContent className="space-y-2">
                      {selectedOrder.delivery_date && (<p>
                          <span className="font-medium">Delivery Date:</span>{" "}
                          {new Date(selectedOrder.delivery_date).toLocaleDateString()}
                        </p>)}
                      {selectedOrder.delivery_slot && (<p>
                          <span className="font-medium">Time Slot:</span>{" "}
                          {selectedOrder.delivery_slot}
                        </p>)}
                      {selectedOrder.tracking_number && (<p>
                          <span className="font-medium">Tracking:</span>{" "}
                          {selectedOrder.tracking_number}
                        </p>)}
                      {selectedOrder.special_instructions && (<div>
                          <p className="font-medium">Special Instructions:</p>
                          <p className="text-sm text-muted-foreground">
                            {selectedOrder.special_instructions}
                          </p>
                        </div>)}
                    </card_1.CardContent>
                  </card_1.Card>

                  {/* Additional Order Information */}
                  <card_1.Card>
                    <card_1.CardHeader>
                      <card_1.CardTitle>Additional Information</card_1.CardTitle>
                    </card_1.CardHeader>
                    <card_1.CardContent className="space-y-2">
                      {selectedOrder.customer_message && (<div>
                          <p className="font-medium">Customer Message:</p>
                          <p className="text-sm text-muted-foreground bg-blue-50 p-3 rounded border-l-4 border-blue-400">
                            {selectedOrder.customer_message}
                          </p>
                        </div>)}
                      {selectedOrder.delivery_instructions && (<div>
                          <p className="font-medium">Delivery Instructions:</p>
                          <p className="text-sm text-muted-foreground bg-yellow-50 p-3 rounded border-l-4 border-yellow-400">
                            {selectedOrder.delivery_instructions}
                          </p>
                        </div>)}
                      {selectedOrder.uploaded_files &&
                selectedOrder.uploaded_files.length > 0 && (<div>
                            <p className="font-medium">All Uploaded Files:</p>
                            <div className="space-y-3 mt-2">
                              {selectedOrder.uploaded_files.map(function (file, index) { return (<div key={index} className="bg-gray-50 p-3 rounded-lg border">
                                    <div className="flex justify-between items-start">
                                      <div className="flex-1">
                                        <p className="font-medium text-gray-900">
                                          {file.file_name}
                                        </p>
                                        <p className="text-sm text-blue-600">
                                          📦 Product: {file.product_name}
                                        </p>
                                        <div className="flex gap-4 mt-1">
                                          {file.file_size && (<p className="text-xs text-gray-500">
                                              📏 Size:{" "}
                                              {(file.file_size /
                            1024 /
                            1024).toFixed(2)}{" "}
                                              MB
                                            </p>)}
                                          {file.file_type && (<p className="text-xs text-gray-500">
                                              📄 Type: {file.file_type}
                                            </p>)}
                                        </div>
                                        {file.file_url && (<div className="mt-2">
                                            <a href={file.file_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm text-white bg-green-600 hover:bg-green-700 px-3 py-1 rounded transition-colors">
                                              📥 Download File
                                            </a>
                                          </div>)}
                                      </div>
                                      <badge_1.Badge variant={file.status === "uploaded"
                        ? "default"
                        : "destructive"} className={file.status === "uploaded"
                        ? "bg-green-100 text-green-800"
                        : ""}>
                                        {file.status}
                                      </badge_1.Badge>
                                    </div>
                                    {file.error && (<p className="text-xs text-red-500 mt-2 bg-red-50 p-2 rounded">
                                        ❌ Error: {file.error}
                                      </p>)}
                                  </div>); })}
                            </div>
                          </div>)}
                      {selectedOrder.notes && (<div>
                          <p className="font-medium">Admin Notes:</p>
                          <p className="text-sm text-muted-foreground">
                            {selectedOrder.notes}
                          </p>
                        </div>)}
                    </card_1.CardContent>
                  </card_1.Card>
                </div>
              </tabs_1.TabsContent>

              <tabs_1.TabsContent value="payment" className="space-y-4">
                <card_1.Card>
                  <card_1.CardHeader>
                    <card_1.CardTitle>Payment Details</card_1.CardTitle>
                  </card_1.CardHeader>
                  <card_1.CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="font-medium">Payment Status</p>
                        <badge_1.Badge className={selectedOrder.payment_status === "paid"
                ? "bg-green-100 text-green-800"
                : "bg-yellow-100 text-yellow-800"}>
                          {selectedOrder.payment_status.toUpperCase()}
                        </badge_1.Badge>
                      </div>
                      {selectedOrder.payment_method && (<div>
                          <p className="font-medium">Payment Method</p>
                          <p>{selectedOrder.payment_method}</p>
                        </div>)}
                    </div>

                    {selectedOrder.payment_reference && (<div>
                        <p className="font-medium">Payment Reference</p>
                        <p className="font-mono text-sm">
                          {selectedOrder.payment_reference}
                        </p>
                      </div>)}

                    {selectedOrder.coupon_code && (<div>
                        <p className="font-medium">Coupon Used</p>
                        <p>{selectedOrder.coupon_code}</p>
                      </div>)}
                  </card_1.CardContent>
                </card_1.Card>
              </tabs_1.TabsContent>
            </tabs_1.Tabs>)}
        </dialog_1.DialogContent>
      </dialog_1.Dialog>

      {/* Image Viewer Modal */}
      <dialog_1.Dialog open={!!selectedImage} onOpenChange={function () { return setSelectedImage(null); }}>
        <dialog_1.DialogContent className="max-w-4xl max-h-[90vh] p-0">
          <dialog_1.DialogHeader className="p-4 pb-0">
            <div className="flex justify-between items-center">
              <dialog_1.DialogTitle>Product Image</dialog_1.DialogTitle>
              <button_1.Button variant="ghost" size="icon" onClick={function () { return setSelectedImage(null); }} className="h-8 w-8">
                <lucide_react_1.X className="h-4 w-4"/>
              </button_1.Button>
            </div>
          </dialog_1.DialogHeader>
          <div className="p-4">
            {selectedImage && (<div className="flex justify-center">
                <img src={selectedImage} alt="Product" className="max-w-full max-h-[70vh] object-contain rounded-lg"/>
              </div>)}
          </div>
        </dialog_1.DialogContent>
      </dialog_1.Dialog>
    </div>);
}
