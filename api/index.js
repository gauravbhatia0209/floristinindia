// Main API handler that delegates to Express server
let app;
let serverPromise;

function getServer() {
  if (serverPromise) {
    return serverPromise;
  }

  serverPromise = (async () => {
    try {
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
    const server = await getServer();
    return server(req, res);
  } catch (error) {
    console.error("❌ Server Error:", error);
    res.status(500).json({
      success: false,
      error: "Server initialization error",
      details: error instanceof Error ? error.message : String(error),
    });
  }
};
