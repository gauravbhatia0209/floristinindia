import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { Layout } from "@/components/layout/Layout";
import Index from "./pages/Index";
import Products from "./pages/Products";
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
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </CartProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
