import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, RefreshCw } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface TableTest {
  name: string;
  status: "loading" | "success" | "error";
  count: number;
  error?: string;
}

export default function DatabaseTest() {
  const [tests, setTests] = useState<TableTest[]>([
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
  ]);

  useEffect(() => {
    runTests();
  }, []);

  async function runTests() {
    const tableNames = [
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

    for (const tableName of tableNames) {
      try {
        console.log(`Testing table: ${tableName}`);
        const { data, error, count } = await supabase
          .from(tableName)
          .select("*", { count: "exact", head: true });

        setTests((prev) =>
          prev.map((test) =>
            test.name === tableName
              ? {
                  ...test,
                  status: error ? "error" : "success",
                  count: count || 0,
                  error: error?.message,
                }
              : test,
          ),
        );

        console.log(`${tableName}: ${count} records, error:`, error);
      } catch (err) {
        console.error(`Failed to test ${tableName}:`, err);
        setTests((prev) =>
          prev.map((test) =>
            test.name === tableName
              ? {
                  ...test,
                  status: "error",
                  count: 0,
                  error: "Connection failed",
                }
              : test,
          ),
        );
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Database Connection Test</h1>
          <p className="text-muted-foreground">
            Testing connection to all database tables
          </p>
        </div>
        <Button onClick={runTests}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh Tests
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {tests.map((test) => (
          <Card key={test.name}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center justify-between">
                <span className="capitalize">
                  {test.name.replace("_", " ")}
                </span>
                {test.status === "loading" && (
                  <div className="animate-spin w-4 h-4 border-2 border-primary border-t-transparent rounded-full"></div>
                )}
                {test.status === "success" && (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                )}
                {test.status === "error" && (
                  <XCircle className="w-4 h-4 text-red-600" />
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Status:</span>
                  <Badge
                    variant={
                      test.status === "success"
                        ? "default"
                        : test.status === "error"
                          ? "destructive"
                          : "secondary"
                    }
                  >
                    {test.status}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Records:
                  </span>
                  <span className="font-medium">{test.count}</span>
                </div>
                {test.error && (
                  <div className="text-xs text-red-600 mt-2">{test.error}</div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Environment Check</CardTitle>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>
    </div>
  );
}
