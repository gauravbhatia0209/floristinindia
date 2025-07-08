import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface SiteSettings {
  business_name?: string;
  contact_phone?: string;
  contact_email?: string;
  contact_address?: string;
  business_hours?: string;
  google_maps_embed?: string;
  contact_phone_2?: string;
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
          "contact_phone",
          "contact_phone_2",
          "contact_email",
          "contact_address",
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

  function validateForm(): string | null {
    if (!formData.name.trim()) {
      return "Name is required";
    }
    if (!formData.email.trim()) {
      return "Email is required";
    }
    if (!formData.email.includes("@")) {
      return "Please enter a valid email address";
    }
    if (!formData.message.trim()) {
      return "Message is required";
    }
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Validate form
    const validationError = validateForm();
    if (validationError) {
      setSubmitMessage(validationError);
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      console.log("Submitting form data:", {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || null,
        subject: formData.subject.trim() || "Contact Form Submission",
        message: formData.message.trim(),
      });

      // Insert into contact_submissions table
      const { data, error } = await supabase
        .from("contact_submissions")
        .insert([
          {
            name: formData.name.trim(),
            email: formData.email.trim(),
            phone: formData.phone.trim() || null,
            subject: formData.subject.trim() || "Contact Form Submission",
            message: formData.message.trim(),
            is_read: false,
          },
        ])
        .select();

      if (error) {
        console.error("Supabase error details:", error);

        // Handle specific Supabase errors
        if (error.code === "42P01") {
          throw new Error(
            "Database table not found. Please contact administrator.",
          );
        } else if (error.code === "23505") {
          throw new Error("Duplicate submission detected. Please try again.");
        } else if (error.message) {
          throw new Error(`Database error: ${error.message}`);
        } else {
          throw new Error("Failed to save your message. Please try again.");
        }
      }

      if (!data || data.length === 0) {
        throw new Error("No data returned from database. Please try again.");
      }

      console.log("Successfully submitted:", data);
      setSubmitMessage(
        "✅ Thank you! Your message has been received. We'll get back to you soon.",
      );

      // Clear form after successful submission
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (error: any) {
      console.error("Form submission error:", error);

      // Provide user-friendly error messages
      let errorMessage = "Sorry, something went wrong. Please try again.";

      if (error.message) {
        errorMessage = error.message;
      } else if (error.code) {
        errorMessage = `Error ${error.code}: Please contact support.`;
      }

      setSubmitMessage(`❌ ${errorMessage}`);
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

  // Format business hours properly
  function formatBusinessHours(hours: string): string {
    try {
      // Try to parse if it's JSON
      const parsed = JSON.parse(hours);
      if (typeof parsed === "object") {
        return Object.entries(parsed)
          .map(([day, time]) => `${day}: ${time}`)
          .join("\n");
      }
    } catch {
      // If not JSON, return as is
    }
    return hours;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Contact Us
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We'd love to hear from you! Get in touch and we'll respond as soon
              as possible.
            </p>
          </div>

          {/* Page Content from CMS */}
          {pageContent && (
            <div className="mb-12 max-w-4xl mx-auto">
              <div
                className="prose prose-lg max-w-none text-center"
                dangerouslySetInnerHTML={{ __html: pageContent }}
              />
            </div>
          )}

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Section - Contact Information */}
            <div className="lg:col-span-1 space-y-6">
              {/* Business Hours */}
              {siteSettings.business_hours && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-primary" />
                      Business Hours
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="whitespace-pre-line text-gray-700">
                      {formatBusinessHours(siteSettings.business_hours)}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Store Address */}
              {siteSettings.contact_address && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-primary" />
                      Store Address
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed">
                      {siteSettings.contact_address}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Contact Numbers */}
              {(siteSettings.contact_phone || siteSettings.contact_phone_2) && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Phone className="h-5 w-5 text-primary" />
                      Contact Numbers
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {siteSettings.contact_phone && (
                      <div>
                        <a
                          href={`tel:${siteSettings.contact_phone}`}
                          className="text-lg font-medium text-primary hover:underline"
                        >
                          {siteSettings.contact_phone}
                        </a>
                        <p className="text-sm text-gray-500">Primary</p>
                      </div>
                    )}
                    {siteSettings.contact_phone_2 && (
                      <div>
                        <a
                          href={`tel:${siteSettings.contact_phone_2}`}
                          className="text-lg font-medium text-primary hover:underline"
                        >
                          {siteSettings.contact_phone_2}
                        </a>
                        <p className="text-sm text-gray-500">Secondary</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Email */}
              {siteSettings.contact_email && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Mail className="h-5 w-5 text-primary" />
                      Email ID
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <a
                      href={`mailto:${siteSettings.contact_email}`}
                      className="text-lg font-medium text-primary hover:underline"
                    >
                      {siteSettings.contact_email}
                    </a>
                  </CardContent>
                </Card>
              )}

              {/* Google Maps */}
              {siteSettings.google_maps_embed && (
                <Card>
                  <CardHeader>
                    <CardTitle>Find Us</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div
                      className="w-full h-64 rounded-b-lg overflow-hidden"
                      dangerouslySetInnerHTML={{
                        __html: siteSettings.google_maps_embed,
                      }}
                    />
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Section - Contact Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Send us a Message</CardTitle>
                  <p className="text-gray-600">
                    Fill out the form below and we'll get back to you within 24
                    hours.
                  </p>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name *
                        </label>
                        <Input
                          placeholder="Enter your full name"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          className="h-12"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address *
                        </label>
                        <Input
                          type="email"
                          placeholder="Enter your email address"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          className="h-12"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number
                        </label>
                        <Input
                          type="tel"
                          placeholder="Enter your phone number"
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData({ ...formData, phone: e.target.value })
                          }
                          className="h-12"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Subject
                        </label>
                        <Input
                          placeholder="Enter message subject"
                          value={formData.subject}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              subject: e.target.value,
                            })
                          }
                          className="h-12"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Message *
                      </label>
                      <Textarea
                        placeholder="Enter your message here..."
                        rows={6}
                        value={formData.message}
                        onChange={(e) =>
                          setFormData({ ...formData, message: e.target.value })
                        }
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-12 text-lg"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Sending Message..." : "Send Message"}
                    </Button>

                    {submitMessage && (
                      <div
                        className={`p-4 rounded-lg font-medium ${
                          submitMessage.includes("✅")
                            ? "bg-green-50 text-green-800 border border-green-200"
                            : "bg-red-50 text-red-800 border border-red-200"
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
    </div>
  );
}
