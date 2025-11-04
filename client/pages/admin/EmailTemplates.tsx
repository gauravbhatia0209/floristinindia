import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/lib/supabase";
import { EmailTemplate } from "@/types/database.types";
import { AlertCircle, CheckCircle2, Loader2, Eye, Edit } from "lucide-react";

const TEMPLATE_TYPES = [
  { value: "order_confirmation", label: "Order Confirmation" },
  { value: "status_update", label: "Status Update" },
];

const ORDER_STATUSES = [
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "refunded",
];

const AVAILABLE_VARIABLES = {
  order_confirmation: [
    "ORDER_NUMBER",
    "CUSTOMER_NAME",
    "TOTAL_AMOUNT",
    "ORDER_DATE",
    "PAYMENT_STATUS",
    "DELIVERY_DATE",
    "DELIVERY_SLOT",
  ],
  status_update: [
    "ORDER_NUMBER",
    "CUSTOMER_NAME",
    "TOTAL_AMOUNT",
    "ORDER_DATE",
    "OLD_STATUS",
    "NEW_STATUS",
    "DELIVERY_DATE",
    "DELIVERY_SLOT",
  ],
};

interface EditingTemplate extends EmailTemplate {
  isNew?: boolean;
}

export default function EmailTemplates() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [editingTemplate, setEditingTemplate] = useState<EditingTemplate | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      setIsLoading(true);
      const { data, error: fetchError } = await supabase
        .from("email_templates")
        .select("*")
        .order("template_type")
        .order("order_status");

      if (fetchError) throw fetchError;
      setTemplates(data || []);
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load templates";
      setError(message);
      console.error("Error loading templates:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditTemplate = (template: EmailTemplate) => {
    setEditingTemplate(template);
    setPreviewMode(false);
  };

  const handleCreateNew = (templateType: "order_confirmation" | "status_update", orderStatus?: string) => {
    setEditingTemplate({
      id: Math.random().toString(),
      template_type: templateType,
      order_status: orderStatus || null,
      subject: "",
      body: "",
      sections: {},
      template_variables: {},
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      created_by: null,
      isNew: true,
    });
    setPreviewMode(false);
  };

  const handleSaveTemplate = async () => {
    if (!editingTemplate) return;

    if (!editingTemplate.subject.trim() || !editingTemplate.body.trim()) {
      setError("Subject and body are required");
      return;
    }

    try {
      setIsSaving(true);
      setError(null);

      const { id, isNew, created_by, ...templateData } = editingTemplate;

      if (isNew) {
        const { data, error: insertError } = await supabase
          .from("email_templates")
          .insert([templateData])
          .select()
          .single();

        if (insertError) throw insertError;
        setTemplates([...templates, data]);
        setSuccess("Template created successfully!");
      } else {
        const { error: updateError } = await supabase
          .from("email_templates")
          .update({
            ...templateData,
            updated_at: new Date().toISOString(),
          })
          .eq("id", id);

        if (updateError) throw updateError;
        setTemplates(templates.map((t) => (t.id === id ? { ...t, ...templateData } : t)));
        setSuccess("Template updated successfully!");
      }

      setEditingTemplate(null);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to save template";
      setError(message);
      console.error("Error saving template:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditingTemplate(null);
    setPreviewMode(false);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-pink-600" />
      </div>
    );
  }

  if (editingTemplate) {
    return <TemplateEditor template={editingTemplate} setTemplate={setEditingTemplate} onSave={handleSaveTemplate} onCancel={handleCancel} isSaving={isSaving} previewMode={previewMode} setPreviewMode={setPreviewMode} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Email Templates</h1>
        <p className="text-gray-600 mt-2">
          Customize the emails sent to customers when orders are placed and status changes
        </p>
      </div>

      {/* Error/Success Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="text-red-800">{error}</div>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div className="text-green-800">{success}</div>
        </div>
      )}

      {/* Templates Tabs */}
      <Tabs defaultValue="order_confirmation" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="order_confirmation">Order Confirmation</TabsTrigger>
          <TabsTrigger value="status_update">Status Updates</TabsTrigger>
        </TabsList>

        {/* Order Confirmation Tab */}
        <TabsContent value="order_confirmation" className="space-y-4">
          <div className="grid gap-4">
            {templates
              .filter((t) => t.template_type === "order_confirmation")
              .map((template) => (
                <Card key={template.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <CardTitle>{template.subject || "No subject"}</CardTitle>
                        <CardDescription>
                          Sent when customer completes payment
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditTemplate(template)}
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
          </div>
        </TabsContent>

        {/* Status Update Tab */}
        <TabsContent value="status_update" className="space-y-4">
          <div className="grid gap-4">
            {ORDER_STATUSES.map((status) => {
              const template = templates.find(
                (t) => t.template_type === "status_update" && t.order_status === status
              );
              return (
                <Card key={status}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <CardTitle className="capitalize">{status}</CardTitle>
                          <Badge variant="secondary">{template ? "Customized" : "Default"}</Badge>
                        </div>
                        <CardDescription>
                          Sent when order status changes to {status}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        {template && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditTemplate(template)}
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </Button>
                        )}
                        {!template && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCreateNew("status_update", status)}
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Create
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface TemplateEditorProps {
  template: EditingTemplate;
  setTemplate: (t: EditingTemplate) => void;
  onSave: () => void;
  onCancel: () => void;
  isSaving: boolean;
  previewMode: boolean;
  setPreviewMode: (mode: boolean) => void;
}

function TemplateEditor({
  template,
  setTemplate,
  onSave,
  onCancel,
  isSaving,
  previewMode,
  setPreviewMode,
}: TemplateEditorProps) {
  const availableVariables = AVAILABLE_VARIABLES[template.template_type as keyof typeof AVAILABLE_VARIABLES] || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {template.isNew ? "Create" : "Edit"} {TEMPLATE_TYPES.find((t) => t.value === template.template_type)?.label}
          </h1>
          {template.order_status && (
            <p className="text-gray-600 mt-2">Status: <Badge className="ml-2">{template.order_status}</Badge></p>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel} disabled={isSaving}>
            Cancel
          </Button>
          <Button
            onClick={onSave}
            disabled={isSaving}
            className="bg-pink-600 hover:bg-pink-700"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Template"
            )}
          </Button>
        </div>
      </div>

      {/* Toggle Preview */}
      <div className="flex items-center gap-2">
        <Button
          variant={previewMode ? "default" : "outline"}
          size="sm"
          onClick={() => setPreviewMode(!previewMode)}
        >
          <Eye className="w-4 h-4 mr-2" />
          {previewMode ? "Edit" : "Preview"}
        </Button>
      </div>

      {previewMode ? (
        // Preview Mode
        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
            <CardDescription>This is how the email will look to customers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 rounded-lg p-6 border">
              <div className="mb-4 pb-4 border-b">
                <h2 className="text-lg font-semibold text-gray-900">Subject: {template.subject}</h2>
              </div>
              <div
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: template.body }}
              />
            </div>
          </CardContent>
        </Card>
      ) : (
        // Edit Mode
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
          {/* Main Editor */}
          <div className="lg:col-span-2 space-y-6">
            {/* Subject */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Email Subject</CardTitle>
              </CardHeader>
              <CardContent>
                <Input
                  value={template.subject}
                  onChange={(e) =>
                    setTemplate({ ...template, subject: e.target.value })
                  }
                  placeholder="Enter email subject"
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Use variables like {"{ORDER_NUMBER}"} to insert dynamic content
                </p>
              </CardContent>
            </Card>

            {/* Body Editor */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Email Body</CardTitle>
              </CardHeader>
              <CardContent>
                <textarea
                  value={template.body}
                  onChange={(e) =>
                    setTemplate({ ...template, body: e.target.value })
                  }
                  placeholder="Enter HTML email body"
                  className="w-full h-96 p-3 border rounded-lg font-mono text-sm"
                />
                <p className="text-xs text-gray-500 mt-2">
                  You can use HTML formatting and template variables
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Template Variables */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Available Variables</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {availableVariables.map((variable) => (
                  <div
                    key={variable}
                    className="bg-gray-50 p-2 rounded text-sm font-mono cursor-pointer hover:bg-gray-100 transition"
                    onClick={() => {
                      const textarea = document.querySelector("textarea");
                      if (textarea) {
                        const start = textarea.selectionStart;
                        const end = textarea.selectionEnd;
                        const newBody =
                          template.body.substring(0, start) +
                          `{${variable}}` +
                          template.body.substring(end);
                        setTemplate({ ...template, body: newBody });
                      }
                    }}
                  >
                    {"{" + variable + "}"}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
