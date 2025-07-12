import express from "express";
import cors from "cors";
import path from "path";
import { handleDemo } from "./routes/demo";
import uploadRoutes from "./routes/upload";
import aiDataRoutes from "./routes/ai-data";
import sitemapRoutes from "./routes/sitemap";

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

  return app;
}
