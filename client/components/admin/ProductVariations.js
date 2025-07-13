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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductVariations = ProductVariations;
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var button_1 = require("@/components/ui/button");
var card_1 = require("@/components/ui/card");
var input_1 = require("@/components/ui/input");
var label_1 = require("@/components/ui/label");
var switch_1 = require("@/components/ui/switch");
var select_1 = require("@/components/ui/select");
var dialog_1 = require("@/components/ui/dialog");
var badge_1 = require("@/components/ui/badge");
var single_image_upload_1 = require("@/components/ui/single-image-upload");
var supabase_1 = require("@/lib/supabase");
var use_toast_1 = require("@/hooks/use-toast");
var dnd_1 = require("@hello-pangea/dnd");
var COMMON_VARIATION_TYPES = [
    "Size",
    "Color",
    "Weight",
    "Style",
    "Material",
    "Packaging",
    "Occasion",
];
function ProductVariations(_a) {
    var productId = _a.productId, basePrice = _a.basePrice, baseSalePrice = _a.baseSalePrice;
    var _b = (0, react_1.useState)([]), variationGroups = _b[0], setVariationGroups = _b[1];
    var _c = (0, react_1.useState)(true), isLoading = _c[0], setIsLoading = _c[1];
    var _d = (0, react_1.useState)(null), editingVariation = _d[0], setEditingVariation = _d[1];
    var _e = (0, react_1.useState)(false), isAddingVariation = _e[0], setIsAddingVariation = _e[1];
    var _f = (0, react_1.useState)(""), selectedVariationType = _f[0], setSelectedVariationType = _f[1];
    var _g = (0, react_1.useState)({
        variation_type: "",
        variation_value: "",
        price_override: "",
        sale_price_override: "",
        stock_quantity: "0",
        image_url: "",
        weight: "",
        sku: "",
        is_active: true,
    }), formData = _g[0], setFormData = _g[1];
    (0, react_1.useEffect)(function () {
        if (productId) {
            fetchVariations();
        }
    }, [productId]);
    // Check if image_url field is available in the database
    function checkImageFieldAvailability() {
        return __awaiter(this, void 0, void 0, function () {
            var error, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, supabase_1.supabase
                                .from("product_variants")
                                .select("image_url")
                                .limit(1)];
                    case 1:
                        error = (_b.sent()).error;
                        return [2 /*return*/, !error];
                    case 2:
                        _a = _b.sent();
                        return [2 /*return*/, false];
                    case 3: return [2 /*return*/];
                }
            });
        });
    }
    function fetchVariations() {
        return __awaiter(this, void 0, void 0, function () {
            var _a, variants, error, groups_1, groupedVariations, error_1, errorMessage;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, 3, 4]);
                        setIsLoading(true);
                        console.log("Fetching variations for product:", productId);
                        return [4 /*yield*/, supabase_1.supabase
                                .from("product_variants")
                                .select("*")
                                .eq("product_id", productId)
                                .order("sort_order")];
                    case 1:
                        _a = _b.sent(), variants = _a.data, error = _a.error;
                        console.log("Query result - data:", variants, "error:", error);
                        if (error) {
                            console.error("Database error details:", error);
                            throw error;
                        }
                        groups_1 = {};
                        variants === null || variants === void 0 ? void 0 : variants.forEach(function (variant) {
                            var type = "Variations";
                            var value = variant.name;
                            // Try to extract type from name pattern "Type - Value"
                            if (variant.name && variant.name.includes(" - ")) {
                                var parts = variant.name.split(" - ");
                                if (parts.length >= 2) {
                                    type = parts[0].trim();
                                    value = parts[1].trim();
                                }
                            }
                            if (!groups_1[type]) {
                                groups_1[type] = [];
                            }
                            // Add the variant with extracted info for UI purposes
                            var enhancedVariant = __assign(__assign({}, variant), { variation_type: type, variation_value: value });
                            groups_1[type].push(enhancedVariant);
                        });
                        groupedVariations = Object.entries(groups_1).map(function (_a) {
                            var type = _a[0], variants = _a[1];
                            return ({
                                type: type,
                                variants: variants,
                            });
                        });
                        setVariationGroups(groupedVariations);
                        return [3 /*break*/, 4];
                    case 2:
                        error_1 = _b.sent();
                        console.error("Error fetching variations:", error_1);
                        errorMessage = "Failed to load product variations.";
                        if (error_1 && typeof error_1 === "object") {
                            if ("message" in error_1 && error_1.message) {
                                errorMessage = error_1.message;
                            }
                            else if ("details" in error_1 && error_1.details) {
                                errorMessage = error_1.details;
                            }
                            else if ("hint" in error_1 && error_1.hint) {
                                errorMessage = error_1.hint;
                            }
                        }
                        (0, use_toast_1.toast)({
                            title: "Error",
                            description: errorMessage,
                            variant: "destructive",
                        });
                        return [3 /*break*/, 4];
                    case 3:
                        setIsLoading(false);
                        return [7 /*endfinally*/];
                    case 4: return [2 /*return*/];
                }
            });
        });
    }
    function handleDragEnd(result) {
        return __awaiter(this, void 0, void 0, function () {
            var source, destination, _a, sourceGroupIndex, sourceItemIndex, _b, destGroupIndex, destItemIndex, groupIndex, newGroups, reorderedItem;
            var _this = this;
            return __generator(this, function (_c) {
                if (!result.destination)
                    return [2 /*return*/];
                source = result.source, destination = result.destination;
                _a = source.droppableId.split("-"), sourceGroupIndex = _a[1], sourceItemIndex = _a[2];
                _b = destination.droppableId.split("-"), destGroupIndex = _b[1], destItemIndex = _b[2];
                if (sourceGroupIndex === destGroupIndex) {
                    groupIndex = parseInt(sourceGroupIndex);
                    newGroups = __spreadArray([], variationGroups, true);
                    reorderedItem = newGroups[groupIndex].variants.splice(parseInt(sourceItemIndex), 1)[0];
                    newGroups[groupIndex].variants.splice(parseInt(destItemIndex), 0, reorderedItem);
                    // Update sort_order
                    newGroups[groupIndex].variants.forEach(function (variant, index) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, supabase_1.supabase
                                        .from("product_variants")
                                        .update({ sort_order: index })
                                        .eq("id", variant.id)];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    setVariationGroups(newGroups);
                }
                return [2 /*return*/];
            });
        });
    }
    function saveVariation() {
        return __awaiter(this, void 0, void 0, function () {
            var variationData, error, error, error_2, errorMessage;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        // Validation
                        if (!formData.variation_type || !formData.variation_value) {
                            (0, use_toast_1.toast)({
                                title: "Validation Error",
                                description: "Variation type and value are required.",
                                variant: "destructive",
                            });
                            return [2 /*return*/];
                        }
                        if (!formData.price_override ||
                            parseFloat(formData.price_override) <= 0) {
                            (0, use_toast_1.toast)({
                                title: "Validation Error",
                                description: "Price is required and must be greater than 0.",
                                variant: "destructive",
                            });
                            return [2 /*return*/];
                        }
                        variationData = {
                            product_id: productId,
                            name: "".concat(formData.variation_type, " - ").concat(formData.variation_value),
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
                            image_url: formData.image_url || null,
                        };
                        console.log("Saving variation data:", variationData);
                        if (!editingVariation) return [3 /*break*/, 2];
                        return [4 /*yield*/, supabase_1.supabase
                                .from("product_variants")
                                .update(variationData)
                                .eq("id", editingVariation.id)];
                    case 1:
                        error = (_a.sent()).error;
                        if (error) {
                            console.error("Update error details:", error);
                            throw error;
                        }
                        (0, use_toast_1.toast)({
                            title: "Success",
                            description: "Variation updated successfully.",
                        });
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, supabase_1.supabase
                            .from("product_variants")
                            .insert(variationData)];
                    case 3:
                        error = (_a.sent()).error;
                        if (error) {
                            console.error("Insert error details:", error);
                            throw error;
                        }
                        (0, use_toast_1.toast)({
                            title: "Success",
                            description: "Variation created successfully.",
                        });
                        _a.label = 4;
                    case 4:
                        resetForm();
                        fetchVariations();
                        return [3 /*break*/, 6];
                    case 5:
                        error_2 = _a.sent();
                        console.error("Error saving variation:", error_2);
                        errorMessage = "Failed to save variation.";
                        if (error_2 && typeof error_2 === "object") {
                            if ("message" in error_2 && error_2.message) {
                                errorMessage = error_2.message;
                            }
                            else if ("details" in error_2 && error_2.details) {
                                errorMessage = error_2.details;
                            }
                            else if ("hint" in error_2 && error_2.hint) {
                                errorMessage = error_2.hint;
                            }
                        }
                        (0, use_toast_1.toast)({
                            title: "Error",
                            description: errorMessage,
                            variant: "destructive",
                        });
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    }
    function deleteVariation(id) {
        return __awaiter(this, void 0, void 0, function () {
            var error, error_3, errorMessage;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!confirm("Are you sure you want to delete this variation?"))
                            return [2 /*return*/];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, supabase_1.supabase
                                .from("product_variants")
                                .delete()
                                .eq("id", id)];
                    case 2:
                        error = (_a.sent()).error;
                        if (error)
                            throw error;
                        (0, use_toast_1.toast)({
                            title: "Success",
                            description: "Variation deleted successfully.",
                        });
                        fetchVariations();
                        return [3 /*break*/, 4];
                    case 3:
                        error_3 = _a.sent();
                        console.error("Error deleting variation:", error_3);
                        errorMessage = "Failed to delete variation.";
                        if (error_3 && typeof error_3 === "object") {
                            if ("message" in error_3 && error_3.message) {
                                errorMessage = error_3.message;
                            }
                            else if ("details" in error_3 && error_3.details) {
                                errorMessage = error_3.details;
                            }
                            else if ("hint" in error_3 && error_3.hint) {
                                errorMessage = error_3.hint;
                            }
                        }
                        (0, use_toast_1.toast)({
                            title: "Error",
                            description: errorMessage,
                            variant: "destructive",
                        });
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
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
    function editVariation(variation) {
        var _a;
        // Extract variation info from name if not available in separate fields
        var nameParts = ((_a = variation.name) === null || _a === void 0 ? void 0 : _a.includes(" - "))
            ? variation.name.split(" - ")
            : ["", variation.name || ""];
        var varType = variation.variation_type || nameParts[0] || "Size";
        var varValue = variation.variation_value || nameParts[1] || "";
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
            image_url: variation.image_url || "", // Use actual database value
            weight: "", // Not available in current schema
            sku: variation.sku || "",
            is_active: variation.is_active,
        });
        setSelectedVariationType(varType);
        setEditingVariation(variation);
    }
    function getEffectivePrice(variant) {
        return variant.price;
    }
    function getEffectiveSalePrice(variant) {
        return variant.sale_price;
    }
    if (isLoading) {
        return (<card_1.Card>
        <card_1.CardHeader>
          <card_1.CardTitle>Product Variations</card_1.CardTitle>
        </card_1.CardHeader>
        <card_1.CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full"></div>
          </div>
        </card_1.CardContent>
      </card_1.Card>);
    }
    return (<card_1.Card>
      <card_1.CardHeader className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1 min-w-0">
            <card_1.CardTitle className="truncate">Product Variations</card_1.CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Manage variations from database table: product_variants
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 shrink-0">
            <button_1.Button variant="outline" size="sm" onClick={fetchVariations} disabled={isLoading} className="whitespace-nowrap">
              {isLoading ? "Loading..." : "Refresh"}
            </button_1.Button>
            <button_1.Button size="sm" onClick={function () { return setIsAddingVariation(true); }} className="whitespace-nowrap">
              <lucide_react_1.Plus className="w-4 h-4 mr-2"/>
              Add Variation
            </button_1.Button>
          </div>
        </div>
      </card_1.CardHeader>
      <card_1.CardContent>
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
            <span>• image_url (TEXT)</span>
            <span>• is_active (BOOLEAN)</span>
          </div>
        </div>

        {variationGroups.length === 0 ? (<div className="text-center py-8">
            <p className="text-muted-foreground mb-2">
              No variations found in the database for this product.
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              Create variations to offer different options like size, color, or
              packaging. All data will be stored in the product_variants table.
            </p>
            <button_1.Button onClick={function () { return setIsAddingVariation(true); }}>
              <lucide_react_1.Plus className="w-4 h-4 mr-2"/>
              Add First Variation
            </button_1.Button>
          </div>) : (<dnd_1.DragDropContext onDragEnd={handleDragEnd}>
            <div className="space-y-6">
              {variationGroups.map(function (group, groupIndex) { return (<div key={group.type}>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    {group.type}
                    <badge_1.Badge variant="outline">{group.variants.length}</badge_1.Badge>
                  </h3>

                  <dnd_1.Droppable droppableId={"group-".concat(groupIndex, "-items")}>
                    {function (provided) { return (<div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                        {group.variants.map(function (variant, itemIndex) { return (<dnd_1.Draggable key={variant.id} draggableId={variant.id} index={itemIndex}>
                            {function (provided, snapshot) { return (<div ref={provided.innerRef} {...provided.draggableProps} className={"border rounded-lg p-4 bg-white ".concat(snapshot.isDragging
                                ? "shadow-lg rotate-1"
                                : "shadow-sm")}>
                                <div className="flex items-center gap-4">
                                  <div {...provided.dragHandleProps} className="cursor-grab active:cursor-grabbing">
                                    <lucide_react_1.GripVertical className="w-4 h-4 text-muted-foreground"/>
                                  </div>

                                  {/* Variation Image */}
                                  <div className="w-16 h-16 bg-gradient-to-br from-cream to-peach/30 rounded-lg flex items-center justify-center overflow-hidden shrink-0">
                                    {variant.image_url ? (<img src={variant.image_url} alt={variant.name} className="w-full h-full object-cover"/>) : (<span className="text-xl">📷</span>)}
                                  </div>

                                  <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
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
                                      {variant.sale_price && (<p className="text-sm text-green-600">
                                          Sale: ₹{variant.sale_price.toFixed(2)}
                                        </p>)}
                                    </div>

                                    <div>
                                      <p className="font-semibold text-sm text-muted-foreground">
                                        Inventory
                                      </p>
                                      <p className="text-sm">
                                        Stock: {variant.stock_quantity}
                                      </p>
                                      {variant.sku && (<p className="text-xs text-muted-foreground">
                                          SKU: {variant.sku}
                                        </p>)}
                                    </div>

                                    <div>
                                      <p className="font-semibold text-sm text-muted-foreground">
                                        Status
                                      </p>
                                      <badge_1.Badge variant={variant.is_active
                                ? "default"
                                : "secondary"}>
                                        {variant.is_active
                                ? "Active"
                                : "Inactive"}
                                      </badge_1.Badge>
                                      <p className="text-xs text-muted-foreground mt-1">
                                        Order: {variant.sort_order}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-2">
                                    <button_1.Button variant="ghost" size="icon" onClick={function () { return editVariation(variant); }}>
                                      <lucide_react_1.Edit className="w-4 h-4"/>
                                    </button_1.Button>
                                    <button_1.Button variant="ghost" size="icon" onClick={function () {
                                return deleteVariation(variant.id);
                            }}>
                                      <lucide_react_1.Trash2 className="w-4 h-4 text-red-600"/>
                                    </button_1.Button>
                                  </div>
                                </div>
                              </div>); }}
                          </dnd_1.Draggable>); })}
                        {provided.placeholder}
                      </div>); }}
                  </dnd_1.Droppable>
                </div>); })}
            </div>
          </dnd_1.DragDropContext>)}

        {/* Add/Edit Variation Dialog */}
        <dialog_1.Dialog open={isAddingVariation || !!editingVariation} onOpenChange={function () { return resetForm(); }}>
          <dialog_1.DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <dialog_1.DialogHeader>
              <dialog_1.DialogTitle>
                {editingVariation ? "Edit Variation" : "Add New Variation"}
              </dialog_1.DialogTitle>
            </dialog_1.DialogHeader>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label_1.Label htmlFor="variation_type">Variation Type *</label_1.Label>
                  <select_1.Select value={formData.variation_type} onValueChange={function (value) {
            setFormData(__assign(__assign({}, formData), { variation_type: value }));
            setSelectedVariationType(value);
        }}>
                    <select_1.SelectTrigger>
                      <select_1.SelectValue placeholder="Select type"/>
                    </select_1.SelectTrigger>
                    <select_1.SelectContent>
                      {COMMON_VARIATION_TYPES.map(function (type) { return (<select_1.SelectItem key={type} value={type}>
                          {type}
                        </select_1.SelectItem>); })}
                    </select_1.SelectContent>
                  </select_1.Select>
                </div>

                <div>
                  <label_1.Label htmlFor="variation_value">Variation Value *</label_1.Label>
                  <input_1.Input id="variation_value" value={formData.variation_value} onChange={function (e) {
            return setFormData(__assign(__assign({}, formData), { variation_value: e.target.value }));
        }} placeholder="e.g., Small, Large, Red, Blue"/>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label_1.Label htmlFor="price_override">
                    Variation Price (₹) *
                    <span className="text-sm text-muted-foreground ml-1">
                      (Stored in database 'price' field)
                    </span>
                  </label_1.Label>
                  <input_1.Input id="price_override" type="number" step="0.01" value={formData.price_override} onChange={function (e) {
            return setFormData(__assign(__assign({}, formData), { price_override: e.target.value }));
        }} placeholder="Enter price for this variation" required/>
                </div>

                <div>
                  <label_1.Label htmlFor="sale_price_override">
                    Sale Price (₹)
                    <span className="text-sm text-muted-foreground ml-1">
                      (Optional - stored in 'sale_price' field)
                    </span>
                  </label_1.Label>
                  <input_1.Input id="sale_price_override" type="number" step="0.01" value={formData.sale_price_override} onChange={function (e) {
            return setFormData(__assign(__assign({}, formData), { sale_price_override: e.target.value }));
        }} placeholder="Optional discounted price"/>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label_1.Label htmlFor="stock_quantity">Stock Quantity *</label_1.Label>
                  <input_1.Input id="stock_quantity" type="number" value={formData.stock_quantity} onChange={function (e) {
            return setFormData(__assign(__assign({}, formData), { stock_quantity: e.target.value }));
        }} placeholder="0"/>
                </div>

                <div>
                  <label_1.Label htmlFor="sku">SKU</label_1.Label>
                  <input_1.Input id="sku" value={formData.sku} onChange={function (e) {
            return setFormData(__assign(__assign({}, formData), { sku: e.target.value }));
        }} placeholder="PRODUCT-SIZE-COLOR"/>
                </div>
              </div>

              <div>
                <label_1.Label>Variation Image</label_1.Label>
                <p className="text-sm text-muted-foreground mb-2">
                  Upload an image specific to this variation. This will override
                  the main product image when the variation is selected.
                </p>
                <single_image_upload_1.SingleImageUpload imageUrl={formData.image_url} onImageChange={function (url) {
            return setFormData(__assign(__assign({}, formData), { image_url: url }));
        }} subdir="products/variations"/>
              </div>

              <div className="flex items-center gap-2">
                <switch_1.Switch checked={formData.is_active} onCheckedChange={function (checked) {
            return setFormData(__assign(__assign({}, formData), { is_active: checked }));
        }}/>
                <label_1.Label>Active (available for purchase)</label_1.Label>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button_1.Button variant="outline" onClick={resetForm}>
                  Cancel
                </button_1.Button>
                <button_1.Button onClick={saveVariation} disabled={!formData.variation_type ||
            !formData.variation_value ||
            !formData.price_override ||
            parseFloat(formData.price_override || "0") <= 0}>
                  <lucide_react_1.Save className="w-4 h-4 mr-2"/>
                  {editingVariation ? "Update Variation" : "Add Variation"}
                </button_1.Button>
              </div>
            </div>
          </dialog_1.DialogContent>
        </dialog_1.Dialog>
      </card_1.CardContent>
    </card_1.Card>);
}
