import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase environment variables");
  console.error("Required: VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function applyMigration() {
  try {
    console.log("Checking if image_url column exists in product_variants...");

    // Test if the column already exists
    const { error: testError } = await supabase
      .from("product_variants")
      .select("image_url")
      .limit(1);

    if (!testError) {
      console.log(
        "✅ image_url column already exists in product_variants table.",
      );
      return;
    }

    console.log("Adding image_url column to product_variants table...");

    // Read and apply the migration
    const migration = readFileSync(
      "./database-add-variation-images.sql",
      "utf8",
    );

    // Note: Since we can't execute raw SQL directly, we'll guide the user
    console.log("📝 Please run the following SQL in your Supabase SQL editor:");
    console.log("=" * 50);
    console.log(migration);
    console.log("=" * 50);

    console.log("🔄 Testing if migration was applied...");

    // Test again after user applies migration
    const { error: testError2 } = await supabase
      .from("product_variants")
      .select("image_url")
      .limit(1);

    if (testError2) {
      console.log("⚠️  Migration not yet applied. Please run the SQL above.");
      console.log(
        "After running the SQL, the variation image upload feature will be fully functional.",
      );
    } else {
      console.log("✅ Migration applied successfully!");
      console.log("🎉 Variation image upload feature is now fully functional!");
    }
  } catch (error) {
    console.error("❌ Error checking migration:", error.message);
    console.log(
      "\n📝 To manually apply the migration, add this field to your product_variants table:",
    );
    console.log("ALTER TABLE product_variants ADD COLUMN image_url TEXT;");
  }
}

applyMigration();
