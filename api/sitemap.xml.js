const { createServer } = require("../server/dist/index.js");

let app;

module.exports = async (req, res) => {
  try {
    if (!app) {
      app = createServer();
    }

    // Create a fake request for the Express router
    const fakeReq = {
      method: "GET",
      path: "/sitemap.xml",
      url: "/sitemap.xml",
      query: req.query || {},
      headers: req.headers || {},
      get: (key) => req.headers?.[key.toLowerCase()] || req.headers?.[key],
      protocol: req.headers?.["x-forwarded-proto"] || "https",
      hostname: req.headers?.host || req.headers?.["x-forwarded-host"],
    };

    // Create a response wrapper
    const fakeRes = {
      headers: {},
      statusCode: 200,
      setHeader: (key, value) => {
        fakeRes.headers[key] = value;
      },
      status: (code) => {
        fakeRes.statusCode = code;
        return fakeRes;
      },
      send: (data) => {
        res.setHeader("Content-Type", fakeRes.headers["Content-Type"] || "application/xml");
        Object.entries(fakeRes.headers).forEach(([key, value]) => {
          res.setHeader(key, value);
        });
        res.status(fakeRes.statusCode).send(data);
      },
      json: (data) => {
        res.setHeader("Content-Type", "application/json");
        res.status(fakeRes.statusCode).json(data);
      },
      get: (key) => fakeRes.headers[key],
    };

    // Call the appropriate route handler directly
    return app._router.handle(fakeReq, fakeRes);
  } catch (error) {
    console.error("Sitemap XML Error:", error);
    res.status(500).send("Error generating sitemap");
  }
};
