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
exports.SectionBuilder = SectionBuilder;
var react_1 = require("react");
var dnd_1 = require("@hello-pangea/dnd");
var lucide_react_1 = require("lucide-react");
var button_1 = require("@/components/ui/button");
var card_1 = require("@/components/ui/card");
var badge_1 = require("@/components/ui/badge");
var dialog_1 = require("@/components/ui/dialog");
var collapsible_1 = require("@/components/ui/collapsible");
var lucide_react_2 = require("lucide-react");
var sectionLibrary_1 = require("@/lib/sectionLibrary");
function SectionBuilder(_a) {
    var sections = _a.sections, onSectionsChange = _a.onSectionsChange, pageType = _a.pageType, onSectionEdit = _a.onSectionEdit;
    var _b = (0, react_1.useState)(false), isAddingSection = _b[0], setIsAddingSection = _b[1];
    var handleDragEnd = function (result) {
        if (!result.destination)
            return;
        var newSections = Array.from(sections);
        var reorderedSection = newSections.splice(result.source.index, 1)[0];
        newSections.splice(result.destination.index, 0, reorderedSection);
        // Update sort_order for all sections
        var updatedSections = newSections.map(function (section, index) { return (__assign(__assign({}, section), { sort_order: index })); });
        onSectionsChange(updatedSections);
    };
    var addSection = function (template) {
        var newSection = {
            id: "section_".concat(Date.now()),
            type: template.type,
            content: template.defaultContent,
            is_visible: true,
            sort_order: sections.length,
        };
        onSectionsChange(__spreadArray(__spreadArray([], sections, true), [newSection], false));
        setIsAddingSection(false);
    };
    var toggleSectionVisibility = function (sectionId) {
        var updatedSections = sections.map(function (section) {
            return section.id === sectionId
                ? __assign(__assign({}, section), { is_visible: !section.is_visible }) : section;
        });
        onSectionsChange(updatedSections);
    };
    var deleteSection = function (sectionId) {
        if (confirm("Are you sure you want to delete this section?")) {
            var updatedSections = sections
                .filter(function (section) { return section.id !== sectionId; })
                .map(function (section, index) { return (__assign(__assign({}, section), { sort_order: index })); });
            onSectionsChange(updatedSections);
        }
    };
    var sectionsByCategory = (0, sectionLibrary_1.getSectionTemplatesByCategory)(pageType);
    return (<div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <lucide_react_1.Layers className="w-5 h-5"/>
            Content Sections
          </h3>
          <p className="text-sm text-muted-foreground">
            Drag and drop to reorder sections. Click to edit content.
          </p>
        </div>
        <dialog_1.Dialog open={isAddingSection} onOpenChange={setIsAddingSection}>
          <dialog_1.DialogTrigger asChild>
            <button_1.Button>
              <lucide_react_1.Plus className="w-4 h-4 mr-2"/>
              Add Section
            </button_1.Button>
          </dialog_1.DialogTrigger>
          <dialog_1.DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <dialog_1.DialogHeader>
              <dialog_1.DialogTitle>Add New Section</dialog_1.DialogTitle>
            </dialog_1.DialogHeader>
            <SectionTemplateSelector sectionsByCategory={sectionsByCategory} onSelectTemplate={addSection}/>
          </dialog_1.DialogContent>
        </dialog_1.Dialog>
      </div>

      {/* Sections List */}
      {sections.length === 0 ? (<card_1.Card className="border-dashed border-2">
          <card_1.CardContent className="flex flex-col items-center justify-center py-12">
            <lucide_react_1.Layers className="w-12 h-12 text-muted-foreground mb-4"/>
            <h3 className="text-lg font-semibold mb-2">No sections yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              Start building your{" "}
              {pageType === "homepage" ? "homepage" : "page"} by adding content
              sections
            </p>
            <button_1.Button onClick={function () { return setIsAddingSection(true); }}>
              <lucide_react_1.Plus className="w-4 h-4 mr-2"/>
              Add First Section
            </button_1.Button>
          </card_1.CardContent>
        </card_1.Card>) : (<dnd_1.DragDropContext onDragEnd={handleDragEnd}>
          <dnd_1.Droppable droppableId="sections">
            {function (provided) { return (<div {...provided.droppableProps} ref={provided.innerRef}>
                {sections.map(function (section, index) {
                    var template = (0, sectionLibrary_1.getSectionTemplate)(section.type);
                    return (<dnd_1.Draggable key={section.id} draggableId={section.id} index={index}>
                      {function (provided, snapshot) { return (<card_1.Card ref={provided.innerRef} {...provided.draggableProps} className={"mb-4 ".concat(snapshot.isDragging ? "shadow-lg" : "", " ").concat(!section.is_visible ? "opacity-50" : "")}>
                          <card_1.CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div {...provided.dragHandleProps} className="cursor-grab hover:bg-muted p-1 rounded">
                                  <lucide_react_1.GripVertical className="w-4 h-4 text-muted-foreground"/>
                                </div>
                                {(template === null || template === void 0 ? void 0 : template.icon) && (<template.icon className="w-5 h-5 text-primary"/>)}
                                <div>
                                  <h4 className="font-medium">
                                    {(template === null || template === void 0 ? void 0 : template.name) || section.type}
                                  </h4>
                                  <p className="text-sm text-muted-foreground">
                                    {template === null || template === void 0 ? void 0 : template.description}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <badge_1.Badge variant={section.is_visible ? "default" : "secondary"} className="text-xs">
                                  {section.is_visible ? "Visible" : "Hidden"}
                                </badge_1.Badge>
                                <button_1.Button variant="ghost" size="sm" onClick={function () {
                                return toggleSectionVisibility(section.id);
                            }}>
                                  {section.is_visible ? (<lucide_react_1.Eye className="w-4 h-4"/>) : (<lucide_react_1.EyeOff className="w-4 h-4"/>)}
                                </button_1.Button>
                                <button_1.Button variant="ghost" size="sm" onClick={function () { return onSectionEdit(section); }}>
                                  <lucide_react_1.Edit className="w-4 h-4"/>
                                </button_1.Button>
                                <button_1.Button variant="ghost" size="sm" onClick={function () { return deleteSection(section.id); }}>
                                  <lucide_react_1.Trash2 className="w-4 h-4 text-destructive"/>
                                </button_1.Button>
                              </div>
                            </div>
                          </card_1.CardHeader>
                          <card_1.CardContent className="pt-0">
                            <SectionPreview section={section} template={template}/>
                          </card_1.CardContent>
                        </card_1.Card>); }}
                    </dnd_1.Draggable>);
                })}
                {provided.placeholder}
              </div>); }}
          </dnd_1.Droppable>
        </dnd_1.DragDropContext>)}
    </div>);
}
function SectionTemplateSelector(_a) {
    var sectionsByCategory = _a.sectionsByCategory, onSelectTemplate = _a.onSelectTemplate;
    var categoryLabels = {
        content: "Content & Media",
        commerce: "E-commerce",
        marketing: "Marketing & Engagement",
        layout: "Layout & Structure",
    };
    return (<div className="space-y-4">
      {Object.entries(sectionsByCategory).map(function (_a) {
            var category = _a[0], templates = _a[1];
            return (<collapsible_1.Collapsible key={category} defaultOpen={true}>
          <collapsible_1.CollapsibleTrigger asChild>
            <button_1.Button variant="ghost" className="w-full justify-between p-4 h-auto">
              <h3 className="text-lg font-semibold">
                {categoryLabels[category] ||
                    category}
              </h3>
              <lucide_react_2.ChevronDown className="w-4 h-4"/>
            </button_1.Button>
          </collapsible_1.CollapsibleTrigger>
          <collapsible_1.CollapsibleContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
              {templates.map(function (template) { return (<card_1.Card key={template.type} className="cursor-pointer hover:shadow-md transition-shadow" onClick={function () { return onSelectTemplate(template); }}>
                  <card_1.CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <template.icon className="w-6 h-6 text-primary flex-shrink-0 mt-1"/>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm mb-1">
                          {template.name}
                        </h4>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {template.description}
                        </p>
                        <badge_1.Badge variant="outline" className="text-xs mt-2">
                          {template.category}
                        </badge_1.Badge>
                      </div>
                    </div>
                  </card_1.CardContent>
                </card_1.Card>); })}
            </div>
          </collapsible_1.CollapsibleContent>
        </collapsible_1.Collapsible>);
        })}
    </div>);
}
function SectionPreview(_a) {
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
    var section = _a.section, template = _a.template;
    if (!template) {
        return (<div className="text-sm text-muted-foreground">
        Unknown section type: {section.type}
      </div>);
    }
    // Generate a simple preview based on section type and content
    switch (section.type) {
        case "hero":
        case "hero_carousel":
            return (<div className="bg-muted rounded p-4 text-sm">
          <div className="font-medium mb-1">
            {((_b = section.content) === null || _b === void 0 ? void 0 : _b.title) || "Hero Section"}
          </div>
          <div className="text-muted-foreground">
            {((_c = section.content) === null || _c === void 0 ? void 0 : _c.subtitle) ||
                    ((_d = section.content) === null || _d === void 0 ? void 0 : _d.description) ||
                    "Hero content preview"}
          </div>
        </div>);
        case "text_block":
        case "paragraph":
            return (<div className="bg-muted rounded p-4 text-sm">
          <div className="text-muted-foreground line-clamp-3">
            {((_e = section.content) === null || _e === void 0 ? void 0 : _e.content) ||
                    ((_f = section.content) === null || _f === void 0 ? void 0 : _f.text) ||
                    "Text content preview"}
          </div>
        </div>);
        case "heading":
            return (<div className="bg-muted rounded p-4 text-sm">
          <div className={"font-semibold ".concat(((_g = section.content) === null || _g === void 0 ? void 0 : _g.level) === 1
                    ? "text-lg"
                    : ((_h = section.content) === null || _h === void 0 ? void 0 : _h.level) === 2
                        ? "text-base"
                        : "text-sm")}>
            {((_j = section.content) === null || _j === void 0 ? void 0 : _j.text) || "Heading Text"}
          </div>
        </div>);
        case "features":
            return (<div className="bg-muted rounded p-4 text-sm">
          <div className="font-medium mb-2">
            {((_k = section.content) === null || _k === void 0 ? void 0 : _k.title) || "Features Section"}
          </div>
          <div className="text-muted-foreground">
            {((_m = (_l = section.content) === null || _l === void 0 ? void 0 : _l.features) === null || _m === void 0 ? void 0 : _m.length) || 0} features configured
          </div>
        </div>);
        case "product_carousel":
            return (<div className="bg-muted rounded p-4 text-sm">
          <div className="font-medium mb-1">Product Showcase</div>
          <div className="text-muted-foreground">
            Filter: {((_o = section.content) === null || _o === void 0 ? void 0 : _o.product_filter) || "featured"} • Show:{" "}
            {((_p = section.content) === null || _p === void 0 ? void 0 : _p.show_count) || 8} products
          </div>
        </div>);
        case "testimonials":
            return (<div className="bg-muted rounded p-4 text-sm">
          <div className="font-medium mb-1">Customer Reviews</div>
          <div className="text-muted-foreground">
            {((_r = (_q = section.content) === null || _q === void 0 ? void 0 : _q.testimonials) === null || _r === void 0 ? void 0 : _r.length) || 0} testimonials
          </div>
        </div>);
        default:
            return (<div className="bg-muted rounded p-4 text-sm">
          <div className="font-medium mb-1">{template.name}</div>
          <div className="text-muted-foreground">{template.description}</div>
        </div>);
    }
}
