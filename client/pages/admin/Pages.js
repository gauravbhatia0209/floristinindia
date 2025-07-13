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
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Pages;
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var button_1 = require("@/components/ui/button");
var card_1 = require("@/components/ui/card");
var input_1 = require("@/components/ui/input");
var label_1 = require("@/components/ui/label");
var textarea_1 = require("@/components/ui/textarea");
var switch_1 = require("@/components/ui/switch");
var badge_1 = require("@/components/ui/badge");
var dialog_1 = require("@/components/ui/dialog");
var select_1 = require("@/components/ui/select");
var tabs_1 = require("@/components/ui/tabs");
var supabase_1 = require("@/lib/supabase");
var SectionBuilder_1 = require("@/components/admin/SectionBuilder");
var SectionEditor_1 = require("@/components/admin/SectionEditor");
function Pages() {
    var _a = (0, react_1.useState)([]), pages = _a[0], setPages = _a[1];
    var _b = (0, react_1.useState)(true), isLoading = _b[0], setIsLoading = _b[1];
    var _c = (0, react_1.useState)(null), editingPage = _c[0], setEditingPage = _c[1];
    var _d = (0, react_1.useState)(false), isAddingPage = _d[0], setIsAddingPage = _d[1];
    var _e = (0, react_1.useState)(null), editingSection = _e[0], setEditingSection = _e[1];
    (0, react_1.useEffect)(function () {
        fetchPages();
    }, []);
    function fetchPages() {
        return __awaiter(this, void 0, void 0, function () {
            var data, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, 3, 4]);
                        return [4 /*yield*/, supabase_1.supabase
                                .from("pages")
                                .select("*")
                                .order("sort_order")];
                    case 1:
                        data = (_a.sent()).data;
                        if (data) {
                            setPages(data);
                        }
                        return [3 /*break*/, 4];
                    case 2:
                        error_1 = _a.sent();
                        console.error("Failed to fetch pages:", error_1);
                        return [3 /*break*/, 4];
                    case 3:
                        setIsLoading(false);
                        return [7 /*endfinally*/];
                    case 4: return [2 /*return*/];
                }
            });
        });
    }
    function savePage(pageData) {
        return __awaiter(this, void 0, void 0, function () {
            var maxOrder, _a, data, error, error_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 6, , 7]);
                        if (!editingPage) return [3 /*break*/, 2];
                        return [4 /*yield*/, supabase_1.supabase.from("pages").update(pageData).eq("id", editingPage.id)];
                    case 1:
                        _b.sent();
                        fetchPages();
                        setEditingPage(null);
                        setIsAddingPage(false);
                        return [3 /*break*/, 5];
                    case 2:
                        maxOrder = pages.length > 0 ? Math.max.apply(Math, pages.map(function (p) { return p.sort_order; })) : 0;
                        return [4 /*yield*/, supabase_1.supabase
                                .from("pages")
                                .insert(__assign(__assign({}, pageData), { sort_order: maxOrder + 1 }))
                                .select()
                                .single()];
                    case 3:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error) {
                            throw error;
                        }
                        // After successful creation, set the new page as editing page
                        return [4 /*yield*/, fetchPages()];
                    case 4:
                        // After successful creation, set the new page as editing page
                        _b.sent();
                        if (data) {
                            setEditingPage(data);
                            setIsAddingPage(false);
                            // Don't close the dialog, keep it open for immediate editing
                        }
                        _b.label = 5;
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        error_2 = _b.sent();
                        console.error("Failed to save page:", error_2);
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        });
    }
    function deletePage(pageId) {
        return __awaiter(this, void 0, void 0, function () {
            var error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!confirm("Are you sure you want to delete this page?"))
                            return [2 /*return*/];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, supabase_1.supabase.from("pages").delete().eq("id", pageId)];
                    case 2:
                        _a.sent();
                        fetchPages();
                        return [3 /*break*/, 4];
                    case 3:
                        error_3 = _a.sent();
                        console.error("Failed to delete page:", error_3);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    }
    function togglePageStatus(pageId, isActive) {
        return __awaiter(this, void 0, void 0, function () {
            var error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, supabase_1.supabase
                                .from("pages")
                                .update({ is_active: !isActive })
                                .eq("id", pageId)];
                    case 1:
                        _a.sent();
                        fetchPages();
                        return [3 /*break*/, 3];
                    case 2:
                        error_4 = _a.sent();
                        console.error("Failed to toggle page status:", error_4);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
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
          <h1 className="text-2xl font-bold">Page Management</h1>
          <p className="text-muted-foreground">
            Create and manage dynamic pages for your website
          </p>
        </div>
        <button_1.Button onClick={function () { return setIsAddingPage(true); }}>
          <lucide_react_1.Plus className="w-4 h-4 mr-2"/>
          Add Page
        </button_1.Button>
      </div>

      {/* About Page Info */}
      {!pages.find(function (p) { return p.slug === "about"; }) && (<card_1.Card className="border-blue-200 bg-blue-50">
          <card_1.CardContent className="p-4">
            <div className="flex items-start gap-3">
              <lucide_react_1.FileText className="h-5 w-5 text-blue-600 mt-0.5"/>
              <div>
                <h3 className="font-medium text-blue-800">About Page Setup</h3>
                <p className="text-sm text-blue-700 mt-1">
                  Create an "About" page with slug "about" to customize your
                  About Us page content. This will override the default About
                  page with your custom content.
                </p>
              </div>
            </div>
          </card_1.CardContent>
        </card_1.Card>)}

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <card_1.Card>
          <card_1.CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Pages</p>
                <p className="text-2xl font-bold">{pages.length}</p>
              </div>
              <lucide_react_1.FileText className="w-8 h-8 text-muted-foreground"/>
            </div>
          </card_1.CardContent>
        </card_1.Card>
        <card_1.Card>
          <card_1.CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Published</p>
                <p className="text-2xl font-bold">
                  {pages.filter(function (p) { return p.is_active; }).length}
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
                <p className="text-sm text-muted-foreground">In Footer</p>
                <p className="text-2xl font-bold">
                  {pages.filter(function (p) { return p.show_in_footer; }).length}
                </p>
              </div>
              <lucide_react_1.Settings className="w-8 h-8 text-blue-600"/>
            </div>
          </card_1.CardContent>
        </card_1.Card>
        <card_1.Card>
          <card_1.CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Draft</p>
                <p className="text-2xl font-bold">
                  {pages.filter(function (p) { return !p.is_active; }).length}
                </p>
              </div>
              <lucide_react_1.FileText className="w-8 h-8 text-orange-600"/>
            </div>
          </card_1.CardContent>
        </card_1.Card>
      </div>

      {/* Pages List */}
      <card_1.Card>
        <card_1.CardHeader>
          <card_1.CardTitle>All Pages</card_1.CardTitle>
        </card_1.CardHeader>
        <card_1.CardContent>
          {pages.length === 0 ? (<div className="text-center py-12">
              <lucide_react_1.FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground"/>
              <h3 className="text-lg font-semibold mb-2">No pages yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first page to get started
              </p>
              <button_1.Button onClick={function () { return setIsAddingPage(true); }}>
                <lucide_react_1.Plus className="w-4 h-4 mr-2"/>
                Add Page
              </button_1.Button>
            </div>) : (<div className="space-y-4">
              {pages.map(function (page) { return (<div key={page.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{page.title}</h3>
                        <badge_1.Badge variant={page.is_active ? "default" : "secondary"}>
                          {page.is_active ? "Published" : "Draft"}
                        </badge_1.Badge>
                        {page.show_in_footer && (<badge_1.Badge variant="outline">In Footer</badge_1.Badge>)}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        /{page.slug}
                      </p>
                      {page.meta_description && (<p className="text-sm text-muted-foreground">
                          {page.meta_description}
                        </p>)}
                    </div>
                    <div className="flex items-center gap-2">
                      <switch_1.Switch checked={page.is_active} onCheckedChange={function () {
                    return togglePageStatus(page.id, page.is_active);
                }}/>
                      <button_1.Button variant="ghost" size="icon" onClick={function () { return setEditingPage(page); }}>
                        <lucide_react_1.Edit className="w-4 h-4"/>
                      </button_1.Button>
                      <button_1.Button variant="ghost" size="icon" onClick={function () { return deletePage(page.id); }}>
                        <lucide_react_1.Trash2 className="w-4 h-4 text-red-600"/>
                      </button_1.Button>
                    </div>
                  </div>
                </div>); })}
            </div>)}
        </card_1.CardContent>
      </card_1.Card>

      {/* Add/Edit Page Dialog */}
      <dialog_1.Dialog open={isAddingPage || !!editingPage} onOpenChange={function () {
            setIsAddingPage(false);
            setEditingPage(null);
            setEditingSection(null); // Clear section editing when page dialog closes
        }}>
        <dialog_1.DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <dialog_1.DialogHeader>
            <dialog_1.DialogTitle>
              {editingPage ? "Edit Page" : "Create New Page"}
            </dialog_1.DialogTitle>
          </dialog_1.DialogHeader>
          <PageForm page={editingPage} onSave={savePage} onCancel={function () {
            setIsAddingPage(false);
            setEditingPage(null);
            setEditingSection(null);
        }} onSectionEdit={setEditingSection} editingSection={editingSection} onSectionSave={function (updatedSection) {
            // Update the section in the current page being edited
            if (editingPage) {
                var updatedSections = (editingPage.content || []).map(function (section) {
                    return section.id === updatedSection.id ? updatedSection : section;
                });
                setEditingPage(__assign(__assign({}, editingPage), { content: updatedSections }));
            }
            setEditingSection(null);
        }} onSectionCancel={function () { return setEditingSection(null); }} onSectionsUpdate={function (updatedSections) {
            if (editingPage) {
                setEditingPage(__assign(__assign({}, editingPage), { content: updatedSections }));
            }
        }}/>
        </dialog_1.DialogContent>
      </dialog_1.Dialog>
    </div>);
}
// Page Form Component
function PageForm(_a) {
    var _b, _c, _d;
    var page = _a.page, onSave = _a.onSave, onCancel = _a.onCancel, onSectionEdit = _a.onSectionEdit, editingSection = _a.editingSection, onSectionSave = _a.onSectionSave, onSectionCancel = _a.onSectionCancel, onSectionsUpdate = _a.onSectionsUpdate;
    var _e = (0, react_1.useState)({
        title: (page === null || page === void 0 ? void 0 : page.title) || "",
        slug: (page === null || page === void 0 ? void 0 : page.slug) || "",
        meta_title: (page === null || page === void 0 ? void 0 : page.meta_title) || "",
        meta_description: (page === null || page === void 0 ? void 0 : page.meta_description) || "",
        is_active: (_b = page === null || page === void 0 ? void 0 : page.is_active) !== null && _b !== void 0 ? _b : true,
        show_in_footer: (_c = page === null || page === void 0 ? void 0 : page.show_in_footer) !== null && _c !== void 0 ? _c : false,
        footer_column: ((_d = page === null || page === void 0 ? void 0 : page.footer_column) === null || _d === void 0 ? void 0 : _d.toString()) || "1",
        sections: (function () {
            var _a;
            if (!(page === null || page === void 0 ? void 0 : page.content)) {
                return [
                    {
                        id: "section_1",
                        type: "heading",
                        content: { level: 1, text: "Page Title" },
                        is_visible: true,
                        sort_order: 0,
                    },
                    {
                        id: "section_2",
                        type: "paragraph",
                        content: { text: "Your page content goes here..." },
                        is_visible: true,
                        sort_order: 1,
                    },
                ];
            }
            // If content is already sections array, use it
            if (Array.isArray(page.content) && ((_a = page.content[0]) === null || _a === void 0 ? void 0 : _a.id)) {
                return page.content;
            }
            // If content is legacy blocks array, convert to sections
            if (Array.isArray(page.content)) {
                return page.content.map(function (block, index) { return ({
                    id: "section_".concat(index),
                    type: block.type,
                    content: block.content,
                    is_visible: true,
                    sort_order: index,
                }); });
            }
            // If content is a string (HTML), convert it to a single paragraph section
            if (typeof page.content === "string") {
                return [
                    {
                        id: "section_1",
                        type: "paragraph",
                        content: { text: page.content },
                        is_visible: true,
                        sort_order: 0,
                    },
                ];
            }
            // Fallback to default content
            return [
                {
                    id: "section_1",
                    type: "heading",
                    content: { level: 1, text: (page === null || page === void 0 ? void 0 : page.title) || "Page Title" },
                    is_visible: true,
                    sort_order: 0,
                },
                {
                    id: "section_2",
                    type: "paragraph",
                    content: { text: "Your page content goes here..." },
                    is_visible: true,
                    sort_order: 1,
                },
            ];
        })(),
    }), formData = _e[0], setFormData = _e[1];
    var _f = (0, react_1.useState)(formData.sections), sections = _f[0], setSections = _f[1];
    // Custom function to update sections and sync with parent
    var updateSections = function (newSections) {
        setSections(newSections);
        onSectionsUpdate(newSections);
    };
    // Auto-generate slug from title
    (0, react_1.useEffect)(function () {
        if (!page && formData.title) {
            var slug_1 = formData.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-+|-+$/g, "");
            setFormData(function (prev) { return (__assign(__assign({}, prev), { slug: slug_1 })); });
        }
    }, [formData.title, page]);
    function handleSubmit(e) {
        e.preventDefault();
        onSave({
            title: formData.title,
            slug: formData.slug,
            meta_title: formData.meta_title || null,
            meta_description: formData.meta_description || null,
            is_active: formData.is_active,
            show_in_footer: formData.show_in_footer,
            footer_column: formData.show_in_footer
                ? parseInt(formData.footer_column)
                : null,
            content: sections, // Store sections directly instead of converting to HTML
        });
    }
    return (<form onSubmit={handleSubmit} className="space-y-6">
      <tabs_1.Tabs defaultValue="content" className="w-full">
        <tabs_1.TabsList className="grid w-full grid-cols-3">
          <tabs_1.TabsTrigger value="content">Content</tabs_1.TabsTrigger>
          <tabs_1.TabsTrigger value="settings">Settings</tabs_1.TabsTrigger>
          <tabs_1.TabsTrigger value="seo">SEO</tabs_1.TabsTrigger>
        </tabs_1.TabsList>

        <tabs_1.TabsContent value="content" className="space-y-4">
          {editingSection ? (
        // Inline Section Editor
        <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div>
                  <h3 className="font-semibold">Editing Section</h3>
                  <p className="text-sm text-muted-foreground">
                    Make your changes below and click save to apply them.
                  </p>
                </div>
                <button_1.Button variant="outline" onClick={onSectionCancel} size="sm">
                  Back to Sections
                </button_1.Button>
              </div>
              <SectionEditor_1.SectionEditor section={editingSection} onSave={function (updatedSection) {
                // Update the local sections state
                var updatedSections = sections.map(function (section) {
                    return section.id === updatedSection.id ? updatedSection : section;
                });
                updateSections(updatedSections);
                // Also call the parent callback
                onSectionSave(updatedSection);
            }} onCancel={onSectionCancel}/>
            </div>) : (
        // Section Builder
        <SectionBuilder_1.SectionBuilder sections={sections} onSectionsChange={updateSections} pageType="pages" onSectionEdit={onSectionEdit}/>)}
        </tabs_1.TabsContent>

        <tabs_1.TabsContent value="settings" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label_1.Label htmlFor="title">Page Title</label_1.Label>
              <input_1.Input id="title" value={formData.title} onChange={function (e) {
            return setFormData(__assign(__assign({}, formData), { title: e.target.value }));
        }} placeholder="About Us" required/>
            </div>
            <div>
              <label_1.Label htmlFor="slug">URL Slug</label_1.Label>
              <input_1.Input id="slug" value={formData.slug} onChange={function (e) {
            return setFormData(__assign(__assign({}, formData), { slug: e.target.value }));
        }} placeholder="about-us" required/>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <switch_1.Switch id="is_active" checked={formData.is_active} onCheckedChange={function (checked) {
            return setFormData(__assign(__assign({}, formData), { is_active: checked }));
        }}/>
              <label_1.Label htmlFor="is_active">Published</label_1.Label>
            </div>

            <div className="flex items-center space-x-2">
              <switch_1.Switch id="show_in_footer" checked={formData.show_in_footer} onCheckedChange={function (checked) {
            return setFormData(__assign(__assign({}, formData), { show_in_footer: checked }));
        }}/>
              <label_1.Label htmlFor="show_in_footer">Show in Footer</label_1.Label>
            </div>

            {formData.show_in_footer && (<div>
                <label_1.Label htmlFor="footer_column">Footer Column</label_1.Label>
                <select_1.Select value={formData.footer_column} onValueChange={function (value) {
                return setFormData(__assign(__assign({}, formData), { footer_column: value }));
            }}>
                  <select_1.SelectTrigger>
                    <select_1.SelectValue />
                  </select_1.SelectTrigger>
                  <select_1.SelectContent>
                    <select_1.SelectItem value="1">Column 1</select_1.SelectItem>
                    <select_1.SelectItem value="2">Column 2</select_1.SelectItem>
                    <select_1.SelectItem value="3">Column 3</select_1.SelectItem>
                    <select_1.SelectItem value="4">Column 4</select_1.SelectItem>
                  </select_1.SelectContent>
                </select_1.Select>
              </div>)}
          </div>
        </tabs_1.TabsContent>

        <tabs_1.TabsContent value="seo" className="space-y-4">
          <div>
            <label_1.Label htmlFor="meta_title">Meta Title</label_1.Label>
            <input_1.Input id="meta_title" value={formData.meta_title} onChange={function (e) {
            return setFormData(__assign(__assign({}, formData), { meta_title: e.target.value }));
        }} placeholder="About Us - Florist in India"/>
          </div>

          <div>
            <label_1.Label htmlFor="meta_description">Meta Description</label_1.Label>
            <textarea_1.Textarea id="meta_description" value={formData.meta_description} onChange={function (e) {
            return setFormData(__assign(__assign({}, formData), { meta_description: e.target.value }));
        }} placeholder="Learn about our story and commitment to delivering fresh flowers..." rows={3}/>
          </div>
        </tabs_1.TabsContent>
      </tabs_1.Tabs>

      <div className="flex justify-end gap-2 pt-4 border-t">
        <button_1.Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </button_1.Button>
        <button_1.Button type="submit">{page ? "Update Page" : "Create Page"}</button_1.Button>
      </div>
    </form>);
}
