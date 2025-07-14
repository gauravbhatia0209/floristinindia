#!/usr/bin/env node

/**
 * Migration script to upload all local media assets to Supabase Storage
 * This script will:
 * 1. Upload all files from uploads/ and public/uploads/ to Supabase Storage
 * 2. Generate a mapping file of old URLs to new Supabase URLs
 * 3. Update database records with new URLs
 */

import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Missing Supabase environment variables");
  console.error("Please set VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Configuration
const BUCKET_NAME = "media-assets";
const uploadsDirectories = [
  path.join(__dirname, "../uploads"),
  path.join(__dirname, "../public/uploads"),
];

const urlMapping = new Map();
const uploadResults = [];

/**
 * Get all files recursively from a directory
 */
function getAllFiles(dirPath, arrayOfFiles = [], baseDir = "") {
  if (!fs.existsSync(dirPath)) {
    return arrayOfFiles;
  }

  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    const relativePath = path.join(baseDir, file);

    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllFiles(fullPath, arrayOfFiles, relativePath);
    } else {
      // Skip non-image files and JS files
      const ext = path.extname(file).toLowerCase();
      const imageExtensions = [
        ".jpg",
        ".jpeg",
        ".png",
        ".webp",
        ".gif",
        ".svg",
      ];

      if (imageExtensions.includes(ext)) {
        arrayOfFiles.push({
          fullPath,
          relativePath,
          fileName: file,
        });
      }
    }
  });

  return arrayOfFiles;
}

/**
 * Upload a single file to Supabase Storage
 */
async function uploadFileToSupabase(filePath, fileName, relativePath) {
  try {
    console.log(`📤 Uploading: ${relativePath}`);

    // Read file
    const fileBuffer = fs.readFileSync(filePath);

    // Determine content type
    const ext = path.extname(fileName).toLowerCase();
    let contentType = "image/jpeg";
    if (ext === ".png") contentType = "image/png";
    if (ext === ".webp") contentType = "image/webp";
    if (ext === ".gif") contentType = "image/gif";
    if (ext === ".svg") contentType = "image/svg+xml";

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(relativePath, fileBuffer, {
        contentType,
        cacheControl: "3600",
        upsert: true, // Allow overwriting existing files
      });

    if (error) {
      console.error(`❌ Failed to upload ${relativePath}:`, error.message);
      return { success: false, error: error.message, file: relativePath };
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(relativePath);

    if (!publicUrlData?.publicUrl) {
      console.error(`❌ Failed to get public URL for ${relativePath}`);
      return {
        success: false,
        error: "Failed to get public URL",
        file: relativePath,
      };
    }

    // Store URL mapping
    const oldUrl = `/uploads/${relativePath}`;
    urlMapping.set(oldUrl, publicUrlData.publicUrl);

    console.log(`✅ Uploaded: ${relativePath} -> ${publicUrlData.publicUrl}`);

    return {
      success: true,
      oldUrl,
      newUrl: publicUrlData.publicUrl,
      file: relativePath,
    };
  } catch (error) {
    console.error(`❌ Error uploading ${relativePath}:`, error.message);
    return { success: false, error: error.message, file: relativePath };
  }
}

/**
 * Update database records with new URLs
 */
async function updateDatabaseUrls() {
  console.log("\n🔄 Updating database URLs...");

  const updates = [];

  try {
    // Update products table
    const { data: products, error: productsError } = await supabase
      .from("products")
      .select("id, images, image_url");

    if (productsError) {
      console.error("❌ Error fetching products:", productsError.message);
    } else {
      for (const product of products) {
        let updated = false;
        const updateData = {};

        // Update images array
        if (product.images && Array.isArray(product.images)) {
          const updatedImages = product.images.map((url) => {
            if (typeof url === "string" && url.startsWith("/uploads/")) {
              const newUrl = urlMapping.get(url);
              if (newUrl) {
                updated = true;
                return newUrl;
              }
            }
            return url;
          });

          if (updated) {
            updateData.images = updatedImages;
          }
        }

        // Update single image_url
        if (product.image_url && product.image_url.startsWith("/uploads/")) {
          const newUrl = urlMapping.get(product.image_url);
          if (newUrl) {
            updateData.image_url = newUrl;
            updated = true;
          }
        }

        if (updated) {
          const { error } = await supabase
            .from("products")
            .update(updateData)
            .eq("id", product.id);

          if (error) {
            console.error(
              `❌ Error updating product ${product.id}:`,
              error.message,
            );
          } else {
            console.log(`✅ Updated product ${product.id}`);
            updates.push(`product:${product.id}`);
          }
        }
      }
    }

    // Update product_categories table
    const { data: categories, error: categoriesError } = await supabase
      .from("product_categories")
      .select("id, image_url");

    if (categoriesError) {
      console.error("❌ Error fetching categories:", categoriesError.message);
    } else {
      for (const category of categories) {
        if (category.image_url && category.image_url.startsWith("/uploads/")) {
          const newUrl = urlMapping.get(category.image_url);
          if (newUrl) {
            const { error } = await supabase
              .from("product_categories")
              .update({ image_url: newUrl })
              .eq("id", category.id);

            if (error) {
              console.error(
                `❌ Error updating category ${category.id}:`,
                error.message,
              );
            } else {
              console.log(`✅ Updated category ${category.id}`);
              updates.push(`category:${category.id}`);
            }
          }
        }
      }
    }

    // Update homepage_sections table
    const { data: sections, error: sectionsError } = await supabase
      .from("homepage_sections")
      .select("id, content");

    if (sectionsError) {
      console.error(
        "❌ Error fetching homepage sections:",
        sectionsError.message,
      );
    } else {
      for (const section of sections) {
        if (section.content && typeof section.content === "object") {
          let contentStr = JSON.stringify(section.content);
          let updated = false;

          // Replace all /uploads/ URLs in the content
          urlMapping.forEach((newUrl, oldUrl) => {
            if (contentStr.includes(oldUrl)) {
              contentStr = contentStr.replaceAll(oldUrl, newUrl);
              updated = true;
            }
          });

          if (updated) {
            const { error } = await supabase
              .from("homepage_sections")
              .update({ content: JSON.parse(contentStr) })
              .eq("id", section.id);

            if (error) {
              console.error(
                `❌ Error updating homepage section ${section.id}:`,
                error.message,
              );
            } else {
              console.log(`✅ Updated homepage section ${section.id}`);
              updates.push(`section:${section.id}`);
            }
          }
        }
      }
    }
  } catch (error) {
    console.error("❌ Error updating database:", error.message);
  }

  return updates;
}

/**
 * Save URL mapping to file for reference
 */
function saveUrlMapping() {
  const mappingData = {
    timestamp: new Date().toISOString(),
    totalMappings: urlMapping.size,
    mappings: Object.fromEntries(urlMapping),
  };

  const mappingFile = path.join(__dirname, "../supabase-url-mapping.json");
  fs.writeFileSync(mappingFile, JSON.stringify(mappingData, null, 2));

  console.log(`\n📝 URL mapping saved to: ${mappingFile}`);
}

/**
 * Main migration function
 */
async function migrateToSupabase() {
  console.log("🚀 Starting migration to Supabase Storage...\n");

  // Check if bucket exists
  const { data: buckets, error: bucketsError } =
    await supabase.storage.listBuckets();

  if (bucketsError) {
    console.error("❌ Error checking buckets:", bucketsError.message);
    process.exit(1);
  }

  const mediaAssetsBucket = buckets.find(
    (bucket) => bucket.name === BUCKET_NAME,
  );
  if (!mediaAssetsBucket) {
    console.error(
      `❌ Bucket "${BUCKET_NAME}" not found. Please create it in Supabase Storage.`,
    );
    process.exit(1);
  }

  console.log(`✅ Found bucket: ${BUCKET_NAME}`);

  // Collect all files
  let allFiles = [];
  uploadsDirectories.forEach((dir) => {
    if (fs.existsSync(dir)) {
      console.log(`📁 Scanning directory: ${dir}`);
      const files = getAllFiles(dir);
      allFiles = allFiles.concat(files);
    }
  });

  // Remove duplicates based on relativePath
  const uniqueFiles = allFiles.filter(
    (file, index, self) =>
      index === self.findIndex((f) => f.relativePath === file.relativePath),
  );

  console.log(
    `\n📊 Found ${uniqueFiles.length} unique image files to upload\n`,
  );

  if (uniqueFiles.length === 0) {
    console.log("ℹ️ No files to upload");
    return;
  }

  // Upload files
  let successCount = 0;
  let failCount = 0;

  for (const file of uniqueFiles) {
    const result = await uploadFileToSupabase(
      file.fullPath,
      file.fileName,
      file.relativePath,
    );
    uploadResults.push(result);

    if (result.success) {
      successCount++;
    } else {
      failCount++;
    }

    // Small delay to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  console.log(`\n📊 Upload Summary:`);
  console.log(`✅ Successful: ${successCount}`);
  console.log(`❌ Failed: ${failCount}`);

  // Save URL mapping
  saveUrlMapping();

  // Update database
  if (successCount > 0) {
    const dbUpdates = await updateDatabaseUrls();
    console.log(`\n📊 Database Updates: ${dbUpdates.length} records updated`);
  }

  console.log(`\n🎉 Migration completed!`);
  console.log(`📝 Check supabase-url-mapping.json for URL mappings`);

  if (failCount > 0) {
    console.log(
      `⚠️ ${failCount} files failed to upload. Check the logs above for details.`,
    );
  }
}

// Run migration
migrateToSupabase().catch((error) => {
  console.error("💥 Migration failed:", error.message);
  process.exit(1);
});
