import { useState, useEffect } from "react";
import { Star, Heart, Shield, Truck, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  const images = content.images || [];

  useEffect(() => {
    if (content.autoplay && images.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
      }, content.autoplay_delay || 5000);
      return () => clearInterval(interval);
    }
  }, [content.autoplay, content.autoplay_delay, images.length]);

  if (!images.length) return null;

  return (
    <section
      className="relative overflow-hidden"
      style={{ height: content.height || 500 }}
    >
      {images.map((image: string, index: number) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-500 ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={image}
            alt={`Slide ${index + 1}`}
            className="w-full h-full object-cover"
          />
        </div>
      ))}

      {content.show_navigation && images.length > 1 && (
        <>
          <button
            onClick={() =>
              setCurrentIndex(
                (prev) => (prev - 1 + images.length) % images.length,
              )
            }
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-40 text-white p-2 rounded-full"
          >
            ←
          </button>
          <button
            onClick={() =>
              setCurrentIndex((prev) => (prev + 1) % images.length)
            }
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-40 text-white p-2 rounded-full"
          >
            →
          </button>
        </>
      )}

      {content.show_dots && images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {images.map((_: any, index: number) => (
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

// Placeholder components for complex sections that need data fetching
function ProductCarouselSection({ content }: { content: any }) {
  return (
    <section className="container mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-center mb-8">
        {content.title || "Featured Products"}
      </h2>
      <div className="text-center text-gray-600">
        <p>Product carousel will be implemented here</p>
        <p className="text-sm">Filter: {content.product_filter}</p>
      </div>
    </section>
  );
}

function CategoryGridSection({ content }: { content: any }) {
  return (
    <section className="container mx-auto px-4 py-12">
      <div className="text-center text-gray-600">
        <p>Category grid will be implemented here</p>
        <p className="text-sm">Columns: {content.columns}</p>
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
              <div className="flex mb-4">
                {[...Array(testimonial.rating || 5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-yellow-400 text-yellow-400"
                  />
                ))}
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
