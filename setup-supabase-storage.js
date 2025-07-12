#!/usr/bin/env node

/**
 * Supabase Storage Setup Script
 *
 * This script sets up the required storage bucket and policies for the image upload system.
 * Run this once after setting up your Supabase project.
 *
 * Usage: node setup-supabase-storage.js
 */

import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Missing Supabase environment variables");
  console.error("Required: VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY");
  console.error(
    "Note: Use the service role key, not the anon key for this setup",
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupStorage() {
  console.log("🚀 Setting up Supabase storage...");

  try {
    // 1. Create the media-assets bucket
    console.log("📁 Creating media-assets bucket...");
    const { data: bucket, error: bucketError } =
      await supabase.storage.createBucket("media-assets", {
        public: true,
        allowedMimeTypes: [
          "image/jpeg",
          "image/jpg",
          "image/png",
          "image/webp",
        ],
        fileSizeLimit: 3 * 1024 * 1024, // 3MB
      });

    if (bucketError) {
      if (bucketError.message.includes("already exists")) {
        console.log("✅ Bucket already exists");
      } else {
        throw bucketError;
      }
    } else {
      console.log("✅ Bucket created successfully");
    }

    // 2. Set up storage policies (note: these may need manual setup)
    console.log("🔐 Setting up storage policies...");
    console.log(
      "⚠️  Note: Storage policies need to be configured manually in Supabase dashboard",
    );
    console.log("✅ Storage policies noted for manual setup");

    // 3. Test upload functionality
    console.log("🧪 Testing upload functionality...");

    const testFile = new Blob(["test content"], { type: "text/plain" });
    const testFileName = `test-${Date.now()}.txt`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("media-assets")
      .upload(testFileName, testFile);

    if (uploadError) {
      console.warn("⚠️  Upload test failed:", uploadError.message);
      console.log(
        "This might be due to RLS policies. You may need to configure them manually in the Supabase dashboard.",
      );
    } else {
      console.log("✅ Upload test successful");

      // Clean up test file
      await supabase.storage.from("media-assets").remove([testFileName]);
      console.log("🧹 Test file cleaned up");
    }

    // 4. Display configuration summary
    console.log("\n🎉 Supabase storage setup complete!");
    console.log("\n📋 Configuration Summary:");
    console.log("• Bucket: media-assets");
    console.log("• Public read access: ✅");
    console.log("• Max file size: 3MB");
    console.log("• Allowed types: JPEG, PNG, WebP");
    console.log("\n🔧 Manual Setup (if needed):");
    console.log(
      "If RLS policies weren't created automatically, add these in your Supabase dashboard:",
    );
    console.log("\n1. Storage > Policies > New Policy on media-assets bucket:");
    console.log('   - Name: "Public read access"');
    console.log("   - Policy: SELECT, Target: public");
    console.log("   - Expression: true");
    console.log("\n2. Storage > Policies > New Policy on media-assets bucket:");
    console.log('   - Name: "Authenticated uploads"');
    console.log("   - Policy: INSERT, Target: authenticated");
    console.log("   - Expression: true");
    console.log("\n3. Storage > Policies > New Policy on media-assets bucket:");
    console.log('   - Name: "Authenticated deletes"');
    console.log("   - Policy: DELETE, Target: authenticated");
    console.log("   - Expression: true");
  } catch (error) {
    console.error("❌ Setup failed:", error);
    process.exit(1);
  }
}

setupStorage();
