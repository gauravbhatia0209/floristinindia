// Dedicated upload route for Vercel
const { createServer } = require("../../server/dist/index.js");

let app;

module.exports = async (req, res) => {
  try {
    if (!app) {
      app = createServer();
    }

    // Ensure we handle the upload route specifically
    return app(req, res);
  } catch (error) {
    console.error("Upload API error:", error);
    res.status(500).json({
      success: false,
      error: "Server error",
      details: error.message,
    });
  }
};
