import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import AuthProvider from "@/contexts/AuthContext";
import ProtectedRoute, {
  AdminRoute,
  GuestRoute,
} from "@/components/ProtectedRoute";
import Layout from "@/components/layout/Layout";
import AdminLayout from "@/components/admin/AdminLayout";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import FacebookPixel from "@/components/FacebookPixel";
import StructuredData from "@/components/StructuredData";
import AIMetaTags from "@/components/AIMetaTags";
import { supabase } from "@/lib/supabase";

// ScrollToTop component to handle scroll restoration
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

// Public pages
import Index from "@/pages/Index";
import Products from "@/pages/Products";
import ProductDetail from "@/pages/ProductDetail";
import About from "@/pages/About";
import Cart from "@/pages/Cart";
import Checkout from "@/pages/Checkout";
import RazorpayPayment from "@/pages/RazorpayPayment";
import TrackOrder from "@/pages/TrackOrder";
import OrderConfirmation from "@/pages/OrderConfirmation";
import CheckoutSuccess from "@/pages/CheckoutSuccess";
import Orders from "@/pages/Orders";
import Account from "@/pages/Account";
import Page from "@/pages/Page";
import NotFound from "@/pages/NotFound";

// Auth pages
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import AuthCallback from "@/pages/AuthCallback";
import AdminLogin from "@/pages/admin/Login";

// Admin pages
import Dashboard from "@/pages/admin/Dashboard";
import Analytics from "@/pages/admin/Analytics";
import AdminProducts from "@/pages/admin/Products";
import ProductEdit from "@/pages/admin/ProductEdit";
import Categories from "@/pages/admin/Categories";
import AdminOrders from "@/pages/admin/Orders";
import Customers from "@/pages/admin/Customers";
import Coupons from "@/pages/admin/Coupons";
import ShippingEnhanced from "@/pages/admin/ShippingEnhanced";
import Pages from "@/pages/admin/Pages";
import HomepageBuilder from "@/pages/admin/HomepageBuilder";
import MenuBar from "@/pages/admin/MenuBar";
import Settings from "@/pages/admin/Settings";
import Users from "@/pages/admin/Users";
import ContactSubmissions from "@/pages/admin/ContactSubmissions";
import DatabaseSetup from "@/pages/admin/DatabaseSetup";
import DatabaseTest from "@/pages/admin/DatabaseTest";
import FooterEditor from "@/pages/admin/FooterEditor";
import CategoryImageMigration from "@/pages/admin/CategoryImageMigration";

function App() {
  const [googleAnalyticsId, setGoogleAnalyticsId] = useState<string>("");
  const [facebookPixelId, setFacebookPixelId] = useState<string>("");

  // Add error handling for navigation issues
  React.useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error("App Error:", event.error);
      if (event.error?.message?.includes("IP address could not be found")) {
        console.warn("URL Resolution Error - may be due to malformed URLs");
      }
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error("Unhandled Promise Rejection:", event.reason);
    };

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleUnhandledRejection);

    // Fetch Google Analytics ID
    fetchGoogleAnalyticsId();

    // Fetch Facebook Pixel ID
    fetchFacebookPixelId();

    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener(
        "unhandledrejection",
        handleUnhandledRejection,
      );
    };
  }, []);

  async function fetchGoogleAnalyticsId() {
    try {
      const { data, error } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "google_analytics_id")
        .single();

      if (data && data.value) {
        setGoogleAnalyticsId(data.value);
      }
    } catch (error) {
      console.error("Error fetching Google Analytics ID:", error);
    }
  }

  async function fetchFacebookPixelId() {
    try {
      const { data, error } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "facebook_pixel_id")
        .single();

      if (data && data.value) {
        setFacebookPixelId(data.value);
      }
    } catch (error) {
      console.error("Error fetching Facebook Pixel ID:", error);
    }
  }

  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <ScrollToTop />
          {googleAnalyticsId && (
            <GoogleAnalytics trackingId={googleAnalyticsId} />
          )}
          {facebookPixelId && <FacebookPixel pixelId={facebookPixelId} />}
          <StructuredData type="website" />
          <StructuredData type="organization" />
          <AIMetaTags page="home" />
          <Routes>
            {/* Auth routes */}
            <Route
              path="/login"
              element={
                <GuestRoute>
                  <Login />
                </GuestRoute>
              }
            />
            <Route
              path="/signup"
              element={
                <GuestRoute>
                  <Signup />
                </GuestRoute>
              }
            />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route
              path="/admin/login"
              element={
                <GuestRoute>
                  <AdminLogin />
                </GuestRoute>
              }
            />

            {/* Public routes */}
            <Route path="/" element={<Layout />}>
              <Route index element={<Index />} />
              <Route path="products" element={<Products />} />
              <Route path="category/:slug" element={<Products />} />
              <Route path="product/:slug" element={<ProductDetail />} />
              <Route path="cart" element={<Cart />} />
              <Route path="checkout" element={<Checkout />} />
              <Route path="razorpay-payment" element={<RazorpayPayment />} />
              <Route path="checkout/success" element={<CheckoutSuccess />} />
              <Route path="track-order" element={<TrackOrder />} />
              <Route
                path="order-confirmation/:orderNumber"
                element={<OrderConfirmation />}
              />
              <Route path="orders" element={<Orders />} />
              <Route
                path="account"
                element={
                  <ProtectedRoute requireAuth={true} requireAdmin={false}>
                    <Account />
                  </ProtectedRoute>
                }
              />
              {/* Specific static routes - must come before dynamic route */}
              <Route path="about" element={<Page />} />
              <Route path="help" element={<Page />} />
              <Route path="terms" element={<Page />} />
              <Route path="privacy-policy" element={<Page />} />
              <Route
                path="privacy"
                element={<Navigate to="/privacy-policy" replace />}
              />
              <Route path="return-refunds" element={<Page />} />
              <Route
                path="returns"
                element={<Navigate to="/return-refunds" replace />}
              />
              <Route path="delivery-info" element={<Page />} />
              {/* Dynamic pages from CMS - must be last */}
              <Route path=":slug" element={<Page />} />
            </Route>

            {/* Admin routes */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminLayout />
                </AdminRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="products/new" element={<ProductEdit />} />
              <Route path="products/:id/edit" element={<ProductEdit />} />
              <Route path="categories" element={<Categories />} />
              <Route
                path="categories/migrate-images"
                element={<CategoryImageMigration />}
              />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="customers" element={<Customers />} />
              <Route path="coupons" element={<Coupons />} />
              <Route path="shipping" element={<ShippingEnhanced />} />
              <Route path="pages" element={<Pages />} />
              <Route path="footer-editor" element={<FooterEditor />} />
              <Route path="homepage" element={<HomepageBuilder />} />
              <Route path="menu-bar" element={<MenuBar />} />
              <Route path="settings" element={<Settings />} />
              <Route path="users" element={<Users />} />
              <Route
                path="contact-submissions"
                element={<ContactSubmissions />}
              />
              <Route path="database-setup" element={<DatabaseSetup />} />
              <Route path="database-test" element={<DatabaseTest />} />
            </Route>

            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
