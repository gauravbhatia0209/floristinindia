"use strict";
// Footer Configuration
// To add more columns, simply increase MAX_COLUMNS below
Object.defineProperty(exports, "__esModule", { value: true });
exports.FOOTER_CONFIG = void 0;
exports.getAvailableColumns = getAvailableColumns;
exports.getGridClass = getGridClass;
exports.isValidColumnPosition = isValidColumnPosition;
exports.FOOTER_CONFIG = {
    // Maximum number of columns supported (can be increased to 8, 10, etc.)
    DEFAULT_MAX_COLUMNS: 6,
    // Column 1 is always reserved for company information
    COMPANY_COLUMN: 1,
    // Minimum and maximum allowed columns
    MIN_COLUMNS: 3,
    MAX_COLUMNS_LIMIT: 8,
    // Grid classes for different column counts (Tailwind CSS)
    GRID_CLASSES: {
        3: "lg:grid-cols-3",
        4: "lg:grid-cols-4",
        5: "lg:grid-cols-5",
        6: "lg:grid-cols-6",
        7: "lg:grid-cols-7",
        8: "lg:grid-cols-8",
    },
    // Responsive breakpoints
    RESPONSIVE_CLASSES: "grid-cols-1 md:grid-cols-2",
};
// Helper function to get available columns for footer sections
function getAvailableColumns(maxColumns) {
    var max = Math.min(Math.max(maxColumns, exports.FOOTER_CONFIG.MIN_COLUMNS), exports.FOOTER_CONFIG.MAX_COLUMNS_LIMIT);
    return Array.from({ length: max - 1 }, function (_, i) { return i + 2; });
}
// Helper function to get grid class for given column count
function getGridClass(columns) {
    var gridClass = exports.FOOTER_CONFIG.GRID_CLASSES[columns];
    return "".concat(exports.FOOTER_CONFIG.RESPONSIVE_CLASSES, " ").concat(gridClass || "lg:grid-cols-4");
}
// Helper function to validate column position
function isValidColumnPosition(columnPosition, maxColumns) {
    return columnPosition >= 2 && columnPosition <= maxColumns;
}
