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
exports.default = ProductDetail;
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var lucide_react_1 = require("lucide-react");
var button_1 = require("@/components/ui/button");
var card_1 = require("@/components/ui/card");
var badge_1 = require("@/components/ui/badge");
var input_1 = require("@/components/ui/input");
var label_1 = require("@/components/ui/label");
var textarea_1 = require("@/components/ui/textarea");
var supabase_1 = require("@/lib/supabase");
var useCart_1 = require("@/hooks/useCart");
var FacebookPixel_1 = require("@/components/FacebookPixel");
var FacebookShopMeta_1 = require("@/components/FacebookShopMeta");
var StructuredData_1 = require("@/components/StructuredData");
var AIMetaTags_1 = require("@/components/AIMetaTags");
var ProductVariationSelector_1 = require("@/components/ProductVariationSelector");
var use_toast_1 = require("@/hooks/use-toast");
function ProductDetail() {
    var slug = (0, react_router_dom_1.useParams)().slug;
    var _a = (0, react_1.useState)(null), product = _a[0], setProduct = _a[1];
    var _b = (0, react_1.useState)([]), variants = _b[0], setVariants = _b[1];
    var _c = (0, react_1.useState)(null), category = _c[0], setCategory = _c[1];
    var _d = (0, react_1.useState)(null), selectedVariant = _d[0], setSelectedVariant = _d[1];
    var _e = (0, react_1.useState)({}), selectedVariations = _e[0], setSelectedVariations = _e[1];
    var _f = (0, react_1.useState)(0), effectivePrice = _f[0], setEffectivePrice = _f[1];
    var _g = (0, react_1.useState)(), effectiveSalePrice = _g[0], setEffectiveSalePrice = _g[1];
    var _h = (0, react_1.useState)(), effectiveImage = _h[0], setEffectiveImage = _h[1];
    var _j = (0, react_1.useState)(1), quantity = _j[0], setQuantity = _j[1];
    var _k = (0, react_1.useState)(null), uploadedFile = _k[0], setUploadedFile = _k[1];
    var _l = (0, react_1.useState)(""), specialInstructions = _l[0], setSpecialInstructions = _l[1];
    var _m = (0, react_1.useState)(""), pincode = _m[0], setPincode = _m[1];
    var _o = (0, react_1.useState)(null), deliveryInfo = _o[0], setDeliveryInfo = _o[1];
    var _p = (0, react_1.useState)(true), isLoading = _p[0], setIsLoading = _p[1];
    var _q = (0, react_1.useState)(false), isCheckingPincode = _q[0], setIsCheckingPincode = _q[1];
    var _r = (0, react_1.useState)(0), selectedImageIndex = _r[0], setSelectedImageIndex = _r[1];
    var _s = (0, react_1.useState)(null), settings = _s[0], setSettings = _s[1];
    var addItem = (0, useCart_1.useCart)().addItem;
    var _t = (0, FacebookPixel_1.useFacebookPixel)(), trackViewContent = _t.trackViewContent, trackFBAddToCart = _t.trackAddToCart;
    (0, react_1.useEffect)(function () {
        if (slug) {
            fetchProductData();
        }
    }, [slug]);
    function fetchProductData() {
        return __awaiter(this, void 0, void 0, function () {
            var productData, variantsData, categoryData, settingsData, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, 6, 7]);
                        return [4 /*yield*/, supabase_1.supabase
                                .from("products")
                                .select("*")
                                .eq("slug", slug)
                                .eq("is_active", true)
                                .single()];
                    case 1:
                        productData = (_a.sent()).data;
                        if (!productData) {
                            throw new Error("Product not found");
                        }
                        return [4 /*yield*/, supabase_1.supabase
                                .from("product_variants")
                                .select("*")
                                .eq("product_id", productData.id)
                                .eq("is_active", true)
                                .order("sort_order")];
                    case 2:
                        variantsData = (_a.sent()).data;
                        return [4 /*yield*/, supabase_1.supabase
                                .from("product_categories")
                                .select("*")
                                .eq("id", productData.category_id)
                                .single()];
                    case 3:
                        categoryData = (_a.sent()).data;
                        return [4 /*yield*/, supabase_1.supabase
                                .from("site_settings")
                                .select("*")
                                .single()];
                    case 4:
                        settingsData = (_a.sent()).data;
                        setProduct(productData);
                        setVariants(variantsData || []);
                        setCategory(categoryData);
                        setSettings(settingsData);
                        // Set default variant if available
                        if (variantsData && variantsData.length > 0) {
                            setSelectedVariant(variantsData[0]);
                        }
                        return [3 /*break*/, 7];
                    case 5:
                        error_1 = _a.sent();
                        console.error("Failed to fetch product:", error_1);
                        return [3 /*break*/, 7];
                    case 6:
                        setIsLoading(false);
                        return [7 /*endfinally*/];
                    case 7: return [2 /*return*/];
                }
            });
        });
    }
    function checkPincodeDelivery() {
        return __awaiter(this, void 0, void 0, function () {
            var zones, zone, availableMethods, error_2;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!pincode || !product)
                            return [2 /*return*/];
                        setIsCheckingPincode(true);
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, 4, 5]);
                        return [4 /*yield*/, supabase_1.supabase
                                .from("shipping_zones")
                                .select("*, shipping_methods(*)")
                                .contains("pincodes", [pincode])
                                .eq("is_active", true)];
                    case 2:
                        zones = (_b.sent()).data;
                        if (zones && zones.length > 0) {
                            zone = zones[0];
                            availableMethods = ((_a = zone.shipping_methods) === null || _a === void 0 ? void 0 : _a.filter(function (method) { return method.is_active; })) ||
                                [];
                            setDeliveryInfo({
                                available: true,
                                zone: zone.name,
                                methods: availableMethods,
                            });
                        }
                        else {
                            setDeliveryInfo({
                                available: false,
                                message: "Sorry, we don't deliver to this pincode yet.",
                            });
                        }
                        return [3 /*break*/, 5];
                    case 3:
                        error_2 = _b.sent();
                        console.error("Failed to check pincode:", error_2);
                        setDeliveryInfo({
                            available: false,
                            message: "Error checking delivery availability.",
                        });
                        return [3 /*break*/, 5];
                    case 4:
                        setIsCheckingPincode(false);
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        });
    }
    function getCurrentPrice() {
        if (effectiveSalePrice && effectiveSalePrice > 0) {
            return effectiveSalePrice;
        }
        if (effectivePrice > 0) {
            return effectivePrice;
        }
        return (product === null || product === void 0 ? void 0 : product.sale_price) || (product === null || product === void 0 ? void 0 : product.price) || 0;
    }
    function getOriginalPrice() {
        if (effectiveSalePrice && effectiveSalePrice > 0 && effectivePrice > 0) {
            return effectivePrice;
        }
        if (product === null || product === void 0 ? void 0 : product.sale_price) {
            return product.price;
        }
        return null;
    }
    function handleVariationChange(variations, price, salePrice, image) {
        setSelectedVariations(variations);
        setEffectivePrice(price);
        setEffectiveSalePrice(salePrice);
        setEffectiveImage(image);
        // Set the first selected variant for backward compatibility
        var variantsList = Object.values(variations);
        setSelectedVariant(variantsList.length > 0 ? variantsList[0] : null);
    }
    function handleAddToCart() {
        if (!product)
            return;
        // Create a combined variant representation for cart
        var combinedVariant = selectedVariant
            ? __assign(__assign({}, selectedVariant), { 
                // Include effective pricing and image
                price_override: effectivePrice, sale_price_override: effectiveSalePrice, image_url: effectiveImage, 
                // Create a name that includes all selected variations
                name: Object.entries(selectedVariations)
                    .map(function (_a) {
                    var type = _a[0], variant = _a[1];
                    return "".concat(type, ": ").concat(variant.variation_value);
                })
                    .join(", ") || selectedVariant.name }) : undefined;
        addItem({
            product_id: product.id,
            product: product,
            variant_id: selectedVariant === null || selectedVariant === void 0 ? void 0 : selectedVariant.id,
            variant: combinedVariant,
            quantity: quantity,
            uploaded_file: uploadedFile || undefined,
        });
        // Show enhanced success notification
        var currentPrice = effectivePrice || product.price;
        var currentSalePrice = effectiveSalePrice || product.sale_price;
        var displayPrice = currentSalePrice && currentSalePrice < currentPrice
            ? currentSalePrice
            : currentPrice;
        // Create clean variation description only for valid variations
        var variationText = Object.entries(selectedVariations)
            .filter(function (_a) {
            var type = _a[0], variant = _a[1];
            return (variant === null || variant === void 0 ? void 0 : variant.variation_value) && type !== "Default";
        })
            .map(function (_a) {
            var type = _a[0], variant = _a[1];
            return "".concat(type, ": ").concat(variant.variation_value);
        })
            .join(", ");
        (0, use_toast_1.toast)({
            title: "✅ Added to cart!",
            description: (<div className="flex items-center gap-3">
          {(effectiveImage || product.images[0]) && (<img src={effectiveImage || product.images[0]} alt={product.name} className="w-10 h-10 rounded object-cover"/>)}
          <div className="flex-1">
            <div className="font-medium">{product.name}</div>
            {variationText && (<div className="text-sm text-muted-foreground">
                {variationText}
              </div>)}
            <div className="text-sm">
              Qty: {quantity} • ₹{(displayPrice * quantity).toFixed(0)}
            </div>
          </div>
        </div>),
            duration: 3000,
        });
    }
    function handleFileUpload(event) {
        var _a, _b;
        var file = (_a = event.target.files) === null || _a === void 0 ? void 0 : _a[0];
        if (file) {
            // Validate file type if specified
            if (product === null || product === void 0 ? void 0 : product.upload_file_types.length) {
                var fileExtension = (_b = file.name.split(".").pop()) === null || _b === void 0 ? void 0 : _b.toLowerCase();
                if (!product.upload_file_types.includes(fileExtension || "")) {
                    alert("Please upload a file with one of these extensions: ".concat(product.upload_file_types.join(", ")));
                    return;
                }
            }
            setUploadedFile(file);
        }
    }
    if (isLoading) {
        return (<div className="container py-12">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="aspect-square bg-gray-200 rounded-lg"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              <div className="h-24 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>);
    }
    if (!product) {
        return (<div className="container py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <p className="text-muted-foreground mb-6">
          The product you're looking for doesn't exist or has been removed.
        </p>
        <button_1.Button asChild>
          <react_router_dom_1.Link to="/products">Browse All Products</react_router_dom_1.Link>
        </button_1.Button>
      </div>);
    }
    // Prepare product data for Facebook Shop Meta
    var fbProduct = {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        sale_price: product.sale_price,
        images: product.images,
        slug: product.slug,
    };
    return (<div className="container py-8">
      <FacebookShopMeta_1.default product={fbProduct}/>
      <StructuredData_1.default type="product" data={product}/>
      <AIMetaTags_1.default page="product" product={product}/>
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
        <react_router_dom_1.Link to="/" className="hover:text-primary">
          Home
        </react_router_dom_1.Link>
        <span>/</span>
        <react_router_dom_1.Link to="/products" className="hover:text-primary">
          Products
        </react_router_dom_1.Link>
        {category && (<>
            <span>/</span>
            <react_router_dom_1.Link to={"/category/".concat(category.slug)} className="hover:text-primary">
              {category.name}
            </react_router_dom_1.Link>
          </>)}
        <span>/</span>
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square bg-gradient-to-br from-cream to-peach/30 rounded-lg overflow-hidden">
            {effectiveImage || product.images.length > 0 ? (<img src={effectiveImage || product.images[selectedImageIndex]} alt={product.name} className="w-full h-full object-cover"/>) : (<div className="w-full h-full flex items-center justify-center text-6xl">
                ��
              </div>)}
          </div>

          {/* Image thumbnails */}
          {product.images.length > 1 && (<div className="flex gap-2 overflow-x-auto">
              {product.images.map(function (image, index) { return (<button key={index} onClick={function () { return setSelectedImageIndex(index); }} className={"w-20 h-20 rounded-lg overflow-hidden border-2 ".concat(selectedImageIndex === index
                    ? "border-primary"
                    : "border-transparent")}>
                  <img src={image} alt={"".concat(product.name, " ").concat(index + 1)} className="w-full h-full object-cover"/>
                </button>); })}
            </div>)}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            {/* Show ratings only for products with variations */}
            {product.has_variations && variants.length > 0 && (<div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  {__spreadArray([], Array(5), true).map(function (_, i) { return (<lucide_react_1.Star key={i} className="w-5 h-5 fill-gold text-gold"/>); })}
                  <span className="text-muted-foreground ml-2">
                    (4.8) • 156 reviews
                  </span>
                </div>
              </div>)}

            {/* Pricing */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-3xl font-bold text-primary">
                ₹{getCurrentPrice()}
              </span>
              {getOriginalPrice() && (<span className="text-xl text-muted-foreground line-through">
                  ₹{getOriginalPrice()}
                </span>)}
              {getOriginalPrice() && (<badge_1.Badge className="bg-destructive text-destructive-foreground">
                  {Math.round(((getOriginalPrice() - getCurrentPrice()) /
                getOriginalPrice()) *
                100)}
                  % OFF
                </badge_1.Badge>)}
            </div>
          </div>

          {/* Short Description */}
          {product.short_description && (<p className="text-lg text-muted-foreground">
              {product.short_description}
            </p>)}

          {/* Product Variations or Simple Pricing */}
          {product.has_variations && variants.length > 0 ? (<ProductVariationSelector_1.ProductVariationSelector variants={variants} basePrice={product.price} baseSalePrice={product.sale_price || undefined} baseImages={product.images || []} onVariationChange={handleVariationChange}/>) : null}

          {/* Quantity */}
          <div className="space-y-3">
            <label_1.Label className="text-base font-semibold">Quantity:</label_1.Label>
            <div className="flex items-center gap-3">
              <button_1.Button variant="outline" size="icon" onClick={function () { return setQuantity(Math.max(1, quantity - 1)); }} disabled={quantity <= 1}>
                <lucide_react_1.Minus className="w-4 h-4"/>
              </button_1.Button>
              <span className="w-12 text-center font-medium">{quantity}</span>
              <button_1.Button variant="outline" size="icon" onClick={function () { return setQuantity(quantity + 1); }}>
                <lucide_react_1.Plus className="w-4 h-4"/>
              </button_1.Button>
            </div>
          </div>

          {/* File Upload (if required) */}
          {product.requires_file_upload && (<div className="space-y-3">
              <label_1.Label className="text-base font-semibold">
                Upload File (Required):
              </label_1.Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <lucide_react_1.Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground"/>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Upload your image or document
                  </p>
                  {product.upload_file_types.length > 0 && (<p className="text-xs text-muted-foreground">
                      Accepted formats: {product.upload_file_types.join(", ")}
                    </p>)}
                  <input_1.Input type="file" onChange={handleFileUpload} accept={product.upload_file_types
                .map(function (type) { return ".".concat(type); })
                .join(",")} className="hidden" id="file-upload"/>
                  <label_1.Label htmlFor="file-upload" className="cursor-pointer">
                    <button_1.Button variant="outline" asChild>
                      <span>Choose File</span>
                    </button_1.Button>
                  </label_1.Label>
                  {uploadedFile && (<p className="text-sm text-green-600">
                      ✓ {uploadedFile.name}
                    </p>)}
                </div>
              </div>
            </div>)}

          {/* Special Instructions */}
          {(settings === null || settings === void 0 ? void 0 : settings.enable_special_instructions) && (<div className="space-y-3">
              <label_1.Label htmlFor="instructions" className="text-base font-semibold">
                Special Instructions (Optional):
              </label_1.Label>
              <textarea_1.Textarea id="instructions" placeholder="Any special message or delivery instructions..." value={specialInstructions} onChange={function (e) { return setSpecialInstructions(e.target.value); }} rows={3}/>
            </div>)}

          {/* Pincode Check */}
          <div className="space-y-3">
            <label_1.Label className="text-base font-semibold">Check Delivery:</label_1.Label>
            <div className="flex gap-2">
              <input_1.Input placeholder="Enter pincode" value={pincode} onChange={function (e) { return setPincode(e.target.value); }} className="flex-1"/>
              <button_1.Button onClick={checkPincodeDelivery} disabled={!pincode || isCheckingPincode}>
                {isCheckingPincode ? "Checking..." : "Check"}
              </button_1.Button>
            </div>

            {deliveryInfo && (<div className={"p-3 rounded-lg ".concat(deliveryInfo.available
                ? "bg-green-50 border border-green-200"
                : "bg-red-50 border border-red-200")}>
                {deliveryInfo.available ? (<div>
                    <p className="text-green-800 font-medium flex items-center gap-2">
                      <lucide_react_1.Check className="w-4 h-4"/>
                      Available in {deliveryInfo.zone}
                    </p>
                    <div className="mt-2 space-y-1">
                      {deliveryInfo.methods.map(function (method) { return (<div key={method.id} className="flex justify-between text-sm text-green-700">
                          <span>{method.name}</span>
                          <span>
                            ₹{method.price} • {method.delivery_time}
                          </span>
                        </div>); })}
                    </div>
                  </div>) : (<p className="text-red-800 flex items-center gap-2">
                    <lucide_react_1.X className="w-4 h-4"/>
                    {deliveryInfo.message}
                  </p>)}
              </div>)}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button_1.Button size="lg" className="flex-1" onClick={handleAddToCart} disabled={product.requires_file_upload && !uploadedFile}>
              Add to Cart
            </button_1.Button>
            <button_1.Button variant="outline" size="lg">
              <lucide_react_1.Heart className="w-5 h-5"/>
            </button_1.Button>
            <button_1.Button variant="outline" size="lg">
              <lucide_react_1.Share2 className="w-5 h-5"/>
            </button_1.Button>
          </div>

          {/* Product Features */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t">
            <div className="text-center">
              <lucide_react_1.Truck className="w-6 h-6 mx-auto mb-2 text-primary"/>
              <p className="text-sm font-medium">Same Day Delivery</p>
            </div>
            <div className="text-center">
              <lucide_react_1.Shield className="w-6 h-6 mx-auto mb-2 text-primary"/>
              <p className="text-sm font-medium">Fresh Guarantee</p>
            </div>
            <div className="text-center">
              <lucide_react_1.Clock className="w-6 h-6 mx-auto mb-2 text-primary"/>
              <p className="text-sm font-medium">24/7 Support</p>
            </div>
          </div>
        </div>
      </div>

      {/* Product Description */}
      {product.description && (<div className="mt-12">
          <card_1.Card>
            <card_1.CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">Description</h3>
              <div className="prose max-w-none">
                <p className="text-muted-foreground">{product.description}</p>
              </div>
            </card_1.CardContent>
          </card_1.Card>
        </div>)}
    </div>);
}
