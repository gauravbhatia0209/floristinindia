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
exports.default = DatabaseTest;
var react_1 = require("react");
var card_1 = require("@/components/ui/card");
var badge_1 = require("@/components/ui/badge");
var button_1 = require("@/components/ui/button");
var lucide_react_1 = require("lucide-react");
var supabase_1 = require("@/lib/supabase");
function DatabaseTest() {
    var _a = (0, react_1.useState)([
        { name: "site_settings", status: "loading", count: 0 },
        { name: "product_categories", status: "loading", count: 0 },
        { name: "products", status: "loading", count: 0 },
        { name: "homepage_sections", status: "loading", count: 0 },
        { name: "shipping_zones", status: "loading", count: 0 },
        { name: "coupons", status: "loading", count: 0 },
        { name: "customers", status: "loading", count: 0 },
        { name: "orders", status: "loading", count: 0 },
        { name: "contact_submissions", status: "loading", count: 0 },
        { name: "pages", status: "loading", count: 0 },
    ]), tests = _a[0], setTests = _a[1];
    (0, react_1.useEffect)(function () {
        runTests();
    }, []);
    function runTests() {
        return __awaiter(this, void 0, void 0, function () {
            var tableNames, _loop_1, _i, tableNames_1, tableName;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tableNames = [
                            "site_settings",
                            "product_categories",
                            "products",
                            "homepage_sections",
                            "shipping_zones",
                            "coupons",
                            "customers",
                            "orders",
                            "contact_submissions",
                            "pages",
                        ];
                        _loop_1 = function (tableName) {
                            var _b, data, error_1, count_1, err_1;
                            return __generator(this, function (_c) {
                                switch (_c.label) {
                                    case 0:
                                        _c.trys.push([0, 2, , 3]);
                                        console.log("Testing table: ".concat(tableName));
                                        return [4 /*yield*/, supabase_1.supabase
                                                .from(tableName)
                                                .select("*", { count: "exact", head: true })];
                                    case 1:
                                        _b = _c.sent(), data = _b.data, error_1 = _b.error, count_1 = _b.count;
                                        setTests(function (prev) {
                                            return prev.map(function (test) {
                                                return test.name === tableName
                                                    ? __assign(__assign({}, test), { status: error_1 ? "error" : "success", count: count_1 || 0, error: error_1 === null || error_1 === void 0 ? void 0 : error_1.message }) : test;
                                            });
                                        });
                                        console.log("".concat(tableName, ": ").concat(count_1, " records, error:"), error_1);
                                        return [3 /*break*/, 3];
                                    case 2:
                                        err_1 = _c.sent();
                                        console.error("Failed to test ".concat(tableName, ":"), err_1);
                                        setTests(function (prev) {
                                            return prev.map(function (test) {
                                                return test.name === tableName
                                                    ? __assign(__assign({}, test), { status: "error", count: 0, error: "Connection failed" }) : test;
                                            });
                                        });
                                        return [3 /*break*/, 3];
                                    case 3: return [2 /*return*/];
                                }
                            });
                        };
                        _i = 0, tableNames_1 = tableNames;
                        _a.label = 1;
                    case 1:
                        if (!(_i < tableNames_1.length)) return [3 /*break*/, 4];
                        tableName = tableNames_1[_i];
                        return [5 /*yield**/, _loop_1(tableName)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        });
    }
    return (<div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Database Connection Test</h1>
          <p className="text-muted-foreground">
            Testing connection to all database tables
          </p>
        </div>
        <button_1.Button onClick={runTests}>
          <lucide_react_1.RefreshCw className="w-4 h-4 mr-2"/>
          Refresh Tests
        </button_1.Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {tests.map(function (test) { return (<card_1.Card key={test.name}>
            <card_1.CardHeader className="pb-3">
              <card_1.CardTitle className="text-base flex items-center justify-between">
                <span className="capitalize">
                  {test.name.replace("_", " ")}
                </span>
                {test.status === "loading" && (<div className="animate-spin w-4 h-4 border-2 border-primary border-t-transparent rounded-full"></div>)}
                {test.status === "success" && (<lucide_react_1.CheckCircle className="w-4 h-4 text-green-600"/>)}
                {test.status === "error" && (<lucide_react_1.XCircle className="w-4 h-4 text-red-600"/>)}
              </card_1.CardTitle>
            </card_1.CardHeader>
            <card_1.CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Status:</span>
                  <badge_1.Badge variant={test.status === "success"
                ? "default"
                : test.status === "error"
                    ? "destructive"
                    : "secondary"}>
                    {test.status}
                  </badge_1.Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Records:
                  </span>
                  <span className="font-medium">{test.count}</span>
                </div>
                {test.error && (<div className="text-xs text-red-600 mt-2">{test.error}</div>)}
              </div>
            </card_1.CardContent>
          </card_1.Card>); })}
      </div>

      <card_1.Card>
        <card_1.CardHeader>
          <card_1.CardTitle>Environment Check</card_1.CardTitle>
        </card_1.CardHeader>
        <card_1.CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Supabase URL:</span>
              <span className="font-mono text-xs">
                {import.meta.env.VITE_SUPABASE_URL ? "✓ Set" : "✗ Missing"}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Supabase Key:</span>
              <span className="font-mono text-xs">
                {import.meta.env.VITE_SUPABASE_ANON_KEY ? "✓ Set" : "✗ Missing"}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Environment:</span>
              <span className="font-mono text-xs">
                {import.meta.env.DEV ? "Development" : "Production"}
              </span>
            </div>
          </div>
        </card_1.CardContent>
      </card_1.Card>
    </div>);
}
