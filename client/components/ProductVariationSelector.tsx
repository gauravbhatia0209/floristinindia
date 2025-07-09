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
    let effectivePrice = basePrice || 0;
    let effectiveSalePrice = baseSalePrice || undefined;
    let effectiveImage: string | undefined;

    // Find the highest priority price override
    const selectedVariantsList = Object.values(selections);
    for (const variant of selectedVariantsList) {
      if (
        variant.price_override !== null &&
        variant.price_override !== undefined
      ) {
        effectivePrice = variant.price_override;
      } else if (variant.price !== null && variant.price !== undefined) {
        effectivePrice = variant.price;
      }

      if (
        variant.sale_price_override !== null &&
        variant.sale_price_override !== undefined
      ) {
        effectiveSalePrice = variant.sale_price_override;
      } else if (
        variant.sale_price !== null &&
        variant.sale_price !== undefined
      ) {
        effectiveSalePrice = variant.sale_price;
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {group.variants.map((variant) => {
              const isSelected =
                getSelectedVariant(group.type)?.id === variant.id;
              const inStock = isVariantInStock(variant);
              const effectivePrice = getEffectivePrice(variant);
              const effectiveSalePrice = getEffectiveSalePrice(variant);

              // Calculate price difference from base price
              const finalPrice =
                effectiveSalePrice !== null &&
                effectivePrice !== null &&
                effectiveSalePrice < effectivePrice
                  ? effectiveSalePrice
                  : effectivePrice;

              const safeFinalPrice = finalPrice || 0;
              const safeBasePrice = basePrice || 0;
              const priceDifference = safeFinalPrice - safeBasePrice;

              const formatPriceDifference = (diff: number) => {
                if (Math.abs(diff) < 0.01) return "No Extra Cost";
                if (diff > 0) return `+₹${Math.abs(diff).toFixed(0)}`;
                return `-₹${Math.abs(diff).toFixed(0)}`;
              };

              return (
                <button
                  key={variant.id}
                  onClick={() =>
                    inStock && selectVariation(group.type, variant)
                  }
                  disabled={!inStock}
                  className={`
                    variation-button relative p-4 rounded-xl border-2 transition-all duration-200 text-left
                    min-h-[100px] flex flex-col justify-between group
                    ${
                      isSelected
                        ? "border-primary bg-primary/5 shadow-lg scale-105 ring-2 ring-primary/20"
                        : "border-gray-200 hover:border-primary/50 hover:shadow-md"
                    }
                    ${
                      !inStock
                        ? "opacity-50 cursor-not-allowed"
                        : "cursor-pointer hover:scale-102"
                    }
                  `}
                >
                  {/* Selection indicator */}
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                      <svg
                        className="w-3 h-3 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}

                  {/* Variation name */}
                  <div className="flex-1">
                    <h4
                      className={`font-semibold text-lg mb-1 ${isSelected ? "text-primary" : "text-gray-900"}`}
                    >
                      {variant.variation_value || variant.name}
                    </h4>

                    {/* Stock status */}
                    {!inStock ? (
                      <span className="text-sm text-red-500 font-medium">
                        Out of Stock
                      </span>
                    ) : (
                      <span className="text-sm text-gray-500">
                        In Stock ({variant.stock_quantity})
                      </span>
                    )}
                  </div>

                  {/* Price information */}
                  <div className="mt-2">
                    <div
                      className={`text-sm font-medium ${
                        priceDifference === 0
                          ? "text-green-600"
                          : priceDifference > 0
                            ? "text-orange-600"
                            : "text-green-600"
                      }`}
                    >
                      {formatPriceDifference(priceDifference)}
                    </div>

                    {effectiveSalePrice !== null &&
                      effectivePrice !== null &&
                      effectiveSalePrice < effectivePrice && (
                        <div className="text-xs text-gray-500 mt-1">
                          <span className="line-through">
                            ₹{effectivePrice.toFixed(0)}
                          </span>
                          <span className="ml-1 text-green-600 font-medium">
                            ₹{effectiveSalePrice.toFixed(0)}
                          </span>
                        </div>
                      )}
                  </div>

                  {/* Hover effect overlay */}
                  <div
                    className={`
                    absolute inset-0 rounded-xl transition-opacity duration-200
                    ${
                      isSelected
                        ? "bg-primary/5"
                        : "bg-transparent hover:bg-gray-50"
                    }
                  `}
                  />
                </button>
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
