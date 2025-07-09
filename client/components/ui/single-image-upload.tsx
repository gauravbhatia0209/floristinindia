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

interface SingleImageUploadProps {
  imageUrl: string;
  onImageChange: (imageUrl: string) => void;
  maxSizeMB?: number;
  acceptedTypes?: string[];
  label?: string;
  className?: string;
  subdir?: string;
}

export function SingleImageUpload({
  imageUrl,
  onImageChange,
  maxSizeMB = 3,
  acceptedTypes = [".jpg", ".jpeg", ".png", ".webp"],
  label = "Image",
  className = "",
  subdir = "",
}: SingleImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string>("");
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

  const handleFileSelect = async (file: File) => {
    setError("");

    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsUploading(true);

    try {
      const uploadedUrl = await uploadImage(file);
      onImageChange(uploadedUrl);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Upload failed";
      setError(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = async () => {
    // If it's an uploaded image, try to delete from server
    if (imageUrl.startsWith("/uploads/")) {
      try {
        const filename = imageUrl.split("/").pop();
        await fetch(`/api/upload/image/${filename}`, {
          method: "DELETE",
        });
      } catch (error) {
        console.error("Failed to delete image from server:", error);
      }
    }

    onImageChange("");
  };

  return (
    <div className={className}>
      <Label className="text-base font-medium">{label}</Label>

      {error && (
        <Alert variant="destructive" className="mt-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="mt-2">
        {/* Upload Button / Image Display */}
        {!imageUrl ? (
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept={acceptedTypes.join(",")}
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileSelect(e.target.files[0]);
                  e.target.value = ""; // Reset input
                }
              }}
              className="hidden"
            />

            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="w-full h-32 border-dashed"
            >
              {isUploading ? (
                <div className="flex flex-col items-center">
                  <Loader2 className="w-6 h-6 animate-spin mb-2" />
                  <span>Uploading...</span>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <Upload className="w-6 h-6 mb-2" />
                  <span>Click to upload image</span>
                </div>
              )}
            </Button>
          </div>
        ) : (
          <Card className="relative group">
            <CardContent className="p-2">
              <div className="aspect-video relative rounded-md overflow-hidden bg-muted">
                <img
                  src={imageUrl}
                  alt="Uploaded image"
                  className="w-full h-full object-cover"
                  onError={() => {
                    setError("Failed to load image");
                  }}
                />

                {/* Remove Button */}
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={removeImage}
                >
                  <X className="w-4 h-4" />
                </Button>

                {/* Replace Button */}
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                >
                  <Upload className="w-4 h-4 mr-1" />
                  Replace
                </Button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept={acceptedTypes.join(",")}
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileSelect(e.target.files[0]);
                      e.target.value = ""; // Reset input
                    }
                  }}
                  className="hidden"
                />
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Help Text */}
      <p className="text-sm text-muted-foreground mt-2">
        Max {maxSizeMB}MB. Accepted formats: {acceptedTypes.join(", ")}
      </p>
    </div>
  );
}
