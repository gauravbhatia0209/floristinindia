import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/useCart";
import { supabase } from "@/lib/supabase";
import { Product, ProductVariant } from "@shared/database.types";

interface CartItemWithDetails {
  product_id: string;
  variant_id?: string;
  quantity: number;
  product: Product;
  variant?: ProductVariant;
}

export default function Cart() {
  const { items, updateQuantity, removeItem, clearCart, total } = useCart();
  const [cartItemsWithDetails, setCartItemsWithDetails] = useState<
    CartItemWithDetails[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [shippingCost, setShippingCost] = useState(0);

  useEffect(() => {
    fetchCartDetails();
  }, [items]);

  async function fetchCartDetails() {
    if (items.length === 0) {
      setCartItemsWithDetails([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);

      // Fetch product details for all cart items
      const productIds = items.map((item) => item.product_id);
      const { data: products } = await supabase
        .from("products")
        .select("*")
        .in("id", productIds)
        .eq("is_active", true);

      // Fetch variant details if any items have variants
      const variantIds = items
        .filter((item) => item.variant_id)
        .map((item) => item.variant_id!);

      let variants: ProductVariant[] = [];
      if (variantIds.length > 0) {
        const { data: variantData } = await supabase
          .from("product_variants")
          .select("*")
          .in("id", variantIds)
          .eq("is_active", true);

        variants = variantData || [];
      }

      // Combine cart items with product and variant details
      const cartDetails: CartItemWithDetails[] = items
        .map((item) => {
          const product = products?.find((p) => p.id === item.product_id);
          const variant = item.variant_id
            ? variants.find((v) => v.id === item.variant_id)
            : undefined;

          return product
            ? {
                product_id: item.product_id,
                variant_id: item.variant_id,
                quantity: item.quantity,
                product,
                variant,
              }
            : null;
        })
        .filter(Boolean) as CartItemWithDetails[];

      setCartItemsWithDetails(cartDetails);

      // Calculate shipping cost based on total
      calculateShipping(cartDetails);
    } catch (error) {
      console.error("Failed to fetch cart details:", error);
    } finally {
      setIsLoading(false);
    }
  }

  function calculateShipping(cartItems: CartItemWithDetails[]) {
    const subtotal = cartItems.reduce((sum, item) => {
      const price =
        item.variant?.price || item.product.sale_price || item.product.price;
      return sum + price * item.quantity;
    }, 0);

    // Shipping will be calculated at checkout based on location and method
    setShippingCost(0);
  }

  async function applyCoupon() {
    if (!couponCode.trim()) return;

    try {
      const { data: coupon } = await supabase
        .from("coupons")
        .select("*")
        .eq("code", couponCode.toUpperCase())
        .eq("is_active", true)
        .single();

      if (!coupon) {
        alert("Invalid coupon code");
        return;
      }

      // Check if coupon is valid (not expired)
      const now = new Date();
      if (coupon.expires_at && new Date(coupon.expires_at) < now) {
        alert("Coupon has expired");
        return;
      }

      if (coupon.starts_at && new Date(coupon.starts_at) > now) {
        alert("Coupon is not yet active");
        return;
      }

      // Check minimum order amount
      if (coupon.minimum_order_amount && total < coupon.minimum_order_amount) {
        alert(
          `Minimum order amount of ₹${coupon.minimum_order_amount} required`,
        );
        return;
      }

      // Calculate discount
      let discountAmount = 0;
      if (coupon.discount_type === "percentage") {
        discountAmount = (total * coupon.discount_value) / 100;
        if (
          coupon.maximum_discount_amount &&
          discountAmount > coupon.maximum_discount_amount
        ) {
          discountAmount = coupon.maximum_discount_amount;
        }
      } else {
        discountAmount = coupon.discount_value;
      }

      setDiscount(discountAmount);
      alert("Coupon applied successfully!");
    } catch (error) {
      console.error("Failed to apply coupon:", error);
      alert("Failed to apply coupon");
    }
  }

  function getItemPrice(item: CartItemWithDetails) {
    // Check for variant-specific pricing first
    if (item.variant) {
      // Use sale price override if available and less than regular price
      if (
        item.variant.sale_price_override !== null &&
        item.variant.sale_price_override !== undefined &&
        item.variant.price_override !== null &&
        item.variant.price_override !== undefined &&
        item.variant.sale_price_override < item.variant.price_override
      ) {
        return item.variant.sale_price_override;
      }

      // Use price override if available
      if (
        item.variant.price_override !== null &&
        item.variant.price_override !== undefined
      ) {
        return item.variant.price_override;
      }

      // Fallback to legacy variant pricing
      if (
        item.variant.sale_price &&
        item.variant.sale_price < item.variant.price
      ) {
        return item.variant.sale_price;
      }

      if (item.variant.price) {
        return item.variant.price;
      }
    }

    // Fallback to product pricing
    return item.product.sale_price || item.product.price;
  }

  function getItemTotal(item: CartItemWithDetails) {
    return getItemPrice(item) * item.quantity;
  }

  const subtotal = cartItemsWithDetails.reduce(
    (sum, item) => sum + getItemTotal(item),
    0,
  );
  const finalTotal = subtotal - discount;

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-48"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (cartItemsWithDetails.length === 0) {
    return (
      <div className="container py-16">
        <div className="max-w-2xl mx-auto text-center">
          <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
          <p className="text-muted-foreground mb-6">
            Looks like you haven't added any beautiful flowers to your cart yet
          </p>
          <Button asChild>
            <Link to="/products">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Continue Shopping
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Shopping Cart</h1>
            <p className="text-muted-foreground">
              {cartItemsWithDetails.length} item
              {cartItemsWithDetails.length !== 1 ? "s" : ""} in your cart
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link to="/products">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Continue Shopping
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Cart Items</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearCart}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear Cart
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {cartItemsWithDetails.map((item) => (
                  <div
                    key={`${item.product_id}-${item.variant_id || "default"}`}
                    className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 border rounded-lg"
                  >
                    {/* Top row on mobile: Image + Product Details */}
                    <div className="flex items-center gap-4 flex-1">
                      {/* Product Image */}
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-cream to-peach/30 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                        {item.variant?.image_url ||
                        item.product.images.length > 0 ? (
                          <img
                            src={
                              item.variant?.image_url || item.product.images[0]
                            }
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-xl sm:text-2xl">🌺</span>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold">{item.product.name}</h3>
                        {item.variant && (
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">
                              {item.variant.name}
                            </p>
                            {item.variant.sku && (
                              <p className="text-sm text-muted-foreground">
                                SKU: {item.variant.sku}
                              </p>
                            )}
                          </div>
                        )}
                        {!item.variant && (
                          <p className="text-sm text-muted-foreground">
                            SKU: {item.product.sku || "N/A"}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          <span className="font-semibold text-primary">
                            ₹{getItemPrice(item)}
                          </span>
                          {item.product.sale_price &&
                            !item.variant &&
                            item.product.sale_price < item.product.price && (
                              <span className="text-sm text-muted-foreground line-through">
                                ₹{item.product.price}
                              </span>
                            )}
                        </div>
                      </div>
                    </div>

                    {/* Bottom row on mobile: Quantity, Price, and Delete */}
                    <div className="flex items-center justify-between sm:justify-end sm:gap-4 flex-shrink-0">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            updateQuantity(
                              item.product_id,
                              Math.max(1, item.quantity - 1),
                              item.variant_id,
                            )
                          }
                          disabled={item.quantity <= 1}
                          className="h-8 w-8 p-0"
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="w-8 text-center font-medium text-sm">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            updateQuantity(
                              item.product_id,
                              item.quantity + 1,
                              item.variant_id,
                            )
                          }
                          className="h-8 w-8 p-0"
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>

                      {/* Item Total and Delete */}
                      <div className="flex items-center gap-2">
                        <div className="text-right">
                          <p className="font-semibold">
                            ₹{getItemTotal(item).toLocaleString()}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            removeItem(item.product_id, item.variant_id)
                          }
                          className="text-red-600 hover:text-red-700 h-8 w-8 p-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            {/* Coupon Code */}
            <Card>
              <CardHeader>
                <CardTitle>Apply Coupon</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                  />
                  <Button onClick={applyCoupon}>Apply</Button>
                </div>
                {discount > 0 && (
                  <div className="text-green-600 text-sm">
                    Coupon applied! You saved ₹{discount.toLocaleString()}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-muted-foreground">
                    Calculated at checkout
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-₹{discount.toLocaleString()}</span>
                  </div>
                )}
                <hr />
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>₹{finalTotal.toLocaleString()}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Final total including shipping will be calculated at checkout
                </p>
              </CardContent>
            </Card>

            {/* Checkout Button */}
            <Button asChild className="w-full" size="lg">
              <Link to="/checkout">
                Proceed to Checkout
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>

            {/* Security Badge */}
            <div className="text-center text-sm text-muted-foreground">
              <p>🔒 Secure checkout with 256-bit SSL encryption</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
