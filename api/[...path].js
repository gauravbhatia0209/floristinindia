// Catch-all handler for API and root routes
const path = require("path");

let app;

async function getServer() {
  if (!app) {
    try {
      const serverPath = path.resolve(__dirname, "../server/dist/index.js");
      const serverModule = await import(serverPath);
      app = serverModule.createServer();
      console.log("✅ Express server created successfully");
    } catch (error) {
      console.error("❌ Failed to create server:", error);
      throw error;
    }
  }
  return app;
}

module.exports = async (req, res) => {
  try {
    console.log(`📨 Request: ${req.method} ${req.url}`);

    const server = await getServer();
    return server(req, res);
  } catch (error) {
    console.error("❌ Server Error:", error);
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
