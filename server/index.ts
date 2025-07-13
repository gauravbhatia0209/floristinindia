import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import handleDemo from "./routes/demo.js";
import uploadRoutes from "./routes/upload.js";
import aiDataRoutes from "./routes/ai-data.js";
import sitemapRoutes from "./routes/sitemap.js";
import adminUpdatesRoutes from "./routes/admin-updates.js";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Serve static files from uploads directory
  const uploadsPath = process.env.VERCEL
    ? path.join("/tmp", "uploads")
    : path.join(process.cwd(), "public", "uploads");

  // Ensure uploads directory exists
  if (!fs.existsSync(uploadsPath)) {
    fs.mkdirSync(uploadsPath, { recursive: true });
  }

  app.use("/uploads", express.static(uploadsPath));

  // Also serve from public directory for static assets
  app.use("/public", express.static(path.join(process.cwd(), "public")));

  // API routes
  app.get("/api/ping", (_req, res) => {
    res.json({ message: "Hello from Express server v2!" });
  });

  // Upload routes
  app.use("/api/upload", uploadRoutes);

  // Explicit route for serving uploaded files
  app.get("/uploads/*", (req, res) => {
    const filePath = req.path.replace("/uploads/", "");
    const fullPath = path.join(uploadsPath, filePath);

    if (fs.existsSync(fullPath)) {
      res.sendFile(fullPath);
    } else {
      res.status(404).json({ error: "File not found" });
    }
  });

  // AI-readable data routes
  app.use("/api/ai", aiDataRoutes);

  // Sitemap routes
  app.use("/", sitemapRoutes);

  // Admin update notification routes for AI cache management
  app.use("/api/admin", adminUpdatesRoutes);

  // Health check route
  app.get("/api/health", (_req, res) => {
    res.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      service: "florist-backend",
    });
  });

  // Serve static files from client build in production
  if (process.env.NODE_ENV === "production") {
    // In serverless environments, static files are handled by the platform
    // This is a fallback for self-hosted deployments
    const staticPath = process.env.VERCEL
      ? "/tmp/client/dist"
      : path.join(process.cwd(), "../client/dist");

    if (!process.env.VERCEL) {
      app.use(express.static(staticPath));

      // Catch-all handler: send back React's index.html file for non-API routes
      app.get("*", (_req, res) => {
        res.sendFile(path.join(staticPath, "index.html"));
      });
    }
  } else {
    // In development, redirect to Vite dev server
    app.get("*", (_req, res) => {
      res.redirect("http://localhost:5173");
    });
  }

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
