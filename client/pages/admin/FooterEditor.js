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
exports.default = FooterEditor;
var react_1 = require("react");
var card_1 = require("@/components/ui/card");
var button_1 = require("@/components/ui/button");
var input_1 = require("@/components/ui/input");
var label_1 = require("@/components/ui/label");
var textarea_1 = require("@/components/ui/textarea");
var switch_1 = require("@/components/ui/switch");
var select_1 = require("@/components/ui/select");
var badge_1 = require("@/components/ui/badge");
var dialog_1 = require("@/components/ui/dialog");
var lucide_react_1 = require("lucide-react");
var supabase_1 = require("@/lib/supabase");
var FooterConfig_1 = require("@/components/admin/FooterConfig");
function FooterEditor() {
    var _a = (0, react_1.useState)([]), footerSections = _a[0], setFooterSections = _a[1];
    var _b = (0, react_1.useState)(true), isLoading = _b[0], setIsLoading = _b[1];
    var _c = (0, react_1.useState)(null), editingSection = _c[0], setEditingSection = _c[1];
    var _d = (0, react_1.useState)(false), isDialogOpen = _d[0], setIsDialogOpen = _d[1];
    var _e = (0, react_1.useState)(false), saving = _e[0], setSaving = _e[1];
    // Dynamic column configuration - loaded from database
    var _f = (0, react_1.useState)(6), MAX_COLUMNS = _f[0], setMaxColumns = _f[1]; // Default, loaded from database
    var COMPANY_COLUMN = 1; // Reserved for company info
    var _g = (0, react_1.useState)([
        2, 3, 4, 5, 6,
    ]), AVAILABLE_COLUMNS = _g[0], setAvailableColumns = _g[1];
    (0, react_1.useEffect)(function () {
        loadFooterConfig();
        fetchFooterSections();
    }, []);
    function loadFooterConfig() {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error, maxCols, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, supabase_1.supabase
                                .from("site_settings")
                                .select("value")
                                .eq("key", "footer_max_columns")
                                .maybeSingle()];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (!error && data) {
                            maxCols = parseInt(data.value) || 6;
                            setMaxColumns(maxCols);
                            setAvailableColumns(Array.from({ length: maxCols - 1 }, function (_, i) { return i + 2; }));
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _b.sent();
                        console.log("Using default footer configuration");
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    }
    function fetchFooterSections() {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error, error_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 5, 6, 7]);
                        setIsLoading(true);
                        return [4 /*yield*/, supabase_1.supabase
                                .from("footer_sections")
                                .select("*")
                                .order("column_position", { ascending: true })
                                .order("sort_order", { ascending: true })];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (!error) return [3 /*break*/, 2];
                        console.error("Error fetching footer sections:", error);
                        return [3 /*break*/, 4];
                    case 2:
                        if (!data) return [3 /*break*/, 4];
                        // Fix any sections that are incorrectly in column 1
                        return [4 /*yield*/, fixColumn1Sections(data)];
                    case 3:
                        // Fix any sections that are incorrectly in column 1
                        _b.sent();
                        setFooterSections(data);
                        _b.label = 4;
                    case 4: return [3 /*break*/, 7];
                    case 5:
                        error_2 = _b.sent();
                        console.error("Error:", error_2);
                        return [3 /*break*/, 7];
                    case 6:
                        setIsLoading(false);
                        return [7 /*endfinally*/];
                    case 7: return [2 /*return*/];
                }
            });
        });
    }
    function fixColumn1Sections(sections) {
        return __awaiter(this, void 0, void 0, function () {
            var column1Sections, _i, column1Sections_1, section, error, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        column1Sections = sections.filter(function (s) { return s.column_position === COMPANY_COLUMN; });
                        if (!(column1Sections.length > 0)) return [3 /*break*/, 6];
                        console.log("Found sections in reserved column ".concat(COMPANY_COLUMN, ", moving to column ").concat(AVAILABLE_COLUMNS[0], ":"), column1Sections);
                        _i = 0, column1Sections_1 = column1Sections;
                        _a.label = 1;
                    case 1:
                        if (!(_i < column1Sections_1.length)) return [3 /*break*/, 6];
                        section = column1Sections_1[_i];
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, supabase_1.supabase
                                .from("footer_sections")
                                .update({ column_position: AVAILABLE_COLUMNS[0] }) // Move to first available column
                                .eq("id", section.id)];
                    case 3:
                        error = (_a.sent()).error;
                        if (error) {
                            console.error("Error moving section from column ".concat(COMPANY_COLUMN, ":"), error);
                        }
                        else {
                            // Update local data
                            section.column_position = AVAILABLE_COLUMNS[0];
                        }
                        return [3 /*break*/, 5];
                    case 4:
                        error_3 = _a.sent();
                        console.error("Error updating section:", error_3);
                        return [3 /*break*/, 5];
                    case 5:
                        _i++;
                        return [3 /*break*/, 1];
                    case 6: return [2 /*return*/];
                }
            });
        });
    }
    function openEditDialog(section) {
        if (section) {
            setEditingSection({
                id: section.id,
                title: section.title,
                content: section.content,
                column_position: section.column_position,
                is_active: section.is_active,
                sort_order: section.sort_order,
            });
        }
        else {
            setEditingSection({
                title: "",
                content: { type: "text", text: "" },
                column_position: 2,
                is_active: true,
                sort_order: footerSections.length + 1,
            });
        }
        setIsDialogOpen(true);
    }
    function saveFooterSection() {
        return __awaiter(this, void 0, void 0, function () {
            var error, error, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!editingSection)
                            return [2 /*return*/];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 6, 7, 8]);
                        setSaving(true);
                        if (!editingSection.id) return [3 /*break*/, 3];
                        return [4 /*yield*/, supabase_1.supabase
                                .from("footer_sections")
                                .update({
                                title: editingSection.title,
                                content: editingSection.content,
                                column_position: editingSection.column_position,
                                is_active: editingSection.is_active,
                                sort_order: editingSection.sort_order,
                            })
                                .eq("id", editingSection.id)];
                    case 2:
                        error = (_a.sent()).error;
                        if (error)
                            throw error;
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, supabase_1.supabase.from("footer_sections").insert({
                            title: editingSection.title,
                            content: editingSection.content,
                            column_position: editingSection.column_position,
                            is_active: editingSection.is_active,
                            sort_order: editingSection.sort_order,
                        })];
                    case 4:
                        error = (_a.sent()).error;
                        if (error)
                            throw error;
                        _a.label = 5;
                    case 5:
                        setIsDialogOpen(false);
                        setEditingSection(null);
                        fetchFooterSections();
                        return [3 /*break*/, 8];
                    case 6:
                        error_4 = _a.sent();
                        console.error("Error saving footer section:", error_4);
                        alert("Error saving footer section");
                        return [3 /*break*/, 8];
                    case 7:
                        setSaving(false);
                        return [7 /*endfinally*/];
                    case 8: return [2 /*return*/];
                }
            });
        });
    }
    function deleteFooterSection(id) {
        return __awaiter(this, void 0, void 0, function () {
            var error, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!confirm("Are you sure you want to delete this footer section?"))
                            return [2 /*return*/];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, supabase_1.supabase
                                .from("footer_sections")
                                .delete()
                                .eq("id", id)];
                    case 2:
                        error = (_a.sent()).error;
                        if (error)
                            throw error;
                        fetchFooterSections();
                        return [3 /*break*/, 4];
                    case 3:
                        error_5 = _a.sent();
                        console.error("Error deleting footer section:", error_5);
                        alert("Error deleting footer section");
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    }
    function toggleSectionActive(id, isActive) {
        return __awaiter(this, void 0, void 0, function () {
            var error, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, supabase_1.supabase
                                .from("footer_sections")
                                .update({ is_active: isActive })
                                .eq("id", id)];
                    case 1:
                        error = (_a.sent()).error;
                        if (error)
                            throw error;
                        fetchFooterSections();
                        return [3 /*break*/, 3];
                    case 2:
                        error_6 = _a.sent();
                        console.error("Error updating section status:", error_6);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    }
    function renderContentEditor() {
        var _a, _b, _c, _d, _e, _f, _g;
        if (!editingSection)
            return null;
        var contentType = ((_a = editingSection.content) === null || _a === void 0 ? void 0 : _a.type) || "text";
        return (<div className="space-y-4">
        <div>
          <label_1.Label htmlFor="content-type">Content Type</label_1.Label>
          <select_1.Select value={contentType} onValueChange={function (value) {
                return setEditingSection(__assign(__assign({}, editingSection), { content: __assign({ type: value }, (value === "text" ? { text: "" } : {})) }));
            }}>
            <select_1.SelectTrigger>
              <select_1.SelectValue />
            </select_1.SelectTrigger>
            <select_1.SelectContent>
              <select_1.SelectItem value="text">Simple Text</select_1.SelectItem>
              <select_1.SelectItem value="links">Links List</select_1.SelectItem>
              <select_1.SelectItem value="contact">Contact Information</select_1.SelectItem>
              <select_1.SelectItem value="category_links">Category Links</select_1.SelectItem>
            </select_1.SelectContent>
          </select_1.Select>
        </div>

        {contentType === "text" && (<div>
            <label_1.Label htmlFor="content-text">Text Content</label_1.Label>
            <textarea_1.Textarea id="content-text" value={((_b = editingSection.content) === null || _b === void 0 ? void 0 : _b.text) || ""} onChange={function (e) {
                    return setEditingSection(__assign(__assign({}, editingSection), { content: __assign(__assign({}, editingSection.content), { text: e.target.value }) }));
                }} placeholder="Enter your text content..." rows={4}/>
          </div>)}

        {contentType === "links" && (<div>
            <label_1.Label>Links</label_1.Label>
            <div className="space-y-2">
              {(((_c = editingSection.content) === null || _c === void 0 ? void 0 : _c.links) || []).map(function (link, index) { return (<div key={index} className="flex gap-2">
                    <input_1.Input placeholder="Link text" value={link.text || ""} onChange={function (e) {
                        var _a;
                        var links = __spreadArray([], (((_a = editingSection.content) === null || _a === void 0 ? void 0 : _a.links) || []), true);
                        links[index] = __assign(__assign({}, links[index]), { text: e.target.value });
                        setEditingSection(__assign(__assign({}, editingSection), { content: __assign(__assign({}, editingSection.content), { links: links }) }));
                    }}/>
                    <input_1.Input placeholder="Link URL" value={link.url || ""} onChange={function (e) {
                        var _a;
                        var links = __spreadArray([], (((_a = editingSection.content) === null || _a === void 0 ? void 0 : _a.links) || []), true);
                        links[index] = __assign(__assign({}, links[index]), { url: e.target.value });
                        setEditingSection(__assign(__assign({}, editingSection), { content: __assign(__assign({}, editingSection.content), { links: links }) }));
                    }}/>
                    <button_1.Button size="sm" variant="outline" onClick={function () {
                        var _a, _b;
                        var links = ((_b = (_a = editingSection.content) === null || _a === void 0 ? void 0 : _a.links) === null || _b === void 0 ? void 0 : _b.filter(function (_, i) { return i !== index; })) || [];
                        setEditingSection(__assign(__assign({}, editingSection), { content: __assign(__assign({}, editingSection.content), { links: links }) }));
                    }}>
                      <lucide_react_1.Trash2 className="h-4 w-4"/>
                    </button_1.Button>
                  </div>); })}
              <button_1.Button size="sm" variant="outline" onClick={function () {
                    var _a;
                    var links = __spreadArray(__spreadArray([], (((_a = editingSection.content) === null || _a === void 0 ? void 0 : _a.links) || []), true), [
                        { text: "", url: "" },
                    ], false);
                    setEditingSection(__assign(__assign({}, editingSection), { content: __assign(__assign({}, editingSection.content), { links: links }) }));
                }}>
                <lucide_react_1.Plus className="h-4 w-4 mr-1"/>
                Add Link
              </button_1.Button>
            </div>
          </div>)}

        {contentType === "contact" && (<div className="space-y-3">
            <div>
              <label_1.Label>Phone Number</label_1.Label>
              <input_1.Input value={((_d = editingSection.content) === null || _d === void 0 ? void 0 : _d.phone) || ""} onChange={function (e) {
                    return setEditingSection(__assign(__assign({}, editingSection), { content: __assign(__assign({}, editingSection.content), { phone: e.target.value }) }));
                }} placeholder="+91 98765 43210"/>
            </div>
            <div>
              <label_1.Label>Email Address</label_1.Label>
              <input_1.Input value={((_e = editingSection.content) === null || _e === void 0 ? void 0 : _e.email) || ""} onChange={function (e) {
                    return setEditingSection(__assign(__assign({}, editingSection), { content: __assign(__assign({}, editingSection.content), { email: e.target.value }) }));
                }} placeholder="contact@example.com"/>
            </div>
            <div>
              <label_1.Label>Address</label_1.Label>
              <input_1.Input value={((_f = editingSection.content) === null || _f === void 0 ? void 0 : _f.address) || ""} onChange={function (e) {
                    return setEditingSection(__assign(__assign({}, editingSection), { content: __assign(__assign({}, editingSection.content), { address: e.target.value }) }));
                }} placeholder="Your business address"/>
            </div>
          </div>)}

        {contentType === "category_links" && (<div>
            <label_1.Label>Show Count</label_1.Label>
            <input_1.Input type="number" value={((_g = editingSection.content) === null || _g === void 0 ? void 0 : _g.show_count)
                    ? editingSection.content.show_count.toString()
                    : "6"} onChange={function (e) {
                    return setEditingSection(__assign(__assign({}, editingSection), { content: __assign(__assign({}, editingSection.content), { show_count: parseInt(e.target.value) || 6 }) }));
                }} placeholder="Number of categories to show"/>
            <p className="text-sm text-muted-foreground mt-1">
              This will automatically display the most popular product
              categories
            </p>
          </div>)}
      </div>);
    }
    function getContentTypeIcon(type) {
        switch (type) {
            case "links":
                return <lucide_react_1.Link className="h-4 w-4"/>;
            case "contact":
                return <lucide_react_1.Phone className="h-4 w-4"/>;
            case "category_links":
                return <lucide_react_1.Link className="h-4 w-4"/>;
            default:
                return <lucide_react_1.Edit className="h-4 w-4"/>;
        }
    }
    function getContentPreview(content) {
        var _a, _b, _c;
        switch (content === null || content === void 0 ? void 0 : content.type) {
            case "links":
                return "".concat(((_a = content.links) === null || _a === void 0 ? void 0 : _a.length) || 0, " links");
            case "contact":
                var parts = [];
                if (content.phone)
                    parts.push("Phone");
                if (content.email)
                    parts.push("Email");
                if (content.address)
                    parts.push("Address");
                return parts.join(", ") || "No contact info";
            case "category_links":
                return "Show ".concat(content.show_count || 6, " categories");
            case "text":
                return (((_b = content.text) === null || _b === void 0 ? void 0 : _b.substring(0, 50)) +
                    (((_c = content.text) === null || _c === void 0 ? void 0 : _c.length) > 50 ? "..." : "") || "No text");
            default:
                return "Unknown content type";
        }
    }
    if (isLoading) {
        return (<div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded animate-pulse w-48"></div>
        <div className="grid gap-4">
          {[1, 2, 3].map(function (i) { return (<div key={i} className="h-24 bg-gray-200 rounded animate-pulse"></div>); })}
        </div>
      </div>);
    }
    return (<div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Footer Editor</h1>
          <p className="text-muted-foreground">
            Manage footer sections and content. Changes are instantly reflected
            on the live site.
          </p>
        </div>
        <dialog_1.Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <dialog_1.DialogTrigger asChild>
            <button_1.Button onClick={function () { return openEditDialog(); }}>
              <lucide_react_1.Plus className="h-4 w-4 mr-2"/>
              Add Section
            </button_1.Button>
          </dialog_1.DialogTrigger>
          <dialog_1.DialogContent className="max-w-2xl">
            <dialog_1.DialogHeader>
              <dialog_1.DialogTitle>
                {(editingSection === null || editingSection === void 0 ? void 0 : editingSection.id)
            ? "Edit Footer Section"
            : "Add Footer Section"}
              </dialog_1.DialogTitle>
            </dialog_1.DialogHeader>

            {editingSection && (<div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label_1.Label htmlFor="title">Section Title</label_1.Label>
                    <input_1.Input id="title" value={editingSection.title} onChange={function (e) {
                return setEditingSection(__assign(__assign({}, editingSection), { title: e.target.value }));
            }} placeholder="e.g., Quick Links, Contact Info"/>
                  </div>
                  <div>
                    <label_1.Label htmlFor="column">Column Position</label_1.Label>
                    <select_1.Select value={editingSection.column_position.toString()} onValueChange={function (value) {
                return setEditingSection(__assign(__assign({}, editingSection), { column_position: parseInt(value) }));
            }}>
                      <select_1.SelectTrigger>
                        <select_1.SelectValue />
                      </select_1.SelectTrigger>
                      <select_1.SelectContent>
                        {AVAILABLE_COLUMNS.map(function (colNum) { return (<select_1.SelectItem key={colNum} value={colNum.toString()}>
                            Column {colNum}
                          </select_1.SelectItem>); })}
                      </select_1.SelectContent>
                    </select_1.Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label_1.Label htmlFor="sort-order">Sort Order</label_1.Label>
                    <input_1.Input id="sort-order" type="number" value={editingSection.sort_order
                ? editingSection.sort_order.toString()
                : "1"} onChange={function (e) {
                return setEditingSection(__assign(__assign({}, editingSection), { sort_order: parseInt(e.target.value) || 1 }));
            }} placeholder="1, 2, 3..."/>
                  </div>
                  <div className="flex items-center space-x-2 pt-6">
                    <switch_1.Switch id="is-active" checked={editingSection.is_active} onCheckedChange={function (checked) {
                return setEditingSection(__assign(__assign({}, editingSection), { is_active: checked }));
            }}/>
                    <label_1.Label htmlFor="is-active">Active</label_1.Label>
                  </div>
                </div>

                {renderContentEditor()}

                <div className="flex justify-end gap-2 pt-4">
                  <button_1.Button variant="outline" onClick={function () { return setIsDialogOpen(false); }}>
                    Cancel
                  </button_1.Button>
                  <button_1.Button onClick={saveFooterSection} disabled={saving}>
                    <lucide_react_1.Save className="h-4 w-4 mr-2"/>
                    {saving ? "Saving..." : "Save Section"}
                  </button_1.Button>
                </div>
              </div>)}
          </dialog_1.DialogContent>
        </dialog_1.Dialog>
      </div>

      {/* Footer Configuration */}
      <FooterConfig_1.default currentMaxColumns={MAX_COLUMNS} onConfigChange={function (newMaxColumns) {
            // Update local state if needed
            console.log("Footer config changed to:", newMaxColumns);
        }}/>

      <div className="grid gap-4">
        {footerSections.map(function (section) {
            var _a;
            return (<card_1.Card key={section.id}>
            <card_1.CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <lucide_react_1.GripVertical className="h-4 w-4 text-muted-foreground"/>
                    {getContentTypeIcon((_a = section.content) === null || _a === void 0 ? void 0 : _a.type)}
                  </div>
                  <div>
                    <card_1.CardTitle className="text-lg">{section.title}</card_1.CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <badge_1.Badge variant="outline" className="text-xs">
                        Column {section.column_position}
                      </badge_1.Badge>
                      <badge_1.Badge variant="outline" className="text-xs">
                        Order {section.sort_order}
                      </badge_1.Badge>
                      <badge_1.Badge variant={section.is_active ? "default" : "secondary"} className="text-xs">
                        {section.is_active ? "Active" : "Inactive"}
                      </badge_1.Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button_1.Button size="sm" variant="ghost" onClick={function () {
                    return toggleSectionActive(section.id, !section.is_active);
                }}>
                    {section.is_active ? (<lucide_react_1.EyeOff className="h-4 w-4"/>) : (<lucide_react_1.Eye className="h-4 w-4"/>)}
                  </button_1.Button>
                  <button_1.Button size="sm" variant="ghost" onClick={function () { return openEditDialog(section); }}>
                    <lucide_react_1.Edit className="h-4 w-4"/>
                  </button_1.Button>
                  <button_1.Button size="sm" variant="ghost" className="text-destructive" onClick={function () { return deleteFooterSection(section.id); }}>
                    <lucide_react_1.Trash2 className="h-4 w-4"/>
                  </button_1.Button>
                </div>
              </div>
            </card_1.CardHeader>
            <card_1.CardContent>
              <p className="text-sm text-muted-foreground">
                {getContentPreview(section.content)}
              </p>
            </card_1.CardContent>
          </card_1.Card>);
        })}

        {footerSections.length === 0 && (<card_1.Card>
            <card_1.CardContent className="py-12 text-center">
              <div className="text-muted-foreground">
                <lucide_react_1.Plus className="h-12 w-12 mx-auto mb-4 opacity-50"/>
                <h3 className="text-lg font-medium mb-2">
                  No footer sections yet
                </h3>
                <p className="mb-4">
                  Create your first footer section to get started.
                </p>
                <button_1.Button onClick={function () { return openEditDialog(); }}>
                  <lucide_react_1.Plus className="h-4 w-4 mr-2"/>
                  Add Footer Section
                </button_1.Button>
              </div>
            </card_1.CardContent>
          </card_1.Card>)}
      </div>
    </div>);
}
