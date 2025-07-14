// API route to serve upload files
const fs = require("fs");
const path = require("path");

module.exports = (req, res) => {
  try {
    // Get the file path from the URL
    const filePath = req.query.path.join("/");

    // Define the uploads directory
    const uploadsDir = path.join(process.cwd(), "uploads");
    const fullPath = path.join(uploadsDir, filePath);

    // Security check: ensure the file is within the uploads directory
    if (!fullPath.startsWith(uploadsDir)) {
      return res.status(403).json({ error: "Access denied" });
    }

    // Check if file exists
    if (!fs.existsSync(fullPath)) {
      return res.status(404).json({ error: "File not found" });
    }

    // Get file stats
    const stats = fs.statSync(fullPath);

    // Set appropriate content type based on file extension
    const ext = path.extname(fullPath).toLowerCase();
    let contentType = "application/octet-stream";

    switch (ext) {
      case ".jpg":
      case ".jpeg":
        contentType = "image/jpeg";
        break;
      case ".png":
        contentType = "image/png";
        break;
      case ".webp":
        contentType = "image/webp";
        break;
      case ".gif":
        contentType = "image/gif";
        break;
      case ".svg":
        contentType = "image/svg+xml";
        break;
    }

    // Set headers
    res.setHeader("Content-Type", contentType);
    res.setHeader("Content-Length", stats.size);
    res.setHeader("Cache-Control", "public, max-age=31536000"); // 1 year cache
    res.setHeader("Last-Modified", stats.mtime.toUTCString());

    // Stream the file
    const fileStream = fs.createReadStream(fullPath);
    fileStream.pipe(res);
  } catch (error) {
    console.error("Error serving upload file:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
