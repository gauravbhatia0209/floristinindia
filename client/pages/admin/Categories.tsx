import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  MoreHorizontal,
  FolderOpen,
  Tag,
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
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/lib/supabase";
import { ProductCategory } from "@shared/database.types";

export default function AdminCategories() {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    try {
      const { data } = await supabase
        .from("product_categories")
        .select("*")
        .order("sort_order");

      if (data) setCategories(data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const parentCategories = filteredCategories.filter((cat) => !cat.parent_id);
  const subCategories = filteredCategories.filter((cat) => cat.parent_id);

  function getParentName(parentId: string | null) {
    if (!parentId) return "Main Category";
    const parent = categories.find((cat) => cat.id === parentId);
    return parent?.name || "Unknown";
  }

  function getSubcategoriesCount(parentId: string) {
    return categories.filter((cat) => cat.parent_id === parentId).length;
  }

  async function toggleCategoryStatus(
    categoryId: string,
    currentStatus: boolean,
  ) {
    try {
      await supabase
        .from("product_categories")
        .update({ is_active: !currentStatus })
        .eq("id", categoryId);

      setCategories(
        categories.map((cat) =>
          cat.id === categoryId ? { ...cat, is_active: !currentStatus } : cat,
        ),
      );
    } catch (error) {
      console.error("Failed to update category status:", error);
    }
  }

  async function toggleMenuVisibility(
    categoryId: string,
    currentVisibility: boolean,
  ) {
    try {
      await supabase
        .from("product_categories")
        .update({ show_in_menu: !currentVisibility })
        .eq("id", categoryId);

      setCategories(
        categories.map((cat) =>
          cat.id === categoryId
            ? { ...cat, show_in_menu: !currentVisibility }
            : cat,
        ),
      );
    } catch (error) {
      console.error("Failed to update menu visibility:", error);
    }
  }

  async function deleteCategory(categoryId: string) {
    if (!confirm("Are you sure you want to delete this category?")) return;

    try {
      await supabase.from("product_categories").delete().eq("id", categoryId);
      setCategories(categories.filter((cat) => cat.id !== categoryId));
    } catch (error) {
      console.error("Failed to delete category:", error);
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Categories</h1>
          <p className="text-muted-foreground">
            Organize your flower catalog with categories and subcategories
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Categories
            </CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Main Categories
            </CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{parentCategories.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Subcategories</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{subCategories.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <div className="h-2 w-2 bg-green-500 rounded-full"></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {categories.filter((cat) => cat.is_active).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Categories Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Categories ({filteredCategories.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredCategories.length === 0 ? (
            <div className="text-center py-12">
              <FolderOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">
                No categories found
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery
                  ? "Try adjusting your search"
                  : "Get started by adding your first category"}
              </p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Category
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Show in Menu</TableHead>
                    <TableHead>Sort Order</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCategories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-cream to-peach/30 rounded-lg flex items-center justify-center">
                            {category.image_url ? (
                              <img
                                src={category.image_url}
                                alt={category.name}
                                className="w-full h-full object-cover rounded-lg"
                              />
                            ) : (
                              <span className="text-lg">
                                {category.parent_id ? "🏷️" : "📁"}
                              </span>
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{category.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {category.description || "No description"}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <span className="font-medium">
                            {getParentName(category.parent_id)}
                          </span>
                          {!category.parent_id && (
                            <div className="text-xs text-muted-foreground">
                              {getSubcategoriesCount(category.id)} subcategories
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={category.is_active}
                            onCheckedChange={() =>
                              toggleCategoryStatus(
                                category.id,
                                category.is_active,
                              )
                            }
                          />
                          <Badge
                            variant={
                              category.is_active ? "default" : "secondary"
                            }
                          >
                            {category.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={category.show_in_menu}
                          onCheckedChange={() =>
                            toggleMenuVisibility(
                              category.id,
                              category.show_in_menu,
                            )
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{category.sort_order}</Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" />
                              View Products
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => deleteCategory(category.id)}
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

      {/* Category Tree View */}
      <Card>
        <CardHeader>
          <CardTitle>Category Hierarchy</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {parentCategories.map((parent) => (
              <div key={parent.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <FolderOpen className="h-5 w-5 text-primary" />
                    <span className="font-semibold">{parent.name}</span>
                    <Badge variant={parent.is_active ? "default" : "secondary"}>
                      {parent.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {getSubcategoriesCount(parent.id)} subcategories
                  </span>
                </div>
                <div className="ml-6 space-y-2">
                  {categories
                    .filter((cat) => cat.parent_id === parent.id)
                    .map((sub) => (
                      <div
                        key={sub.id}
                        className="flex items-center justify-between p-2 bg-muted/50 rounded"
                      >
                        <div className="flex items-center gap-2">
                          <Tag className="h-4 w-4 text-muted-foreground" />
                          <span>{sub.name}</span>
                          <Badge
                            variant={sub.is_active ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {sub.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
