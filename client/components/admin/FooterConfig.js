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
exports.default = FooterConfig;
var react_1 = require("react");
var card_1 = require("@/components/ui/card");
var button_1 = require("@/components/ui/button");
var input_1 = require("@/components/ui/input");
var label_1 = require("@/components/ui/label");
var badge_1 = require("@/components/ui/badge");
var lucide_react_1 = require("lucide-react");
var supabase_1 = require("@/lib/supabase");
function FooterConfig(_a) {
    var _this = this;
    var _b = _a.currentMaxColumns, currentMaxColumns = _b === void 0 ? 6 : _b, onConfigChange = _a.onConfigChange;
    var _c = (0, react_1.useState)(currentMaxColumns), maxColumns = _c[0], setMaxColumns = _c[1];
    var _d = (0, react_1.useState)(false), saving = _d[0], setSaving = _d[1];
    var _e = (0, react_1.useState)(false), saved = _e[0], setSaved = _e[1];
    var handleSave = function () { return __awaiter(_this, void 0, void 0, function () {
        var error, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, 3, 4]);
                    setSaving(true);
                    return [4 /*yield*/, supabase_1.supabase.from("site_settings").upsert({
                            key: "footer_max_columns",
                            value: maxColumns.toString(),
                            type: "number",
                            description: "Maximum number of columns in footer",
                        }, { onConflict: "key" })];
                case 1:
                    error = (_a.sent()).error;
                    if (error) {
                        console.error("Error saving footer config:", error);
                        alert("Error saving configuration");
                    }
                    else {
                        setSaved(true);
                        setTimeout(function () { return setSaved(false); }, 2000);
                        onConfigChange === null || onConfigChange === void 0 ? void 0 : onConfigChange(maxColumns);
                        // Suggest page refresh for changes to take effect
                        if (confirm("Configuration saved! Refresh the page to apply changes?")) {
                            window.location.reload();
                        }
                    }
                    return [3 /*break*/, 4];
                case 2:
                    error_1 = _a.sent();
                    console.error("Error:", error_1);
                    alert("Error saving configuration");
                    return [3 /*break*/, 4];
                case 3:
                    setSaving(false);
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var handleReset = function () {
        setMaxColumns(6);
    };
    var getGridClass = function (cols) {
        var classes = {
            3: "grid-cols-3",
            4: "grid-cols-4",
            5: "grid-cols-5",
            6: "grid-cols-6",
            7: "grid-cols-7",
            8: "grid-cols-8",
        };
        return classes[cols] || "grid-cols-4";
    };
    return (<card_1.Card className="border-blue-200 bg-blue-50">
      <card_1.CardHeader>
        <card_1.CardTitle className="flex items-center gap-2 text-blue-800">
          <lucide_react_1.Settings className="h-5 w-5"/>
          Footer Layout Configuration
          <badge_1.Badge variant="outline" className="bg-blue-100">
            Advanced
          </badge_1.Badge>
        </card_1.CardTitle>
        <p className="text-sm text-blue-700">
          Configure the maximum number of columns for the footer layout
        </p>
      </card_1.CardHeader>
      <card_1.CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label_1.Label htmlFor="max-columns">Maximum Columns</label_1.Label>
            <input_1.Input id="max-columns" type="number" min="3" max="8" value={maxColumns.toString()} onChange={function (e) { return setMaxColumns(parseInt(e.target.value) || 6); }} placeholder="6"/>
            <p className="text-xs text-blue-600 mt-1">
              Range: 3-8 columns (Column 1 reserved for company info)
            </p>
          </div>
          <div className="flex items-end gap-2">
            <button_1.Button onClick={handleSave} disabled={saving || maxColumns < 3 || maxColumns > 8} size="sm">
              <lucide_react_1.Save className="h-4 w-4 mr-2"/>
              {saving ? "Saving..." : "Save Config"}
            </button_1.Button>
            <button_1.Button onClick={handleReset} variant="outline" size="sm">
              <lucide_react_1.RotateCcw className="h-4 w-4 mr-2"/>
              Reset
            </button_1.Button>
            {saved && (<badge_1.Badge variant="default" className="bg-green-100 text-green-800">
                ✓ Saved
              </badge_1.Badge>)}
          </div>
        </div>

        {/* Preview */}
        <div className="space-y-3">
          <label_1.Label>Layout Preview ({maxColumns} columns)</label_1.Label>
          <div className={"grid ".concat(getGridClass(maxColumns), " gap-2 p-4 bg-white rounded-lg border")}>
            <div className="bg-blue-100 p-3 rounded text-center text-sm font-medium">
              Column 1<br />
              <span className="text-xs text-blue-600">(Company Info)</span>
            </div>
            {Array.from({ length: maxColumns - 1 }, function (_, i) { return (<div key={i} className="bg-gray-100 p-3 rounded text-center text-sm">
                Column {i + 2}
                <br />
                <span className="text-xs text-gray-600">(Available)</span>
              </div>); })}
          </div>
          <p className="text-xs text-gray-600">
            Column 1 is always reserved for company information (logo, contact
            details, social media)
          </p>
        </div>

        {/* Current Available Columns */}
        <div className="space-y-2">
          <label_1.Label>Available Columns for Footer Sections</label_1.Label>
          <div className="flex gap-2 flex-wrap">
            {Array.from({ length: maxColumns - 1 }, function (_, i) { return (<badge_1.Badge key={i} variant="outline" className="text-sm">
                Column {i + 2}
              </badge_1.Badge>); })}
          </div>
        </div>

        {/* Configuration Notes */}
        <div className="bg-white p-4 rounded-lg border border-blue-200">
          <h4 className="font-medium text-blue-800 mb-2">
            Configuration Notes:
          </h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Column 1 is always reserved for company information</li>
            <li>• Users can place custom sections in columns 2-{maxColumns}</li>
            <li>• Changes require a page refresh to take effect</li>
            <li>• Existing sections will remain in their current columns</li>
            <li>• Mobile layout automatically adapts to fewer columns</li>
          </ul>
        </div>
      </card_1.CardContent>
    </card_1.Card>);
}
