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
exports.SingleImageUpload = SingleImageUpload;
var react_1 = require("react");
var button_1 = require("@/components/ui/button");
var card_1 = require("@/components/ui/card");
var label_1 = require("@/components/ui/label");
var lucide_react_1 = require("lucide-react");
var alert_1 = require("@/components/ui/alert");
function SingleImageUpload(_a) {
    var _this = this;
    var imageUrl = _a.imageUrl, onImageChange = _a.onImageChange, _b = _a.maxSizeMB, maxSizeMB = _b === void 0 ? 3 : _b, _c = _a.acceptedTypes, acceptedTypes = _c === void 0 ? [".jpg", ".jpeg", ".png", ".webp"] : _c, _d = _a.label, label = _d === void 0 ? "Image" : _d, _e = _a.className, className = _e === void 0 ? "" : _e, _f = _a.subdir, subdir = _f === void 0 ? "" : _f;
    var _g = (0, react_1.useState)(false), isUploading = _g[0], setIsUploading = _g[1];
    var _h = (0, react_1.useState)(""), error = _h[0], setError = _h[1];
    var _j = (0, react_1.useState)(""), success = _j[0], setSuccess = _j[1];
    var fileInputRef = (0, react_1.useRef)(null);
    var isSupabaseUrl = imageUrl.includes("supabase.co");
    var isLocalUrl = imageUrl.startsWith("/uploads/");
    var validateFile = function (file) {
        var _a;
        // Check file size
        var sizeMB = file.size / (1024 * 1024);
        if (sizeMB > maxSizeMB) {
            return "File size must be less than ".concat(maxSizeMB, "MB");
        }
        // Check file type
        var extension = "." + ((_a = file.name.split(".").pop()) === null || _a === void 0 ? void 0 : _a.toLowerCase());
        if (!acceptedTypes.includes(extension)) {
            return "File type ".concat(extension, " not allowed. Use: ").concat(acceptedTypes.join(", "));
        }
        return null;
    };
    var uploadImage = function (file) { return __awaiter(_this, void 0, void 0, function () {
        var uploadImageToSupabase, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("@/lib/supabase-storage"); })];
                case 1:
                    uploadImageToSupabase = (_a.sent()).uploadImageToSupabase;
                    return [4 /*yield*/, uploadImageToSupabase(file, subdir, maxSizeMB)];
                case 2:
                    result = _a.sent();
                    if (!result.success) {
                        throw new Error(result.error || "Upload failed");
                    }
                    return [2 /*return*/, result.publicUrl];
            }
        });
    }); };
    var handleFileSelect = function (file) { return __awaiter(_this, void 0, void 0, function () {
        var validationError, uploadedUrl, error_1, errorMessage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setError("");
                    setSuccess("");
                    validationError = validateFile(file);
                    if (validationError) {
                        setError(validationError);
                        return [2 /*return*/];
                    }
                    setIsUploading(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, uploadImage(file)];
                case 2:
                    uploadedUrl = _a.sent();
                    onImageChange(uploadedUrl);
                    setSuccess("Image uploaded successfully to Supabase storage!");
                    // Clear success message after 3 seconds
                    setTimeout(function () { return setSuccess(""); }, 3000);
                    return [3 /*break*/, 5];
                case 3:
                    error_1 = _a.sent();
                    errorMessage = error_1 instanceof Error ? error_1.message : "Upload failed";
                    setError(errorMessage);
                    return [3 /*break*/, 5];
                case 4:
                    setIsUploading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var removeImage = function () { return __awaiter(_this, void 0, void 0, function () {
        var deleteImageFromSupabase, error_2, filename, url, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!imageUrl.includes("supabase.co")) return [3 /*break*/, 6];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("@/lib/supabase-storage"); })];
                case 2:
                    deleteImageFromSupabase = (_a.sent()).deleteImageFromSupabase;
                    return [4 /*yield*/, deleteImageFromSupabase(imageUrl)];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 4:
                    error_2 = _a.sent();
                    console.error("Failed to delete image from Supabase:", error_2);
                    return [3 /*break*/, 5];
                case 5: return [3 /*break*/, 10];
                case 6:
                    if (!imageUrl.startsWith("/uploads/")) return [3 /*break*/, 10];
                    _a.label = 7;
                case 7:
                    _a.trys.push([7, 9, , 10]);
                    filename = imageUrl.split("/").pop();
                    url = subdir
                        ? "/api/upload/image/".concat(filename, "?subdir=").concat(encodeURIComponent(subdir))
                        : "/api/upload/image/".concat(filename);
                    return [4 /*yield*/, fetch(url, {
                            method: "DELETE",
                        })];
                case 8:
                    _a.sent();
                    return [3 /*break*/, 10];
                case 9:
                    error_3 = _a.sent();
                    console.error("Failed to delete image from server:", error_3);
                    return [3 /*break*/, 10];
                case 10:
                    onImageChange("");
                    return [2 /*return*/];
            }
        });
    }); };
    return (<div className={className}>
      <label_1.Label className="text-base font-medium">{label}</label_1.Label>

      {error && (<alert_1.Alert variant="destructive" className="mt-2">
          <lucide_react_1.AlertCircle className="h-4 w-4"/>
          <alert_1.AlertDescription>{error}</alert_1.AlertDescription>
        </alert_1.Alert>)}

      {success && (<alert_1.Alert className="mt-2 bg-green-50 border-green-200 text-green-800">
          <lucide_react_1.CheckCircle className="h-4 w-4"/>
          <alert_1.AlertDescription>{success}</alert_1.AlertDescription>
        </alert_1.Alert>)}

      {imageUrl && (<div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
          {isSupabaseUrl ? (<>
              <lucide_react_1.Cloud className="h-3 w-3 text-green-600"/>
              <span className="text-green-700">Stored in Supabase Cloud</span>
            </>) : isLocalUrl ? (<>
              <lucide_react_1.AlertTriangle className="h-3 w-3 text-orange-600"/>
              <span className="text-orange-700">
                Local storage (needs migration)
              </span>
            </>) : (<>
              <lucide_react_1.Image className="h-3 w-3"/>
              <span>External image</span>
            </>)}
        </div>)}

      <div className="mt-2">
        {/* Upload Button / Image Display */}
        {!imageUrl ? (<div>
            <input ref={fileInputRef} type="file" accept={acceptedTypes.join(",")} onChange={function (e) {
                if (e.target.files && e.target.files[0]) {
                    handleFileSelect(e.target.files[0]);
                    e.target.value = ""; // Reset input
                }
            }} className="hidden"/>

            <button_1.Button type="button" variant="outline" onClick={function () { var _a; return (_a = fileInputRef.current) === null || _a === void 0 ? void 0 : _a.click(); }} disabled={isUploading} className="w-full h-32 border-dashed">
              {isUploading ? (<div className="flex flex-col items-center">
                  <lucide_react_1.Loader2 className="w-6 h-6 animate-spin mb-2"/>
                  <span>Uploading...</span>
                </div>) : (<div className="flex flex-col items-center">
                  <lucide_react_1.Upload className="w-6 h-6 mb-2"/>
                  <span>Click to upload image</span>
                </div>)}
            </button_1.Button>
          </div>) : (<card_1.Card className="relative group">
            <card_1.CardContent className="p-2">
              <div className="aspect-video relative rounded-md overflow-hidden bg-muted">
                <img src={imageUrl} alt="Uploaded image" className="w-full h-full object-cover" onError={function () { return __awaiter(_this, void 0, void 0, function () {
                var validateImageUrl, isValid, err_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            setError("Failed to load image - it may have been moved or deleted");
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 4, , 5]);
                            return [4 /*yield*/, Promise.resolve().then(function () { return require("@/lib/supabase-storage"); })];
                        case 2:
                            validateImageUrl = (_a.sent()).validateImageUrl;
                            return [4 /*yield*/, validateImageUrl(imageUrl)];
                        case 3:
                            isValid = _a.sent();
                            if (!isValid) {
                                setError("Image is no longer accessible. Please upload a new image.");
                            }
                            return [3 /*break*/, 5];
                        case 4:
                            err_1 = _a.sent();
                            console.error("Error validating image URL:", err_1);
                            return [3 /*break*/, 5];
                        case 5: return [2 /*return*/];
                    }
                });
            }); }}/>

                {/* Remove Button */}
                <button_1.Button type="button" variant="destructive" size="sm" className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={removeImage}>
                  <lucide_react_1.X className="w-4 h-4"/>
                </button_1.Button>

                {/* Replace Button */}
                <button_1.Button type="button" variant="secondary" size="sm" className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={function () { var _a; return (_a = fileInputRef.current) === null || _a === void 0 ? void 0 : _a.click(); }} disabled={isUploading}>
                  <lucide_react_1.Upload className="w-4 h-4 mr-1"/>
                  Replace
                </button_1.Button>

                <input ref={fileInputRef} type="file" accept={acceptedTypes.join(",")} onChange={function (e) {
                if (e.target.files && e.target.files[0]) {
                    handleFileSelect(e.target.files[0]);
                    e.target.value = ""; // Reset input
                }
            }} className="hidden"/>
              </div>
            </card_1.CardContent>
          </card_1.Card>)}
      </div>

      {/* Help Text */}
      <p className="text-sm text-muted-foreground mt-2">
        Max {maxSizeMB}MB. Accepted formats: {acceptedTypes.join(", ")}
      </p>
    </div>);
}
