import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import Layout from "@/components/layout/Layout";
import AdminLayout from "@/components/admin/AdminLayout";

// Public pages
import Index from "@/pages/Index";
import Products from "@/pages/Products";
import ProductDetail from "@/pages/ProductDetail";
import Cart from "@/pages/Cart";
import Checkout from "@/pages/Checkout";

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
import DatabaseTest from "@/pages/admin/DatabaseTest";

function App() {
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
            <Route path="homepage" element={<HomepageBuilder />} />
            <Route path="settings" element={<Settings />} />
            <Route path="users" element={<Users />} />
            <Route path="database-test" element={<DatabaseTest />} />
          </Route>
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
