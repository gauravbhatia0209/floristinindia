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
    console.log("📡 Payment methods API called at:", new Date().toISOString());

    // Try to query the database first, but handle gracefully if table doesn't exist
    let methods = [];

    try {
      const { data: configs, error } = await supabase
        .from("payment_gateway_configs")
        .select("*")
        .eq("enabled", true)
        .order("priority", { ascending: true });

      if (!error && configs && configs.length > 0) {
        console.log("✅ Found payment configs in database:", configs.length);
        methods = configs.map((config) => ({
          gateway: config.id,
          name: config.name,
          description: config.description || "Online payment",
          enabled: config.enabled,
          min_amount: config.min_amount || 100,
          max_amount: config.max_amount || 1000000,
          processing_fee: config.processing_fee || 0,
          fixed_fee: config.fixed_fee || 0,
          supported_currencies: config.supported_currencies || ["INR"],
        }));
      } else {
        console.log("⚠️ No payment configs found or error:", error);
        throw new Error("No database configs available");
      }
    } catch (dbError) {
      console.log("❌ Database query failed:", dbError.message);

      // Return error instead of hardcoded fallback
      return res.status(500).json({
        success: false,
        error:
          "Payment methods are not configured in the database. Please contact the administrator.",
        details: dbError.message,
      });
    }

    console.log("✅ Returning payment methods:", methods);
    res.status(200).json({
      success: true,
      methods,
      timestamp: new Date().toISOString(),
      source: methods.length > 1 ? "database" : "default",
    });
  } catch (error) {
    console.error("❌ Critical error in payment methods API:", error);

    // Always return something usable, even if everything fails
    const fallbackMethods = [
      {
        gateway: "razorpay",
        name: "Razorpay",
        description: "Pay with cards, UPI, wallets & netbanking",
        enabled: true,
        min_amount: 100,
        max_amount: 1000000,
        processing_fee: 0,
        fixed_fee: 0,
        supported_currencies: ["INR"],
      },
    ];

    res.status(200).json({
      success: true,
      methods: fallbackMethods,
      timestamp: new Date().toISOString(),
      source: "fallback",
    });
  }
}
