import { supabase } from "./supabase";

export interface UploadResult {
  success: boolean;
  imageUrl?: string;
  publicUrl?: string;
  error?: string;
  fileName?: string;
  filePath?: string;
}

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validates file before upload
 */
export function validateFile(
  file: File,
  maxSizeMB: number = 3,
): ValidationResult {
  // Check file size
  const sizeMB = file.size / (1024 * 1024);
  if (sizeMB > maxSizeMB) {
    return {
      isValid: false,
      error: `File size must be less than ${maxSizeMB}MB. Current size: ${sizeMB.toFixed(2)}MB`,
    };
  }

  // Check file type
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: `File type ${file.type} not allowed. Use: JPG, PNG, or WebP`,
    };
  }

  return { isValid: true };
}

/**
 * Generates a unique filename for upload
 */
export function generateFileName(
  originalName: string,
  subdir?: string,
): string {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8);
  const extension = originalName.split(".").pop()?.toLowerCase() || "jpg";
  const cleanName = originalName
    .replace(/\.[^/.]+$/, "") // Remove extension
    .replace(/[^a-zA-Z0-9]/g, "-") // Replace special chars with dash
    .substring(0, 20); // Limit length

  const fileName = `${timestamp}-${randomString}-${cleanName}.${extension}`;
  return subdir ? `${subdir}/${fileName}` : fileName;
}

/**
 * Uploads an image to Supabase storage
 */
export async function uploadImageToSupabase(
  file: File,
  subdir?: string,
  maxSizeMB: number = 3,
): Promise<UploadResult> {
  try {
    // Validate file
    const validation = validateFile(file, maxSizeMB);
    if (!validation.isValid) {
      return {
        success: false,
        error: validation.error,
      };
    }

    // Generate unique filename
    const filePath = generateFileName(file.name, subdir);

    // Upload to Supabase storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("media-assets")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("Supabase upload error:", uploadError);
      return {
        success: false,
        error: `Upload failed: ${uploadError.message}`,
      };
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from("media-assets")
      .getPublicUrl(filePath);

    if (!publicUrlData?.publicUrl) {
      // Cleanup uploaded file if we can't get public URL
      await supabase.storage.from("media-assets").remove([filePath]);
      return {
        success: false,
        error: "Failed to generate public URL for uploaded image",
      };
    }

    return {
      success: true,
      imageUrl: publicUrlData.publicUrl,
      publicUrl: publicUrlData.publicUrl,
      fileName: filePath.split("/").pop(),
      filePath: filePath,
    };
  } catch (error) {
    console.error("Upload error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown upload error",
    };
  }
}

/**
 * Deletes an image from Supabase storage
 */
export async function deleteImageFromSupabase(
  imageUrl: string,
): Promise<boolean> {
  try {
    // Extract file path from URL
    const url = new URL(imageUrl);
    const pathSegments = url.pathname.split("/");
    const bucketIndex = pathSegments.findIndex(
      (segment) => segment === "media-assets",
    );

    if (bucketIndex === -1 || bucketIndex === pathSegments.length - 1) {
      console.error("Invalid Supabase URL format:", imageUrl);
      return false;
    }

    const filePath = pathSegments.slice(bucketIndex + 1).join("/");

    // Delete from Supabase storage
    const { error } = await supabase.storage
      .from("media-assets")
      .remove([filePath]);

    if (error) {
      console.error("Supabase delete error:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Delete error:", error);
    return false;
  }
}

/**
 * Checks if an image URL is accessible
 */
export async function validateImageUrl(imageUrl: string): Promise<boolean> {
  try {
    const response = await fetch(imageUrl, { method: "HEAD" });
    return response.ok;
  } catch (error) {
    console.error("Image validation error:", error);
    return false;
  }
}

/**
 * Migrates an image from local storage to Supabase
 */
export async function migrateImageToSupabase(
  localImageUrl: string,
  subdir?: string,
): Promise<UploadResult> {
  try {
    if (!localImageUrl.startsWith("/uploads/")) {
      return {
        success: false,
        error: "Not a local upload URL",
      };
    }

    // Fetch the local image
    const response = await fetch(localImageUrl);
    if (!response.ok) {
      return {
        success: false,
        error: "Failed to fetch local image",
      };
    }

    const blob = await response.blob();
    const filename = localImageUrl.split("/").pop() || "image.jpg";
    const file = new File([blob], filename, { type: blob.type });

    // Upload to Supabase
    return await uploadImageToSupabase(file, subdir);
  } catch (error) {
    console.error("Migration error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Migration failed",
    };
  }
}

/**
 * Batch migrate multiple images to Supabase
 */
export async function batchMigrateImages(
  imageUrls: string[],
  subdir?: string,
  onProgress?: (completed: number, total: number, currentUrl: string) => void,
): Promise<{ succeeded: number; failed: number; results: UploadResult[] }> {
  const results: UploadResult[] = [];
  let succeeded = 0;
  let failed = 0;

  for (let i = 0; i < imageUrls.length; i++) {
    const imageUrl = imageUrls[i];

    if (onProgress) {
      onProgress(i, imageUrls.length, imageUrl);
    }

    const result = await migrateImageToSupabase(imageUrl, subdir);
    results.push(result);

    if (result.success) {
      succeeded++;
    } else {
      failed++;
    }
  }

  if (onProgress) {
    onProgress(imageUrls.length, imageUrls.length, "Complete");
  }

  return { succeeded, failed, results };
}
