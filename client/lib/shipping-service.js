"use strict";
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
exports.getAvailableShippingMethods = getAvailableShippingMethods;
exports.calculateShippingCost = calculateShippingCost;
exports.getShippingMethodById = getShippingMethodById;
exports.validateShippingMethod = validateShippingMethod;
exports.getAllShippingZones = getAllShippingZones;
exports.isDeliveryAvailable = isDeliveryAvailable;
var supabase_1 = require("./supabase");
/**
 * Get available shipping methods for a specific pincode
 */
function getAvailableShippingMethods(pincode) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, zones, zoneError, zone, _b, methods, methodsError, mappedMethods, error_1;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, supabase_1.supabase
                            .from("shipping_zones")
                            .select("*")
                            .eq("is_active", true)];
                case 1:
                    _a = _c.sent(), zones = _a.data, zoneError = _a.error;
                    if (zoneError) {
                        console.error("Error fetching zones:", zoneError);
                        throw zoneError;
                    }
                    zone = zones === null || zones === void 0 ? void 0 : zones.find(function (z) { return z.pincodes.includes(pincode); });
                    if (!zone) {
                        return [2 /*return*/, []];
                    }
                    console.log("Found zone for pincode:", zone);
                    return [4 /*yield*/, supabase_1.supabase
                            .from("shipping_methods_with_zones")
                            .select("*")
                            .eq("zone_id", zone.id)
                            .eq("method_active", true)
                            .eq("zone_active", true)
                            .order("sort_order")];
                case 2:
                    _b = _c.sent(), methods = _b.data, methodsError = _b.error;
                    if (methodsError) {
                        console.error("Error fetching filtered methods:", methodsError);
                        throw methodsError;
                    }
                    console.log("Filtered methods for zone:", methods);
                    mappedMethods = (methods === null || methods === void 0 ? void 0 : methods.map(function (method) {
                        var _a;
                        return ({
                            method_id: method.method_id,
                            config_id: method.config_id,
                            name: method.name,
                            description: method.description,
                            type: method.type,
                            price: method.price,
                            free_shipping_minimum: method.free_shipping_minimum,
                            delivery_time: method.delivery_time,
                            rules: method.rules,
                            time_slot_required: (_a = method.time_slot_required) !== null && _a !== void 0 ? _a : false,
                            zone_id: method.zone_id,
                            zone_name: method.zone_name,
                        });
                    })) || [];
                    return [2 /*return*/, mappedMethods];
                case 3:
                    error_1 = _c.sent();
                    console.error("Error fetching shipping methods:", error_1);
                    return [2 /*return*/, []];
                case 4: return [2 /*return*/];
            }
        });
    });
}
/**
 * Calculate shipping cost based on order value and selected method
 */
function calculateShippingCost(method, orderValue) {
    if (method.free_shipping_minimum &&
        orderValue >= method.free_shipping_minimum) {
        return 0; // Free shipping
    }
    return method.price;
}
/**
 * Get shipping method details by config ID
 */
function getShippingMethodById(configId) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, method, error, error_2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, supabase_1.supabase
                            .from("shipping_methods_with_zones")
                            .select("*")
                            .eq("config_id", configId)
                            .eq("method_active", true)
                            .eq("zone_active", true)
                            .single()];
                case 1:
                    _a = _b.sent(), method = _a.data, error = _a.error;
                    if (error)
                        throw error;
                    return [2 /*return*/, method
                            ? {
                                method_id: method.method_id,
                                config_id: method.config_id,
                                name: method.name,
                                description: method.description,
                                type: method.type,
                                price: method.price,
                                free_shipping_minimum: method.free_shipping_minimum,
                                delivery_time: method.delivery_time,
                                rules: method.rules,
                                time_slot_required: method.time_slot_required || false,
                                zone_id: method.zone_id,
                                zone_name: method.zone_name,
                            }
                            : null];
                case 2:
                    error_2 = _b.sent();
                    console.error("Error fetching shipping method by ID:", error_2);
                    return [2 /*return*/, null];
                case 3: return [2 /*return*/];
            }
        });
    });
}
/**
 * Validate if a shipping method is available for a pincode
 */
function validateShippingMethod(configId, pincode) {
    return __awaiter(this, void 0, void 0, function () {
        var availableMethods, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, getAvailableShippingMethods(pincode)];
                case 1:
                    availableMethods = _a.sent();
                    return [2 /*return*/, availableMethods.some(function (method) { return method.config_id === configId; })];
                case 2:
                    error_3 = _a.sent();
                    console.error("Error validating shipping method:", error_3);
                    return [2 /*return*/, false];
                case 3: return [2 /*return*/];
            }
        });
    });
}
/**
 * Get all shipping zones (for admin reference)
 */
function getAllShippingZones() {
    return __awaiter(this, void 0, void 0, function () {
        var _a, zones, error, error_4;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, supabase_1.supabase
                            .from("shipping_zones")
                            .select("*")
                            .order("name")];
                case 1:
                    _a = _b.sent(), zones = _a.data, error = _a.error;
                    if (error)
                        throw error;
                    return [2 /*return*/, zones || []];
                case 2:
                    error_4 = _b.sent();
                    console.error("Error fetching shipping zones:", error_4);
                    return [2 /*return*/, []];
                case 3: return [2 /*return*/];
            }
        });
    });
}
/**
 * Check if delivery is available to a specific pincode
 */
function isDeliveryAvailable(pincode) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, zones, error, error_5;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, supabase_1.supabase
                            .from("shipping_zones")
                            .select("pincodes")
                            .eq("is_active", true)];
                case 1:
                    _a = _b.sent(), zones = _a.data, error = _a.error;
                    if (error)
                        throw error;
                    return [2 /*return*/, (zones === null || zones === void 0 ? void 0 : zones.some(function (zone) { return zone.pincodes.includes(pincode); })) || false];
                case 2:
                    error_5 = _b.sent();
                    console.error("Error checking delivery availability:", error_5);
                    return [2 /*return*/, false];
                case 3: return [2 /*return*/];
            }
        });
    });
}
