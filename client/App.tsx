import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import Layout from "@/components/layout/Layout";
import AdminLayout from "@/components/admin/AdminLayout";

// Public pages
import Index from "@/pages/Index";
import Products from "@/pages/Products";
import ProductDetail from "@/pages/ProductDetail";
import About from "@/pages/About";
import Cart from "@/pages/Cart";
import Checkout from "@/pages/Checkout";
import TrackOrder from "@/pages/TrackOrder";
import OrderConfirmation from "@/pages/OrderConfirmation";
import Page from "@/pages/Page";
import NotFound from "@/pages/NotFound";

// Admin pages
import Dashboard from "@/pages/admin/Dashboard";
import AdminProducts from "@/pages/admin/Products";
import ProductEdit from "@/pages/admin/ProductEdit";
import Categories from "@/pages/admin/Categories";
import Orders from "@/pages/admin/Orders";
import Customers from "@/pages/admin/Customers";
import Coupons from "@/pages/admin/Coupons";
import Shipping from "@/pages/admin/Shipping";
import Pages from "@/pages/admin/Pages";
import HomepageBuilder from "@/pages/admin/HomepageBuilder";
import Settings from "@/pages/admin/Settings";
import Users from "@/pages/admin/Users";
import ContactSubmissions from "@/pages/admin/ContactSubmissions";
import DatabaseSetup from "@/pages/admin/DatabaseSetup";
import DatabaseTest from "@/pages/admin/DatabaseTest";
import FooterEditor from "@/pages/admin/FooterEditor";

function App() {
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

    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener(
        "unhandledrejection",
        handleUnhandledRejection,
      );
    };
  }, []);

  return (
    <CartProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Index />} />
            <Route path="products" element={<Products />} />
            <Route path="category/:slug" element={<Products />} />
            <Route path="product/:slug" element={<ProductDetail />} />
            <Route path="cart" element={<Cart />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="track-order" element={<TrackOrder />} />
            <Route
              path="order-confirmation/:orderId"
              element={<OrderConfirmation />}
            />
            {/* Specific static routes - must come before dynamic route */}
            <Route path="about" element={<Page />} />
            <Route path="help" element={<Page />} />
            <Route path="terms" element={<Page />} />
            <Route path="privacy-policy" element={<Page />} />
            <Route path="return-refunds" element={<Page />} />
            <Route path="delivery-info" element={<Page />} />
            {/* Dynamic pages from CMS - must be last */}
            <Route path=":slug" element={<Page />} />
          </Route>

          {/* Admin routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="products/new" element={<ProductEdit />} />
            <Route path="products/:id/edit" element={<ProductEdit />} />
            <Route path="categories" element={<Categories />} />
            <Route path="orders" element={<Orders />} />
            <Route path="customers" element={<Customers />} />
            <Route path="coupons" element={<Coupons />} />
            <Route path="shipping" element={<Shipping />} />
            <Route path="pages" element={<Pages />} />
            <Route path="footer-editor" element={<FooterEditor />} />
            <Route path="homepage" element={<HomepageBuilder />} />
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
  );
}

export default App;
