import { useState, useEffect } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import {
  Plus,
  GripVertical,
  Eye,
  EyeOff,
  Edit,
  Trash2,
  Save,
  Settings,
  Image,
  Type,
  Grid3x3,
  ShoppingCart,
  MessageSquare,
  Mail,
  Star,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/lib/supabase";
import {
  HomepageSection,
  Product,
  ProductCategory,
} from "@shared/database.types";
import { SingleImageUpload } from "@/components/ui/single-image-upload";

interface SectionTemplate {
  type: string;
  name: string;
  icon: any;
  description: string;
  defaultContent: any;
}

const sectionTemplates: SectionTemplate[] = [
  {
    type: "hero",
    name: "Hero Banner",
    icon: Image,
    description: "Large banner with title, subtitle, and call-to-action",
    defaultContent: {
      description:
        "Experience the joy of premium flower delivery across India. Same-day delivery available in 100+ cities.",
      background_image: "",
      button_text: "Shop Now",
      button_link: "/products",
      features: ["Same-day delivery", "100+ cities", "Fresh guarantee"],
    },
  },
  {
    type: "features",
    name: "Features Section",
    icon: Zap,
    description: "Highlight your key features and benefits",
    defaultContent: {
      features: [
        {
          icon: "truck",
          title: "Fast Delivery",
          description: "Quick and reliable delivery service",
        },
        {
          icon: "shield",
          title: "Quality Guarantee",
          description: "100% satisfaction guaranteed",
        },
        {
          icon: "heart",
          title: "24/7 Support",
          description: "Always here to help you",
        },
      ],
    },
  },
  {
    type: "category_grid",
    name: "Category Grid",
    icon: Grid3x3,
    description: "Display product categories in a grid layout",
    defaultContent: {
      show_count: 8,
      layout: "grid",
      show_product_count: true,
    },
  },
  {
    type: "product_carousel",
    name: "Product Showcase",
    icon: ShoppingCart,
    description: "Featured products carousel",
    defaultContent: {
      product_filter: "featured",
      show_count: 8,
      autoplay: true,
    },
  },
  {
    type: "testimonials",
    name: "Customer Reviews",
    icon: MessageSquare,
    description: "Show customer testimonials and reviews",
    defaultContent: {
      testimonials: [
        {
          name: "Customer Name",
          location: "City",
          rating: 5,
          review: "Great service and quality products!",
          image: "",
        },
      ],
    },
  },
  {
    type: "newsletter",
    name: "Newsletter Signup",
    icon: Mail,
    description: "Email subscription form",
    defaultContent: {
      background: "gradient-rose",
      placeholder: "Enter your email",
      button_text: "Subscribe",
    },
  },
  {
    type: "text_block",
    name: "Text Content",
    icon: Type,
    description: "Custom text content block",
    defaultContent: {
      text: "Your custom content here...",
      alignment: "center",
    },
  },
  {
    type: "banner",
    name: "Promotional Banner",
    icon: Star,
    description: "Special offers or announcements",
    defaultContent: {
      text: "Special Offer!",
      background_color: "primary",
      link: "/products",
    },
  },
];

export default function HomepageBuilder() {
  const [sections, setSections] = useState<HomepageSection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingSection, setEditingSection] = useState<HomepageSection | null>(
    null,
  );
  const [isAddingSection, setIsAddingSection] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    fetchSections();
  }, []);

  async function fetchSections() {
    try {
      const { data } = await supabase
        .from("homepage_sections")
        .select("*")
        .order("sort_order");

      if (data) {
        setSections(data);
      }
    } catch (error) {
      console.error("Failed to fetch sections:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDragEnd(result: DropResult) {
    if (!result.destination) return;

    const items = Array.from(sections);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update sort_order for all items
    const updatedItems = items.map((item, index) => ({
      ...item,
      sort_order: index,
    }));

    setSections(updatedItems);
    setHasChanges(true);

    // Update in database
    try {
      for (const item of updatedItems) {
        await supabase
          .from("homepage_sections")
          .update({ sort_order: item.sort_order })
          .eq("id", item.id);
      }
    } catch (error) {
      console.error("Failed to update section order:", error);
    }
  }

  async function toggleSectionVisibility(sectionId: string, isActive: boolean) {
    try {
      await supabase
        .from("homepage_sections")
        .update({ is_active: !isActive })
        .eq("id", sectionId);

      setSections(
        sections.map((section) =>
          section.id === sectionId
            ? { ...section, is_active: !isActive }
            : section,
        ),
      );
    } catch (error) {
      console.error("Failed to toggle section visibility:", error);
    }
  }

  async function deleteSection(sectionId: string) {
    if (!confirm("Are you sure you want to delete this section?")) return;

    try {
      await supabase.from("homepage_sections").delete().eq("id", sectionId);
      setSections(sections.filter((section) => section.id !== sectionId));
    } catch (error) {
      console.error("Failed to delete section:", error);
    }
  }

  async function addSection(template: SectionTemplate) {
    try {
      const newSection = {
        type: template.type,
        title: template.name,
        subtitle: "",
        content: template.defaultContent,
        settings: {},
        is_active: true,
        sort_order: sections.length,
      };

      const { data, error } = await supabase
        .from("homepage_sections")
        .insert(newSection)
        .select()
        .single();

      if (error) throw error;

      setSections([...sections, data]);
      setIsAddingSection(false);
    } catch (error) {
      console.error("Failed to add section:", error);
    }
  }

  async function updateSection(
    sectionId: string,
    updates: Partial<HomepageSection>,
  ) {
    try {
      await supabase
        .from("homepage_sections")
        .update(updates)
        .eq("id", sectionId);

      setSections(
        sections.map((section) =>
          section.id === sectionId ? { ...section, ...updates } : section,
        ),
      );
      setEditingSection(null);
    } catch (error) {
      console.error("Failed to update section:", error);
    }
  }

  function getSectionIcon(type: string) {
    const template = sectionTemplates.find((t) => t.type === type);
    return template?.icon || Type;
  }

  function getSectionName(type: string) {
    const template = sectionTemplates.find((t) => t.type === type);
    return template?.name || type;
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
          <h1 className="text-2xl font-bold">Homepage Builder</h1>
          <p className="text-muted-foreground">
            Drag and drop to reorder sections, edit content, and manage your
            homepage
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setIsAddingSection(true)}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Section
          </Button>
          <Button variant="outline" asChild>
            <a href="/" target="_blank" rel="noopener noreferrer">
              <Eye className="w-4 h-4 mr-2" />
              Preview Site
            </a>
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Sections</p>
                <p className="text-2xl font-bold">{sections.length}</p>
              </div>
              <Grid3x3 className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold">
                  {sections.filter((s) => s.is_active).length}
                </p>
              </div>
              <Eye className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Hidden</p>
                <p className="text-2xl font-bold">
                  {sections.filter((s) => !s.is_active).length}
                </p>
              </div>
              <EyeOff className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Last Updated</p>
                <p className="text-sm font-medium">Just now</p>
              </div>
              <Save className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sections List */}
      <Card>
        <CardHeader>
          <CardTitle>Homepage Sections</CardTitle>
        </CardHeader>
        <CardContent>
          {sections.length === 0 ? (
            <div className="text-center py-12">
              <Grid3x3 className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No sections yet</h3>
              <p className="text-muted-foreground mb-4">
                Add your first section to start building your homepage
              </p>
              <Button onClick={() => setIsAddingSection(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Section
              </Button>
            </div>
          ) : (
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="sections">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-4"
                  >
                    {sections.map((section, index) => {
                      const IconComponent = getSectionIcon(section.type);
                      return (
                        <Draggable
                          key={section.id}
                          draggableId={section.id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={`border rounded-lg p-4 bg-white ${
                                snapshot.isDragging
                                  ? "shadow-lg rotate-2"
                                  : "shadow-sm"
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div
                                    {...provided.dragHandleProps}
                                    className="cursor-grab active:cursor-grabbing"
                                  >
                                    <GripVertical className="w-5 h-5 text-muted-foreground" />
                                  </div>
                                  <div className="w-10 h-10 bg-gradient-rose rounded-lg flex items-center justify-center">
                                    <IconComponent className="w-5 h-5 text-white" />
                                  </div>
                                  <div>
                                    <h3 className="font-semibold">
                                      {section.title ||
                                        getSectionName(section.type)}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                      {section.subtitle ||
                                        `${section.type} section`}
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2">
                                  <Badge
                                    variant={
                                      section.is_active
                                        ? "default"
                                        : "secondary"
                                    }
                                  >
                                    {section.is_active ? "Active" : "Hidden"}
                                  </Badge>
                                  <Switch
                                    checked={section.is_active}
                                    onCheckedChange={() =>
                                      toggleSectionVisibility(
                                        section.id,
                                        section.is_active,
                                      )
                                    }
                                  />
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setEditingSection(section)}
                                  >
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => deleteSection(section.id)}
                                  >
                                    <Trash2 className="w-4 h-4 text-red-600" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      );
                    })}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          )}
        </CardContent>
      </Card>

      {/* Add Section Dialog */}
      <Dialog open={isAddingSection} onOpenChange={setIsAddingSection}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Add New Section</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {sectionTemplates.map((template) => (
              <Card
                key={template.type}
                className="cursor-pointer hover:bg-accent transition-colors"
                onClick={() => addSection(template)}
              >
                <CardContent className="p-4 text-center">
                  <template.icon className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <h3 className="font-semibold mb-1">{template.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {template.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Section Dialog */}
      <Dialog
        open={!!editingSection}
        onOpenChange={() => setEditingSection(null)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Edit {editingSection && getSectionName(editingSection.type)}
            </DialogTitle>
          </DialogHeader>
          {editingSection && (
            <EditSectionForm
              section={editingSection}
              onSave={(updates) => updateSection(editingSection.id, updates)}
              onCancel={() => setEditingSection(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Edit Section Form Component
function EditSectionForm({
  section,
  onSave,
  onCancel,
}: {
  section: HomepageSection;
  onSave: (updates: Partial<HomepageSection>) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    title: section.title || "",
    subtitle: section.subtitle || "",
    content: section.content,
  });

  const [availableProducts, setAvailableProducts] = useState<Product[]>([]);
  const [availableCategories, setAvailableCategories] = useState<
    ProductCategory[]
  >([]);
  const [isLoadingData, setIsLoadingData] = useState(false);

  useEffect(() => {
    if (
      section.type === "product_carousel" ||
      section.type === "category_grid"
    ) {
      fetchSelectableItems();
    }
  }, [section.type]);

  async function fetchSelectableItems() {
    setIsLoadingData(true);
    try {
      if (section.type === "product_carousel") {
        const { data: products } = await supabase
          .from("products")
          .select("id, name, slug, price, sale_price, images")
          .eq("is_active", true)
          .order("name");

        if (products) setAvailableProducts(products);
      }

      if (section.type === "category_grid") {
        const { data: categories } = await supabase
          .from("product_categories")
          .select("id, name, slug, image_url")
          .eq("is_active", true)
          .order("name");

        if (categories) setAvailableCategories(categories);
      }
    } catch (error) {
      console.error("Failed to fetch selectable items:", error);
    } finally {
      setIsLoadingData(false);
    }
  }

  function handleSave() {
    onSave(formData);
  }

  function toggleProductSelection(productId: string) {
    const content = formData.content as any;
    const currentSelection = content?.selected_products || [];
    const newSelection = currentSelection.includes(productId)
      ? currentSelection.filter((id: string) => id !== productId)
      : [...currentSelection, productId];

    setFormData({
      ...formData,
      content: { ...content, selected_products: newSelection },
    });
  }

  function toggleCategorySelection(categoryId: string) {
    const content = formData.content as any;
    const currentSelection = content?.selected_categories || [];
    const newSelection = currentSelection.includes(categoryId)
      ? currentSelection.filter((id: string) => id !== categoryId)
      : [...currentSelection, categoryId];

    setFormData({
      ...formData,
      content: { ...content, selected_categories: newSelection },
    });
  }

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Section title"
        />
      </div>

      <div>
        <Label htmlFor="subtitle">Subtitle</Label>
        <Input
          id="subtitle"
          value={formData.subtitle}
          onChange={(e) =>
            setFormData({ ...formData, subtitle: e.target.value })
          }
          placeholder="Section subtitle"
        />
      </div>

      {/* Hero Section Specific Fields */}
      {section.type === "hero" && (
        <div className="space-y-4">
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={(formData.content as any)?.description || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  content: { ...formData.content, description: e.target.value },
                })
              }
              placeholder="Hero section description text"
              rows={3}
            />
          </div>

          <div>
            <SingleImageUpload
              imageUrl={(formData.content as any)?.right_image_url || ""}
              onImageChange={(imageUrl) =>
                setFormData({
                  ...formData,
                  content: { ...formData.content, right_image_url: imageUrl },
                })
              }
              label="Right Side Image"
              acceptedTypes={[".png", ".webp", ".jpg", ".jpeg"]}
              maxSizeMB={3}
              subdir="hero"
            />
            <p className="text-sm text-muted-foreground mt-1">
              This image will be displayed on the right side of the hero section
              as a decorative element.
            </p>
          </div>
        </div>
      )}

      {/* Product Carousel Specific Fields */}
      {section.type === "product_carousel" && (
        <div className="space-y-4">
          <div>
            <Label>Display Count</Label>
            <Input
              type="number"
              min="1"
              max="20"
              value={(formData.content as any)?.show_count || 8}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  content: {
                    ...formData.content,
                    show_count: parseInt(e.target.value),
                  },
                })
              }
            />
          </div>

          <div>
            <Label>Select Products to Feature</Label>
            {isLoadingData ? (
              <div className="text-center py-4">Loading products...</div>
            ) : (
              <div className="max-h-60 overflow-y-auto border rounded-lg p-2 space-y-2">
                {availableProducts.map((product) => {
                  const isSelected =
                    (formData.content as any)?.selected_products?.includes(
                      product.id,
                    ) || false;
                  return (
                    <div
                      key={product.id}
                      className={`flex items-center gap-3 p-2 rounded border cursor-pointer hover:bg-gray-50 ${
                        isSelected ? "bg-blue-50 border-blue-300" : ""
                      }`}
                      onClick={() => toggleProductSelection(product.id)}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleProductSelection(product.id)}
                        className="rounded"
                      />
                      {product.images?.[0] && (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-10 h-10 object-cover rounded"
                        />
                      )}
                      <div className="flex-1">
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-gray-600">
                          ₹{product.sale_price || product.price}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            <p className="text-xs text-gray-600 mt-1">
              Selected:{" "}
              {(formData.content as any)?.selected_products?.length || 0}{" "}
              products
            </p>
          </div>
        </div>
      )}

      {/* Category Grid Specific Fields */}
      {section.type === "category_grid" && (
        <div className="space-y-4">
          <div>
            <Label>Display Count</Label>
            <Input
              type="number"
              min="1"
              max="20"
              value={(formData.content as any)?.show_count || 8}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  content: {
                    ...formData.content,
                    show_count: parseInt(e.target.value),
                  },
                })
              }
            />
          </div>

          <div>
            <Label>Select Categories to Feature</Label>
            {isLoadingData ? (
              <div className="text-center py-4">Loading categories...</div>
            ) : (
              <div className="max-h-60 overflow-y-auto border rounded-lg p-2 space-y-2">
                {availableCategories.map((category) => {
                  const isSelected =
                    (formData.content as any)?.selected_categories?.includes(
                      category.id,
                    ) || false;
                  return (
                    <div
                      key={category.id}
                      className={`flex items-center gap-3 p-2 rounded border cursor-pointer hover:bg-gray-50 ${
                        isSelected ? "bg-blue-50 border-blue-300" : ""
                      }`}
                      onClick={() => toggleCategorySelection(category.id)}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleCategorySelection(category.id)}
                        className="rounded"
                      />
                      {category.image_url && (
                        <img
                          src={category.image_url}
                          alt={category.name}
                          className="w-10 h-10 object-cover rounded"
                        />
                      )}
                      <div className="flex-1">
                        <div className="font-medium">{category.name}</div>
                        <div className="text-sm text-gray-600">
                          {category.slug}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            <p className="text-xs text-gray-600 mt-1">
              Selected:{" "}
              {(formData.content as any)?.selected_categories?.length || 0}{" "}
              categories
            </p>
          </div>
        </div>
      )}

      <div>
        <Label htmlFor="content">Content (JSON)</Label>
        <Textarea
          id="content"
          value={JSON.stringify(formData.content, null, 2)}
          onChange={(e) => {
            try {
              const parsed = JSON.parse(e.target.value);
              setFormData({ ...formData, content: parsed });
            } catch {
              // Invalid JSON, keep the text value
            }
          }}
          rows={8}
          className="font-mono text-sm"
        />
        <p className="text-xs text-muted-foreground mt-1">
          Advanced: Edit the JSON content directly
        </p>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSave}>Save Changes</Button>
      </div>
    </div>
  );
}
