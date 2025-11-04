const { createServer } = require("../server/dist/index.js");

let app;

module.exports = async (req, res) => {
  try {
    if (!app) {
      app = createServer();
    }

    // Create a request object for Express
    const route = req.url.includes(".txt") ? "/sitemap.txt" : "/sitemap";
    
    req.path = route;
    req.url = route;
    
    // Forward to Express app
    app(req, res);
  } catch (error) {
    console.error("Sitemap route error:", error);
    res.status(500).send("Error");
  }
};
