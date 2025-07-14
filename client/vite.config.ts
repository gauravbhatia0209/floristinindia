import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import fs from "fs";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
      "@shared": path.resolve(__dirname, "../shared"),
    },
  },
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
      "/uploads": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: "dist",
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          router: ["react-router-dom"],
        },
      },
    },
  },
  plugins: [
    react(),
    {
      name: "generate-404-and-copy-uploads",
      writeBundle() {
        const distDir = path.resolve(__dirname, "dist");

        // Copy index.html to 404.html for SPA routing support on Vercel
        const indexPath = path.join(distDir, "index.html");
        const notFoundPath = path.join(distDir, "404.html");

        if (fs.existsSync(indexPath)) {
          fs.copyFileSync(indexPath, notFoundPath);
          console.log("✅ Generated 404.html for SPA routing");
        }

        // Copy uploads directory to dist for static serving
        const uploadsSource = path.resolve(__dirname, "../uploads");
        const uploadsPublicSource = path.resolve(__dirname, "public/uploads");
        const uploadsDest = path.join(distDir, "uploads");

        // Function to copy directory recursively
        const copyDir = (src, dest) => {
          if (!fs.existsSync(src)) return;

          if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, { recursive: true });
          }

          const files = fs.readdirSync(src);
          files.forEach((file) => {
            const srcFile = path.join(src, file);
            const destFile = path.join(dest, file);

            if (fs.statSync(srcFile).isDirectory()) {
              copyDir(srcFile, destFile);
            } else {
              fs.copyFileSync(srcFile, destFile);
            }
          });
        };

        // Copy from both potential sources
        copyDir(uploadsSource, uploadsDest);
        copyDir(uploadsPublicSource, uploadsDest);

        console.log("✅ Copied uploads to dist for static serving");
      },
    },
  ],
});
