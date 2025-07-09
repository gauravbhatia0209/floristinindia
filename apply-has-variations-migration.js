import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase environment variables");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function applyMigration() {
  try {
    console.log("Applying has_variations migration...");

    const migrationPath = path.join(
      process.cwd(),
      "database-add-has-variations.sql",
    );
    const migrationSQL = fs.readFileSync(migrationPath, "utf8");

    // Split by semicolon and execute each statement
    const statements = migrationSQL
      .split(";")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    for (const statement of statements) {
      console.log(`Executing: ${statement.substring(0, 50)}...`);
      const { error } = await supabase.rpc("exec_sql", { sql: statement });

      if (error) {
        console.error("Migration error:", error);
        throw error;
      }
    }

    console.log("✅ Migration completed successfully!");

    // Verify the migration
    const { data: products } = await supabase
      .from("products")
      .select("id, name, has_variations")
      .limit(5);

    console.log("Sample products with has_variations field:", products);
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

applyMigration();
