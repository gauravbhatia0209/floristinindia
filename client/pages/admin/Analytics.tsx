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
// Removed recharts - using Tailwind CSS visualizations instead
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
  startOfYear,
  endOfYear,
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
  const [customStartDate, setCustomStartDate] = useState<string>("");
  const [customEndDate, setCustomEndDate] = useState<string>("");
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);

  useEffect(() => {
    fetchAnalyticsData();
  }, [dateRange]);

  async function fetchAnalyticsData() {
    try {
      setIsLoading(true);
      console.log("Starting analytics data fetch for date range:", dateRange);

      // Calculate date range
      let endDate = new Date();
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
        case "1y":
          startDate = startOfYear(new Date());
          break;
        case "custom":
          if (customStartDate && customEndDate) {
            startDate = new Date(customStartDate);
            endDate = new Date(customEndDate);
          } else {
            // Fallback to last 7 days if custom dates not set
            startDate = subDays(endDate, 7);
          }
          break;
        default:
          startDate = subDays(endDate, 7);
      }

      console.log("Date range calculated:", { startDate, endDate });

      // Fetch real data from database with individual error handling
      const [salesData, customerData, productData, ordersData, visitorData] =
        await Promise.allSettled([
          fetchSalesData(startDate, endDate),
          fetchCustomerData(startDate, endDate),
          fetchProductData(startDate, endDate),
          fetchOrdersData(startDate, endDate),
          fetchVisitorData(),
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
                case 4: // visitorData
                  return {
                    total: 0,
                    unique: 0,
                    pageViews: 0,
                    bounceRate: 0,
                    avgTimeOnSite: 0,
                    topPages: [],
                    devices: [],
                    referrers: [],
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
        visitorData,
      });

      const analyticsData: AnalyticsData = {
        visitors: {
          total: visitorData?.total || 0,
          unique: visitorData?.unique || 0,
          pageViews: visitorData?.pageViews || 0,
          bounceRate: visitorData?.bounceRate || 0,
          avgTimeOnSite: visitorData?.avgTimeOnSite || 0,
          topPages: visitorData?.topPages || [],
          devices: visitorData?.devices || [],
          referrers: visitorData?.referrers || [],
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
      console.log("=== SALES DATA FETCH START ===");
      console.log("Fetching sales data for date range:", {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      });

      // First, try to fetch orders without nested select to check if table exists
      const { data: orders, error: ordersError } = await supabase
        .from("orders")
        .select("id, total_amount, status, items, created_at, customer_id, customer_email, customer_phone")
        .gte("created_at", startDate.toISOString())
        .lte("created_at", endDate.toISOString());

      if (ordersError) {
        console.error(
          "❌ Error fetching orders:",
          ordersError.message || ordersError,
        );
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

      console.log("✅ Found orders:", orders?.length || 0);
      if (orders && orders.length > 0) {
        console.log(
          "Order details:",
          orders.map((o) => ({ id: o.id, total: o.total_amount, status: o.status })),
        );
      }

      // Filter to only include confirmed orders (exclude pending)
      const confirmedOrders =
        orders?.filter((order) => order.status !== "pending") || [];

      console.log("✅ Confirmed orders (excluding pending):", confirmedOrders.length);

      const totalRevenue =
        confirmedOrders?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0;
      const totalOrders = confirmedOrders?.length || 0;
      const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

      // Calculate refunds
      const refunds =
        confirmedOrders?.filter(
          (order) =>
            order.status === "cancelled" || order.status === "refunded",
        ).length || 0;

      // Try to fetch order items separately (might not exist yet)
      let topProducts: Array<{ name: string; sales: number; revenue: number }> =
        [];

      if (confirmedOrders && confirmedOrders.length > 0) {
        try {
          console.log("📦 Fetching order items for", confirmedOrders.length, "confirmed orders");

          const orderIds = confirmedOrders.map((order: any) => order.id).filter(Boolean);
          console.log("Order IDs to fetch items for:", orderIds);

          if (orderIds.length > 0) {
            const { data: orderItems, error: itemsError } = await supabase
              .from("order_items")
              .select("*")
              .in("order_id", orderIds);

            if (itemsError) {
              console.error(
                "❌ Error fetching order items:",
                itemsError.message ||
                  itemsError.details ||
                  JSON.stringify(itemsError),
              );
            } else if (orderItems && orderItems.length > 0) {
              console.log("✅ Found order items:", orderItems.length);
              console.log(
                "Order items details:",
                orderItems.map((oi) => ({
                  product_id: oi.product_id,
                  product_name: oi.product_name,
                  quantity: oi.quantity,
                  price: oi.price,
                  order_id: oi.order_id,
                })),
              );

              // Get top products from order items
              const productSales: {
                [key: string]: { sales: number; revenue: number; name: string };
              } = {};

              orderItems.forEach((item: any) => {
                const productId = item.product_id || "unknown";
                if (!productSales[productId]) {
                  productSales[productId] = {
                    sales: 0,
                    revenue: 0,
                    name:
                      item.product_name || item.name || `Product ${productId}`,
                  };
                }
                productSales[productId].sales += item.quantity || 0;
                productSales[productId].revenue +=
                  (item.quantity || 0) * (item.price || 0);
              });

              topProducts = Object.values(productSales)
                .sort((a, b) => b.revenue - a.revenue)
                .slice(0, 5);

              console.log("✅ Processed top products:", topProducts);
              console.log("📊 All product sales aggregated:", productSales);

              // Detailed breakdown for debugging
              console.log("🔍 Product Sales Breakdown:");
              Object.entries(productSales).forEach(([productId, data]) => {
                console.log(`  - ${data.name} (ID: ${productId}): ${data.sales} sold, ₹${data.revenue.toFixed(2)} revenue`);
              });
            } else {
              console.log("⚠️ No order items found for the given orders");
              console.log("📊 Confirmed orders with no items:", orderIds);
              // Check which orders have no items
              const { data: existingItems } = await supabase
                .from("order_items")
                .select("order_id")
                .in("order_id", orderIds);
              const itemsOrderIds = new Set(existingItems?.map((i: any) => i.order_id) || []);
              const ordersWithoutItems = orderIds.filter((oid) => !itemsOrderIds.has(oid));
              console.log("🔍 Orders without items in DB:", ordersWithoutItems);
            }
          } else {
            console.log("⚠️ No valid order IDs to fetch items for");
          }
        } catch (itemsError) {
          console.error("❌ Error processing order items:", itemsError);
        }
      } else {
        console.log("⚠️ No orders found in date range");
      }

      console.log("=== SALES DATA FETCH END ===");

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
      console.log("Fetching product data for date range:", { startDate, endDate });

      // Fetch orders within date range
      const { data: ordersInRange, error: ordersError } = await supabase
        .from("orders")
        .select("id")
        .gte("created_at", startDate.toISOString())
        .lte("created_at", endDate.toISOString());

      if (ordersError) {
        console.error("Error fetching orders for product stats:", ordersError);
        // Still fetch general product info
      }

      // Fetch order items for the orders in the date range
      let topProducts = [];
      if (ordersInRange && ordersInRange.length > 0) {
        const orderIds = ordersInRange.map((o) => o.id);
        const { data: orderItems, error: itemsError } = await supabase
          .from("order_items")
          .select("product_id, product_name, quantity")
          .in("order_id", orderIds);

        if (!itemsError && orderItems && orderItems.length > 0) {
          // Group by product and sum quantities
          const productMap: {
            [key: string]: { name: string; quantity: number };
          } = {};

          orderItems.forEach((item) => {
            const productId = item.product_id || "unknown";
            if (!productMap[productId]) {
              productMap[productId] = {
                name: item.product_name || "Unknown Product",
                quantity: 0,
              };
            }
            productMap[productId].quantity += item.quantity || 1;
          });

          // Convert to array and sort by quantity
          topProducts = Object.entries(productMap)
            .map(([id, data]) => ({
              name: data.name,
              views: data.quantity,
            }))
            .sort((a, b) => b.views - a.views)
            .slice(0, 5);

          console.log("Top products in date range:", topProducts);
        }
      }

      // Fetch all products for stock levels (not date-filtered)
      const { data: products, error } = await supabase
        .from("products")
        .select("id, name, stock_quantity");

      if (error) {
        console.error("Error fetching products:", error);
        return {
          topViewed: topProducts,
          cartAdds: topProducts,
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
        topViewed: topProducts, // Now uses actual order data from date range
        cartAdds: topProducts, // Now uses actual order data from date range
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
        .select("id, created_at, status")
        .gte("created_at", startDate.toISOString())
        .lte("created_at", endDate.toISOString());

      if (error) {
        console.error("Error fetching orders:", error);
        return {
          totalOrders: 0,
        };
      }

      console.log("Found all orders:", orders?.length || 0);

      // Filter to only confirmed orders (exclude pending)
      const confirmedOrders = orders?.filter((order) => order.status !== "pending") || [];
      console.log("Confirmed orders (excluding pending):", confirmedOrders.length);

      return {
        totalOrders: confirmedOrders.length,
      };
    } catch (error) {
      console.error("Error fetching orders data:", error.message || error);
      return {
        totalOrders: 0,
      };
    }
  }

  async function fetchVisitorData() {
    try {
      console.log("Fetching visitor analytics");

      const response = await fetch(
        `/api/visitor-analytics/analytics?dateRange=${dateRange}`,
      );

      if (!response.ok) {
        console.error("Error fetching visitor analytics:", response.statusText);
        return {
          total: 0,
          unique: 0,
          pageViews: 0,
          bounceRate: 0,
          avgTimeOnSite: 0,
          topPages: [],
          devices: [],
          referrers: [],
        };
      }

      const data = await response.json();
      console.log("Visitor analytics fetched:", data);

      return data;
    } catch (error) {
      console.error("Error fetching visitor data:", error.message || error);
      return {
        total: 0,
        unique: 0,
        pageViews: 0,
        bounceRate: 0,
        avgTimeOnSite: 0,
        topPages: [],
        devices: [],
        referrers: [],
      };
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  const handleDatabaseDiagnostics = async () => {
    try {
      console.log("🔍 Starting database diagnostics for order items...");

      // Get ALL orders in system
      const { data: allOrders } = await supabase
        .from("orders")
        .select("id, customer_id, items, total_amount, status, created_at")
        .order("created_at", { ascending: false })
        .limit(100);

      if (!allOrders) {
        console.log("No orders found");
        return;
      }

      console.log(`📊 Total orders found: ${allOrders.length}`);

      // Check which orders have items in order_items table
      const { data: dbOrderItems } = await supabase
        .from("order_items")
        .select("order_id");

      const ordersWithItems = new Set(dbOrderItems?.map((i: any) => i.order_id) || []);

      // Find orders without order_items records
      const ordersWithoutItems = allOrders.filter(
        (order) => !ordersWithItems.has(order.id)
      );

      console.log(`✅ Orders with items in order_items table: ${ordersWithItems.size}`);
      console.log(`❌ Orders WITHOUT items in order_items table: ${ordersWithoutItems.length}`);

      if (ordersWithoutItems.length > 0) {
        console.log("📋 Orders without items:", ordersWithoutItems.map(o => ({
          id: o.id,
          status: o.status,
          items: o.items,
          total: o.total_amount,
          created: o.created_at
        })));

        // Try to populate missing items from orders.items JSON
        const confirmPopulate = window.confirm(
          `Found ${ordersWithoutItems.length} orders without items in the order_items table.\n\n` +
          "This can happen when orders are created without properly saving the items.\n\n" +
          "Would you like to attempt to populate the missing order items from the order data?\n\n" +
          "This will create order_items records for orders that have item data but no order_items records."
        );

        if (confirmPopulate) {
          await populateMissingOrderItems(ordersWithoutItems);
        }
      }
    } catch (error) {
      console.error("Error running diagnostics:", error);
    }
  };

  const populateMissingOrderItems = async (ordersWithoutItems: any[]) => {
    try {
      console.log(`🔧 Attempting to populate ${ordersWithoutItems.length} orders...`);

      // First, fetch all existing products to validate product_ids
      const { data: allProducts } = await supabase
        .from("products")
        .select("id, name");

      const validProductIds = new Set(allProducts?.map((p: any) => p.id) || []);
      const productNameMap: { [key: string]: string } = {};
      allProducts?.forEach((p: any) => {
        productNameMap[p.id] = p.name;
      });

      console.log(`📊 Found ${validProductIds.size} products in database`);

      let populatedCount = 0;
      let skippedCount = 0;
      let errorDetails: any[] = [];

      for (const order of ordersWithoutItems) {
        if (!order.items || !Array.isArray(order.items) || order.items.length === 0) {
          console.log(`⏭️  Skipping order ${order.id} - no items data`);
          console.log(`   Order items field:`, order.items);
          skippedCount++;
          continue;
        }

        try {
          // Validate and prepare order_items records
          const itemsToInsert = order.items
            .map((item: any) => {
              const productId = item.product_id || item.id;
              const isValidProduct = validProductIds.has(productId);

              if (!isValidProduct) {
                console.warn(`⚠️  Order ${order.id} - Product ID ${productId} not found in products table`);
                return null;
              }

              return {
                order_id: order.id,
                product_id: productId,
                product_name: item.product_name || item.name || productNameMap[productId] || "Unknown Product",
                quantity: parseInt(item.quantity || "1", 10),
                price: parseFloat(item.price || "0"),
              };
            })
            .filter((item: any) => item !== null);

          if (itemsToInsert.length === 0) {
            console.log(`⏭️  Skipping order ${order.id} - no valid products found`);
            skippedCount++;
            continue;
          }

          console.log(`📦 Order ${order.id} - inserting ${itemsToInsert.length} items:`, itemsToInsert);

          const { data: insertData, error: insertError } = await supabase
            .from("order_items")
            .insert(itemsToInsert);

          if (insertError) {
            const errorMsg = insertError.message || JSON.stringify(insertError);
            console.error(`❌ Failed to populate order ${order.id}:`, {
              message: errorMsg,
              details: (insertError as any).details,
              hint: (insertError as any).hint,
              code: (insertError as any).code,
            });
            errorDetails.push({
              orderId: order.id,
              error: errorMsg,
              itemCount: itemsToInsert.length,
            });
          } else {
            console.log(`✅ Populated order ${order.id} with ${itemsToInsert.length} items`);
            populatedCount++;
          }
        } catch (error: any) {
          const errorMsg = error?.message || String(error);
          console.error(`❌ Error processing order ${order.id}:`, {
            message: errorMsg,
            stack: error?.stack,
          });
          errorDetails.push({
            orderId: order.id,
            error: errorMsg,
            isException: true,
          });
        }
      }

      console.log(`\n📈 Populate complete: ${populatedCount} orders updated, ${skippedCount} skipped`);

      if (errorDetails.length > 0) {
        console.log("\n❌ Error Details:");
        errorDetails.forEach(err => {
          console.log(`  Order ${err.orderId}: ${err.error}`);
        });
      }

      // Refresh analytics after population
      if (populatedCount > 0) {
        alert(`Successfully populated ${populatedCount} orders.\n\nRefreshing analytics...`);
        fetchAnalyticsData();
      } else if (errorDetails.length > 0) {
        console.log("\n💡 Check the console for detailed error information");
        alert(`Failed to populate orders. Check the browser console (F12) for detailed error messages.`);
      }
    } catch (error: any) {
      console.error("Error during population:", {
        message: error?.message || String(error),
        stack: error?.stack,
      });
    }
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
            <Select value={dateRange} onValueChange={(value) => {
              if (value === "custom") {
                setShowCustomDatePicker(true);
              } else {
                setDateRange(value);
              }
            }}>
              <SelectTrigger className="w-48">
                <SelectValue
                  placeholder={
                    dateRange === "custom"
                      ? `${customStartDate} to ${customEndDate}`
                      : undefined
                  }
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1d">Today</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="1y">This Year</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={handleDatabaseDiagnostics}>
              <AlertTriangle className="w-4 h-4 mr-2" />
              Diagnose Data
            </Button>
            <Button variant="outline" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Custom Date Range Picker */}
        {showCustomDatePicker && (
          <Card className="mb-6 border-blue-200 bg-blue-50">
            <CardContent className="p-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Select Custom Date Range</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Start Date</label>
                    <input
                      type="date"
                      value={customStartDate}
                      onChange={(e) => setCustomStartDate(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">End Date</label>
                    <input
                      type="date"
                      value={customEndDate}
                      onChange={(e) => setCustomEndDate(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowCustomDatePicker(false);
                      setCustomStartDate("");
                      setCustomEndDate("");
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      if (customStartDate && customEndDate) {
                        setDateRange("custom");
                        setShowCustomDatePicker(false);
                      } else {
                        alert("Please select both start and end dates");
                      }
                    }}
                    disabled={!customStartDate || !customEndDate}
                  >
                    Apply
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

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
                      Unique visitor sessions
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
                      Total pages viewed
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
                      Single page sessions
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                      Avg Time on Site
                    </p>
                    <p className="text-3xl font-bold">
                      {data.visitors.avgTimeOnSite}s
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Average session duration
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Pages */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Pages</CardTitle>
                </CardHeader>
                <CardContent>
                  {data.visitors.topPages.length > 0 ? (
                    <div className="space-y-4">
                      {data.visitors.topPages.map((page, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center"
                        >
                          <div className="flex-1">
                            <p className="font-medium text-sm break-all">
                              {page.page}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {page.views} views
                            </p>
                          </div>
                          <div className="ml-4 text-right">
                            <p className="text-lg font-bold">{page.views}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Eye className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">
                        No visitor data yet
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Device Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Device Types</CardTitle>
                </CardHeader>
                <CardContent>
                  {data.visitors.devices.length > 0 ? (
                    <div className="space-y-4">
                      {data.visitors.devices.map((device, index) => {
                        const total = data.visitors.devices.reduce(
                          (sum, d) => sum + d.count,
                          0,
                        );
                        const percentage =
                          total > 0
                            ? ((device.count / total) * 100).toFixed(1)
                            : 0;
                        return (
                          <div key={index} className="space-y-2">
                            <div className="flex justify-between items-center">
                              <p className="font-medium capitalize text-sm">
                                {device.device}
                              </p>
                              <p className="text-sm font-bold">{percentage}%</p>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {device.count} visitors
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Smartphone className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">
                        No device data yet
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Referrer Sources */}
            <Card>
              <CardHeader>
                <CardTitle>Traffic Sources</CardTitle>
              </CardHeader>
              <CardContent>
                {data.visitors.referrers.length > 0 ? (
                  <div className="space-y-4">
                    {data.visitors.referrers.map((referrer, index) => {
                      const total = data.visitors.referrers.reduce(
                        (sum, r) => sum + r.count,
                        0,
                      );
                      const percentage =
                        total > 0
                          ? ((referrer.count / total) * 100).toFixed(1)
                          : 0;
                      return (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <p className="font-medium text-sm">
                              {referrer.source}
                            </p>
                            <p className="text-sm font-bold">{percentage}%</p>
                          </div>
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>{referrer.count} visitors</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Globe className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">
                      No referrer data yet
                    </p>
                  </div>
                )}
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
                  {data.sales.topProducts &&
                  data.sales.topProducts.length > 0 ? (
                    <div className="space-y-6">
                      {(() => {
                        const maxRevenue = Math.max(
                          ...data.sales.topProducts.map((p) => p.revenue),
                          1,
                        );
                        return data.sales.topProducts.map((product, index) => {
                          const percentage =
                            (product.revenue / maxRevenue) * 100;
                          return (
                            <div key={index} className="space-y-2">
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-gray-900">
                                    {product.name}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {product.sales} items sold
                                  </p>
                                </div>
                                <p className="text-sm font-bold text-blue-600 ml-4">
                                  {formatCurrency(product.revenue)}
                                </p>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                <div
                                  className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                            </div>
                          );
                        });
                      })()}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Package className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground font-medium">
                        No product sales data available
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Sales data will appear once orders with items are placed
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
