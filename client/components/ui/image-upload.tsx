import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Upload,
  X,
  Image as ImageIcon,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
  maxSizeMB?: number;
  acceptedTypes?: string[];
  label?: string;
  className?: string;
}

interface UploadedImage {
  url: string;
  uploading: boolean;
  error?: string;
}

export function ImageUpload({
  images,
  onImagesChange,
  maxImages = 5,
  maxSizeMB = 3,
  acceptedTypes = [".jpg", ".jpeg", ".png", ".webp"],
  label = "Images",
  className = "",
}: ImageUploadProps) {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>(
    images.map((url) => ({ url, uploading: false })),
  );
  const [globalError, setGlobalError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    // Check file size
    const sizeMB = file.size / (1024 * 1024);
    if (sizeMB > maxSizeMB) {
      return `File size must be less than ${maxSizeMB}MB`;
    }

    // Check file type
    const extension = "." + file.name.split(".").pop()?.toLowerCase();
    if (!acceptedTypes.includes(extension)) {
      return `File type ${extension} not allowed. Use: ${acceptedTypes.join(", ")}`;
    }

    return null;
  };

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch("/api/upload/image", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Upload failed");
    }

    const result = await response.json();
    return result.imageUrl;
  };

  const handleFileSelect = async (files: FileList) => {
    setGlobalError("");

    // Check total images limit
    if (uploadedImages.length + files.length > maxImages) {
      setGlobalError(`Maximum ${maxImages} images allowed`);
      return;
    }

    const newImages: UploadedImage[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const validationError = validateFile(file);

      if (validationError) {
        setGlobalError(validationError);
        continue;
      }

      newImages.push({
        url: URL.createObjectURL(file), // Temporary preview
        uploading: true,
      });
    }

    // Add new images to state with uploading status
    const updatedImages = [...uploadedImages, ...newImages];
    setUploadedImages(updatedImages);

    // Upload files
    const uploadPromises = Array.from(files).map(async (file, index) => {
      const imageIndex = uploadedImages.length + index;

      try {
        const imageUrl = await uploadImage(file);

        // Update with actual URL
        setUploadedImages((prev) =>
          prev.map((img, idx) =>
            idx === imageIndex ? { url: imageUrl, uploading: false } : img,
          ),
        );

        return imageUrl;
      } catch (error) {
        // Update with error
        setUploadedImages((prev) =>
          prev.map((img, idx) =>
            idx === imageIndex
              ? {
                  url: img.url,
                  uploading: false,
                  error:
                    error instanceof Error ? error.message : "Upload failed",
                }
              : img,
          ),
        );

        return null;
      }
    });

    // Wait for all uploads and update parent component
    const results = await Promise.all(uploadPromises);
    const successfulUrls = results.filter(Boolean) as string[];

    // Get current successful images and add new ones
    const currentSuccessful = uploadedImages
      .filter((img) => !img.error)
      .map((img) => img.url);

    onImagesChange([...currentSuccessful, ...successfulUrls]);
  };

  const removeImage = async (index: number) => {
    const imageToRemove = uploadedImages[index];

    // If it's an uploaded image, try to delete from server
    if (imageToRemove.url.startsWith("/uploads/")) {
      try {
        const filename = imageToRemove.url.split("/").pop();
        await fetch(`/api/upload/image/${filename}`, {
          method: "DELETE",
        });
      } catch (error) {
        console.error("Failed to delete image from server:", error);
      }
    }

    // Remove from state
    const newImages = uploadedImages.filter((_, idx) => idx !== index);
    setUploadedImages(newImages);

    // Update parent component
    const validUrls = newImages
      .filter((img) => !img.error && !img.uploading)
      .map((img) => img.url);
    onImagesChange(validUrls);
  };

  const retryUpload = (index: number) => {
    // Reset error state for retry
    setUploadedImages((prev) =>
      prev.map((img, idx) =>
        idx === index ? { ...img, error: undefined, uploading: true } : img,
      ),
    );

    // This would need the original file, which we don't have
    // For now, just remove the failed image
    removeImage(index);
  };

  return (
    <div className={className}>
      <Label className="text-base font-medium">{label}</Label>

      {globalError && (
        <Alert variant="destructive" className="mt-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{globalError}</AlertDescription>
        </Alert>
      )}

      {/* Upload Button */}
      <div className="mt-2">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes.join(",")}
          onChange={(e) => {
            if (e.target.files) {
              handleFileSelect(e.target.files);
              e.target.value = ""; // Reset input
            }
          }}
          className="hidden"
        />

        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploadedImages.length >= maxImages}
          className="w-full"
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload Images ({uploadedImages.length}/{maxImages})
        </Button>
      </div>

      {/* Image Grid */}
      {uploadedImages.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          {uploadedImages.map((image, index) => (
            <Card key={index} className="relative group">
              <CardContent className="p-2">
                <div className="aspect-square relative rounded-md overflow-hidden bg-muted">
                  {image.uploading ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-background/80">
                      <Loader2 className="w-6 h-6 animate-spin" />
                    </div>
                  ) : image.error ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-destructive/10 text-destructive text-xs p-2">
                      <AlertCircle className="w-6 h-6 mb-1" />
                      <span className="text-center">{image.error}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => retryUpload(index)}
                        className="mt-2"
                      >
                        Retry
                      </Button>
                    </div>
                  ) : (
                    <img
                      src={image.url}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.error("Image failed to load:", image.url);
                        setUploadedImages((prev) =>
                          prev.map((img, idx) =>
                            idx === index
                              ? { ...img, error: "Failed to load image" }
                              : img,
                          ),
                        );
                      }}
                    />
                  )}

                  {/* Remove Button */}
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6 p-0"
                    onClick={() => removeImage(index)}
                  >
                    <X className="w-3 h-3" />
                  </Button>

                  {/* Primary Badge */}
                  {index === 0 && !image.error && !image.uploading && (
                    <div className="absolute bottom-1 left-1 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                      Primary
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Help Text */}
      <p className="text-sm text-muted-foreground mt-2">
        Upload up to {maxImages} images. Max {maxSizeMB}MB each. Accepted
        formats: {acceptedTypes.join(", ")}
      </p>
    </div>
  );
}
