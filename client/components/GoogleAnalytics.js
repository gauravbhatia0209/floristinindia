"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = GoogleAnalytics;
exports.useGoogleAnalytics = useGoogleAnalytics;
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
function GoogleAnalytics(_a) {
    var trackingId = _a.trackingId;
    var location = (0, react_router_dom_1.useLocation)();
    (0, react_1.useEffect)(function () {
        if (!trackingId)
            return;
        // Initialize Google Analytics script
        var script1 = document.createElement("script");
        script1.async = true;
        script1.src = "https://www.googletagmanager.com/gtag/js?id=".concat(trackingId);
        document.head.appendChild(script1);
        var script2 = document.createElement("script");
        script2.innerHTML = "\n      window.dataLayer = window.dataLayer || [];\n      function gtag(){dataLayer.push(arguments);}\n      gtag('js', new Date());\n      gtag('config', '".concat(trackingId, "', {\n        page_location: window.location.href,\n        page_title: document.title,\n      });\n    ");
        document.head.appendChild(script2);
        // Cleanup function
        return function () {
            // Remove scripts when component unmounts
            document.head.removeChild(script1);
            document.head.removeChild(script2);
        };
    }, [trackingId]);
    // Track page views on route changes
    (0, react_1.useEffect)(function () {
        if (!trackingId || !window.gtag)
            return;
        window.gtag("config", trackingId, {
            page_location: window.location.href,
            page_title: document.title,
        });
    }, [location.pathname, trackingId]);
    return null; // This component doesn't render anything
}
// Hook for tracking custom events
function useGoogleAnalytics() {
    var trackEvent = function (action, category, label, value) {
        if (window.gtag) {
            window.gtag("event", action, {
                event_category: category,
                event_label: label,
                value: value,
            });
        }
    };
    var trackPurchase = function (transactionId, value, items) {
        if (window.gtag) {
            window.gtag("event", "purchase", {
                transaction_id: transactionId,
                value: value,
                currency: "INR",
                items: items,
            });
        }
    };
    var trackAddToCart = function (itemId, itemName, price) {
        if (window.gtag) {
            window.gtag("event", "add_to_cart", {
                currency: "INR",
                value: price,
                items: [
                    {
                        item_id: itemId,
                        item_name: itemName,
                        price: price,
                        quantity: 1,
                    },
                ],
            });
        }
    };
    return { trackEvent: trackEvent, trackPurchase: trackPurchase, trackAddToCart: trackAddToCart };
}
