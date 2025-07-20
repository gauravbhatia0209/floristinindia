import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  CreditCard,
  ArrowLeft,
  AlertCircle,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function RazorpayPayment() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [paymentData, setPaymentData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string>("");

  const orderId = searchParams.get("order_id");
  const paymentIntentId = searchParams.get("payment_intent");

  console.log("RazorpayPayment initialized with:", {
    orderId,
    paymentIntentId,
    searchParams: Object.fromEntries(searchParams.entries()),
  });

  useEffect(() => {
    if (!orderId && !paymentIntentId) {
      setError("Missing order ID and payment intent ID");
      setLoading(false);
      return;
    }

    loadRazorpayScript();
    fetchPaymentData();
  }, [orderId, paymentIntentId]);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const fetchPaymentData = async () => {
    try {
      const identifier = paymentIntentId || orderId;
      if (!identifier) {
        setError("No payment identifier found");
        setLoading(false);
        return;
      }

      console.log(`Fetching payment data for identifier: ${identifier}`);

      // Fetch Razorpay configuration from database
      let razorpayKeyId = null;

      try {
        const { data: razorpayConfig, error: configError } = await supabase
          .from("payment_gateway_configs")
          .select("*")
          .eq("id", "razorpay")
          .single(); // Remove enabled check to get any config

        if (configError) {
          console.warn("Error fetching Razorpay config:", configError);
        }

        if (razorpayConfig && razorpayConfig.config?.razorpay_key_id) {
          razorpayKeyId = razorpayConfig.config.razorpay_key_id;
          console.log("✅ Found Razorpay key in database config");
        } else {
          console.warn("No Razorpay key found in database config");
        }
      } catch (dbError) {
        console.warn("Database query failed:", dbError);
      }

      // Fallback to test key if no database config found
      if (!razorpayKeyId) {
        console.warn("Using fallback test key - please configure in admin panel");
        razorpayKeyId = "rzp_test_nIGcJWJK5wJn0v"; // Fallback test key
      }

      // Get payment amount from URL params or use default
      const urlParams = new URLSearchParams(window.location.search);
      const amountParam = urlParams.get("amount") || "50000";
      const customerName = urlParams.get("customer_name") || "Customer";
      const customerEmail =
        urlParams.get("customer_email") || "customer@example.com";
      const customerPhone = urlParams.get("customer_phone") || "+919999999999";

      // Create payment data for direct Razorpay integration
      const paymentData = {
        id: identifier,
        gateway: "razorpay",
        order_id: orderId,
        amount: parseInt(amountParam),
        currency: "INR",
        status: "pending",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        gateway_order_id: orderId,
        metadata: {
          key_id: razorpayKeyId, // Use the key from database
          order_id: orderId,
          amount: parseInt(amountParam),
          currency: "INR",
          customer_name: customerName,
          customer_email: customerEmail,
          customer_phone: customerPhone,
          order_number: `ORDER-${Date.now()}`,
        },
      };

      console.log("✅ Payment data created with key:", razorpayKeyId);
      setPaymentData(paymentData);
    } catch (err) {
      console.error("Error creating payment data:", err);
      setError("Failed to load payment information");
    } finally {
      setLoading(false);
    }
  };

  const initiatePayment = async () => {
    if (!window.Razorpay) {
      setError("Razorpay failed to load. Please refresh and try again.");
      return;
    }

    if (!paymentData || !paymentData.metadata) {
      setError("Payment data is not available. Please refresh and try again.");
      return;
    }

    setProcessing(true);

    const razorpayKey = paymentData.metadata?.key_id;

    // Check if Razorpay key is configured
    if (
      !razorpayKey ||
      razorpayKey.includes("YOUR_KEY_HERE") ||
      razorpayKey.includes("REPLACE")
    ) {
      setError(
        "Razorpay is not configured. Please contact the website administrator to set up payment gateway credentials.",
      );
      setProcessing(false);
      return;
    }

    console.log("🔧 Initializing Razorpay with key:", razorpayKey);

    // For direct payments without server API, we don't need to pass order_id
    // Razorpay will handle the payment processing directly
    console.log("🎫 Creating direct payment without order_id");

    const options = {
      key: razorpayKey,
      amount: paymentData.metadata?.amount || paymentData.amount,
      currency: paymentData.metadata?.currency || paymentData.currency || "INR",
      name: "Florist in India",
      description: `Order ${paymentData.metadata?.order_number || paymentData.order_id || "N/A"}`,
      // Remove order_id for direct payments
      handler: function (response: any) {
        console.log("Payment successful:", response);
        // Redirect to success page with available response data
        const successUrl = `/checkout/success?payment_intent=${paymentIntentId}&razorpay_payment_id=${response.razorpay_payment_id || ''}`;

        // Add order_id and signature if available (they might not be present in direct payments)
        if (response.razorpay_order_id) {
          successUrl += `&razorpay_order_id=${response.razorpay_order_id}`;
        }
        if (response.razorpay_signature) {
          successUrl += `&razorpay_signature=${response.razorpay_signature}`;
        }

        navigate(successUrl);
      },
      prefill: {
        name: paymentData.metadata?.customer_name || "Customer",
        email: paymentData.metadata?.customer_email || "customer@example.com",
        contact: paymentData.metadata?.customer_phone || "+919999999999",
      },
      theme: {
        color: "#F97316", // Orange theme matching the site
      },
      modal: {
        ondismiss: function () {
          setProcessing(false);
          console.log("Payment modal dismissed");
        },
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.on("payment.failed", function (response: any) {
      console.error("Payment failed:", response.error);
      setError(`Payment failed: ${response.error.description}`);
      setProcessing(false);
    });

    rzp.open();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex items-center justify-center p-8">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-orange-600" />
              <p className="text-gray-600">Loading payment information...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    const isConfigurationError =
      error.includes("not configured") || error.includes("administrator");

    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              {isConfigurationError
                ? "Configuration Required"
                : "Payment Error"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>

            {isConfigurationError && (
              <Alert>
                <AlertDescription className="text-sm">
                  <strong>For Admin:</strong> Please configure Razorpay in the
                  admin panel:
                  <br />
                  1. Go to{" "}
                  <a
                    href="https://dashboard.razorpay.com/app/keys"
                    target="_blank"
                    className="text-blue-600 underline"
                  >
                    Razorpay Dashboard
                  </a>
                  <br />
                  2. Copy your Key ID and configure it in Admin → Payment
                  Gateways → Razorpay
                </AlertDescription>
              </Alert>
            )}

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => navigate("/checkout")}
                className="flex-1"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Checkout
              </Button>
              {!isConfigurationError && (
                <Button
                  onClick={() => window.location.reload()}
                  className="flex-1"
                >
                  Retry
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Complete Payment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {paymentData && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Order Summary</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Amount:</span>
                    <span>
                      ₹
                      {(
                        (paymentData.metadata?.amount || paymentData.amount || 0) /
                        100
                      ).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Currency:</span>
                    <span>
                      {paymentData.metadata?.currency || paymentData.currency || "INR"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Order ID:</span>
                    <span className="font-mono text-xs">
                      {paymentData.metadata?.order_number ||
                        paymentData.order_id ||
                        "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              <Button
                onClick={initiatePayment}
                disabled={processing}
                className="w-full py-3 bg-orange-600 hover:bg-orange-700"
                size="lg"
              >
                {processing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4 mr-2" />
                    Pay ₹
                    {(
                      (paymentData.metadata?.amount || paymentData.amount || 0) / 100
                    ).toLocaleString()}
                  </>
                )}
              </Button>

              <div className="text-center">
                <Button
                  variant="link"
                  onClick={() => navigate("/checkout")}
                  className="text-sm"
                >
                  <ArrowLeft className="h-3 w-3 mr-1" />
                  Back to Checkout
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
