import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Plus,
  Edit,
  Trash2,
  Save,
  Eye,
  EyeOff,
  Link,
  Phone,
  Mail,
  MapPin,
  GripVertical,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { FooterSection } from "@shared/database.types";
import FooterConfig from "@/components/admin/FooterConfig";

interface FooterSectionForm {
  id?: string;
  title: string;
  content: any;
  column_position: number;
  is_active: boolean;
  sort_order: number;
}

export default function FooterEditor() {
  const [footerSections, setFooterSections] = useState<FooterSection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingSection, setEditingSection] =
    useState<FooterSectionForm | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // Dynamic column configuration - loaded from database
  const [MAX_COLUMNS, setMaxColumns] = useState(6); // Default, loaded from database
  const COMPANY_COLUMN = 1; // Reserved for company info
  const [AVAILABLE_COLUMNS, setAvailableColumns] = useState<number[]>([
    2, 3, 4, 5, 6,
  ]);

  useEffect(() => {
    loadFooterConfig();
    fetchFooterSections();
  }, []);

  async function loadFooterConfig() {
    try {
      const { data, error } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "footer_max_columns")
        .single();

      if (!error && data) {
        const maxCols = parseInt(data.value) || 6;
        setMaxColumns(maxCols);
        setAvailableColumns(
          Array.from({ length: maxCols - 1 }, (_, i) => i + 2),
        );
      }
    } catch (error) {
      console.log("Using default footer configuration");
    }
  }

  async function fetchFooterSections() {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("footer_sections")
        .select("*")
        .order("column_position", { ascending: true })
        .order("sort_order", { ascending: true });

      if (error) {
        console.error("Error fetching footer sections:", error);
      } else if (data) {
        // Fix any sections that are incorrectly in column 1
        await fixColumn1Sections(data);
        setFooterSections(data);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function fixColumn1Sections(sections: FooterSection[]) {
    const column1Sections = sections.filter(
      (s) => s.column_position === COMPANY_COLUMN,
    );

    if (column1Sections.length > 0) {
      console.log(
        `Found sections in reserved column ${COMPANY_COLUMN}, moving to column ${AVAILABLE_COLUMNS[0]}:`,
        column1Sections,
      );

      for (const section of column1Sections) {
        try {
          const { error } = await supabase
            .from("footer_sections")
            .update({ column_position: AVAILABLE_COLUMNS[0] }) // Move to first available column
            .eq("id", section.id);

          if (error) {
            console.error(
              `Error moving section from column ${COMPANY_COLUMN}:`,
              error,
            );
          } else {
            // Update local data
            section.column_position = AVAILABLE_COLUMNS[0];
          }
        } catch (error) {
          console.error("Error updating section:", error);
        }
      }
    }
  }

  function openEditDialog(section?: FooterSection) {
    if (section) {
      setEditingSection({
        id: section.id,
        title: section.title,
        content: section.content,
        column_position: section.column_position,
        is_active: section.is_active,
        sort_order: section.sort_order,
      });
    } else {
      setEditingSection({
        title: "",
        content: { type: "text", text: "" },
        column_position: 2,
        is_active: true,
        sort_order: footerSections.length + 1,
      });
    }
    setIsDialogOpen(true);
  }

  async function saveFooterSection() {
    if (!editingSection) return;

    try {
      setSaving(true);

      if (editingSection.id) {
        // Update existing section
        const { error } = await supabase
          .from("footer_sections")
          .update({
            title: editingSection.title,
            content: editingSection.content,
            column_position: editingSection.column_position,
            is_active: editingSection.is_active,
            sort_order: editingSection.sort_order,
          })
          .eq("id", editingSection.id);

        if (error) throw error;
      } else {
        // Create new section
        const { error } = await supabase.from("footer_sections").insert({
          title: editingSection.title,
          content: editingSection.content,
          column_position: editingSection.column_position,
          is_active: editingSection.is_active,
          sort_order: editingSection.sort_order,
        });

        if (error) throw error;
      }

      setIsDialogOpen(false);
      setEditingSection(null);
      fetchFooterSections();
    } catch (error) {
      console.error("Error saving footer section:", error);
      alert("Error saving footer section");
    } finally {
      setSaving(false);
    }
  }

  async function deleteFooterSection(id: string) {
    if (!confirm("Are you sure you want to delete this footer section?"))
      return;

    try {
      const { error } = await supabase
        .from("footer_sections")
        .delete()
        .eq("id", id);

      if (error) throw error;
      fetchFooterSections();
    } catch (error) {
      console.error("Error deleting footer section:", error);
      alert("Error deleting footer section");
    }
  }

  async function toggleSectionActive(id: string, isActive: boolean) {
    try {
      const { error } = await supabase
        .from("footer_sections")
        .update({ is_active: isActive })
        .eq("id", id);

      if (error) throw error;
      fetchFooterSections();
    } catch (error) {
      console.error("Error updating section status:", error);
    }
  }

  function renderContentEditor() {
    if (!editingSection) return null;

    const contentType = editingSection.content?.type || "text";

    return (
      <div className="space-y-4">
        <div>
          <Label htmlFor="content-type">Content Type</Label>
          <Select
            value={contentType}
            onValueChange={(value) =>
              setEditingSection({
                ...editingSection,
                content: {
                  type: value,
                  ...(value === "text" ? { text: "" } : {}),
                },
              })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="text">Simple Text</SelectItem>
              <SelectItem value="links">Links List</SelectItem>
              <SelectItem value="contact">Contact Information</SelectItem>
              <SelectItem value="category_links">Category Links</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {contentType === "text" && (
          <div>
            <Label htmlFor="content-text">Text Content</Label>
            <Textarea
              id="content-text"
              value={editingSection.content?.text || ""}
              onChange={(e) =>
                setEditingSection({
                  ...editingSection,
                  content: { ...editingSection.content, text: e.target.value },
                })
              }
              placeholder="Enter your text content..."
              rows={4}
            />
          </div>
        )}

        {contentType === "links" && (
          <div>
            <Label>Links</Label>
            <div className="space-y-2">
              {(editingSection.content?.links || []).map(
                (link: any, index: number) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder="Link text"
                      value={link.text || ""}
                      onChange={(e) => {
                        const links = [
                          ...(editingSection.content?.links || []),
                        ];
                        links[index] = {
                          ...links[index],
                          text: e.target.value,
                        };
                        setEditingSection({
                          ...editingSection,
                          content: { ...editingSection.content, links },
                        });
                      }}
                    />
                    <Input
                      placeholder="Link URL"
                      value={link.url || ""}
                      onChange={(e) => {
                        const links = [
                          ...(editingSection.content?.links || []),
                        ];
                        links[index] = { ...links[index], url: e.target.value };
                        setEditingSection({
                          ...editingSection,
                          content: { ...editingSection.content, links },
                        });
                      }}
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const links =
                          editingSection.content?.links?.filter(
                            (_: any, i: number) => i !== index,
                          ) || [];
                        setEditingSection({
                          ...editingSection,
                          content: { ...editingSection.content, links },
                        });
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ),
              )}
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  const links = [
                    ...(editingSection.content?.links || []),
                    { text: "", url: "" },
                  ];
                  setEditingSection({
                    ...editingSection,
                    content: { ...editingSection.content, links },
                  });
                }}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Link
              </Button>
            </div>
          </div>
        )}

        {contentType === "contact" && (
          <div className="space-y-3">
            <div>
              <Label>Phone Number</Label>
              <Input
                value={editingSection.content?.phone || ""}
                onChange={(e) =>
                  setEditingSection({
                    ...editingSection,
                    content: {
                      ...editingSection.content,
                      phone: e.target.value,
                    },
                  })
                }
                placeholder="+91 98765 43210"
              />
            </div>
            <div>
              <Label>Email Address</Label>
              <Input
                value={editingSection.content?.email || ""}
                onChange={(e) =>
                  setEditingSection({
                    ...editingSection,
                    content: {
                      ...editingSection.content,
                      email: e.target.value,
                    },
                  })
                }
                placeholder="contact@example.com"
              />
            </div>
            <div>
              <Label>Address</Label>
              <Input
                value={editingSection.content?.address || ""}
                onChange={(e) =>
                  setEditingSection({
                    ...editingSection,
                    content: {
                      ...editingSection.content,
                      address: e.target.value,
                    },
                  })
                }
                placeholder="Your business address"
              />
            </div>
          </div>
        )}

        {contentType === "category_links" && (
          <div>
            <Label>Show Count</Label>
            <Input
              type="number"
              value={
                editingSection.content?.show_count
                  ? editingSection.content.show_count.toString()
                  : "6"
              }
              onChange={(e) =>
                setEditingSection({
                  ...editingSection,
                  content: {
                    ...editingSection.content,
                    show_count: parseInt(e.target.value) || 6,
                  },
                })
              }
              placeholder="Number of categories to show"
            />
            <p className="text-sm text-muted-foreground mt-1">
              This will automatically display the most popular product
              categories
            </p>
          </div>
        )}
      </div>
    );
  }

  function getContentTypeIcon(type: string) {
    switch (type) {
      case "links":
        return <Link className="h-4 w-4" />;
      case "contact":
        return <Phone className="h-4 w-4" />;
      case "category_links":
        return <Link className="h-4 w-4" />;
      default:
        return <Edit className="h-4 w-4" />;
    }
  }

  function getContentPreview(content: any) {
    switch (content?.type) {
      case "links":
        return `${content.links?.length || 0} links`;
      case "contact":
        const parts = [];
        if (content.phone) parts.push("Phone");
        if (content.email) parts.push("Email");
        if (content.address) parts.push("Address");
        return parts.join(", ") || "No contact info";
      case "category_links":
        return `Show ${content.show_count || 6} categories`;
      case "text":
        return (
          content.text?.substring(0, 50) +
            (content.text?.length > 50 ? "..." : "") || "No text"
        );
      default:
        return "Unknown content type";
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded animate-pulse w-48"></div>
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-24 bg-gray-200 rounded animate-pulse"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Footer Editor</h1>
          <p className="text-muted-foreground">
            Manage footer sections and content. Changes are instantly reflected
            on the live site.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => openEditDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Section
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingSection?.id
                  ? "Edit Footer Section"
                  : "Add Footer Section"}
              </DialogTitle>
            </DialogHeader>

            {editingSection && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Section Title</Label>
                    <Input
                      id="title"
                      value={editingSection.title}
                      onChange={(e) =>
                        setEditingSection({
                          ...editingSection,
                          title: e.target.value,
                        })
                      }
                      placeholder="e.g., Quick Links, Contact Info"
                    />
                  </div>
                  <div>
                    <Label htmlFor="column">Column Position</Label>
                    <Select
                      value={editingSection.column_position.toString()}
                      onValueChange={(value) =>
                        setEditingSection({
                          ...editingSection,
                          column_position: parseInt(value),
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {AVAILABLE_COLUMNS.map((colNum) => (
                          <SelectItem key={colNum} value={colNum.toString()}>
                            Column {colNum}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="sort-order">Sort Order</Label>
                    <Input
                      id="sort-order"
                      type="number"
                      value={
                        editingSection.sort_order
                          ? editingSection.sort_order.toString()
                          : "1"
                      }
                      onChange={(e) =>
                        setEditingSection({
                          ...editingSection,
                          sort_order: parseInt(e.target.value) || 1,
                        })
                      }
                      placeholder="1, 2, 3..."
                    />
                  </div>
                  <div className="flex items-center space-x-2 pt-6">
                    <Switch
                      id="is-active"
                      checked={editingSection.is_active}
                      onCheckedChange={(checked) =>
                        setEditingSection({
                          ...editingSection,
                          is_active: checked,
                        })
                      }
                    />
                    <Label htmlFor="is-active">Active</Label>
                  </div>
                </div>

                {renderContentEditor()}

                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={saveFooterSection} disabled={saving}>
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? "Saving..." : "Save Section"}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {/* Footer Configuration */}
      <FooterConfig
        currentMaxColumns={MAX_COLUMNS}
        onConfigChange={(newMaxColumns) => {
          // Update local state if needed
          console.log("Footer config changed to:", newMaxColumns);
        }}
      />

      <div className="grid gap-4">
        {footerSections.map((section) => (
          <Card key={section.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                    {getContentTypeIcon(section.content?.type)}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{section.title}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        Column {section.column_position}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        Order {section.sort_order}
                      </Badge>
                      <Badge
                        variant={section.is_active ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {section.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() =>
                      toggleSectionActive(section.id, !section.is_active)
                    }
                  >
                    {section.is_active ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => openEditDialog(section)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-destructive"
                    onClick={() => deleteFooterSection(section.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {getContentPreview(section.content)}
              </p>
            </CardContent>
          </Card>
        ))}

        {footerSections.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <div className="text-muted-foreground">
                <Plus className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">
                  No footer sections yet
                </h3>
                <p className="mb-4">
                  Create your first footer section to get started.
                </p>
                <Button onClick={() => openEditDialog()}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Footer Section
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
