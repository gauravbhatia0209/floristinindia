import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Settings, Save, RotateCcw } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface FooterConfigProps {
  currentMaxColumns?: number;
  onConfigChange?: (maxColumns: number) => void;
}

export default function FooterConfig({
  currentMaxColumns = 6,
  onConfigChange,
}: FooterConfigProps) {
  const [maxColumns, setMaxColumns] = useState(currentMaxColumns);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    try {
      setSaving(true);

      // Save to site settings
      const { error } = await supabase.from("site_settings").upsert(
        {
          key: "footer_max_columns",
          value: maxColumns.toString(),
          type: "number",
          description: "Maximum number of columns in footer",
        },
        { onConflict: "key" },
      );

      if (error) {
        console.error("Error saving footer config:", error);
        alert("Error saving configuration");
      } else {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
        onConfigChange?.(maxColumns);

        // Suggest page refresh for changes to take effect
        if (
          confirm("Configuration saved! Refresh the page to apply changes?")
        ) {
          window.location.reload();
        }
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error saving configuration");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setMaxColumns(6);
  };

  const getGridClass = (cols: number) => {
    const classes = {
      3: "grid-cols-3",
      4: "grid-cols-4",
      5: "grid-cols-5",
      6: "grid-cols-6",
      7: "grid-cols-7",
      8: "grid-cols-8",
    };
    return classes[cols as keyof typeof classes] || "grid-cols-4";
  };

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-800">
          <Settings className="h-5 w-5" />
          Footer Layout Configuration
          <Badge variant="outline" className="bg-blue-100">
            Advanced
          </Badge>
        </CardTitle>
        <p className="text-sm text-blue-700">
          Configure the maximum number of columns for the footer layout
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="max-columns">Maximum Columns</Label>
            <Input
              id="max-columns"
              type="number"
              min="3"
              max="8"
              value={maxColumns.toString()}
              onChange={(e) => setMaxColumns(parseInt(e.target.value) || 6)}
              placeholder="6"
            />
            <p className="text-xs text-blue-600 mt-1">
              Range: 3-8 columns (Column 1 reserved for company info)
            </p>
          </div>
          <div className="flex items-end gap-2">
            <Button
              onClick={handleSave}
              disabled={saving || maxColumns < 3 || maxColumns > 8}
              size="sm"
            >
              <Save className="h-4 w-4 mr-2" />
              {saving ? "Saving..." : "Save Config"}
            </Button>
            <Button onClick={handleReset} variant="outline" size="sm">
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            {saved && (
              <Badge variant="default" className="bg-green-100 text-green-800">
                ✓ Saved
              </Badge>
            )}
          </div>
        </div>

        {/* Preview */}
        <div className="space-y-3">
          <Label>Layout Preview ({maxColumns} columns)</Label>
          <div
            className={`grid ${getGridClass(maxColumns)} gap-2 p-4 bg-white rounded-lg border`}
          >
            <div className="bg-blue-100 p-3 rounded text-center text-sm font-medium">
              Column 1<br />
              <span className="text-xs text-blue-600">(Company Info)</span>
            </div>
            {Array.from({ length: maxColumns - 1 }, (_, i) => (
              <div
                key={i}
                className="bg-gray-100 p-3 rounded text-center text-sm"
              >
                Column {i + 2}
                <br />
                <span className="text-xs text-gray-600">(Available)</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-600">
            Column 1 is always reserved for company information (logo, contact
            details, social media)
          </p>
        </div>

        {/* Current Available Columns */}
        <div className="space-y-2">
          <Label>Available Columns for Footer Sections</Label>
          <div className="flex gap-2 flex-wrap">
            {Array.from({ length: maxColumns - 1 }, (_, i) => (
              <Badge key={i} variant="outline" className="text-sm">
                Column {i + 2}
              </Badge>
            ))}
          </div>
        </div>

        {/* Configuration Notes */}
        <div className="bg-white p-4 rounded-lg border border-blue-200">
          <h4 className="font-medium text-blue-800 mb-2">
            Configuration Notes:
          </h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Column 1 is always reserved for company information</li>
            <li>• Users can place custom sections in columns 2-{maxColumns}</li>
            <li>• Changes require a page refresh to take effect</li>
            <li>• Existing sections will remain in their current columns</li>
            <li>• Mobile layout automatically adapts to fewer columns</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
