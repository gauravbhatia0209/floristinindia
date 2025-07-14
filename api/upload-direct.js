// Direct upload handler for testing
const multer = require("multer");

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 3 * 1024 * 1024, // 3MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/gif",
    ];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Invalid file type: ${file.mimetype}`), false);
    }
  },
});

module.exports = (req, res) => {
  // Ensure JSON response
  res.setHeader("Content-Type", "application/json");

  // Handle only POST requests
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "Method not allowed",
      details: "Only POST requests are allowed for file uploads",
    });
  }

  // Use multer to handle the upload
  upload.single("image")(req, res, (err) => {
    if (err) {
      console.error("Upload error:", err);
      return res.status(400).json({
        success: false,
        error: "Upload failed",
        details: err.message,
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "No file uploaded",
        details: "Please select a file to upload",
      });
    }

    // Simple success response for testing
    return res.json({
      success: true,
      message: "File received successfully",
      filename: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      note: "This is a test endpoint - file not saved to storage",
    });
  });
};
