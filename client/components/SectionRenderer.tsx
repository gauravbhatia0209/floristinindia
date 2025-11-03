import { useState, useEffect } from "react";
import { Heart, Shield, Truck, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StarRating } from "@/components/ui/star-rating";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";
import { Product, ProductCategory } from "@shared/database.types";
import { Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";

export interface Section {
  id: string;
  type: string;
  content: any;
  is_visible: boolean;
  sort_order: number;
}

interface SectionRendererProps {
  sections: Section[];
}

export function SectionRenderer({ sections }: SectionRendererProps) {
  // Filter and sort visible sections
  const visibleSections = sections
    .filter((section) => section.is_visible)
    .sort((a, b) => a.sort_order - b.sort_order);

  return (
    <div className="space-y-8">
      {visibleSections.map((section) => (
        <SectionComponent key={section.id} section={section} />
      ))}
    </div>
  );
}

function SectionComponent({ section }: { section: Section }) {
  switch (section.type) {
    case "hero":
      return <HeroSection content={section.content} />;
    case "hero_carousel":
      return <HeroCarouselSection content={section.content} />;
    case "text_block":
      return <TextBlockSection content={section.content} />;
    case "heading":
      return <HeadingSection content={section.content} />;
    case "paragraph":
      return <ParagraphSection content={section.content} />;
    case "image":
      return <ImageSection content={section.content} />;
    case "button":
      return <ButtonSection content={section.content} />;
    case "list":
      return <ListSection content={section.content} />;
    case "separator":
      return <SeparatorSection content={section.content} />;
    case "features":
      return <FeaturesSection content={section.content} />;
    case "product_carousel":
      return <ProductCarouselSection content={section.content} />;
    case "category_grid":
      return <CategoryGridSection content={section.content} />;
    case "testimonials":
      return <TestimonialsSection content={section.content} />;
    case "newsletter":
      return <NewsletterSection content={section.content} />;
    case "banner":
      return <BannerSection content={section.content} />;
    case "image_with_link":
      return <ImageWithLinkSection content={section.content} />;
    default:
      return null;
  }
}

// Individual section components
function HeroSection({ content }: { content: any }) {
  return (
    <section
      className="relative bg-cover bg-center py-20"
      style={
        content.background_image
          ? { backgroundImage: `url(${content.background_image})` }
          : { background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }
      }
    >
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      <div className="relative container mx-auto px-4 text-center text-white">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          {content.title || "Welcome"}
        </h1>
        {content.subtitle && (
          <h2 className="text-xl md:text-2xl mb-6">{content.subtitle}</h2>
        )}
        {content.description && (
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            {content.description}
          </p>
        )}
        {content.button_text && content.button_link && (
          <Button asChild size="lg">
            <a href={content.button_link}>{content.button_text}</a>
          </Button>
        )}
      </div>
    </section>
  );
}

function HeroCarouselSection({ content }: { content: any }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Support both new slides format and legacy images array
  const slides =
    content.slides?.length > 0
      ? content.slides
      : (content.images || []).map((image: string) => ({
          image,
          url: "",
          target: "_self",
        }));

  useEffect(() => {
    if (content.autoplay && slides.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % slides.length);
      }, content.autoplay_delay || 5000);
      return () => clearInterval(interval);
    }
  }, [content.autoplay, content.autoplay_delay, slides.length]);

  if (!slides.length) return null;

  const renderSlide = (slide: any, index: number) => {
    const slideContent = (
      <img
        src={slide.image}
        alt={`Slide ${index + 1}`}
        className="w-full h-full object-cover"
      />
    );

    // If slide has a URL, wrap in anchor tag
    if (slide.url && slide.url.trim()) {
      return (
        <a
          href={slide.url}
          target={slide.target || "_self"}
          rel={slide.target === "_blank" ? "noopener noreferrer" : undefined}
          className="block w-full h-full"
        >
          {slideContent}
        </a>
      );
    }

    return slideContent;
  };

  return (
    <section
      className="relative overflow-hidden"
      style={{ height: content.height || 500 }}
    >
      {slides.map((slide: any, index: number) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-500 ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          {renderSlide(slide, index)}
        </div>
      ))}

      {content.show_navigation && slides.length > 1 && (
        <>
          <button
            onClick={() =>
              setCurrentIndex(
                (prev) => (prev - 1 + slides.length) % slides.length,
              )
            }
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-40 text-white p-2 rounded-full z-10"
          >
            ←
          </button>
          <button
            onClick={() =>
              setCurrentIndex((prev) => (prev + 1) % slides.length)
            }
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-40 text-white p-2 rounded-full z-10"
          >
            →
          </button>
        </>
      )}

      {content.show_dots && slides.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
          {slides.map((_: any, index: number) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full ${
                index === currentIndex ? "bg-white" : "bg-white bg-opacity-50"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function TextBlockSection({ content }: { content: any }) {
  const alignmentClass =
    {
      left: "text-left",
      center: "text-center",
      right: "text-right",
    }[content.alignment] || "text-left";

  return (
    <section className="container mx-auto px-4">
      <div className={`prose prose-lg max-w-none ${alignmentClass}`}>
        <div
          dangerouslySetInnerHTML={{ __html: content.content || "" }}
          className="break-words"
        />
      </div>
    </section>
  );
}

function HeadingSection({ content }: { content: any }) {
  const HeadingTag = `h${content.level || 1}` as keyof JSX.IntrinsicElements;
  const alignmentClass =
    {
      left: "text-left",
      center: "text-center",
      right: "text-right",
    }[content.alignment] || "text-left";

  return (
    <section className="container mx-auto px-4">
      <HeadingTag
        className={`font-bold mb-4 ${alignmentClass} ${
          content.level === 1
            ? "text-4xl md:text-5xl"
            : content.level === 2
              ? "text-3xl md:text-4xl"
              : content.level === 3
                ? "text-2xl md:text-3xl"
                : "text-xl md:text-2xl"
        }`}
      >
        {content.text || ""}
      </HeadingTag>
    </section>
  );
}

function ParagraphSection({ content }: { content: any }) {
  const alignmentClass =
    {
      left: "text-left",
      center: "text-center",
      right: "text-right",
    }[content.alignment] || "text-left";

  return (
    <section className="container mx-auto px-4">
      <p className={`text-lg leading-relaxed ${alignmentClass}`}>
        {content.text || ""}
      </p>
    </section>
  );
}

function ImageSection({ content }: { content: any }) {
  if (!content.src) return null;

  const alignmentClass =
    {
      left: "text-left",
      center: "text-center",
      right: "text-right",
    }[content.alignment] || "text-center";

  return (
    <section className={`container mx-auto px-4 ${alignmentClass}`}>
      <div className="inline-block">
        <img
          src={content.src}
          alt={content.alt || ""}
          className="max-w-full h-auto rounded-lg shadow-lg"
        />
        {content.caption && (
          <p className="text-sm text-gray-600 mt-2 italic">{content.caption}</p>
        )}
      </div>
    </section>
  );
}

function ButtonSection({ content }: { content: any }) {
  if (!content.text || !content.link) return null;

  const alignmentClass =
    {
      left: "text-left",
      center: "text-center",
      right: "text-right",
    }[content.alignment] || "text-left";

  const variant =
    {
      primary: "default",
      secondary: "secondary",
      outline: "outline",
    }[content.style] || "default";

  return (
    <section className={`container mx-auto px-4 ${alignmentClass}`}>
      <Button asChild variant={variant as any} size="lg">
        <a href={content.link} target={content.target || "_self"}>
          {content.text}
        </a>
      </Button>
    </section>
  );
}

function ListSection({ content }: { content: any }) {
  const alignmentClass =
    {
      left: "text-left",
      center: "text-center",
      right: "text-right",
    }[content.alignment] || "text-left";

  const ListTag = content.type === "numbered" ? "ol" : "ul";
  const listClass = content.type === "numbered" ? "list-decimal" : "list-disc";

  return (
    <section className="container mx-auto px-4">
      <ListTag
        className={`${listClass} list-inside space-y-2 ${alignmentClass}`}
      >
        {(content.items || []).map((item: string, index: number) => (
          <li key={index} className="text-lg">
            {item}
          </li>
        ))}
      </ListTag>
    </section>
  );
}

function SeparatorSection({ content }: { content: any }) {
  return (
    <section className="container mx-auto px-4">
      <hr className="border-t border-gray-300 my-8" />
    </section>
  );
}

function FeaturesSection({ content }: { content: any }) {
  const iconMap = {
    star: Star,
    heart: Heart,
    shield: Shield,
    truck: Truck,
    zap: Zap,
  };

  return (
    <section className="container mx-auto px-4 py-12">
      {content.show_title && content.title && (
        <h2 className="text-3xl font-bold text-center mb-12">
          {content.title}
        </h2>
      )}
      <div
        className={`grid gap-8 grid-cols-1 md:grid-cols-${content.columns || 3}`}
      >
        {(content.features || []).map((feature: any, index: number) => {
          const IconComponent =
            iconMap[feature.icon as keyof typeof iconMap] || Star;
          return (
            <Card key={index} className="text-center">
              <CardContent className="p-6">
                <IconComponent className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}

// Real product carousel implementation
function ProductCarouselSection({ content }: { content: any }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();

  useEffect(() => {
    fetchProducts();
  }, [content.product_filter, content.show_count, content.selected_products]);

  async function fetchProducts() {
    try {
      setLoading(true);
      const selectedProductIds = content.selected_products || [];

      let query = supabase.from("products").select("*").eq("is_active", true);

      // If specific products are selected, use those
      if (selectedProductIds.length > 0) {
        query = query.in("id", selectedProductIds);
        // Don't apply limit when using selected products - preserve all selected items
      } else {
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
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      } else {
        // If selected products are specified, order them according to the selection order
        if (selectedProductIds.length > 0 && data) {
          const orderedProducts = selectedProductIds
            .map((id: string) => data.find((prod) => prod.id === id))
            .filter((prod): prod is Product => prod !== undefined);
          setProducts(orderedProducts);
        } else {
          setProducts(data || []);
        }
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }

  const handleAddToCart = (product: Product) => {
    if ((product as any)?.has_variations) {
      window.location.href = `/product/${product.slug}`;
      return;
    }

    const rawUnitPrice = product.sale_price ?? product.price;
    const resolvedUnitPrice =
      typeof rawUnitPrice === "number"
        ? rawUnitPrice
        : Number(rawUnitPrice ?? 0);
    const unitPrice = Number.isFinite(resolvedUnitPrice)
      ? resolvedUnitPrice
      : 0;
    const quantity = 1;

    addItem({
      id: `${product.id}-${Date.now()}`,
      product_id: product.id,
      product_name: product.name,
      product,
      unit_price: unitPrice,
      total_price: unitPrice * quantity,
      image_url: product.images?.[0] || "",
      quantity,
    });
  };

  if (loading) {
    return (
      <section className="container mx-auto px-4 py-12">
        {content.show_title !== false && (
          <h2 className="text-3xl font-bold text-center mb-8">
            {content.title || "Featured Products"}
          </h2>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: content.show_count || 4 }).map((_, index) => (
            <Card key={index} className="border-0 shadow-lg overflow-hidden">
              <div className="aspect-square bg-gray-200 animate-pulse"></div>
              <CardContent className="p-4">
                <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section className="container mx-auto px-4 py-12">
        {content.show_title !== false && (
          <h2 className="text-3xl font-bold text-center mb-8">
            {content.title || "Featured Products"}
          </h2>
        )}
        <div className="text-center text-gray-600">
          <p>No products found for the selected filter.</p>
          <p className="text-sm">
            Filter: {content.product_filter || "featured"}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="container mx-auto px-4 py-12">
      {content.show_title !== false && (
        <h2 className="text-3xl font-bold text-center mb-8">
          {content.title || "Featured Products"}
        </h2>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <Card
            key={product.id}
            className="border-0 shadow-lg overflow-hidden group hover:shadow-xl transition-shadow h-full flex flex-col"
          >
            <div className="bg-gradient-to-br from-cream to-peach/30 flex items-center justify-center relative overflow-hidden aspect-[4/5]">
              {product.images && product.images.length > 0 ? (
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <span className="text-6xl animate-pulse">🌺</span>
              )}
              {product.sale_price && (
                <Badge className="absolute top-2 left-2 bg-destructive text-destructive-foreground">
                  SALE
                </Badge>
              )}
            </div>

            <CardContent className="p-4 flex-grow flex flex-col justify-between">
              <div>
                <Link to={`/product/${product.slug}`}>
                  <h3 className="font-semibold mb-2 line-clamp-2 hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                </Link>

                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-primary">
                      ₹{product.sale_price || product.price}
                    </span>
                    {product.sale_price && (
                      <span className="text-sm text-muted-foreground line-through">
                        ₹{product.price}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <Button
                onClick={() => handleAddToCart(product)}
                size="sm"
                className="w-full"
              >
                Add to Cart
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

function CategoryGridSection({ content }: { content: any }) {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, [content.show_count, content.selected_categories]);

  async function fetchCategories() {
    try {
      setLoading(true);
      const selectedCategoryIds = content.selected_categories || [];

      let query = supabase
        .from("product_categories")
        .select("*")
        .eq("is_active", true);

      // If specific categories are selected, filter by those IDs
      if (selectedCategoryIds.length > 0) {
        query = query.in("id", selectedCategoryIds);
        // Don't apply limit when using selected categories - preserve all selected items
      } else {
        // If no categories are selected, show categories in sort order
        query = query.order("sort_order").limit(content.show_count || 8);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching categories:", error);
        setCategories([]);
      } else {
        // If selected categories are specified, order them according to the selection order
        if (selectedCategoryIds.length > 0 && data) {
          const orderedCategories = selectedCategoryIds
            .map((id: string) => data.find((cat) => cat.id === id))
            .filter((cat): cat is ProductCategory => cat !== undefined);
          setCategories(orderedCategories);
        } else {
          setCategories(data || []);
        }
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }

  const getGridColsClass = (columns: number) => {
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
    return (
      <section className="container mx-auto px-4 py-12">
        <div className={`grid gap-6 ${getGridColsClass(content.columns || 4)}`}>
          {Array.from({ length: content.show_count || 4 }).map((_, index) => (
            <Card key={index} className="border-0 shadow-lg overflow-hidden">
              <div className="aspect-square bg-gray-200 animate-pulse"></div>
              <CardContent className="p-4">
                <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                {content.show_product_count && (
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2"></div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    );
  }

  if (categories.length === 0) {
    return (
      <section className="container mx-auto px-4 py-12">
        <div className="text-center text-gray-600">
          <p>No categories found.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="container mx-auto px-4 py-12">
      <div className={`grid gap-6 ${getGridColsClass(content.columns || 4)}`}>
        {categories.map((category) => (
          <Link
            key={category.id}
            to={`/category/${category.slug}`}
            className="group"
          >
            <Card className="border-0 shadow-lg overflow-hidden group-hover:shadow-xl transition-shadow">
              <div className="bg-gradient-to-br from-cream to-peach/30 flex items-center justify-center relative overflow-hidden aspect-square">
                {category.image_url ? (
                  <img
                    src={category.image_url}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="text-6xl">🌸</div>
                )}
              </div>
              <CardContent className="p-4 text-center">
                <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">
                  {category.name}
                </h3>
                {category.description && (
                  <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                    {category.description}
                  </p>
                )}
                {content.show_product_count && (
                  <p className="text-xs text-muted-foreground">View Products</p>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}

function TestimonialsSection({ content }: { content: any }) {
  return (
    <section className="container mx-auto px-4 py-12">
      {content.show_title && content.title && (
        <h2 className="text-3xl font-bold text-center mb-12">
          {content.title}
        </h2>
      )}
      <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {(content.testimonials || []).map((testimonial: any, index: number) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="mb-4">
                <StarRating rating={testimonial.rating || 5} size="md" />
              </div>
              <p className="text-gray-600 mb-4">"{testimonial.review}"</p>
              <div className="flex items-center gap-3">
                {testimonial.image && (
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                )}
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">
                    {testimonial.location}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

function NewsletterSection({ content }: { content: any }) {
  return (
    <section className="bg-gradient-to-r from-purple-600 to-pink-600 py-12">
      <div className="container mx-auto px-4 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">
          {content.title || "Stay Updated"}
        </h2>
        <p className="text-xl mb-8">
          {content.description || "Subscribe to our newsletter"}
        </p>
        <div className="max-w-md mx-auto flex gap-4">
          <input
            type="email"
            placeholder={content.placeholder || "Enter your email"}
            className="flex-1 px-4 py-2 rounded text-gray-900"
          />
          <Button variant="secondary">
            {content.button_text || "Subscribe"}
          </Button>
        </div>
        {content.show_privacy_text && (
          <p className="text-sm mt-4 opacity-80">
            {content.privacy_text ||
              "We respect your privacy and never share your email."}
          </p>
        )}
      </div>
    </section>
  );
}

function BannerSection({ content }: { content: any }) {
  return (
    <section className="bg-primary text-white py-8">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-2xl font-bold mb-2">{content.text}</h2>
        {content.subtext && <p className="text-lg mb-4">{content.subtext}</p>}
        {content.show_button && content.button_text && content.link && (
          <Button asChild variant="secondary">
            <a href={content.link}>{content.button_text}</a>
          </Button>
        )}
      </div>
    </section>
  );
}
