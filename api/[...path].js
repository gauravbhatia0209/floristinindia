// Catch-all handler for API routes
const { createServer } = require("../server/dist/index.js");

let app;

module.exports = async (req, res) => {
  if (!app) {
    app = createServer();
  }

  return app(req, res);
};
