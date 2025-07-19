import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY,
);

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Content-Type", "application/json");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "Method not allowed",
    });
  }

  try {
    console.log("💳 Payment creation request received");

    const {
      gateway_id,
      amount,
      currency = "INR",
      customer,
      return_url,
      cancel_url,
      metadata = {},
    } = req.body;

    // Validate required fields
    const requiredFields = {
      gateway_id,
      amount,
      currency,
      customer,
      return_url,
      cancel_url,
    };

    const missingFields = Object.entries(requiredFields)
      .filter(([key, value]) => !value)
      .map(([key]) => key);

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields",
        missing_fields: missingFields,
      });
    }

    // Validate customer object
    if (!customer.name || !customer.email) {
      return res.status(400).json({
        success: false,
        error: "Customer name and email are required",
      });
    }

    // Get gateway configuration from database
    let gatewayConfig = null;
    try {
      const { data: configs, error } = await supabase
        .from("payment_gateway_configs")
        .select("*")
        .eq("id", gateway_id)
        .eq("enabled", true)
        .single();

      if (!error && configs) {
        gatewayConfig = configs;
      }
    } catch (configError) {
      console.log(
        "⚠️ Could not fetch gateway config from database:",
        configError.message,
      );
    }

    // For now, only support Razorpay
    if (gateway_id !== "razorpay") {
      return res.status(400).json({
        success: false,
        error: "Only Razorpay gateway is currently supported",
      });
    }

    if (
      !gatewayConfig ||
      !gatewayConfig.config ||
      !gatewayConfig.config.razorpay_key_id
    ) {
      console.log("❌ Razorpay configuration missing in database");
      return res.status(400).json({
        success: false,
        error:
          "Payment gateway configuration is missing. Please set up Razorpay credentials in the admin panel.",
        code: "GATEWAY_NOT_CONFIGURED",
        next_steps: [
          "Go to Admin Panel > Settings > Payment Gateways",
          "Configure Razorpay with valid API keys",
          "Enable Razorpay payment method",
        ],
      });
    }

    // Validate amount
    if (amount < 100 || amount > 10000000) {
      return res.status(400).json({
        success: false,
        error: "Amount must be between ₹1 and ₹100,000",
      });
    }

    // Create payment intent record
    const paymentIntentId = crypto.randomUUID();
    const orderNumber = metadata.order_number || `ORDER-${Date.now()}`;

    // Create placeholder order if needed
    let orderId = null;
    try {
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          order_number: orderNumber,
          status: "pending",
          total_amount: amount / 100, // Convert paise to rupees
          shipping_amount: 0,
          tax_amount: 0,
          customer_name: customer.name,
          customer_email: customer.email,
          customer_phone: customer.phone || "",
          shipping_address_line1: customer.address?.line1 || "",
          shipping_address_city: customer.address?.city || "",
          shipping_address_state: customer.address?.state || "",
          shipping_address_pincode: customer.address?.pincode || "",
          shipping_address_country: customer.address?.country || "IN",
        })
        .select()
        .single();

      if (!orderError && order) {
        orderId = order.id;
        console.log("✅ Created placeholder order:", orderId);
      }
    } catch (orderError) {
      console.log("⚠️ Could not create placeholder order:", orderError.message);
    }

    // Create payment intent
    const intentData = {
      id: paymentIntentId,
      gateway: gateway_id,
      order_id: orderId,
      amount: amount,
      currency: currency,
      status: "pending",
      metadata: {
        customer_name: customer.name,
        customer_email: customer.email,
        customer_phone: customer.phone,
        order_number: orderNumber,
        ...metadata,
      },
    };

    try {
      await supabase.from("payment_intents").insert(intentData);
      console.log("✅ Payment intent created:", paymentIntentId);
    } catch (intentError) {
      console.log("⚠️ Could not save payment intent:", intentError.message);
    }

    // Generate Razorpay payment URL
    const baseUrl =
      req.headers.origin ||
      req.headers.host ||
      "https://www.floristinindia.com";
    const razorpayOrderId = `rzp_order_${Date.now()}`;

    const paymentUrl = `${baseUrl}/razorpay-payment?order_id=${razorpayOrderId}&payment_intent=${paymentIntentId}`;

    console.log("✅ Payment creation successful");

    res.status(200).json({
      success: true,
      payment_intent_id: paymentIntentId,
      gateway: gateway_id,
      payment_url: paymentUrl,
      metadata: {
        razorpay_order_id: razorpayOrderId,
        order_number: orderNumber,
        amount: amount,
        currency: currency,
        key_id: gatewayConfig.config.razorpay_key_id, // Use actual Razorpay key from database
        customer_name: customer.name,
        customer_email: customer.email,
        customer_phone: customer.phone,
      },
    });
  } catch (error) {
    console.error("❌ Error creating payment:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
}
