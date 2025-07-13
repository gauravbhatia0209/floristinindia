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
exports.fetchProductsWithCategories = fetchProductsWithCategories;
exports.getCategoriesWithProductCount = getCategoriesWithProductCount;
exports.doesProductBelongToCategory = doesProductBelongToCategory;
exports.getProductPrimaryCategory = getProductPrimaryCategory;
var supabase_1 = require("@/lib/supabase");
/**
 * Fetch products with their category assignments
 */
function fetchProductsWithCategories() {
    return __awaiter(this, arguments, void 0, function (options) {
        var productIds, categoryId, category, assignments_1, legacyProducts, productQuery, _a, products, productsError, assignments_2, allCategories_1, productsWithCategories, error_1;
        if (options === void 0) { options = {}; }
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 10, , 11]);
                    productIds = [];
                    if (!(options.categoryId || options.categorySlug)) return [3 /*break*/, 6];
                    categoryId = options.categoryId;
                    if (!(options.categorySlug && !categoryId)) return [3 /*break*/, 2];
                    return [4 /*yield*/, supabase_1.supabase
                            .from("product_categories")
                            .select("id")
                            .eq("slug", options.categorySlug)
                            .single()];
                case 1:
                    category = (_b.sent()).data;
                    categoryId = category === null || category === void 0 ? void 0 : category.id;
                    _b.label = 2;
                case 2:
                    if (!categoryId) return [3 /*break*/, 6];
                    return [4 /*yield*/, supabase_1.supabase
                            .from("product_category_assignments")
                            .select("product_id")
                            .eq("category_id", categoryId)];
                case 3:
                    assignments_1 = (_b.sent()).data;
                    if (!(assignments_1 && assignments_1.length > 0)) return [3 /*break*/, 4];
                    productIds = assignments_1.map(function (a) { return a.product_id; });
                    return [3 /*break*/, 6];
                case 4: return [4 /*yield*/, supabase_1.supabase
                        .from("products")
                        .select("id")
                        .eq("category_id", categoryId)
                        .eq("is_active", options.includeInactive ? undefined : true)];
                case 5:
                    legacyProducts = (_b.sent()).data;
                    productIds = (legacyProducts === null || legacyProducts === void 0 ? void 0 : legacyProducts.map(function (p) { return p.id; })) || [];
                    _b.label = 6;
                case 6:
                    productQuery = supabase_1.supabase.from("products").select("*");
                    if (!options.includeInactive) {
                        productQuery = productQuery.eq("is_active", true);
                    }
                    if (productIds.length > 0) {
                        productQuery = productQuery.in("id", productIds);
                    }
                    if (options.limit) {
                        productQuery = productQuery.limit(options.limit);
                    }
                    return [4 /*yield*/, productQuery];
                case 7:
                    _a = _b.sent(), products = _a.data, productsError = _a.error;
                    if (productsError)
                        throw productsError;
                    if (!products || products.length === 0) {
                        return [2 /*return*/, []];
                    }
                    return [4 /*yield*/, supabase_1.supabase
                            .from("product_category_assignments")
                            .select("\n        *,\n        product_categories (*)\n      ")
                            .in("product_id", products.map(function (p) { return p.id; }))];
                case 8:
                    assignments_2 = (_b.sent()).data;
                    return [4 /*yield*/, supabase_1.supabase
                            .from("product_categories")
                            .select("*")
                            .eq("is_active", true)];
                case 9:
                    allCategories_1 = (_b.sent()).data;
                    productsWithCategories = products.map(function (product) {
                        var productAssignments = (assignments_2 === null || assignments_2 === void 0 ? void 0 : assignments_2.filter(function (a) { return a.product_id === product.id; })) || [];
                        var assignedCategories = [];
                        var primaryCategory;
                        if (productAssignments.length > 0) {
                            // Use multi-category assignments
                            assignedCategories = productAssignments
                                .map(function (a) { return a.product_categories; })
                                .filter(Boolean);
                            var primaryAssignment_1 = productAssignments.find(function (a) { return a.is_primary; });
                            primaryCategory = primaryAssignment_1
                                ? assignedCategories.find(function (c) { return c.id === primaryAssignment_1.category_id; })
                                : assignedCategories[0];
                        }
                        else {
                            // Fall back to legacy single category
                            var legacyCategory = allCategories_1 === null || allCategories_1 === void 0 ? void 0 : allCategories_1.find(function (c) { return c.id === product.category_id; });
                            if (legacyCategory) {
                                assignedCategories = [legacyCategory];
                                primaryCategory = legacyCategory;
                            }
                        }
                        return __assign(__assign({}, product), { category_assignments: productAssignments, assigned_categories: assignedCategories, primary_category: primaryCategory });
                    });
                    return [2 /*return*/, productsWithCategories];
                case 10:
                    error_1 = _b.sent();
                    console.error("Failed to fetch products with categories:", error_1);
                    throw error_1;
                case 11: return [2 /*return*/];
            }
        });
    });
}
/**
 * Get all categories that contain products
 */
function getCategoriesWithProductCount() {
    return __awaiter(this, void 0, void 0, function () {
        var categories, categoriesWithCounts, error_2;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, supabase_1.supabase
                            .from("product_categories")
                            .select("*")
                            .eq("is_active", true)
                            .order("sort_order")];
                case 1:
                    categories = (_a.sent()).data;
                    if (!categories)
                        return [2 /*return*/, []];
                    return [4 /*yield*/, Promise.all(categories.map(function (category) { return __awaiter(_this, void 0, void 0, function () {
                            var assignments, productCount, activeProducts, legacyProducts;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, supabase_1.supabase
                                            .from("product_category_assignments")
                                            .select("product_id")
                                            .eq("category_id", category.id)];
                                    case 1:
                                        assignments = (_a.sent()).data;
                                        productCount = 0;
                                        if (!(assignments && assignments.length > 0)) return [3 /*break*/, 3];
                                        return [4 /*yield*/, supabase_1.supabase
                                                .from("products")
                                                .select("id")
                                                .in("id", assignments.map(function (a) { return a.product_id; }))
                                                .eq("is_active", true)];
                                    case 2:
                                        activeProducts = (_a.sent()).data;
                                        productCount = (activeProducts === null || activeProducts === void 0 ? void 0 : activeProducts.length) || 0;
                                        return [3 /*break*/, 5];
                                    case 3: return [4 /*yield*/, supabase_1.supabase
                                            .from("products")
                                            .select("id")
                                            .eq("category_id", category.id)
                                            .eq("is_active", true)];
                                    case 4:
                                        legacyProducts = (_a.sent()).data;
                                        productCount = (legacyProducts === null || legacyProducts === void 0 ? void 0 : legacyProducts.length) || 0;
                                        _a.label = 5;
                                    case 5: return [2 /*return*/, __assign(__assign({}, category), { product_count: productCount })];
                                }
                            });
                        }); }))];
                case 2:
                    categoriesWithCounts = _a.sent();
                    return [2 /*return*/, categoriesWithCounts];
                case 3:
                    error_2 = _a.sent();
                    console.error("Failed to get categories with product count:", error_2);
                    return [2 /*return*/, []];
                case 4: return [2 /*return*/];
            }
        });
    });
}
/**
 * Check if a product belongs to a specific category
 */
function doesProductBelongToCategory(product, categoryId) {
    // Check multi-category assignments first
    if (product.assigned_categories) {
        return product.assigned_categories.some(function (cat) { return cat.id === categoryId; });
    }
    // Fall back to legacy single category
    return product.category_id === categoryId;
}
/**
 * Get the primary category for a product
 */
function getProductPrimaryCategory(product) {
    return product.primary_category || null;
}
