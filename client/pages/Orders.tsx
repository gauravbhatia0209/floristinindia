import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  Package,
  Calendar,
  CreditCard,
  Eye,
  ArrowLeft,
  ShoppingBag,
} from "lucide-react";

interface Order {
  id: string;
  order_number: string;
  status: string;
  total_amount: number;
  payment_status: string;
  created_at: string;
  items: any[];
}

const Orders: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!user?.email) {
        setError("User email not found");
        return;
      }

      console.log("🔍 Fetching orders for user:", {
        email: user.email,
        phone: user.phone
      });

      // Step 1: Find all customer records that match user's email or phone
      let customerQuery = supabase
        .from("customers")
        .select("id, email, phone, name");

      // Build conditions to match email or phone
      const conditions = [];
      if (user.email) {
        conditions.push(`email.eq.${user.email}`);
      }
      if (user.phone) {
        conditions.push(`phone.eq.${user.phone}`);
      }

      if (conditions.length === 0) {
        console.warn("⚠️ No email or phone found for user");
        setOrders([]);
        return;
      }

      // Use 'or' condition to match any of the email/phone combinations
      const { data: customers, error: customerError } = await customerQuery
        .or(conditions.join(','));

      if (customerError) {
        console.error("❌ Error fetching customers:", customerError);
        throw customerError;
      }

      console.log("📋 Found customer records:", customers);

      if (!customers || customers.length === 0) {
        console.log("ℹ️ No customer records found for this user");
        setOrders([]);
        return;
      }

      // Step 2: Get all customer IDs
      const customerIds = customers.map(c => c.id);

      // Step 3: Fetch orders for all these customer IDs
      const { data: ordersData, error: ordersError } = await supabase
        .from("orders")
        .select("*")
        .in("customer_id", customerIds)
        .order("created_at", { ascending: false });

      if (ordersError) {
        console.error("❌ Error fetching orders:", ordersError);
        throw ordersError;
      }

      console.log("📦 Found orders:", ordersData);
      setOrders(ordersData || []);

    } catch (err) {
      console.error("❌ Error in fetchOrders:", err);
      setError("Failed to load orders. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800 border-green-200";
      case "processing":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "shipped":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "delivered":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800 border-green-200";
      case "failed":
        return "bg-red-100 text-red-800 border-red-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "refunded":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto text-center">
          <CardContent className="pt-6">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold mb-2">Error Loading Orders</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={fetchOrders} className="w-full">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
          <p className="text-gray-600">Track and manage your order history</p>
        </div>
        <Button
          variant="outline"
          onClick={() => navigate("/")}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Continue Shopping
        </Button>
      </div>

      {/* Orders List */}
      {orders.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <ShoppingBag className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Orders Yet</h3>
            <p className="text-gray-600 mb-6">
              You haven't placed any orders yet. Start shopping to see your
              orders here.
            </p>
            <Button onClick={() => navigate("/")} className="px-8">
              Start Shopping
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card
              key={order.id}
              className="shadow-lg hover:shadow-xl transition-shadow"
            >
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Package className="w-5 h-5 text-gray-400" />
                      <h3 className="font-semibold text-lg">
                        Order #{order.order_number}
                      </h3>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Order Status</p>
                        <Badge
                          className={`mt-1 ${getStatusColor(order.status)}`}
                        >
                          {order.status.charAt(0).toUpperCase() +
                            order.status.slice(1)}
                        </Badge>
                      </div>

                      <div>
                        <p className="text-gray-600">Payment Status</p>
                        <Badge
                          className={`mt-1 ${getPaymentStatusColor(order.payment_status)}`}
                        >
                          {order.payment_status.charAt(0).toUpperCase() +
                            order.payment_status.slice(1)}
                        </Badge>
                      </div>

                      <div>
                        <p className="text-gray-600">Order Date</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Calendar className="w-3 h-3 text-gray-400" />
                          <span className="font-medium">
                            {new Date(order.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <div>
                        <p className="text-gray-600">Total Amount</p>
                        <div className="flex items-center gap-1 mt-1">
                          <CreditCard className="w-3 h-3 text-gray-400" />
                          <span className="font-bold text-green-600">
                            ₹{order.total_amount.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3">
                      <p className="text-sm text-gray-600">
                        {order.items?.length || 0} item(s)
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 lg:flex-col lg:w-auto">
                    <Link
                      to={`/order-confirmation/${order.order_number}`}
                      className="inline-flex"
                    >
                      <Button className="flex items-center gap-2 w-full sm:w-auto">
                        <Eye className="w-4 h-4" />
                        View Details
                      </Button>
                    </Link>

                    {(order.status === "shipped" ||
                      order.status === "processing") && (
                      <Link to="/track-order" className="inline-flex">
                        <Button
                          variant="outline"
                          className="flex items-center gap-2 w-full sm:w-auto"
                        >
                          <Package className="w-4 h-4" />
                          Track Order
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
