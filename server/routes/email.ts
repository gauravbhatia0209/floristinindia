import express from "express";
import nodemailer from "nodemailer";
import { supabase } from "../lib/supabase.js";
import {
  sendOrderConfirmationEmails,
  sendOrderStatusUpdateEmail,
} from "../lib/email-service.js";

const router = express.Router();

// Send order confirmation emails (customer + admin)
router.post("/order-confirmation", async (req, res) => {
  try {
    const { orderNumber } = req.body;

    if (!orderNumber) {
      return res.status(400).json({
        success: false,
        error: "Order number is required",
      });
    }

    console.log(
      `📧 Sending order confirmation emails for order: ${orderNumber}`,
    );

    // Fetch complete order data
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select(
        `
        *,
        customer:customers(name, email, phone)
      `,
      )
      .eq("order_number", orderNumber)
      .single();

    if (orderError || !order) {
      console.error("❌ Error fetching order:", orderError);
      return res.status(404).json({
        success: false,
        error: "Order not found",
      });
    }

    // Parse order items if they're stored as JSON string
    let items = order.items;
    if (typeof order.items === "string") {
      try {
        items = JSON.parse(order.items);
      } catch (parseError) {
        console.error("❌ Error parsing order items:", parseError);
        items = [];
      }
    }

    const orderData = {
      order,
      customer: order.customer,
      items: items || [],
    };

    // Send emails
    await sendOrderConfirmationEmails(orderData);

    res.json({
      success: true,
      message: "Order confirmation emails sent successfully",
    });
  } catch (error) {
    console.error("❌ Error in order confirmation email route:", error);
    res.status(500).json({
      success: false,
      error: "Failed to send order confirmation emails",
    });
  }
});

// Send order status update email
router.post("/order-status-update", async (req, res) => {
  try {
    const { orderNumber, oldStatus, newStatus } = req.body;

    if (!orderNumber || !oldStatus || !newStatus) {
      return res.status(400).json({
        success: false,
        error: "Order number, old status, and new status are required",
      });
    }

    console.log(
      `📧 Sending order status update email for order: ${orderNumber} (${oldStatus} → ${newStatus})`,
    );

    // Fetch complete order data
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select(
        `
        *,
        customer:customers(name, email, phone)
      `,
      )
      .eq("order_number", orderNumber)
      .single();

    if (orderError || !order) {
      console.error("❌ Error fetching order:", orderError);
      return res.status(404).json({
        success: false,
        error: "Order not found",
      });
    }

    const orderData = {
      order,
      customer: order.customer,
    };

    // Send status update email
    await sendOrderStatusUpdateEmail(orderData, oldStatus, newStatus);

    res.json({
      success: true,
      message: "Order status update email sent successfully",
    });
  } catch (error) {
    console.error("❌ Error in order status update email route:", error);
    res.status(500).json({
      success: false,
      error: "Failed to send order status update email",
    });
  }
});

// Send admin notification for new order (before payment)
router.post("/order-created", async (req, res) => {
  try {
    const { orderNumber } = req.body;

    if (!orderNumber) {
      return res.status(400).json({
        success: false,
        error: "Order number is required",
      });
    }

    console.log(
      `📧 Sending admin notification for new order: ${orderNumber}`,
    );

    // Fetch complete order data
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select(
        `
        *,
        customer:customers(name, email, phone)
      `,
      )
      .eq("order_number", orderNumber)
      .single();

    if (orderError || !order) {
      console.error("❌ Error fetching order:", orderError);
      return res.status(404).json({
        success: false,
        error: "Order not found",
      });
    }

    // Parse order items if they're stored as JSON string
    let items = order.items;
    if (typeof order.items === "string") {
      try {
        items = JSON.parse(order.items);
      } catch (parseError) {
        console.error("❌ Error parsing order items:", parseError);
        items = [];
      }
    }

    const orderData = {
      order,
      customer: order.customer,
      items: items || [],
    };

    // Send admin notification only
    await sendOrderAdminNotification(orderData);

    res.json({
      success: true,
      message: "Admin notification sent successfully",
    });
  } catch (error) {
    console.error("❌ Error in order created notification route:", error);
    res.status(500).json({
      success: false,
      error: "Failed to send admin notification",
    });
  }
});

// Test email endpoint (for development)
router.post("/test", async (req, res) => {
  try {
    const { to, subject, message } = req.body;

    if (!to || !subject || !message) {
      return res.status(400).json({
        success: false,
        error: "To, subject, and message are required",
      });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || "smtp.gmail.com",
      port: parseInt(process.env.EMAIL_PORT || "587"),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Test Email</h2>
          <p>${message}</p>
          <p><em>This is a test email from Florist in India email service.</em></p>
        </div>
      `,
    });

    res.json({
      success: true,
      message: "Test email sent successfully",
    });
  } catch (error) {
    console.error("❌ Error sending test email:", error);
    res.status(500).json({
      success: false,
      error: "Failed to send test email",
    });
  }
});

// Helper function to send admin-only notification
async function sendOrderAdminNotification(orderData: any) {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: parseInt(process.env.EMAIL_PORT || "587"),
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const { order, items } = orderData;

  const itemsHtml = items
    .map(
      (item: any) => `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.product_name}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.quantity}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee;">₹${(item.price || 0).toFixed(2)}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee;">₹${(item.total_price || 0).toFixed(2)}</td>
    </tr>
  `,
    )
    .join("");

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: process.env.ADMIN_EMAIL,
      subject: `🔔 New Order #${order.order_number} - Payment ${order.payment_status || "Pending"}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>New Order Notification</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
          <div style="max-width: 600px; margin: 0 auto; background-color: white;">

            <!-- Header -->
            <div style="background-color: #dc2626; padding: 20px; text-align: center;">
              <h1 style="margin: 0; color: white; font-size: 24px;">🚨 NEW ORDER RECEIVED</h1>
            </div>

            <!-- Content -->
            <div style="padding: 24px;">
              <h2 style="margin: 0 0 16px 0; color: #1f2937;">Order #${order.order_number}</h2>

              <!-- Quick Stats -->
              <div style="background-color: #fee2e2; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; text-align: center;">
                  <div>
                    <p style="margin: 0; color: #7f1d1d; font-size: 24px; font-weight: bold;">₹${(order.total_amount || 0).toFixed(2)}</p>
                    <p style="margin: 0; color: #7f1d1d; font-size: 12px;">TOTAL</p>
                  </div>
                  <div>
                    <p style="margin: 0; color: #7f1d1d; font-size: 24px; font-weight: bold;">${items.length}</p>
                    <p style="margin: 0; color: #7f1d1d; font-size: 12px;">ITEMS</p>
                  </div>
                  <div>
                    <p style="margin: 0; color: #7f1d1d; font-size: 24px; font-weight: bold;">${(order.payment_status || "pending").toUpperCase()}</p>
                    <p style="margin: 0; color: #7f1d1d; font-size: 12px;">PAYMENT</p>
                  </div>
                </div>
              </div>

              <!-- Customer Info -->
              <h3 style="color: #1f2937; margin: 24px 0 8px 0;">Customer Information</h3>
              <p style="margin: 4px 0; color: #374151;"><strong>Name:</strong> ${orderData.customer?.name || "N/A"}</p>
              <p style="margin: 4px 0; color: #374151;"><strong>Email:</strong> ${orderData.customer?.email || "N/A"}</p>
              <p style="margin: 4px 0; color: #374151;"><strong>Phone:</strong> ${orderData.customer?.phone || "N/A"}</p>

              <!-- Delivery Info -->
              <h3 style="color: #1f2937; margin: 24px 0 8px 0;">Delivery Information</h3>
              <p style="margin: 4px 0; color: #374151;">
                <strong>Address:</strong><br>
                ${order.receiver_name || orderData.customer?.name || "N/A"}<br>
                ${order.shipping_address?.line1 || "N/A"}<br>
                ${order.shipping_address?.line2 ? order.shipping_address.line2 + "<br>" : ""}
                ${order.shipping_address?.city || "N/A"}, ${order.shipping_address?.state || "N/A"} - ${order.shipping_address?.pincode || "N/A"}
              </p>
              ${
                order.delivery_date
                  ? `
                <p style="margin: 4px 0; color: #374151;">
                  <strong>Delivery Date:</strong> ${new Date(order.delivery_date).toLocaleDateString("en-IN")}
                  ${order.delivery_slot ? ` at ${order.delivery_slot}` : ""}
                </p>
              `
                  : ""
              }

              <!-- Order Items -->
              <h3 style="color: #1f2937; margin: 24px 0 8px 0;">Order Items</h3>
              <table style="width: 100%; border-collapse: collapse; border: 1px solid #e5e7eb;">
                <thead>
                  <tr style="background-color: #f9fafb;">
                    <th style="padding: 8px; text-align: left; border-bottom: 1px solid #e5e7eb;">Product</th>
                    <th style="padding: 8px; text-align: left; border-bottom: 1px solid #e5e7eb;">Qty</th>
                    <th style="padding: 8px; text-align: left; border-bottom: 1px solid #e5e7eb;">Price</th>
                    <th style="padding: 8px; text-align: left; border-bottom: 1px solid #e5e7eb;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                </tbody>
              </table>

              ${
                order.special_instructions
                  ? `
                <h3 style="color: #1f2937; margin: 24px 0 8px 0;">Special Instructions</h3>
                <p style="background-color: #fef3c7; padding: 12px; border-radius: 6px; color: #92400e;">${order.special_instructions}</p>
              `
                  : ""
              }

              <!-- Payment Status -->
              <div style="background-color: ${order.payment_status === "paid" ? "#d1fae5" : "#fee2e2"}; border-radius: 8px; padding: 16px; margin-top: 24px;">
                <h4 style="margin: 0 0 8px 0; color: ${order.payment_status === "paid" ? "#065f46" : "#991b1b"};">
                  ${order.payment_status === "paid" ? "✅ Payment Received" : "⏳ Payment Pending"}
                </h4>
                <p style="margin: 0; color: ${order.payment_status === "paid" ? "#065f46" : "#991b1b"};">
                  ${
                    order.payment_status === "paid"
                      ? "Payment has been successfully received."
                      : "Customer is yet to complete the payment. Please follow up if needed."
                  }
                </p>
              </div>

              <!-- Action Required -->
              <div style="background-color: #fecaca; border-radius: 8px; padding: 16px; margin-top: 24px;">
                <h4 style="margin: 0 0 8px 0; color: #991b1b;">⚡ Action Required</h4>
                <p style="margin: 0; color: #991b1b;">
                  Please review this order and update the status accordingly in the admin panel.
                </p>
              </div>

              <!-- Quick Link -->
              <div style="text-align: center; margin-top: 24px;">
                <a href="${process.env.FRONTEND_URL || "https://floristinindia.com"}/admin/orders"
                   style="display: inline-block; background-color: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600;">
                  View in Admin Panel
                </a>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log(
      `✅ Admin notification email sent for order: ${order.order_number}`,
    );
  } catch (error) {
    console.error("❌ Error sending admin notification email:", error);
    throw error;
  }
}

export default router;
