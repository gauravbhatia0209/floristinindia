import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { trackPurchase, trackFBPurchase } from "@/lib/analytics";

const CheckoutSuccess: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { items, totals, clearCart } = useCart();
  const { customer } = useAuth();
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [orderCreated, setOrderCreated] = useState(false);
  const [createdOrderNumber, setCreatedOrderNumber] = useState<string>("");

  const paymentIntent = searchParams.get("payment_intent");
  const orderNumber = searchParams.get("order_number");
  const razorpayPaymentId = searchParams.get("razorpay_payment_id");

  console.log("🎉 CheckoutSuccess: Payment success page loaded with params:", {
    paymentIntent,
    orderNumber,
    razorpayPaymentId,
    hasItems: items.length > 0,
    hasCustomer: !!customer,
    totals
  });

  useEffect(() => {
    // If we already have an order number from URL, use it
    if (orderNumber) {
      console.log("🔄 CheckoutSuccess: Order number already in URL, redirecting:", orderNumber);
      navigate(`/order-confirmation/${orderNumber}`, { replace: true });
      return;
    }

    // If we have payment success, update the existing order status
    if ((paymentIntent || razorpayPaymentId) && !orderCreated && !isCreatingOrder) {
      updateOrderStatusAfterPayment();
    }
  }, [orderNumber, paymentIntent, razorpayPaymentId, orderCreated, isCreatingOrder]);

  const createOrderFromPaymentSuccess = async () => {
    if (!customer) {
      console.error("❌ CheckoutSuccess: No customer found for order creation");
      return;
    }

    if (!items || items.length === 0) {
      console.error("❌ CheckoutSuccess: No cart items found for order creation");
      return;
    }

    setIsCreatingOrder(true);
    console.log("🔄 CheckoutSuccess: Creating order from payment success...");

    try {
      // Get form data from localStorage (saved during checkout)
      const savedFormData = localStorage.getItem("checkoutFormData");
      const savedUploadedFiles = localStorage.getItem("uploadedFiles");

      if (!savedFormData) {
        throw new Error("No form data found in localStorage");
      }

      const form = JSON.parse(savedFormData);
      const uploadedFiles = savedUploadedFiles ? JSON.parse(savedUploadedFiles) : [];

      console.log("📋 CheckoutSuccess: Retrieved form data:", { form, uploadedFiles });

      // Generate order number
      const newOrderNumber = `FII${Date.now().toString().slice(-5)}`;

      console.log("🔄 CheckoutSuccess: Creating order with number:", newOrderNumber);

      const orderData = {
        order_number: newOrderNumber,
        customer_id: customer.id,
        status: "pending",
        total_amount: totals.total,
        shipping_amount: totals.shipping,
        discount_amount: totals.discount,
        tax_amount: totals.tax,
        items: items.map((item) => {
          const uploadedFileData = uploadedFiles.find(
            (f: any) => f.product_id === item.product_id,
          );

          return {
            product_id: item.product_id,
            product_name: item.product.name,
            variant_id: item.variant_id,
            variant_name: item.variant?.name,
            quantity: item.quantity,
            unit_price:
              item.variant?.sale_price ||
              item.variant?.price ||
              item.product.sale_price ||
              item.product.price,
            total_price:
              (item.variant?.sale_price ||
                item.variant?.price ||
                item.product.sale_price ||
                item.product.price) * item.quantity,
            uploaded_file_url: uploadedFileData?.file_url || null,
            uploaded_file_name: uploadedFileData?.file_name || null,
            uploaded_file_size: uploadedFileData?.file_size || null,
            uploaded_file_type: uploadedFileData?.file_type || null,
            upload_status: uploadedFileData?.status || null,
          };
        }),
        shipping_address: {
          name: form.receiverName || form.fullName,
          line1: form.addressLine1,
          line2: form.addressLine2 || "",
          city: form.city,
          state: form.state,
          pincode: form.pincode,
          phone: form.receiverPhone
            ? `${form.receiverPhoneCountryCode}${form.receiverPhone}`
            : `${form.phoneCountryCode}${form.phone}`,
          alternate_phone: form.alternatePhone || "",
        },
        billing_address: {
          name: form.fullName,
          line1: form.addressLine1,
          line2: form.addressLine2 || "",
          city: form.city,
          state: form.state,
          pincode: form.pincode,
          phone: `${form.phoneCountryCode}${form.phone}`,
          alternate_phone: form.alternatePhone || "",
        },
        delivery_date: form.deliveryDate || null,
        delivery_slot: form.deliverySlot || null,
        special_instructions: form.specialInstructions || null,
        customer_message: form.orderMessage || null,
        receiver_name: form.receiverName || form.fullName,
        receiver_phone: form.receiverPhone
          ? `${form.receiverPhoneCountryCode}${form.receiverPhone}`
          : `${form.phoneCountryCode}${form.phone}`,
        alternate_phone: form.alternatePhone || "",
        delivery_instructions: form.specialInstructions || null,
        uploaded_files: uploadedFiles,
        payment_method: "razorpay",
        payment_status: "paid",
        payment_reference: razorpayPaymentId || paymentIntent,
        coupon_code: null, // TODO: Get from localStorage if stored
      };

      console.log("📤 CheckoutSuccess: Inserting order data:", orderData);

      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert(orderData)
        .select()
        .single();

      console.log("📨 CheckoutSuccess: Order creation result:", { order, orderError });

      if (orderError) throw orderError;

      // Track purchase in analytics
      const orderItems = items.map((item) => ({
        item_id: item.product.id,
        item_name: item.product.name,
        category: item.product.category_name,
        quantity: item.quantity,
        price: item.product.price,
      }));
      trackPurchase(newOrderNumber, totals.total, orderItems);

      // Track purchase in Facebook Pixel
      const fbContentIds = items.map((item) => item.product.id);
      trackFBPurchase(totals.total, "INR", fbContentIds, items.length);

      // Clear cart and saved data
      clearCart();
      localStorage.removeItem("checkoutFormData");
      localStorage.removeItem("uploadedFiles");

      console.log("✅ CheckoutSuccess: Order created successfully:", newOrderNumber);
      setCreatedOrderNumber(newOrderNumber);
      setOrderCreated(true);

      // Redirect to order confirmation
      navigate(`/order-confirmation/${newOrderNumber}`, { replace: true });

    } catch (error) {
      console.error("❌ CheckoutSuccess: Error creating order:", error);
      setIsCreatingOrder(false);
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
              Creating Your Order...
            </h1>

            <p className="text-gray-600 mb-8">
              Payment successful! We're now creating your order. Please wait a moment.
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
            {createdOrderNumber && ` Order ${createdOrderNumber} has been created.`}
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
