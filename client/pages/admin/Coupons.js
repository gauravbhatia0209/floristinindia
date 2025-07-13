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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Coupons;
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var button_1 = require("@/components/ui/button");
var card_1 = require("@/components/ui/card");
var input_1 = require("@/components/ui/input");
var label_1 = require("@/components/ui/label");
var textarea_1 = require("@/components/ui/textarea");
var switch_1 = require("@/components/ui/switch");
var badge_1 = require("@/components/ui/badge");
var dialog_1 = require("@/components/ui/dialog");
var select_1 = require("@/components/ui/select");
var supabase_1 = require("@/lib/supabase");
function Coupons() {
    var _a = (0, react_1.useState)([]), coupons = _a[0], setCoupons = _a[1];
    var _b = (0, react_1.useState)([]), categories = _b[0], setCategories = _b[1];
    var _c = (0, react_1.useState)(true), isLoading = _c[0], setIsLoading = _c[1];
    var _d = (0, react_1.useState)(null), editingCoupon = _d[0], setEditingCoupon = _d[1];
    var _e = (0, react_1.useState)(false), isAddingCoupon = _e[0], setIsAddingCoupon = _e[1];
    (0, react_1.useEffect)(function () {
        fetchCoupons();
        fetchCategories();
    }, []);
    function fetchCoupons() {
        return __awaiter(this, void 0, void 0, function () {
            var data, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, 3, 4]);
                        return [4 /*yield*/, supabase_1.supabase
                                .from("coupons")
                                .select("*")
                                .order("created_at", { ascending: false })];
                    case 1:
                        data = (_a.sent()).data;
                        if (data) {
                            setCoupons(data);
                        }
                        return [3 /*break*/, 4];
                    case 2:
                        error_1 = _a.sent();
                        console.error("Failed to fetch coupons:", error_1);
                        return [3 /*break*/, 4];
                    case 3:
                        setIsLoading(false);
                        return [7 /*endfinally*/];
                    case 4: return [2 /*return*/];
                }
            });
        });
    }
    function fetchCategories() {
        return __awaiter(this, void 0, void 0, function () {
            var data, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, supabase_1.supabase
                                .from("product_categories")
                                .select("id, name")
                                .eq("is_active", true)
                                .order("name")];
                    case 1:
                        data = (_a.sent()).data;
                        if (data) {
                            setCategories(data);
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _a.sent();
                        console.error("Failed to fetch categories:", error_2);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    }
    function saveCoupon(couponData) {
        return __awaiter(this, void 0, void 0, function () {
            var error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        if (!editingCoupon) return [3 /*break*/, 2];
                        return [4 /*yield*/, supabase_1.supabase
                                .from("coupons")
                                .update(couponData)
                                .eq("id", editingCoupon.id)];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, supabase_1.supabase.from("coupons").insert(couponData)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        fetchCoupons();
                        setEditingCoupon(null);
                        setIsAddingCoupon(false);
                        return [3 /*break*/, 6];
                    case 5:
                        error_3 = _a.sent();
                        console.error("Failed to save coupon:", error_3);
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    }
    function deleteCoupon(couponId) {
        return __awaiter(this, void 0, void 0, function () {
            var error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!confirm("Are you sure you want to delete this coupon?"))
                            return [2 /*return*/];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, supabase_1.supabase.from("coupons").delete().eq("id", couponId)];
                    case 2:
                        _a.sent();
                        fetchCoupons();
                        return [3 /*break*/, 4];
                    case 3:
                        error_4 = _a.sent();
                        console.error("Failed to delete coupon:", error_4);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    }
    function toggleCouponStatus(couponId, isActive) {
        return __awaiter(this, void 0, void 0, function () {
            var error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, supabase_1.supabase
                                .from("coupons")
                                .update({ is_active: !isActive })
                                .eq("id", couponId)];
                    case 1:
                        _a.sent();
                        fetchCoupons();
                        return [3 /*break*/, 3];
                    case 2:
                        error_5 = _a.sent();
                        console.error("Failed to toggle coupon status:", error_5);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    }
    function formatDate(dateString) {
        return new Date(dateString).toLocaleDateString("en-IN", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    }
    function getCouponStatus(coupon) {
        if (!coupon.is_active)
            return { status: "Inactive", color: "secondary" };
        var now = new Date();
        var startsAt = coupon.starts_at ? new Date(coupon.starts_at) : null;
        var expiresAt = coupon.expires_at ? new Date(coupon.expires_at) : null;
        if (startsAt && now < startsAt)
            return { status: "Scheduled", color: "outline" };
        if (expiresAt && now > expiresAt)
            return { status: "Expired", color: "destructive" };
        if (coupon.usage_limit && coupon.usage_count >= coupon.usage_limit)
            return { status: "Limit Reached", color: "destructive" };
        return { status: "Active", color: "default" };
    }
    if (isLoading) {
        return (<div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded animate-pulse w-48"></div>
        <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
      </div>);
    }
    var stats = {
        total: coupons.length,
        active: coupons.filter(function (c) { return c.is_active; }).length,
        expired: coupons.filter(function (c) {
            var now = new Date();
            return c.expires_at && new Date(c.expires_at) < now;
        }).length,
        totalUsage: coupons.reduce(function (sum, c) { return sum + c.usage_count; }, 0),
    };
    return (<div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Coupon Management</h1>
          <p className="text-muted-foreground">
            Create and manage discount coupons
          </p>
        </div>
        <button_1.Button onClick={function () { return setIsAddingCoupon(true); }}>
          <lucide_react_1.Plus className="w-4 h-4 mr-2"/>
          Add Coupon
        </button_1.Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <card_1.Card>
          <card_1.CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Coupons</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <lucide_react_1.Ticket className="w-8 h-8 text-muted-foreground"/>
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
              <lucide_react_1.Ticket className="w-8 h-8 text-green-600"/>
            </div>
          </card_1.CardContent>
        </card_1.Card>
        <card_1.Card>
          <card_1.CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Expired</p>
                <p className="text-2xl font-bold text-red-600">
                  {stats.expired}
                </p>
              </div>
              <lucide_react_1.Calendar className="w-8 h-8 text-red-600"/>
            </div>
          </card_1.CardContent>
        </card_1.Card>
        <card_1.Card>
          <card_1.CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Usage</p>
                <p className="text-2xl font-bold">{stats.totalUsage}</p>
              </div>
              <lucide_react_1.Users className="w-8 h-8 text-blue-600"/>
            </div>
          </card_1.CardContent>
        </card_1.Card>
      </div>

      {/* Coupons List */}
      <card_1.Card>
        <card_1.CardHeader>
          <card_1.CardTitle>All Coupons</card_1.CardTitle>
        </card_1.CardHeader>
        <card_1.CardContent>
          {coupons.length === 0 ? (<div className="text-center py-12">
              <lucide_react_1.Ticket className="w-12 h-12 mx-auto mb-4 text-muted-foreground"/>
              <h3 className="text-lg font-semibold mb-2">No coupons yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first discount coupon to boost sales
              </p>
              <button_1.Button onClick={function () { return setIsAddingCoupon(true); }}>
                <lucide_react_1.Plus className="w-4 h-4 mr-2"/>
                Add Coupon
              </button_1.Button>
            </div>) : (<div className="space-y-4">
              {coupons.map(function (coupon) {
                var statusInfo = getCouponStatus(coupon);
                return (<div key={coupon.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-gradient-rose rounded-lg flex items-center justify-center">
                            {coupon.discount_type === "percentage" ? (<lucide_react_1.Percent className="w-5 h-5 text-white"/>) : (<lucide_react_1.IndianRupee className="w-5 h-5 text-white"/>)}
                          </div>
                          <div>
                            <h3 className="font-semibold">{coupon.name}</h3>
                            <p className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                              {coupon.code}
                            </p>
                          </div>
                          <badge_1.Badge variant={statusInfo.color}>
                            {statusInfo.status}
                          </badge_1.Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="font-medium">Discount</p>
                            <p>
                              {coupon.discount_type === "percentage"
                        ? "".concat(coupon.discount_value, "%")
                        : "\u20B9".concat(coupon.discount_value)}
                              {coupon.maximum_discount_amount &&
                        coupon.discount_type === "percentage" &&
                        " (max \u20B9".concat(coupon.maximum_discount_amount, ")")}
                            </p>
                          </div>

                          <div>
                            <p className="font-medium">Usage</p>
                            <p>
                              {coupon.usage_count}
                              {coupon.usage_limit
                        ? " / ".concat(coupon.usage_limit)
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
                        ? "\u20B9".concat(coupon.minimum_order_amount)
                        : "No minimum"}
                            </p>
                          </div>
                        </div>

                        {coupon.description && (<p className="text-sm text-muted-foreground mt-2">
                            {coupon.description}
                          </p>)}
                      </div>

                      <div className="flex items-center gap-2">
                        <switch_1.Switch checked={coupon.is_active} onCheckedChange={function () {
                        return toggleCouponStatus(coupon.id, coupon.is_active);
                    }}/>
                        <button_1.Button variant="ghost" size="icon" onClick={function () { return setEditingCoupon(coupon); }}>
                          <lucide_react_1.Edit className="w-4 h-4"/>
                        </button_1.Button>
                        <button_1.Button variant="ghost" size="icon" onClick={function () { return deleteCoupon(coupon.id); }}>
                          <lucide_react_1.Trash2 className="w-4 h-4 text-red-600"/>
                        </button_1.Button>
                      </div>
                    </div>
                  </div>);
            })}
            </div>)}
        </card_1.CardContent>
      </card_1.Card>

      {/* Add/Edit Coupon Dialog */}
      <dialog_1.Dialog open={isAddingCoupon || !!editingCoupon} onOpenChange={function () {
            setIsAddingCoupon(false);
            setEditingCoupon(null);
        }}>
        <dialog_1.DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <dialog_1.DialogHeader>
            <dialog_1.DialogTitle>
              {editingCoupon ? "Edit Coupon" : "Create New Coupon"}
            </dialog_1.DialogTitle>
          </dialog_1.DialogHeader>
          <CouponForm coupon={editingCoupon} categories={categories} onSave={saveCoupon} onCancel={function () {
            setIsAddingCoupon(false);
            setEditingCoupon(null);
        }}/>
        </dialog_1.DialogContent>
      </dialog_1.Dialog>
    </div>);
}
// Coupon Form Component
function CouponForm(_a) {
    var _b, _c, _d, _e, _f, _g, _h;
    var coupon = _a.coupon, categories = _a.categories, onSave = _a.onSave, onCancel = _a.onCancel;
    var _j = (0, react_1.useState)({
        code: (coupon === null || coupon === void 0 ? void 0 : coupon.code) || "",
        name: (coupon === null || coupon === void 0 ? void 0 : coupon.name) || "",
        description: (coupon === null || coupon === void 0 ? void 0 : coupon.description) || "",
        discount_type: (coupon === null || coupon === void 0 ? void 0 : coupon.discount_type) || "flat",
        discount_value: ((_b = coupon === null || coupon === void 0 ? void 0 : coupon.discount_value) === null || _b === void 0 ? void 0 : _b.toString()) || "",
        minimum_order_amount: ((_c = coupon === null || coupon === void 0 ? void 0 : coupon.minimum_order_amount) === null || _c === void 0 ? void 0 : _c.toString()) || "",
        maximum_discount_amount: ((_d = coupon === null || coupon === void 0 ? void 0 : coupon.maximum_discount_amount) === null || _d === void 0 ? void 0 : _d.toString()) || "",
        usage_limit: ((_e = coupon === null || coupon === void 0 ? void 0 : coupon.usage_limit) === null || _e === void 0 ? void 0 : _e.toString()) || "",
        starts_at: ((_f = coupon === null || coupon === void 0 ? void 0 : coupon.starts_at) === null || _f === void 0 ? void 0 : _f.split("T")[0]) || "",
        expires_at: ((_g = coupon === null || coupon === void 0 ? void 0 : coupon.expires_at) === null || _g === void 0 ? void 0 : _g.split("T")[0]) || "",
        applicable_categories: (coupon === null || coupon === void 0 ? void 0 : coupon.applicable_categories) || [],
        is_active: (_h = coupon === null || coupon === void 0 ? void 0 : coupon.is_active) !== null && _h !== void 0 ? _h : true,
    }), formData = _j[0], setFormData = _j[1];
    // Auto-generate code from name
    (0, react_1.useEffect)(function () {
        if (!coupon && formData.name) {
            var code_1 = formData.name
                .toUpperCase()
                .replace(/[^A-Z0-9]/g, "")
                .substring(0, 10);
            setFormData(function (prev) { return (__assign(__assign({}, prev), { code: code_1 })); });
        }
    }, [formData.name, coupon]);
    function handleSubmit(e) {
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
    return (<form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Basic Information</h3>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label_1.Label htmlFor="name">Coupon Name</label_1.Label>
            <input_1.Input id="name" value={formData.name} onChange={function (e) {
            return setFormData(__assign(__assign({}, formData), { name: e.target.value }));
        }} placeholder="New Year Sale" required/>
          </div>
          <div>
            <label_1.Label htmlFor="code">Coupon Code</label_1.Label>
            <input_1.Input id="code" value={formData.code} onChange={function (e) {
            return setFormData(__assign(__assign({}, formData), { code: e.target.value.toUpperCase() }));
        }} placeholder="NEWYEAR50" required/>
          </div>
        </div>

        <div>
          <label_1.Label htmlFor="description">Description</label_1.Label>
          <textarea_1.Textarea id="description" value={formData.description} onChange={function (e) {
            return setFormData(__assign(__assign({}, formData), { description: e.target.value }));
        }} placeholder="Special discount for new year celebration" rows={2}/>
        </div>
      </div>

      {/* Discount Configuration */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Discount Configuration</h3>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label_1.Label htmlFor="discount_type">Discount Type</label_1.Label>
            <select_1.Select value={formData.discount_type} onValueChange={function (value) {
            return setFormData(__assign(__assign({}, formData), { discount_type: value }));
        }}>
              <select_1.SelectTrigger>
                <select_1.SelectValue />
              </select_1.SelectTrigger>
              <select_1.SelectContent>
                <select_1.SelectItem value="flat">Fixed Amount (₹)</select_1.SelectItem>
                <select_1.SelectItem value="percentage">Percentage (%)</select_1.SelectItem>
              </select_1.SelectContent>
            </select_1.Select>
          </div>
          <div>
            <label_1.Label htmlFor="discount_value">
              Discount Value{" "}
              {formData.discount_type === "percentage" ? "(%)" : "(₹)"}
            </label_1.Label>
            <input_1.Input id="discount_value" type="number" step="0.01" value={formData.discount_value} onChange={function (e) {
            return setFormData(__assign(__assign({}, formData), { discount_value: e.target.value }));
        }} placeholder={formData.discount_type === "percentage" ? "20" : "500"} required/>
          </div>
          {formData.discount_type === "percentage" && (<div>
              <label_1.Label htmlFor="maximum_discount_amount">Max Discount (₹)</label_1.Label>
              <input_1.Input id="maximum_discount_amount" type="number" step="0.01" value={formData.maximum_discount_amount} onChange={function (e) {
                return setFormData(__assign(__assign({}, formData), { maximum_discount_amount: e.target.value }));
            }} placeholder="1000"/>
            </div>)}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label_1.Label htmlFor="minimum_order_amount">
              Minimum Order Amount (₹)
            </label_1.Label>
            <input_1.Input id="minimum_order_amount" type="number" step="0.01" value={formData.minimum_order_amount} onChange={function (e) {
            return setFormData(__assign(__assign({}, formData), { minimum_order_amount: e.target.value }));
        }} placeholder="500"/>
          </div>
          <div>
            <label_1.Label htmlFor="usage_limit">Usage Limit</label_1.Label>
            <input_1.Input id="usage_limit" type="number" value={formData.usage_limit} onChange={function (e) {
            return setFormData(__assign(__assign({}, formData), { usage_limit: e.target.value }));
        }} placeholder="100 (leave empty for unlimited)"/>
          </div>
        </div>
      </div>

      {/* Validity Period */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Validity Period</h3>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label_1.Label htmlFor="starts_at">Start Date</label_1.Label>
            <input_1.Input id="starts_at" type="date" value={formData.starts_at} onChange={function (e) {
            return setFormData(__assign(__assign({}, formData), { starts_at: e.target.value }));
        }}/>
          </div>
          <div>
            <label_1.Label htmlFor="expires_at">Expiry Date</label_1.Label>
            <input_1.Input id="expires_at" type="date" value={formData.expires_at} onChange={function (e) {
            return setFormData(__assign(__assign({}, formData), { expires_at: e.target.value }));
        }}/>
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
          {categories.map(function (category) { return (<label key={category.id} className="flex items-center space-x-2 text-sm">
              <input type="checkbox" checked={formData.applicable_categories.includes(category.id)} onChange={function (e) {
                if (e.target.checked) {
                    setFormData(__assign(__assign({}, formData), { applicable_categories: __spreadArray(__spreadArray([], formData.applicable_categories, true), [
                            category.id,
                        ], false) }));
                }
                else {
                    setFormData(__assign(__assign({}, formData), { applicable_categories: formData.applicable_categories.filter(function (id) { return id !== category.id; }) }));
                }
            }} className="rounded"/>
              <span>{category.name}</span>
            </label>); })}
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <switch_1.Switch id="is_active" checked={formData.is_active} onCheckedChange={function (checked) {
            return setFormData(__assign(__assign({}, formData), { is_active: checked }));
        }}/>
        <label_1.Label htmlFor="is_active">Active</label_1.Label>
      </div>

      <div className="flex justify-end gap-2 pt-4 border-t">
        <button_1.Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </button_1.Button>
        <button_1.Button type="submit">
          {coupon ? "Update Coupon" : "Create Coupon"}
        </button_1.Button>
      </div>
    </form>);
}
