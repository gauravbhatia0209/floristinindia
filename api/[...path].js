// Catch-all handler for API routes
const { createServer } = require("../server/dist/index.js");

let app;

module.exports = async (req, res) => {
  try {
    console.log(`API Request: ${req.method} ${req.url}`);
    console.log(`API Headers:`, req.headers);

    if (!app) {
      console.log("Creating Express app...");
      app = createServer();
    }

    return app(req, res);
  } catch (error) {
    console.error("API Error:", error);

    // Ensure JSON response
    res.setHeader("Content-Type", "application/json");
    res.status(500).json({
      success: false,
      error: "Server initialization error",
      details: error.message,
      stack: error.stack,
    });
  }
};
