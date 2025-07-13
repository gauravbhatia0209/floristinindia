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
  X,
  Image as ImageIcon,
  Search,
  Share2,
  Code,
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
import {
  uploadImageToSupabase,
  deleteImageFromSupabase,
} from "@/lib/supabase-storage";

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
  whatsapp_number: string;
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
  facebook_app_id: string;

  // Advanced SEO
  meta_title_template: string;
  og_image_url: string;
  twitter_card_type: string;
  twitter_site: string;
  canonical_url: string;
  robots_txt_content: string;
  schema_org_organization: string;
  custom_head_tags: string;
  sitemap_enabled: boolean;
  breadcrumbs_enabled: boolean;
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
    whatsapp_number: "",
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
    enable_special_instructions: true,
    enable_guest_checkout: true,
    default_meta_title: "",
    default_meta_description: "",
    google_analytics_id: "",
    facebook_pixel_id: "",
    facebook_app_id: "",
    meta_title_template: "%title% | %sitename%",
    og_image_url: "",
    twitter_card_type: "summary_large_image",
    twitter_site: "",
    canonical_url: "",
    robots_txt_content: "",
    schema_org_organization: "",
    custom_head_tags: "",
    sitemap_enabled: true,
    breadcrumbs_enabled: true,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [logoUploading, setLogoUploading] = useState(false);
  const [faviconUploading, setFaviconUploading] = useState(false);
  const [ogImageUploading, setOgImageUploading] = useState(false);

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
      logo_url: "Site logo image",
      favicon_url: "Site favicon image",
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
      google_analytics_id:
        "Google Analytics tracking ID (GA4 format: G-XXXXXXXXXX)",
      facebook_app_id: "Facebook App ID for enhanced Facebook Shop integration",
    };
    return descriptions[key] || "";
  }

  function handleInputChange(key: keyof SettingsData, value: any) {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }

  async function handleLogoUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setLogoUploading(true);
    try {
      // Delete old logo if exists
      if (settings.logo_url) {
        await deleteImageFromSupabase(settings.logo_url);
      }

      const result = await uploadImageToSupabase(file, "logos");
      if (result.success && result.publicUrl) {
        handleInputChange("logo_url", result.publicUrl);
      } else {
        alert(result.error || "Failed to upload logo");
      }
    } catch (error) {
      console.error("Logo upload error:", error);
      alert("Failed to upload logo");
    } finally {
      setLogoUploading(false);
    }
  }

  async function handleFaviconUpload(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];
    if (!file) return;

    setFaviconUploading(true);
    try {
      // Delete old favicon if exists
      if (settings.favicon_url) {
        await deleteImageFromSupabase(settings.favicon_url);
      }

      const result = await uploadImageToSupabase(file, "favicons");
      if (result.success && result.publicUrl) {
        handleInputChange("favicon_url", result.publicUrl);
      } else {
        alert(result.error || "Failed to upload favicon");
      }
    } catch (error) {
      console.error("Favicon upload error:", error);
      alert("Failed to upload favicon");
    } finally {
      setFaviconUploading(false);
    }
  }

  function removeLogo() {
    handleInputChange("logo_url", "");
  }

  function removeFavicon() {
    handleInputChange("favicon_url", "");
  }

  async function handleOgImageUpload(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];
    if (!file) return;

    setOgImageUploading(true);
    try {
      // Delete old OG image if exists
      if (settings.og_image_url) {
        await deleteImageFromSupabase(settings.og_image_url);
      }

      const result = await uploadImageToSupabase(file, "og-images");
      if (result.success && result.publicUrl) {
        handleInputChange("og_image_url", result.publicUrl);
      } else {
        alert(result.error || "Failed to upload OG image");
      }
    } catch (error) {
      console.error("OG image upload error:", error);
      alert("Failed to upload OG image");
    } finally {
      setOgImageUploading(false);
    }
  }

  function removeOgImage() {
    handleInputChange("og_image_url", "");
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
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
          <TabsTrigger value="business">Business</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
          <TabsTrigger value="advanced-seo">Advanced SEO</TabsTrigger>
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
                <div className="space-y-3">
                  <Label>Logo</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                    {settings.logo_url ? (
                      <div className="space-y-3">
                        <div className="flex items-center justify-center">
                          <img
                            src={settings.logo_url}
                            alt="Logo preview"
                            className="max-h-20 max-w-full object-contain"
                          />
                        </div>
                        <div className="flex gap-2 justify-center">
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={handleLogoUpload}
                            disabled={logoUploading}
                            className="hidden"
                            id="logo-upload"
                          />
                          <Label htmlFor="logo-upload">
                            <Button
                              variant="outline"
                              size="sm"
                              asChild
                              disabled={logoUploading}
                            >
                              <span>
                                {logoUploading ? "Uploading..." : "Change"}
                              </span>
                            </Button>
                          </Label>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={removeLogo}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center space-y-3">
                        <ImageIcon className="h-8 w-8 mx-auto text-muted-foreground" />
                        <div>
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={handleLogoUpload}
                            disabled={logoUploading}
                            className="hidden"
                            id="logo-upload"
                          />
                          <Label htmlFor="logo-upload">
                            <Button
                              variant="outline"
                              asChild
                              disabled={logoUploading}
                            >
                              <span>
                                <Upload className="h-4 w-4 mr-2" />
                                {logoUploading ? "Uploading..." : "Upload Logo"}
                              </span>
                            </Button>
                          </Label>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          PNG, JPG, or WebP up to 3MB
                          <br />
                          Recommended: 300×100px or 400×120px
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Favicon</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                    {settings.favicon_url ? (
                      <div className="space-y-3">
                        <div className="flex items-center justify-center">
                          <img
                            src={settings.favicon_url}
                            alt="Favicon preview"
                            className="w-8 h-8 object-contain"
                          />
                        </div>
                        <div className="flex gap-2 justify-center">
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={handleFaviconUpload}
                            disabled={faviconUploading}
                            className="hidden"
                            id="favicon-upload"
                          />
                          <Label htmlFor="favicon-upload">
                            <Button
                              variant="outline"
                              size="sm"
                              asChild
                              disabled={faviconUploading}
                            >
                              <span>
                                {faviconUploading ? "Uploading..." : "Change"}
                              </span>
                            </Button>
                          </Label>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={removeFavicon}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center space-y-3">
                        <ImageIcon className="h-8 w-8 mx-auto text-muted-foreground" />
                        <div>
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={handleFaviconUpload}
                            disabled={faviconUploading}
                            className="hidden"
                            id="favicon-upload"
                          />
                          <Label htmlFor="favicon-upload">
                            <Button
                              variant="outline"
                              asChild
                              disabled={faviconUploading}
                            >
                              <span>
                                <Upload className="h-4 w-4 mr-2" />
                                {faviconUploading
                                  ? "Uploading..."
                                  : "Upload Favicon"}
                              </span>
                            </Button>
                          </Label>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          ICO, PNG, or JPG up to 3MB
                          <br />
                          Recommended: 32×32px or 48×48px
                        </p>
                      </div>
                    )}
                  </div>
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
                  <Label htmlFor="whatsapp_number">WhatsApp Number</Label>
                  <Input
                    id="whatsapp_number"
                    value={settings.whatsapp_number}
                    onChange={(e) =>
                      handleInputChange("whatsapp_number", e.target.value)
                    }
                    placeholder="+919876543210"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Include country code (e.g., +919876543210)
                  </p>
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
                  <Label htmlFor="enable_special_instructions">
                    Enable Special Instructions
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Allow customers to add special instructions
                  </p>
                </div>
                <Switch
                  id="enable_special_instructions"
                  checked={settings.enable_special_instructions}
                  onCheckedChange={(checked) =>
                    handleInputChange("enable_special_instructions", checked)
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
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                Basic SEO Settings
              </CardTitle>
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
                <p className="text-xs text-muted-foreground mt-1">
                  This will be used as the default title for pages without a
                  specific title
                </p>
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
                <p className="text-xs text-muted-foreground mt-1">
                  Recommended length: 150-160 characters
                </p>
              </div>

              <div>
                <Label htmlFor="meta_title_template">Meta Title Template</Label>
                <Input
                  id="meta_title_template"
                  value={settings.meta_title_template}
                  onChange={(e) =>
                    handleInputChange("meta_title_template", e.target.value)
                  }
                  placeholder="%title% | %sitename%"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Use %title% for page title and %sitename% for site name.
                  Example: "Product Name | Florist in India"
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Analytics & Tracking</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="google_analytics_id">
                    Google Analytics Tracking ID
                  </Label>
                  <Input
                    id="google_analytics_id"
                    value={settings.google_analytics_id}
                    onChange={(e) =>
                      handleInputChange("google_analytics_id", e.target.value)
                    }
                    placeholder="G-XXXXXXXXXX"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Enter your Google Analytics 4 measurement ID (format:
                    G-XXXXXXXXXX)
                  </p>
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
                  <p className="text-xs text-muted-foreground mt-1">
                    Enter your Facebook Pixel ID for tracking and Facebook Shop
                    integration
                  </p>
                </div>
              </div>

              <div>
                <Label htmlFor="facebook_app_id">
                  Facebook App ID (Optional)
                </Label>
                <Input
                  id="facebook_app_id"
                  value={settings.facebook_app_id}
                  onChange={(e) =>
                    handleInputChange("facebook_app_id", e.target.value)
                  }
                  placeholder="1234567890123456"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Facebook App ID for enhanced social sharing and Facebook Shop
                  features
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
