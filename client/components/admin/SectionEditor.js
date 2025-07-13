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
exports.SectionEditor = SectionEditor;
var react_1 = require("react");
var button_1 = require("@/components/ui/button");
var card_1 = require("@/components/ui/card");
var input_1 = require("@/components/ui/input");
var label_1 = require("@/components/ui/label");
var textarea_1 = require("@/components/ui/textarea");
var switch_1 = require("@/components/ui/switch");
var badge_1 = require("@/components/ui/badge");
var select_1 = require("@/components/ui/select");
var single_image_upload_1 = require("@/components/ui/single-image-upload");
var lucide_react_1 = require("lucide-react");
var sectionLibrary_1 = require("@/lib/sectionLibrary");
var supabase_1 = require("@/lib/supabase");
function SectionEditor(_a) {
    var section = _a.section, onSave = _a.onSave, onCancel = _a.onCancel;
    var _b = (0, react_1.useState)(section.content), content = _b[0], setContent = _b[1];
    var _c = (0, react_1.useState)([]), products = _c[0], setProducts = _c[1];
    var _d = (0, react_1.useState)([]), categories = _d[0], setCategories = _d[1];
    var template = (0, sectionLibrary_1.getSectionTemplate)(section.type);
    (0, react_1.useEffect)(function () {
        // Fetch products and categories for certain section types
        if (["product_carousel", "category_grid"].includes(section.type)) {
            fetchProducts();
            fetchCategories();
        }
    }, [section.type]);
    function fetchProducts() {
        return __awaiter(this, void 0, void 0, function () {
            var data, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, supabase_1.supabase
                                .from("products")
                                .select("*")
                                .eq("is_active", true)
                                .limit(20)];
                    case 1:
                        data = (_a.sent()).data;
                        if (data)
                            setProducts(data);
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        console.error("Failed to fetch products:", error_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    }
    function fetchCategories() {
        return __awaiter(this, void 0, void 0, function () {
            var data, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, supabase_1.supabase
                                .from("product_categories")
                                .select("*")
                                .eq("is_active", true)
                                .order("sort_order")];
                    case 1:
                        data = (_a.sent()).data;
                        if (data)
                            setCategories(data);
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _a.sent();
                        console.error("Failed to fetch categories:", error_2);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    }
    var handleSave = function () {
        onSave(__assign(__assign({}, section), { content: content }));
    };
    var updateContent = function (key, value) {
        setContent(function (prev) {
            var _a;
            return (__assign(__assign({}, prev), (_a = {}, _a[key] = value, _a)));
        });
    };
    var updateNestedContent = function (path, value) {
        setContent(function (prev) {
            var newContent = __assign({}, prev);
            var current = newContent;
            for (var i = 0; i < path.length - 1; i++) {
                if (!current[path[i]])
                    current[path[i]] = {};
                current = current[path[i]];
            }
            current[path[path.length - 1]] = value;
            return newContent;
        });
    };
    if (!template) {
        return (<div className="p-6">
        <p>Unknown section type: {section.type}</p>
        <button_1.Button onClick={onCancel}>Close</button_1.Button>
      </div>);
    }
    return (<div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <template.icon className="w-5 h-5"/>
            Edit {template.name}
          </h2>
          <p className="text-muted-foreground">{template.description}</p>
        </div>
        <badge_1.Badge variant="outline">{template.category}</badge_1.Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <card_1.Card>
            <card_1.CardHeader>
              <card_1.CardTitle>Content Settings</card_1.CardTitle>
            </card_1.CardHeader>
            <card_1.CardContent>
              <SectionContentEditor sectionType={section.type} content={content} updateContent={updateContent} updateNestedContent={updateNestedContent} products={products} categories={categories}/>
            </card_1.CardContent>
          </card_1.Card>
        </div>

        <div>
          <card_1.Card>
            <card_1.CardHeader>
              <card_1.CardTitle>Section Settings</card_1.CardTitle>
            </card_1.CardHeader>
            <card_1.CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <label_1.Label htmlFor="is_visible">Visible</label_1.Label>
                <switch_1.Switch id="is_visible" checked={section.is_visible} onCheckedChange={function (checked) {
            // This will be handled by parent component
        }}/>
              </div>

              <div className="pt-4 border-t space-y-2">
                <button_1.Button onClick={handleSave} className="w-full">
                  Save Changes
                </button_1.Button>
                <button_1.Button onClick={onCancel} variant="outline" className="w-full">
                  Cancel
                </button_1.Button>
              </div>
            </card_1.CardContent>
          </card_1.Card>
        </div>
      </div>
    </div>);
}
function SectionContentEditor(_a) {
    var sectionType = _a.sectionType, content = _a.content, updateContent = _a.updateContent, updateNestedContent = _a.updateNestedContent, products = _a.products, categories = _a.categories;
    switch (sectionType) {
        case "hero":
            return <HeroEditor content={content} updateContent={updateContent}/>;
        case "hero_carousel":
            return (<HeroCarouselEditor content={content} updateContent={updateContent}/>);
        case "text_block":
            return (<TextBlockEditor content={content} updateContent={updateContent}/>);
        case "heading":
            return <HeadingEditor content={content} updateContent={updateContent}/>;
        case "paragraph":
            return (<ParagraphEditor content={content} updateContent={updateContent}/>);
        case "image":
            return <ImageEditor content={content} updateContent={updateContent}/>;
        case "button":
            return <ButtonEditor content={content} updateContent={updateContent}/>;
        case "list":
            return <ListEditor content={content} updateContent={updateContent}/>;
        case "features":
            return (<FeaturesEditor content={content} updateContent={updateContent} updateNestedContent={updateNestedContent}/>);
        case "product_carousel":
            return (<ProductCarouselEditor content={content} updateContent={updateContent} products={products} categories={categories}/>);
        case "category_grid":
            return (<CategoryGridEditor content={content} updateContent={updateContent} categories={categories}/>);
        case "testimonials":
            return (<TestimonialsEditor content={content} updateContent={updateContent} updateNestedContent={updateNestedContent}/>);
        case "newsletter":
            return (<NewsletterEditor content={content} updateContent={updateContent}/>);
        case "banner":
            return <BannerEditor content={content} updateContent={updateContent}/>;
        default:
            return (<div className="text-muted-foreground">
          No editor available for {sectionType}
        </div>);
    }
}
// Individual section editors
function HeroEditor(_a) {
    var content = _a.content, updateContent = _a.updateContent;
    return (<div className="space-y-4">
      <div>
        <label_1.Label htmlFor="title">Title</label_1.Label>
        <input_1.Input id="title" value={content.title || ""} onChange={function (e) { return updateContent("title", e.target.value); }} placeholder="Welcome to Our Store"/>
      </div>

      <div>
        <label_1.Label htmlFor="subtitle">Subtitle</label_1.Label>
        <input_1.Input id="subtitle" value={content.subtitle || ""} onChange={function (e) { return updateContent("subtitle", e.target.value); }} placeholder="Your tagline here"/>
      </div>

      <div>
        <label_1.Label htmlFor="description">Description</label_1.Label>
        <textarea_1.Textarea id="description" value={content.description || ""} onChange={function (e) { return updateContent("description", e.target.value); }} placeholder="Detailed description..." rows={3}/>
      </div>

      <div>
        <label_1.Label htmlFor="background_image">Background Image</label_1.Label>
        <single_image_upload_1.SingleImageUpload imageUrl={content.background_image || ""} onImageChange={function (url) { return updateContent("background_image", url); }} label="Hero Background"/>
      </div>

      <div>
        <label_1.Label htmlFor="button_text">Button Text</label_1.Label>
        <input_1.Input id="button_text" value={content.button_text || ""} onChange={function (e) { return updateContent("button_text", e.target.value); }} placeholder="Shop Now"/>
      </div>

      <div>
        <label_1.Label htmlFor="button_link">Button Link</label_1.Label>
        <input_1.Input id="button_link" value={content.button_link || ""} onChange={function (e) { return updateContent("button_link", e.target.value); }} placeholder="/products"/>
      </div>
    </div>);
}
function HeroCarouselEditor(_a) {
    var content = _a.content, updateContent = _a.updateContent;
    var slides = content.slides || [];
    var addSlide = function () {
        var newSlides = __spreadArray(__spreadArray([], slides, true), [{ image: "", url: "", target: "_self" }], false);
        updateContent("slides", newSlides);
    };
    var updateSlide = function (index, field, value) {
        var _a;
        var newSlides = __spreadArray([], slides, true);
        newSlides[index] = __assign(__assign({}, newSlides[index]), (_a = {}, _a[field] = value, _a));
        updateContent("slides", newSlides);
    };
    var removeSlide = function (index) {
        var newSlides = slides.filter(function (_, i) { return i !== index; });
        updateContent("slides", newSlides);
    };
    var moveSlide = function (index, direction) {
        var _a;
        var newSlides = __spreadArray([], slides, true);
        var targetIndex = direction === "up" ? index - 1 : index + 1;
        if (targetIndex >= 0 && targetIndex < slides.length) {
            _a = [
                newSlides[targetIndex],
                newSlides[index],
            ], newSlides[index] = _a[0], newSlides[targetIndex] = _a[1];
            updateContent("slides", newSlides);
        }
    };
    return (<div className="space-y-6">
      {/* Slides Management */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <label_1.Label className="text-base font-semibold">Carousel Slides</label_1.Label>
          <button_1.Button onClick={addSlide} size="sm">
            <lucide_react_1.Plus className="w-4 h-4 mr-1"/>
            Add Slide
          </button_1.Button>
        </div>

        {slides.length === 0 ? (<div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
            <p className="text-gray-500">
              No slides yet. Click "Add Slide" to get started.
            </p>
          </div>) : (<div className="space-y-4">
            {slides.map(function (slide, index) { return (<card_1.Card key={index} className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <h4 className="text-sm font-medium">Slide {index + 1}</h4>
                  <div className="flex gap-2">
                    <button_1.Button onClick={function () { return moveSlide(index, "up"); }} size="sm" variant="outline" disabled={index === 0}>
                      ↑
                    </button_1.Button>
                    <button_1.Button onClick={function () { return moveSlide(index, "down"); }} size="sm" variant="outline" disabled={index === slides.length - 1}>
                      ↓
                    </button_1.Button>
                    <button_1.Button onClick={function () { return removeSlide(index); }} size="sm" variant="outline">
                      <lucide_react_1.Trash2 className="w-4 h-4"/>
                    </button_1.Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label_1.Label>Image</label_1.Label>
                    <single_image_upload_1.SingleImageUpload imageUrl={slide.image || ""} onImageChange={function (url) { return updateSlide(index, "image", url); }} label={"Slide ".concat(index + 1, " Image")}/>
                  </div>

                  <div>
                    <label_1.Label htmlFor={"url-".concat(index)}>Link URL (optional)</label_1.Label>
                    <input_1.Input id={"url-".concat(index)} value={slide.url || ""} onChange={function (e) {
                    return updateSlide(index, "url", e.target.value);
                }} placeholder="https://example.com or /page"/>
                  </div>

                  <div>
                    <label_1.Label htmlFor={"target-".concat(index)}>Link Target</label_1.Label>
                    <select_1.Select value={slide.target || "_self"} onValueChange={function (value) {
                    return updateSlide(index, "target", value);
                }}>
                      <select_1.SelectTrigger>
                        <select_1.SelectValue />
                      </select_1.SelectTrigger>
                      <select_1.SelectContent>
                        <select_1.SelectItem value="_self">
                          Same window (_self)
                        </select_1.SelectItem>
                        <select_1.SelectItem value="_blank">
                          New window (_blank)
                        </select_1.SelectItem>
                      </select_1.SelectContent>
                    </select_1.Select>
                  </div>
                </div>
              </card_1.Card>); })}
          </div>)}
      </div>

      {/* Carousel Settings */}
      <card_1.Card className="p-4">
        <h4 className="text-sm font-medium mb-4">Carousel Settings</h4>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label_1.Label htmlFor="height">Height (px)</label_1.Label>
            <input_1.Input id="height" type="number" value={content.height || 500} onChange={function (e) {
            return updateContent("height", parseInt(e.target.value));
        }}/>
          </div>

          <div>
            <label_1.Label htmlFor="autoplay_delay">Autoplay Delay (ms)</label_1.Label>
            <input_1.Input id="autoplay_delay" type="number" value={content.autoplay_delay || 5000} onChange={function (e) {
            return updateContent("autoplay_delay", parseInt(e.target.value));
        }}/>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label_1.Label htmlFor="autoplay">Autoplay</label_1.Label>
            <switch_1.Switch id="autoplay" checked={content.autoplay || false} onCheckedChange={function (checked) { return updateContent("autoplay", checked); }}/>
          </div>

          <div className="flex items-center justify-between">
            <label_1.Label htmlFor="show_navigation">Show Navigation</label_1.Label>
            <switch_1.Switch id="show_navigation" checked={content.show_navigation || false} onCheckedChange={function (checked) {
            return updateContent("show_navigation", checked);
        }}/>
          </div>

          <div className="flex items-center justify-between">
            <label_1.Label htmlFor="show_dots">Show Dots</label_1.Label>
            <switch_1.Switch id="show_dots" checked={content.show_dots || false} onCheckedChange={function (checked) { return updateContent("show_dots", checked); }}/>
          </div>
        </div>
      </card_1.Card>
    </div>);
}
function TextBlockEditor(_a) {
    var content = _a.content, updateContent = _a.updateContent;
    return (<div className="space-y-4">
      <div>
        <label_1.Label htmlFor="content">Content</label_1.Label>
        <textarea_1.Textarea id="content" value={content.content || ""} onChange={function (e) { return updateContent("content", e.target.value); }} placeholder="Your content here..." rows={6}/>
      </div>

      <div>
        <label_1.Label htmlFor="alignment">Alignment</label_1.Label>
        <select_1.Select value={content.alignment || "left"} onValueChange={function (value) { return updateContent("alignment", value); }}>
          <select_1.SelectTrigger>
            <select_1.SelectValue />
          </select_1.SelectTrigger>
          <select_1.SelectContent>
            <select_1.SelectItem value="left">Left</select_1.SelectItem>
            <select_1.SelectItem value="center">Center</select_1.SelectItem>
            <select_1.SelectItem value="right">Right</select_1.SelectItem>
          </select_1.SelectContent>
        </select_1.Select>
      </div>
    </div>);
}
function HeadingEditor(_a) {
    var _b;
    var content = _a.content, updateContent = _a.updateContent;
    return (<div className="space-y-4">
      <div>
        <label_1.Label htmlFor="text">Heading Text</label_1.Label>
        <input_1.Input id="text" value={content.text || ""} onChange={function (e) { return updateContent("text", e.target.value); }} placeholder="Heading text"/>
      </div>

      <div>
        <label_1.Label htmlFor="level">Heading Level</label_1.Label>
        <select_1.Select value={((_b = content.level) === null || _b === void 0 ? void 0 : _b.toString()) || "1"} onValueChange={function (value) { return updateContent("level", parseInt(value)); }}>
          <select_1.SelectTrigger>
            <select_1.SelectValue />
          </select_1.SelectTrigger>
          <select_1.SelectContent>
            <select_1.SelectItem value="1">H1</select_1.SelectItem>
            <select_1.SelectItem value="2">H2</select_1.SelectItem>
            <select_1.SelectItem value="3">H3</select_1.SelectItem>
            <select_1.SelectItem value="4">H4</select_1.SelectItem>
            <select_1.SelectItem value="5">H5</select_1.SelectItem>
            <select_1.SelectItem value="6">H6</select_1.SelectItem>
          </select_1.SelectContent>
        </select_1.Select>
      </div>
    </div>);
}
function ParagraphEditor(_a) {
    var content = _a.content, updateContent = _a.updateContent;
    return (<div className="space-y-4">
      <div>
        <label_1.Label htmlFor="text">Paragraph Text</label_1.Label>
        <textarea_1.Textarea id="text" value={content.text || ""} onChange={function (e) { return updateContent("text", e.target.value); }} placeholder="Your paragraph content..." rows={4}/>
      </div>
    </div>);
}
function ImageEditor(_a) {
    var content = _a.content, updateContent = _a.updateContent;
    return (<div className="space-y-4">
      <div>
        <label_1.Label>Image</label_1.Label>
        <single_image_upload_1.SingleImageUpload imageUrl={content.src || ""} onImageChange={function (url) { return updateContent("src", url); }} label="Section Image"/>
      </div>

      <div>
        <label_1.Label htmlFor="alt">Alt Text</label_1.Label>
        <input_1.Input id="alt" value={content.alt || ""} onChange={function (e) { return updateContent("alt", e.target.value); }} placeholder="Image description"/>
      </div>

      <div>
        <label_1.Label htmlFor="caption">Caption (optional)</label_1.Label>
        <input_1.Input id="caption" value={content.caption || ""} onChange={function (e) { return updateContent("caption", e.target.value); }} placeholder="Image caption"/>
      </div>
    </div>);
}
function ButtonEditor(_a) {
    var content = _a.content, updateContent = _a.updateContent;
    return (<div className="space-y-4">
      <div>
        <label_1.Label htmlFor="text">Button Text</label_1.Label>
        <input_1.Input id="text" value={content.text || ""} onChange={function (e) { return updateContent("text", e.target.value); }} placeholder="Click Here"/>
      </div>

      <div>
        <label_1.Label htmlFor="link">Link</label_1.Label>
        <input_1.Input id="link" value={content.link || ""} onChange={function (e) { return updateContent("link", e.target.value); }} placeholder="/products"/>
      </div>

      <div>
        <label_1.Label htmlFor="style">Style</label_1.Label>
        <select_1.Select value={content.style || "primary"} onValueChange={function (value) { return updateContent("style", value); }}>
          <select_1.SelectTrigger>
            <select_1.SelectValue />
          </select_1.SelectTrigger>
          <select_1.SelectContent>
            <select_1.SelectItem value="primary">Primary</select_1.SelectItem>
            <select_1.SelectItem value="secondary">Secondary</select_1.SelectItem>
            <select_1.SelectItem value="outline">Outline</select_1.SelectItem>
          </select_1.SelectContent>
        </select_1.Select>
      </div>
    </div>);
}
function ListEditor(_a) {
    var content = _a.content, updateContent = _a.updateContent;
    var _b = (0, react_1.useState)(content.items || []), items = _b[0], setItems = _b[1];
    var addItem = function () {
        var newItems = __spreadArray(__spreadArray([], items, true), ["New item"], false);
        setItems(newItems);
        updateContent("items", newItems);
    };
    var updateItem = function (index, value) {
        var newItems = __spreadArray([], items, true);
        newItems[index] = value;
        setItems(newItems);
        updateContent("items", newItems);
    };
    var removeItem = function (index) {
        var newItems = items.filter(function (_, i) { return i !== index; });
        setItems(newItems);
        updateContent("items", newItems);
    };
    return (<div className="space-y-4">
      <div>
        <label_1.Label htmlFor="type">List Type</label_1.Label>
        <select_1.Select value={content.type || "bulleted"} onValueChange={function (value) { return updateContent("type", value); }}>
          <select_1.SelectTrigger>
            <select_1.SelectValue />
          </select_1.SelectTrigger>
          <select_1.SelectContent>
            <select_1.SelectItem value="bulleted">Bulleted</select_1.SelectItem>
            <select_1.SelectItem value="numbered">Numbered</select_1.SelectItem>
          </select_1.SelectContent>
        </select_1.Select>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label_1.Label>List Items</label_1.Label>
          <button_1.Button onClick={addItem} size="sm">
            <lucide_react_1.Plus className="w-4 h-4 mr-1"/>
            Add Item
          </button_1.Button>
        </div>

        <div className="space-y-2">
          {items.map(function (item, index) { return (<div key={index} className="flex gap-2">
              <input_1.Input value={item} onChange={function (e) { return updateItem(index, e.target.value); }} placeholder={"Item ".concat(index + 1)}/>
              <button_1.Button onClick={function () { return removeItem(index); }} size="sm" variant="outline">
                <lucide_react_1.Trash2 className="w-4 h-4"/>
              </button_1.Button>
            </div>); })}
        </div>
      </div>
    </div>);
}
function FeaturesEditor(_a) {
    var content = _a.content, updateContent = _a.updateContent, updateNestedContent = _a.updateNestedContent;
    var features = content.features || [];
    var addFeature = function () {
        var newFeatures = __spreadArray(__spreadArray([], features, true), [
            {
                icon: "star",
                title: "New Feature",
                description: "Feature description",
            },
        ], false);
        updateContent("features", newFeatures);
    };
    var updateFeature = function (index, key, value) {
        updateNestedContent(["features", index.toString(), key], value);
    };
    var removeFeature = function (index) {
        var newFeatures = features.filter(function (_, i) { return i !== index; });
        updateContent("features", newFeatures);
    };
    return (<div className="space-y-4">
      <div>
        <label_1.Label htmlFor="title">Section Title</label_1.Label>
        <input_1.Input id="title" value={content.title || ""} onChange={function (e) { return updateContent("title", e.target.value); }} placeholder="Why Choose Us"/>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label_1.Label>Features</label_1.Label>
          <button_1.Button onClick={addFeature} size="sm">
            <lucide_react_1.Plus className="w-4 h-4 mr-1"/>
            Add Feature
          </button_1.Button>
        </div>

        <div className="space-y-4">
          {features.map(function (feature, index) { return (<card_1.Card key={index}>
              <card_1.CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <h4 className="text-sm font-medium">Feature {index + 1}</h4>
                  <button_1.Button onClick={function () { return removeFeature(index); }} size="sm" variant="outline">
                    <lucide_react_1.Trash2 className="w-4 h-4"/>
                  </button_1.Button>
                </div>

                <div className="space-y-3">
                  <div>
                    <label_1.Label>Icon</label_1.Label>
                    <select_1.Select value={feature.icon || "star"} onValueChange={function (value) {
                return updateFeature(index, "icon", value);
            }}>
                      <select_1.SelectTrigger>
                        <select_1.SelectValue />
                      </select_1.SelectTrigger>
                      <select_1.SelectContent>
                        <select_1.SelectItem value="star">Star</select_1.SelectItem>
                        <select_1.SelectItem value="heart">Heart</select_1.SelectItem>
                        <select_1.SelectItem value="shield">Shield</select_1.SelectItem>
                        <select_1.SelectItem value="truck">Truck</select_1.SelectItem>
                        <select_1.SelectItem value="zap">Zap</select_1.SelectItem>
                      </select_1.SelectContent>
                    </select_1.Select>
                  </div>

                  <div>
                    <label_1.Label>Title</label_1.Label>
                    <input_1.Input value={feature.title || ""} onChange={function (e) {
                return updateFeature(index, "title", e.target.value);
            }} placeholder="Feature title"/>
                  </div>

                  <div>
                    <label_1.Label>Description</label_1.Label>
                    <textarea_1.Textarea value={feature.description || ""} onChange={function (e) {
                return updateFeature(index, "description", e.target.value);
            }} placeholder="Feature description" rows={2}/>
                  </div>
                </div>
              </card_1.CardContent>
            </card_1.Card>); })}
        </div>
      </div>
    </div>);
}
function ProductCarouselEditor(_a) {
    var content = _a.content, updateContent = _a.updateContent, products = _a.products, categories = _a.categories;
    return (<div className="space-y-4">
      <div>
        <label_1.Label htmlFor="title">Section Title</label_1.Label>
        <input_1.Input id="title" value={content.title || ""} onChange={function (e) { return updateContent("title", e.target.value); }} placeholder="Featured Products"/>
      </div>

      <div>
        <label_1.Label htmlFor="product_filter">Product Filter</label_1.Label>
        <select_1.Select value={content.product_filter || "featured"} onValueChange={function (value) { return updateContent("product_filter", value); }}>
          <select_1.SelectTrigger>
            <select_1.SelectValue />
          </select_1.SelectTrigger>
          <select_1.SelectContent>
            <select_1.SelectItem value="featured">Featured Products</select_1.SelectItem>
            <select_1.SelectItem value="latest">Latest Products</select_1.SelectItem>
            <select_1.SelectItem value="popular">Popular Products</select_1.SelectItem>
            <select_1.SelectItem value="sale">Sale Products</select_1.SelectItem>
          </select_1.SelectContent>
        </select_1.Select>
      </div>

      <div>
        <label_1.Label htmlFor="show_count">Number of Products</label_1.Label>
        <input_1.Input id="show_count" type="number" value={content.show_count || 8} onChange={function (e) {
            return updateContent("show_count", parseInt(e.target.value));
        }} min="1" max="20"/>
      </div>

      <div className="flex items-center justify-between">
        <label_1.Label htmlFor="autoplay">Autoplay</label_1.Label>
        <switch_1.Switch id="autoplay" checked={content.autoplay || false} onCheckedChange={function (checked) { return updateContent("autoplay", checked); }}/>
      </div>
    </div>);
}
function CategoryGridEditor(_a) {
    var _b;
    var content = _a.content, updateContent = _a.updateContent, categories = _a.categories;
    return (<div className="space-y-4">
      <div>
        <label_1.Label htmlFor="show_count">Number of Categories</label_1.Label>
        <input_1.Input id="show_count" type="number" value={content.show_count || 8} onChange={function (e) {
            return updateContent("show_count", parseInt(e.target.value));
        }} min="1" max="20"/>
      </div>

      <div>
        <label_1.Label htmlFor="columns">Columns</label_1.Label>
        <select_1.Select value={((_b = content.columns) === null || _b === void 0 ? void 0 : _b.toString()) || "4"} onValueChange={function (value) { return updateContent("columns", parseInt(value)); }}>
          <select_1.SelectTrigger>
            <select_1.SelectValue />
          </select_1.SelectTrigger>
          <select_1.SelectContent>
            <select_1.SelectItem value="2">2 Columns</select_1.SelectItem>
            <select_1.SelectItem value="3">3 Columns</select_1.SelectItem>
            <select_1.SelectItem value="4">4 Columns</select_1.SelectItem>
            <select_1.SelectItem value="6">6 Columns</select_1.SelectItem>
          </select_1.SelectContent>
        </select_1.Select>
      </div>

      <div className="flex items-center justify-between">
        <label_1.Label htmlFor="show_product_count">Show Product Count</label_1.Label>
        <switch_1.Switch id="show_product_count" checked={content.show_product_count || false} onCheckedChange={function (checked) {
            return updateContent("show_product_count", checked);
        }}/>
      </div>
    </div>);
}
function TestimonialsEditor(_a) {
    var content = _a.content, updateContent = _a.updateContent, updateNestedContent = _a.updateNestedContent;
    var testimonials = content.testimonials || [];
    var addTestimonial = function () {
        var newTestimonials = __spreadArray(__spreadArray([], testimonials, true), [
            {
                name: "Customer Name",
                location: "City",
                rating: 5,
                review: "Great service!",
                image: "",
            },
        ], false);
        updateContent("testimonials", newTestimonials);
    };
    var updateTestimonial = function (index, key, value) {
        updateNestedContent(["testimonials", index.toString(), key], value);
    };
    var removeTestimonial = function (index) {
        var newTestimonials = testimonials.filter(function (_, i) { return i !== index; });
        updateContent("testimonials", newTestimonials);
    };
    return (<div className="space-y-4">
      <div>
        <label_1.Label htmlFor="title">Section Title</label_1.Label>
        <input_1.Input id="title" value={content.title || ""} onChange={function (e) { return updateContent("title", e.target.value); }} placeholder="What Our Customers Say"/>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label_1.Label>Testimonials</label_1.Label>
          <button_1.Button onClick={addTestimonial} size="sm">
            <lucide_react_1.Plus className="w-4 h-4 mr-1"/>
            Add Testimonial
          </button_1.Button>
        </div>

        <div className="space-y-4">
          {testimonials.map(function (testimonial, index) { return (<card_1.Card key={index}>
              <card_1.CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <h4 className="text-sm font-medium">
                    Testimonial {index + 1}
                  </h4>
                  <button_1.Button onClick={function () { return removeTestimonial(index); }} size="sm" variant="outline">
                    <lucide_react_1.Trash2 className="w-4 h-4"/>
                  </button_1.Button>
                </div>

                <div className="space-y-3">
                  <div>
                    <label_1.Label>Customer Name</label_1.Label>
                    <input_1.Input value={testimonial.name || ""} onChange={function (e) {
                return updateTestimonial(index, "name", e.target.value);
            }} placeholder="Customer name"/>
                  </div>

                  <div>
                    <label_1.Label>Location</label_1.Label>
                    <input_1.Input value={testimonial.location || ""} onChange={function (e) {
                return updateTestimonial(index, "location", e.target.value);
            }} placeholder="City, State"/>
                  </div>

                  <div>
                    <label_1.Label>Rating</label_1.Label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map(function (star) { return (<button key={star} onClick={function () {
                    return updateTestimonial(index, "rating", star);
                }} className={"text-lg ".concat(star <= (testimonial.rating || 5)
                    ? "text-yellow-400"
                    : "text-gray-300")}>
                          <lucide_react_1.Star className="w-4 h-4 fill-current"/>
                        </button>); })}
                    </div>
                  </div>

                  <div>
                    <label_1.Label>Review</label_1.Label>
                    <textarea_1.Textarea value={testimonial.review || ""} onChange={function (e) {
                return updateTestimonial(index, "review", e.target.value);
            }} placeholder="Customer review" rows={3}/>
                  </div>

                  <div>
                    <label_1.Label>Customer Photo (optional)</label_1.Label>
                    <single_image_upload_1.SingleImageUpload imageUrl={testimonial.image || ""} onImageChange={function (url) {
                return updateTestimonial(index, "image", url);
            }} label="Customer Photo"/>
                  </div>
                </div>
              </card_1.CardContent>
            </card_1.Card>); })}
        </div>
      </div>
    </div>);
}
function NewsletterEditor(_a) {
    var content = _a.content, updateContent = _a.updateContent;
    return (<div className="space-y-4">
      <div>
        <label_1.Label htmlFor="title">Title</label_1.Label>
        <input_1.Input id="title" value={content.title || ""} onChange={function (e) { return updateContent("title", e.target.value); }} placeholder="Stay Updated"/>
      </div>

      <div>
        <label_1.Label htmlFor="description">Description</label_1.Label>
        <textarea_1.Textarea id="description" value={content.description || ""} onChange={function (e) { return updateContent("description", e.target.value); }} placeholder="Subscribe to get the latest offers" rows={2}/>
      </div>

      <div>
        <label_1.Label htmlFor="placeholder">Input Placeholder</label_1.Label>
        <input_1.Input id="placeholder" value={content.placeholder || ""} onChange={function (e) { return updateContent("placeholder", e.target.value); }} placeholder="Enter your email"/>
      </div>

      <div>
        <label_1.Label htmlFor="button_text">Button Text</label_1.Label>
        <input_1.Input id="button_text" value={content.button_text || ""} onChange={function (e) { return updateContent("button_text", e.target.value); }} placeholder="Subscribe"/>
      </div>
    </div>);
}
function BannerEditor(_a) {
    var content = _a.content, updateContent = _a.updateContent;
    return (<div className="space-y-4">
      <div>
        <label_1.Label htmlFor="text">Banner Text</label_1.Label>
        <input_1.Input id="text" value={content.text || ""} onChange={function (e) { return updateContent("text", e.target.value); }} placeholder="Special Offer!"/>
      </div>

      <div>
        <label_1.Label htmlFor="subtext">Subtext (optional)</label_1.Label>
        <input_1.Input id="subtext" value={content.subtext || ""} onChange={function (e) { return updateContent("subtext", e.target.value); }} placeholder="Limited time only"/>
      </div>

      <div>
        <label_1.Label htmlFor="link">Link</label_1.Label>
        <input_1.Input id="link" value={content.link || ""} onChange={function (e) { return updateContent("link", e.target.value); }} placeholder="/products"/>
      </div>

      <div>
        <label_1.Label htmlFor="button_text">Button Text</label_1.Label>
        <input_1.Input id="button_text" value={content.button_text || ""} onChange={function (e) { return updateContent("button_text", e.target.value); }} placeholder="Shop Now"/>
      </div>

      <div className="flex items-center justify-between">
        <label_1.Label htmlFor="show_button">Show Button</label_1.Label>
        <switch_1.Switch id="show_button" checked={content.show_button || false} onCheckedChange={function (checked) { return updateContent("show_button", checked); }}/>
      </div>
    </div>);
}
