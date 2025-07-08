import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { Layout } from "@/components/layout/Layout";
import { AdminLayout } from "@/components/admin/AdminLayout";
import Index from "./pages/Index";
import Products from "./pages/Products";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminProducts from "./pages/admin/Products";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <CartProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Layout />}>
              <Route index element={<Index />} />
              <Route path="products" element={<Products />} />
              <Route path="category/:slug" element={<Products />} />
              {/* Placeholder routes for future implementation */}
              <Route
                path="product/:slug"
                element={
                  <div className="container py-12">
                    <h1>Product Details - Coming Soon</h1>
                  </div>
                }
              />
              <Route
                path="cart"
                element={
                  <div className="container py-12">
                    <h1>Shopping Cart - Coming Soon</h1>
                  </div>
                }
              />
              <Route
                path="wishlist"
                element={
                  <div className="container py-12">
                    <h1>Wishlist - Coming Soon</h1>
                  </div>
                }
              />
              <Route
                path="account"
                element={
                  <div className="container py-12">
                    <h1>My Account - Coming Soon</h1>
                  </div>
                }
              />
              <Route
                path="checkout"
                element={
                  <div className="container py-12">
                    <h1>Checkout - Coming Soon</h1>
                  </div>
                }
              />
              <Route
                path="about"
                element={
                  <div className="container py-12">
                    <h1>About Us - Coming Soon</h1>
                  </div>
                }
              />
              <Route
                path="contact"
                element={
                  <div className="container py-12">
                    <h1>Contact Us - Coming Soon</h1>
                  </div>
                }
              />
            </Route>

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route
                path="categories"
                element={
                  <div className="p-8">
                    <h1 className="text-2xl font-bold">
                      Categories Management - Coming Soon
                    </h1>
                  </div>
                }
              />
              <Route
                path="orders"
                element={
                  <div className="p-8">
                    <h1 className="text-2xl font-bold">
                      Orders Management - Coming Soon
                    </h1>
                  </div>
                }
              />
              <Route
                path="customers"
                element={
                  <div className="p-8">
                    <h1 className="text-2xl font-bold">
                      Customers Management - Coming Soon
                    </h1>
                  </div>
                }
              />
              <Route
                path="coupons"
                element={
                  <div className="p-8">
                    <h1 className="text-2xl font-bold">
                      Coupons Management - Coming Soon
                    </h1>
                  </div>
                }
              />
              <Route
                path="shipping"
                element={
                  <div className="p-8">
                    <h1 className="text-2xl font-bold">
                      Shipping Management - Coming Soon
                    </h1>
                  </div>
                }
              />
              <Route
                path="pages"
                element={
                  <div className="p-8">
                    <h1 className="text-2xl font-bold">
                      Pages Management - Coming Soon
                    </h1>
                  </div>
                }
              />
              <Route
                path="homepage"
                element={
                  <div className="p-8">
                    <h1 className="text-2xl font-bold">
                      Homepage Builder - Coming Soon
                    </h1>
                  </div>
                }
              />
              <Route
                path="settings"
                element={
                  <div className="p-8">
                    <h1 className="text-2xl font-bold">
                      Site Settings - Coming Soon
                    </h1>
                  </div>
                }
              />
              <Route
                path="users"
                element={
                  <div className="p-8">
                    <h1 className="text-2xl font-bold">
                      User Management - Coming Soon
                    </h1>
                  </div>
                }
              />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </CartProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
