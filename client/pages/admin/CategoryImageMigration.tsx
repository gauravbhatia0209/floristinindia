import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  XCircle,
  Upload,
  RefreshCw,
  AlertTriangle,
  Image as ImageIcon,
  Database,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import {
  batchMigrateImages,
  validateImageUrl,
  UploadResult,
} from "@/lib/supabase-storage";
import { ProductCategory } from "@shared/database.types";

interface MigrationStatus {
  total: number;
  processed: number;
  succeeded: number;
  failed: number;
  current: string;
  isRunning: boolean;
  isComplete: boolean;
  results: UploadResult[];
}

interface CategoryImageStatus {
  category: ProductCategory;
  isAccessible: boolean;
  needsMigration: boolean;
  isLocal: boolean;
  validationError?: string;
}

export default function CategoryImageMigration() {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [imageStatuses, setImageStatuses] = useState<CategoryImageStatus[]>([]);
  const [migrationStatus, setMigrationStatus] = useState<MigrationStatus>({
    total: 0,
    processed: 0,
    succeeded: 0,
    failed: 0,
    current: "",
    isRunning: false,
    isComplete: false,
    results: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isValidating, setIsValidating] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("product_categories")
        .select("*")
        .order("name");

      if (error) throw error;

      setCategories(data || []);
      await validateImageUrls(data || []);
    } catch (error) {
      console.error("Error loading categories:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const validateImageUrls = async (categoriesData: ProductCategory[]) => {
    try {
      setIsValidating(true);
      const statuses: CategoryImageStatus[] = [];

      for (const category of categoriesData) {
        if (!category.image_url) {
          statuses.push({
            category,
            isAccessible: false,
            needsMigration: false,
            isLocal: false,
          });
          continue;
        }

        const isLocal = category.image_url.startsWith("/uploads/");
        const isSupabase = category.image_url.includes("supabase.co");
        let isAccessible = false;
        let validationError: string | undefined;

        try {
          isAccessible = await validateImageUrl(category.image_url);
          if (!isAccessible) {
            validationError = "Image URL returns 404 or is not accessible";
          }
        } catch (error) {
          validationError = `Validation failed: ${error instanceof Error ? error.message : "Unknown error"}`;
        }

        statuses.push({
          category,
          isAccessible,
          needsMigration: isLocal || (!isAccessible && !isSupabase),
          isLocal,
          validationError,
        });
      }

      setImageStatuses(statuses);
    } catch (error) {
      console.error("Error validating image URLs:", error);
    } finally {
      setIsValidating(false);
    }
  };

  const startMigration = async () => {
    const categoriesToMigrate = imageStatuses.filter(
      (status) => status.needsMigration && status.category.image_url,
    );

    if (categoriesToMigrate.length === 0) {
      alert("No categories need migration");
      return;
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

    const imageUrls = categoriesToMigrate.map(
      (status) => status.category.image_url!,
    );

    try {
      const { results } = await batchMigrateImages(
        imageUrls,
        "categories",
        (completed, total, currentUrl) => {
          setMigrationStatus((prev) => ({
            ...prev,
            processed: completed,
            current: currentUrl,
          }));
        },
      );

      // Update database with new URLs
      let succeeded = 0;
      let failed = 0;

      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        const category = categoriesToMigrate[i].category;

        if (result.success && result.publicUrl) {
          try {
            const { error } = await supabase
              .from("product_categories")
              .update({ image_url: result.publicUrl })
              .eq("id", category.id);

            if (error) {
              console.error(
                `Failed to update category ${category.name}:`,
                error,
              );
              failed++;
            } else {
              succeeded++;
            }
          } catch (error) {
            console.error(
              `Database update failed for category ${category.name}:`,
              error,
            );
            failed++;
          }
        } else {
          failed++;
        }
      }

      setMigrationStatus((prev) => ({
        ...prev,
        succeeded,
        failed,
        isRunning: false,
        isComplete: true,
        results,
      }));

      // Reload categories to reflect changes
      await loadCategories();
    } catch (error) {
      console.error("Migration failed:", error);
      setMigrationStatus((prev) => ({
        ...prev,
        isRunning: false,
        isComplete: true,
      }));
    }
  };

  const brokenImages = imageStatuses.filter((status) => !status.isAccessible);
  const localImages = imageStatuses.filter((status) => status.isLocal);
  const migrationNeeded = imageStatuses.filter(
    (status) => status.needsMigration,
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded animate-pulse w-48"></div>
        <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
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
          <Button
            variant="outline"
            onClick={loadCategories}
            disabled={isValidating}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${isValidating ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          <Button
            onClick={startMigration}
            disabled={
              migrationStatus.isRunning ||
              migrationNeeded.length === 0 ||
              isValidating
            }
          >
            <Upload className="h-4 w-4 mr-2" />
            Start Migration
          </Button>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Categories
            </CardTitle>
            <ImageIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.length}</div>
            <p className="text-xs text-muted-foreground">
              {categories.filter((c) => c.image_url).length} with images
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Broken Images</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {brokenImages.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Not accessible or 404
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Local Images</CardTitle>
            <Database className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {localImages.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Using /uploads/ paths
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Migration Needed
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {migrationNeeded.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Need Supabase migration
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Migration Progress */}
      {migrationStatus.isRunning && (
        <Card>
          <CardHeader>
            <CardTitle>Migration in Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Progress
              value={(migrationStatus.processed / migrationStatus.total) * 100}
              className="w-full"
            />
            <div className="flex justify-between text-sm">
              <span>
                {migrationStatus.processed} of {migrationStatus.total} processed
              </span>
              <span>{migrationStatus.current}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Migration Results */}
      {migrationStatus.isComplete && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            Migration completed: {migrationStatus.succeeded} succeeded,{" "}
            {migrationStatus.failed} failed
          </AlertDescription>
        </Alert>
      )}

      {/* Category Status List */}
      <Card>
        <CardHeader>
          <CardTitle>Category Image Status</CardTitle>
        </CardHeader>
        <CardContent>
          {isValidating ? (
            <div className="text-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">Validating image URLs...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {imageStatuses.map((status) => (
                <div
                  key={status.category.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                      {status.category.image_url ? (
                        <img
                          src={status.category.image_url}
                          alt={status.category.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display =
                              "none";
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium">{status.category.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {status.category.image_url || "No image"}
                      </p>
                      {status.validationError && (
                        <p className="text-sm text-red-600">
                          {status.validationError}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {status.isAccessible ? (
                      <Badge
                        variant="default"
                        className="bg-green-100 text-green-800"
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Accessible
                      </Badge>
                    ) : (
                      <Badge variant="destructive">
                        <XCircle className="h-3 w-3 mr-1" />
                        Broken
                      </Badge>
                    )}
                    {status.isLocal && (
                      <Badge
                        variant="outline"
                        className="bg-orange-50 text-orange-700"
                      >
                        Local
                      </Badge>
                    )}
                    {status.needsMigration && (
                      <Badge
                        variant="outline"
                        className="bg-yellow-50 text-yellow-700"
                      >
                        Needs Migration
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
