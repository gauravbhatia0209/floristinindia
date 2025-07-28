import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
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
  CheckCircle,
  Package,
  Truck,
  MapPin,
  User,
  Phone,
  Mail,
  Calendar,
  Clock,
  CreditCard,
  FileText,
  ArrowLeft,
  ExternalLink,
  Download,
} from "lucide-react";

interface OrderItem {
  id: string;
  product_id: string;
  variant_id?: string;
  quantity: number;
  price: number;
  total_price: number;
  product_name: string;
  variant_name?: string;
  uploaded_file_url?: string;
  uploaded_file_name?: string;
  product?: {
    id: string;
    name: string;
    slug: string;
    images: any[];
    price: number;
    sale_price?: number;
  };
}

interface Order {
  id: string;
  order_number: string;
  status: string;
  total_amount: number;
  shipping_amount: number;
  discount_amount: number;
  tax_amount: number;
  items: OrderItem[];
  shipping_address: any;
  billing_address: any;
  delivery_date?: string;
  delivery_slot?: string;
  special_instructions?: string;
  customer_message?: string;
  receiver_name?: string;
  receiver_phone?: string;
  alternate_phone?: string;
  payment_status: string;
  payment_method?: string;
  payment_reference?: string;
  coupon_code?: string;
  tracking_number?: string;
  created_at: string;
  updated_at: string;
  customer?: {
    name: string;
    email: string;
    phone: string;
  };
}

const OrderConfirmation: React.FC = () => {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderNumber) {
      navigate("/");
      return;
    }
    fetchOrderDetails();
  }, [orderNumber]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("orders")
        .select(
          `
          *,
          customer:customers(name, email, phone)
        `,
        )
        .eq("order_number", orderNumber)
        .single();

      if (error) throw error;

      if (!data) {
        setError("Order not found");
        return;
      }

      // Parse items if they're stored as JSON string
      let orderItems = data.items;
      if (typeof data.items === 'string') {
        try {
          orderItems = JSON.parse(data.items);
        } catch (parseError) {
          console.error("Error parsing order items:", parseError);
          orderItems = [];
        }
      }

      console.log("📦 OrderConfirmation: Order items:", orderItems);

      // Fetch product details for each item
      const itemsWithProducts = await Promise.all(
        (orderItems || []).map(async (item: OrderItem) => {
          try {
            console.log("🔍 Fetching product for item:", {
              product_id: item.product_id,
              product_name: item.product_name,
              item: item
            });

            // First check if product_id exists and is valid
            if (!item.product_id) {
              console.warn("⚠️ No product_id found for item:", item);
              return item;
            }

            const { data: product, error: productError } = await supabase
              .from("products")
              .select("id, name, slug, images, price, sale_price")
              .eq("id", item.product_id)
              .single();

            if (productError) {
              console.error("❌ Supabase error fetching product for ID", item.product_id, ":");
              console.error("Error code:", productError.code);
              console.error("Error message:", productError.message);
              console.error("Error details:", productError.details);
              console.error("Error hint:", productError.hint);
              console.error("Full error object:", JSON.stringify(productError, null, 2));

              // Return item without product data but don't fail
              return {
                ...item,
                product: null,
              };
            }

            console.log("✅ Successfully fetched product data for", item.product_id, ":", product);

            return {
              ...item,
              product: product || null,
            };
          } catch (err) {
            console.error("❌ Exception fetching product for ID", item.product_id, ":");
            console.error("Error type:", typeof err);
            console.error("Error constructor:", err?.constructor?.name);

            if (err instanceof Error) {
              console.error("Error message:", err.message);
              console.error("Error stack:", err.stack);
            } else {
              console.error("Non-Error object:", err);
              console.error("String representation:", String(err));
              console.error("JSON representation:", JSON.stringify(err, null, 2));
            }

            // Return item without product data but don't fail
            return {
              ...item,
              product: null,
            };
          }
        }),
      );

      console.log("📦 Final items with products:", itemsWithProducts);

      const finalOrder = {
        ...data,
        items: itemsWithProducts,
      };

      console.log("📋 Final order object:", finalOrder);
      setOrder(finalOrder);
    } catch (err) {
      console.error("Error fetching order:", err);
      setError("Failed to load order details");
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

  if (error || !order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto text-center">
          <CardContent className="pt-6">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold mb-2">Order Not Found</h2>
            <p className="text-gray-600 mb-4">
              {error || "This order does not exist or has been removed."}
            </p>
            <Button onClick={() => navigate("/")} className="w-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="text-green-500 text-6xl mb-4">
          <CheckCircle className="w-16 h-16 mx-auto" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Order Confirmed!
        </h1>
        <p className="text-gray-600">
          Thank you for your order. We'll send you shipping confirmation when
          your order ships.
        </p>
      </div>

      {/* Order Summary */}
      <Card className="mb-6 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
          <CardTitle className="flex items-center gap-3">
            <Package className="w-6 h-6" />
            Order #{order.order_number}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-600">Order Status</p>
              <Badge className={`mt-1 ${getStatusColor(order.status)}`}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-gray-600">Payment Status</p>
              <Badge
                className={`mt-1 ${getPaymentStatusColor(order.payment_status)}`}
              >
                {order.payment_status.charAt(0).toUpperCase() +
                  order.payment_status.slice(1)}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-gray-600">Order Date</p>
              <p className="font-semibold">
                {new Date(order.created_at).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Amount</p>
              <p className="font-bold text-lg text-green-600">
                ₹{order.total_amount.toFixed(2)}
              </p>
            </div>
          </div>

          {order.tracking_number && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-blue-600" />
                <span className="font-medium">Tracking Number:</span>
                <span className="font-mono text-blue-700">
                  {order.tracking_number}
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Order Items ({order.items.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {order.items.map((item, index) => (
                  <div key={index} className="p-6 flex gap-4">
                    <div className="w-20 h-20 flex-shrink-0">
                      {(() => {
                        // Get image from the images array (which contains URLs as strings)
                        const imageUrl = item.product?.images?.[0];
                        console.log("🖼️ Image data for", item.product_name, ":", {
                          hasProduct: !!item.product,
                          images: item.product?.images,
                          finalImageUrl: imageUrl
                        });

                        return imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={item.product_name}
                            className="w-full h-full object-cover rounded-lg border"
                            onError={(e) => {
                              console.error("Image failed to load:", imageUrl);
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const fallback = target.parentElement?.querySelector('.image-fallback') as HTMLElement;
                              if (fallback) fallback.style.display = 'flex';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                            <Package className="w-8 h-8 text-gray-400" />
                          </div>
                        );
                      })()}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <div>
                          {item.product ? (
                            <Link
                              to={`/products/${item.product.slug}`}
                              className="font-semibold text-lg hover:text-pink-600 transition-colors flex items-center gap-1"
                            >
                              {item.product_name}
                              <ExternalLink className="w-4 h-4" />
                            </Link>
                          ) : (
                            <h3 className="font-semibold text-lg">
                              {item.product_name}
                            </h3>
                          )}

                          {item.variant_name && (
                            <p className="text-sm text-gray-600 mt-1">
                              Variant: {item.variant_name}
                            </p>
                          )}

                          <div className="flex items-center gap-4 mt-2">
                            <span className="text-sm text-gray-600">
                              Qty: {item.quantity}
                            </span>
                            <span className="text-sm text-gray-600">
                              Price: ₹{(item.price || item.product?.sale_price || item.product?.price || 0).toFixed(2)}
                            </span>
                          </div>

                          {item.uploaded_file_name && (
                            <div className="mt-2 p-2 bg-blue-50 rounded-lg">
                              <div className="flex items-center gap-2 text-sm">
                                <FileText className="w-4 h-4 text-blue-600" />
                                <span>
                                  Uploaded file: {item.uploaded_file_name}
                                </span>
                                {item.uploaded_file_url && (
                                  <a
                                    href={item.uploaded_file_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline flex items-center gap-1"
                                  >
                                    <Download className="w-3 h-3" />
                                    View
                                  </a>
                                )}
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="text-right">
                          <p className="font-bold text-lg">
                            ₹{(item.total_price || (item.price || item.product?.sale_price || item.product?.price || 0) * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Delivery Information */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="w-5 h-5" />
                Delivery Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                {order.delivery_date && (
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Delivery Date</p>
                      <p className="font-semibold">
                        {new Date(order.delivery_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}

                {order.delivery_slot && (
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Delivery Slot</p>
                      <p className="font-semibold">{order.delivery_slot}</p>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Delivery Address</p>
                    <div className="font-semibold">
                      <p>{order.shipping_address.name}</p>
                      <p>{order.shipping_address.line1}</p>
                      {order.shipping_address.line2 && (
                        <p>{order.shipping_address.line2}</p>
                      )}
                      <p>
                        {order.shipping_address.city},{" "}
                        {order.shipping_address.state}{" "}
                        {order.shipping_address.pincode}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        📞 {order.shipping_address.phone}
                      </p>
                      {order.shipping_address.alternate_phone && (
                        <p className="text-sm text-gray-600">
                          Alt: {order.shipping_address.alternate_phone}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {(order.special_instructions || order.customer_message) && (
                <div className="mt-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <h4 className="font-semibold text-amber-800 mb-2">
                    Special Instructions
                  </h4>
                  {order.special_instructions && (
                    <p className="text-sm text-amber-700 mb-2">
                      {order.special_instructions}
                    </p>
                  )}
                  {order.customer_message && (
                    <p className="text-sm text-amber-700">
                      {order.customer_message}
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Customer Information */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-gray-400" />
                <span>{order.customer?.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gray-400" />
                <span>{order.customer?.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gray-400" />
                <span>{order.customer?.phone}</span>
              </div>
            </CardContent>
          </Card>

          {/* Payment Information */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Payment Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>
                    ₹
                    {(
                      order.total_amount -
                      order.shipping_amount -
                      order.tax_amount +
                      order.discount_amount
                    ).toFixed(2)}
                  </span>
                </div>

                {order.discount_amount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount:</span>
                    <span>-₹{order.discount_amount.toFixed(2)}</span>
                  </div>
                )}

                {order.coupon_code && (
                  <div className="flex justify-between text-blue-600">
                    <span>Coupon ({order.coupon_code}):</span>
                    <span>Applied</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span>₹{order.shipping_amount.toFixed(2)}</span>
                </div>

                {order.tax_amount > 0 && (
                  <div className="flex justify-between">
                    <span>Tax:</span>
                    <span>₹{order.tax_amount.toFixed(2)}</span>
                  </div>
                )}

                <hr />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span className="text-green-600">
                    ₹{order.total_amount.toFixed(2)}
                  </span>
                </div>
              </div>

              {order.payment_method && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm text-gray-600">Payment Method</p>
                  <p className="font-semibold capitalize">
                    {order.payment_method}
                  </p>
                  {order.payment_reference && (
                    <p className="text-xs text-gray-500 mt-1">
                      Ref: {order.payment_reference}
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <Card className="shadow-lg">
            <CardContent className="p-4 space-y-3">
              <Button
                onClick={() => navigate("/orders")}
                className="w-full bg-pink-600 hover:bg-pink-700"
              >
                View All Orders
              </Button>

              <Button
                variant="outline"
                onClick={() => navigate("/")}
                className="w-full"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Continue Shopping
              </Button>

              <Button
                variant="outline"
                onClick={() => window.print()}
                className="w-full"
              >
                <Download className="w-4 h-4 mr-2" />
                Print Order
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
