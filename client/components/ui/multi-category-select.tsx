import React, { useState, useRef, useEffect } from "react";
import { Check, ChevronDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { ProductCategory } from "@shared/database.types";

interface MultiCategorySelectProps {
  categories: ProductCategory[];
  selectedCategoryIds: string[];
  onSelectionChange: (categoryIds: string[]) => void;
  primaryCategoryId?: string;
  onPrimaryCategoryChange?: (categoryId: string) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
}

export function MultiCategorySelect({
  categories,
  selectedCategoryIds,
  onSelectionChange,
  primaryCategoryId,
  onPrimaryCategoryChange,
  label = "Categories",
  placeholder = "Select categories...",
  disabled = false,
  required = false,
}: MultiCategorySelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Group categories by parent (main categories and subcategories)
  const mainCategories = categories.filter((cat) => !cat.parent_id);
  const subcategoriesMap = categories.reduce(
    (acc, cat) => {
      if (cat.parent_id) {
        if (!acc[cat.parent_id]) acc[cat.parent_id] = [];
        acc[cat.parent_id].push(cat);
      }
      return acc;
    },
    {} as Record<string, ProductCategory[]>,
  );

  // Filter categories based on search
  const filteredMainCategories = mainCategories.filter((cat) =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const filteredSubcategories = Object.keys(subcategoriesMap).reduce(
    (acc, parentId) => {
      const filtered = subcategoriesMap[parentId].filter((cat) =>
        cat.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      if (filtered.length > 0) {
        acc[parentId] = filtered;
      }
      return acc;
    },
    {} as Record<string, ProductCategory[]>,
  );

  // Get selected categories for display
  const selectedCategories = categories.filter((cat) =>
    selectedCategoryIds.includes(cat.id),
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCategoryToggle = (categoryId: string) => {
    const isSelected = selectedCategoryIds.includes(categoryId);
    let newSelection: string[];

    if (isSelected) {
      newSelection = selectedCategoryIds.filter((id) => id !== categoryId);
      // If removing the primary category, set a new primary
      if (
        primaryCategoryId === categoryId &&
        newSelection.length > 0 &&
        onPrimaryCategoryChange
      ) {
        onPrimaryCategoryChange(newSelection[0]);
      }
    } else {
      newSelection = [...selectedCategoryIds, categoryId];
      // If this is the first category, make it primary
      if (newSelection.length === 1 && onPrimaryCategoryChange) {
        onPrimaryCategoryChange(categoryId);
      }
    }

    onSelectionChange(newSelection);
  };

  const handlePrimaryChange = (categoryId: string) => {
    if (onPrimaryCategoryChange && selectedCategoryIds.includes(categoryId)) {
      onPrimaryCategoryChange(categoryId);
    }
  };

  const removeCategory = (categoryId: string) => {
    handleCategoryToggle(categoryId);
  };

  const clearAll = () => {
    onSelectionChange([]);
    if (onPrimaryCategoryChange) {
      onPrimaryCategoryChange("");
    }
  };

  return (
    <div className="space-y-2">
      {label && (
        <Label
          className={cn(
            "text-sm font-medium",
            required && "after:content-['*'] after:text-red-500 after:ml-1",
          )}
        >
          {label}
        </Label>
      )}

      <div className="relative" ref={dropdownRef}>
        {/* Trigger Button */}
        <Button
          type="button"
          variant="outline"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={cn(
            "w-full justify-between text-left font-normal",
            selectedCategories.length === 0 && "text-muted-foreground",
          )}
        >
          <span className="truncate">
            {selectedCategories.length === 0
              ? placeholder
              : `${selectedCategories.length} categories selected`}
          </span>
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform",
              isOpen && "rotate-180",
            )}
          />
        </Button>

        {/* Selected Categories Display */}
        {selectedCategories.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {selectedCategories.map((category) => (
              <Badge
                key={category.id}
                variant={
                  primaryCategoryId === category.id ? "default" : "secondary"
                }
                className={cn(
                  "text-xs flex items-center gap-1 cursor-pointer",
                  primaryCategoryId === category.id &&
                    "border-2 border-primary",
                )}
                onClick={() => handlePrimaryChange(category.id)}
              >
                {category.name}
                {primaryCategoryId === category.id && (
                  <span className="text-xs font-bold">(Primary)</span>
                )}
                <X
                  className="h-3 w-3 hover:bg-destructive hover:text-destructive-foreground rounded-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeCategory(category.id);
                  }}
                />
              </Badge>
            ))}
            {selectedCategories.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={clearAll}
                className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
              >
                Clear All
              </Button>
            )}
          </div>
        )}

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-background border border-border rounded-md shadow-lg">
            {/* Search Input */}
            <div className="p-3 border-b">
              <input
                type="text"
                placeholder="Search categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                autoFocus
              />
            </div>

            {/* Categories List */}
            <div className="max-h-64 overflow-y-auto">
              {/* Main Categories */}
              {filteredMainCategories.map((category) => (
                <div key={category.id}>
                  <div
                    className={cn(
                      "flex items-center justify-between px-3 py-2 hover:bg-accent cursor-pointer",
                      selectedCategoryIds.includes(category.id) &&
                        "bg-accent/50",
                    )}
                    onClick={() => handleCategoryToggle(category.id)}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={cn(
                          "w-4 h-4 border border-primary rounded flex items-center justify-center",
                          selectedCategoryIds.includes(category.id) &&
                            "bg-primary",
                        )}
                      >
                        {selectedCategoryIds.includes(category.id) && (
                          <Check className="h-3 w-3 text-primary-foreground" />
                        )}
                      </div>
                      <span className="font-medium">{category.name}</span>
                      {primaryCategoryId === category.id && (
                        <Badge variant="outline" className="text-xs">
                          Primary
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Subcategories */}
                  {filteredSubcategories[category.id] && (
                    <div className="ml-6">
                      {filteredSubcategories[category.id].map((subcategory) => (
                        <div
                          key={subcategory.id}
                          className={cn(
                            "flex items-center justify-between px-3 py-2 hover:bg-accent cursor-pointer text-sm",
                            selectedCategoryIds.includes(subcategory.id) &&
                              "bg-accent/50",
                          )}
                          onClick={() => handleCategoryToggle(subcategory.id)}
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className={cn(
                                "w-4 h-4 border border-primary rounded flex items-center justify-center",
                                selectedCategoryIds.includes(subcategory.id) &&
                                  "bg-primary",
                              )}
                            >
                              {selectedCategoryIds.includes(subcategory.id) && (
                                <Check className="h-3 w-3 text-primary-foreground" />
                              )}
                            </div>
                            <span>{subcategory.name}</span>
                            {primaryCategoryId === subcategory.id && (
                              <Badge variant="outline" className="text-xs">
                                Primary
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* No results */}
              {filteredMainCategories.length === 0 &&
                Object.keys(filteredSubcategories).length === 0 && (
                  <div className="px-3 py-4 text-center text-sm text-muted-foreground">
                    No categories found matching "{searchQuery}"
                  </div>
                )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t bg-muted/50 text-xs text-muted-foreground">
              Click a selected category to make it primary. Primary category is
              used for main classification.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
