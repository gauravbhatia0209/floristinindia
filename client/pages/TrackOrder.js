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
exports.default = TrackOrder;
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var button_1 = require("@/components/ui/button");
var card_1 = require("@/components/ui/card");
var input_1 = require("@/components/ui/input");
var badge_1 = require("@/components/ui/badge");
var supabase_1 = require("@/lib/supabase");
function TrackOrder() {
    var _this = this;
    var _a, _b;
    var _c = (0, react_1.useState)(""), orderNumber = _c[0], setOrderNumber = _c[1];
    var _d = (0, react_1.useState)(""), verificationField = _d[0], setVerificationField = _d[1];
    var _e = (0, react_1.useState)("phone"), verificationType = _e[0], setVerificationType = _e[1];
    var _f = (0, react_1.useState)(null), orderData = _f[0], setOrderData = _f[1];
    var _g = (0, react_1.useState)(false), isLoading = _g[0], setIsLoading = _g[1];
    var _h = (0, react_1.useState)(""), error = _h[0], setError = _h[1];
    var _j = (0, react_1.useState)("input"), step = _j[0], setStep = _j[1];
    var handleOrderSearch = function () { return __awaiter(_this, void 0, void 0, function () {
        var trimmedOrderNumber;
        return __generator(this, function (_a) {
            if (!orderNumber.trim()) {
                setError("Please enter a valid order number");
                return [2 /*return*/];
            }
            // Validate order number format (should be alphanumeric, preferably starting with FII)
            if (!/^[A-Za-z0-9\-]+$/.test(orderNumber.trim())) {
                setError("Order number should contain only letters, numbers, and dashes");
                return [2 /*return*/];
            }
            trimmedOrderNumber = orderNumber.trim().toUpperCase();
            if (!trimmedOrderNumber.startsWith("FII") &&
                !trimmedOrderNumber.startsWith("ORD")) {
                setError("Please enter a valid order number (e.g., FII00001)");
                return [2 /*return*/];
            }
            setError("");
            setStep("verification");
            return [2 /*return*/];
        });
    }); };
    var handleVerificationSubmit = function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, orderData_1, orderError, productIds, productsData_1, _b, products, productsError, enhancedItems, customer, customerMatches, error_1;
        var _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    if (!verificationField.trim()) {
                        setError("Please enter your ".concat(verificationType === "phone" ? "phone number" : "email address"));
                        return [2 /*return*/];
                    }
                    // Validate phone/email format
                    if (verificationType === "phone") {
                        if (!/^\+?[\d\s\-\(\)]{10,}$/.test(verificationField.trim())) {
                            setError("Please enter a valid phone number");
                            return [2 /*return*/];
                        }
                    }
                    else {
                        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(verificationField.trim())) {
                            setError("Please enter a valid email address");
                            return [2 /*return*/];
                        }
                    }
                    setIsLoading(true);
                    setError("");
                    _e.label = 1;
                case 1:
                    _e.trys.push([1, 5, 6, 7]);
                    return [4 /*yield*/, supabase_1.supabase
                            .from("orders")
                            .select("\n          id,\n          order_number,\n          status,\n          total_amount,\n          shipping_amount,\n          items,\n          shipping_address,\n          delivery_date,\n          delivery_slot,\n          tracking_number,\n          special_instructions,\n          created_at,\n          updated_at,\n          customer_id,\n          customers!inner(\n            first_name,\n            last_name,\n            email,\n            phone\n          )\n        ")
                            .eq("order_number", orderNumber.trim().toUpperCase())
                            .single()];
                case 2:
                    _a = _e.sent(), orderData_1 = _a.data, orderError = _a.error;
                    if (orderError || !orderData_1) {
                        console.log("Order not found:", orderError);
                        if ((orderError === null || orderError === void 0 ? void 0 : orderError.code) === "PGRST116") {
                            setError("No order found. Please check your order number and try again.");
                        }
                        else {
                            setError("Unable to fetch order details. Please try again later.");
                        }
                        return [2 /*return*/];
                    }
                    productIds = orderData_1.items
                        .map(function (item) { return item.product_id; })
                        .filter(Boolean);
                    console.log("Track Order: Product IDs to fetch images for:", productIds);
                    productsData_1 = [];
                    if (!(productIds.length > 0)) return [3 /*break*/, 4];
                    return [4 /*yield*/, supabase_1.supabase
                            .from("products")
                            .select("id, images, slug")
                            .in("id", productIds)];
                case 3:
                    _b = _e.sent(), products = _b.data, productsError = _b.error;
                    console.log("Track Order: Products fetched:", products);
                    console.log("Track Order: Products error:", productsError);
                    productsData_1 = products || [];
                    _e.label = 4;
                case 4:
                    enhancedItems = orderData_1.items.map(function (item) {
                        var _a;
                        var product = productsData_1.find(function (p) { return p.id === item.product_id; });
                        var productImage = ((_a = product === null || product === void 0 ? void 0 : product.images) === null || _a === void 0 ? void 0 : _a[0]) || null;
                        var productSlug = (product === null || product === void 0 ? void 0 : product.slug) || null;
                        console.log("Track Order: Item ".concat(item.product_name, " - Product:"), product, "Image:", productImage, "Slug:", productSlug);
                        return __assign(__assign({}, item), { image: productImage, slug: productSlug });
                    });
                    customer = Array.isArray(orderData_1.customers)
                        ? orderData_1.customers[0]
                        : orderData_1.customers;
                    customerMatches = verificationType === "phone"
                        ? (customer === null || customer === void 0 ? void 0 : customer.phone) === verificationField.trim() ||
                            (customer === null || customer === void 0 ? void 0 : customer.phone) === "+91".concat(verificationField.trim()) ||
                            ((_c = customer === null || customer === void 0 ? void 0 : customer.phone) === null || _c === void 0 ? void 0 : _c.replace(/\D/g, "").endsWith(verificationField.trim().replace(/\D/g, "")))
                        : ((_d = customer === null || customer === void 0 ? void 0 : customer.email) === null || _d === void 0 ? void 0 : _d.toLowerCase()) ===
                            verificationField.trim().toLowerCase();
                    if (!customerMatches) {
                        setError("The ".concat(verificationType, " you entered doesn't match our records for this order. Please check and try again."));
                        return [2 /*return*/];
                    }
                    // Format the data for display with enhanced items
                    console.log("Track Order: Final enhanced items:", enhancedItems);
                    setOrderData(__assign(__assign({}, orderData_1), { items: enhancedItems, customer: customer }));
                    setStep("results");
                    return [3 /*break*/, 7];
                case 5:
                    error_1 = _e.sent();
                    console.error("Error fetching order:", error_1);
                    setError("Unable to fetch order details. Please try again later.");
                    return [3 /*break*/, 7];
                case 6:
                    setIsLoading(false);
                    return [7 /*endfinally*/];
                case 7: return [2 /*return*/];
            }
        });
    }); };
    var _k = (0, react_1.useState)(false), copiedTrackingNumber = _k[0], setCopiedTrackingNumber = _k[1];
    var getStatusColor = function (status) {
        switch (status) {
            case "pending":
                return "bg-amber-50 text-amber-700 border-amber-200";
            case "confirmed":
                return "bg-blue-50 text-blue-700 border-blue-200";
            case "processing":
                return "bg-purple-50 text-purple-700 border-purple-200";
            case "shipped":
                return "bg-indigo-50 text-indigo-700 border-indigo-200";
            case "delivered":
                return "bg-emerald-50 text-emerald-700 border-emerald-200";
            case "cancelled":
            case "refunded":
                return "bg-red-50 text-red-700 border-red-200";
            default:
                return "bg-gray-50 text-gray-700 border-gray-200";
        }
    };
    var getProgressPercentage = function (status) {
        switch (status) {
            case "pending":
                return 20;
            case "confirmed":
                return 40;
            case "processing":
                return 60;
            case "shipped":
                return 80;
            case "delivered":
                return 100;
            case "cancelled":
            case "refunded":
                return 0;
            default:
                return 0;
        }
    };
    var getOrderSteps = function () { return [
        { key: "pending", label: "Order Placed", icon: lucide_react_1.ShoppingBag },
        { key: "confirmed", label: "Confirmed", icon: lucide_react_1.CheckCircle },
        { key: "processing", label: "Processing", icon: lucide_react_1.Package },
        { key: "shipped", label: "Shipped", icon: lucide_react_1.Truck },
        { key: "delivered", label: "Delivered", icon: lucide_react_1.CheckCircle },
    ]; };
    var copyToClipboard = function (text) { return __awaiter(_this, void 0, void 0, function () {
        var err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, navigator.clipboard.writeText(text)];
                case 1:
                    _a.sent();
                    setCopiedTrackingNumber(true);
                    setTimeout(function () { return setCopiedTrackingNumber(false); }, 2000);
                    return [3 /*break*/, 3];
                case 2:
                    err_1 = _a.sent();
                    console.error("Failed to copy: ", err_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var getStatusIcon = function (status) {
        switch (status) {
            case "pending":
                return <lucide_react_1.Clock className="h-5 w-5 text-yellow-600"/>;
            case "confirmed":
            case "processing":
                return <lucide_react_1.Package className="h-5 w-5 text-blue-600"/>;
            case "shipped":
                return <lucide_react_1.Truck className="h-5 w-5 text-indigo-600"/>;
            case "delivered":
                return <lucide_react_1.CheckCircle className="h-5 w-5 text-green-600"/>;
            case "cancelled":
            case "refunded":
                return <lucide_react_1.AlertCircle className="h-5 w-5 text-red-600"/>;
            default:
                return <lucide_react_1.Package className="h-5 w-5 text-gray-600"/>;
        }
    };
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
    var resetForm = function () {
        setOrderNumber("");
        setVerificationField("");
        setOrderData(null);
        setError("");
        setStep("input");
    };
    // SEO Meta tags
    (0, react_1.useState)(function () {
        document.title = "Track Your Order - Florist in India";
        var metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
            metaDesc = document.createElement("meta");
            metaDesc.setAttribute("name", "description");
            document.head.appendChild(metaDesc);
        }
        metaDesc.setAttribute("content", "Track your flower delivery order in real-time. Enter your order number to get live updates on delivery status.");
    });
    return (<div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50">
      {/* Modern Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-rose-600 via-pink-600 to-orange-500 text-white py-20 lg:py-24">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-20 right-20 w-24 h-24 bg-yellow-300/20 rounded-full blur-lg"></div>
          <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-orange-300/30 rounded-full blur-lg"></div>
        </div>
        <div className="relative container mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-2xl backdrop-blur-sm mb-8">
            <lucide_react_1.Package className="h-10 w-10"/>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
            Track Your Order
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90 leading-relaxed">
            Get real-time updates on your flower delivery with our advanced
            tracking system
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {step === "input" && (<card_1.Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
            <card_1.CardHeader className="text-center pb-8 pt-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-rose-500 to-pink-600 rounded-2xl mb-6">
                <lucide_react_1.Search className="h-8 w-8 text-white"/>
              </div>
              <card_1.CardTitle className="text-3xl font-bold text-gray-900 mb-2">
                Enter Order Details
              </card_1.CardTitle>
              <p className="text-gray-600 text-lg">
                Enter your order number to start real-time tracking
              </p>
            </card_1.CardHeader>
            <card_1.CardContent className="space-y-8 pb-12">
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-gray-800 mb-3">
                  Order Number *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <lucide_react_1.Package className="h-5 w-5 text-gray-400"/>
                  </div>
                  <input_1.Input type="text" placeholder="FII00001" value={orderNumber} onChange={function (e) {
                return setOrderNumber(e.target.value.toUpperCase());
            }} className="text-lg py-6 pl-12 pr-4 text-center tracking-widest font-mono bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-rose-500 focus:ring-rose-500 transition-all duration-200" maxLength={15}/>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <lucide_react_1.AlertCircle className="h-5 w-5 text-blue-600 mt-0.5"/>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-blue-800">
                        Where to find your order number?
                      </p>
                      <p className="text-sm text-blue-700 mt-1">
                        Check your confirmation email or SMS for the order
                        number (e.g., FII00001)
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {error && (<div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
                  <div className="flex items-center">
                    <lucide_react_1.AlertCircle className="h-5 w-5 text-red-500 mr-3"/>
                    <p className="text-red-700 font-medium">{error}</p>
                  </div>
                </div>)}

              <button_1.Button onClick={handleOrderSearch} className="w-full py-6 text-lg font-semibold bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]" disabled={isLoading || !orderNumber.trim()}>
                <lucide_react_1.Search className="h-5 w-5 mr-3"/>
                Start Tracking
                <lucide_react_1.ArrowRight className="h-5 w-5 ml-3"/>
              </button_1.Button>
            </card_1.CardContent>
          </card_1.Card>)}

        {step === "verification" && (<card_1.Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
            <card_1.CardHeader className="text-center pb-8 pt-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-6">
                <lucide_react_1.User className="h-8 w-8 text-white"/>
              </div>
              <card_1.CardTitle className="text-3xl font-bold text-gray-900 mb-2">
                Verify Your Identity
              </card_1.CardTitle>
              <p className="text-gray-600 text-lg">
                For your security, please verify your contact details
              </p>
            </card_1.CardHeader>
            <card_1.CardContent className="space-y-8 pb-12">
              <div className="flex space-x-4 justify-center">
                <button_1.Button variant={verificationType === "phone" ? "default" : "outline"} onClick={function () { return setVerificationType("phone"); }} className={"flex items-center px-6 py-3 rounded-xl font-semibold transition-all duration-200 ".concat(verificationType === "phone"
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                : "border-2 border-gray-300 hover:border-blue-500")}>
                  <lucide_react_1.Phone className="h-4 w-4 mr-2"/>
                  Phone Number
                </button_1.Button>
                <button_1.Button variant={verificationType === "email" ? "default" : "outline"} onClick={function () { return setVerificationType("email"); }} className={"flex items-center px-6 py-3 rounded-xl font-semibold transition-all duration-200 ".concat(verificationType === "email"
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                : "border-2 border-gray-300 hover:border-blue-500")}>
                  <lucide_react_1.Mail className="h-4 w-4 mr-2"/>
                  Email Address
                </button_1.Button>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-semibold text-gray-800">
                  {verificationType === "phone"
                ? "Phone Number"
                : "Email Address"}{" "}
                  *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    {verificationType === "phone" ? (<lucide_react_1.Phone className="h-5 w-5 text-gray-400"/>) : (<lucide_react_1.Mail className="h-5 w-5 text-gray-400"/>)}
                  </div>
                  <input_1.Input type={verificationType === "phone" ? "tel" : "email"} placeholder={verificationType === "phone"
                ? "+91 98765 43210"
                : "your@email.com"} value={verificationField} onChange={function (e) { return setVerificationField(e.target.value); }} className="text-lg py-6 pl-12 pr-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"/>
                </div>
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                  Enter the{" "}
                  {verificationType === "phone"
                ? "phone number"
                : "email address"}{" "}
                  used when placing order #{orderNumber}
                </p>
              </div>

              {error && (<div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
                  <div className="flex items-center">
                    <lucide_react_1.AlertCircle className="h-5 w-5 text-red-500 mr-3"/>
                    <p className="text-red-700 font-medium">{error}</p>
                  </div>
                </div>)}

              <div className="flex space-x-4">
                <button_1.Button variant="outline" onClick={function () { return setStep("input"); }} className="flex-1 py-4 border-2 border-gray-300 hover:border-gray-400 rounded-xl font-semibold">
                  ← Back
                </button_1.Button>
                <button_1.Button onClick={handleVerificationSubmit} className="flex-1 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] font-semibold" disabled={isLoading || !verificationField.trim()}>
                  {isLoading ? (<>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Verifying...
                    </>) : (<>
                      <lucide_react_1.Eye className="h-4 w-4 mr-2"/>
                      View Order Details
                      <lucide_react_1.ArrowRight className="h-4 w-4 ml-2"/>
                    </>)}
                </button_1.Button>
              </div>
            </card_1.CardContent>
          </card_1.Card>)}

        {step === "results" && orderData && (<div className="space-y-8">
            {/* Order Status Card with Progress */}
            <card_1.Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm overflow-hidden">
              <div className="bg-gradient-to-r from-green-500 to-teal-600 p-6 text-white">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-3xl font-bold mb-2">
                      Order #{orderData.order_number}
                    </h2>
                    <p className="text-green-100 text-lg">
                      Placed on {formatDate(orderData.created_at)}
                    </p>
                    <p className="text-green-100 mt-1">
                      Customer: {(_a = orderData.customer) === null || _a === void 0 ? void 0 : _a.first_name}{" "}
                      {(_b = orderData.customer) === null || _b === void 0 ? void 0 : _b.last_name}
                    </p>
                  </div>
                  <badge_1.Badge className={"".concat(getStatusColor(orderData.status), " border-2 px-4 py-2 text-sm font-bold shadow-lg")}>
                    <div className="flex items-center">
                      {getStatusIcon(orderData.status)}
                      <span className="ml-2 capitalize">
                        {orderData.status}
                      </span>
                    </div>
                  </badge_1.Badge>
                </div>
              </div>

              <card_1.CardHeader className="pb-4">
                <div className="space-y-6">
                  {/* Progress Bar */}
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm font-semibold text-gray-700">
                        Order Progress
                      </span>
                      <span className="text-sm font-bold text-gray-900">
                        {getProgressPercentage(orderData.status)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div className="bg-gradient-to-r from-green-500 to-teal-600 h-3 rounded-full transition-all duration-1000 ease-out" style={{
                width: "".concat(getProgressPercentage(orderData.status), "%"),
            }}></div>
                    </div>
                  </div>

                  {/* Progress Steps */}
                  <div className="flex justify-between items-center relative">
                    <div className="absolute top-6 left-0 w-full h-0.5 bg-gray-200 z-0"></div>
                    <div className="absolute top-6 left-0 h-0.5 bg-gradient-to-r from-green-500 to-teal-600 z-10 transition-all duration-1000 ease-out" style={{
                width: "".concat(getProgressPercentage(orderData.status), "%"),
            }}></div>

                    {getOrderSteps().map(function (stepItem, index) {
                var isActive = getProgressPercentage(orderData.status) >=
                    (index + 1) * 20;
                var isCurrent = stepItem.key === orderData.status;
                var IconComponent = stepItem.icon;
                return (<div key={stepItem.key} className="flex flex-col items-center relative z-20">
                          <div className={"\n                            w-12 h-12 rounded-full flex items-center justify-center border-4 transition-all duration-300\n                            ".concat(isActive
                        ? "bg-gradient-to-r from-green-500 to-teal-600 border-green-500 text-white shadow-lg"
                        : "bg-white border-gray-300 text-gray-400", "\n                            ").concat(isCurrent ? "ring-4 ring-green-200 scale-110" : "", "\n                          ")}>
                            <IconComponent className="h-5 w-5"/>
                          </div>
                          <span className={"\n                            text-xs font-medium mt-2 text-center max-w-20\n                            ".concat(isActive ? "text-gray-900" : "text-gray-500", "\n                          ")}>
                            {stepItem.label}
                          </span>
                        </div>);
            })}
                  </div>
                </div>
              </card_1.CardHeader>
              <card_1.CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Delivery Info */}
                  {orderData.delivery_date && (<div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 bg-blue-500 rounded-lg p-3 mr-4">
                          <lucide_react_1.Calendar className="h-6 w-6 text-white"/>
                        </div>
                        <div>
                          <h3 className="font-bold text-blue-900 text-lg mb-2">
                            Scheduled Delivery
                          </h3>
                          <p className="text-blue-800 font-semibold">
                            {new Date(orderData.delivery_date).toLocaleDateString("en-IN", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                })}
                          </p>
                          {orderData.delivery_slot && (<p className="text-blue-700 text-sm mt-1">
                              Time Slot: {orderData.delivery_slot}
                            </p>)}
                        </div>
                      </div>
                    </div>)}

                  {/* Tracking Number */}
                  {orderData.tracking_number && (<div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 bg-green-500 rounded-lg p-3 mr-4">
                          <lucide_react_1.Truck className="h-6 w-6 text-white"/>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-green-900 text-lg mb-2">
                            Tracking Number
                          </h3>
                          <div className="flex items-center bg-white rounded-lg p-3 border border-green-200">
                            <p className="text-green-800 font-mono font-bold flex-1">
                              {orderData.tracking_number}
                            </p>
                            <button_1.Button onClick={function () {
                    return copyToClipboard(orderData.tracking_number);
                }} variant="ghost" size="sm" className="ml-2 h-8 w-8 p-0 hover:bg-green-100">
                              {copiedTrackingNumber ? (<lucide_react_1.Check className="h-4 w-4 text-green-600"/>) : (<lucide_react_1.Copy className="h-4 w-4 text-green-600"/>)}
                            </button_1.Button>
                          </div>
                        </div>
                      </div>
                    </div>)}
                </div>

                {/* Delivery Address - Full Width */}
                {orderData.shipping_address && (<div className="bg-gradient-to-br from-gray-50 to-slate-50 border-2 border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 bg-gray-600 rounded-lg p-3 mr-4">
                        <lucide_react_1.MapPin className="h-6 w-6 text-white"/>
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg mb-3">
                          Delivery Address
                        </h3>
                        <div className="space-y-2 text-gray-700">
                          <p className="font-semibold text-gray-900">
                            {orderData.shipping_address.name}
                          </p>
                          <p>{orderData.shipping_address.address_line_1}</p>
                          {orderData.shipping_address.address_line_2 && (<p>{orderData.shipping_address.address_line_2}</p>)}
                          <p className="font-medium">
                            {orderData.shipping_address.city},{" "}
                            {orderData.shipping_address.state}{" "}
                            {orderData.shipping_address.pincode}
                          </p>
                          {orderData.shipping_address.phone && (<p className="flex items-center mt-2">
                              <lucide_react_1.Phone className="h-4 w-4 mr-2 text-gray-500"/>
                              {orderData.shipping_address.phone}
                            </p>)}
                        </div>
                      </div>
                    </div>
                  </div>)}

                {/* Special Instructions */}
                {orderData.special_instructions && (<div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-xl p-6">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 bg-amber-500 rounded-lg p-3 mr-4">
                        <lucide_react_1.AlertCircle className="h-6 w-6 text-white"/>
                      </div>
                      <div>
                        <h3 className="font-bold text-amber-900 text-lg mb-2">
                          Special Instructions
                        </h3>
                        <p className="text-amber-800">
                          {orderData.special_instructions}
                        </p>
                      </div>
                    </div>
                  </div>)}
              </card_1.CardContent>
            </card_1.Card>

            {/* Order Items */}
            <card_1.Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
              <card_1.CardHeader className="bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-t-lg">
                <div className="flex items-center">
                  <div className="bg-white/20 rounded-lg p-2 mr-3">
                    <lucide_react_1.ShoppingBag className="h-6 w-6"/>
                  </div>
                  <card_1.CardTitle className="text-2xl font-bold">
                    Order Items ({orderData.items.length})
                  </card_1.CardTitle>
                </div>
              </card_1.CardHeader>
              <card_1.CardContent className="p-6">
                <div className="space-y-4">
                  {orderData.items.map(function (item, index) { return (<div key={index} className="flex items-center space-x-4 p-6 bg-gradient-to-r from-gray-50 to-slate-50 border-2 border-gray-200 rounded-xl hover:shadow-lg transition-all duration-200">
                      <div className="flex-shrink-0">
                        {item.slug ? (<a href={"/product/".concat(item.slug)} className="block w-24 h-24 bg-gray-100 rounded-xl shadow-lg overflow-hidden border-2 border-gray-300 relative hover:shadow-xl hover:border-gray-400 transition-all duration-200 cursor-pointer" title={"View ".concat(item.product_name)}>
                            {item.image ? (<>
                                <img src={item.image} alt={item.product_name} className="w-full h-full object-cover transition-opacity duration-200" onError={function (e) {
                            var _a;
                            var target = e.currentTarget;
                            var placeholder = (_a = target.parentElement) === null || _a === void 0 ? void 0 : _a.querySelector(".placeholder-fallback");
                            if (placeholder) {
                                target.style.display = "none";
                                placeholder.classList.remove("hidden");
                                placeholder.classList.add("flex");
                            }
                        }} onLoad={function () {
                            return console.log("Image loaded for ".concat(item.product_name, ": ").concat(item.image));
                        }}/>
                                <div className="placeholder-fallback hidden absolute inset-0 w-full h-full items-center justify-center bg-gradient-to-br from-rose-100 to-pink-100">
                                  <lucide_react_1.Package className="h-10 w-10 text-rose-400"/>
                                </div>
                              </>) : (<div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-rose-100 to-pink-100">
                                <lucide_react_1.Package className="h-10 w-10 text-rose-400"/>
                              </div>)}
                          </a>) : (<div className="w-24 h-24 bg-gray-100 rounded-xl shadow-lg overflow-hidden border-2 border-gray-300 relative">
                            {item.image ? (<>
                                <img src={item.image} alt={item.product_name} className="w-full h-full object-cover transition-opacity duration-200" onError={function (e) {
                            var _a;
                            var target = e.currentTarget;
                            var placeholder = (_a = target.parentElement) === null || _a === void 0 ? void 0 : _a.querySelector(".placeholder-fallback");
                            if (placeholder) {
                                target.style.display = "none";
                                placeholder.classList.remove("hidden");
                                placeholder.classList.add("flex");
                            }
                        }}/>
                                <div className="placeholder-fallback hidden absolute inset-0 w-full h-full items-center justify-center bg-gradient-to-br from-rose-100 to-pink-100">
                                  <lucide_react_1.Package className="h-10 w-10 text-rose-400"/>
                                </div>
                              </>) : (<div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-rose-100 to-pink-100">
                                <lucide_react_1.Package className="h-10 w-10 text-rose-400"/>
                              </div>)}
                          </div>)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 text-lg mb-1 truncate">
                          {item.product_name}
                        </h3>
                        {item.variant_name && (<p className="text-sm text-gray-600 mb-1">
                            <span className="font-medium">Variant:</span>{" "}
                            {item.variant_name}
                          </p>)}
                        <div className="flex items-center text-sm text-gray-600">
                          <lucide_react_1.Package className="h-4 w-4 mr-1"/>
                          <span className="font-medium">Quantity:</span>
                          <span className="ml-1 bg-gray-200 px-2 py-1 rounded-full font-bold text-gray-800">
                            {item.quantity}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-xl text-gray-900">
                          {formatPrice(item.total_price || item.unit_price * item.quantity)}
                        </p>
                        <p className="text-sm text-gray-600">
                          {formatPrice(item.unit_price)} each
                        </p>
                      </div>
                    </div>); })}
                </div>

                {/* Order Total */}
                <div className="bg-gradient-to-r from-slate-100 to-gray-100 rounded-xl p-6 mt-6">
                  <div className="space-y-3">
                    <div className="flex justify-between text-gray-700">
                      <span className="font-medium">Subtotal</span>
                      <span className="font-semibold">
                        {formatPrice(orderData.total_amount - orderData.shipping_amount)}
                      </span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                      <span className="font-medium">Shipping</span>
                      <span className="font-semibold">
                        {orderData.shipping_amount === 0
                ? "FREE"
                : formatPrice(orderData.shipping_amount)}
                      </span>
                    </div>
                    <div className="border-t-2 border-gray-300 pt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xl font-bold text-gray-900">
                          Total Amount
                        </span>
                        <span className="text-2xl font-bold text-green-600">
                          {formatPrice(orderData.total_amount)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </card_1.CardContent>
            </card_1.Card>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button_1.Button onClick={resetForm} variant="outline" className="py-4 border-2 border-gray-300 hover:border-gray-400 rounded-xl font-semibold text-gray-700 hover:text-gray-900 transition-all duration-200">
                <lucide_react_1.Search className="h-5 w-5 mr-2"/>
                Track Another Order
              </button_1.Button>
              <button_1.Button onClick={function () { return window.print(); }} variant="outline" className="py-4 border-2 border-blue-300 hover:border-blue-400 rounded-xl font-semibold text-blue-700 hover:text-blue-900 transition-all duration-200">
                <lucide_react_1.Package className="h-5 w-5 mr-2"/>
                Print Details
              </button_1.Button>
              <button_1.Button onClick={function () { return (window.location.href = "/"); }} className="py-4 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] font-semibold">
                <lucide_react_1.ShoppingBag className="h-5 w-5 mr-2"/>
                Continue Shopping
              </button_1.Button>
            </div>
          </div>)}
      </div>
    </div>);
}
