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
exports.default = AdminCategories;
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var button_1 = require("@/components/ui/button");
var input_1 = require("@/components/ui/input");
var card_1 = require("@/components/ui/card");
var badge_1 = require("@/components/ui/badge");
var dropdown_menu_1 = require("@/components/ui/dropdown-menu");
var select_1 = require("@/components/ui/select");
var label_1 = require("@/components/ui/label");
var textarea_1 = require("@/components/ui/textarea");
var switch_1 = require("@/components/ui/switch");
var supabase_1 = require("@/lib/supabase");
var single_image_upload_1 = require("@/components/ui/single-image-upload");
function CategoryRow(_a) {
    var category = _a.category, _b = _a.isSubcategory, isSubcategory = _b === void 0 ? false : _b, onEdit = _a.onEdit, onDelete = _a.onDelete, onToggleStatus = _a.onToggleStatus, onToggleMenuVisibility = _a.onToggleMenuVisibility, editingCategory = _a.editingCategory, formData = _a.formData, setFormData = _a.setFormData, onSave = _a.onSave, onCancel = _a.onCancel, isSaving = _a.isSaving, handleNameChange = _a.handleNameChange, parentCategories = _a.parentCategories;
    var isEditing = (editingCategory === null || editingCategory === void 0 ? void 0 : editingCategory.id) === category.id;
    return (<>
      <div className={"group border rounded-lg hover:shadow-sm transition-shadow ".concat(isSubcategory ? "border-l-4 border-l-blue-200 bg-blue-50/30" : "bg-white")}>
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <div className="w-12 h-12 bg-gradient-to-br from-cream to-peach/30 rounded-lg flex items-center justify-center flex-shrink-0">
                {category.image_url ? (<img src={category.image_url} alt={category.name} className="w-full h-full object-cover rounded-lg"/>) : (<span className="text-lg">{isSubcategory ? "🏷️" : "📁"}</span>)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className={"".concat(isSubcategory ? "text-base" : "text-lg font-semibold", " truncate")}>
                    {category.name}
                  </h3>
                  {isSubcategory && (<badge_1.Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                      Subcategory
                    </badge_1.Badge>)}
                  <badge_1.Badge variant={category.is_active ? "default" : "secondary"} className="text-xs">
                    {category.is_active ? "Active" : "Inactive"}
                  </badge_1.Badge>
                  {category.show_in_menu && (<badge_1.Badge variant="outline" className="text-xs">
                      In Menu
                    </badge_1.Badge>)}
                </div>

                <p className="text-sm text-muted-foreground mb-2">
                  {category.description || "No description"}
                </p>

                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>Sort: {category.sort_order}</span>
                  <span>Slug: {category.slug}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <switch_1.Switch checked={category.is_active} onCheckedChange={function () {
            return onToggleStatus(category.id, category.is_active);
        }}/>
              <switch_1.Switch checked={category.show_in_menu} onCheckedChange={function () {
            return onToggleMenuVisibility(category.id, category.show_in_menu);
        }}/>
              <dropdown_menu_1.DropdownMenu>
                <dropdown_menu_1.DropdownMenuTrigger asChild>
                  <button_1.Button variant="ghost" size="icon" className="h-8 w-8">
                    <lucide_react_1.MoreHorizontal className="h-4 w-4"/>
                  </button_1.Button>
                </dropdown_menu_1.DropdownMenuTrigger>
                <dropdown_menu_1.DropdownMenuContent align="end">
                  <dropdown_menu_1.DropdownMenuItem>
                    <lucide_react_1.Eye className="h-4 w-4 mr-2"/>
                    View Products
                  </dropdown_menu_1.DropdownMenuItem>
                  <dropdown_menu_1.DropdownMenuItem onClick={function () { return onEdit(category); }}>
                    <lucide_react_1.Edit className="h-4 w-4 mr-2"/>
                    Edit
                  </dropdown_menu_1.DropdownMenuItem>
                  <dropdown_menu_1.DropdownMenuItem className="text-red-600" onClick={function () { return onDelete(category.id); }}>
                    <lucide_react_1.Trash2 className="h-4 w-4 mr-2"/>
                    Delete
                  </dropdown_menu_1.DropdownMenuItem>
                </dropdown_menu_1.DropdownMenuContent>
              </dropdown_menu_1.DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      {/* Inline Edit Form */}
      {isEditing && (<div className="border-l-4 border-primary bg-primary/5 p-6 rounded-lg mt-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">
              Edit Category: {category.name}
            </h3>
            <button_1.Button variant="outline" size="sm" onClick={onCancel}>
              Cancel
            </button_1.Button>
          </div>

          <div className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h4 className="font-medium">Basic Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label_1.Label htmlFor="name">Category Name *</label_1.Label>
                  <input_1.Input id="name" value={formData.name} onChange={function (e) { return handleNameChange(e.target.value); }} placeholder="e.g., Birthday Flowers"/>
                </div>
                <div>
                  <label_1.Label htmlFor="slug">URL Slug *</label_1.Label>
                  <input_1.Input id="slug" value={formData.slug} onChange={function (e) {
                return setFormData(function (prev) { return (__assign(__assign({}, prev), { slug: e.target.value })); });
            }} placeholder="birthday-flowers"/>
                </div>
              </div>

              <div>
                <label_1.Label htmlFor="description">Description</label_1.Label>
                <textarea_1.Textarea id="description" value={formData.description} onChange={function (e) {
                return setFormData(function (prev) { return (__assign(__assign({}, prev), { description: e.target.value })); });
            }} placeholder="Beautiful flowers perfect for birthday celebrations..." rows={3}/>
              </div>

              <div>
                <single_image_upload_1.SingleImageUpload imageUrl={formData.image_url} onImageChange={function (imageUrl) {
                return setFormData(function (prev) { return (__assign(__assign({}, prev), { image_url: imageUrl })); });
            }} label="Category Image"/>
              </div>
            </div>

            {/* Category Settings */}
            <div className="space-y-4">
              <h4 className="font-medium">Category Settings</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label_1.Label htmlFor="parent_id">Parent Category</label_1.Label>
                  <select_1.Select value={formData.parent_id} onValueChange={function (value) {
                return setFormData(function (prev) { return (__assign(__assign({}, prev), { parent_id: value })); });
            }}>
                    <select_1.SelectTrigger>
                      <select_1.SelectValue placeholder="Select parent (optional)"/>
                    </select_1.SelectTrigger>
                    <select_1.SelectContent>
                      <select_1.SelectItem value="none">
                        Main Category (No Parent)
                      </select_1.SelectItem>
                      {parentCategories
                .filter(function (cat) { return cat.id !== (editingCategory === null || editingCategory === void 0 ? void 0 : editingCategory.id); })
                .map(function (category) { return (<select_1.SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </select_1.SelectItem>); })}
                    </select_1.SelectContent>
                  </select_1.Select>
                </div>

                <div>
                  <label_1.Label htmlFor="sort_order">Sort Order</label_1.Label>
                  <input_1.Input id="sort_order" type="number" value={formData.sort_order} onChange={function (e) {
                return setFormData(function (prev) { return (__assign(__assign({}, prev), { sort_order: e.target.value })); });
            }} placeholder="1"/>
                </div>
              </div>

              <div className="flex flex-col space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label_1.Label htmlFor="is_active">Active Status</label_1.Label>
                    <p className="text-sm text-muted-foreground">
                      Active categories are visible to customers
                    </p>
                  </div>
                  <switch_1.Switch id="is_active" checked={formData.is_active} onCheckedChange={function (checked) {
                return setFormData(function (prev) { return (__assign(__assign({}, prev), { is_active: checked })); });
            }}/>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label_1.Label htmlFor="show_in_menu">Show in Menu</label_1.Label>
                    <p className="text-sm text-muted-foreground">
                      Display this category in the navigation menu
                    </p>
                  </div>
                  <switch_1.Switch id="show_in_menu" checked={formData.show_in_menu} onCheckedChange={function (checked) {
                return setFormData(function (prev) { return (__assign(__assign({}, prev), { show_in_menu: checked })); });
            }}/>
                </div>
              </div>
            </div>

            {/* SEO Settings */}
            <div className="space-y-4">
              <h4 className="font-medium">SEO Settings</h4>
              <div>
                <label_1.Label htmlFor="meta_title">Meta Title</label_1.Label>
                <input_1.Input id="meta_title" value={formData.meta_title} onChange={function (e) {
                return setFormData(function (prev) { return (__assign(__assign({}, prev), { meta_title: e.target.value })); });
            }} placeholder="Birthday Flowers - Fresh Delivery | Florist in India"/>
              </div>

              <div>
                <label_1.Label htmlFor="meta_description">Meta Description</label_1.Label>
                <textarea_1.Textarea id="meta_description" value={formData.meta_description} onChange={function (e) {
                return setFormData(function (prev) { return (__assign(__assign({}, prev), { meta_description: e.target.value })); });
            }} placeholder="Order beautiful birthday flowers with same-day delivery across India..." rows={2}/>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-2 pt-4 border-t">
              <button_1.Button variant="outline" onClick={onCancel}>
                Cancel
              </button_1.Button>
              <button_1.Button onClick={onSave} disabled={isSaving}>
                {isSaving ? "Saving..." : "Update Category"}
              </button_1.Button>
            </div>
          </div>
        </div>)}
    </>);
}
function MainCategoryAccordion(_a) {
    var parent = _a.parent, subcategories = _a.subcategories, onEditCategory = _a.onEditCategory, onDeleteCategory = _a.onDeleteCategory, onToggleStatus = _a.onToggleStatus, onToggleMenuVisibility = _a.onToggleMenuVisibility, editingCategory = _a.editingCategory, formData = _a.formData, setFormData = _a.setFormData, onSave = _a.onSave, onCancel = _a.onCancel, isSaving = _a.isSaving, handleNameChange = _a.handleNameChange, parentCategories = _a.parentCategories;
    var _b = (0, react_1.useState)(true), isExpanded = _b[0], setIsExpanded = _b[1];
    return (<div className="border rounded-lg bg-white">
      {/* Main Category */}
      <div className="bg-gradient-to-r from-slate-50 to-slate-100/50">
        <CategoryRow category={parent} onEdit={onEditCategory} onDelete={onDeleteCategory} onToggleStatus={onToggleStatus} onToggleMenuVisibility={onToggleMenuVisibility} editingCategory={editingCategory} formData={formData} setFormData={setFormData} onSave={onSave} onCancel={onCancel} isSaving={isSaving} handleNameChange={handleNameChange} parentCategories={parentCategories}/>
      </div>

      {/* Subcategories Toggle */}
      {subcategories.length > 0 && (<>
          <div className="px-4 py-2 border-t bg-slate-50/50 cursor-pointer hover:bg-slate-100/50 transition-colors" onClick={function () { return setIsExpanded(!isExpanded); }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {isExpanded ? (<lucide_react_1.ChevronDown className="h-4 w-4 text-slate-500"/>) : (<lucide_react_1.ChevronRight className="h-4 w-4 text-slate-500"/>)}
                <span className="text-sm font-medium text-slate-700">
                  Subcategories ({subcategories.length})
                </span>
              </div>
              <div className="flex items-center gap-1">
                {subcategories.map(function (sub) { return (<badge_1.Badge key={sub.id} variant={sub.is_active ? "default" : "secondary"} className="text-xs">
                    {sub.name}
                  </badge_1.Badge>); })}
              </div>
            </div>
          </div>

          {/* Subcategories List */}
          {isExpanded && (<div className="p-4 space-y-3 bg-blue-50/20">
              {subcategories.map(function (subcategory) { return (<CategoryRow key={subcategory.id} category={subcategory} isSubcategory={true} onEdit={onEditCategory} onDelete={onDeleteCategory} onToggleStatus={onToggleStatus} onToggleMenuVisibility={onToggleMenuVisibility} editingCategory={editingCategory} formData={formData} setFormData={setFormData} onSave={onSave} onCancel={onCancel} isSaving={isSaving} handleNameChange={handleNameChange} parentCategories={parentCategories}/>); })}
            </div>)}
        </>)}
    </div>);
}
function AdminCategories() {
    var _a = (0, react_1.useState)([]), categories = _a[0], setCategories = _a[1];
    var _b = (0, react_1.useState)(true), isLoading = _b[0], setIsLoading = _b[1];
    var _c = (0, react_1.useState)(""), searchQuery = _c[0], setSearchQuery = _c[1];
    var _d = (0, react_1.useState)(null), editingCategory = _d[0], setEditingCategory = _d[1];
    var _e = (0, react_1.useState)(false), isCreating = _e[0], setIsCreating = _e[1];
    var _f = (0, react_1.useState)(false), isSaving = _f[0], setIsSaving = _f[1];
    var _g = (0, react_1.useState)({
        name: "",
        slug: "",
        description: "",
        parent_id: "",
        is_active: true,
        show_in_menu: true,
        sort_order: "",
        image_url: "",
        meta_title: "",
        meta_description: "",
    }), formData = _g[0], setFormData = _g[1];
    (0, react_1.useEffect)(function () {
        fetchCategories();
    }, []);
    function fetchCategories() {
        return __awaiter(this, void 0, void 0, function () {
            var data, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, 3, 4]);
                        return [4 /*yield*/, supabase_1.supabase
                                .from("product_categories")
                                .select("*")
                                .order("sort_order")];
                    case 1:
                        data = (_a.sent()).data;
                        if (data)
                            setCategories(data);
                        return [3 /*break*/, 4];
                    case 2:
                        error_1 = _a.sent();
                        console.error("Failed to fetch categories:", error_1);
                        return [3 /*break*/, 4];
                    case 3:
                        setIsLoading(false);
                        return [7 /*endfinally*/];
                    case 4: return [2 /*return*/];
                }
            });
        });
    }
    var filteredCategories = categories.filter(function (category) {
        return category.name.toLowerCase().includes(searchQuery.toLowerCase());
    });
    var parentCategories = filteredCategories.filter(function (cat) { return !cat.parent_id; });
    var subCategories = filteredCategories.filter(function (cat) { return cat.parent_id; });
    function getParentName(parentId) {
        if (!parentId)
            return "Main Category";
        var parent = categories.find(function (cat) { return cat.id === parentId; });
        return (parent === null || parent === void 0 ? void 0 : parent.name) || "Unknown";
    }
    function getSubcategoriesCount(parentId) {
        return categories.filter(function (cat) { return cat.parent_id === parentId; }).length;
    }
    function toggleCategoryStatus(categoryId, currentStatus) {
        return __awaiter(this, void 0, void 0, function () {
            var error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, supabase_1.supabase
                                .from("product_categories")
                                .update({ is_active: !currentStatus })
                                .eq("id", categoryId)];
                    case 1:
                        _a.sent();
                        setCategories(categories.map(function (cat) {
                            return cat.id === categoryId ? __assign(__assign({}, cat), { is_active: !currentStatus }) : cat;
                        }));
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _a.sent();
                        console.error("Failed to update category status:", error_2);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    }
    function toggleMenuVisibility(categoryId, currentVisibility) {
        return __awaiter(this, void 0, void 0, function () {
            var error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, supabase_1.supabase
                                .from("product_categories")
                                .update({ show_in_menu: !currentVisibility })
                                .eq("id", categoryId)];
                    case 1:
                        _a.sent();
                        setCategories(categories.map(function (cat) {
                            return cat.id === categoryId
                                ? __assign(__assign({}, cat), { show_in_menu: !currentVisibility }) : cat;
                        }));
                        return [3 /*break*/, 3];
                    case 2:
                        error_3 = _a.sent();
                        console.error("Failed to update menu visibility:", error_3);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    }
    function deleteCategory(categoryId) {
        return __awaiter(this, void 0, void 0, function () {
            var subcategoriesCount, _a, mainCategoryProducts, mainCatError, _b, subCategoryProducts, subCatError, totalProducts, productList, moreText, error, error_4, errorMessage;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!confirm("Are you sure you want to delete this category?"))
                            return [2 /*return*/];
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 6, , 7]);
                        subcategoriesCount = categories.filter(function (cat) { return cat.parent_id === categoryId; }).length;
                        if (subcategoriesCount > 0) {
                            alert("Cannot delete this category. It has ".concat(subcategoriesCount, " subcategories. Please delete or reassign the subcategories first."));
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, supabase_1.supabase
                                .from("products")
                                .select("id, name")
                                .eq("category_id", categoryId)
                                .limit(5)];
                    case 2:
                        _a = _c.sent(), mainCategoryProducts = _a.data, mainCatError = _a.error;
                        if (mainCatError) {
                            console.error("Error checking main category products:", mainCatError);
                            alert("Unable to verify category usage. Please try again.");
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, supabase_1.supabase
                                .from("products")
                                .select("id, name")
                                .eq("subcategory_id", categoryId)
                                .limit(5)];
                    case 3:
                        _b = _c.sent(), subCategoryProducts = _b.data, subCatError = _b.error;
                        if (subCatError) {
                            console.error("Error checking subcategory products:", subCatError);
                            alert("Unable to verify category usage. Please try again.");
                            return [2 /*return*/];
                        }
                        totalProducts = ((mainCategoryProducts === null || mainCategoryProducts === void 0 ? void 0 : mainCategoryProducts.length) || 0) +
                            ((subCategoryProducts === null || subCategoryProducts === void 0 ? void 0 : subCategoryProducts.length) || 0);
                        if (totalProducts > 0) {
                            productList = __spreadArray(__spreadArray([], (mainCategoryProducts || []).map(function (p) { return "".concat(p.name, " (main category)"); }), true), (subCategoryProducts || []).map(function (p) { return "".concat(p.name, " (subcategory)"); }), true).slice(0, 5);
                            moreText = totalProducts > 5 ? " and ".concat(totalProducts - 5, " more") : "";
                            alert("Cannot delete this category. It is being used by ".concat(totalProducts, " product(s):\n\n").concat(productList.join("\n")).concat(moreText, "\n\nPlease reassign or delete these products first, or change their category assignment."));
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, supabase_1.supabase
                                .from("product_categories")
                                .delete()
                                .eq("id", categoryId)];
                    case 4:
                        error = (_c.sent()).error;
                        if (error) {
                            console.error("Database delete error:", error);
                            alert("Failed to delete category: ".concat(error.message || error.toString()));
                            return [2 /*return*/];
                        }
                        // Refresh the categories list from database to ensure consistency
                        return [4 /*yield*/, fetchCategories()];
                    case 5:
                        // Refresh the categories list from database to ensure consistency
                        _c.sent();
                        alert("Category deleted successfully!");
                        return [3 /*break*/, 7];
                    case 6:
                        error_4 = _c.sent();
                        console.error("Failed to delete category:", error_4);
                        errorMessage = (error_4 === null || error_4 === void 0 ? void 0 : error_4.message) || (error_4 === null || error_4 === void 0 ? void 0 : error_4.toString()) || "Unknown error occurred";
                        alert("Failed to delete category: ".concat(errorMessage));
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        });
    }
    function startEditing(category) {
        if (category) {
            setEditingCategory(category);
            setIsCreating(false);
            setFormData({
                name: category.name,
                slug: category.slug,
                description: category.description || "",
                parent_id: category.parent_id || "none",
                is_active: category.is_active,
                show_in_menu: category.show_in_menu,
                sort_order: category.sort_order.toString(),
                image_url: category.image_url || "",
                meta_title: category.meta_title || "",
                meta_description: category.meta_description || "",
            });
        }
        else {
            setEditingCategory(null);
            setIsCreating(true);
            var nextSortOrder = categories.length > 0
                ? Math.max.apply(Math, categories.map(function (c) { return c.sort_order; })) + 1
                : 1;
            setFormData({
                name: "",
                slug: "",
                description: "",
                parent_id: "none",
                is_active: true,
                show_in_menu: true,
                sort_order: nextSortOrder.toString(),
                image_url: "",
                meta_title: "",
                meta_description: "",
            });
        }
    }
    function cancelEditing() {
        setEditingCategory(null);
        setIsCreating(false);
        setFormData({
            name: "",
            slug: "",
            description: "",
            parent_id: "none",
            is_active: true,
            show_in_menu: true,
            sort_order: "",
            image_url: "",
            meta_title: "",
            meta_description: "",
        });
    }
    // Auto-generate slug from name
    function handleNameChange(name) {
        setFormData(function (prev) { return (__assign(__assign({}, prev), { name: name, slug: name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-+|-+$/g, "") })); });
    }
    function validateForm() {
        return __awaiter(this, void 0, void 0, function () {
            var nameQuery, _a, existingName, nameError, slugQuery, _b, existingSlug, slugError, error_5;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!formData.name.trim()) {
                            return [2 /*return*/, "Category name is required"];
                        }
                        if (!formData.slug.trim()) {
                            return [2 /*return*/, "Category slug is required"];
                        }
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 4, , 5]);
                        nameQuery = supabase_1.supabase
                            .from("product_categories")
                            .select("id, name")
                            .ilike("name", formData.name.trim())
                            .limit(1);
                        // Only exclude current category if we're editing
                        if (editingCategory === null || editingCategory === void 0 ? void 0 : editingCategory.id) {
                            nameQuery = nameQuery.neq("id", editingCategory.id);
                        }
                        return [4 /*yield*/, nameQuery];
                    case 2:
                        _a = _c.sent(), existingName = _a.data, nameError = _a.error;
                        if (nameError) {
                            console.error("Name validation error:", nameError);
                            return [2 /*return*/, "Unable to validate category name. Please try again."];
                        }
                        if (existingName && existingName.length > 0) {
                            console.log("Found existing category with same name:", existingName[0]);
                            return [2 /*return*/, "A category with this name already exists (ID: ".concat(existingName[0].id, "). Please choose a different name.")];
                        }
                        slugQuery = supabase_1.supabase
                            .from("product_categories")
                            .select("id, slug")
                            .eq("slug", formData.slug.trim())
                            .limit(1);
                        // Only exclude current category if we're editing
                        if (editingCategory === null || editingCategory === void 0 ? void 0 : editingCategory.id) {
                            slugQuery = slugQuery.neq("id", editingCategory.id);
                        }
                        return [4 /*yield*/, slugQuery];
                    case 3:
                        _b = _c.sent(), existingSlug = _b.data, slugError = _b.error;
                        if (slugError) {
                            console.error("Slug validation error:", slugError);
                            return [2 /*return*/, "Unable to validate category slug. Please try again."];
                        }
                        if (existingSlug && existingSlug.length > 0) {
                            return [2 /*return*/, "A category with this slug already exists. Try a different name or modify the slug manually."];
                        }
                        return [2 /*return*/, null];
                    case 4:
                        error_5 = _c.sent();
                        console.error("Validation error:", error_5);
                        return [2 /*return*/, "Unable to validate category data. Please try again."];
                    case 5: return [2 /*return*/];
                }
            });
        });
    }
    function saveCategory() {
        return __awaiter(this, void 0, void 0, function () {
            var validationError, categoryData, error, error, error_6, errorMessage;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, validateForm()];
                    case 1:
                        validationError = _b.sent();
                        if (validationError) {
                            alert(validationError);
                            return [2 /*return*/];
                        }
                        setIsSaving(true);
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 7, 8, 9]);
                        categoryData = {
                            name: formData.name.trim(),
                            slug: formData.slug.trim(),
                            description: formData.description.trim() || null,
                            parent_id: formData.parent_id === "none" ? null : formData.parent_id,
                            is_active: formData.is_active,
                            show_in_menu: formData.show_in_menu,
                            sort_order: parseInt(formData.sort_order),
                            image_url: formData.image_url.trim() || null,
                            meta_title: formData.meta_title.trim() || null,
                            meta_description: formData.meta_description.trim() || null,
                        };
                        if (!editingCategory) return [3 /*break*/, 4];
                        return [4 /*yield*/, supabase_1.supabase
                                .from("product_categories")
                                .update(categoryData)
                                .eq("id", editingCategory.id)];
                    case 3:
                        error = (_b.sent()).error;
                        if (error)
                            throw error;
                        alert("Category updated successfully!");
                        return [3 /*break*/, 6];
                    case 4: return [4 /*yield*/, supabase_1.supabase
                            .from("product_categories")
                            .insert(categoryData)];
                    case 5:
                        error = (_b.sent()).error;
                        if (error)
                            throw error;
                        alert("Category created successfully!");
                        _b.label = 6;
                    case 6:
                        fetchCategories();
                        cancelEditing();
                        return [3 /*break*/, 9];
                    case 7:
                        error_6 = _b.sent();
                        console.error("Failed to save category:", error_6);
                        errorMessage = (error_6 === null || error_6 === void 0 ? void 0 : error_6.message) ||
                            ((_a = error_6 === null || error_6 === void 0 ? void 0 : error_6.error) === null || _a === void 0 ? void 0 : _a.message) ||
                            (error_6 === null || error_6 === void 0 ? void 0 : error_6.toString()) ||
                            "Unknown error occurred";
                        alert("Failed to save category: ".concat(errorMessage));
                        return [3 /*break*/, 9];
                    case 8:
                        setIsSaving(false);
                        return [7 /*endfinally*/];
                    case 9: return [2 /*return*/];
                }
            });
        });
    }
    if (isLoading) {
        return (<div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded animate-pulse w-48"></div>
        <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
      </div>);
    }
    return (<div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Categories</h1>
          <p className="text-muted-foreground">
            Organize your flower catalog with categories and subcategories
          </p>
        </div>
        <div className="flex gap-2">
          <button_1.Button variant="outline" onClick={function () {
            return window.open("/admin/categories/migrate-images", "_blank");
        }}>
            <lucide_react_1.Upload className="h-4 w-4 mr-2"/>
            Migrate Images
          </button_1.Button>
          <button_1.Button variant="outline" onClick={function () { return fetchCategories(); }}>
            Refresh
          </button_1.Button>
          <button_1.Button onClick={function () { return startEditing(); }}>
            <lucide_react_1.Plus className="h-4 w-4 mr-2"/>
            Add Category
          </button_1.Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <card_1.Card>
          <card_1.CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <card_1.CardTitle className="text-sm font-medium">
              Total Categories
            </card_1.CardTitle>
            <lucide_react_1.FolderOpen className="h-4 w-4 text-muted-foreground"/>
          </card_1.CardHeader>
          <card_1.CardContent>
            <div className="text-2xl font-bold">{categories.length}</div>
          </card_1.CardContent>
        </card_1.Card>
        <card_1.Card>
          <card_1.CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <card_1.CardTitle className="text-sm font-medium">
              Main Categories
            </card_1.CardTitle>
            <lucide_react_1.Tag className="h-4 w-4 text-muted-foreground"/>
          </card_1.CardHeader>
          <card_1.CardContent>
            <div className="text-2xl font-bold">{parentCategories.length}</div>
          </card_1.CardContent>
        </card_1.Card>
        <card_1.Card>
          <card_1.CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <card_1.CardTitle className="text-sm font-medium">Subcategories</card_1.CardTitle>
            <lucide_react_1.Tag className="h-4 w-4 text-muted-foreground"/>
          </card_1.CardHeader>
          <card_1.CardContent>
            <div className="text-2xl font-bold">{subCategories.length}</div>
          </card_1.CardContent>
        </card_1.Card>
        <card_1.Card>
          <card_1.CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <card_1.CardTitle className="text-sm font-medium">Active</card_1.CardTitle>
            <div className="h-2 w-2 bg-green-500 rounded-full"></div>
          </card_1.CardHeader>
          <card_1.CardContent>
            <div className="text-2xl font-bold">
              {categories.filter(function (cat) { return cat.is_active; }).length}
            </div>
          </card_1.CardContent>
        </card_1.Card>
      </div>

      {/* Search */}
      <card_1.Card>
        <card_1.CardContent className="pt-6">
          <div className="relative">
            <lucide_react_1.Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4"/>
            <input_1.Input placeholder="Search categories..." value={searchQuery} onChange={function (e) { return setSearchQuery(e.target.value); }} className="pl-10"/>
          </div>
        </card_1.CardContent>
      </card_1.Card>

      {/* Hierarchical Categories */}
      <card_1.Card>
        <card_1.CardHeader>
          <div className="flex items-center justify-between">
            <card_1.CardTitle>
              Categories Hierarchy ({filteredCategories.length})
            </card_1.CardTitle>
            <div className="text-sm text-muted-foreground">
              {parentCategories.length} main categories, {subCategories.length}{" "}
              subcategories
            </div>
          </div>
        </card_1.CardHeader>
        <card_1.CardContent>
          {filteredCategories.length === 0 ? (<div className="text-center py-12">
              <lucide_react_1.FolderOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground"/>
              <h3 className="text-lg font-semibold mb-2">
                No categories found
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery
                ? "Try adjusting your search"
                : "Get started by adding your first category"}
              </p>
              <button_1.Button onClick={function () { return startEditing(); }}>
                <lucide_react_1.Plus className="h-4 w-4 mr-2"/>
                Add Category
              </button_1.Button>
            </div>) : (<div className="space-y-4">
              {/* Main Categories */}
              {parentCategories.map(function (parent) { return (<MainCategoryAccordion key={parent.id} parent={parent} subcategories={categories.filter(function (cat) { return cat.parent_id === parent.id; })} onEditCategory={startEditing} onDeleteCategory={deleteCategory} onToggleStatus={toggleCategoryStatus} onToggleMenuVisibility={toggleMenuVisibility} editingCategory={editingCategory} formData={formData} setFormData={setFormData} onSave={saveCategory} onCancel={cancelEditing} isSaving={isSaving} handleNameChange={handleNameChange} parentCategories={parentCategories}/>); })}

              {/* Orphaned Subcategories */}
              {subCategories.filter(function (sub) { return !parentCategories.find(function (p) { return p.id === sub.parent_id; }); }).length > 0 && (<div className="border-2 border-dashed border-amber-200 rounded-lg p-4 bg-amber-50">
                  <div className="flex items-center gap-2 mb-3">
                    <lucide_react_1.FolderOpen className="h-5 w-5 text-amber-600"/>
                    <span className="font-semibold text-amber-800">
                      Orphaned Subcategories
                    </span>
                    <badge_1.Badge variant="secondary" className="bg-amber-100 text-amber-800">
                      Missing Parent
                    </badge_1.Badge>
                  </div>
                  <div className="space-y-2 ml-6">
                    {subCategories
                    .filter(function (sub) {
                    return !parentCategories.find(function (p) { return p.id === sub.parent_id; });
                })
                    .map(function (orphan) { return (<CategoryRow key={orphan.id} category={orphan} isSubcategory={true} onEdit={startEditing} onDelete={deleteCategory} onToggleStatus={toggleCategoryStatus} onToggleMenuVisibility={toggleMenuVisibility} editingCategory={editingCategory} formData={formData} setFormData={setFormData} onSave={saveCategory} onCancel={cancelEditing} isSaving={isSaving} handleNameChange={handleNameChange} parentCategories={parentCategories}/>); })}
                  </div>
                </div>)}
            </div>)}
        </card_1.CardContent>
      </card_1.Card>

      {/* Add New Category Form */}
      {isCreating && (<card_1.Card className="border-primary/20 bg-primary/5">
          <card_1.CardHeader>
            <card_1.CardTitle className="flex items-center justify-between">
              <span>Add New Category</span>
              <button_1.Button variant="outline" size="sm" onClick={cancelEditing}>
                Cancel
              </button_1.Button>
            </card_1.CardTitle>
          </card_1.CardHeader>
          <card_1.CardContent className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label_1.Label htmlFor="name">Category Name *</label_1.Label>
                  <input_1.Input id="name" value={formData.name} onChange={function (e) { return handleNameChange(e.target.value); }} placeholder="e.g., Birthday Flowers"/>
                </div>
                <div>
                  <label_1.Label htmlFor="slug">URL Slug *</label_1.Label>
                  <input_1.Input id="slug" value={formData.slug} onChange={function (e) {
                return setFormData(function (prev) { return (__assign(__assign({}, prev), { slug: e.target.value })); });
            }} placeholder="birthday-flowers"/>
                </div>
              </div>

              <div>
                <label_1.Label htmlFor="description">Description</label_1.Label>
                <textarea_1.Textarea id="description" value={formData.description} onChange={function (e) {
                return setFormData(function (prev) { return (__assign(__assign({}, prev), { description: e.target.value })); });
            }} placeholder="Beautiful flowers perfect for birthday celebrations..." rows={3}/>
              </div>

              <div>
                <single_image_upload_1.SingleImageUpload imageUrl={formData.image_url} onImageChange={function (imageUrl) {
                return setFormData(function (prev) { return (__assign(__assign({}, prev), { image_url: imageUrl })); });
            }} label="Category Image"/>
              </div>
            </div>

            {/* Category Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Category Settings</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label_1.Label htmlFor="parent_id">Parent Category</label_1.Label>
                  <select_1.Select value={formData.parent_id} onValueChange={function (value) {
                return setFormData(function (prev) { return (__assign(__assign({}, prev), { parent_id: value })); });
            }}>
                    <select_1.SelectTrigger>
                      <select_1.SelectValue placeholder="Select parent (optional)"/>
                    </select_1.SelectTrigger>
                    <select_1.SelectContent>
                      <select_1.SelectItem value="none">
                        Main Category (No Parent)
                      </select_1.SelectItem>
                      {parentCategories.map(function (category) { return (<select_1.SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </select_1.SelectItem>); })}
                    </select_1.SelectContent>
                  </select_1.Select>
                </div>

                <div>
                  <label_1.Label htmlFor="sort_order">Sort Order</label_1.Label>
                  <input_1.Input id="sort_order" type="number" value={formData.sort_order} onChange={function (e) {
                return setFormData(function (prev) { return (__assign(__assign({}, prev), { sort_order: e.target.value })); });
            }} placeholder="1"/>
                </div>
              </div>

              <div className="flex flex-col space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label_1.Label htmlFor="is_active">Active Status</label_1.Label>
                    <p className="text-sm text-muted-foreground">
                      Active categories are visible to customers
                    </p>
                  </div>
                  <switch_1.Switch id="is_active" checked={formData.is_active} onCheckedChange={function (checked) {
                return setFormData(function (prev) { return (__assign(__assign({}, prev), { is_active: checked })); });
            }}/>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label_1.Label htmlFor="show_in_menu">Show in Menu</label_1.Label>
                    <p className="text-sm text-muted-foreground">
                      Display this category in the navigation menu
                    </p>
                  </div>
                  <switch_1.Switch id="show_in_menu" checked={formData.show_in_menu} onCheckedChange={function (checked) {
                return setFormData(function (prev) { return (__assign(__assign({}, prev), { show_in_menu: checked })); });
            }}/>
                </div>
              </div>
            </div>

            {/* SEO Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">SEO Settings</h3>

              <div>
                <label_1.Label htmlFor="meta_title">Meta Title</label_1.Label>
                <input_1.Input id="meta_title" value={formData.meta_title} onChange={function (e) {
                return setFormData(function (prev) { return (__assign(__assign({}, prev), { meta_title: e.target.value })); });
            }} placeholder="Birthday Flowers - Fresh Delivery | Florist in India"/>
              </div>

              <div>
                <label_1.Label htmlFor="meta_description">Meta Description</label_1.Label>
                <textarea_1.Textarea id="meta_description" value={formData.meta_description} onChange={function (e) {
                return setFormData(function (prev) { return (__assign(__assign({}, prev), { meta_description: e.target.value })); });
            }} placeholder="Order beautiful birthday flowers with same-day delivery across India..." rows={2}/>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-2 pt-4 border-t">
              <button_1.Button variant="outline" onClick={cancelEditing}>
                Cancel
              </button_1.Button>
              <button_1.Button onClick={saveCategory} disabled={isSaving}>
                {isSaving ? "Saving..." : "Create Category"}
              </button_1.Button>
            </div>
          </card_1.CardContent>
        </card_1.Card>)}
    </div>);
}
