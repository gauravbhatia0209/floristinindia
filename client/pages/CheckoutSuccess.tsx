import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { useCart } from "@/hooks/useCart";
import { supabase } from "@/lib/supabase";
import { useGoogleAnalytics } from "@/components/GoogleAnalytics";
import { useFacebookPixel } from "@/components/FacebookPixel";

const CheckoutSuccess: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { items, totals, clearCart } = useCart();
  const { trackPurchase } = useGoogleAnalytics();
  const { trackPurchase: trackFBPurchase } = useFacebookPixel();
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [orderCreated, setOrderCreated] = useState(false);
  const [createdOrderNumber, setCreatedOrderNumber] = useState<string>("");
  const [updateAttempted, setUpdateAttempted] = useState(false);

  const paymentIntent = searchParams.get("payment_intent");
  const orderNumber = searchParams.get("order_number");
  const razorpayPaymentId = searchParams.get("razorpay_payment_id");

  console.log("🎉 CheckoutSuccess: Payment success page loaded with params:", {
    paymentIntent,
    orderNumber,
    razorpayPaymentId,
    hasItems: items.length > 0,
    totals,
  });

  useEffect(() => {
    // If we already have an order number from URL, use it
    if (orderNumber) {
      console.log(
        "🔄 CheckoutSuccess: Order number already in URL, redirecting:",
        orderNumber,
      );
      navigate(`/order-confirmation/${orderNumber}`, { replace: true });
      return;
    }

    // If we have payment success, update the existing order status
    if (
      (paymentIntent || razorpayPaymentId) &&
      !orderCreated &&
      !isCreatingOrder &&
      !updateAttempted
    ) {
      console.log("🎯 CheckoutSuccess: Attempting order status update...");
      setUpdateAttempted(true);
      updateOrderStatusAfterPayment();
    }
  }, [
    orderNumber,
    paymentIntent,
    razorpayPaymentId,
    orderCreated,
    isCreatingOrder,
    updateAttempted,
  ]);

  const updateOrderStatusAfterPayment = async () => {
    setIsCreatingOrder(true);
    console.log(
      "🔄 CheckoutSuccess: Updating order status after successful payment...",
    );

    try {
      // Get the pending order number from localStorage
      const pendingOrderNumber = localStorage.getItem("pendingOrderNumber");

      if (!pendingOrderNumber) {
        console.error("❌ CheckoutSuccess: No pending order number found in localStorage");
        // Try to extract order number from URL or show generic success
        const urlOrderNumber = new URLSearchParams(window.location.search).get("order_number");
        if (urlOrderNumber) {
          console.log("🔄 CheckoutSuccess: Using order number from URL:", urlOrderNumber);
          setCreatedOrderNumber(urlOrderNumber);
          setOrderCreated(true);
          navigate(`/order-confirmation/${urlOrderNumber}`, { replace: true });
          return;
        }
        throw new Error("No pending order number found in localStorage and no order number in URL");
      }

      console.log(
        "📋 CheckoutSuccess: Found pending order number:",
        pendingOrderNumber,
      );

      // Update the order status to "confirmed" and payment details
      const updateData = {
        status: "confirmed",
        payment_status: "paid",
        payment_reference: razorpayPaymentId || paymentIntent,
        payment_method: "razorpay",
        updated_at: new Date().toISOString(),
      };

      console.log("📤 CheckoutSuccess: Updating order with data:", updateData);

      const { data: updatedOrder, error: updateError } = await supabase
        .from("orders")
        .update(updateData)
        .eq("order_number", pendingOrderNumber)
        .select()
        .single();

      console.log("📨 CheckoutSuccess: Order update result:", {
        updatedOrder,
        updateError,
      });

      if (updateError) throw updateError;

      if (!updatedOrder) {
        throw new Error(
          `No order found with order number: ${pendingOrderNumber}`,
        );
      }

      // Track purchase in analytics (only if we have cart data)
      if (items && items.length > 0) {
        const orderItems = items.map((item) => ({
          item_id: item.product.id,
          item_name: item.product.name,
          category: item.product.category_name,
          quantity: item.quantity,
          price: item.product.price,
        }));
        trackPurchase(pendingOrderNumber, totals.total, orderItems);

        // Track purchase in Facebook Pixel
        const fbContentIds = items.map((item) => item.product.id);
        trackFBPurchase(totals.total, "INR", fbContentIds, items.length);

        // Clear cart after successful order confirmation
        clearCart();
      }

      // Clean up localStorage
      localStorage.removeItem("pendingOrderNumber");

      console.log(
        "✅ CheckoutSuccess: Payment confirmed, order status updated.",
      );
      setCreatedOrderNumber(pendingOrderNumber);
      setOrderCreated(true);

      // Redirect to order confirmation
      navigate(`/order-confirmation/${pendingOrderNumber}`, { replace: true });
    } catch (error) {
      console.error("❌ CheckoutSuccess: Error updating order status:", error);
      setIsCreatingOrder(false);

      // If update fails, still show success to user since payment was successful
      // The order exists in database with "pending" status
      const pendingOrderNumber = localStorage.getItem("pendingOrderNumber");
      if (pendingOrderNumber) {
        console.log("⚠️ CheckoutSuccess: Order update failed but payment was successful, showing success with pending order");
        setCreatedOrderNumber(pendingOrderNumber);
        setOrderCreated(true);
        // Clean up localStorage
        localStorage.removeItem("pendingOrderNumber");
        navigate(`/order-confirmation/${pendingOrderNumber}`, { replace: true });
      } else {
        // If no order number, just show generic success
        console.log("⚠️ CheckoutSuccess: Order update failed and no order number found, showing generic success");
        setOrderCreated(true);
      }
    }
  };

  if (isCreatingOrder) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-2xl">
        <Card className="text-center shadow-lg">
          <CardContent className="pt-12 pb-8">
            <div className="text-orange-500 text-6xl mb-6">
              <Loader2 className="w-16 h-16 mx-auto animate-spin" />
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Confirming Your Order...
            </h1>

            <p className="text-gray-600 mb-8">
              Payment successful! We're now confirming your order. Please wait a
              moment.
            </p>

            {(paymentIntent || razorpayPaymentId) && (
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <p className="text-sm text-gray-600">Payment Reference</p>
                <p className="font-mono text-sm font-semibold break-all">
                  {razorpayPaymentId || paymentIntent}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl">
      <Card className="text-center shadow-lg">
        <CardContent className="pt-12 pb-8">
          <div className="text-green-500 text-6xl mb-6">
            <CheckCircle className="w-16 h-16 mx-auto" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Payment Successful!
          </h1>

          <p className="text-gray-600 mb-8">
            Thank you for your order. Your payment has been processed
            successfully.
            {createdOrderNumber &&
              ` Order ${createdOrderNumber} has been confirmed.`}
          </p>

          {(paymentIntent || razorpayPaymentId) && (
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <p className="text-sm text-gray-600">Payment Reference</p>
              <p className="font-mono text-sm font-semibold break-all">
                {razorpayPaymentId || paymentIntent}
              </p>
            </div>
          )}

          <div className="space-y-3">
            <Button
              onClick={() => navigate("/orders")}
              className="w-full bg-pink-600 hover:bg-pink-700"
            >
              View Your Orders
            </Button>

            <Button
              variant="outline"
              onClick={() => navigate("/")}
              className="w-full"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Continue Shopping
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CheckoutSuccess;
