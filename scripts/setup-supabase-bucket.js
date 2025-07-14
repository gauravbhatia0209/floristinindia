#!/usr/bin/env node

/**
 * Script to set up the Supabase Storage bucket for media assets
 */

import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Missing Supabase environment variables");
  console.error("Please set VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupBucket() {
  console.log("🔧 Setting up Supabase Storage bucket...");

  try {
    // Check if bucket exists
    const { data: buckets, error: listError } =
      await supabase.storage.listBuckets();

    if (listError) {
      console.error("❌ Error listing buckets:", listError.message);
      return;
    }

    const existingBucket = buckets.find(
      (bucket) => bucket.name === "media-assets",
    );

    if (existingBucket) {
      console.log("✅ Bucket 'media-assets' already exists");
    } else {
      // Create bucket
      const { data, error } = await supabase.storage.createBucket(
        "media-assets",
        {
          public: true,
          allowedMimeTypes: [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webp",
            "image/gif",
            "image/svg+xml",
          ],
          fileSizeLimit: 3145728, // 3MB
        },
      );

      if (error) {
        console.error("❌ Error creating bucket:", error.message);
        return;
      }

      console.log("✅ Created bucket 'media-assets'");
    }

    // Verify bucket access
    const { data: files, error: accessError } = await supabase.storage
      .from("media-assets")
      .list("", { limit: 1 });

    if (accessError) {
      console.error("❌ Error accessing bucket:", accessError.message);
      return;
    }

    console.log("✅ Bucket access verified");
    console.log("\n🎉 Supabase Storage setup complete!");
    console.log("You can now run: npm run migrate-media");
  } catch (error) {
    console.error("💥 Setup failed:", error.message);
  }
}

setupBucket();
