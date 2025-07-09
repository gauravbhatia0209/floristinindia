import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase environment variables");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function applyMigration() {
  try {
    console.log("Reading migration file...");
    const migration = readFileSync(
      "./database-product-variations-migration.sql",
      "utf8",
    );

    console.log("Applying product variations migration...");
    const { error } = await supabase.rpc("exec_sql", { sql: migration });

    if (error) {
      throw error;
    }

    console.log("✅ Product variations migration applied successfully!");
    console.log("The following features are now available:");
    console.log(
      "- Enhanced product_variants table with variation types and values",
    );
    console.log("- Price override support");
    console.log("- Variation-specific images");
    console.log("- Sample variation data for existing products");
  } catch (error) {
    console.error("❌ Error applying migration:", error.message);
    process.exit(1);
  }
}

applyMigration();
