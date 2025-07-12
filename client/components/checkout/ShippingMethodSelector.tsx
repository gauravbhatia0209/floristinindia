import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Truck,
  Clock,
  IndianRupee,
  MapPin,
  Info,
  CheckCircle,
} from "lucide-react";
import {
  getAvailableShippingMethods,
  calculateShippingCost,
} from "@/lib/shipping-service";
import { AvailableShippingMethod } from "@/types/shipping";

interface ShippingMethodSelectorProps {
  pincode: string;
  orderValue: number;
  selectedMethodId: string | null;
  onMethodSelect: (
    method: AvailableShippingMethod | null,
    shippingCost: number,
  ) => void;
  className?: string;
}

export default function ShippingMethodSelector({
  pincode,
  orderValue,
  selectedMethodId,
  onMethodSelect,
  className = "",
}: ShippingMethodSelectorProps) {
  const [availableMethods, setAvailableMethods] = useState<
    AvailableShippingMethod[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (pincode) {
      fetchShippingMethods();
    } else {
      setAvailableMethods([]);
      onMethodSelect(null, 0);
    }
  }, [pincode]);

  useEffect(() => {
    // Recalculate costs when order value changes
    if (selectedMethodId && availableMethods.length > 0) {
      const selectedMethod = availableMethods.find(
        (method) => method.config_id === selectedMethodId,
      );
      if (selectedMethod) {
        const cost = calculateShippingCost(selectedMethod, orderValue);
        onMethodSelect(selectedMethod, cost);
      }
    }
  }, [orderValue, selectedMethodId, availableMethods]);

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

      // Auto-select the first method if none is selected
      if (!selectedMethodId && methods.length > 0) {
        const firstMethod = methods[0];
        const cost = calculateShippingCost(firstMethod, orderValue);
        onMethodSelect(firstMethod, cost);
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

  if (isLoading) {
    return (
      <Card className={className}>
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
      <Card className={className}>
        <CardContent className="p-6">
          <Alert variant="destructive">
            <MapPin className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (availableMethods.length === 0) {
    return (
      <Card className={className}>
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

  return (
    <Card className={className}>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Truck className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold">Delivery Options</h3>
            <Badge variant="outline">{availableMethods.length} available</Badge>
          </div>

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
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    isSelected
                      ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => handleMethodChange(method.config_id)}
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
                            className="font-medium cursor-pointer"
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

          {/* Summary */}
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
