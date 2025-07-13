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
exports.default = MenuBar;
var react_1 = require("react");
var dnd_1 = require("@hello-pangea/dnd");
var lucide_react_1 = require("lucide-react");
var button_1 = require("@/components/ui/button");
var card_1 = require("@/components/ui/card");
var badge_1 = require("@/components/ui/badge");
var input_1 = require("@/components/ui/input");
var label_1 = require("@/components/ui/label");
var textarea_1 = require("@/components/ui/textarea");
var switch_1 = require("@/components/ui/switch");
var dialog_1 = require("@/components/ui/dialog");
var select_1 = require("@/components/ui/select");
var supabase_1 = require("@/lib/supabase");
var use_toast_1 = require("@/hooks/use-toast");
function MenuBar() {
    var _this = this;
    var _a = (0, react_1.useState)([]), menuItems = _a[0], setMenuItems = _a[1];
    var _b = (0, react_1.useState)([]), categories = _b[0], setCategories = _b[1];
    var _c = (0, react_1.useState)({
        header_banner_text: "🌸 Free Delivery on Orders Above ₹999 🌸",
        header_banner_enabled: true,
    }), headerSettings = _c[0], setHeaderSettings = _c[1];
    var _d = (0, react_1.useState)(true), isLoading = _d[0], setIsLoading = _d[1];
    var _e = (0, react_1.useState)(false), isEditingBanner = _e[0], setIsEditingBanner = _e[1];
    var _f = (0, react_1.useState)(""), bannerText = _f[0], setBannerText = _f[1];
    var _g = (0, react_1.useState)(true), bannerEnabled = _g[0], setBannerEnabled = _g[1];
    var _h = (0, react_1.useState)(null), editingMenuItem = _h[0], setEditingMenuItem = _h[1];
    var _j = (0, react_1.useState)(false), isAddingMenuItem = _j[0], setIsAddingMenuItem = _j[1];
    var currentFormData = (0, react_1.useRef)({});
    (0, react_1.useEffect)(function () {
        fetchData();
    }, []);
    function fetchData() {
        return __awaiter(this, void 0, void 0, function () {
            var error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, 3, 4]);
                        setIsLoading(true);
                        return [4 /*yield*/, Promise.all([
                                fetchMenuItems(),
                                fetchCategories(),
                                fetchHeaderSettings(),
                            ])];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 2:
                        error_1 = _a.sent();
                        console.error("Failed to fetch data:", error_1);
                        (0, use_toast_1.toast)({
                            title: "Error",
                            description: "Failed to load menu data. Please try again.",
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
    function fetchMenuItems() {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, supabase_1.supabase
                            .from("menu_items")
                            .select("\n        *,\n        product_categories (*)\n      ")
                            .is("parent_id", null)
                            .order("sort_order")];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error) {
                            console.error("Error fetching menu items:", error);
                            return [2 /*return*/];
                        }
                        setMenuItems(data || []);
                        return [2 /*return*/];
                }
            });
        });
    }
    function fetchCategories() {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, supabase_1.supabase
                            .from("product_categories")
                            .select("*")
                            .eq("is_active", true)
                            .order("name")];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error) {
                            console.error("Error fetching categories:", error);
                            return [2 /*return*/];
                        }
                        setCategories(data || []);
                        return [2 /*return*/];
                }
            });
        });
    }
    function fetchHeaderSettings() {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error, settings;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, supabase_1.supabase
                            .from("site_settings")
                            .select("*")
                            .in("key", ["header_banner_text", "header_banner_enabled"])];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error) {
                            console.error("Error fetching header settings:", error);
                            return [2 /*return*/];
                        }
                        settings = {
                            header_banner_text: "🌸 Free Delivery on Orders Above ₹999 🌸",
                            header_banner_enabled: true,
                        };
                        data === null || data === void 0 ? void 0 : data.forEach(function (setting) {
                            if (setting.key === "header_banner_text") {
                                settings.header_banner_text = setting.value;
                            }
                            else if (setting.key === "header_banner_enabled") {
                                settings.header_banner_enabled = setting.value === "true";
                            }
                        });
                        setHeaderSettings(settings);
                        setBannerText(settings.header_banner_text);
                        setBannerEnabled(settings.header_banner_enabled);
                        return [2 /*return*/];
                }
            });
        });
    }
    function handleDragEnd(result) {
        return __awaiter(this, void 0, void 0, function () {
            var items, reorderedItem, updatedItems, updates, _i, updates_1, update, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!result.destination)
                            return [2 /*return*/];
                        items = Array.from(menuItems);
                        reorderedItem = items.splice(result.source.index, 1)[0];
                        items.splice(result.destination.index, 0, reorderedItem);
                        updatedItems = items.map(function (item, index) { return (__assign(__assign({}, item), { sort_order: index + 1 })); });
                        setMenuItems(updatedItems);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 6, , 7]);
                        updates = updatedItems.map(function (item) { return ({
                            id: item.id,
                            sort_order: item.sort_order,
                        }); });
                        _i = 0, updates_1 = updates;
                        _a.label = 2;
                    case 2:
                        if (!(_i < updates_1.length)) return [3 /*break*/, 5];
                        update = updates_1[_i];
                        return [4 /*yield*/, supabase_1.supabase
                                .from("menu_items")
                                .update({ sort_order: update.sort_order })
                                .eq("id", update.id)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5:
                        (0, use_toast_1.toast)({
                            title: "Success",
                            description: "Menu items reordered successfully.",
                        });
                        return [3 /*break*/, 7];
                    case 6:
                        error_2 = _a.sent();
                        console.error("Error updating sort order:", error_2);
                        (0, use_toast_1.toast)({
                            title: "Error",
                            description: "Failed to reorder menu items.",
                            variant: "destructive",
                        });
                        fetchMenuItems(); // Revert
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        });
    }
    function toggleMenuItemVisibility(id, currentState) {
        return __awaiter(this, void 0, void 0, function () {
            var error, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, supabase_1.supabase
                                .from("menu_items")
                                .update({ is_active: !currentState })
                                .eq("id", id)];
                    case 1:
                        error = (_a.sent()).error;
                        if (error)
                            throw error;
                        setMenuItems(function (prev) {
                            return prev.map(function (item) {
                                return item.id === id ? __assign(__assign({}, item), { is_active: !currentState }) : item;
                            });
                        });
                        (0, use_toast_1.toast)({
                            title: "Success",
                            description: "Menu item ".concat(!currentState ? "activated" : "deactivated", "."),
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_3 = _a.sent();
                        console.error("Error updating menu item:", error_3);
                        (0, use_toast_1.toast)({
                            title: "Error",
                            description: "Failed to update menu item.",
                            variant: "destructive",
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    }
    function deleteMenuItem(id) {
        return __awaiter(this, void 0, void 0, function () {
            var error, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!confirm("Are you sure you want to delete this menu item?"))
                            return [2 /*return*/];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, supabase_1.supabase.from("menu_items").delete().eq("id", id)];
                    case 2:
                        error = (_a.sent()).error;
                        if (error)
                            throw error;
                        setMenuItems(function (prev) { return prev.filter(function (item) { return item.id !== id; }); });
                        (0, use_toast_1.toast)({
                            title: "Success",
                            description: "Menu item deleted successfully.",
                        });
                        return [3 /*break*/, 4];
                    case 3:
                        error_4 = _a.sent();
                        console.error("Error deleting menu item:", error_4);
                        (0, use_toast_1.toast)({
                            title: "Error",
                            description: "Failed to delete menu item.",
                            variant: "destructive",
                        });
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    }
    function saveHeaderBanner() {
        return __awaiter(this, void 0, void 0, function () {
            var error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        // Update or insert header banner text
                        return [4 /*yield*/, supabase_1.supabase.from("site_settings").upsert({
                                key: "header_banner_text",
                                value: bannerText,
                                type: "text",
                                description: "Header banner text displayed in top bar",
                            })];
                    case 1:
                        // Update or insert header banner text
                        _a.sent();
                        // Update or insert header banner enabled status
                        return [4 /*yield*/, supabase_1.supabase.from("site_settings").upsert({
                                key: "header_banner_enabled",
                                value: bannerEnabled.toString(),
                                type: "boolean",
                                description: "Whether header banner is displayed",
                            })];
                    case 2:
                        // Update or insert header banner enabled status
                        _a.sent();
                        setHeaderSettings({
                            header_banner_text: bannerText,
                            header_banner_enabled: bannerEnabled,
                        });
                        setIsEditingBanner(false);
                        (0, use_toast_1.toast)({
                            title: "Success",
                            description: "Header banner updated successfully.",
                        });
                        return [3 /*break*/, 4];
                    case 3:
                        error_5 = _a.sent();
                        console.error("Error updating header banner:", error_5);
                        (0, use_toast_1.toast)({
                            title: "Error",
                            description: "Failed to update header banner.",
                            variant: "destructive",
                        });
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    }
    function saveMenuItem(formData) {
        return __awaiter(this, void 0, void 0, function () {
            var error, nextSortOrder, error, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        if (!editingMenuItem) return [3 /*break*/, 2];
                        return [4 /*yield*/, supabase_1.supabase
                                .from("menu_items")
                                .update({
                                name: formData.name,
                                category_id: formData.category_id || null,
                                url: formData.url || null,
                                target: formData.target || "_self",
                                is_active: formData.is_active,
                            })
                                .eq("id", editingMenuItem.id)];
                    case 1:
                        error = (_a.sent()).error;
                        if (error)
                            throw error;
                        return [3 /*break*/, 4];
                    case 2:
                        nextSortOrder = Math.max.apply(Math, __spreadArray(__spreadArray([], menuItems.map(function (item) { return item.sort_order; }), false), [0], false)) + 1;
                        return [4 /*yield*/, supabase_1.supabase.from("menu_items").insert({
                                name: formData.name,
                                category_id: formData.category_id || null,
                                url: formData.url || null,
                                target: formData.target || "_self",
                                is_active: formData.is_active,
                                sort_order: nextSortOrder,
                            })];
                    case 3:
                        error = (_a.sent()).error;
                        if (error)
                            throw error;
                        _a.label = 4;
                    case 4: return [4 /*yield*/, fetchMenuItems()];
                    case 5:
                        _a.sent();
                        setEditingMenuItem(null);
                        setIsAddingMenuItem(false);
                        (0, use_toast_1.toast)({
                            title: "Success",
                            description: "Menu item ".concat(editingMenuItem ? "updated" : "created", " successfully."),
                        });
                        return [3 /*break*/, 7];
                    case 6:
                        error_6 = _a.sent();
                        console.error("Error saving menu item:", error_6);
                        (0, use_toast_1.toast)({
                            title: "Error",
                            description: "Failed to save menu item.",
                            variant: "destructive",
                        });
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        });
    }
    if (isLoading) {
        return (<div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full"></div>
      </div>);
    }
    return (<div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Menu Bar Management</h1>
        <p className="text-muted-foreground">
          Manage your website navigation menu and header banner text.
        </p>
      </div>

      {/* Header Banner Settings */}
      <card_1.Card>
        <card_1.CardHeader>
          <card_1.CardTitle className="flex items-center gap-2">
            <lucide_react_1.MessageSquare className="w-5 h-5"/>
            Header Banner Settings
          </card_1.CardTitle>
        </card_1.CardHeader>
        <card_1.CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Current Banner Text:</p>
              <p className="text-sm text-muted-foreground">
                {headerSettings.header_banner_enabled
            ? headerSettings.header_banner_text
            : "Banner is currently disabled"}
              </p>
            </div>
            <button_1.Button variant="outline" onClick={function () { return setIsEditingBanner(true); }}>
              <lucide_react_1.Edit className="w-4 h-4 mr-2"/>
              Edit Banner
            </button_1.Button>
          </div>

          <div className="flex items-center gap-2">
            <switch_1.Switch checked={headerSettings.header_banner_enabled} onCheckedChange={function (checked) { return __awaiter(_this, void 0, void 0, function () {
            var error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        setBannerEnabled(checked);
                        setHeaderSettings(function (prev) { return (__assign(__assign({}, prev), { header_banner_enabled: checked })); });
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, supabase_1.supabase.from("site_settings").upsert({
                                key: "header_banner_enabled",
                                value: checked.toString(),
                                type: "boolean",
                                description: "Whether header banner is displayed",
                            })];
                    case 2:
                        _a.sent();
                        (0, use_toast_1.toast)({
                            title: "Success",
                            description: "Header banner ".concat(checked ? "enabled" : "disabled", "."),
                        });
                        return [3 /*break*/, 4];
                    case 3:
                        error_7 = _a.sent();
                        console.error("Error updating banner visibility:", error_7);
                        (0, use_toast_1.toast)({
                            title: "Error",
                            description: "Failed to update banner visibility.",
                            variant: "destructive",
                        });
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); }}/>
            <label_1.Label>Show header banner</label_1.Label>
          </div>
        </card_1.CardContent>
      </card_1.Card>

      {/* Menu Items */}
      <card_1.Card>
        <card_1.CardHeader className="flex flex-row items-center justify-between">
          <card_1.CardTitle className="flex items-center gap-2">
            <lucide_react_1.Menu className="w-5 h-5"/>
            Navigation Menu Items
          </card_1.CardTitle>
          <button_1.Button onClick={function () { return setIsAddingMenuItem(true); }}>
            <lucide_react_1.Plus className="w-4 h-4 mr-2"/>
            Add Menu Item
          </button_1.Button>
        </card_1.CardHeader>
        <card_1.CardContent>
          {menuItems.length === 0 ? (<div className="text-center py-12">
              <lucide_react_1.Menu className="w-12 h-12 mx-auto mb-4 text-muted-foreground"/>
              <h3 className="text-lg font-semibold mb-2">No menu items yet</h3>
              <p className="text-muted-foreground mb-4">
                Add your first menu item to start building your navigation
              </p>
              <button_1.Button onClick={function () { return setIsAddingMenuItem(true); }}>
                <lucide_react_1.Plus className="w-4 h-4 mr-2"/>
                Add Menu Item
              </button_1.Button>
            </div>) : (<dnd_1.DragDropContext onDragEnd={handleDragEnd}>
              <dnd_1.Droppable droppableId="menu-items">
                {function (provided) { return (<div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                    {menuItems.map(function (item, index) { return (<dnd_1.Draggable key={item.id} draggableId={item.id} index={index}>
                        {function (provided, snapshot) { return (<div ref={provided.innerRef} {...provided.draggableProps} className={"border rounded-lg p-4 bg-white ".concat(snapshot.isDragging
                            ? "shadow-lg rotate-2"
                            : "shadow-sm")}>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div {...provided.dragHandleProps} className="cursor-grab active:cursor-grabbing">
                                  <lucide_react_1.GripVertical className="w-5 h-5 text-muted-foreground"/>
                                </div>
                                <div className="w-10 h-10 bg-gradient-rose rounded-lg flex items-center justify-center">
                                  {item.category_id ? (<lucide_react_1.Link className="w-5 h-5 text-white"/>) : (<lucide_react_1.Link className="w-5 h-5 text-white"/>)}
                                </div>
                                <div>
                                  <h3 className="font-semibold">{item.name}</h3>
                                  <p className="text-sm text-muted-foreground">
                                    {item.product_categories
                            ? "Category: ".concat(item.product_categories.name)
                            : item.url
                                ? "Custom URL: ".concat(item.url)
                                : "No link defined"}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <badge_1.Badge variant={item.is_active ? "default" : "secondary"}>
                                  {item.is_active ? "Active" : "Hidden"}
                                </badge_1.Badge>
                                <switch_1.Switch checked={item.is_active} onCheckedChange={function () {
                            return toggleMenuItemVisibility(item.id, item.is_active);
                        }}/>
                                <button_1.Button variant="ghost" size="icon" onClick={function () { return setEditingMenuItem(item); }}>
                                  <lucide_react_1.Edit className="w-4 h-4"/>
                                </button_1.Button>
                                <button_1.Button variant="ghost" size="icon" onClick={function () { return deleteMenuItem(item.id); }}>
                                  <lucide_react_1.Trash2 className="w-4 h-4 text-red-600"/>
                                </button_1.Button>
                              </div>
                            </div>
                          </div>); }}
                      </dnd_1.Draggable>); })}
                    {provided.placeholder}
                  </div>); }}
              </dnd_1.Droppable>
            </dnd_1.DragDropContext>)}
        </card_1.CardContent>
      </card_1.Card>

      {/* Edit Banner Dialog */}
      <dialog_1.Dialog open={isEditingBanner} onOpenChange={setIsEditingBanner}>
        <dialog_1.DialogContent className="max-w-2xl">
          <dialog_1.DialogHeader>
            <dialog_1.DialogTitle>Edit Header Banner</dialog_1.DialogTitle>
          </dialog_1.DialogHeader>
          <div className="space-y-4">
            <div>
              <label_1.Label htmlFor="banner-text">Banner Text</label_1.Label>
              <textarea_1.Textarea id="banner-text" value={bannerText} onChange={function (e) { return setBannerText(e.target.value); }} placeholder="Enter your header banner text..." className="mt-1" rows={3}/>
              <p className="text-sm text-muted-foreground mt-1">
                This text will appear in the top bar of your website. You can
                use emojis and special characters.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <switch_1.Switch checked={bannerEnabled} onCheckedChange={setBannerEnabled}/>
              <label_1.Label>Enable banner display</label_1.Label>
            </div>

            <div className="flex justify-end gap-2">
              <button_1.Button variant="outline" onClick={function () {
            setIsEditingBanner(false);
            setBannerText(headerSettings.header_banner_text);
            setBannerEnabled(headerSettings.header_banner_enabled);
        }}>
                Cancel
              </button_1.Button>
              <button_1.Button onClick={saveHeaderBanner}>
                <lucide_react_1.Save className="w-4 h-4 mr-2"/>
                Save Banner
              </button_1.Button>
            </div>
          </div>
        </dialog_1.DialogContent>
      </dialog_1.Dialog>

      {/* Add/Edit Menu Item Dialog */}
      <dialog_1.Dialog open={!!editingMenuItem || isAddingMenuItem} onOpenChange={function () {
            setEditingMenuItem(null);
            setIsAddingMenuItem(false);
        }}>
        <dialog_1.DialogContent className="max-w-2xl">
          <dialog_1.DialogHeader>
            <dialog_1.DialogTitle>
              {editingMenuItem ? "Edit Menu Item" : "Add Menu Item"}
            </dialog_1.DialogTitle>
          </dialog_1.DialogHeader>
          <MenuItemForm menuItem={editingMenuItem} categories={categories} onSave={saveMenuItem} onCancel={function () {
            setEditingMenuItem(null);
            setIsAddingMenuItem(false);
        }}/>
        </dialog_1.DialogContent>
      </dialog_1.Dialog>
    </div>);
}
function MenuItemForm(_a) {
    var _b;
    var menuItem = _a.menuItem, categories = _a.categories, onSave = _a.onSave, onCancel = _a.onCancel;
    var _c = (0, react_1.useState)({
        name: (menuItem === null || menuItem === void 0 ? void 0 : menuItem.name) || "",
        category_id: (menuItem === null || menuItem === void 0 ? void 0 : menuItem.category_id) || "",
        url: (menuItem === null || menuItem === void 0 ? void 0 : menuItem.url) || "",
        target: (menuItem === null || menuItem === void 0 ? void 0 : menuItem.target) || "_self",
        is_active: (_b = menuItem === null || menuItem === void 0 ? void 0 : menuItem.is_active) !== null && _b !== void 0 ? _b : true,
        link_type: (menuItem === null || menuItem === void 0 ? void 0 : menuItem.category_id) ? "category" : "url",
    }), formData = _c[0], setFormData = _c[1];
    return (<div className="space-y-4">
      <div>
        <label_1.Label htmlFor="name">Menu Item Name</label_1.Label>
        <input_1.Input id="name" value={formData.name} onChange={function (e) { return setFormData(__assign(__assign({}, formData), { name: e.target.value })); }} placeholder="e.g., Birthday Flowers" className="mt-1"/>
      </div>

      <div>
        <label_1.Label>Link Type</label_1.Label>
        <select_1.Select value={formData.link_type} onValueChange={function (value) {
            return setFormData(__assign(__assign({}, formData), { link_type: value, category_id: value === "category" ? formData.category_id : "", url: value === "url" ? formData.url : "" }));
        }}>
          <select_1.SelectTrigger className="mt-1">
            <select_1.SelectValue />
          </select_1.SelectTrigger>
          <select_1.SelectContent>
            <select_1.SelectItem value="category">Link to Category</select_1.SelectItem>
            <select_1.SelectItem value="url">Custom URL</select_1.SelectItem>
          </select_1.SelectContent>
        </select_1.Select>
      </div>

      {formData.link_type === "category" && (<div>
          <label_1.Label>Category</label_1.Label>
          <select_1.Select value={formData.category_id} onValueChange={function (value) {
                return setFormData(__assign(__assign({}, formData), { category_id: value }));
            }}>
            <select_1.SelectTrigger className="mt-1">
              <select_1.SelectValue placeholder="Select a category"/>
            </select_1.SelectTrigger>
            <select_1.SelectContent>
              {categories.map(function (category) { return (<select_1.SelectItem key={category.id} value={category.id}>
                  {category.name}
                </select_1.SelectItem>); })}
            </select_1.SelectContent>
          </select_1.Select>
        </div>)}

      {formData.link_type === "url" && (<div>
          <label_1.Label htmlFor="url">Custom URL</label_1.Label>
          <input_1.Input id="url" value={formData.url} onChange={function (e) { return setFormData(__assign(__assign({}, formData), { url: e.target.value })); }} placeholder="e.g., /about or https://example.com" className="mt-1"/>
        </div>)}

      <div>
        <label_1.Label>Link Target</label_1.Label>
        <select_1.Select value={formData.target} onValueChange={function (value) {
            return setFormData(__assign(__assign({}, formData), { target: value }));
        }}>
          <select_1.SelectTrigger className="mt-1">
            <select_1.SelectValue />
          </select_1.SelectTrigger>
          <select_1.SelectContent>
            <select_1.SelectItem value="_self">Same Tab</select_1.SelectItem>
            <select_1.SelectItem value="_blank">New Tab</select_1.SelectItem>
          </select_1.SelectContent>
        </select_1.Select>
      </div>

      <div className="flex items-center gap-2">
        <switch_1.Switch checked={formData.is_active} onCheckedChange={function (checked) {
            return setFormData(__assign(__assign({}, formData), { is_active: checked }));
        }}/>
        <label_1.Label>Active (visible in navigation)</label_1.Label>
      </div>

      <div className="flex justify-end gap-2">
        <button_1.Button variant="outline" onClick={onCancel}>
          Cancel
        </button_1.Button>
        <button_1.Button onClick={function () { return onSave(formData); }} disabled={!formData.name ||
            (formData.link_type === "category" && !formData.category_id) ||
            (formData.link_type === "url" && !formData.url)}>
          <lucide_react_1.Save className="w-4 h-4 mr-2"/>
          Save Menu Item
        </button_1.Button>
      </div>
    </div>);
}
