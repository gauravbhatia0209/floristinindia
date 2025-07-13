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
exports.getAnalytics = exports.initAnalytics = exports.analyticsTableSQL = void 0;
var AnalyticsTracker = /** @class */ (function () {
    function AnalyticsTracker() {
        this.pageViews = 0;
        this.sessionId = this.generateSessionId();
        this.sessionStartTime = new Date().toISOString();
        this.initSession();
    }
    AnalyticsTracker.prototype.generateSessionId = function () {
        return "session_".concat(Date.now(), "_").concat(Math.random().toString(36).substr(2, 9));
    };
    AnalyticsTracker.prototype.initSession = function () {
        var _this = this;
        if (typeof window !== "undefined") {
            // Start session tracking
            this.trackSession();
            // Track page unload
            window.addEventListener("beforeunload", function () {
                _this.endSession();
            });
        }
    };
    AnalyticsTracker.prototype.trackSession = function () {
        return __awaiter(this, void 0, void 0, function () {
            var sessionData;
            return __generator(this, function (_a) {
                try {
                    sessionData = {
                        session_id: this.sessionId,
                        start_time: this.sessionStartTime,
                        page_count: 0,
                        device_type: this.getDeviceType(),
                        browser: this.getBrowser(),
                        referrer: document.referrer || undefined,
                    };
                    // Note: This would require creating an analytics_sessions table
                    // await supabase.from("analytics_sessions").insert(sessionData);
                    console.log("Session started:", sessionData);
                }
                catch (error) {
                    console.error("Failed to track session:", error);
                }
                return [2 /*return*/];
            });
        });
    };
    AnalyticsTracker.prototype.endSession = function () {
        return __awaiter(this, void 0, void 0, function () {
            var endTime;
            return __generator(this, function (_a) {
                try {
                    endTime = new Date().toISOString();
                    // Note: This would require updating the analytics_sessions table
                    // await supabase
                    //   .from("analytics_sessions")
                    //   .update({
                    //     end_time: endTime,
                    //     page_count: this.pageViews
                    //   })
                    //   .eq("session_id", this.sessionId);
                    console.log("Session ended:", {
                        session_id: this.sessionId,
                        end_time: endTime,
                        page_count: this.pageViews,
                    });
                }
                catch (error) {
                    console.error("Failed to end session:", error);
                }
                return [2 /*return*/];
            });
        });
    };
    AnalyticsTracker.prototype.trackPageView = function (pageUrl, pageTitle) {
        return __awaiter(this, void 0, void 0, function () {
            var pageViewEvent;
            return __generator(this, function (_a) {
                try {
                    this.pageViews++;
                    pageViewEvent = {
                        page_url: pageUrl,
                        page_title: pageTitle,
                        referrer: document.referrer || undefined,
                        user_agent: navigator.userAgent,
                        session_id: this.sessionId,
                        timestamp: new Date().toISOString(),
                    };
                    // Note: This would require creating an analytics_page_views table
                    // await supabase.from("analytics_page_views").insert(pageViewEvent);
                    console.log("Page view tracked:", pageViewEvent);
                }
                catch (error) {
                    console.error("Failed to track page view:", error);
                }
                return [2 /*return*/];
            });
        });
    };
    AnalyticsTracker.prototype.trackProductView = function (productId, productName, categoryId) {
        return __awaiter(this, void 0, void 0, function () {
            var productViewEvent;
            return __generator(this, function (_a) {
                try {
                    productViewEvent = {
                        product_id: productId,
                        product_name: productName,
                        category_id: categoryId,
                        session_id: this.sessionId,
                        timestamp: new Date().toISOString(),
                    };
                    // Note: This would require creating an analytics_product_views table
                    // await supabase.from("analytics_product_views").insert(productViewEvent);
                    console.log("Product view tracked:", productViewEvent);
                }
                catch (error) {
                    console.error("Failed to track product view:", error);
                }
                return [2 /*return*/];
            });
        });
    };
    AnalyticsTracker.prototype.trackCartEvent = function (productId, productName, action, quantity) {
        return __awaiter(this, void 0, void 0, function () {
            var cartEvent;
            return __generator(this, function (_a) {
                try {
                    cartEvent = {
                        product_id: productId,
                        product_name: productName,
                        action: action,
                        quantity: quantity,
                        session_id: this.sessionId,
                        timestamp: new Date().toISOString(),
                    };
                    // Note: This would require creating an analytics_cart_events table
                    // await supabase.from("analytics_cart_events").insert(cartEvent);
                    console.log("Cart event tracked:", cartEvent);
                }
                catch (error) {
                    console.error("Failed to track cart event:", error);
                }
                return [2 /*return*/];
            });
        });
    };
    AnalyticsTracker.prototype.getDeviceType = function () {
        var userAgent = navigator.userAgent;
        if (/tablet|ipad|playbook|silk/i.test(userAgent)) {
            return "tablet";
        }
        if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(userAgent)) {
            return "mobile";
        }
        return "desktop";
    };
    AnalyticsTracker.prototype.getBrowser = function () {
        var userAgent = navigator.userAgent;
        if (userAgent.includes("Chrome"))
            return "Chrome";
        if (userAgent.includes("Firefox"))
            return "Firefox";
        if (userAgent.includes("Safari"))
            return "Safari";
        if (userAgent.includes("Edge"))
            return "Edge";
        return "Other";
    };
    return AnalyticsTracker;
}());
// Create analytics tables SQL
exports.analyticsTableSQL = "\n-- Analytics Sessions Table\nCREATE TABLE IF NOT EXISTS analytics_sessions (\n  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,\n  session_id TEXT UNIQUE NOT NULL,\n  user_id UUID REFERENCES customers(id) ON DELETE SET NULL,\n  start_time TIMESTAMP WITH TIME ZONE NOT NULL,\n  end_time TIMESTAMP WITH TIME ZONE,\n  page_count INTEGER DEFAULT 0,\n  device_type TEXT NOT NULL,\n  browser TEXT NOT NULL,\n  referrer TEXT,\n  ip_address INET,\n  location TEXT,\n  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()\n);\n\n-- Analytics Page Views Table\nCREATE TABLE IF NOT EXISTS analytics_page_views (\n  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,\n  session_id TEXT NOT NULL,\n  user_id UUID REFERENCES customers(id) ON DELETE SET NULL,\n  page_url TEXT NOT NULL,\n  page_title TEXT NOT NULL,\n  referrer TEXT,\n  user_agent TEXT,\n  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,\n  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()\n);\n\n-- Analytics Product Views Table\nCREATE TABLE IF NOT EXISTS analytics_product_views (\n  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,\n  session_id TEXT NOT NULL,\n  user_id UUID REFERENCES customers(id) ON DELETE SET NULL,\n  product_id UUID REFERENCES products(id) ON DELETE CASCADE,\n  product_name TEXT NOT NULL,\n  category_id UUID REFERENCES product_categories(id) ON DELETE SET NULL,\n  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,\n  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()\n);\n\n-- Analytics Cart Events Table\nCREATE TABLE IF NOT EXISTS analytics_cart_events (\n  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,\n  session_id TEXT NOT NULL,\n  user_id UUID REFERENCES customers(id) ON DELETE SET NULL,\n  product_id UUID REFERENCES products(id) ON DELETE CASCADE,\n  product_name TEXT NOT NULL,\n  action TEXT NOT NULL CHECK (action IN ('add', 'remove', 'update')),\n  quantity INTEGER NOT NULL,\n  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,\n  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()\n);\n\n-- Create indexes for better performance\nCREATE INDEX IF NOT EXISTS idx_analytics_sessions_start_time ON analytics_sessions(start_time);\nCREATE INDEX IF NOT EXISTS idx_analytics_page_views_timestamp ON analytics_page_views(timestamp);\nCREATE INDEX IF NOT EXISTS idx_analytics_product_views_timestamp ON analytics_product_views(timestamp);\nCREATE INDEX IF NOT EXISTS idx_analytics_product_views_product_id ON analytics_product_views(product_id);\nCREATE INDEX IF NOT EXISTS idx_analytics_cart_events_timestamp ON analytics_cart_events(timestamp);\nCREATE INDEX IF NOT EXISTS idx_analytics_cart_events_product_id ON analytics_cart_events(product_id);\n";
// Initialize analytics tracker
var analytics = null;
var initAnalytics = function () {
    if (typeof window !== "undefined" && !analytics) {
        analytics = new AnalyticsTracker();
    }
    return analytics;
};
exports.initAnalytics = initAnalytics;
var getAnalytics = function () {
    return analytics || (0, exports.initAnalytics)();
};
exports.getAnalytics = getAnalytics;
exports.default = AnalyticsTracker;
