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
exports.default = HomepageBuilder;
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
var supabase_1 = require("@/lib/supabase");
var single_image_upload_1 = require("@/components/ui/single-image-upload");
var sectionLibrary_1 = require("@/lib/sectionLibrary");
// Using unified section templates from lib/sectionLibrary.ts
var sectionTemplates = (0, sectionLibrary_1.getSectionTemplatesForPage)("homepage");
function HomepageBuilder() {
    var _a = (0, react_1.useState)([]), sections = _a[0], setSections = _a[1];
    var _b = (0, react_1.useState)(true), isLoading = _b[0], setIsLoading = _b[1];
    var _c = (0, react_1.useState)(null), editingSection = _c[0], setEditingSection = _c[1];
    var _d = (0, react_1.useState)(false), isAddingSection = _d[0], setIsAddingSection = _d[1];
    var _e = (0, react_1.useState)(false), hasChanges = _e[0], setHasChanges = _e[1];
    var currentFormData = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(function () {
        fetchSections();
    }, []);
    function fetchSections() {
        return __awaiter(this, void 0, void 0, function () {
            var data, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, 3, 4]);
                        return [4 /*yield*/, supabase_1.supabase
                                .from("homepage_sections")
                                .select("*")
                                .order("sort_order")];
                    case 1:
                        data = (_a.sent()).data;
                        if (data) {
                            setSections(data);
                        }
                        return [3 /*break*/, 4];
                    case 2:
                        error_1 = _a.sent();
                        console.error("Failed to fetch sections:", error_1);
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
            var items, reorderedItem, updatedItems, _i, updatedItems_1, item, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!result.destination)
                            return [2 /*return*/];
                        items = Array.from(sections);
                        reorderedItem = items.splice(result.source.index, 1)[0];
                        items.splice(result.destination.index, 0, reorderedItem);
                        updatedItems = items.map(function (item, index) { return (__assign(__assign({}, item), { sort_order: index })); });
                        setSections(updatedItems);
                        setHasChanges(true);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 6, , 7]);
                        _i = 0, updatedItems_1 = updatedItems;
                        _a.label = 2;
                    case 2:
                        if (!(_i < updatedItems_1.length)) return [3 /*break*/, 5];
                        item = updatedItems_1[_i];
                        return [4 /*yield*/, supabase_1.supabase
                                .from("homepage_sections")
                                .update({ sort_order: item.sort_order })
                                .eq("id", item.id)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        error_2 = _a.sent();
                        console.error("Failed to update section order:", error_2);
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        });
    }
    function toggleSectionVisibility(sectionId, isActive) {
        return __awaiter(this, void 0, void 0, function () {
            var error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, supabase_1.supabase
                                .from("homepage_sections")
                                .update({ is_active: !isActive })
                                .eq("id", sectionId)];
                    case 1:
                        _a.sent();
                        setSections(sections.map(function (section) {
                            return section.id === sectionId
                                ? __assign(__assign({}, section), { is_active: !isActive }) : section;
                        }));
                        return [3 /*break*/, 3];
                    case 2:
                        error_3 = _a.sent();
                        console.error("Failed to toggle section visibility:", error_3);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    }
    function deleteSection(sectionId) {
        return __awaiter(this, void 0, void 0, function () {
            var error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!confirm("Are you sure you want to delete this section?"))
                            return [2 /*return*/];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, supabase_1.supabase.from("homepage_sections").delete().eq("id", sectionId)];
                    case 2:
                        _a.sent();
                        setSections(sections.filter(function (section) { return section.id !== sectionId; }));
                        return [3 /*break*/, 4];
                    case 3:
                        error_4 = _a.sent();
                        console.error("Failed to delete section:", error_4);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    }
    function addSection(template) {
        return __awaiter(this, void 0, void 0, function () {
            var newSection, _a, data, error, error_5, errorMessage;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        newSection = {
                            type: template.type,
                            title: template.name,
                            subtitle: "",
                            content: template.defaultContent,
                            settings: {},
                            is_active: true,
                            sort_order: sections.length,
                        };
                        console.log("Attempting to insert new section:", newSection);
                        console.log("Template defaultContent:", template.defaultContent);
                        return [4 /*yield*/, supabase_1.supabase
                                .from("homepage_sections")
                                .insert(newSection)
                                .select()
                                .single()];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        console.log("Supabase response:", { data: data, error: error });
                        if (error)
                            throw error;
                        setSections(__spreadArray(__spreadArray([], sections, true), [data], false));
                        setIsAddingSection(false);
                        return [3 /*break*/, 3];
                    case 2:
                        error_5 = _b.sent();
                        console.error("Failed to add section:", error_5);
                        console.error("Error type:", typeof error_5);
                        console.error("Error keys:", Object.keys(error_5 || {}));
                        console.error("Full error object:", error_5);
                        errorMessage = "Unknown error";
                        try {
                            if (error_5 === null || error_5 === void 0 ? void 0 : error_5.message) {
                                errorMessage = error_5.message;
                            }
                            else if (error_5 === null || error_5 === void 0 ? void 0 : error_5.error_description) {
                                errorMessage = error_5.error_description;
                            }
                            else if (error_5 === null || error_5 === void 0 ? void 0 : error_5.details) {
                                errorMessage = error_5.details;
                            }
                            else if (error_5 === null || error_5 === void 0 ? void 0 : error_5.hint) {
                                errorMessage = error_5.hint;
                            }
                            else if (typeof error_5 === "string") {
                                errorMessage = error_5;
                            }
                            else if (error_5 === null || error_5 === void 0 ? void 0 : error_5.code) {
                                errorMessage = "Database error (".concat(error_5.code, "): ").concat(error_5.hint || error_5.message || "Unknown database error");
                            }
                            else {
                                // Try to extract any meaningful text from the error
                                errorMessage = String(error_5);
                            }
                        }
                        catch (stringifyError) {
                            errorMessage = "Error occurred but could not extract details";
                        }
                        alert("Failed to add section: ".concat(errorMessage));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    }
    function updateSection(sectionId, updates) {
        return __awaiter(this, void 0, void 0, function () {
            var error_6, errorMessage;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, supabase_1.supabase
                                .from("homepage_sections")
                                .update(updates)
                                .eq("id", sectionId)];
                    case 1:
                        _a.sent();
                        setSections(sections.map(function (section) {
                            return section.id === sectionId ? __assign(__assign({}, section), updates) : section;
                        }));
                        setEditingSection(null);
                        return [3 /*break*/, 3];
                    case 2:
                        error_6 = _a.sent();
                        console.error("Failed to update section:", error_6);
                        errorMessage = "Unknown error";
                        if (error_6 === null || error_6 === void 0 ? void 0 : error_6.message) {
                            errorMessage = error_6.message;
                        }
                        else if (error_6 === null || error_6 === void 0 ? void 0 : error_6.error_description) {
                            errorMessage = error_6.error_description;
                        }
                        else if (error_6 === null || error_6 === void 0 ? void 0 : error_6.details) {
                            errorMessage = error_6.details;
                        }
                        else if (typeof error_6 === "string") {
                            errorMessage = error_6;
                        }
                        else if (error_6 === null || error_6 === void 0 ? void 0 : error_6.code) {
                            errorMessage = "Error ".concat(error_6.code, ": ").concat(error_6.hint || "Database error");
                        }
                        alert("Failed to update section: ".concat(errorMessage));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    }
    function getSectionIcon(type) {
        var template = sectionTemplates.find(function (t) { return t.type === type; });
        return (template === null || template === void 0 ? void 0 : template.icon) || lucide_react_1.Type;
    }
    function getSectionName(type) {
        var template = sectionTemplates.find(function (t) { return t.type === type; });
        return (template === null || template === void 0 ? void 0 : template.name) || type;
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
          <h1 className="text-2xl font-bold">Homepage Builder</h1>
          <p className="text-muted-foreground">
            Drag and drop to reorder sections, edit content, and manage your
            homepage
          </p>
        </div>
        <div className="flex gap-2">
          <button_1.Button onClick={function () { return setIsAddingSection(true); }} className="flex items-center gap-2">
            <lucide_react_1.Plus className="w-4 h-4"/>
            Add Section
          </button_1.Button>
          <button_1.Button variant="outline" asChild>
            <a href="/" target="_blank" rel="noopener noreferrer">
              <lucide_react_1.Eye className="w-4 h-4 mr-2"/>
              Preview Site
            </a>
          </button_1.Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <card_1.Card>
          <card_1.CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Sections</p>
                <p className="text-2xl font-bold">{sections.length}</p>
              </div>
              <lucide_react_1.Grid3x3 className="w-8 h-8 text-muted-foreground"/>
            </div>
          </card_1.CardContent>
        </card_1.Card>
        <card_1.Card>
          <card_1.CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold">
                  {sections.filter(function (s) { return s.is_active; }).length}
                </p>
              </div>
              <lucide_react_1.Eye className="w-8 h-8 text-green-600"/>
            </div>
          </card_1.CardContent>
        </card_1.Card>
        <card_1.Card>
          <card_1.CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Hidden</p>
                <p className="text-2xl font-bold">
                  {sections.filter(function (s) { return !s.is_active; }).length}
                </p>
              </div>
              <lucide_react_1.EyeOff className="w-8 h-8 text-orange-600"/>
            </div>
          </card_1.CardContent>
        </card_1.Card>
        <card_1.Card>
          <card_1.CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Last Updated</p>
                <p className="text-sm font-medium">Just now</p>
              </div>
              <lucide_react_1.Save className="w-8 h-8 text-blue-600"/>
            </div>
          </card_1.CardContent>
        </card_1.Card>
      </div>

      {/* Sections List */}
      <card_1.Card>
        <card_1.CardHeader>
          <card_1.CardTitle>Homepage Sections</card_1.CardTitle>
        </card_1.CardHeader>
        <card_1.CardContent>
          {sections.length === 0 ? (<div className="text-center py-12">
              <lucide_react_1.Grid3x3 className="w-12 h-12 mx-auto mb-4 text-muted-foreground"/>
              <h3 className="text-lg font-semibold mb-2">No sections yet</h3>
              <p className="text-muted-foreground mb-4">
                Add your first section to start building your homepage
              </p>
              <button_1.Button onClick={function () { return setIsAddingSection(true); }}>
                <lucide_react_1.Plus className="w-4 h-4 mr-2"/>
                Add Section
              </button_1.Button>
            </div>) : (<dnd_1.DragDropContext onDragEnd={handleDragEnd}>
              <dnd_1.Droppable droppableId="sections">
                {function (provided) { return (<div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                    {sections.map(function (section, index) {
                    var IconComponent = getSectionIcon(section.type);
                    return (<dnd_1.Draggable key={section.id} draggableId={section.id} index={index}>
                          {function (provided, snapshot) { return (<div ref={provided.innerRef} {...provided.draggableProps} className={"border rounded-lg p-4 bg-white ".concat(snapshot.isDragging
                                ? "shadow-lg rotate-2"
                                : "shadow-sm")}>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div {...provided.dragHandleProps} className="cursor-grab active:cursor-grabbing">
                                    <lucide_react_1.GripVertical className="w-5 h-5 text-muted-foreground"/>
                                  </div>
                                  <div className="w-10 h-10 bg-gradient-rose rounded-lg flex items-center justify-center">
                                    <IconComponent className="w-5 h-5 text-white"/>
                                  </div>
                                  <div>
                                    <h3 className="font-semibold">
                                      {section.title ||
                                getSectionName(section.type)}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                      {section.subtitle ||
                                "".concat(section.type, " section")}
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2">
                                  <badge_1.Badge variant={section.is_active
                                ? "default"
                                : "secondary"}>
                                    {section.is_active ? "Active" : "Hidden"}
                                  </badge_1.Badge>
                                  <switch_1.Switch checked={section.is_active} onCheckedChange={function () {
                                return toggleSectionVisibility(section.id, section.is_active);
                            }}/>
                                  <button_1.Button variant="ghost" size="icon" onClick={function () { return setEditingSection(section); }}>
                                    <lucide_react_1.Edit className="w-4 h-4"/>
                                  </button_1.Button>
                                  <button_1.Button variant="ghost" size="icon" onClick={function () { return deleteSection(section.id); }}>
                                    <lucide_react_1.Trash2 className="w-4 h-4 text-red-600"/>
                                  </button_1.Button>
                                </div>
                              </div>
                            </div>); }}
                        </dnd_1.Draggable>);
                })}
                    {provided.placeholder}
                  </div>); }}
              </dnd_1.Droppable>
            </dnd_1.DragDropContext>)}
        </card_1.CardContent>
      </card_1.Card>

      {/* Add Section Dialog */}
      <dialog_1.Dialog open={isAddingSection} onOpenChange={setIsAddingSection}>
        <dialog_1.DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0">
          <dialog_1.DialogHeader className="px-6 py-4 border-b bg-white sticky top-0 z-10 shrink-0">
            <dialog_1.DialogTitle>Add New Section</dialog_1.DialogTitle>
          </dialog_1.DialogHeader>
          <div className="flex-1 overflow-y-auto px-6 py-4 min-h-0">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {sectionTemplates.map(function (template, index) { return (<card_1.Card key={"".concat(template.type, "-").concat(index)} className="cursor-pointer hover:bg-accent transition-colors" onClick={function () { return addSection(template); }}>
                  <card_1.CardContent className="p-4 text-center">
                    <template.icon className="w-8 h-8 mx-auto mb-2 text-primary"/>
                    <h3 className="font-semibold mb-1">{template.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {template.description}
                    </p>
                  </card_1.CardContent>
                </card_1.Card>); })}
            </div>
          </div>
        </dialog_1.DialogContent>
      </dialog_1.Dialog>

      {/* Edit Section Dialog */}
      <dialog_1.Dialog open={!!editingSection} onOpenChange={function () { return setEditingSection(null); }}>
        <dialog_1.DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0">
          <dialog_1.DialogHeader className="px-6 py-4 border-b bg-white sticky top-0 z-10 shrink-0">
            <dialog_1.DialogTitle>
              Edit {editingSection && getSectionName(editingSection.type)}
            </dialog_1.DialogTitle>
          </dialog_1.DialogHeader>

          <div className="flex-1 overflow-y-auto px-6 py-4 min-h-0">
            {editingSection && (<EditSectionFormContent key={editingSection.id} // Force re-render when section changes
         section={editingSection} onDataChange={function (formData) {
                // Store form data in a ref for saving
                currentFormData.current = formData;
            }}/>)}
          </div>

          <div className="px-6 py-4 border-t bg-white shrink-0">
            <div className="flex justify-end gap-2">
              <button_1.Button variant="outline" onClick={function () { return setEditingSection(null); }}>
                Cancel
              </button_1.Button>
              <button_1.Button onClick={function () {
            if (editingSection && currentFormData.current) {
                updateSection(editingSection.id, currentFormData.current);
            }
        }}>
                Save Changes
              </button_1.Button>
            </div>
          </div>
        </dialog_1.DialogContent>
      </dialog_1.Dialog>
    </div>);
}
// Edit Section Form Content Component (without footer)
function EditSectionFormContent(_a) {
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4;
    var section = _a.section, onDataChange = _a.onDataChange;
    var _5 = (0, react_1.useState)({
        title: section.title || "",
        subtitle: section.subtitle || "",
        content: section.content,
    }), formData = _5[0], setFormData = _5[1];
    var _6 = (0, react_1.useState)([]), availableProducts = _6[0], setAvailableProducts = _6[1];
    var _7 = (0, react_1.useState)([]), availableCategories = _7[0], setAvailableCategories = _7[1];
    var _8 = (0, react_1.useState)(false), isLoadingData = _8[0], setIsLoadingData = _8[1];
    (0, react_1.useEffect)(function () {
        if (section.type === "product_carousel" ||
            section.type === "category_grid") {
            fetchSelectableItems();
        }
    }, [section.type]);
    function fetchSelectableItems() {
        return __awaiter(this, void 0, void 0, function () {
            var products, categories, error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        setIsLoadingData(true);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 6, 7, 8]);
                        if (!(section.type === "product_carousel")) return [3 /*break*/, 3];
                        return [4 /*yield*/, supabase_1.supabase
                                .from("products")
                                .select("id, name, slug, price, sale_price, images")
                                .eq("is_active", true)
                                .order("name")];
                    case 2:
                        products = (_a.sent()).data;
                        if (products)
                            setAvailableProducts(products);
                        _a.label = 3;
                    case 3:
                        if (!(section.type === "category_grid")) return [3 /*break*/, 5];
                        return [4 /*yield*/, supabase_1.supabase
                                .from("product_categories")
                                .select("id, name, slug, image_url")
                                .eq("is_active", true)
                                .order("name")];
                    case 4:
                        categories = (_a.sent()).data;
                        if (categories)
                            setAvailableCategories(categories);
                        _a.label = 5;
                    case 5: return [3 /*break*/, 8];
                    case 6:
                        error_7 = _a.sent();
                        console.error("Failed to fetch selectable items:", error_7);
                        return [3 /*break*/, 8];
                    case 7:
                        setIsLoadingData(false);
                        return [7 /*endfinally*/];
                    case 8: return [2 /*return*/];
                }
            });
        });
    }
    // Sync form data changes with parent component
    (0, react_1.useEffect)(function () {
        onDataChange(formData);
    }, [formData, onDataChange]);
    function toggleProductSelection(productId) {
        var content = formData.content;
        var currentSelection = (content === null || content === void 0 ? void 0 : content.selected_products) || [];
        var newSelection = currentSelection.includes(productId)
            ? currentSelection.filter(function (id) { return id !== productId; })
            : __spreadArray(__spreadArray([], currentSelection, true), [productId], false);
        setFormData(__assign(__assign({}, formData), { content: __assign(__assign({}, content), { selected_products: newSelection }) }));
    }
    function toggleCategorySelection(categoryId) {
        var content = formData.content;
        var currentSelection = (content === null || content === void 0 ? void 0 : content.selected_categories) || [];
        var newSelection = currentSelection.includes(categoryId)
            ? currentSelection.filter(function (id) { return id !== categoryId; })
            : __spreadArray(__spreadArray([], currentSelection, true), [categoryId], false);
        setFormData(__assign(__assign({}, formData), { content: __assign(__assign({}, content), { selected_categories: newSelection }) }));
    }
    return (<div className="space-y-4">
      <div>
        <label_1.Label htmlFor="title">Title</label_1.Label>
        <input_1.Input id="title" value={formData.title} onChange={function (e) { return setFormData(__assign(__assign({}, formData), { title: e.target.value })); }} placeholder="Section title"/>
      </div>

      <div>
        <label_1.Label htmlFor="subtitle">Subtitle</label_1.Label>
        <input_1.Input id="subtitle" value={formData.subtitle} onChange={function (e) {
            return setFormData(__assign(__assign({}, formData), { subtitle: e.target.value }));
        }} placeholder="Section subtitle"/>
      </div>

      {/* Hero Section Specific Fields */}
      {section.type === "hero" && (<div className="space-y-6">
          {/* Description */}
          <div>
            <label_1.Label htmlFor="description">Description Text</label_1.Label>
            <textarea_1.Textarea id="description" value={((_b = formData.content) === null || _b === void 0 ? void 0 : _b.description) || ""} onChange={function (e) {
                return setFormData(__assign(__assign({}, formData), { content: __assign(__assign({}, formData.content), { description: e.target.value }) }));
            }} placeholder="Enter a compelling description for your hero section" rows={3}/>
            <p className="text-sm text-muted-foreground mt-1">
              This text appears below the main heading and subheading.
            </p>
          </div>

          {/* Primary CTA Button */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label_1.Label htmlFor="button_text">Primary Button Text</label_1.Label>
              <input_1.Input id="button_text" value={((_c = formData.content) === null || _c === void 0 ? void 0 : _c.button_text) || ""} onChange={function (e) {
                return setFormData(__assign(__assign({}, formData), { content: __assign(__assign({}, formData.content), { button_text: e.target.value }) }));
            }} placeholder="Shop Now"/>
            </div>
            <div>
              <label_1.Label htmlFor="button_link">Primary Button URL</label_1.Label>
              <input_1.Input id="button_link" value={((_d = formData.content) === null || _d === void 0 ? void 0 : _d.button_link) || ""} onChange={function (e) {
                return setFormData(__assign(__assign({}, formData), { content: __assign(__assign({}, formData.content), { button_link: e.target.value }) }));
            }} placeholder="/products"/>
            </div>
          </div>

          {/* Secondary CTA Button (Optional) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label_1.Label htmlFor="secondary_button_text">
                Secondary Button Text (Optional)
              </label_1.Label>
              <input_1.Input id="secondary_button_text" value={((_e = formData.content) === null || _e === void 0 ? void 0 : _e.secondary_button_text) || ""} onChange={function (e) {
                return setFormData(__assign(__assign({}, formData), { content: __assign(__assign({}, formData.content), { secondary_button_text: e.target.value }) }));
            }} placeholder="Learn More"/>
            </div>
            <div>
              <label_1.Label htmlFor="secondary_button_link">
                Secondary Button URL
              </label_1.Label>
              <input_1.Input id="secondary_button_link" value={((_f = formData.content) === null || _f === void 0 ? void 0 : _f.secondary_button_link) || ""} onChange={function (e) {
                return setFormData(__assign(__assign({}, formData), { content: __assign(__assign({}, formData.content), { secondary_button_link: e.target.value }) }));
            }} placeholder="/about"/>
            </div>
          </div>

          {/* Trust Indicators / Features */}
          <div className="space-y-4">
            <h4 className="font-medium">Trust Indicators</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label_1.Label htmlFor="feature_1">Feature 1</label_1.Label>
                <input_1.Input id="feature_1" value={((_g = formData.content) === null || _g === void 0 ? void 0 : _g.feature_1) || ""} onChange={function (e) {
                return setFormData(__assign(__assign({}, formData), { content: __assign(__assign({}, formData.content), { feature_1: e.target.value }) }));
            }} placeholder="Same Day Delivery"/>
              </div>
              <div>
                <label_1.Label htmlFor="feature_2">Feature 2</label_1.Label>
                <input_1.Input id="feature_2" value={((_h = formData.content) === null || _h === void 0 ? void 0 : _h.feature_2) || ""} onChange={function (e) {
                return setFormData(__assign(__assign({}, formData), { content: __assign(__assign({}, formData.content), { feature_2: e.target.value }) }));
            }} placeholder="Fresh Guarantee"/>
              </div>
            </div>
          </div>

          {/* Feature Box Content */}
          <div className="space-y-4">
            <h4 className="font-medium">Feature Box (Right Side)</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label_1.Label htmlFor="feature_box_emoji">Feature Box Emoji</label_1.Label>
                <input_1.Input id="feature_box_emoji" value={((_j = formData.content) === null || _j === void 0 ? void 0 : _j.feature_box_emoji) || ""} onChange={function (e) {
                return setFormData(__assign(__assign({}, formData), { content: __assign(__assign({}, formData.content), { feature_box_emoji: e.target.value }) }));
            }} placeholder="🌺"/>
              </div>
              <div>
                <label_1.Label htmlFor="feature_box_title">Feature Box Title</label_1.Label>
                <input_1.Input id="feature_box_title" value={((_k = formData.content) === null || _k === void 0 ? void 0 : _k.feature_box_title) || ""} onChange={function (e) {
                return setFormData(__assign(__assign({}, formData), { content: __assign(__assign({}, formData.content), { feature_box_title: e.target.value }) }));
            }} placeholder="Premium Quality"/>
              </div>
              <div>
                <label_1.Label htmlFor="feature_box_description">
                  Feature Box Description
                </label_1.Label>
                <input_1.Input id="feature_box_description" value={((_l = formData.content) === null || _l === void 0 ? void 0 : _l.feature_box_description) || ""} onChange={function (e) {
                return setFormData(__assign(__assign({}, formData), { content: __assign(__assign({}, formData.content), { feature_box_description: e.target.value }) }));
            }} placeholder="Hand-picked fresh flowers"/>
              </div>
            </div>
          </div>

          {/* Floating Emoji Elements */}
          <div className="space-y-4">
            <h4 className="font-medium">Floating Decorative Emojis</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label_1.Label htmlFor="floating_emoji_1">Floating Emoji 1</label_1.Label>
                <input_1.Input id="floating_emoji_1" value={((_m = formData.content) === null || _m === void 0 ? void 0 : _m.floating_emoji_1) || ""} onChange={function (e) {
                return setFormData(__assign(__assign({}, formData), { content: __assign(__assign({}, formData.content), { floating_emoji_1: e.target.value }) }));
            }} placeholder="🌸"/>
              </div>
              <div>
                <label_1.Label htmlFor="floating_emoji_2">Floating Emoji 2</label_1.Label>
                <input_1.Input id="floating_emoji_2" value={((_o = formData.content) === null || _o === void 0 ? void 0 : _o.floating_emoji_2) || ""} onChange={function (e) {
                return setFormData(__assign(__assign({}, formData), { content: __assign(__assign({}, formData.content), { floating_emoji_2: e.target.value }) }));
            }} placeholder="🌹"/>
              </div>
              <div>
                <label_1.Label htmlFor="floating_emoji_3">Floating Emoji 3</label_1.Label>
                <input_1.Input id="floating_emoji_3" value={((_p = formData.content) === null || _p === void 0 ? void 0 : _p.floating_emoji_3) || ""} onChange={function (e) {
                return setFormData(__assign(__assign({}, formData), { content: __assign(__assign({}, formData.content), { floating_emoji_3: e.target.value }) }));
            }} placeholder="🌻"/>
              </div>
              <div>
                <label_1.Label htmlFor="floating_emoji_4">Floating Emoji 4</label_1.Label>
                <input_1.Input id="floating_emoji_4" value={((_q = formData.content) === null || _q === void 0 ? void 0 : _q.floating_emoji_4) || ""} onChange={function (e) {
                return setFormData(__assign(__assign({}, formData), { content: __assign(__assign({}, formData.content), { floating_emoji_4: e.target.value }) }));
            }} placeholder="🌷"/>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Leave empty to hide specific floating emojis. These appear as
              floating decorative elements on the right side (desktop only).
            </p>
          </div>

          {/* Background Image */}
          <div>
            <single_image_upload_1.SingleImageUpload imageUrl={((_r = formData.content) === null || _r === void 0 ? void 0 : _r.background_image) || ""} onImageChange={function (imageUrl) {
                return setFormData(__assign(__assign({}, formData), { content: __assign(__assign({}, formData.content), { background_image: imageUrl }) }));
            }} label="Background Image" acceptedTypes={[".png", ".webp", ".jpg", ".jpeg"]} maxSizeMB={5} subdir="hero"/>
            <p className="text-sm text-muted-foreground mt-1">
              This image will be used as the background for the entire hero
              section. High-quality landscape images work best. If no image is
              uploaded, the default gradient background will be used.
            </p>
          </div>

          {/* Hero Section Settings */}
          <div className="border-t pt-4">
            <h4 className="font-medium mb-3">Section Settings</h4>
            <div className="text-sm text-muted-foreground space-y-2">
              <p>
                • <strong>Height:</strong> Fixed at 500px on desktop, 450px on
                mobile
              </p>
              <p>
                • <strong>Layout:</strong> Centered content with background
                image overlay
              </p>
              <p>
                • <strong>Text:</strong> White text with dark overlay for
                readability
              </p>
              <p>
                • <strong>Responsive:</strong> Automatically adapts to all
                screen sizes
              </p>
            </div>
          </div>
        </div>)}

      {/* Product Carousel Specific Fields */}
      {section.type === "product_carousel" && (<div className="space-y-4">
          <div>
            <label_1.Label>Display Count</label_1.Label>
            <input_1.Input type="number" min="1" max="20" value={((_s = formData.content) === null || _s === void 0 ? void 0 : _s.show_count) || 8} onChange={function (e) {
                return setFormData(__assign(__assign({}, formData), { content: __assign(__assign({}, formData.content), { show_count: parseInt(e.target.value) }) }));
            }}/>
          </div>

          <div>
            <label_1.Label>Select Products to Feature</label_1.Label>
            {isLoadingData ? (<div className="text-center py-4">Loading products...</div>) : (<div className="max-h-60 overflow-y-auto border rounded-lg p-2 space-y-2">
                {availableProducts.map(function (product) {
                    var _a, _b, _c;
                    var isSelected = ((_b = (_a = formData.content) === null || _a === void 0 ? void 0 : _a.selected_products) === null || _b === void 0 ? void 0 : _b.includes(product.id)) || false;
                    return (<div key={product.id} className={"flex items-center gap-3 p-2 rounded border cursor-pointer hover:bg-gray-50 ".concat(isSelected ? "bg-blue-50 border-blue-300" : "")} onClick={function () { return toggleProductSelection(product.id); }}>
                      <input type="checkbox" checked={isSelected} onChange={function () { return toggleProductSelection(product.id); }} className="rounded"/>
                      {((_c = product.images) === null || _c === void 0 ? void 0 : _c[0]) && (<img src={product.images[0]} alt={product.name} className="w-10 h-10 object-cover rounded"/>)}
                      <div className="flex-1">
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-gray-600">
                          ₹{product.sale_price || product.price}
                        </div>
                      </div>
                    </div>);
                })}
              </div>)}
            <p className="text-xs text-gray-600 mt-1">
              Selected:{" "}
              {((_u = (_t = formData.content) === null || _t === void 0 ? void 0 : _t.selected_products) === null || _u === void 0 ? void 0 : _u.length) || 0}{" "}
              products
            </p>
          </div>
        </div>)}

      {/* Category Grid Specific Fields */}
      {section.type === "category_grid" && (<div className="space-y-4">
          <div>
            <label_1.Label>Display Count</label_1.Label>
            <input_1.Input type="number" min="1" max="20" value={((_v = formData.content) === null || _v === void 0 ? void 0 : _v.show_count) || 8} onChange={function (e) {
                return setFormData(__assign(__assign({}, formData), { content: __assign(__assign({}, formData.content), { show_count: parseInt(e.target.value) }) }));
            }}/>
          </div>

          <div>
            <label_1.Label>Select Categories to Feature</label_1.Label>
            {isLoadingData ? (<div className="text-center py-4">Loading categories...</div>) : (<div className="max-h-60 overflow-y-auto border rounded-lg p-2 space-y-2">
                {availableCategories.map(function (category) {
                    var _a, _b;
                    var isSelected = ((_b = (_a = formData.content) === null || _a === void 0 ? void 0 : _a.selected_categories) === null || _b === void 0 ? void 0 : _b.includes(category.id)) || false;
                    return (<div key={category.id} className={"flex items-center gap-3 p-2 rounded border cursor-pointer hover:bg-gray-50 ".concat(isSelected ? "bg-blue-50 border-blue-300" : "")} onClick={function () { return toggleCategorySelection(category.id); }}>
                      <input type="checkbox" checked={isSelected} onChange={function () { return toggleCategorySelection(category.id); }} className="rounded"/>
                      {category.image_url && (<img src={category.image_url} alt={category.name} className="w-10 h-10 object-cover rounded"/>)}
                      <div className="flex-1">
                        <div className="font-medium">{category.name}</div>
                        <div className="text-sm text-gray-600">
                          {category.slug}
                        </div>
                      </div>
                    </div>);
                })}
              </div>)}
            <p className="text-xs text-gray-600 mt-1">
              Selected:{" "}
              {((_x = (_w = formData.content) === null || _w === void 0 ? void 0 : _w.selected_categories) === null || _x === void 0 ? void 0 : _x.length) || 0}{" "}
              categories
            </p>
          </div>
        </div>)}

      {/* Hero Carousel Specific Fields */}
      {(section.type === "hero_carousel" ||
            (section.type === "hero" &&
                ((_y = section.content) === null || _y === void 0 ? void 0 : _y.carousel_mode))) && (<div className="space-y-4">
          <div>
            <label_1.Label>Carousel Images</label_1.Label>
            <div className="space-y-3">
              {(((_z = formData.content) === null || _z === void 0 ? void 0 : _z.images) || []).map(function (image, index) { return (<div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="w-20 h-12 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                      {image ? (<img src={image} alt={"Slide ".concat(index + 1)} className="w-full h-full object-cover"/>) : (<div className="w-full h-full flex items-center justify-center text-gray-400">
                          <lucide_react_1.Image className="w-4 h-4"/>
                        </div>)}
                    </div>
                    <div className="flex-1">
                      <single_image_upload_1.SingleImageUpload imageUrl={image} onImageChange={function (newImage) {
                    var _a;
                    var images = __spreadArray([], (((_a = formData.content) === null || _a === void 0 ? void 0 : _a.images) || []), true);
                    images[index] = newImage;
                    setFormData(__assign(__assign({}, formData), { content: __assign(__assign({}, formData.content), { images: images }) }));
                }} label={"Slide ".concat(index + 1)} maxSizeMB={5}/>
                    </div>
                    <button_1.Button variant="outline" size="sm" onClick={function () {
                    var _a;
                    var images = __spreadArray([], (((_a = formData.content) === null || _a === void 0 ? void 0 : _a.images) || []), true);
                    images.splice(index, 1);
                    setFormData(__assign(__assign({}, formData), { content: __assign(__assign({}, formData.content), { images: images }) }));
                }}>
                      <lucide_react_1.Trash2 className="w-4 h-4"/>
                    </button_1.Button>
                  </div>); })}
              <button_1.Button variant="outline" onClick={function () {
                var _a;
                var images = __spreadArray(__spreadArray([], (((_a = formData.content) === null || _a === void 0 ? void 0 : _a.images) || []), true), [
                    "",
                ], false);
                setFormData(__assign(__assign({}, formData), { content: __assign(__assign({}, formData.content), { images: images }) }));
            }}>
                <lucide_react_1.Plus className="w-4 h-4 mr-2"/>
                Add Slide
              </button_1.Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label_1.Label>Auto-play Delay (ms)</label_1.Label>
              <input_1.Input type="number" min="1000" max="10000" step="500" value={((_0 = formData.content) === null || _0 === void 0 ? void 0 : _0.autoplay_delay) || 5000} onChange={function (e) {
                return setFormData(__assign(__assign({}, formData), { content: __assign(__assign({}, formData.content), { autoplay_delay: parseInt(e.target.value) }) }));
            }}/>
            </div>
            <div>
              <label_1.Label>Height (px)</label_1.Label>
              <input_1.Input type="number" min="300" max="800" value={((_1 = formData.content) === null || _1 === void 0 ? void 0 : _1.height) || 500} onChange={function (e) {
                return setFormData(__assign(__assign({}, formData), { content: __assign(__assign({}, formData.content), { height: parseInt(e.target.value) }) }));
            }}/>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex items-center space-x-2">
              <switch_1.Switch id="autoplay" checked={((_2 = formData.content) === null || _2 === void 0 ? void 0 : _2.autoplay) || true} onCheckedChange={function (checked) {
                return setFormData(__assign(__assign({}, formData), { content: __assign(__assign({}, formData.content), { autoplay: checked }) }));
            }}/>
              <label_1.Label htmlFor="autoplay">Auto-play</label_1.Label>
            </div>

            <div className="flex items-center space-x-2">
              <switch_1.Switch id="show_navigation" checked={((_3 = formData.content) === null || _3 === void 0 ? void 0 : _3.show_navigation) || true} onCheckedChange={function (checked) {
                return setFormData(__assign(__assign({}, formData), { content: __assign(__assign({}, formData.content), { show_navigation: checked }) }));
            }}/>
              <label_1.Label htmlFor="show_navigation">Show Arrows</label_1.Label>
            </div>

            <div className="flex items-center space-x-2">
              <switch_1.Switch id="show_dots" checked={((_4 = formData.content) === null || _4 === void 0 ? void 0 : _4.show_dots) || true} onCheckedChange={function (checked) {
                return setFormData(__assign(__assign({}, formData), { content: __assign(__assign({}, formData.content), { show_dots: checked }) }));
            }}/>
              <label_1.Label htmlFor="show_dots">Show Dots</label_1.Label>
            </div>
          </div>
        </div>)}

      <div>
        <label_1.Label htmlFor="content">Content (JSON)</label_1.Label>
        <textarea_1.Textarea id="content" value={JSON.stringify(formData.content, null, 2)} onChange={function (e) {
            try {
                var parsed = JSON.parse(e.target.value);
                setFormData(__assign(__assign({}, formData), { content: parsed }));
            }
            catch (_a) {
                // Invalid JSON, keep the text value
            }
        }} rows={8} className="font-mono text-sm"/>
        <p className="text-xs text-muted-foreground mt-1">
          Advanced: Edit the JSON content directly
        </p>
      </div>
    </div>);
}
