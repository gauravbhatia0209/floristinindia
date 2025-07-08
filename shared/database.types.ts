export interface Database {
  public: {
    Tables: {
      site_settings: {
        Row: {
          id: string;
          key: string;
          value: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          key: string;
          value: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          key?: string;
          value?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      product_categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          image_url: string | null;
          is_active: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          image_url?: string | null;
          is_active?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          image_url?: string | null;
          is_active?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
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
          category_id: string;
          images: string[];
          tags: string[];
          requires_file_upload: boolean;
          delivery_zones: string[];
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
          category_id: string;
          images?: string[];
          tags?: string[];
          requires_file_upload?: boolean;
          delivery_zones?: string[];
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
          category_id?: string;
          images?: string[];
          tags?: string[];
          requires_file_upload?: boolean;
          delivery_zones?: string[];
          created_at?: string;
          updated_at?: string;
        };
      };
      homepage_sections: {
        Row: {
          id: string;
          type:
            | "hero"
            | "category_grid"
            | "product_carousel"
            | "text_block"
            | "image_block"
            | "testimonials";
          title: string | null;
          content: any; // JSON content specific to section type
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
            | "text_block"
            | "image_block"
            | "testimonials";
          title?: string | null;
          content?: any;
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
            | "text_block"
            | "image_block"
            | "testimonials";
          title?: string | null;
          content?: any;
          is_active?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      customers: {
        Row: {
          id: string;
          email: string;
          phone: string | null;
          first_name: string;
          last_name: string;
          date_of_birth: string | null;
          anniversary_date: string | null;
          address: any | null; // JSON object
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
          address?: any | null;
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
          address?: any | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          customer_id: string;
          status:
            | "pending"
            | "confirmed"
            | "processing"
            | "shipped"
            | "delivered"
            | "cancelled";
          total_amount: number;
          shipping_amount: number;
          discount_amount: number;
          items: any[]; // JSON array of order items
          shipping_address: any; // JSON object
          billing_address: any; // JSON object
          delivery_date: string | null;
          delivery_slot: string | null;
          notes: string | null;
          payment_status: "pending" | "paid" | "failed" | "refunded";
          payment_method: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          customer_id: string;
          status?:
            | "pending"
            | "confirmed"
            | "processing"
            | "shipped"
            | "delivered"
            | "cancelled";
          total_amount: number;
          shipping_amount?: number;
          discount_amount?: number;
          items: any[];
          shipping_address: any;
          billing_address: any;
          delivery_date?: string | null;
          delivery_slot?: string | null;
          notes?: string | null;
          payment_status?: "pending" | "paid" | "failed" | "refunded";
          payment_method?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          customer_id?: string;
          status?:
            | "pending"
            | "confirmed"
            | "processing"
            | "shipped"
            | "delivered"
            | "cancelled";
          total_amount?: number;
          shipping_amount?: number;
          discount_amount?: number;
          items?: any[];
          shipping_address?: any;
          billing_address?: any;
          delivery_date?: string | null;
          delivery_slot?: string | null;
          notes?: string | null;
          payment_status?: "pending" | "paid" | "failed" | "refunded";
          payment_method?: string | null;
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
export type HomepageSection =
  Database["public"]["Tables"]["homepage_sections"]["Row"];
export type Customer = Database["public"]["Tables"]["customers"]["Row"];
export type Order = Database["public"]["Tables"]["orders"]["Row"];

export interface CartItem {
  product_id: string;
  product: Product;
  quantity: number;
  variant_id?: string;
  uploaded_file?: File;
}

export interface ShippingZone {
  id: string;
  name: string;
  pincodes: string[];
  shipping_methods: ShippingMethod[];
}

export interface ShippingMethod {
  id: string;
  name: string;
  price: number;
  delivery_time: string;
  is_active: boolean;
}
