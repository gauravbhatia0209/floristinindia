// Handler for uploads routes
const { createServer } = require("../server/dist/index.js");

let app;

module.exports = async (req, res) => {
  if (!app) {
    app = createServer();
  }

  return app(req, res);
};
