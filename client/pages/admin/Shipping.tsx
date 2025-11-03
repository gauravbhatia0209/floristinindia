import { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Truck,
  MapPin,
  Clock,
  IndianRupee,
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
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/lib/supabase";
import { ShippingZone, ShippingMethod } from "@shared/database.types";
import PermissionGuard from "@/components/PermissionGuard";
import { useAuth } from "@/contexts/AuthContext";
import { canCreate, canEdit, canDelete } from "@/lib/permissionUtils";

interface ShippingZoneWithMethods extends ShippingZone {
  shipping_methods: ShippingMethod[];
}

export default function Shipping() {
  const { user } = useAuth();
  const [zones, setZones] = useState<ShippingZoneWithMethods[]>([]);
  const [methods, setMethods] = useState<ShippingMethod[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingZone, setEditingZone] = useState<ShippingZone | null>(null);
  const [editingMethod, setEditingMethod] = useState<ShippingMethod | null>(
    null,
  );
  const [isAddingZone, setIsAddingZone] = useState(false);
  const [isAddingMethod, setIsAddingMethod] = useState(false);

  const hasCreatePermission = canCreate(user?.permissions, "shipping");
  const hasEditPermission = canEdit(user?.permissions, "shipping");
  const hasDeletePermission = canDelete(user?.permissions, "shipping");

  useEffect(() => {
    fetchShippingData();
  }, []);

  async function fetchShippingData() {
    try {
      // Fetch zones
      const { data: zonesData } = await supabase
        .from("shipping_zones")
        .select("*")
        .order("name");

      // Fetch methods
      const { data: methodsData } = await supabase
        .from("shipping_methods")
        .select("*")
        .order("sort_order");

      if (zonesData && methodsData) {
        // Group methods by zone
        const zonesWithMethods = zonesData.map((zone) => ({
          ...zone,
          shipping_methods: methodsData.filter(
            (method) => method.zone_id === zone.id,
          ),
        }));

        setZones(zonesWithMethods);
        setMethods(methodsData);
      }
    } catch (error) {
      console.error("Failed to fetch shipping data:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function saveZone(zoneData: Partial<ShippingZone>) {
    try {
      if (editingZone) {
        await supabase
          .from("shipping_zones")
          .update(zoneData)
          .eq("id", editingZone.id);
      } else {
        await supabase.from("shipping_zones").insert(zoneData);
      }

      fetchShippingData();
      setEditingZone(null);
      setIsAddingZone(false);
    } catch (error) {
      console.error("Failed to save zone:", error);
    }
  }

  async function saveMethod(methodData: Partial<ShippingMethod>) {
    try {
      if (editingMethod) {
        await supabase
          .from("shipping_methods")
          .update(methodData)
          .eq("id", editingMethod.id);
      } else {
        const maxOrder =
          methods.length > 0
            ? Math.max(...methods.map((m) => m.sort_order))
            : 0;
        await supabase
          .from("shipping_methods")
          .insert({ ...methodData, sort_order: maxOrder + 1 });
      }

      fetchShippingData();
      setEditingMethod(null);
      setIsAddingMethod(false);
    } catch (error) {
      console.error("Failed to save method:", error);
    }
  }

  async function deleteZone(zoneId: string) {
    if (
      !confirm(
        "Are you sure? This will also delete all shipping methods for this zone.",
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

  async function deleteMethod(methodId: string) {
    if (!confirm("Are you sure you want to delete this shipping method?"))
      return;

    try {
      await supabase.from("shipping_methods").delete().eq("id", methodId);
      fetchShippingData();
    } catch (error) {
      console.error("Failed to delete method:", error);
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
    <PermissionGuard requiredModule="shipping">
      <div className="space-y-6">
        {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Shipping Management</h1>
          <p className="text-muted-foreground">
            Manage delivery zones, pincodes, and shipping methods
          </p>
        </div>
      </div>

      <Tabs defaultValue="zones" className="space-y-6">
        <TabsList>
          <TabsTrigger value="zones">Shipping Zones</TabsTrigger>
          <TabsTrigger value="methods">Shipping Methods</TabsTrigger>
        </TabsList>

        <TabsContent value="zones" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Delivery Zones</h2>
            {hasCreatePermission && (
              <Button onClick={() => setIsAddingZone(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Zone
              </Button>
            )}
          </div>

          <div className="grid gap-6">
            {zones.map((zone) => (
              <Card key={zone.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="w-5 h-5" />
                        {zone.name}
                        <Badge
                          variant={zone.is_active ? "default" : "secondary"}
                        >
                          {zone.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </CardTitle>
                      {zone.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {zone.description}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={zone.is_active}
                        onCheckedChange={() =>
                          toggleZoneStatus(zone.id, zone.is_active)
                        }
                      />
                      {hasEditPermission && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setEditingZone(zone)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      )}
                      {hasDeletePermission && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteZone(zone.id)}
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">
                        Covered Pincodes ({zone.pincodes.length})
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {zone.pincodes.slice(0, 10).map((pincode) => (
                          <Badge
                            key={pincode}
                            variant="outline"
                            className="text-xs"
                          >
                            {pincode}
                          </Badge>
                        ))}
                        {zone.pincodes.length > 10 && (
                          <Badge variant="outline" className="text-xs">
                            +{zone.pincodes.length - 10} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">
                        Shipping Methods ({zone.shipping_methods.length})
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {zone.shipping_methods.map((method) => (
                          <div
                            key={method.id}
                            className="border rounded-lg p-3"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <h5 className="font-medium text-sm">
                                {method.name}
                              </h5>
                              <Badge
                                variant={
                                  method.is_active ? "default" : "secondary"
                                }
                                className="text-xs"
                              >
                                {method.is_active ? "Active" : "Inactive"}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mb-2">
                              {method.description}
                            </p>
                            <div className="flex justify-between items-center text-xs">
                              <span className="font-medium">
                                ₹{method.price}
                              </span>
                              <span className="text-muted-foreground">
                                {method.delivery_time}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="methods" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Shipping Methods</h2>
            <Button onClick={() => setIsAddingMethod(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Method
            </Button>
          </div>

          <div className="grid gap-4">
            {methods.map((method) => {
              const zone = zones.find((z) => z.id === method.zone_id);
              return (
                <Card key={method.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Truck className="w-4 h-4" />
                          <h3 className="font-semibold">{method.name}</h3>
                          <Badge
                            variant={method.is_active ? "default" : "secondary"}
                          >
                            {method.is_active ? "Active" : "Inactive"}
                          </Badge>
                          <Badge variant="outline">{method.type}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {method.description}
                        </p>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="flex items-center gap-1">
                            <IndianRupee className="w-3 h-3" />
                            {method.price}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {method.delivery_time}
                          </span>
                          {zone && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {zone.name}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
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
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>

      {/* Add/Edit Zone Dialog */}
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

      {/* Add/Edit Method Dialog */}
      <Dialog
        open={isAddingMethod || !!editingMethod}
        onOpenChange={() => {
          setIsAddingMethod(false);
          setEditingMethod(null);
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingMethod ? "Edit Method" : "Add New Method"}
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
    </div>
    </PermissionGuard>
  );
}

// Zone Form Component
function ZoneForm({
  zone,
  onSave,
  onCancel,
}: {
  zone: ShippingZone | null;
  onSave: (data: Partial<ShippingZone>) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    name: zone?.name || "",
    description: zone?.description || "",
    pincodes: zone?.pincodes.join(", ") || "",
    is_active: zone?.is_active ?? true,
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const pincodes = formData.pincodes
      .split(",")
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    onSave({
      name: formData.name,
      description: formData.description || null,
      pincodes,
      is_active: formData.is_active,
    });
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

// Method Form Component
function MethodForm({
  method,
  zones,
  onSave,
  onCancel,
}: {
  method: ShippingMethod | null;
  zones: ShippingZone[];
  onSave: (data: Partial<ShippingMethod>) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    zone_id: method?.zone_id || "",
    name: method?.name || "",
    description: method?.description || "",
    type: method?.type || ("standard" as const),
    price: method?.price?.toString() || "",
    free_shipping_minimum: method?.free_shipping_minimum?.toString() || "",
    delivery_time: method?.delivery_time || "",
    is_active: method?.is_active ?? true,
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    onSave({
      zone_id: formData.zone_id,
      name: formData.name,
      description: formData.description || null,
      type: formData.type,
      price: parseFloat(formData.price),
      free_shipping_minimum: formData.free_shipping_minimum
        ? parseFloat(formData.free_shipping_minimum)
        : null,
      delivery_time: formData.delivery_time,
      is_active: formData.is_active,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="zone_id">Shipping Zone</Label>
        <Select
          value={formData.zone_id}
          onValueChange={(value) =>
            setFormData({ ...formData, zone_id: value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a zone" />
          </SelectTrigger>
          <SelectContent>
            {zones.map((zone) => (
              <SelectItem key={zone.id} value={zone.id}>
                {zone.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Method Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="price">Price (₹)</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: e.target.value })
            }
            placeholder="0.00"
            required
          />
        </div>
        <div>
          <Label htmlFor="free_shipping_minimum">
            Free Shipping Minimum (₹)
          </Label>
          <Input
            id="free_shipping_minimum"
            type="number"
            step="0.01"
            value={formData.free_shipping_minimum}
            onChange={(e) =>
              setFormData({
                ...formData,
                free_shipping_minimum: e.target.value,
              })
            }
            placeholder="500.00"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="delivery_time">Delivery Time</Label>
        <Input
          id="delivery_time"
          value={formData.delivery_time}
          onChange={(e) =>
            setFormData({ ...formData, delivery_time: e.target.value })
          }
          placeholder="e.g., Within 4 hours"
          required
        />
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
        <Button type="submit">
          {method ? "Update Method" : "Create Method"}
        </Button>
      </div>
    </form>
  );
}
