"use strict";
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
exports.MultiCategorySelect = MultiCategorySelect;
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var button_1 = require("@/components/ui/button");
var badge_1 = require("@/components/ui/badge");
var label_1 = require("@/components/ui/label");
var utils_1 = require("@/lib/utils");
function MultiCategorySelect(_a) {
    var categories = _a.categories, selectedCategoryIds = _a.selectedCategoryIds, onSelectionChange = _a.onSelectionChange, primaryCategoryId = _a.primaryCategoryId, onPrimaryCategoryChange = _a.onPrimaryCategoryChange, _b = _a.label, label = _b === void 0 ? "Categories" : _b, _c = _a.placeholder, placeholder = _c === void 0 ? "Select categories..." : _c, _d = _a.disabled, disabled = _d === void 0 ? false : _d, _e = _a.required, required = _e === void 0 ? false : _e;
    var _f = (0, react_1.useState)(false), isOpen = _f[0], setIsOpen = _f[1];
    var _g = (0, react_1.useState)(""), searchQuery = _g[0], setSearchQuery = _g[1];
    var dropdownRef = (0, react_1.useRef)(null);
    // Group categories by parent (main categories and subcategories)
    var mainCategories = categories.filter(function (cat) { return !cat.parent_id; });
    var subcategoriesMap = categories.reduce(function (acc, cat) {
        if (cat.parent_id) {
            if (!acc[cat.parent_id])
                acc[cat.parent_id] = [];
            acc[cat.parent_id].push(cat);
        }
        return acc;
    }, {});
    // Filter categories based on search
    var filteredMainCategories = mainCategories.filter(function (cat) {
        return cat.name.toLowerCase().includes(searchQuery.toLowerCase());
    });
    var filteredSubcategories = Object.keys(subcategoriesMap).reduce(function (acc, parentId) {
        var filtered = subcategoriesMap[parentId].filter(function (cat) {
            return cat.name.toLowerCase().includes(searchQuery.toLowerCase());
        });
        if (filtered.length > 0) {
            acc[parentId] = filtered;
        }
        return acc;
    }, {});
    // Get selected categories for display
    var selectedCategories = categories.filter(function (cat) {
        return selectedCategoryIds.includes(cat.id);
    });
    // Close dropdown when clicking outside
    (0, react_1.useEffect)(function () {
        var handleClickOutside = function (event) {
            if (dropdownRef.current &&
                !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return function () { return document.removeEventListener("mousedown", handleClickOutside); };
    }, []);
    var handleCategoryToggle = function (categoryId) {
        var isSelected = selectedCategoryIds.includes(categoryId);
        var newSelection;
        if (isSelected) {
            newSelection = selectedCategoryIds.filter(function (id) { return id !== categoryId; });
            // If removing the primary category, set a new primary
            if (primaryCategoryId === categoryId &&
                newSelection.length > 0 &&
                onPrimaryCategoryChange) {
                onPrimaryCategoryChange(newSelection[0]);
            }
        }
        else {
            newSelection = __spreadArray(__spreadArray([], selectedCategoryIds, true), [categoryId], false);
            // If this is the first category, make it primary
            if (newSelection.length === 1 && onPrimaryCategoryChange) {
                onPrimaryCategoryChange(categoryId);
            }
        }
        onSelectionChange(newSelection);
    };
    var handlePrimaryChange = function (categoryId) {
        if (onPrimaryCategoryChange && selectedCategoryIds.includes(categoryId)) {
            onPrimaryCategoryChange(categoryId);
        }
    };
    var removeCategory = function (categoryId) {
        handleCategoryToggle(categoryId);
    };
    var clearAll = function () {
        onSelectionChange([]);
        if (onPrimaryCategoryChange) {
            onPrimaryCategoryChange("");
        }
    };
    return (<div className="space-y-2">
      {label && (<label_1.Label className={(0, utils_1.cn)("text-sm font-medium", required && "after:content-['*'] after:text-red-500 after:ml-1")}>
          {label}
        </label_1.Label>)}

      <div className="relative" ref={dropdownRef}>
        {/* Trigger Button */}
        <button_1.Button type="button" variant="outline" onClick={function () { return !disabled && setIsOpen(!isOpen); }} disabled={disabled} className={(0, utils_1.cn)("w-full justify-between text-left font-normal", selectedCategories.length === 0 && "text-muted-foreground")}>
          <span className="truncate">
            {selectedCategories.length === 0
            ? placeholder
            : "".concat(selectedCategories.length, " categories selected")}
          </span>
          <lucide_react_1.ChevronDown className={(0, utils_1.cn)("h-4 w-4 transition-transform", isOpen && "rotate-180")}/>
        </button_1.Button>

        {/* Selected Categories Display */}
        {selectedCategories.length > 0 && (<div className="flex flex-wrap gap-1 mt-2">
            {selectedCategories.map(function (category) { return (<badge_1.Badge key={category.id} variant={primaryCategoryId === category.id ? "default" : "secondary"} className={(0, utils_1.cn)("text-xs flex items-center gap-1 cursor-pointer", primaryCategoryId === category.id &&
                    "border-2 border-primary")} onClick={function () { return handlePrimaryChange(category.id); }}>
                {category.name}
                {primaryCategoryId === category.id && (<span className="text-xs font-bold">(Primary)</span>)}
                <lucide_react_1.X className="h-3 w-3 hover:bg-destructive hover:text-destructive-foreground rounded-full" onClick={function (e) {
                    e.stopPropagation();
                    removeCategory(category.id);
                }}/>
              </badge_1.Badge>); })}
            {selectedCategories.length > 1 && (<button_1.Button type="button" variant="ghost" size="sm" onClick={clearAll} className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground">
                Clear All
              </button_1.Button>)}
          </div>)}

        {/* Dropdown Menu */}
        {isOpen && (<div className="absolute top-full left-0 right-0 z-50 mt-1 bg-background border border-border rounded-md shadow-lg">
            {/* Search Input */}
            <div className="p-3 border-b">
              <input type="text" placeholder="Search categories..." value={searchQuery} onChange={function (e) { return setSearchQuery(e.target.value); }} className="w-full px-3 py-2 text-sm border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring" autoFocus/>
            </div>

            {/* Categories List */}
            <div className="max-h-64 overflow-y-auto">
              {/* Main Categories */}
              {filteredMainCategories.map(function (category) { return (<div key={category.id}>
                  <div className={(0, utils_1.cn)("flex items-center justify-between px-3 py-2 hover:bg-accent cursor-pointer", selectedCategoryIds.includes(category.id) &&
                    "bg-accent/50")} onClick={function () { return handleCategoryToggle(category.id); }}>
                    <div className="flex items-center gap-2">
                      <div className={(0, utils_1.cn)("w-4 h-4 border border-primary rounded flex items-center justify-center", selectedCategoryIds.includes(category.id) &&
                    "bg-primary")}>
                        {selectedCategoryIds.includes(category.id) && (<lucide_react_1.Check className="h-3 w-3 text-primary-foreground"/>)}
                      </div>
                      <span className="font-medium">{category.name}</span>
                      {primaryCategoryId === category.id && (<badge_1.Badge variant="outline" className="text-xs">
                          Primary
                        </badge_1.Badge>)}
                    </div>
                  </div>

                  {/* Subcategories */}
                  {filteredSubcategories[category.id] && (<div className="ml-6">
                      {filteredSubcategories[category.id].map(function (subcategory) { return (<div key={subcategory.id} className={(0, utils_1.cn)("flex items-center justify-between px-3 py-2 hover:bg-accent cursor-pointer text-sm", selectedCategoryIds.includes(subcategory.id) &&
                            "bg-accent/50")} onClick={function () { return handleCategoryToggle(subcategory.id); }}>
                          <div className="flex items-center gap-2">
                            <div className={(0, utils_1.cn)("w-4 h-4 border border-primary rounded flex items-center justify-center", selectedCategoryIds.includes(subcategory.id) &&
                            "bg-primary")}>
                              {selectedCategoryIds.includes(subcategory.id) && (<lucide_react_1.Check className="h-3 w-3 text-primary-foreground"/>)}
                            </div>
                            <span>{subcategory.name}</span>
                            {primaryCategoryId === subcategory.id && (<badge_1.Badge variant="outline" className="text-xs">
                                Primary
                              </badge_1.Badge>)}
                          </div>
                        </div>); })}
                    </div>)}
                </div>); })}

              {/* No results */}
              {filteredMainCategories.length === 0 &&
                Object.keys(filteredSubcategories).length === 0 && (<div className="px-3 py-4 text-center text-sm text-muted-foreground">
                    No categories found matching "{searchQuery}"
                  </div>)}
            </div>

            {/* Footer */}
            <div className="p-3 border-t bg-muted/50 text-xs text-muted-foreground">
              Click a selected category to make it primary. Primary category is
              used for main classification.
            </div>
          </div>)}
      </div>
    </div>);
}
