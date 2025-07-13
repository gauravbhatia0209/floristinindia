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
exports.default = ProductEdit;
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var lucide_react_1 = require("lucide-react");
var button_1 = require("@/components/ui/button");
var card_1 = require("@/components/ui/card");
var input_1 = require("@/components/ui/input");
var label_1 = require("@/components/ui/label");
var textarea_1 = require("@/components/ui/textarea");
var switch_1 = require("@/components/ui/switch");
var supabase_1 = require("@/lib/supabase");
var image_upload_1 = require("@/components/ui/image-upload");
var ProductVariations_1 = require("@/components/admin/ProductVariations");
var multi_category_select_1 = require("@/components/ui/multi-category-select");
function ProductEdit() {
    var id = (0, react_router_dom_1.useParams)().id;
    var navigate = (0, react_router_dom_1.useNavigate)();
    var isNew = !id;
    var _a = (0, react_1.useState)(null), product = _a[0], setProduct = _a[1];
    var _b = (0, react_1.useState)([]), categories = _b[0], setCategories = _b[1];
    var _c = (0, react_1.useState)([]), selectedCategoryIds = _c[0], setSelectedCategoryIds = _c[1];
    var _d = (0, react_1.useState)(""), primaryCategoryId = _d[0], setPrimaryCategoryId = _d[1];
    var _e = (0, react_1.useState)(true), isLoading = _e[0], setIsLoading = _e[1];
    var _f = (0, react_1.useState)(false), isSaving = _f[0], setIsSaving = _f[1];
    var _g = (0, react_1.useState)({
        name: "",
        slug: "",
        description: "",
        short_description: "",
        price: "",
        sale_price: "",
        sku: "",
        stock_quantity: "",
        category_id: "",
        subcategory_id: "",
        images: [],
        tags: "",
        is_active: true,
        is_featured: false,
        has_variations: false,
        requires_file_upload: false,
        upload_file_types: "",
        delivery_zones: "",
        meta_title: "",
        meta_description: "",
        weight: "",
    }), formData = _g[0], setFormData = _g[1];
    (0, react_1.useEffect)(function () {
        fetchCategories();
        if (!isNew && id) {
            fetchProduct(id);
        }
        else {
            setIsLoading(false);
        }
    }, [id, isNew]);
    function fetchCategories() {
        return __awaiter(this, void 0, void 0, function () {
            var data, error_1, errorMessage;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, supabase_1.supabase
                                .from("product_categories")
                                .select("*")
                                .eq("is_active", true)
                                .order("name")];
                    case 1:
                        data = (_a.sent()).data;
                        if (data) {
                            setCategories(data);
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        console.error("Failed to fetch categories:", error_1);
                        errorMessage = (error_1 === null || error_1 === void 0 ? void 0 : error_1.message) || (error_1 === null || error_1 === void 0 ? void 0 : error_1.error_description) || "Unknown error";
                        console.error("Categories fetch error details:", errorMessage);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    }
    function fetchProduct(productId) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error, error_2, errorMessage;
            var _b, _c, _d, _e, _f, _g, _h, _j;
            return __generator(this, function (_k) {
                switch (_k.label) {
                    case 0:
                        _k.trys.push([0, 5, 6, 7]);
                        console.log("Fetching product with ID:", productId);
                        return [4 /*yield*/, supabase_1.supabase
                                .from("products")
                                .select("*")
                                .eq("id", productId)
                                .single()];
                    case 1:
                        _a = _k.sent(), data = _a.data, error = _a.error;
                        console.log("Supabase response:", { data: data, error: error });
                        if (error)
                            throw error;
                        if (!data) return [3 /*break*/, 3];
                        setProduct(data);
                        setFormData({
                            name: data.name || "",
                            slug: data.slug || "",
                            description: data.description || "",
                            short_description: data.short_description || "",
                            price: ((_b = data.price) === null || _b === void 0 ? void 0 : _b.toString()) || "",
                            sale_price: ((_c = data.sale_price) === null || _c === void 0 ? void 0 : _c.toString()) || "",
                            sku: data.sku || "",
                            stock_quantity: ((_d = data.stock_quantity) === null || _d === void 0 ? void 0 : _d.toString()) || "",
                            category_id: data.category_id || "",
                            subcategory_id: data.subcategory_id || "",
                            images: data.images || [],
                            tags: ((_e = data.tags) === null || _e === void 0 ? void 0 : _e.join(", ")) || "",
                            is_active: data.is_active,
                            is_featured: data.is_featured,
                            has_variations: (_f = data.has_variations) !== null && _f !== void 0 ? _f : false, // Use nullish coalescing for better handling
                            requires_file_upload: data.requires_file_upload,
                            upload_file_types: ((_g = data.upload_file_types) === null || _g === void 0 ? void 0 : _g.join(", ")) || "",
                            delivery_zones: ((_h = data.delivery_zones) === null || _h === void 0 ? void 0 : _h.join(", ")) || "",
                            meta_title: data.meta_title || "",
                            meta_description: data.meta_description || "",
                            weight: ((_j = data.weight) === null || _j === void 0 ? void 0 : _j.toString()) || "",
                        });
                        // Fetch category assignments
                        return [4 /*yield*/, fetchProductCategories(productId)];
                    case 2:
                        // Fetch category assignments
                        _k.sent();
                        return [3 /*break*/, 4];
                    case 3: throw new Error("Product not found");
                    case 4: return [3 /*break*/, 7];
                    case 5:
                        error_2 = _k.sent();
                        console.error("Failed to fetch product:", error_2);
                        errorMessage = (error_2 === null || error_2 === void 0 ? void 0 : error_2.message) || (error_2 === null || error_2 === void 0 ? void 0 : error_2.error_description) || "Unknown error";
                        alert("Failed to load product: ".concat(errorMessage));
                        return [3 /*break*/, 7];
                    case 6:
                        setIsLoading(false);
                        return [7 /*endfinally*/];
                    case 7: return [2 /*return*/];
                }
            });
        });
    }
    function fetchProductCategories(productId) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, assignments, assignmentsError, categoryId, categoryIds, primaryAssignment, categoryId, error_3, categoryId;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, supabase_1.supabase
                                .from("product_category_assignments")
                                .select("category_id, is_primary")
                                .eq("product_id", productId)];
                    case 1:
                        _a = _b.sent(), assignments = _a.data, assignmentsError = _a.error;
                        if (assignmentsError) {
                            // If junction table doesn't exist yet, fall back to single category
                            console.log("Junction table not available, using single category");
                            categoryId = formData.category_id;
                            if (categoryId) {
                                setSelectedCategoryIds([categoryId]);
                                setPrimaryCategoryId(categoryId);
                            }
                            return [2 /*return*/];
                        }
                        if (assignments && assignments.length > 0) {
                            categoryIds = assignments.map(function (a) { return a.category_id; });
                            primaryAssignment = assignments.find(function (a) { return a.is_primary; });
                            setSelectedCategoryIds(categoryIds);
                            setPrimaryCategoryId((primaryAssignment === null || primaryAssignment === void 0 ? void 0 : primaryAssignment.category_id) || categoryIds[0]);
                        }
                        else {
                            categoryId = formData.category_id;
                            if (categoryId) {
                                setSelectedCategoryIds([categoryId]);
                                setPrimaryCategoryId(categoryId);
                            }
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_3 = _b.sent();
                        console.error("Failed to fetch product categories:", error_3);
                        categoryId = formData.category_id;
                        if (categoryId) {
                            setSelectedCategoryIds([categoryId]);
                            setPrimaryCategoryId(categoryId);
                        }
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    }
    // Auto-generate slug from name
    (0, react_1.useEffect)(function () {
        if (formData.name && (!product || formData.slug === product.slug)) {
            var slug_1 = formData.name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-+|-+$/g, "");
            setFormData(function (prev) { return (__assign(__assign({}, prev), { slug: slug_1 })); });
        }
    }, [formData.name, product]);
    function handleSave() {
        return __awaiter(this, void 0, void 0, function () {
            var productData, productId, _a, data, error, error, error_4, errorMessage;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!formData.name || !formData.price || selectedCategoryIds.length === 0) {
                            alert("Please fill in all required fields including at least one category");
                            return [2 /*return*/];
                        }
                        setIsSaving(true);
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 7, 8, 9]);
                        productData = {
                            name: formData.name,
                            slug: formData.slug,
                            description: formData.description || null,
                            short_description: formData.short_description || null,
                            price: parseFloat(formData.price),
                            sale_price: formData.sale_price
                                ? parseFloat(formData.sale_price)
                                : null,
                            sku: formData.sku || null,
                            stock_quantity: parseInt(formData.stock_quantity) || 0,
                            category_id: primaryCategoryId, // Keep for backwards compatibility
                            subcategory_id: formData.subcategory_id || null,
                            images: formData.images,
                            tags: formData.tags
                                ? formData.tags.split(",").map(function (t) { return t.trim(); })
                                : [],
                            is_active: formData.is_active,
                            is_featured: formData.is_featured,
                            has_variations: formData.has_variations,
                            requires_file_upload: formData.requires_file_upload,
                            upload_file_types: formData.upload_file_types
                                ? formData.upload_file_types.split(",").map(function (t) { return t.trim(); })
                                : [],
                            delivery_zones: formData.delivery_zones
                                ? formData.delivery_zones.split(",").map(function (t) { return t.trim(); })
                                : [],
                            meta_title: formData.meta_title || null,
                            meta_description: formData.meta_description || null,
                            weight: formData.weight ? parseFloat(formData.weight) : null,
                        };
                        productId = void 0;
                        if (!isNew) return [3 /*break*/, 3];
                        return [4 /*yield*/, supabase_1.supabase
                                .from("products")
                                .insert(productData)
                                .select("id")
                                .single()];
                    case 2:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error)
                            throw error;
                        productId = data.id;
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, supabase_1.supabase
                            .from("products")
                            .update(productData)
                            .eq("id", id)];
                    case 4:
                        error = (_b.sent()).error;
                        if (error)
                            throw error;
                        productId = id;
                        _b.label = 5;
                    case 5: 
                    // Save category assignments
                    return [4 /*yield*/, saveCategoryAssignments(productId)];
                    case 6:
                        // Save category assignments
                        _b.sent();
                        alert(isNew
                            ? "Product created successfully!"
                            : "Product updated successfully!");
                        navigate("/admin/products");
                        return [3 /*break*/, 9];
                    case 7:
                        error_4 = _b.sent();
                        console.error("Failed to save product:", error_4);
                        errorMessage = "Unknown error";
                        if (error_4 === null || error_4 === void 0 ? void 0 : error_4.message) {
                            errorMessage = error_4.message;
                        }
                        else if (error_4 === null || error_4 === void 0 ? void 0 : error_4.error_description) {
                            errorMessage = error_4.error_description;
                        }
                        else if (error_4 === null || error_4 === void 0 ? void 0 : error_4.details) {
                            errorMessage = error_4.details;
                        }
                        else if (typeof error_4 === "string") {
                            errorMessage = error_4;
                        }
                        else if (error_4 === null || error_4 === void 0 ? void 0 : error_4.code) {
                            errorMessage = "Error ".concat(error_4.code, ": ").concat(error_4.hint || "Database error");
                        }
                        else {
                            errorMessage = JSON.stringify(error_4);
                        }
                        alert("Failed to save product: ".concat(errorMessage));
                        return [3 /*break*/, 9];
                    case 8:
                        setIsSaving(false);
                        return [7 /*endfinally*/];
                    case 9: return [2 /*return*/];
                }
            });
        });
    }
    function saveCategoryAssignments(productId) {
        return __awaiter(this, void 0, void 0, function () {
            var deleteError, assignments, insertError, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, supabase_1.supabase
                                .from("product_category_assignments")
                                .delete()
                                .eq("product_id", productId)];
                    case 1:
                        deleteError = (_a.sent()).error;
                        // If delete fails, the table might not exist yet - that's okay
                        if (deleteError && !deleteError.message.includes("does not exist")) {
                            console.warn("Could not delete existing assignments:", deleteError);
                        }
                        if (!(selectedCategoryIds.length > 0)) return [3 /*break*/, 3];
                        assignments = selectedCategoryIds.map(function (categoryId) { return ({
                            product_id: productId,
                            category_id: categoryId,
                            is_primary: categoryId === primaryCategoryId,
                        }); });
                        return [4 /*yield*/, supabase_1.supabase
                                .from("product_category_assignments")
                                .insert(assignments)];
                    case 2:
                        insertError = (_a.sent()).error;
                        if (insertError) {
                            // If the junction table doesn't exist, just continue with legacy single category
                            console.warn("Could not save category assignments, using legacy mode:", insertError);
                        }
                        _a.label = 3;
                    case 3: return [3 /*break*/, 5];
                    case 4:
                        error_5 = _a.sent();
                        console.warn("Failed to save category assignments:", error_5);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button_1.Button variant="ghost" size="icon" onClick={function () { return navigate("/admin/products"); }}>
            <lucide_react_1.ArrowLeft className="w-4 h-4"/>
          </button_1.Button>
          <div>
            <h1 className="text-2xl font-bold">
              {isNew ? "Add New Product" : "Edit Product"}
            </h1>
            <p className="text-muted-foreground">
              {isNew ? "Create a new product" : "Editing: ".concat(product === null || product === void 0 ? void 0 : product.name)}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button_1.Button variant="outline" onClick={function () { return navigate("/admin/products"); }}>
            Cancel
          </button_1.Button>
          <button_1.Button onClick={handleSave} disabled={isSaving}>
            <lucide_react_1.Save className="w-4 h-4 mr-2"/>
            {isSaving ? "Saving..." : "Save Product"}
          </button_1.Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          <card_1.Card>
            <card_1.CardHeader>
              <card_1.CardTitle>Basic Information</card_1.CardTitle>
            </card_1.CardHeader>
            <card_1.CardContent className="space-y-4">
              <div>
                <label_1.Label htmlFor="name">Product Name *</label_1.Label>
                <input_1.Input id="name" value={formData.name} onChange={function (e) {
            return setFormData(__assign(__assign({}, formData), { name: e.target.value }));
        }} placeholder="Beautiful Rose Bouquet"/>
              </div>

              <div>
                <label_1.Label htmlFor="slug">URL Slug *</label_1.Label>
                <input_1.Input id="slug" value={formData.slug} onChange={function (e) {
            return setFormData(__assign(__assign({}, formData), { slug: e.target.value }));
        }} placeholder="beautiful-rose-bouquet"/>
              </div>

              <div>
                <label_1.Label htmlFor="short_description">Short Description</label_1.Label>
                <textarea_1.Textarea id="short_description" value={formData.short_description} onChange={function (e) {
            return setFormData(__assign(__assign({}, formData), { short_description: e.target.value }));
        }} placeholder="Brief product description..." rows={2}/>
              </div>

              <div>
                <label_1.Label htmlFor="description">Full Description</label_1.Label>
                <textarea_1.Textarea id="description" value={formData.description} onChange={function (e) {
            return setFormData(__assign(__assign({}, formData), { description: e.target.value }));
        }} placeholder="Detailed product description..." rows={4}/>
              </div>
            </card_1.CardContent>
          </card_1.Card>

          <card_1.Card>
            <card_1.CardHeader>
              <card_1.CardTitle>Pricing & Inventory</card_1.CardTitle>
            </card_1.CardHeader>
            <card_1.CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label_1.Label htmlFor="price">Regular Price (��) *</label_1.Label>
                  <input_1.Input id="price" type="number" value={formData.price} onChange={function (e) {
            return setFormData(__assign(__assign({}, formData), { price: e.target.value }));
        }} placeholder="999"/>
                </div>
                <div>
                  <label_1.Label htmlFor="sale_price">Sale Price (₹)</label_1.Label>
                  <input_1.Input id="sale_price" type="number" value={formData.sale_price} onChange={function (e) {
            return setFormData(__assign(__assign({}, formData), { sale_price: e.target.value }));
        }} placeholder="799"/>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label_1.Label htmlFor="sku">SKU</label_1.Label>
                  <input_1.Input id="sku" value={formData.sku} onChange={function (e) {
            return setFormData(__assign(__assign({}, formData), { sku: e.target.value }));
        }} placeholder="RB-001"/>
                </div>
                <div>
                  <label_1.Label htmlFor="stock_quantity">Stock Quantity</label_1.Label>
                  <input_1.Input id="stock_quantity" type="number" value={formData.stock_quantity} onChange={function (e) {
            return setFormData(__assign(__assign({}, formData), { stock_quantity: e.target.value }));
        }} placeholder="50"/>
                </div>
              </div>
            </card_1.CardContent>
          </card_1.Card>

          <card_1.Card>
            <card_1.CardHeader>
              <card_1.CardTitle>Product Variations</card_1.CardTitle>
            </card_1.CardHeader>
            <card_1.CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label_1.Label htmlFor="has_variations">
                    Does this product have variations?
                  </label_1.Label>
                  <p className="text-sm text-muted-foreground">
                    Enable this to create different variants (size, color, etc.)
                  </p>
                </div>
                <switch_1.Switch id="has_variations" checked={formData.has_variations} onCheckedChange={function (checked) {
            return setFormData(__assign(__assign({}, formData), { has_variations: checked }));
        }}/>
              </div>
            </card_1.CardContent>
          </card_1.Card>

          <card_1.Card>
            <card_1.CardHeader>
              <card_1.CardTitle>Images</card_1.CardTitle>
            </card_1.CardHeader>
            <card_1.CardContent>
              <image_upload_1.ImageUpload images={formData.images} onImagesChange={function (images) {
            return setFormData(__assign(__assign({}, formData), { images: images }));
        }} maxImages={5} maxSizeMB={3} label="Product Images"/>
            </card_1.CardContent>
          </card_1.Card>

          {/* Product Variations Management */}
          {!isNew && product && formData.has_variations && (<ProductVariations_1.ProductVariations productId={product.id} basePrice={parseFloat(formData.price) || 0} baseSalePrice={formData.sale_price
                ? parseFloat(formData.sale_price)
                : undefined}/>)}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <card_1.Card>
            <card_1.CardHeader>
              <card_1.CardTitle>Categories</card_1.CardTitle>
            </card_1.CardHeader>
            <card_1.CardContent className="space-y-4">
              <multi_category_select_1.MultiCategorySelect categories={categories} selectedCategoryIds={selectedCategoryIds} onSelectionChange={setSelectedCategoryIds} primaryCategoryId={primaryCategoryId} onPrimaryCategoryChange={setPrimaryCategoryId} label="Product Categories" placeholder="Select one or more categories..." required={true}/>

              <div className="text-sm text-muted-foreground">
                <p>
                  • Select multiple categories to display this product in all
                  relevant sections
                </p>
                <p>
                  • Click a selected category to make it the primary category
                </p>
                <p>
                  • Primary category is used for main classification and
                  backwards compatibility
                </p>
              </div>

              <div>
                <label_1.Label htmlFor="tags">Tags (comma-separated)</label_1.Label>
                <input_1.Input id="tags" value={formData.tags} onChange={function (e) {
            return setFormData(__assign(__assign({}, formData), { tags: e.target.value }));
        }} placeholder="roses, bouquet, romantic"/>
              </div>
            </card_1.CardContent>
          </card_1.Card>

          <card_1.Card>
            <card_1.CardHeader>
              <card_1.CardTitle>Product Settings</card_1.CardTitle>
            </card_1.CardHeader>
            <card_1.CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <label_1.Label htmlFor="is_active">Active</label_1.Label>
                <switch_1.Switch id="is_active" checked={formData.is_active} onCheckedChange={function (checked) {
            return setFormData(__assign(__assign({}, formData), { is_active: checked }));
        }}/>
              </div>

              <div className="flex items-center justify-between">
                <label_1.Label htmlFor="is_featured">Featured</label_1.Label>
                <switch_1.Switch id="is_featured" checked={formData.is_featured} onCheckedChange={function (checked) {
            return setFormData(__assign(__assign({}, formData), { is_featured: checked }));
        }}/>
              </div>

              <div className="flex items-center justify-between">
                <label_1.Label htmlFor="requires_file_upload">
                  Requires File Upload
                </label_1.Label>
                <switch_1.Switch id="requires_file_upload" checked={formData.requires_file_upload} onCheckedChange={function (checked) {
            return setFormData(__assign(__assign({}, formData), { requires_file_upload: checked }));
        }}/>
              </div>
            </card_1.CardContent>
          </card_1.Card>

          <card_1.Card>
            <card_1.CardHeader>
              <card_1.CardTitle>SEO</card_1.CardTitle>
            </card_1.CardHeader>
            <card_1.CardContent className="space-y-4">
              <div>
                <label_1.Label htmlFor="meta_title">Meta Title</label_1.Label>
                <input_1.Input id="meta_title" value={formData.meta_title} onChange={function (e) {
            return setFormData(__assign(__assign({}, formData), { meta_title: e.target.value }));
        }} placeholder="Beautiful Rose Bouquet - Fresh Flowers"/>
              </div>

              <div>
                <label_1.Label htmlFor="meta_description">Meta Description</label_1.Label>
                <textarea_1.Textarea id="meta_description" value={formData.meta_description} onChange={function (e) {
            return setFormData(__assign(__assign({}, formData), { meta_description: e.target.value }));
        }} placeholder="Order beautiful rose bouquets for delivery..." rows={3}/>
              </div>
            </card_1.CardContent>
          </card_1.Card>
        </div>
      </div>
    </div>);
}
