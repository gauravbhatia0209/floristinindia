"use strict";
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
exports.SectionRenderer = SectionRenderer;
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var button_1 = require("@/components/ui/button");
var card_1 = require("@/components/ui/card");
var badge_1 = require("@/components/ui/badge");
var supabase_1 = require("@/lib/supabase");
var react_router_dom_1 = require("react-router-dom");
var CartContext_1 = require("@/contexts/CartContext");
function SectionRenderer(_a) {
    var sections = _a.sections;
    // Filter and sort visible sections
    var visibleSections = sections
        .filter(function (section) { return section.is_visible; })
        .sort(function (a, b) { return a.sort_order - b.sort_order; });
    return (<div className="space-y-8">
      {visibleSections.map(function (section) { return (<SectionComponent key={section.id} section={section}/>); })}
    </div>);
}
function SectionComponent(_a) {
    var section = _a.section;
    switch (section.type) {
        case "hero":
            return <HeroSection content={section.content}/>;
        case "hero_carousel":
            return <HeroCarouselSection content={section.content}/>;
        case "text_block":
            return <TextBlockSection content={section.content}/>;
        case "heading":
            return <HeadingSection content={section.content}/>;
        case "paragraph":
            return <ParagraphSection content={section.content}/>;
        case "image":
            return <ImageSection content={section.content}/>;
        case "button":
            return <ButtonSection content={section.content}/>;
        case "list":
            return <ListSection content={section.content}/>;
        case "separator":
            return <SeparatorSection content={section.content}/>;
        case "features":
            return <FeaturesSection content={section.content}/>;
        case "product_carousel":
            return <ProductCarouselSection content={section.content}/>;
        case "category_grid":
            return <CategoryGridSection content={section.content}/>;
        case "testimonials":
            return <TestimonialsSection content={section.content}/>;
        case "newsletter":
            return <NewsletterSection content={section.content}/>;
        case "banner":
            return <BannerSection content={section.content}/>;
        default:
            return null;
    }
}
// Individual section components
function HeroSection(_a) {
    var content = _a.content;
    return (<section className="relative bg-cover bg-center py-20" style={content.background_image
            ? { backgroundImage: "url(".concat(content.background_image, ")") }
            : { background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      <div className="relative container mx-auto px-4 text-center text-white">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          {content.title || "Welcome"}
        </h1>
        {content.subtitle && (<h2 className="text-xl md:text-2xl mb-6">{content.subtitle}</h2>)}
        {content.description && (<p className="text-lg mb-8 max-w-2xl mx-auto">
            {content.description}
          </p>)}
        {content.button_text && content.button_link && (<button_1.Button asChild size="lg">
            <a href={content.button_link}>{content.button_text}</a>
          </button_1.Button>)}
      </div>
    </section>);
}
function HeroCarouselSection(_a) {
    var _b;
    var content = _a.content;
    var _c = (0, react_1.useState)(0), currentIndex = _c[0], setCurrentIndex = _c[1];
    // Support both new slides format and legacy images array
    var slides = ((_b = content.slides) === null || _b === void 0 ? void 0 : _b.length) > 0
        ? content.slides
        : (content.images || []).map(function (image) { return ({
            image: image,
            url: "",
            target: "_self",
        }); });
    (0, react_1.useEffect)(function () {
        if (content.autoplay && slides.length > 1) {
            var interval_1 = setInterval(function () {
                setCurrentIndex(function (prev) { return (prev + 1) % slides.length; });
            }, content.autoplay_delay || 5000);
            return function () { return clearInterval(interval_1); };
        }
    }, [content.autoplay, content.autoplay_delay, slides.length]);
    if (!slides.length)
        return null;
    var renderSlide = function (slide, index) {
        var slideContent = (<img src={slide.image} alt={"Slide ".concat(index + 1)} className="w-full h-full object-cover"/>);
        // If slide has a URL, wrap in anchor tag
        if (slide.url && slide.url.trim()) {
            return (<a href={slide.url} target={slide.target || "_self"} rel={slide.target === "_blank" ? "noopener noreferrer" : undefined} className="block w-full h-full">
          {slideContent}
        </a>);
        }
        return slideContent;
    };
    return (<section className="relative overflow-hidden" style={{ height: content.height || 500 }}>
      {slides.map(function (slide, index) { return (<div key={index} className={"absolute inset-0 transition-opacity duration-500 ".concat(index === currentIndex ? "opacity-100" : "opacity-0")}>
          {renderSlide(slide, index)}
        </div>); })}

      {content.show_navigation && slides.length > 1 && (<>
          <button onClick={function () {
                return setCurrentIndex(function (prev) { return (prev - 1 + slides.length) % slides.length; });
            }} className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-40 text-white p-2 rounded-full z-10">
            ←
          </button>
          <button onClick={function () {
                return setCurrentIndex(function (prev) { return (prev + 1) % slides.length; });
            }} className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-40 text-white p-2 rounded-full z-10">
            →
          </button>
        </>)}

      {content.show_dots && slides.length > 1 && (<div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
          {slides.map(function (_, index) { return (<button key={index} onClick={function () { return setCurrentIndex(index); }} className={"w-3 h-3 rounded-full ".concat(index === currentIndex ? "bg-white" : "bg-white bg-opacity-50")}/>); })}
        </div>)}
    </section>);
}
function TextBlockSection(_a) {
    var content = _a.content;
    var alignmentClass = {
        left: "text-left",
        center: "text-center",
        right: "text-right",
    }[content.alignment] || "text-left";
    return (<section className="container mx-auto px-4">
      <div className={"prose prose-lg max-w-none ".concat(alignmentClass)}>
        <div dangerouslySetInnerHTML={{ __html: content.content || "" }} className="break-words"/>
      </div>
    </section>);
}
function HeadingSection(_a) {
    var content = _a.content;
    var HeadingTag = "h".concat(content.level || 1);
    var alignmentClass = {
        left: "text-left",
        center: "text-center",
        right: "text-right",
    }[content.alignment] || "text-left";
    return (<section className="container mx-auto px-4">
      <HeadingTag className={"font-bold mb-4 ".concat(alignmentClass, " ").concat(content.level === 1
            ? "text-4xl md:text-5xl"
            : content.level === 2
                ? "text-3xl md:text-4xl"
                : content.level === 3
                    ? "text-2xl md:text-3xl"
                    : "text-xl md:text-2xl")}>
        {content.text || ""}
      </HeadingTag>
    </section>);
}
function ParagraphSection(_a) {
    var content = _a.content;
    var alignmentClass = {
        left: "text-left",
        center: "text-center",
        right: "text-right",
    }[content.alignment] || "text-left";
    return (<section className="container mx-auto px-4">
      <p className={"text-lg leading-relaxed ".concat(alignmentClass)}>
        {content.text || ""}
      </p>
    </section>);
}
function ImageSection(_a) {
    var content = _a.content;
    if (!content.src)
        return null;
    var alignmentClass = {
        left: "text-left",
        center: "text-center",
        right: "text-right",
    }[content.alignment] || "text-center";
    return (<section className={"container mx-auto px-4 ".concat(alignmentClass)}>
      <div className="inline-block">
        <img src={content.src} alt={content.alt || ""} className="max-w-full h-auto rounded-lg shadow-lg"/>
        {content.caption && (<p className="text-sm text-gray-600 mt-2 italic">{content.caption}</p>)}
      </div>
    </section>);
}
function ButtonSection(_a) {
    var content = _a.content;
    if (!content.text || !content.link)
        return null;
    var alignmentClass = {
        left: "text-left",
        center: "text-center",
        right: "text-right",
    }[content.alignment] || "text-left";
    var variant = {
        primary: "default",
        secondary: "secondary",
        outline: "outline",
    }[content.style] || "default";
    return (<section className={"container mx-auto px-4 ".concat(alignmentClass)}>
      <button_1.Button asChild variant={variant} size="lg">
        <a href={content.link} target={content.target || "_self"}>
          {content.text}
        </a>
      </button_1.Button>
    </section>);
}
function ListSection(_a) {
    var content = _a.content;
    var alignmentClass = {
        left: "text-left",
        center: "text-center",
        right: "text-right",
    }[content.alignment] || "text-left";
    var ListTag = content.type === "numbered" ? "ol" : "ul";
    var listClass = content.type === "numbered" ? "list-decimal" : "list-disc";
    return (<section className="container mx-auto px-4">
      <ListTag className={"".concat(listClass, " list-inside space-y-2 ").concat(alignmentClass)}>
        {(content.items || []).map(function (item, index) { return (<li key={index} className="text-lg">
            {item}
          </li>); })}
      </ListTag>
    </section>);
}
function SeparatorSection(_a) {
    var content = _a.content;
    return (<section className="container mx-auto px-4">
      <hr className="border-t border-gray-300 my-8"/>
    </section>);
}
function FeaturesSection(_a) {
    var content = _a.content;
    var iconMap = {
        star: lucide_react_1.Star,
        heart: lucide_react_1.Heart,
        shield: lucide_react_1.Shield,
        truck: lucide_react_1.Truck,
        zap: lucide_react_1.Zap,
    };
    return (<section className="container mx-auto px-4 py-12">
      {content.show_title && content.title && (<h2 className="text-3xl font-bold text-center mb-12">
          {content.title}
        </h2>)}
      <div className={"grid gap-8 grid-cols-1 md:grid-cols-".concat(content.columns || 3)}>
        {(content.features || []).map(function (feature, index) {
            var IconComponent = iconMap[feature.icon] || lucide_react_1.Star;
            return (<card_1.Card key={index} className="text-center">
              <card_1.CardContent className="p-6">
                <IconComponent className="w-12 h-12 mx-auto mb-4 text-primary"/>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </card_1.CardContent>
            </card_1.Card>);
        })}
      </div>
    </section>);
}
// Real product carousel implementation
function ProductCarouselSection(_a) {
    var content = _a.content;
    var _b = (0, react_1.useState)([]), products = _b[0], setProducts = _b[1];
    var _c = (0, react_1.useState)(true), loading = _c[0], setLoading = _c[1];
    var addItem = (0, CartContext_1.useCart)().addItem;
    (0, react_1.useEffect)(function () {
        fetchProducts();
    }, [content.product_filter, content.show_count]);
    function fetchProducts() {
        return __awaiter(this, void 0, void 0, function () {
            var query, _a, data, error, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, 3, 4]);
                        setLoading(true);
                        query = supabase_1.supabase.from("products").select("*").eq("is_active", true);
                        // Apply filter based on content settings
                        switch (content.product_filter) {
                            case "featured":
                                query = query.eq("is_featured", true);
                                break;
                            case "sale":
                                query = query.not("sale_price", "is", null);
                                break;
                            case "latest":
                                query = query.order("created_at", { ascending: false });
                                break;
                            case "popular":
                                // For now, order by featured then created_at
                                query = query.order("is_featured", { ascending: false });
                                break;
                            default:
                                query = query.eq("is_featured", true);
                        }
                        query = query.limit(content.show_count || 8);
                        return [4 /*yield*/, query];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error) {
                            console.error("Error fetching products:", error);
                            setProducts([]);
                        }
                        else {
                            setProducts(data || []);
                        }
                        return [3 /*break*/, 4];
                    case 2:
                        error_1 = _b.sent();
                        console.error("Failed to fetch products:", error_1);
                        setProducts([]);
                        return [3 /*break*/, 4];
                    case 3:
                        setLoading(false);
                        return [7 /*endfinally*/];
                    case 4: return [2 /*return*/];
                }
            });
        });
    }
    var handleAddToCart = function (product) {
        var _a;
        addItem({
            id: "".concat(product.id, "-").concat(Date.now()),
            product_id: product.id,
            product_name: product.name,
            unit_price: product.sale_price || product.price,
            total_price: product.sale_price || product.price,
            image_url: ((_a = product.images) === null || _a === void 0 ? void 0 : _a[0]) || "",
            quantity: 1,
        });
    };
    if (loading) {
        return (<section className="container mx-auto px-4 py-12">
        {content.show_title !== false && (<h2 className="text-3xl font-bold text-center mb-8">
            {content.title || "Featured Products"}
          </h2>)}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: content.show_count || 4 }).map(function (_, index) { return (<card_1.Card key={index} className="border-0 shadow-lg overflow-hidden">
              <div className="aspect-square bg-gray-200 animate-pulse"></div>
              <card_1.CardContent className="p-4">
                <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
              </card_1.CardContent>
            </card_1.Card>); })}
        </div>
      </section>);
    }
    if (products.length === 0) {
        return (<section className="container mx-auto px-4 py-12">
        {content.show_title !== false && (<h2 className="text-3xl font-bold text-center mb-8">
            {content.title || "Featured Products"}
          </h2>)}
        <div className="text-center text-gray-600">
          <p>No products found for the selected filter.</p>
          <p className="text-sm">
            Filter: {content.product_filter || "featured"}
          </p>
        </div>
      </section>);
    }
    return (<section className="container mx-auto px-4 py-12">
      {content.show_title !== false && (<h2 className="text-3xl font-bold text-center mb-8">
          {content.title || "Featured Products"}
        </h2>)}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map(function (product) { return (<card_1.Card key={product.id} className="border-0 shadow-lg overflow-hidden group hover:shadow-xl transition-shadow">
            <div className="bg-gradient-to-br from-cream to-peach/30 flex items-center justify-center relative overflow-hidden aspect-square">
              {product.images && product.images.length > 0 ? (<img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"/>) : (<span className="text-6xl animate-pulse">🌺</span>)}
              {product.sale_price && (<badge_1.Badge className="absolute top-2 left-2 bg-destructive text-destructive-foreground">
                  SALE
                </badge_1.Badge>)}
            </div>

            <card_1.CardContent className="p-4">
              <react_router_dom_1.Link to={"/product/".concat(product.slug)}>
                <h3 className="font-semibold mb-2 line-clamp-2 hover:text-primary transition-colors">
                  {product.name}
                </h3>
              </react_router_dom_1.Link>

              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-primary">
                    ₹{product.sale_price || product.price}
                  </span>
                  {product.sale_price && (<span className="text-sm text-muted-foreground line-through">
                      ₹{product.price}
                    </span>)}
                </div>
              </div>

              <button_1.Button onClick={function () { return handleAddToCart(product); }} size="sm" className="w-full">
                Add to Cart
              </button_1.Button>
            </card_1.CardContent>
          </card_1.Card>); })}
      </div>
    </section>);
}
function CategoryGridSection(_a) {
    var content = _a.content;
    var _b = (0, react_1.useState)([]), categories = _b[0], setCategories = _b[1];
    var _c = (0, react_1.useState)(true), loading = _c[0], setLoading = _c[1];
    (0, react_1.useEffect)(function () {
        fetchCategories();
    }, [content.show_count]);
    function fetchCategories() {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error, error_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, 3, 4]);
                        setLoading(true);
                        return [4 /*yield*/, supabase_1.supabase
                                .from("product_categories")
                                .select("*")
                                .eq("is_active", true)
                                .order("sort_order")
                                .limit(content.show_count || 8)];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error) {
                            console.error("Error fetching categories:", error);
                            setCategories([]);
                        }
                        else {
                            setCategories(data || []);
                        }
                        return [3 /*break*/, 4];
                    case 2:
                        error_2 = _b.sent();
                        console.error("Failed to fetch categories:", error_2);
                        setCategories([]);
                        return [3 /*break*/, 4];
                    case 3:
                        setLoading(false);
                        return [7 /*endfinally*/];
                    case 4: return [2 /*return*/];
                }
            });
        });
    }
    var getGridColsClass = function (columns) {
        switch (columns) {
            case 2:
                return "grid-cols-1 md:grid-cols-2";
            case 3:
                return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
            case 4:
                return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";
            case 6:
                return "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6";
            default:
                return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";
        }
    };
    if (loading) {
        return (<section className="container mx-auto px-4 py-12">
        <div className={"grid gap-6 ".concat(getGridColsClass(content.columns || 4))}>
          {Array.from({ length: content.show_count || 4 }).map(function (_, index) { return (<card_1.Card key={index} className="border-0 shadow-lg overflow-hidden">
              <div className="aspect-square bg-gray-200 animate-pulse"></div>
              <card_1.CardContent className="p-4">
                <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                {content.show_product_count && (<div className="h-3 bg-gray-200 rounded animate-pulse w-1/2"></div>)}
              </card_1.CardContent>
            </card_1.Card>); })}
        </div>
      </section>);
    }
    if (categories.length === 0) {
        return (<section className="container mx-auto px-4 py-12">
        <div className="text-center text-gray-600">
          <p>No categories found.</p>
        </div>
      </section>);
    }
    return (<section className="container mx-auto px-4 py-12">
      <div className={"grid gap-6 ".concat(getGridColsClass(content.columns || 4))}>
        {categories.map(function (category) { return (<react_router_dom_1.Link key={category.id} to={"/category/".concat(category.slug)} className="group">
            <card_1.Card className="border-0 shadow-lg overflow-hidden group-hover:shadow-xl transition-shadow">
              <div className="bg-gradient-to-br from-cream to-peach/30 flex items-center justify-center relative overflow-hidden aspect-square">
                {category.image_url ? (<img src={category.image_url} alt={category.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"/>) : (<div className="text-6xl">🌸</div>)}
              </div>
              <card_1.CardContent className="p-4 text-center">
                <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">
                  {category.name}
                </h3>
                {category.description && (<p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                    {category.description}
                  </p>)}
                {content.show_product_count && (<p className="text-xs text-muted-foreground">View Products</p>)}
              </card_1.CardContent>
            </card_1.Card>
          </react_router_dom_1.Link>); })}
      </div>
    </section>);
}
function TestimonialsSection(_a) {
    var content = _a.content;
    return (<section className="container mx-auto px-4 py-12">
      {content.show_title && content.title && (<h2 className="text-3xl font-bold text-center mb-12">
          {content.title}
        </h2>)}
      <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {(content.testimonials || []).map(function (testimonial, index) { return (<card_1.Card key={index}>
            <card_1.CardContent className="p-6">
              <div className="flex mb-4">
                {__spreadArray([], Array(testimonial.rating || 5), true).map(function (_, i) { return (<lucide_react_1.Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400"/>); })}
              </div>
              <p className="text-gray-600 mb-4">"{testimonial.review}"</p>
              <div className="flex items-center gap-3">
                {testimonial.image && (<img src={testimonial.image} alt={testimonial.name} className="w-10 h-10 rounded-full object-cover"/>)}
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">
                    {testimonial.location}
                  </p>
                </div>
              </div>
            </card_1.CardContent>
          </card_1.Card>); })}
      </div>
    </section>);
}
function NewsletterSection(_a) {
    var content = _a.content;
    return (<section className="bg-gradient-to-r from-purple-600 to-pink-600 py-12">
      <div className="container mx-auto px-4 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">
          {content.title || "Stay Updated"}
        </h2>
        <p className="text-xl mb-8">
          {content.description || "Subscribe to our newsletter"}
        </p>
        <div className="max-w-md mx-auto flex gap-4">
          <input type="email" placeholder={content.placeholder || "Enter your email"} className="flex-1 px-4 py-2 rounded text-gray-900"/>
          <button_1.Button variant="secondary">
            {content.button_text || "Subscribe"}
          </button_1.Button>
        </div>
        {content.show_privacy_text && (<p className="text-sm mt-4 opacity-80">
            {content.privacy_text ||
                "We respect your privacy and never share your email."}
          </p>)}
      </div>
    </section>);
}
function BannerSection(_a) {
    var content = _a.content;
    return (<section className="bg-primary text-white py-8">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-2xl font-bold mb-2">{content.text}</h2>
        {content.subtext && <p className="text-lg mb-4">{content.subtext}</p>}
        {content.show_button && content.button_text && content.link && (<button_1.Button asChild variant="secondary">
            <a href={content.link}>{content.button_text}</a>
          </button_1.Button>)}
      </div>
    </section>);
}
