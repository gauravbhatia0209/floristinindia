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
      console.log("❌ Payment intent not found:", payment_intent_id);
      return res.status(404).json({
        success: false,
        error: "Payment intent not found",
        code: "PAYMENT_INTENT_NOT_FOUND",
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
