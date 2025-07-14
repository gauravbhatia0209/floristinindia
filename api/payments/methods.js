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
    const { data: configs, error } = await supabase
      .from("payment_gateway_configs")
      .select("*")
      .eq("enabled", true)
      .order("priority", { ascending: true });

    if (error) {
      console.error("Error fetching payment methods:", error);
      return res.status(500).json({
        success: false,
        error: "Failed to fetch payment methods",
      });
    }

    const methods = configs.map((config) => ({
      gateway: config.id,
      name: config.name,
      enabled: config.enabled,
      min_amount: config.min_amount,
      max_amount: config.max_amount,
      processing_fee: config.processing_fee,
      fixed_fee: config.fixed_fee,
      supported_currencies: config.supported_currencies,
    }));

    res.status(200).json({ success: true, methods });
  } catch (error) {
    console.error("Error in payment methods API:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
}
