# Email Template Customization Feature

## Overview

This feature allows non-technical admins to customize the HTML emails sent to customers through an intuitive admin panel. No coding knowledge required!

## What You Can Customize

### 1. **Order Confirmation Email**
- Sent when customer completes payment
- Customize the subject line and email body
- Use template variables like `{ORDER_NUMBER}`, `{CUSTOMER_NAME}`, `{TOTAL_AMOUNT}`, etc.

### 2. **Status Update Emails** (Per Status)
- **Confirmed**: Sent when order status changes to "confirmed"
- **Processing**: Sent when order status changes to "processing"
- **Shipped**: Sent when order status changes to "shipped"
- **Delivered**: Sent when order status changes to "delivered"
- **Cancelled**: Sent when order status changes to "cancelled"
- **Refunded**: Sent when order status changes to "refunded"

Each status has its own customizable template with status-specific available variables.

## How to Access

1. Go to **Admin Panel** → **Email Templates**
2. Select the template type you want to edit:
   - **Order Confirmation** tab
   - **Status Updates** tab

## How to Customize

### Simple Steps:

1. Click **Edit** on any template
2. Update the **Email Subject** line
3. Update the **Email Body** (HTML content)
4. Use **template variables** to insert dynamic content
5. Click **Preview** to see how it looks
6. Click **Save Template** to apply changes

### Template Variables

Available variables are listed on the right side of the editor. Click any variable to insert it into your template.

**Order Confirmation Variables:**
- `{ORDER_NUMBER}` - The order number
- `{CUSTOMER_NAME}` - Customer's name
- `{TOTAL_AMOUNT}` - Total order amount
- `{ORDER_DATE}` - Date order was placed
- `{PAYMENT_STATUS}` - Payment status (paid, pending, etc.)
- `{DELIVERY_DATE}` - Delivery date if scheduled
- `{DELIVERY_SLOT}` - Delivery time slot if specified

**Status Update Variables:**
- `{ORDER_NUMBER}` - The order number
- `{CUSTOMER_NAME}` - Customer's name
- `{TOTAL_AMOUNT}` - Total order amount
- `{ORDER_DATE}` - Date order was placed
- `{OLD_STATUS}` - Previous status
- `{NEW_STATUS}` - New status
- `{DELIVERY_DATE}` - Delivery date if scheduled
- `{DELIVERY_SLOT}` - Delivery time slot if specified

## Example Templates

### Example 1: Simple Order Confirmation

**Subject:**
```
Thank you for your order #{ORDER_NUMBER}!
```

**Body:**
```html
<h2>Order Confirmed!</h2>
<p>Hi {CUSTOMER_NAME},</p>
<p>Thank you for your order #{ORDER_NUMBER}. We have received your payment of ₹{TOTAL_AMOUNT}.</p>
<p>Your order will be delivered on {DELIVERY_DATE}.</p>
<p>Thank you for shopping with us!</p>
```

### Example 2: Shipment Status Update

**Subject:**
```
Your order #{ORDER_NUMBER} is on the way!
```

**Body:**
```html
<h2>Your Order is Shipped!</h2>
<p>Hi {CUSTOMER_NAME},</p>
<p>Great news! Your order #{ORDER_NUMBER} has been shipped.</p>
<p>Expected delivery: {DELIVERY_DATE}</p>
<p>We'll keep you updated!</p>
```

## Technical Details

### Database Schema

```sql
CREATE TABLE email_templates (
  id uuid PRIMARY KEY,
  template_type VARCHAR(50), -- 'order_confirmation' or 'status_update'
  order_status VARCHAR(50), -- specific status for status_update templates
  subject TEXT,
  body TEXT, -- HTML content with {VARIABLE} placeholders
  sections JSONB, -- which sections to include
  template_variables JSONB, -- available variables
  is_active BOOLEAN,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  created_by uuid
);
```

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/email-templates` | List all templates |
| GET | `/api/email-templates/:type/:status?` | Get specific template |
| POST | `/api/email-templates` | Create new template |
| PUT | `/api/email-templates/:id` | Update template |
| DELETE | `/api/email-templates/:id` | Delete template |

### How It Works Behind the Scenes

1. When a customer completes payment:
   - System checks if custom template exists for "order_confirmation"
   - If found, uses custom template and replaces variables
   - If not found, uses default hardcoded template

2. When admin changes order status:
   - System checks if custom template exists for "status_update" with specific status
   - If found, uses custom template and replaces variables
   - If not found, uses default hardcoded template

## Fallback Behavior

If no custom template is found, the system automatically falls back to the default templates built into the application. This ensures emails always get sent, even if templates are deleted.

## Security & Permissions

- Only admins can access the Email Templates page
- Only admins can create, edit, or delete templates
- All changes are logged with timestamp and admin user info
- HTML content is preserved as-is (admin must ensure valid HTML)

## Best Practices

1. **Always Preview**: Click the Preview button to see how emails will look
2. **Test Variables**: Make sure variables are correctly spelled with curly braces: `{VARIABLE_NAME}`
3. **Keep it Professional**: Use brand colors and professional formatting
4. **Include Contact Info**: Add support email/phone in footer
5. **Mobile Friendly**: Test how emails look on mobile devices
6. **Keep Backups**: Note down your custom templates before major changes

## Troubleshooting

### Email Not Sending
- Check if email credentials are configured in `server/.env`
- Check server logs for error messages
- Verify admin email address is correct

### Variables Not Replacing
- Make sure variable names are exact (case-sensitive)
- Use curly braces: `{VARIABLE_NAME}` not `[VARIABLE_NAME]`
- Check available variables for your template type

### HTML Not Rendering
- Paste HTML only (no plain text)
- Ensure all tags are properly closed
- Test in email client for compatibility
- Avoid CSS imports; use inline styles

## Files Modified/Created

### Backend
- `server/routes/email-templates.ts` - API endpoints for template management
- `server/lib/email-service.ts` - Updated to fetch and use database templates
- `email-templates-migration.sql` - Database schema migration

### Frontend
- `client/pages/admin/EmailTemplates.tsx` - Admin UI for template editing
- `client/types/database.types.ts` - TypeScript types for email templates
- `client/components/admin/AdminLayout.tsx` - Added navigation link
- `client/App.tsx` - Added route for email templates page
- `client/lib/email-api.ts` - Client-side API calls (existing)

## Migration

To enable this feature:

1. **Create the database table:**
   ```bash
   # Execute the SQL from email-templates-migration.sql in your Supabase SQL editor
   ```

2. **Restart the dev server:**
   ```bash
   npm run dev
   ```

3. **Access the feature:**
   - Go to Admin Panel → Email Templates
   - Default templates will be automatically created

## Future Enhancements

Potential improvements:
- Email preview sending to test address
- Template versioning and history
- Template categories and tags
- Conditional sections (show/hide based on conditions)
- Email open/click tracking
- A/B testing different templates
- Template marketplace/sharing
- Scheduling template sends
