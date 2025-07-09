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
      console.log("Fetching variations for product:", productId);

      const { data: variants, error } = await supabase
        .from("product_variants")
        .select("*")
        .eq("product_id", productId)
        .order("sort_order");

      console.log("Query result - data:", variants, "error:", error);

      if (error) {
        console.error("Database error details:", error);
        throw error;
      }

      // Group variants by type (extract from name since we don't have separate type field)
      const groups: { [key: string]: ProductVariant[] } = {};
      variants?.forEach((variant) => {
        let type = "Variations";
        let value = variant.name;

        // Try to extract type from name pattern "Type - Value"
        if (variant.name && variant.name.includes(" - ")) {
          const parts = variant.name.split(" - ");
          if (parts.length >= 2) {
            type = parts[0].trim();
            value = parts[1].trim();
          }
        }

        if (!groups[type]) {
          groups[type] = [];
        }

        // Add the variant with extracted info for UI purposes
        const enhancedVariant = {
          ...variant,
          variation_type: type,
          variation_value: value,
        };

        groups[type].push(enhancedVariant);
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

      let errorMessage = "Failed to load product variations.";

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

      // Update sort_order
      newGroups[groupIndex].variants.forEach(async (variant, index) => {
        await supabase
          .from("product_variants")
          .update({ sort_order: index })
          .eq("id", variant.id);
      });

      setVariationGroups(newGroups);
    }
  }

  async function saveVariation() {
    try {
      // Validation
      if (!formData.variation_type || !formData.variation_value) {
        toast({
          title: "Validation Error",
          description: "Variation type and value are required.",
          variant: "destructive",
        });
        return;
      }

      if (
        !formData.price_override ||
        parseFloat(formData.price_override) <= 0
      ) {
        toast({
          title: "Validation Error",
          description: "Price is required and must be greater than 0.",
          variant: "destructive",
        });
        return;
      }

      // Create variation data for current schema
      const variationData = {
        product_id: productId,
        name: `${formData.variation_type} - ${formData.variation_value}`,
        price: formData.price_override
          ? parseFloat(formData.price_override)
          : basePrice,
        sale_price: formData.sale_price_override
          ? parseFloat(formData.sale_price_override)
          : baseSalePrice,
        stock_quantity: parseInt(formData.stock_quantity) || 0,
        sku: formData.sku || null,
        is_active: formData.is_active,
        sort_order: 0,
      };

      console.log("Saving variation data:", variationData);

      if (editingVariation) {
        const { error } = await supabase
          .from("product_variants")
          .update(variationData)
          .eq("id", editingVariation.id);

        if (error) {
          console.error("Update error details:", error);
          throw error;
        }

        toast({
          title: "Success",
          description: "Variation updated successfully.",
        });
      } else {
        const { error } = await supabase
          .from("product_variants")
          .insert(variationData);

        if (error) {
          console.error("Insert error details:", error);
          throw error;
        }

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

      let errorMessage = "Failed to delete variation.";

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
    // Extract variation info from name if not available in separate fields
    const nameParts = variation.name?.includes(" - ")
      ? variation.name.split(" - ")
      : ["", variation.name || ""];
    const varType = variation.variation_type || nameParts[0] || "Size";
    const varValue = variation.variation_value || nameParts[1] || "";

    setFormData({
      id: variation.id,
      variation_type: varType,
      variation_value: varValue,
      // Always show the actual database values
      price_override: variation.price.toString(),
      sale_price_override: variation.sale_price
        ? variation.sale_price.toString()
        : "",
      stock_quantity: variation.stock_quantity.toString(),
      image_url: "", // Not available in current schema
      weight: "", // Not available in current schema
      sku: variation.sku || "",
      is_active: variation.is_active,
    });
    setSelectedVariationType(varType);
    setEditingVariation(variation);
  }

  function getEffectivePrice(variant: ProductVariant) {
    return variant.price;
  }

  function getEffectiveSalePrice(variant: ProductVariant) {
    return variant.sale_price;
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
        <div>
          <CardTitle>Product Variations</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Manage variations from database table: product_variants
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={fetchVariations}
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Refresh"}
          </Button>
          <Button onClick={() => setIsAddingVariation(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Variation
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Database Field Info */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm font-medium text-blue-900 mb-2">
            Database Fields Used:
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs text-blue-800">
            <span>• name (VARCHAR)</span>
            <span>• price (DECIMAL)</span>
            <span>• sale_price (DECIMAL)</span>
            <span>• sku (VARCHAR)</span>
            <span>• stock_quantity (INTEGER)</span>
            <span>• is_active (BOOLEAN)</span>
          </div>
        </div>

        {variationGroups.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-2">
              No variations found in the database for this product.
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              Create variations to offer different options like size, color, or
              packaging. All data will be stored in the product_variants table.
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

                                  <div className="flex-1 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    <div>
                                      <p className="font-semibold text-sm text-muted-foreground">
                                        Name
                                      </p>
                                      <p className="font-medium">
                                        {variant.name}
                                      </p>
                                      <p className="text-xs text-muted-foreground">
                                        ID: {variant.id.slice(0, 8)}...
                                      </p>
                                    </div>

                                    <div>
                                      <p className="font-semibold text-sm text-muted-foreground">
                                        Pricing
                                      </p>
                                      <p className="text-sm font-medium">
                                        Price: ₹{variant.price.toFixed(2)}
                                      </p>
                                      {variant.sale_price && (
                                        <p className="text-sm text-green-600">
                                          Sale: ₹{variant.sale_price.toFixed(2)}
                                        </p>
                                      )}
                                    </div>

                                    <div>
                                      <p className="font-semibold text-sm text-muted-foreground">
                                        Inventory
                                      </p>
                                      <p className="text-sm">
                                        Stock: {variant.stock_quantity}
                                      </p>
                                      {variant.sku && (
                                        <p className="text-xs text-muted-foreground">
                                          SKU: {variant.sku}
                                        </p>
                                      )}
                                    </div>

                                    <div>
                                      <p className="font-semibold text-sm text-muted-foreground">
                                        Status
                                      </p>
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
                                      <p className="text-xs text-muted-foreground mt-1">
                                        Order: {variant.sort_order}
                                      </p>
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
                    Variation Price (₹) *
                    <span className="text-sm text-muted-foreground ml-1">
                      (Stored in database 'price' field)
                    </span>
                  </Label>
                  <Input
                    id="price_override"
                    type="number"
                    step="0.01"
                    value={formData.price_override}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        price_override: e.target.value,
                      })
                    }
                    placeholder="Enter price for this variation"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="sale_price_override">
                    Sale Price (₹)
                    <span className="text-sm text-muted-foreground ml-1">
                      (Optional - stored in 'sale_price' field)
                    </span>
                  </Label>
                  <Input
                    id="sale_price_override"
                    type="number"
                    step="0.01"
                    value={formData.sale_price_override}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        sale_price_override: e.target.value,
                      })
                    }
                    placeholder="Optional discounted price"
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

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-sm text-amber-800">
                  <strong>Note:</strong> Advanced features like variation images
                  and weight tracking require a database schema update.
                  Currently using simplified variation management.
                </p>
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
                    !formData.variation_type ||
                    !formData.variation_value ||
                    !formData.price_override ||
                    parseFloat(formData.price_override || "0") <= 0
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
