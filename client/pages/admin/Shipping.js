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
exports.default = Shipping;
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
var tabs_1 = require("@/components/ui/tabs");
var supabase_1 = require("@/lib/supabase");
function Shipping() {
    var _a = (0, react_1.useState)([]), zones = _a[0], setZones = _a[1];
    var _b = (0, react_1.useState)([]), methods = _b[0], setMethods = _b[1];
    var _c = (0, react_1.useState)(true), isLoading = _c[0], setIsLoading = _c[1];
    var _d = (0, react_1.useState)(null), editingZone = _d[0], setEditingZone = _d[1];
    var _e = (0, react_1.useState)(null), editingMethod = _e[0], setEditingMethod = _e[1];
    var _f = (0, react_1.useState)(false), isAddingZone = _f[0], setIsAddingZone = _f[1];
    var _g = (0, react_1.useState)(false), isAddingMethod = _g[0], setIsAddingMethod = _g[1];
    (0, react_1.useEffect)(function () {
        fetchShippingData();
    }, []);
    function fetchShippingData() {
        return __awaiter(this, void 0, void 0, function () {
            var zonesData, methodsData_1, zonesWithMethods, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, 4, 5]);
                        return [4 /*yield*/, supabase_1.supabase
                                .from("shipping_zones")
                                .select("*")
                                .order("name")];
                    case 1:
                        zonesData = (_a.sent()).data;
                        return [4 /*yield*/, supabase_1.supabase
                                .from("shipping_methods")
                                .select("*")
                                .order("sort_order")];
                    case 2:
                        methodsData_1 = (_a.sent()).data;
                        if (zonesData && methodsData_1) {
                            zonesWithMethods = zonesData.map(function (zone) { return (__assign(__assign({}, zone), { shipping_methods: methodsData_1.filter(function (method) { return method.zone_id === zone.id; }) })); });
                            setZones(zonesWithMethods);
                            setMethods(methodsData_1);
                        }
                        return [3 /*break*/, 5];
                    case 3:
                        error_1 = _a.sent();
                        console.error("Failed to fetch shipping data:", error_1);
                        return [3 /*break*/, 5];
                    case 4:
                        setIsLoading(false);
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        });
    }
    function saveZone(zoneData) {
        return __awaiter(this, void 0, void 0, function () {
            var error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        if (!editingZone) return [3 /*break*/, 2];
                        return [4 /*yield*/, supabase_1.supabase
                                .from("shipping_zones")
                                .update(zoneData)
                                .eq("id", editingZone.id)];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, supabase_1.supabase.from("shipping_zones").insert(zoneData)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        fetchShippingData();
                        setEditingZone(null);
                        setIsAddingZone(false);
                        return [3 /*break*/, 6];
                    case 5:
                        error_2 = _a.sent();
                        console.error("Failed to save zone:", error_2);
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    }
    function saveMethod(methodData) {
        return __awaiter(this, void 0, void 0, function () {
            var maxOrder, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        if (!editingMethod) return [3 /*break*/, 2];
                        return [4 /*yield*/, supabase_1.supabase
                                .from("shipping_methods")
                                .update(methodData)
                                .eq("id", editingMethod.id)];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 2:
                        maxOrder = methods.length > 0
                            ? Math.max.apply(Math, methods.map(function (m) { return m.sort_order; })) : 0;
                        return [4 /*yield*/, supabase_1.supabase
                                .from("shipping_methods")
                                .insert(__assign(__assign({}, methodData), { sort_order: maxOrder + 1 }))];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        fetchShippingData();
                        setEditingMethod(null);
                        setIsAddingMethod(false);
                        return [3 /*break*/, 6];
                    case 5:
                        error_3 = _a.sent();
                        console.error("Failed to save method:", error_3);
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    }
    function deleteZone(zoneId) {
        return __awaiter(this, void 0, void 0, function () {
            var error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!confirm("Are you sure? This will also delete all shipping methods for this zone."))
                            return [2 /*return*/];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, supabase_1.supabase.from("shipping_zones").delete().eq("id", zoneId)];
                    case 2:
                        _a.sent();
                        fetchShippingData();
                        return [3 /*break*/, 4];
                    case 3:
                        error_4 = _a.sent();
                        console.error("Failed to delete zone:", error_4);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    }
    function deleteMethod(methodId) {
        return __awaiter(this, void 0, void 0, function () {
            var error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!confirm("Are you sure you want to delete this shipping method?"))
                            return [2 /*return*/];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, supabase_1.supabase.from("shipping_methods").delete().eq("id", methodId)];
                    case 2:
                        _a.sent();
                        fetchShippingData();
                        return [3 /*break*/, 4];
                    case 3:
                        error_5 = _a.sent();
                        console.error("Failed to delete method:", error_5);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    }
    function toggleZoneStatus(zoneId, isActive) {
        return __awaiter(this, void 0, void 0, function () {
            var error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, supabase_1.supabase
                                .from("shipping_zones")
                                .update({ is_active: !isActive })
                                .eq("id", zoneId)];
                    case 1:
                        _a.sent();
                        fetchShippingData();
                        return [3 /*break*/, 3];
                    case 2:
                        error_6 = _a.sent();
                        console.error("Failed to toggle zone status:", error_6);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    }
    if (isLoading) {
        return (<div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded animate-pulse w-48"></div>
        <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
      </div>);
    }
    return (<div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Shipping Management</h1>
          <p className="text-muted-foreground">
            Manage delivery zones, pincodes, and shipping methods
          </p>
        </div>
      </div>

      <tabs_1.Tabs defaultValue="zones" className="space-y-6">
        <tabs_1.TabsList>
          <tabs_1.TabsTrigger value="zones">Shipping Zones</tabs_1.TabsTrigger>
          <tabs_1.TabsTrigger value="methods">Shipping Methods</tabs_1.TabsTrigger>
        </tabs_1.TabsList>

        <tabs_1.TabsContent value="zones" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Delivery Zones</h2>
            <button_1.Button onClick={function () { return setIsAddingZone(true); }}>
              <lucide_react_1.Plus className="w-4 h-4 mr-2"/>
              Add Zone
            </button_1.Button>
          </div>

          <div className="grid gap-6">
            {zones.map(function (zone) { return (<card_1.Card key={zone.id}>
                <card_1.CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <card_1.CardTitle className="flex items-center gap-2">
                        <lucide_react_1.MapPin className="w-5 h-5"/>
                        {zone.name}
                        <badge_1.Badge variant={zone.is_active ? "default" : "secondary"}>
                          {zone.is_active ? "Active" : "Inactive"}
                        </badge_1.Badge>
                      </card_1.CardTitle>
                      {zone.description && (<p className="text-sm text-muted-foreground mt-1">
                          {zone.description}
                        </p>)}
                    </div>
                    <div className="flex items-center gap-2">
                      <switch_1.Switch checked={zone.is_active} onCheckedChange={function () {
                return toggleZoneStatus(zone.id, zone.is_active);
            }}/>
                      <button_1.Button variant="ghost" size="icon" onClick={function () { return setEditingZone(zone); }}>
                        <lucide_react_1.Edit className="w-4 h-4"/>
                      </button_1.Button>
                      <button_1.Button variant="ghost" size="icon" onClick={function () { return deleteZone(zone.id); }}>
                        <lucide_react_1.Trash2 className="w-4 h-4 text-red-600"/>
                      </button_1.Button>
                    </div>
                  </div>
                </card_1.CardHeader>
                <card_1.CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">
                        Covered Pincodes ({zone.pincodes.length})
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {zone.pincodes.slice(0, 10).map(function (pincode) { return (<badge_1.Badge key={pincode} variant="outline" className="text-xs">
                            {pincode}
                          </badge_1.Badge>); })}
                        {zone.pincodes.length > 10 && (<badge_1.Badge variant="outline" className="text-xs">
                            +{zone.pincodes.length - 10} more
                          </badge_1.Badge>)}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">
                        Shipping Methods ({zone.shipping_methods.length})
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {zone.shipping_methods.map(function (method) { return (<div key={method.id} className="border rounded-lg p-3">
                            <div className="flex justify-between items-start mb-2">
                              <h5 className="font-medium text-sm">
                                {method.name}
                              </h5>
                              <badge_1.Badge variant={method.is_active ? "default" : "secondary"} className="text-xs">
                                {method.is_active ? "Active" : "Inactive"}
                              </badge_1.Badge>
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
                          </div>); })}
                      </div>
                    </div>
                  </div>
                </card_1.CardContent>
              </card_1.Card>); })}
          </div>
        </tabs_1.TabsContent>

        <tabs_1.TabsContent value="methods" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Shipping Methods</h2>
            <button_1.Button onClick={function () { return setIsAddingMethod(true); }}>
              <lucide_react_1.Plus className="w-4 h-4 mr-2"/>
              Add Method
            </button_1.Button>
          </div>

          <div className="grid gap-4">
            {methods.map(function (method) {
            var zone = zones.find(function (z) { return z.id === method.zone_id; });
            return (<card_1.Card key={method.id}>
                  <card_1.CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <lucide_react_1.Truck className="w-4 h-4"/>
                          <h3 className="font-semibold">{method.name}</h3>
                          <badge_1.Badge variant={method.is_active ? "default" : "secondary"}>
                            {method.is_active ? "Active" : "Inactive"}
                          </badge_1.Badge>
                          <badge_1.Badge variant="outline">{method.type}</badge_1.Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {method.description}
                        </p>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="flex items-center gap-1">
                            <lucide_react_1.IndianRupee className="w-3 h-3"/>
                            {method.price}
                          </span>
                          <span className="flex items-center gap-1">
                            <lucide_react_1.Clock className="w-3 h-3"/>
                            {method.delivery_time}
                          </span>
                          {zone && (<span className="flex items-center gap-1">
                              <lucide_react_1.MapPin className="w-3 h-3"/>
                              {zone.name}
                            </span>)}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button_1.Button variant="ghost" size="icon" onClick={function () { return setEditingMethod(method); }}>
                          <lucide_react_1.Edit className="w-4 h-4"/>
                        </button_1.Button>
                        <button_1.Button variant="ghost" size="icon" onClick={function () { return deleteMethod(method.id); }}>
                          <lucide_react_1.Trash2 className="w-4 h-4 text-red-600"/>
                        </button_1.Button>
                      </div>
                    </div>
                  </card_1.CardContent>
                </card_1.Card>);
        })}
          </div>
        </tabs_1.TabsContent>
      </tabs_1.Tabs>

      {/* Add/Edit Zone Dialog */}
      <dialog_1.Dialog open={isAddingZone || !!editingZone} onOpenChange={function () {
            setIsAddingZone(false);
            setEditingZone(null);
        }}>
        <dialog_1.DialogContent className="max-w-2xl">
          <dialog_1.DialogHeader>
            <dialog_1.DialogTitle>
              {editingZone ? "Edit Zone" : "Add New Zone"}
            </dialog_1.DialogTitle>
          </dialog_1.DialogHeader>
          <ZoneForm zone={editingZone} onSave={saveZone} onCancel={function () {
            setIsAddingZone(false);
            setEditingZone(null);
        }}/>
        </dialog_1.DialogContent>
      </dialog_1.Dialog>

      {/* Add/Edit Method Dialog */}
      <dialog_1.Dialog open={isAddingMethod || !!editingMethod} onOpenChange={function () {
            setIsAddingMethod(false);
            setEditingMethod(null);
        }}>
        <dialog_1.DialogContent className="max-w-2xl">
          <dialog_1.DialogHeader>
            <dialog_1.DialogTitle>
              {editingMethod ? "Edit Method" : "Add New Method"}
            </dialog_1.DialogTitle>
          </dialog_1.DialogHeader>
          <MethodForm method={editingMethod} zones={zones} onSave={saveMethod} onCancel={function () {
            setIsAddingMethod(false);
            setEditingMethod(null);
        }}/>
        </dialog_1.DialogContent>
      </dialog_1.Dialog>
    </div>);
}
// Zone Form Component
function ZoneForm(_a) {
    var _b;
    var zone = _a.zone, onSave = _a.onSave, onCancel = _a.onCancel;
    var _c = (0, react_1.useState)({
        name: (zone === null || zone === void 0 ? void 0 : zone.name) || "",
        description: (zone === null || zone === void 0 ? void 0 : zone.description) || "",
        pincodes: (zone === null || zone === void 0 ? void 0 : zone.pincodes.join(", ")) || "",
        is_active: (_b = zone === null || zone === void 0 ? void 0 : zone.is_active) !== null && _b !== void 0 ? _b : true,
    }), formData = _c[0], setFormData = _c[1];
    function handleSubmit(e) {
        e.preventDefault();
        var pincodes = formData.pincodes
            .split(",")
            .map(function (p) { return p.trim(); })
            .filter(function (p) { return p.length > 0; });
        onSave({
            name: formData.name,
            description: formData.description || null,
            pincodes: pincodes,
            is_active: formData.is_active,
        });
    }
    return (<form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label_1.Label htmlFor="name">Zone Name</label_1.Label>
        <input_1.Input id="name" value={formData.name} onChange={function (e) { return setFormData(__assign(__assign({}, formData), { name: e.target.value })); }} placeholder="e.g., Mumbai Central" required/>
      </div>

      <div>
        <label_1.Label htmlFor="description">Description</label_1.Label>
        <input_1.Input id="description" value={formData.description} onChange={function (e) {
            return setFormData(__assign(__assign({}, formData), { description: e.target.value }));
        }} placeholder="Brief description of the zone"/>
      </div>

      <div>
        <label_1.Label htmlFor="pincodes">Pincodes (comma-separated)</label_1.Label>
        <textarea_1.Textarea id="pincodes" value={formData.pincodes} onChange={function (e) {
            return setFormData(__assign(__assign({}, formData), { pincodes: e.target.value }));
        }} placeholder="400001, 400002, 400003..." rows={4} required/>
        <p className="text-xs text-muted-foreground mt-1">
          Enter pincodes separated by commas
        </p>
      </div>

      <div className="flex items-center space-x-2">
        <switch_1.Switch id="is_active" checked={formData.is_active} onCheckedChange={function (checked) {
            return setFormData(__assign(__assign({}, formData), { is_active: checked }));
        }}/>
        <label_1.Label htmlFor="is_active">Active</label_1.Label>
      </div>

      <div className="flex justify-end gap-2">
        <button_1.Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </button_1.Button>
        <button_1.Button type="submit">{zone ? "Update Zone" : "Create Zone"}</button_1.Button>
      </div>
    </form>);
}
// Method Form Component
function MethodForm(_a) {
    var _b, _c, _d;
    var method = _a.method, zones = _a.zones, onSave = _a.onSave, onCancel = _a.onCancel;
    var _e = (0, react_1.useState)({
        zone_id: (method === null || method === void 0 ? void 0 : method.zone_id) || "",
        name: (method === null || method === void 0 ? void 0 : method.name) || "",
        description: (method === null || method === void 0 ? void 0 : method.description) || "",
        type: (method === null || method === void 0 ? void 0 : method.type) || "standard",
        price: ((_b = method === null || method === void 0 ? void 0 : method.price) === null || _b === void 0 ? void 0 : _b.toString()) || "",
        free_shipping_minimum: ((_c = method === null || method === void 0 ? void 0 : method.free_shipping_minimum) === null || _c === void 0 ? void 0 : _c.toString()) || "",
        delivery_time: (method === null || method === void 0 ? void 0 : method.delivery_time) || "",
        is_active: (_d = method === null || method === void 0 ? void 0 : method.is_active) !== null && _d !== void 0 ? _d : true,
    }), formData = _e[0], setFormData = _e[1];
    function handleSubmit(e) {
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
    return (<form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label_1.Label htmlFor="zone_id">Shipping Zone</label_1.Label>
        <select_1.Select value={formData.zone_id} onValueChange={function (value) {
            return setFormData(__assign(__assign({}, formData), { zone_id: value }));
        }}>
          <select_1.SelectTrigger>
            <select_1.SelectValue placeholder="Select a zone"/>
          </select_1.SelectTrigger>
          <select_1.SelectContent>
            {zones.map(function (zone) { return (<select_1.SelectItem key={zone.id} value={zone.id}>
                {zone.name}
              </select_1.SelectItem>); })}
          </select_1.SelectContent>
        </select_1.Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label_1.Label htmlFor="name">Method Name</label_1.Label>
          <input_1.Input id="name" value={formData.name} onChange={function (e) { return setFormData(__assign(__assign({}, formData), { name: e.target.value })); }} placeholder="e.g., Same Day Delivery" required/>
        </div>
        <div>
          <label_1.Label htmlFor="type">Delivery Type</label_1.Label>
          <select_1.Select value={formData.type} onValueChange={function (value) {
            return setFormData(__assign(__assign({}, formData), { type: value }));
        }}>
            <select_1.SelectTrigger>
              <select_1.SelectValue />
            </select_1.SelectTrigger>
            <select_1.SelectContent>
              <select_1.SelectItem value="same_day">Same Day</select_1.SelectItem>
              <select_1.SelectItem value="next_day">Next Day</select_1.SelectItem>
              <select_1.SelectItem value="standard">Standard</select_1.SelectItem>
              <select_1.SelectItem value="express">Express</select_1.SelectItem>
              <select_1.SelectItem value="scheduled">Scheduled</select_1.SelectItem>
            </select_1.SelectContent>
          </select_1.Select>
        </div>
      </div>

      <div>
        <label_1.Label htmlFor="description">Description</label_1.Label>
        <input_1.Input id="description" value={formData.description} onChange={function (e) {
            return setFormData(__assign(__assign({}, formData), { description: e.target.value }));
        }} placeholder="Brief description of the delivery method"/>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label_1.Label htmlFor="price">Price (₹)</label_1.Label>
          <input_1.Input id="price" type="number" step="0.01" value={formData.price} onChange={function (e) {
            return setFormData(__assign(__assign({}, formData), { price: e.target.value }));
        }} placeholder="0.00" required/>
        </div>
        <div>
          <label_1.Label htmlFor="free_shipping_minimum">
            Free Shipping Minimum (₹)
          </label_1.Label>
          <input_1.Input id="free_shipping_minimum" type="number" step="0.01" value={formData.free_shipping_minimum} onChange={function (e) {
            return setFormData(__assign(__assign({}, formData), { free_shipping_minimum: e.target.value }));
        }} placeholder="500.00"/>
        </div>
      </div>

      <div>
        <label_1.Label htmlFor="delivery_time">Delivery Time</label_1.Label>
        <input_1.Input id="delivery_time" value={formData.delivery_time} onChange={function (e) {
            return setFormData(__assign(__assign({}, formData), { delivery_time: e.target.value }));
        }} placeholder="e.g., Within 4 hours" required/>
      </div>

      <div className="flex items-center space-x-2">
        <switch_1.Switch id="is_active" checked={formData.is_active} onCheckedChange={function (checked) {
            return setFormData(__assign(__assign({}, formData), { is_active: checked }));
        }}/>
        <label_1.Label htmlFor="is_active">Active</label_1.Label>
      </div>

      <div className="flex justify-end gap-2">
        <button_1.Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </button_1.Button>
        <button_1.Button type="submit">
          {method ? "Update Method" : "Create Method"}
        </button_1.Button>
      </div>
    </form>);
}
