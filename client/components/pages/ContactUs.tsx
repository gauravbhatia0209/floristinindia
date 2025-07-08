import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface SiteSettings {
  business_name?: string;
  phone?: string;
  email?: string;
  address?: string;
  business_hours?: string;
  google_maps_embed?: string;
}

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export default function ContactUs({ pageContent }: { pageContent: string }) {
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({});
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  useEffect(() => {
    fetchSiteSettings();
  }, []);

  async function fetchSiteSettings() {
    try {
      const { data } = await supabase
        .from("site_settings")
        .select("key, value")
        .in("key", [
          "business_name",
          "phone",
          "email",
          "address",
          "business_hours",
          "google_maps_embed",
        ]);

      if (data) {
        const settings = data.reduce((acc, setting) => {
          acc[setting.key as keyof SiteSettings] = setting.value;
          return acc;
        }, {} as SiteSettings);
        setSiteSettings(settings);
      }
    } catch (error) {
      console.error("Failed to fetch site settings:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      const { error } = await supabase.from("contact_submissions").insert({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        message: formData.message,
        submitted_at: new Date().toISOString(),
      });

      if (error) throw error;

      setSubmitMessage("Thank you! Your message has been sent successfully.");
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error("Failed to submit contact form:", error);
      setSubmitMessage(
        "Sorry, there was an error sending your message. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="h-8 bg-gray-200 rounded animate-pulse w-64"></div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="h-32 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-32 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Page Content from CMS */}
        {pageContent && (
          <div className="mb-12">
            <div
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: pageContent }}
            />
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
              <p className="text-muted-foreground mb-8">
                We'd love to hear from you! Send us a message and we'll get back
                to you as soon as possible.
              </p>
            </div>

            <div className="space-y-4">
              {siteSettings.business_name && (
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg">
                      {siteSettings.business_name}
                    </h3>
                  </CardContent>
                </Card>
              )}

              {siteSettings.phone && (
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">Phone</p>
                        <a
                          href={`tel:${siteSettings.phone}`}
                          className="text-muted-foreground hover:text-primary"
                        >
                          {siteSettings.phone}
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {siteSettings.email && (
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">Email</p>
                        <a
                          href={`mailto:${siteSettings.email}`}
                          className="text-muted-foreground hover:text-primary"
                        >
                          {siteSettings.email}
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {siteSettings.address && (
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-primary mt-1" />
                      <div>
                        <p className="font-medium">Address</p>
                        <p className="text-muted-foreground">
                          {siteSettings.address}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {siteSettings.business_hours && (
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-primary mt-1" />
                      <div>
                        <p className="font-medium">Business Hours</p>
                        <p className="text-muted-foreground">
                          {siteSettings.business_hours}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Google Maps */}
            {siteSettings.google_maps_embed && (
              <Card>
                <CardContent className="p-0">
                  <div
                    className="w-full h-64 rounded-lg overflow-hidden"
                    dangerouslySetInnerHTML={{
                      __html: siteSettings.google_maps_embed,
                    }}
                  />
                </CardContent>
              </Card>
            )}
          </div>

          {/* Contact Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Send us a Message</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Input
                        placeholder="Your Name"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Input
                        type="email"
                        placeholder="Your Email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Input
                      placeholder="Phone Number"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <Input
                      placeholder="Subject"
                      value={formData.subject}
                      onChange={(e) =>
                        setFormData({ ...formData, subject: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div>
                    <Textarea
                      placeholder="Your Message"
                      rows={5}
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>

                  {submitMessage && (
                    <div
                      className={`mt-4 p-3 rounded ${
                        submitMessage.includes("Thank you")
                          ? "bg-green-50 text-green-700 border border-green-200"
                          : "bg-red-50 text-red-700 border border-red-200"
                      }`}
                    >
                      {submitMessage}
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
