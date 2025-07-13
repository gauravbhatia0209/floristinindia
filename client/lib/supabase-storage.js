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
exports.validateFile = validateFile;
exports.generateFileName = generateFileName;
exports.uploadImageToSupabase = uploadImageToSupabase;
exports.deleteImageFromSupabase = deleteImageFromSupabase;
exports.validateImageUrl = validateImageUrl;
exports.migrateImageToSupabase = migrateImageToSupabase;
exports.batchMigrateImages = batchMigrateImages;
var supabase_1 = require("./supabase");
/**
 * Validates file before upload
 */
function validateFile(file, maxSizeMB) {
    if (maxSizeMB === void 0) { maxSizeMB = 3; }
    // Check file size
    var sizeMB = file.size / (1024 * 1024);
    if (sizeMB > maxSizeMB) {
        return {
            isValid: false,
            error: "File size must be less than ".concat(maxSizeMB, "MB. Current size: ").concat(sizeMB.toFixed(2), "MB"),
        };
    }
    // Check file type - allow both images and common document types for order files
    var allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
        "image/gif",
        "application/pdf",
        "text/plain",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];
    if (!allowedTypes.includes(file.type)) {
        return {
            isValid: false,
            error: "File type ".concat(file.type, " not allowed. Use: JPG, PNG, WebP, PDF, DOC, DOCX, XLS, XLSX, or TXT"),
        };
    }
    return { isValid: true };
}
/**
 * Generates a unique filename for upload
 */
function generateFileName(originalName, subdir) {
    var _a;
    var timestamp = Date.now();
    var randomString = Math.random().toString(36).substring(2, 8);
    var extension = ((_a = originalName.split(".").pop()) === null || _a === void 0 ? void 0 : _a.toLowerCase()) || "jpg";
    var cleanName = originalName
        .replace(/\.[^/.]+$/, "") // Remove extension
        .replace(/[^a-zA-Z0-9]/g, "-") // Replace special chars with dash
        .substring(0, 20); // Limit length
    var fileName = "".concat(timestamp, "-").concat(randomString, "-").concat(cleanName, ".").concat(extension);
    return subdir ? "".concat(subdir, "/").concat(fileName) : fileName;
}
/**
 * Uploads an image to Supabase storage
 */
function uploadImageToSupabase(file_1, subdir_1) {
    return __awaiter(this, arguments, void 0, function (file, subdir, maxSizeMB) {
        var validation, filePath, _a, uploadData, uploadError, errorMessage, publicUrlData, error_1, errorMessage;
        if (maxSizeMB === void 0) { maxSizeMB = 3; }
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 4, , 5]);
                    // Note: Using public access for now since we have custom auth system
                    console.log("Uploading to Supabase storage...");
                    validation = validateFile(file, maxSizeMB);
                    if (!validation.isValid) {
                        return [2 /*return*/, {
                                success: false,
                                error: validation.error,
                            }];
                    }
                    filePath = generateFileName(file.name, subdir);
                    return [4 /*yield*/, supabase_1.supabase.storage
                            .from("media-assets")
                            .upload(filePath, file, {
                            cacheControl: "3600",
                            upsert: false,
                        })];
                case 1:
                    _a = _b.sent(), uploadData = _a.data, uploadError = _a.error;
                    if (uploadError) {
                        console.error("Supabase upload error:", uploadError);
                        errorMessage = uploadError.message ||
                            JSON.stringify(uploadError) ||
                            "Unknown upload error";
                        return [2 /*return*/, {
                                success: false,
                                error: "Upload failed: ".concat(errorMessage),
                            }];
                    }
                    publicUrlData = supabase_1.supabase.storage
                        .from("media-assets")
                        .getPublicUrl(filePath).data;
                    if (!!(publicUrlData === null || publicUrlData === void 0 ? void 0 : publicUrlData.publicUrl)) return [3 /*break*/, 3];
                    // Cleanup uploaded file if we can't get public URL
                    return [4 /*yield*/, supabase_1.supabase.storage.from("media-assets").remove([filePath])];
                case 2:
                    // Cleanup uploaded file if we can't get public URL
                    _b.sent();
                    return [2 /*return*/, {
                            success: false,
                            error: "Failed to generate public URL for uploaded image",
                        }];
                case 3: return [2 /*return*/, {
                        success: true,
                        imageUrl: publicUrlData.publicUrl,
                        publicUrl: publicUrlData.publicUrl,
                        fileName: filePath.split("/").pop(),
                        filePath: filePath,
                    }];
                case 4:
                    error_1 = _b.sent();
                    console.error("Upload error:", error_1);
                    errorMessage = "Unknown upload error";
                    if (error_1 instanceof Error) {
                        errorMessage = error_1.message;
                    }
                    else if (typeof error_1 === "object" && error_1 !== null) {
                        errorMessage = JSON.stringify(error_1);
                    }
                    else {
                        errorMessage = String(error_1);
                    }
                    return [2 /*return*/, {
                            success: false,
                            error: "Upload failed: ".concat(errorMessage),
                        }];
                case 5: return [2 /*return*/];
            }
        });
    });
}
/**
 * Deletes an image from Supabase storage
 */
function deleteImageFromSupabase(imageUrl) {
    return __awaiter(this, void 0, void 0, function () {
        var url, pathSegments, bucketIndex, filePath, error, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    url = new URL(imageUrl);
                    pathSegments = url.pathname.split("/");
                    bucketIndex = pathSegments.findIndex(function (segment) { return segment === "media-assets"; });
                    if (bucketIndex === -1 || bucketIndex === pathSegments.length - 1) {
                        console.error("Invalid Supabase URL format:", imageUrl);
                        return [2 /*return*/, false];
                    }
                    filePath = pathSegments.slice(bucketIndex + 1).join("/");
                    return [4 /*yield*/, supabase_1.supabase.storage
                            .from("media-assets")
                            .remove([filePath])];
                case 1:
                    error = (_a.sent()).error;
                    if (error) {
                        console.error("Supabase delete error:", error);
                        return [2 /*return*/, false];
                    }
                    return [2 /*return*/, true];
                case 2:
                    error_2 = _a.sent();
                    console.error("Delete error:", error_2);
                    return [2 /*return*/, false];
                case 3: return [2 /*return*/];
            }
        });
    });
}
/**
 * Checks if an image URL is accessible
 */
function validateImageUrl(imageUrl) {
    return __awaiter(this, void 0, void 0, function () {
        var response, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, fetch(imageUrl, { method: "HEAD" })];
                case 1:
                    response = _a.sent();
                    return [2 /*return*/, response.ok];
                case 2:
                    error_3 = _a.sent();
                    console.error("Image validation error:", error_3);
                    return [2 /*return*/, false];
                case 3: return [2 /*return*/];
            }
        });
    });
}
/**
 * Migrates an image from local storage to Supabase
 */
function migrateImageToSupabase(localImageUrl, subdir) {
    return __awaiter(this, void 0, void 0, function () {
        var response, blob, filename, file, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    if (!localImageUrl.startsWith("/uploads/")) {
                        return [2 /*return*/, {
                                success: false,
                                error: "Not a local upload URL",
                            }];
                    }
                    return [4 /*yield*/, fetch(localImageUrl)];
                case 1:
                    response = _a.sent();
                    if (!response.ok) {
                        return [2 /*return*/, {
                                success: false,
                                error: "Failed to fetch local image",
                            }];
                    }
                    return [4 /*yield*/, response.blob()];
                case 2:
                    blob = _a.sent();
                    filename = localImageUrl.split("/").pop() || "image.jpg";
                    file = new File([blob], filename, { type: blob.type });
                    return [4 /*yield*/, uploadImageToSupabase(file, subdir)];
                case 3: 
                // Upload to Supabase
                return [2 /*return*/, _a.sent()];
                case 4:
                    error_4 = _a.sent();
                    console.error("Migration error:", error_4);
                    return [2 /*return*/, {
                            success: false,
                            error: error_4 instanceof Error ? error_4.message : "Migration failed",
                        }];
                case 5: return [2 /*return*/];
            }
        });
    });
}
/**
 * Batch migrate multiple images to Supabase
 */
function batchMigrateImages(imageUrls, subdir, onProgress) {
    return __awaiter(this, void 0, void 0, function () {
        var results, succeeded, failed, i, imageUrl, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    results = [];
                    succeeded = 0;
                    failed = 0;
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < imageUrls.length)) return [3 /*break*/, 4];
                    imageUrl = imageUrls[i];
                    if (onProgress) {
                        onProgress(i, imageUrls.length, imageUrl);
                    }
                    return [4 /*yield*/, migrateImageToSupabase(imageUrl, subdir)];
                case 2:
                    result = _a.sent();
                    results.push(result);
                    if (result.success) {
                        succeeded++;
                    }
                    else {
                        failed++;
                    }
                    _a.label = 3;
                case 3:
                    i++;
                    return [3 /*break*/, 1];
                case 4:
                    if (onProgress) {
                        onProgress(imageUrls.length, imageUrls.length, "Complete");
                    }
                    return [2 /*return*/, { succeeded: succeeded, failed: failed, results: results }];
            }
        });
    });
}
