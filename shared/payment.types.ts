// Payment Gateway Types and Interfaces

export type PaymentGateway = "paypal" | "razorpay" | "cashfree" | "phonepe";

export type PaymentStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed"
  | "cancelled"
  | "refunded"
  | "partial_refund";

export interface PaymentGatewayConfig {
  id: PaymentGateway;
  name: string;
  enabled: boolean;
  sandbox: boolean;
  priority: number;
  config: PaymentGatewayCredentials;
  supportedCurrencies: string[];
  minAmount: number;
  maxAmount: number;
  processingFee: number; // Percentage
  fixedFee: number; // Fixed amount in INR
}

export interface PaymentGatewayCredentials {
  // PayPal
  paypal_client_id?: string;
  paypal_client_secret?: string;
  paypal_webhook_id?: string;

  // Razorpay
  razorpay_key_id?: string;
  razorpay_key_secret?: string;
  razorpay_webhook_secret?: string;

  // Cashfree
  cashfree_app_id?: string;
  cashfree_secret_key?: string;
  cashfree_webhook_username?: string;
  cashfree_webhook_password?: string;

  // PhonePe
  phonepe_merchant_id?: string;
  phonepe_salt_key?: string;
  phonepe_salt_index?: string;
  phonepe_host_url?: string;
}

export interface PaymentIntent {
  id: string;
  gateway: PaymentGateway;
  order_id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  gateway_payment_id?: string;
  gateway_order_id?: string;
  gateway_signature?: string;
  payment_method?: string;
  created_at: string;
  updated_at: string;
  metadata?: Record<string, any>;
  error_message?: string;
  refund_amount?: number;
  webhook_verified?: boolean;
}

export interface PaymentRequest {
  order_id: string;
  amount: number;
  currency: string;
  customer: {
    name: string;
    email: string;
    phone?: string;
    address?: {
      line1: string;
      line2?: string;
      city: string;
      state: string;
      pincode: string;
      country: string;
    };
  };
  return_url: string;
  cancel_url: string;
  webhook_url?: string;
  metadata?: Record<string, any>;
}

export interface PaymentResponse {
  success: boolean;
  payment_intent_id: string;
  gateway: PaymentGateway;
  gateway_order_id?: string;
  payment_url?: string;
  client_secret?: string;
  qr_code?: string;
  upi_intent?: string;
  error?: string;
  metadata?: Record<string, any>;
}

export interface PaymentWebhook {
  gateway: PaymentGateway;
  event_type: string;
  payment_intent_id: string;
  gateway_payment_id: string;
  status: PaymentStatus;
  amount: number;
  currency: string;
  signature?: string;
  raw_data: Record<string, any>;
  verified: boolean;
}

export interface RefundRequest {
  payment_intent_id: string;
  amount?: number; // Partial refund amount, full if not specified
  reason?: string;
  notes?: Record<string, any>;
}

export interface RefundResponse {
  success: boolean;
  refund_id: string;
  gateway_refund_id?: string;
  amount: number;
  status: "pending" | "processed" | "failed";
  error?: string;
}

// Payment Method UI Configuration
export interface PaymentMethodConfig {
  gateway: PaymentGateway;
  name: string;
  icon: string;
  description: string;
  enabled: boolean;
  recommended?: boolean;
  processing_time: string;
  supported_features: {
    refunds: boolean;
    partial_refunds: boolean;
    webhooks: boolean;
    recurring: boolean;
  };
}

// Default payment method configurations
export const DEFAULT_PAYMENT_METHODS: PaymentMethodConfig[] = [
  {
    gateway: "phonepe",
    name: "PhonePe",
    icon: "📱",
    description: "UPI, Cards, Wallets & NetBanking",
    enabled: true,
    recommended: true,
    processing_time: "Instant",
    supported_features: {
      refunds: true,
      partial_refunds: true,
      webhooks: true,
      recurring: false,
    },
  },
  {
    gateway: "razorpay",
    name: "Razorpay",
    icon: "💳",
    description: "Cards, UPI, Wallets & NetBanking",
    enabled: true,
    recommended: true,
    processing_time: "Instant",
    supported_features: {
      refunds: true,
      partial_refunds: true,
      webhooks: true,
      recurring: true,
    },
  },
  {
    gateway: "cashfree",
    name: "Cashfree",
    icon: "🏦",
    description: "All payment methods",
    enabled: true,
    processing_time: "Instant",
    supported_features: {
      refunds: true,
      partial_refunds: true,
      webhooks: true,
      recurring: false,
    },
  },
  {
    gateway: "paypal",
    name: "PayPal",
    icon: "🌍",
    description: "International payments",
    enabled: true,
    processing_time: "1-2 business days",
    supported_features: {
      refunds: true,
      partial_refunds: true,
      webhooks: true,
      recurring: true,
    },
  },
];
