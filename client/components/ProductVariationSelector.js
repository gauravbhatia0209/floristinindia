"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductVariationSelector = ProductVariationSelector;
var react_1 = require("react");
var badge_1 = require("@/components/ui/badge");
function ProductVariationSelector(_a) {
    var variants = _a.variants, basePrice = _a.basePrice, baseSalePrice = _a.baseSalePrice, baseImages = _a.baseImages, onVariationChange = _a.onVariationChange;
    var _b = (0, react_1.useState)({}), selectedVariations = _b[0], setSelectedVariations = _b[1];
    var _c = (0, react_1.useState)([]), variationGroups = _c[0], setVariationGroups = _c[1];
    (0, react_1.useEffect)(function () {
        // Group variants by type
        var groups = {};
        variants
            .filter(function (variant) { return variant.is_active; })
            .forEach(function (variant) {
            var type = variant.variation_type || "Default";
            if (!groups[type]) {
                groups[type] = [];
            }
            groups[type].push(variant);
        });
        var groupedVariations = Object.entries(groups)
            .map(function (_a) {
            var type = _a[0], variants = _a[1];
            return ({
                type: type,
                variants: variants.sort(function (a, b) { return a.display_order - b.display_order; }),
            });
        })
            .sort(function (a, b) { return a.type.localeCompare(b.type); });
        setVariationGroups(groupedVariations);
        // Auto-select first variant of each type if available
        var autoSelected = {};
        groupedVariations.forEach(function (group) {
            if (group.variants.length > 0) {
                autoSelected[group.type] = group.variants[0];
            }
        });
        if (Object.keys(autoSelected).length > 0) {
            setSelectedVariations(autoSelected);
            updateParent(autoSelected);
        }
    }, [variants]);
    (0, react_1.useEffect)(function () {
        updateParent(selectedVariations);
    }, [selectedVariations]);
    function selectVariation(type, variant) {
        var _a;
        var newSelections = __assign(__assign({}, selectedVariations), (_a = {}, _a[type] = variant, _a));
        setSelectedVariations(newSelections);
    }
    function updateParent(selections) {
        if (!onVariationChange)
            return;
        // Calculate effective price based on selected variations
        var effectivePrice = basePrice || 0;
        var effectiveSalePrice = baseSalePrice || undefined;
        var effectiveImage;
        // Find the highest priority price override
        var selectedVariantsList = Object.values(selections);
        for (var _i = 0, selectedVariantsList_1 = selectedVariantsList; _i < selectedVariantsList_1.length; _i++) {
            var variant = selectedVariantsList_1[_i];
            if (variant.price_override !== null &&
                variant.price_override !== undefined) {
                effectivePrice = variant.price_override;
            }
            else if (variant.price !== null && variant.price !== undefined) {
                effectivePrice = variant.price;
            }
            if (variant.sale_price_override !== null &&
                variant.sale_price_override !== undefined) {
                effectiveSalePrice = variant.sale_price_override;
            }
            else if (variant.sale_price !== null &&
                variant.sale_price !== undefined) {
                effectiveSalePrice = variant.sale_price;
            }
            if (variant.image_url) {
                effectiveImage = variant.image_url;
            }
        }
        onVariationChange(selections, effectivePrice, effectiveSalePrice, effectiveImage);
    }
    function getSelectedVariant(type) {
        return selectedVariations[type];
    }
    function isVariantInStock(variant) {
        return variant.stock_quantity > 0;
    }
    function getEffectivePrice(variant) {
        if (variant.price_override !== null &&
            variant.price_override !== undefined) {
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
    function getEffectiveSalePrice(variant) {
        if (variant.sale_price_override !== null &&
            variant.sale_price_override !== undefined) {
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
    function formatPrice(price) {
        if (price === null || price === undefined || isNaN(price)) {
            return "Price Not Available";
        }
        return "\u20B9".concat(price.toFixed(0));
    }
    if (variationGroups.length === 0) {
        return null;
    }
    return (<div className="space-y-6">
      {variationGroups.map(function (group) { return (<div key={group.type} className="space-y-3">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold">{group.type}</h3>
            {getSelectedVariant(group.type) && (<badge_1.Badge variant="outline">
                {getSelectedVariant(group.type).variation_value}
              </badge_1.Badge>)}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {group.variants.map(function (variant) {
                var _a;
                var isSelected = ((_a = getSelectedVariant(group.type)) === null || _a === void 0 ? void 0 : _a.id) === variant.id;
                var inStock = isVariantInStock(variant);
                var effectivePrice = getEffectivePrice(variant);
                var effectiveSalePrice = getEffectiveSalePrice(variant);
                // Calculate final price
                var finalPrice = effectiveSalePrice !== null &&
                    effectivePrice !== null &&
                    effectiveSalePrice < effectivePrice
                    ? effectiveSalePrice
                    : effectivePrice;
                return (<button key={variant.id} onClick={function () {
                        return inStock && selectVariation(group.type, variant);
                    }} disabled={!inStock} className={"\n                    variation-button relative p-4 rounded-xl border-2 transition-all duration-200 text-left\n                    min-h-[100px] flex flex-col justify-between group\n                    ".concat(isSelected
                        ? "border-primary bg-primary/5 shadow-lg scale-105 ring-2 ring-primary/20"
                        : "border-gray-200 hover:border-primary/50 hover:shadow-md", "\n                    ").concat(!inStock
                        ? "opacity-50 cursor-not-allowed"
                        : "cursor-pointer hover:scale-102", "\n                  ")}>
                  {/* Selection indicator */}
                  {isSelected && (<div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                      </svg>
                    </div>)}

                  {/* Variation name */}
                  <div className="flex-1">
                    <h4 className={"font-bold text-lg mb-1 tracking-wide ".concat(isSelected
                        ? "text-primary"
                        : "text-gray-900 group-hover:text-gray-700")}>
                      {variant.variation_value || variant.name}
                    </h4>
                  </div>

                  {/* Price information */}
                  <div className="mt-3 border-t border-gray-100 pt-2">
                    <div className="text-lg font-bold text-gray-900">
                      {formatPrice(finalPrice)}
                    </div>
                  </div>

                  {/* Hover effect overlay */}
                  <div className={"\n                    absolute inset-0 rounded-xl transition-all duration-200 pointer-events-none\n                    ".concat(isSelected
                        ? "bg-gradient-to-br from-primary/10 to-primary/5"
                        : "bg-transparent group-hover:bg-gradient-to-br group-hover:from-gray-50 group-hover:to-gray-25", "\n                  ")}/>
                </button>);
            })}
          </div>

          {/* Show variation images if available */}
          <div className="flex gap-2 mt-2">
            {group.variants
                .filter(function (v) { return v.image_url; })
                .map(function (variant) {
                var _a;
                var isSelected = ((_a = getSelectedVariant(group.type)) === null || _a === void 0 ? void 0 : _a.id) === variant.id;
                return (<button key={"img-".concat(variant.id)} className={"w-16 h-16 rounded-lg border-2 overflow-hidden ".concat(isSelected
                        ? "border-primary ring-2 ring-primary/20"
                        : "border-muted hover:border-primary/50", " transition-all")} onClick={function () { return selectVariation(group.type, variant); }}>
                    <img src={variant.image_url} alt={variant.variation_value || ""} className="w-full h-full object-cover"/>
                  </button>);
            })}
          </div>
        </div>); })}
    </div>);
}
