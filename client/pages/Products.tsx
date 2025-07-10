import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Filter, Grid, List, ShoppingCart, ChevronDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { supabase } from "@/lib/supabase";
import { Product, ProductCategory } from "@shared/database.types";
import { useCart } from "@/hooks/useCart";
import {
  fetchProductsWithCategories,
  getCategoriesWithProductCount,
} from "@/lib/productUtils";

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [currentCategory, setCurrentCategory] =
    useState<ProductCategory | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("name");

  const { slug: categorySlug } = useParams<{ slug: string }>();

  const { addItem } = useCart();

  useEffect(() => {
    fetchData();
  }, [categorySlug]); // Refetch when category slug changes

  useEffect(() => {
    filterAndSortProducts();
  }, [products, selectedCategories, priceRange, sortBy, categorySlug]);

  async function fetchData() {
    try {
      console.log("fetchData called with categorySlug:", categorySlug);
      let productsData: Product[] = [];

      if (categorySlug) {
        console.log("Fetching products for category:", categorySlug);

        // Set current category and pre-select it in filters
        const { data: currentCategoryData, error: categoryError } =
          await supabase
            .from("product_categories")
            .select("*")
            .eq("slug", categorySlug)
            .single();

        console.log("Category lookup result:", {
          currentCategoryData,
          categoryError,
        });

        if (currentCategoryData) {
          setCurrentCategory(currentCategoryData);
          setSelectedCategories([currentCategoryData.id]);

          // Fetch products for this specific category - try direct approach first
          console.log(
            "Fetching products for category ID:",
            currentCategoryData.id,
          );

          // Try multi-category assignments first
          const { data: assignments, error: assignmentError } = await supabase
            .from("product_category_assignments")
            .select(
              `
              product_id,
              products!inner(*)
            `,
            )
            .eq("category_id", currentCategoryData.id);

          console.log("Multi-category assignments:", {
            assignments,
            assignmentError,
          });

          if (assignments && assignments.length > 0) {
            // Use multi-category data
            productsData = assignments
              .map((a: any) => a.products)
              .filter((p: Product) => p && p.is_active);
            console.log(
              "Using multi-category data, found products:",
              productsData.length,
            );
          } else {
            // Fall back to legacy single category
            console.log("Falling back to legacy single category");
            const { data: legacyProducts, error: legacyError } = await supabase
              .from("products")
              .select("*")
              .eq("category_id", currentCategoryData.id)
              .eq("is_active", true);

            console.log("Legacy products:", { legacyProducts, legacyError });
            productsData = legacyProducts || [];
          }
        } else {
          console.log("Category not found for slug:", categorySlug);
        }
      } else {
        console.log("No category slug, fetching all products");
        // Fetch all products
        const { data: allProducts } = await supabase
          .from("products")
          .select("*")
          .eq("is_active", true);

        productsData = allProducts || [];
        setCurrentCategory(null);
        setSelectedCategories([]);
      }

      // Fetch categories with product counts
      const categoriesWithCounts = await getCategoriesWithProductCount();
      setCategories(categoriesWithCounts);
      setProducts(productsData);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      // Fallback to simple queries if utility functions fail
      try {
        const { data: allProducts } = await supabase
          .from("products")
          .select("*")
          .eq("is_active", true);

        const { data: categoriesData } = await supabase
          .from("product_categories")
          .select("*")
          .eq("is_active", true)
          .order("sort_order");

        setProducts(allProducts || []);
        setCategories(categoriesData || []);
      } catch (fallbackError) {
        console.error("Fallback query also failed:", fallbackError);
      }
    } finally {
      setIsLoading(false);
    }
  }

  function filterAndSortProducts() {
    let filtered = [...products];

    // Filter by categories - since we're using fetchProductsWithCategories when filtering by category slug,
    // we only need additional filtering when user selects multiple categories manually
    if (selectedCategories.length > 0 && !categorySlug) {
      // Only apply manual category filtering when not already on a category page
      filtered = filtered.filter((product) =>
        selectedCategories.includes(product.category_id),
      );
    } else if (selectedCategories.length > 1 && categorySlug) {
      // If on category page but user selected additional categories
      filtered = filtered.filter((product) =>
        selectedCategories.includes(product.category_id),
      );
    }

    // Filter by price range
    filtered = filtered.filter((product) => {
      const price = product.sale_price || product.price;
      return price >= priceRange[0] && price <= priceRange[1];
    });

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price_low":
          return (a.sale_price || a.price) - (b.sale_price || b.price);
        case "price_high":
          return (b.sale_price || b.price) - (a.sale_price || a.price);
        case "name":
        default:
          return a.name.localeCompare(b.name);
      }
    });

    setFilteredProducts(filtered);
  }

  function handleAddToCart(product: Product) {
    addItem({
      product_id: product.id,
      product,
    });
  }

  if (isLoading) {
    return (
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="aspect-square bg-muted rounded-lg animate-pulse"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-8">
        {/* Breadcrumb */}
        {currentCategory && (
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
            <Link to="/" className="hover:text-primary">
              Home
            </Link>
            <span>/</span>
            <Link to="/products" className="hover:text-primary">
              Products
            </Link>
            <span>/</span>
            <span className="text-foreground">{currentCategory.name}</span>
          </nav>
        )}

        <h1 className="text-3xl font-bold mb-2">
          {currentCategory ? currentCategory.name : "All Products"}
        </h1>
        <p className="text-muted-foreground">
          {currentCategory
            ? currentCategory.description ||
              `Discover our beautiful collection of ${currentCategory.name.toLowerCase()}`
            : "Discover our beautiful collection of fresh flowers"}
        </p>

        {/* Category info and product count */}
        <div className="mt-4">
          {currentCategory && (
            <div className="mb-3 p-3 bg-muted/50 rounded-lg border">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-medium text-sm text-foreground mb-1">
                    Category Information
                  </h3>
                  {currentCategory.parent_id && (
                    <p className="text-xs text-muted-foreground mb-1">
                      Subcategory of:{" "}
                      {categories.find(
                        (c) => c.id === currentCategory.parent_id,
                      )?.name || "Unknown"}
                    </p>
                  )}
                  {currentCategory.description && (
                    <p className="text-xs text-muted-foreground">
                      {currentCategory.description}
                    </p>
                  )}
                </div>
                <Badge variant="outline" className="text-xs">
                  {filteredProducts.length}{" "}
                  {filteredProducts.length === 1 ? "product" : "products"}
                </Badge>
              </div>
            </div>
          )}

          <p className="text-sm text-muted-foreground">
            {!currentCategory &&
              `${filteredProducts.length} ${filteredProducts.length === 1 ? "product" : "products"} available`}
          </p>
        </div>
      </div>

      {/* Unified Horizontal Filter Bar */}
      <div className="bg-white border rounded-lg p-4 mb-6 shadow-sm border-border/50">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Filter Title */}
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground flex-shrink-0 h-9">
            <Filter className="w-4 h-4" />
            <span>Filters:</span>
          </div>

          {/* Main Filter Bar Container */}
          <div className="flex flex-col sm:flex-row gap-4 sm:justify-between sm:items-center flex-1">
            {/* Left Group: Filter Controls */}
            <div className="flex flex-wrap items-center gap-4">
              {/* Categories Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-9 gap-2 w-fit max-w-[180px] min-w-[110px] flex-shrink-0 px-3"
                  >
                    <span className="truncate">Categories</span>
                    {selectedCategories.length > 0 && (
                      <Badge
                        variant="secondary"
                        className="ml-1 h-4 min-w-[16px] px-1.5 text-xs"
                      >
                        {selectedCategories.length}
                      </Badge>
                    )}
                    <ChevronDown className="w-4 h-4 flex-shrink-0" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="start">
                  <DropdownMenuLabel>Select Categories</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {categories.map((category) => (
                    <DropdownMenuCheckboxItem
                      key={category.id}
                      checked={selectedCategories.includes(category.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedCategories([
                            ...selectedCategories,
                            category.id,
                          ]);
                        } else {
                          setSelectedCategories(
                            selectedCategories.filter(
                              (id) => id !== category.id,
                            ),
                          );
                        }
                      }}
                    >
                      <div className="flex justify-between items-center w-full">
                        <span>{category.name}</span>
                        {(category as any).product_count !== undefined && (
                          <Badge variant="outline" className="text-xs ml-2">
                            {(category as any).product_count}
                          </Badge>
                        )}
                      </div>
                    </DropdownMenuCheckboxItem>
                  ))}
                  {selectedCategories.length > 0 && (
                    <>
                      <DropdownMenuSeparator />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full h-8 text-xs"
                        onClick={() => {
                          if (categorySlug && currentCategory) {
                            // If on category page, reset to just the current category
                            setSelectedCategories([currentCategory.id]);
                          } else {
                            // If on all products page, clear all selections
                            setSelectedCategories([]);
                          }
                        }}
                      >
                        {categorySlug
                          ? "Reset to Current Category"
                          : "Clear All"}
                      </Button>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Price Range Popover */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-9 gap-2 w-fit max-w-[200px] min-w-[130px] flex-shrink-0 px-3"
                  >
                    <span className="truncate">Price Range</span>
                    {(priceRange[0] > 0 || priceRange[1] < 5000) && (
                      <Badge
                        variant="secondary"
                        className="ml-1 h-4 px-1.5 text-xs"
                      >
                        ₹{priceRange[0]}-₹{priceRange[1]}
                      </Badge>
                    )}
                    <ChevronDown className="w-4 h-4 flex-shrink-0" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80" align="start">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">Price Range</Label>
                      <div className="mt-4 px-3 py-2">
                        <Slider
                          value={priceRange}
                          onValueChange={setPriceRange}
                          max={5000}
                          min={0}
                          step={100}
                          className="w-full"
                        />
                      </div>
                      <div className="flex justify-between text-sm text-muted-foreground mt-3 px-1">
                        <span className="font-medium">
                          ₹{priceRange[0].toLocaleString()}
                        </span>
                        <span className="text-xs text-muted-foreground/70">
                          to
                        </span>
                        <span className="font-medium">
                          ₹{priceRange[1].toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 h-8"
                        onClick={() => setPriceRange([0, 5000])}
                      >
                        Reset
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              {/* Sort By Dropdown */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="h-9 w-fit max-w-[220px] min-w-[120px] gap-2 flex-shrink-0 px-3">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Sort by Name</SelectItem>
                  <SelectItem value="price_low">Price: Low to High</SelectItem>
                  <SelectItem value="price_high">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>

              {/* Clear All Filters Button */}
              {(selectedCategories.length > 0 ||
                priceRange[0] > 0 ||
                priceRange[1] < 5000) && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 px-3 text-xs flex-shrink-0 w-fit"
                  onClick={() => {
                    if (categorySlug && currentCategory) {
                      // If on category page, reset to just the current category
                      setSelectedCategories([currentCategory.id]);
                    } else {
                      // If on all products page, clear all selections
                      setSelectedCategories([]);
                    }
                    setPriceRange([0, 5000]);
                  }}
                >
                  <X className="w-3 h-3 mr-1" />
                  {categorySlug ? "Reset Filters" : "Clear All"}
                </Button>
              )}
            </div>

            {/* Right Group: View Mode Toggle */}
            <div className="flex items-center justify-end ml-auto flex-shrink-0">
              <div className="flex items-center border rounded-md h-9">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-r-none h-9 w-9 p-0 border-0"
                  title="Grid View"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-l-none h-9 w-9 p-0 border-0"
                  title="List View"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Active Filter Tags (Mobile-friendly) */}
        {(selectedCategories.length > 0 ||
          priceRange[0] > 0 ||
          priceRange[1] < 5000) && (
          <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-border/50">
            <span className="text-xs text-muted-foreground font-medium">
              Active filters:
            </span>
            {selectedCategories.map((categoryId) => {
              const category = categories.find((c) => c.id === categoryId);
              return (
                <Badge
                  key={categoryId}
                  variant="secondary"
                  className="text-xs gap-1 h-6"
                >
                  {category?.name}
                  <button
                    onClick={() =>
                      setSelectedCategories(
                        selectedCategories.filter((id) => id !== categoryId),
                      )
                    }
                    className="hover:bg-muted-foreground/20 rounded-full p-0.5 ml-1"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              );
            })}
            {(priceRange[0] > 0 || priceRange[1] < 5000) && (
              <Badge variant="secondary" className="text-xs gap-1 h-6">
                ₹{priceRange[0]} - ₹{priceRange[1]}
                <button
                  onClick={() => setPriceRange([0, 5000])}
                  className="hover:bg-muted-foreground/20 rounded-full p-0.5 ml-1"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Products Section */}
      <div>
        {/* Product Count Display */}
        <div className="mb-6">
          <span className="text-sm text-muted-foreground">
            {filteredProducts.length} products found
          </span>
        </div>

        {/* Products Grid */}
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "space-y-4"
          }
        >
          {filteredProducts.map((product) => (
            <Card
              key={product.id}
              className={`border-0 shadow-lg overflow-hidden ${
                viewMode === "list" ? "flex" : ""
              }`}
            >
              <div
                className={`bg-gradient-to-br from-cream to-peach/30 flex items-center justify-center relative overflow-hidden ${
                  viewMode === "list" ? "w-48 flex-shrink-0" : "aspect-square"
                }`}
              >
                {product.images.length > 0 ? (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover image-hover"
                  />
                ) : (
                  <span className="text-6xl animate-pulse">🌺</span>
                )}
                {product.sale_price && (
                  <Badge className="absolute top-2 left-2 bg-destructive text-destructive-foreground">
                    SALE
                  </Badge>
                )}
              </div>

              <CardContent className="p-4 flex-1">
                <Link to={`/product/${product.slug}`}>
                  <h3 className="font-semibold mb-2 line-clamp-2">
                    {product.name}
                  </h3>
                </Link>

                {viewMode === "list" && product.short_description && (
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {product.short_description}
                  </p>
                )}

                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-primary">
                      ₹{product.sale_price || product.price}
                    </span>
                    {product.sale_price && (
                      <span className="text-sm text-muted-foreground line-through">
                        ₹{product.price}
                      </span>
                    )}
                  </div>
                </div>

                {/* Add to Cart Button - Always Visible */}
                <Button
                  onClick={() => handleAddToCart(product)}
                  size="sm"
                  className="w-full"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add to Cart
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🌸</div>
            <h3 className="text-xl font-semibold mb-2">No flowers found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your filters or search criteria
            </p>
            <Button
              onClick={() => {
                setSelectedCategories([]);
                setPriceRange([0, 5000]);
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
