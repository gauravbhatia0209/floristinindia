import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  CheckCircle,
  Package,
  Truck,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Download,
  ArrowRight,
  ShoppingBag,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";

interface OrderData {
  id: string;
  order_number: string;
  status: string;
  total_amount: number;
  shipping_amount: number;
  discount_amount: number;
  tax_amount: number;
  items: any[];
  shipping_address: any;
  billing_address: any;
  delivery_date: string | null;
  delivery_slot: string | null;
  special_instructions: string | null;
  payment_method: string;
  payment_status: string;
  tracking_number: string | null;
  created_at: string;
  customer: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
  };
}

export default function OrderConfirmation() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  async function fetchOrderDetails() {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("orders")
        .select(
          `
          *,
          customer:customers(
            first_name,
            last_name,
            email,
            phone
          )
        `,
        )
        .eq("id", orderId)
        .single();

      if (error || !data) {
        setError("Order not found");
        return;
      }

      // Fetch product images for the order items
      const productIds = data.items
        .map((item: any) => item.product_id)
        .filter(Boolean);
      let productsData: any[] = [];

      if (productIds.length > 0) {
        const { data: products } = await supabase
          .from("products")
          .select("id, images")
          .in("id", productIds);

        productsData = products || [];
      }

      // Enhance order items with product images
      const enhancedItems = data.items.map((item: any) => {
        const product = productsData.find((p: any) => p.id === item.product_id);
        const productImage = product?.images?.[0] || null;

        return {
          ...item,
          image: productImage,
        };
      });

      setOrderData({
        ...data,
        items: enhancedItems,
      } as OrderData);
    } catch (error) {
      console.error("Failed to fetch order:", error);
      setError("Failed to load order details");
    } finally {
      setIsLoading(false);
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "confirmed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "processing":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "shipped":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case "razorpay":
        return "Credit/Debit Card";
      case "upi":
        return "UPI Payment";
      case "netbanking":
        return "Net Banking";
      case "cod":
        return "Cash on Delivery";
      default:
        return method;
    }
  };

  // SEO Meta tags
  useEffect(() => {
    document.title = orderData
      ? `Order Confirmation #${orderData.order_number} - Florist in India`
      : "Order Confirmation - Florist in India";

    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.setAttribute("name", "description");
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute(
      "content",
      "Your order has been confirmed! Track your flower delivery order status and get real-time updates.",
    );
  }, [orderData]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !orderData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-orange-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="bg-red-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
            <Package className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Order Not Found
          </h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button
            onClick={() => navigate("/")}
            className="bg-red-600 hover:bg-red-700"
          >
            Return Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Success Hero Section */}
      <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white py-16 lg:py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full backdrop-blur-sm mb-6">
            <CheckCircle className="h-10 w-10" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Order Confirmed!
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90 leading-relaxed mb-6">
            Thank you for your order. We'll send you updates via email and SMS.
          </p>
          <div className="bg-white/20 rounded-2xl backdrop-blur-sm p-6 max-w-md mx-auto">
            <p className="text-lg font-semibold mb-2">Order Number</p>
            <p className="text-2xl md:text-3xl font-bold tracking-wider">
              #{orderData.order_number}
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Order Status */}
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="bg-white/20 rounded-lg p-2">
                    <Package className="w-6 h-6" />
                  </div>
                  Order Status
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-sm text-gray-600">Current Status</p>
                    <Badge
                      className={`${getStatusColor(orderData.status)} border-2 px-4 py-2 text-sm font-bold`}
                    >
                      <Package className="h-4 w-4 mr-2" />
                      {orderData.status.charAt(0).toUpperCase() +
                        orderData.status.slice(1)}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Order Placed</p>
                    <p className="font-semibold">
                      {formatDate(orderData.created_at)}
                    </p>
                  </div>
                </div>

                {orderData.delivery_date && (
                  <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-4">
                    <div className="flex items-center text-blue-800">
                      <Calendar className="h-5 w-5 mr-3" />
                      <div>
                        <p className="font-semibold">Scheduled Delivery</p>
                        <p>
                          {new Date(orderData.delivery_date).toLocaleDateString(
                            "en-IN",
                            {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            },
                          )}
                          {orderData.delivery_slot &&
                            ` • ${orderData.delivery_slot}`}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {orderData.tracking_number && (
                  <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
                    <div className="flex items-center text-green-800">
                      <Truck className="h-5 w-5 mr-3" />
                      <div>
                        <p className="font-semibold">Tracking Number</p>
                        <p className="font-mono">{orderData.tracking_number}</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Delivery Address */}
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="bg-white/20 rounded-lg p-2">
                    <MapPin className="w-6 h-6" />
                  </div>
                  Delivery Address
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-2">
                  <p className="font-semibold text-gray-900">
                    {orderData.shipping_address?.name ||
                      `${orderData.customer?.first_name} ${orderData.customer?.last_name}`}
                  </p>
                  <p className="text-gray-700">
                    {orderData.shipping_address?.line1}
                  </p>
                  {orderData.shipping_address?.line2 && (
                    <p className="text-gray-700">
                      {orderData.shipping_address.line2}
                    </p>
                  )}
                  <p className="text-gray-700">
                    {orderData.shipping_address?.city},{" "}
                    {orderData.shipping_address?.state}{" "}
                    {orderData.shipping_address?.pincode}
                  </p>
                  {orderData.shipping_address?.phone && (
                    <p className="flex items-center text-gray-700 mt-3">
                      <Phone className="h-4 w-4 mr-2" />
                      {orderData.shipping_address.phone}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="bg-white/20 rounded-lg p-2">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                  Order Items ({orderData.items.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {orderData.items.map((item: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl"
                    >
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.product_name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">
                          {item.product_name}
                        </h3>
                        {item.variant_name && (
                          <p className="text-sm text-gray-600">
                            Variant: {item.variant_name}
                          </p>
                        )}
                        <p className="text-sm text-gray-600">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-lg">
                          {formatPrice(item.total_price)}
                        </p>
                        <p className="text-sm text-gray-600">
                          {formatPrice(item.unit_price)} each
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary Sidebar */}
          <div className="space-y-6">
            {/* Payment Information */}
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  Payment Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Payment Method</p>
                  <p className="font-semibold">
                    {getPaymentMethodLabel(orderData.payment_method)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Payment Status</p>
                  <Badge
                    className={
                      orderData.payment_status === "paid"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }
                  >
                    {orderData.payment_status.charAt(0).toUpperCase() +
                      orderData.payment_status.slice(1)}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Order Total */}
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>
                      {formatPrice(
                        orderData.total_amount -
                          orderData.shipping_amount -
                          orderData.tax_amount +
                          orderData.discount_amount,
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping:</span>
                    <span>
                      {orderData.shipping_amount === 0
                        ? "FREE"
                        : formatPrice(orderData.shipping_amount)}
                    </span>
                  </div>
                  {orderData.discount_amount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount:</span>
                      <span>-{formatPrice(orderData.discount_amount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Tax (18% GST):</span>
                    <span>{formatPrice(orderData.tax_amount)}</span>
                  </div>
                  <hr />
                  <div className="flex justify-between text-xl font-bold text-green-600">
                    <span>Total Paid:</span>
                    <span>{formatPrice(orderData.total_amount)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="space-y-4">
              <Link to={`/track-order`}>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 py-3">
                  <Truck className="h-5 w-5 mr-2" />
                  Track Your Order
                </Button>
              </Link>

              <Button
                variant="outline"
                className="w-full border-2 border-gray-300 hover:border-gray-400 py-3"
                onClick={() => window.print()}
              >
                <Download className="h-5 w-5 mr-2" />
                Download Receipt
              </Button>

              <Link to="/">
                <Button
                  variant="outline"
                  className="w-full border-2 border-green-300 hover:border-green-400 text-green-700 hover:text-green-800 py-3"
                >
                  <ShoppingBag className="h-5 w-5 mr-2" />
                  Continue Shopping
                </Button>
              </Link>
            </div>

            {/* Contact Info */}
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">Need Help?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center text-sm">
                  <Phone className="h-4 w-4 mr-2 text-blue-600" />
                  <span>Call: +91 98765 43210</span>
                </div>
                <div className="flex items-center text-sm">
                  <Mail className="h-4 w-4 mr-2 text-blue-600" />
                  <span>Email: care@floristinindia.com</span>
                </div>
                <div className="flex items-center text-sm">
                  <Clock className="h-4 w-4 mr-2 text-blue-600" />
                  <span>24/7 Customer Support</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
