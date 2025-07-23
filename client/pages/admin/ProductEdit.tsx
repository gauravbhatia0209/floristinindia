import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Package, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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

export default function ProductEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isNew = !id;

  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [primaryCategoryId, setPrimaryCategoryId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

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
    weight: "",
  });

  useEffect(() => {
    fetchCategories();
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
          weight: data.weight?.toString() || "",
        });

        // Load multi-category assignments
        await loadCategoryAssignments(productId);

        // Fallback to legacy single category if no multi-category assignments found
        if (selectedCategoryIds.length === 0 && data.category_id) {
          setSelectedCategoryIds([data.category_id]);
          setPrimaryCategoryId(data.category_id);
        }
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
    if (!formData.name || !formData.price || selectedCategoryIds.length === 0) {
      alert(
        "Please fill in all required fields including at least one category",
      );
      return;
    }

    setIsSaving(true);
    try {
      const productData = {
        name: formData.name,
        slug: formData.slug,
        description: formData.description || null,
        short_description: formData.short_description || null,
        price: parseFloat(formData.price),
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
      await saveCategoryAssignments(productId);

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

  async function loadCategoryAssignments(productId: string) {
    try {
      const { data: assignments, error } = await supabase
        .from("product_category_assignments")
        .select("category_id, is_primary")
        .eq("product_id", productId);

      if (error) {
        console.warn("Could not load category assignments:", error);
        return; // Fall back to legacy single category mode
      }

      if (assignments && assignments.length > 0) {
        const categoryIds = assignments.map(a => a.category_id);
        const primaryAssignment = assignments.find(a => a.is_primary);

        setSelectedCategoryIds(categoryIds);
        if (primaryAssignment) {
          setPrimaryCategoryId(primaryAssignment.category_id);
        } else if (categoryIds.length > 0) {
          // If no primary is marked, use the first one
          setPrimaryCategoryId(categoryIds[0]);
        }

        console.log(`✅ Loaded ${assignments.length} category assignments for product ${productId}`);
      }
    } catch (error) {
      console.error("Error loading category assignments:", error);
    }
  }

  async function saveCategoryAssignments(productId: string) {
    try {
      // First, delete existing category assignments for this product
      const { error: deleteError } = await supabase
        .from("product_category_assignments")
        .delete()
        .eq("product_id", productId);

      if (deleteError) {
        console.warn("Warning: Could not delete existing assignments:", deleteError);
        // Continue anyway - might be first time assignment
      }

      // Create new category assignments
      if (selectedCategoryIds.length > 0) {
        console.log("Debug: Selected categories:", selectedCategoryIds);
        console.log("Debug: Primary category:", primaryCategoryId);
        console.log("Debug: Product ID:", productId);

        // Validate that all category IDs are valid UUIDs
        const validCategoryIds = selectedCategoryIds.filter(id => id && id.trim() !== '');
        if (validCategoryIds.length === 0) {
          console.warn("No valid category IDs found");
          return;
        }

        // Ensure primary category is set to one of the selected categories
        let validPrimaryId = primaryCategoryId;
        if (!validPrimaryId || !validCategoryIds.includes(validPrimaryId)) {
          validPrimaryId = validCategoryIds[0];
          console.log("Primary category was invalid, using first selected category:", validPrimaryId);
        }

        const assignments = validCategoryIds.map((categoryId, index) => ({
          product_id: productId,
          category_id: categoryId,
          is_primary: categoryId === validPrimaryId,
        }));

        console.log("Debug: Assignments to insert:", JSON.stringify(assignments, null, 2));

        // First check if table exists
        const { data: tableCheck, error: tableError } = await supabase
          .from("product_category_assignments")
          .select("id")
          .limit(1);

        if (tableError) {
          console.error("Table check failed:", tableError);
          if (tableError.code === "42P01") {
            console.log("Multi-category table does not exist, using legacy single category mode");
            return;
          }
        } else {
          console.log("Multi-category table exists, proceeding with insert");
        }

        const { error: insertError } = await supabase
          .from("product_category_assignments")
          .insert(assignments);

        if (insertError) {
          console.error("Failed to save category assignments:");
          console.error("Error message:", insertError.message);
          console.error("Error code:", insertError.code);
          console.error("Error details:", insertError.details);
          console.error("Error hint:", insertError.hint);
          console.error("Full error object:", JSON.stringify(insertError, null, 2));

          // If multi-category table doesn't exist, fall back to legacy mode
          if (insertError.code === "42P01") { // Table doesn't exist
            console.log("Multi-category table not found, using legacy single category mode");
            return;
          }
          throw insertError;
        }

        console.log(`✅ Saved ${assignments.length} category assignments for product ${productId}`);
      }
    } catch (error: any) {
      console.error("Error in saveCategoryAssignments:");
      console.error("Error message:", error?.message);
      console.error("Error code:", error?.code);
      console.error("Error details:", error?.details);
      console.error("Full error object:", JSON.stringify(error, null, 2));

      // Don't throw error to prevent blocking the main save operation
      // The primary category is still saved via the legacy category_id field
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
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Detailed product description..."
                  rows={4}
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
                  placeholder="Beautiful Rose Bouquet - Fresh Flowers"
                />
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
                  placeholder="Order beautiful rose bouquets for delivery..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
