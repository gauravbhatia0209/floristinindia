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
exports.ImageUpload = ImageUpload;
var react_1 = require("react");
var button_1 = require("@/components/ui/button");
var card_1 = require("@/components/ui/card");
var label_1 = require("@/components/ui/label");
var lucide_react_1 = require("lucide-react");
var alert_1 = require("@/components/ui/alert");
function ImageUpload(_a) {
    var _this = this;
    var images = _a.images, onImagesChange = _a.onImagesChange, _b = _a.maxImages, maxImages = _b === void 0 ? 5 : _b, _c = _a.maxSizeMB, maxSizeMB = _c === void 0 ? 3 : _c, _d = _a.acceptedTypes, acceptedTypes = _d === void 0 ? [".jpg", ".jpeg", ".png", ".webp"] : _d, _e = _a.label, label = _e === void 0 ? "Images" : _e, _f = _a.className, className = _f === void 0 ? "" : _f;
    var _g = (0, react_1.useState)(images.map(function (url) { return ({ url: url, uploading: false }); })), uploadedImages = _g[0], setUploadedImages = _g[1];
    var _h = (0, react_1.useState)(""), globalError = _h[0], setGlobalError = _h[1];
    var fileInputRef = (0, react_1.useRef)(null);
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
        var formData, response, error, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    formData = new FormData();
                    formData.append("image", file);
                    return [4 /*yield*/, fetch("/api/upload/image", {
                            method: "POST",
                            body: formData,
                        })];
                case 1:
                    response = _a.sent();
                    if (!!response.ok) return [3 /*break*/, 3];
                    return [4 /*yield*/, response.json()];
                case 2:
                    error = _a.sent();
                    throw new Error(error.error || "Upload failed");
                case 3: return [4 /*yield*/, response.json()];
                case 4:
                    result = _a.sent();
                    return [2 /*return*/, result.imageUrl];
            }
        });
    }); };
    var handleFileSelect = function (files) { return __awaiter(_this, void 0, void 0, function () {
        var newImages, i, file, validationError, updatedImages, uploadPromises, results, successfulUrls, currentSuccessful;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setGlobalError("");
                    // Check total images limit
                    if (uploadedImages.length + files.length > maxImages) {
                        setGlobalError("Maximum ".concat(maxImages, " images allowed"));
                        return [2 /*return*/];
                    }
                    newImages = [];
                    for (i = 0; i < files.length; i++) {
                        file = files[i];
                        validationError = validateFile(file);
                        if (validationError) {
                            setGlobalError(validationError);
                            continue;
                        }
                        newImages.push({
                            url: URL.createObjectURL(file), // Temporary preview
                            uploading: true,
                        });
                    }
                    updatedImages = __spreadArray(__spreadArray([], uploadedImages, true), newImages, true);
                    setUploadedImages(updatedImages);
                    uploadPromises = Array.from(files).map(function (file, index) { return __awaiter(_this, void 0, void 0, function () {
                        var imageIndex, imageUrl_1, error_1;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    imageIndex = uploadedImages.length + index;
                                    _a.label = 1;
                                case 1:
                                    _a.trys.push([1, 3, , 4]);
                                    return [4 /*yield*/, uploadImage(file)];
                                case 2:
                                    imageUrl_1 = _a.sent();
                                    // Update with actual URL
                                    setUploadedImages(function (prev) {
                                        return prev.map(function (img, idx) {
                                            return idx === imageIndex ? { url: imageUrl_1, uploading: false } : img;
                                        });
                                    });
                                    return [2 /*return*/, imageUrl_1];
                                case 3:
                                    error_1 = _a.sent();
                                    // Update with error
                                    setUploadedImages(function (prev) {
                                        return prev.map(function (img, idx) {
                                            return idx === imageIndex
                                                ? {
                                                    url: img.url,
                                                    uploading: false,
                                                    error: error_1 instanceof Error ? error_1.message : "Upload failed",
                                                }
                                                : img;
                                        });
                                    });
                                    return [2 /*return*/, null];
                                case 4: return [2 /*return*/];
                            }
                        });
                    }); });
                    return [4 /*yield*/, Promise.all(uploadPromises)];
                case 1:
                    results = _a.sent();
                    successfulUrls = results.filter(Boolean);
                    currentSuccessful = uploadedImages
                        .filter(function (img) { return !img.error; })
                        .map(function (img) { return img.url; });
                    onImagesChange(__spreadArray(__spreadArray([], currentSuccessful, true), successfulUrls, true));
                    return [2 /*return*/];
            }
        });
    }); };
    var removeImage = function (index) { return __awaiter(_this, void 0, void 0, function () {
        var imageToRemove, filename, error_2, newImages, validUrls;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    imageToRemove = uploadedImages[index];
                    if (!imageToRemove.url.startsWith("/uploads/")) return [3 /*break*/, 4];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    filename = imageToRemove.url.split("/").pop();
                    return [4 /*yield*/, fetch("/api/upload/image/".concat(filename), {
                            method: "DELETE",
                        })];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _a.sent();
                    console.error("Failed to delete image from server:", error_2);
                    return [3 /*break*/, 4];
                case 4:
                    newImages = uploadedImages.filter(function (_, idx) { return idx !== index; });
                    setUploadedImages(newImages);
                    validUrls = newImages
                        .filter(function (img) { return !img.error && !img.uploading; })
                        .map(function (img) { return img.url; });
                    onImagesChange(validUrls);
                    return [2 /*return*/];
            }
        });
    }); };
    var retryUpload = function (index) {
        // Reset error state for retry
        setUploadedImages(function (prev) {
            return prev.map(function (img, idx) {
                return idx === index ? __assign(__assign({}, img), { error: undefined, uploading: true }) : img;
            });
        });
        // This would need the original file, which we don't have
        // For now, just remove the failed image
        removeImage(index);
    };
    return (<div className={className}>
      <label_1.Label className="text-base font-medium">{label}</label_1.Label>

      {globalError && (<alert_1.Alert variant="destructive" className="mt-2">
          <lucide_react_1.AlertCircle className="h-4 w-4"/>
          <alert_1.AlertDescription>{globalError}</alert_1.AlertDescription>
        </alert_1.Alert>)}

      {/* Upload Button */}
      <div className="mt-2">
        <input ref={fileInputRef} type="file" multiple accept={acceptedTypes.join(",")} onChange={function (e) {
            if (e.target.files) {
                handleFileSelect(e.target.files);
                e.target.value = ""; // Reset input
            }
        }} className="hidden"/>

        <button_1.Button type="button" variant="outline" onClick={function () { var _a; return (_a = fileInputRef.current) === null || _a === void 0 ? void 0 : _a.click(); }} disabled={uploadedImages.length >= maxImages} className="w-full">
          <lucide_react_1.Upload className="w-4 h-4 mr-2"/>
          Upload Images ({uploadedImages.length}/{maxImages})
        </button_1.Button>
      </div>

      {/* Image Grid */}
      {uploadedImages.length > 0 && (<div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          {uploadedImages.map(function (image, index) { return (<card_1.Card key={index} className="relative group">
              <card_1.CardContent className="p-2">
                <div className="aspect-square relative rounded-md overflow-hidden bg-muted">
                  {image.uploading ? (<div className="absolute inset-0 flex items-center justify-center bg-background/80">
                      <lucide_react_1.Loader2 className="w-6 h-6 animate-spin"/>
                    </div>) : image.error ? (<div className="absolute inset-0 flex flex-col items-center justify-center bg-destructive/10 text-destructive text-xs p-2">
                      <lucide_react_1.AlertCircle className="w-6 h-6 mb-1"/>
                      <span className="text-center">{image.error}</span>
                      <button_1.Button size="sm" variant="outline" onClick={function () { return retryUpload(index); }} className="mt-2">
                        Retry
                      </button_1.Button>
                    </div>) : (<img src={image.url} alt={"Upload ".concat(index + 1)} className="w-full h-full object-cover" onError={function (e) {
                        console.error("Image failed to load:", image.url);
                        setUploadedImages(function (prev) {
                            return prev.map(function (img, idx) {
                                return idx === index
                                    ? __assign(__assign({}, img), { error: "Failed to load image" }) : img;
                            });
                        });
                    }}/>)}

                  {/* Remove Button */}
                  <button_1.Button type="button" variant="destructive" size="sm" className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6 p-0" onClick={function () { return removeImage(index); }}>
                    <lucide_react_1.X className="w-3 h-3"/>
                  </button_1.Button>

                  {/* Primary Badge */}
                  {index === 0 && !image.error && !image.uploading && (<div className="absolute bottom-1 left-1 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                      Primary
                    </div>)}
                </div>
              </card_1.CardContent>
            </card_1.Card>); })}
        </div>)}

      {/* Help Text */}
      <p className="text-sm text-muted-foreground mt-2">
        Upload up to {maxImages} images. Max {maxSizeMB}MB each. Accepted
        formats: {acceptedTypes.join(", ")}
      </p>
    </div>);
}
