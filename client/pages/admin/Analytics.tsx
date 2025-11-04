import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import {
  TrendingUp,
  Users,
  ShoppingCart,
  Eye,
  DollarSign,
  Package,
  AlertTriangle,
  Download,
  Calendar,
  MousePointer,
  Clock,
  ExternalLink,
  Smartphone,
  Monitor,
  Globe,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import {
  format,
  subDays,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
} from "date-fns";
import AdminGuard from "@/components/AdminGuard";

interface AnalyticsData {
  visitors: {
    total: number;
    unique: number;
    pageViews: number;
    bounceRate: number;
    avgTimeOnSite: number;
    topPages: Array<{ page: string; views: number }>;
    devices: Array<{ device: string; count: number }>;
    referrers: Array<{ source: string; count: number }>;
  };
  sales: {
    totalRevenue: number;
    totalOrders: number;
    avgOrderValue: number;
    topProducts: Array<{ name: string; sales: number; revenue: number }>;
    conversionRate: number;
    refunds: number;
    revenueByCategory: Array<{ category: string; revenue: number }>;
  };
  customers: {
    newCustomers: number;
    returningCustomers: number;
    avgOrderFrequency: number;
    topLocations: Array<{ location: string; count: number }>;
    cltv: number;
  };
  products: {
    topViewed: Array<{ name: string; views: number }>;
    cartAdds: Array<{ name: string; adds: number }>;
    lowStock: Array<{ name: string; stock: number }>;
    outOfStock: number;
  };
  funnel: {
    homepage: number;
    category: number;
    product: number;
    cart: number;
    checkout: number;
    complete: number;
  };
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

export default function Analytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState("7d");
  const [selectedTab, setSelectedTab] = useState("overview");

  useEffect(() => {
    fetchAnalyticsData();
  }, [dateRange]);

  async function fetchAnalyticsData() {
    try {
      setIsLoading(true);
      console.log("Starting analytics data fetch for date range:", dateRange);

      // Calculate date range
      const endDate = new Date();
      let startDate = new Date();

      switch (dateRange) {
        case "1d":
          startDate = startOfDay(new Date());
          break;
        case "7d":
          startDate = subDays(endDate, 7);
          break;
        case "30d":
          startDate = subDays(endDate, 30);
          break;
        case "90d":
          startDate = subDays(endDate, 90);
          break;
        default:
          startDate = subDays(endDate, 7);
      }

      console.log("Date range calculated:", { startDate, endDate });

      // Fetch real data from database with individual error handling
      const [salesData, customerData, productData, ordersData] =
        await Promise.allSettled([
          fetchSalesData(startDate, endDate),
          fetchCustomerData(startDate, endDate),
          fetchProductData(startDate, endDate),
          fetchOrdersData(startDate, endDate),
        ]).then((results) => {
          return results.map((result, index) => {
            if (result.status === "fulfilled") {
              return result.value;
            } else {
              console.error(
                `Error in analytics function ${index}:`,
                result.reason,
              );
              // Return default empty data based on function index
              switch (index) {
                case 0: // salesData
                  return {
                    totalRevenue: 0,
                    totalOrders: 0,
                    avgOrderValue: 0,
                    topProducts: [],
                    conversionRate: 0,
                    refunds: 0,
                    revenueByCategory: [],
                  };
                case 1: // customerData
                  return {
                    newCustomers: 0,
                    returningCustomers: 0,
                    avgOrderFrequency: 0,
                    topLocations: [],
                    cltv: 0,
                  };
                case 2: // productData
                  return {
                    topViewed: [],
                    cartAdds: [],
                    lowStock: [],
                    outOfStock: 0,
                  };
                case 3: // ordersData
                  return {
                    totalOrders: 0,
                  };
                default:
                  return {};
              }
            }
          });
        });

      console.log("Analytics data fetched:", {
        salesData,
        customerData,
        productData,
        ordersData,
      });

      // Since visitor tracking isn't implemented yet, show empty state
      const analyticsData: AnalyticsData = {
        visitors: {
          total: 0,
          unique: 0,
          pageViews: 0,
          bounceRate: 0,
          avgTimeOnSite: 0,
          topPages: [],
          devices: [],
          referrers: [],
        },
        sales: {
          totalRevenue: 0,
          totalOrders: 0,
          avgOrderValue: 0,
          topProducts: [],
          conversionRate: 0,
          refunds: 0,
          revenueByCategory: [],
          ...salesData,
        },
        customers: {
          newCustomers: 0,
          returningCustomers: 0,
          avgOrderFrequency: 0,
          topLocations: [],
          cltv: 0,
          ...customerData,
        },
        products: {
          topViewed: [],
          cartAdds: [],
          lowStock: [],
          outOfStock: 0,
          ...productData,
        },
        funnel: {
          homepage: 0,
          category: 0,
          product: 0,
          cart: 0,
          checkout: 0,
          complete: ordersData?.totalOrders || 0,
        },
      };

      setData(analyticsData);
      console.log("Analytics data set successfully");
    } catch (error) {
      console.error("Failed to fetch analytics data:", error.message || error);
      // Set empty data on error
      setData({
        visitors: {
          total: 0,
          unique: 0,
          pageViews: 0,
          bounceRate: 0,
          avgTimeOnSite: 0,
          topPages: [],
          devices: [],
          referrers: [],
        },
        sales: {
          totalRevenue: 0,
          totalOrders: 0,
          avgOrderValue: 0,
          topProducts: [],
          conversionRate: 0,
          refunds: 0,
          revenueByCategory: [],
        },
        customers: {
          newCustomers: 0,
          returningCustomers: 0,
          avgOrderFrequency: 0,
          topLocations: [],
          cltv: 0,
        },
        products: {
          topViewed: [],
          cartAdds: [],
          lowStock: [],
          outOfStock: 0,
        },
        funnel: {
          homepage: 0,
          category: 0,
          product: 0,
          cart: 0,
          checkout: 0,
          complete: 0,
        },
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchSalesData(startDate: Date, endDate: Date) {
    try {
      console.log("Fetching sales data for date range:", {
        startDate,
        endDate,
      });

      // First, try to fetch orders without nested select to check if table exists
      const { data: orders, error: ordersError } = await supabase
        .from("orders")
        .select("*")
        .gte("created_at", startDate.toISOString())
        .lte("created_at", endDate.toISOString());

      if (ordersError) {
        console.error("Error fetching orders:", ordersError);
        // If orders table doesn't exist or has permission issues, return empty data
        return {
          totalRevenue: 0,
          totalOrders: 0,
          avgOrderValue: 0,
          topProducts: [],
          conversionRate: 0,
          refunds: 0,
          revenueByCategory: [],
        };
      }

      console.log("Found orders:", orders?.length || 0);

      const totalRevenue =
        orders?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0;
      const totalOrders = orders?.length || 0;
      const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

      // Calculate refunds
      const refunds =
        orders?.filter(
          (order) =>
            order.status === "cancelled" || order.status === "refunded",
        ).length || 0;

      // Try to fetch order items separately (might not exist yet)
      let topProducts: Array<{ name: string; sales: number; revenue: number }> =
        [];

      try {
        const { data: orderItems, error: itemsError } = await supabase
          .from("order_items")
          .select("*")
          .in("order_id", orders?.map((order) => order.id) || []);

        if (!itemsError && orderItems) {
          // Get top products from order items
          const productSales: {
            [key: string]: { sales: number; revenue: number; name: string };
          } = {};

          orderItems.forEach((item: any) => {
            if (!productSales[item.product_id]) {
              productSales[item.product_id] = {
                sales: 0,
                revenue: 0,
                name: item.product_name || "Unknown Product",
              };
            }
            productSales[item.product_id].sales += item.quantity || 0;
            productSales[item.product_id].revenue +=
              (item.quantity || 0) * (item.price || 0);
          });

          topProducts = Object.values(productSales)
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 5);
        }
      } catch (itemsError) {
        console.log("Order items table not available yet:", itemsError);
      }

      return {
        totalRevenue,
        totalOrders,
        avgOrderValue,
        topProducts,
        conversionRate: 0, // Would need visitor tracking
        refunds,
        revenueByCategory: [], // Would need product categories
      };
    } catch (error) {
      console.error("Error fetching sales data:", error.message || error);
      return {
        totalRevenue: 0,
        totalOrders: 0,
        avgOrderValue: 0,
        topProducts: [],
        conversionRate: 0,
        refunds: 0,
        revenueByCategory: [],
      };
    }
  }

  async function fetchCustomerData(startDate: Date, endDate: Date) {
    try {
      console.log("Fetching customer data for date range:", {
        startDate,
        endDate,
      });

      // Fetch customers created in date range
      const { data: newCustomers, error: newError } = await supabase
        .from("customers")
        .select("*")
        .gte("created_at", startDate.toISOString())
        .lte("created_at", endDate.toISOString());

      if (newError) {
        console.error("Error fetching new customers:", newError);
        return {
          newCustomers: 0,
          returningCustomers: 0,
          avgOrderFrequency: 0,
          topLocations: [],
          cltv: 0,
        };
      }

      console.log("Found new customers:", newCustomers?.length || 0);

      // Try to calculate returning customers (simplified approach)
      let returningCustomers = 0;
      try {
        const { data: allCustomers, error: allError } = await supabase
          .from("customers")
          .select("id");

        if (!allError && allCustomers) {
          // Get order counts for each customer
          const { data: orderCounts, error: ordersError } = await supabase
            .from("orders")
            .select("customer_id")
            .in(
              "customer_id",
              allCustomers.map((c) => c.id),
            );

          if (!ordersError && orderCounts) {
            const customerOrderCounts: { [key: string]: number } = {};
            orderCounts.forEach((order) => {
              if (order.customer_id) {
                customerOrderCounts[order.customer_id] =
                  (customerOrderCounts[order.customer_id] || 0) + 1;
              }
            });

            returningCustomers = Object.values(customerOrderCounts).filter(
              (count) => count > 1,
            ).length;
          }
        }
      } catch (error) {
        console.log("Could not calculate returning customers:", error);
      }

      return {
        newCustomers: newCustomers?.length || 0,
        returningCustomers,
        avgOrderFrequency: 0, // Would need more complex calculation
        topLocations: [], // Would need address data
        cltv: 0, // Customer Lifetime Value calculation
      };
    } catch (error) {
      console.error("Error fetching customer data:", error.message || error);
      return {
        newCustomers: 0,
        returningCustomers: 0,
        avgOrderFrequency: 0,
        topLocations: [],
        cltv: 0,
      };
    }
  }

  async function fetchProductData(startDate: Date, endDate: Date) {
    try {
      console.log("Fetching product data");

      // Fetch products and their stock levels
      const { data: products, error } = await supabase
        .from("products")
        .select("id, name, stock_quantity");

      if (error) {
        console.error("Error fetching products:", error);
        return {
          topViewed: [],
          cartAdds: [],
          lowStock: [],
          outOfStock: 0,
        };
      }

      console.log("Found products:", products?.length || 0);

      const lowStock =
        products?.filter(
          (product) =>
            product.stock_quantity !== null &&
            product.stock_quantity > 0 &&
            product.stock_quantity < 5,
        ) || [];

      const outOfStock =
        products?.filter((product) => product.stock_quantity === 0).length || 0;

      return {
        topViewed: [], // Would need view tracking
        cartAdds: [], // Would need cart tracking
        lowStock: lowStock.map((product) => ({
          name: product.name,
          stock: product.stock_quantity || 0,
        })),
        outOfStock,
      };
    } catch (error) {
      console.error("Error fetching product data:", error.message || error);
      return {
        topViewed: [],
        cartAdds: [],
        lowStock: [],
        outOfStock: 0,
      };
    }
  }

  async function fetchOrdersData(startDate: Date, endDate: Date) {
    try {
      console.log("Fetching orders data for date range:", {
        startDate,
        endDate,
      });

      const { data: orders, error } = await supabase
        .from("orders")
        .select("id, created_at")
        .gte("created_at", startDate.toISOString())
        .lte("created_at", endDate.toISOString());

      if (error) {
        console.error("Error fetching orders:", error);
        return {
          totalOrders: 0,
        };
      }

      console.log("Found orders:", orders?.length || 0);

      return {
        totalOrders: orders?.length || 0,
      };
    } catch (error) {
      console.error("Error fetching orders data:", error.message || error);
      return {
        totalOrders: 0,
      };
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  const handleExport = () => {
    if (!data) return;

    const exportData = {
      exportDate: new Date().toISOString(),
      dateRange,
      summary: {
        totalRevenue: data.sales.totalRevenue,
        totalOrders: data.sales.totalOrders,
        newCustomers: data.customers.newCustomers,
        returningCustomers: data.customers.returningCustomers,
        avgOrderValue: data.sales.avgOrderValue,
        refunds: data.sales.refunds,
      },
      topProducts: data.sales.topProducts,
      lowStockProducts: data.products.lowStock,
    };

    // Convert to CSV
    let csv = "Analytics & Statistics Report\n";
    csv += `Exported: ${new Date().toLocaleString()}\n`;
    csv += `Date Range: ${dateRange}\n\n`;

    // Summary section
    csv += "SUMMARY\n";
    csv += `Total Revenue,${formatCurrency(data.sales.totalRevenue)}\n`;
    csv += `Total Orders,${data.sales.totalOrders}\n`;
    csv += `New Customers,${data.customers.newCustomers}\n`;
    csv += `Returning Customers,${data.customers.returningCustomers}\n`;
    csv += `Average Order Value,${formatCurrency(data.sales.avgOrderValue)}\n`;
    csv += `Refunds,${data.sales.refunds}\n\n`;

    // Top Products section
    if (data.sales.topProducts.length > 0) {
      csv += "TOP SELLING PRODUCTS\n";
      csv += "Product Name,Sales,Revenue\n";
      data.sales.topProducts.forEach((product) => {
        csv += `"${product.name}",${product.sales},${formatCurrency(product.revenue)}\n`;
      });
      csv += "\n";
    }

    // Low Stock Products section
    if (data.products.lowStock.length > 0) {
      csv += "LOW STOCK PRODUCTS\n";
      csv += "Product Name,Stock Level\n";
      data.products.lowStock.forEach((product) => {
        csv += `"${product.name}",${product.stock}\n`;
      });
      csv += "\n";
    }

    // Create and download file
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `analytics-${dateRange}-${new Date().getTime()}.csv`,
    );
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded animate-pulse w-48"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-32 bg-gray-200 rounded animate-pulse"
            ></div>
          ))}
        </div>
        <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-red-500" />
        <h3 className="text-lg font-semibold mb-2">Failed to Load Analytics</h3>
        <p className="text-muted-foreground">Please try refreshing the page.</p>
      </div>
    );
  }

  return (
    <AdminGuard>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Analytics & Statistics</h1>
            <p className="text-muted-foreground">
              Real-time insights and performance metrics for your store
            </p>
          </div>
          <div className="flex gap-2">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1d">Today</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(data.sales.totalRevenue)}
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Orders</p>
                  <p className="text-2xl font-bold">{data.sales.totalOrders}</p>
                </div>
                <ShoppingCart className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">New Customers</p>
                  <p className="text-2xl font-bold">
                    {data.customers.newCustomers}
                  </p>
                </div>
                <Users className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Avg Order Value
                  </p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(data.sales.avgOrderValue)}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Analytics Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="visitors">Visitors</TabsTrigger>
            <TabsTrigger value="sales">Sales</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Products */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Selling Products</CardTitle>
                </CardHeader>
                <CardContent>
                  {data.sales.topProducts.length > 0 ? (
                    <div className="space-y-4">
                      {data.sales.topProducts.map((product, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center"
                        >
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {product.sales} sold
                            </p>
                          </div>
                          <p className="font-bold">
                            {formatCurrency(product.revenue)}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Package className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">No sales data yet</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Low Stock Alert */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-orange-500" />
                    Inventory Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {data.products.lowStock.length > 0 ||
                  data.products.outOfStock > 0 ? (
                    <div className="space-y-4">
                      {data.products.outOfStock > 0 && (
                        <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                          <p className="text-red-800 font-medium">
                            {data.products.outOfStock} products out of stock
                          </p>
                        </div>
                      )}
                      {data.products.lowStock
                        .slice(0, 5)
                        .map((product, index) => (
                          <div
                            key={index}
                            className="flex justify-between items-center"
                          >
                            <p className="font-medium">{product.name}</p>
                            <Badge variant="destructive">
                              {product.stock} left
                            </Badge>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Package className="w-12 h-12 mx-auto mb-4 text-green-600" />
                      <p className="text-muted-foreground">
                        All products well stocked
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="visitors" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                      Total Visitors
                    </p>
                    <p className="text-3xl font-bold">{data.visitors.total}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Visitor tracking not yet implemented
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Page Views</p>
                    <p className="text-3xl font-bold">
                      {data.visitors.pageViews}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Page tracking coming soon
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Bounce Rate</p>
                    <p className="text-3xl font-bold">
                      {data.visitors.bounceRate}%
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Analytics setup required
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Visitor Analytics Setup Required</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Eye className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">
                    No Visitor Data Yet
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    To track visitors, page views, and user behavior, we need to
                    implement analytics tracking.
                  </p>
                  <div className="text-left max-w-md mx-auto">
                    <p className="text-sm text-muted-foreground mb-2">
                      Features to implement:
                    </p>
                    <ul className="text-sm space-y-1">
                      <li>• Page view tracking</li>
                      <li>• Session management</li>
                      <li>• Device/browser detection</li>
                      <li>• Referrer tracking</li>
                      <li>• Time on site measurement</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sales" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Sales Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  {data.sales.totalOrders > 0 ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Total Revenue
                          </p>
                          <p className="text-2xl font-bold">
                            {formatCurrency(data.sales.totalRevenue)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Total Orders
                          </p>
                          <p className="text-2xl font-bold">
                            {data.sales.totalOrders}
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Avg Order Value
                          </p>
                          <p className="text-xl font-semibold">
                            {formatCurrency(data.sales.avgOrderValue)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Refunds
                          </p>
                          <p className="text-xl font-semibold">
                            {data.sales.refunds}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <ShoppingCart className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">No sales data yet</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Revenue by Product</CardTitle>
                </CardHeader>
                <CardContent>
                  {data.sales.topProducts.length > 0 ? (
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={data.sales.topProducts}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip
                          formatter={(value) => formatCurrency(Number(value))}
                        />
                        <Bar dataKey="revenue" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="text-center py-8">
                      <BarChart className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">
                        No product sales yet
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="products" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Inventory Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                      <span>Out of Stock</span>
                      <Badge variant="destructive">
                        {data.products.outOfStock} products
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                      <span>Low Stock (&lt;5 items)</span>
                      <Badge variant="secondary">
                        {data.products.lowStock.length} products
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Product Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <MousePointer className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">
                      Product Tracking Needed
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      To track product views and cart additions, implement
                      product analytics
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="customers" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                      New Customers
                    </p>
                    <p className="text-3xl font-bold">
                      {data.customers.newCustomers}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      In selected time period
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                      Returning Customers
                    </p>
                    <p className="text-3xl font-bold">
                      {data.customers.returningCustomers}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Customers with multiple orders
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Customer Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">
                    Enhanced Customer Analytics Coming Soon
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Features like customer location tracking, lifetime value,
                    and behavior analysis will be added
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminGuard>
  );
}
