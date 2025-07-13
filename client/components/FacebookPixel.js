"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = FacebookPixel;
exports.useFacebookPixel = useFacebookPixel;
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
function FacebookPixel(_a) {
    var pixelId = _a.pixelId;
    var location = (0, react_router_dom_1.useLocation)();
    (0, react_1.useEffect)(function () {
        if (!pixelId)
            return;
        // Facebook Pixel initialization script
        var script = document.createElement("script");
        script.innerHTML = "\n      !function(f,b,e,v,n,t,s)\n      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?\n      n.callMethod.apply(n,arguments):n.queue.push(arguments)};\n      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';\n      n.queue=[];t=b.createElement(e);t.async=!0;\n      t.src=v;s=b.getElementsByTagName(e)[0];\n      s.parentNode.insertBefore(t,s)}(window, document,'script',\n      'https://connect.facebook.net/en_US/fbevents.js');\n      \n      fbq('init', '".concat(pixelId, "');\n      fbq('track', 'PageView');\n    ");
        document.head.appendChild(script);
        // Add noscript fallback
        var noscript = document.createElement("noscript");
        noscript.innerHTML = "\n      <img height=\"1\" width=\"1\" style=\"display:none\"\n           src=\"https://www.facebook.com/tr?id=".concat(pixelId, "&ev=PageView&noscript=1\" />\n    ");
        document.head.appendChild(noscript);
        // Cleanup function
        return function () {
            document.head.removeChild(script);
            document.head.removeChild(noscript);
        };
    }, [pixelId]);
    // Track page views on route changes
    (0, react_1.useEffect)(function () {
        if (!pixelId || !window.fbq)
            return;
        window.fbq("track", "PageView");
    }, [location.pathname, pixelId]);
    return null; // This component doesn't render anything
}
// Hook for tracking Facebook Pixel events
function useFacebookPixel() {
    var trackEvent = function (event, parameters) {
        if (window.fbq) {
            window.fbq("track", event, parameters);
        }
    };
    var trackCustomEvent = function (event, parameters) {
        if (window.fbq) {
            window.fbq("trackCustom", event, parameters);
        }
    };
    var trackViewContent = function (contentName, contentCategory, value, currency) {
        if (currency === void 0) { currency = "INR"; }
        if (window.fbq) {
            window.fbq("track", "ViewContent", {
                content_name: contentName,
                content_category: contentCategory,
                value: value,
                currency: currency,
            });
        }
    };
    var trackAddToCart = function (contentName, contentId, value, currency) {
        if (currency === void 0) { currency = "INR"; }
        if (window.fbq) {
            window.fbq("track", "AddToCart", {
                content_name: contentName,
                content_ids: [contentId],
                content_type: "product",
                value: value,
                currency: currency,
            });
        }
    };
    var trackPurchase = function (value, currency, contentIds, numItems) {
        if (currency === void 0) { currency = "INR"; }
        if (contentIds === void 0) { contentIds = []; }
        if (numItems === void 0) { numItems = 1; }
        if (window.fbq) {
            window.fbq("track", "Purchase", {
                value: value,
                currency: currency,
                content_ids: contentIds,
                content_type: "product",
                num_items: numItems,
            });
        }
    };
    var trackInitiateCheckout = function (value, currency, numItems) {
        if (currency === void 0) { currency = "INR"; }
        if (numItems === void 0) { numItems = 1; }
        if (window.fbq) {
            window.fbq("track", "InitiateCheckout", {
                value: value,
                currency: currency,
                num_items: numItems,
            });
        }
    };
    var trackAddPaymentInfo = function () {
        if (window.fbq) {
            window.fbq("track", "AddPaymentInfo");
        }
    };
    var trackSearch = function (searchString) {
        if (window.fbq) {
            window.fbq("track", "Search", {
                search_string: searchString,
            });
        }
    };
    var trackLead = function (content) {
        if (window.fbq) {
            window.fbq("track", "Lead", content);
        }
    };
    var trackContact = function () {
        if (window.fbq) {
            window.fbq("track", "Contact");
        }
    };
    return {
        trackEvent: trackEvent,
        trackCustomEvent: trackCustomEvent,
        trackViewContent: trackViewContent,
        trackAddToCart: trackAddToCart,
        trackPurchase: trackPurchase,
        trackInitiateCheckout: trackInitiateCheckout,
        trackAddPaymentInfo: trackAddPaymentInfo,
        trackSearch: trackSearch,
        trackLead: trackLead,
        trackContact: trackContact,
    };
}
