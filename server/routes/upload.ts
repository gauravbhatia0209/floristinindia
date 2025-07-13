import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import crypto from "crypto";

const router = express.Router();

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), "public", "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Support subdirectories via query parameter
    const subdir = req.query.subdir as string;
    let targetDir = uploadsDir;

    if (subdir) {
      targetDir = path.join(uploadsDir, subdir);
      // Create subdirectory if it doesn't exist
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }
    }

    cb(null, targetDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename with timestamp and random string
    const timestamp = Date.now();
    const randomString = crypto.randomBytes(6).toString("hex");
    const extension = path.extname(file.originalname).toLowerCase();
    const sanitizedName = file.originalname
      .replace(extension, "")
      .replace(/[^a-zA-Z0-9]/g, "-")
      .substring(0, 20);

    const filename = `${timestamp}-${randomString}-${sanitizedName}${extension}`;
    cb(null, filename);
  },
});

// File filter for validation
const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
  const allowedTypes = [".jpg", ".jpeg", ".png", ".webp"];
  const extension = path.extname(file.originalname).toLowerCase();

  if (allowedTypes.includes(extension)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Invalid file type. Only JPG, JPEG, PNG, and WebP files are allowed.",
      ),
      false,
    );
  }
};

// Configure multer with validation
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 3 * 1024 * 1024, // 3MB limit
    files: 5, // Maximum 5 files
  },
});

// Upload single image endpoint
router.post("/image", upload.single("image"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const subdir = req.query.subdir as string;
    const imageUrl = subdir
      ? `/uploads/${subdir}/${req.file.filename}`
      : `/uploads/${req.file.filename}`;

    res.json({
      success: true,
      imageUrl: imageUrl,
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ error: "Failed to upload image" });
  }
});

// Upload multiple images endpoint
router.post("/images", upload.array("images", 5), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    const subdir = req.query.subdir as string;
    const imageUrls = (req.files as Express.Multer.File[]).map((file) => ({
      url: subdir
        ? `/uploads/${subdir}/${file.filename}`
        : `/uploads/${file.filename}`,
      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
    }));

    res.json({
      success: true,
      images: imageUrls,
    });
  } catch (error) {
    console.error("Error uploading images:", error);
    res.status(500).json({ error: "Failed to upload images" });
  }
});

// Delete image endpoint
router.delete("/image/:filename", (req, res) => {
  try {
    const filename = req.params.filename;
    const subdir = req.query.subdir as string;
    const filePath = subdir
      ? path.join(uploadsDir, subdir, filename)
      : path.join(uploadsDir, filename);

    // Check if file exists
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      res.json({ success: true, message: "Image deleted successfully" });
    } else {
      res.status(404).json({ error: "Image not found" });
    }
  } catch (error) {
    console.error("Error deleting image:", error);
    res.status(500).json({ error: "Failed to delete image" });
  }
});

// Error handling middleware
router.use((error: any, req: any, res: any, next: any) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res
        .status(400)
        .json({ error: "File too large. Maximum size is 3MB." });
    }
    if (error.code === "LIMIT_FILE_COUNT") {
      return res
        .status(400)
        .json({ error: "Too many files. Maximum is 5 images." });
    }
  }

  res.status(400).json({ error: error.message });
});

export default router;
