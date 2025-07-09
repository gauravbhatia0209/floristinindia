import { useState, useEffect } from "react";
import {
  Save,
  Upload,
  Globe,
  Phone,
  Mail,
  MapPin,
  Clock,
  IndianRupee,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/lib/supabase";
import { SiteSettings } from "@shared/database.types";

interface SettingsData {
  // Site Info
  site_name: string;
  site_tagline: string;
  site_description: string;
  logo_url: string;
  favicon_url: string;

  // Contact Info
  contact_phone: string;
  contact_phone_2: string;
  contact_email: string;
  contact_address: string;
  business_hours: string;
  google_maps_embed: string;

  // Social Media
  facebook_url: string;
  instagram_url: string;
  twitter_url: string;
  youtube_url: string;

  // Business Settings
  currency_symbol: string;
  gst_rate: string;
  free_shipping_minimum: string;
  same_day_cutoff_time: string;

  // Features
  enable_reviews: boolean;
  enable_wishlist: boolean;
  enable_file_upload: boolean;
  enable_special_instructions: boolean;
  enable_guest_checkout: boolean;

  // SEO
  default_meta_title: string;
  default_meta_description: string;
  google_analytics_id: string;
  facebook_pixel_id: string;
}

export default function Settings() {
  const [settings, setSettings] = useState<SettingsData>({
    site_name: "",
    site_tagline: "",
    site_description: "",
    logo_url: "",
    favicon_url: "",
    contact_phone: "",
    contact_phone_2: "",
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
    enable_guest_checkout: true,
    default_meta_title: "",
    default_meta_description: "",
    google_analytics_id: "",
    facebook_pixel_id: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    try {
      const { data } = await supabase.from("site_settings").select("*");

      if (data) {
        const settingsMap: Record<string, any> = {};
        data.forEach((setting: SiteSettings) => {
          if (setting.type === "boolean") {
            settingsMap[setting.key] = setting.value === "true";
          } else if (setting.type === "json") {
            try {
              settingsMap[setting.key] = JSON.parse(setting.value);
            } catch {
              settingsMap[setting.key] = setting.value;
            }
          } else {
            settingsMap[setting.key] = setting.value;
          }
        });

        setSettings((prev) => ({ ...prev, ...settingsMap }));
      }
    } catch (error) {
      console.error("Failed to fetch settings:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function saveSettings() {
    setIsSaving(true);
    try {
      // Convert settings object to individual database records
      const settingsToSave = Object.entries(settings).map(([key, value]) => {
        let type: "text" | "json" | "boolean" | "number" = "text";
        let stringValue = String(value);

        if (typeof value === "boolean") {
          type = "boolean";
          stringValue = value.toString();
        } else if (typeof value === "number") {
          type = "number";
        } else if (typeof value === "object") {
          type = "json";
          stringValue = JSON.stringify(value);
        }

        return {
          key,
          value: stringValue,
          type,
          description: getSettingDescription(key),
        };
      });

      // Upsert each setting
      for (const setting of settingsToSave) {
        await supabase.from("site_settings").upsert(
          {
            ...setting,
            updated_at: new Date().toISOString(),
          },
          {
            onConflict: "key",
          },
        );
      }

      alert("Settings saved successfully!");
    } catch (error) {
      console.error("Failed to save settings:", error);
      alert("Failed to save settings. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  function getSettingDescription(key: string): string {
    const descriptions: Record<string, string> = {
      site_name: "The name of your website",
      site_tagline: "Short tagline for your site",
      site_description: "Brief description of your business",
      logo_url: "URL to your site logo",
      favicon_url: "URL to your favicon",
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
    };
    return descriptions[key] || "";
  }

  function handleInputChange(key: keyof SettingsData, value: any) {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }

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
          <h1 className="text-2xl font-bold">Site Settings</h1>
          <p className="text-muted-foreground">
            Configure your website settings and preferences
          </p>
        </div>
        <Button onClick={saveSettings} disabled={isSaving}>
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? "Saving..." : "Save Settings"}
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
          <TabsTrigger value="business">Business</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Site Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="site_name">Site Name</Label>
                  <Input
                    id="site_name"
                    value={settings.site_name}
                    onChange={(e) =>
                      handleInputChange("site_name", e.target.value)
                    }
                    placeholder="Florist in India"
                  />
                </div>
                <div>
                  <Label htmlFor="site_tagline">Site Tagline</Label>
                  <Input
                    id="site_tagline"
                    value={settings.site_tagline}
                    onChange={(e) =>
                      handleInputChange("site_tagline", e.target.value)
                    }
                    placeholder="Fresh Flowers Delivered Daily"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="site_description">Site Description</Label>
                <Textarea
                  id="site_description"
                  value={settings.site_description}
                  onChange={(e) =>
                    handleInputChange("site_description", e.target.value)
                  }
                  placeholder="Premium flower delivery service across India..."
                  rows={3}
                />
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="logo_url">Logo URL</Label>
                  <Input
                    id="logo_url"
                    value={settings.logo_url}
                    onChange={(e) =>
                      handleInputChange("logo_url", e.target.value)
                    }
                    placeholder="https://example.com/logo.png"
                  />
                </div>
                <div>
                  <Label htmlFor="favicon_url">Favicon URL</Label>
                  <Input
                    id="favicon_url"
                    value={settings.favicon_url}
                    onChange={(e) =>
                      handleInputChange("favicon_url", e.target.value)
                    }
                    placeholder="https://example.com/favicon.ico"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="w-5 h-5" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contact_phone">Contact Phone (Primary)</Label>
                  <Input
                    id="contact_phone"
                    value={settings.contact_phone}
                    onChange={(e) =>
                      handleInputChange("contact_phone", e.target.value)
                    }
                    placeholder="+91 98765 43210"
                  />
                </div>
                <div>
                  <Label htmlFor="contact_phone_2">
                    Contact Phone (Secondary)
                  </Label>
                  <Input
                    id="contact_phone_2"
                    value={settings.contact_phone_2}
                    onChange={(e) =>
                      handleInputChange("contact_phone_2", e.target.value)
                    }
                    placeholder="+91 98765 43211"
                  />
                </div>
                <div>
                  <Label htmlFor="contact_email">Contact Email</Label>
                  <Input
                    id="contact_email"
                    type="email"
                    value={settings.contact_email}
                    onChange={(e) =>
                      handleInputChange("contact_email", e.target.value)
                    }
                    placeholder="info@floristinindia.com"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="contact_address">Business Address</Label>
                <Textarea
                  id="contact_address"
                  value={settings.contact_address}
                  onChange={(e) =>
                    handleInputChange("contact_address", e.target.value)
                  }
                  placeholder="123 Flower Street, Mumbai, Maharashtra, India"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="business_hours">Business Hours</Label>
                <Input
                  id="business_hours"
                  value={settings.business_hours}
                  onChange={(e) =>
                    handleInputChange("business_hours", e.target.value)
                  }
                  placeholder="Monday - Sunday: 9:00 AM - 9:00 PM"
                />
              </div>

              <div>
                <Label htmlFor="google_maps_embed">
                  Google Maps Embed Code
                </Label>
                <Textarea
                  id="google_maps_embed"
                  value={settings.google_maps_embed}
                  onChange={(e) =>
                    handleInputChange("google_maps_embed", e.target.value)
                  }
                  placeholder='<iframe src="https://www.google.com/maps/embed?..." width="100%" height="300" frameborder="0"></iframe>'
                  rows={4}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Paste the Google Maps embed iframe code here
                </p>
              </div>

              <Separator />

              <h3 className="text-lg font-semibold">Social Media</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="facebook_url">Facebook URL</Label>
                  <Input
                    id="facebook_url"
                    value={settings.facebook_url}
                    onChange={(e) =>
                      handleInputChange("facebook_url", e.target.value)
                    }
                    placeholder="https://facebook.com/yourpage"
                  />
                </div>
                <div>
                  <Label htmlFor="instagram_url">Instagram URL</Label>
                  <Input
                    id="instagram_url"
                    value={settings.instagram_url}
                    onChange={(e) =>
                      handleInputChange("instagram_url", e.target.value)
                    }
                    placeholder="https://instagram.com/yourprofile"
                  />
                </div>
                <div>
                  <Label htmlFor="twitter_url">Twitter URL</Label>
                  <Input
                    id="twitter_url"
                    value={settings.twitter_url}
                    onChange={(e) =>
                      handleInputChange("twitter_url", e.target.value)
                    }
                    placeholder="https://twitter.com/yourprofile"
                  />
                </div>
                <div>
                  <Label htmlFor="youtube_url">YouTube URL</Label>
                  <Input
                    id="youtube_url"
                    value={settings.youtube_url}
                    onChange={(e) =>
                      handleInputChange("youtube_url", e.target.value)
                    }
                    placeholder="https://youtube.com/yourchannel"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="business" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IndianRupee className="w-5 h-5" />
                Business Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="currency_symbol">Currency Symbol</Label>
                  <Input
                    id="currency_symbol"
                    value={settings.currency_symbol}
                    onChange={(e) =>
                      handleInputChange("currency_symbol", e.target.value)
                    }
                    placeholder="₹"
                  />
                </div>
                <div>
                  <Label htmlFor="gst_rate">GST Rate (%)</Label>
                  <Input
                    id="gst_rate"
                    type="number"
                    value={settings.gst_rate}
                    onChange={(e) =>
                      handleInputChange("gst_rate", e.target.value)
                    }
                    placeholder="18"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="free_shipping_minimum">
                    Free Shipping Minimum (₹)
                  </Label>
                  <Input
                    id="free_shipping_minimum"
                    type="number"
                    value={settings.free_shipping_minimum}
                    onChange={(e) =>
                      handleInputChange("free_shipping_minimum", e.target.value)
                    }
                    placeholder="500"
                  />
                </div>
                <div>
                  <Label htmlFor="same_day_cutoff_time">
                    Same-day Delivery Cutoff
                  </Label>
                  <Input
                    id="same_day_cutoff_time"
                    type="time"
                    value={settings.same_day_cutoff_time}
                    onChange={(e) =>
                      handleInputChange("same_day_cutoff_time", e.target.value)
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Feature Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="enable_reviews">Enable Product Reviews</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow customers to leave reviews
                  </p>
                </div>
                <Switch
                  id="enable_reviews"
                  checked={settings.enable_reviews}
                  onCheckedChange={(checked) =>
                    handleInputChange("enable_reviews", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="enable_wishlist">Enable Wishlist</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow customers to save favorite products
                  </p>
                </div>
                <Switch
                  id="enable_wishlist"
                  checked={settings.enable_wishlist}
                  onCheckedChange={(checked) =>
                    handleInputChange("enable_wishlist", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="enable_file_upload">Enable File Upload</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow customers to upload custom images
                  </p>
                </div>
                <Switch
                  id="enable_file_upload"
                  checked={settings.enable_file_upload}
                  onCheckedChange={(checked) =>
                    handleInputChange("enable_file_upload", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="enable_guest_checkout">
                    Enable Guest Checkout
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Allow checkout without account creation
                  </p>
                </div>
                <Switch
                  id="enable_guest_checkout"
                  checked={settings.enable_guest_checkout}
                  onCheckedChange={(checked) =>
                    handleInputChange("enable_guest_checkout", checked)
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>SEO & Analytics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="default_meta_title">Default Meta Title</Label>
                <Input
                  id="default_meta_title"
                  value={settings.default_meta_title}
                  onChange={(e) =>
                    handleInputChange("default_meta_title", e.target.value)
                  }
                  placeholder="Fresh Flowers Delivered Daily | Florist in India"
                />
              </div>

              <div>
                <Label htmlFor="default_meta_description">
                  Default Meta Description
                </Label>
                <Textarea
                  id="default_meta_description"
                  value={settings.default_meta_description}
                  onChange={(e) =>
                    handleInputChange(
                      "default_meta_description",
                      e.target.value,
                    )
                  }
                  placeholder="Premium flower delivery service across India. Same-day delivery available in 100+ cities."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="google_analytics_id">
                    Google Analytics ID
                  </Label>
                  <Input
                    id="google_analytics_id"
                    value={settings.google_analytics_id}
                    onChange={(e) =>
                      handleInputChange("google_analytics_id", e.target.value)
                    }
                    placeholder="GA-XXXXXXXXX-X"
                  />
                </div>
                <div>
                  <Label htmlFor="facebook_pixel_id">Facebook Pixel ID</Label>
                  <Input
                    id="facebook_pixel_id"
                    value={settings.facebook_pixel_id}
                    onChange={(e) =>
                      handleInputChange("facebook_pixel_id", e.target.value)
                    }
                    placeholder="123456789012345"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
