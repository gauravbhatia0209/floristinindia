import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Star,
  Heart,
  Share2,
  Truck,
  Shield,
  Clock,
  Upload,
  Check,
  X,
  Plus,
  Minus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import { supabase } from "@/lib/supabase";
import { useCart } from "@/hooks/useCart";
import { useFacebookPixel } from "@/components/FacebookPixel";
import FacebookShopMeta from "@/components/FacebookShopMeta";
import { ProductVariationSelector } from "@/components/ProductVariationSelector";
import { toast } from "@/hooks/use-toast";
import {
  Product,
  ProductVariant,
  ProductCategory,
  ShippingZone,
} from "@shared/database.types";

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [category, setCategory] = useState<ProductCategory | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    null,
  );
  const [selectedVariations, setSelectedVariations] = useState<
    Record<string, ProductVariant>
  >({});
  const [effectivePrice, setEffectivePrice] = useState(0);
  const [effectiveSalePrice, setEffectiveSalePrice] = useState<
    number | undefined
  >();
  const [effectiveImage, setEffectiveImage] = useState<string | undefined>();
  const [quantity, setQuantity] = useState(1);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [pincode, setPincode] = useState("");
  const [deliveryInfo, setDeliveryInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckingPincode, setIsCheckingPincode] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [settings, setSettings] = useState<any>(null);

  const { addItem } = useCart();
  const { trackViewContent, trackAddToCart: trackFBAddToCart } =
    useFacebookPixel();

  useEffect(() => {
    if (slug) {
      fetchProductData();
    }
  }, [slug]);

  async function fetchProductData() {
    try {
      // Fetch product details
      const { data: productData } = await supabase
        .from("products")
        .select("*")
        .eq("slug", slug)
        .eq("is_active", true)
        .single();

      if (!productData) {
        throw new Error("Product not found");
      }

      // Fetch variants
      const { data: variantsData } = await supabase
        .from("product_variants")
        .select("*")
        .eq("product_id", productData.id)
        .eq("is_active", true)
        .order("sort_order");

      // Fetch category info
      const { data: categoryData } = await supabase
        .from("product_categories")
        .select("*")
        .eq("id", productData.category_id)
        .single();

      // Fetch settings
      const { data: settingsData } = await supabase
        .from("site_settings")
        .select("*")
        .single();

      setProduct(productData);
      setVariants(variantsData || []);
      setCategory(categoryData);
      setSettings(settingsData);

      // Set default variant if available
      if (variantsData && variantsData.length > 0) {
        setSelectedVariant(variantsData[0]);
      }
    } catch (error) {
      console.error("Failed to fetch product:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function checkPincodeDelivery() {
    if (!pincode || !product) return;

    setIsCheckingPincode(true);
    try {
      // Check if pincode is in delivery zones
      const { data: zones } = await supabase
        .from("shipping_zones")
        .select("*, shipping_methods(*)")
        .contains("pincodes", [pincode])
        .eq("is_active", true);

      if (zones && zones.length > 0) {
        const zone = zones[0];
        const availableMethods =
          zone.shipping_methods?.filter((method: any) => method.is_active) ||
          [];

        setDeliveryInfo({
          available: true,
          zone: zone.name,
          methods: availableMethods,
        });
      } else {
        setDeliveryInfo({
          available: false,
          message: "Sorry, we don't deliver to this pincode yet.",
        });
      }
    } catch (error) {
      console.error("Failed to check pincode:", error);
      setDeliveryInfo({
        available: false,
        message: "Error checking delivery availability.",
      });
    } finally {
      setIsCheckingPincode(false);
    }
  }

  function getCurrentPrice() {
    if (effectiveSalePrice && effectiveSalePrice > 0) {
      return effectiveSalePrice;
    }
    if (effectivePrice > 0) {
      return effectivePrice;
    }
    return product?.sale_price || product?.price || 0;
  }

  function getOriginalPrice() {
    if (effectiveSalePrice && effectiveSalePrice > 0 && effectivePrice > 0) {
      return effectivePrice;
    }
    if (product?.sale_price) {
      return product.price;
    }
    return null;
  }

  function handleVariationChange(
    variations: Record<string, ProductVariant>,
    price: number,
    salePrice?: number,
    image?: string,
  ) {
    setSelectedVariations(variations);
    setEffectivePrice(price);
    setEffectiveSalePrice(salePrice);
    setEffectiveImage(image);

    // Set the first selected variant for backward compatibility
    const variantsList = Object.values(variations);
    setSelectedVariant(variantsList.length > 0 ? variantsList[0] : null);
  }

  function handleAddToCart() {
    if (!product) return;

    // Create a combined variant representation for cart
    const combinedVariant = selectedVariant
      ? {
          ...selectedVariant,
          // Include effective pricing and image
          price_override: effectivePrice,
          sale_price_override: effectiveSalePrice,
          image_url: effectiveImage,
          // Create a name that includes all selected variations
          name:
            Object.entries(selectedVariations)
              .map(([type, variant]) => `${type}: ${variant.variation_value}`)
              .join(", ") || selectedVariant.name,
        }
      : undefined;

    addItem({
      product_id: product.id,
      product,
      variant_id: selectedVariant?.id,
      variant: combinedVariant,
      quantity,
      uploaded_file: uploadedFile || undefined,
    });

    // Show enhanced success notification
    const currentPrice = effectivePrice || product.price;
    const currentSalePrice = effectiveSalePrice || product.sale_price;
    const displayPrice =
      currentSalePrice && currentSalePrice < currentPrice
        ? currentSalePrice
        : currentPrice;

    // Create clean variation description only for valid variations
    const variationText = Object.entries(selectedVariations)
      .filter(
        ([type, variant]) => variant?.variation_value && type !== "Default",
      )
      .map(([type, variant]) => `${type}: ${variant.variation_value}`)
      .join(", ");

    toast({
      title: "✅ Added to cart!",
      description: (
        <div className="flex items-center gap-3">
          {(effectiveImage || product.images[0]) && (
            <img
              src={effectiveImage || product.images[0]}
              alt={product.name}
              className="w-10 h-10 rounded object-cover"
            />
          )}
          <div className="flex-1">
            <div className="font-medium">{product.name}</div>
            {variationText && (
              <div className="text-sm text-muted-foreground">
                {variationText}
              </div>
            )}
            <div className="text-sm">
              Qty: {quantity} • ₹{(displayPrice * quantity).toFixed(0)}
            </div>
          </div>
        </div>
      ),
      duration: 3000,
    });
  }

  function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type if specified
      if (product?.upload_file_types.length) {
        const fileExtension = file.name.split(".").pop()?.toLowerCase();
        if (!product.upload_file_types.includes(fileExtension || "")) {
          alert(
            `Please upload a file with one of these extensions: ${product.upload_file_types.join(", ")}`,
          );
          return;
        }
      }
      setUploadedFile(file);
    }
  }

  if (isLoading) {
    return (
      <div className="container py-12">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="aspect-square bg-gray-200 rounded-lg"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              <div className="h-24 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <p className="text-muted-foreground mb-6">
          The product you're looking for doesn't exist or has been removed.
        </p>
        <Button asChild>
          <Link to="/products">Browse All Products</Link>
        </Button>
      </div>
    );
  }

  // Prepare product data for Facebook Shop Meta
  const fbProduct = {
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    sale_price: product.sale_price,
    images: product.images,
    category_name: product.category_name,
    slug: product.slug,
  };

  return (
    <div className="container py-8">
      <FacebookShopMeta product={fbProduct} />
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
        <Link to="/" className="hover:text-primary">
          Home
        </Link>
        <span>/</span>
        <Link to="/products" className="hover:text-primary">
          Products
        </Link>
        {category && (
          <>
            <span>/</span>
            <Link
              to={`/category/${category.slug}`}
              className="hover:text-primary"
            >
              {category.name}
            </Link>
          </>
        )}
        <span>/</span>
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square bg-gradient-to-br from-cream to-peach/30 rounded-lg overflow-hidden">
            {effectiveImage || product.images.length > 0 ? (
              <img
                src={effectiveImage || product.images[selectedImageIndex]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-6xl">
                🌺
              </div>
            )}
          </div>

          {/* Image thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                    selectedImageIndex === index
                      ? "border-primary"
                      : "border-transparent"
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            {/* Show ratings only for products with variations */}
            {product.has_variations && variants.length > 0 && (
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-gold text-gold" />
                  ))}
                  <span className="text-muted-foreground ml-2">
                    (4.8) • 156 reviews
                  </span>
                </div>
              </div>
            )}

            {/* Pricing */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-3xl font-bold text-primary">
                ₹{getCurrentPrice()}
              </span>
              {getOriginalPrice() && (
                <span className="text-xl text-muted-foreground line-through">
                  ₹{getOriginalPrice()}
                </span>
              )}
              {getOriginalPrice() && (
                <Badge className="bg-destructive text-destructive-foreground">
                  {Math.round(
                    ((getOriginalPrice()! - getCurrentPrice()) /
                      getOriginalPrice()!) *
                      100,
                  )}
                  % OFF
                </Badge>
              )}
            </div>
          </div>

          {/* Short Description */}
          {product.short_description && (
            <p className="text-lg text-muted-foreground">
              {product.short_description}
            </p>
          )}

          {/* Product Variations or Simple Pricing */}
          {product.has_variations && variants.length > 0 ? (
            <ProductVariationSelector
              variants={variants}
              basePrice={product.price}
              baseSalePrice={product.sale_price || undefined}
              baseImages={product.images || []}
              onVariationChange={handleVariationChange}
            />
          ) : null}

          {/* Quantity */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Quantity:</Label>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                <Minus className="w-4 h-4" />
              </Button>
              <span className="w-12 text-center font-medium">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(quantity + 1)}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* File Upload (if required) */}
          {product.requires_file_upload && (
            <div className="space-y-3">
              <Label className="text-base font-semibold">
                Upload File (Required):
              </Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Upload your image or document
                  </p>
                  {product.upload_file_types.length > 0 && (
                    <p className="text-xs text-muted-foreground">
                      Accepted formats: {product.upload_file_types.join(", ")}
                    </p>
                  )}
                  <Input
                    type="file"
                    onChange={handleFileUpload}
                    accept={product.upload_file_types
                      .map((type) => `.${type}`)
                      .join(",")}
                    className="hidden"
                    id="file-upload"
                  />
                  <Label htmlFor="file-upload" className="cursor-pointer">
                    <Button variant="outline" asChild>
                      <span>Choose File</span>
                    </Button>
                  </Label>
                  {uploadedFile && (
                    <p className="text-sm text-green-600">
                      ✓ {uploadedFile.name}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Special Instructions */}
          {settings?.enable_special_instructions && (
            <div className="space-y-3">
              <Label htmlFor="instructions" className="text-base font-semibold">
                Special Instructions (Optional):
              </Label>
              <Textarea
                id="instructions"
                placeholder="Any special message or delivery instructions..."
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                rows={3}
              />
            </div>
          )}

          {/* Pincode Check */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Check Delivery:</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Enter pincode"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                className="flex-1"
              />
              <Button
                onClick={checkPincodeDelivery}
                disabled={!pincode || isCheckingPincode}
              >
                {isCheckingPincode ? "Checking..." : "Check"}
              </Button>
            </div>

            {deliveryInfo && (
              <div
                className={`p-3 rounded-lg ${
                  deliveryInfo.available
                    ? "bg-green-50 border border-green-200"
                    : "bg-red-50 border border-red-200"
                }`}
              >
                {deliveryInfo.available ? (
                  <div>
                    <p className="text-green-800 font-medium flex items-center gap-2">
                      <Check className="w-4 h-4" />
                      Available in {deliveryInfo.zone}
                    </p>
                    <div className="mt-2 space-y-1">
                      {deliveryInfo.methods.map((method: any) => (
                        <div
                          key={method.id}
                          className="flex justify-between text-sm text-green-700"
                        >
                          <span>{method.name}</span>
                          <span>
                            ₹{method.price} • {method.delivery_time}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-red-800 flex items-center gap-2">
                    <X className="w-4 h-4" />
                    {deliveryInfo.message}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              size="lg"
              className="flex-1"
              onClick={handleAddToCart}
              disabled={product.requires_file_upload && !uploadedFile}
            >
              Add to Cart
            </Button>
            <Button variant="outline" size="lg">
              <Heart className="w-5 h-5" />
            </Button>
            <Button variant="outline" size="lg">
              <Share2 className="w-5 h-5" />
            </Button>
          </div>

          {/* Product Features */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t">
            <div className="text-center">
              <Truck className="w-6 h-6 mx-auto mb-2 text-primary" />
              <p className="text-sm font-medium">Same Day Delivery</p>
            </div>
            <div className="text-center">
              <Shield className="w-6 h-6 mx-auto mb-2 text-primary" />
              <p className="text-sm font-medium">Fresh Guarantee</p>
            </div>
            <div className="text-center">
              <Clock className="w-6 h-6 mx-auto mb-2 text-primary" />
              <p className="text-sm font-medium">24/7 Support</p>
            </div>
          </div>
        </div>
      </div>

      {/* Product Description */}
      {product.description && (
        <div className="mt-12">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">Description</h3>
              <div className="prose max-w-none">
                <p className="text-muted-foreground">{product.description}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
