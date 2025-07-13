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

      // Products - Main product catalog
      products: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          images: string[];
          price: number;
          sale_price: number | null;
          cost_price: number | null;
          sku: string | null;
          barcode: string | null;
          track_inventory: boolean;
          inventory_quantity: number;
          allow_backorders: boolean;
          weight: number | null;
          dimensions: {
            length?: number;
            width?: number;
            height?: number;
          } | null;
          category_id: string | null;
          tags: string[];
          is_active: boolean;
          is_featured: boolean;
          sort_order: number;
          meta_title: string | null;
          meta_description: string | null;
          requires_file_upload: boolean;
          upload_file_types: string[];
          features: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          images?: string[];
          price: number;
          sale_price?: number | null;
          cost_price?: number | null;
          sku?: string | null;
          barcode?: string | null;
          track_inventory?: boolean;
          inventory_quantity?: number;
          allow_backorders?: boolean;
          weight?: number | null;
          dimensions?: {
            length?: number;
            width?: number;
            height?: number;
          } | null;
          category_id?: string | null;
          tags?: string[];
          is_active?: boolean;
          is_featured?: boolean;
          sort_order?: number;
          meta_title?: string | null;
          meta_description?: string | null;
          requires_file_upload?: boolean;
          upload_file_types?: string[];
          features?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          images?: string[];
          price?: number;
          sale_price?: number | null;
          cost_price?: number | null;
          sku?: string | null;
          barcode?: string | null;
          track_inventory?: boolean;
          inventory_quantity?: number;
          allow_backorders?: boolean;
          weight?: number | null;
          dimensions?: {
            length?: number;
            width?: number;
            height?: number;
          } | null;
          category_id?: string | null;
          tags?: string[];
          is_active?: boolean;
          is_featured?: boolean;
          sort_order?: number;
          meta_title?: string | null;
          meta_description?: string | null;
          requires_file_upload?: boolean;
          upload_file_types?: string[];
          features?: string[];
          created_at?: string;
          updated_at?: string;
        };
      };

      // Additional tables would go here...
      customers: {
        Row: {
          id: string;
          first_name: string;
          last_name: string;
          email: string;
          phone: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          first_name: string;
          last_name: string;
          email: string;
          phone?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          first_name?: string;
          last_name?: string;
          email?: string;
          phone?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };

      orders: {
        Row: {
          id: string;
          order_number: string;
          customer_id: string | null;
          status: string;
          total_amount: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_number: string;
          customer_id?: string | null;
          status?: string;
          total_amount: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          order_number?: string;
          customer_id?: string | null;
          status?: string;
          total_amount?: number;
          created_at?: string;
          updated_at?: string;
        };
      };

      coupons: {
        Row: {
          id: string;
          code: string;
          type: string;
          value: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          code: string;
          type: string;
          value: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          code?: string;
          type?: string;
          value?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };

      shipping_zones: {
        Row: {
          id: string;
          name: string;
          pincodes: string[];
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          pincodes: string[];
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          pincodes?: string[];
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };

      shipping_methods: {
        Row: {
          id: string;
          name: string;
          type: string;
          price: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          type: string;
          price: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          type?: string;
          price?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}

// Helper types for specific use cases
export type SiteSettings = Database["public"]["Tables"]["site_settings"]["Row"];
export type Product = Database["public"]["Tables"]["products"]["Row"];
export type ProductCategory =
  Database["public"]["Tables"]["product_categories"]["Row"];
export type Customer = Database["public"]["Tables"]["customers"]["Row"];
export type Order = Database["public"]["Tables"]["orders"]["Row"];
export type Coupon = Database["public"]["Tables"]["coupons"]["Row"];
export type ShippingZone =
  Database["public"]["Tables"]["shipping_zones"]["Row"];
export type ShippingMethod =
  Database["public"]["Tables"]["shipping_methods"]["Row"];
