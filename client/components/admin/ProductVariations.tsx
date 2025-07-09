import { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  Edit,
  Save,
  X,
  GripVertical,
  Image as ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { SingleImageUpload } from "@/components/ui/single-image-upload";
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";
import { ProductVariant } from "@shared/database.types";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";

interface ProductVariationsProps {
  productId: string;
  basePrice: number;
  baseSalePrice?: number;
}

interface VariationGroup {
  type: string;
  variants: ProductVariant[];
}

interface VariationFormData {
  id?: string;
  variation_type: string;
  variation_value: string;
  price_override: string;
  sale_price_override: string;
  stock_quantity: string;
  image_url: string;
  weight: string;
  sku: string;
  is_active: boolean;
}

const COMMON_VARIATION_TYPES = [
  "Size",
  "Color",
  "Weight",
  "Style",
  "Material",
  "Packaging",
  "Occasion",
];

export function ProductVariations({
  productId,
  basePrice,
  baseSalePrice,
}: ProductVariationsProps) {
  const [variationGroups, setVariationGroups] = useState<VariationGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingVariation, setEditingVariation] =
    useState<ProductVariant | null>(null);
  const [isAddingVariation, setIsAddingVariation] = useState(false);
  const [selectedVariationType, setSelectedVariationType] = useState("");

  const [formData, setFormData] = useState<VariationFormData>({
    variation_type: "",
    variation_value: "",
    price_override: "",
    sale_price_override: "",
    stock_quantity: "0",
    image_url: "",
    weight: "",
    sku: "",
    is_active: true,
  });

  useEffect(() => {
    if (productId) {
      fetchVariations();
    }
  }, [productId]);

  async function fetchVariations() {
    try {
      setIsLoading(true);
      const { data: variants, error } = await supabase
        .from("product_variants")
        .select("*")
        .eq("product_id", productId)
        .order("display_order");

      if (error) throw error;

      // Group variants by type
      const groups: { [key: string]: ProductVariant[] } = {};
      variants?.forEach((variant) => {
        const type = variant.variation_type || "Default";
        if (!groups[type]) {
          groups[type] = [];
        }
        groups[type].push(variant);
      });

      const groupedVariations: VariationGroup[] = Object.entries(groups).map(
        ([type, variants]) => ({
          type,
          variants,
        }),
      );

      setVariationGroups(groupedVariations);
    } catch (error) {
      console.error("Error fetching variations:", error);
      toast({
        title: "Error",
        description: "Failed to load product variations.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDragEnd(result: DropResult) {
    if (!result.destination) return;

    const { source, destination } = result;
    const [, sourceGroupIndex, sourceItemIndex] = source.droppableId.split("-");
    const [, destGroupIndex, destItemIndex] =
      destination.droppableId.split("-");

    if (sourceGroupIndex === destGroupIndex) {
      // Reordering within the same group
      const groupIndex = parseInt(sourceGroupIndex);
      const newGroups = [...variationGroups];
      const [reorderedItem] = newGroups[groupIndex].variants.splice(
        parseInt(sourceItemIndex),
        1,
      );
      newGroups[groupIndex].variants.splice(
        parseInt(destItemIndex),
        0,
        reorderedItem,
      );

      // Update display_order
      newGroups[groupIndex].variants.forEach(async (variant, index) => {
        await supabase
          .from("product_variants")
          .update({ display_order: index })
          .eq("id", variant.id);
      });

      setVariationGroups(newGroups);
    }
  }

  async function saveVariation() {
    try {
      const variationData = {
        product_id: productId,
        variation_type: formData.variation_type,
        variation_value: formData.variation_value,
        name: `${formData.variation_type} - ${formData.variation_value}`,
        price: basePrice, // Keep original price field for compatibility
        sale_price: baseSalePrice,
        price_override: formData.price_override
          ? parseFloat(formData.price_override)
          : null,
        sale_price_override: formData.sale_price_override
          ? parseFloat(formData.sale_price_override)
          : null,
        stock_quantity: parseInt(formData.stock_quantity) || 0,
        image_url: formData.image_url || null,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        sku: formData.sku || null,
        is_active: formData.is_active,
        display_order: 0,
      };

      if (editingVariation) {
        const { error } = await supabase
          .from("product_variants")
          .update(variationData)
          .eq("id", editingVariation.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Variation updated successfully.",
        });
      } else {
        const { error } = await supabase
          .from("product_variants")
          .insert(variationData);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Variation created successfully.",
        });
      }

      resetForm();
      fetchVariations();
    } catch (error) {
      console.error("Error saving variation:", error);

      let errorMessage = "Failed to save variation.";

      if (error && typeof error === "object") {
        if ("message" in error && error.message) {
          errorMessage = error.message;
        } else if ("details" in error && error.details) {
          errorMessage = error.details;
        } else if ("hint" in error && error.hint) {
          errorMessage = error.hint;
        }
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }

  async function deleteVariation(id: string) {
    if (!confirm("Are you sure you want to delete this variation?")) return;

    try {
      const { error } = await supabase
        .from("product_variants")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Variation deleted successfully.",
      });

      fetchVariations();
    } catch (error) {
      console.error("Error deleting variation:", error);
      toast({
        title: "Error",
        description: "Failed to delete variation.",
        variant: "destructive",
      });
    }
  }

  function resetForm() {
    setFormData({
      variation_type: "",
      variation_value: "",
      price_override: "",
      sale_price_override: "",
      stock_quantity: "0",
      image_url: "",
      weight: "",
      sku: "",
      is_active: true,
    });
    setEditingVariation(null);
    setIsAddingVariation(false);
    setSelectedVariationType("");
  }

  function editVariation(variation: ProductVariant) {
    setFormData({
      id: variation.id,
      variation_type: variation.variation_type || "",
      variation_value: variation.variation_value || "",
      price_override: variation.price_override?.toString() || "",
      sale_price_override: variation.sale_price_override?.toString() || "",
      stock_quantity: variation.stock_quantity.toString(),
      image_url: variation.image_url || "",
      weight: variation.weight?.toString() || "",
      sku: variation.sku || "",
      is_active: variation.is_active,
    });
    setSelectedVariationType(variation.variation_type || "");
    setEditingVariation(variation);
  }

  function getEffectivePrice(variant: ProductVariant) {
    return variant.price_override || basePrice;
  }

  function getEffectiveSalePrice(variant: ProductVariant) {
    return variant.sale_price_override || baseSalePrice;
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Product Variations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Product Variations</CardTitle>
        <Button onClick={() => setIsAddingVariation(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Variation
        </Button>
      </CardHeader>
      <CardContent>
        {variationGroups.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">
              No variations created yet. Add variations like size, color, or
              weight to give customers more options.
            </p>
            <Button onClick={() => setIsAddingVariation(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add First Variation
            </Button>
          </div>
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="space-y-6">
              {variationGroups.map((group, groupIndex) => (
                <div key={group.type}>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    {group.type}
                    <Badge variant="outline">{group.variants.length}</Badge>
                  </h3>

                  <Droppable droppableId={`group-${groupIndex}-items`}>
                    {(provided) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="space-y-2"
                      >
                        {group.variants.map((variant, itemIndex) => (
                          <Draggable
                            key={variant.id}
                            draggableId={variant.id}
                            index={itemIndex}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                className={`border rounded-lg p-4 bg-white ${
                                  snapshot.isDragging
                                    ? "shadow-lg rotate-1"
                                    : "shadow-sm"
                                }`}
                              >
                                <div className="flex items-center gap-4">
                                  <div
                                    {...provided.dragHandleProps}
                                    className="cursor-grab active:cursor-grabbing"
                                  >
                                    <GripVertical className="w-4 h-4 text-muted-foreground" />
                                  </div>

                                  <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div>
                                      <p className="font-medium">
                                        {variant.variation_value}
                                      </p>
                                      <p className="text-sm text-muted-foreground">
                                        Stock: {variant.stock_quantity}
                                      </p>
                                    </div>

                                    <div>
                                      <p className="text-sm font-medium">
                                        ₹{getEffectivePrice(variant).toFixed(2)}
                                      </p>
                                      {getEffectiveSalePrice(variant) && (
                                        <p className="text-sm text-green-600">
                                          Sale: ₹
                                          {getEffectiveSalePrice(
                                            variant,
                                          )!.toFixed(2)}
                                        </p>
                                      )}
                                    </div>

                                    <div>
                                      {variant.image_url && (
                                        <img
                                          src={variant.image_url}
                                          alt={variant.variation_value || ""}
                                          className="w-12 h-12 object-cover rounded"
                                        />
                                      )}
                                    </div>

                                    <div>
                                      <Badge
                                        variant={
                                          variant.is_active
                                            ? "default"
                                            : "secondary"
                                        }
                                      >
                                        {variant.is_active
                                          ? "Active"
                                          : "Inactive"}
                                      </Badge>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-2">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => editVariation(variant)}
                                    >
                                      <Edit className="w-4 h-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() =>
                                        deleteVariation(variant.id)
                                      }
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
                </div>
              ))}
            </div>
          </DragDropContext>
        )}

        {/* Add/Edit Variation Dialog */}
        <Dialog
          open={isAddingVariation || !!editingVariation}
          onOpenChange={() => resetForm()}
        >
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingVariation ? "Edit Variation" : "Add New Variation"}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="variation_type">Variation Type *</Label>
                  <Select
                    value={formData.variation_type}
                    onValueChange={(value) => {
                      setFormData({ ...formData, variation_type: value });
                      setSelectedVariationType(value);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {COMMON_VARIATION_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="variation_value">Variation Value *</Label>
                  <Input
                    id="variation_value"
                    value={formData.variation_value}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        variation_value: e.target.value,
                      })
                    }
                    placeholder="e.g., Small, Large, Red, Blue"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price_override">
                    Price Override (₹)
                    <span className="text-sm text-muted-foreground ml-1">
                      (Leave empty to use base price: ₹{basePrice})
                    </span>
                  </Label>
                  <Input
                    id="price_override"
                    type="number"
                    value={formData.price_override}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        price_override: e.target.value,
                      })
                    }
                    placeholder={basePrice.toString()}
                  />
                </div>

                <div>
                  <Label htmlFor="sale_price_override">
                    Sale Price Override (₹)
                    <span className="text-sm text-muted-foreground ml-1">
                      (Optional)
                    </span>
                  </Label>
                  <Input
                    id="sale_price_override"
                    type="number"
                    value={formData.sale_price_override}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        sale_price_override: e.target.value,
                      })
                    }
                    placeholder={baseSalePrice?.toString() || ""}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="stock_quantity">Stock Quantity *</Label>
                  <Input
                    id="stock_quantity"
                    type="number"
                    value={formData.stock_quantity}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        stock_quantity: e.target.value,
                      })
                    }
                    placeholder="0"
                  />
                </div>

                <div>
                  <Label htmlFor="sku">SKU</Label>
                  <Input
                    id="sku"
                    value={formData.sku}
                    onChange={(e) =>
                      setFormData({ ...formData, sku: e.target.value })
                    }
                    placeholder="PRODUCT-SIZE-COLOR"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.001"
                  value={formData.weight}
                  onChange={(e) =>
                    setFormData({ ...formData, weight: e.target.value })
                  }
                  placeholder="0.500"
                />
              </div>

              <div>
                <Label>Variation Image</Label>
                <p className="text-sm text-muted-foreground mb-2">
                  Upload an image specific to this variation. If no image is
                  uploaded, the main product image will be used.
                </p>
                <SingleImageUpload
                  currentImage={formData.image_url}
                  onImageChange={(url) =>
                    setFormData({ ...formData, image_url: url })
                  }
                  uploadPath="products/variations"
                />
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.is_active}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, is_active: checked })
                  }
                />
                <Label>Active (available for purchase)</Label>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button
                  onClick={saveVariation}
                  disabled={
                    !formData.variation_type || !formData.variation_value
                  }
                >
                  <Save className="w-4 h-4 mr-2" />
                  {editingVariation ? "Update Variation" : "Add Variation"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
