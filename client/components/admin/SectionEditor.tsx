import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SingleImageUpload } from "@/components/ui/single-image-upload";
import { ImageUpload } from "@/components/ui/image-upload";
import { Plus, Trash2, Star } from "lucide-react";
import { Section } from "./SectionBuilder";
import { getSectionTemplate } from "@/lib/sectionLibrary";
import { supabase } from "@/lib/supabase";
import { Product, ProductCategory } from "@shared/database.types";

interface SectionEditorProps {
  section: Section;
  onSave: (updatedSection: Section) => void;
  onCancel: () => void;
}

export function SectionEditor({
  section,
  onSave,
  onCancel,
}: SectionEditorProps) {
  const [content, setContent] = useState(section.content);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const template = getSectionTemplate(section.type);

  useEffect(() => {
    // Fetch products and categories for certain section types
    if (["product_carousel", "category_grid"].includes(section.type)) {
      fetchProducts();
      fetchCategories();
    }
  }, [section.type]);

  async function fetchProducts() {
    try {
      const { data } = await supabase
        .from("products")
        .select("*")
        .eq("is_active", true)
        .limit(20);
      if (data) setProducts(data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  }

  async function fetchCategories() {
    try {
      const { data } = await supabase
        .from("product_categories")
        .select("*")
        .eq("is_active", true)
        .order("sort_order");
      if (data) setCategories(data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  }

  const handleSave = () => {
    onSave({
      ...section,
      content,
    });
  };

  const updateContent = (key: string, value: any) => {
    setContent((prev: any) => ({
      ...prev,
      [key]: value,
    }));
  };

  const updateNestedContent = (path: string[], value: any) => {
    setContent((prev: any) => {
      const newContent = { ...prev };
      let current = newContent;

      for (let i = 0; i < path.length - 1; i++) {
        if (!current[path[i]]) current[path[i]] = {};
        current = current[path[i]];
      }

      current[path[path.length - 1]] = value;
      return newContent;
    });
  };

  if (!template) {
    return (
      <div className="p-6">
        <p>Unknown section type: {section.type}</p>
        <Button onClick={onCancel}>Close</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <template.icon className="w-5 h-5" />
            Edit {template.name}
          </h2>
          <p className="text-muted-foreground">{template.description}</p>
        </div>
        <Badge variant="outline">{template.category}</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Content Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <SectionContentEditor
                sectionType={section.type}
                content={content}
                updateContent={updateContent}
                updateNestedContent={updateNestedContent}
                products={products}
                categories={categories}
              />
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Section Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="is_visible">Visible</Label>
                <Switch
                  id="is_visible"
                  checked={section.is_visible}
                  onCheckedChange={(checked) => {
                    // This will be handled by parent component
                  }}
                />
              </div>

              <div className="pt-4 border-t space-y-2">
                <Button onClick={handleSave} className="w-full">
                  Save Changes
                </Button>
                <Button onClick={onCancel} variant="outline" className="w-full">
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function SectionContentEditor({
  sectionType,
  content,
  updateContent,
  updateNestedContent,
  products,
  categories,
}: {
  sectionType: string;
  content: any;
  updateContent: (key: string, value: any) => void;
  updateNestedContent: (path: string[], value: any) => void;
  products: Product[];
  categories: ProductCategory[];
}) {
  switch (sectionType) {
    case "hero":
      return <HeroEditor content={content} updateContent={updateContent} />;

    case "hero_carousel":
      return (
        <HeroCarouselEditor content={content} updateContent={updateContent} />
      );

    case "text_block":
      return (
        <TextBlockEditor content={content} updateContent={updateContent} />
      );

    case "heading":
      return <HeadingEditor content={content} updateContent={updateContent} />;

    case "paragraph":
      return (
        <ParagraphEditor content={content} updateContent={updateContent} />
      );

    case "image":
      return <ImageEditor content={content} updateContent={updateContent} />;

    case "button":
      return <ButtonEditor content={content} updateContent={updateContent} />;

    case "list":
      return <ListEditor content={content} updateContent={updateContent} />;

    case "features":
      return (
        <FeaturesEditor
          content={content}
          updateContent={updateContent}
          updateNestedContent={updateNestedContent}
        />
      );

    case "product_carousel":
      return (
        <ProductCarouselEditor
          content={content}
          updateContent={updateContent}
          products={products}
          categories={categories}
        />
      );

    case "category_grid":
      return (
        <CategoryGridEditor
          content={content}
          updateContent={updateContent}
          categories={categories}
        />
      );

    case "testimonials":
      return (
        <TestimonialsEditor
          content={content}
          updateContent={updateContent}
          updateNestedContent={updateNestedContent}
        />
      );

    case "newsletter":
      return (
        <NewsletterEditor content={content} updateContent={updateContent} />
      );

    case "banner":
      return <BannerEditor content={content} updateContent={updateContent} />;

    default:
      return (
        <div className="text-muted-foreground">
          No editor available for {sectionType}
        </div>
      );
  }
}

// Individual section editors
function HeroEditor({
  content,
  updateContent,
}: {
  content: any;
  updateContent: (key: string, value: any) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={content.title || ""}
          onChange={(e) => updateContent("title", e.target.value)}
          placeholder="Welcome to Our Store"
        />
      </div>

      <div>
        <Label htmlFor="subtitle">Subtitle</Label>
        <Input
          id="subtitle"
          value={content.subtitle || ""}
          onChange={(e) => updateContent("subtitle", e.target.value)}
          placeholder="Your tagline here"
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={content.description || ""}
          onChange={(e) => updateContent("description", e.target.value)}
          placeholder="Detailed description..."
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="background_image">Background Image</Label>
        <SingleImageUpload
          imageUrl={content.background_image || ""}
          onImageChange={(url) => updateContent("background_image", url)}
          label="Hero Background"
        />
      </div>

      <div>
        <Label htmlFor="button_text">Button Text</Label>
        <Input
          id="button_text"
          value={content.button_text || ""}
          onChange={(e) => updateContent("button_text", e.target.value)}
          placeholder="Shop Now"
        />
      </div>

      <div>
        <Label htmlFor="button_link">Button Link</Label>
        <Input
          id="button_link"
          value={content.button_link || ""}
          onChange={(e) => updateContent("button_link", e.target.value)}
          placeholder="/products"
        />
      </div>
    </div>
  );
}

function HeroCarouselEditor({
  content,
  updateContent,
}: {
  content: any;
  updateContent: (key: string, value: any) => void;
}) {
  const slides = content.slides || [];

  const addSlide = () => {
    const newSlides = [...slides, { image: "", url: "", target: "_self" }];
    updateContent("slides", newSlides);
  };

  const updateSlide = (index: number, field: string, value: string) => {
    const newSlides = [...slides];
    newSlides[index] = { ...newSlides[index], [field]: value };
    updateContent("slides", newSlides);
  };

  const removeSlide = (index: number) => {
    const newSlides = slides.filter((_: any, i: number) => i !== index);
    updateContent("slides", newSlides);
  };

  const moveSlide = (index: number, direction: "up" | "down") => {
    const newSlides = [...slides];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex >= 0 && targetIndex < slides.length) {
      [newSlides[index], newSlides[targetIndex]] = [
        newSlides[targetIndex],
        newSlides[index],
      ];
      updateContent("slides", newSlides);
    }
  };

  return (
    <div className="space-y-6">
      {/* Slides Management */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <Label className="text-base font-semibold">Carousel Slides</Label>
          <Button onClick={addSlide} size="sm">
            <Plus className="w-4 h-4 mr-1" />
            Add Slide
          </Button>
        </div>

        {slides.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
            <p className="text-gray-500">
              No slides yet. Click "Add Slide" to get started.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {slides.map((slide: any, index: number) => (
              <Card key={index} className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <h4 className="text-sm font-medium">Slide {index + 1}</h4>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => moveSlide(index, "up")}
                      size="sm"
                      variant="outline"
                      disabled={index === 0}
                    >
                      ↑
                    </Button>
                    <Button
                      onClick={() => moveSlide(index, "down")}
                      size="sm"
                      variant="outline"
                      disabled={index === slides.length - 1}
                    >
                      ↓
                    </Button>
                    <Button
                      onClick={() => removeSlide(index)}
                      size="sm"
                      variant="outline"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <Label>Image</Label>
                    <SingleImageUpload
                      imageUrl={slide.image || ""}
                      onImageChange={(url) => updateSlide(index, "image", url)}
                      label={`Slide ${index + 1} Image`}
                    />
                  </div>

                  <div>
                    <Label htmlFor={`url-${index}`}>Link URL (optional)</Label>
                    <Input
                      id={`url-${index}`}
                      value={slide.url || ""}
                      onChange={(e) =>
                        updateSlide(index, "url", e.target.value)
                      }
                      placeholder="https://example.com or /page"
                    />
                  </div>

                  <div>
                    <Label htmlFor={`target-${index}`}>Link Target</Label>
                    <Select
                      value={slide.target || "_self"}
                      onValueChange={(value) =>
                        updateSlide(index, "target", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="_self">
                          Same window (_self)
                        </SelectItem>
                        <SelectItem value="_blank">
                          New window (_blank)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Carousel Settings */}
      <Card className="p-4">
        <h4 className="text-sm font-medium mb-4">Carousel Settings</h4>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <Label htmlFor="height">Height (px)</Label>
            <Input
              id="height"
              type="number"
              value={content.height || 500}
              onChange={(e) =>
                updateContent("height", parseInt(e.target.value))
              }
            />
          </div>

          <div>
            <Label htmlFor="autoplay_delay">Autoplay Delay (ms)</Label>
            <Input
              id="autoplay_delay"
              type="number"
              value={content.autoplay_delay || 5000}
              onChange={(e) =>
                updateContent("autoplay_delay", parseInt(e.target.value))
              }
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="autoplay">Autoplay</Label>
            <Switch
              id="autoplay"
              checked={content.autoplay || false}
              onCheckedChange={(checked) => updateContent("autoplay", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="show_navigation">Show Navigation</Label>
            <Switch
              id="show_navigation"
              checked={content.show_navigation || false}
              onCheckedChange={(checked) =>
                updateContent("show_navigation", checked)
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="show_dots">Show Dots</Label>
            <Switch
              id="show_dots"
              checked={content.show_dots || false}
              onCheckedChange={(checked) => updateContent("show_dots", checked)}
            />
          </div>
        </div>
      </Card>
    </div>
  );
}

function TextBlockEditor({
  content,
  updateContent,
}: {
  content: any;
  updateContent: (key: string, value: any) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="content">Content</Label>
        <Textarea
          id="content"
          value={content.content || ""}
          onChange={(e) => updateContent("content", e.target.value)}
          placeholder="Your content here..."
          rows={6}
        />
      </div>

      <div>
        <Label htmlFor="alignment">Alignment</Label>
        <Select
          value={content.alignment || "left"}
          onValueChange={(value) => updateContent("alignment", value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="left">Left</SelectItem>
            <SelectItem value="center">Center</SelectItem>
            <SelectItem value="right">Right</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

function HeadingEditor({
  content,
  updateContent,
}: {
  content: any;
  updateContent: (key: string, value: any) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="text">Heading Text</Label>
        <Input
          id="text"
          value={content.text || ""}
          onChange={(e) => updateContent("text", e.target.value)}
          placeholder="Heading text"
        />
      </div>

      <div>
        <Label htmlFor="level">Heading Level</Label>
        <Select
          value={content.level?.toString() || "1"}
          onValueChange={(value) => updateContent("level", parseInt(value))}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">H1</SelectItem>
            <SelectItem value="2">H2</SelectItem>
            <SelectItem value="3">H3</SelectItem>
            <SelectItem value="4">H4</SelectItem>
            <SelectItem value="5">H5</SelectItem>
            <SelectItem value="6">H6</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

function ParagraphEditor({
  content,
  updateContent,
}: {
  content: any;
  updateContent: (key: string, value: any) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="text">Paragraph Text</Label>
        <Textarea
          id="text"
          value={content.text || ""}
          onChange={(e) => updateContent("text", e.target.value)}
          placeholder="Your paragraph content..."
          rows={4}
        />
      </div>
    </div>
  );
}

function ImageEditor({
  content,
  updateContent,
}: {
  content: any;
  updateContent: (key: string, value: any) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <Label>Image</Label>
        <SingleImageUpload
          imageUrl={content.src || ""}
          onImageChange={(url) => updateContent("src", url)}
          label="Section Image"
        />
      </div>

      <div>
        <Label htmlFor="alt">Alt Text</Label>
        <Input
          id="alt"
          value={content.alt || ""}
          onChange={(e) => updateContent("alt", e.target.value)}
          placeholder="Image description"
        />
      </div>

      <div>
        <Label htmlFor="caption">Caption (optional)</Label>
        <Input
          id="caption"
          value={content.caption || ""}
          onChange={(e) => updateContent("caption", e.target.value)}
          placeholder="Image caption"
        />
      </div>
    </div>
  );
}

function ButtonEditor({
  content,
  updateContent,
}: {
  content: any;
  updateContent: (key: string, value: any) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="text">Button Text</Label>
        <Input
          id="text"
          value={content.text || ""}
          onChange={(e) => updateContent("text", e.target.value)}
          placeholder="Click Here"
        />
      </div>

      <div>
        <Label htmlFor="link">Link</Label>
        <Input
          id="link"
          value={content.link || ""}
          onChange={(e) => updateContent("link", e.target.value)}
          placeholder="/products"
        />
      </div>

      <div>
        <Label htmlFor="style">Style</Label>
        <Select
          value={content.style || "primary"}
          onValueChange={(value) => updateContent("style", value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="primary">Primary</SelectItem>
            <SelectItem value="secondary">Secondary</SelectItem>
            <SelectItem value="outline">Outline</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

function ListEditor({
  content,
  updateContent,
}: {
  content: any;
  updateContent: (key: string, value: any) => void;
}) {
  const [items, setItems] = useState(content.items || []);

  const addItem = () => {
    const newItems = [...items, "New item"];
    setItems(newItems);
    updateContent("items", newItems);
  };

  const updateItem = (index: number, value: string) => {
    const newItems = [...items];
    newItems[index] = value;
    setItems(newItems);
    updateContent("items", newItems);
  };

  const removeItem = (index: number) => {
    const newItems = items.filter((_: any, i: number) => i !== index);
    setItems(newItems);
    updateContent("items", newItems);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="type">List Type</Label>
        <Select
          value={content.type || "bulleted"}
          onValueChange={(value) => updateContent("type", value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="bulleted">Bulleted</SelectItem>
            <SelectItem value="numbered">Numbered</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <Label>List Items</Label>
          <Button onClick={addItem} size="sm">
            <Plus className="w-4 h-4 mr-1" />
            Add Item
          </Button>
        </div>

        <div className="space-y-2">
          {items.map((item: string, index: number) => (
            <div key={index} className="flex gap-2">
              <Input
                value={item}
                onChange={(e) => updateItem(index, e.target.value)}
                placeholder={`Item ${index + 1}`}
              />
              <Button
                onClick={() => removeItem(index)}
                size="sm"
                variant="outline"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FeaturesEditor({
  content,
  updateContent,
  updateNestedContent,
}: {
  content: any;
  updateContent: (key: string, value: any) => void;
  updateNestedContent: (path: string[], value: any) => void;
}) {
  const features = content.features || [];

  const addFeature = () => {
    const newFeatures = [
      ...features,
      {
        icon: "star",
        title: "New Feature",
        description: "Feature description",
      },
    ];
    updateContent("features", newFeatures);
  };

  const updateFeature = (index: number, key: string, value: string) => {
    updateNestedContent(["features", index, key], value);
  };

  const removeFeature = (index: number) => {
    const newFeatures = features.filter((_: any, i: number) => i !== index);
    updateContent("features", newFeatures);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="title">Section Title</Label>
        <Input
          id="title"
          value={content.title || ""}
          onChange={(e) => updateContent("title", e.target.value)}
          placeholder="Why Choose Us"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <Label>Features</Label>
          <Button onClick={addFeature} size="sm">
            <Plus className="w-4 h-4 mr-1" />
            Add Feature
          </Button>
        </div>

        <div className="space-y-4">
          {features.map((feature: any, index: number) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <h4 className="text-sm font-medium">Feature {index + 1}</h4>
                  <Button
                    onClick={() => removeFeature(index)}
                    size="sm"
                    variant="outline"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-3">
                  <div>
                    <Label>Icon</Label>
                    <Select
                      value={feature.icon || "star"}
                      onValueChange={(value) =>
                        updateFeature(index, "icon", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="star">Star</SelectItem>
                        <SelectItem value="heart">Heart</SelectItem>
                        <SelectItem value="shield">Shield</SelectItem>
                        <SelectItem value="truck">Truck</SelectItem>
                        <SelectItem value="zap">Zap</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Title</Label>
                    <Input
                      value={feature.title || ""}
                      onChange={(e) =>
                        updateFeature(index, "title", e.target.value)
                      }
                      placeholder="Feature title"
                    />
                  </div>

                  <div>
                    <Label>Description</Label>
                    <Textarea
                      value={feature.description || ""}
                      onChange={(e) =>
                        updateFeature(index, "description", e.target.value)
                      }
                      placeholder="Feature description"
                      rows={2}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProductCarouselEditor({
  content,
  updateContent,
  products,
  categories,
}: {
  content: any;
  updateContent: (key: string, value: any) => void;
  products: Product[];
  categories: ProductCategory[];
}) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="title">Section Title</Label>
        <Input
          id="title"
          value={content.title || ""}
          onChange={(e) => updateContent("title", e.target.value)}
          placeholder="Featured Products"
        />
      </div>

      <div>
        <Label htmlFor="product_filter">Product Filter</Label>
        <Select
          value={content.product_filter || "featured"}
          onValueChange={(value) => updateContent("product_filter", value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="featured">Featured Products</SelectItem>
            <SelectItem value="latest">Latest Products</SelectItem>
            <SelectItem value="popular">Popular Products</SelectItem>
            <SelectItem value="sale">Sale Products</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="show_count">Number of Products</Label>
        <Input
          id="show_count"
          type="number"
          value={content.show_count || 8}
          onChange={(e) =>
            updateContent("show_count", parseInt(e.target.value))
          }
          min="1"
          max="20"
        />
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="autoplay">Autoplay</Label>
        <Switch
          id="autoplay"
          checked={content.autoplay || false}
          onCheckedChange={(checked) => updateContent("autoplay", checked)}
        />
      </div>
    </div>
  );
}

function CategoryGridEditor({
  content,
  updateContent,
  categories,
}: {
  content: any;
  updateContent: (key: string, value: any) => void;
  categories: ProductCategory[];
}) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="show_count">Number of Categories</Label>
        <Input
          id="show_count"
          type="number"
          value={content.show_count || 8}
          onChange={(e) =>
            updateContent("show_count", parseInt(e.target.value))
          }
          min="1"
          max="20"
        />
      </div>

      <div>
        <Label htmlFor="columns">Columns</Label>
        <Select
          value={content.columns?.toString() || "4"}
          onValueChange={(value) => updateContent("columns", parseInt(value))}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2">2 Columns</SelectItem>
            <SelectItem value="3">3 Columns</SelectItem>
            <SelectItem value="4">4 Columns</SelectItem>
            <SelectItem value="6">6 Columns</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="show_product_count">Show Product Count</Label>
        <Switch
          id="show_product_count"
          checked={content.show_product_count || false}
          onCheckedChange={(checked) =>
            updateContent("show_product_count", checked)
          }
        />
      </div>
    </div>
  );
}

function TestimonialsEditor({
  content,
  updateContent,
  updateNestedContent,
}: {
  content: any;
  updateContent: (key: string, value: any) => void;
  updateNestedContent: (path: string[], value: any) => void;
}) {
  const testimonials = content.testimonials || [];

  const addTestimonial = () => {
    const newTestimonials = [
      ...testimonials,
      {
        name: "Customer Name",
        location: "City",
        rating: 5,
        review: "Great service!",
        image: "",
      },
    ];
    updateContent("testimonials", newTestimonials);
  };

  const updateTestimonial = (index: number, key: string, value: any) => {
    updateNestedContent(["testimonials", index, key], value);
  };

  const removeTestimonial = (index: number) => {
    const newTestimonials = testimonials.filter(
      (_: any, i: number) => i !== index,
    );
    updateContent("testimonials", newTestimonials);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="title">Section Title</Label>
        <Input
          id="title"
          value={content.title || ""}
          onChange={(e) => updateContent("title", e.target.value)}
          placeholder="What Our Customers Say"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <Label>Testimonials</Label>
          <Button onClick={addTestimonial} size="sm">
            <Plus className="w-4 h-4 mr-1" />
            Add Testimonial
          </Button>
        </div>

        <div className="space-y-4">
          {testimonials.map((testimonial: any, index: number) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <h4 className="text-sm font-medium">
                    Testimonial {index + 1}
                  </h4>
                  <Button
                    onClick={() => removeTestimonial(index)}
                    size="sm"
                    variant="outline"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-3">
                  <div>
                    <Label>Customer Name</Label>
                    <Input
                      value={testimonial.name || ""}
                      onChange={(e) =>
                        updateTestimonial(index, "name", e.target.value)
                      }
                      placeholder="Customer name"
                    />
                  </div>

                  <div>
                    <Label>Location</Label>
                    <Input
                      value={testimonial.location || ""}
                      onChange={(e) =>
                        updateTestimonial(index, "location", e.target.value)
                      }
                      placeholder="City, State"
                    />
                  </div>

                  <div>
                    <Label>Rating</Label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() =>
                            updateTestimonial(index, "rating", star)
                          }
                          className={`text-lg ${
                            star <= (testimonial.rating || 5)
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                        >
                          <Star className="w-4 h-4 fill-current" />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label>Review</Label>
                    <Textarea
                      value={testimonial.review || ""}
                      onChange={(e) =>
                        updateTestimonial(index, "review", e.target.value)
                      }
                      placeholder="Customer review"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label>Customer Photo (optional)</Label>
                    <SingleImageUpload
                      imageUrl={testimonial.image || ""}
                      onImageChange={(url) =>
                        updateTestimonial(index, "image", url)
                      }
                      label="Customer Photo"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

function NewsletterEditor({
  content,
  updateContent,
}: {
  content: any;
  updateContent: (key: string, value: any) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={content.title || ""}
          onChange={(e) => updateContent("title", e.target.value)}
          placeholder="Stay Updated"
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={content.description || ""}
          onChange={(e) => updateContent("description", e.target.value)}
          placeholder="Subscribe to get the latest offers"
          rows={2}
        />
      </div>

      <div>
        <Label htmlFor="placeholder">Input Placeholder</Label>
        <Input
          id="placeholder"
          value={content.placeholder || ""}
          onChange={(e) => updateContent("placeholder", e.target.value)}
          placeholder="Enter your email"
        />
      </div>

      <div>
        <Label htmlFor="button_text">Button Text</Label>
        <Input
          id="button_text"
          value={content.button_text || ""}
          onChange={(e) => updateContent("button_text", e.target.value)}
          placeholder="Subscribe"
        />
      </div>
    </div>
  );
}

function BannerEditor({
  content,
  updateContent,
}: {
  content: any;
  updateContent: (key: string, value: any) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="text">Banner Text</Label>
        <Input
          id="text"
          value={content.text || ""}
          onChange={(e) => updateContent("text", e.target.value)}
          placeholder="Special Offer!"
        />
      </div>

      <div>
        <Label htmlFor="subtext">Subtext (optional)</Label>
        <Input
          id="subtext"
          value={content.subtext || ""}
          onChange={(e) => updateContent("subtext", e.target.value)}
          placeholder="Limited time only"
        />
      </div>

      <div>
        <Label htmlFor="link">Link</Label>
        <Input
          id="link"
          value={content.link || ""}
          onChange={(e) => updateContent("link", e.target.value)}
          placeholder="/products"
        />
      </div>

      <div>
        <Label htmlFor="button_text">Button Text</Label>
        <Input
          id="button_text"
          value={content.button_text || ""}
          onChange={(e) => updateContent("button_text", e.target.value)}
          placeholder="Shop Now"
        />
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="show_button">Show Button</Label>
        <Switch
          id="show_button"
          checked={content.show_button || false}
          onCheckedChange={(checked) => updateContent("show_button", checked)}
        />
      </div>
    </div>
  );
}
