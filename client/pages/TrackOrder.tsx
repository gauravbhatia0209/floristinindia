import { useState } from "react";
import {
  Search,
  Package,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
  Phone,
  Mail,
  Calendar,
  MapPin,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";

interface OrderData {
  id: string;
  order_number: string;
  status: string;
  total_amount: number;
  shipping_amount: number;
  items: any[];
  shipping_address: any;
  delivery_date: string | null;
  delivery_slot: string | null;
  tracking_number: string | null;
  special_instructions: string | null;
  created_at: string;
  updated_at: string;
  customer: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
  };
}

export default function TrackOrder() {
  const [orderNumber, setOrderNumber] = useState("");
  const [verificationField, setVerificationField] = useState("");
  const [verificationType, setVerificationType] = useState<"phone" | "email">(
    "phone",
  );
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState<"input" | "verification" | "results">(
    "input",
  );

  const handleOrderSearch = async () => {
    if (!orderNumber.trim()) {
      setError("Please enter a valid order number");
      return;
    }

    // Validate order number format (should be alphanumeric)
    if (!/^[A-Za-z0-9]+$/.test(orderNumber.trim())) {
      setError("Order number should contain only letters and numbers");
      return;
    }

    setError("");
    setStep("verification");
  };

  const handleVerificationSubmit = async () => {
    if (!verificationField.trim()) {
      setError(
        `Please enter your ${verificationType === "phone" ? "phone number" : "email address"}`,
      );
      return;
    }

    // Validate phone/email format
    if (verificationType === "phone") {
      if (!/^\+?[\d\s\-\(\)]{10,}$/.test(verificationField.trim())) {
        setError("Please enter a valid phone number");
        return;
      }
    } else {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(verificationField.trim())) {
        setError("Please enter a valid email address");
        return;
      }
    }

    setIsLoading(true);
    setError("");

    try {
      // Build the query condition based on verification type
      const verificationCondition =
        verificationType === "phone"
          ? `customers.phone.eq.${verificationField.trim()}`
          : `customers.email.eq.${verificationField.trim()}`;

      const { data, error } = await supabase
        .from("orders")
        .select(
          `
          id,
          order_number,
          status,
          total_amount,
          shipping_amount,
          items,
          shipping_address,
          delivery_date,
          delivery_slot,
          tracking_number,
          special_instructions,
          created_at,
          updated_at,
          customer:customers(
            first_name,
            last_name,
            email,
            phone
          )
        `,
        )
        .eq("order_number", orderNumber.trim().toUpperCase())
        .eq(`customers.${verificationType}`, verificationField.trim())
        .single();

      if (error || !data) {
        setError(
          "Order not found. Please check your order number and contact details.",
        );
        return;
      }

      setOrderData(data as OrderData);
      setStep("results");
    } catch (error) {
      console.error("Error fetching order:", error);
      setError("Unable to fetch order details. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "processing":
        return "bg-purple-100 text-purple-800";
      case "shipped":
        return "bg-indigo-100 text-indigo-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
      case "refunded":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case "confirmed":
      case "processing":
        return <Package className="h-5 w-5 text-blue-600" />;
      case "shipped":
        return <Truck className="h-5 w-5 text-indigo-600" />;
      case "delivered":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "cancelled":
      case "refunded":
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Package className="h-5 w-5 text-gray-600" />;
    }
  };

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

  const resetForm = () => {
    setOrderNumber("");
    setVerificationField("");
    setOrderData(null);
    setError("");
    setStep("input");
  };

  // SEO Meta tags
  useState(() => {
    document.title = "Track Your Order - Florist in India";

    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.setAttribute("name", "description");
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute(
      "content",
      "Track your flower delivery order in real-time. Enter your order number to get live updates on delivery status.",
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-rose-500 via-pink-500 to-red-500 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <Package className="h-16 w-16 mx-auto mb-6 opacity-90" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Track Your Order
          </h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Stay updated with real-time tracking of your flower delivery
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {step === "input" && (
          <Card className="shadow-xl border-0">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-2xl text-gray-800">
                Enter Order Details
              </CardTitle>
              <p className="text-gray-600 mt-2">
                Enter your order number to start tracking
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Order Number *
                </label>
                <Input
                  type="text"
                  placeholder="e.g., FLR123456789"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value.toUpperCase())}
                  className="text-lg p-4 text-center tracking-wider"
                  maxLength={20}
                />
                <p className="text-sm text-gray-500 mt-1">
                  You can find your order number in the confirmation email or
                  SMS
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  <div className="flex items-center">
                    <AlertCircle className="h-5 w-5 mr-2" />
                    {error}
                  </div>
                </div>
              )}

              <Button
                onClick={handleOrderSearch}
                className="w-full py-4 text-lg bg-rose-600 hover:bg-rose-700"
                disabled={isLoading}
              >
                <Search className="h-5 w-5 mr-2" />
                Track Order
              </Button>
            </CardContent>
          </Card>
        )}

        {step === "verification" && (
          <Card className="shadow-xl border-0">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-2xl text-gray-800">
                Verify Your Identity
              </CardTitle>
              <p className="text-gray-600 mt-2">
                For security, please verify your contact details
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex space-x-4 justify-center">
                <Button
                  variant={verificationType === "phone" ? "default" : "outline"}
                  onClick={() => setVerificationType("phone")}
                  className="flex items-center"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Phone
                </Button>
                <Button
                  variant={verificationType === "email" ? "default" : "outline"}
                  onClick={() => setVerificationType("email")}
                  className="flex items-center"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Email
                </Button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {verificationType === "phone"
                    ? "Phone Number"
                    : "Email Address"}{" "}
                  *
                </label>
                <Input
                  type={verificationType === "phone" ? "tel" : "email"}
                  placeholder={
                    verificationType === "phone"
                      ? "+91 98765 43210"
                      : "your@email.com"
                  }
                  value={verificationField}
                  onChange={(e) => setVerificationField(e.target.value)}
                  className="text-lg p-4"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Enter the{" "}
                  {verificationType === "phone"
                    ? "phone number"
                    : "email address"}{" "}
                  used when placing the order
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  <div className="flex items-center">
                    <AlertCircle className="h-5 w-5 mr-2" />
                    {error}
                  </div>
                </div>
              )}

              <div className="flex space-x-4">
                <Button
                  variant="outline"
                  onClick={() => setStep("input")}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  onClick={handleVerificationSubmit}
                  className="flex-1 bg-rose-600 hover:bg-rose-700"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Verifying...
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4 mr-2" />
                      View Order
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === "results" && orderData && (
          <div className="space-y-6">
            {/* Order Status Card */}
            <Card className="shadow-xl border-0">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl text-gray-800">
                      Order #{orderData.order_number}
                    </CardTitle>
                    <p className="text-gray-600 mt-1">
                      Placed on {formatDate(orderData.created_at)}
                    </p>
                  </div>
                  <Badge
                    className={`${getStatusColor(orderData.status)} px-4 py-2 text-sm font-medium`}
                  >
                    <div className="flex items-center">
                      {getStatusIcon(orderData.status)}
                      <span className="ml-2 capitalize">
                        {orderData.status}
                      </span>
                    </div>
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Delivery Info */}
                {orderData.delivery_date && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center text-blue-800">
                      <Calendar className="h-5 w-5 mr-2" />
                      <div>
                        <p className="font-medium">Scheduled Delivery</p>
                        <p className="text-sm">
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

                {/* Tracking Number */}
                {orderData.tracking_number && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center text-green-800">
                      <Truck className="h-5 w-5 mr-2" />
                      <div>
                        <p className="font-medium">Tracking Number</p>
                        <p className="text-sm font-mono">
                          {orderData.tracking_number}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Delivery Address */}
                {orderData.shipping_address && (
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start text-gray-700">
                      <MapPin className="h-5 w-5 mr-2 mt-0.5" />
                      <div>
                        <p className="font-medium mb-1">Delivery Address</p>
                        <div className="text-sm space-y-1">
                          <p>{orderData.shipping_address.name}</p>
                          <p>{orderData.shipping_address.address_line_1}</p>
                          {orderData.shipping_address.address_line_2 && (
                            <p>{orderData.shipping_address.address_line_2}</p>
                          )}
                          <p>
                            {orderData.shipping_address.city},{" "}
                            {orderData.shipping_address.state}{" "}
                            {orderData.shipping_address.pincode}
                          </p>
                          {orderData.shipping_address.phone && (
                            <p>{orderData.shipping_address.phone}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Special Instructions */}
                {orderData.special_instructions && (
                  <div className="border border-gray-200 rounded-lg p-4">
                    <p className="font-medium text-gray-700 mb-2">
                      Special Instructions
                    </p>
                    <p className="text-sm text-gray-600">
                      {orderData.special_instructions}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card className="shadow-xl border-0">
              <CardHeader>
                <CardTitle className="text-xl text-gray-800">
                  Order Items
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orderData.items.map((item: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg"
                    >
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-800">
                          {item.name}
                        </h3>
                        {item.variant && (
                          <p className="text-sm text-gray-600">
                            Variant: {item.variant}
                          </p>
                        )}
                        <p className="text-sm text-gray-600">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-800">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Total */}
                <div className="border-t border-gray-200 mt-6 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>
                      {formatPrice(
                        orderData.total_amount - orderData.shipping_amount,
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span>{formatPrice(orderData.shipping_amount)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-2">
                    <span>Total</span>
                    <span>{formatPrice(orderData.total_amount)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <Button onClick={resetForm} variant="outline" className="flex-1">
                Track Another Order
              </Button>
              <Button
                onClick={() => window.print()}
                variant="outline"
                className="flex-1"
              >
                Print Details
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
