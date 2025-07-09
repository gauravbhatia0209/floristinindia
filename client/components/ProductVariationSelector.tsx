import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProductVariant } from "@shared/database.types";

interface VariationGroup {
  type: string;
  variants: ProductVariant[];
}

interface ProductVariationSelectorProps {
  variants: ProductVariant[];
  basePrice: number;
  baseSalePrice?: number;
  baseImages: string[];
  onVariationChange?: (
    selectedVariations: Record<string, ProductVariant>,
    effectivePrice: number,
    effectiveSalePrice?: number,
    effectiveImage?: string,
  ) => void;
}

export function ProductVariationSelector({
  variants,
  basePrice,
  baseSalePrice,
  baseImages,
  onVariationChange,
}: ProductVariationSelectorProps) {
  const [selectedVariations, setSelectedVariations] = useState<
    Record<string, ProductVariant>
  >({});
  const [variationGroups, setVariationGroups] = useState<VariationGroup[]>([]);

  useEffect(() => {
    // Group variants by type
    const groups: { [key: string]: ProductVariant[] } = {};
    variants
      .filter((variant) => variant.is_active)
      .forEach((variant) => {
        const type = variant.variation_type || "Default";
        if (!groups[type]) {
          groups[type] = [];
        }
        groups[type].push(variant);
      });

    const groupedVariations: VariationGroup[] = Object.entries(groups)
      .map(([type, variants]) => ({
        type,
        variants: variants.sort((a, b) => a.display_order - b.display_order),
      }))
      .sort((a, b) => a.type.localeCompare(b.type));

    setVariationGroups(groupedVariations);

    // Auto-select first variant of each type if available
    const autoSelected: Record<string, ProductVariant> = {};
    groupedVariations.forEach((group) => {
      if (group.variants.length > 0) {
        autoSelected[group.type] = group.variants[0];
      }
    });

    if (Object.keys(autoSelected).length > 0) {
      setSelectedVariations(autoSelected);
      updateParent(autoSelected);
    }
  }, [variants]);

  useEffect(() => {
    updateParent(selectedVariations);
  }, [selectedVariations]);

  function selectVariation(type: string, variant: ProductVariant) {
    const newSelections = {
      ...selectedVariations,
      [type]: variant,
    };
    setSelectedVariations(newSelections);
  }

  function updateParent(selections: Record<string, ProductVariant>) {
    if (!onVariationChange) return;

    // Calculate effective price based on selected variations
    let effectivePrice = basePrice;
    let effectiveSalePrice = baseSalePrice;
    let effectiveImage: string | undefined;

    // Find the highest priority price override
    const selectedVariantsList = Object.values(selections);
    for (const variant of selectedVariantsList) {
      if (variant.price_override !== null) {
        effectivePrice = variant.price_override;
      }
      if (variant.sale_price_override !== null) {
        effectiveSalePrice = variant.sale_price_override;
      }
      if (variant.image_url) {
        effectiveImage = variant.image_url;
      }
    }

    onVariationChange(
      selections,
      effectivePrice,
      effectiveSalePrice,
      effectiveImage,
    );
  }

  function getSelectedVariant(type: string): ProductVariant | undefined {
    return selectedVariations[type];
  }

  function isVariantInStock(variant: ProductVariant): boolean {
    return variant.stock_quantity > 0;
  }

  function getEffectivePrice(variant: ProductVariant): number | null {
    if (
      variant.price_override !== null &&
      variant.price_override !== undefined
    ) {
      return variant.price_override;
    }
    if (variant.price !== null && variant.price !== undefined) {
      return variant.price;
    }
    if (basePrice !== null && basePrice !== undefined) {
      return basePrice;
    }
    return null;
  }

  function getEffectiveSalePrice(variant: ProductVariant): number | null {
    if (
      variant.sale_price_override !== null &&
      variant.sale_price_override !== undefined
    ) {
      return variant.sale_price_override;
    }
    if (variant.sale_price !== null && variant.sale_price !== undefined) {
      return variant.sale_price;
    }
    if (baseSalePrice !== null && baseSalePrice !== undefined) {
      return baseSalePrice;
    }
    return null;
  }

  function formatPrice(price: number | null): string {
    if (price === null || price === undefined || isNaN(price)) {
      return "Price Not Available";
    }
    return `₹${price.toFixed(0)}`;
  }

  if (variationGroups.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {variationGroups.map((group) => (
        <div key={group.type} className="space-y-3">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold">{group.type}</h3>
            {getSelectedVariant(group.type) && (
              <Badge variant="outline">
                {getSelectedVariant(group.type)!.variation_value}
              </Badge>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {group.variants.map((variant) => {
              const isSelected =
                getSelectedVariant(group.type)?.id === variant.id;
              const inStock = isVariantInStock(variant);
              const effectivePrice = getEffectivePrice(variant);
              const effectiveSalePrice = getEffectiveSalePrice(variant);

              return (
                <Button
                  key={variant.id}
                  variant={isSelected ? "default" : "outline"}
                  size="sm"
                  className={`relative ${
                    !inStock
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:scale-105 transition-transform"
                  }`}
                  onClick={() =>
                    inStock && selectVariation(group.type, variant)
                  }
                  disabled={!inStock}
                >
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-sm font-medium">
                      {variant.variation_value}
                    </span>

                    {/* Show price if different from base */}
                    {(variant.price_override !== null ||
                      variant.sale_price_override !== null) && (
                      <div className="text-xs">
                        {effectiveSalePrice &&
                        effectiveSalePrice < effectivePrice ? (
                          <div className="flex flex-col items-center">
                            <span className="text-green-600 font-medium">
                              ₹{effectiveSalePrice.toFixed(0)}
                            </span>
                            <span className="line-through text-muted-foreground">
                              ₹{effectivePrice.toFixed(0)}
                            </span>
                          </div>
                        ) : (
                          <span className="font-medium">
                            ₹{effectivePrice.toFixed(0)}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Show stock status */}
                    {!inStock && (
                      <span className="text-xs text-red-500 font-medium">
                        Out of Stock
                      </span>
                    )}
                  </div>

                  {/* Selected indicator */}
                  {isSelected && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                    </div>
                  )}
                </Button>
              );
            })}
          </div>

          {/* Show variation images if available */}
          <div className="flex gap-2 mt-2">
            {group.variants
              .filter((v) => v.image_url)
              .map((variant) => {
                const isSelected =
                  getSelectedVariant(group.type)?.id === variant.id;
                return (
                  <button
                    key={`img-${variant.id}`}
                    className={`w-16 h-16 rounded-lg border-2 overflow-hidden ${
                      isSelected
                        ? "border-primary ring-2 ring-primary/20"
                        : "border-muted hover:border-primary/50"
                    } transition-all`}
                    onClick={() => selectVariation(group.type, variant)}
                  >
                    <img
                      src={variant.image_url!}
                      alt={variant.variation_value || ""}
                      className="w-full h-full object-cover"
                    />
                  </button>
                );
              })}
          </div>
        </div>
      ))}

      {/* Selected variations summary */}
      {Object.keys(selectedVariations).length > 0 && (
        <div className="pt-4 border-t">
          <h4 className="text-sm font-medium mb-2">Selected Options:</h4>
          <div className="flex flex-wrap gap-2">
            {Object.entries(selectedVariations).map(([type, variant]) => (
              <Badge key={type} variant="secondary">
                {type}: {variant.variation_value}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
