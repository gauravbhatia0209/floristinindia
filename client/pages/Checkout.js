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
exports.default = Checkout;
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var lucide_react_1 = require("lucide-react");
var button_1 = require("@/components/ui/button");
var card_1 = require("@/components/ui/card");
var input_1 = require("@/components/ui/input");
var label_1 = require("@/components/ui/label");
var textarea_1 = require("@/components/ui/textarea");
var checkbox_1 = require("@/components/ui/checkbox");
var radio_group_1 = require("@/components/ui/radio-group");
var alert_1 = require("@/components/ui/alert");
var select_1 = require("@/components/ui/select");
var badge_1 = require("@/components/ui/badge");
var supabase_1 = require("@/lib/supabase");
var useCart_1 = require("@/hooks/useCart");
var shipping_service_1 = require("@/lib/shipping-service");
var GoogleAnalytics_1 = require("@/components/GoogleAnalytics");
var FacebookPixel_1 = require("@/components/FacebookPixel");
var supabase_storage_1 = require("@/lib/supabase-storage");
function ShippingMethodCard(_a) {
    var pincode = _a.pincode, orderValue = _a.orderValue, selectedMethodId = _a.selectedMethodId, onMethodSelect = _a.onMethodSelect;
    var _b = (0, react_1.useState)([]), availableMethods = _b[0], setAvailableMethods = _b[1];
    var _c = (0, react_1.useState)(false), isLoading = _c[0], setIsLoading = _c[1];
    var _d = (0, react_1.useState)(""), error = _d[0], setError = _d[1];
    (0, react_1.useEffect)(function () {
        if (pincode && pincode.length >= 6) {
            fetchShippingMethods();
        }
        else {
            setAvailableMethods([]);
            onMethodSelect(null, 0);
        }
    }, [pincode]);
    function fetchShippingMethods() {
        return __awaiter(this, void 0, void 0, function () {
            var methods_1, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, 3, 4]);
                        setIsLoading(true);
                        setError("");
                        return [4 /*yield*/, (0, shipping_service_1.getAvailableShippingMethods)(pincode)];
                    case 1:
                        methods_1 = _a.sent();
                        if (methods_1.length === 0) {
                            setError("Sorry, delivery is not available to this pincode.");
                            setAvailableMethods([]);
                            onMethodSelect(null, 0);
                            return [2 /*return*/];
                        }
                        setAvailableMethods(methods_1);
                        // Auto-select first method only if no method is currently selected
                        if (!selectedMethodId && methods_1.length > 0) {
                            setTimeout(function () {
                                var firstMethod = methods_1[0];
                                var cost = (0, shipping_service_1.calculateShippingCost)(firstMethod, orderValue);
                                onMethodSelect(firstMethod, cost);
                            }, 0);
                        }
                        return [3 /*break*/, 4];
                    case 2:
                        error_1 = _a.sent();
                        console.error("Error fetching shipping methods:", error_1);
                        setError("Failed to load shipping options. Please try again.");
                        return [3 /*break*/, 4];
                    case 3:
                        setIsLoading(false);
                        return [7 /*endfinally*/];
                    case 4: return [2 /*return*/];
                }
            });
        });
    }
    function handleMethodChange(methodId) {
        var method = availableMethods.find(function (m) { return m.config_id === methodId; });
        if (method) {
            var cost = (0, shipping_service_1.calculateShippingCost)(method, orderValue);
            onMethodSelect(method, cost);
        }
    }
    if (!pincode || pincode.length < 6) {
        return (<card_1.Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
        <card_1.CardContent className="p-6">
          <alert_1.Alert>
            <lucide_react_1.Info className="h-4 w-4"/>
            <alert_1.AlertDescription>
              Enter your pincode to see available delivery options.
            </alert_1.AlertDescription>
          </alert_1.Alert>
        </card_1.CardContent>
      </card_1.Card>);
    }
    if (isLoading) {
        return (<card_1.Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
        <card_1.CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            <div className="h-16 bg-gray-200 rounded"></div>
            <div className="h-16 bg-gray-200 rounded"></div>
          </div>
        </card_1.CardContent>
      </card_1.Card>);
    }
    if (error) {
        return (<card_1.Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
        <card_1.CardContent className="p-6">
          <alert_1.Alert variant="destructive">
            <lucide_react_1.MapPin className="h-4 w-4"/>
            <alert_1.AlertDescription>{error}</alert_1.AlertDescription>
          </alert_1.Alert>
        </card_1.CardContent>
      </card_1.Card>);
    }
    return (<card_1.Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
      <card_1.CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-t-lg">
        <card_1.CardTitle className="flex items-center gap-3 text-xl">
          <div className="bg-white/20 rounded-lg p-2">
            <lucide_react_1.Truck className="w-6 h-6"/>
          </div>
          Delivery Options
          <badge_1.Badge variant="secondary" className="bg-white/20 text-white border-white/30">
            {availableMethods.length} available
          </badge_1.Badge>
        </card_1.CardTitle>
      </card_1.CardHeader>
      <card_1.CardContent className="p-6">
        <div className="space-y-4">
          <radio_group_1.RadioGroup value={selectedMethodId || ""} onValueChange={handleMethodChange} className="space-y-3">
            {availableMethods.map(function (method) {
            var shippingCost = (0, shipping_service_1.calculateShippingCost)(method, orderValue);
            var isFreeShipping = shippingCost === 0 && method.price > 0;
            var isSelected = selectedMethodId === method.config_id;
            return (<div key={method.config_id} className={"border rounded-lg p-4 transition-all ".concat(isSelected
                    ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
                    : "border-gray-200 hover:border-gray-300")}>
                  <div className="flex items-start gap-3">
                    <radio_group_1.RadioGroupItem value={method.config_id} id={method.config_id} className="mt-1"/>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <label_1.Label htmlFor={method.config_id} className="font-medium cursor-pointer flex-1">
                            {method.name}
                          </label_1.Label>
                          <badge_1.Badge variant="outline" className="text-xs">
                            {method.type.replace("_", " ")}
                          </badge_1.Badge>
                          {isSelected && (<lucide_react_1.CheckCircle className="h-4 w-4 text-green-600"/>)}
                        </div>
                        <div className="text-right">
                          {isFreeShipping ? (<div className="space-y-1">
                              <span className="text-green-600 font-semibold text-sm">
                                FREE
                              </span>
                              <div className="text-xs text-muted-foreground line-through">
                                ₹{method.price}
                              </div>
                            </div>) : (<span className="font-semibold">
                              {shippingCost === 0 ? "FREE" : "\u20B9".concat(shippingCost)}
                            </span>)}
                        </div>
                      </div>

                      {method.description && (<p className="text-sm text-muted-foreground">
                          {method.description}
                        </p>)}

                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <lucide_react_1.Clock className="h-3 w-3"/>
                          {method.delivery_time}
                        </span>
                        <span className="flex items-center gap-1">
                          <lucide_react_1.MapPin className="h-3 w-3"/>
                          {method.zone_name}
                        </span>
                        {method.free_shipping_minimum &&
                    orderValue < method.free_shipping_minimum && (<span className="text-green-600 text-xs">
                              Free above ₹{method.free_shipping_minimum}
                            </span>)}
                      </div>

                      {method.rules && (<alert_1.Alert className="mt-2">
                          <lucide_react_1.Info className="h-4 w-4"/>
                          <alert_1.AlertDescription className="text-xs">
                            {method.rules}
                          </alert_1.AlertDescription>
                        </alert_1.Alert>)}
                    </div>
                  </div>
                </div>);
        })}
          </radio_group_1.RadioGroup>

          <div className="pt-4 border-t">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">
                Delivering to pincode: {pincode}
              </span>
              {selectedMethodId && (<span className="font-medium">
                  Total delivery charges:{" "}
                  {(function () {
                var method = availableMethods.find(function (m) { return m.config_id === selectedMethodId; });
                if (method) {
                    var cost = (0, shipping_service_1.calculateShippingCost)(method, orderValue);
                    return cost === 0 ? "FREE" : "\u20B9".concat(cost);
                }
                return "₹0";
            })()}
                </span>)}
            </div>
          </div>
        </div>
      </card_1.CardContent>
    </card_1.Card>);
}
function Checkout() {
    var navigate = (0, react_router_dom_1.useNavigate)();
    var _a = (0, useCart_1.useCart)(), items = _a.items, total = _a.total, clearCart = _a.clearCart;
    var _b = (0, react_1.useState)({
        fullName: "",
        email: "",
        phone: "",
        phoneCountryCode: "+91",
        receiverName: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        pincode: "",
        receiverPhone: "",
        receiverPhoneCountryCode: "+91",
        alternatePhone: "",
        orderMessage: "",
        deliveryDate: "",
        deliverySlot: "",
        specialInstructions: "",
        paymentMethod: "",
        acceptTerms: false,
    }), form = _b[0], setForm = _b[1];
    var _c = (0, react_1.useState)(null), selectedShippingMethod = _c[0], setSelectedShippingMethod = _c[1];
    var _d = (0, react_1.useState)(0), shippingCost = _d[0], setShippingCost = _d[1];
    var _e = (0, react_1.useState)(""), couponCode = _e[0], setCouponCode = _e[1];
    var _f = (0, react_1.useState)(null), appliedCoupon = _f[0], setAppliedCoupon = _f[1];
    var _g = (0, react_1.useState)(false), isValidatingCoupon = _g[0], setIsValidatingCoupon = _g[1];
    var _h = (0, react_1.useState)(false), isSubmitting = _h[0], setIsSubmitting = _h[1];
    var _j = (0, react_1.useState)({}), errors = _j[0], setErrors = _j[1];
    var _k = (0, react_1.useState)(18), gstRate = _k[0], setGstRate = _k[1]; // Default fallback
    var trackPurchase = (0, GoogleAnalytics_1.useGoogleAnalytics)().trackPurchase;
    var _l = (0, FacebookPixel_1.useFacebookPixel)(), trackFBPurchase = _l.trackPurchase, trackInitiateCheckout = _l.trackInitiateCheckout;
    // Function to generate sequential order number
    function generateOrderNumber() {
        return __awaiter(this, void 0, void 0, function () {
            var latestOrder, nextNumber, numberPart, latestNumber, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, supabase_1.supabase
                                .from("orders")
                                .select("order_number")
                                .like("order_number", "FII%")
                                .order("created_at", { ascending: false })
                                .limit(1)
                                .single()];
                    case 1:
                        latestOrder = (_a.sent()).data;
                        nextNumber = 1;
                        if (latestOrder === null || latestOrder === void 0 ? void 0 : latestOrder.order_number) {
                            numberPart = latestOrder.order_number.replace("FII", "");
                            latestNumber = parseInt(numberPart);
                            if (!isNaN(latestNumber)) {
                                nextNumber = latestNumber + 1;
                            }
                        }
                        // Format with leading zeros (5 digits)
                        return [2 /*return*/, "FII".concat(nextNumber.toString().padStart(5, "0"))];
                    case 2:
                        error_2 = _a.sent();
                        console.error("Error generating order number:", error_2);
                        // Fallback to timestamp-based number if there's an error
                        return [2 /*return*/, "FII".concat(Date.now().toString().slice(-5))];
                    case 3: return [2 /*return*/];
                }
            });
        });
    }
    (0, react_1.useEffect)(function () {
        if (items.length === 0) {
            navigate("/cart");
        }
        fetchGstRate();
        // Track checkout initiation for Facebook Pixel
        if (items.length > 0) {
            var checkoutValue = items.reduce(function (sum, item) { return sum + item.product.price * item.quantity; }, 0);
            trackInitiateCheckout(checkoutValue, "INR", items.length);
        }
    }, [items, navigate]);
    function fetchGstRate() {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error, rate, error_3;
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
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error) {
                            console.error("Failed to fetch GST rate:", error);
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
                        error_3 = _b.sent();
                        console.error("Error fetching GST rate:", error_3);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    }
    function uploadOrderFiles(orderNumber) {
        return __awaiter(this, void 0, void 0, function () {
            var uploadedFiles, _i, items_1, item, result, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        uploadedFiles = [];
                        _i = 0, items_1 = items;
                        _a.label = 1;
                    case 1:
                        if (!(_i < items_1.length)) return [3 /*break*/, 6];
                        item = items_1[_i];
                        if (!item.uploaded_file) return [3 /*break*/, 5];
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        console.log("Uploading file for product ".concat(item.product.name, "..."));
                        return [4 /*yield*/, (0, supabase_storage_1.uploadImageToSupabase)(item.uploaded_file, "order-files/".concat(orderNumber), 10)];
                    case 3:
                        result = _a.sent();
                        if (result.success && result.publicUrl) {
                            uploadedFiles.push({
                                product_id: item.product_id,
                                product_name: item.product.name,
                                file_name: item.uploaded_file.name,
                                file_size: item.uploaded_file.size,
                                file_type: item.uploaded_file.type,
                                file_url: result.publicUrl,
                                status: "uploaded",
                            });
                        }
                        else {
                            console.error("Failed to upload file for ".concat(item.product.name, ":"), result.error);
                            uploadedFiles.push({
                                product_id: item.product_id,
                                product_name: item.product.name,
                                file_name: item.uploaded_file.name,
                                file_size: item.uploaded_file.size,
                                file_type: item.uploaded_file.type,
                                file_url: null,
                                status: "upload-failed",
                                error: result.error,
                            });
                        }
                        return [3 /*break*/, 5];
                    case 4:
                        error_4 = _a.sent();
                        console.error("Error uploading file for ".concat(item.product.name, ":"), error_4);
                        uploadedFiles.push({
                            product_id: item.product_id,
                            product_name: item.product.name,
                            file_name: item.uploaded_file.name,
                            file_size: item.uploaded_file.size,
                            file_type: item.uploaded_file.type,
                            file_url: null,
                            status: "upload-error",
                            error: error_4.message,
                        });
                        return [3 /*break*/, 5];
                    case 5:
                        _i++;
                        return [3 /*break*/, 1];
                    case 6: return [2 /*return*/, uploadedFiles];
                }
            });
        });
    }
    function handleShippingMethodSelect(method, cost) {
        setSelectedShippingMethod(method);
        setShippingCost(cost);
        // Clear delivery slot if the new method doesn't require time slots
        if (method && !method.time_slot_required) {
            setForm(function (prev) { return (__assign(__assign({}, prev), { deliverySlot: "" })); });
        }
        // Clear any shipping-related errors
        if (errors.pincode || errors.shipping) {
            setErrors(__assign(__assign({}, errors), { pincode: "", shipping: "" }));
        }
    }
    function validateCoupon() {
        return __awaiter(this, void 0, void 0, function () {
            var coupon, now, expiresAt, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!couponCode.trim())
                            return [2 /*return*/];
                        setIsValidatingCoupon(true);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, 4, 5]);
                        return [4 /*yield*/, supabase_1.supabase
                                .from("coupons")
                                .select("*")
                                .eq("code", couponCode.toUpperCase())
                                .eq("is_active", true)
                                .single()];
                    case 2:
                        coupon = (_a.sent()).data;
                        if (coupon) {
                            now = new Date();
                            expiresAt = coupon.expires_at
                                ? new Date(coupon.expires_at)
                                : null;
                            if (expiresAt && now > expiresAt) {
                                setErrors({ coupon: "This coupon has expired" });
                                return [2 /*return*/];
                            }
                            if (coupon.minimum_order_amount &&
                                total < coupon.minimum_order_amount) {
                                setErrors({
                                    coupon: "Minimum order amount is \u20B9".concat(coupon.minimum_order_amount),
                                });
                                return [2 /*return*/];
                            }
                            setAppliedCoupon(coupon);
                            setErrors(__assign(__assign({}, errors), { coupon: "" }));
                        }
                        else {
                            setErrors({ coupon: "Invalid coupon code" });
                        }
                        return [3 /*break*/, 5];
                    case 3:
                        error_5 = _a.sent();
                        setErrors({ coupon: "Invalid coupon code" });
                        return [3 /*break*/, 5];
                    case 4:
                        setIsValidatingCoupon(false);
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        });
    }
    function calculateDiscount() {
        if (!appliedCoupon)
            return 0;
        var discount = 0;
        if (appliedCoupon.discount_type === "flat") {
            discount = appliedCoupon.discount_value;
        }
        else {
            discount = (total * appliedCoupon.discount_value) / 100;
        }
        if (appliedCoupon.maximum_discount_amount) {
            discount = Math.min(discount, appliedCoupon.maximum_discount_amount);
        }
        return discount;
    }
    function calculateTotal() {
        var subtotal = total;
        var shipping = shippingCost;
        var discount = calculateDiscount();
        var tax = Math.round((subtotal - discount) * (gstRate / 100)); // Dynamic GST
        return {
            subtotal: subtotal,
            shipping: shipping,
            discount: discount,
            tax: tax,
            total: subtotal + shipping + tax - discount,
        };
    }
    function handleSubmit(e) {
        return __awaiter(this, void 0, void 0, function () {
            var totals_1, orderNumber, uploadedFiles_1, nameParts, firstName, lastName, _a, customer, customerError, _b, order, orderError, orderItems, fbContentIds, error_6;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        e.preventDefault();
                        if (!selectedShippingMethod) {
                            setErrors({ shipping: "Please select a shipping method" });
                            return [2 /*return*/];
                        }
                        if (!form.deliveryDate) {
                            setErrors({ deliveryDate: "Please select a delivery date" });
                            return [2 /*return*/];
                        }
                        if (!form.acceptTerms) {
                            setErrors({ terms: "Please accept the Terms & Conditions to continue" });
                            return [2 /*return*/];
                        }
                        setIsSubmitting(true);
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 8, 9, 10]);
                        totals_1 = calculateTotal();
                        return [4 /*yield*/, generateOrderNumber()];
                    case 2:
                        orderNumber = _c.sent();
                        // Upload files first
                        console.log("Uploading order files...");
                        return [4 /*yield*/, uploadOrderFiles(orderNumber)];
                    case 3:
                        uploadedFiles_1 = _c.sent();
                        nameParts = form.fullName.trim().split(" ");
                        firstName = nameParts[0] || "";
                        lastName = nameParts.slice(1).join(" ") || "";
                        return [4 /*yield*/, supabase_1.supabase
                                .from("customers")
                                .upsert({
                                email: form.email,
                                first_name: firstName,
                                last_name: lastName,
                                phone: "".concat(form.phoneCountryCode).concat(form.phone),
                                addresses: [
                                    {
                                        name: form.receiverName,
                                        line1: form.addressLine1,
                                        line2: form.addressLine2,
                                        city: form.city,
                                        state: form.state,
                                        pincode: form.pincode,
                                        phone: "".concat(form.receiverPhoneCountryCode).concat(form.receiverPhone),
                                        type: "shipping",
                                    },
                                ],
                            }, { onConflict: "email" })
                                .select()
                                .single()];
                    case 4:
                        _a = _c.sent(), customer = _a.data, customerError = _a.error;
                        if (customerError)
                            throw customerError;
                        return [4 /*yield*/, supabase_1.supabase
                                .from("orders")
                                .insert({
                                order_number: orderNumber,
                                customer_id: customer.id,
                                status: "pending",
                                total_amount: totals_1.total,
                                shipping_amount: totals_1.shipping,
                                discount_amount: totals_1.discount,
                                tax_amount: totals_1.tax,
                                items: items.map(function (item) {
                                    var _a, _b, _c, _d, _e;
                                    var uploadedFileData = uploadedFiles_1.find(function (f) { return f.product_id === item.product_id; });
                                    return {
                                        product_id: item.product_id,
                                        product_name: item.product.name,
                                        variant_id: item.variant_id,
                                        variant_name: (_a = item.variant) === null || _a === void 0 ? void 0 : _a.name,
                                        quantity: item.quantity,
                                        unit_price: ((_b = item.variant) === null || _b === void 0 ? void 0 : _b.sale_price) ||
                                            ((_c = item.variant) === null || _c === void 0 ? void 0 : _c.price) ||
                                            item.product.sale_price ||
                                            item.product.price,
                                        total_price: (((_d = item.variant) === null || _d === void 0 ? void 0 : _d.sale_price) ||
                                            ((_e = item.variant) === null || _e === void 0 ? void 0 : _e.price) ||
                                            item.product.sale_price ||
                                            item.product.price) * item.quantity,
                                        uploaded_file_url: (uploadedFileData === null || uploadedFileData === void 0 ? void 0 : uploadedFileData.file_url) || null,
                                        uploaded_file_name: (uploadedFileData === null || uploadedFileData === void 0 ? void 0 : uploadedFileData.file_name) || null,
                                        uploaded_file_size: (uploadedFileData === null || uploadedFileData === void 0 ? void 0 : uploadedFileData.file_size) || null,
                                        uploaded_file_type: (uploadedFileData === null || uploadedFileData === void 0 ? void 0 : uploadedFileData.file_type) || null,
                                        upload_status: (uploadedFileData === null || uploadedFileData === void 0 ? void 0 : uploadedFileData.status) || null,
                                    };
                                }),
                                shipping_address: {
                                    name: form.receiverName,
                                    line1: form.addressLine1,
                                    line2: form.addressLine2,
                                    city: form.city,
                                    state: form.state,
                                    pincode: form.pincode,
                                    phone: "".concat(form.receiverPhoneCountryCode).concat(form.receiverPhone),
                                    alternate_phone: form.alternatePhone,
                                },
                                billing_address: {
                                    name: form.fullName,
                                    line1: form.addressLine1,
                                    line2: form.addressLine2,
                                    city: form.city,
                                    state: form.state,
                                    pincode: form.pincode,
                                    phone: "".concat(form.phoneCountryCode).concat(form.phone),
                                    alternate_phone: form.alternatePhone,
                                },
                                delivery_date: form.deliveryDate || null,
                                delivery_slot: form.deliverySlot || null,
                                special_instructions: form.specialInstructions || null,
                                customer_message: form.orderMessage || null,
                                receiver_name: form.receiverName || null,
                                receiver_phone: "".concat(form.receiverPhoneCountryCode).concat(form.receiverPhone) || null,
                                alternate_phone: form.alternatePhone || null,
                                delivery_instructions: form.specialInstructions || null,
                                uploaded_files: uploadedFiles_1,
                                payment_method: form.paymentMethod,
                                payment_status: "pending",
                                coupon_code: (appliedCoupon === null || appliedCoupon === void 0 ? void 0 : appliedCoupon.code) || null,
                            })
                                .select()
                                .single()];
                    case 5:
                        _b = _c.sent(), order = _b.data, orderError = _b.error;
                        if (orderError)
                            throw orderError;
                        if (!appliedCoupon) return [3 /*break*/, 7];
                        return [4 /*yield*/, supabase_1.supabase
                                .from("coupons")
                                .update({ usage_count: appliedCoupon.usage_count + 1 })
                                .eq("id", appliedCoupon.id)];
                    case 6:
                        _c.sent();
                        _c.label = 7;
                    case 7:
                        orderItems = items.map(function (item) { return ({
                            item_id: item.product.id,
                            item_name: item.product.name,
                            category: item.product.category_name,
                            quantity: item.quantity,
                            price: item.product.price,
                        }); });
                        trackPurchase(orderNumber, totals_1.total, orderItems);
                        fbContentIds = items.map(function (item) { return item.product.id; });
                        trackFBPurchase(totals_1.total, "INR", fbContentIds, items.length);
                        // Clear cart
                        clearCart();
                        // Redirect to order confirmation
                        navigate("/order-confirmation/".concat(order.id));
                        return [3 /*break*/, 10];
                    case 8:
                        error_6 = _c.sent();
                        console.error("Failed to create order:", error_6);
                        setErrors({ submit: "Failed to create order. Please try again." });
                        return [3 /*break*/, 10];
                    case 9:
                        setIsSubmitting(false);
                        return [7 /*endfinally*/];
                    case 10: return [2 /*return*/];
                }
            });
        });
    }
    var totals = calculateTotal();
    if (items.length === 0) {
        return null;
    }
    return (<div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50">
      <div className="container py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Secure Checkout
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Complete your order details below for fast and secure delivery
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* 1. Customer Information */}
                <card_1.Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                  <card_1.CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
                    <card_1.CardTitle className="flex items-center gap-3 text-xl">
                      <div className="bg-white/20 rounded-lg p-2">
                        <lucide_react_1.User className="w-6 h-6"/>
                      </div>
                      Customer Information
                    </card_1.CardTitle>
                  </card_1.CardHeader>
                  <card_1.CardContent className="p-6 space-y-6">
                    <div>
                      <label_1.Label htmlFor="fullName" className="text-sm font-semibold text-gray-700 mb-2 block">
                        Full Name *
                      </label_1.Label>
                      <input_1.Input id="fullName" placeholder="John Doe" value={form.fullName} onChange={function (e) {
            return setForm(__assign(__assign({}, form), { fullName: e.target.value }));
        }} className="py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500" required/>
                    </div>

                    <div>
                      <label_1.Label htmlFor="email" className="text-sm font-semibold text-gray-700 mb-2 block">
                        Email Address *
                      </label_1.Label>
                      <div className="relative">
                        <lucide_react_1.Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"/>
                        <input_1.Input id="email" type="email" placeholder="john@example.com" value={form.email} onChange={function (e) {
            return setForm(__assign(__assign({}, form), { email: e.target.value }));
        }} className="pl-11 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500" required/>
                      </div>
                    </div>

                    <div>
                      <label_1.Label htmlFor="phone" className="text-sm font-semibold text-gray-700 mb-2 block">
                        Phone Number *
                      </label_1.Label>
                      <div className="flex gap-3">
                        <select_1.Select value={form.phoneCountryCode} onValueChange={function (value) {
            return setForm(__assign(__assign({}, form), { phoneCountryCode: value }));
        }}>
                          <select_1.SelectTrigger className="w-24 py-3 border-2 border-gray-200 rounded-xl">
                            <select_1.SelectValue />
                          </select_1.SelectTrigger>
                          <select_1.SelectContent>
                            <select_1.SelectItem value="+91">+91</select_1.SelectItem>
                            <select_1.SelectItem value="+1">+1</select_1.SelectItem>
                            <select_1.SelectItem value="+44">+44</select_1.SelectItem>
                            <select_1.SelectItem value="+971">+971</select_1.SelectItem>
                            <select_1.SelectItem value="+65">+65</select_1.SelectItem>
                          </select_1.SelectContent>
                        </select_1.Select>
                        <div className="relative flex-1">
                          <lucide_react_1.Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"/>
                          <input_1.Input id="phone" type="tel" placeholder="9876543210" value={form.phone} onChange={function (e) {
            return setForm(__assign(__assign({}, form), { phone: e.target.value }));
        }} className="pl-11 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500" required/>
                        </div>
                      </div>
                    </div>
                  </card_1.CardContent>
                </card_1.Card>

                {/* 2. Delivery Address */}
                <card_1.Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                  <card_1.CardHeader className="bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-t-lg">
                    <card_1.CardTitle className="flex items-center gap-3 text-xl">
                      <div className="bg-white/20 rounded-lg p-2">
                        <lucide_react_1.MapPin className="w-6 h-6"/>
                      </div>
                      Delivery Address
                    </card_1.CardTitle>
                  </card_1.CardHeader>
                  <card_1.CardContent className="p-6 space-y-6">
                    <div>
                      <label_1.Label htmlFor="receiverName" className="text-sm font-semibold text-gray-700 mb-2 block">
                        Receiver's Name *
                      </label_1.Label>
                      <input_1.Input id="receiverName" placeholder="Name of person receiving the order" value={form.receiverName} onChange={function (e) {
            return setForm(__assign(__assign({}, form), { receiverName: e.target.value }));
        }} className="py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-green-500" required/>
                    </div>

                    <div>
                      <label_1.Label htmlFor="addressLine1" className="text-sm font-semibold text-gray-700 mb-2 block">
                        Address Line 1 *
                      </label_1.Label>
                      <input_1.Input id="addressLine1" placeholder="House/Flat No., Building Name" value={form.addressLine1} onChange={function (e) {
            return setForm(__assign(__assign({}, form), { addressLine1: e.target.value }));
        }} className="py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-green-500" required/>
                    </div>

                    <div>
                      <label_1.Label htmlFor="addressLine2" className="text-sm font-semibold text-gray-700 mb-2 block">
                        Address Line 2 (Optional)
                      </label_1.Label>
                      <input_1.Input id="addressLine2" placeholder="Street Name, Area, Landmark" value={form.addressLine2} onChange={function (e) {
            return setForm(__assign(__assign({}, form), { addressLine2: e.target.value }));
        }} className="py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-green-500"/>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label_1.Label htmlFor="city" className="text-sm font-semibold text-gray-700 mb-2 block">
                          City *
                        </label_1.Label>
                        <input_1.Input id="city" placeholder="Mumbai" value={form.city} onChange={function (e) {
            return setForm(__assign(__assign({}, form), { city: e.target.value }));
        }} className="py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-green-500" required/>
                      </div>
                      <div>
                        <label_1.Label htmlFor="state" className="text-sm font-semibold text-gray-700 mb-2 block">
                          State *
                        </label_1.Label>
                        <input_1.Input id="state" placeholder="Maharashtra" value={form.state} onChange={function (e) {
            return setForm(__assign(__assign({}, form), { state: e.target.value }));
        }} className="py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-green-500" required/>
                      </div>
                    </div>

                    <div>
                      <label_1.Label htmlFor="pincode" className="text-sm font-semibold text-gray-700 mb-2 block">
                        Pincode *
                      </label_1.Label>
                      <input_1.Input id="pincode" placeholder="400001" value={form.pincode} onChange={function (e) {
            return setForm(__assign(__assign({}, form), { pincode: e.target.value }));
        }} maxLength={6} className="py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-green-500" required/>
                      {errors.pincode && (<p className="text-red-600 text-sm mt-2 bg-red-50 p-2 rounded">
                          {errors.pincode}
                        </p>)}
                    </div>

                    <div>
                      <label_1.Label htmlFor="receiverPhone" className="text-sm font-semibold text-gray-700 mb-2 block">
                        Receiver's Phone Number *
                      </label_1.Label>
                      <div className="flex gap-3">
                        <select_1.Select value={form.receiverPhoneCountryCode} onValueChange={function (value) {
            return setForm(__assign(__assign({}, form), { receiverPhoneCountryCode: value }));
        }}>
                          <select_1.SelectTrigger className="w-24 py-3 border-2 border-gray-200 rounded-xl">
                            <select_1.SelectValue />
                          </select_1.SelectTrigger>
                          <select_1.SelectContent>
                            <select_1.SelectItem value="+91">+91</select_1.SelectItem>
                            <select_1.SelectItem value="+1">+1</select_1.SelectItem>
                            <select_1.SelectItem value="+44">+44</select_1.SelectItem>
                            <select_1.SelectItem value="+971">+971</select_1.SelectItem>
                            <select_1.SelectItem value="+65">+65</select_1.SelectItem>
                          </select_1.SelectContent>
                        </select_1.Select>
                        <div className="relative flex-1">
                          <lucide_react_1.Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"/>
                          <input_1.Input id="receiverPhone" type="tel" placeholder="9876543210" value={form.receiverPhone} onChange={function (e) {
            return setForm(__assign(__assign({}, form), { receiverPhone: e.target.value }));
        }} className="pl-11 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-green-500" required/>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label_1.Label htmlFor="alternatePhone" className="text-sm font-semibold text-gray-700 mb-2 block">
                        Alternate Phone No.
                      </label_1.Label>
                      <input_1.Input id="alternatePhone" type="tel" placeholder="9876543210" value={form.alternatePhone} onChange={function (e) {
            return setForm(__assign(__assign({}, form), { alternatePhone: e.target.value }));
        }} className="py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-green-500"/>
                    </div>
                  </card_1.CardContent>
                </card_1.Card>

                {/* 3. Message with Order */}
                <card_1.Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                  <card_1.CardHeader className="bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-t-lg">
                    <card_1.CardTitle className="flex items-center gap-3 text-xl">
                      <div className="bg-white/20 rounded-lg p-2">
                        <lucide_react_1.MessageSquare className="w-6 h-6"/>
                      </div>
                      Message with Order
                    </card_1.CardTitle>
                  </card_1.CardHeader>
                  <card_1.CardContent className="p-6">
                    <div>
                      <label_1.Label htmlFor="orderMessage" className="text-sm font-semibold text-gray-700 mb-2 block">
                        Special Message (Optional)
                      </label_1.Label>
                      <textarea_1.Textarea id="orderMessage" placeholder="Add a personal message, special instructions, or occasion details..." value={form.orderMessage} onChange={function (e) {
            return setForm(__assign(__assign({}, form), { orderMessage: e.target.value }));
        }} rows={4} className="text-lg border-2 border-gray-200 rounded-xl focus:border-purple-500 resize-none"/>
                      <p className="text-sm text-gray-500 mt-2">
                        This message will be included with your order for
                        special occasions or delivery instructions.
                      </p>
                    </div>
                  </card_1.CardContent>
                </card_1.Card>

                {/* 4. Shipping Methods */}
                <ShippingMethodCard pincode={form.pincode} orderValue={total} selectedMethodId={(selectedShippingMethod === null || selectedShippingMethod === void 0 ? void 0 : selectedShippingMethod.config_id) || null} onMethodSelect={handleShippingMethodSelect}/>

                {/* 5. Delivery Schedule */}
                {selectedShippingMethod && (<card_1.Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                    <card_1.CardHeader className="bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-t-lg">
                      <card_1.CardTitle className="flex items-center gap-3 text-xl">
                        <div className="bg-white/20 rounded-lg p-2">
                          <lucide_react_1.Truck className="w-6 h-6"/>
                        </div>
                        Delivery Schedule
                      </card_1.CardTitle>
                    </card_1.CardHeader>
                    <card_1.CardContent className="p-6 space-y-6">
                      <div className={"grid gap-4 ".concat((selectedShippingMethod === null || selectedShippingMethod === void 0 ? void 0 : selectedShippingMethod.time_slot_required) ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1")}>
                        <div>
                          <label_1.Label htmlFor="deliveryDate" className="text-sm font-semibold text-gray-700 mb-2 block">
                            Delivery Date *
                          </label_1.Label>
                          <input_1.Input id="deliveryDate" type="date" value={form.deliveryDate} onChange={function (e) {
                setForm(__assign(__assign({}, form), { deliveryDate: e.target.value }));
                // Clear delivery date error when user selects a date
                if (errors.deliveryDate) {
                    setErrors(__assign(__assign({}, errors), { deliveryDate: "" }));
                }
            }} min={new Date().toISOString().split("T")[0]} className="py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-orange-500" required/>
                          {errors.deliveryDate && (<p className="text-red-500 text-sm mt-1">
                              {errors.deliveryDate}
                            </p>)}
                        </div>
                        {(selectedShippingMethod === null || selectedShippingMethod === void 0 ? void 0 : selectedShippingMethod.time_slot_required) && (<div>
                            <label_1.Label htmlFor="deliverySlot" className="text-sm font-semibold text-gray-700 mb-2 block">
                              Time Slot *
                            </label_1.Label>
                            <select_1.Select value={form.deliverySlot} onValueChange={function (value) {
                    return setForm(__assign(__assign({}, form), { deliverySlot: value }));
                }}>
                              <select_1.SelectTrigger className="py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-orange-500">
                                <select_1.SelectValue placeholder="Select time slot"/>
                              </select_1.SelectTrigger>
                              <select_1.SelectContent>
                                <select_1.SelectItem value="9am-12pm">
                                  9:00 AM - 12:00 PM
                                </select_1.SelectItem>
                                <select_1.SelectItem value="12pm-3pm">
                                  12:00 PM - 3:00 PM
                                </select_1.SelectItem>
                                <select_1.SelectItem value="3pm-6pm">
                                  3:00 PM - 6:00 PM
                                </select_1.SelectItem>
                                <select_1.SelectItem value="6pm-9pm">
                                  6:00 PM - 9:00 PM
                                </select_1.SelectItem>
                              </select_1.SelectContent>
                            </select_1.Select>
                          </div>)}
                      </div>

                      <div>
                        <label_1.Label htmlFor="specialInstructions" className="text-sm font-semibold text-gray-700 mb-2 block">
                          Special Delivery Instructions
                        </label_1.Label>
                        <textarea_1.Textarea id="specialInstructions" placeholder="Any special delivery instructions (e.g., ring doorbell, leave with security)..." value={form.specialInstructions} onChange={function (e) {
                return setForm(__assign(__assign({}, form), { specialInstructions: e.target.value }));
            }} rows={3} className="text-lg border-2 border-gray-200 rounded-xl focus:border-orange-500 resize-none"/>
                      </div>
                    </card_1.CardContent>
                  </card_1.Card>)}

                {/* 6. Payment Methods */}
                <card_1.Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                  <card_1.CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-t-lg">
                    <card_1.CardTitle className="flex items-center gap-3 text-xl">
                      <div className="bg-white/20 rounded-lg p-2">
                        <lucide_react_1.CreditCard className="w-6 h-6"/>
                      </div>
                      Payment Methods
                    </card_1.CardTitle>
                  </card_1.CardHeader>
                  <card_1.CardContent className="p-6">
                    <div className="space-y-4">
                      <label_1.Label className="text-sm font-semibold text-gray-700 mb-3 block">
                        Choose your preferred payment method *
                      </label_1.Label>

                      {[
            {
                value: "razorpay",
                label: "Credit/Debit Card",
                desc: "Visa, Mastercard, Rupay",
                icon: lucide_react_1.CreditCard,
            },
            {
                value: "upi",
                label: "UPI Payment",
                desc: "PhonePe, Google Pay, Paytm",
                icon: lucide_react_1.Phone,
            },
            {
                value: "netbanking",
                label: "Net Banking",
                desc: "All major banks supported",
                icon: lucide_react_1.Shield,
            },
            {
                value: "cod",
                label: "Cash on Delivery",
                desc: "Pay when you receive",
                icon: lucide_react_1.Package,
            },
        ].map(function (method) {
            var IconComponent = method.icon;
            return (<div key={method.value} className={"p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-lg ".concat(form.paymentMethod === method.value
                    ? "border-indigo-500 bg-indigo-50 shadow-lg ring-2 ring-indigo-200"
                    : "border-gray-200 hover:border-indigo-300 bg-white")} onClick={function () {
                    return setForm(__assign(__assign({}, form), { paymentMethod: method.value }));
                }}>
                            <div className="flex items-center gap-3">
                              {form.paymentMethod === method.value && (<lucide_react_1.CheckCircle className="h-5 w-5 text-indigo-600"/>)}
                              <IconComponent className="h-6 w-6 text-indigo-600"/>
                              <div className="flex-1">
                                <h4 className="font-semibold text-gray-900">
                                  {method.label}
                                </h4>
                                <p className="text-sm text-gray-600">
                                  {method.desc}
                                </p>
                              </div>
                            </div>
                          </div>);
        })}
                    </div>
                  </card_1.CardContent>
                </card_1.Card>

                {/* 7. Terms & Conditions */}
                <card_1.Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                  <card_1.CardHeader className="bg-gradient-to-r from-gray-600 to-slate-700 text-white rounded-t-lg">
                    <card_1.CardTitle className="flex items-center gap-3 text-xl">
                      <div className="bg-white/20 rounded-lg p-2">
                        <lucide_react_1.FileText className="w-6 h-6"/>
                      </div>
                      Terms & Conditions
                    </card_1.CardTitle>
                  </card_1.CardHeader>
                  <card_1.CardContent className="p-6">
                    <div className="flex items-start space-x-3">
                      <checkbox_1.Checkbox id="acceptTerms" checked={form.acceptTerms} onCheckedChange={function (checked) {
            return setForm(__assign(__assign({}, form), { acceptTerms: !!checked }));
        }} className="mt-1 w-5 h-5" required/>
                      <div className="flex-1">
                        <label_1.Label htmlFor="acceptTerms" className="text-sm text-gray-700 cursor-pointer leading-relaxed">
                          I accept the{" "}
                          <a href="/terms" target="_blank" className="text-blue-600 hover:text-blue-800 underline font-medium">
                            Terms & Conditions
                          </a>{" "}
                          and{" "}
                          <a href="/privacy-policy" target="_blank" className="text-blue-600 hover:text-blue-800 underline font-medium">
                            Privacy Policy
                          </a>
                        </label_1.Label>
                        {errors.terms && (<p className="text-red-600 text-sm mt-2 bg-red-50 p-2 rounded">
                            {errors.terms}
                          </p>)}
                      </div>
                    </div>
                  </card_1.CardContent>
                </card_1.Card>
              </form>
            </div>

            {/* Order Summary Sidebar */}
            <div className="space-y-6">
              {/* Coupon */}
              <card_1.Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                <card_1.CardHeader>
                  <card_1.CardTitle className="flex items-center gap-2">
                    <lucide_react_1.Percent className="w-5 h-5"/>
                    Coupon Code
                  </card_1.CardTitle>
                </card_1.CardHeader>
                <card_1.CardContent>
                  <div className="flex gap-2">
                    <input_1.Input placeholder="Enter coupon code" value={couponCode} onChange={function (e) {
            return setCouponCode(e.target.value.toUpperCase());
        }} className="border-2 border-gray-200 rounded-xl"/>
                    <button_1.Button type="button" variant="outline" onClick={validateCoupon} disabled={isValidatingCoupon || !couponCode.trim()} className="border-2 border-gray-200 rounded-xl">
                      {isValidatingCoupon ? "..." : "Apply"}
                    </button_1.Button>
                  </div>
                  {errors.coupon && (<p className="text-red-600 text-sm mt-2">{errors.coupon}</p>)}
                  {appliedCoupon && (<div className="mt-2 p-2 bg-green-50 border border-green-200 rounded">
                      <p className="text-green-800 text-sm">
                        ✓ Coupon "{appliedCoupon.code}" applied!
                        {appliedCoupon.discount_type === "flat"
                ? " \u20B9".concat(appliedCoupon.discount_value, " off")
                : " ".concat(appliedCoupon.discount_value, "% off")}
                      </p>
                    </div>)}
                </card_1.CardContent>
              </card_1.Card>

              {/* Order Summary */}
              <card_1.Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                <card_1.CardHeader>
                  <card_1.CardTitle>Order Summary</card_1.CardTitle>
                </card_1.CardHeader>
                <card_1.CardContent className="space-y-4">
                  {/* Items */}
                  <div className="space-y-3">
                    {items.map(function (item) {
            var _a, _b;
            return (<div key={"".concat(item.product_id, "-").concat(item.variant_id)} className="flex justify-between">
                        <div className="flex-1">
                          <p className="font-medium">{item.product.name}</p>
                          {item.variant && (<p className="text-sm text-muted-foreground">
                              {item.variant.name}
                            </p>)}
                          <p className="text-sm text-muted-foreground">
                            Qty: {item.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            ₹
                            {((((_a = item.variant) === null || _a === void 0 ? void 0 : _a.sale_price) ||
                    ((_b = item.variant) === null || _b === void 0 ? void 0 : _b.price) ||
                    item.product.sale_price ||
                    item.product.price) * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>);
        })}
                  </div>

                  <hr />

                  {/* Totals */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>₹{totals.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping:</span>
                      <span>₹{totals.shipping.toFixed(2)}</span>
                    </div>
                    {totals.discount > 0 && (<div className="flex justify-between text-green-600">
                        <span>Discount:</span>
                        <span>-₹{totals.discount.toFixed(2)}</span>
                      </div>)}
                    <div className="flex justify-between">
                      <span>Tax ({gstRate}% GST):</span>
                      <span>₹{totals.tax.toFixed(2)}</span>
                    </div>
                    <hr />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total:</span>
                      <span>₹{totals.total.toFixed(2)}</span>
                    </div>
                  </div>

                  <button_1.Button type="submit" size="lg" className="w-full py-4 text-sm sm:text-lg font-bold bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]" onClick={handleSubmit} disabled={isSubmitting ||
            !selectedShippingMethod ||
            !form.paymentMethod ||
            !form.acceptTerms}>
                    {isSubmitting ? (<div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                        <span className="truncate">Processing Order...</span>
                      </div>) : (<div className="flex items-center justify-center gap-2 min-w-0">
                        <lucide_react_1.Shield className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0"/>
                        <span className="truncate">
                          Proceed to Pay ₹{totals.total.toFixed(2)}
                        </span>
                      </div>)}
                  </button_1.Button>

                  {errors.submit && (<div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
                      <p className="text-red-700 font-medium">
                        {errors.submit}
                      </p>
                    </div>)}
                  {errors.terms && (<div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
                      <p className="text-red-700 font-medium">{errors.terms}</p>
                    </div>)}
                </card_1.CardContent>
              </card_1.Card>
            </div>
          </div>
        </div>
      </div>
    </div>);
}
