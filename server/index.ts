import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import uploadRoutes from "./routes/upload.js";
import aiDataRoutes from "./routes/ai-data.js";
import sitemapRoutes from "./routes/sitemap.js";
import adminUpdatesRoutes from "./routes/admin-updates.js";
import paymentsRoutes from "./routes/payments.js";
import emailRoutes from "./routes/email.js";
import emailTemplatesRoutes from "./routes/email-templates.js";
import {
  injectMetaTags,
  getMetaDataHandler,
  clearCacheHandler,
} from "./routes/meta.js";

// Load environment variables from .env file
dotenv.config();

// Define uploads path at module level
const uploadsPath = process.env.VERCEL
  ? path.join("/tmp", "uploads")
  : path.join(process.cwd(), "..", "public", "uploads");

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Meta tag injection middleware (before static file serving)
  app.use(injectMetaTags);

  // Ensure uploads directory exists
  if (!fs.existsSync(uploadsPath)) {
    fs.mkdirSync(uploadsPath, { recursive: true });
  }

  // Serve static files from uploads directory
  app.use("/uploads", express.static(uploadsPath));

  // Also serve from public directory for static assets
  app.use("/public", express.static(path.join(process.cwd(), "..", "public")));

  // API routes
  app.get("/api/ping", (_req, res) => {
    res.json({ message: "Hello from Express server v2!" });
  });

  // Upload routes
  app.use("/api/upload", uploadRoutes);

  // Payment routes
  console.log("🔧 Mounting payment routes at /api/payments");
  app.use("/api/payments", paymentsRoutes);

  // Email routes
  console.log("🔧 Mounting email routes at /api/email");
  app.use("/api/email", emailRoutes);

  // Email templates routes
  console.log("🔧 Mounting email templates routes at /api/email-templates");
  app.use("/api/email-templates", emailTemplatesRoutes);

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

  // Meta data routes
  app.get("/api/meta", getMetaDataHandler);
  app.post("/api/meta/clear-cache", clearCacheHandler);

  // Health check route
  app.get("/api/health", (_req, res) => {
    res.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      service: "florist-backend",
    });
  });

  // Add error handling middleware for API routes
  app.use("/api/*", (err: any, req: any, res: any, next: any) => {
    console.error("API Error:", err);
    res.status(500).json({
      success: false,
      error: "Internal server error",
      details: err.message,
      path: req.path,
    });
  });

  // Handle 404 for API routes with JSON response
  app.use("/api/*", (req: any, res: any) => {
    console.log("API 404:", req.method, req.path);
    res.status(404).json({
      success: false,
      error: "API endpoint not found",
      details: `${req.method} ${req.path} not found`,
      path: req.path,
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

      // Catch-all handler: send back React's index.html file with injected meta tags
      app.get("*", (req, res) => {
        const htmlPath = path.join(__dirname, "views", "index.html");
        const fallbackHtmlPath = path.join(staticPath, "index.html");

        // Use custom template if available, otherwise fallback to built index.html
        const templatePath = fs.existsSync(htmlPath)
          ? htmlPath
          : fallbackHtmlPath;

        fs.readFile(templatePath, "utf8", (err, html) => {
          if (err) {
            console.error("Error reading HTML template:", err);
            return res.status(500).send("Internal Server Error");
          }

          // Inject meta data if available
          let processedHtml = html;
          if (res.locals.metaData) {
            const metaData = res.locals.metaData;

            // Generate structured data scripts
            let structuredDataHtml = "";
            if (metaData.structuredData && metaData.structuredData.length > 0) {
              structuredDataHtml = metaData.structuredData
                .map(
                  (schema: any) =>
                    `<script type="application/ld+json">${JSON.stringify(schema, null, 2)}</script>`,
                )
                .join("\n    ");
            }

            processedHtml = html
              .replace(/{{TITLE}}/g, metaData.title || "Florist in India")
              .replace(
                /{{DESCRIPTION}}/g,
                metaData.description || "Premium flower delivery service",
              )
              .replace(
                /{{OG_TITLE}}/g,
                metaData.ogTitle || metaData.title || "Florist in India",
              )
              .replace(
                /{{OG_DESCRIPTION}}/g,
                metaData.ogDescription ||
                  metaData.description ||
                  "Premium flower delivery service",
              )
              .replace(/{{CANONICAL}}/g, metaData.canonical || req.url)
              .replace(/{{ROBOTS}}/g, metaData.robots || "index, follow")
              .replace(/{{OG_IMAGE}}/g, metaData.ogImage || "")
              .replace(/{{STRUCTURED_DATA}}/g, structuredDataHtml);

            // Handle conditional OG image tags
            if (!metaData.ogImage) {
              processedHtml = processedHtml.replace(
                /{{#if OG_IMAGE}}[\s\S]*?{{\/if}}/g,
                "",
              );
            } else {
              processedHtml = processedHtml
                .replace(/{{#if OG_IMAGE}}/g, "")
                .replace(/{{\/if}}/g, "");
            }
          }

          res.send(processedHtml);
        });
      });
    }
  } else {
    // In development, redirect to Vite dev server for non-API/uploads routes
    app.get("*", (req, res) => {
      // Don't redirect API or uploads routes
      if (req.path.startsWith("/api/") || req.path.startsWith("/uploads/")) {
        res.status(404).json({ error: "Route not found" });
      } else {
        res.redirect("http://localhost:5173");
      }
    });
  }

  return app;
}

// Start the server when this file is run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const app = createServer();
  const port = process.env.PORT || 3000;

  app.listen(port, () => {
    console.log(`���� Server running on http://localhost:${port}`);
    console.log(`📡 API available at http://localhost:${port}/api`);
    console.log(`🔍 Health check: http://localhost:${port}/api/ping`);
  });
}
