import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Loader2, CreditCard, Smartphone, Globe, Banknote } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PaymentMethodConfig, PaymentGateway } from "@shared/payment.types";

interface PaymentMethod {
  gateway: PaymentGateway;
  name: string;
  description?: string;
  enabled: boolean;
  available_at_checkout: boolean;
  min_amount: number;
  max_amount: number;
  processing_fee: number;
  fixed_fee: number;
  supported_currencies: string[];
  checkout_priority: number;
  processing_message?: string;
}

interface PaymentMethodSelectorProps {
  amount: number;
  currency?: string;
  selectedMethod: PaymentGateway | null;
  onMethodSelect: (gateway: PaymentGateway) => void;
  onProceed: () => void;
  isLoading?: boolean;
}

const PAYMENT_METHOD_ICONS: Record<PaymentGateway, React.ReactNode> = {
  phonepe: <Smartphone className="w-5 h-5" />,
  razorpay: <CreditCard className="w-5 h-5" />,
  cashfree: <Banknote className="w-5 h-5" />,
  paypal: <Globe className="w-5 h-5" />,
};

const PAYMENT_METHOD_COLORS: Record<PaymentGateway, string> = {
  phonepe: "bg-purple-100 border-purple-300 text-purple-800",
  razorpay: "bg-blue-100 border-blue-300 text-blue-800",
  cashfree: "bg-orange-100 border-orange-300 text-orange-800",
  paypal: "bg-yellow-100 border-yellow-300 text-yellow-800",
};

const PAYMENT_METHOD_DESCRIPTIONS: Record<PaymentGateway, string> = {
  phonepe: "UPI, Cards, Wallets & NetBanking",
  razorpay: "Cards, UPI, Wallets & NetBanking",
  cashfree: "All payment methods",
  paypal: "International payments",
};

export default function PaymentMethodSelector({
  amount,
  currency = "INR",
  selectedMethod,
  onMethodSelect,
  onProceed,
  isLoading = false,
}: PaymentMethodSelectorProps) {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  async function fetchPaymentMethods() {
    try {
      setLoading(true);

      // Use XMLHttpRequest to avoid third-party script interference
      const data = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", "/api/payments/methods", true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.timeout = 10000;

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              resolve(JSON.parse(xhr.responseText));
            } catch (e) {
              reject(new Error("Invalid JSON response"));
            }
          } else {
            reject(new Error(`HTTP ${xhr.status}: ${xhr.statusText}`));
          }
        };

        xhr.onerror = () => reject(new Error("Network error"));
        xhr.ontimeout = () => reject(new Error("Request timeout"));
        xhr.send();
      });

      if (data.success) {
        setPaymentMethods(data.methods);
      } else {
        setError("Failed to load payment methods");
      }
    } catch (err) {
      console.error("Error fetching payment methods:", err);
      setError("Failed to load payment methods");
    } finally {
      setLoading(false);
    }
  }

  function isMethodAvailable(method: PaymentMethod): boolean {
    return (
      method.enabled &&
      amount >= method.min_amount &&
      amount <= method.max_amount &&
      method.supported_currencies.includes(currency)
    );
  }

  function calculateFee(method: PaymentMethod): number {
    const percentageFee = (amount * method.processing_fee) / 100;
    return percentageFee + method.fixed_fee;
  }

  function formatAmount(amountInPaise: number): string {
    return `₹${(amountInPaise / 100).toLocaleString()}`;
  }

  const availableMethods = paymentMethods.filter(isMethodAvailable);
  const unavailableMethods = paymentMethods.filter(
    (method) => !isMethodAvailable(method),
  );

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Payment Methods</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            <span>Loading payment methods...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Payment Methods</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <Button
            onClick={fetchPaymentMethods}
            className="mt-4"
            variant="outline"
          >
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          Choose Payment Method
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Select your preferred payment method to complete the order
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {availableMethods.length === 0 ? (
          <Alert>
            <AlertDescription>
              No payment methods available for this order amount. Please contact
              support.
            </AlertDescription>
          </Alert>
        ) : (
          <>
            <RadioGroup
              value={selectedMethod || ""}
              onValueChange={(value) => onMethodSelect(value as PaymentGateway)}
              className="space-y-3"
            >
              {availableMethods.map((method) => {
                return (
                  <div key={method.gateway} className="relative">
                    <Label
                      htmlFor={method.gateway}
                      className={`flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-all hover:bg-gray-50 ${
                        selectedMethod === method.gateway
                          ? "border-primary bg-primary/5"
                          : "border-gray-200"
                      }`}
                    >
                      <RadioGroupItem
                        value={method.gateway}
                        id={method.gateway}
                      />

                      <div className="flex items-center gap-3 flex-1">
                        {/* Payment Icon */}
                        <div
                          className={`p-2 rounded-lg ${PAYMENT_METHOD_COLORS[method.gateway]}`}
                        >
                          {PAYMENT_METHOD_ICONS[method.gateway]}
                        </div>

                        {/* Payment Info */}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{method.name}</h3>
                            {method.gateway === "phonepe" && (
                              <Badge variant="secondary" className="text-xs">
                                Recommended
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {method.description ||
                              PAYMENT_METHOD_DESCRIPTIONS[method.gateway]}
                          </p>
                        </div>

                        {/* Order Amount */}
                        <div className="text-right">
                          <p className="font-semibold">
                            {formatAmount(amount)}
                          </p>
                        </div>
                      </div>
                    </Label>
                  </div>
                );
              })}
            </RadioGroup>

            {/* Selected Method Details */}
            {selectedMethod && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">
                  Payment Details
                </h4>
                <div className="space-y-1 text-sm text-blue-800">
                  <div className="flex justify-between font-medium">
                    <span>Total Amount:</span>
                    <span>{formatAmount(amount)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Proceed Button */}
            <Button
              onClick={onProceed}
              disabled={!selectedMethod || isLoading}
              className="w-full"
              size="lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Processing...
                </>
              ) : (
                `Proceed to Pay ${selectedMethod ? formatAmount(amount) : ""}`
              )}
            </Button>
          </>
        )}

        {/* Unavailable Methods */}
        {unavailableMethods.length > 0 && (
          <div className="border-t pt-4">
            <h4 className="text-sm font-medium text-muted-foreground mb-3">
              Unavailable Payment Methods
            </h4>
            <div className="space-y-2">
              {unavailableMethods.map((method) => (
                <div
                  key={method.gateway}
                  className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg opacity-50"
                >
                  <div className="p-2 rounded-lg bg-gray-100">
                    {PAYMENT_METHOD_ICONS[method.gateway]}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-600">{method.name}</h3>
                    <p className="text-xs text-gray-500">
                      {!method.enabled
                        ? "Currently disabled"
                        : amount < method.min_amount
                          ? `Minimum amount: ${formatAmount(method.min_amount)}`
                          : amount > method.max_amount
                            ? `Maximum amount: ${formatAmount(method.max_amount)}`
                            : "Not supported for this currency"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Security Notice */}
        <div className="text-center text-xs text-muted-foreground bg-gray-50 p-3 rounded">
          🔒 All payments are processed securely using industry-standard
          encryption
        </div>
      </CardContent>
    </Card>
  );
}
