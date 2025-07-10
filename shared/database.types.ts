export interface Database {
  public: {
    Tables: {
      // Site Settings - Global configuration
      site_settings: {
        Row: {
          id: string;
          key: string;
          value: string;
          type: "text" | "json" | "boolean" | "number" | "image";
          description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          key: string;
          value: string;
          type?: "text" | "json" | "boolean" | "number" | "image";
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          key?: string;
          value?: string;
          type?: "text" | "json" | "boolean" | "number" | "image";
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };

      // Product Categories - Hierarchical structure
      product_categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          image_url: string | null;
          parent_id: string | null;
          is_active: boolean;
          sort_order: number;
          meta_title: string | null;
          meta_description: string | null;
          show_in_menu: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          image_url?: string | null;
          parent_id?: string | null;
          is_active?: boolean;
          sort_order?: number;
          meta_title?: string | null;
          meta_description?: string | null;
          show_in_menu?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          image_url?: string | null;
          parent_id?: string | null;
          is_active?: boolean;
          sort_order?: number;
          meta_title?: string | null;
          meta_description?: string | null;
          show_in_menu?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };

      // Product Category Assignments - Junction table for multi-category support
      product_category_assignments: {
        Row: {
          id: string;
          product_id: string;
          category_id: string;
          is_primary: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          category_id: string;
          is_primary?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          category_id?: string;
          is_primary?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };

      // Product Variants
      product_variants: {
        Row: {
          id: string;
          product_id: string;
          name: string;
          variation_type: string | null;
          variation_value: string | null;
          price: number;
          sale_price: number | null;
          price_override: number | null;
          sale_price_override: number | null;
          sku: string | null;
          stock_quantity: number;
          image_url: string | null;
          weight: number | null;
          length: number | null;
          width: number | null;
          height: number | null;
          is_active: boolean;
          sort_order: number;
          display_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          name: string;
          variation_type?: string | null;
          variation_value?: string | null;
          price: number;
          sale_price?: number | null;
          price_override?: number | null;
          sale_price_override?: number | null;
          sku?: string | null;
          stock_quantity?: number;
          image_url?: string | null;
          weight?: number | null;
          length?: number | null;
          width?: number | null;
          height?: number | null;
          is_active?: boolean;
          sort_order?: number;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          name?: string;
          variation_type?: string | null;
          variation_value?: string | null;
          price?: number;
          sale_price?: number | null;
          price_override?: number | null;
          sale_price_override?: number | null;
          sku?: string | null;
          stock_quantity?: number;
          image_url?: string | null;
          weight?: number | null;
          length?: number | null;
          width?: number | null;
          height?: number | null;
          is_active?: boolean;
          sort_order?: number;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };

      // Product Variation Combinations
      product_variation_combinations: {
        Row: {
          id: string;
          product_id: string;
          combination_name: string;
          price_override: number | null;
          sale_price_override: number | null;
          sku: string | null;
          stock_quantity: number;
          image_url: string | null;
          weight: number | null;
          length: number | null;
          width: number | null;
          height: number | null;
          is_active: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          combination_name: string;
          price_override?: number | null;
          sale_price_override?: number | null;
          sku?: string | null;
          stock_quantity?: number;
          image_url?: string | null;
          weight?: number | null;
          length?: number | null;
          width?: number | null;
          height?: number | null;
          is_active?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          combination_name?: string;
          price_override?: number | null;
          sale_price_override?: number | null;
          sku?: string | null;
          stock_quantity?: number;
          image_url?: string | null;
          weight?: number | null;
          length?: number | null;
          width?: number | null;
          height?: number | null;
          is_active?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };

      // Product Variation Combination Items
      product_variation_combination_items: {
        Row: {
          id: string;
          combination_id: string;
          variant_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          combination_id: string;
          variant_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          combination_id?: string;
          variant_id?: string;
          created_at?: string;
        };
      };

      // Products - Enhanced with variants and delivery zones
      products: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          short_description: string | null;
          price: number;
          sale_price: number | null;
          sku: string | null;
          stock_quantity: number;
          is_active: boolean;
          is_featured: boolean;
          has_variations: boolean;
          category_id: string;
          subcategory_id: string | null;
          images: string[];
          tags: string[];
          requires_file_upload: boolean;
          upload_file_types: string[];
          delivery_zones: string[];
          meta_title: string | null;
          meta_description: string | null;
          weight: number | null;
          dimensions: any | null; // JSON: {length, width, height}
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          short_description?: string | null;
          price: number;
          sale_price?: number | null;
          sku?: string | null;
          stock_quantity?: number;
          is_active?: boolean;
          is_featured?: boolean;
          has_variations?: boolean;
          category_id: string;
          subcategory_id?: string | null;
          images?: string[];
          tags?: string[];
          requires_file_upload?: boolean;
          upload_file_types?: string[];
          delivery_zones?: string[];
          meta_title?: string | null;
          meta_description?: string | null;
          weight?: number | null;
          dimensions?: any | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          short_description?: string | null;
          price?: number;
          sale_price?: number | null;
          sku?: string | null;
          stock_quantity?: number;
          is_active?: boolean;
          is_featured?: boolean;
          has_variations?: boolean;
          category_id?: string;
          subcategory_id?: string | null;
          images?: string[];
          tags?: string[];
          requires_file_upload?: boolean;
          upload_file_types?: string[];
          delivery_zones?: string[];
          meta_title?: string | null;
          meta_description?: string | null;
          weight?: number | null;
          dimensions?: any | null;
          created_at?: string;
          updated_at?: string;
        };
      };

      // Customers - Enhanced with birthday/anniversary
      customers: {
        Row: {
          id: string;
          email: string;
          phone: string | null;
          first_name: string;
          last_name: string;
          date_of_birth: string | null;
          anniversary_date: string | null;
          gender: "male" | "female" | "other" | null;
          addresses: any[]; // JSON array of addresses
          preferences: any | null; // JSON object for preferences
          is_active: boolean;
          email_verified: boolean;
          phone_verified: boolean;
          total_orders: number;
          total_spent: number;
          last_order_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          phone?: string | null;
          first_name: string;
          last_name: string;
          date_of_birth?: string | null;
          anniversary_date?: string | null;
          gender?: "male" | "female" | "other" | null;
          addresses?: any[];
          preferences?: any | null;
          is_active?: boolean;
          email_verified?: boolean;
          phone_verified?: boolean;
          total_orders?: number;
          total_spent?: number;
          last_order_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          phone?: string | null;
          first_name?: string;
          last_name?: string;
          date_of_birth?: string | null;
          anniversary_date?: string | null;
          gender?: "male" | "female" | "other" | null;
          addresses?: any[];
          preferences?: any | null;
          is_active?: boolean;
          email_verified?: boolean;
          phone_verified?: boolean;
          total_orders?: number;
          total_spent?: number;
          last_order_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };

      // Orders - Enhanced with delivery zones
      orders: {
        Row: {
          id: string;
          order_number: string;
          customer_id: string;
          status:
            | "pending"
            | "confirmed"
            | "processing"
            | "shipped"
            | "delivered"
            | "cancelled"
            | "refunded";
          total_amount: number;
          shipping_amount: number;
          discount_amount: number;
          tax_amount: number;
          items: any[]; // JSON array of order items
          shipping_address: any; // JSON object
          billing_address: any; // JSON object
          delivery_date: string | null;
          delivery_slot: string | null;
          delivery_zone_id: string | null;
          special_instructions: string | null;
          payment_status:
            | "pending"
            | "paid"
            | "failed"
            | "refunded"
            | "partially_refunded";
          payment_method: string | null;
          payment_reference: string | null;
          coupon_code: string | null;
          tracking_number: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_number: string;
          customer_id: string;
          status?:
            | "pending"
            | "confirmed"
            | "processing"
            | "shipped"
            | "delivered"
            | "cancelled"
            | "refunded";
          total_amount: number;
          shipping_amount?: number;
          discount_amount?: number;
          tax_amount?: number;
          items: any[];
          shipping_address: any;
          billing_address: any;
          delivery_date?: string | null;
          delivery_slot?: string | null;
          delivery_zone_id?: string | null;
          special_instructions?: string | null;
          payment_status?:
            | "pending"
            | "paid"
            | "failed"
            | "refunded"
            | "partially_refunded";
          payment_method?: string | null;
          payment_reference?: string | null;
          coupon_code?: string | null;
          tracking_number?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          order_number?: string;
          customer_id?: string;
          status?:
            | "pending"
            | "confirmed"
            | "processing"
            | "shipped"
            | "delivered"
            | "cancelled"
            | "refunded";
          total_amount?: number;
          shipping_amount?: number;
          discount_amount?: number;
          tax_amount?: number;
          items?: any[];
          shipping_address?: any;
          billing_address?: any;
          delivery_date?: string | null;
          delivery_slot?: string | null;
          delivery_zone_id?: string | null;
          special_instructions?: string | null;
          payment_status?:
            | "pending"
            | "paid"
            | "failed"
            | "refunded"
            | "partially_refunded";
          payment_method?: string | null;
          payment_reference?: string | null;
          coupon_code?: string | null;
          tracking_number?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };

      // Coupons
      coupons: {
        Row: {
          id: string;
          code: string;
          name: string;
          description: string | null;
          discount_type: "flat" | "percentage";
          discount_value: number;
          minimum_order_amount: number | null;
          maximum_discount_amount: number | null;
          usage_limit: number | null;
          usage_count: number;
          is_active: boolean;
          starts_at: string | null;
          expires_at: string | null;
          applicable_categories: string[];
          applicable_products: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          code: string;
          name: string;
          description?: string | null;
          discount_type: "flat" | "percentage";
          discount_value: number;
          minimum_order_amount?: number | null;
          maximum_discount_amount?: number | null;
          usage_limit?: number | null;
          usage_count?: number;
          is_active?: boolean;
          starts_at?: string | null;
          expires_at?: string | null;
          applicable_categories?: string[];
          applicable_products?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          code?: string;
          name?: string;
          description?: string | null;
          discount_type?: "flat" | "percentage";
          discount_value?: number;
          minimum_order_amount?: number | null;
          maximum_discount_amount?: number | null;
          usage_limit?: number | null;
          usage_count?: number;
          is_active?: boolean;
          starts_at?: string | null;
          expires_at?: string | null;
          applicable_categories?: string[];
          applicable_products?: string[];
          created_at?: string;
          updated_at?: string;
        };
      };

      // Shipping Zones
      shipping_zones: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          pincodes: string[];
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          pincodes: string[];
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          pincodes?: string[];
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };

      // Shipping Methods
      shipping_methods: {
        Row: {
          id: string;
          zone_id: string;
          name: string;
          description: string | null;
          type: "same_day" | "next_day" | "standard" | "express" | "scheduled";
          price: number;
          free_shipping_minimum: number | null;
          delivery_time: string;
          is_active: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          zone_id: string;
          name: string;
          description?: string | null;
          type: "same_day" | "next_day" | "standard" | "express" | "scheduled";
          price: number;
          free_shipping_minimum?: number | null;
          delivery_time: string;
          is_active?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          zone_id?: string;
          name?: string;
          description?: string | null;
          type?: "same_day" | "next_day" | "standard" | "express" | "scheduled";
          price?: number;
          free_shipping_minimum?: number | null;
          delivery_time?: string;
          is_active?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };

      // Dynamic Pages (CMS)
      pages: {
        Row: {
          id: string;
          title: string;
          slug: string;
          content: any; // JSON content blocks
          meta_title: string | null;
          meta_description: string | null;
          is_active: boolean;
          show_in_footer: boolean;
          footer_column: number | null;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          content: any;
          meta_title?: string | null;
          meta_description?: string | null;
          is_active?: boolean;
          show_in_footer?: boolean;
          footer_column?: number | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          content?: any;
          meta_title?: string | null;
          meta_description?: string | null;
          is_active?: boolean;
          show_in_footer?: boolean;
          footer_column?: number | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };

      // Homepage Sections - Dynamic and reorderable
      homepage_sections: {
        Row: {
          id: string;
          type:
            | "hero"
            | "category_grid"
            | "product_carousel"
            | "product_grid"
            | "text_block"
            | "image_block"
            | "testimonials"
            | "newsletter"
            | "features"
            | "banner";
          title: string | null;
          subtitle: string | null;
          content: any; // JSON content specific to section type
          settings: any; // JSON settings (colors, layout options, etc.)
          is_active: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          type:
            | "hero"
            | "category_grid"
            | "product_carousel"
            | "product_grid"
            | "text_block"
            | "image_block"
            | "testimonials"
            | "newsletter"
            | "features"
            | "banner";
          title?: string | null;
          subtitle?: string | null;
          content?: any;
          settings?: any;
          is_active?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          type?:
            | "hero"
            | "category_grid"
            | "product_carousel"
            | "product_grid"
            | "text_block"
            | "image_block"
            | "testimonials"
            | "newsletter"
            | "features"
            | "banner";
          title?: string | null;
          subtitle?: string | null;
          content?: any;
          settings?: any;
          is_active?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };

      // Menu Items - Dynamic header navigation
      menu_items: {
        Row: {
          id: string;
          name: string;
          url: string | null;
          target: "_self" | "_blank";
          parent_id: string | null;
          category_id: string | null;
          page_id: string | null;
          is_active: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          url?: string | null;
          target?: "_self" | "_blank";
          parent_id?: string | null;
          category_id?: string | null;
          page_id?: string | null;
          is_active?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          url?: string | null;
          target?: "_self" | "_blank";
          parent_id?: string | null;
          category_id?: string | null;
          page_id?: string | null;
          is_active?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };

      // Footer Sections - Admin manageable
      footer_sections: {
        Row: {
          id: string;
          title: string;
          content: any; // JSON content (links, text, etc.)
          column_position: number;
          is_active: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          content: any;
          column_position: number;
          is_active?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          content?: any;
          column_position?: number;
          is_active?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };

      // Sub-users - Role-based permissions
      sub_users: {
        Row: {
          id: string;
          email: string;
          first_name: string;
          last_name: string;
          role: "admin" | "manager" | "editor" | "viewer";
          permissions: any; // JSON object with module permissions
          is_active: boolean;
          last_login: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          first_name: string;
          last_name: string;
          role: "admin" | "manager" | "editor" | "viewer";
          permissions: any;
          is_active?: boolean;
          last_login?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          first_name?: string;
          last_name?: string;
          role?: "admin" | "manager" | "editor" | "viewer";
          permissions?: any;
          is_active?: boolean;
          last_login?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };

      // Contact Form Submissions
      contact_submissions: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string | null;
          subject: string;
          message: string;
          submitted_at: string;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          phone?: string | null;
          subject: string;
          message: string;
          submitted_at?: string;
          is_read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          phone?: string | null;
          subject?: string;
          message?: string;
          submitted_at?: string;
          is_read?: boolean;
          created_at?: string;
        };
      };
    };
  };
}

// Helper types for specific use cases
export type SiteSettings = Database["public"]["Tables"]["site_settings"]["Row"];
export type Product = Database["public"]["Tables"]["products"]["Row"];
export type ProductVariant =
  Database["public"]["Tables"]["product_variants"]["Row"];
export type ProductCategory =
  Database["public"]["Tables"]["product_categories"]["Row"];
export type Customer = Database["public"]["Tables"]["customers"]["Row"];
export type Order = Database["public"]["Tables"]["orders"]["Row"];
export type Coupon = Database["public"]["Tables"]["coupons"]["Row"];
export type ShippingZone =
  Database["public"]["Tables"]["shipping_zones"]["Row"];
export type ShippingMethod =
  Database["public"]["Tables"]["shipping_methods"]["Row"];
export type Page = Database["public"]["Tables"]["pages"]["Row"];
export type HomepageSection =
  Database["public"]["Tables"]["homepage_sections"]["Row"];
export type MenuItem = Database["public"]["Tables"]["menu_items"]["Row"];
export type FooterSection =
  Database["public"]["Tables"]["footer_sections"]["Row"];
export type SubUser = Database["public"]["Tables"]["sub_users"]["Row"];
export type ContactSubmission =
  Database["public"]["Tables"]["contact_submissions"]["Row"];

// Extended types for frontend use
export interface CartItem {
  product_id: string;
  product: Product;
  variant_id?: string;
  variant?: ProductVariant;
  quantity: number;
  uploaded_file?: File;
}

export interface ProductWithVariants extends Product {
  variants: ProductVariant[];
  category: ProductCategory;
  subcategory?: ProductCategory;
}

export interface CategoryWithChildren extends ProductCategory {
  children: ProductCategory[];
  product_count: number;
}

export interface OrderItem {
  product_id: string;
  product_name: string;
  variant_id?: string;
  variant_name?: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  uploaded_file_url?: string;
}

export interface ShippingZoneWithMethods extends ShippingZone {
  shipping_methods: ShippingMethod[];
}

export interface MenuItemWithChildren extends MenuItem {
  children: MenuItem[];
  category?: ProductCategory;
  page?: Page;
}

// Permission structure for sub-users
export interface UserPermissions {
  products: {
    view: boolean;
    create: boolean;
    edit: boolean;
    delete: boolean;
  };
  orders: {
    view: boolean;
    create: boolean;
    edit: boolean;
    delete: boolean;
  };
  customers: {
    view: boolean;
    create: boolean;
    edit: boolean;
    delete: boolean;
  };
  categories: {
    view: boolean;
    create: boolean;
    edit: boolean;
    delete: boolean;
  };
  coupons: {
    view: boolean;
    create: boolean;
    edit: boolean;
    delete: boolean;
  };
  shipping: {
    view: boolean;
    create: boolean;
    edit: boolean;
    delete: boolean;
  };
  pages: {
    view: boolean;
    create: boolean;
    edit: boolean;
    delete: boolean;
  };
  homepage: {
    view: boolean;
    edit: boolean;
  };
  settings: {
    view: boolean;
    edit: boolean;
  };
  users: {
    view: boolean;
    create: boolean;
    edit: boolean;
    delete: boolean;
  };
}
