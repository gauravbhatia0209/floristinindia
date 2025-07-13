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
exports.default = ShippingMethodSelector;
var react_1 = require("react");
var card_1 = require("@/components/ui/card");
var label_1 = require("@/components/ui/label");
var radio_group_1 = require("@/components/ui/radio-group");
var badge_1 = require("@/components/ui/badge");
var alert_1 = require("@/components/ui/alert");
var lucide_react_1 = require("lucide-react");
var shipping_service_1 = require("@/lib/shipping-service");
function ShippingMethodSelector(_a) {
    var pincode = _a.pincode, orderValue = _a.orderValue, selectedMethodId = _a.selectedMethodId, onMethodSelect = _a.onMethodSelect, _b = _a.className, className = _b === void 0 ? "" : _b;
    var _c = (0, react_1.useState)([]), availableMethods = _c[0], setAvailableMethods = _c[1];
    var _d = (0, react_1.useState)(false), isLoading = _d[0], setIsLoading = _d[1];
    var _e = (0, react_1.useState)(""), error = _e[0], setError = _e[1];
    var _f = (0, react_1.useState)(false), hasAutoSelected = _f[0], setHasAutoSelected = _f[1];
    (0, react_1.useEffect)(function () {
        if (pincode) {
            setHasAutoSelected(false); // Reset auto-selection flag for new pincode
            fetchShippingMethods();
        }
        else {
            setAvailableMethods([]);
            setHasAutoSelected(false);
            onMethodSelect(null, 0);
        }
    }, [pincode]);
    function fetchShippingMethods() {
        return __awaiter(this, void 0, void 0, function () {
            var methods, firstMethod, cost, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, 3, 4]);
                        setIsLoading(true);
                        setError("");
                        return [4 /*yield*/, (0, shipping_service_1.getAvailableShippingMethods)(pincode)];
                    case 1:
                        methods = _a.sent();
                        if (methods.length === 0) {
                            setError("Sorry, delivery is not available to this pincode.");
                            setAvailableMethods([]);
                            onMethodSelect(null, 0);
                            return [2 /*return*/];
                        }
                        setAvailableMethods(methods);
                        // Auto-select the first method ONLY if:
                        // 1. No method is currently selected
                        // 2. We haven't auto-selected for this pincode yet
                        // 3. Methods are available
                        if (!selectedMethodId && !hasAutoSelected && methods.length > 0) {
                            firstMethod = methods[0];
                            cost = (0, shipping_service_1.calculateShippingCost)(firstMethod, orderValue);
                            setHasAutoSelected(true);
                            onMethodSelect(firstMethod, cost);
                        }
                        return [3 /*break*/, 4];
                    case 2:
                        error_1 = _a.sent();
                        console.error("Error fetching shipping methods:", error_1);
                        setError("Failed to load shipping options. Please try again.");
                        return [3 /*break*/, 4];
                    case 3:
                        setIsLoading(false);
                        return [7 /*endfinally*/];
                    case 4: return [2 /*return*/];
                }
            });
        });
    }
    function handleMethodChange(methodId) {
        var method = availableMethods.find(function (m) { return m.config_id === methodId; });
        if (method) {
            var cost = (0, shipping_service_1.calculateShippingCost)(method, orderValue);
            onMethodSelect(method, cost);
        }
    }
    if (isLoading) {
        return (<card_1.Card className={className}>
        <card_1.CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            <div className="h-16 bg-gray-200 rounded"></div>
            <div className="h-16 bg-gray-200 rounded"></div>
          </div>
        </card_1.CardContent>
      </card_1.Card>);
    }
    if (error) {
        return (<card_1.Card className={className}>
        <card_1.CardContent className="p-6">
          <alert_1.Alert variant="destructive">
            <lucide_react_1.MapPin className="h-4 w-4"/>
            <alert_1.AlertDescription>{error}</alert_1.AlertDescription>
          </alert_1.Alert>
        </card_1.CardContent>
      </card_1.Card>);
    }
    if (availableMethods.length === 0) {
        return (<card_1.Card className={className}>
        <card_1.CardContent className="p-6">
          <alert_1.Alert>
            <lucide_react_1.Info className="h-4 w-4"/>
            <alert_1.AlertDescription>
              Enter your pincode to see available delivery options.
            </alert_1.AlertDescription>
          </alert_1.Alert>
        </card_1.CardContent>
      </card_1.Card>);
    }
    return (<card_1.Card className={className}>
      <card_1.CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <lucide_react_1.Truck className="h-5 w-5 text-blue-600"/>
            <h3 className="text-lg font-semibold">Delivery Options</h3>
            <badge_1.Badge variant="outline">{availableMethods.length} available</badge_1.Badge>
          </div>

          <radio_group_1.RadioGroup value={selectedMethodId || ""} onValueChange={handleMethodChange} className="space-y-3">
            {availableMethods.map(function (method) {
            var shippingCost = (0, shipping_service_1.calculateShippingCost)(method, orderValue);
            var isFreeShipping = shippingCost === 0 && method.price > 0;
            var isSelected = selectedMethodId === method.config_id;
            return (<div key={method.config_id} className={"border rounded-lg p-4 cursor-pointer transition-all ".concat(isSelected
                    ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
                    : "border-gray-200 hover:border-gray-300")} onClick={function () { return handleMethodChange(method.config_id); }}>
                  <div className="flex items-start gap-3">
                    <radio_group_1.RadioGroupItem value={method.config_id} id={method.config_id} className="mt-1"/>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <label_1.Label htmlFor={method.config_id} className="font-medium cursor-pointer">
                            {method.name}
                          </label_1.Label>
                          <badge_1.Badge variant="outline" className="text-xs">
                            {method.type.replace("_", " ")}
                          </badge_1.Badge>
                          {isSelected && (<lucide_react_1.CheckCircle className="h-4 w-4 text-green-600"/>)}
                        </div>
                        <div className="text-right">
                          {isFreeShipping ? (<div className="space-y-1">
                              <span className="text-green-600 font-semibold text-sm">
                                FREE
                              </span>
                              <div className="text-xs text-muted-foreground line-through">
                                ₹{method.price}
                              </div>
                            </div>) : (<span className="font-semibold">
                              {shippingCost === 0 ? "FREE" : "\u20B9".concat(shippingCost)}
                            </span>)}
                        </div>
                      </div>

                      {method.description && (<p className="text-sm text-muted-foreground">
                          {method.description}
                        </p>)}

                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <lucide_react_1.Clock className="h-3 w-3"/>
                          {method.delivery_time}
                        </span>
                        <span className="flex items-center gap-1">
                          <lucide_react_1.MapPin className="h-3 w-3"/>
                          {method.zone_name}
                        </span>
                        {method.free_shipping_minimum &&
                    orderValue < method.free_shipping_minimum && (<span className="text-green-600 text-xs">
                              Free above ₹{method.free_shipping_minimum}
                            </span>)}
                      </div>

                      {method.rules && (<alert_1.Alert className="mt-2">
                          <lucide_react_1.Info className="h-4 w-4"/>
                          <alert_1.AlertDescription className="text-xs">
                            {method.rules}
                          </alert_1.AlertDescription>
                        </alert_1.Alert>)}
                    </div>
                  </div>
                </div>);
        })}
          </radio_group_1.RadioGroup>

          {/* Summary */}
          <div className="pt-4 border-t">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">
                Delivering to pincode: {pincode}
              </span>
              {selectedMethodId && (<span className="font-medium">
                  Total delivery charges:{" "}
                  {(function () {
                var method = availableMethods.find(function (m) { return m.config_id === selectedMethodId; });
                if (method) {
                    var cost = (0, shipping_service_1.calculateShippingCost)(method, orderValue);
                    return cost === 0 ? "FREE" : "\u20B9".concat(cost);
                }
                return "₹0";
            })()}
                </span>)}
            </div>
          </div>
        </div>
      </card_1.CardContent>
    </card_1.Card>);
}
