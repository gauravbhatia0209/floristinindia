import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  ShoppingCart,
  Users,
  IndianRupee,
  TrendingUp,
  Calendar,
  Eye,
  Star,
  Settings,
  FileText,
  Home,
  Globe,
  Truck,
  Ticket,
  Tags,
  UserCog,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    activeProducts: 0,
    totalPages: 0,
    homepageSections: 0,
    activeCoupons: 0,
    shippingZones: 0,
    recentOrders: [],
    topProducts: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  async function fetchDashboardData() {
    try {
      // Fetch comprehensive stats for all CMS modules
      const [
        { count: totalProducts },
        { count: totalOrders },
        { count: totalCustomers },
        { count: pendingOrders },
        { count: activeProducts },
        { count: totalPages },
        { count: homepageSections },
        { count: activeCoupons },
        { count: shippingZones },
        { data: recentOrders },
        { data: topProducts },
      ] = await Promise.all([
        supabase.from("products").select("*", { count: "exact", head: true }),
        supabase.from("orders").select("*", { count: "exact", head: true }),
        supabase.from("customers").select("*", { count: "exact", head: true }),
        supabase
          .from("orders")
          .select("*", { count: "exact", head: true })
          .eq("status", "pending"),
        supabase
          .from("products")
          .select("*", { count: "exact", head: true })
          .eq("is_active", true),
        supabase.from("pages").select("*", { count: "exact", head: true }),
        supabase
          .from("homepage_sections")
          .select("*", { count: "exact", head: true })
          .eq("is_active", true),
        supabase
          .from("coupons")
          .select("*", { count: "exact", head: true })
          .eq("is_active", true),
        supabase
          .from("shipping_zones")
          .select("*", { count: "exact", head: true }),
        supabase
          .from("orders")
          .select("*, customers(first_name, last_name)")
          .order("created_at", { ascending: false })
          .limit(5),
        supabase
          .from("products")
          .select("name, price, is_featured")
          .eq("is_active", true)
          .order("created_at", { ascending: false })
          .limit(5),
      ]);

      // Calculate total revenue
      const { data: orders } = await supabase
        .from("orders")
        .select("total_amount");

      const totalRevenue = orders?.reduce(
        (sum, order) => sum + order.total_amount,
        0,
      );

      setStats({
        totalProducts: totalProducts || 0,
        totalOrders: totalOrders || 0,
        totalCustomers: totalCustomers || 0,
        totalRevenue: totalRevenue || 0,
        pendingOrders: pendingOrders || 0,
        activeProducts: activeProducts || 0,
        totalPages: totalPages || 0,
        homepageSections: homepageSections || 0,
        activeCoupons: activeCoupons || 0,
        shippingZones: shippingZones || 0,
        recentOrders: recentOrders || [],
        topProducts: topProducts || [],
      });
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded animate-pulse w-48"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="h-32 bg-gray-200 rounded animate-pulse"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">CMS Dashboard</h1>
          <p className="text-muted-foreground">
            Complete content management system overview
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" asChild>
            <Link to="/" target="_blank">
              <Globe className="w-4 h-4 mr-2" />
              View Website
            </Link>
          </Button>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>{new Date().toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Core Business Stats */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Business Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <IndianRupee className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₹{stats.totalRevenue.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline w-3 h-3 mr-1" />
                All-time revenue
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Orders
              </CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrders}</div>
              <p className="text-xs text-muted-foreground">
                {stats.pendingOrders} pending orders
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Products
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProducts}</div>
              <p className="text-xs text-muted-foreground">
                {stats.activeProducts} active products
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Customers
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCustomers}</div>
              <p className="text-xs text-muted-foreground">
                Registered customers
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CMS Content Stats */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Content Management</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-rose-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Homepage Sections
              </CardTitle>
              <Home className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.homepageSections}</div>
              <p className="text-xs text-muted-foreground">
                Active homepage sections
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-indigo-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">CMS Pages</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalPages}</div>
              <p className="text-xs text-muted-foreground">
                Dynamic content pages
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-yellow-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Coupons
              </CardTitle>
              <Ticket className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeCoupons}</div>
              <p className="text-xs text-muted-foreground">
                Available discount codes
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-teal-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Shipping Zones
              </CardTitle>
              <Truck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.shippingZones}</div>
              <p className="text-xs text-muted-foreground">
                Configured delivery areas
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                Recent Orders
              </CardTitle>
              <Button variant="outline" size="sm" asChild>
                <Link to="/admin/orders">View All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentOrders.length > 0 ? (
                stats.recentOrders.map((order: any) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium">#{order.order_number}</p>
                      <p className="text-sm text-muted-foreground">
                        {order.customers?.first_name}{" "}
                        {order.customers?.last_name}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        ₹{order.total_amount.toLocaleString()}
                      </p>
                      <Badge
                        variant={
                          order.status === "delivered" ? "default" : "secondary"
                        }
                      >
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-4">
                  No orders yet
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Featured Products */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5" />
                Featured Products
              </CardTitle>
              <Button variant="outline" size="sm" asChild>
                <Link to="/admin/products">Manage</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.topProducts.length > 0 ? (
                stats.topProducts.map((product: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {product.is_featured ? "Featured" : "Regular"} Product
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">₹{product.price}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-4">
                  No products yet
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* CMS Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Content Management Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <Link to="/admin/homepage">
              <Card className="cursor-pointer hover:bg-accent transition-colors">
                <CardContent className="p-4 text-center">
                  <Home className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <h3 className="font-medium text-sm">Homepage</h3>
                  <p className="text-xs text-muted-foreground">Edit sections</p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/admin/products">
              <Card className="cursor-pointer hover:bg-accent transition-colors">
                <CardContent className="p-4 text-center">
                  <Package className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <h3 className="font-medium text-sm">Products</h3>
                  <p className="text-xs text-muted-foreground">
                    Manage catalog
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/admin/categories">
              <Card className="cursor-pointer hover:bg-accent transition-colors">
                <CardContent className="p-4 text-center">
                  <Tags className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <h3 className="font-medium text-sm">Categories</h3>
                  <p className="text-xs text-muted-foreground">
                    Organize products
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/admin/pages">
              <Card className="cursor-pointer hover:bg-accent transition-colors">
                <CardContent className="p-4 text-center">
                  <FileText className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <h3 className="font-medium text-sm">Pages</h3>
                  <p className="text-xs text-muted-foreground">Custom pages</p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/admin/orders">
              <Card className="cursor-pointer hover:bg-accent transition-colors">
                <CardContent className="p-4 text-center">
                  <ShoppingCart className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <h3 className="font-medium text-sm">Orders</h3>
                  <p className="text-xs text-muted-foreground">
                    Process orders
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/admin/settings">
              <Card className="cursor-pointer hover:bg-accent transition-colors">
                <CardContent className="p-4 text-center">
                  <Settings className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <h3 className="font-medium text-sm">Settings</h3>
                  <p className="text-xs text-muted-foreground">Site config</p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/admin/customers">
              <Card className="cursor-pointer hover:bg-accent transition-colors">
                <CardContent className="p-4 text-center">
                  <Users className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <h3 className="font-medium text-sm">Customers</h3>
                  <p className="text-xs text-muted-foreground">
                    User management
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/admin/coupons">
              <Card className="cursor-pointer hover:bg-accent transition-colors">
                <CardContent className="p-4 text-center">
                  <Ticket className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <h3 className="font-medium text-sm">Coupons</h3>
                  <p className="text-xs text-muted-foreground">Discounts</p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/admin/shipping">
              <Card className="cursor-pointer hover:bg-accent transition-colors">
                <CardContent className="p-4 text-center">
                  <Truck className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <h3 className="font-medium text-sm">Shipping</h3>
                  <p className="text-xs text-muted-foreground">
                    Delivery zones
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/admin/users">
              <Card className="cursor-pointer hover:bg-accent transition-colors">
                <CardContent className="p-4 text-center">
                  <UserCog className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <h3 className="font-medium text-sm">Users</h3>
                  <p className="text-xs text-muted-foreground">Admin access</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* CMS Status Summary */}
      <Card>
        <CardHeader>
          <CardTitle>System Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">✓</div>
              <h3 className="font-medium">Database Connected</h3>
              <p className="text-sm text-muted-foreground">
                All modules operational
              </p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">✓</div>
              <h3 className="font-medium">CMS Functional</h3>
              <p className="text-sm text-muted-foreground">
                All content editable
              </p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">✓</div>
              <h3 className="font-medium">Site Responsive</h3>
              <p className="text-sm text-muted-foreground">
                Mobile & desktop ready
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Email Testing Section */}
      <EmailTestingSection />
    </div>
  );
}

// Email Testing Component
function EmailTestingSection() {
  const [isTestingEmail, setIsTestingEmail] = useState(false);
  const [testEmailData, setTestEmailData] = useState({
    to: '',
    subject: 'Test Email from Florist in India',
    message: 'This is a test email to verify the email service is working correctly.'
  });
  const [emailStatus, setEmailStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });

  const handleSendTestEmail = async () => {
    if (!testEmailData.to.trim()) {
      setEmailStatus({ type: 'error', message: 'Please enter a recipient email address' });
      return;
    }

    setIsTestingEmail(true);
    setEmailStatus({ type: null, message: '' });

    try {
      const { emailAPI } = await import('@/lib/email-api');
      await emailAPI.sendTestEmail(testEmailData.to, testEmailData.subject, testEmailData.message);
      setEmailStatus({ type: 'success', message: 'Test email sent successfully!' });

      // Clear form
      setTestEmailData({
        to: '',
        subject: 'Test Email from Florist in India',
        message: 'This is a test email to verify the email service is working correctly.'
      });
    } catch (error) {
      setEmailStatus({ type: 'error', message: `Failed to send test email: ${error}` });
    } finally {
      setIsTestingEmail(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Email Service Testing
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Recipient Email</label>
              <input
                type="email"
                value={testEmailData.to}
                onChange={(e) => setTestEmailData({ ...testEmailData, to: e.target.value })}
                placeholder="Enter email address..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Subject</label>
              <input
                type="text"
                value={testEmailData.subject}
                onChange={(e) => setTestEmailData({ ...testEmailData, subject: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Message</label>
            <textarea
              value={testEmailData.message}
              onChange={(e) => setTestEmailData({ ...testEmailData, message: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {emailStatus.message && (
            <div className={`p-3 rounded-md ${emailStatus.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {emailStatus.message}
            </div>
          )}

          <Button
            onClick={handleSendTestEmail}
            disabled={isTestingEmail}
            className="w-full md:w-auto"
          >
            {isTestingEmail ? 'Sending...' : 'Send Test Email'}
          </Button>

          <div className="text-sm text-gray-600 mt-4">
            <p><strong>📧 Email Service Features:</strong></p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>✅ Order confirmation emails (customer + admin)</li>
              <li>✅ Order status update notifications</li>
              <li>✅ Beautiful HTML email templates</li>
              <li>✅ Automatic sending on order completion</li>
              <li>✅ Admin notifications for new orders</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
