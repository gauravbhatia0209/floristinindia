import { useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import {
  Plus,
  GripVertical,
  Eye,
  EyeOff,
  Edit,
  Trash2,
  Settings,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ChevronDown } from "lucide-react";
import {
  getSectionTemplatesForPage,
  getSectionTemplatesByCategory,
  getSectionTemplate,
  SectionTemplate,
} from "@/lib/sectionLibrary";

export interface Section {
  id: string;
  type: string;
  content: any;
  is_visible: boolean;
  sort_order: number;
}

interface SectionBuilderProps {
  sections: Section[];
  onSectionsChange: (sections: Section[]) => void;
  pageType: "homepage" | "pages";
  onSectionEdit: (section: Section) => void;
}

export function SectionBuilder({
  sections,
  onSectionsChange,
  pageType,
  onSectionEdit,
}: SectionBuilderProps) {
  const [isAddingSection, setIsAddingSection] = useState(false);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const newSections = Array.from(sections);
    const [reorderedSection] = newSections.splice(result.source.index, 1);
    newSections.splice(result.destination.index, 0, reorderedSection);

    // Update sort_order for all sections
    const updatedSections = newSections.map((section, index) => ({
      ...section,
      sort_order: index,
    }));

    onSectionsChange(updatedSections);
  };

  const addSection = (template: SectionTemplate) => {
    const newSection: Section = {
      id: `section_${Date.now()}`,
      type: template.type,
      content: template.defaultContent,
      is_visible: true,
      sort_order: sections.length,
    };

    onSectionsChange([...sections, newSection]);
    setIsAddingSection(false);
  };

  const toggleSectionVisibility = (sectionId: string) => {
    const updatedSections = sections.map((section) =>
      section.id === sectionId
        ? { ...section, is_visible: !section.is_visible }
        : section,
    );
    onSectionsChange(updatedSections);
  };

  const deleteSection = (sectionId: string) => {
    if (confirm("Are you sure you want to delete this section?")) {
      const updatedSections = sections
        .filter((section) => section.id !== sectionId)
        .map((section, index) => ({ ...section, sort_order: index }));
      onSectionsChange(updatedSections);
    }
  };

  const sectionsByCategory = getSectionTemplatesByCategory(pageType);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Layers className="w-5 h-5" />
            Content Sections
          </h3>
          <p className="text-sm text-muted-foreground">
            Drag and drop to reorder sections. Click to edit content.
          </p>
        </div>
        <Dialog open={isAddingSection} onOpenChange={setIsAddingSection}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Section
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Section</DialogTitle>
            </DialogHeader>
            <SectionTemplateSelector
              sectionsByCategory={sectionsByCategory}
              onSelectTemplate={addSection}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Sections List */}
      {sections.length === 0 ? (
        <Card className="border-dashed border-2">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Layers className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No sections yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              Start building your{" "}
              {pageType === "homepage" ? "homepage" : "page"} by adding content
              sections
            </p>
            <Button onClick={() => setIsAddingSection(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add First Section
            </Button>
          </CardContent>
        </Card>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="sections">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {sections.map((section, index) => {
                  const template = getSectionTemplate(section.type);
                  return (
                    <Draggable
                      key={section.id}
                      draggableId={section.id}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <Card
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`mb-4 ${
                            snapshot.isDragging ? "shadow-lg" : ""
                          } ${!section.is_visible ? "opacity-50" : ""}`}
                        >
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div
                                  {...provided.dragHandleProps}
                                  className="cursor-grab hover:bg-muted p-1 rounded"
                                >
                                  <GripVertical className="w-4 h-4 text-muted-foreground" />
                                </div>
                                {template?.icon && (
                                  <template.icon className="w-5 h-5 text-primary" />
                                )}
                                <div>
                                  <h4 className="font-medium">
                                    {template?.name || section.type}
                                  </h4>
                                  <p className="text-sm text-muted-foreground">
                                    {template?.description}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge
                                  variant={
                                    section.is_visible ? "default" : "secondary"
                                  }
                                  className="text-xs"
                                >
                                  {section.is_visible ? "Visible" : "Hidden"}
                                </Badge>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    toggleSectionVisibility(section.id)
                                  }
                                >
                                  {section.is_visible ? (
                                    <Eye className="w-4 h-4" />
                                  ) : (
                                    <EyeOff className="w-4 h-4" />
                                  )}
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => onSectionEdit(section)}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => deleteSection(section.id)}
                                >
                                  <Trash2 className="w-4 h-4 text-destructive" />
                                </Button>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <SectionPreview
                              section={section}
                              template={template}
                            />
                          </CardContent>
                        </Card>
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}
    </div>
  );
}

function SectionTemplateSelector({
  sectionsByCategory,
  onSelectTemplate,
}: {
  sectionsByCategory: Record<string, SectionTemplate[]>;
  onSelectTemplate: (template: SectionTemplate) => void;
}) {
  const categoryLabels = {
    content: "Content & Media",
    commerce: "E-commerce",
    marketing: "Marketing & Engagement",
    layout: "Layout & Structure",
  };

  return (
    <div className="space-y-4">
      {Object.entries(sectionsByCategory).map(([category, templates]) => (
        <Collapsible key={category} defaultOpen={true}>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-between p-4 h-auto"
            >
              <h3 className="text-lg font-semibold">
                {categoryLabels[category as keyof typeof categoryLabels] ||
                  category}
              </h3>
              <ChevronDown className="w-4 h-4" />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
              {templates.map((template) => (
                <Card
                  key={template.type}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => onSelectTemplate(template)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <template.icon className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm mb-1">
                          {template.name}
                        </h4>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {template.description}
                        </p>
                        <Badge variant="outline" className="text-xs mt-2">
                          {template.category}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      ))}
    </div>
  );
}

function SectionPreview({
  section,
  template,
}: {
  section: Section;
  template: SectionTemplate | undefined;
}) {
  if (!template) {
    return (
      <div className="text-sm text-muted-foreground">
        Unknown section type: {section.type}
      </div>
    );
  }

  // Generate a simple preview based on section type and content
  switch (section.type) {
    case "hero":
    case "hero_carousel":
      return (
        <div className="bg-muted rounded p-4 text-sm">
          <div className="font-medium mb-1">
            {section.content?.title || "Hero Section"}
          </div>
          <div className="text-muted-foreground">
            {section.content?.subtitle ||
              section.content?.description ||
              "Hero content preview"}
          </div>
        </div>
      );

    case "text_block":
    case "paragraph":
      return (
        <div className="bg-muted rounded p-4 text-sm">
          <div className="text-muted-foreground line-clamp-3">
            {section.content?.content ||
              section.content?.text ||
              "Text content preview"}
          </div>
        </div>
      );

    case "heading":
      return (
        <div className="bg-muted rounded p-4 text-sm">
          <div
            className={`font-semibold ${
              section.content?.level === 1
                ? "text-lg"
                : section.content?.level === 2
                  ? "text-base"
                  : "text-sm"
            }`}
          >
            {section.content?.text || "Heading Text"}
          </div>
        </div>
      );

    case "features":
      return (
        <div className="bg-muted rounded p-4 text-sm">
          <div className="font-medium mb-2">
            {section.content?.title || "Features Section"}
          </div>
          <div className="text-muted-foreground">
            {section.content?.features?.length || 0} features configured
          </div>
        </div>
      );

    case "product_carousel":
      return (
        <div className="bg-muted rounded p-4 text-sm">
          <div className="font-medium mb-1">Product Showcase</div>
          <div className="text-muted-foreground">
            Filter: {section.content?.product_filter || "featured"} • Show:{" "}
            {section.content?.show_count || 8} products
          </div>
        </div>
      );

    case "testimonials":
      return (
        <div className="bg-muted rounded p-4 text-sm">
          <div className="font-medium mb-1">Customer Reviews</div>
          <div className="text-muted-foreground">
            {section.content?.testimonials?.length || 0} testimonials
          </div>
        </div>
      );

    default:
      return (
        <div className="bg-muted rounded p-4 text-sm">
          <div className="font-medium mb-1">{template.name}</div>
          <div className="text-muted-foreground">{template.description}</div>
        </div>
      );
  }
}
