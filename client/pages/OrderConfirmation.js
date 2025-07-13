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
exports.default = OrderConfirmation;
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var lucide_react_1 = require("lucide-react");
var button_1 = require("@/components/ui/button");
var card_1 = require("@/components/ui/card");
var badge_1 = require("@/components/ui/badge");
var supabase_1 = require("@/lib/supabase");
function OrderConfirmation() {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    var orderId = (0, react_router_dom_1.useParams)().orderId;
    var navigate = (0, react_router_dom_1.useNavigate)();
    var _k = (0, react_1.useState)(null), orderData = _k[0], setOrderData = _k[1];
    var _l = (0, react_1.useState)(true), isLoading = _l[0], setIsLoading = _l[1];
    var _m = (0, react_1.useState)(""), error = _m[0], setError = _m[1];
    var _o = (0, react_1.useState)(18), gstRate = _o[0], setGstRate = _o[1]; // Default fallback
    (0, react_1.useEffect)(function () {
        if (orderId) {
            fetchOrderDetails();
        }
        fetchGstRate();
    }, [orderId]);
    function fetchGstRate() {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error_2, rate, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, supabase_1.supabase
                                .from("site_settings")
                                .select("value")
                                .eq("key", "gst_rate")
                                .single()];
                    case 1:
                        _a = _b.sent(), data = _a.data, error_2 = _a.error;
                        if (error_2) {
                            console.error("Failed to fetch GST rate:", error_2);
                            return [2 /*return*/];
                        }
                        if (data) {
                            rate = parseFloat(data.value);
                            if (!isNaN(rate)) {
                                setGstRate(rate);
                            }
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _b.sent();
                        console.error("Error fetching GST rate:", error_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    }
    function fetchOrderDetails() {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error_4, productIds, productsData_1, products, enhancedItems, error_3;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 4, 5, 6]);
                        setIsLoading(true);
                        return [4 /*yield*/, supabase_1.supabase
                                .from("orders")
                                .select("\n          *,\n          customer:customers(\n            first_name,\n            last_name,\n            email,\n            phone\n          )\n        ")
                                .eq("id", orderId)
                                .single()];
                    case 1:
                        _a = _b.sent(), data = _a.data, error_4 = _a.error;
                        if (error_4 || !data) {
                            setError("Order not found");
                            return [2 /*return*/];
                        }
                        productIds = data.items
                            .map(function (item) { return item.product_id; })
                            .filter(Boolean);
                        productsData_1 = [];
                        if (!(productIds.length > 0)) return [3 /*break*/, 3];
                        return [4 /*yield*/, supabase_1.supabase
                                .from("products")
                                .select("id, images")
                                .in("id", productIds)];
                    case 2:
                        products = (_b.sent()).data;
                        productsData_1 = products || [];
                        _b.label = 3;
                    case 3:
                        enhancedItems = data.items.map(function (item) {
                            var _a;
                            var product = productsData_1.find(function (p) { return p.id === item.product_id; });
                            var productImage = ((_a = product === null || product === void 0 ? void 0 : product.images) === null || _a === void 0 ? void 0 : _a[0]) || null;
                            return __assign(__assign({}, item), { image: productImage });
                        });
                        setOrderData(__assign(__assign({}, data), { items: enhancedItems }));
                        return [3 /*break*/, 6];
                    case 4:
                        error_3 = _b.sent();
                        console.error("Failed to fetch order:", error_3);
                        setError("Failed to load order details");
                        return [3 /*break*/, 6];
                    case 5:
                        setIsLoading(false);
                        return [7 /*endfinally*/];
                    case 6: return [2 /*return*/];
                }
            });
        });
    }
    var formatPrice = function (price) {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
        }).format(price);
    };
    var formatDate = function (dateString) {
        return new Date(dateString).toLocaleDateString("en-IN", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };
    var getStatusColor = function (status) {
        switch (status) {
            case "pending":
                return "bg-yellow-100 text-yellow-800 border-yellow-200";
            case "confirmed":
                return "bg-blue-100 text-blue-800 border-blue-200";
            case "processing":
                return "bg-purple-100 text-purple-800 border-purple-200";
            case "shipped":
                return "bg-indigo-100 text-indigo-800 border-indigo-200";
            case "delivered":
                return "bg-green-100 text-green-800 border-green-200";
            default:
                return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };
    var getPaymentMethodLabel = function (method) {
        switch (method) {
            case "razorpay":
                return "Credit/Debit Card";
            case "upi":
                return "UPI Payment";
            case "netbanking":
                return "Net Banking";
            case "cod":
                return "Cash on Delivery";
            default:
                return method;
        }
    };
    // SEO Meta tags
    (0, react_1.useEffect)(function () {
        document.title = orderData
            ? "Order Confirmation #".concat(orderData.order_number, " - Florist in India")
            : "Order Confirmation - Florist in India";
        var metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
            metaDesc = document.createElement("meta");
            metaDesc.setAttribute("name", "description");
            document.head.appendChild(metaDesc);
        }
        metaDesc.setAttribute("content", "Your order has been confirmed! Track your flower delivery order status and get real-time updates.");
    }, [orderData]);
    if (isLoading) {
        return (<div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading order details...</p>
        </div>
      </div>);
    }
    if (error || !orderData) {
        return (<div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-orange-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="bg-red-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
            <lucide_react_1.Package className="h-8 w-8 text-red-600"/>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Order Not Found
          </h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button_1.Button onClick={function () { return navigate("/"); }} className="bg-red-600 hover:bg-red-700">
            Return Home
          </button_1.Button>
        </div>
      </div>);
    }
    return (<div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Success Hero Section */}
      <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white py-16 lg:py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full backdrop-blur-sm mb-6">
            <lucide_react_1.CheckCircle className="h-10 w-10"/>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Order Confirmed!
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90 leading-relaxed mb-6">
            Thank you for your order. We'll send you updates via email and SMS.
          </p>
          <div className="bg-white/20 rounded-2xl backdrop-blur-sm p-6 max-w-md mx-auto">
            <p className="text-lg font-semibold mb-2">Order Number</p>
            <p className="text-2xl md:text-3xl font-bold tracking-wider">
              #{orderData.order_number}
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Order Status */}
            <card_1.Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <card_1.CardHeader className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-t-lg">
                <card_1.CardTitle className="flex items-center gap-3 text-xl">
                  <div className="bg-white/20 rounded-lg p-2">
                    <lucide_react_1.Package className="w-6 h-6"/>
                  </div>
                  Order Status
                </card_1.CardTitle>
              </card_1.CardHeader>
              <card_1.CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-sm text-gray-600">Current Status</p>
                    <badge_1.Badge className={"".concat(getStatusColor(orderData.status), " border-2 px-4 py-2 text-sm font-bold")}>
                      <lucide_react_1.Package className="h-4 w-4 mr-2"/>
                      {orderData.status.charAt(0).toUpperCase() +
            orderData.status.slice(1)}
                    </badge_1.Badge>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Order Placed</p>
                    <p className="font-semibold">
                      {formatDate(orderData.created_at)}
                    </p>
                  </div>
                </div>

                {orderData.delivery_date && (<div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-4">
                    <div className="flex items-center text-blue-800">
                      <lucide_react_1.Calendar className="h-5 w-5 mr-3"/>
                      <div>
                        <p className="font-semibold">Scheduled Delivery</p>
                        <p>
                          {new Date(orderData.delivery_date).toLocaleDateString("en-IN", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
            })}
                          {orderData.delivery_slot &&
                " \u2022 ".concat(orderData.delivery_slot)}
                        </p>
                      </div>
                    </div>
                  </div>)}

                {orderData.tracking_number && (<div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
                    <div className="flex items-center text-green-800">
                      <lucide_react_1.Truck className="h-5 w-5 mr-3"/>
                      <div>
                        <p className="font-semibold">Tracking Number</p>
                        <p className="font-mono">{orderData.tracking_number}</p>
                      </div>
                    </div>
                  </div>)}
              </card_1.CardContent>
            </card_1.Card>

            {/* Delivery Address */}
            <card_1.Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <card_1.CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
                <card_1.CardTitle className="flex items-center gap-3 text-xl">
                  <div className="bg-white/20 rounded-lg p-2">
                    <lucide_react_1.MapPin className="w-6 h-6"/>
                  </div>
                  Delivery Address
                </card_1.CardTitle>
              </card_1.CardHeader>
              <card_1.CardContent className="p-6">
                <div className="space-y-2">
                  <p className="font-semibold text-gray-900">
                    {((_a = orderData.shipping_address) === null || _a === void 0 ? void 0 : _a.name) ||
            "".concat((_b = orderData.customer) === null || _b === void 0 ? void 0 : _b.first_name, " ").concat((_c = orderData.customer) === null || _c === void 0 ? void 0 : _c.last_name)}
                  </p>
                  <p className="text-gray-700">
                    {(_d = orderData.shipping_address) === null || _d === void 0 ? void 0 : _d.line1}
                  </p>
                  {((_e = orderData.shipping_address) === null || _e === void 0 ? void 0 : _e.line2) && (<p className="text-gray-700">
                      {orderData.shipping_address.line2}
                    </p>)}
                  <p className="text-gray-700">
                    {(_f = orderData.shipping_address) === null || _f === void 0 ? void 0 : _f.city},{" "}
                    {(_g = orderData.shipping_address) === null || _g === void 0 ? void 0 : _g.state}{" "}
                    {(_h = orderData.shipping_address) === null || _h === void 0 ? void 0 : _h.pincode}
                  </p>
                  {((_j = orderData.shipping_address) === null || _j === void 0 ? void 0 : _j.phone) && (<p className="flex items-center text-gray-700 mt-3">
                      <lucide_react_1.Phone className="h-4 w-4 mr-2"/>
                      {orderData.shipping_address.phone}
                    </p>)}
                </div>
              </card_1.CardContent>
            </card_1.Card>

            {/* Order Items */}
            <card_1.Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <card_1.CardHeader className="bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-t-lg">
                <card_1.CardTitle className="flex items-center gap-3 text-xl">
                  <div className="bg-white/20 rounded-lg p-2">
                    <lucide_react_1.ShoppingBag className="w-6 h-6"/>
                  </div>
                  Order Items ({orderData.items.length})
                </card_1.CardTitle>
              </card_1.CardHeader>
              <card_1.CardContent className="p-6">
                <div className="space-y-4">
                  {orderData.items.map(function (item, index) { return (<div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                      {item.image && (<img src={item.image} alt={item.product_name} className="w-16 h-16 object-cover rounded-lg"/>)}
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">
                          {item.product_name}
                        </h3>
                        {item.variant_name && (<p className="text-sm text-gray-600">
                            Variant: {item.variant_name}
                          </p>)}
                        <p className="text-sm text-gray-600">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-lg">
                          {formatPrice(item.total_price)}
                        </p>
                        <p className="text-sm text-gray-600">
                          {formatPrice(item.unit_price)} each
                        </p>
                      </div>
                    </div>); })}
                </div>
              </card_1.CardContent>
            </card_1.Card>
          </div>

          {/* Order Summary Sidebar */}
          <div className="space-y-6">
            {/* Payment Information */}
            <card_1.Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <card_1.CardHeader>
                <card_1.CardTitle className="flex items-center gap-2">
                  <lucide_react_1.CheckCircle className="w-5 h-5 text-green-600"/>
                  Payment Information
                </card_1.CardTitle>
              </card_1.CardHeader>
              <card_1.CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Payment Method</p>
                  <p className="font-semibold">
                    {getPaymentMethodLabel(orderData.payment_method)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Payment Status</p>
                  <badge_1.Badge className={orderData.payment_status === "paid"
            ? "bg-green-100 text-green-800"
            : "bg-yellow-100 text-yellow-800"}>
                    {orderData.payment_status.charAt(0).toUpperCase() +
            orderData.payment_status.slice(1)}
                  </badge_1.Badge>
                </div>
              </card_1.CardContent>
            </card_1.Card>

            {/* Order Total */}
            <card_1.Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <card_1.CardHeader>
                <card_1.CardTitle>Order Summary</card_1.CardTitle>
              </card_1.CardHeader>
              <card_1.CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>
                      {formatPrice(orderData.total_amount -
            orderData.shipping_amount -
            orderData.tax_amount +
            orderData.discount_amount)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping:</span>
                    <span>
                      {orderData.shipping_amount === 0
            ? "FREE"
            : formatPrice(orderData.shipping_amount)}
                    </span>
                  </div>
                  {orderData.discount_amount > 0 && (<div className="flex justify-between text-green-600">
                      <span>Discount:</span>
                      <span>-{formatPrice(orderData.discount_amount)}</span>
                    </div>)}
                  <div className="flex justify-between">
                    <span>Tax ({gstRate}% GST):</span>
                    <span>{formatPrice(orderData.tax_amount)}</span>
                  </div>
                  <hr />
                  <div className="flex justify-between text-xl font-bold text-green-600">
                    <span>Total Paid:</span>
                    <span>{formatPrice(orderData.total_amount)}</span>
                  </div>
                </div>
              </card_1.CardContent>
            </card_1.Card>

            {/* Quick Actions */}
            <div className="space-y-4">
              <react_router_dom_1.Link to={"/track-order"}>
                <button_1.Button className="w-full bg-blue-600 hover:bg-blue-700 py-3">
                  <lucide_react_1.Truck className="h-5 w-5 mr-2"/>
                  Track Your Order
                </button_1.Button>
              </react_router_dom_1.Link>

              <button_1.Button variant="outline" className="w-full border-2 border-gray-300 hover:border-gray-400 py-3" onClick={function () { return window.print(); }}>
                <lucide_react_1.Download className="h-5 w-5 mr-2"/>
                Download Receipt
              </button_1.Button>

              <react_router_dom_1.Link to="/">
                <button_1.Button variant="outline" className="w-full border-2 border-green-300 hover:border-green-400 text-green-700 hover:text-green-800 py-3">
                  <lucide_react_1.ShoppingBag className="h-5 w-5 mr-2"/>
                  Continue Shopping
                </button_1.Button>
              </react_router_dom_1.Link>
            </div>

            {/* Contact Info */}
            <card_1.Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <card_1.CardHeader>
                <card_1.CardTitle className="text-lg">Need Help?</card_1.CardTitle>
              </card_1.CardHeader>
              <card_1.CardContent className="space-y-3">
                <div className="flex items-center text-sm">
                  <lucide_react_1.Phone className="h-4 w-4 mr-2 text-blue-600"/>
                  <span>Call: +91 98765 43210</span>
                </div>
                <div className="flex items-center text-sm">
                  <lucide_react_1.Mail className="h-4 w-4 mr-2 text-blue-600"/>
                  <span>Email: care@floristinindia.com</span>
                </div>
                <div className="flex items-center text-sm">
                  <lucide_react_1.Clock className="h-4 w-4 mr-2 text-blue-600"/>
                  <span>24/7 Customer Support</span>
                </div>
              </card_1.CardContent>
            </card_1.Card>
          </div>
        </div>
      </div>
    </div>);
}
