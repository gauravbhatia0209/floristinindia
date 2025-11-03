import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/lib/supabase";
import { getProductEffectivePriceSync } from "@/lib/productUtils";
import { Product, ProductCategory, ProductVariant } from "@shared/database.types";
import PermissionGuard from "@/components/PermissionGuard";
import { useAuth } from "@/contexts/AuthContext";
import { canCreate, canEdit, canDelete } from "@/lib/permissionUtils";

interface ProductWithCategoryAssignments extends Product {
  categoryAssignments?: { category_id: string; is_primary: boolean }[];
  variants?: ProductVariant[];
}

export default function AdminProducts() {
  const { user } = useAuth();
  const [products, setProducts] = useState<ProductWithCategoryAssignments[]>(
    [],
  );
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  const hasCreatePermission = canCreate(user?.permissions, "products");
  const hasEditPermission = canEdit(user?.permissions, "products");
  const hasDeletePermission = canDelete(user?.permissions, "products");

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      console.log("Fetching products and categories...");

      const results = await Promise.allSettled([
        supabase.from("products").select("*").order("created_at", {
          ascending: false,
        }),
        supabase
          .from("product_categories")
          .select("*")
          .eq("is_active", true)
          .order("name"),
      ]);

      const productsData =
        results[0].status === "fulfilled" ? results[0].value.data || [] : [];
      const categoriesData =
        results[1].status === "fulfilled" ? results[1].value.data || [] : [];

      const productIds = productsData.map((product) => product.id);

      const assignmentsByProduct: Record<
        string,
        { category_id: string; is_primary: boolean }[]
      > = {};

      try {
        const { data: allAssignments, error: assignmentsError } = await supabase
          .from("product_category_assignments")
          .select("product_id, category_id, is_primary");

        if (assignmentsError && assignmentsError.code !== "42P01") {
          console.warn(
            "Error fetching category assignments:",
            assignmentsError,
          );
        }

        if (allAssignments) {
          allAssignments.forEach((assignment) => {
            if (!assignmentsByProduct[assignment.product_id]) {
              assignmentsByProduct[assignment.product_id] = [];
            }
            assignmentsByProduct[assignment.product_id].push({
              category_id: assignment.category_id,
              is_primary: assignment.is_primary,
            });
          });

          console.log("Added category assignments to products");
        }
      } catch (error) {
        console.log(
          "Multi-category assignments not available, using legacy categories",
        );
      }

      const variantsByProduct: Record<string, ProductVariant[]> = {};
      if (productIds.length > 0) {
        try {
          const { data: variantsData, error: variantsError } = await supabase
            .from("product_variants")
            .select("*")
            .in("product_id", productIds);

          if (variantsError && variantsError.code !== "42P01") {
            console.warn("Error fetching product variants:", variantsError);
          }

          if (variantsData) {
            variantsData.forEach((variant) => {
              if (!variantsByProduct[variant.product_id]) {
                variantsByProduct[variant.product_id] = [];
              }
              variantsByProduct[variant.product_id].push(variant);
            });

            console.log("Added variant data to products");
          }
        } catch (error) {
          console.warn(
            "Product variants not available, using base pricing",
            error,
          );
        }
      }

      const productsWithAssignments: ProductWithCategoryAssignments[] =
        productsData.map((product) => ({
          ...product,
          categoryAssignments: assignmentsByProduct[product.id] || [],
          variants: variantsByProduct[product.id] || [],
        }));

      console.log("Fetched:", {
        products: productsWithAssignments.length,
        categories: categoriesData.length,
      });

      setProducts(productsWithAssignments);
      setCategories(categoriesData);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      // Set empty arrays on error
      setProducts([]);
      setCategories([]);
    } finally {
      setIsLoading(false);
    }
  }

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || product.category_id === selectedCategory;
    const matchesStatus =
      selectedStatus === "all" ||
      (selectedStatus === "active" && product.is_active) ||
      (selectedStatus === "inactive" && !product.is_active);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  function getCategoryName(categoryId: string) {
    const category = categories.find((cat) => cat.id === categoryId);
    return category?.name || "Unknown";
  }

  function getAllCategoriesForProduct(product: ProductWithCategoryAssignments) {
    // First try to get categories from multi-category assignments
    if (product.categoryAssignments && product.categoryAssignments.length > 0) {
      const categoryNames = product.categoryAssignments
        .map((assignment) => {
          const category = categories.find(
            (cat) => cat.id === assignment.category_id,
          );
          return {
            name: category?.name || "Unknown",
            isPrimary: assignment.is_primary,
          };
        })
        .sort((a, b) => {
          // Sort primary category first
          if (a.isPrimary && !b.isPrimary) return -1;
          if (!a.isPrimary && b.isPrimary) return 1;
          return a.name.localeCompare(b.name);
        });

      return categoryNames;
    }

    // Fallback to legacy single category
    if (product.category_id) {
      const categoryName = getCategoryName(product.category_id);
      return [{ name: categoryName, isPrimary: true }];
    }

    return [{ name: "Uncategorized", isPrimary: true }];
  }

  function getStockStatus(stock: number) {
    if (stock === 0)
      return { label: "Out of Stock", variant: "destructive" as const };
    if (stock < 10)
      return { label: "Low Stock", variant: "secondary" as const };
    return { label: "In Stock", variant: "default" as const };
  }

  function formatCurrencyValue(value: number | null | undefined) {
    if (value === null || value === undefined) {
      return null;
    }

    const fractionDigits = Number.isInteger(value) ? 0 : 2;

    return value.toLocaleString("en-IN", {
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits,
    });
  }

  async function handleDeleteProduct(productId: string) {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      await supabase.from("products").delete().eq("id", productId);
      setProducts(products.filter((p) => p.id !== productId));
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  }

  async function toggleProductStatus(
    productId: string,
    currentStatus: boolean,
  ) {
    try {
      await supabase
        .from("products")
        .update({ is_active: !currentStatus })
        .eq("id", productId);

      setProducts(
        products.map((p) =>
          p.id === productId ? { ...p, is_active: !currentStatus } : p,
        ),
      );
    } catch (error) {
      console.error("Failed to update product status:", error);
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
    <PermissionGuard requiredModule="products">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Products</h1>
            <p className="text-muted-foreground">
              Manage your flower catalog and inventory
            </p>
          </div>
        {hasCreatePermission && (
          <Button asChild>
            <Link to="/admin/products/new">
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Link>
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Products
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <div className="h-2 w-2 bg-green-500 rounded-full"></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {products.filter((p) => p.is_active).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
            <div className="h-2 w-2 bg-orange-500 rounded-full"></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {products.filter((p) => p.stock_quantity < 10).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
            <div className="h-2 w-2 bg-red-500 rounded-full"></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {products.filter((p) => p.stock_quantity === 0).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filter Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full md:w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Products ({filteredProducts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No products found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery
                  ? "Try adjusting your search or filters"
                  : "Get started by adding your first product"}
              </p>
              <Button asChild>
                <Link to="/admin/products/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Link>
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-cream to-peach/30 rounded-lg flex items-center justify-center">
                            {product.images.length > 0 ? (
                              <img
                                src={product.images[0]}
                                alt={product.name}
                                className="w-full h-full object-cover rounded-lg"
                              />
                            ) : (
                              <span className="text-2xl">🌸</span>
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {product.sku || "No SKU"}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {getAllCategoriesForProduct(product).map(
                            (category, index) => (
                              <Badge
                                key={index}
                                variant={
                                  category.isPrimary ? "default" : "secondary"
                                }
                                className="text-xs"
                              >
                                {category.name}
                                {category.isPrimary && " (Primary)"}
                              </Badge>
                            ),
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {(() => {
                          const pricing = getProductEffectivePriceSync(
                            product,
                            product.variants,
                          );
                          const primaryValue =
                            pricing.salePrice ??
                            pricing.price ??
                            product.sale_price ??
                            product.price;
                          const compareValue =
                            pricing.salePrice !== null &&
                            pricing.salePrice !== undefined &&
                            pricing.price !== null &&
                            pricing.price !== undefined &&
                            pricing.salePrice < pricing.price
                              ? pricing.price
                              : null;
                          const formattedPrimary =
                            formatCurrencyValue(primaryValue);
                          const formattedCompare =
                            formatCurrencyValue(compareValue);

                          return (
                            <div>
                              <span className="font-medium">
                                {formattedPrimary ? `₹${formattedPrimary}` : "—"}
                              </span>
                              {formattedCompare && (
                                <span className="text-sm text-muted-foreground line-through ml-2">
                                  ₹{formattedCompare}
                                </span>
                              )}
                            </div>
                          );
                        })()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span>{product.stock_quantity}</span>
                          <Badge {...getStockStatus(product.stock_quantity)}>
                            {getStockStatus(product.stock_quantity).label}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={product.is_active ? "default" : "secondary"}
                        >
                          {product.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link to={`/product/${product.slug}`}>
                                <Eye className="h-4 w-4 mr-2" />
                                View
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link to={`/admin/products/${product.id}/edit`}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                toggleProductStatus(
                                  product.id,
                                  product.is_active,
                                )
                              }
                            >
                              {product.is_active ? "Deactivate" : "Activate"}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => handleDeleteProduct(product.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
    </PermissionGuard>
  );
}
