# Payment Gateway Checkout Administration Guide

## Overview

As an admin, you now have granular control over which payment methods customers see during checkout, separate from the technical gateway configuration.

## Two-Level Payment Control

### 1. System Level (Enabled/Disabled)

- **Purpose:** Controls whether the payment gateway is technically functional
- **When Enabled:** Gateway can process payments if configured properly
- **When Disabled:** Gateway cannot process any payments

### 2. Checkout Level (Show/Hide at Checkout)

- **Purpose:** Controls customer visibility during checkout
- **When Shown:** Customers see this as a payment option
- **When Hidden:** Payment method is not available for customer selection

## Use Cases

### ✅ Common Scenarios

**Temporary Maintenance:**

- Keep gateway enabled but hide from checkout during maintenance
- Quickly restore without reconfiguring credentials

**Soft Launch:**

- Enable and configure new payment method
- Hide from checkout until ready for customers
- Test internally before public availability

**Order Amount Restrictions:**

- Show premium payment methods only for high-value orders
- Hide expensive processing methods for small orders

**Seasonal Control:**

- Hide international payment methods during domestic-only promotions
- Show specific methods during festival sales

## Admin Interface

### Accessing Payment Controls

1. **Navigate:** Admin Panel → Settings → Payments
2. **Configure:** Click "Configure" on any payment gateway
3. **Checkout Tab:** Contains all customer-facing controls

### Checkout Configuration Options

#### Basic Controls

- **Show at Checkout:** Toggle customer visibility
- **Display Name:** Custom name shown to customers
- **Customer Description:** Explanation text at checkout
- **Checkout Priority:** Display order (1 = first, 2 = second, etc.)

#### Advanced Controls

- **Minimum Order Amount:** Hide method below this order value
- **Maximum Order Amount:** Hide method above this order value
- **Processing Message:** Text shown during payment processing

### Visual Indicators

**Gateway Cards Show:**

- **"Enabled/Disabled"** - System functionality status
- **"At Checkout/Hidden"** - Customer visibility status

## Best Practices

### 🎯 Recommended Setup

**High Priority (Show First):**

1. **PhonePe** - Most popular in India
2. **Razorpay** - Comprehensive backup

**Lower Priority:** 3. **Cashfree** - Business customers 4. **PayPal** - International orders

### 📋 Configuration Checklist

**Before Enabling at Checkout:**

- [ ] Gateway credentials configured
- [ ] Test payment completed successfully
- [ ] Processing fees reviewed
- [ ] Amount limits set appropriately
- [ ] Customer description written clearly

**Regular Maintenance:**

- [ ] Check payment success rates weekly
- [ ] Review customer feedback on payment experience
- [ ] Update processing messages for clarity
- [ ] Adjust priority based on usage analytics

### ⚠️ Important Notes

**Order of Operations:**

1. First, enable and configure the gateway system
2. Then, make it available at checkout
3. Monitor and adjust based on usage

**Customer Impact:**

- Changes take effect immediately
- Customers won't see hidden methods
- Processing messages appear during payment
- Clear descriptions improve conversion

## Troubleshooting

### Gateway Enabled But Not Showing at Checkout

✅ **Check:** "Show at Checkout" toggle is enabled
✅ **Check:** Order amount meets min/max requirements
✅ **Check:** Checkout priority is set

### Customers Confused by Payment Options

✅ **Improve:** Customer descriptions
✅ **Optimize:** Display names for clarity
✅ **Reorder:** Priority to show best options first

### Payment Method Not Processing

✅ **Verify:** Gateway system is enabled
✅ **Check:** Credentials are correct
✅ **Test:** Sandbox payments first

## Database Changes

If you're setting this up fresh, run this SQL after the main payment schema:

```sql
-- Already included in database-payment-checkout-update.sql
-- Run this file in your Supabase SQL editor after the main schema
```

## Customer Experience

**What Customers See:**

- Only payment methods marked "Available at Checkout"
- Custom display names and descriptions
- Methods ordered by checkout priority
- Amount-appropriate options only

**What Customers Don't See:**

- Admin configuration details
- Disabled payment methods
- Hidden payment methods
- Technical gateway names

This gives you complete control over the payment experience while maintaining technical flexibility behind the scenes.
