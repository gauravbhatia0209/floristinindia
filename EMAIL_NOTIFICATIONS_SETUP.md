# Email Notifications Setup

## Overview
This document describes the email notification system that sends alerts to both customers and admins whenever:
1. A new order is received
2. An order status changes

## Configuration

### Email Provider Setup (Gmail SMTP)
The email system uses Gmail SMTP with app-specific passwords. Configuration is stored in `server/.env`:

```
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=order.floristinindia@gmail.com
EMAIL_PASS=mkdy xdyv nigz icnu
EMAIL_FROM=order.floristinindia@gmail.com
ADMIN_EMAIL=admin@floristinindia.com
FRONTEND_URL=https://www.floristinindia.com
```

To change these credentials:
1. Update the values in `server/.env`
2. Restart the dev server: the changes will be picked up automatically

## Email Notifications Flow

### 1. New Order Created
**Trigger**: Customer completes order form and proceeds to payment

**What happens**:
- Order is created with status "pending" and payment_status "pending"
- **Admin receives notification** (Order Created Email) immediately
- Email includes order summary, customer info, delivery address, and action link to admin panel

**Recipients**: Admin only
**Template**: Custom order-created notification

### 2. Payment Successful
**Trigger**: Customer completes payment and payment gateway confirms success

**What happens**:
- Order status is updated from "pending" to "confirmed"
- Order confirmation emails are sent to:
  - **Customer**: Detailed order confirmation with all order details
  - **Admin**: Order received notification with order summary

**Recipients**: Customer + Admin
**Templates**: 
- Customer: `generateOrderConfirmationEmail()` - Includes order summary, delivery info, next steps
- Admin: `generateAdminOrderNotification()` - Includes quick stats, customer info, action required notice

### 3. Order Status Updated
**Trigger**: Admin updates order status in the admin panel (Orders page)

**What happens**:
- Order status changes (e.g., pending → confirmed, processing → shipped, etc.)
- Status update email sent to customer with:
  - Status change visual representation
  - Relevant information for the new status
  - Next steps or tracking information

**Recipients**: Customer only
**Template**: `generateOrderStatusUpdateEmail()` - Status-specific messages and icons

## Implementation Details

### Files Modified/Created

#### Server-side
1. **server/routes/email.ts**
   - `/api/email/order-confirmation` - Sends customer + admin confirmation emails
   - `/api/email/order-status-update` - Sends customer status update emails
   - `/api/email/order-created` - NEW: Sends admin notification for new orders
   - `/api/email/test` - Test email endpoint for development

2. **server/lib/email-service.ts** (existing)
   - `sendOrderConfirmationEmails()` - Sends both customer and admin emails
   - `sendOrderStatusUpdateEmail()` - Sends customer status update email
   - Email templates for all notification types

#### Client-side
1. **client/lib/email-api.ts**
   - `sendOrderConfirmation()` - Call after payment success
   - `sendOrderStatusUpdate()` - Call when admin updates order status
   - `sendOrderCreatedNotification()` - NEW: Call when order is created

2. **client/pages/Checkout.tsx**
   - Modified `createOrderBeforePayment()` to send admin notification
   - Admin gets notified immediately when order is created

3. **client/pages/CheckoutSuccess.tsx** (existing)
   - Sends order confirmation emails after payment update
   - Clears on-screen notifications after email is sent

4. **client/pages/admin/Orders.tsx** (existing)
   - Sends status update emails when admin changes order status
   - Integrated in `updateOrderStatus()` function

### Email Notification Types

#### 1. Order Created Notification (Admin Only)
- **Sent to**: Admin email address
- **When**: Immediately after new order is created
- **Contains**: 
  - Order number and total amount
  - Quick stats (total, items count, payment status)
  - Customer information
  - Delivery details
  - Order items table
  - Special instructions if any
  - Payment status indicator
  - Action required notice
  - Direct link to admin panel

#### 2. Order Confirmation Email (Customer)
- **Sent to**: Customer email
- **When**: After successful payment
- **Contains**:
  - Order number and date
  - Order details (total, payment status)
  - Order items with variant information
  - Delivery information and time slot
  - Delivery address
  - Special instructions if any
  - What happens next
  - Contact information

#### 3. Admin Order Notification (Admin)
- **Sent to**: Admin email
- **When**: After successful payment
- **Contains**: Same detailed information as customer confirmation but formatted for admin

#### 4. Order Status Update Email (Customer)
- **Sent to**: Customer email
- **When**: Admin updates order status
- **Contains**:
  - Status change visualization
  - Order summary
  - Status-specific messages:
    - **Shipped**: Tracking information and delivery timeline
    - **Delivered**: Thank you message and review request
    - **Cancelled**: Information about cancellation reason
  - Link to order details page

## Testing

### Manual Testing
1. Complete an order in the checkout flow
2. Check that admin receives notification email
3. Complete payment
4. Check that customer receives order confirmation email
5. In admin panel, change order status
6. Check that customer receives status update email

### Test Email Endpoint
For development, you can test the email system using:
```bash
POST /api/email/test
{
  "to": "test@example.com",
  "subject": "Test Subject",
  "message": "Test message content"
}
```

### Troubleshooting

**Emails not sending**:
1. Verify email credentials in `server/.env`
2. Check that Gmail app password is correct (not regular password)
3. Enable "Less secure app access" if using plain Gmail password
4. Check server logs for detailed error messages

**Emails going to spam**:
1. Add email domain to SPF/DKIM records
2. Use branded email address in EMAIL_FROM
3. Ensure email template includes proper branding

**Missing environment variables**:
- If EMAIL_USER or EMAIL_PASS is missing, email sending will fail
- Error: "Email credentials not configured"
- Add the missing variables to `server/.env` and restart server

## Email Template Customization

To modify email templates, edit the functions in `server/lib/email-service.ts`:
- `generateOrderConfirmationEmail()`
- `generateAdminOrderNotification()`
- `generateOrderStatusUpdateEmail()`

Each function returns an object with:
- `subject`: Email subject line
- `html`: HTML email body

## Status Transitions and Emails

Order status flow with email notifications:

```
1. New Order Created (pending, payment_status: pending)
   ↓
   → Admin receives order notification

2. Payment Successful
   ↓
   → Order status changes to "confirmed"
   → Customer receives order confirmation
   → Admin receives confirmation notification

3. Admin Updates Status
   ↓
   pending → confirmed (already sent)
   confirmed → processing → shipped → delivered/cancelled
   ↓
   → Customer receives status update email for each change
```

## Email Statistics

Based on the current configuration:
- **Confirmation emails**: 1 per order (sent after payment)
- **Admin notifications**: Up to 2 per order (1 on creation, 1 on payment)
- **Status update emails**: 1 per status change
- **Average emails per order**: 3-5 depending on status changes

## Future Enhancements

Potential improvements for email notification system:
1. Email templates customization in admin panel
2. Scheduled delivery for status update emails
3. Email delivery retry logic
4. SMS notifications for important status changes
5. Email unsubscribe management
6. Bulk email sending for promotional messages
7. Email open/click tracking
8. Personalized email recommendations based on purchase history
