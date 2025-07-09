import { supabase } from "@/lib/supabase";

export async function checkAndApplyVariationMigration() {
  try {
    // Test if new columns exist by trying to select them
    const { error: testError } = await supabase
      .from("product_variants")
      .select("variation_type, variation_value, price_override, display_order")
      .limit(1);

    if (testError) {
      console.warn(
        "New variation columns not found. Database schema needs to be updated manually.",
      );
      console.warn("Please run the database migration to add the new columns.");
      console.warn("Error details:", testError);
      return false;
    }

    console.log("✅ Variation columns are available.");
    return true;
  } catch (error) {
    console.error("Error checking variation schema:", error);
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
