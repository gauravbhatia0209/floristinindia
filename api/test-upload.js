// Simple test upload endpoint for debugging
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Content-Type", "application/json");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method === "GET") {
    return res.status(200).json({
      success: true,
      message: "Upload test endpoint is working",
      timestamp: new Date().toISOString(),
      environment: {
        hasSupabaseUrl: !!process.env.VITE_SUPABASE_URL,
        hasSupabaseKey: !!process.env.VITE_SUPABASE_ANON_KEY,
        nodeVersion: process.version,
      },
    });
  }

  if (req.method === "POST") {
    try {
      const body = req.body;
      return res.status(200).json({
        success: true,
        message: "POST request received",
        contentType: req.headers["content-type"],
        bodyLength: JSON.stringify(body).length,
        hasFile: !!req.file,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: "Test upload error",
        details: error.message,
      });
    }
  }

  return res.status(405).json({
    success: false,
    error: "Method not allowed",
  });
}
