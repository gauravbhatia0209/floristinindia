import { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  FileText,
  Settings,
  Layers,
} from "lucide-react";
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
import { SectionBuilder, Section } from "@/components/admin/SectionBuilder";
import { SectionEditor } from "@/components/admin/SectionEditor";
import { useClearMetaCacheOnSave } from "@/lib/meta-cache";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { SingleImageUpload } from "@/components/ui/single-image-upload";

interface PageContent {
  type: "heading" | "paragraph" | "image" | "button" | "list" | "separator";
  content: any;
}

export default function Pages() {
  const [pages, setPages] = useState<Page[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingPage, setEditingPage] = useState<Page | null>(null);
  const [isAddingPage, setIsAddingPage] = useState(false);
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const { clearPageCache, clearAllCache } = useClearMetaCacheOnSave();

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
      let oldSlug: string | null = null;

      if (editingPage) {
        oldSlug = editingPage.slug;
        await supabase.from("pages").update(pageData).eq("id", editingPage.id);
        fetchPages();
        setEditingPage(null);
        setIsAddingPage(false);
      } else {
        // Creating a new page
        const maxOrder =
          pages.length > 0 ? Math.max(...pages.map((p) => p.sort_order)) : 0;
        const { data, error } = await supabase
          .from("pages")
          .insert({ ...pageData, sort_order: maxOrder + 1 })
          .select()
          .single();

        if (error) {
          throw error;
        }

        // After successful creation, set the new page as editing page
        await fetchPages();
        if (data) {
          setEditingPage(data);
          setIsAddingPage(false);
          // Don't close the dialog, keep it open for immediate editing
        }
      }

      // Clear meta cache for updated/created page
      try {
        if (oldSlug && oldSlug !== pageData.slug) {
          // If slug changed, clear both old and new cache
          await clearPageCache(oldSlug);
        }
        if (pageData.slug) {
          await clearPageCache(pageData.slug);
        }
        // Clear all cache to refresh navigation if needed
        await clearAllCache();
      } catch (cacheError) {
        console.warn("Failed to clear meta cache:", cacheError);
      }
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

      {/* About Page Info */}
      {!pages.find((p) => p.slug === "about") && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <FileText className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-blue-800">About Page Setup</h3>
                <p className="text-sm text-blue-700 mt-1">
                  Create an "About" page with slug "about" to customize your
                  About Us page content. This will override the default About
                  page with your custom content.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

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
          setEditingSection(null); // Clear section editing when page dialog closes
        }}
      >
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
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
              setEditingSection(null);
            }}
            onSectionEdit={setEditingSection}
            editingSection={editingSection}
            onSectionSave={(updatedSection) => {
              // Update the section in the current page being edited
              if (editingPage) {
                const updatedSections = (
                  (editingPage.content as Section[]) || []
                ).map((section) =>
                  section.id === updatedSection.id ? updatedSection : section,
                );
                setEditingPage({
                  ...editingPage,
                  content: updatedSections,
                });
              }
              setEditingSection(null);
            }}
            onSectionCancel={() => setEditingSection(null)}
            onSectionsUpdate={(updatedSections) => {
              if (editingPage) {
                setEditingPage({
                  ...editingPage,
                  content: updatedSections,
                });
              }
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
  onSectionEdit,
  editingSection,
  onSectionSave,
  onSectionCancel,
  onSectionsUpdate,
}: {
  page: Page | null;
  onSave: (data: Partial<Page>) => void;
  onCancel: () => void;
  onSectionEdit: (section: Section) => void;
  editingSection: Section | null;
  onSectionSave: (section: Section) => void;
  onSectionCancel: () => void;
  onSectionsUpdate: (sections: Section[]) => void;
}) {
  const { settings } = useSiteSettings();
  const [formData, setFormData] = useState({
    title: page?.title || "",
    slug: page?.slug || "",
    meta_title: page?.meta_title || "",
    meta_description: page?.meta_description || "",
    og_image: (page as any)?.og_image || "",
    robots: (page as any)?.robots || "",
    is_active: page?.is_active ?? true,
    show_in_footer: page?.show_in_footer ?? false,
    footer_column: page?.footer_column?.toString() || "1",
    sections: (() => {
      if (!page?.content) {
        return [
          {
            id: "section_1",
            type: "heading",
            content: { level: 1, text: "Page Title" },
            is_visible: true,
            sort_order: 0,
          },
          {
            id: "section_2",
            type: "paragraph",
            content: { text: "Your page content goes here..." },
            is_visible: true,
            sort_order: 1,
          },
        ] as Section[];
      }

      // If content is already sections array, use it
      if (Array.isArray(page.content) && page.content[0]?.id) {
        return page.content as Section[];
      }

      // If content is legacy blocks array, convert to sections
      if (Array.isArray(page.content)) {
        return page.content.map((block: any, index: number) => ({
          id: `section_${index}`,
          type: block.type,
          content: block.content,
          is_visible: true,
          sort_order: index,
        })) as Section[];
      }

      // If content is a string (HTML), convert it to a single paragraph section
      if (typeof page.content === "string") {
        return [
          {
            id: "section_1",
            type: "paragraph",
            content: { text: page.content },
            is_visible: true,
            sort_order: 0,
          },
        ] as Section[];
      }

      // Fallback to default content
      return [
        {
          id: "section_1",
          type: "heading",
          content: { level: 1, text: page?.title || "Page Title" },
          is_visible: true,
          sort_order: 0,
        },
        {
          id: "section_2",
          type: "paragraph",
          content: { text: "Your page content goes here..." },
          is_visible: true,
          sort_order: 1,
        },
      ] as Section[];
    })(),
  });

  const [sections, setSections] = useState<Section[]>(formData.sections);

  // Custom function to update sections and sync with parent
  const updateSections = (newSections: Section[]) => {
    setSections(newSections);
    onSectionsUpdate(newSections);
  };

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
      og_image: formData.og_image || null,
      robots: formData.robots || null,
      is_active: formData.is_active,
      show_in_footer: formData.show_in_footer,
      footer_column: formData.show_in_footer
        ? parseInt(formData.footer_column)
        : null,
      content: sections, // Store sections directly instead of converting to HTML
    });
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
          {editingSection ? (
            // Inline Section Editor
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div>
                  <h3 className="font-semibold">Editing Section</h3>
                  <p className="text-sm text-muted-foreground">
                    Make your changes below and click save to apply them.
                  </p>
                </div>
                <Button variant="outline" onClick={onSectionCancel} size="sm">
                  Back to Sections
                </Button>
              </div>
              <SectionEditor
                section={editingSection}
                onSave={(updatedSection) => {
                  // Update the local sections state
                  const updatedSections = sections.map((section) =>
                    section.id === updatedSection.id ? updatedSection : section,
                  );
                  updateSections(updatedSections);
                  // Also call the parent callback
                  onSectionSave(updatedSection);
                }}
                onCancel={onSectionCancel}
              />
            </div>
          ) : (
            // Section Builder
            <SectionBuilder
              sections={sections}
              onSectionsChange={updateSections}
              pageType="pages"
              onSectionEdit={onSectionEdit}
            />
          )}
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
              placeholder={
                settings.defaultMetaTitle || "About Us - Florist in India"
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
                setFormData({ ...formData, meta_description: e.target.value })
              }
              placeholder={
                settings.defaultMetaDescription ||
                "Learn about our story and commitment to delivering fresh flowers..."
              }
              rows={3}
            />
            {!formData.meta_description && settings.defaultMetaDescription && (
              <p className="text-xs text-muted-foreground mt-1">
                Will use default:{" "}
                {settings.defaultMetaDescription.substring(0, 100)}...
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
              label="Page OG Image"
            />
            {!formData.og_image && settings.defaultOgImage && (
              <p className="text-xs text-muted-foreground mt-1">
                Will use default OG image from Site Settings
              </p>
            )}
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
