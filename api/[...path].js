// Catch-all handler for API and root routes
let app;
let serverPromise;

function getServer() {
  if (serverPromise) {
    return serverPromise;
  }

  serverPromise = (async () => {
    try {
      // Use dynamic import to load ES6 module from CommonJS
      const { createServer } = await import("../server/dist/index.js");
      app = createServer();
      console.log("✅ Express server created successfully");
      return app;
    } catch (error) {
      console.error("❌ Failed to create server:", error);
      throw error;
    }
  })();

  return serverPromise;
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
        details: error instanceof Error ? error.message : String(error),
      });
    }
  }
};
