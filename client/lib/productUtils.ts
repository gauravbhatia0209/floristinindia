import { supabase } from "@/lib/supabase";
import {
  Product,
  ProductCategory,
  ProductCategoryAssignment,
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

    // Fetch category assignments for all products
    const { data: assignments } = await supabase
      .from("product_category_assignments")
      .select(
        `
        *,
        product_categories (*)
      `,
      )
      .in(
        "product_id",
        products.map((p) => p.id),
      );

    // Fetch all categories for fallback
    const { data: allCategories } = await supabase
      .from("product_categories")
      .select("*")
      .eq("is_active", true);

    // Combine data
    const productsWithCategories: ProductWithCategories[] = products.map(
      (product) => {
        const productAssignments =
          assignments?.filter((a) => a.product_id === product.id) || [];

        let assignedCategories: ProductCategory[] = [];
        let primaryCategory: ProductCategory | undefined;

        if (productAssignments.length > 0) {
          // Use multi-category assignments
          assignedCategories = productAssignments
            .map((a: any) => a.product_categories)
            .filter(Boolean);

          const primaryAssignment = productAssignments.find(
            (a) => a.is_primary,
          );
          primaryCategory = primaryAssignment
            ? assignedCategories.find(
                (c) => c.id === primaryAssignment.category_id,
              )
            : assignedCategories[0];
        } else {
          // Fall back to legacy single category
          const legacyCategory = allCategories?.find(
            (c) => c.id === product.category_id,
          );
          if (legacyCategory) {
            assignedCategories = [legacyCategory];
            primaryCategory = legacyCategory;
          }
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

    // Get product counts for each category
    const categoriesWithCounts = await Promise.all(
      categories.map(async (category) => {
        // Try multi-category assignments first
        const { data: assignments } = await supabase
          .from("product_category_assignments")
          .select("product_id")
          .eq("category_id", category.id);

        let productCount = 0;

        if (assignments && assignments.length > 0) {
          // Verify products are active
          const { data: activeProducts } = await supabase
            .from("products")
            .select("id")
            .in(
              "id",
              assignments.map((a) => a.product_id),
            )
            .eq("is_active", true);

          productCount = activeProducts?.length || 0;
        } else {
          // Fall back to legacy single category count
          const { data: legacyProducts } = await supabase
            .from("products")
            .select("id")
            .eq("category_id", category.id)
            .eq("is_active", true);

          productCount = legacyProducts?.length || 0;
        }

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
