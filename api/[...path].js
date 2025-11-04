// Catch-all handler for API and root routes
const { createServer } = require("../server/dist/index.js");

let app;

module.exports = async (req, res) => {
  try {
    console.log(`Request: ${req.method} ${req.url}`);

    if (!app) {
      console.log("Creating Express app...");
      app = createServer();
    }

    return app(req, res);
  } catch (error) {
    console.error("Server Error:", error);

    // Return appropriate error response
    res.status(500);

    if (req.url.includes(".xml") || req.url.includes(".txt")) {
      res.send("Error generating sitemap");
    } else {
      res.setHeader("Content-Type", "application/json");
      res.json({
        success: false,
        error: "Server initialization error",
        details: error.message,
      });
    }
  }
};
