// Enhanced Shipping Management Types

export interface ShippingMethodTemplate {
  id: string;
  name: string;
  description: string | null;
  type: "same_day" | "next_day" | "standard" | "express" | "scheduled";
  rules: string | null; // Custom rules/notes
  time_slot_required: boolean; // Whether this method requires time slot selection
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface ShippingMethodZoneConfig {
  id: string;
  method_template_id: string;
  zone_id: string;
  price: number;
  free_shipping_minimum: number | null;
  delivery_time: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ShippingZone {
  id: string;
  name: string;
  description: string | null;
  pincodes: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ShippingMethodWithZones extends ShippingMethodTemplate {
  zone_configs: (ShippingMethodZoneConfig & {
    zone: ShippingZone;
  })[];
}

export interface ShippingZoneWithMethods extends ShippingZone {
  method_configs: (ShippingMethodZoneConfig & {
    method_template: ShippingMethodTemplate;
  })[];
}

// For checkout and order processing
export interface AvailableShippingMethod {
  method_id: string;
  config_id: string;
  name: string;
  description: string | null;
  type: string;
  price: number;
  free_shipping_minimum: number | null;
  delivery_time: string;
  rules: string | null;
  time_slot_required: boolean;
  zone_id: string;
  zone_name: string;
}

// Form data interfaces
export interface ShippingMethodFormData {
  name: string;
  description: string;
  type: "same_day" | "next_day" | "standard" | "express" | "scheduled";
  rules: string;
  is_active: boolean;
  zone_configs: {
    zone_id: string;
    price: string;
    free_shipping_minimum: string;
    delivery_time: string;
    is_active: boolean;
  }[];
}

export interface ShippingZoneFormData {
  name: string;
  description: string;
  pincodes: string;
  is_active: boolean;
}
