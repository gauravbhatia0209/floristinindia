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
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Cart;
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var lucide_react_1 = require("lucide-react");
var button_1 = require("@/components/ui/button");
var card_1 = require("@/components/ui/card");
var input_1 = require("@/components/ui/input");
var useCart_1 = require("@/hooks/useCart");
var supabase_1 = require("@/lib/supabase");
function Cart() {
    var _a = (0, useCart_1.useCart)(), items = _a.items, updateQuantity = _a.updateQuantity, removeItem = _a.removeItem, clearCart = _a.clearCart, total = _a.total;
    var _b = (0, react_1.useState)([]), cartItemsWithDetails = _b[0], setCartItemsWithDetails = _b[1];
    var _c = (0, react_1.useState)(true), isLoading = _c[0], setIsLoading = _c[1];
    var _d = (0, react_1.useState)(""), couponCode = _d[0], setCouponCode = _d[1];
    var _e = (0, react_1.useState)(0), discount = _e[0], setDiscount = _e[1];
    var _f = (0, react_1.useState)(0), shippingCost = _f[0], setShippingCost = _f[1];
    (0, react_1.useEffect)(function () {
        fetchCartDetails();
    }, [items]);
    function fetchCartDetails() {
        return __awaiter(this, void 0, void 0, function () {
            var productIds, products_1, variantIds, variants_1, variantData, cartDetails, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (items.length === 0) {
                            setCartItemsWithDetails([]);
                            setIsLoading(false);
                            return [2 /*return*/];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 5, 6, 7]);
                        setIsLoading(true);
                        productIds = items.map(function (item) { return item.product_id; });
                        return [4 /*yield*/, supabase_1.supabase
                                .from("products")
                                .select("*")
                                .in("id", productIds)
                                .eq("is_active", true)];
                    case 2:
                        products_1 = (_a.sent()).data;
                        variantIds = items
                            .filter(function (item) { return item.variant_id; })
                            .map(function (item) { return item.variant_id; });
                        variants_1 = [];
                        if (!(variantIds.length > 0)) return [3 /*break*/, 4];
                        return [4 /*yield*/, supabase_1.supabase
                                .from("product_variants")
                                .select("*")
                                .in("id", variantIds)
                                .eq("is_active", true)];
                    case 3:
                        variantData = (_a.sent()).data;
                        variants_1 = variantData || [];
                        _a.label = 4;
                    case 4:
                        cartDetails = items
                            .map(function (item) {
                            var product = products_1 === null || products_1 === void 0 ? void 0 : products_1.find(function (p) { return p.id === item.product_id; });
                            var variant = item.variant_id
                                ? variants_1.find(function (v) { return v.id === item.variant_id; })
                                : undefined;
                            return product
                                ? {
                                    product_id: item.product_id,
                                    variant_id: item.variant_id,
                                    quantity: item.quantity,
                                    product: product,
                                    variant: variant,
                                }
                                : null;
                        })
                            .filter(Boolean);
                        setCartItemsWithDetails(cartDetails);
                        // Calculate shipping cost based on total
                        calculateShipping(cartDetails);
                        return [3 /*break*/, 7];
                    case 5:
                        error_1 = _a.sent();
                        console.error("Failed to fetch cart details:", error_1);
                        return [3 /*break*/, 7];
                    case 6:
                        setIsLoading(false);
                        return [7 /*endfinally*/];
                    case 7: return [2 /*return*/];
                }
            });
        });
    }
    function calculateShipping(cartItems) {
        var subtotal = cartItems.reduce(function (sum, item) {
            var _a;
            var price = ((_a = item.variant) === null || _a === void 0 ? void 0 : _a.price) || item.product.sale_price || item.product.price;
            return sum + price * item.quantity;
        }, 0);
        // Shipping will be calculated at checkout based on location and method
        setShippingCost(0);
    }
    function applyCoupon() {
        return __awaiter(this, void 0, void 0, function () {
            var coupon, now, discountAmount, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!couponCode.trim())
                            return [2 /*return*/];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, supabase_1.supabase
                                .from("coupons")
                                .select("*")
                                .eq("code", couponCode.toUpperCase())
                                .eq("is_active", true)
                                .single()];
                    case 2:
                        coupon = (_a.sent()).data;
                        if (!coupon) {
                            alert("Invalid coupon code");
                            return [2 /*return*/];
                        }
                        now = new Date();
                        if (coupon.expires_at && new Date(coupon.expires_at) < now) {
                            alert("Coupon has expired");
                            return [2 /*return*/];
                        }
                        if (coupon.starts_at && new Date(coupon.starts_at) > now) {
                            alert("Coupon is not yet active");
                            return [2 /*return*/];
                        }
                        // Check minimum order amount
                        if (coupon.minimum_order_amount && total < coupon.minimum_order_amount) {
                            alert("Minimum order amount of \u20B9".concat(coupon.minimum_order_amount, " required"));
                            return [2 /*return*/];
                        }
                        discountAmount = 0;
                        if (coupon.discount_type === "percentage") {
                            discountAmount = (total * coupon.discount_value) / 100;
                            if (coupon.maximum_discount_amount &&
                                discountAmount > coupon.maximum_discount_amount) {
                                discountAmount = coupon.maximum_discount_amount;
                            }
                        }
                        else {
                            discountAmount = coupon.discount_value;
                        }
                        setDiscount(discountAmount);
                        alert("Coupon applied successfully!");
                        return [3 /*break*/, 4];
                    case 3:
                        error_2 = _a.sent();
                        console.error("Failed to apply coupon:", error_2);
                        alert("Failed to apply coupon");
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    }
    function getItemPrice(item) {
        // Check for variant-specific pricing first
        if (item.variant) {
            // Use sale price override if available and less than regular price
            if (item.variant.sale_price_override !== null &&
                item.variant.sale_price_override !== undefined &&
                item.variant.price_override !== null &&
                item.variant.price_override !== undefined &&
                item.variant.sale_price_override < item.variant.price_override) {
                return item.variant.sale_price_override;
            }
            // Use price override if available
            if (item.variant.price_override !== null &&
                item.variant.price_override !== undefined) {
                return item.variant.price_override;
            }
            // Fallback to legacy variant pricing
            if (item.variant.sale_price &&
                item.variant.sale_price < item.variant.price) {
                return item.variant.sale_price;
            }
            if (item.variant.price) {
                return item.variant.price;
            }
        }
        // Fallback to product pricing
        return item.product.sale_price || item.product.price;
    }
    function getItemTotal(item) {
        return getItemPrice(item) * item.quantity;
    }
    var subtotal = cartItemsWithDetails.reduce(function (sum, item) { return sum + getItemTotal(item); }, 0);
    var finalTotal = subtotal - discount;
    if (isLoading) {
        return (<div className="container py-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-48"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>);
    }
    if (cartItemsWithDetails.length === 0) {
        return (<div className="container py-16">
        <div className="max-w-2xl mx-auto text-center">
          <lucide_react_1.ShoppingCart className="w-16 h-16 mx-auto mb-4 text-muted-foreground"/>
          <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
          <p className="text-muted-foreground mb-6">
            Looks like you haven't added any beautiful flowers to your cart yet
          </p>
          <button_1.Button asChild>
            <react_router_dom_1.Link to="/products">
              <lucide_react_1.ArrowLeft className="w-4 h-4 mr-2"/>
              Continue Shopping
            </react_router_dom_1.Link>
          </button_1.Button>
        </div>
      </div>);
    }
    return (<div className="container py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Shopping Cart</h1>
            <p className="text-muted-foreground">
              {cartItemsWithDetails.length} item
              {cartItemsWithDetails.length !== 1 ? "s" : ""} in your cart
            </p>
          </div>
          <button_1.Button variant="outline" asChild>
            <react_router_dom_1.Link to="/products">
              <lucide_react_1.ArrowLeft className="w-4 h-4 mr-2"/>
              Continue Shopping
            </react_router_dom_1.Link>
          </button_1.Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <card_1.Card>
              <card_1.CardHeader className="flex flex-row items-center justify-between">
                <card_1.CardTitle>Cart Items</card_1.CardTitle>
                <button_1.Button variant="ghost" size="sm" onClick={clearCart} className="text-red-600 hover:text-red-700">
                  <lucide_react_1.Trash2 className="w-4 h-4 mr-2"/>
                  Clear Cart
                </button_1.Button>
              </card_1.CardHeader>
              <card_1.CardContent className="space-y-4">
                {cartItemsWithDetails.map(function (item) {
            var _a, _b;
            return (<div key={"".concat(item.product_id, "-").concat(item.variant_id || "default")} className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 border rounded-lg">
                    {/* Top row on mobile: Image + Product Details */}
                    <div className="flex items-center gap-4 flex-1">
                      {/* Product Image */}
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-cream to-peach/30 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                        {((_a = item.variant) === null || _a === void 0 ? void 0 : _a.image_url) ||
                    item.product.images.length > 0 ? (<img src={((_b = item.variant) === null || _b === void 0 ? void 0 : _b.image_url) || item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover"/>) : (<span className="text-xl sm:text-2xl">🌺</span>)}
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold">{item.product.name}</h3>
                        {item.variant && (<div className="space-y-1">
                            <p className="text-sm text-muted-foreground">
                              {item.variant.name}
                            </p>
                            {item.variant.sku && (<p className="text-sm text-muted-foreground">
                                SKU: {item.variant.sku}
                              </p>)}
                          </div>)}
                        {!item.variant && (<p className="text-sm text-muted-foreground">
                            SKU: {item.product.sku || "N/A"}
                          </p>)}
                        <div className="flex items-center gap-2 mt-2">
                          <span className="font-semibold text-primary">
                            ₹{getItemPrice(item)}
                          </span>
                          {item.product.sale_price &&
                    !item.variant &&
                    item.product.sale_price < item.product.price && (<span className="text-sm text-muted-foreground line-through">
                                ₹{item.product.price}
                              </span>)}
                        </div>
                      </div>
                    </div>

                    {/* Bottom row on mobile: Quantity, Price, and Delete */}
                    <div className="flex items-center justify-between sm:justify-end sm:gap-4 flex-shrink-0">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2">
                        <button_1.Button variant="outline" size="sm" onClick={function () {
                    return updateQuantity(item.product_id, Math.max(1, item.quantity - 1), item.variant_id);
                }} disabled={item.quantity <= 1} className="h-8 w-8 p-0">
                          <lucide_react_1.Minus className="w-3 h-3"/>
                        </button_1.Button>
                        <span className="w-8 text-center font-medium text-sm">
                          {item.quantity}
                        </span>
                        <button_1.Button variant="outline" size="sm" onClick={function () {
                    return updateQuantity(item.product_id, item.quantity + 1, item.variant_id);
                }} className="h-8 w-8 p-0">
                          <lucide_react_1.Plus className="w-3 h-3"/>
                        </button_1.Button>
                      </div>

                      {/* Item Total and Delete */}
                      <div className="flex items-center gap-2">
                        <div className="text-right">
                          <p className="font-semibold">
                            ₹{getItemTotal(item).toLocaleString()}
                          </p>
                        </div>
                        <button_1.Button variant="ghost" size="sm" onClick={function () {
                    return removeItem(item.product_id, item.variant_id);
                }} className="text-red-600 hover:text-red-700 h-8 w-8 p-0">
                          <lucide_react_1.Trash2 className="w-4 h-4"/>
                        </button_1.Button>
                      </div>
                    </div>
                  </div>);
        })}
              </card_1.CardContent>
            </card_1.Card>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            {/* Coupon Code */}
            <card_1.Card>
              <card_1.CardHeader>
                <card_1.CardTitle>Apply Coupon</card_1.CardTitle>
              </card_1.CardHeader>
              <card_1.CardContent className="space-y-4">
                <div className="flex gap-2">
                  <input_1.Input placeholder="Enter coupon code" value={couponCode} onChange={function (e) { return setCouponCode(e.target.value); }}/>
                  <button_1.Button onClick={applyCoupon}>Apply</button_1.Button>
                </div>
                {discount > 0 && (<div className="text-green-600 text-sm">
                    Coupon applied! You saved ₹{discount.toLocaleString()}
                  </div>)}
              </card_1.CardContent>
            </card_1.Card>

            {/* Order Summary */}
            <card_1.Card>
              <card_1.CardHeader>
                <card_1.CardTitle>Order Summary</card_1.CardTitle>
              </card_1.CardHeader>
              <card_1.CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-muted-foreground">
                    Calculated at checkout
                  </span>
                </div>
                {discount > 0 && (<div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-₹{discount.toLocaleString()}</span>
                  </div>)}
                <hr />
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>₹{finalTotal.toLocaleString()}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Final total including shipping will be calculated at checkout
                </p>
              </card_1.CardContent>
            </card_1.Card>

            {/* Checkout Button */}
            <button_1.Button asChild className="w-full" size="lg">
              <react_router_dom_1.Link to="/checkout">
                Proceed to Checkout
                <lucide_react_1.ArrowRight className="w-4 h-4 ml-2"/>
              </react_router_dom_1.Link>
            </button_1.Button>

            {/* Security Badge */}
            <div className="text-center text-sm text-muted-foreground">
              <p>🔒 Secure checkout with 256-bit SSL encryption</p>
            </div>
          </div>
        </div>
      </div>
    </div>);
}
