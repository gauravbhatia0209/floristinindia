import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { supabase } from "../lib/supabase.js";

const router = express.Router();

// Ensure uploads directory exists
const uploadsDir = process.env.VERCEL
  ? path.join("/tmp", "uploads")
  : path.join(process.cwd(), "..", "public", "uploads");

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for memory storage (better for serverless)
const storage = multer.memoryStorage();

// File filter for validation
const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
  const allowedTypes = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
  const allowedMimes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/gif",
  ];
  const extension = path.extname(file.originalname).toLowerCase();

  console.log(
    `Upload attempt - File: ${file.originalname}, MIME: ${file.mimetype}, Extension: ${extension}`,
  );

  if (
    allowedTypes.includes(extension) &&
    allowedMimes.includes(file.mimetype)
  ) {
    cb(null, true);
  } else {
    const error = new Error(
      `Invalid file type. File: ${file.originalname}, MIME: ${file.mimetype}. Only JPG, JPEG, PNG, WebP, and GIF files are allowed.`,
    );
    console.error("File filter rejected:", error.message);
    cb(error, false);
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
router.post("/image", upload.single("image"), async (req, res) => {
  // Ensure we always send JSON responses
  res.setHeader("Content-Type", "application/json");

  try {
    console.log("Upload request received:", {
      hasFile: !!req.file,
      fileOriginalName: req.file?.originalname,
      fileMimetype: req.file?.mimetype,
      fileSize: req.file?.size,
    });

    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "No file uploaded",
        details: "Please select a file to upload",
      });
    }

    // Validate file buffer
    if (!req.file.buffer || req.file.buffer.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Invalid file",
        details: "File appears to be empty or corrupted",
      });
    }

    // Always use Supabase Storage for all uploads
    try {
      const subdir = req.query.subdir as string;

      // Generate unique filename with timestamp
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 8);
      const extension = path.extname(req.file.originalname).toLowerCase();
      const cleanName = req.file.originalname
        .replace(/\.[^/.]+$/, "") // Remove extension
        .replace(/[^a-zA-Z0-9]/g, "-") // Replace special chars with dash
        .substring(0, 20); // Limit length

      const filename = `${timestamp}-${randomString}-${cleanName}${extension}`;
      const filePath = subdir ? `${subdir}/${filename}` : `uploads/${filename}`;

      console.log("Uploading to Supabase:", {
        filePath,
        contentType: req.file.mimetype,
        size: req.file.buffer.length,
      });

      // Upload to Supabase Storage with proper content type
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("media-assets")
        .upload(filePath, req.file.buffer, {
          contentType: req.file.mimetype || "image/jpeg",
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        console.error("Supabase upload error:", uploadError);
        return res.status(500).json({
          success: false,
          error: "Upload failed to cloud storage",
          details: uploadError.message,
          supabaseError: uploadError,
        });
      }

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from("media-assets")
        .getPublicUrl(uploadData.path);

      if (!publicUrlData?.publicUrl) {
        // Cleanup uploaded file if we can't get public URL
        await supabase.storage.from("media-assets").remove([uploadData.path]);
        return res.status(500).json({
          error: "Failed to generate public URL for uploaded image",
        });
      }

      return res.json({
        success: true,
        imageUrl: publicUrlData.publicUrl,
        filename: filename,
        originalName: req.file.originalname,
        size: req.file.size,
        cloudPath: uploadData.path,
      });
    } catch (supabaseError) {
      console.error("Supabase upload failed:", supabaseError);
      return res.status(500).json({
        error: "Cloud storage upload failed",
        details:
          supabaseError instanceof Error
            ? supabaseError.message
            : "Unknown error",
      });
    }
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ error: "Failed to upload image" });
  }
});

// Upload multiple images endpoint
router.post("/images", upload.array("images", 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    const subdir = req.query.subdir as string;
    const uploadResults: any[] = [];
    const errors: any[] = [];

    // Upload each file to Supabase Storage
    for (const file of req.files as Express.Multer.File[]) {
      try {
        // Read file buffer
        const fileBuffer = file.buffer || fs.readFileSync(file.path);

        // Generate unique filename
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 8);
        const extension = path.extname(file.originalname).toLowerCase();
        const cleanName = file.originalname
          .replace(/\.[^/.]+$/, "") // Remove extension
          .replace(/[^a-zA-Z0-9]/g, "-") // Replace special chars with dash
          .substring(0, 20); // Limit length

        const filename = `${timestamp}-${randomString}-${cleanName}${extension}`;
        const filePath = subdir
          ? `${subdir}/${filename}`
          : `uploads/${filename}`;

        // Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("media-assets")
          .upload(filePath, fileBuffer, {
            contentType: file.mimetype,
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadError) {
          console.error(
            `Supabase upload error for ${file.originalname}:`,
            uploadError,
          );
          errors.push({
            filename: file.originalname,
            error: uploadError.message,
          });
          continue;
        }

        // Get public URL
        const { data: publicUrlData } = supabase.storage
          .from("media-assets")
          .getPublicUrl(uploadData.path);

        if (!publicUrlData?.publicUrl) {
          // Cleanup uploaded file if we can't get public URL
          await supabase.storage.from("media-assets").remove([uploadData.path]);
          errors.push({
            filename: file.originalname,
            error: "Failed to generate public URL",
          });
          continue;
        }

        uploadResults.push({
          url: publicUrlData.publicUrl,
          filename: filename,
          originalName: file.originalname,
          size: file.size,
          cloudPath: uploadData.path,
        });

        // Small delay to avoid rate limiting
        await new Promise((resolve) => setTimeout(resolve, 100));
      } catch (fileError) {
        console.error(`Error uploading ${file.originalname}:`, fileError);
        errors.push({
          filename: file.originalname,
          error:
            fileError instanceof Error ? fileError.message : "Unknown error",
        });
      }
    }

    res.json({
      success: uploadResults.length > 0,
      images: uploadResults,
      count: uploadResults.length,
      errors: errors.length > 0 ? errors : undefined,
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
