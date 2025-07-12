import { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Truck,
  MapPin,
  Clock,
  IndianRupee,
  Save,
  X,
  ToggleLeft,
  ToggleRight,
  FileText,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/lib/supabase";
import {
  ShippingMethodTemplate,
  ShippingMethodZoneConfig,
  ShippingZone,
  ShippingMethodWithZones,
  ShippingMethodFormData,
  ShippingZoneFormData,
} from "@/types/shipping";

export default function ShippingEnhanced() {
  const [methods, setMethods] = useState<ShippingMethodWithZones[]>([]);
  const [zones, setZones] = useState<ShippingZone[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingMethod, setEditingMethod] =
    useState<ShippingMethodTemplate | null>(null);
  const [editingZone, setEditingZone] = useState<ShippingZone | null>(null);
  const [isAddingMethod, setIsAddingMethod] = useState(false);
  const [isAddingZone, setIsAddingZone] = useState(false);
  const [expandedMethod, setExpandedMethod] = useState<string | null>(null);

  useEffect(() => {
    fetchShippingData();
  }, []);

  async function fetchShippingData() {
    try {
      setIsLoading(true);

      // Fetch zones
      const { data: zonesData, error: zonesError } = await supabase
        .from("shipping_zones")
        .select("*")
        .order("name");

      if (zonesError) {
        console.error("Zones fetch error:", zonesError);
        throw zonesError;
      }

      // Fetch method templates - check if table exists
      const { data: methodsData, error: methodsError } = await supabase
        .from("shipping_method_templates")
        .select("*")
        .order("sort_order");

      if (methodsError) {
        console.error("Methods fetch error:", methodsError);
        // If table doesn't exist, show helpful message
        if (
          methodsError.code === "PGRST116" ||
          methodsError.message?.includes("does not exist")
        ) {
          alert(
            "Enhanced shipping tables not found. Please run the database migration first.",
          );
          setZones(zonesData || []);
          setMethods([]);
          return;
        }
        throw methodsError;
      }

      // Fetch zone configurations
      const { data: configsData, error: configsError } = await supabase.from(
        "shipping_method_zone_config",
      ).select(`
          *,
          zone:shipping_zones(*)
        `);

      if (configsError) {
        console.error("Configs fetch error:", configsError);
        throw configsError;
      }

      // Combine data
      const methodsWithZones: ShippingMethodWithZones[] =
        methodsData?.map((method) => ({
          ...method,
          zone_configs:
            configsData?.filter(
              (config) => config.method_template_id === method.id,
            ) || [],
        })) || [];

      setZones(zonesData || []);
      setMethods(methodsWithZones);
    } catch (error: any) {
      console.error("Failed to fetch shipping data:", error);
      if (error?.message?.includes("does not exist")) {
        alert(
          "Database tables are missing. Please run the enhanced shipping migration first.",
        );
      }
    } finally {
      setIsLoading(false);
    }
  }

  async function saveMethod(methodData: ShippingMethodFormData) {
    try {
      console.log("Saving method data:", methodData);
      let methodId: string;

      if (editingMethod) {
        console.log("Updating existing method:", editingMethod.id);
        // Update existing method
        const { error: updateError } = await supabase
          .from("shipping_method_templates")
          .update({
            name: methodData.name,
            description: methodData.description || null,
            type: methodData.type,
            rules: methodData.rules || null,
            is_active: methodData.is_active,
          })
          .eq("id", editingMethod.id);

        if (updateError) {
          console.error("Update method error:", updateError);
          throw updateError;
        }
        methodId = editingMethod.id;

        // Delete existing configs
        console.log("Deleting existing configs for method:", methodId);
        const { error: deleteError } = await supabase
          .from("shipping_method_zone_config")
          .delete()
          .eq("method_template_id", methodId);

        if (deleteError) {
          console.error("Delete configs error:", deleteError);
          throw deleteError;
        }
      } else {
        console.log("Creating new method");
        // Create new method
        const maxOrder =
          methods.length > 0
            ? Math.max(...methods.map((m) => m.sort_order))
            : 0;

        const { data: newMethod, error: insertError } = await supabase
          .from("shipping_method_templates")
          .insert({
            name: methodData.name,
            description: methodData.description || null,
            type: methodData.type,
            rules: methodData.rules || null,
            is_active: methodData.is_active,
            sort_order: maxOrder + 1,
          })
          .select()
          .single();

        if (insertError) {
          console.error("Insert method error:", insertError);
          throw insertError;
        }
        methodId = newMethod.id;
        console.log("Created new method with ID:", methodId);
      }

      // Insert zone configs
      const activeConfigs = methodData.zone_configs.filter(
        (config) => config.is_active,
      );
      console.log("Active zone configs to save:", activeConfigs);

      if (activeConfigs.length > 0) {
        const zoneConfigs = activeConfigs.map((config) => ({
          method_template_id: methodId,
          zone_id: config.zone_id,
          price: parseFloat(config.price) || 0,
          free_shipping_minimum: config.free_shipping_minimum
            ? parseFloat(config.free_shipping_minimum)
            : null,
          delivery_time: config.delivery_time,
          is_active: config.is_active,
        }));

        console.log("Inserting zone configs:", zoneConfigs);
        const { error: configError } = await supabase
          .from("shipping_method_zone_config")
          .insert(zoneConfigs);

        if (configError) {
          console.error("Insert config error:", configError);
          throw configError;
        }
      }

      console.log("Method saved successfully");
      fetchShippingData();
      setEditingMethod(null);
      setIsAddingMethod(false);
      alert("Shipping method saved successfully!");
    } catch (error: any) {
      console.error("Failed to save method:", error);
      const errorMessage =
        error?.message || error?.toString() || "Unknown error";
      alert(`Failed to save shipping method: ${errorMessage}`);
    }
  }

  async function saveZone(zoneData: ShippingZoneFormData) {
    try {
      const pincodes = zoneData.pincodes
        .split(",")
        .map((p) => p.trim())
        .filter((p) => p.length > 0);

      const payload = {
        name: zoneData.name,
        description: zoneData.description || null,
        pincodes,
        is_active: zoneData.is_active,
      };

      if (editingZone) {
        await supabase
          .from("shipping_zones")
          .update(payload)
          .eq("id", editingZone.id);
      } else {
        await supabase.from("shipping_zones").insert(payload);
      }

      fetchShippingData();
      setEditingZone(null);
      setIsAddingZone(false);
    } catch (error) {
      console.error("Failed to save zone:", error);
      alert("Failed to save shipping zone. Please try again.");
    }
  }

  async function deleteMethod(methodId: string) {
    if (
      !confirm(
        "Are you sure? This will delete all zone configurations for this method.",
      )
    )
      return;

    try {
      await supabase
        .from("shipping_method_templates")
        .delete()
        .eq("id", methodId);

      fetchShippingData();
    } catch (error) {
      console.error("Failed to delete method:", error);
    }
  }

  async function deleteZone(zoneId: string) {
    if (
      !confirm(
        "Are you sure? This will delete all shipping methods for this zone.",
      )
    )
      return;

    try {
      await supabase.from("shipping_zones").delete().eq("id", zoneId);

      fetchShippingData();
    } catch (error) {
      console.error("Failed to delete zone:", error);
    }
  }

  async function toggleMethodStatus(methodId: string, isActive: boolean) {
    try {
      await supabase
        .from("shipping_method_templates")
        .update({ is_active: !isActive })
        .eq("id", methodId);

      fetchShippingData();
    } catch (error) {
      console.error("Failed to toggle method status:", error);
    }
  }

  async function toggleZoneStatus(zoneId: string, isActive: boolean) {
    try {
      await supabase
        .from("shipping_zones")
        .update({ is_active: !isActive })
        .eq("id", zoneId);

      fetchShippingData();
    } catch (error) {
      console.error("Failed to toggle zone status:", error);
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded animate-pulse w-48"></div>
        <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Enhanced Shipping Management</h1>
          <p className="text-muted-foreground">
            Unified interface for managing shipping methods across all zones
          </p>
        </div>
      </div>

      <Tabs defaultValue="methods" className="space-y-6">
        <TabsList>
          <TabsTrigger value="methods">Shipping Methods</TabsTrigger>
          <TabsTrigger value="zones">Delivery Zones</TabsTrigger>
        </TabsList>

        {/* Shipping Methods Tab */}
        <TabsContent value="methods" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Shipping Methods</h2>
            <Button onClick={() => setIsAddingMethod(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Method
            </Button>
          </div>

          <div className="space-y-4">
            {methods.map((method) => (
              <Card key={method.id} className="overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <Truck className="w-5 h-5 text-blue-600" />
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {method.name}
                          <Badge
                            variant={method.is_active ? "default" : "secondary"}
                          >
                            {method.is_active ? "Active" : "Inactive"}
                          </Badge>
                          <Badge variant="outline">{method.type}</Badge>
                        </CardTitle>
                        {method.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {method.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={method.is_active}
                        onCheckedChange={() =>
                          toggleMethodStatus(method.id, method.is_active)
                        }
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditingMethod(method)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteMethod(method.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  {/* Custom Rules */}
                  {method.rules && (
                    <Alert className="mb-4">
                      <FileText className="h-4 w-4" />
                      <AlertDescription>{method.rules}</AlertDescription>
                    </Alert>
                  )}

                  {/* Zone Configuration */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Zone Configuration ({method.zone_configs.length} active)
                    </h4>

                    <div className="grid gap-3">
                      {zones.map((zone) => {
                        const config = method.zone_configs.find(
                          (c) => c.zone_id === zone.id,
                        );
                        const isActive = config?.is_active || false;

                        return (
                          <div
                            key={zone.id}
                            className={`flex items-center justify-between p-3 border rounded-lg ${
                              isActive
                                ? "bg-green-50 border-green-200"
                                : "bg-gray-50"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className="w-2 h-2 rounded-full"
                                style={{
                                  backgroundColor: isActive
                                    ? "#10b981"
                                    : "#6b7280",
                                }}
                              />
                              <div>
                                <div className="font-medium text-sm">
                                  {zone.name}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {zone.pincodes.length} pincodes
                                </div>
                              </div>
                            </div>

                            {isActive && config && (
                              <div className="flex items-center gap-4 text-sm">
                                <span className="flex items-center gap-1">
                                  <IndianRupee className="w-3 h-3" />
                                  {config.price}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {config.delivery_time}
                                </span>
                                {config.free_shipping_minimum && (
                                  <span className="text-green-600 text-xs">
                                    Free above ₹{config.free_shipping_minimum}
                                  </span>
                                )}
                              </div>
                            )}

                            <Badge variant={isActive ? "default" : "outline"}>
                              {isActive ? "Enabled" : "Disabled"}
                            </Badge>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {methods.length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <Truck className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">
                    No Shipping Methods
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Create your first shipping method to get started
                  </p>
                  <Button onClick={() => setIsAddingMethod(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Method
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Zones Tab */}
        <TabsContent value="zones" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Delivery Zones</h2>
            <Button onClick={() => setIsAddingZone(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Zone
            </Button>
          </div>

          <div className="grid gap-4">
            {zones.map((zone) => (
              <Card key={zone.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="w-4 h-4" />
                        <h3 className="font-semibold">{zone.name}</h3>
                        <Badge
                          variant={zone.is_active ? "default" : "secondary"}
                        >
                          {zone.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      {zone.description && (
                        <p className="text-sm text-muted-foreground mb-2">
                          {zone.description}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-1 mb-2">
                        {zone.pincodes.slice(0, 8).map((pincode) => (
                          <Badge
                            key={pincode}
                            variant="outline"
                            className="text-xs"
                          >
                            {pincode}
                          </Badge>
                        ))}
                        {zone.pincodes.length > 8 && (
                          <Badge variant="outline" className="text-xs">
                            +{zone.pincodes.length - 8} more
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={zone.is_active}
                        onCheckedChange={() =>
                          toggleZoneStatus(zone.id, zone.is_active)
                        }
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditingZone(zone)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteZone(zone.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {zones.length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <MapPin className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">
                    No Delivery Zones
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Create delivery zones to configure shipping methods
                  </p>
                  <Button onClick={() => setIsAddingZone(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Zone
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Method Dialog */}
      <Dialog
        open={isAddingMethod || !!editingMethod}
        onOpenChange={() => {
          setIsAddingMethod(false);
          setEditingMethod(null);
        }}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingMethod
                ? "Edit Shipping Method"
                : "Add New Shipping Method"}
            </DialogTitle>
          </DialogHeader>
          <MethodForm
            method={editingMethod}
            zones={zones}
            onSave={saveMethod}
            onCancel={() => {
              setIsAddingMethod(false);
              setEditingMethod(null);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Zone Dialog */}
      <Dialog
        open={isAddingZone || !!editingZone}
        onOpenChange={() => {
          setIsAddingZone(false);
          setEditingZone(null);
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingZone ? "Edit Zone" : "Add New Zone"}
            </DialogTitle>
          </DialogHeader>
          <ZoneForm
            zone={editingZone}
            onSave={saveZone}
            onCancel={() => {
              setIsAddingZone(false);
              setEditingZone(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Enhanced Method Form Component
function MethodForm({
  method,
  zones,
  onSave,
  onCancel,
}: {
  method: ShippingMethodTemplate | null;
  zones: ShippingZone[];
  onSave: (data: ShippingMethodFormData) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState<ShippingMethodFormData>({
    name: method?.name || "",
    description: method?.description || "",
    type: method?.type || "standard",
    rules: method?.rules || "",
    is_active: method?.is_active ?? true,
    zone_configs: zones.map((zone) => ({
      zone_id: zone.id,
      price: "",
      free_shipping_minimum: "",
      delivery_time: "",
      is_active: false,
    })),
  });

  // Load existing configurations if editing
  useEffect(() => {
    if (method) {
      // Fetch existing configurations
      fetchExistingConfigs();
    }
  }, [method]);

  async function fetchExistingConfigs() {
    if (!method) return;

    try {
      const { data: configs } = await supabase
        .from("shipping_method_zone_config")
        .select("*")
        .eq("method_template_id", method.id);

      if (configs) {
        setFormData((prev) => ({
          ...prev,
          zone_configs: zones.map((zone) => {
            const config = configs.find((c) => c.zone_id === zone.id);
            return {
              zone_id: zone.id,
              price: config?.price?.toString() || "",
              free_shipping_minimum:
                config?.free_shipping_minimum?.toString() || "",
              delivery_time: config?.delivery_time || "",
              is_active: config?.is_active || false,
            };
          }),
        }));
      }
    } catch (error) {
      console.error("Failed to fetch existing configs:", error);
    }
  }

  function updateZoneConfig(zoneId: string, field: string, value: any) {
    setFormData((prev) => ({
      ...prev,
      zone_configs: prev.zone_configs.map((config) =>
        config.zone_id === zoneId ? { ...config, [field]: value } : config,
      ),
    }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave(formData);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Basic Information</h3>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Method Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="e.g., Same Day Delivery"
              required
            />
          </div>
          <div>
            <Label htmlFor="type">Delivery Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value: any) =>
                setFormData({ ...formData, type: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="same_day">Same Day</SelectItem>
                <SelectItem value="next_day">Next Day</SelectItem>
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="express">Express</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="Brief description of the delivery method"
          />
        </div>

        <div>
          <Label htmlFor="rules">Custom Rules & Notes</Label>
          <Textarea
            id="rules"
            value={formData.rules}
            onChange={(e) =>
              setFormData({ ...formData, rules: e.target.value })
            }
            placeholder="e.g., Order before 2 PM for same-day delivery. Available on business days only."
            rows={3}
          />
          <p className="text-xs text-muted-foreground mt-1">
            These rules will be displayed to customers during checkout
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="is_active"
            checked={formData.is_active}
            onCheckedChange={(checked) =>
              setFormData({ ...formData, is_active: checked })
            }
          />
          <Label htmlFor="is_active">Active</Label>
        </div>
      </div>

      {/* Zone Configuration */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Zone Configuration</h3>
        <p className="text-sm text-muted-foreground">
          Toggle zones on/off and set pricing for each delivery area
        </p>

        <div className="space-y-3">
          {zones.map((zone) => {
            const config = formData.zone_configs.find(
              (c) => c.zone_id === zone.id,
            );
            if (!config) return null;

            return (
              <Card
                key={zone.id}
                className={
                  config.is_active ? "border-green-200 bg-green-50" : ""
                }
              >
                <CardContent className="p-4">
                  <div className="space-y-4">
                    {/* Zone Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Switch
                          checked={config.is_active}
                          onCheckedChange={(checked) =>
                            updateZoneConfig(zone.id, "is_active", checked)
                          }
                        />
                        <div>
                          <h4 className="font-medium">{zone.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {zone.pincodes.length} pincodes
                          </p>
                        </div>
                      </div>
                      <Badge variant={config.is_active ? "default" : "outline"}>
                        {config.is_active ? "Enabled" : "Disabled"}
                      </Badge>
                    </div>

                    {/* Configuration Fields (only show when active) */}
                    {config.is_active && (
                      <div className="grid grid-cols-3 gap-4 pt-3 border-t">
                        <div>
                          <Label htmlFor={`price-${zone.id}`}>Price (₹)</Label>
                          <Input
                            id={`price-${zone.id}`}
                            type="number"
                            step="0.01"
                            value={config.price}
                            onChange={(e) =>
                              updateZoneConfig(zone.id, "price", e.target.value)
                            }
                            placeholder="0.00"
                            required={config.is_active}
                          />
                        </div>
                        <div>
                          <Label htmlFor={`free-shipping-${zone.id}`}>
                            Free Shipping Above (₹)
                          </Label>
                          <Input
                            id={`free-shipping-${zone.id}`}
                            type="number"
                            step="0.01"
                            value={config.free_shipping_minimum}
                            onChange={(e) =>
                              updateZoneConfig(
                                zone.id,
                                "free_shipping_minimum",
                                e.target.value,
                              )
                            }
                            placeholder="Optional"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`delivery-time-${zone.id}`}>
                            Delivery Time
                          </Label>
                          <Input
                            id={`delivery-time-${zone.id}`}
                            value={config.delivery_time}
                            onChange={(e) =>
                              updateZoneConfig(
                                zone.id,
                                "delivery_time",
                                e.target.value,
                              )
                            }
                            placeholder="e.g., Within 4 hours"
                            required={config.is_active}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {method ? "Update Method" : "Create Method"}
        </Button>
      </div>
    </form>
  );
}

// Zone Form Component (same as before, reused)
function ZoneForm({
  zone,
  onSave,
  onCancel,
}: {
  zone: ShippingZone | null;
  onSave: (data: ShippingZoneFormData) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState<ShippingZoneFormData>({
    name: zone?.name || "",
    description: zone?.description || "",
    pincodes: zone?.pincodes.join(", ") || "",
    is_active: zone?.is_active ?? true,
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave(formData);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Zone Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g., Mumbai Central"
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="Brief description of the zone"
        />
      </div>

      <div>
        <Label htmlFor="pincodes">Pincodes (comma-separated)</Label>
        <Textarea
          id="pincodes"
          value={formData.pincodes}
          onChange={(e) =>
            setFormData({ ...formData, pincodes: e.target.value })
          }
          placeholder="400001, 400002, 400003..."
          rows={4}
          required
        />
        <p className="text-xs text-muted-foreground mt-1">
          Enter pincodes separated by commas
        </p>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="is_active"
          checked={formData.is_active}
          onCheckedChange={(checked) =>
            setFormData({ ...formData, is_active: checked })
          }
        />
        <Label htmlFor="is_active">Active</Label>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{zone ? "Update Zone" : "Create Zone"}</Button>
      </div>
    </form>
  );
}
