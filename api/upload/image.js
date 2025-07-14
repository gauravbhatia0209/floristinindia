// Standalone upload route for Vercel
import multer from "multer";
import { createClient } from "@supabase/supabase-js";

// Configure Supabase
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY,
);

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
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
      cb(
        new Error(
          "Invalid file type. Only JPG, PNG, WebP, and GIF files are allowed.",
        ),
        false,
      );
    }
  },
});

// Helper to run multer in serverless environment
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle OPTIONS request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "Method not allowed",
      details: "Only POST requests are supported",
    });
  }

  try {
    // Run multer middleware
    await runMiddleware(req, res, upload.single("image"));

    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "No file uploaded",
        details: "Please select a file to upload",
      });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const extension = req.file.originalname.split(".").pop().toLowerCase();
    const cleanName = req.file.originalname
      .replace(/\.[^/.]+$/, "") // Remove extension
      .replace(/[^a-zA-Z0-9]/g, "-") // Replace special chars with dash
      .substring(0, 20); // Limit length

    const filename = `${timestamp}-${randomString}-${cleanName}.${extension}`;
    const filePath = `uploads/${filename}`;

    console.log("Uploading to Supabase:", {
      filePath,
      contentType: req.file.mimetype,
      size: req.file.buffer.length,
    });

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("media-assets")
      .upload(filePath, req.file.buffer, {
        contentType: req.file.mimetype,
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("Supabase upload error:", uploadError);
      return res.status(500).json({
        success: false,
        error: "Upload failed to cloud storage",
        details: uploadError.message,
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
        success: false,
        error: "Failed to generate public URL for uploaded image",
        details: "Could not create accessible URL for the uploaded file",
      });
    }

    return res.status(200).json({
      success: true,
      imageUrl: publicUrlData.publicUrl,
      filename: filename,
      originalName: req.file.originalname,
      size: req.file.size,
      cloudPath: uploadData.path,
    });
  } catch (error) {
    console.error("Upload error:", error);

    // Handle multer errors specifically
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        error: "File too large. Maximum size is 3MB.",
        details: "File size limit exceeded",
      });
    }

    if (error.message && error.message.includes("Invalid file type")) {
      return res.status(400).json({
        success: false,
        error: "Invalid file type",
        details: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      error: "Failed to upload image",
      details: error.message || "Unknown error",
    });
  }
}

// Disable Next.js body parsing for file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};
