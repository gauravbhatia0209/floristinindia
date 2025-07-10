import React, { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  MoreHorizontal,
  FolderOpen,
  Tag,
  ChevronDown,
  ChevronRight,
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/lib/supabase";
import { ProductCategory } from "@shared/database.types";
import { SingleImageUpload } from "@/components/ui/single-image-upload";

interface CategoryRowProps {
  category: ProductCategory;
  isSubcategory?: boolean;
  onEdit: (category: ProductCategory) => void;
  onDelete: (categoryId: string) => void;
  onToggleStatus: (categoryId: string, currentStatus: boolean) => void;
  onToggleMenuVisibility: (
    categoryId: string,
    currentVisibility: boolean,
  ) => void;
  editingCategory: ProductCategory | null;
  formData: any;
  setFormData: any;
  onSave: () => void;
  onCancel: () => void;
  isSaving: boolean;
  handleNameChange: (name: string) => void;
  parentCategories: ProductCategory[];
}

function CategoryRow({
  category,
  isSubcategory = false,
  onEdit,
  onDelete,
  onToggleStatus,
  onToggleMenuVisibility,
  editingCategory,
  formData,
  setFormData,
  onSave,
  onCancel,
  isSaving,
  handleNameChange,
  parentCategories,
}: CategoryRowProps) {
  const isEditing = editingCategory?.id === category.id;

  return (
    <>
      <div
        className={`group border rounded-lg hover:shadow-sm transition-shadow ${isSubcategory ? "border-l-4 border-l-blue-200 bg-blue-50/30" : "bg-white"}`}
      >
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <div className="w-12 h-12 bg-gradient-to-br from-cream to-peach/30 rounded-lg flex items-center justify-center flex-shrink-0">
                {category.image_url ? (
                  <img
                    src={category.image_url}
                    alt={category.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <span className="text-lg">{isSubcategory ? "🏷️" : "📁"}</span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3
                    className={`${isSubcategory ? "text-base" : "text-lg font-semibold"} truncate`}
                  >
                    {category.name}
                  </h3>
                  {isSubcategory && (
                    <Badge
                      variant="outline"
                      className="text-xs bg-blue-50 text-blue-700 border-blue-200"
                    >
                      Subcategory
                    </Badge>
                  )}
                  <Badge
                    variant={category.is_active ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {category.is_active ? "Active" : "Inactive"}
                  </Badge>
                  {category.show_in_menu && (
                    <Badge variant="outline" className="text-xs">
                      In Menu
                    </Badge>
                  )}
                </div>

                <p className="text-sm text-muted-foreground mb-2">
                  {category.description || "No description"}
                </p>

                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>Sort: {category.sort_order}</span>
                  <span>Slug: {category.slug}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Switch
                checked={category.is_active}
                onCheckedChange={() =>
                  onToggleStatus(category.id, category.is_active)
                }
                size="sm"
              />
              <Switch
                checked={category.show_in_menu}
                onCheckedChange={() =>
                  onToggleMenuVisibility(category.id, category.show_in_menu)
                }
                size="sm"
              />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Eye className="h-4 w-4 mr-2" />
                    View Products
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onEdit(category)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-red-600"
                    onClick={() => onDelete(category.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      {/* Inline Edit Form */}
      {isEditing && (
        <div className="border-l-4 border-primary bg-primary/5 p-6 rounded-lg mt-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">
              Edit Category: {category.name}
            </h3>
            <Button variant="outline" size="sm" onClick={onCancel}>
              Cancel
            </Button>
          </div>

          <div className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h4 className="font-medium">Basic Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Category Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="e.g., Birthday Flowers"
                  />
                </div>
                <div>
                  <Label htmlFor="slug">URL Slug *</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData((prev: any) => ({
                        ...prev,
                        slug: e.target.value,
                      }))
                    }
                    placeholder="birthday-flowers"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev: any) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Beautiful flowers perfect for birthday celebrations..."
                  rows={3}
                />
              </div>

              <div>
                <SingleImageUpload
                  imageUrl={formData.image_url}
                  onImageChange={(imageUrl) =>
                    setFormData((prev: any) => ({
                      ...prev,
                      image_url: imageUrl,
                    }))
                  }
                  label="Category Image"
                />
              </div>
            </div>

            {/* Category Settings */}
            <div className="space-y-4">
              <h4 className="font-medium">Category Settings</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="parent_id">Parent Category</Label>
                  <Select
                    value={formData.parent_id}
                    onValueChange={(value) =>
                      setFormData((prev: any) => ({
                        ...prev,
                        parent_id: value,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select parent (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">
                        Main Category (No Parent)
                      </SelectItem>
                      {parentCategories
                        .filter((cat) => cat.id !== editingCategory?.id)
                        .map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="sort_order">Sort Order</Label>
                  <Input
                    id="sort_order"
                    type="number"
                    value={formData.sort_order}
                    onChange={(e) =>
                      setFormData((prev: any) => ({
                        ...prev,
                        sort_order: e.target.value,
                      }))
                    }
                    placeholder="1"
                  />
                </div>
              </div>

              <div className="flex flex-col space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="is_active">Active Status</Label>
                    <p className="text-sm text-muted-foreground">
                      Active categories are visible to customers
                    </p>
                  </div>
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) =>
                      setFormData((prev: any) => ({
                        ...prev,
                        is_active: checked,
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="show_in_menu">Show in Menu</Label>
                    <p className="text-sm text-muted-foreground">
                      Display this category in the navigation menu
                    </p>
                  </div>
                  <Switch
                    id="show_in_menu"
                    checked={formData.show_in_menu}
                    onCheckedChange={(checked) =>
                      setFormData((prev: any) => ({
                        ...prev,
                        show_in_menu: checked,
                      }))
                    }
                  />
                </div>
              </div>
            </div>

            {/* SEO Settings */}
            <div className="space-y-4">
              <h4 className="font-medium">SEO Settings</h4>
              <div>
                <Label htmlFor="meta_title">Meta Title</Label>
                <Input
                  id="meta_title"
                  value={formData.meta_title}
                  onChange={(e) =>
                    setFormData((prev: any) => ({
                      ...prev,
                      meta_title: e.target.value,
                    }))
                  }
                  placeholder="Birthday Flowers - Fresh Delivery | Florist in India"
                />
              </div>

              <div>
                <Label htmlFor="meta_description">Meta Description</Label>
                <Textarea
                  id="meta_description"
                  value={formData.meta_description}
                  onChange={(e) =>
                    setFormData((prev: any) => ({
                      ...prev,
                      meta_description: e.target.value,
                    }))
                  }
                  placeholder="Order beautiful birthday flowers with same-day delivery across India..."
                  rows={2}
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button onClick={onSave} disabled={isSaving}>
                {isSaving ? "Saving..." : "Update Category"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

interface MainCategoryAccordionProps {
  parent: ProductCategory;
  subcategories: ProductCategory[];
  onEditCategory: (category: ProductCategory) => void;
  onDeleteCategory: (categoryId: string) => void;
  onToggleStatus: (categoryId: string, currentStatus: boolean) => void;
  onToggleMenuVisibility: (
    categoryId: string,
    currentVisibility: boolean,
  ) => void;
  editingCategory: ProductCategory | null;
  formData: any;
  setFormData: any;
  onSave: () => void;
  onCancel: () => void;
  isSaving: boolean;
  handleNameChange: (name: string) => void;
  parentCategories: ProductCategory[];
}

function MainCategoryAccordion({
  parent,
  subcategories,
  onEditCategory,
  onDeleteCategory,
  onToggleStatus,
  onToggleMenuVisibility,
  editingCategory,
  formData,
  setFormData,
  onSave,
  onCancel,
  isSaving,
  handleNameChange,
  parentCategories,
}: MainCategoryAccordionProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="border rounded-lg bg-white">
      {/* Main Category */}
      <div className="bg-gradient-to-r from-slate-50 to-slate-100/50">
        <CategoryRow
          category={parent}
          onEdit={onEditCategory}
          onDelete={onDeleteCategory}
          onToggleStatus={onToggleStatus}
          onToggleMenuVisibility={onToggleMenuVisibility}
          editingCategory={editingCategory}
          formData={formData}
          setFormData={setFormData}
          onSave={onSave}
          onCancel={onCancel}
          isSaving={isSaving}
          handleNameChange={handleNameChange}
          parentCategories={parentCategories}
        />
      </div>

      {/* Subcategories Toggle */}
      {subcategories.length > 0 && (
        <>
          <div
            className="px-4 py-2 border-t bg-slate-50/50 cursor-pointer hover:bg-slate-100/50 transition-colors"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4 text-slate-500" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-slate-500" />
                )}
                <span className="text-sm font-medium text-slate-700">
                  Subcategories ({subcategories.length})
                </span>
              </div>
              <div className="flex items-center gap-1">
                {subcategories.map((sub) => (
                  <Badge
                    key={sub.id}
                    variant={sub.is_active ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {sub.name}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Subcategories List */}
          {isExpanded && (
            <div className="p-4 space-y-3 bg-blue-50/20">
              {subcategories.map((subcategory) => (
                <CategoryRow
                  key={subcategory.id}
                  category={subcategory}
                  isSubcategory={true}
                  onEdit={onEditCategory}
                  onDelete={onDeleteCategory}
                  onToggleStatus={onToggleStatus}
                  onToggleMenuVisibility={onToggleMenuVisibility}
                  editingCategory={editingCategory}
                  formData={formData}
                  setFormData={setFormData}
                  onSave={onSave}
                  onCancel={onCancel}
                  isSaving={isSaving}
                  handleNameChange={handleNameChange}
                  parentCategories={parentCategories}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function AdminCategories() {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingCategory, setEditingCategory] =
    useState<ProductCategory | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    parent_id: "",
    is_active: true,
    show_in_menu: true,
    sort_order: "",
    image_url: "",
    meta_title: "",
    meta_description: "",
  });

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
      // Check if category has subcategories
      const subcategoriesCount = categories.filter(
        (cat) => cat.parent_id === categoryId,
      ).length;
      if (subcategoriesCount > 0) {
        alert(
          `Cannot delete this category. It has ${subcategoriesCount} subcategories. Please delete or reassign the subcategories first.`,
        );
        return;
      }

      const { error } = await supabase
        .from("product_categories")
        .delete()
        .eq("id", categoryId);

      if (error) {
        console.error("Database delete error:", error);
        alert(
          `Failed to delete category: ${error.message || error.toString()}`,
        );
        return;
      }

      // Refresh the categories list from database to ensure consistency
      await fetchCategories();
      alert("Category deleted successfully!");
    } catch (error: any) {
      console.error("Failed to delete category:", error);
      const errorMessage =
        error?.message || error?.toString() || "Unknown error occurred";
      alert(`Failed to delete category: ${errorMessage}`);
    }
  }

  function startEditing(category?: ProductCategory) {
    if (category) {
      setEditingCategory(category);
      setIsCreating(false);
      setFormData({
        name: category.name,
        slug: category.slug,
        description: category.description || "",
        parent_id: category.parent_id || "none",
        is_active: category.is_active,
        show_in_menu: category.show_in_menu,
        sort_order: category.sort_order.toString(),
        image_url: category.image_url || "",
        meta_title: category.meta_title || "",
        meta_description: category.meta_description || "",
      });
    } else {
      setEditingCategory(null);
      setIsCreating(true);
      const nextSortOrder =
        categories.length > 0
          ? Math.max(...categories.map((c) => c.sort_order)) + 1
          : 1;
      setFormData({
        name: "",
        slug: "",
        description: "",
        parent_id: "none",
        is_active: true,
        show_in_menu: true,
        sort_order: nextSortOrder.toString(),
        image_url: "",
        meta_title: "",
        meta_description: "",
      });
    }
  }

  function cancelEditing() {
    setEditingCategory(null);
    setIsCreating(false);
    setFormData({
      name: "",
      slug: "",
      description: "",
      parent_id: "none",
      is_active: true,
      show_in_menu: true,
      sort_order: "",
      image_url: "",
      meta_title: "",
      meta_description: "",
    });
  }

  // Auto-generate slug from name
  function handleNameChange(name: string) {
    setFormData((prev) => ({
      ...prev,
      name,
      slug: name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, ""),
    }));
  }

  async function validateForm(): Promise<string | null> {
    if (!formData.name.trim()) {
      return "Category name is required";
    }

    if (!formData.slug.trim()) {
      return "Category slug is required";
    }

    try {
      // Check for duplicate names in database (excluding current category if editing)
      const { data: existingName, error: nameError } = await supabase
        .from("product_categories")
        .select("id, name")
        .ilike("name", formData.name.trim())
        .neq("id", editingCategory?.id || "")
        .limit(1);

      if (nameError) {
        console.error("Name validation error:", nameError);
        return "Unable to validate category name. Please try again.";
      }

      if (existingName && existingName.length > 0) {
        console.log("Found existing category with same name:", existingName[0]);
        return `A category with this name already exists (ID: ${existingName[0].id}). Please choose a different name.`;
      }

      // Check for duplicate slugs in database (excluding current category if editing)
      const { data: existingSlug } = await supabase
        .from("product_categories")
        .select("id, slug")
        .eq("slug", formData.slug.trim())
        .neq("id", editingCategory?.id || "")
        .limit(1);

      if (existingSlug && existingSlug.length > 0) {
        return "A category with this slug already exists. Try a different name or modify the slug manually.";
      }

      return null;
    } catch (error) {
      console.error("Validation error:", error);
      return "Unable to validate category data. Please try again.";
    }
  }

  async function saveCategory() {
    const validationError = await validateForm();
    if (validationError) {
      alert(validationError);
      return;
    }

    setIsSaving(true);
    try {
      const categoryData = {
        name: formData.name.trim(),
        slug: formData.slug.trim(),
        description: formData.description.trim() || null,
        parent_id: formData.parent_id === "none" ? null : formData.parent_id,
        is_active: formData.is_active,
        show_in_menu: formData.show_in_menu,
        sort_order: parseInt(formData.sort_order),
        image_url: formData.image_url.trim() || null,
        meta_title: formData.meta_title.trim() || null,
        meta_description: formData.meta_description.trim() || null,
      };

      if (editingCategory) {
        // Update existing category
        const { error } = await supabase
          .from("product_categories")
          .update(categoryData)
          .eq("id", editingCategory.id);

        if (error) throw error;

        alert("Category updated successfully!");
      } else {
        // Create new category
        const { error } = await supabase
          .from("product_categories")
          .insert(categoryData);

        if (error) throw error;

        alert("Category created successfully!");
      }

      fetchCategories();
      cancelEditing();
    } catch (error: any) {
      console.error("Failed to save category:", error);
      const errorMessage =
        error?.message ||
        error?.error?.message ||
        error?.toString() ||
        "Unknown error occurred";
      alert(`Failed to save category: ${errorMessage}`);
    } finally {
      setIsSaving(false);
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
        <Button onClick={() => startEditing()}>
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

      {/* Hierarchical Categories */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              Categories Hierarchy ({filteredCategories.length})
            </CardTitle>
            <div className="text-sm text-muted-foreground">
              {parentCategories.length} main categories, {subCategories.length}{" "}
              subcategories
            </div>
          </div>
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
              <Button onClick={() => startEditing()}>
                <Plus className="h-4 w-4 mr-2" />
                Add Category
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Main Categories */}
              {parentCategories.map((parent) => (
                <MainCategoryAccordion
                  key={parent.id}
                  parent={parent}
                  subcategories={categories.filter(
                    (cat) => cat.parent_id === parent.id,
                  )}
                  onEditCategory={startEditing}
                  onDeleteCategory={deleteCategory}
                  onToggleStatus={toggleCategoryStatus}
                  onToggleMenuVisibility={toggleMenuVisibility}
                  editingCategory={editingCategory}
                  formData={formData}
                  setFormData={setFormData}
                  onSave={saveCategory}
                  onCancel={cancelEditing}
                  isSaving={isSaving}
                  handleNameChange={handleNameChange}
                  parentCategories={parentCategories}
                />
              ))}

              {/* Orphaned Subcategories */}
              {subCategories.filter(
                (sub) => !parentCategories.find((p) => p.id === sub.parent_id),
              ).length > 0 && (
                <div className="border-2 border-dashed border-amber-200 rounded-lg p-4 bg-amber-50">
                  <div className="flex items-center gap-2 mb-3">
                    <FolderOpen className="h-5 w-5 text-amber-600" />
                    <span className="font-semibold text-amber-800">
                      Orphaned Subcategories
                    </span>
                    <Badge
                      variant="secondary"
                      className="bg-amber-100 text-amber-800"
                    >
                      Missing Parent
                    </Badge>
                  </div>
                  <div className="space-y-2 ml-6">
                    {subCategories
                      .filter(
                        (sub) =>
                          !parentCategories.find((p) => p.id === sub.parent_id),
                      )
                      .map((orphan) => (
                        <CategoryRow
                          key={orphan.id}
                          category={orphan}
                          isSubcategory={true}
                          onEdit={startEditing}
                          onDelete={deleteCategory}
                          onToggleStatus={toggleCategoryStatus}
                          onToggleMenuVisibility={toggleMenuVisibility}
                          editingCategory={editingCategory}
                          formData={formData}
                          setFormData={setFormData}
                          onSave={saveCategory}
                          onCancel={cancelEditing}
                          isSaving={isSaving}
                          handleNameChange={handleNameChange}
                          parentCategories={parentCategories}
                        />
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add New Category Form */}
      {isCreating && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Add New Category</span>
              <Button variant="outline" size="sm" onClick={cancelEditing}>
                Cancel
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Category Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="e.g., Birthday Flowers"
                  />
                </div>
                <div>
                  <Label htmlFor="slug">URL Slug *</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, slug: e.target.value }))
                    }
                    placeholder="birthday-flowers"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Beautiful flowers perfect for birthday celebrations..."
                  rows={3}
                />
              </div>

              <div>
                <SingleImageUpload
                  imageUrl={formData.image_url}
                  onImageChange={(imageUrl) =>
                    setFormData((prev) => ({
                      ...prev,
                      image_url: imageUrl,
                    }))
                  }
                  label="Category Image"
                />
              </div>
            </div>

            {/* Category Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Category Settings</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="parent_id">Parent Category</Label>
                  <Select
                    value={formData.parent_id}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, parent_id: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select parent (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">
                        Main Category (No Parent)
                      </SelectItem>
                      {parentCategories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="sort_order">Sort Order</Label>
                  <Input
                    id="sort_order"
                    type="number"
                    value={formData.sort_order}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        sort_order: e.target.value,
                      }))
                    }
                    placeholder="1"
                  />
                </div>
              </div>

              <div className="flex flex-col space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="is_active">Active Status</Label>
                    <p className="text-sm text-muted-foreground">
                      Active categories are visible to customers
                    </p>
                  </div>
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({ ...prev, is_active: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="show_in_menu">Show in Menu</Label>
                    <p className="text-sm text-muted-foreground">
                      Display this category in the navigation menu
                    </p>
                  </div>
                  <Switch
                    id="show_in_menu"
                    checked={formData.show_in_menu}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({
                        ...prev,
                        show_in_menu: checked,
                      }))
                    }
                  />
                </div>
              </div>
            </div>

            {/* SEO Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">SEO Settings</h3>

              <div>
                <Label htmlFor="meta_title">Meta Title</Label>
                <Input
                  id="meta_title"
                  value={formData.meta_title}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      meta_title: e.target.value,
                    }))
                  }
                  placeholder="Birthday Flowers - Fresh Delivery | Florist in India"
                />
              </div>

              <div>
                <Label htmlFor="meta_description">Meta Description</Label>
                <Textarea
                  id="meta_description"
                  value={formData.meta_description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      meta_description: e.target.value,
                    }))
                  }
                  placeholder="Order beautiful birthday flowers with same-day delivery across India..."
                  rows={2}
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={cancelEditing}>
                Cancel
              </Button>
              <Button onClick={saveCategory} disabled={isSaving}>
                {isSaving ? "Saving..." : "Create Category"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
