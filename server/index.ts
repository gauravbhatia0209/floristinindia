import express from "express";
import cors from "cors";
import path from "path";
import { handleDemo } from "./routes/demo";
import uploadRoutes from "./routes/upload";
import aiDataRoutes from "./routes/ai-data";
import sitemapRoutes from "./routes/sitemap";
import adminUpdatesRoutes from "./routes/admin-updates";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Serve static files from uploads directory
  app.use(
    "/uploads",
    express.static(path.join(process.cwd(), "public", "uploads")),
  );

  // API routes
  app.get("/api/ping", (_req, res) => {
    res.json({ message: "Hello from Express server v2!" });
  });

  app.get("/api/demo", handleDemo);

  // Upload routes
  app.use("/api/upload", uploadRoutes);

  // AI-readable data routes
  app.use("/api/ai", aiDataRoutes);

  // Sitemap routes
  app.use("/", sitemapRoutes);

  // Admin update notification routes for AI cache management
  app.use("/api/admin", adminUpdatesRoutes);

  return app;
}

// Start the server when this file is run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const app = createServer();
  const port = process.env.PORT || 3000;

  app.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}`);
    console.log(`📡 API available at http://localhost:${port}/api`);
    console.log(`🔍 Health check: http://localhost:${port}/api/ping`);
  });
}
