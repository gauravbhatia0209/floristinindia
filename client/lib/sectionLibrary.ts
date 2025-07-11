import {
  Image,
  Type,
  Grid3x3,
  ShoppingCart,
  MessageSquare,
  Mail,
  Star,
  Zap,
  FileText,
  Link as LinkIcon,
  List,
  Minus,
  MousePointer as ButtonIcon,
} from "lucide-react";

export interface SectionTemplate {
  type: string;
  name: string;
  icon: any;
  description: string;
  category: "content" | "commerce" | "marketing" | "layout";
  defaultContent: any;
  isCarousel?: boolean;
  availableFor: ("homepage" | "pages")[];
}

export const sectionTemplates: SectionTemplate[] = [
  // CONTENT SECTIONS
  {
    type: "hero",
    name: "Hero Banner",
    icon: Image,
    description: "Large banner with title, subtitle, and call-to-action",
    category: "content",
    availableFor: ["homepage", "pages"],
    defaultContent: {
      title: "Welcome to Our Store",
      subtitle: "Experience the joy of premium flower delivery across India",
      description:
        "Same-day delivery available in 100+ cities with fresh guarantee.",
      background_image: "",
      button_text: "Shop Now",
      button_link: "/products",
      features: ["Same-day delivery", "100+ cities", "Fresh guarantee"],
    },
  },
  {
    type: "hero_carousel",
    name: "Hero Image Carousel",
    icon: Image,
    description: "Full-width image carousel with auto-cycle and navigation",
    category: "content",
    isCarousel: true,
    availableFor: ["homepage", "pages"],
    defaultContent: {
      slides: [
        {
          image: "",
          url: "",
          target: "_self",
        },
      ],
      autoplay: true,
      autoplay_delay: 5000,
      show_navigation: true,
      show_dots: true,
      height: 500,
    },
  },
  {
    type: "text_block",
    name: "Text Content",
    icon: Type,
    description: "Rich text content with formatting options",
    category: "content",
    availableFor: ["homepage", "pages"],
    defaultContent: {
      content: "Your custom content here...",
      alignment: "left",
      font_size: "base",
      background_color: "transparent",
      text_color: "default",
      max_width: "none",
    },
  },
  {
    type: "heading",
    name: "Heading",
    icon: Type,
    description: "Page or section heading",
    category: "content",
    availableFor: ["pages"],
    defaultContent: {
      level: 1,
      text: "Page Title",
      alignment: "left",
      color: "default",
    },
  },
  {
    type: "paragraph",
    name: "Paragraph",
    icon: FileText,
    description: "Regular text paragraph",
    category: "content",
    availableFor: ["pages"],
    defaultContent: {
      text: "Your paragraph content goes here...",
      alignment: "left",
      font_size: "base",
    },
  },
  {
    type: "image",
    name: "Image",
    icon: Image,
    description: "Single image with optional caption",
    category: "content",
    availableFor: ["pages"],
    defaultContent: {
      src: "",
      alt: "",
      caption: "",
      alignment: "center",
      width: "full",
      link: "",
    },
  },
  {
    type: "button",
    name: "Button",
    icon: ButtonIcon,
    description: "Call-to-action button",
    category: "content",
    availableFor: ["pages"],
    defaultContent: {
      text: "Click Here",
      link: "",
      style: "primary",
      size: "medium",
      alignment: "left",
      target: "_self",
    },
  },
  {
    type: "list",
    name: "List",
    icon: List,
    description: "Bulleted or numbered list",
    category: "content",
    availableFor: ["pages"],
    defaultContent: {
      type: "bulleted",
      items: ["List item 1", "List item 2", "List item 3"],
      alignment: "left",
    },
  },
  {
    type: "separator",
    name: "Separator",
    icon: Minus,
    description: "Visual divider line",
    category: "layout",
    availableFor: ["pages"],
    defaultContent: {
      style: "line",
      color: "border",
      spacing: "medium",
    },
  },

  // COMMERCE SECTIONS
  {
    type: "category_grid",
    name: "Category Grid",
    icon: Grid3x3,
    description: "Display product categories in a grid layout",
    category: "commerce",
    availableFor: ["homepage", "pages"],
    defaultContent: {
      show_count: 8,
      layout: "grid",
      show_product_count: true,
      columns: 4,
      show_descriptions: false,
    },
  },
  {
    type: "product_carousel",
    name: "Product Showcase",
    icon: ShoppingCart,
    description: "Featured products carousel",
    category: "commerce",
    availableFor: ["homepage", "pages"],
    defaultContent: {
      product_filter: "featured",
      show_count: 8,
      autoplay: true,
      autoplay_delay: 3000,
      show_navigation: true,
      show_dots: false,
      title: "Featured Products",
      show_title: true,
    },
  },

  // MARKETING SECTIONS
  {
    type: "features",
    name: "Features Section",
    icon: Zap,
    description: "Highlight your key features and benefits",
    category: "marketing",
    availableFor: ["homepage", "pages"],
    defaultContent: {
      title: "Why Choose Us",
      show_title: true,
      layout: "grid",
      columns: 3,
      features: [
        {
          icon: "truck",
          title: "Fast Delivery",
          description: "Quick and reliable delivery service",
        },
        {
          icon: "shield",
          title: "Quality Guarantee",
          description: "100% satisfaction guaranteed",
        },
        {
          icon: "heart",
          title: "24/7 Support",
          description: "Always here to help you",
        },
      ],
    },
  },
  {
    type: "testimonials",
    name: "Customer Reviews",
    icon: MessageSquare,
    description: "Show customer testimonials and reviews",
    category: "marketing",
    availableFor: ["homepage", "pages"],
    defaultContent: {
      title: "What Our Customers Say",
      show_title: true,
      layout: "carousel",
      autoplay: true,
      testimonials: [
        {
          name: "Customer Name",
          location: "City",
          rating: 5,
          review: "Great service and quality products!",
          image: "",
        },
        {
          name: "Another Customer",
          location: "Another City",
          rating: 5,
          review: "Excellent experience, highly recommended!",
          image: "",
        },
      ],
    },
  },
  {
    type: "newsletter",
    name: "Newsletter Signup",
    icon: Mail,
    description: "Email subscription form",
    category: "marketing",
    availableFor: ["homepage", "pages"],
    defaultContent: {
      title: "Stay Updated",
      description: "Subscribe to get the latest offers and updates",
      background: "gradient-rose",
      placeholder: "Enter your email",
      button_text: "Subscribe",
      show_privacy_text: true,
      privacy_text: "We respect your privacy and never share your email.",
    },
  },
  {
    type: "banner",
    name: "Promotional Banner",
    icon: Star,
    description: "Special offers or announcements",
    category: "marketing",
    availableFor: ["homepage", "pages"],
    defaultContent: {
      text: "Special Offer - 20% Off All Flowers!",
      subtext: "Limited time only",
      background_color: "primary",
      text_color: "white",
      link: "/products",
      button_text: "Shop Now",
      show_button: true,
      closeable: false,
    },
  },
];

export function getSectionTemplatesForPage(
  pageType: "homepage" | "pages",
): SectionTemplate[] {
  return sectionTemplates.filter((template) =>
    template.availableFor.includes(pageType),
  );
}

export function getSectionTemplatesByCategory(
  pageType: "homepage" | "pages",
  category?: string,
): Record<string, SectionTemplate[]> {
  const availableTemplates = getSectionTemplatesForPage(pageType);

  if (category) {
    return {
      [category]: availableTemplates.filter(
        (template) => template.category === category,
      ),
    };
  }

  return availableTemplates.reduce(
    (acc, template) => {
      if (!acc[template.category]) {
        acc[template.category] = [];
      }
      acc[template.category].push(template);
      return acc;
    },
    {} as Record<string, SectionTemplate[]>,
  );
}

export function getSectionTemplate(type: string): SectionTemplate | undefined {
  return sectionTemplates.find((template) => template.type === type);
}
