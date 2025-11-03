import { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Ticket,
  Percent,
  IndianRupee,
  Calendar,
  Users,
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
import { supabase } from "@/lib/supabase";
import { Coupon, ProductCategory } from "@shared/database.types";
import PermissionGuard from "@/components/PermissionGuard";
import { useAuth } from "@/contexts/AuthContext";
import { canCreate, canEdit, canDelete } from "@/lib/permissionUtils";

export default function Coupons() {
  const { user } = useAuth();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [isAddingCoupon, setIsAddingCoupon] = useState(false);

  const hasCreatePermission = canCreate(user?.permissions, "coupons");
  const hasEditPermission = canEdit(user?.permissions, "coupons");
  const hasDeletePermission = canDelete(user?.permissions, "coupons");

  useEffect(() => {
    fetchCoupons();
    fetchCategories();
  }, []);

  async function fetchCoupons() {
    try {
      const { data } = await supabase
        .from("coupons")
        .select("*")
        .order("created_at", { ascending: false });

      if (data) {
        setCoupons(data);
      }
    } catch (error) {
      console.error("Failed to fetch coupons:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchCategories() {
    try {
      const { data } = await supabase
        .from("product_categories")
        .select("id, name")
        .eq("is_active", true)
        .order("name");

      if (data) {
        setCategories(data);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  }

  async function saveCoupon(couponData: Partial<Coupon>) {
    try {
      if (editingCoupon) {
        await supabase
          .from("coupons")
          .update(couponData)
          .eq("id", editingCoupon.id);
      } else {
        await supabase.from("coupons").insert(couponData);
      }

      fetchCoupons();
      setEditingCoupon(null);
      setIsAddingCoupon(false);
    } catch (error) {
      console.error("Failed to save coupon:", error);
    }
  }

  async function deleteCoupon(couponId: string) {
    if (!confirm("Are you sure you want to delete this coupon?")) return;

    try {
      await supabase.from("coupons").delete().eq("id", couponId);
      fetchCoupons();
    } catch (error) {
      console.error("Failed to delete coupon:", error);
    }
  }

  async function toggleCouponStatus(couponId: string, isActive: boolean) {
    try {
      await supabase
        .from("coupons")
        .update({ is_active: !isActive })
        .eq("id", couponId);
      fetchCoupons();
    } catch (error) {
      console.error("Failed to toggle coupon status:", error);
    }
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  function getCouponStatus(coupon: Coupon) {
    if (!coupon.is_active) return { status: "Inactive", color: "secondary" };

    const now = new Date();
    const startsAt = coupon.starts_at ? new Date(coupon.starts_at) : null;
    const expiresAt = coupon.expires_at ? new Date(coupon.expires_at) : null;

    if (startsAt && now < startsAt)
      return { status: "Scheduled", color: "outline" };
    if (expiresAt && now > expiresAt)
      return { status: "Expired", color: "destructive" };
    if (coupon.usage_limit && coupon.usage_count >= coupon.usage_limit)
      return { status: "Limit Reached", color: "destructive" };

    return { status: "Active", color: "default" };
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded animate-pulse w-48"></div>
        <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
      </div>
    );
  }

  const stats = {
    total: coupons.length,
    active: coupons.filter((c) => c.is_active).length,
    expired: coupons.filter((c) => {
      const now = new Date();
      return c.expires_at && new Date(c.expires_at) < now;
    }).length,
    totalUsage: coupons.reduce((sum, c) => sum + c.usage_count, 0),
  };

  return (
    <PermissionGuard requiredModule="coupons">
      <div className="space-y-6">
        {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Coupon Management</h1>
          <p className="text-muted-foreground">
            Create and manage discount coupons
          </p>
        </div>
        {hasCreatePermission && (
          <Button onClick={() => setIsAddingCoupon(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Coupon
          </Button>
        )}
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Coupons</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Ticket className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.active}
                </p>
              </div>
              <Ticket className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Expired</p>
                <p className="text-2xl font-bold text-red-600">
                  {stats.expired}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Usage</p>
                <p className="text-2xl font-bold">{stats.totalUsage}</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Coupons List */}
      <Card>
        <CardHeader>
          <CardTitle>All Coupons</CardTitle>
        </CardHeader>
        <CardContent>
          {coupons.length === 0 ? (
            <div className="text-center py-12">
              <Ticket className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No coupons yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first discount coupon to boost sales
              </p>
              {hasCreatePermission && (
                <Button onClick={() => setIsAddingCoupon(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Coupon
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {coupons.map((coupon) => {
                const statusInfo = getCouponStatus(coupon);
                return (
                  <div key={coupon.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-gradient-rose rounded-lg flex items-center justify-center">
                            {coupon.discount_type === "percentage" ? (
                              <Percent className="w-5 h-5 text-white" />
                            ) : (
                              <IndianRupee className="w-5 h-5 text-white" />
                            )}
                          </div>
                          <div>
                            <h3 className="font-semibold">{coupon.name}</h3>
                            <p className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                              {coupon.code}
                            </p>
                          </div>
                          <Badge variant={statusInfo.color as any}>
                            {statusInfo.status}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="font-medium">Discount</p>
                            <p>
                              {coupon.discount_type === "percentage"
                                ? `${coupon.discount_value}%`
                                : `₹${coupon.discount_value}`}
                              {coupon.maximum_discount_amount &&
                                coupon.discount_type === "percentage" &&
                                ` (max ₹${coupon.maximum_discount_amount})`}
                            </p>
                          </div>

                          <div>
                            <p className="font-medium">Usage</p>
                            <p>
                              {coupon.usage_count}
                              {coupon.usage_limit
                                ? ` / ${coupon.usage_limit}`
                                : " (unlimited)"}
                            </p>
                          </div>

                          <div>
                            <p className="font-medium">Valid Period</p>
                            <p>
                              {coupon.starts_at
                                ? formatDate(coupon.starts_at)
                                : "Anytime"}{" "}
                              -{" "}
                              {coupon.expires_at
                                ? formatDate(coupon.expires_at)
                                : "Never"}
                            </p>
                          </div>

                          <div>
                            <p className="font-medium">Min Order</p>
                            <p>
                              {coupon.minimum_order_amount
                                ? `₹${coupon.minimum_order_amount}`
                                : "No minimum"}
                            </p>
                          </div>
                        </div>

                        {coupon.description && (
                          <p className="text-sm text-muted-foreground mt-2">
                            {coupon.description}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <Switch
                          checked={coupon.is_active}
                          onCheckedChange={() =>
                            toggleCouponStatus(coupon.id, coupon.is_active)
                          }
                        />
                        {hasEditPermission && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setEditingCoupon(coupon)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        )}
                        {hasDeletePermission && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteCoupon(coupon.id)}
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Coupon Dialog */}
      <Dialog
        open={isAddingCoupon || !!editingCoupon}
        onOpenChange={() => {
          setIsAddingCoupon(false);
          setEditingCoupon(null);
        }}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingCoupon ? "Edit Coupon" : "Create New Coupon"}
            </DialogTitle>
          </DialogHeader>
          <CouponForm
            coupon={editingCoupon}
            categories={categories}
            onSave={saveCoupon}
            onCancel={() => {
              setIsAddingCoupon(false);
              setEditingCoupon(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
    </PermissionGuard>
  );
}

// Coupon Form Component
function CouponForm({
  coupon,
  categories,
  onSave,
  onCancel,
}: {
  coupon: Coupon | null;
  categories: ProductCategory[];
  onSave: (data: Partial<Coupon>) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    code: coupon?.code || "",
    name: coupon?.name || "",
    description: coupon?.description || "",
    discount_type: coupon?.discount_type || ("flat" as const),
    discount_value: coupon?.discount_value?.toString() || "",
    minimum_order_amount: coupon?.minimum_order_amount?.toString() || "",
    maximum_discount_amount: coupon?.maximum_discount_amount?.toString() || "",
    usage_limit: coupon?.usage_limit?.toString() || "",
    starts_at: coupon?.starts_at?.split("T")[0] || "",
    expires_at: coupon?.expires_at?.split("T")[0] || "",
    applicable_categories: coupon?.applicable_categories || [],
    is_active: coupon?.is_active ?? true,
  });

  // Auto-generate code from name
  useEffect(() => {
    if (!coupon && formData.name) {
      const code = formData.name
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, "")
        .substring(0, 10);
      setFormData((prev) => ({ ...prev, code }));
    }
  }, [formData.name, coupon]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    onSave({
      code: formData.code,
      name: formData.name,
      description: formData.description || null,
      discount_type: formData.discount_type,
      discount_value: parseFloat(formData.discount_value),
      minimum_order_amount: formData.minimum_order_amount
        ? parseFloat(formData.minimum_order_amount)
        : null,
      maximum_discount_amount: formData.maximum_discount_amount
        ? parseFloat(formData.maximum_discount_amount)
        : null,
      usage_limit: formData.usage_limit ? parseInt(formData.usage_limit) : null,
      starts_at: formData.starts_at || null,
      expires_at: formData.expires_at || null,
      applicable_categories: formData.applicable_categories,
      is_active: formData.is_active,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Basic Information</h3>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Coupon Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="New Year Sale"
              required
            />
          </div>
          <div>
            <Label htmlFor="code">Coupon Code</Label>
            <Input
              id="code"
              value={formData.code}
              onChange={(e) =>
                setFormData({ ...formData, code: e.target.value.toUpperCase() })
              }
              placeholder="NEWYEAR50"
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="Special discount for new year celebration"
            rows={2}
          />
        </div>
      </div>

      {/* Discount Configuration */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Discount Configuration</h3>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="discount_type">Discount Type</Label>
            <Select
              value={formData.discount_type}
              onValueChange={(value: "flat" | "percentage") =>
                setFormData({ ...formData, discount_type: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="flat">Fixed Amount (₹)</SelectItem>
                <SelectItem value="percentage">Percentage (%)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="discount_value">
              Discount Value{" "}
              {formData.discount_type === "percentage" ? "(%)" : "(₹)"}
            </Label>
            <Input
              id="discount_value"
              type="number"
              step="0.01"
              value={formData.discount_value}
              onChange={(e) =>
                setFormData({ ...formData, discount_value: e.target.value })
              }
              placeholder={
                formData.discount_type === "percentage" ? "20" : "500"
              }
              required
            />
          </div>
          {formData.discount_type === "percentage" && (
            <div>
              <Label htmlFor="maximum_discount_amount">Max Discount (₹)</Label>
              <Input
                id="maximum_discount_amount"
                type="number"
                step="0.01"
                value={formData.maximum_discount_amount}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    maximum_discount_amount: e.target.value,
                  })
                }
                placeholder="1000"
              />
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="minimum_order_amount">
              Minimum Order Amount (₹)
            </Label>
            <Input
              id="minimum_order_amount"
              type="number"
              step="0.01"
              value={formData.minimum_order_amount}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  minimum_order_amount: e.target.value,
                })
              }
              placeholder="500"
            />
          </div>
          <div>
            <Label htmlFor="usage_limit">Usage Limit</Label>
            <Input
              id="usage_limit"
              type="number"
              value={formData.usage_limit}
              onChange={(e) =>
                setFormData({ ...formData, usage_limit: e.target.value })
              }
              placeholder="100 (leave empty for unlimited)"
            />
          </div>
        </div>
      </div>

      {/* Validity Period */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Validity Period</h3>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="starts_at">Start Date</Label>
            <Input
              id="starts_at"
              type="date"
              value={formData.starts_at}
              onChange={(e) =>
                setFormData({ ...formData, starts_at: e.target.value })
              }
            />
          </div>
          <div>
            <Label htmlFor="expires_at">Expiry Date</Label>
            <Input
              id="expires_at"
              type="date"
              value={formData.expires_at}
              onChange={(e) =>
                setFormData({ ...formData, expires_at: e.target.value })
              }
            />
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Applicable Categories</h3>
        <div className="text-sm text-muted-foreground mb-2">
          Leave empty to apply to all categories
        </div>
        <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto border rounded-lg p-2">
          {categories.map((category) => (
            <label
              key={category.id}
              className="flex items-center space-x-2 text-sm"
            >
              <input
                type="checkbox"
                checked={formData.applicable_categories.includes(category.id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setFormData({
                      ...formData,
                      applicable_categories: [
                        ...formData.applicable_categories,
                        category.id,
                      ],
                    });
                  } else {
                    setFormData({
                      ...formData,
                      applicable_categories:
                        formData.applicable_categories.filter(
                          (id) => id !== category.id,
                        ),
                    });
                  }
                }}
                className="rounded"
              />
              <span>{category.name}</span>
            </label>
          ))}
        </div>
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

      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {coupon ? "Update Coupon" : "Create Coupon"}
        </Button>
      </div>
    </form>
  );
}
