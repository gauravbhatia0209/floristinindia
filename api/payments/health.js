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
    // Check database configuration
    let databaseConfig = { configured: false, details: "Not checked" };
    try {
      const { data: configs, error } = await supabase
        .from("payment_gateway_configs")
        .select("id, name, enabled, config")
        .eq("id", "razorpay")
        .single();

      if (!error && configs) {
        databaseConfig = {
          configured: true,
          enabled: configs.enabled,
          has_key_id: !!configs.config?.razorpay_key_id,
          key_preview: configs.config?.razorpay_key_id
            ? configs.config.razorpay_key_id.substring(0, 8) + "..."
            : "not set",
        };
      } else {
        databaseConfig = {
          configured: false,
          details: "No Razorpay config found in database",
        };
      }
    } catch (dbError) {
      databaseConfig = {
        configured: false,
        details: `Database error: ${dbError.message}`,
      };
    }

    res.status(200).json({
      success: true,
      message: "Payments API is healthy",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || "production",
      configuration: {
        env_razorpay_key: !!process.env.RAZORPAY_KEY_ID,
        database_config: databaseConfig,
      },
      endpoints: {
        methods: "/api/payments/methods",
        create: "/api/payments/create",
        status: "/api/payments/status/[id]",
        health: "/api/payments/health",
      },
    });
  } catch (error) {
    console.error("❌ Health check error:", error);
    res.status(500).json({
      success: false,
      error: "Health check failed",
    });
  }
}
