import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  CreditCard,
  Settings,
  Save,
  Eye,
  EyeOff,
  Smartphone,
  Globe,
  Banknote,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { PaymentGateway, DEFAULT_PAYMENT_METHODS } from "@shared/payment.types";

// Local interface that matches database schema
interface PaymentGatewayConfigDB {
  id: PaymentGateway;
  name: string;
  enabled: boolean;
  sandbox: boolean;
  priority: number;
  config: Record<string, any>;
  supported_currencies: string[];
  min_amount: number;
  max_amount: number;
  processing_fee: number;
  fixed_fee: number;
  // Checkout availability controls
  available_at_checkout: boolean;
  checkout_display_name: string;
  checkout_description: string;
  checkout_icon: string;
  checkout_priority: number;
  min_checkout_amount: number;
  max_checkout_amount: number;
  checkout_processing_message: string;
}

const GATEWAY_ICONS: Record<PaymentGateway, React.ReactNode> = {
  phonepe: <Smartphone className="w-5 h-5" />,
  razorpay: <CreditCard className="w-5 h-5" />,
  cashfree: <Banknote className="w-5 h-5" />,
  paypal: <Globe className="w-5 h-5" />,
};

const GATEWAY_DESCRIPTIONS: Record<PaymentGateway, string> = {
  phonepe: "Popular UPI and digital payments in India",
  razorpay: "Comprehensive payment gateway for India",
  cashfree: "Payment solutions for businesses",
  paypal: "International payment processing",
};

export default function PaymentGatewayConfig() {
  const [configs, setConfigs] = useState<PaymentGatewayConfigDB[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  useEffect(() => {
    loadConfigs();
  }, []);

  async function loadConfigs() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("payment_gateway_configs")
        .select("*")
        .order("priority");

      if (error) throw error;

      if (data && data.length > 0) {
        setConfigs(data);
      } else {
        // Initialize with default configs
        setConfigs(
          DEFAULT_PAYMENT_METHODS.map((method, index) => ({
            id: method.gateway,
            name: method.name,
            enabled: false,
            sandbox: true,
            priority: index + 1,
            config: {},
            supported_currencies: ["INR"],
            min_amount: 100,
            max_amount: 10000000,
            processing_fee: 2.0,
            fixed_fee: 0,
            // Checkout availability defaults
            available_at_checkout: true,
            checkout_display_name: method.name,
            checkout_description: method.description,
            checkout_icon: method.gateway,
            checkout_priority: index + 1,
            min_checkout_amount: 100,
            max_checkout_amount: 10000000,
            checkout_processing_message: `Processing payment via ${method.name}...`,
          })),
        );
      }
    } catch (error) {
      console.error("Error loading configs:", error);
      toast({
        title: "Error",
        description: "Failed to load payment gateway configurations",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  async function saveConfig(config: PaymentGatewayConfigDB) {
    try {
      setSaving(config.id);

      const { error } = await supabase
        .from("payment_gateway_configs")
        .upsert(config);

      if (error) throw error;

      toast({
        title: "Success",
        description: `${config.name} configuration saved successfully`,
      });

      await loadConfigs();
    } catch (error) {
      console.error("Error saving config:", error);
      toast({
        title: "Error",
        description: "Failed to save configuration",
        variant: "destructive",
      });
    } finally {
      setSaving(null);
    }
  }

  function updateConfig(
    gatewayId: PaymentGateway,
    updates: Partial<PaymentGatewayConfigDB>,
  ) {
    setConfigs((prev) =>
      prev.map((config) =>
        config.id === gatewayId ? { ...config, ...updates } : config,
      ),
    );
  }

  function toggleSecretVisibility(gatewayId: string, field: string) {
    setShowSecrets((prev) => ({
      ...prev,
      [`${gatewayId}_${field}`]: !prev[`${gatewayId}_${field}`],
    }));
  }

  function formatAmount(amount: number) {
    return `₹${(amount / 100).toLocaleString()}`;
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Payment Gateways
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">Loading configurations...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Payment Gateway Configuration
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Configure payment gateways to accept payments from customers
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {configs.map((config) => (
              <Card key={config.id} className="border">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {GATEWAY_ICONS[config.id]}
                      <div>
                        <h3 className="font-semibold">{config.name}</h3>
                        <p className="text-xs text-muted-foreground">
                          {GATEWAY_DESCRIPTIONS[config.id]}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={config.enabled}
                        onCheckedChange={(enabled) =>
                          updateConfig(config.id, { enabled })
                        }
                      />
                      <Badge variant={config.enabled ? "default" : "secondary"}>
                        {config.enabled ? "Enabled" : "Disabled"}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Min Amount:</span>
                      <div>{formatAmount(config.min_amount)}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Max Amount:</span>
                      <div>{formatAmount(config.max_amount)}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Fee:</span>
                      <div>{config.processing_fee}%</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Mode:</span>
                      <Badge variant={config.sandbox ? "outline" : "default"}>
                        {config.sandbox ? "Sandbox" : "Production"}
                      </Badge>
                    </div>
                  </div>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="w-full">
                        <Settings className="w-4 h-4 mr-2" />
                        Configure
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          {GATEWAY_ICONS[config.id]}
                          Configure {config.name}
                        </DialogTitle>
                        <DialogDescription>
                          Enter your {config.name} credentials and configuration
                        </DialogDescription>
                      </DialogHeader>

                      <Tabs defaultValue="general" className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                          <TabsTrigger value="general">General</TabsTrigger>
                          <TabsTrigger value="checkout">Checkout</TabsTrigger>
                          <TabsTrigger value="credentials">
                            Credentials
                          </TabsTrigger>
                        </TabsList>

                        <TabsContent value="general" className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="priority">Priority</Label>
                              <Input
                                id="priority"
                                type="number"
                                value={config.priority}
                                onChange={(e) =>
                                  updateConfig(config.id, {
                                    priority: parseInt(e.target.value) || 0,
                                  })
                                }
                              />
                            </div>
                            <div className="flex items-center space-x-2 pt-6">
                              <Switch
                                id="sandbox"
                                checked={config.sandbox}
                                onCheckedChange={(sandbox) =>
                                  updateConfig(config.id, { sandbox })
                                }
                              />
                              <Label htmlFor="sandbox">Sandbox Mode</Label>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="min-amount">
                                Minimum Amount (₹)
                              </Label>
                              <Input
                                id="min-amount"
                                type="number"
                                value={config.min_amount / 100}
                                onChange={(e) =>
                                  updateConfig(config.id, {
                                    min_amount:
                                      (parseFloat(e.target.value) || 0) * 100,
                                  })
                                }
                              />
                            </div>
                            <div>
                              <Label htmlFor="max-amount">
                                Maximum Amount (₹)
                              </Label>
                              <Input
                                id="max-amount"
                                type="number"
                                value={config.max_amount / 100}
                                onChange={(e) =>
                                  updateConfig(config.id, {
                                    max_amount:
                                      (parseFloat(e.target.value) || 0) * 100,
                                  })
                                }
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="processing-fee">
                                Processing Fee (%)
                              </Label>
                              <Input
                                id="processing-fee"
                                type="number"
                                step="0.1"
                                value={config.processing_fee}
                                onChange={(e) =>
                                  updateConfig(config.id, {
                                    processing_fee:
                                      parseFloat(e.target.value) || 0,
                                  })
                                }
                              />
                            </div>
                            <div>
                              <Label htmlFor="fixed-fee">Fixed Fee (₹)</Label>
                              <Input
                                id="fixed-fee"
                                type="number"
                                value={config.fixed_fee / 100}
                                onChange={(e) =>
                                  updateConfig(config.id, {
                                    fixed_fee:
                                      (parseFloat(e.target.value) || 0) * 100,
                                  })
                                }
                              />
                            </div>
                          </div>
                        </TabsContent>

                        <TabsContent value="checkout" className="space-y-4">
                          <div className="flex items-center space-x-2">
                            <Switch
                              id={`checkout-available-${config.id}`}
                              checked={config.available_at_checkout}
                              onCheckedChange={(available_at_checkout) =>
                                updateConfig(config.id, {
                                  available_at_checkout,
                                })
                              }
                            />
                            <Label htmlFor={`checkout-available-${config.id}`}>
                              Show at Checkout
                            </Label>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            When enabled, customers will see this payment method
                            as an option during checkout.
                          </p>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="checkout-display-name">
                                Display Name at Checkout
                              </Label>
                              <Input
                                id="checkout-display-name"
                                value={
                                  config.checkout_display_name || config.name
                                }
                                onChange={(e) =>
                                  updateConfig(config.id, {
                                    checkout_display_name: e.target.value,
                                  })
                                }
                                placeholder={config.name}
                              />
                            </div>
                            <div>
                              <Label htmlFor="checkout-priority">
                                Checkout Priority
                              </Label>
                              <Input
                                id="checkout-priority"
                                type="number"
                                value={config.checkout_priority}
                                onChange={(e) =>
                                  updateConfig(config.id, {
                                    checkout_priority:
                                      parseInt(e.target.value) || 0,
                                  })
                                }
                              />
                              <p className="text-xs text-muted-foreground mt-1">
                                Lower numbers appear first
                              </p>
                            </div>
                          </div>

                          <div>
                            <Label htmlFor="checkout-description">
                              Customer Description
                            </Label>
                            <Textarea
                              id="checkout-description"
                              value={config.checkout_description || ""}
                              onChange={(e) =>
                                updateConfig(config.id, {
                                  checkout_description: e.target.value,
                                })
                              }
                              placeholder="Description shown to customers at checkout"
                              rows={2}
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="min-checkout-amount">
                                Minimum Order Amount (₹)
                              </Label>
                              <Input
                                id="min-checkout-amount"
                                type="number"
                                value={config.min_checkout_amount / 100}
                                onChange={(e) =>
                                  updateConfig(config.id, {
                                    min_checkout_amount:
                                      (parseFloat(e.target.value) || 0) * 100,
                                  })
                                }
                              />
                              <p className="text-xs text-muted-foreground mt-1">
                                Hide this payment method for orders below this
                                amount
                              </p>
                            </div>
                            <div>
                              <Label htmlFor="max-checkout-amount">
                                Maximum Order Amount (₹)
                              </Label>
                              <Input
                                id="max-checkout-amount"
                                type="number"
                                value={config.max_checkout_amount / 100}
                                onChange={(e) =>
                                  updateConfig(config.id, {
                                    max_checkout_amount:
                                      (parseFloat(e.target.value) || 0) * 100,
                                  })
                                }
                              />
                              <p className="text-xs text-muted-foreground mt-1">
                                Hide this payment method for orders above this
                                amount
                              </p>
                            </div>
                          </div>

                          <div>
                            <Label htmlFor="checkout-processing-message">
                              Processing Message
                            </Label>
                            <Input
                              id="checkout-processing-message"
                              value={config.checkout_processing_message || ""}
                              onChange={(e) =>
                                updateConfig(config.id, {
                                  checkout_processing_message: e.target.value,
                                })
                              }
                              placeholder="Message shown while processing payment"
                            />
                          </div>

                          <Alert>
                            <AlertDescription>
                              <strong>
                                Checkout Availability vs System Enabled:
                              </strong>
                              <br />• <strong>System Enabled:</strong> Gateway
                              is configured and functional
                              <br />• <strong>Show at Checkout:</strong>{" "}
                              Customers can select this payment method
                              <br />
                              You can enable a gateway but hide it from
                              checkout, or show different limits at checkout.
                            </AlertDescription>
                          </Alert>
                        </TabsContent>

                        <TabsContent value="credentials" className="space-y-4">
                          {config.id === "paypal" && (
                            <>
                              <div>
                                <Label htmlFor="paypal-client-id">
                                  Client ID
                                </Label>
                                <div className="flex gap-2">
                                  <Input
                                    id="paypal-client-id"
                                    type={
                                      showSecrets[`${config.id}_client_id`]
                                        ? "text"
                                        : "password"
                                    }
                                    value={config.config.paypal_client_id || ""}
                                    onChange={(e) =>
                                      updateConfig(config.id, {
                                        config: {
                                          ...config.config,
                                          paypal_client_id: e.target.value,
                                        },
                                      })
                                    }
                                    placeholder="Your PayPal Client ID"
                                  />
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    onClick={() =>
                                      toggleSecretVisibility(
                                        config.id,
                                        "client_id",
                                      )
                                    }
                                  >
                                    {showSecrets[`${config.id}_client_id`] ? (
                                      <EyeOff className="w-4 h-4" />
                                    ) : (
                                      <Eye className="w-4 h-4" />
                                    )}
                                  </Button>
                                </div>
                              </div>
                              <div>
                                <Label htmlFor="paypal-client-secret">
                                  Client Secret
                                </Label>
                                <div className="flex gap-2">
                                  <Input
                                    id="paypal-client-secret"
                                    type={
                                      showSecrets[`${config.id}_client_secret`]
                                        ? "text"
                                        : "password"
                                    }
                                    value={
                                      config.config.paypal_client_secret || ""
                                    }
                                    onChange={(e) =>
                                      updateConfig(config.id, {
                                        config: {
                                          ...config.config,
                                          paypal_client_secret: e.target.value,
                                        },
                                      })
                                    }
                                    placeholder="Your PayPal Client Secret"
                                  />
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    onClick={() =>
                                      toggleSecretVisibility(
                                        config.id,
                                        "client_secret",
                                      )
                                    }
                                  >
                                    {showSecrets[
                                      `${config.id}_client_secret`
                                    ] ? (
                                      <EyeOff className="w-4 h-4" />
                                    ) : (
                                      <Eye className="w-4 h-4" />
                                    )}
                                  </Button>
                                </div>
                              </div>
                            </>
                          )}

                          {config.id === "razorpay" && (
                            <>
                              <div>
                                <Label htmlFor="razorpay-key-id">Key ID</Label>
                                <div className="flex gap-2">
                                  <Input
                                    id="razorpay-key-id"
                                    type={
                                      showSecrets[`${config.id}_key_id`]
                                        ? "text"
                                        : "password"
                                    }
                                    value={config.config.razorpay_key_id || ""}
                                    onChange={(e) =>
                                      updateConfig(config.id, {
                                        config: {
                                          ...config.config,
                                          razorpay_key_id: e.target.value,
                                        },
                                      })
                                    }
                                    placeholder="Your Razorpay Key ID"
                                  />
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    onClick={() =>
                                      toggleSecretVisibility(
                                        config.id,
                                        "key_id",
                                      )
                                    }
                                  >
                                    {showSecrets[`${config.id}_key_id`] ? (
                                      <EyeOff className="w-4 h-4" />
                                    ) : (
                                      <Eye className="w-4 h-4" />
                                    )}
                                  </Button>
                                </div>
                              </div>
                              <div>
                                <Label htmlFor="razorpay-key-secret">
                                  Key Secret
                                </Label>
                                <div className="flex gap-2">
                                  <Input
                                    id="razorpay-key-secret"
                                    type={
                                      showSecrets[`${config.id}_key_secret`]
                                        ? "text"
                                        : "password"
                                    }
                                    value={
                                      config.config.razorpay_key_secret || ""
                                    }
                                    onChange={(e) =>
                                      updateConfig(config.id, {
                                        config: {
                                          ...config.config,
                                          razorpay_key_secret: e.target.value,
                                        },
                                      })
                                    }
                                    placeholder="Your Razorpay Key Secret"
                                  />
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    onClick={() =>
                                      toggleSecretVisibility(
                                        config.id,
                                        "key_secret",
                                      )
                                    }
                                  >
                                    {showSecrets[`${config.id}_key_secret`] ? (
                                      <EyeOff className="w-4 h-4" />
                                    ) : (
                                      <Eye className="w-4 h-4" />
                                    )}
                                  </Button>
                                </div>
                              </div>
                            </>
                          )}

                          {config.id === "cashfree" && (
                            <>
                              <div>
                                <Label htmlFor="cashfree-app-id">App ID</Label>
                                <div className="flex gap-2">
                                  <Input
                                    id="cashfree-app-id"
                                    type={
                                      showSecrets[`${config.id}_app_id`]
                                        ? "text"
                                        : "password"
                                    }
                                    value={config.config.cashfree_app_id || ""}
                                    onChange={(e) =>
                                      updateConfig(config.id, {
                                        config: {
                                          ...config.config,
                                          cashfree_app_id: e.target.value,
                                        },
                                      })
                                    }
                                    placeholder="Your Cashfree App ID"
                                  />
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    onClick={() =>
                                      toggleSecretVisibility(
                                        config.id,
                                        "app_id",
                                      )
                                    }
                                  >
                                    {showSecrets[`${config.id}_app_id`] ? (
                                      <EyeOff className="w-4 h-4" />
                                    ) : (
                                      <Eye className="w-4 h-4" />
                                    )}
                                  </Button>
                                </div>
                              </div>
                              <div>
                                <Label htmlFor="cashfree-secret-key">
                                  Secret Key
                                </Label>
                                <div className="flex gap-2">
                                  <Input
                                    id="cashfree-secret-key"
                                    type={
                                      showSecrets[`${config.id}_secret_key`]
                                        ? "text"
                                        : "password"
                                    }
                                    value={
                                      config.config.cashfree_secret_key || ""
                                    }
                                    onChange={(e) =>
                                      updateConfig(config.id, {
                                        config: {
                                          ...config.config,
                                          cashfree_secret_key: e.target.value,
                                        },
                                      })
                                    }
                                    placeholder="Your Cashfree Secret Key"
                                  />
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    onClick={() =>
                                      toggleSecretVisibility(
                                        config.id,
                                        "secret_key",
                                      )
                                    }
                                  >
                                    {showSecrets[`${config.id}_secret_key`] ? (
                                      <EyeOff className="w-4 h-4" />
                                    ) : (
                                      <Eye className="w-4 h-4" />
                                    )}
                                  </Button>
                                </div>
                              </div>
                            </>
                          )}

                          {config.id === "phonepe" && (
                            <>
                              <div>
                                <Label htmlFor="phonepe-merchant-id">
                                  Merchant ID
                                </Label>
                                <Input
                                  id="phonepe-merchant-id"
                                  value={
                                    config.config.phonepe_merchant_id || ""
                                  }
                                  onChange={(e) =>
                                    updateConfig(config.id, {
                                      config: {
                                        ...config.config,
                                        phonepe_merchant_id: e.target.value,
                                      },
                                    })
                                  }
                                  placeholder="Your PhonePe Merchant ID"
                                />
                              </div>
                              <div>
                                <Label htmlFor="phonepe-salt-key">
                                  Salt Key
                                </Label>
                                <div className="flex gap-2">
                                  <Input
                                    id="phonepe-salt-key"
                                    type={
                                      showSecrets[`${config.id}_salt_key`]
                                        ? "text"
                                        : "password"
                                    }
                                    value={config.config.phonepe_salt_key || ""}
                                    onChange={(e) =>
                                      updateConfig(config.id, {
                                        config: {
                                          ...config.config,
                                          phonepe_salt_key: e.target.value,
                                        },
                                      })
                                    }
                                    placeholder="Your PhonePe Salt Key"
                                  />
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    onClick={() =>
                                      toggleSecretVisibility(
                                        config.id,
                                        "salt_key",
                                      )
                                    }
                                  >
                                    {showSecrets[`${config.id}_salt_key`] ? (
                                      <EyeOff className="w-4 h-4" />
                                    ) : (
                                      <Eye className="w-4 h-4" />
                                    )}
                                  </Button>
                                </div>
                              </div>
                              <div>
                                <Label htmlFor="phonepe-salt-index">
                                  Salt Index
                                </Label>
                                <Input
                                  id="phonepe-salt-index"
                                  value={config.config.phonepe_salt_index || ""}
                                  onChange={(e) =>
                                    updateConfig(config.id, {
                                      config: {
                                        ...config.config,
                                        phonepe_salt_index: e.target.value,
                                      },
                                    })
                                  }
                                  placeholder="Salt Index (usually 1)"
                                />
                              </div>
                            </>
                          )}

                          <Alert>
                            <AlertDescription>
                              <strong>Important:</strong> Keep your credentials
                              secure. Never share them publicly or commit them
                              to version control.
                            </AlertDescription>
                          </Alert>
                        </TabsContent>
                      </Tabs>

                      <div className="flex justify-end gap-2 pt-4">
                        <Button
                          onClick={() => saveConfig(config)}
                          disabled={saving === config.id}
                        >
                          {saving === config.id ? (
                            <>
                              <Settings className="w-4 h-4 mr-2 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save className="w-4 h-4 mr-2" />
                              Save Configuration
                            </>
                          )}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
