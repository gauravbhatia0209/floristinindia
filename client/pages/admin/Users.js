"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Users;
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var button_1 = require("@/components/ui/button");
var card_1 = require("@/components/ui/card");
var input_1 = require("@/components/ui/input");
var label_1 = require("@/components/ui/label");
var switch_1 = require("@/components/ui/switch");
var badge_1 = require("@/components/ui/badge");
var dialog_1 = require("@/components/ui/dialog");
var select_1 = require("@/components/ui/select");
var tabs_1 = require("@/components/ui/tabs");
var supabase_1 = require("@/lib/supabase");
var defaultPermissions = {
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
var rolePermissions = {
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
};
function Users() {
    var _a = (0, react_1.useState)([]), users = _a[0], setUsers = _a[1];
    var _b = (0, react_1.useState)(true), isLoading = _b[0], setIsLoading = _b[1];
    var _c = (0, react_1.useState)(null), editingUser = _c[0], setEditingUser = _c[1];
    var _d = (0, react_1.useState)(false), isAddingUser = _d[0], setIsAddingUser = _d[1];
    (0, react_1.useEffect)(function () {
        fetchUsers();
    }, []);
    function fetchUsers() {
        return __awaiter(this, void 0, void 0, function () {
            var data, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, 3, 4]);
                        return [4 /*yield*/, supabase_1.supabase
                                .from("sub_users")
                                .select("*")
                                .order("created_at", { ascending: false })];
                    case 1:
                        data = (_a.sent()).data;
                        if (data) {
                            setUsers(data);
                        }
                        return [3 /*break*/, 4];
                    case 2:
                        error_1 = _a.sent();
                        console.error("Failed to fetch users:", error_1);
                        return [3 /*break*/, 4];
                    case 3:
                        setIsLoading(false);
                        return [7 /*endfinally*/];
                    case 4: return [2 /*return*/];
                }
            });
        });
    }
    function saveUser(userData) {
        return __awaiter(this, void 0, void 0, function () {
            var error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        if (!editingUser) return [3 /*break*/, 2];
                        return [4 /*yield*/, supabase_1.supabase
                                .from("sub_users")
                                .update(userData)
                                .eq("id", editingUser.id)];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, supabase_1.supabase.from("sub_users").insert(userData)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        fetchUsers();
                        setEditingUser(null);
                        setIsAddingUser(false);
                        return [3 /*break*/, 6];
                    case 5:
                        error_2 = _a.sent();
                        console.error("Failed to save user:", error_2);
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    }
    function deleteUser(userId) {
        return __awaiter(this, void 0, void 0, function () {
            var error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!confirm("Are you sure you want to delete this user?"))
                            return [2 /*return*/];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, supabase_1.supabase.from("sub_users").delete().eq("id", userId)];
                    case 2:
                        _a.sent();
                        fetchUsers();
                        return [3 /*break*/, 4];
                    case 3:
                        error_3 = _a.sent();
                        console.error("Failed to delete user:", error_3);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    }
    function toggleUserStatus(userId, isActive) {
        return __awaiter(this, void 0, void 0, function () {
            var error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, supabase_1.supabase
                                .from("sub_users")
                                .update({ is_active: !isActive })
                                .eq("id", userId)];
                    case 1:
                        _a.sent();
                        fetchUsers();
                        return [3 /*break*/, 3];
                    case 2:
                        error_4 = _a.sent();
                        console.error("Failed to toggle user status:", error_4);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    }
    function getRoleIcon(role) {
        switch (role) {
            case "admin":
                return lucide_react_1.Crown;
            case "manager":
                return lucide_react_1.Shield;
            case "editor":
                return lucide_react_1.Edit;
            case "viewer":
                return lucide_react_1.Eye;
            default:
                return lucide_react_1.User;
        }
    }
    function getRoleColor(role) {
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
    function formatDate(dateString) {
        return new Date(dateString).toLocaleDateString("en-IN", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    }
    if (isLoading) {
        return (<div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded animate-pulse w-48"></div>
        <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
      </div>);
    }
    var stats = {
        total: users.length,
        active: users.filter(function (u) { return u.is_active; }).length,
        admins: users.filter(function (u) { return u.role === "admin"; }).length,
        managers: users.filter(function (u) { return u.role === "manager"; }).length,
    };
    return (<div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">User Management</h1>
          <p className="text-muted-foreground">
            Manage admin users and their permissions
          </p>
        </div>
        <button_1.Button onClick={function () { return setIsAddingUser(true); }}>
          <lucide_react_1.Plus className="w-4 h-4 mr-2"/>
          Add User
        </button_1.Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <card_1.Card>
          <card_1.CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <lucide_react_1.UserCog className="w-8 h-8 text-muted-foreground"/>
            </div>
          </card_1.CardContent>
        </card_1.Card>
        <card_1.Card>
          <card_1.CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.active}
                </p>
              </div>
              <lucide_react_1.Eye className="w-8 h-8 text-green-600"/>
            </div>
          </card_1.CardContent>
        </card_1.Card>
        <card_1.Card>
          <card_1.CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Admins</p>
                <p className="text-2xl font-bold text-red-600">
                  {stats.admins}
                </p>
              </div>
              <lucide_react_1.Crown className="w-8 h-8 text-red-600"/>
            </div>
          </card_1.CardContent>
        </card_1.Card>
        <card_1.Card>
          <card_1.CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Managers</p>
                <p className="text-2xl font-bold text-blue-600">
                  {stats.managers}
                </p>
              </div>
              <lucide_react_1.Shield className="w-8 h-8 text-blue-600"/>
            </div>
          </card_1.CardContent>
        </card_1.Card>
      </div>

      {/* Users List */}
      <card_1.Card>
        <card_1.CardHeader>
          <card_1.CardTitle>All Users</card_1.CardTitle>
        </card_1.CardHeader>
        <card_1.CardContent>
          {users.length === 0 ? (<div className="text-center py-12">
              <lucide_react_1.UserCog className="w-12 h-12 mx-auto mb-4 text-muted-foreground"/>
              <h3 className="text-lg font-semibold mb-2">No users yet</h3>
              <p className="text-muted-foreground mb-4">
                Add your first admin user to get started
              </p>
              <button_1.Button onClick={function () { return setIsAddingUser(true); }}>
                <lucide_react_1.Plus className="w-4 h-4 mr-2"/>
                Add User
              </button_1.Button>
            </div>) : (<div className="space-y-4">
              {users.map(function (user) {
                var RoleIcon = getRoleIcon(user.role);
                return (<div key={user.id} className="border rounded-lg p-4">
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
                          <badge_1.Badge className={getRoleColor(user.role)}>
                            <RoleIcon className="w-3 h-3 mr-1"/>
                            {user.role.toUpperCase()}
                          </badge_1.Badge>
                          <badge_1.Badge variant={user.is_active ? "default" : "secondary"}>
                            {user.is_active ? "Active" : "Inactive"}
                          </badge_1.Badge>
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
                              {Object.values(user.permissions).filter(function (perm) {
                        return Object.values(perm).some(function (val) { return val === true; });
                    }).length}{" "}
                              modules
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <switch_1.Switch checked={user.is_active} onCheckedChange={function () {
                        return toggleUserStatus(user.id, user.is_active);
                    }}/>
                        <button_1.Button variant="ghost" size="icon" onClick={function () { return setEditingUser(user); }}>
                          <lucide_react_1.Edit className="w-4 h-4"/>
                        </button_1.Button>
                        <button_1.Button variant="ghost" size="icon" onClick={function () { return deleteUser(user.id); }}>
                          <lucide_react_1.Trash2 className="w-4 h-4 text-red-600"/>
                        </button_1.Button>
                      </div>
                    </div>
                  </div>);
            })}
            </div>)}
        </card_1.CardContent>
      </card_1.Card>

      {/* Add/Edit User Dialog */}
      <dialog_1.Dialog open={isAddingUser || !!editingUser} onOpenChange={function () {
            setIsAddingUser(false);
            setEditingUser(null);
        }}>
        <dialog_1.DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <dialog_1.DialogHeader>
            <dialog_1.DialogTitle>
              {editingUser ? "Edit User" : "Add New User"}
            </dialog_1.DialogTitle>
          </dialog_1.DialogHeader>
          <UserForm user={editingUser} onSave={saveUser} onCancel={function () {
            setIsAddingUser(false);
            setEditingUser(null);
        }}/>
        </dialog_1.DialogContent>
      </dialog_1.Dialog>
    </div>);
}
// User Form Component
function UserForm(_a) {
    var _b;
    var user = _a.user, onSave = _a.onSave, onCancel = _a.onCancel;
    var _c = (0, react_1.useState)({
        first_name: (user === null || user === void 0 ? void 0 : user.first_name) || "",
        last_name: (user === null || user === void 0 ? void 0 : user.last_name) || "",
        email: (user === null || user === void 0 ? void 0 : user.email) || "",
        role: (user === null || user === void 0 ? void 0 : user.role) || "viewer",
        permissions: (user === null || user === void 0 ? void 0 : user.permissions) || defaultPermissions,
        is_active: (_b = user === null || user === void 0 ? void 0 : user.is_active) !== null && _b !== void 0 ? _b : true,
    }), formData = _c[0], setFormData = _c[1];
    function handleRoleChange(role) {
        setFormData(__assign(__assign({}, formData), { role: role, permissions: rolePermissions[role] || defaultPermissions }));
    }
    function updatePermission(module, action, value) {
        var _a, _b;
        setFormData(__assign(__assign({}, formData), { permissions: __assign(__assign({}, formData.permissions), (_a = {}, _a[module] = __assign(__assign({}, formData.permissions[module]), (_b = {}, _b[action] = value, _b)), _a)) }));
    }
    function handleSubmit(e) {
        e.preventDefault();
        onSave(formData);
    }
    return (<form onSubmit={handleSubmit} className="space-y-6">
      <tabs_1.Tabs defaultValue="basic" className="w-full">
        <tabs_1.TabsList className="grid w-full grid-cols-2">
          <tabs_1.TabsTrigger value="basic">Basic Information</tabs_1.TabsTrigger>
          <tabs_1.TabsTrigger value="permissions">Permissions</tabs_1.TabsTrigger>
        </tabs_1.TabsList>

        <tabs_1.TabsContent value="basic" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label_1.Label htmlFor="first_name">First Name</label_1.Label>
              <input_1.Input id="first_name" value={formData.first_name} onChange={function (e) {
            return setFormData(__assign(__assign({}, formData), { first_name: e.target.value }));
        }} placeholder="John" required/>
            </div>
            <div>
              <label_1.Label htmlFor="last_name">Last Name</label_1.Label>
              <input_1.Input id="last_name" value={formData.last_name} onChange={function (e) {
            return setFormData(__assign(__assign({}, formData), { last_name: e.target.value }));
        }} placeholder="Doe" required/>
            </div>
          </div>

          <div>
            <label_1.Label htmlFor="email">Email Address</label_1.Label>
            <input_1.Input id="email" type="email" value={formData.email} onChange={function (e) {
            return setFormData(__assign(__assign({}, formData), { email: e.target.value }));
        }} placeholder="john@example.com" required/>
          </div>

          <div>
            <label_1.Label htmlFor="role">Role</label_1.Label>
            <select_1.Select value={formData.role} onValueChange={handleRoleChange}>
              <select_1.SelectTrigger>
                <select_1.SelectValue />
              </select_1.SelectTrigger>
              <select_1.SelectContent>
                <select_1.SelectItem value="admin">Admin - Full Access</select_1.SelectItem>
                <select_1.SelectItem value="manager">Manager - Most Features</select_1.SelectItem>
                <select_1.SelectItem value="editor">Editor - Content Only</select_1.SelectItem>
                <select_1.SelectItem value="viewer">Viewer - Read Only</select_1.SelectItem>
              </select_1.SelectContent>
            </select_1.Select>
          </div>

          <div className="flex items-center space-x-2">
            <switch_1.Switch id="is_active" checked={formData.is_active} onCheckedChange={function (checked) {
            return setFormData(__assign(__assign({}, formData), { is_active: checked }));
        }}/>
            <label_1.Label htmlFor="is_active">Active</label_1.Label>
          </div>
        </tabs_1.TabsContent>

        <tabs_1.TabsContent value="permissions" className="space-y-6">
          <div className="text-sm text-muted-foreground">
            Role-based permissions have been applied. You can customize them
            below.
          </div>

          {Object.entries(formData.permissions).map(function (_a) {
            var module = _a[0], permissions = _a[1];
            return (<card_1.Card key={module}>
              <card_1.CardHeader className="pb-2">
                <card_1.CardTitle className="text-base capitalize">
                  {module.replace("_", " ")} Module
                </card_1.CardTitle>
              </card_1.CardHeader>
              <card_1.CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(permissions).map(function (_a) {
                    var action = _a[0], allowed = _a[1];
                    return (<div key={action} className="flex items-center space-x-2">
                      <switch_1.Switch id={"".concat(module, "-").concat(action)} checked={allowed} onCheckedChange={function (checked) {
                            return updatePermission(module, action, checked);
                        }}/>
                      <label_1.Label htmlFor={"".concat(module, "-").concat(action)} className="text-sm capitalize">
                        {action}
                      </label_1.Label>
                    </div>);
                })}
                </div>
              </card_1.CardContent>
            </card_1.Card>);
        })}
        </tabs_1.TabsContent>
      </tabs_1.Tabs>

      <div className="flex justify-end gap-2 pt-4 border-t">
        <button_1.Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </button_1.Button>
        <button_1.Button type="submit">{user ? "Update User" : "Create User"}</button_1.Button>
      </div>
    </form>);
}
