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
exports.CartProvider = CartProvider;
exports.useCart = useCart;
var react_1 = require("react");
var CartContext = (0, react_1.createContext)(undefined);
function CartProvider(_a) {
    var children = _a.children;
    var _b = (0, react_1.useState)([]), items = _b[0], setItems = _b[1];
    // Initialize cart (session-based, no localStorage)
    (0, react_1.useEffect)(function () {
        // Future enhancement: Load cart from database for logged-in users
        // For now, each session starts with an empty cart
    }, []);
    var addItem = function (newItem) {
        setItems(function (prev) {
            var existingIndex = prev.findIndex(function (item) {
                return item.product_id === newItem.product_id &&
                    item.variant_id === newItem.variant_id;
            });
            if (existingIndex > -1) {
                var updated = __spreadArray([], prev, true);
                updated[existingIndex].quantity += newItem.quantity || 1;
                return updated;
            }
            return __spreadArray(__spreadArray([], prev, true), [__assign(__assign({}, newItem), { quantity: newItem.quantity || 1 })], false);
        });
    };
    var removeItem = function (productId, variantId) {
        setItems(function (prev) {
            return prev.filter(function (item) {
                return !(item.product_id === productId && item.variant_id === variantId);
            });
        });
    };
    var updateQuantity = function (productId, quantity, variantId) {
        if (quantity <= 0) {
            removeItem(productId, variantId);
            return;
        }
        setItems(function (prev) {
            return prev.map(function (item) {
                return item.product_id === productId && item.variant_id === variantId
                    ? __assign(__assign({}, item), { quantity: quantity }) : item;
            });
        });
    };
    var clearCart = function () {
        setItems([]);
    };
    var total = items.reduce(function (sum, item) {
        // Safety check: only calculate if product data exists
        if (!item.product) {
            console.warn("Cart item missing product data:", item);
            return sum;
        }
        var price = item.product.sale_price || item.product.price || 0;
        return sum + price * item.quantity;
    }, 0);
    var value = {
        items: items,
        addItem: addItem,
        removeItem: removeItem,
        updateQuantity: updateQuantity,
        clearCart: clearCart,
        total: total,
    };
    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
function useCart() {
    var context = (0, react_1.useContext)(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}
