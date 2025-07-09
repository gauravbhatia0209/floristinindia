import { supabase } from "@/lib/supabase";

export async function checkAndApplyVariationMigration() {
  try {
    // Test if new columns exist by trying to select them
    const { error: testError } = await supabase
      .from("product_variants")
      .select("variation_type, variation_value, price_override, display_order")
      .limit(1);

    if (testError) {
      console.log("New variation columns not found, applying migration...");

      // Apply the migration
      const migrationSQL = `
        -- Add new columns to product_variants table
        DO $$ 
        BEGIN
            -- Add variation_type column
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'product_variants' AND column_name = 'variation_type') THEN
                ALTER TABLE product_variants ADD COLUMN variation_type VARCHAR(100);
            END IF;
            
            -- Add variation_value column
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'product_variants' AND column_name = 'variation_value') THEN
                ALTER TABLE product_variants ADD COLUMN variation_value VARCHAR(100);
            END IF;
            
            -- Add price_override column
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'product_variants' AND column_name = 'price_override') THEN
                ALTER TABLE product_variants ADD COLUMN price_override DECIMAL(10, 2);
            END IF;
            
            -- Add sale_price_override column
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'product_variants' AND column_name = 'sale_price_override') THEN
                ALTER TABLE product_variants ADD COLUMN sale_price_override DECIMAL(10, 2);
            END IF;
            
            -- Add image_url column
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'product_variants' AND column_name = 'image_url') THEN
                ALTER TABLE product_variants ADD COLUMN image_url TEXT;
            END IF;
            
            -- Add weight column
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'product_variants' AND column_name = 'weight') THEN
                ALTER TABLE product_variants ADD COLUMN weight DECIMAL(8, 3);
            END IF;
            
            -- Add display_order column
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'product_variants' AND column_name = 'display_order') THEN
                ALTER TABLE product_variants ADD COLUMN display_order INTEGER DEFAULT 0;
            END IF;
            
            -- Update existing variants to have variation_type and variation_value from name
            UPDATE product_variants 
            SET variation_type = 'Size', 
                variation_value = name,
                price_override = price,
                sale_price_override = sale_price
            WHERE variation_type IS NULL;
            
        END $$;
      `;

      const { error: migrationError } = await supabase.rpc("exec_sql", {
        sql: migrationSQL,
      });

      if (migrationError) {
        console.error("Migration error:", migrationError);
        return false;
      }

      console.log("Migration applied successfully!");
      return true;
    }

    console.log("Variation columns already exist.");
    return true;
  } catch (error) {
    console.error("Error checking/applying migration:", error);
    return false;
  }
}

export async function getVariationData(
  formData: any,
  basePrice: number,
  baseSalePrice?: number,
) {
  // Check if new columns are available
  const migrationApplied = await checkAndApplyVariationMigration();

  if (migrationApplied) {
    // Use new schema
    return {
      product_id: formData.product_id,
      variation_type: formData.variation_type,
      variation_value: formData.variation_value,
      name: `${formData.variation_type} - ${formData.variation_value}`,
      price: basePrice,
      sale_price: baseSalePrice,
      price_override: formData.price_override
        ? parseFloat(formData.price_override)
        : null,
      sale_price_override: formData.sale_price_override
        ? parseFloat(formData.sale_price_override)
        : null,
      stock_quantity: parseInt(formData.stock_quantity) || 0,
      image_url: formData.image_url || null,
      weight: formData.weight ? parseFloat(formData.weight) : null,
      sku: formData.sku || null,
      is_active: formData.is_active,
      display_order: 0,
    };
  } else {
    // Fallback to legacy schema
    return {
      product_id: formData.product_id,
      name: `${formData.variation_type} - ${formData.variation_value}`,
      price: formData.price_override
        ? parseFloat(formData.price_override)
        : basePrice,
      sale_price: formData.sale_price_override
        ? parseFloat(formData.sale_price_override)
        : baseSalePrice,
      stock_quantity: parseInt(formData.stock_quantity) || 0,
      sku: formData.sku || null,
      is_active: formData.is_active,
      sort_order: 0,
    };
  }
}
