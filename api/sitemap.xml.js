const { createServer } = require("../server/dist/index.js");

let app;

module.exports = async (req, res) => {
  try {
    if (!app) {
      app = createServer();
    }

    // Create a mock request that matches Express expectations
    const mockReq = {
      method: req.method,
      url: "/sitemap.xml",
      path: "/sitemap.xml",
      query: {},
      headers: {
        ...req.headers,
        host: req.headers.host || "www.floristinindia.com",
      },
      get: function(key) {
        return this.headers[key.toLowerCase()] || this.headers[key];
      },
      protocol: req.headers["x-forwarded-proto"] || "https",
    };

    // Handle the response
    const originalSend = res.send;
    const originalJson = res.json;
    const originalSetHeader = res.setHeader;

    res.send = function(data) {
      if (res.headersSent) return;
      if (!res.getHeader("Content-Type")) {
        res.setHeader("Content-Type", "application/xml; charset=UTF-8");
      }
      res.end(data);
    };

    res.json = function(data) {
      if (res.headersSent) return;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(data));
    };

    // Find and call the sitemap.xml route handler
    const router = app._router;
    router.handle(mockReq, res);
  } catch (error) {
    console.error("Sitemap error:", error);
    res.status(500).send("Error generating sitemap");
  }
};
