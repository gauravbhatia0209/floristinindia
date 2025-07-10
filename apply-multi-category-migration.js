import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase credentials in environment variables");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function applyMigration() {
  try {
    console.log("🔄 Applying multi-category migration...");

    // Read the migration file
    const migrationSQL = fs.readFileSync(
      "database-multi-category-migration.sql",
      "utf8",
    );

    // Execute the migration
    const { error } = await supabase.rpc("exec_sql", { sql: migrationSQL });

    if (error) {
      // Try alternative approach if rpc doesn't work
      console.log("RPC method failed, trying direct query...");
      const { error: directError } = await supabase
        .from("_migration_check")
        .select("*")
        .single();

      if (directError && directError.code === "42P01") {
        // Table doesn't exist, we can proceed with manual execution
        console.log(
          "⚠️  Manual migration required. Please run the SQL script directly in Supabase dashboard.",
        );
        console.log("📂 Migration file: database-multi-category-migration.sql");
        return;
      }

      throw error;
    }

    console.log("✅ Multi-category migration applied successfully!");

    // Verify the migration
    const { data: tables, error: checkError } = await supabase
      .from("information_schema.tables")
      .select("table_name")
      .eq("table_schema", "public")
      .eq("table_name", "product_category_assignments");

    if (checkError) {
      console.log("⚠️  Could not verify migration, but it may have succeeded.");
    } else if (tables && tables.length > 0) {
      console.log(
        "✅ Migration verified: product_category_assignments table created!",
      );
    }
  } catch (error) {
    console.error("❌ Migration failed:", error);
    console.log("\n📋 Manual steps required:");
    console.log("1. Go to your Supabase dashboard");
    console.log("2. Navigate to SQL Editor");
    console.log(
      "3. Copy and paste the contents of database-multi-category-migration.sql",
    );
    console.log("4. Execute the SQL script");
    process.exit(1);
  }
}

applyMigration();
