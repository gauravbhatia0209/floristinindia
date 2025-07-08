import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CreditCard, MapPin, Package, User, Percent } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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

interface CheckoutForm {
  // Customer Info
  firstName: string;
  lastName: string;
  email: string;
  phone: string;

  // Shipping Address
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;

  // Delivery
  deliveryDate: string;
  deliverySlot: string;
  specialInstructions: string;

  // Payment
  paymentMethod: string;
}

export default function Checkout() {
  const navigate = useNavigate();
  const { items, total, clearCart } = useCart();
  const [form, setForm] = useState<CheckoutForm>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
    deliveryDate: "",
    deliverySlot: "",
    specialInstructions: "",
    paymentMethod: "",
  });

  const [availableShippingMethods, setAvailableShippingMethods] = useState<
    ShippingMethod[]
  >([]);
  const [selectedShippingMethod, setSelectedShippingMethod] =
    useState<ShippingMethod | null>(null);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (items.length === 0) {
      navigate("/cart");
    }
  }, [items, navigate]);

  useEffect(() => {
    if (form.pincode.length === 6) {
      checkShippingAvailability();
    }
  }, [form.pincode]);

  async function checkShippingAvailability() {
    try {
      const { data: zones } = await supabase
        .from("shipping_zones")
        .select("*, shipping_methods(*)")
        .contains("pincodes", [form.pincode])
        .eq("is_active", true);

      if (zones && zones.length > 0) {
        const methods =
          zones[0].shipping_methods?.filter(
            (method: any) => method.is_active,
          ) || [];
        setAvailableShippingMethods(methods);
        if (methods.length > 0) {
          setSelectedShippingMethod(methods[0]);
        }
      } else {
        setAvailableShippingMethods([]);
        setSelectedShippingMethod(null);
        setErrors({ pincode: "Delivery not available to this pincode" });
      }
    } catch (error) {
      console.error("Failed to check shipping:", error);
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
    const shipping = selectedShippingMethod?.price || 0;
    const discount = calculateDiscount();
    const tax = Math.round((subtotal - discount) * 0.18); // 18% GST

    return {
      subtotal,
      shipping,
      discount,
      tax,
      total: subtotal + shipping + tax - discount,
    };
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!selectedShippingMethod) {
      setErrors({ shipping: "Please select a shipping method" });
      return;
    }

    setIsSubmitting(true);
    try {
      const totals = calculateTotal();

      // Generate order number
      const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      // Create customer record
      const { data: customer, error: customerError } = await supabase
        .from("customers")
        .upsert(
          {
            email: form.email,
            first_name: form.firstName,
            last_name: form.lastName,
            phone: form.phone,
            addresses: [
              {
                line1: form.addressLine1,
                line2: form.addressLine2,
                city: form.city,
                state: form.state,
                pincode: form.pincode,
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
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          order_number: orderNumber,
          customer_id: customer.id,
          status: "pending",
          total_amount: totals.total,
          shipping_amount: totals.shipping,
          discount_amount: totals.discount,
          tax_amount: totals.tax,
          items: items.map((item) => ({
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
            uploaded_file_url: item.uploaded_file ? "pending-upload" : null,
          })),
          shipping_address: {
            line1: form.addressLine1,
            line2: form.addressLine2,
            city: form.city,
            state: form.state,
            pincode: form.pincode,
          },
          billing_address: {
            line1: form.addressLine1,
            line2: form.addressLine2,
            city: form.city,
            state: form.state,
            pincode: form.pincode,
          },
          delivery_date: form.deliveryDate || null,
          delivery_slot: form.deliverySlot || null,
          special_instructions: form.specialInstructions || null,
          payment_method: form.paymentMethod,
          payment_status: "pending",
          coupon_code: appliedCoupon?.code || null,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Update coupon usage if applied
      if (appliedCoupon) {
        await supabase
          .from("coupons")
          .update({ usage_count: appliedCoupon.usage_count + 1 })
          .eq("id", appliedCoupon.id);
      }

      // Clear cart
      clearCart();

      // Redirect to order confirmation
      navigate(`/order-confirmation/${order.id}`);
    } catch (error) {
      console.error("Failed to create order:", error);
      setErrors({ submit: "Failed to create order. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  }

  const totals = calculateTotal();

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="container py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Customer Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Customer Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        value={form.firstName}
                        onChange={(e) =>
                          setForm({ ...form, firstName: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        value={form.lastName}
                        onChange={(e) =>
                          setForm({ ...form, lastName: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={form.phone}
                      onChange={(e) =>
                        setForm({ ...form, phone: e.target.value })
                      }
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Address */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Delivery Address
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="addressLine1">Address Line 1 *</Label>
                    <Input
                      id="addressLine1"
                      value={form.addressLine1}
                      onChange={(e) =>
                        setForm({ ...form, addressLine1: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="addressLine2">Address Line 2</Label>
                    <Input
                      id="addressLine2"
                      value={form.addressLine2}
                      onChange={(e) =>
                        setForm({ ...form, addressLine2: e.target.value })
                      }
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={form.city}
                        onChange={(e) =>
                          setForm({ ...form, city: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State *</Label>
                      <Input
                        id="state"
                        value={form.state}
                        onChange={(e) =>
                          setForm({ ...form, state: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="pincode">Pincode *</Label>
                    <Input
                      id="pincode"
                      value={form.pincode}
                      onChange={(e) =>
                        setForm({ ...form, pincode: e.target.value })
                      }
                      maxLength={6}
                      required
                    />
                    {errors.pincode && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.pincode}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Method */}
              {availableShippingMethods.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="w-5 h-5" />
                      Delivery Options
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      {availableShippingMethods.map((method) => (
                        <div
                          key={method.id}
                          className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                            selectedShippingMethod?.id === method.id
                              ? "border-primary bg-primary/5"
                              : "border-gray-200 hover:border-primary"
                          }`}
                          onClick={() => setSelectedShippingMethod(method)}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold">{method.name}</h4>
                              <p className="text-sm text-muted-foreground">
                                {method.description}
                              </p>
                              <p className="text-sm font-medium text-primary">
                                {method.delivery_time}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold">₹{method.price}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="deliveryDate">Preferred Date</Label>
                        <Input
                          id="deliveryDate"
                          type="date"
                          value={form.deliveryDate}
                          onChange={(e) =>
                            setForm({ ...form, deliveryDate: e.target.value })
                          }
                          min={new Date().toISOString().split("T")[0]}
                        />
                      </div>
                      <div>
                        <Label htmlFor="deliverySlot">Time Slot</Label>
                        <Select
                          value={form.deliverySlot}
                          onValueChange={(value) =>
                            setForm({ ...form, deliverySlot: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select time" />
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
                    </div>

                    <div>
                      <Label htmlFor="specialInstructions">
                        Special Instructions
                      </Label>
                      <Textarea
                        id="specialInstructions"
                        placeholder="Any special delivery instructions..."
                        value={form.specialInstructions}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            specialInstructions: e.target.value,
                          })
                        }
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Payment Method
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Select
                    value={form.paymentMethod}
                    onValueChange={(value) =>
                      setForm({ ...form, paymentMethod: value })
                    }
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="razorpay">
                        Credit/Debit Card
                      </SelectItem>
                      <SelectItem value="upi">UPI</SelectItem>
                      <SelectItem value="netbanking">Net Banking</SelectItem>
                      <SelectItem value="cod">Cash on Delivery</SelectItem>
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>
            </form>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            {/* Coupon */}
            <Card>
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
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={validateCoupon}
                    disabled={isValidatingCoupon || !couponCode.trim()}
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
                      ✓ Coupon "{appliedCoupon.code}" applied!
                      {appliedCoupon.discount_type === "flat"
                        ? ` ₹${appliedCoupon.discount_value} off`
                        : ` ${appliedCoupon.discount_value}% off`}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Order Summary */}
            <Card>
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
                      <span>-₹{totals.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Tax (18% GST):</span>
                    <span>₹{totals.tax.toFixed(2)}</span>
                  </div>
                  <hr />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span>₹{totals.total.toFixed(2)}</span>
                  </div>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  onClick={handleSubmit}
                  disabled={
                    isSubmitting ||
                    !selectedShippingMethod ||
                    !form.paymentMethod
                  }
                >
                  {isSubmitting
                    ? "Processing..."
                    : `Pay ₹${totals.total.toFixed(2)}`}
                </Button>

                {errors.submit && (
                  <p className="text-red-600 text-sm">{errors.submit}</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
