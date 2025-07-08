import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Eye, FileText, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/lib/supabase";
import { Page } from "@shared/database.types";

interface PageContent {
  type: "heading" | "paragraph" | "image" | "button" | "list" | "separator";
  content: any;
}

export default function Pages() {
  const [pages, setPages] = useState<Page[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingPage, setEditingPage] = useState<Page | null>(null);
  const [isAddingPage, setIsAddingPage] = useState(false);

  useEffect(() => {
    fetchPages();
  }, []);

  async function fetchPages() {
    try {
      const { data } = await supabase
        .from("pages")
        .select("*")
        .order("sort_order");

      if (data) {
        setPages(data);
      }
    } catch (error) {
      console.error("Failed to fetch pages:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function savePage(pageData: Partial<Page>) {
    try {
      if (editingPage) {
        await supabase.from("pages").update(pageData).eq("id", editingPage.id);
      } else {
        const maxOrder =
          pages.length > 0 ? Math.max(...pages.map((p) => p.sort_order)) : 0;
        await supabase
          .from("pages")
          .insert({ ...pageData, sort_order: maxOrder + 1 });
      }

      fetchPages();
      setEditingPage(null);
      setIsAddingPage(false);
    } catch (error) {
      console.error("Failed to save page:", error);
    }
  }

  async function deletePage(pageId: string) {
    if (!confirm("Are you sure you want to delete this page?")) return;

    try {
      await supabase.from("pages").delete().eq("id", pageId);
      fetchPages();
    } catch (error) {
      console.error("Failed to delete page:", error);
    }
  }

  async function togglePageStatus(pageId: string, isActive: boolean) {
    try {
      await supabase
        .from("pages")
        .update({ is_active: !isActive })
        .eq("id", pageId);
      fetchPages();
    } catch (error) {
      console.error("Failed to toggle page status:", error);
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
          <h1 className="text-2xl font-bold">Page Management</h1>
          <p className="text-muted-foreground">
            Create and manage dynamic pages for your website
          </p>
        </div>
        <Button onClick={() => setIsAddingPage(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Page
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Pages</p>
                <p className="text-2xl font-bold">{pages.length}</p>
              </div>
              <FileText className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Published</p>
                <p className="text-2xl font-bold">
                  {pages.filter((p) => p.is_active).length}
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
                <p className="text-sm text-muted-foreground">In Footer</p>
                <p className="text-2xl font-bold">
                  {pages.filter((p) => p.show_in_footer).length}
                </p>
              </div>
              <Settings className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Draft</p>
                <p className="text-2xl font-bold">
                  {pages.filter((p) => !p.is_active).length}
                </p>
              </div>
              <FileText className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pages List */}
      <Card>
        <CardHeader>
          <CardTitle>All Pages</CardTitle>
        </CardHeader>
        <CardContent>
          {pages.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No pages yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first page to get started
              </p>
              <Button onClick={() => setIsAddingPage(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Page
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {pages.map((page) => (
                <div key={page.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{page.title}</h3>
                        <Badge
                          variant={page.is_active ? "default" : "secondary"}
                        >
                          {page.is_active ? "Published" : "Draft"}
                        </Badge>
                        {page.show_in_footer && (
                          <Badge variant="outline">In Footer</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        /{page.slug}
                      </p>
                      {page.meta_description && (
                        <p className="text-sm text-muted-foreground">
                          {page.meta_description}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={page.is_active}
                        onCheckedChange={() =>
                          togglePageStatus(page.id, page.is_active)
                        }
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditingPage(page)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deletePage(page.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Page Dialog */}
      <Dialog
        open={isAddingPage || !!editingPage}
        onOpenChange={() => {
          setIsAddingPage(false);
          setEditingPage(null);
        }}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingPage ? "Edit Page" : "Create New Page"}
            </DialogTitle>
          </DialogHeader>
          <PageForm
            page={editingPage}
            onSave={savePage}
            onCancel={() => {
              setIsAddingPage(false);
              setEditingPage(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Page Form Component
function PageForm({
  page,
  onSave,
  onCancel,
}: {
  page: Page | null;
  onSave: (data: Partial<Page>) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    title: page?.title || "",
    slug: page?.slug || "",
    meta_title: page?.meta_title || "",
    meta_description: page?.meta_description || "",
    is_active: page?.is_active ?? true,
    show_in_footer: page?.show_in_footer ?? false,
    footer_column: page?.footer_column?.toString() || "1",
    content: page?.content || [
      {
        type: "heading",
        content: { level: 1, text: "Page Title" },
      },
      {
        type: "paragraph",
        content: { text: "Your page content goes here..." },
      },
    ],
  });

  // Auto-generate slug from title
  useEffect(() => {
    if (!page && formData.title) {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      setFormData((prev) => ({ ...prev, slug }));
    }
  }, [formData.title, page]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    onSave({
      title: formData.title,
      slug: formData.slug,
      meta_title: formData.meta_title || null,
      meta_description: formData.meta_description || null,
      is_active: formData.is_active,
      show_in_footer: formData.show_in_footer,
      footer_column: formData.show_in_footer
        ? parseInt(formData.footer_column)
        : null,
      content: formData.content,
    });
  }

  function addContentBlock(type: PageContent["type"]) {
    const newBlock: PageContent = {
      type,
      content: getDefaultContent(type),
    };

    setFormData((prev) => ({
      ...prev,
      content: [...prev.content, newBlock],
    }));
  }

  function updateContentBlock(index: number, content: any) {
    setFormData((prev) => ({
      ...prev,
      content: prev.content.map((block, i) =>
        i === index ? { ...block, content } : block,
      ),
    }));
  }

  function removeContentBlock(index: number) {
    setFormData((prev) => ({
      ...prev,
      content: prev.content.filter((_, i) => i !== index),
    }));
  }

  function getDefaultContent(type: PageContent["type"]) {
    switch (type) {
      case "heading":
        return { level: 2, text: "New Heading" };
      case "paragraph":
        return { text: "Your text content here..." };
      case "image":
        return { url: "", alt: "", caption: "" };
      case "button":
        return { text: "Click Here", url: "", style: "primary" };
      case "list":
        return { items: ["Item 1", "Item 2", "Item 3"], ordered: false };
      case "separator":
        return {};
      default:
        return {};
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs defaultValue="content" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Page Content</h3>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addContentBlock("heading")}
              >
                + Heading
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addContentBlock("paragraph")}
              >
                + Paragraph
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addContentBlock("button")}
              >
                + Button
              </Button>
            </div>
          </div>

          <div className="space-y-4 max-h-96 overflow-y-auto border rounded-lg p-4">
            {formData.content.map((block, index) => (
              <ContentBlockEditor
                key={index}
                block={block}
                index={index}
                onChange={(content) => updateContentBlock(index, content)}
                onRemove={() => removeContentBlock(index)}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Page Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="About Us"
                required
              />
            </div>
            <div>
              <Label htmlFor="slug">URL Slug</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) =>
                  setFormData({ ...formData, slug: e.target.value })
                }
                placeholder="about-us"
                required
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, is_active: checked })
                }
              />
              <Label htmlFor="is_active">Published</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="show_in_footer"
                checked={formData.show_in_footer}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, show_in_footer: checked })
                }
              />
              <Label htmlFor="show_in_footer">Show in Footer</Label>
            </div>

            {formData.show_in_footer && (
              <div>
                <Label htmlFor="footer_column">Footer Column</Label>
                <Select
                  value={formData.footer_column}
                  onValueChange={(value) =>
                    setFormData({ ...formData, footer_column: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Column 1</SelectItem>
                    <SelectItem value="2">Column 2</SelectItem>
                    <SelectItem value="3">Column 3</SelectItem>
                    <SelectItem value="4">Column 4</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="seo" className="space-y-4">
          <div>
            <Label htmlFor="meta_title">Meta Title</Label>
            <Input
              id="meta_title"
              value={formData.meta_title}
              onChange={(e) =>
                setFormData({ ...formData, meta_title: e.target.value })
              }
              placeholder="About Us - Florist in India"
            />
          </div>

          <div>
            <Label htmlFor="meta_description">Meta Description</Label>
            <Textarea
              id="meta_description"
              value={formData.meta_description}
              onChange={(e) =>
                setFormData({ ...formData, meta_description: e.target.value })
              }
              placeholder="Learn about our story and commitment to delivering fresh flowers..."
              rows={3}
            />
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{page ? "Update Page" : "Create Page"}</Button>
      </div>
    </form>
  );
}

// Content Block Editor Component
function ContentBlockEditor({
  block,
  index,
  onChange,
  onRemove,
}: {
  block: PageContent;
  index: number;
  onChange: (content: any) => void;
  onRemove: () => void;
}) {
  switch (block.type) {
    case "heading":
      return (
        <div className="border rounded-lg p-3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Heading</span>
            <Button variant="ghost" size="sm" onClick={onRemove}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex gap-2">
            <Select
              value={block.content.level?.toString() || "2"}
              onValueChange={(value) =>
                onChange({ ...block.content, level: parseInt(value) })
              }
            >
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">H1</SelectItem>
                <SelectItem value="2">H2</SelectItem>
                <SelectItem value="3">H3</SelectItem>
                <SelectItem value="4">H4</SelectItem>
              </SelectContent>
            </Select>
            <Input
              value={block.content.text || ""}
              onChange={(e) =>
                onChange({ ...block.content, text: e.target.value })
              }
              placeholder="Heading text"
              className="flex-1"
            />
          </div>
        </div>
      );

    case "paragraph":
      return (
        <div className="border rounded-lg p-3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Paragraph</span>
            <Button variant="ghost" size="sm" onClick={onRemove}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
          <Textarea
            value={block.content.text || ""}
            onChange={(e) =>
              onChange({ ...block.content, text: e.target.value })
            }
            placeholder="Paragraph content"
            rows={3}
          />
        </div>
      );

    case "button":
      return (
        <div className="border rounded-lg p-3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Button</span>
            <Button variant="ghost" size="sm" onClick={onRemove}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Input
              value={block.content.text || ""}
              onChange={(e) =>
                onChange({ ...block.content, text: e.target.value })
              }
              placeholder="Button text"
            />
            <Input
              value={block.content.url || ""}
              onChange={(e) =>
                onChange({ ...block.content, url: e.target.value })
              }
              placeholder="Button URL"
            />
          </div>
        </div>
      );

    default:
      return (
        <div className="border rounded-lg p-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">{block.type}</span>
            <Button variant="ghost" size="sm" onClick={onRemove}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      );
  }
}
