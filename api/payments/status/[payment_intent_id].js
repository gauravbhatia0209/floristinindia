import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY,
);

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Content-Type", "application/json");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      error: "Method not allowed",
    });
  }

  try {
    const { payment_intent_id } = req.query;

    if (!payment_intent_id) {
      return res.status(400).json({
        success: false,
        error: "Payment intent ID is required",
      });
    }

    console.log("🔍 Checking payment status for:", payment_intent_id);

    // Try to find payment intent by ID
    let intent = null;
    try {
      const { data, error } = await supabase
        .from("payment_intents")
        .select("*")
        .eq("id", payment_intent_id)
        .single();

      if (!error && data) {
        intent = data;
      }
    } catch (dbError) {
      console.log("⚠️ Database query failed:", dbError.message);
    }

    // If not found by ID, try by gateway_order_id (for Razorpay order IDs)
    if (!intent) {
      try {
        const { data, error } = await supabase
          .from("payment_intents")
          .select("*")
          .eq("gateway_order_id", payment_intent_id)
          .single();

        if (!error && data) {
          intent = data;
        }
      } catch (dbError) {
        console.log("⚠️ Gateway order ID query failed:", dbError.message);
      }
    }

    if (!intent) {
      console.log(
        "⚠️ Payment intent not found, trying to get Razorpay config from database",
      );

      // Try to get Razorpay configuration from database
      let razorpayConfig = null;
      try {
        const { data: configs, error } = await supabase
          .from("payment_gateway_configs")
          .select("*")
          .eq("id", "razorpay")
          .eq("enabled", true)
          .single();

        if (!error && configs) {
          razorpayConfig = configs.config;
        }
      } catch (configError) {
        console.log(
          "⚠️ Could not fetch Razorpay config from database:",
          configError.message,
        );
      }

      if (!razorpayConfig || !razorpayConfig.razorpay_key_id) {
        return res.status(400).json({
          success: false,
          error: "Razorpay is not properly configured. Please contact support.",
        });
      }

      return res.status(200).json({
        success: true,
        payment_intent: {
          id: payment_intent_id,
          gateway: "razorpay",
          order_id: null,
          amount: 50000, // Mock amount
          currency: "INR",
          status: "pending",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          metadata: {
            // Razorpay configuration from database
            key_id: razorpayConfig.razorpay_key_id,
            order_id: `rzp_order_${Date.now()}`,
            amount: 50000,
            currency: "INR",
            customer_name: "Test Customer",
            customer_email: "test@example.com",
            customer_phone: "+919999999999",
            order_number: `ORDER-${Date.now()}`,
            mock: true,
          },
        },
      });
    }

    console.log("✅ Found payment intent:", intent.id);

    res.status(200).json({
      success: true,
      payment_intent: intent,
    });
  } catch (error) {
    console.error("❌ Error checking payment status:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
}
