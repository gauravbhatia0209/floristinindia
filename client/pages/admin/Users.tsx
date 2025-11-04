import { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  UserCog,
  Shield,
  Eye,
  EyeOff,
  Crown,
  User,
} from "lucide-react";
import bcrypt from "bcryptjs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { supabase } from "@/lib/supabase";
import { SubUser, UserPermissions } from "@shared/database.types";

const defaultPermissions: UserPermissions = {
  products: { view: false, create: false, edit: false, delete: false },
  orders: { view: false, create: false, edit: false, delete: false },
  customers: { view: false, create: false, edit: false, delete: false },
  categories: { view: false, create: false, edit: false, delete: false },
  coupons: { view: false, create: false, edit: false, delete: false },
  shipping: { view: false, create: false, edit: false, delete: false },
  pages: { view: false, create: false, edit: false, delete: false },
  homepage: { view: false, edit: false },
  settings: { view: false, edit: false },
  users: { view: false, create: false, edit: false, delete: false },
};

const rolePermissions: Record<string, UserPermissions> = {
  admin: {
    products: { view: true, create: true, edit: true, delete: true },
    orders: { view: true, create: true, edit: true, delete: true },
    customers: { view: true, create: true, edit: true, delete: true },
    categories: { view: true, create: true, edit: true, delete: true },
    coupons: { view: true, create: true, edit: true, delete: true },
    shipping: { view: true, create: true, edit: true, delete: true },
    pages: { view: true, create: true, edit: true, delete: true },
    homepage: { view: true, edit: true },
    settings: { view: true, edit: true },
    users: { view: true, create: true, edit: true, delete: true },
  },
  manager: {
    products: { view: true, create: true, edit: true, delete: false },
    orders: { view: true, create: false, edit: true, delete: false },
    customers: { view: true, create: false, edit: true, delete: false },
    categories: { view: true, create: true, edit: true, delete: false },
    coupons: { view: true, create: true, edit: true, delete: false },
    shipping: { view: true, create: true, edit: true, delete: false },
    pages: { view: true, create: true, edit: true, delete: false },
    homepage: { view: true, edit: true },
    settings: { view: true, edit: false },
    users: { view: true, create: false, edit: false, delete: false },
  },
  editor: {
    products: { view: true, create: true, edit: true, delete: false },
    orders: { view: true, create: false, edit: false, delete: false },
    customers: { view: true, create: false, edit: false, delete: false },
    categories: { view: true, create: false, edit: true, delete: false },
    coupons: { view: true, create: false, edit: false, delete: false },
    shipping: { view: true, create: false, edit: false, delete: false },
    pages: { view: true, create: true, edit: true, delete: false },
    homepage: { view: true, edit: true },
    settings: { view: false, edit: false },
    users: { view: false, create: false, edit: false, delete: false },
  },
  viewer: {
    products: { view: true, create: false, edit: false, delete: false },
    orders: { view: true, create: false, edit: false, delete: false },
    customers: { view: true, create: false, edit: false, delete: false },
    categories: { view: true, create: false, edit: false, delete: false },
    coupons: { view: true, create: false, edit: false, delete: false },
    shipping: { view: true, create: false, edit: false, delete: false },
    pages: { view: true, create: false, edit: false, delete: false },
    homepage: { view: true, edit: false },
    settings: { view: false, edit: false },
    users: { view: false, create: false, edit: false, delete: false },
  },
  order_manager: {
    products: { view: true, create: false, edit: false, delete: false },
    orders: { view: true, create: false, edit: true, delete: false },
    customers: { view: false, create: false, edit: false, delete: false },
    categories: { view: false, create: false, edit: false, delete: false },
    coupons: { view: false, create: false, edit: false, delete: false },
    shipping: { view: false, create: false, edit: false, delete: false },
    pages: { view: false, create: false, edit: false, delete: false },
    homepage: { view: false, edit: false },
    settings: { view: false, edit: false },
    users: { view: false, create: false, edit: false, delete: false },
  },
};

export default function Users() {
  const [users, setUsers] = useState<SubUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<SubUser | null>(null);
  const [isAddingUser, setIsAddingUser] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      const { data } = await supabase
        .from("sub_users")
        .select("*")
        .order("created_at", { ascending: false });

      if (data) {
        setUsers(data);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function saveUser(userData: Partial<SubUser>) {
    try {
      // Hash password if it's provided
      let dataToSave = { ...userData };
      if (userData.password && userData.password.trim()) {
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
        dataToSave.password = hashedPassword;
      }

      if (editingUser) {
        await supabase
          .from("sub_users")
          .update(dataToSave)
          .eq("id", editingUser.id);
      } else {
        await supabase.from("sub_users").insert(dataToSave);
      }

      fetchUsers();
      setEditingUser(null);
      setIsAddingUser(false);
    } catch (error) {
      console.error("Failed to save user:", error);
    }
  }

  async function deleteUser(userId: string) {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      await supabase.from("sub_users").delete().eq("id", userId);
      fetchUsers();
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  }

  async function toggleUserStatus(userId: string, isActive: boolean) {
    try {
      await supabase
        .from("sub_users")
        .update({ is_active: !isActive })
        .eq("id", userId);
      fetchUsers();
    } catch (error) {
      console.error("Failed to toggle user status:", error);
    }
  }

  function getRoleIcon(role: string) {
    switch (role) {
      case "admin":
        return Crown;
      case "manager":
        return Shield;
      case "editor":
        return Edit;
      case "viewer":
        return Eye;
      default:
        return User;
    }
  }

  function getRoleColor(role: string) {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800";
      case "manager":
        return "bg-blue-100 text-blue-800";
      case "editor":
        return "bg-green-100 text-green-800";
      case "viewer":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
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
    total: users.length,
    active: users.filter((u) => u.is_active).length,
    admins: users.filter((u) => u.role === "admin").length,
    managers: users.filter((u) => u.role === "manager").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">User Management</h1>
          <p className="text-muted-foreground">
            Manage admin users and their permissions
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setIsAddingUser(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <UserCog className="w-8 h-8 text-muted-foreground" />
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
              <Eye className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Admins</p>
                <p className="text-2xl font-bold text-red-600">
                  {stats.admins}
                </p>
              </div>
              <Crown className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Managers</p>
                <p className="text-2xl font-bold text-blue-600">
                  {stats.managers}
                </p>
              </div>
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users List */}
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
        </CardHeader>
        <CardContent>
          {users.length === 0 ? (
            <div className="text-center py-12">
              <UserCog className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No users yet</h3>
              <p className="text-muted-foreground mb-4">
                Add your first admin user to get started
              </p>
              <Button onClick={() => setIsAddingUser(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add User
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {users.map((user) => {
                const RoleIcon = getRoleIcon(user.role);
                return (
                  <div key={user.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-gradient-rose rounded-full flex items-center justify-center text-white font-semibold">
                            {user.first_name.charAt(0)}
                            {user.last_name.charAt(0)}
                          </div>
                          <div>
                            <h3 className="font-semibold">
                              {user.first_name} {user.last_name}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {user.email}
                            </p>
                          </div>
                          <Badge className={getRoleColor(user.role)}>
                            <RoleIcon className="w-3 h-3 mr-1" />
                            {user.role.toUpperCase()}
                          </Badge>
                          <Badge
                            variant={user.is_active ? "default" : "secondary"}
                          >
                            {user.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="font-medium">Joined</p>
                            <p>{formatDate(user.created_at)}</p>
                          </div>
                          <div>
                            <p className="font-medium">Last Login</p>
                            <p>
                              {user.last_login
                                ? formatDate(user.last_login)
                                : "Never"}
                            </p>
                          </div>
                          <div>
                            <p className="font-medium">Permissions</p>
                            <p className="text-muted-foreground">
                              {
                                Object.values(user.permissions).filter(
                                  (perm: any) =>
                                    Object.values(perm).some(
                                      (val) => val === true,
                                    ),
                                ).length
                              }{" "}
                              modules
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Switch
                          checked={user.is_active}
                          onCheckedChange={() =>
                            toggleUserStatus(user.id, user.is_active)
                          }
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setEditingUser(user)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteUser(user.id)}
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit User Dialog */}
      <Dialog
        open={isAddingUser || !!editingUser}
        onOpenChange={() => {
          setIsAddingUser(false);
          setEditingUser(null);
        }}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingUser ? "Edit User" : "Add New User"}
            </DialogTitle>
          </DialogHeader>
          <UserForm
            user={editingUser}
            onSave={saveUser}
            onCancel={() => {
              setIsAddingUser(false);
              setEditingUser(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

// User Form Component
function UserForm({
  user,
  onSave,
  onCancel,
}: {
  user: SubUser | null;
  onSave: (data: Partial<SubUser>) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    email: user?.email || "",
    password: user?.password || "",
    role: user?.role || ("viewer" as const),
    permissions: user?.permissions || defaultPermissions,
    is_active: user?.is_active ?? true,
  });
  const [showPassword, setShowPassword] = useState(false);

  function handleRoleChange(role: string) {
    setFormData({
      ...formData,
      role: role as any,
      permissions: rolePermissions[role] || defaultPermissions,
    });
  }

  function updatePermission(
    module: keyof UserPermissions,
    action: string,
    value: boolean,
  ) {
    setFormData({
      ...formData,
      permissions: {
        ...formData.permissions,
        [module]: {
          ...formData.permissions[module],
          [action]: value,
        },
      },
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // If editing a user and password is empty, keep the existing password
    const dataToSave = { ...formData };
    if (user && !formData.password) {
      dataToSave.password = user.password;
    }

    onSave(dataToSave);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="basic">Basic Information</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="first_name">First Name</Label>
              <Input
                id="first_name"
                value={formData.first_name}
                onChange={(e) =>
                  setFormData({ ...formData, first_name: e.target.value })
                }
                placeholder="John"
                required
              />
            </div>
            <div>
              <Label htmlFor="last_name">Last Name</Label>
              <Input
                id="last_name"
                value={formData.last_name}
                onChange={(e) =>
                  setFormData({ ...formData, last_name: e.target.value })
                }
                placeholder="Doe"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="john@example.com"
              required
            />
          </div>

          <div>
            <Label htmlFor="password">
              Password {user && "(Leave blank to keep current)"}
            </Label>
            <div className="flex gap-2">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder={user ? "Enter new password" : "Enter password"}
                required={!user}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Password will be securely hashed and cannot be displayed
            </p>
          </div>

          <div>
            <Label htmlFor="role">Role</Label>
            <Select value={formData.role} onValueChange={handleRoleChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin - Full Access</SelectItem>
                <SelectItem value="manager">Manager - Most Features</SelectItem>
                <SelectItem value="order_manager">Order Manager - Order & Product Management</SelectItem>
                <SelectItem value="editor">Editor - Content Only</SelectItem>
                <SelectItem value="viewer">Viewer - Read Only</SelectItem>
              </SelectContent>
            </Select>
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
        </TabsContent>

        <TabsContent value="permissions" className="space-y-6">
          <div className="text-sm text-muted-foreground">
            Role-based permissions have been applied. You can customize them
            below.
          </div>

          {Object.entries(formData.permissions).map(([module, permissions]) => (
            <Card key={module}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base capitalize">
                  {module.replace("_", " ")} Module
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(permissions).map(([action, allowed]) => (
                    <div key={action} className="flex items-center space-x-2">
                      <Switch
                        id={`${module}-${action}`}
                        checked={allowed}
                        onCheckedChange={(checked) =>
                          updatePermission(
                            module as keyof UserPermissions,
                            action,
                            checked,
                          )
                        }
                      />
                      <Label
                        htmlFor={`${module}-${action}`}
                        className="text-sm capitalize"
                      >
                        {action}
                      </Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{user ? "Update User" : "Create User"}</Button>
      </div>
    </form>
  );
}
