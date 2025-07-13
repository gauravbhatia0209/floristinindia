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
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var CartContext_1 = require("@/contexts/CartContext");
var AuthContext_1 = require("@/contexts/AuthContext");
var ProtectedRoute_1 = require("@/components/ProtectedRoute");
var Layout_1 = require("@/components/layout/Layout");
var AdminLayout_1 = require("@/components/admin/AdminLayout");
var GoogleAnalytics_1 = require("@/components/GoogleAnalytics");
var FacebookPixel_1 = require("@/components/FacebookPixel");
var StructuredData_1 = require("@/components/StructuredData");
var AIMetaTags_1 = require("@/components/AIMetaTags");
var supabase_1 = require("@/lib/supabase");
// Public pages
var Index_1 = require("@/pages/Index");
var Products_1 = require("@/pages/Products");
var ProductDetail_1 = require("@/pages/ProductDetail");
var Cart_1 = require("@/pages/Cart");
var Checkout_1 = require("@/pages/Checkout");
var TrackOrder_1 = require("@/pages/TrackOrder");
var OrderConfirmation_1 = require("@/pages/OrderConfirmation");
var Account_1 = require("@/pages/Account");
var Page_1 = require("@/pages/Page");
var NotFound_1 = require("@/pages/NotFound");
// Auth pages
var Login_1 = require("@/pages/Login");
var Signup_1 = require("@/pages/Signup");
var AuthCallback_1 = require("@/pages/AuthCallback");
var Login_2 = require("@/pages/admin/Login");
// Admin pages
var Dashboard_1 = require("@/pages/admin/Dashboard");
var Analytics_1 = require("@/pages/admin/Analytics");
var Products_2 = require("@/pages/admin/Products");
var ProductEdit_1 = require("@/pages/admin/ProductEdit");
var Categories_1 = require("@/pages/admin/Categories");
var Orders_1 = require("@/pages/admin/Orders");
var Customers_1 = require("@/pages/admin/Customers");
var Coupons_1 = require("@/pages/admin/Coupons");
var ShippingEnhanced_1 = require("@/pages/admin/ShippingEnhanced");
var Pages_1 = require("@/pages/admin/Pages");
var HomepageBuilder_1 = require("@/pages/admin/HomepageBuilder");
var MenuBar_1 = require("@/pages/admin/MenuBar");
var Settings_1 = require("@/pages/admin/Settings");
var Users_1 = require("@/pages/admin/Users");
var ContactSubmissions_1 = require("@/pages/admin/ContactSubmissions");
var DatabaseSetup_1 = require("@/pages/admin/DatabaseSetup");
var DatabaseTest_1 = require("@/pages/admin/DatabaseTest");
var FooterEditor_1 = require("@/pages/admin/FooterEditor");
var CategoryImageMigration_1 = require("@/pages/admin/CategoryImageMigration");
function App() {
    var _a = (0, react_1.useState)(""), googleAnalyticsId = _a[0], setGoogleAnalyticsId = _a[1];
    var _b = (0, react_1.useState)(""), facebookPixelId = _b[0], setFacebookPixelId = _b[1];
    // Add error handling for navigation issues
    react_1.default.useEffect(function () {
        var handleError = function (event) {
            var _a, _b;
            console.error("App Error:", event.error);
            if ((_b = (_a = event.error) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.includes("IP address could not be found")) {
                console.warn("URL Resolution Error - may be due to malformed URLs");
            }
        };
        var handleUnhandledRejection = function (event) {
            console.error("Unhandled Promise Rejection:", event.reason);
        };
        window.addEventListener("error", handleError);
        window.addEventListener("unhandledrejection", handleUnhandledRejection);
        // Fetch Google Analytics ID
        fetchGoogleAnalyticsId();
        // Fetch Facebook Pixel ID
        fetchFacebookPixelId();
        return function () {
            window.removeEventListener("error", handleError);
            window.removeEventListener("unhandledrejection", handleUnhandledRejection);
        };
    }, []);
    function fetchGoogleAnalyticsId() {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, supabase_1.supabase
                                .from("site_settings")
                                .select("value")
                                .eq("key", "google_analytics_id")
                                .single()];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (data && data.value) {
                            setGoogleAnalyticsId(data.value);
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _b.sent();
                        console.error("Error fetching Google Analytics ID:", error_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    }
    function fetchFacebookPixelId() {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error, error_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, supabase_1.supabase
                                .from("site_settings")
                                .select("value")
                                .eq("key", "facebook_pixel_id")
                                .single()];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (data && data.value) {
                            setFacebookPixelId(data.value);
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _b.sent();
                        console.error("Error fetching Facebook Pixel ID:", error_2);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    }
    return (<AuthContext_1.default>
      <CartContext_1.CartProvider>
        <react_router_dom_1.BrowserRouter>
          {googleAnalyticsId && (<GoogleAnalytics_1.default trackingId={googleAnalyticsId}/>)}
          {facebookPixelId && <FacebookPixel_1.default pixelId={facebookPixelId}/>}
          <StructuredData_1.default type="website"/>
          <StructuredData_1.default type="organization"/>
          <AIMetaTags_1.default page="home"/>
          <react_router_dom_1.Routes>
            {/* Auth routes */}
            <react_router_dom_1.Route path="/login" element={<ProtectedRoute_1.GuestRoute>
                  <Login_1.default />
                </ProtectedRoute_1.GuestRoute>}/>
            <react_router_dom_1.Route path="/signup" element={<ProtectedRoute_1.GuestRoute>
                  <Signup_1.default />
                </ProtectedRoute_1.GuestRoute>}/>
            <react_router_dom_1.Route path="/auth/callback" element={<AuthCallback_1.default />}/>
            <react_router_dom_1.Route path="/admin/login" element={<ProtectedRoute_1.GuestRoute>
                  <Login_2.default />
                </ProtectedRoute_1.GuestRoute>}/>

            {/* Public routes */}
            <react_router_dom_1.Route path="/" element={<Layout_1.default />}>
              <react_router_dom_1.Route index element={<Index_1.default />}/>
              <react_router_dom_1.Route path="products" element={<Products_1.default />}/>
              <react_router_dom_1.Route path="category/:slug" element={<Products_1.default />}/>
              <react_router_dom_1.Route path="product/:slug" element={<ProductDetail_1.default />}/>
              <react_router_dom_1.Route path="cart" element={<Cart_1.default />}/>
              <react_router_dom_1.Route path="checkout" element={<Checkout_1.default />}/>
              <react_router_dom_1.Route path="track-order" element={<TrackOrder_1.default />}/>
              <react_router_dom_1.Route path="order-confirmation/:orderId" element={<OrderConfirmation_1.default />}/>
              <react_router_dom_1.Route path="account" element={<ProtectedRoute_1.default requireAuth={true} requireAdmin={false}>
                    <Account_1.default />
                  </ProtectedRoute_1.default>}/>
              {/* Specific static routes - must come before dynamic route */}
              <react_router_dom_1.Route path="about" element={<Page_1.default />}/>
              <react_router_dom_1.Route path="help" element={<Page_1.default />}/>
              <react_router_dom_1.Route path="terms" element={<Page_1.default />}/>
              <react_router_dom_1.Route path="privacy-policy" element={<Page_1.default />}/>
              <react_router_dom_1.Route path="return-refunds" element={<Page_1.default />}/>
              <react_router_dom_1.Route path="delivery-info" element={<Page_1.default />}/>
              {/* Dynamic pages from CMS - must be last */}
              <react_router_dom_1.Route path=":slug" element={<Page_1.default />}/>
            </react_router_dom_1.Route>

            {/* Admin routes */}
            <react_router_dom_1.Route path="/admin" element={<ProtectedRoute_1.AdminRoute>
                  <AdminLayout_1.default />
                </ProtectedRoute_1.AdminRoute>}>
              <react_router_dom_1.Route index element={<Dashboard_1.default />}/>
              <react_router_dom_1.Route path="analytics" element={<Analytics_1.default />}/>
              <react_router_dom_1.Route path="products" element={<Products_2.default />}/>
              <react_router_dom_1.Route path="products/new" element={<ProductEdit_1.default />}/>
              <react_router_dom_1.Route path="products/:id/edit" element={<ProductEdit_1.default />}/>
              <react_router_dom_1.Route path="categories" element={<Categories_1.default />}/>
              <react_router_dom_1.Route path="categories/migrate-images" element={<CategoryImageMigration_1.default />}/>
              <react_router_dom_1.Route path="orders" element={<Orders_1.default />}/>
              <react_router_dom_1.Route path="customers" element={<Customers_1.default />}/>
              <react_router_dom_1.Route path="coupons" element={<Coupons_1.default />}/>
              <react_router_dom_1.Route path="shipping" element={<ShippingEnhanced_1.default />}/>
              <react_router_dom_1.Route path="pages" element={<Pages_1.default />}/>
              <react_router_dom_1.Route path="footer-editor" element={<FooterEditor_1.default />}/>
              <react_router_dom_1.Route path="homepage" element={<HomepageBuilder_1.default />}/>
              <react_router_dom_1.Route path="menu-bar" element={<MenuBar_1.default />}/>
              <react_router_dom_1.Route path="settings" element={<Settings_1.default />}/>
              <react_router_dom_1.Route path="users" element={<Users_1.default />}/>
              <react_router_dom_1.Route path="contact-submissions" element={<ContactSubmissions_1.default />}/>
              <react_router_dom_1.Route path="database-setup" element={<DatabaseSetup_1.default />}/>
              <react_router_dom_1.Route path="database-test" element={<DatabaseTest_1.default />}/>
            </react_router_dom_1.Route>

            {/* 404 Route */}
            <react_router_dom_1.Route path="*" element={<NotFound_1.default />}/>
          </react_router_dom_1.Routes>
        </react_router_dom_1.BrowserRouter>
      </CartContext_1.CartProvider>
    </AuthContext_1.default>);
}
exports.default = App;
