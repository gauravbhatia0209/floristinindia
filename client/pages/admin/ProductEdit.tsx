import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Package, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/lib/supabase";
import {
  Product,
  ProductCategory,
  ProductCategoryAssignment,
} from "@shared/database.types";
import { ImageUpload } from "@/components/ui/image-upload";
import { ProductVariations } from "@/components/admin/ProductVariations";
import { MultiCategorySelect } from "@/components/ui/multi-category-select";
import { useClearMetaCacheOnSave } from "@/lib/meta-cache";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { SingleImageUpload } from "@/components/ui/single-image-upload";
import { useAuth } from "@/contexts/AuthContext";
import { canCreate, canEdit } from "@/lib/permissionUtils";
import PermissionGuard from "@/components/PermissionGuard";

export default function ProductEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isNew = !id;

  const hasCreatePermission = canCreate(user?.permissions, "products");
  const hasEditPermission = canEdit(user?.permissions, "products");

  useEffect(() => {
    if (!isNew && !hasEditPermission) {
      navigate("/admin/products");
    } else if (isNew && !hasCreatePermission) {
      navigate("/admin/products");
    }
  }, [isNew, hasEditPermission, hasCreatePermission, navigate]);

  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [primaryCategoryId, setPrimaryCategoryId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { clearProductCache, clearAllCache } = useClearMetaCacheOnSave();
  const { settings } = useSiteSettings();
  const [shippingZones, setShippingZones] = useState<any[]>([]);
  const [productDeliveryZones, setProductDeliveryZones] = useState<
    Record<string, number>
  >({});

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    short_description: "",
    price: "",
    sale_price: "",
    sku: "",
    stock_quantity: "",
    category_id: "",
    subcategory_id: "",
    images: [] as string[],
    tags: "",
    is_active: true,
    is_featured: false,
    has_variations: false,
    requires_file_upload: false,
    upload_file_types: "",
    delivery_zones: "",
    meta_title: "",
    meta_description: "",
    og_image: "",
    robots: "",
    weight: "",
  });

  useEffect(() => {
    fetchCategories();
    fetchShippingZones();
    if (!isNew && id) {
      fetchProduct(id);
    } else {
      setIsLoading(false);
    }
  }, [id, isNew]);

  async function fetchCategories() {
    try {
      const { data } = await supabase
        .from("product_categories")
        .select("*")
        .eq("is_active", true)
        .order("name");

      if (data) {
        setCategories(data);
      }
    } catch (error: any) {
      console.error("Failed to fetch categories:", error);
      const errorMessage =
        error?.message || error?.error_description || "Unknown error";
      console.error("Categories fetch error details:", errorMessage);
    }
  }

  async function fetchShippingZones() {
    try {
      const { data } = await supabase
        .from("shipping_zones")
        .select("*")
        .eq("is_active", true)
        .order("name");

      if (data) {
        setShippingZones(data);
      }
    } catch (error: any) {
      console.error("Failed to fetch shipping zones:", error);
    }
  }

  async function fetchProductDeliveryZones(productId: string) {
    try {
      const { data } = await supabase
        .from("product_delivery_zones")
        .select("zone_id, available_quantity")
        .eq("product_id", productId);

      if (data) {
        const zonesMap: Record<string, number> = {};
        data.forEach((item) => {
          zonesMap[item.zone_id] = item.available_quantity;
        });
        setProductDeliveryZones(zonesMap);
      }
    } catch (error: any) {
      console.error("Failed to fetch product delivery zones:", error);
    }
  }

  async function fetchProduct(productId: string) {
    try {
      console.log("Fetching product with ID:", productId);

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", productId)
        .single();

      console.log("Supabase response:", { data, error });

      if (error) throw error;

      if (data) {
        setProduct(data);
        setFormData({
          name: data.name || "",
          slug: data.slug || "",
          description: data.description || "",
          short_description: data.short_description || "",
          price: data.price?.toString() || "",
          sale_price: data.sale_price?.toString() || "",
          sku: data.sku || "",
          stock_quantity: data.stock_quantity?.toString() || "",
          category_id: data.category_id || "",
          subcategory_id: data.subcategory_id || "",
          images: data.images || [],
          tags: data.tags?.join(", ") || "",
          is_active: data.is_active,
          is_featured: data.is_featured,
          has_variations: data.has_variations ?? false, // Use nullish coalescing for better handling
          requires_file_upload: data.requires_file_upload,
          upload_file_types: data.upload_file_types?.join(", ") || "",
          delivery_zones: data.delivery_zones?.join(", ") || "",
          meta_title: data.meta_title || "",
          meta_description: data.meta_description || "",
          og_image: (data as any).og_image || "",
          robots: (data as any).robots || "",
          weight: data.weight?.toString() || "",
        });

        // Load multi-category assignments
        const multiCategoryLoaded = await loadCategoryAssignments(productId);

        // Fallback to legacy single category only if multi-category loading failed
        if (!multiCategoryLoaded && data.category_id) {
          console.log(
            "Using legacy single category fallback:",
            data.category_id,
          );
          setSelectedCategoryIds([data.category_id]);
          setPrimaryCategoryId(data.category_id);
        }

        // Load product delivery zones
        await fetchProductDeliveryZones(productId);
      } else {
        throw new Error("Product not found");
      }
    } catch (error: any) {
      console.error("Failed to fetch product:", error);
      const errorMessage =
        error?.message || error?.error_description || "Unknown error";
      alert(`Failed to load product: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  }

  // Auto-generate slug from name
  useEffect(() => {
    if (formData.name && (!product || formData.slug === product.slug)) {
      const slug = formData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      setFormData((prev) => ({ ...prev, slug }));
    }
  }, [formData.name, product]);

  async function handleSave() {
    const missing: string[] = [];
    if (!formData.name) missing.push("name");
    if (selectedCategoryIds.length === 0) missing.push("at least one category");
    if (!formData.has_variations && !formData.price) missing.push("price");
    if (missing.length > 0) {
      const extra =
        !formData.has_variations && !formData.price
          ? ""
          : formData.has_variations && !formData.price
            ? " (enter a temporary base price to create the product; variant pricing is added after saving)"
            : "";
      alert(`Please fill in: ${missing.join(", ")} ${extra}`.trim());
      return;
    }

    setIsSaving(true);
    try {
      const productData = {
        name: formData.name,
        slug: formData.slug,
        description: formData.description || null,
        short_description: formData.short_description || null,
        price: formData.has_variations
          ? formData.price
            ? parseFloat(formData.price)
            : 0
          : parseFloat(formData.price),
        sale_price: formData.sale_price
          ? parseFloat(formData.sale_price)
          : null,
        sku: formData.sku || null,
        stock_quantity: parseInt(formData.stock_quantity) || 0,
        category_id: primaryCategoryId, // Keep for backwards compatibility
        subcategory_id: formData.subcategory_id || null,
        images: formData.images,
        tags: formData.tags
          ? formData.tags.split(",").map((t) => t.trim())
          : [],
        is_active: formData.is_active,
        is_featured: formData.is_featured,
        has_variations: formData.has_variations,
        requires_file_upload: formData.requires_file_upload,
        upload_file_types: formData.upload_file_types
          ? formData.upload_file_types.split(",").map((t) => t.trim())
          : [],
        delivery_zones: formData.delivery_zones
          ? formData.delivery_zones.split(",").map((t) => t.trim())
          : [],
        meta_title: formData.meta_title || null,
        meta_description: formData.meta_description || null,
        og_image: formData.og_image || null,
        robots: formData.robots || null,
        weight: formData.weight ? parseFloat(formData.weight) : null,
      };

      let productId: string;

      if (isNew) {
        const { data, error } = await supabase
          .from("products")
          .insert(productData)
          .select("id")
          .single();

        if (error) throw error;
        productId = data.id;
      } else {
        const { error } = await supabase
          .from("products")
          .update(productData)
          .eq("id", id);

        if (error) throw error;
        productId = id!;
      }

      // Save category assignments
      console.log("🔄 About to save category assignments...");
      console.log("Product ID for category save:", productId);
      console.log("Selected categories before save:", selectedCategoryIds);
      console.log("Primary category before save:", primaryCategoryId);
      await saveCategoryAssignments(productId);
      console.log("✅ Category assignments save completed");

      // Save product delivery zones
      await saveProductDeliveryZones(productId);
      console.log("✅ Product delivery zones save completed");

      // Clear meta cache for product
      try {
        await clearProductCache(formData.slug);
        // Also clear category cache if this is a featured product
        if (formData.is_featured) {
          await clearAllCache();
        }
      } catch (cacheError) {
        console.warn("Failed to clear meta cache:", cacheError);
      }

      alert(
        isNew
          ? "Product created successfully!"
          : "Product updated successfully!",
      );
      navigate("/admin/products");
    } catch (error: any) {
      console.error("Failed to save product:", error);
      let errorMessage = "Unknown error";

      if (error?.message) {
        errorMessage = error.message;
      } else if (error?.error_description) {
        errorMessage = error.error_description;
      } else if (error?.details) {
        errorMessage = error.details;
      } else if (typeof error === "string") {
        errorMessage = error;
      } else if (error?.code) {
        errorMessage = `Error ${error.code}: ${error.hint || "Database error"}`;
      } else {
        errorMessage = JSON.stringify(error);
      }

      alert(`Failed to save product: ${errorMessage}`);
    } finally {
      setIsSaving(false);
    }
  }

  async function loadCategoryAssignments(productId: string): Promise<boolean> {
    try {
      const { data: assignments, error } = await supabase
        .from("product_category_assignments")
        .select("category_id, is_primary")
        .eq("product_id", productId);

      if (error) {
        if (error.code === "42P01") {
          console.log(
            "📝 Multi-category table doesn't exist - using legacy single category mode",
          );
          return false; // Explicitly return false for fallback
        }
        console.warn("Could not load category assignments:", error);
        return false;
      }

      if (assignments && assignments.length > 0) {
        const categoryIds = assignments.map((a) => a.category_id);
        const primaryAssignment = assignments.find((a) => a.is_primary);

        setSelectedCategoryIds(categoryIds);
        if (primaryAssignment) {
          setPrimaryCategoryId(primaryAssignment.category_id);
        } else if (categoryIds.length > 0) {
          setPrimaryCategoryId(categoryIds[0]);
        }

        console.log(
          `✅ Loaded ${assignments.length} category assignments for product ${productId}:`,
          categoryIds,
        );
        return true; // Successfully loaded multi-category data
      }

      return false; // No assignments found, use fallback
    } catch (error) {
      console.log(
        "📝 Multi-category not available - using legacy single category mode",
      );
      return false;
    }
  }

  async function saveCategoryAssignments(productId: string) {
    // Skip multi-category if no categories selected
    if (selectedCategoryIds.length === 0) {
      console.log(
        "No categories selected, skipping multi-category assignments",
      );
      return;
    }

    // Multi-category functionality is now enabled
    console.log(
      "💾 Multi-category enabled - will save all selected categories",
    );
    console.log("Selected categories:", selectedCategoryIds);
    console.log("Primary category:", primaryCategoryId);

    try {
      console.log("💾 Attempting to save multi-category assignments...");
      console.log("Selected categories:", selectedCategoryIds);
      console.log("Primary category:", primaryCategoryId);
      console.log("Product ID:", productId);

      // Validate category IDs
      const validCategoryIds = selectedCategoryIds.filter(
        (id) => id && id.trim() !== "",
      );
      if (validCategoryIds.length === 0) {
        console.warn(
          "No valid category IDs found, skipping multi-category save",
        );
        return;
      }

      // Ensure primary category is valid
      let validPrimaryId = primaryCategoryId;
      if (!validPrimaryId || !validCategoryIds.includes(validPrimaryId)) {
        validPrimaryId = validCategoryIds[0];
        setPrimaryCategoryId(validPrimaryId); // Update state
        console.log("Primary category corrected to:", validPrimaryId);
      }

      // Check if the multi-category table exists
      console.log("🔍 Checking if multi-category table exists...");
      const { data: tableExists, error: tableCheckError } = await supabase
        .from("product_category_assignments")
        .select("id")
        .limit(1);

      if (tableCheckError) {
        console.error("Table check error:", tableCheckError);
        console.error(
          "Table check error JSON:",
          JSON.stringify(tableCheckError, null, 2),
        );

        if (
          tableCheckError.code === "42P01" ||
          (tableCheckError.message &&
            tableCheckError.message.toLowerCase().includes("does not exist"))
        ) {
          console.log(
            "📝 Multi-category table doesn't exist. Please run the migration:",
          );
          console.log("   node apply-multi-category-migration.js");
          console.log(
            "   OR manually run database-multi-category-migration.sql in Supabase dashboard",
          );
          return;
        }
      } else {
        console.log("✅ Multi-category table exists");
      }

      // First try to delete existing assignments
      console.log("🗑️ Deleting existing category assignments...");
      const { error: deleteError } = await supabase
        .from("product_category_assignments")
        .delete()
        .eq("product_id", productId);

      if (deleteError) {
        console.warn("⚠️ Warning during delete:", deleteError);
      } else {
        console.log("✅ Successfully deleted existing assignments");
      }

      // Create assignments
      const assignments = validCategoryIds.map((categoryId) => ({
        product_id: productId,
        category_id: categoryId,
        is_primary: categoryId === validPrimaryId,
      }));

      console.log("Inserting assignments:", assignments);

      // Insert new assignments
      console.log("🔄 Inserting assignments into database...");
      const { data: insertData, error: insertError } = await supabase
        .from("product_category_assignments")
        .insert(assignments)
        .select();

      console.log("📊 Insert result:", {
        data: insertData,
        error: insertError,
      });

      if (insertError) {
        console.error("❌ Failed to save multi-category assignments:");
        console.error("Full error object:", insertError);
        console.error("Error type:", typeof insertError);
        console.error("Error keys:", Object.keys(insertError));
        console.error("Error as JSON:", JSON.stringify(insertError, null, 2));

        // Check different possible error properties
        console.error("Code:", insertError.code);
        console.error("Message:", insertError.message);
        console.error("Details:", insertError.details);
        console.error("Hint:", insertError.hint);
        console.error("Error:", insertError.error);
        console.error("Status:", insertError.status);
        console.error("StatusText:", insertError.statusText);

        // Check if it's a table doesn't exist error
        if (
          insertError.code === "42P01" ||
          (insertError.message &&
            insertError.message.includes("does not exist")) ||
          (insertError.error && insertError.error.includes("does not exist"))
        ) {
          console.log(
            "📝 Multi-category table doesn't exist. Please run the migration:",
          );
          console.log("   node apply-multi-category-migration.js");
          return;
        }

        // Don't throw - let the legacy single category handle it
        return;
      }

      console.log(
        `✅ Successfully saved ${assignments.length} category assignments`,
      );
      console.log("📊 Saved data:", insertData);
    } catch (error: any) {
      console.error("❌ Unexpected error in multi-category save:");
      console.error("Error:", error);
      // Continue silently - legacy single category will still work
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded animate-pulse w-48"></div>
        <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/admin/products")}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">
              {isNew ? "Add New Product" : "Edit Product"}
            </h1>
            <p className="text-muted-foreground">
              {isNew ? "Create a new product" : `Editing: ${product?.name}`}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate("/admin/products")}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? "Saving..." : "Save Product"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Beautiful Rose Bouquet"
                />
              </div>

              <div>
                <Label htmlFor="slug">URL Slug *</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                  placeholder="beautiful-rose-bouquet"
                />
              </div>

              <div>
                <Label htmlFor="short_description">Short Description</Label>
                <Textarea
                  id="short_description"
                  value={formData.short_description}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      short_description: e.target.value,
                    })
                  }
                  placeholder="Brief product description..."
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="description">Full Description</Label>
                <RichTextEditor
                  value={formData.description || ""}
                  onChange={(html) =>
                    setFormData({ ...formData, description: html })
                  }
                  placeholder="Detailed product description..."
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pricing & Inventory</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!formData.has_variations ? (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price">Regular Price (₹) *</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: e.target.value })
                      }
                      placeholder="999"
                    />
                  </div>
                  <div>
                    <Label htmlFor="sale_price">Sale Price (₹)</Label>
                    <Input
                      id="sale_price"
                      type="number"
                      value={formData.sale_price}
                      onChange={(e) =>
                        setFormData({ ...formData, sale_price: e.target.value })
                      }
                      placeholder="799"
                    />
                  </div>
                </div>
              ) : (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Package className="h-4 w-4 text-blue-600" />
                    <h4 className="font-medium text-blue-900">
                      Product Variations Enabled
                    </h4>
                  </div>
                  <p className="text-sm text-blue-700">
                    Pricing is managed through individual product variants
                    below. The base pricing fields are disabled when variations
                    are enabled.
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sku">SKU</Label>
                  <Input
                    id="sku"
                    value={formData.sku}
                    onChange={(e) =>
                      setFormData({ ...formData, sku: e.target.value })
                    }
                    placeholder="RB-001"
                  />
                </div>
                <div>
                  <Label htmlFor="stock_quantity">Stock Quantity</Label>
                  <Input
                    id="stock_quantity"
                    type="number"
                    value={formData.stock_quantity}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        stock_quantity: e.target.value,
                      })
                    }
                    placeholder="50"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Product Variations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="has_variations">
                    Does this product have variations?
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Enable this to create different variants (size, color, etc.)
                  </p>
                </div>
                <Switch
                  id="has_variations"
                  checked={formData.has_variations}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, has_variations: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Images</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageUpload
                images={formData.images}
                onImagesChange={(images) =>
                  setFormData({
                    ...formData,
                    images,
                  })
                }
                maxImages={5}
                maxSizeMB={3}
                label="Product Images"
              />
            </CardContent>
          </Card>

          {/* Product Variations Management */}
          {!isNew && product && formData.has_variations && (
            <ProductVariations
              productId={product.id}
              basePrice={parseFloat(formData.price) || 0}
              baseSalePrice={
                formData.sale_price
                  ? parseFloat(formData.sale_price)
                  : undefined
              }
            />
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Categories</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <MultiCategorySelect
                categories={categories}
                selectedCategoryIds={selectedCategoryIds}
                onSelectionChange={setSelectedCategoryIds}
                primaryCategoryId={primaryCategoryId}
                onPrimaryCategoryChange={setPrimaryCategoryId}
                label="Product Categories"
                placeholder="Select one or more categories..."
                required={true}
              />

              <div className="text-sm text-muted-foreground">
                <p>
                  • Select multiple categories to display this product in all
                  relevant sections
                </p>
                <p>
                  • Click a selected category to make it the primary category
                </p>
                <p>
                  • Primary category is used for main classification and
                  backwards compatibility
                </p>
              </div>

              <div>
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) =>
                    setFormData({ ...formData, tags: e.target.value })
                  }
                  placeholder="roses, bouquet, romantic"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Product Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="is_active">Active</Label>
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, is_active: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="is_featured">Featured</Label>
                <Switch
                  id="is_featured"
                  checked={formData.is_featured}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, is_featured: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="requires_file_upload">
                  Requires File Upload
                </Label>
                <Switch
                  id="requires_file_upload"
                  checked={formData.requires_file_upload}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, requires_file_upload: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>SEO</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="meta_title">Meta Title</Label>
                <Input
                  id="meta_title"
                  value={formData.meta_title}
                  onChange={(e) =>
                    setFormData({ ...formData, meta_title: e.target.value })
                  }
                  placeholder={
                    settings.defaultMetaTitle ||
                    "Beautiful Rose Bouquet - Fresh Flowers"
                  }
                />
                {!formData.meta_title && settings.defaultMetaTitle && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Will use default: {settings.defaultMetaTitle}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="meta_description">Meta Description</Label>
                <Textarea
                  id="meta_description"
                  value={formData.meta_description}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      meta_description: e.target.value,
                    })
                  }
                  placeholder={
                    settings.defaultMetaDescription ||
                    "Order beautiful rose bouquets for delivery..."
                  }
                  rows={3}
                />
                {!formData.meta_description &&
                  settings.defaultMetaDescription && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Will use default:{" "}
                      {settings.defaultMetaDescription.substring(0, 100)}...
                    </p>
                  )}
              </div>

              <div>
                <Label htmlFor="robots">Robots Directive</Label>
                <Select
                  value={formData.robots || "default"}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      robots: value === "default" ? "" : value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={settings.defaultRobots || "index, follow"}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Use default</SelectItem>
                    <SelectItem value="index, follow">index, follow</SelectItem>
                    <SelectItem value="noindex, follow">
                      noindex, follow
                    </SelectItem>
                    <SelectItem value="index, nofollow">
                      index, nofollow
                    </SelectItem>
                    <SelectItem value="noindex, nofollow">
                      noindex, nofollow
                    </SelectItem>
                    <SelectItem value="noindex, nofollow, noarchive">
                      noindex, nofollow, noarchive
                    </SelectItem>
                    <SelectItem value="nosnippet">nosnippet</SelectItem>
                  </SelectContent>
                </Select>
                {!formData.robots && settings.defaultRobots && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Will use default: {settings.defaultRobots}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="og_image">Open Graph Image</Label>
                <SingleImageUpload
                  imageUrl={formData.og_image}
                  onImageChange={(imageUrl) =>
                    setFormData({ ...formData, og_image: imageUrl })
                  }
                  label="Product OG Image"
                />
                {!formData.og_image && settings.defaultOgImage && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Will use default OG image from Site Settings
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
