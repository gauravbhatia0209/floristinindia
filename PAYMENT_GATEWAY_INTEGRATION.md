# Payment Gateway Integration

This document describes the comprehensive payment gateway integration that supports multiple payment providers for the florist e-commerce platform.

## Supported Payment Gateways

### 1. PhonePe ⭐ (Recommended)

- **Best for:** Indian customers, UPI payments
- **Supported Methods:** UPI, Cards, Wallets, NetBanking
- **Processing Fee:** ~1.8%
- **Processing Time:** Instant
- **Features:** Webhooks, Refunds, QR codes

### 2. Razorpay

- **Best for:** Comprehensive Indian payment solution
- **Supported Methods:** Cards, UPI, Wallets, NetBanking
- **Processing Fee:** ~2.0%
- **Processing Time:** Instant
- **Features:** Webhooks, Refunds, Recurring payments

### 3. Cashfree

- **Best for:** Business-focused payment solutions
- **Supported Methods:** All major payment methods
- **Processing Fee:** ~1.75%
- **Processing Time:** Instant
- **Features:** Webhooks, Refunds

### 4. PayPal

- **Best for:** International customers
- **Supported Methods:** PayPal account, Cards
- **Processing Fee:** ~3.5%
- **Processing Time:** 1-2 business days
- **Features:** Webhooks, Refunds, International

## Architecture

### Database Schema

```sql
-- Payment gateway configurations
payment_gateway_configs (
  id VARCHAR(20) PRIMARY KEY,
  name VARCHAR(100),
  enabled BOOLEAN,
  sandbox BOOLEAN,
  priority INTEGER,
  min_amount INTEGER,
  max_amount INTEGER,
  processing_fee DECIMAL(5,2),
  fixed_fee INTEGER,
  supported_currencies TEXT[],
  config JSONB
)

-- Payment intents (tracks payment lifecycle)
payment_intents (
  id UUID PRIMARY KEY,
  gateway VARCHAR(20),
  order_id UUID,
  amount INTEGER,
  currency VARCHAR(3),
  status VARCHAR(20),
  gateway_payment_id VARCHAR(255),
  gateway_order_id VARCHAR(255),
  gateway_signature VARCHAR(512),
  payment_method VARCHAR(100),
  error_message TEXT,
  refund_amount INTEGER,
  webhook_verified BOOLEAN,
  metadata JSONB
)

-- Payment webhooks log
payment_webhooks (
  id UUID PRIMARY KEY,
  payment_intent_id UUID,
  gateway VARCHAR(20),
  event_type VARCHAR(100),
  status VARCHAR(20),
  signature VARCHAR(512),
  verified BOOLEAN,
  raw_payload JSONB,
  processed BOOLEAN
)

-- Payment refunds
payment_refunds (
  id UUID PRIMARY KEY,
  payment_intent_id UUID,
  refund_id VARCHAR(255),
  gateway_refund_id VARCHAR(255),
  amount INTEGER,
  reason TEXT,
  status VARCHAR(20),
  gateway_response JSONB
)

-- Payment analytics
payment_analytics (
  id UUID PRIMARY KEY,
  date DATE,
  gateway VARCHAR(20),
  payment_method VARCHAR(100),
  total_transactions INTEGER,
  successful_transactions INTEGER,
  failed_transactions INTEGER,
  total_amount INTEGER,
  successful_amount INTEGER,
  refund_count INTEGER,
  refund_amount INTEGER
)
```

### Backend Services

#### 1. Payment Gateway Factory (`server/lib/payment-gateways.ts`)

- Abstract base class for payment gateways
- Specific implementations for each gateway
- Handles payment creation, webhook verification, refunds
- Automatic status mapping between gateways

#### 2. Payment Routes (`server/routes/payments.ts`)

- **GET /api/payments/methods** - Get available payment methods
- **POST /api/payments/create** - Create payment intent
- **GET /api/payments/status/:id** - Check payment status
- **POST /api/payments/webhook** - Handle gateway webhooks
- **POST /api/payments/refund** - Process refunds
- **GET /api/payments/admin/intents** - Admin: View payment intents

#### 3. Webhook Handling

- Automatic signature verification
- Status updates to orders
- Payment intent tracking
- Error logging and debugging

### Frontend Components

#### 1. Payment Method Selector (`client/components/PaymentMethodSelector.tsx`)

- Dynamic loading of available payment methods
- Amount validation and fee calculation
- Method availability based on order amount
- User-friendly selection interface

#### 2. Payment Processor (`client/components/PaymentProcessor.tsx`)

- Real-time payment status tracking
- Automatic status polling
- QR code display for UPI payments
- Error handling and retry functionality

#### 3. Admin Configuration (`client/components/admin/PaymentGatewayConfig.tsx`)

- Gateway enable/disable controls
- Credential management with visibility toggles
- Fee and limit configuration
- Sandbox/production mode switching

### Checkout Flow

1. **Order Creation**

   - Customer fills out checkout form
   - Order is created with "pending" payment status
   - Moves to payment method selection

2. **Payment Method Selection**

   - Available methods loaded based on order amount
   - Processing fees calculated and displayed
   - Customer selects preferred method

3. **Payment Intent Creation**

   - Payment intent created in database
   - Gateway-specific payment created
   - Customer redirected to gateway (if needed)

4. **Payment Processing**

   - Real-time status monitoring
   - Webhook updates from gateway
   - Order status updated automatically

5. **Completion**
   - Success/failure handling
   - Analytics tracking
   - Order confirmation

## Configuration

### Environment Variables

```bash
# Supabase (required)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# PayPal
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret

# Razorpay
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Cashfree
CASHFREE_APP_ID=your_cashfree_app_id
CASHFREE_SECRET_KEY=your_cashfree_secret_key

# PhonePe
PHONEPE_MERCHANT_ID=your_phonepe_merchant_id
PHONEPE_SALT_KEY=your_phonepe_salt_key
PHONEPE_SALT_INDEX=1
```

### Admin Configuration

1. Navigate to Admin Panel > Payment Gateways
2. Enable desired payment methods
3. Configure credentials for each gateway
4. Set processing fees and limits
5. Choose sandbox/production mode

## Security Features

### 1. Webhook Verification

- Signature verification for all webhooks
- Protection against replay attacks
- Secure payload validation

### 2. Credential Management

- Encrypted storage in database
- Environment variable fallbacks
- Secure admin interface with hidden credentials

### 3. Payment Validation

- Amount limits enforcement
- Currency validation
- Order verification before payment

### 4. Error Handling

- Comprehensive error logging
- User-friendly error messages
- Automatic retry mechanisms

## Testing

### Sandbox Mode

All gateways support sandbox mode for testing:

1. **PayPal Sandbox**

   - Use PayPal developer sandbox accounts
   - Test card numbers provided by PayPal

2. **Razorpay Test Mode**

   - Test card: 4111 1111 1111 1111
   - CVV: Any 3 digits
   - Expiry: Any future date

3. **Cashfree Sandbox**

   - Use Cashfree test credentials
   - Test payment methods provided

4. **PhonePe Sandbox**
   - Use PhonePe UAT environment
   - Test UPI IDs and payment flows

### Test Scenarios

- Successful payments
- Failed payments
- Cancelled payments
- Refund processing
- Webhook delivery
- Amount validation

## Monitoring and Analytics

### Payment Analytics Dashboard

- Transaction success rates by gateway
- Processing fee analysis
- Popular payment methods
- Revenue tracking
- Refund monitoring

### Webhook Monitoring

- Webhook delivery status
- Failed webhook alerts
- Signature verification logs
- Processing errors

## Troubleshooting

### Common Issues

1. **Payment Creation Fails**

   - Check gateway credentials
   - Verify amount limits
   - Check network connectivity

2. **Webhooks Not Received**

   - Verify webhook URLs
   - Check firewall settings
   - Review signature verification

3. **Refunds Fail**
   - Check refund eligibility
   - Verify gateway permissions
   - Review refund policies

### Debugging Tools

- Payment intent logs in admin panel
- Webhook payload inspection
- Gateway-specific error codes
- Test payment endpoint: `/api/test-upload`

## Deployment Checklist

### Before Going Live

- [ ] All gateway credentials configured
- [ ] Webhook URLs pointing to production
- [ ] Sandbox mode disabled for production
- [ ] SSL certificate installed
- [ ] Payment flow tested end-to-end
- [ ] Refund process tested
- [ ] Error handling verified
- [ ] Analytics configured
- [ ] Backup payment method available

### Production Monitoring

- [ ] Payment success rate alerts
- [ ] Failed payment notifications
- [ ] Webhook delivery monitoring
- [ ] Refund request alerts
- [ ] Gateway uptime monitoring

## Support and Maintenance

### Gateway Support Contacts

- **PhonePe:** PhonePe Merchant Support
- **Razorpay:** Razorpay Support Portal
- **Cashfree:** Cashfree Customer Support
- **PayPal:** PayPal Developer Support

### Regular Maintenance

- Monthly payment analytics review
- Quarterly fee optimization
- Gateway performance monitoring
- Security updates and patches
- Customer payment experience surveys

## API Reference

### Payment Creation

```javascript
POST /api/payments/create
{
  "gateway_id": "razorpay",
  "order_id": "uuid",
  "amount": 150000, // Amount in paise
  "currency": "INR",
  "customer": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+91xxxxxxxxxx"
  },
  "return_url": "https://yoursite.com/success",
  "cancel_url": "https://yoursite.com/cancel"
}
```

### Payment Status Check

```javascript
GET / api / payments / status / { payment_intent_id };
```

### Refund Request

```javascript
POST /api/payments/refund
{
  "payment_intent_id": "uuid",
  "amount": 50000, // Optional, full refund if not specified
  "reason": "Customer request"
}
```

This integration provides a robust, secure, and scalable payment processing system that can handle the complete payment lifecycle for the florist e-commerce platform.
