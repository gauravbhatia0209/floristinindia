import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  CreditCard,
  MapPin,
  Package,
  User,
  Percent,
  MessageSquare,
  Truck,
  Shield,
  Phone,
  Mail,
  FileText,
  CheckCircle,
  Clock,
  Info,
  IndianRupee,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";
import { useCart } from "@/hooks/useCart";
import { ShippingZone, ShippingMethod, Coupon } from "@shared/database.types";
import { PaymentGateway } from "@shared/payment.types";
import PaymentMethodSelector from "@/components/PaymentMethodSelector";
import PaymentProcessor from "@/components/PaymentProcessor";
import { AvailableShippingMethod } from "@/types/shipping";
import {
  getAvailableShippingMethods,
  calculateShippingCost,
} from "@/lib/shipping-service";
import { useGoogleAnalytics } from "@/components/GoogleAnalytics";
import { useFacebookPixel } from "@/components/FacebookPixel";
import { uploadImageToSupabase } from "@/lib/supabase-storage";

interface ShippingMethodCardProps {
  pincode: string;
  orderValue: number;
  selectedMethodId: string | null;
  onMethodSelect: (
    method: AvailableShippingMethod | null,
    cost: number,
  ) => void;
}

function ShippingMethodCard({
  pincode,
  orderValue,
  selectedMethodId,
  onMethodSelect,
}: ShippingMethodCardProps) {
  const [availableMethods, setAvailableMethods] = useState<
    AvailableShippingMethod[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (pincode && pincode.length >= 6) {
      fetchShippingMethods();
    } else {
      setAvailableMethods([]);
      onMethodSelect(null, 0);
    }
  }, [pincode]);

  async function fetchShippingMethods() {
    try {
      setIsLoading(true);
      setError("");

      const methods = await getAvailableShippingMethods(pincode);

      if (methods.length === 0) {
        setError("Sorry, delivery is not available to this pincode.");
        setAvailableMethods([]);
        onMethodSelect(null, 0);
        return;
      }

      setAvailableMethods(methods);

      // Auto-select first method only if no method is currently selected
      if (!selectedMethodId && methods.length > 0) {
        setTimeout(() => {
          const firstMethod = methods[0];
          const cost = calculateShippingCost(firstMethod, orderValue);
          onMethodSelect(firstMethod, cost);
        }, 0);
      }
    } catch (error) {
      console.error("Error fetching shipping methods:", error);
      setError("Failed to load shipping options. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleMethodChange(methodId: string) {
    const method = availableMethods.find((m) => m.config_id === methodId);
    if (method) {
      const cost = calculateShippingCost(method, orderValue);
      onMethodSelect(method, cost);
    }
  }

  if (!pincode || pincode.length < 6) {
    return (
      <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
        <CardContent className="p-6">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Enter your pincode to see available delivery options.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            <div className="h-16 bg-gray-200 rounded"></div>
            <div className="h-16 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
        <CardContent className="p-6">
          <Alert variant="destructive">
            <MapPin className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-3 text-xl">
          <div className="bg-white/20 rounded-lg p-2">
            <Truck className="w-6 h-6" />
          </div>
          Delivery Options
          <Badge
            variant="secondary"
            className="bg-white/20 text-white border-white/30"
          >
            {availableMethods.length} available
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          <RadioGroup
            value={selectedMethodId || ""}
            onValueChange={handleMethodChange}
            className="space-y-3"
          >
            {availableMethods.map((method) => {
              const shippingCost = calculateShippingCost(method, orderValue);
              const isFreeShipping = shippingCost === 0 && method.price > 0;
              const isSelected = selectedMethodId === method.config_id;

              return (
                <div
                  key={method.config_id}
                  className={`border rounded-lg p-4 transition-all ${
                    isSelected
                      ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <RadioGroupItem
                      value={method.config_id}
                      id={method.config_id}
                      className="mt-1"
                    />
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Label
                            htmlFor={method.config_id}
                            className="font-medium cursor-pointer flex-1"
                          >
                            {method.name}
                          </Label>
                          <Badge variant="outline" className="text-xs">
                            {method.type.replace("_", " ")}
                          </Badge>
                          {isSelected && (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          )}
                        </div>
                        <div className="text-right">
                          {isFreeShipping ? (
                            <div className="space-y-1">
                              <span className="text-green-600 font-semibold text-sm">
                                FREE
                              </span>
                              <div className="text-xs text-muted-foreground line-through">
                                ₹{method.price}
                              </div>
                            </div>
                          ) : (
                            <span className="font-semibold">
                              {shippingCost === 0 ? "FREE" : `₹${shippingCost}`}
                            </span>
                          )}
                        </div>
                      </div>

                      {method.description && (
                        <p className="text-sm text-muted-foreground">
                          {method.description}
                        </p>
                      )}

                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {method.delivery_time}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {method.zone_name}
                        </span>
                        {method.free_shipping_minimum &&
                          orderValue < method.free_shipping_minimum && (
                            <span className="text-green-600 text-xs">
                              Free above ₹{method.free_shipping_minimum}
                            </span>
                          )}
                      </div>

                      {method.rules && (
                        <Alert className="mt-2">
                          <Info className="h-4 w-4" />
                          <AlertDescription className="text-xs">
                            {method.rules}
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </RadioGroup>

          <div className="pt-4 border-t">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">
                Delivering to pincode: {pincode}
              </span>
              {selectedMethodId && (
                <span className="font-medium">
                  Total delivery charges:{" "}
                  {(() => {
                    const method = availableMethods.find(
                      (m) => m.config_id === selectedMethodId,
                    );
                    if (method) {
                      const cost = calculateShippingCost(method, orderValue);
                      return cost === 0 ? "FREE" : `₹${cost}`;
                    }
                    return "₹0";
                  })()}
                </span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface CheckoutForm {
  // Customer Info
  fullName: string;
  email: string;
  phone: string;
  phoneCountryCode: string;

  // Delivery Address
  receiverName: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
  receiverPhone: string;
  receiverPhoneCountryCode: string;
  alternatePhone: string;

  // Message with Order
  orderMessage: string;

  // Delivery
  deliveryDate: string;
  deliverySlot: string;
  specialInstructions: string;

  // Payment handled in step 2

  // Terms & Conditions
  acceptTerms: boolean;
}

// Payment request using XMLHttpRequest to avoid fetch body stream issues
async function createPaymentRequest(
  paymentData: any,
  abortController: AbortController,
) {
  const requestId = Math.random().toString(36).substring(7);
  console.log(`[${requestId}] Starting payment request with XMLHttpRequest`);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    // Handle abort signal
    const onAbort = () => {
      xhr.abort();
      console.log(`[${requestId}] Request cancelled via abort controller`);
      reject(new Error("CANCELLED"));
    };

    if (abortController.signal.aborted) {
      reject(new Error("CANCELLED"));
      return;
    }

    abortController.signal.addEventListener("abort", onAbort);

    xhr.open("POST", "/api/payments/create", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Cache-Control", "no-cache");
    xhr.setRequestHeader("X-Request-ID", requestId);

    xhr.onloadend = () => {
      abortController.signal.removeEventListener("abort", onAbort);
    };

    xhr.onload = () => {
      console.log(`[${requestId}] Response received, status: ${xhr.status}`);

      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const responseData = JSON.parse(xhr.responseText);
          console.log(`[${requestId}] Successfully parsed response`);
          resolve(responseData);
        } catch (parseError) {
          console.error(
            `[${requestId}] Failed to parse payment response:`,
            parseError,
          );
          reject(new Error("Invalid response from payment service"));
        }
      } else {
        console.error(
          `[${requestId}] Payment API error (${xhr.status}):`,
          xhr.responseText,
        );
        reject(
          new Error(
            `HTTP error! status: ${xhr.status}, details: ${xhr.responseText}`,
          ),
        );
      }
    };

    xhr.onerror = () => {
      console.error(`[${requestId}] Network error during payment creation`);
      reject(
        new Error("Network error. Please check your connection and try again."),
      );
    };

    xhr.onabort = () => {
      console.log(`[${requestId}] Request was aborted`);
      reject(new Error("CANCELLED"));
    };

    xhr.ontimeout = () => {
      console.error(`[${requestId}] Request timed out`);
      reject(new Error("Request timed out. Please try again."));
    };

    // Set timeout to 30 seconds
    xhr.timeout = 30000;

    try {
      const requestBody = JSON.stringify(paymentData);
      console.log(`[${requestId}] Sending XMLHttpRequest`);
      xhr.send(requestBody);
    } catch (error) {
      console.error(`[${requestId}] Error sending request:`, error);
      reject(new Error("Failed to send payment request"));
    }
  });
}

export default function Checkout() {
  const navigate = useNavigate();
  const { items, total, clearCart } = useCart();
  const [form, setForm] = useState<CheckoutForm>({
    fullName: "",
    email: "",
    phone: "",
    phoneCountryCode: "+91",
    receiverName: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
    receiverPhone: "",
    receiverPhoneCountryCode: "+91",
    alternatePhone: "",
    orderMessage: "",
    deliveryDate: "",
    deliverySlot: "",
    specialInstructions: "",
    acceptTerms: false,
  });

  const [selectedShippingMethod, setSelectedShippingMethod] =
    useState<AvailableShippingMethod | null>(null);
  const [shippingCost, setShippingCost] = useState<number>(0);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const submissionRef = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const [gstRate, setGstRate] = useState(18); // Default fallback
  const [currentStep, setCurrentStep] = useState(1); // 1: Form, 2: Payment (redirect to gateway)
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentGateway | null>(null);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  const [orderCreated, setOrderCreated] = useState(false);
  const [createdOrderNumber, setCreatedOrderNumber] = useState<string>("");
  const { trackPurchase } = useGoogleAnalytics();
  const { trackPurchase: trackFBPurchase, trackInitiateCheckout } =
    useFacebookPixel();

  // Function to generate sequential order number
  async function generateOrderNumber(): Promise<string> {
    try {
      // Get the latest order number to determine the next sequence
      const { data: latestOrder } = await supabase
        .from("orders")
        .select("order_number")
        .like("order_number", "FII%")
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      let nextNumber = 1;

      if (latestOrder?.order_number) {
        // Extract the number part from the latest order number
        const numberPart = latestOrder.order_number.replace("FII", "");
        const latestNumber = parseInt(numberPart);
        if (!isNaN(latestNumber)) {
          nextNumber = latestNumber + 1;
        }
      }

      // Format with leading zeros (5 digits)
      return `FII${nextNumber.toString().padStart(5, "0")}`;
    } catch (error) {
      console.error("Error generating order number:", error);
      // Fallback to timestamp-based number if there's an error
      return `FII${Date.now().toString().slice(-5)}`;
    }
  }

  useEffect(() => {
    if (items.length === 0 && !orderCreated) {
      navigate("/cart");
    }
    fetchGstRate();

    // Track checkout initiation for Facebook Pixel
    if (items.length > 0) {
      const checkoutValue = items.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0,
      );
      trackInitiateCheckout(checkoutValue, "INR", items.length);
    }
  }, [items, navigate]);

  async function fetchGstRate() {
    try {
      const { data, error } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "gst_rate")
        .single();

      if (error) {
        console.error("Failed to fetch GST rate:", error);
        return;
      }

      if (data) {
        const rate = parseFloat(data.value);
        if (!isNaN(rate)) {
          setGstRate(rate);
        }
      }
    } catch (error) {
      console.error("Error fetching GST rate:", error);
    }
  }

  async function uploadOrderFiles(orderNumber: string): Promise<any[]> {
    const uploadedFiles = [];

    for (const item of items) {
      if (item.uploaded_file) {
        try {
          console.log(`Uploading file for product ${item.product.name}...`);

          // Upload file to Supabase storage in order-files subdirectory
          const result = await uploadImageToSupabase(
            item.uploaded_file,
            `order-files/${orderNumber}`,
            10, // Allow up to 10MB for order files
          );

          if (result.success && result.publicUrl) {
            uploadedFiles.push({
              product_id: item.product_id,
              product_name: item.product.name,
              file_name: item.uploaded_file.name,
              file_size: item.uploaded_file.size,
              file_type: item.uploaded_file.type,
              file_url: result.publicUrl,
              status: "uploaded",
            });
          } else {
            console.error(
              `Failed to upload file for ${item.product.name}:`,
              result.error,
            );
            uploadedFiles.push({
              product_id: item.product_id,
              product_name: item.product.name,
              file_name: item.uploaded_file.name,
              file_size: item.uploaded_file.size,
              file_type: item.uploaded_file.type,
              file_url: null,
              status: "upload-failed",
              error: result.error,
            });
          }
        } catch (error) {
          console.error(
            `Error uploading file for ${item.product.name}:`,
            error,
          );
          uploadedFiles.push({
            product_id: item.product_id,
            product_name: item.product.name,
            file_name: item.uploaded_file.name,
            file_size: item.uploaded_file.size,
            file_type: item.uploaded_file.type,
            file_url: null,
            status: "upload-error",
            error: error.message,
          });
        }
      }
    }

    return uploadedFiles;
  }

  function handleShippingMethodSelect(
    method: AvailableShippingMethod | null,
    cost: number,
  ) {
    setSelectedShippingMethod(method);
    setShippingCost(cost);

    // Clear delivery slot if the new method doesn't require time slots
    if (method && !method.time_slot_required) {
      setForm((prev) => ({ ...prev, deliverySlot: "" }));
    }

    // Clear any shipping-related errors
    if (errors.pincode || errors.shipping) {
      setErrors({ ...errors, pincode: "", shipping: "" });
    }
  }

  async function validateCoupon() {
    if (!couponCode.trim()) return;

    setIsValidatingCoupon(true);
    try {
      const { data: coupon } = await supabase
        .from("coupons")
        .select("*")
        .eq("code", couponCode.toUpperCase())
        .eq("is_active", true)
        .single();

      if (coupon) {
        // Check if coupon is valid
        const now = new Date();
        const expiresAt = coupon.expires_at
          ? new Date(coupon.expires_at)
          : null;

        if (expiresAt && now > expiresAt) {
          setErrors({ coupon: "This coupon has expired" });
          return;
        }

        if (
          coupon.minimum_order_amount &&
          total < coupon.minimum_order_amount
        ) {
          setErrors({
            coupon: `Minimum order amount is ₹${coupon.minimum_order_amount}`,
          });
          return;
        }

        setAppliedCoupon(coupon);
        setErrors({ ...errors, coupon: "" });
      } else {
        setErrors({ coupon: "Invalid coupon code" });
      }
    } catch (error) {
      setErrors({ coupon: "Invalid coupon code" });
    } finally {
      setIsValidatingCoupon(false);
    }
  }

  function calculateDiscount() {
    if (!appliedCoupon) return 0;

    let discount = 0;
    if (appliedCoupon.discount_type === "flat") {
      discount = appliedCoupon.discount_value;
    } else {
      discount = (total * appliedCoupon.discount_value) / 100;
    }

    if (appliedCoupon.maximum_discount_amount) {
      discount = Math.min(discount, appliedCoupon.maximum_discount_amount);
    }

    return discount;
  }

  function calculateTotal() {
    const subtotal = total;
    const shipping = shippingCost;
    const discount = calculateDiscount();
    const tax = Math.round((subtotal - discount) * (gstRate / 100)); // Dynamic GST

    return {
      subtotal,
      shipping,
      discount,
      tax,
      total: subtotal + shipping + tax - discount,
    };
  }

  // Calculate totals for display
  const totals = calculateTotal();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!selectedShippingMethod) {
      setErrors({ shipping: "Please select a shipping method" });
      return;
    }

    if (!form.deliveryDate) {
      setErrors({ deliveryDate: "Please select a delivery date" });
      return;
    }

    if (!selectedPaymentMethod) {
      setErrors({ payment: "Please select a payment method" });
      return;
    }

    if (!form.acceptTerms) {
      setErrors({ terms: "Please accept the Terms & Conditions to continue" });
      return;
    }

    // Clear any previous errors
    setErrors({});

    // Directly proceed to payment since everything is on one page now
    await handleProceedToPayment();
  }

  async function createOrder(): Promise<string> {
    const totals = calculateTotal();

    // Generate sequential order number with FII prefix
    const orderNumber = await generateOrderNumber();

    // Upload files first
    console.log("Uploading order files...");
    const uploadedFiles = await uploadOrderFiles(orderNumber);

    // Create customer record
    const nameParts = form.fullName.trim().split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    const { data: customer, error: customerError } = await supabase
      .from("customers")
      .upsert(
        {
          name: form.fullName, // Add the required name field
          email: form.email,
          first_name: firstName,
          last_name: lastName,
          phone: `${form.phoneCountryCode}${form.phone}`,
          addresses: [
            {
              name: form.receiverName || form.fullName,
              line1: form.addressLine1,
              line2: form.addressLine2 || "",
              city: form.city,
              state: form.state,
              pincode: form.pincode,
              phone: form.receiverPhone
                ? `${form.receiverPhoneCountryCode}${form.receiverPhone}`
                : `${form.phoneCountryCode}${form.phone}`,
              type: "shipping",
            },
          ],
        },
        { onConflict: "email" },
      )
      .select()
      .single();

    if (customerError) throw customerError;

    // Create order
    console.log("Creating order with data:", {
      order_number: orderNumber,
      customer_id: customer.id,
      totals,
      form: form,
      items: items.length,
    });

    const orderData = {
      order_number: orderNumber,
      customer_id: customer.id,
      status: "pending",
      total_amount: totals.total,
      shipping_amount: totals.shipping,
      discount_amount: totals.discount,
      tax_amount: totals.tax,
      items: items.map((item) => {
        const uploadedFileData = uploadedFiles.find(
          (f) => f.product_id === item.product_id,
        );
        return {
          product_id: item.product_id,
          product_name: item.product.name,
          variant_id: item.variant_id,
          variant_name: item.variant?.name,
          quantity: item.quantity,
          unit_price:
            item.variant?.sale_price ||
            item.variant?.price ||
            item.product.sale_price ||
            item.product.price,
          total_price:
            (item.variant?.sale_price ||
              item.variant?.price ||
              item.product.sale_price ||
              item.product.price) * item.quantity,
          uploaded_file_url: uploadedFileData?.file_url || null,
          uploaded_file_name: uploadedFileData?.file_name || null,
          uploaded_file_size: uploadedFileData?.file_size || null,
          uploaded_file_type: uploadedFileData?.file_type || null,
          upload_status: uploadedFileData?.status || null,
        };
      }),
      shipping_address: {
        name: form.receiverName || form.fullName,
        line1: form.addressLine1,
        line2: form.addressLine2 || "",
        city: form.city,
        state: form.state,
        pincode: form.pincode,
        phone: form.receiverPhone
          ? `${form.receiverPhoneCountryCode}${form.receiverPhone}`
          : `${form.phoneCountryCode}${form.phone}`,
        alternate_phone: form.alternatePhone || "",
      },
      billing_address: {
        name: form.fullName,
        line1: form.addressLine1,
        line2: form.addressLine2 || "",
        city: form.city,
        state: form.state,
        pincode: form.pincode,
        phone: `${form.phoneCountryCode}${form.phone}`,
        alternate_phone: form.alternatePhone || "",
      },
      delivery_date: form.deliveryDate || null,
      delivery_slot: form.deliverySlot || null,
      special_instructions: form.specialInstructions || null,
      customer_message: form.orderMessage || null,
      receiver_name: form.receiverName || form.fullName,
      receiver_phone: form.receiverPhone
        ? `${form.receiverPhoneCountryCode}${form.receiverPhone}`
        : `${form.phoneCountryCode}${form.phone}`,
      alternate_phone: form.alternatePhone || "",
      delivery_instructions: form.specialInstructions || null,
      uploaded_files: uploadedFiles,
      payment_method: selectedPaymentMethod?.name || "pending",
      payment_status: "paid", // Set to paid since payment was successful
      coupon_code: appliedCoupon?.code || null,
    };

    console.log("Order data to be inserted:", orderData);

    // Validate critical fields before insertion
    const validationErrors = [];

    if (!orderData.order_number) validationErrors.push("Missing order number");
    if (!orderData.customer_id) validationErrors.push("Missing customer ID");
    if (!orderData.total_amount || orderData.total_amount <= 0)
      validationErrors.push("Invalid total amount");
    if (!orderData.shipping_address?.name)
      validationErrors.push("Missing shipping address name");
    if (!orderData.shipping_address?.line1)
      validationErrors.push("Missing shipping address");
    if (!orderData.shipping_address?.city)
      validationErrors.push("Missing shipping city");
    if (!orderData.shipping_address?.state)
      validationErrors.push("Missing shipping state");
    if (!orderData.shipping_address?.pincode)
      validationErrors.push("Missing shipping pincode");
    if (!orderData.items || orderData.items.length === 0)
      validationErrors.push("No items in order");

    if (validationErrors.length > 0) {
      throw new Error(`Validation failed: ${validationErrors.join(", ")}`);
    }

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert(orderData)
      .select()
      .single();

    console.log("Order creation result:", { order, orderError });

    if (orderError) throw orderError;

    // Update coupon usage if applied
    if (appliedCoupon) {
      await supabase
        .from("coupons")
        .update({ usage_count: appliedCoupon.usage_count + 1 })
        .eq("id", appliedCoupon.id);
    }

    // Track purchase in Google Analytics
    const orderItems = items.map((item) => ({
      item_id: item.product.id,
      item_name: item.product.name,
      category: item.product.category_name,
      quantity: item.quantity,
      price: item.product.price,
    }));
    trackPurchase(orderNumber, totals.total, orderItems);

    // Track purchase in Facebook Pixel
    const fbContentIds = items.map((item) => item.product.id);
    trackFBPurchase(totals.total, "INR", fbContentIds, items.length);

    // Clear cart
    clearCart();

    console.log(
      "✅ createOrder(): Order process completed successfully, returning:",
      orderNumber,
    );
    return orderNumber;
  }

  async function handlePaymentSuccess(paymentIntent: any) {
    console.log("🔄 handlePaymentSuccess(): Creating order with data:", {
      order_number: orderNumber,
      customer_id: customer.id,
      totals,
      form: form,
      items: items.length,
    });

    const orderData = {
      order_number: orderNumber,
      customer_id: customer.id,
      status: "pending",
      total_amount: totals.total,
      shipping_amount: totals.shipping,
      discount_amount: totals.discount,
      tax_amount: totals.tax,
      items: items.map((item) => {
        const uploadedFileData = uploadedFiles.find(
          (f) => f.product_id === item.product_id,
        );

        return {
          product_id: item.product_id,
          product_name: item.product.name,
          variant_id: item.variant_id,
          variant_name: item.variant?.name,
          quantity: item.quantity,
          unit_price:
            item.variant?.sale_price ||
            item.variant?.price ||
            item.product.sale_price ||
            item.product.price,
          total_price:
            (item.variant?.sale_price ||
              item.variant?.price ||
              item.product.sale_price ||
              item.product.price) * item.quantity,
          uploaded_file_url: uploadedFileData?.file_url || null,
          uploaded_file_name: uploadedFileData?.file_name || null,
          uploaded_file_size: uploadedFileData?.file_size || null,
          uploaded_file_type: uploadedFileData?.file_type || null,
          upload_status: uploadedFileData?.status || null,
        };
      }),
      shipping_address: {
        name: form.receiverName || form.fullName,
        line1: form.addressLine1,
        line2: form.addressLine2 || "",
        city: form.city,
        state: form.state,
        pincode: form.pincode,
        phone: form.receiverPhone
          ? `${form.receiverPhoneCountryCode}${form.receiverPhone}`
          : `${form.phoneCountryCode}${form.phone}`,
        alternate_phone: form.alternatePhone || "",
      },
      billing_address: {
        name: form.fullName,
        line1: form.addressLine1,
        line2: form.addressLine2 || "",
        city: form.city,
        state: form.state,
        pincode: form.pincode,
        phone: `${form.phoneCountryCode}${form.phone}`,
        alternate_phone: form.alternatePhone || "",
      },
      delivery_date: form.deliveryDate || null,
      delivery_slot: form.deliverySlot || null,
      special_instructions: form.specialInstructions || null,
      customer_message: form.orderMessage || null,
      receiver_name: form.receiverName || form.fullName,
      receiver_phone: form.receiverPhone
        ? `${form.receiverPhoneCountryCode}${form.receiverPhone}`
        : `${form.phoneCountryCode}${form.phone}`,
      alternate_phone: form.alternatePhone || "",
      delivery_instructions: form.specialInstructions || null,
      uploaded_files: uploadedFiles,
      payment_method: selectedPaymentMethod?.name || "pending",
      payment_status: "paid", // Set to paid since payment was successful
      coupon_code: appliedCoupon?.code || null,
    };

    console.log("Order data to be inserted:", orderData);

    // Validate critical fields before insertion
    const validationErrors = [];

    if (!orderData.order_number) validationErrors.push("Missing order number");
    if (!orderData.customer_id) validationErrors.push("Missing customer ID");
    if (!orderData.total_amount || orderData.total_amount <= 0)
      validationErrors.push("Invalid total amount");
    if (!orderData.shipping_address?.name)
      validationErrors.push("Missing shipping address name");
    if (!orderData.shipping_address?.line1)
      validationErrors.push("Missing shipping address");
    if (!orderData.shipping_address?.city)
      validationErrors.push("Missing shipping city");
    if (!orderData.shipping_address?.state)
      validationErrors.push("Missing shipping state");
    if (!orderData.shipping_address?.pincode)
      validationErrors.push("Missing shipping pincode");
    if (!orderData.items || orderData.items.length === 0)
      validationErrors.push("No items in order");

    if (validationErrors.length > 0) {
      throw new Error(`Validation failed: ${validationErrors.join(", ")}`);
    }

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert(orderData)
      .select()
      .single();

    console.log("Order creation result:", { order, orderError });

    if (orderError) throw orderError;

    // Update coupon usage if applied
    if (appliedCoupon) {
      await supabase
        .from("coupons")
        .update({ usage_count: appliedCoupon.usage_count + 1 })
        .eq("id", appliedCoupon.id);
    }

    // Track purchase in Google Analytics
    const orderItems = items.map((item) => ({
      item_id: item.product.id,
      item_name: item.product.name,
      category: item.product.category_name,
      quantity: item.quantity,
      price: item.product.price,
    }));
    trackPurchase(orderNumber, totals.total, orderItems);

    // Track purchase in Facebook Pixel
    const fbContentIds = items.map((item) => item.product.id);
    trackFBPurchase(totals.total, "INR", fbContentIds, items.length);

    // Clear cart
    clearCart();

    console.log(
      "✅ handlePaymentSuccess(): Order process completed successfully, returning:",
      orderNumber,
    );
    return orderNumber;
  }

  async function handlePaymentMethodSelect(gateway: PaymentGateway) {
    setSelectedPaymentMethod(gateway);
  }

  async function handleProceedToPayment() {
    if (!selectedPaymentMethod) return;

    // Prevent double submission using both state and ref
    if (isSubmitting || submissionRef.current) {
      console.log(
        "Payment submission already in progress, ignoring duplicate call",
      );
      return;
    }

    // Validate required fields
    if (
      !form.fullName ||
      !form.email ||
      !form.phone ||
      !form.addressLine1 ||
      !form.city ||
      !form.state ||
      !form.pincode
    ) {
      setErrors({
        payment:
          "Please complete all required information in step 1 before proceeding to payment",
      });
      setCurrentStep(1); // Go back to form step
      return;
    }

    // Cancel any existing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller for this request
    abortControllerRef.current = new AbortController();

    setIsSubmitting(true);
    submissionRef.current = true;
    setErrors({}); // Clear any existing errors

    try {
      const totals = calculateTotal();
      const paymentAmount = Math.round(totals.total * 100); // Convert to paise

      // Validate payment amount
      if (paymentAmount <= 0) {
        setErrors({
          payment: "Invalid order amount. Please refresh and try again.",
        });
        return;
      }

      // Validate payment method
      if (!selectedPaymentMethod || selectedPaymentMethod.trim() === "") {
        setErrors({
          payment: "Please select a payment method.",
        });
        return;
      }

      // Create payment data inline to ensure freshness
      const paymentData = {
        gateway_id: selectedPaymentMethod,
        amount: paymentAmount,
        currency: "INR",
        customer: {
          name: form.fullName,
          email: form.email,
          phone: `${form.phoneCountryCode}${form.phone}`,
          address: {
            line1: form.addressLine1,
            line2: form.addressLine2,
            city: form.city,
            state: form.state,
            pincode: form.pincode,
            country: "IN",
          },
        },
        return_url: `${window.location.origin}/checkout/success`,
        cancel_url: `${window.location.origin}/checkout/cancel`,
        webhook_url: `${window.location.origin}/api/payments/webhook`,
        metadata: {
          order_number: "", // Order will be created after successful payment
        },
      };

      console.log("Creating payment with complete payload:", paymentData);

      // Check for missing required fields
      const missingFields = [];
      if (!paymentData.gateway_id) missingFields.push("gateway_id");
      if (!paymentData.amount) missingFields.push("amount");
      if (!paymentData.currency) missingFields.push("currency");
      if (!paymentData.customer?.name) missingFields.push("customer.name");
      if (!paymentData.customer?.email) missingFields.push("customer.email");
      if (!paymentData.customer?.phone) missingFields.push("customer.phone");
      if (!paymentData.customer?.address?.line1)
        missingFields.push("customer.address.line1");
      if (!paymentData.customer?.address?.city)
        missingFields.push("customer.address.city");
      if (!paymentData.customer?.address?.state)
        missingFields.push("customer.address.state");
      if (!paymentData.customer?.address?.pincode)
        missingFields.push("customer.address.pincode");

      console.log("Field validation results:", {
        gateway_id: paymentData.gateway_id,
        amount: paymentData.amount,
        customer_name: paymentData.customer?.name,
        customer_email: paymentData.customer?.email,
        customer_phone: paymentData.customer?.phone,
        address_line1: paymentData.customer?.address?.line1,
        address_city: paymentData.customer?.address?.city,
        address_state: paymentData.customer?.address?.state,
        address_pincode: paymentData.customer?.address?.pincode,
        missingFields: missingFields,
      });

      if (missingFields.length > 0) {
        console.error("Client-side missing required fields:", missingFields);
        setErrors({
          payment: `Missing required fields: ${missingFields.join(", ")}`,
        });
        return;
      }

      // Create order before payment with "Payment Pending" status
      console.log("🔄 Creating order before payment...");
      let createdOrderNumber;
      try {
        createdOrderNumber = await createOrderBeforePayment();
        console.log("✅ Order created before payment:", createdOrderNumber);
      } catch (orderError) {
        console.error("❌ Failed to create order before payment:", orderError);
        setErrors({ payment: "Failed to create order. Please try again." });
        setIsSubmitting(false);
        submissionRef.current = false;
        return;
      }

      // Try to create payment request, but proceed with direct payment if API fails
      let responseData;
      try {
        responseData = await createPaymentRequest(
          paymentData,
          abortControllerRef.current,
        );
      } catch (apiError) {
        console.warn(
          "Payment API unavailable, proceeding with direct payment:",
          apiError,
        );
        // Generate a fallback payment intent ID and order ID
        const fallbackPaymentIntentId = `pi_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
        const fallbackOrderId = `order_${Date.now()}`;

        const paymentUrl = `/razorpay-payment?order_id=${fallbackOrderId}&payment_intent=${fallbackPaymentIntentId}&amount=${paymentAmount}&customer_name=${encodeURIComponent(form.fullName)}&customer_email=${encodeURIComponent(form.email)}&customer_phone=${encodeURIComponent(`${form.phoneCountryCode}${form.phone}`)}`;

        // Save order ID for status update after payment
        console.log("💾 Saving order ID for status update after payment");
        localStorage.setItem("pendingOrderNumber", createdOrderNumber);

        console.log("Redirecting to direct payment page:", paymentUrl);
        navigate(paymentUrl);
        return;
      }

      // Enhanced response validation
      if (!responseData) {
        // Fallback to direct payment
        const fallbackPaymentIntentId = `pi_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
        const fallbackOrderId = `order_${Date.now()}`;

        const paymentUrl = `/razorpay-payment?order_id=${fallbackOrderId}&payment_intent=${fallbackPaymentIntentId}&amount=${paymentAmount}&customer_name=${encodeURIComponent(form.fullName)}&customer_email=${encodeURIComponent(form.email)}&customer_phone=${encodeURIComponent(`${form.phoneCountryCode}${form.phone}`)}`;

        // Save order ID for status update after payment
        console.log("💾 Saving order ID for status update after payment");
        localStorage.setItem("pendingOrderNumber", createdOrderNumber);

        console.log("No API response, using direct payment:", paymentUrl);
        navigate(paymentUrl);
        return;
      }

      if (responseData.success) {
        // Validate required fields in successful response
        const paymentIntentId =
          responseData.payment_intent_id ||
          `pi_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
        const orderId = responseData.order_id || `order_${Date.now()}`;

        setPaymentIntentId(paymentIntentId);

        // Save form data to localStorage for order creation after payment
        console.log("💾 Saving form data to localStorage for order creation");
        localStorage.setItem("checkoutFormData", JSON.stringify(form));
        localStorage.setItem("uploadedFiles", JSON.stringify(uploadedFiles));

        // Redirect to local payment page with order data
        const paymentUrl = `/razorpay-payment?order_id=${orderId}&payment_intent=${paymentIntentId}&amount=${paymentAmount}&customer_name=${encodeURIComponent(form.fullName)}&customer_email=${encodeURIComponent(form.email)}&customer_phone=${encodeURIComponent(`${form.phoneCountryCode}${form.phone}`)}`;

        console.log("Redirecting to local payment page:", paymentUrl);
        navigate(paymentUrl);
        return;
      } else {
        // Handle specific error cases
        const errorMessage = responseData.error || "Failed to create payment";
        console.error("Payment creation failed:", errorMessage);

        if (
          responseData.missing_fields &&
          responseData.missing_fields.length > 0
        ) {
          setErrors({
            payment: `Missing required information: ${responseData.missing_fields.join(", ")}`,
          });
        } else {
          setErrors({
            payment: errorMessage,
          });
        }
      }
    } catch (error: any) {
      console.error("Error creating payment:", error);

      // Don't show errors for cancelled requests
      if (error.message === "CANCELLED") {
        console.log("Payment creation was cancelled, not showing error");
        return;
      }

      // Categorize errors for better user experience
      let errorMessage = "Failed to initialize payment. Please try again.";

      if (
        error.message.includes("Network error") ||
        error.message.includes("connection")
      ) {
        errorMessage =
          "Network connection issue. Please check your internet and try again.";
      } else if (error.message.includes("timeout")) {
        errorMessage = "Request timed out. Please try again.";
      } else if (error.message.includes("Invalid payment gateway URL")) {
        errorMessage =
          "Payment gateway configuration error. Please contact support.";
      } else if (error.message.includes("Payment intent ID missing")) {
        errorMessage =
          "Payment service error. Please try again or contact support.";
      } else if (error.message.includes("HTTP error! status: 400")) {
        errorMessage =
          "Invalid payment information. Please check your details and try again.";
      } else if (error.message.includes("HTTP error! status: 500")) {
        errorMessage =
          "Payment service temporarily unavailable. Please try again in a moment.";
      } else if (error.message.includes("Amount must be between")) {
        errorMessage = error.message; // Use the specific amount error
      } else if (error.message.includes("Payment gateway not available")) {
        errorMessage =
          "Selected payment method is currently unavailable. Please try a different method.";
      }

      setErrors({ payment: errorMessage });
    } finally {
      setIsSubmitting(false);
      submissionRef.current = false;
      abortControllerRef.current = null;
    }
  }

  async function handlePaymentSuccess(paymentIntent: any) {
    try {
      // Create order after successful payment
      console.log("🔄 Checkout Success Flow: Creating order via createOrder()");
      const orderNumber = await createOrder();

      // Track purchase analytics
      const orderItems = items.map((item) => ({
        item_id: item.product.id,
        item_name: item.product.name,
        category: item.product.category_name,
        quantity: item.quantity,
        price: item.product.price,
      }));
      trackPurchase(orderNumber, calculateTotal().total, orderItems);

      // Track Facebook Pixel
      const fbContentIds = items.map((item) => item.product.id);
      trackFBPurchase(
        calculateTotal().total,
        "INR",
        fbContentIds,
        items.length,
      );

      // Redirect to order confirmation page
      navigate(`/order-confirmation/${orderNumber}`);
    } catch (error) {
      console.error("Error creating order after payment:", error);
      setErrors({
        payment:
          "Payment successful but order creation failed. Please contact support.",
      });
    }
  }

  function handlePaymentFailure(error: string) {
    setErrors({ payment: error });
    setCurrentStep(2); // Go back to payment selection
  }

  function handlePaymentCancel() {
    setCurrentStep(2); // Go back to payment selection
    setPaymentIntentId(null);
  }

  if (items.length === 0) {
    return null;
  }

  // No step 3 needed - we redirect immediately to payment gateway

  return (
    <div className="bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50">
      <div className="container py-8 min-h-screen">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Secure Checkout
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Complete your order details below for fast and secure delivery
            </p>

            {/* Progress Indicator */}
            <div className="flex items-center justify-center mt-8 max-w-md mx-auto">
              <div className="flex items-center">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    currentStep >= 1
                      ? "bg-blue-600 text-white"
                      : "bg-gray-300 text-gray-600"
                  }`}
                >
                  1
                </div>
                <span
                  className={`ml-2 text-sm font-medium ${
                    currentStep >= 1 ? "text-blue-600" : "text-gray-500"
                  }`}
                >
                  Complete Order
                </span>
              </div>

              <div
                className={`flex-1 h-0.5 mx-4 ${
                  currentStep >= 2 ? "bg-blue-600" : "bg-gray-300"
                }`}
              ></div>

              <div className="flex items-center">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    currentStep >= 2
                      ? "bg-blue-600 text-white"
                      : "bg-gray-300 text-gray-600"
                  }`}
                >
                  2
                </div>
                <span
                  className={`ml-2 text-sm font-medium ${
                    currentStep >= 2 ? "text-blue-600" : "text-gray-500"
                  }`}
                >
                  Processing
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-8">
              {/* Step 1: Order Form */}
              {currentStep === 1 && (
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* 1. Customer Information */}
                  <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                    <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
                      <CardTitle className="flex items-center gap-3 text-xl">
                        <div className="bg-white/20 rounded-lg p-2">
                          <User className="w-6 h-6" />
                        </div>
                        Customer Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                      <div>
                        <Label
                          htmlFor="fullName"
                          className="text-sm font-semibold text-gray-700 mb-2 block"
                        >
                          Full Name *
                        </Label>
                        <Input
                          id="fullName"
                          placeholder="John Doe"
                          value={form.fullName}
                          onChange={(e) =>
                            setForm({ ...form, fullName: e.target.value })
                          }
                          className="py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500"
                          required
                        />
                      </div>

                      <div>
                        <Label
                          htmlFor="email"
                          className="text-sm font-semibold text-gray-700 mb-2 block"
                        >
                          Email Address *
                        </Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <Input
                            id="email"
                            type="email"
                            placeholder="john@example.com"
                            value={form.email}
                            onChange={(e) =>
                              setForm({ ...form, email: e.target.value })
                            }
                            className="pl-11 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <Label
                          htmlFor="phone"
                          className="text-sm font-semibold text-gray-700 mb-2 block"
                        >
                          Phone Number *
                        </Label>
                        <div className="flex gap-3">
                          <Select
                            value={form.phoneCountryCode}
                            onValueChange={(value) =>
                              setForm({ ...form, phoneCountryCode: value })
                            }
                          >
                            <SelectTrigger className="w-24 py-3 border-2 border-gray-200 rounded-xl">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="+91">+91</SelectItem>
                              <SelectItem value="+1">+1</SelectItem>
                              <SelectItem value="+44">+44</SelectItem>
                              <SelectItem value="+971">+971</SelectItem>
                              <SelectItem value="+65">+65</SelectItem>
                            </SelectContent>
                          </Select>
                          <div className="relative flex-1">
                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <Input
                              id="phone"
                              type="tel"
                              placeholder="9876543210"
                              value={form.phone}
                              onChange={(e) =>
                                setForm({ ...form, phone: e.target.value })
                              }
                              className="pl-11 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500"
                              required
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* 2. Delivery Address */}
                  <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                    <CardHeader className="bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-t-lg">
                      <CardTitle className="flex items-center gap-3 text-xl">
                        <div className="bg-white/20 rounded-lg p-2">
                          <MapPin className="w-6 h-6" />
                        </div>
                        Delivery Address
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                      <div>
                        <Label
                          htmlFor="receiverName"
                          className="text-sm font-semibold text-gray-700 mb-2 block"
                        >
                          Receiver's Name *
                        </Label>
                        <Input
                          id="receiverName"
                          placeholder="Name of person receiving the order"
                          value={form.receiverName}
                          onChange={(e) =>
                            setForm({ ...form, receiverName: e.target.value })
                          }
                          className="py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-green-500"
                          required
                        />
                      </div>

                      <div>
                        <Label
                          htmlFor="addressLine1"
                          className="text-sm font-semibold text-gray-700 mb-2 block"
                        >
                          Address Line 1 *
                        </Label>
                        <Input
                          id="addressLine1"
                          placeholder="House/Flat No., Building Name"
                          value={form.addressLine1}
                          onChange={(e) =>
                            setForm({ ...form, addressLine1: e.target.value })
                          }
                          className="py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-green-500"
                          required
                        />
                      </div>

                      <div>
                        <Label
                          htmlFor="addressLine2"
                          className="text-sm font-semibold text-gray-700 mb-2 block"
                        >
                          Address Line 2 (Optional)
                        </Label>
                        <Input
                          id="addressLine2"
                          placeholder="Street Name, Area, Landmark"
                          value={form.addressLine2}
                          onChange={(e) =>
                            setForm({ ...form, addressLine2: e.target.value })
                          }
                          className="py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-green-500"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label
                            htmlFor="city"
                            className="text-sm font-semibold text-gray-700 mb-2 block"
                          >
                            City *
                          </Label>
                          <Input
                            id="city"
                            placeholder="Mumbai"
                            value={form.city}
                            onChange={(e) =>
                              setForm({ ...form, city: e.target.value })
                            }
                            className="py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-green-500"
                            required
                          />
                        </div>
                        <div>
                          <Label
                            htmlFor="state"
                            className="text-sm font-semibold text-gray-700 mb-2 block"
                          >
                            State *
                          </Label>
                          <Input
                            id="state"
                            placeholder="Maharashtra"
                            value={form.state}
                            onChange={(e) =>
                              setForm({ ...form, state: e.target.value })
                            }
                            className="py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-green-500"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <Label
                          htmlFor="pincode"
                          className="text-sm font-semibold text-gray-700 mb-2 block"
                        >
                          Pincode *
                        </Label>
                        <Input
                          id="pincode"
                          placeholder="400001"
                          value={form.pincode}
                          onChange={(e) =>
                            setForm({ ...form, pincode: e.target.value })
                          }
                          maxLength={6}
                          className="py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-green-500"
                          required
                        />
                        {errors.pincode && (
                          <p className="text-red-600 text-sm mt-2 bg-red-50 p-2 rounded">
                            {errors.pincode}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label
                          htmlFor="receiverPhone"
                          className="text-sm font-semibold text-gray-700 mb-2 block"
                        >
                          Receiver's Phone Number *
                        </Label>
                        <div className="flex gap-3">
                          <Select
                            value={form.receiverPhoneCountryCode}
                            onValueChange={(value) =>
                              setForm({
                                ...form,
                                receiverPhoneCountryCode: value,
                              })
                            }
                          >
                            <SelectTrigger className="w-24 py-3 border-2 border-gray-200 rounded-xl">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="+91">+91</SelectItem>
                              <SelectItem value="+1">+1</SelectItem>
                              <SelectItem value="+44">+44</SelectItem>
                              <SelectItem value="+971">+971</SelectItem>
                              <SelectItem value="+65">+65</SelectItem>
                            </SelectContent>
                          </Select>
                          <div className="relative flex-1">
                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <Input
                              id="receiverPhone"
                              type="tel"
                              placeholder="9876543210"
                              value={form.receiverPhone}
                              onChange={(e) =>
                                setForm({
                                  ...form,
                                  receiverPhone: e.target.value,
                                })
                              }
                              className="pl-11 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-green-500"
                              required
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <Label
                          htmlFor="alternatePhone"
                          className="text-sm font-semibold text-gray-700 mb-2 block"
                        >
                          Alternate Phone No.
                        </Label>
                        <Input
                          id="alternatePhone"
                          type="tel"
                          placeholder="9876543210"
                          value={form.alternatePhone}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              alternatePhone: e.target.value,
                            })
                          }
                          className="py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-green-500"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* 3. Message with Order */}
                  <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                    <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-t-lg">
                      <CardTitle className="flex items-center gap-3 text-xl">
                        <div className="bg-white/20 rounded-lg p-2">
                          <MessageSquare className="w-6 h-6" />
                        </div>
                        Message with Order
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div>
                        <Label
                          htmlFor="orderMessage"
                          className="text-sm font-semibold text-gray-700 mb-2 block"
                        >
                          Special Message (Optional)
                        </Label>
                        <Textarea
                          id="orderMessage"
                          placeholder="Add a personal message, special instructions, or occasion details..."
                          value={form.orderMessage}
                          onChange={(e) =>
                            setForm({ ...form, orderMessage: e.target.value })
                          }
                          rows={4}
                          className="text-lg border-2 border-gray-200 rounded-xl focus:border-purple-500 resize-none"
                        />
                        <p className="text-sm text-gray-500 mt-2">
                          This message will be included with your order for
                          special occasions or delivery instructions.
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* 4. Shipping Methods */}
                  <ShippingMethodCard
                    pincode={form.pincode}
                    orderValue={total}
                    selectedMethodId={selectedShippingMethod?.config_id || null}
                    onMethodSelect={handleShippingMethodSelect}
                  />

                  {/* 5. Delivery Schedule */}
                  {selectedShippingMethod && (
                    <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                      <CardHeader className="bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-t-lg">
                        <CardTitle className="flex items-center gap-3 text-xl">
                          <div className="bg-white/20 rounded-lg p-2">
                            <Truck className="w-6 h-6" />
                          </div>
                          Delivery Schedule
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-6 space-y-6">
                        <div
                          className={`grid gap-4 ${selectedShippingMethod?.time_slot_required ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"}`}
                        >
                          <div>
                            <Label
                              htmlFor="deliveryDate"
                              className="text-sm font-semibold text-gray-700 mb-2 block"
                            >
                              Delivery Date *
                            </Label>
                            <Input
                              id="deliveryDate"
                              type="date"
                              value={form.deliveryDate}
                              onChange={(e) => {
                                setForm({
                                  ...form,
                                  deliveryDate: e.target.value,
                                });
                                // Clear delivery date error when user selects a date
                                if (errors.deliveryDate) {
                                  setErrors({ ...errors, deliveryDate: "" });
                                }
                              }}
                              min={new Date().toISOString().split("T")[0]}
                              className="py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-orange-500"
                              required
                            />
                            {errors.deliveryDate && (
                              <p className="text-red-500 text-sm mt-1">
                                {errors.deliveryDate}
                              </p>
                            )}
                          </div>
                          {selectedShippingMethod?.time_slot_required && (
                            <div>
                              <Label
                                htmlFor="deliverySlot"
                                className="text-sm font-semibold text-gray-700 mb-2 block"
                              >
                                Time Slot *
                              </Label>
                              <Select
                                value={form.deliverySlot}
                                onValueChange={(value) =>
                                  setForm({ ...form, deliverySlot: value })
                                }
                              >
                                <SelectTrigger className="py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-orange-500">
                                  <SelectValue placeholder="Select time slot" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="9am-12pm">
                                    9:00 AM - 12:00 PM
                                  </SelectItem>
                                  <SelectItem value="12pm-3pm">
                                    12:00 PM - 3:00 PM
                                  </SelectItem>
                                  <SelectItem value="3pm-6pm">
                                    3:00 PM - 6:00 PM
                                  </SelectItem>
                                  <SelectItem value="6pm-9pm">
                                    6:00 PM - 9:00 PM
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          )}
                        </div>

                        <div>
                          <Label
                            htmlFor="specialInstructions"
                            className="text-sm font-semibold text-gray-700 mb-2 block"
                          >
                            Special Delivery Instructions
                          </Label>
                          <Textarea
                            id="specialInstructions"
                            placeholder="Any special delivery instructions (e.g., ring doorbell, leave with security)..."
                            value={form.specialInstructions}
                            onChange={(e) =>
                              setForm({
                                ...form,
                                specialInstructions: e.target.value,
                              })
                            }
                            rows={3}
                            className="text-lg border-2 border-gray-200 rounded-xl focus:border-orange-500 resize-none"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* 6. Payment Method Selection */}
                  <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                    <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-t-lg">
                      <CardTitle className="flex items-center gap-3 text-xl">
                        <div className="bg-white/20 rounded-lg p-2">
                          <CreditCard className="w-6 h-6" />
                        </div>
                        Payment Method
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <PaymentMethodSelector
                        amount={Math.round(calculateTotal().total * 100)}
                        currency="INR"
                        selectedMethod={selectedPaymentMethod}
                        onMethodSelect={handlePaymentMethodSelect}
                        onProceed={() => {}} // Will be handled by form submit
                        isLoading={isSubmitting}
                        hideSubmitButton={true} // Hide the selector's submit button since we have form submit
                      />
                      {errors.payment && (
                        <Alert variant="destructive" className="mt-4">
                          <AlertDescription>{errors.payment}</AlertDescription>
                        </Alert>
                      )}
                    </CardContent>
                  </Card>

                  {/* 7. Terms & Conditions */}
                  <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                    <CardHeader className="bg-gradient-to-r from-gray-600 to-slate-700 text-white rounded-t-lg">
                      <CardTitle className="flex items-center gap-3 text-xl">
                        <div className="bg-white/20 rounded-lg p-2">
                          <FileText className="w-6 h-6" />
                        </div>
                        Terms & Conditions
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-3">
                        <Checkbox
                          id="acceptTerms"
                          checked={form.acceptTerms}
                          onCheckedChange={(checked) =>
                            setForm({ ...form, acceptTerms: !!checked })
                          }
                          className="mt-1 w-5 h-5"
                          required
                        />
                        <div className="flex-1">
                          <Label
                            htmlFor="acceptTerms"
                            className="text-sm text-gray-700 cursor-pointer leading-relaxed"
                          >
                            I accept the{" "}
                            <a
                              href="/terms"
                              target="_blank"
                              className="text-blue-600 hover:text-blue-800 underline font-medium"
                            >
                              Terms & Conditions
                            </a>{" "}
                            and{" "}
                            <a
                              href="/privacy-policy"
                              target="_blank"
                              className="text-blue-600 hover:text-blue-800 underline font-medium"
                            >
                              Privacy Policy
                            </a>
                          </Label>
                          {errors.terms && (
                            <p className="text-red-600 text-sm mt-2 bg-red-50 p-2 rounded">
                              {errors.terms}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </form>
              )}
            </div>

            {/* Order Summary Sidebar */}
            <div className="space-y-6 sticky top-32 self-start">
              {/* Coupon */}
              <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Percent className="w-5 h-5" />
                    Coupon Code
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter coupon code"
                      value={couponCode}
                      onChange={(e) =>
                        setCouponCode(e.target.value.toUpperCase())
                      }
                      className="border-2 border-gray-200 rounded-xl"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={validateCoupon}
                      disabled={isValidatingCoupon || !couponCode.trim()}
                      className="border-2 border-gray-200 rounded-xl"
                    >
                      {isValidatingCoupon ? "..." : "Apply"}
                    </Button>
                  </div>
                  {errors.coupon && (
                    <p className="text-red-600 text-sm mt-2">{errors.coupon}</p>
                  )}
                  {appliedCoupon && (
                    <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded">
                      <p className="text-green-800 text-sm">
                        �� Coupon "{appliedCoupon.code}" applied!
                        {appliedCoupon.discount_type === "flat"
                          ? ` ₹${appliedCoupon.discount_value} off`
                          : ` ${appliedCoupon.discount_value}% off`}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Order Summary */}
              <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Items */}
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div
                        key={`${item.product_id}-${item.variant_id}`}
                        className="flex justify-between"
                      >
                        <div className="flex-1">
                          <p className="font-medium">{item.product.name}</p>
                          {item.variant && (
                            <p className="text-sm text-muted-foreground">
                              {item.variant.name}
                            </p>
                          )}
                          <p className="text-sm text-muted-foreground">
                            Qty: {item.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            ₹
                            {(
                              (item.variant?.sale_price ||
                                item.variant?.price ||
                                item.product.sale_price ||
                                item.product.price) * item.quantity
                            ).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <hr />

                  {/* Totals */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>₹{totals.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping:</span>
                      <span>₹{totals.shipping.toFixed(2)}</span>
                    </div>
                    {totals.discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount:</span>
                        <span>-��{totals.discount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Tax ({gstRate}% GST):</span>
                      <span>₹{totals.tax.toFixed(2)}</span>
                    </div>
                    <hr />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total:</span>
                      <span>₹{totals.total.toFixed(2)}</span>
                    </div>
                  </div>

                  {currentStep === 1 && (
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full py-4 text-sm sm:text-lg font-bold bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
                      onClick={handleSubmit}
                      disabled={
                        isSubmitting ||
                        !selectedShippingMethod ||
                        !selectedPaymentMethod ||
                        !form.acceptTerms
                      }
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                          <span className="truncate">Processing Order...</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-2 min-w-0">
                          <Shield className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                          <span className="truncate">Proceed to Payment</span>
                        </div>
                      )}
                    </Button>
                  )}

                  {errors.submit && (
                    <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
                      <p className="text-red-700 font-medium">
                        {errors.submit}
                      </p>
                    </div>
                  )}
                  {errors.terms && (
                    <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
                      <p className="text-red-700 font-medium">{errors.terms}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
