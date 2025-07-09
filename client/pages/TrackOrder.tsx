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
  ShoppingBag,
  User,
  CreditCard,
  ArrowRight,
  Copy,
  Check,
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
      // First, fetch the order with customer details
      const { data: orderData, error: orderError } = await supabase
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
          customer_id,
          customers!inner(
            first_name,
            last_name,
            email,
            phone
          )
        `,
        )
        .eq("order_number", orderNumber.trim().toUpperCase())
        .single();

      if (orderError || !orderData) {
        console.log("Order not found:", orderError);
        setError("No order found. Please check your order number.");
        return;
      }

      // Verify the customer contact details
      const customer = orderData.customers;
      const customerMatches =
        verificationType === "phone"
          ? customer.phone === verificationField.trim() ||
            customer.phone === `+91${verificationField.trim()}` ||
            customer.phone
              .replace(/\D/g, "")
              .endsWith(verificationField.trim().replace(/\D/g, ""))
          : customer.email.toLowerCase() ===
            verificationField.trim().toLowerCase();

      if (!customerMatches) {
        setError(
          `The ${verificationType} you entered doesn't match our records for this order. Please check and try again.`,
        );
        return;
      }

      // Format the data for display
      setOrderData({
        ...orderData,
        customer: customer,
      } as OrderData);
      setStep("results");
    } catch (error) {
      console.error("Error fetching order:", error);
      setError("Unable to fetch order details. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const [copiedTrackingNumber, setCopiedTrackingNumber] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "confirmed":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "processing":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "shipped":
        return "bg-indigo-50 text-indigo-700 border-indigo-200";
      case "delivered":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "cancelled":
      case "refunded":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getProgressPercentage = (status: string) => {
    switch (status) {
      case "pending":
        return 20;
      case "confirmed":
        return 40;
      case "processing":
        return 60;
      case "shipped":
        return 80;
      case "delivered":
        return 100;
      case "cancelled":
      case "refunded":
        return 0;
      default:
        return 0;
    }
  };

  const getOrderSteps = () => [
    { key: "pending", label: "Order Placed", icon: ShoppingBag },
    { key: "confirmed", label: "Confirmed", icon: CheckCircle },
    { key: "processing", label: "Processing", icon: Package },
    { key: "shipped", label: "Shipped", icon: Truck },
    { key: "delivered", label: "Delivered", icon: CheckCircle },
  ];

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedTrackingNumber(true);
      setTimeout(() => setCopiedTrackingNumber(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
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
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50">
      {/* Modern Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-rose-600 via-pink-600 to-orange-500 text-white py-20 lg:py-24">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-20 right-20 w-24 h-24 bg-yellow-300/20 rounded-full blur-lg"></div>
          <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-orange-300/30 rounded-full blur-lg"></div>
        </div>
        <div className="relative container mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-2xl backdrop-blur-sm mb-8">
            <Package className="h-10 w-10" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
            Track Your Order
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90 leading-relaxed">
            Get real-time updates on your flower delivery with our advanced
            tracking system
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {step === "input" && (
          <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-8 pt-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-rose-500 to-pink-600 rounded-2xl mb-6">
                <Search className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
                Enter Order Details
              </CardTitle>
              <p className="text-gray-600 text-lg">
                Enter your order number to start real-time tracking
              </p>
            </CardHeader>
            <CardContent className="space-y-8 pb-12">
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-gray-800 mb-3">
                  Order Number *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Package className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    type="text"
                    placeholder="FLR123456789"
                    value={orderNumber}
                    onChange={(e) =>
                      setOrderNumber(e.target.value.toUpperCase())
                    }
                    className="text-lg py-6 pl-12 pr-4 text-center tracking-widest font-mono bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-rose-500 focus:ring-rose-500 transition-all duration-200"
                    maxLength={20}
                  />
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-blue-800">
                        Where to find your order number?
                      </p>
                      <p className="text-sm text-blue-700 mt-1">
                        Check your confirmation email or SMS for the order
                        number (e.g., FLR123456789)
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
                  <div className="flex items-center">
                    <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
                    <p className="text-red-700 font-medium">{error}</p>
                  </div>
                </div>
              )}

              <Button
                onClick={handleOrderSearch}
                className="w-full py-6 text-lg font-semibold bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
                disabled={isLoading || !orderNumber.trim()}
              >
                <Search className="h-5 w-5 mr-3" />
                Start Tracking
                <ArrowRight className="h-5 w-5 ml-3" />
              </Button>
            </CardContent>
          </Card>
        )}

        {step === "verification" && (
          <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-8 pt-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-6">
                <User className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
                Verify Your Identity
              </CardTitle>
              <p className="text-gray-600 text-lg">
                For your security, please verify your contact details
              </p>
            </CardHeader>
            <CardContent className="space-y-8 pb-12">
              <div className="flex space-x-4 justify-center">
                <Button
                  variant={verificationType === "phone" ? "default" : "outline"}
                  onClick={() => setVerificationType("phone")}
                  className={`flex items-center px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                    verificationType === "phone"
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                      : "border-2 border-gray-300 hover:border-blue-500"
                  }`}
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Phone Number
                </Button>
                <Button
                  variant={verificationType === "email" ? "default" : "outline"}
                  onClick={() => setVerificationType("email")}
                  className={`flex items-center px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                    verificationType === "email"
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                      : "border-2 border-gray-300 hover:border-blue-500"
                  }`}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Email Address
                </Button>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-semibold text-gray-800">
                  {verificationType === "phone"
                    ? "Phone Number"
                    : "Email Address"}{" "}
                  *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    {verificationType === "phone" ? (
                      <Phone className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Mail className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                  <Input
                    type={verificationType === "phone" ? "tel" : "email"}
                    placeholder={
                      verificationType === "phone"
                        ? "+91 98765 43210"
                        : "your@email.com"
                    }
                    value={verificationField}
                    onChange={(e) => setVerificationField(e.target.value)}
                    className="text-lg py-6 pl-12 pr-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                  />
                </div>
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                  Enter the{" "}
                  {verificationType === "phone"
                    ? "phone number"
                    : "email address"}{" "}
                  used when placing order #{orderNumber}
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
                  <div className="flex items-center">
                    <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
                    <p className="text-red-700 font-medium">{error}</p>
                  </div>
                </div>
              )}

              <div className="flex space-x-4">
                <Button
                  variant="outline"
                  onClick={() => setStep("input")}
                  className="flex-1 py-4 border-2 border-gray-300 hover:border-gray-400 rounded-xl font-semibold"
                >
                  ← Back
                </Button>
                <Button
                  onClick={handleVerificationSubmit}
                  className="flex-1 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] font-semibold"
                  disabled={isLoading || !verificationField.trim()}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Verifying...
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4 mr-2" />
                      View Order Details
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === "results" && orderData && (
          <div className="space-y-8">
            {/* Order Status Card with Progress */}
            <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm overflow-hidden">
              <div className="bg-gradient-to-r from-green-500 to-teal-600 p-6 text-white">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-3xl font-bold mb-2">
                      Order #{orderData.order_number}
                    </h2>
                    <p className="text-green-100 text-lg">
                      Placed on {formatDate(orderData.created_at)}
                    </p>
                    <p className="text-green-100 mt-1">
                      Customer: {orderData.customer?.first_name}{" "}
                      {orderData.customer?.last_name}
                    </p>
                  </div>
                  <Badge
                    className={`${getStatusColor(orderData.status)} border-2 px-4 py-2 text-sm font-bold shadow-lg`}
                  >
                    <div className="flex items-center">
                      {getStatusIcon(orderData.status)}
                      <span className="ml-2 capitalize">
                        {orderData.status}
                      </span>
                    </div>
                  </Badge>
                </div>
              </div>

              <CardHeader className="pb-4">
                <div className="space-y-6">
                  {/* Progress Bar */}
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm font-semibold text-gray-700">
                        Order Progress
                      </span>
                      <span className="text-sm font-bold text-gray-900">
                        {getProgressPercentage(orderData.status)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-green-500 to-teal-600 h-3 rounded-full transition-all duration-1000 ease-out"
                        style={{
                          width: `${getProgressPercentage(orderData.status)}%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Progress Steps */}
                  <div className="flex justify-between items-center relative">
                    <div className="absolute top-6 left-0 w-full h-0.5 bg-gray-200 z-0"></div>
                    <div
                      className="absolute top-6 left-0 h-0.5 bg-gradient-to-r from-green-500 to-teal-600 z-10 transition-all duration-1000 ease-out"
                      style={{
                        width: `${getProgressPercentage(orderData.status)}%`,
                      }}
                    ></div>

                    {getOrderSteps().map((stepItem, index) => {
                      const isActive =
                        getProgressPercentage(orderData.status) >=
                        (index + 1) * 20;
                      const isCurrent = stepItem.key === orderData.status;
                      const IconComponent = stepItem.icon;

                      return (
                        <div
                          key={stepItem.key}
                          className="flex flex-col items-center relative z-20"
                        >
                          <div
                            className={`
                            w-12 h-12 rounded-full flex items-center justify-center border-4 transition-all duration-300
                            ${
                              isActive
                                ? "bg-gradient-to-r from-green-500 to-teal-600 border-green-500 text-white shadow-lg"
                                : "bg-white border-gray-300 text-gray-400"
                            }
                            ${isCurrent ? "ring-4 ring-green-200 scale-110" : ""}
                          `}
                          >
                            <IconComponent className="h-5 w-5" />
                          </div>
                          <span
                            className={`
                            text-xs font-medium mt-2 text-center max-w-20
                            ${isActive ? "text-gray-900" : "text-gray-500"}
                          `}
                          >
                            {stepItem.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Delivery Info */}
                  {orderData.delivery_date && (
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 bg-blue-500 rounded-lg p-3 mr-4">
                          <Calendar className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-blue-900 text-lg mb-2">
                            Scheduled Delivery
                          </h3>
                          <p className="text-blue-800 font-semibold">
                            {new Date(
                              orderData.delivery_date,
                            ).toLocaleDateString("en-IN", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                          {orderData.delivery_slot && (
                            <p className="text-blue-700 text-sm mt-1">
                              Time Slot: {orderData.delivery_slot}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Tracking Number */}
                  {orderData.tracking_number && (
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 bg-green-500 rounded-lg p-3 mr-4">
                          <Truck className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-green-900 text-lg mb-2">
                            Tracking Number
                          </h3>
                          <div className="flex items-center bg-white rounded-lg p-3 border border-green-200">
                            <p className="text-green-800 font-mono font-bold flex-1">
                              {orderData.tracking_number}
                            </p>
                            <Button
                              onClick={() =>
                                copyToClipboard(orderData.tracking_number!)
                              }
                              variant="ghost"
                              size="sm"
                              className="ml-2 h-8 w-8 p-0 hover:bg-green-100"
                            >
                              {copiedTrackingNumber ? (
                                <Check className="h-4 w-4 text-green-600" />
                              ) : (
                                <Copy className="h-4 w-4 text-green-600" />
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Delivery Address - Full Width */}
                {orderData.shipping_address && (
                  <div className="bg-gradient-to-br from-gray-50 to-slate-50 border-2 border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 bg-gray-600 rounded-lg p-3 mr-4">
                        <MapPin className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg mb-3">
                          Delivery Address
                        </h3>
                        <div className="space-y-2 text-gray-700">
                          <p className="font-semibold text-gray-900">
                            {orderData.shipping_address.name}
                          </p>
                          <p>{orderData.shipping_address.address_line_1}</p>
                          {orderData.shipping_address.address_line_2 && (
                            <p>{orderData.shipping_address.address_line_2}</p>
                          )}
                          <p className="font-medium">
                            {orderData.shipping_address.city},{" "}
                            {orderData.shipping_address.state}{" "}
                            {orderData.shipping_address.pincode}
                          </p>
                          {orderData.shipping_address.phone && (
                            <p className="flex items-center mt-2">
                              <Phone className="h-4 w-4 mr-2 text-gray-500" />
                              {orderData.shipping_address.phone}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Special Instructions */}
                {orderData.special_instructions && (
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-xl p-6">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 bg-amber-500 rounded-lg p-3 mr-4">
                        <AlertCircle className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-amber-900 text-lg mb-2">
                          Special Instructions
                        </h3>
                        <p className="text-amber-800">
                          {orderData.special_instructions}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-t-lg">
                <div className="flex items-center">
                  <div className="bg-white/20 rounded-lg p-2 mr-3">
                    <ShoppingBag className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-2xl font-bold">
                    Order Items ({orderData.items.length})
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {orderData.items.map((item: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-center space-x-4 p-6 bg-gradient-to-r from-gray-50 to-slate-50 border-2 border-gray-200 rounded-xl hover:shadow-lg transition-all duration-200"
                    >
                      {item.image && (
                        <div className="flex-shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-20 h-20 object-cover rounded-xl shadow-md"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 text-lg mb-1 truncate">
                          {item.name}
                        </h3>
                        {item.variant && (
                          <p className="text-sm text-gray-600 mb-1">
                            <span className="font-medium">Variant:</span>{" "}
                            {item.variant}
                          </p>
                        )}
                        <div className="flex items-center text-sm text-gray-600">
                          <Package className="h-4 w-4 mr-1" />
                          <span className="font-medium">Quantity:</span>
                          <span className="ml-1 bg-gray-200 px-2 py-1 rounded-full font-bold text-gray-800">
                            {item.quantity}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-xl text-gray-900">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                        <p className="text-sm text-gray-600">
                          {formatPrice(item.price)} each
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Total */}
                <div className="bg-gradient-to-r from-slate-100 to-gray-100 rounded-xl p-6 mt-6">
                  <div className="space-y-3">
                    <div className="flex justify-between text-gray-700">
                      <span className="font-medium">Subtotal</span>
                      <span className="font-semibold">
                        {formatPrice(
                          orderData.total_amount - orderData.shipping_amount,
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                      <span className="font-medium">Shipping</span>
                      <span className="font-semibold">
                        {orderData.shipping_amount === 0
                          ? "FREE"
                          : formatPrice(orderData.shipping_amount)}
                      </span>
                    </div>
                    <div className="border-t-2 border-gray-300 pt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xl font-bold text-gray-900">
                          Total Amount
                        </span>
                        <span className="text-2xl font-bold text-green-600">
                          {formatPrice(orderData.total_amount)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                onClick={resetForm}
                variant="outline"
                className="py-4 border-2 border-gray-300 hover:border-gray-400 rounded-xl font-semibold text-gray-700 hover:text-gray-900 transition-all duration-200"
              >
                <Search className="h-5 w-5 mr-2" />
                Track Another Order
              </Button>
              <Button
                onClick={() => window.print()}
                variant="outline"
                className="py-4 border-2 border-blue-300 hover:border-blue-400 rounded-xl font-semibold text-blue-700 hover:text-blue-900 transition-all duration-200"
              >
                <Package className="h-5 w-5 mr-2" />
                Print Details
              </Button>
              <Button
                onClick={() => (window.location.href = "/")}
                className="py-4 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] font-semibold"
              >
                <ShoppingBag className="h-5 w-5 mr-2" />
                Continue Shopping
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
