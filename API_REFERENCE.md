# API Reference Documentation

## Base URLs
- **Development**: `http://localhost:3000/api`
- **Production**: `https://your-backend-url.fly.dev/api`

## Authentication

All admin endpoints require authentication. Include the session token in requests:

```javascript
// Session token stored in localStorage
const sessionToken = localStorage.getItem('session_token');

// Include in headers (if implementing header-based auth)
headers: {
  'Authorization': `Bearer ${sessionToken}`
}
```

## Response Format

All API responses follow this format:

```typescript
// Success Response
{
  success: true,
  data: any,
  message?: string
}

// Error Response
{
  success: false,
  error: string,
  details?: any
}
```

---

## Email Endpoints

### Send Order Confirmation
**POST** `/api/email/order-confirmation`

Send confirmation emails to customer and admin when order is created.

**Request Body:**
```json
{
  "orderNumber": "FII83255"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Order confirmation emails sent successfully"
}
```

**Error Responses:**
- `400`: Order number required
- `404`: Order not found
- `500`: Email service error

---

### Send Order Status Update
**POST** `/api/email/order-status-update`

Send email notification when order status changes.

**Request Body:**
```json
{
  "orderNumber": "FII83255",
  "oldStatus": "pending",
  "newStatus": "confirmed"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Order status update email sent successfully"
}
```

**Email Statuses:**
- `pending`: Order placed, awaiting confirmation
- `confirmed`: Order confirmed by admin
- `processing`: Order being prepared
- `shipped`: Order dispatched for delivery
- `delivered`: Order successfully delivered
- `cancelled`: Order cancelled
- `refunded`: Order refunded

---

### Send Test Email
**POST** `/api/email/test`

Send test email for development/testing purposes.

**Request Body:**
```json
{
  "to": "recipient@example.com",
  "subject": "Test Email Subject",
  "message": "Test email message content"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Test email sent successfully"
}
```

---

## Payment Endpoints

### Check Payment Methods
**GET** `/api/payments/methods`

Get available payment methods and their configuration.

**Response:**
```json
{
  "success": true,
  "data": {
    "razorpay": {
      "enabled": true,
      "key_id": "rzp_test_...",
      "currency": "INR"
    },
    "paypal": {
      "enabled": false
    }
  }
}
```

---

### Create Payment
**POST** `/api/payments/create`

Create payment intent for order.

**Request Body:**
```json
{
  "amount": 2500,
  "currency": "INR",
  "customer": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210"
  },
  "orderNumber": "FII83255"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "order_id": "order_razorpay_id",
    "amount": 2500,
    "currency": "INR",
    "key": "rzp_test_key"
  }
}
```

---

### Check Payment Status
**GET** `/api/payments/status/:payment_intent_id`

Check status of payment intent.

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "succeeded",
    "amount": 2500,
    "payment_method": "card",
    "created": "2024-01-15T10:30:00Z"
  }
}
```

---

## Upload Endpoints

### Upload Single Image
**POST** `/api/upload/image`

Upload a single image file.

**Request:** FormData with file
```javascript
const formData = new FormData();
formData.append('image', file);
```

**Response:**
```json
{
  "success": true,
  "data": {
    "url": "https://storage-url/path/to/image.jpg",
    "filename": "unique-filename.jpg",
    "originalName": "original-filename.jpg",
    "size": 245760,
    "mimetype": "image/jpeg"
  }
}
```

---

### Upload Multiple Images
**POST** `/api/upload/images`

Upload multiple image files.

**Request:** FormData with multiple files
```javascript
const formData = new FormData();
files.forEach(file => {
  formData.append('images', file);
});
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "url": "https://storage-url/path/to/image1.jpg",
      "filename": "unique-filename1.jpg"
    },
    {
      "url": "https://storage-url/path/to/image2.jpg", 
      "filename": "unique-filename2.jpg"
    }
  ]
}
```

**File Restrictions:**
- **Max Size**: 5MB per file
- **Allowed Types**: jpg, jpeg, png, webp
- **Max Files**: 10 files per request

---

## Health Check

### Server Health
**GET** `/api/health`

Check server health and status.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00Z",
  "service": "florist-backend",
  "uptime": 3600,
  "database": "connected",
  "email": "configured"
}
```

---

### Ping
**GET** `/api/ping`

Simple ping endpoint for monitoring.

**Response:**
```json
{
  "message": "Hello from Express server v2!",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

---

## Admin Update Notifications

### Cache Invalidation
**POST** `/api/admin/cache-invalidate`

Invalidate AI cache when admin makes changes.

**Request Body:**
```json
{
  "type": "products",
  "action": "update",
  "id": "product-id"
}
```

**Types:**
- `products`: Product data changes
- `categories`: Category updates
- `homepage`: Homepage content changes
- `settings`: Site settings updates

---

## AI Data Endpoints

### Get Products Data
**GET** `/api/ai/products`

Get formatted product data for AI processing.

**Response:**
```json
{
  "success": true,
  "data": {
    "products": [...],
    "categories": [...],
    "lastUpdated": "2024-01-15T10:30:00Z"
  }
}
```

---

### Get Site Structure
**GET** `/api/ai/site-structure`

Get site navigation and structure data.

**Response:**
```json
{
  "success": true,
  "data": {
    "navigation": [...],
    "pages": [...],
    "categories": [...]
  }
}
```

---

## Sitemap Generation

### Generate Sitemap
**GET** `/sitemap.xml`

Generate XML sitemap for SEO.

**Response:** XML format
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://floristinindia.com/</loc>
    <lastmod>2024-01-15T10:30:00Z</lastmod>
    <priority>1.0</priority>
  </url>
  <!-- More URLs -->
</urlset>
```

---

## Error Handling

### Common Error Codes

| Code | Description | Common Causes |
|------|-------------|---------------|
| 400 | Bad Request | Missing required fields, invalid data format |
| 401 | Unauthorized | Invalid or expired session token |
| 403 | Forbidden | Insufficient permissions for operation |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Duplicate data, constraint violations |
| 429 | Too Many Requests | Rate limiting triggered |
| 500 | Internal Server Error | Database connection, service unavailable |

### Error Response Example
```json
{
  "success": false,
  "error": "Validation failed",
  "details": {
    "field": "email",
    "message": "Invalid email format",
    "code": "VALIDATION_ERROR"
  }
}
```

---

## Rate Limiting

API endpoints are rate limited to prevent abuse:

- **General endpoints**: 100 requests per minute
- **Upload endpoints**: 20 requests per minute  
- **Email endpoints**: 10 requests per minute
- **Payment endpoints**: 50 requests per minute

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642248600
```

---

## Webhook Endpoints

### Payment Webhook
**POST** `/api/payments/webhook`

Receive payment status updates from payment providers.

**Razorpay Webhook:**
```json
{
  "event": "payment.captured",
  "payload": {
    "payment": {
      "entity": {
        "id": "pay_razorpay_id",
        "amount": 2500,
        "status": "captured",
        "order_id": "order_id"
      }
    }
  }
}
```

**Security:** Webhooks are verified using provider-specific signatures.

---

## Development Tools

### API Testing with curl

```bash
# Test health endpoint
curl https://your-api-url/api/health

# Send order confirmation email
curl -X POST https://your-api-url/api/email/order-confirmation \
  -H "Content-Type: application/json" \
  -d '{"orderNumber": "FII83255"}'

# Upload image
curl -X POST https://your-api-url/api/upload/image \
  -F "image=@path/to/image.jpg"
```

### Environment Variables

```bash
# Required for email service
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=your-email@gmail.com
ADMIN_EMAIL=admin@floristinindia.com

# Required for database
VITE_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Required for payments
RAZORPAY_KEY_ID=rzp_test_your_key
RAZORPAY_KEY_SECRET=your_secret_key

# Optional
FRONTEND_URL=https://www.floristinindia.com
NODE_ENV=production
PORT=3000
```

For more detailed implementation examples, refer to the main project documentation.
