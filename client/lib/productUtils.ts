import { supabase } from "@/lib/supabase";
import {
  Product,
  ProductCategory,
  ProductCategoryAssignment,
  ProductVariant,
} from "@/types/database.types";

export interface ProductWithCategories extends Product {
  category_assignments?: ProductCategoryAssignment[];
  assigned_categories?: ProductCategory[];
  primary_category?: ProductCategory;
}

/**
 * Fetch products with their category assignments
 */
export async function fetchProductsWithCategories(
  options: {
    categoryId?: string;
    categorySlug?: string;
    includeInactive?: boolean;
    limit?: number;
  } = {},
): Promise<ProductWithCategories[]> {
  try {
    let productIds: string[] = [];

    // If filtering by category, get product IDs first
    if (options.categoryId || options.categorySlug) {
      let categoryId = options.categoryId;

      if (options.categorySlug && !categoryId) {
        const { data: category } = await supabase
          .from("product_categories")
          .select("id")
          .eq("slug", options.categorySlug)
          .single();

        categoryId = category?.id;
      }

      if (categoryId) {
        // Use legacy single category
        const { data: legacyProducts } = await supabase
          .from("products")
          .select("id")
          .eq("category_id", categoryId)
          .eq("is_active", options.includeInactive ? undefined : true);

        productIds = legacyProducts?.map((p) => p.id) || [];
      }
    }

    // Fetch products
    let productQuery = supabase.from("products").select("*");

    if (!options.includeInactive) {
      productQuery = productQuery.eq("is_active", true);
    }

    if (productIds.length > 0) {
      productQuery = productQuery.in("id", productIds);
    }

    if (options.limit) {
      productQuery = productQuery.limit(options.limit);
    }

    const { data: products, error: productsError } = await productQuery;

    if (productsError) throw productsError;

    if (!products || products.length === 0) {
      return [];
    }

    // Skip multi-category assignments since table doesn't exist

    // Fetch all categories for fallback
    const { data: allCategories } = await supabase
      .from("product_categories")
      .select("*")
      .eq("is_active", true);

    // Combine data using legacy single category approach
    const productsWithCategories: ProductWithCategories[] = products.map(
      (product) => {
        let assignedCategories: ProductCategory[] = [];
        let primaryCategory: ProductCategory | undefined;

        // Use legacy single category
        const legacyCategory = allCategories?.find(
          (c) => c.id === product.category_id,
        );
        if (legacyCategory) {
          assignedCategories = [legacyCategory];
          primaryCategory = legacyCategory;
        }

        return {
          ...product,
          category_assignments: productAssignments,
          assigned_categories: assignedCategories,
          primary_category: primaryCategory,
        };
      },
    );

    return productsWithCategories;
  } catch (error) {
    console.error("Failed to fetch products with categories:", error);
    throw error;
  }
}

/**
 * Get all categories that contain products
 */
export async function getCategoriesWithProductCount(): Promise<
  (ProductCategory & { product_count: number })[]
> {
  try {
    const { data: categories } = await supabase
      .from("product_categories")
      .select("*")
      .eq("is_active", true)
      .order("sort_order");

    if (!categories) return [];

    // Get product counts for each category using legacy approach
    const categoriesWithCounts = await Promise.all(
      categories.map(async (category) => {
        // Use legacy single category count
        const { data: legacyProducts } = await supabase
          .from("products")
          .select("id")
          .eq("category_id", category.id)
          .eq("is_active", true);

        const productCount = legacyProducts?.length || 0;

        return {
          ...category,
          product_count: productCount,
        };
      }),
    );

    return categoriesWithCounts;
  } catch (error) {
    console.error("Failed to get categories with product count:", error);
    return [];
  }
}

/**
 * Check if a product belongs to a specific category
 */
export function doesProductBelongToCategory(
  product: ProductWithCategories,
  categoryId: string,
): boolean {
  // Check multi-category assignments first
  if (product.assigned_categories) {
    return product.assigned_categories.some((cat) => cat.id === categoryId);
  }

  // Fall back to legacy single category
  return product.category_id === categoryId;
}

/**
 * Get the primary category for a product
 */
export function getProductPrimaryCategory(
  product: ProductWithCategories,
): ProductCategory | null {
  return product.primary_category || null;
}

/**
 * Get effective price for a product (from variants if available, otherwise base price)
 */
export async function getProductEffectivePrice(product: Product): Promise<{
  price: number;
  salePrice: number | null;
  hasVariants: boolean;
  defaultVariant?: ProductVariant;
}> {
  // If product doesn't have variations, return base pricing
  if (!product.has_variations) {
    return {
      price: product.price,
      salePrice: product.sale_price,
      hasVariants: false,
    };
  }

  try {
    // Fetch active variants for this product, ordered by sort_order and display_order
    const { data: variants, error } = await supabase
      .from("product_variants")
      .select("*")
      .eq("product_id", product.id)
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .order("display_order", { ascending: true });

    if (error || !variants || variants.length === 0) {
      // Fallback to base pricing if no variants found
      return {
        price: product.price,
        salePrice: product.sale_price,
        hasVariants: false,
      };
    }

    // Use the first active variant as default
    const defaultVariant = variants[0];

    return {
      price: defaultVariant.price,
      salePrice: defaultVariant.sale_price,
      hasVariants: true,
      defaultVariant,
    };
  } catch (error) {
    console.error("Error fetching product variants:", error);
    // Fallback to base pricing on error
    return {
      price: product.price,
      salePrice: product.sale_price,
      hasVariants: false,
    };
  }
}

/**
 * Synchronous version for when variants are already available
 */
export function getProductEffectivePriceSync(
  product: Product,
  variants?: ProductVariant[],
): {
  price: number;
  salePrice: number | null;
  hasVariants: boolean;
  defaultVariant?: ProductVariant;
} {
  // Debug logging for Test Product
  if (product.name === "Test Product") {
    console.log(`🔍 getProductEffectivePriceSync Debug for Test Product:`, {
      product_name: product.name,
      has_variations: product.has_variations,
      variants_provided: !!variants,
      variants_length: variants?.length || 0,
      raw_variants: variants
    });
  }

  // If product doesn't have variations, return base pricing
  if (!product.has_variations) {
    if (product.name === "Test Product") {
      console.log(`🔍 Test Product: No variations, returning base pricing`);
    }
    return {
      price: product.price,
      salePrice: product.sale_price,
      hasVariants: false,
    };
  }

  // If variants are provided, use them
  if (variants && variants.length > 0) {
    const activeVariants = variants
      .filter((v) => v.is_active)
      .sort((a, b) => a.sort_order - b.sort_order);

    if (product.name === "Test Product") {
      console.log(`🔍 Test Product: Active variants after filtering/sorting:`, activeVariants);
    }

    if (activeVariants.length > 0) {
      const defaultVariant = activeVariants[0];
      if (product.name === "Test Product") {
        console.log(`🔍 Test Product: Using variant pricing:`, {
          variant_name: defaultVariant.name,
          variant_price: defaultVariant.price,
          variant_sale_price: defaultVariant.sale_price
        });
      }
      return {
        price: defaultVariant.price,
        salePrice: defaultVariant.sale_price,
        hasVariants: true,
        defaultVariant,
      };
    }
  }

  // Fallback to base pricing
  if (product.name === "Test Product") {
    console.log(`🔍 Test Product: Falling back to base pricing`);
  }
  return {
    price: product.price,
    salePrice: product.sale_price,
    hasVariants: false,
  };
}
