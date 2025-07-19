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

  try {
    // Check if payment_gateway_configs table exists and has data
    const { data: configs, error } = await supabase
      .from("payment_gateway_configs")
      .select("*")
      .limit(10);

    res.status(200).json({
      success: true,
      message: "Database check results",
      table_exists: !error,
      error_details: error ? error.message : null,
      data_count: configs ? configs.length : 0,
      sample_data: configs ? configs : [],
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Database check failed",
      details: error.message,
    });
  }
}
