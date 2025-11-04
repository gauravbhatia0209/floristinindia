import express from "express";
import { supabase } from "../lib/supabase.js";

const router = express.Router();

// Get all email templates
router.get("/", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("email_templates")
      .select("*")
      .order("template_type")
      .order("order_status");

    if (error) {
      console.error("Error fetching email templates:", error);
      return res.status(400).json({ success: false, error: error.message });
    }

    res.json({ success: true, data });
  } catch (error) {
    console.error("Error in get templates:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// Get specific email template by type and status
router.get("/:templateType/:orderStatus?", async (req, res) => {
  try {
    const { templateType, orderStatus } = req.params;

    let query = supabase
      .from("email_templates")
      .select("*")
      .eq("template_type", templateType)
      .eq("is_active", true);

    if (orderStatus && orderStatus !== "null") {
      query = query.eq("order_status", orderStatus);
    } else {
      query = query.is("order_status", null);
    }

    const { data, error } = await query.single();

    if (error) {
      console.error("Error fetching email template:", error);
      return res
        .status(404)
        .json({ success: false, error: "Template not found" });
    }

    res.json({ success: true, data });
  } catch (error) {
    console.error("Error in get template:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// Create new email template
router.post("/", async (req, res) => {
  try {
    const {
      template_type,
      order_status,
      subject,
      body,
      sections,
      template_variables,
    } = req.body;

    // Validate required fields
    if (!template_type || !subject || !body) {
      return res.status(400).json({
        success: false,
        error: "Template type, subject, and body are required",
      });
    }

    const { data, error } = await supabase
      .from("email_templates")
      .insert({
        template_type,
        order_status: order_status || null,
        subject,
        body,
        sections: sections || {},
        template_variables: template_variables || {},
        is_active: true,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating email template:", error);
      return res.status(400).json({ success: false, error: error.message });
    }

    res.json({ success: true, data });
  } catch (error) {
    console.error("Error in create template:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// Update email template
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { subject, body, sections, template_variables, is_active } = req.body;

    const { data, error } = await supabase
      .from("email_templates")
      .update({
        subject,
        body,
        sections: sections || {},
        template_variables: template_variables || {},
        is_active,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating email template:", error);
      return res.status(400).json({ success: false, error: error.message });
    }

    res.json({ success: true, data });
  } catch (error) {
    console.error("Error in update template:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// Delete email template
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from("email_templates")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting email template:", error);
      return res.status(400).json({ success: false, error: error.message });
    }

    res.json({ success: true, message: "Template deleted successfully" });
  } catch (error) {
    console.error("Error in delete template:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

export default router;
