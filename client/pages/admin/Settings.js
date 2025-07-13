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
exports.default = Settings;
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var button_1 = require("@/components/ui/button");
var card_1 = require("@/components/ui/card");
var input_1 = require("@/components/ui/input");
var label_1 = require("@/components/ui/label");
var textarea_1 = require("@/components/ui/textarea");
var switch_1 = require("@/components/ui/switch");
var tabs_1 = require("@/components/ui/tabs");
var separator_1 = require("@/components/ui/separator");
var supabase_1 = require("@/lib/supabase");
var supabase_storage_1 = require("@/lib/supabase-storage");
function Settings() {
    var _a = (0, react_1.useState)({
        site_name: "",
        site_tagline: "",
        site_description: "",
        logo_url: "",
        favicon_url: "",
        contact_phone: "",
        contact_phone_2: "",
        whatsapp_number: "",
        contact_email: "",
        contact_address: "",
        business_hours: "",
        google_maps_embed: "",
        facebook_url: "",
        instagram_url: "",
        twitter_url: "",
        youtube_url: "",
        currency_symbol: "₹",
        gst_rate: "18",
        free_shipping_minimum: "500",
        same_day_cutoff_time: "14:00",
        enable_reviews: true,
        enable_wishlist: true,
        enable_file_upload: true,
        enable_special_instructions: true,
        enable_guest_checkout: true,
        default_meta_title: "",
        default_meta_description: "",
        google_analytics_id: "",
        facebook_pixel_id: "",
        facebook_app_id: "",
        meta_title_template: "%title% | %sitename%",
        og_image_url: "",
        twitter_card_type: "summary_large_image",
        twitter_site: "",
        canonical_url: "",
        robots_txt_content: "",
        schema_org_organization: "",
        custom_head_tags: "",
        sitemap_enabled: true,
        breadcrumbs_enabled: true,
    }), settings = _a[0], setSettings = _a[1];
    var _b = (0, react_1.useState)(true), isLoading = _b[0], setIsLoading = _b[1];
    var _c = (0, react_1.useState)(false), isSaving = _c[0], setIsSaving = _c[1];
    var _d = (0, react_1.useState)(false), logoUploading = _d[0], setLogoUploading = _d[1];
    var _e = (0, react_1.useState)(false), faviconUploading = _e[0], setFaviconUploading = _e[1];
    var _f = (0, react_1.useState)(false), ogImageUploading = _f[0], setOgImageUploading = _f[1];
    (0, react_1.useEffect)(function () {
        fetchSettings();
    }, []);
    function fetchSettings() {
        return __awaiter(this, void 0, void 0, function () {
            var data, settingsMap_1, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, 3, 4]);
                        return [4 /*yield*/, supabase_1.supabase.from("site_settings").select("*")];
                    case 1:
                        data = (_a.sent()).data;
                        if (data) {
                            settingsMap_1 = {};
                            data.forEach(function (setting) {
                                if (setting.type === "boolean") {
                                    settingsMap_1[setting.key] = setting.value === "true";
                                }
                                else if (setting.type === "json") {
                                    try {
                                        settingsMap_1[setting.key] = JSON.parse(setting.value);
                                    }
                                    catch (_a) {
                                        settingsMap_1[setting.key] = setting.value;
                                    }
                                }
                                else {
                                    settingsMap_1[setting.key] = setting.value;
                                }
                            });
                            setSettings(function (prev) { return (__assign(__assign({}, prev), settingsMap_1)); });
                        }
                        return [3 /*break*/, 4];
                    case 2:
                        error_1 = _a.sent();
                        console.error("Failed to fetch settings:", error_1);
                        return [3 /*break*/, 4];
                    case 3:
                        setIsLoading(false);
                        return [7 /*endfinally*/];
                    case 4: return [2 /*return*/];
                }
            });
        });
    }
    function saveSettings() {
        return __awaiter(this, void 0, void 0, function () {
            var settingsToSave, _i, settingsToSave_1, setting, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        setIsSaving(true);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 6, 7, 8]);
                        settingsToSave = Object.entries(settings).map(function (_a) {
                            var key = _a[0], value = _a[1];
                            var type = "text";
                            var stringValue = String(value);
                            if (typeof value === "boolean") {
                                type = "boolean";
                                stringValue = value.toString();
                            }
                            else if (typeof value === "number") {
                                type = "number";
                            }
                            else if (typeof value === "object") {
                                type = "json";
                                stringValue = JSON.stringify(value);
                            }
                            return {
                                key: key,
                                value: stringValue,
                                type: type,
                                description: getSettingDescription(key),
                            };
                        });
                        _i = 0, settingsToSave_1 = settingsToSave;
                        _a.label = 2;
                    case 2:
                        if (!(_i < settingsToSave_1.length)) return [3 /*break*/, 5];
                        setting = settingsToSave_1[_i];
                        return [4 /*yield*/, supabase_1.supabase.from("site_settings").upsert(__assign(__assign({}, setting), { updated_at: new Date().toISOString() }), {
                                onConflict: "key",
                            })];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5:
                        alert("Settings saved successfully!");
                        return [3 /*break*/, 8];
                    case 6:
                        error_2 = _a.sent();
                        console.error("Failed to save settings:", error_2);
                        alert("Failed to save settings. Please try again.");
                        return [3 /*break*/, 8];
                    case 7:
                        setIsSaving(false);
                        return [7 /*endfinally*/];
                    case 8: return [2 /*return*/];
                }
            });
        });
    }
    function getSettingDescription(key) {
        var descriptions = {
            site_name: "The name of your website",
            site_tagline: "Short tagline for your site",
            site_description: "Brief description of your business",
            logo_url: "Site logo image",
            favicon_url: "Site favicon image",
            contact_phone: "Primary contact phone number",
            contact_phone_2: "Secondary contact phone number",
            contact_email: "Main contact email address",
            contact_address: "Business address",
            business_hours: "Operating hours",
            google_maps_embed: "Google Maps embed iframe code",
            currency_symbol: "Currency symbol for prices",
            gst_rate: "GST rate percentage",
            free_shipping_minimum: "Minimum order amount for free shipping",
            same_day_cutoff_time: "Order cutoff time for same-day delivery",
            google_analytics_id: "Google Analytics tracking ID (GA4 format: G-XXXXXXXXXX)",
            facebook_app_id: "Facebook App ID for enhanced Facebook Shop integration",
        };
        return descriptions[key] || "";
    }
    function handleInputChange(key, value) {
        setSettings(function (prev) {
            var _a;
            return (__assign(__assign({}, prev), (_a = {}, _a[key] = value, _a)));
        });
    }
    function handleLogoUpload(event) {
        return __awaiter(this, void 0, void 0, function () {
            var file, result, error_3;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        file = (_a = event.target.files) === null || _a === void 0 ? void 0 : _a[0];
                        if (!file)
                            return [2 /*return*/];
                        setLogoUploading(true);
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 5, 6, 7]);
                        if (!settings.logo_url) return [3 /*break*/, 3];
                        return [4 /*yield*/, (0, supabase_storage_1.deleteImageFromSupabase)(settings.logo_url)];
                    case 2:
                        _b.sent();
                        _b.label = 3;
                    case 3: return [4 /*yield*/, (0, supabase_storage_1.uploadImageToSupabase)(file, "logos")];
                    case 4:
                        result = _b.sent();
                        if (result.success && result.publicUrl) {
                            handleInputChange("logo_url", result.publicUrl);
                        }
                        else {
                            alert(result.error || "Failed to upload logo");
                        }
                        return [3 /*break*/, 7];
                    case 5:
                        error_3 = _b.sent();
                        console.error("Logo upload error:", error_3);
                        alert("Failed to upload logo");
                        return [3 /*break*/, 7];
                    case 6:
                        setLogoUploading(false);
                        return [7 /*endfinally*/];
                    case 7: return [2 /*return*/];
                }
            });
        });
    }
    function handleFaviconUpload(event) {
        return __awaiter(this, void 0, void 0, function () {
            var file, result, error_4;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        file = (_a = event.target.files) === null || _a === void 0 ? void 0 : _a[0];
                        if (!file)
                            return [2 /*return*/];
                        setFaviconUploading(true);
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 5, 6, 7]);
                        if (!settings.favicon_url) return [3 /*break*/, 3];
                        return [4 /*yield*/, (0, supabase_storage_1.deleteImageFromSupabase)(settings.favicon_url)];
                    case 2:
                        _b.sent();
                        _b.label = 3;
                    case 3: return [4 /*yield*/, (0, supabase_storage_1.uploadImageToSupabase)(file, "favicons")];
                    case 4:
                        result = _b.sent();
                        if (result.success && result.publicUrl) {
                            handleInputChange("favicon_url", result.publicUrl);
                        }
                        else {
                            alert(result.error || "Failed to upload favicon");
                        }
                        return [3 /*break*/, 7];
                    case 5:
                        error_4 = _b.sent();
                        console.error("Favicon upload error:", error_4);
                        alert("Failed to upload favicon");
                        return [3 /*break*/, 7];
                    case 6:
                        setFaviconUploading(false);
                        return [7 /*endfinally*/];
                    case 7: return [2 /*return*/];
                }
            });
        });
    }
    function removeLogo() {
        handleInputChange("logo_url", "");
    }
    function removeFavicon() {
        handleInputChange("favicon_url", "");
    }
    function handleOgImageUpload(event) {
        return __awaiter(this, void 0, void 0, function () {
            var file, result, error_5;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        file = (_a = event.target.files) === null || _a === void 0 ? void 0 : _a[0];
                        if (!file)
                            return [2 /*return*/];
                        setOgImageUploading(true);
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 5, 6, 7]);
                        if (!settings.og_image_url) return [3 /*break*/, 3];
                        return [4 /*yield*/, (0, supabase_storage_1.deleteImageFromSupabase)(settings.og_image_url)];
                    case 2:
                        _b.sent();
                        _b.label = 3;
                    case 3: return [4 /*yield*/, (0, supabase_storage_1.uploadImageToSupabase)(file, "og-images")];
                    case 4:
                        result = _b.sent();
                        if (result.success && result.publicUrl) {
                            handleInputChange("og_image_url", result.publicUrl);
                        }
                        else {
                            alert(result.error || "Failed to upload OG image");
                        }
                        return [3 /*break*/, 7];
                    case 5:
                        error_5 = _b.sent();
                        console.error("OG image upload error:", error_5);
                        alert("Failed to upload OG image");
                        return [3 /*break*/, 7];
                    case 6:
                        setOgImageUploading(false);
                        return [7 /*endfinally*/];
                    case 7: return [2 /*return*/];
                }
            });
        });
    }
    function removeOgImage() {
        handleInputChange("og_image_url", "");
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
          <h1 className="text-2xl font-bold">Site Settings</h1>
          <p className="text-muted-foreground">
            Configure your website settings and preferences
          </p>
        </div>
        <button_1.Button onClick={saveSettings} disabled={isSaving}>
          <lucide_react_1.Save className="w-4 h-4 mr-2"/>
          {isSaving ? "Saving..." : "Save Settings"}
        </button_1.Button>
      </div>

      <tabs_1.Tabs defaultValue="general" className="space-y-6">
        <tabs_1.TabsList className="grid w-full grid-cols-6">
          <tabs_1.TabsTrigger value="general">General</tabs_1.TabsTrigger>
          <tabs_1.TabsTrigger value="contact">Contact</tabs_1.TabsTrigger>
          <tabs_1.TabsTrigger value="business">Business</tabs_1.TabsTrigger>
          <tabs_1.TabsTrigger value="features">Features</tabs_1.TabsTrigger>
          <tabs_1.TabsTrigger value="seo">SEO</tabs_1.TabsTrigger>
          <tabs_1.TabsTrigger value="advanced-seo">Advanced SEO</tabs_1.TabsTrigger>
        </tabs_1.TabsList>

        <tabs_1.TabsContent value="general" className="space-y-6">
          <card_1.Card>
            <card_1.CardHeader>
              <card_1.CardTitle className="flex items-center gap-2">
                <lucide_react_1.Globe className="w-5 h-5"/>
                Site Information
              </card_1.CardTitle>
            </card_1.CardHeader>
            <card_1.CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label_1.Label htmlFor="site_name">Site Name</label_1.Label>
                  <input_1.Input id="site_name" value={settings.site_name} onChange={function (e) {
            return handleInputChange("site_name", e.target.value);
        }} placeholder="Florist in India"/>
                </div>
                <div>
                  <label_1.Label htmlFor="site_tagline">Site Tagline</label_1.Label>
                  <input_1.Input id="site_tagline" value={settings.site_tagline} onChange={function (e) {
            return handleInputChange("site_tagline", e.target.value);
        }} placeholder="Fresh Flowers Delivered Daily"/>
                </div>
              </div>

              <div>
                <label_1.Label htmlFor="site_description">Site Description</label_1.Label>
                <textarea_1.Textarea id="site_description" value={settings.site_description} onChange={function (e) {
            return handleInputChange("site_description", e.target.value);
        }} placeholder="Premium flower delivery service across India..." rows={3}/>
              </div>

              <separator_1.Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <label_1.Label>Logo</label_1.Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                    {settings.logo_url ? (<div className="space-y-3">
                        <div className="flex items-center justify-center">
                          <img src={settings.logo_url} alt="Logo preview" className="max-h-20 max-w-full object-contain"/>
                        </div>
                        <div className="flex gap-2 justify-center">
                          <input_1.Input type="file" accept="image/*" onChange={handleLogoUpload} disabled={logoUploading} className="hidden" id="logo-upload"/>
                          <label_1.Label htmlFor="logo-upload">
                            <button_1.Button variant="outline" size="sm" asChild disabled={logoUploading}>
                              <span>
                                {logoUploading ? "Uploading..." : "Change"}
                              </span>
                            </button_1.Button>
                          </label_1.Label>
                          <button_1.Button variant="outline" size="sm" onClick={removeLogo}>
                            <lucide_react_1.X className="h-4 w-4"/>
                          </button_1.Button>
                        </div>
                      </div>) : (<div className="text-center space-y-3">
                        <lucide_react_1.Image className="h-8 w-8 mx-auto text-muted-foreground"/>
                        <div>
                          <input_1.Input type="file" accept="image/*" onChange={handleLogoUpload} disabled={logoUploading} className="hidden" id="logo-upload"/>
                          <label_1.Label htmlFor="logo-upload">
                            <button_1.Button variant="outline" asChild disabled={logoUploading}>
                              <span>
                                <lucide_react_1.Upload className="h-4 w-4 mr-2"/>
                                {logoUploading ? "Uploading..." : "Upload Logo"}
                              </span>
                            </button_1.Button>
                          </label_1.Label>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          PNG, JPG, or WebP up to 3MB
                          <br />
                          Recommended: 300×100px or 400×120px
                        </p>
                      </div>)}
                  </div>
                </div>

                <div className="space-y-3">
                  <label_1.Label>Favicon</label_1.Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                    {settings.favicon_url ? (<div className="space-y-3">
                        <div className="flex items-center justify-center">
                          <img src={settings.favicon_url} alt="Favicon preview" className="w-8 h-8 object-contain"/>
                        </div>
                        <div className="flex gap-2 justify-center">
                          <input_1.Input type="file" accept="image/*" onChange={handleFaviconUpload} disabled={faviconUploading} className="hidden" id="favicon-upload"/>
                          <label_1.Label htmlFor="favicon-upload">
                            <button_1.Button variant="outline" size="sm" asChild disabled={faviconUploading}>
                              <span>
                                {faviconUploading ? "Uploading..." : "Change"}
                              </span>
                            </button_1.Button>
                          </label_1.Label>
                          <button_1.Button variant="outline" size="sm" onClick={removeFavicon}>
                            <lucide_react_1.X className="h-4 w-4"/>
                          </button_1.Button>
                        </div>
                      </div>) : (<div className="text-center space-y-3">
                        <lucide_react_1.Image className="h-8 w-8 mx-auto text-muted-foreground"/>
                        <div>
                          <input_1.Input type="file" accept="image/*" onChange={handleFaviconUpload} disabled={faviconUploading} className="hidden" id="favicon-upload"/>
                          <label_1.Label htmlFor="favicon-upload">
                            <button_1.Button variant="outline" asChild disabled={faviconUploading}>
                              <span>
                                <lucide_react_1.Upload className="h-4 w-4 mr-2"/>
                                {faviconUploading
                ? "Uploading..."
                : "Upload Favicon"}
                              </span>
                            </button_1.Button>
                          </label_1.Label>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          ICO, PNG, or JPG up to 3MB
                          <br />
                          Recommended: 32×32px or 48×48px
                        </p>
                      </div>)}
                  </div>
                </div>
              </div>
            </card_1.CardContent>
          </card_1.Card>
        </tabs_1.TabsContent>

        <tabs_1.TabsContent value="contact" className="space-y-6">
          <card_1.Card>
            <card_1.CardHeader>
              <card_1.CardTitle className="flex items-center gap-2">
                <lucide_react_1.Phone className="w-5 h-5"/>
                Contact Information
              </card_1.CardTitle>
            </card_1.CardHeader>
            <card_1.CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label_1.Label htmlFor="contact_phone">Contact Phone (Primary)</label_1.Label>
                  <input_1.Input id="contact_phone" value={settings.contact_phone} onChange={function (e) {
            return handleInputChange("contact_phone", e.target.value);
        }} placeholder="+91 98765 43210"/>
                </div>
                <div>
                  <label_1.Label htmlFor="contact_phone_2">
                    Contact Phone (Secondary)
                  </label_1.Label>
                  <input_1.Input id="contact_phone_2" value={settings.contact_phone_2} onChange={function (e) {
            return handleInputChange("contact_phone_2", e.target.value);
        }} placeholder="+91 98765 43211"/>
                </div>
                <div>
                  <label_1.Label htmlFor="whatsapp_number">WhatsApp Number</label_1.Label>
                  <input_1.Input id="whatsapp_number" value={settings.whatsapp_number} onChange={function (e) {
            return handleInputChange("whatsapp_number", e.target.value);
        }} placeholder="+919876543210"/>
                  <p className="text-xs text-muted-foreground mt-1">
                    Include country code (e.g., +919876543210)
                  </p>
                </div>
                <div>
                  <label_1.Label htmlFor="contact_email">Contact Email</label_1.Label>
                  <input_1.Input id="contact_email" type="email" value={settings.contact_email} onChange={function (e) {
            return handleInputChange("contact_email", e.target.value);
        }} placeholder="info@floristinindia.com"/>
                </div>
              </div>

              <div>
                <label_1.Label htmlFor="contact_address">Business Address</label_1.Label>
                <textarea_1.Textarea id="contact_address" value={settings.contact_address} onChange={function (e) {
            return handleInputChange("contact_address", e.target.value);
        }} placeholder="123 Flower Street, Mumbai, Maharashtra, India" rows={3}/>
              </div>

              <div>
                <label_1.Label htmlFor="business_hours">Business Hours</label_1.Label>
                <input_1.Input id="business_hours" value={settings.business_hours} onChange={function (e) {
            return handleInputChange("business_hours", e.target.value);
        }} placeholder="Monday - Sunday: 9:00 AM - 9:00 PM"/>
              </div>

              <div>
                <label_1.Label htmlFor="google_maps_embed">
                  Google Maps Embed Code
                </label_1.Label>
                <textarea_1.Textarea id="google_maps_embed" value={settings.google_maps_embed} onChange={function (e) {
            return handleInputChange("google_maps_embed", e.target.value);
        }} placeholder='<iframe src="https://www.google.com/maps/embed?..." width="100%" height="300" frameborder="0"></iframe>' rows={4}/>
                <p className="text-xs text-muted-foreground mt-1">
                  Paste the Google Maps embed iframe code here
                </p>
              </div>

              <separator_1.Separator />

              <h3 className="text-lg font-semibold">Social Media</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label_1.Label htmlFor="facebook_url">Facebook URL</label_1.Label>
                  <input_1.Input id="facebook_url" value={settings.facebook_url} onChange={function (e) {
            return handleInputChange("facebook_url", e.target.value);
        }} placeholder="https://facebook.com/yourpage"/>
                </div>
                <div>
                  <label_1.Label htmlFor="instagram_url">Instagram URL</label_1.Label>
                  <input_1.Input id="instagram_url" value={settings.instagram_url} onChange={function (e) {
            return handleInputChange("instagram_url", e.target.value);
        }} placeholder="https://instagram.com/yourprofile"/>
                </div>
                <div>
                  <label_1.Label htmlFor="twitter_url">Twitter URL</label_1.Label>
                  <input_1.Input id="twitter_url" value={settings.twitter_url} onChange={function (e) {
            return handleInputChange("twitter_url", e.target.value);
        }} placeholder="https://twitter.com/yourprofile"/>
                </div>
                <div>
                  <label_1.Label htmlFor="youtube_url">YouTube URL</label_1.Label>
                  <input_1.Input id="youtube_url" value={settings.youtube_url} onChange={function (e) {
            return handleInputChange("youtube_url", e.target.value);
        }} placeholder="https://youtube.com/yourchannel"/>
                </div>
              </div>
            </card_1.CardContent>
          </card_1.Card>
        </tabs_1.TabsContent>

        <tabs_1.TabsContent value="business" className="space-y-6">
          <card_1.Card>
            <card_1.CardHeader>
              <card_1.CardTitle className="flex items-center gap-2">
                <lucide_react_1.IndianRupee className="w-5 h-5"/>
                Business Configuration
              </card_1.CardTitle>
            </card_1.CardHeader>
            <card_1.CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label_1.Label htmlFor="currency_symbol">Currency Symbol</label_1.Label>
                  <input_1.Input id="currency_symbol" value={settings.currency_symbol} onChange={function (e) {
            return handleInputChange("currency_symbol", e.target.value);
        }} placeholder="₹"/>
                </div>
                <div>
                  <label_1.Label htmlFor="gst_rate">GST Rate (%)</label_1.Label>
                  <input_1.Input id="gst_rate" type="number" value={settings.gst_rate} onChange={function (e) {
            return handleInputChange("gst_rate", e.target.value);
        }} placeholder="18"/>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label_1.Label htmlFor="free_shipping_minimum">
                    Free Shipping Minimum (₹)
                  </label_1.Label>
                  <input_1.Input id="free_shipping_minimum" type="number" value={settings.free_shipping_minimum} onChange={function (e) {
            return handleInputChange("free_shipping_minimum", e.target.value);
        }} placeholder="500"/>
                </div>
                <div>
                  <label_1.Label htmlFor="same_day_cutoff_time">
                    Same-day Delivery Cutoff
                  </label_1.Label>
                  <input_1.Input id="same_day_cutoff_time" type="time" value={settings.same_day_cutoff_time} onChange={function (e) {
            return handleInputChange("same_day_cutoff_time", e.target.value);
        }}/>
                </div>
              </div>
            </card_1.CardContent>
          </card_1.Card>
        </tabs_1.TabsContent>

        <tabs_1.TabsContent value="features" className="space-y-6">
          <card_1.Card>
            <card_1.CardHeader>
              <card_1.CardTitle>Feature Settings</card_1.CardTitle>
            </card_1.CardHeader>
            <card_1.CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <label_1.Label htmlFor="enable_reviews">Enable Product Reviews</label_1.Label>
                  <p className="text-sm text-muted-foreground">
                    Allow customers to leave reviews
                  </p>
                </div>
                <switch_1.Switch id="enable_reviews" checked={settings.enable_reviews} onCheckedChange={function (checked) {
            return handleInputChange("enable_reviews", checked);
        }}/>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label_1.Label htmlFor="enable_wishlist">Enable Wishlist</label_1.Label>
                  <p className="text-sm text-muted-foreground">
                    Allow customers to save favorite products
                  </p>
                </div>
                <switch_1.Switch id="enable_wishlist" checked={settings.enable_wishlist} onCheckedChange={function (checked) {
            return handleInputChange("enable_wishlist", checked);
        }}/>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label_1.Label htmlFor="enable_file_upload">Enable File Upload</label_1.Label>
                  <p className="text-sm text-muted-foreground">
                    Allow customers to upload custom images
                  </p>
                </div>
                <switch_1.Switch id="enable_file_upload" checked={settings.enable_file_upload} onCheckedChange={function (checked) {
            return handleInputChange("enable_file_upload", checked);
        }}/>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label_1.Label htmlFor="enable_special_instructions">
                    Enable Special Instructions
                  </label_1.Label>
                  <p className="text-sm text-muted-foreground">
                    Allow customers to add special instructions
                  </p>
                </div>
                <switch_1.Switch id="enable_special_instructions" checked={settings.enable_special_instructions} onCheckedChange={function (checked) {
            return handleInputChange("enable_special_instructions", checked);
        }}/>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label_1.Label htmlFor="enable_guest_checkout">
                    Enable Guest Checkout
                  </label_1.Label>
                  <p className="text-sm text-muted-foreground">
                    Allow checkout without account creation
                  </p>
                </div>
                <switch_1.Switch id="enable_guest_checkout" checked={settings.enable_guest_checkout} onCheckedChange={function (checked) {
            return handleInputChange("enable_guest_checkout", checked);
        }}/>
              </div>
            </card_1.CardContent>
          </card_1.Card>
        </tabs_1.TabsContent>

        <tabs_1.TabsContent value="seo" className="space-y-6">
          <card_1.Card>
            <card_1.CardHeader>
              <card_1.CardTitle className="flex items-center gap-2">
                <lucide_react_1.Search className="w-5 h-5"/>
                Basic SEO Settings
              </card_1.CardTitle>
            </card_1.CardHeader>
            <card_1.CardContent className="space-y-4">
              <div>
                <label_1.Label htmlFor="default_meta_title">Default Meta Title</label_1.Label>
                <input_1.Input id="default_meta_title" value={settings.default_meta_title} onChange={function (e) {
            return handleInputChange("default_meta_title", e.target.value);
        }} placeholder="Fresh Flowers Delivered Daily | Florist in India"/>
                <p className="text-xs text-muted-foreground mt-1">
                  This will be used as the default title for pages without a
                  specific title
                </p>
              </div>

              <div>
                <label_1.Label htmlFor="default_meta_description">
                  Default Meta Description
                </label_1.Label>
                <textarea_1.Textarea id="default_meta_description" value={settings.default_meta_description} onChange={function (e) {
            return handleInputChange("default_meta_description", e.target.value);
        }} placeholder="Premium flower delivery service across India. Same-day delivery available in 100+ cities." rows={3}/>
                <p className="text-xs text-muted-foreground mt-1">
                  Recommended length: 150-160 characters
                </p>
              </div>

              <div>
                <label_1.Label htmlFor="meta_title_template">Meta Title Template</label_1.Label>
                <input_1.Input id="meta_title_template" value={settings.meta_title_template} onChange={function (e) {
            return handleInputChange("meta_title_template", e.target.value);
        }} placeholder="%title% | %sitename%"/>
                <p className="text-xs text-muted-foreground mt-1">
                  Use %title% for page title and %sitename% for site name.
                  Example: "Product Name | Florist in India"
                </p>
              </div>
            </card_1.CardContent>
          </card_1.Card>

          <card_1.Card>
            <card_1.CardHeader>
              <card_1.CardTitle>Analytics & Tracking</card_1.CardTitle>
            </card_1.CardHeader>
            <card_1.CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label_1.Label htmlFor="google_analytics_id">
                    Google Analytics Tracking ID
                  </label_1.Label>
                  <input_1.Input id="google_analytics_id" value={settings.google_analytics_id} onChange={function (e) {
            return handleInputChange("google_analytics_id", e.target.value);
        }} placeholder="G-XXXXXXXXXX"/>
                  <p className="text-xs text-muted-foreground mt-1">
                    Enter your Google Analytics 4 measurement ID (format:
                    G-XXXXXXXXXX)
                  </p>
                </div>
                <div>
                  <label_1.Label htmlFor="facebook_pixel_id">Facebook Pixel ID</label_1.Label>
                  <input_1.Input id="facebook_pixel_id" value={settings.facebook_pixel_id} onChange={function (e) {
            return handleInputChange("facebook_pixel_id", e.target.value);
        }} placeholder="123456789012345"/>
                  <p className="text-xs text-muted-foreground mt-1">
                    Enter your Facebook Pixel ID for tracking and Facebook Shop
                    integration
                  </p>
                </div>
              </div>

              <div>
                <label_1.Label htmlFor="facebook_app_id">
                  Facebook App ID (Optional)
                </label_1.Label>
                <input_1.Input id="facebook_app_id" value={settings.facebook_app_id} onChange={function (e) {
            return handleInputChange("facebook_app_id", e.target.value);
        }} placeholder="1234567890123456"/>
                <p className="text-xs text-muted-foreground mt-1">
                  Facebook App ID for enhanced social sharing and Facebook Shop
                  features
                </p>
              </div>
            </card_1.CardContent>
          </card_1.Card>
        </tabs_1.TabsContent>

        <tabs_1.TabsContent value="advanced-seo" className="space-y-6">
          <card_1.Card>
            <card_1.CardHeader>
              <card_1.CardTitle className="flex items-center gap-2">
                <lucide_react_1.Share2 className="w-5 h-5"/>
                Open Graph & Social Media
              </card_1.CardTitle>
            </card_1.CardHeader>
            <card_1.CardContent className="space-y-4">
              <div className="space-y-3">
                <label_1.Label>Default Open Graph Image</label_1.Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                  {settings.og_image_url ? (<div className="space-y-3">
                      <div className="flex items-center justify-center">
                        <img src={settings.og_image_url} alt="OG image preview" className="max-h-32 max-w-full object-contain rounded"/>
                      </div>
                      <div className="flex gap-2 justify-center">
                        <input_1.Input type="file" accept="image/*" onChange={handleOgImageUpload} disabled={ogImageUploading} className="hidden" id="og-image-upload"/>
                        <label_1.Label htmlFor="og-image-upload">
                          <button_1.Button variant="outline" size="sm" asChild disabled={ogImageUploading}>
                            <span>
                              {ogImageUploading ? "Uploading..." : "Change"}
                            </span>
                          </button_1.Button>
                        </label_1.Label>
                        <button_1.Button variant="outline" size="sm" onClick={removeOgImage}>
                          <lucide_react_1.X className="h-4 w-4"/>
                        </button_1.Button>
                      </div>
                    </div>) : (<div className="text-center space-y-3">
                      <lucide_react_1.Image className="h-8 w-8 mx-auto text-muted-foreground"/>
                      <div>
                        <input_1.Input type="file" accept="image/*" onChange={handleOgImageUpload} disabled={ogImageUploading} className="hidden" id="og-image-upload"/>
                        <label_1.Label htmlFor="og-image-upload">
                          <button_1.Button variant="outline" asChild disabled={ogImageUploading}>
                            <span>
                              <lucide_react_1.Upload className="h-4 w-4 mr-2"/>
                              {ogImageUploading
                ? "Uploading..."
                : "Upload OG Image"}
                            </span>
                          </button_1.Button>
                        </label_1.Label>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        PNG, JPG, or WebP up to 3MB
                        <br />
                        Recommended: 1200×630px for optimal social sharing
                      </p>
                    </div>)}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label_1.Label htmlFor="twitter_card_type">Twitter Card Type</label_1.Label>
                  <input_1.Input id="twitter_card_type" value={settings.twitter_card_type} onChange={function (e) {
            return handleInputChange("twitter_card_type", e.target.value);
        }} placeholder="summary_large_image"/>
                  <p className="text-xs text-muted-foreground mt-1">
                    Options: summary, summary_large_image, app, player
                  </p>
                </div>
                <div>
                  <label_1.Label htmlFor="twitter_site">Twitter Site Handle</label_1.Label>
                  <input_1.Input id="twitter_site" value={settings.twitter_site} onChange={function (e) {
            return handleInputChange("twitter_site", e.target.value);
        }} placeholder="@yoursite"/>
                  <p className="text-xs text-muted-foreground mt-1">
                    Your Twitter username (include @)
                  </p>
                </div>
              </div>
            </card_1.CardContent>
          </card_1.Card>

          <card_1.Card>
            <card_1.CardHeader>
              <card_1.CardTitle className="flex items-center gap-2">
                <lucide_react_1.Globe className="w-5 h-5"/>
                Technical SEO
              </card_1.CardTitle>
            </card_1.CardHeader>
            <card_1.CardContent className="space-y-4">
              <div>
                <label_1.Label htmlFor="canonical_url">Canonical URL</label_1.Label>
                <input_1.Input id="canonical_url" value={settings.canonical_url} onChange={function (e) {
            return handleInputChange("canonical_url", e.target.value);
        }} placeholder="https://yourdomain.com"/>
                <p className="text-xs text-muted-foreground mt-1">
                  The primary domain for your website (helps prevent duplicate
                  content issues)
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label_1.Label htmlFor="sitemap_enabled">Enable XML Sitemap</label_1.Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically generate sitemap for search engines
                    </p>
                  </div>
                  <switch_1.Switch id="sitemap_enabled" checked={settings.sitemap_enabled} onCheckedChange={function (checked) {
            return handleInputChange("sitemap_enabled", checked);
        }}/>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label_1.Label htmlFor="breadcrumbs_enabled">
                      Enable Breadcrumbs
                    </label_1.Label>
                    <p className="text-sm text-muted-foreground">
                      Show navigation breadcrumbs on pages
                    </p>
                  </div>
                  <switch_1.Switch id="breadcrumbs_enabled" checked={settings.breadcrumbs_enabled} onCheckedChange={function (checked) {
            return handleInputChange("breadcrumbs_enabled", checked);
        }}/>
                </div>
              </div>

              <div>
                <label_1.Label htmlFor="robots_txt_content">Robots.txt Content</label_1.Label>
                <textarea_1.Textarea id="robots_txt_content" value={settings.robots_txt_content} onChange={function (e) {
            return handleInputChange("robots_txt_content", e.target.value);
        }} placeholder={"User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /api/\n\nSitemap: https://yourdomain.com/sitemap.xml"} rows={6}/>
                <p className="text-xs text-muted-foreground mt-1">
                  Custom robots.txt content. Leave empty for default settings.
                </p>
              </div>
            </card_1.CardContent>
          </card_1.Card>

          <card_1.Card>
            <card_1.CardHeader>
              <card_1.CardTitle className="flex items-center gap-2">
                <lucide_react_1.Code className="w-5 h-5"/>
                Structured Data & Custom Code
              </card_1.CardTitle>
            </card_1.CardHeader>
            <card_1.CardContent className="space-y-4">
              <div>
                <label_1.Label htmlFor="schema_org_organization">
                  Organization Schema (JSON-LD)
                </label_1.Label>
                <textarea_1.Textarea id="schema_org_organization" value={settings.schema_org_organization} onChange={function (e) {
            return handleInputChange("schema_org_organization", e.target.value);
        }} placeholder={"{\n  \"@context\": \"https://schema.org\",\n  \"@type\": \"Organization\",\n  \"name\": \"Your Business Name\",\n  \"url\": \"https://yourdomain.com\",\n  \"logo\": \"https://yourdomain.com/logo.png\",\n  \"contactPoint\": {\n    \"@type\": \"ContactPoint\",\n    \"telephone\": \"+91-XXXXXXXXXX\",\n    \"contactType\": \"customer service\"\n  }\n}"} rows={8}/>
                <p className="text-xs text-muted-foreground mt-1">
                  JSON-LD structured data for your organization. This helps
                  search engines understand your business.
                </p>
              </div>

              <div>
                <label_1.Label htmlFor="custom_head_tags">Custom HTML Head Tags</label_1.Label>
                <textarea_1.Textarea id="custom_head_tags" value={settings.custom_head_tags} onChange={function (e) {
            return handleInputChange("custom_head_tags", e.target.value);
        }} placeholder={"<!-- Custom meta tags, verification codes, etc. -->\n<meta name=\"google-site-verification\" content=\"your-verification-code\" />\n<meta name=\"msvalidate.01\" content=\"your-bing-verification-code\" />\n<link rel=\"preconnect\" href=\"https://fonts.googleapis.com\">\n<!-- Additional custom code -->"} rows={6}/>
                <p className="text-xs text-muted-foreground mt-1">
                  Custom HTML tags to be inserted in the &lt;head&gt; section.
                  Use for verification codes, custom fonts, etc.
                </p>
              </div>
            </card_1.CardContent>
          </card_1.Card>
        </tabs_1.TabsContent>
      </tabs_1.Tabs>
    </div>);
}
