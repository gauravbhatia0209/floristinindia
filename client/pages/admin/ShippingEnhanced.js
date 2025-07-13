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
exports.default = ShippingEnhanced;
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
var alert_1 = require("@/components/ui/alert");
var supabase_1 = require("@/lib/supabase");
function ShippingEnhanced() {
    var _a = (0, react_1.useState)([]), methods = _a[0], setMethods = _a[1];
    var _b = (0, react_1.useState)([]), zones = _b[0], setZones = _b[1];
    var _c = (0, react_1.useState)(true), isLoading = _c[0], setIsLoading = _c[1];
    var _d = (0, react_1.useState)(null), editingMethod = _d[0], setEditingMethod = _d[1];
    var _e = (0, react_1.useState)(null), editingZone = _e[0], setEditingZone = _e[1];
    var _f = (0, react_1.useState)(false), isAddingMethod = _f[0], setIsAddingMethod = _f[1];
    var _g = (0, react_1.useState)(false), isAddingZone = _g[0], setIsAddingZone = _g[1];
    var _h = (0, react_1.useState)(null), expandedMethod = _h[0], setExpandedMethod = _h[1];
    (0, react_1.useEffect)(function () {
        fetchShippingData();
    }, []);
    function fetchShippingData() {
        return __awaiter(this, void 0, void 0, function () {
            var _a, zonesData, zonesError, _b, methodsData, methodsError, _c, configsData_1, configsError, methodsWithZones, error_1;
            var _d, _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        _f.trys.push([0, 4, 5, 6]);
                        setIsLoading(true);
                        return [4 /*yield*/, supabase_1.supabase
                                .from("shipping_zones")
                                .select("*")
                                .order("name")];
                    case 1:
                        _a = _f.sent(), zonesData = _a.data, zonesError = _a.error;
                        if (zonesError) {
                            console.error("Zones fetch error:", zonesError);
                            throw zonesError;
                        }
                        return [4 /*yield*/, supabase_1.supabase
                                .from("shipping_method_templates")
                                .select("*")
                                .order("sort_order")];
                    case 2:
                        _b = _f.sent(), methodsData = _b.data, methodsError = _b.error;
                        if (methodsError) {
                            console.error("Methods fetch error:", methodsError);
                            // If table doesn't exist, show helpful message
                            if (methodsError.code === "PGRST116" ||
                                ((_d = methodsError.message) === null || _d === void 0 ? void 0 : _d.includes("does not exist"))) {
                                alert("Enhanced shipping tables not found. Please run the database migration first.");
                                setZones(zonesData || []);
                                setMethods([]);
                                return [2 /*return*/];
                            }
                            throw methodsError;
                        }
                        return [4 /*yield*/, supabase_1.supabase.from("shipping_method_zone_config").select("\n          *,\n          zone:shipping_zones(*)\n        ")];
                    case 3:
                        _c = _f.sent(), configsData_1 = _c.data, configsError = _c.error;
                        if (configsError) {
                            console.error("Configs fetch error:", configsError);
                            throw configsError;
                        }
                        methodsWithZones = (methodsData === null || methodsData === void 0 ? void 0 : methodsData.map(function (method) { return (__assign(__assign({}, method), { zone_configs: (configsData_1 === null || configsData_1 === void 0 ? void 0 : configsData_1.filter(function (config) { return config.method_template_id === method.id; })) || [] })); })) || [];
                        setZones(zonesData || []);
                        setMethods(methodsWithZones);
                        return [3 /*break*/, 6];
                    case 4:
                        error_1 = _f.sent();
                        console.error("Failed to fetch shipping data:", error_1);
                        if ((_e = error_1 === null || error_1 === void 0 ? void 0 : error_1.message) === null || _e === void 0 ? void 0 : _e.includes("does not exist")) {
                            alert("Database tables are missing. Please run the enhanced shipping migration first.");
                        }
                        return [3 /*break*/, 6];
                    case 5:
                        setIsLoading(false);
                        return [7 /*endfinally*/];
                    case 6: return [2 /*return*/];
                }
            });
        });
    }
    function saveMethod(methodData) {
        return __awaiter(this, void 0, void 0, function () {
            var methodId_1, updateData, updateError, deleteError, maxOrder, insertData, _a, newMethod, insertError, activeConfigs, zoneConfigs, configError, error_2, errorMessage;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 8, , 9]);
                        console.log("Saving method data:", methodData);
                        if (!editingMethod) return [3 /*break*/, 3];
                        console.log("Updating existing method:", editingMethod.id);
                        updateData = {
                            name: methodData.name,
                            description: methodData.description || null,
                            type: methodData.type,
                            rules: methodData.rules || null,
                            is_active: methodData.is_active,
                        };
                        // Add time_slot_required if the field exists in formData
                        if ("time_slot_required" in methodData) {
                            updateData.time_slot_required = methodData.time_slot_required;
                        }
                        return [4 /*yield*/, supabase_1.supabase
                                .from("shipping_method_templates")
                                .update(updateData)
                                .eq("id", editingMethod.id)];
                    case 1:
                        updateError = (_b.sent()).error;
                        if (updateError) {
                            console.error("Update method error:", updateError);
                            throw updateError;
                        }
                        methodId_1 = editingMethod.id;
                        // Delete existing configs
                        console.log("Deleting existing configs for method:", methodId_1);
                        return [4 /*yield*/, supabase_1.supabase
                                .from("shipping_method_zone_config")
                                .delete()
                                .eq("method_template_id", methodId_1)];
                    case 2:
                        deleteError = (_b.sent()).error;
                        if (deleteError) {
                            console.error("Delete configs error:", deleteError);
                            throw deleteError;
                        }
                        return [3 /*break*/, 5];
                    case 3:
                        console.log("Creating new method");
                        maxOrder = methods.length > 0
                            ? Math.max.apply(Math, methods.map(function (m) { return m.sort_order; })) : 0;
                        insertData = {
                            name: methodData.name,
                            description: methodData.description || null,
                            type: methodData.type,
                            rules: methodData.rules || null,
                            is_active: methodData.is_active,
                            sort_order: maxOrder + 1,
                        };
                        // Add time_slot_required if the field exists in formData
                        if ("time_slot_required" in methodData) {
                            insertData.time_slot_required = methodData.time_slot_required;
                        }
                        return [4 /*yield*/, supabase_1.supabase
                                .from("shipping_method_templates")
                                .insert(insertData)
                                .select()
                                .single()];
                    case 4:
                        _a = _b.sent(), newMethod = _a.data, insertError = _a.error;
                        if (insertError) {
                            console.error("Insert method error:", insertError);
                            throw insertError;
                        }
                        methodId_1 = newMethod.id;
                        console.log("Created new method with ID:", methodId_1);
                        _b.label = 5;
                    case 5:
                        activeConfigs = methodData.zone_configs.filter(function (config) { return config.is_active; });
                        console.log("Active zone configs to save:", activeConfigs);
                        if (!(activeConfigs.length > 0)) return [3 /*break*/, 7];
                        zoneConfigs = activeConfigs.map(function (config) { return ({
                            method_template_id: methodId_1,
                            zone_id: config.zone_id,
                            price: parseFloat(config.price) || 0,
                            free_shipping_minimum: config.free_shipping_minimum
                                ? parseFloat(config.free_shipping_minimum)
                                : null,
                            delivery_time: config.delivery_time,
                            is_active: config.is_active,
                        }); });
                        console.log("Inserting zone configs:", zoneConfigs);
                        return [4 /*yield*/, supabase_1.supabase
                                .from("shipping_method_zone_config")
                                .insert(zoneConfigs)];
                    case 6:
                        configError = (_b.sent()).error;
                        if (configError) {
                            console.error("Insert config error:", configError);
                            throw configError;
                        }
                        _b.label = 7;
                    case 7:
                        console.log("Method saved successfully");
                        fetchShippingData();
                        setEditingMethod(null);
                        setIsAddingMethod(false);
                        alert("Shipping method saved successfully!");
                        return [3 /*break*/, 9];
                    case 8:
                        error_2 = _b.sent();
                        console.error("Failed to save method:", error_2);
                        errorMessage = (error_2 === null || error_2 === void 0 ? void 0 : error_2.message) || (error_2 === null || error_2 === void 0 ? void 0 : error_2.toString()) || "Unknown error";
                        alert("Failed to save shipping method: ".concat(errorMessage));
                        return [3 /*break*/, 9];
                    case 9: return [2 /*return*/];
                }
            });
        });
    }
    function saveZone(zoneData) {
        return __awaiter(this, void 0, void 0, function () {
            var pincodes, payload, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        pincodes = zoneData.pincodes
                            .split(",")
                            .map(function (p) { return p.trim(); })
                            .filter(function (p) { return p.length > 0; });
                        payload = {
                            name: zoneData.name,
                            description: zoneData.description || null,
                            pincodes: pincodes,
                            is_active: zoneData.is_active,
                        };
                        if (!editingZone) return [3 /*break*/, 2];
                        return [4 /*yield*/, supabase_1.supabase
                                .from("shipping_zones")
                                .update(payload)
                                .eq("id", editingZone.id)];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, supabase_1.supabase.from("shipping_zones").insert(payload)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        fetchShippingData();
                        setEditingZone(null);
                        setIsAddingZone(false);
                        return [3 /*break*/, 6];
                    case 5:
                        error_3 = _a.sent();
                        console.error("Failed to save zone:", error_3);
                        alert("Failed to save shipping zone. Please try again.");
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    }
    function deleteMethod(methodId) {
        return __awaiter(this, void 0, void 0, function () {
            var error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!confirm("Are you sure? This will delete all zone configurations for this method."))
                            return [2 /*return*/];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, supabase_1.supabase
                                .from("shipping_method_templates")
                                .delete()
                                .eq("id", methodId)];
                    case 2:
                        _a.sent();
                        fetchShippingData();
                        return [3 /*break*/, 4];
                    case 3:
                        error_4 = _a.sent();
                        console.error("Failed to delete method:", error_4);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    }
    function deleteZone(zoneId) {
        return __awaiter(this, void 0, void 0, function () {
            var error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!confirm("Are you sure? This will delete all shipping methods for this zone."))
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
                        error_5 = _a.sent();
                        console.error("Failed to delete zone:", error_5);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    }
    function toggleMethodStatus(methodId, isActive) {
        return __awaiter(this, void 0, void 0, function () {
            var error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, supabase_1.supabase
                                .from("shipping_method_templates")
                                .update({ is_active: !isActive })
                                .eq("id", methodId)];
                    case 1:
                        _a.sent();
                        fetchShippingData();
                        return [3 /*break*/, 3];
                    case 2:
                        error_6 = _a.sent();
                        console.error("Failed to toggle method status:", error_6);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    }
    function toggleZoneStatus(zoneId, isActive) {
        return __awaiter(this, void 0, void 0, function () {
            var error_7;
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
                        error_7 = _a.sent();
                        console.error("Failed to toggle zone status:", error_7);
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
          <h1 className="text-2xl font-bold">Enhanced Shipping Management</h1>
          <p className="text-muted-foreground">
            Unified interface for managing shipping methods across all zones
          </p>
        </div>
      </div>

      <tabs_1.Tabs defaultValue="methods" className="space-y-6">
        <tabs_1.TabsList>
          <tabs_1.TabsTrigger value="methods">Shipping Methods</tabs_1.TabsTrigger>
          <tabs_1.TabsTrigger value="zones">Delivery Zones</tabs_1.TabsTrigger>
        </tabs_1.TabsList>

        {/* Shipping Methods Tab */}
        <tabs_1.TabsContent value="methods" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Shipping Methods</h2>
            <button_1.Button onClick={function () { return setIsAddingMethod(true); }}>
              <lucide_react_1.Plus className="w-4 h-4 mr-2"/>
              Add Method
            </button_1.Button>
          </div>

          <div className="space-y-4">
            {methods.map(function (method) { return (<card_1.Card key={method.id} className="overflow-hidden">
                <card_1.CardHeader className="pb-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <lucide_react_1.Truck className="w-5 h-5 text-blue-600"/>
                      <div>
                        <card_1.CardTitle className="flex items-center gap-2">
                          {method.name}
                          <badge_1.Badge variant={method.is_active ? "default" : "secondary"}>
                            {method.is_active ? "Active" : "Inactive"}
                          </badge_1.Badge>
                          <badge_1.Badge variant="outline">{method.type}</badge_1.Badge>
                        </card_1.CardTitle>
                        {method.description && (<p className="text-sm text-muted-foreground mt-1">
                            {method.description}
                          </p>)}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <switch_1.Switch checked={method.is_active} onCheckedChange={function () {
                return toggleMethodStatus(method.id, method.is_active);
            }}/>
                      <button_1.Button variant="ghost" size="icon" onClick={function () { return setEditingMethod(method); }}>
                        <lucide_react_1.Edit className="w-4 h-4"/>
                      </button_1.Button>
                      <button_1.Button variant="ghost" size="icon" onClick={function () { return deleteMethod(method.id); }}>
                        <lucide_react_1.Trash2 className="w-4 h-4 text-red-600"/>
                      </button_1.Button>
                    </div>
                  </div>
                </card_1.CardHeader>

                <card_1.CardContent>
                  {/* Custom Rules */}
                  {method.rules && (<alert_1.Alert className="mb-4">
                      <lucide_react_1.FileText className="h-4 w-4"/>
                      <alert_1.AlertDescription>{method.rules}</alert_1.AlertDescription>
                    </alert_1.Alert>)}

                  {/* Zone Configuration */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm flex items-center gap-2">
                      <lucide_react_1.MapPin className="w-4 h-4"/>
                      Zone Configuration ({method.zone_configs.length} active)
                    </h4>

                    <div className="grid gap-3">
                      {zones.map(function (zone) {
                var config = method.zone_configs.find(function (c) { return c.zone_id === zone.id; });
                var isActive = (config === null || config === void 0 ? void 0 : config.is_active) || false;
                return (<div key={zone.id} className={"flex items-center justify-between p-3 border rounded-lg ".concat(isActive
                        ? "bg-green-50 border-green-200"
                        : "bg-gray-50")}>
                            <div className="flex items-center gap-3">
                              <div className="w-2 h-2 rounded-full" style={{
                        backgroundColor: isActive
                            ? "#10b981"
                            : "#6b7280",
                    }}/>
                              <div>
                                <div className="font-medium text-sm">
                                  {zone.name}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {zone.pincodes.length} pincodes
                                </div>
                              </div>
                            </div>

                            {isActive && config && (<div className="flex items-center gap-4 text-sm">
                                <span className="flex items-center gap-1">
                                  <lucide_react_1.IndianRupee className="w-3 h-3"/>
                                  {config.price}
                                </span>
                                <span className="flex items-center gap-1">
                                  <lucide_react_1.Clock className="w-3 h-3"/>
                                  {config.delivery_time}
                                </span>
                                {config.free_shipping_minimum && (<span className="text-green-600 text-xs">
                                    Free above ₹{config.free_shipping_minimum}
                                  </span>)}
                              </div>)}

                            <badge_1.Badge variant={isActive ? "default" : "outline"}>
                              {isActive ? "Enabled" : "Disabled"}
                            </badge_1.Badge>
                          </div>);
            })}
                    </div>
                  </div>
                </card_1.CardContent>
              </card_1.Card>); })}

            {methods.length === 0 && (<card_1.Card>
                <card_1.CardContent className="text-center py-12">
                  <lucide_react_1.Truck className="w-12 h-12 mx-auto mb-4 text-muted-foreground"/>
                  <h3 className="text-lg font-semibold mb-2">
                    No Shipping Methods
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Create your first shipping method to get started
                  </p>
                  <button_1.Button onClick={function () { return setIsAddingMethod(true); }}>
                    <lucide_react_1.Plus className="w-4 h-4 mr-2"/>
                    Add Method
                  </button_1.Button>
                </card_1.CardContent>
              </card_1.Card>)}
          </div>
        </tabs_1.TabsContent>

        {/* Zones Tab */}
        <tabs_1.TabsContent value="zones" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Delivery Zones</h2>
            <button_1.Button onClick={function () { return setIsAddingZone(true); }}>
              <lucide_react_1.Plus className="w-4 h-4 mr-2"/>
              Add Zone
            </button_1.Button>
          </div>

          <div className="grid gap-4">
            {zones.map(function (zone) { return (<card_1.Card key={zone.id}>
                <card_1.CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <lucide_react_1.MapPin className="w-4 h-4"/>
                        <h3 className="font-semibold">{zone.name}</h3>
                        <badge_1.Badge variant={zone.is_active ? "default" : "secondary"}>
                          {zone.is_active ? "Active" : "Inactive"}
                        </badge_1.Badge>
                      </div>
                      {zone.description && (<p className="text-sm text-muted-foreground mb-2">
                          {zone.description}
                        </p>)}
                      <div className="flex flex-wrap gap-1 mb-2">
                        {zone.pincodes.slice(0, 8).map(function (pincode) { return (<badge_1.Badge key={pincode} variant="outline" className="text-xs">
                            {pincode}
                          </badge_1.Badge>); })}
                        {zone.pincodes.length > 8 && (<badge_1.Badge variant="outline" className="text-xs">
                            +{zone.pincodes.length - 8} more
                          </badge_1.Badge>)}
                      </div>
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
                </card_1.CardContent>
              </card_1.Card>); })}

            {zones.length === 0 && (<card_1.Card>
                <card_1.CardContent className="text-center py-12">
                  <lucide_react_1.MapPin className="w-12 h-12 mx-auto mb-4 text-muted-foreground"/>
                  <h3 className="text-lg font-semibold mb-2">
                    No Delivery Zones
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Create delivery zones to configure shipping methods
                  </p>
                  <button_1.Button onClick={function () { return setIsAddingZone(true); }}>
                    <lucide_react_1.Plus className="w-4 h-4 mr-2"/>
                    Add Zone
                  </button_1.Button>
                </card_1.CardContent>
              </card_1.Card>)}
          </div>
        </tabs_1.TabsContent>
      </tabs_1.Tabs>

      {/* Method Dialog */}
      <dialog_1.Dialog open={isAddingMethod || !!editingMethod} onOpenChange={function () {
            setIsAddingMethod(false);
            setEditingMethod(null);
        }}>
        <dialog_1.DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <dialog_1.DialogHeader>
            <dialog_1.DialogTitle>
              {editingMethod
            ? "Edit Shipping Method"
            : "Add New Shipping Method"}
            </dialog_1.DialogTitle>
          </dialog_1.DialogHeader>
          <MethodForm method={editingMethod} zones={zones} onSave={saveMethod} onCancel={function () {
            setIsAddingMethod(false);
            setEditingMethod(null);
        }}/>
        </dialog_1.DialogContent>
      </dialog_1.Dialog>

      {/* Zone Dialog */}
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
    </div>);
}
// Enhanced Method Form Component
function MethodForm(_a) {
    var _b, _c;
    var method = _a.method, zones = _a.zones, onSave = _a.onSave, onCancel = _a.onCancel;
    var _d = (0, react_1.useState)({
        name: (method === null || method === void 0 ? void 0 : method.name) || "",
        description: (method === null || method === void 0 ? void 0 : method.description) || "",
        type: (method === null || method === void 0 ? void 0 : method.type) || "standard",
        rules: (method === null || method === void 0 ? void 0 : method.rules) || "",
        time_slot_required: (_b = method === null || method === void 0 ? void 0 : method.time_slot_required) !== null && _b !== void 0 ? _b : false,
        is_active: (_c = method === null || method === void 0 ? void 0 : method.is_active) !== null && _c !== void 0 ? _c : true,
        zone_configs: zones.map(function (zone) { return ({
            zone_id: zone.id,
            price: "",
            free_shipping_minimum: "",
            delivery_time: "",
            is_active: false,
        }); }),
    }), formData = _d[0], setFormData = _d[1];
    // Load existing configurations if editing
    (0, react_1.useEffect)(function () {
        if (method) {
            // Fetch existing configurations
            fetchExistingConfigs();
        }
    }, [method]);
    function fetchExistingConfigs() {
        return __awaiter(this, void 0, void 0, function () {
            var configs_1, error_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!method)
                            return [2 /*return*/];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, supabase_1.supabase
                                .from("shipping_method_zone_config")
                                .select("*")
                                .eq("method_template_id", method.id)];
                    case 2:
                        configs_1 = (_a.sent()).data;
                        if (configs_1) {
                            setFormData(function (prev) { return (__assign(__assign({}, prev), { zone_configs: zones.map(function (zone) {
                                    var _a, _b;
                                    var config = configs_1.find(function (c) { return c.zone_id === zone.id; });
                                    return {
                                        zone_id: zone.id,
                                        price: ((_a = config === null || config === void 0 ? void 0 : config.price) === null || _a === void 0 ? void 0 : _a.toString()) || "",
                                        free_shipping_minimum: ((_b = config === null || config === void 0 ? void 0 : config.free_shipping_minimum) === null || _b === void 0 ? void 0 : _b.toString()) || "",
                                        delivery_time: (config === null || config === void 0 ? void 0 : config.delivery_time) || "",
                                        is_active: (config === null || config === void 0 ? void 0 : config.is_active) || false,
                                    };
                                }) })); });
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        error_8 = _a.sent();
                        console.error("Failed to fetch existing configs:", error_8);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    }
    function updateZoneConfig(zoneId, field, value) {
        setFormData(function (prev) { return (__assign(__assign({}, prev), { zone_configs: prev.zone_configs.map(function (config) {
                var _a;
                return config.zone_id === zoneId ? __assign(__assign({}, config), (_a = {}, _a[field] = value, _a)) : config;
            }) })); });
    }
    function handleSubmit(e) {
        e.preventDefault();
        onSave(formData);
    }
    return (<form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Basic Information</h3>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label_1.Label htmlFor="name">Method Name</label_1.Label>
            <input_1.Input id="name" value={formData.name} onChange={function (e) {
            return setFormData(__assign(__assign({}, formData), { name: e.target.value }));
        }} placeholder="e.g., Same Day Delivery" required/>
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

        <div>
          <label_1.Label htmlFor="rules">Custom Rules & Notes</label_1.Label>
          <textarea_1.Textarea id="rules" value={formData.rules} onChange={function (e) {
            return setFormData(__assign(__assign({}, formData), { rules: e.target.value }));
        }} placeholder="e.g., Order before 2 PM for same-day delivery. Available on business days only." rows={3}/>
          <p className="text-xs text-muted-foreground mt-1">
            These rules will be displayed to customers during checkout
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <switch_1.Switch id="time_slot_required" checked={formData.time_slot_required} onCheckedChange={function (checked) {
            return setFormData(__assign(__assign({}, formData), { time_slot_required: checked }));
        }}/>
          <label_1.Label htmlFor="time_slot_required">
            Requires Time Slot Selection
          </label_1.Label>
        </div>

        <div className="flex items-center space-x-2">
          <switch_1.Switch id="is_active" checked={formData.is_active} onCheckedChange={function (checked) {
            return setFormData(__assign(__assign({}, formData), { is_active: checked }));
        }}/>
          <label_1.Label htmlFor="is_active">Active</label_1.Label>
        </div>
      </div>

      {/* Zone Configuration */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Zone Configuration</h3>
        <p className="text-sm text-muted-foreground">
          Toggle zones on/off and set pricing for each delivery area
        </p>

        <div className="space-y-3">
          {zones.map(function (zone) {
            var config = formData.zone_configs.find(function (c) { return c.zone_id === zone.id; });
            if (!config)
                return null;
            return (<card_1.Card key={zone.id} className={config.is_active ? "border-green-200 bg-green-50" : ""}>
                <card_1.CardContent className="p-4">
                  <div className="space-y-4">
                    {/* Zone Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <switch_1.Switch checked={config.is_active} onCheckedChange={function (checked) {
                    return updateZoneConfig(zone.id, "is_active", checked);
                }}/>
                        <div>
                          <h4 className="font-medium">{zone.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {zone.pincodes.length} pincodes
                          </p>
                        </div>
                      </div>
                      <badge_1.Badge variant={config.is_active ? "default" : "outline"}>
                        {config.is_active ? "Enabled" : "Disabled"}
                      </badge_1.Badge>
                    </div>

                    {/* Configuration Fields (only show when active) */}
                    {config.is_active && (<div className="grid grid-cols-3 gap-4 pt-3 border-t">
                        <div>
                          <label_1.Label htmlFor={"price-".concat(zone.id)}>Price (₹)</label_1.Label>
                          <input_1.Input id={"price-".concat(zone.id)} type="number" step="0.01" value={config.price} onChange={function (e) {
                        return updateZoneConfig(zone.id, "price", e.target.value);
                    }} placeholder="0.00" required={config.is_active}/>
                        </div>
                        <div>
                          <label_1.Label htmlFor={"free-shipping-".concat(zone.id)}>
                            Free Shipping Above (₹)
                          </label_1.Label>
                          <input_1.Input id={"free-shipping-".concat(zone.id)} type="number" step="0.01" value={config.free_shipping_minimum} onChange={function (e) {
                        return updateZoneConfig(zone.id, "free_shipping_minimum", e.target.value);
                    }} placeholder="Optional"/>
                        </div>
                        <div>
                          <label_1.Label htmlFor={"delivery-time-".concat(zone.id)}>
                            Delivery Time
                          </label_1.Label>
                          <input_1.Input id={"delivery-time-".concat(zone.id)} value={config.delivery_time} onChange={function (e) {
                        return updateZoneConfig(zone.id, "delivery_time", e.target.value);
                    }} placeholder="e.g., Within 4 hours" required={config.is_active}/>
                        </div>
                      </div>)}
                  </div>
                </card_1.CardContent>
              </card_1.Card>);
        })}
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4 border-t">
        <button_1.Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </button_1.Button>
        <button_1.Button type="submit">
          {method ? "Update Method" : "Create Method"}
        </button_1.Button>
      </div>
    </form>);
}
// Zone Form Component (same as before, reused)
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
        onSave(formData);
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
