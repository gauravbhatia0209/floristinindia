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
exports.default = CategoryImageMigration;
var react_1 = require("react");
var button_1 = require("@/components/ui/button");
var card_1 = require("@/components/ui/card");
var alert_1 = require("@/components/ui/alert");
var progress_1 = require("@/components/ui/progress");
var badge_1 = require("@/components/ui/badge");
var lucide_react_1 = require("lucide-react");
var supabase_1 = require("@/lib/supabase");
var supabase_storage_1 = require("@/lib/supabase-storage");
function CategoryImageMigration() {
    var _this = this;
    var _a = (0, react_1.useState)([]), categories = _a[0], setCategories = _a[1];
    var _b = (0, react_1.useState)([]), imageStatuses = _b[0], setImageStatuses = _b[1];
    var _c = (0, react_1.useState)({
        total: 0,
        processed: 0,
        succeeded: 0,
        failed: 0,
        current: "",
        isRunning: false,
        isComplete: false,
        results: [],
    }), migrationStatus = _c[0], setMigrationStatus = _c[1];
    var _d = (0, react_1.useState)(true), isLoading = _d[0], setIsLoading = _d[1];
    var _e = (0, react_1.useState)(false), isValidating = _e[0], setIsValidating = _e[1];
    (0, react_1.useEffect)(function () {
        loadCategories();
    }, []);
    var loadCategories = function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, data, error, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 3, 4, 5]);
                    setIsLoading(true);
                    return [4 /*yield*/, supabase_1.supabase
                            .from("product_categories")
                            .select("*")
                            .order("name")];
                case 1:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    if (error)
                        throw error;
                    setCategories(data || []);
                    return [4 /*yield*/, validateImageUrls(data || [])];
                case 2:
                    _b.sent();
                    return [3 /*break*/, 5];
                case 3:
                    error_1 = _b.sent();
                    console.error("Error loading categories:", error_1);
                    return [3 /*break*/, 5];
                case 4:
                    setIsLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var validateImageUrls = function (categoriesData) { return __awaiter(_this, void 0, void 0, function () {
        var statuses, _i, categoriesData_1, category, isLocal, isSupabase, isAccessible, validationError, error_2, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 8, 9, 10]);
                    setIsValidating(true);
                    statuses = [];
                    _i = 0, categoriesData_1 = categoriesData;
                    _a.label = 1;
                case 1:
                    if (!(_i < categoriesData_1.length)) return [3 /*break*/, 7];
                    category = categoriesData_1[_i];
                    if (!category.image_url) {
                        statuses.push({
                            category: category,
                            isAccessible: false,
                            needsMigration: false,
                            isLocal: false,
                        });
                        return [3 /*break*/, 6];
                    }
                    isLocal = category.image_url.startsWith("/uploads/");
                    isSupabase = category.image_url.includes("supabase.co");
                    isAccessible = false;
                    validationError = void 0;
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, (0, supabase_storage_1.validateImageUrl)(category.image_url)];
                case 3:
                    isAccessible = _a.sent();
                    if (!isAccessible) {
                        validationError = "Image URL returns 404 or is not accessible";
                    }
                    return [3 /*break*/, 5];
                case 4:
                    error_2 = _a.sent();
                    validationError = "Validation failed: ".concat(error_2 instanceof Error ? error_2.message : "Unknown error");
                    return [3 /*break*/, 5];
                case 5:
                    statuses.push({
                        category: category,
                        isAccessible: isAccessible,
                        needsMigration: isLocal || (!isAccessible && !isSupabase),
                        isLocal: isLocal,
                        validationError: validationError,
                    });
                    _a.label = 6;
                case 6:
                    _i++;
                    return [3 /*break*/, 1];
                case 7:
                    setImageStatuses(statuses);
                    return [3 /*break*/, 10];
                case 8:
                    error_3 = _a.sent();
                    console.error("Error validating image URLs:", error_3);
                    return [3 /*break*/, 10];
                case 9:
                    setIsValidating(false);
                    return [7 /*endfinally*/];
                case 10: return [2 /*return*/];
            }
        });
    }); };
    var startMigration = function () { return __awaiter(_this, void 0, void 0, function () {
        var categoriesToMigrate, imageUrls, results_1, succeeded_1, failed_1, i, result, category, error, error_4, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    categoriesToMigrate = imageStatuses.filter(function (status) { return status.needsMigration && status.category.image_url; });
                    if (categoriesToMigrate.length === 0) {
                        alert("No categories need migration");
                        return [2 /*return*/];
                    }
                    setMigrationStatus({
                        total: categoriesToMigrate.length,
                        processed: 0,
                        succeeded: 0,
                        failed: 0,
                        current: "",
                        isRunning: true,
                        isComplete: false,
                        results: [],
                    });
                    imageUrls = categoriesToMigrate.map(function (status) { return status.category.image_url; });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 12, , 13]);
                    return [4 /*yield*/, (0, supabase_storage_1.batchMigrateImages)(imageUrls, "categories", function (completed, total, currentUrl) {
                            setMigrationStatus(function (prev) { return (__assign(__assign({}, prev), { processed: completed, current: currentUrl })); });
                        })];
                case 2:
                    results_1 = (_a.sent()).results;
                    succeeded_1 = 0;
                    failed_1 = 0;
                    i = 0;
                    _a.label = 3;
                case 3:
                    if (!(i < results_1.length)) return [3 /*break*/, 10];
                    result = results_1[i];
                    category = categoriesToMigrate[i].category;
                    if (!(result.success && result.publicUrl)) return [3 /*break*/, 8];
                    _a.label = 4;
                case 4:
                    _a.trys.push([4, 6, , 7]);
                    return [4 /*yield*/, supabase_1.supabase
                            .from("product_categories")
                            .update({ image_url: result.publicUrl })
                            .eq("id", category.id)];
                case 5:
                    error = (_a.sent()).error;
                    if (error) {
                        console.error("Failed to update category ".concat(category.name, ":"), error);
                        failed_1++;
                    }
                    else {
                        succeeded_1++;
                    }
                    return [3 /*break*/, 7];
                case 6:
                    error_4 = _a.sent();
                    console.error("Database update failed for category ".concat(category.name, ":"), error_4);
                    failed_1++;
                    return [3 /*break*/, 7];
                case 7: return [3 /*break*/, 9];
                case 8:
                    failed_1++;
                    _a.label = 9;
                case 9:
                    i++;
                    return [3 /*break*/, 3];
                case 10:
                    setMigrationStatus(function (prev) { return (__assign(__assign({}, prev), { succeeded: succeeded_1, failed: failed_1, isRunning: false, isComplete: true, results: results_1 })); });
                    // Reload categories to reflect changes
                    return [4 /*yield*/, loadCategories()];
                case 11:
                    // Reload categories to reflect changes
                    _a.sent();
                    return [3 /*break*/, 13];
                case 12:
                    error_5 = _a.sent();
                    console.error("Migration failed:", error_5);
                    setMigrationStatus(function (prev) { return (__assign(__assign({}, prev), { isRunning: false, isComplete: true })); });
                    return [3 /*break*/, 13];
                case 13: return [2 /*return*/];
            }
        });
    }); };
    var brokenImages = imageStatuses.filter(function (status) { return !status.isAccessible; });
    var localImages = imageStatuses.filter(function (status) { return status.isLocal; });
    var migrationNeeded = imageStatuses.filter(function (status) { return status.needsMigration; });
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
          <h1 className="text-2xl font-bold">Category Image Migration</h1>
          <p className="text-muted-foreground">
            Migrate category images from local storage to Supabase and fix
            broken links
          </p>
        </div>
        <div className="flex gap-2">
          <button_1.Button variant="outline" onClick={loadCategories} disabled={isValidating}>
            <lucide_react_1.RefreshCw className={"h-4 w-4 mr-2 ".concat(isValidating ? "animate-spin" : "")}/>
            Refresh
          </button_1.Button>
          <button_1.Button onClick={startMigration} disabled={migrationStatus.isRunning ||
            migrationNeeded.length === 0 ||
            isValidating}>
            <lucide_react_1.Upload className="h-4 w-4 mr-2"/>
            Start Migration
          </button_1.Button>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <card_1.Card>
          <card_1.CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <card_1.CardTitle className="text-sm font-medium">
              Total Categories
            </card_1.CardTitle>
            <lucide_react_1.Image className="h-4 w-4 text-muted-foreground"/>
          </card_1.CardHeader>
          <card_1.CardContent>
            <div className="text-2xl font-bold">{categories.length}</div>
            <p className="text-xs text-muted-foreground">
              {categories.filter(function (c) { return c.image_url; }).length} with images
            </p>
          </card_1.CardContent>
        </card_1.Card>

        <card_1.Card>
          <card_1.CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <card_1.CardTitle className="text-sm font-medium">Broken Images</card_1.CardTitle>
            <lucide_react_1.XCircle className="h-4 w-4 text-red-500"/>
          </card_1.CardHeader>
          <card_1.CardContent>
            <div className="text-2xl font-bold text-red-600">
              {brokenImages.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Not accessible or 404
            </p>
          </card_1.CardContent>
        </card_1.Card>

        <card_1.Card>
          <card_1.CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <card_1.CardTitle className="text-sm font-medium">Local Images</card_1.CardTitle>
            <lucide_react_1.Database className="h-4 w-4 text-orange-500"/>
          </card_1.CardHeader>
          <card_1.CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {localImages.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Using /uploads/ paths
            </p>
          </card_1.CardContent>
        </card_1.Card>

        <card_1.Card>
          <card_1.CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <card_1.CardTitle className="text-sm font-medium">
              Migration Needed
            </card_1.CardTitle>
            <lucide_react_1.AlertTriangle className="h-4 w-4 text-yellow-500"/>
          </card_1.CardHeader>
          <card_1.CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {migrationNeeded.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Need Supabase migration
            </p>
          </card_1.CardContent>
        </card_1.Card>
      </div>

      {/* Migration Progress */}
      {migrationStatus.isRunning && (<card_1.Card>
          <card_1.CardHeader>
            <card_1.CardTitle>Migration in Progress</card_1.CardTitle>
          </card_1.CardHeader>
          <card_1.CardContent className="space-y-4">
            <progress_1.Progress value={(migrationStatus.processed / migrationStatus.total) * 100} className="w-full"/>
            <div className="flex justify-between text-sm">
              <span>
                {migrationStatus.processed} of {migrationStatus.total} processed
              </span>
              <span>{migrationStatus.current}</span>
            </div>
          </card_1.CardContent>
        </card_1.Card>)}

      {/* Migration Results */}
      {migrationStatus.isComplete && (<alert_1.Alert>
          <lucide_react_1.CheckCircle className="h-4 w-4"/>
          <alert_1.AlertDescription>
            Migration completed: {migrationStatus.succeeded} succeeded,{" "}
            {migrationStatus.failed} failed
          </alert_1.AlertDescription>
        </alert_1.Alert>)}

      {/* Category Status List */}
      <card_1.Card>
        <card_1.CardHeader>
          <card_1.CardTitle>Category Image Status</card_1.CardTitle>
        </card_1.CardHeader>
        <card_1.CardContent>
          {isValidating ? (<div className="text-center py-8">
              <lucide_react_1.RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground"/>
              <p className="text-muted-foreground">Validating image URLs...</p>
            </div>) : (<div className="space-y-4">
              {imageStatuses.map(function (status) { return (<div key={status.category.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                      {status.category.image_url ? (<img src={status.category.image_url} alt={status.category.name} className="w-full h-full object-cover" onError={function (e) {
                        e.target.style.display =
                            "none";
                    }}/>) : (<div className="w-full h-full flex items-center justify-center">
                          <lucide_react_1.Image className="h-6 w-6 text-gray-400"/>
                        </div>)}
                    </div>
                    <div>
                      <h3 className="font-medium">{status.category.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {status.category.image_url || "No image"}
                      </p>
                      {status.validationError && (<p className="text-sm text-red-600">
                          {status.validationError}
                        </p>)}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {status.isAccessible ? (<badge_1.Badge variant="default" className="bg-green-100 text-green-800">
                        <lucide_react_1.CheckCircle className="h-3 w-3 mr-1"/>
                        Accessible
                      </badge_1.Badge>) : (<badge_1.Badge variant="destructive">
                        <lucide_react_1.XCircle className="h-3 w-3 mr-1"/>
                        Broken
                      </badge_1.Badge>)}
                    {status.isLocal && (<badge_1.Badge variant="outline" className="bg-orange-50 text-orange-700">
                        Local
                      </badge_1.Badge>)}
                    {status.needsMigration && (<badge_1.Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                        Needs Migration
                      </badge_1.Badge>)}
                  </div>
                </div>); })}
            </div>)}
        </card_1.CardContent>
      </card_1.Card>
    </div>);
}
