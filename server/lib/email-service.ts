import nodemailer from "nodemailer";
import { createClient } from "@supabase/supabase-js";

// Email configuration
const createTransporter = () => {
  // Check if email credentials are configured
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error(
      "Email credentials not configured. Please set EMAIL_USER and EMAIL_PASS environment variables.",
    );
  }

  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: parseInt(process.env.EMAIL_PORT || "587"),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// Initialize Supabase client for fetching templates
const getSupabaseClient = () => {
  return createClient(
    process.env.VITE_SUPABASE_URL || "",
    process.env.SUPABASE_SERVICE_ROLE_KEY || "",
  );
};

// Process template variables in HTML
const processTemplateVariables = (
  html: string,
  variables: Record<string, any>,
): string => {
  let result = html;
  Object.entries(variables).forEach(([key, value]) => {
    const placeholder = new RegExp(`{${key}}`, "g");
    // For HTML content (like PRODUCTS_HTML), don't escape it
    // For regular text, it's already string so no escaping needed
    result = result.replace(placeholder, String(value || ""));
  });
  return result;
};

// Fetch email template from database
export const fetchEmailTemplate = async (
  templateType: "order_confirmation" | "status_update",
  orderStatus?: string,
) => {
  try {
    const supabase = getSupabaseClient();

    let query = supabase
      .from("email_templates")
      .select("*")
      .eq("template_type", templateType)
      .eq("is_active", true);

    if (orderStatus) {
      query = query.eq("order_status", orderStatus);
    } else {
      query = query.is("order_status", null);
    }

    const { data, error } = await query.single();

    if (error) {
      console.warn(
        `Could not fetch email template from database: ${error.message}`,
      );
      return null;
    }

    return data;
  } catch (error) {
    console.warn("Error fetching email template:", error);
    return null;
  }
};

// Email templates
export const generateOrderConfirmationEmail = (orderData: any) => {
  const { order, customer, items } = orderData;

  const itemsHtml = items
    .map(
      (item: any) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #eee;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <div>
            <h4 style="margin: 0; font-size: 16px; color: #333;">${item.product_name}</h4>
            ${item.variant_name ? `<p style="margin: 4px 0; color: #666; font-size: 14px;">Variant: ${item.variant_name}</p>` : ""}
            <p style="margin: 4px 0; color: #666; font-size: 14px;">Qty: ${item.quantity} | Price: ₹${(item.price || 0).toFixed(2)}</p>
          </div>
        </div>
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">
        <strong style="font-size: 16px; color: #333;">₹${(item.total_price || 0).toFixed(2)}</strong>
      </td>
    </tr>
  `,
    )
    .join("");

  return {
    subject: `Order Confirmation #${order.order_number} - Florist in India`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Confirmation</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">

          <!-- Header -->
          <div style="background: linear-gradient(135deg, #ec4899 0%, #f97316 100%); padding: 32px; text-align: center;">
            <h1 style="margin: 0; color: white; font-size: 28px; font-weight: bold;">🌸 Florist in India</h1>
            <p style="margin: 8px 0 0 0; color: white; opacity: 0.9;">Premium Flower Delivery</p>
          </div>

          <!-- Order Confirmation -->
          <div style="padding: 32px;">
            <div style="text-align: center; margin-bottom: 32px;">
              <div style="width: 64px; height: 64px; background-color: #10b981; border-radius: 50%; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center;">
                <span style="color: white; font-size: 32px;">✓</span>
              </div>
              <h2 style="margin: 0; color: #1f2937; font-size: 24px;">Order Confirmed!</h2>
              <p style="margin: 8px 0 0 0; color: #6b7280;">Thank you for your order, ${customer.name}!</p>
            </div>

            <!-- Order Details -->
            <div style="background-color: #f9fafb; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
              <h3 style="margin: 0 0 16px 0; color: #1f2937; font-size: 18px;">Order Details</h3>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                <div>
                  <p style="margin: 0; color: #6b7280; font-size: 14px;">Order Number</p>
                  <p style="margin: 4px 0 0 0; color: #1f2937; font-weight: 600;">#${order.order_number}</p>
                </div>
                <div>
                  <p style="margin: 0; color: #6b7280; font-size: 14px;">Order Date</p>
                  <p style="margin: 4px 0 0 0; color: #1f2937; font-weight: 600;">${new Date(
                    order.created_at,
                  ).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}</p>
                </div>
                <div>
                  <p style="margin: 0; color: #6b7280; font-size: 14px;">Total Amount</p>
                  <p style="margin: 4px 0 0 0; color: #1f2937; font-weight: 600;">₹${(order.total_amount || 0).toFixed(2)}</p>
                </div>
                <div>
                  <p style="margin: 0; color: #6b7280; font-size: 14px;">Payment Status</p>
                  <p style="margin: 4px 0 0 0; color: #10b981; font-weight: 600;">${order.payment_status}</p>
                </div>
              </div>
            </div>

            <!-- Order Items -->
            <div style="margin-bottom: 24px;">
              <h3 style="margin: 0 0 16px 0; color: #1f2937; font-size: 18px;">Order Items</h3>
              <table style="width: 100%; border-collapse: collapse; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
                ${itemsHtml}
              </table>
            </div>

            <!-- Delivery Information -->
            ${
              order.delivery_date
                ? `
            <div style="background-color: #fef3c7; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
              <h4 style="margin: 0 0 8px 0; color: #92400e;">📅 Delivery Information</h4>
              <p style="margin: 0; color: #92400e;">
                Delivery Date: ${new Date(order.delivery_date).toLocaleDateString("en-IN")}
                ${order.delivery_slot ? ` | Time: ${order.delivery_slot}` : ""}
              </p>
            </div>
            `
                : ""
            }

            <!-- Shipping Address -->
            <div style="background-color: #f3f4f6; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
              <h4 style="margin: 0 0 8px 0; color: #374151;">📍 Delivery Address</h4>
              <p style="margin: 0; color: #374151; line-height: 1.5;">
                ${order.receiver_name || customer.name}<br>
                ${order.shipping_address.line1}<br>
                ${order.shipping_address.line2 ? order.shipping_address.line2 + "<br>" : ""}
                ${order.shipping_address.city}, ${order.shipping_address.state} - ${order.shipping_address.pincode}<br>
                Phone: ${order.receiver_phone || customer.phone}
              </p>
            </div>

            <!-- Special Instructions -->
            ${
              order.special_instructions
                ? `
            <div style="background-color: #e0f2fe; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
              <h4 style="margin: 0 0 8px 0; color: #0277bd;">💬 Special Instructions</h4>
              <p style="margin: 0; color: #0277bd;">${order.special_instructions}</p>
            </div>
            `
                : ""
            }

            <!-- What's Next -->
            <div style="border-top: 1px solid #e5e7eb; padding-top: 24px;">
              <h4 style="margin: 0 0 12px 0; color: #1f2937;">What happens next?</h4>
              <ul style="margin: 0; padding-left: 20px; color: #6b7280;">
                <li>We'll prepare your order with care</li>
                <li>You'll receive updates via email as your order progresses</li>
                <li>Our delivery team will contact you before delivery</li>
                <li>Track your order status in your account</li>
              </ul>
            </div>

            <!-- CTA Button -->
            <div style="text-align: center; margin-top: 32px;">
              <a href="${process.env.FRONTEND_URL || "https://floristinindia.com"}/order-confirmation/${order.order_number}"
                 style="display: inline-block; background: linear-gradient(135deg, #ec4899 0%, #f97316 100%); color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600;">
                View Order Details
              </a>
            </div>
          </div>

          <!-- Footer -->
          <div style="background-color: #f9fafb; padding: 24px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px;">
              Need help? Contact us at
              <a href="mailto:info@floristinindia.com" style="color: #ec4899;">info@floristinindia.com</a>
              or call
              <a href="tel:+919988774333" style="color: #ec4899;">+91 99887 74333</a>
            </p>
            <p style="margin: 0; color: #9ca3af; font-size: 12px;">
              © 2024 Florist in India. All rights reserved.
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
  };
};

export const generateAdminOrderNotification = (orderData: any) => {
  const { order, customer, items } = orderData;

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

  return {
    subject: `🔔 New Order #${order.order_number} - ₹${(order.total_amount || 0).toFixed(2)}`,
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
                  <p style="margin: 0; color: #7f1d1d; font-size: 24px; font-weight: bold;">${order.payment_status.toUpperCase()}</p>
                  <p style="margin: 0; color: #7f1d1d; font-size: 12px;">PAYMENT</p>
                </div>
              </div>
            </div>

            <!-- Customer Info -->
            <h3 style="color: #1f2937; margin: 24px 0 8px 0;">Customer Information</h3>
            <p style="margin: 4px 0; color: #374151;"><strong>Name:</strong> ${customer.name}</p>
            <p style="margin: 4px 0; color: #374151;"><strong>Email:</strong> ${customer.email}</p>
            <p style="margin: 4px 0; color: #374151;"><strong>Phone:</strong> ${customer.phone}</p>

            <!-- Delivery Info -->
            <h3 style="color: #1f2937; margin: 24px 0 8px 0;">Delivery Information</h3>
            <p style="margin: 4px 0; color: #374151;">
              <strong>Address:</strong><br>
              ${order.receiver_name || customer.name}<br>
              ${order.shipping_address.line1}<br>
              ${order.shipping_address.line2 ? order.shipping_address.line2 + "<br>" : ""}
              ${order.shipping_address.city}, ${order.shipping_address.state} - ${order.shipping_address.pincode}
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

            <!-- Action Required -->
            <div style="background-color: #fecaca; border-radius: 8px; padding: 16px; margin-top: 24px;">
              <h4 style="margin: 0 0 8px 0; color: #991b1b;">⚡ Action Required</h4>
              <p style="margin: 0; color: #991b1b;">
                Please review this order in the admin panel and update the status accordingly.
              </p>
            </div>

            <!-- Quick Links -->
            <div style="text-align: center; margin-top: 24px;">
              <a href="${process.env.FRONTEND_URL || "https://floristinindia.com"}/admin/orders"
                 style="display: inline-block; background-color: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; margin-right: 12px;">
                View in Admin Panel
              </a>
              <a href="${process.env.FRONTEND_URL || "https://floristinindia.com"}/order-confirmation/${order.order_number}"
                 style="display: inline-block; background-color: #6b7280; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600;">
                View Order Details
              </a>
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
  };
};

export const generateOrderStatusUpdateEmail = (
  orderData: any,
  oldStatus: string,
  newStatus: string,
) => {
  const { order, customer } = orderData;

  const statusInfo = {
    pending: {
      icon: "⏳",
      color: "#f59e0b",
      message: "Your order is being processed",
    },
    confirmed: {
      icon: "✅",
      color: "#10b981",
      message: "Your order has been confirmed",
    },
    processing: {
      icon: "🔄",
      color: "#3b82f6",
      message: "Your order is being prepared",
    },
    shipped: {
      icon: "🚚",
      color: "#8b5cf6",
      message: "Your order is on its way",
    },
    delivered: {
      icon: "📦",
      color: "#059669",
      message: "Your order has been delivered",
    },
    cancelled: {
      icon: "��",
      color: "#ef4444",
      message: "Your order has been cancelled",
    },
    refunded: {
      icon: "💰",
      color: "#6366f1",
      message: "Your order has been refunded",
    },
  };

  const status =
    statusInfo[newStatus as keyof typeof statusInfo] || statusInfo.pending;

  return {
    subject: `Order Update: #${order.order_number} - ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Order Status Update</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">

          <!-- Header -->
          <div style="background: linear-gradient(135deg, #ec4899 0%, #f97316 100%); padding: 32px; text-align: center;">
            <h1 style="margin: 0; color: white; font-size: 28px; font-weight: bold;">🌸 Florist in India</h1>
            <p style="margin: 8px 0 0 0; color: white; opacity: 0.9;">Order Status Update</p>
          </div>

          <!-- Status Update -->
          <div style="padding: 32px;">
            <div style="text-align: center; margin-bottom: 32px;">
              <div style="width: 80px; height: 80px; background-color: ${status.color}; border-radius: 50%; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center;">
                <span style="color: white; font-size: 40px;">${status.icon}</span>
              </div>
              <h2 style="margin: 0; color: #1f2937; font-size: 24px;">${status.message}</h2>
              <p style="margin: 8px 0 0 0; color: #6b7280;">Order #${order.order_number}</p>
            </div>

            <!-- Status Timeline -->
            <div style="background-color: #f9fafb; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
              <h3 style="margin: 0 0 16px 0; color: #1f2937; font-size: 18px;">Status Changed</h3>
              <div style="display: flex; align-items: center; gap: 16px;">
                <div style="text-align: center;">
                  <div style="padding: 8px 16px; background-color: #e5e7eb; border-radius: 20px; color: #6b7280; font-size: 14px;">
                    ${oldStatus.charAt(0).toUpperCase() + oldStatus.slice(1)}
                  </div>
                </div>
                <div style="flex: 1; height: 2px; background-color: #e5e7eb; position: relative;">
                  <span style="position: absolute; top: -10px; left: 50%; transform: translateX(-50%); color: #6b7280;">→</span>
                </div>
                <div style="text-align: center;">
                  <div style="padding: 8px 16px; background-color: ${status.color}; border-radius: 20px; color: white; font-size: 14px; font-weight: 600;">
                    ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}
                  </div>
                </div>
              </div>
            </div>

            <!-- Order Summary -->
            <div style="background-color: #f3f4f6; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
              <h4 style="margin: 0 0 12px 0; color: #374151;">Order Summary</h4>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 14px;">
                <div>
                  <span style="color: #6b7280;">Order Date:</span>
                  <span style="color: #1f2937; font-weight: 600; float: right;">
                    ${new Date(order.created_at).toLocaleDateString("en-IN")}
                  </span>
                </div>
                <div>
                  <span style="color: #6b7280;">Total Amount:</span>
                  <span style="color: #1f2937; font-weight: 600; float: right;">₹${(order.total_amount || 0).toFixed(2)}</span>
                </div>
              </div>
            </div>

            <!-- Next Steps -->
            ${
              newStatus === "shipped"
                ? `
            <div style="background-color: #dbeafe; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
              <h4 style="margin: 0 0 8px 0; color: #1e40af;">📍 Tracking Information</h4>
              <p style="margin: 0; color: #1e40af;">
                Your order is on its way! Our delivery team will contact you soon with specific timing.
                ${order.tracking_number ? `Tracking ID: ${order.tracking_number}` : ""}
              </p>
            </div>
            `
                : ""
            }

            ${
              newStatus === "delivered"
                ? `
            <div style="background-color: #d1fae5; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
              <h4 style="margin: 0 0 8px 0; color: #065f46;">🎉 Thank You!</h4>
              <p style="margin: 0; color: #065f46;">
                We hope you loved your flowers! Please consider leaving us a review and don't hesitate to order again.
              </p>
            </div>
            `
                : ""
            }

            ${
              newStatus === "cancelled"
                ? `
            <div style="background-color: #fee2e2; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
              <h4 style="margin: 0 0 8px 0; color: #991b1b;">🔄 What's Next?</h4>
              <p style="margin: 0; color: #991b1b;">
                If you have any questions about this cancellation, please contact our support team.
                We're here to help and would love to assist you with a new order.
              </p>
            </div>
            `
                : ""
            }

            <!-- CTA Button -->
            <div style="text-align: center; margin-top: 32px;">
              <a href="${process.env.FRONTEND_URL || "https://floristinindia.com"}/order-confirmation/${order.order_number}"
                 style="display: inline-block; background: linear-gradient(135deg, #ec4899 0%, #f97316 100%); color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600;">
                View Order Details
              </a>
            </div>
          </div>

          <!-- Footer -->
          <div style="background-color: #f9fafb; padding: 24px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px;">
              Questions? Contact us at
              <a href="mailto:info@floristinindia.com" style="color: #ec4899;">info@floristinindia.com</a>
            </p>
            <p style="margin: 0; color: #9ca3af; font-size: 12px;">
              © 2024 Florist in India. All rights reserved.
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
  };
};

// Email sending functions
export const sendOrderConfirmationEmails = async (orderData: any) => {
  const transporter = createTransporter();
  const { customer, order } = orderData;

  try {
    // Try to fetch custom template from database
    let customerEmail: { subject: string; html: string } | null = null;
    const customTemplate = await fetchEmailTemplate("order_confirmation");

    if (customTemplate) {
      // Build template variables including billing, shipping, and product details
      const shippingAddr = order.shipping_address || {};
      const billingAddr = order.billing_address || {};

      // Generate products HTML table
      const productsHtml = (orderData.items || [])
        .map(
          (item: any) => `
          <tr>
            <td style="padding: 12px; border-bottom: 1px solid #eee;">
              <strong>${item.product_name}</strong>
              ${item.variant_name ? `<br><small style="color: #666;">Variant: ${item.variant_name}</small>` : ""}
            </td>
            <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
            <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">₹${(item.price || 0).toFixed(2)}</td>
            <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;"><strong>₹${(item.total_price || 0).toFixed(2)}</strong></td>
          </tr>
        `,
        )
        .join("");

      const templateVars = {
        // Order Details
        ORDER_NUMBER: order.order_number,
        ORDER_DATE: new Date(order.created_at).toLocaleDateString("en-IN"),
        CUSTOMER_NAME: customer.name,
        CUSTOMER_EMAIL: customer.email || "",
        CUSTOMER_PHONE: customer.phone || "",

        // Payment Details
        TOTAL_AMOUNT: (order.total_amount || 0).toFixed(2),
        SUBTOTAL: (
          (order.total_amount || 0) -
          (order.shipping_amount || 0) -
          (order.tax_amount || 0) +
          (order.discount_amount || 0)
        ).toFixed(2),
        SHIPPING_AMOUNT: (order.shipping_amount || 0).toFixed(2),
        TAX_AMOUNT: (order.tax_amount || 0).toFixed(2),
        DISCOUNT_AMOUNT: (order.discount_amount || 0).toFixed(2),
        PAYMENT_STATUS: order.payment_status || "pending",
        PAYMENT_METHOD: order.payment_method || "N/A",

        // Delivery Details
        DELIVERY_DATE: order.delivery_date
          ? new Date(order.delivery_date).toLocaleDateString("en-IN")
          : "",
        DELIVERY_SLOT: order.delivery_slot || "",

        // Shipping Address
        SHIPPING_NAME: order.receiver_name || customer.name,
        SHIPPING_ADDRESS_LINE1: shippingAddr.line1 || "",
        SHIPPING_ADDRESS_LINE2: shippingAddr.line2 || "",
        SHIPPING_CITY: shippingAddr.city || "",
        SHIPPING_STATE: shippingAddr.state || "",
        SHIPPING_PINCODE: shippingAddr.pincode || "",
        SHIPPING_PHONE: order.receiver_phone || customer.phone || "",
        SHIPPING_ADDRESS_FULL: `${shippingAddr.line1 || ""}${shippingAddr.line2 ? ", " + shippingAddr.line2 : ""}, ${shippingAddr.city || ""}, ${shippingAddr.state || ""} - ${shippingAddr.pincode || ""}`,

        // Billing Address
        BILLING_NAME: billingAddr.name || customer.name,
        BILLING_ADDRESS_LINE1: billingAddr.line1 || "",
        BILLING_ADDRESS_LINE2: billingAddr.line2 || "",
        BILLING_CITY: billingAddr.city || "",
        BILLING_STATE: billingAddr.state || "",
        BILLING_PINCODE: billingAddr.pincode || "",
        BILLING_PHONE: billingAddr.phone || customer.phone || "",
        BILLING_ADDRESS_FULL: `${billingAddr.line1 || ""}${billingAddr.line2 ? ", " + billingAddr.line2 : ""}, ${billingAddr.city || ""}, ${billingAddr.state || ""} - ${billingAddr.pincode || ""}`,

        // Products (HTML table)
        PRODUCTS_HTML: productsHtml
          ? `<table style="width: 100%; border-collapse: collapse; border: 1px solid #e5e7eb;"><thead><tr style="background-color: #f9fafb;"><th style="padding: 12px; text-align: left; border-bottom: 1px solid #e5e7eb;">Product</th><th style="padding: 12px; text-align: center; border-bottom: 1px solid #e5e7eb;">Qty</th><th style="padding: 12px; text-align: right; border-bottom: 1px solid #e5e7eb;">Price</th><th style="padding: 12px; text-align: right; border-bottom: 1px solid #e5e7eb;">Total</th></tr></thead><tbody>${productsHtml}</tbody></table>`
          : "",

        // Special Instructions
        SPECIAL_INSTRUCTIONS: order.special_instructions || "",
      };

      const processedBody = processTemplateVariables(
        customTemplate.body,
        templateVars,
      );
      const processedSubject = processTemplateVariables(
        customTemplate.subject,
        templateVars,
      );

      customerEmail = {
        subject: processedSubject,
        html: processedBody,
      };
      console.log("✅ Using custom order confirmation template from database");
    } else {
      // Fall back to hardcoded template
      customerEmail = generateOrderConfirmationEmail(orderData);
      console.log(
        "⚠️ Using default order confirmation template (no custom template found)",
      );
    }

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: customer.email,
      subject: customerEmail.subject,
      html: customerEmail.html,
    });

    console.log(
      `✅ Order confirmation email sent to customer: ${customer.email}`,
    );

    // Send notification email to admin (admin always gets the default template)
    const adminEmail = generateAdminOrderNotification(orderData);
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: process.env.ADMIN_EMAIL,
      subject: adminEmail.subject,
      html: adminEmail.html,
    });

    console.log(
      `✅ Order notification email sent to admin: ${process.env.ADMIN_EMAIL}`,
    );
  } catch (error) {
    console.error("❌ Error sending order confirmation emails:", error);
    throw error;
  }
};

export const sendOrderStatusUpdateEmail = async (
  orderData: any,
  oldStatus: string,
  newStatus: string,
) => {
  const transporter = createTransporter();
  const { customer, order } = orderData;

  try {
    // Try to fetch custom template from database for this status
    let statusEmail = null;
    const customTemplate = await fetchEmailTemplate("status_update", newStatus);

    if (customTemplate) {
      // Build template variables
      const templateVars = {
        ORDER_NUMBER: order.order_number,
        CUSTOMER_NAME: customer.name,
        TOTAL_AMOUNT: (order.total_amount || 0).toFixed(2),
        ORDER_DATE: new Date(order.created_at).toLocaleDateString("en-IN"),
        OLD_STATUS: oldStatus,
        NEW_STATUS: newStatus,
        DELIVERY_DATE: order.delivery_date
          ? new Date(order.delivery_date).toLocaleDateString("en-IN")
          : "",
        DELIVERY_SLOT: order.delivery_slot || "",
      };

      const processedBody = processTemplateVariables(
        customTemplate.body,
        templateVars,
      );
      const processedSubject = processTemplateVariables(
        customTemplate.subject,
        templateVars,
      );

      statusEmail = {
        subject: processedSubject,
        html: processedBody,
      };
      console.log(
        `��� Using custom status update template for "${newStatus}" from database`,
      );
    } else {
      // Fall back to hardcoded template
      statusEmail = generateOrderStatusUpdateEmail(
        orderData,
        oldStatus,
        newStatus,
      );
      console.log(
        `⚠️ Using default status update template for "${newStatus}" (no custom template found)`,
      );
    }

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: customer.email,
      subject: statusEmail.subject,
      html: statusEmail.html,
    });

    console.log(
      `✅ Order status update email sent to customer: ${customer.email} (${oldStatus} → ${newStatus})`,
    );
  } catch (error) {
    console.error("❌ Error sending order status update email:", error);
    throw error;
  }
};
