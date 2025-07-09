import { useState, useEffect, useRef } from "react";
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
  Menu,
  Link as LinkIcon,
  MessageSquare,
  CheckCircle,
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
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";
import { ProductCategory } from "@shared/database.types";

interface MenuItem {
  id: string;
  name: string;
  category_id?: string;
  url?: string;
  is_active: boolean;
  sort_order: number;
  target: "_self" | "_blank";
  parent_id?: string;
  created_at: string;
  updated_at: string;
  product_categories?: ProductCategory;
}

interface HeaderBannerSettings {
  header_banner_text: string;
  header_banner_enabled: boolean;
}

export default function MenuBar() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [headerSettings, setHeaderSettings] = useState<HeaderBannerSettings>({
    header_banner_text: "🌸 Free Delivery on Orders Above ₹999 🌸",
    header_banner_enabled: true,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isEditingBanner, setIsEditingBanner] = useState(false);
  const [bannerText, setBannerText] = useState("");
  const [bannerEnabled, setBannerEnabled] = useState(true);
  const [editingMenuItem, setEditingMenuItem] = useState<MenuItem | null>(null);
  const [isAddingMenuItem, setIsAddingMenuItem] = useState(false);
  const currentFormData = useRef<any>({});

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setIsLoading(true);
      await Promise.all([
        fetchMenuItems(),
        fetchCategories(),
        fetchHeaderSettings(),
      ]);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      toast({
        title: "Error",
        description: "Failed to load menu data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchMenuItems() {
    const { data, error } = await supabase
      .from("menu_items")
      .select(
        `
        *,
        product_categories (*)
      `,
      )
      .is("parent_id", null)
      .order("sort_order");

    if (error) {
      console.error("Error fetching menu items:", error);
      return;
    }

    setMenuItems(data || []);
  }

  async function fetchCategories() {
    const { data, error } = await supabase
      .from("product_categories")
      .select("*")
      .eq("is_active", true)
      .order("name");

    if (error) {
      console.error("Error fetching categories:", error);
      return;
    }

    setCategories(data || []);
  }

  async function fetchHeaderSettings() {
    const { data, error } = await supabase
      .from("site_settings")
      .select("*")
      .in("key", ["header_banner_text", "header_banner_enabled"]);

    if (error) {
      console.error("Error fetching header settings:", error);
      return;
    }

    const settings: HeaderBannerSettings = {
      header_banner_text: "🌸 Free Delivery on Orders Above ₹999 🌸",
      header_banner_enabled: true,
    };

    data?.forEach((setting) => {
      if (setting.key === "header_banner_text") {
        settings.header_banner_text = setting.value;
      } else if (setting.key === "header_banner_enabled") {
        settings.header_banner_enabled = setting.value === "true";
      }
    });

    setHeaderSettings(settings);
    setBannerText(settings.header_banner_text);
    setBannerEnabled(settings.header_banner_enabled);
  }

  async function handleDragEnd(result: DropResult) {
    if (!result.destination) return;

    const items = Array.from(menuItems);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update sort_order
    const updatedItems = items.map((item, index) => ({
      ...item,
      sort_order: index + 1,
    }));

    setMenuItems(updatedItems);

    // Save to database
    try {
      const updates = updatedItems.map((item) => ({
        id: item.id,
        sort_order: item.sort_order,
      }));

      for (const update of updates) {
        await supabase
          .from("menu_items")
          .update({ sort_order: update.sort_order })
          .eq("id", update.id);
      }

      toast({
        title: "Success",
        description: "Menu items reordered successfully.",
      });
    } catch (error) {
      console.error("Error updating sort order:", error);
      toast({
        title: "Error",
        description: "Failed to reorder menu items.",
        variant: "destructive",
      });
      fetchMenuItems(); // Revert
    }
  }

  async function toggleMenuItemVisibility(id: string, currentState: boolean) {
    try {
      const { error } = await supabase
        .from("menu_items")
        .update({ is_active: !currentState })
        .eq("id", id);

      if (error) throw error;

      setMenuItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, is_active: !currentState } : item,
        ),
      );

      toast({
        title: "Success",
        description: `Menu item ${!currentState ? "activated" : "deactivated"}.`,
      });
    } catch (error) {
      console.error("Error updating menu item:", error);
      toast({
        title: "Error",
        description: "Failed to update menu item.",
        variant: "destructive",
      });
    }
  }

  async function deleteMenuItem(id: string) {
    if (!confirm("Are you sure you want to delete this menu item?")) return;

    try {
      const { error } = await supabase.from("menu_items").delete().eq("id", id);

      if (error) throw error;

      setMenuItems((prev) => prev.filter((item) => item.id !== id));
      toast({
        title: "Success",
        description: "Menu item deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting menu item:", error);
      toast({
        title: "Error",
        description: "Failed to delete menu item.",
        variant: "destructive",
      });
    }
  }

  async function saveHeaderBanner() {
    try {
      // Update or insert header banner text
      await supabase.from("site_settings").upsert({
        key: "header_banner_text",
        value: bannerText,
        type: "text",
        description: "Header banner text displayed in top bar",
      });

      // Update or insert header banner enabled status
      await supabase.from("site_settings").upsert({
        key: "header_banner_enabled",
        value: bannerEnabled.toString(),
        type: "boolean",
        description: "Whether header banner is displayed",
      });

      setHeaderSettings({
        header_banner_text: bannerText,
        header_banner_enabled: bannerEnabled,
      });

      setIsEditingBanner(false);
      toast({
        title: "Success",
        description: "Header banner updated successfully.",
      });
    } catch (error) {
      console.error("Error updating header banner:", error);
      toast({
        title: "Error",
        description: "Failed to update header banner.",
        variant: "destructive",
      });
    }
  }

  async function saveMenuItem(formData: any) {
    try {
      if (editingMenuItem) {
        // Update existing menu item
        const { error } = await supabase
          .from("menu_items")
          .update({
            name: formData.name,
            category_id: formData.category_id || null,
            url: formData.url || null,
            target: formData.target || "_self",
            is_active: formData.is_active,
          })
          .eq("id", editingMenuItem.id);

        if (error) throw error;
      } else {
        // Create new menu item
        const nextSortOrder =
          Math.max(...menuItems.map((item) => item.sort_order), 0) + 1;

        const { error } = await supabase.from("menu_items").insert({
          name: formData.name,
          category_id: formData.category_id || null,
          url: formData.url || null,
          target: formData.target || "_self",
          is_active: formData.is_active,
          sort_order: nextSortOrder,
        });

        if (error) throw error;
      }

      await fetchMenuItems();
      setEditingMenuItem(null);
      setIsAddingMenuItem(false);
      toast({
        title: "Success",
        description: `Menu item ${editingMenuItem ? "updated" : "created"} successfully.`,
      });
    } catch (error) {
      console.error("Error saving menu item:", error);
      toast({
        title: "Error",
        description: "Failed to save menu item.",
        variant: "destructive",
      });
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Menu Bar Management</h1>
        <p className="text-muted-foreground">
          Manage your website navigation menu and header banner text.
        </p>
      </div>

      {/* Header Banner Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Header Banner Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Current Banner Text:</p>
              <p className="text-sm text-muted-foreground">
                {headerSettings.header_banner_enabled
                  ? headerSettings.header_banner_text
                  : "Banner is currently disabled"}
              </p>
            </div>
            <Button variant="outline" onClick={() => setIsEditingBanner(true)}>
              <Edit className="w-4 h-4 mr-2" />
              Edit Banner
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Switch
              checked={headerSettings.header_banner_enabled}
              onCheckedChange={async (checked) => {
                setBannerEnabled(checked);
                setHeaderSettings((prev) => ({
                  ...prev,
                  header_banner_enabled: checked,
                }));

                try {
                  await supabase.from("site_settings").upsert({
                    key: "header_banner_enabled",
                    value: checked.toString(),
                    type: "boolean",
                    description: "Whether header banner is displayed",
                  });

                  toast({
                    title: "Success",
                    description: `Header banner ${checked ? "enabled" : "disabled"}.`,
                  });
                } catch (error) {
                  console.error("Error updating banner visibility:", error);
                  toast({
                    title: "Error",
                    description: "Failed to update banner visibility.",
                    variant: "destructive",
                  });
                }
              }}
            />
            <Label>Show header banner</Label>
          </div>
        </CardContent>
      </Card>

      {/* Menu Items */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Menu className="w-5 h-5" />
            Navigation Menu Items
          </CardTitle>
          <Button onClick={() => setIsAddingMenuItem(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Menu Item
          </Button>
        </CardHeader>
        <CardContent>
          {menuItems.length === 0 ? (
            <div className="text-center py-12">
              <Menu className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No menu items yet</h3>
              <p className="text-muted-foreground mb-4">
                Add your first menu item to start building your navigation
              </p>
              <Button onClick={() => setIsAddingMenuItem(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Menu Item
              </Button>
            </div>
          ) : (
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="menu-items">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-4"
                  >
                    {menuItems.map((item, index) => (
                      <Draggable
                        key={item.id}
                        draggableId={item.id}
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
                                  {item.category_id ? (
                                    <LinkIcon className="w-5 h-5 text-white" />
                                  ) : (
                                    <LinkIcon className="w-5 h-5 text-white" />
                                  )}
                                </div>
                                <div>
                                  <h3 className="font-semibold">{item.name}</h3>
                                  <p className="text-sm text-muted-foreground">
                                    {item.product_categories
                                      ? `Category: ${item.product_categories.name}`
                                      : item.url
                                        ? `Custom URL: ${item.url}`
                                        : "No link defined"}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <Badge
                                  variant={
                                    item.is_active ? "default" : "secondary"
                                  }
                                >
                                  {item.is_active ? "Active" : "Hidden"}
                                </Badge>
                                <Switch
                                  checked={item.is_active}
                                  onCheckedChange={() =>
                                    toggleMenuItemVisibility(
                                      item.id,
                                      item.is_active,
                                    )
                                  }
                                />
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => setEditingMenuItem(item)}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => deleteMenuItem(item.id)}
                                >
                                  <Trash2 className="w-4 h-4 text-red-600" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          )}
        </CardContent>
      </Card>

      {/* Edit Banner Dialog */}
      <Dialog open={isEditingBanner} onOpenChange={setIsEditingBanner}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Header Banner</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="banner-text">Banner Text</Label>
              <Textarea
                id="banner-text"
                value={bannerText}
                onChange={(e) => setBannerText(e.target.value)}
                placeholder="Enter your header banner text..."
                className="mt-1"
                rows={3}
              />
              <p className="text-sm text-muted-foreground mt-1">
                This text will appear in the top bar of your website. You can
                use emojis and special characters.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Switch
                checked={bannerEnabled}
                onCheckedChange={setBannerEnabled}
              />
              <Label>Enable banner display</Label>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditingBanner(false);
                  setBannerText(headerSettings.header_banner_text);
                  setBannerEnabled(headerSettings.header_banner_enabled);
                }}
              >
                Cancel
              </Button>
              <Button onClick={saveHeaderBanner}>
                <Save className="w-4 h-4 mr-2" />
                Save Banner
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add/Edit Menu Item Dialog */}
      <Dialog
        open={!!editingMenuItem || isAddingMenuItem}
        onOpenChange={() => {
          setEditingMenuItem(null);
          setIsAddingMenuItem(false);
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingMenuItem ? "Edit Menu Item" : "Add Menu Item"}
            </DialogTitle>
          </DialogHeader>
          <MenuItemForm
            menuItem={editingMenuItem}
            categories={categories}
            onSave={saveMenuItem}
            onCancel={() => {
              setEditingMenuItem(null);
              setIsAddingMenuItem(false);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function MenuItemForm({
  menuItem,
  categories,
  onSave,
  onCancel,
}: {
  menuItem: MenuItem | null;
  categories: ProductCategory[];
  onSave: (data: any) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    name: menuItem?.name || "",
    category_id: menuItem?.category_id || "",
    url: menuItem?.url || "",
    target: menuItem?.target || "_self",
    is_active: menuItem?.is_active ?? true,
    link_type: menuItem?.category_id ? "category" : "url",
  });

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="name">Menu Item Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g., Birthday Flowers"
          className="mt-1"
        />
      </div>

      <div>
        <Label>Link Type</Label>
        <Select
          value={formData.link_type}
          onValueChange={(value) =>
            setFormData({
              ...formData,
              link_type: value,
              category_id: value === "category" ? formData.category_id : "",
              url: value === "url" ? formData.url : "",
            })
          }
        >
          <SelectTrigger className="mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="category">Link to Category</SelectItem>
            <SelectItem value="url">Custom URL</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {formData.link_type === "category" && (
        <div>
          <Label>Category</Label>
          <Select
            value={formData.category_id}
            onValueChange={(value) =>
              setFormData({ ...formData, category_id: value })
            }
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {formData.link_type === "url" && (
        <div>
          <Label htmlFor="url">Custom URL</Label>
          <Input
            id="url"
            value={formData.url}
            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
            placeholder="e.g., /about or https://example.com"
            className="mt-1"
          />
        </div>
      )}

      <div>
        <Label>Link Target</Label>
        <Select
          value={formData.target}
          onValueChange={(value) =>
            setFormData({ ...formData, target: value as "_self" | "_blank" })
          }
        >
          <SelectTrigger className="mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="_self">Same Tab</SelectItem>
            <SelectItem value="_blank">New Tab</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <Switch
          checked={formData.is_active}
          onCheckedChange={(checked) =>
            setFormData({ ...formData, is_active: checked })
          }
        />
        <Label>Active (visible in navigation)</Label>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          onClick={() => onSave(formData)}
          disabled={
            !formData.name ||
            (formData.link_type === "category" && !formData.category_id) ||
            (formData.link_type === "url" && !formData.url)
          }
        >
          <Save className="w-4 h-4 mr-2" />
          Save Menu Item
        </Button>
      </div>
    </div>
  );
}
