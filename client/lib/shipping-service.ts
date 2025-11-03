import { supabase } from "./supabase";
import { AvailableShippingMethod } from "@/types/shipping";

/**
 * Get available shipping methods for a specific pincode
 */
export async function getAvailableShippingMethods(
  pincode: string,
): Promise<AvailableShippingMethod[]> {
  try {
    // First, find the zone that contains this pincode
    const { data: zones, error: zoneError } = await supabase
      .from("shipping_zones")
      .select("*")
      .eq("is_active", true);

    if (zoneError) {
      console.error("Error fetching zones:", zoneError);
      throw zoneError;
    }

    const zone = zones?.find((z) => z.pincodes.includes(pincode));

    if (!zone) {
      return [];
    }

    console.log("Found zone for pincode:", zone);

    // Get shipping methods available for this zone with proper filtering
    const { data: methods, error: methodsError } = await supabase
      .from("shipping_methods_with_zones")
      .select("*")
      .eq("zone_id", zone.id)
      .eq("method_active", true)
      .eq("zone_active", true)
      .order("sort_order");

    if (methodsError) {
      console.error("Error fetching filtered methods:", methodsError);
      throw methodsError;
    }

    console.log("Filtered methods for zone:", methods);

    const mappedMethods =
      methods?.map((method) => ({
        method_id: method.method_id,
        config_id: method.config_id,
        name: method.name,
        description: method.description,
        type: method.type,
        price: method.price,
        free_shipping_minimum: method.free_shipping_minimum,
        delivery_time: method.delivery_time,
        rules: method.rules,
        time_slot_required: method.time_slot_required ?? false,
        zone_id: method.zone_id,
        zone_name: method.zone_name,
      })) || [];

    return mappedMethods;
  } catch (error) {
    console.error("Error fetching shipping methods:", error);
    return [];
  }
}

/**
 * Calculate shipping cost based on order value and selected method
 */
export function calculateShippingCost(
  method: AvailableShippingMethod,
  orderValue: number,
): number {
  if (
    method.free_shipping_minimum &&
    orderValue >= method.free_shipping_minimum
  ) {
    return 0; // Free shipping
  }
  return method.price;
}

/**
 * Get shipping method details by config ID
 */
export async function getShippingMethodById(
  configId: string,
): Promise<AvailableShippingMethod | null> {
  try {
    const { data: method, error } = await supabase
      .from("shipping_methods_with_zones")
      .select("*")
      .eq("config_id", configId)
      .eq("method_active", true)
      .eq("zone_active", true)
      .single();

    if (error) throw error;

    return method
      ? {
          method_id: method.method_id,
          config_id: method.config_id,
          name: method.name,
          description: method.description,
          type: method.type,
          price: method.price,
          free_shipping_minimum: method.free_shipping_minimum,
          delivery_time: method.delivery_time,
          rules: method.rules,
          time_slot_required: method.time_slot_required || false,
          zone_id: method.zone_id,
          zone_name: method.zone_name,
        }
      : null;
  } catch (error) {
    console.error("Error fetching shipping method by ID:", error);
    return null;
  }
}

/**
 * Validate if a shipping method is available for a pincode
 */
export async function validateShippingMethod(
  configId: string,
  pincode: string,
): Promise<boolean> {
  try {
    const availableMethods = await getAvailableShippingMethods(pincode);
    return availableMethods.some((method) => method.config_id === configId);
  } catch (error) {
    console.error("Error validating shipping method:", error);
    return false;
  }
}

/**
 * Get all shipping zones (for admin reference)
 */
export async function getAllShippingZones() {
  try {
    const { data: zones, error } = await supabase
      .from("shipping_zones")
      .select("*")
      .order("name");

    if (error) throw error;
    return zones || [];
  } catch (error) {
    console.error("Error fetching shipping zones:", error);
    return [];
  }
}

/**
 * Check if delivery is available to a specific pincode
 */
export async function isDeliveryAvailable(pincode: string): Promise<boolean> {
  try {
    const { data: zones, error } = await supabase
      .from("shipping_zones")
      .select("pincodes")
      .eq("is_active", true);

    if (error) throw error;

    return zones?.some((zone) => zone.pincodes.includes(pincode)) || false;
  } catch (error) {
    console.error("Error checking delivery availability:", error);
    return false;
  }
}

/**
 * Check if a specific product is available at a given pincode
 */
export async function isProductAvailableAtPincode(
  productId: string,
  pincode: string,
): Promise<boolean> {
  try {
    // First, find the zone that contains this pincode
    const { data: zones, error: zoneError } = await supabase
      .from("shipping_zones")
      .select("id")
      .eq("is_active", true);

    if (zoneError) throw zoneError;

    if (!zones || zones.length === 0) {
      return false;
    }

    // Find zone containing the pincode
    let zoneId: string | null = null;
    for (const zone of zones) {
      const { data: zoneData, error: zoneDetailsError } = await supabase
        .from("shipping_zones")
        .select("pincodes")
        .eq("id", zone.id)
        .single();

      if (!zoneDetailsError && zoneData?.pincodes?.includes(pincode)) {
        zoneId = zone.id;
        break;
      }
    }

    if (!zoneId) {
      return false;
    }

    // Check if product is available in this zone
    const { data: productZone, error: productError } = await supabase
      .from("product_delivery_zones")
      .select("is_available, available_quantity")
      .eq("product_id", productId)
      .eq("zone_id", zoneId)
      .single();

    if (productError) {
      // No entry means product is not available in this zone
      return false;
    }

    return (
      productZone?.is_available === true && productZone?.available_quantity > 0
    );
  } catch (error) {
    console.error("Error checking product availability at pincode:", error);
    return false;
  }
}

/**
 * Get product availability details for a pincode
 */
export async function getProductAvailabilityAtPincode(
  productId: string,
  pincode: string,
): Promise<{
  isAvailable: boolean;
  quantity: number;
  zoneId: string | null;
} | null> {
  try {
    // Find the zone that contains this pincode
    const { data: zones, error: zoneError } = await supabase
      .from("shipping_zones")
      .select("id, pincodes")
      .eq("is_active", true);

    if (zoneError) throw zoneError;

    if (!zones || zones.length === 0) {
      return { isAvailable: false, quantity: 0, zoneId: null };
    }

    let zoneId: string | null = null;
    for (const zone of zones) {
      if (zone.pincodes?.includes(pincode)) {
        zoneId = zone.id;
        break;
      }
    }

    if (!zoneId) {
      return { isAvailable: false, quantity: 0, zoneId: null };
    }

    // Get product availability in this zone
    const { data: productZone } = await supabase
      .from("product_delivery_zones")
      .select("is_available, available_quantity")
      .eq("product_id", productId)
      .eq("zone_id", zoneId)
      .single();

    if (!productZone) {
      return { isAvailable: false, quantity: 0, zoneId };
    }

    return {
      isAvailable:
        productZone.is_available === true && productZone.available_quantity > 0,
      quantity: productZone.available_quantity || 0,
      zoneId,
    };
  } catch (error) {
    console.error("Error getting product availability details:", error);
    return null;
  }
}
