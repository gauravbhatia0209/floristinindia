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
    res.status(200).json({
      success: true,
      message: "Payments API is healthy",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || "production",
      endpoints: {
        methods: "/api/payments/methods",
        create: "/api/payments/create",
        status: "/api/payments/status/[id]",
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
