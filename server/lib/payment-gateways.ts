import {
  PaymentGateway,
  PaymentRequest,
  PaymentResponse,
  PaymentWebhook,
  RefundRequest,
  RefundResponse,
  PaymentGatewayConfig,
} from "../../shared/payment.types.js";
import crypto from "crypto";
import axios from "axios";

// Base Payment Gateway Interface
export abstract class BasePaymentGateway {
  protected config: PaymentGatewayConfig;

  constructor(config: PaymentGatewayConfig) {
    this.config = config;
  }

  abstract createPayment(request: PaymentRequest): Promise<PaymentResponse>;
  abstract verifyWebhook(
    payload: any,
    signature: string,
  ): Promise<PaymentWebhook>;
  abstract refundPayment(request: RefundRequest): Promise<RefundResponse>;
  abstract getPaymentStatus(paymentId: string): Promise<any>;
}

// PayPal Gateway Implementation
export class PayPalGateway extends BasePaymentGateway {
  private baseURL: string;
  private accessToken: string | null = null;
  private tokenExpiry: Date | null = null;

  constructor(config: PaymentGatewayConfig) {
    super(config);
    this.baseURL = config.sandbox
      ? "https://api.sandbox.paypal.com"
      : "https://api.paypal.com";
  }

  private async getAccessToken(): Promise<string> {
    if (this.accessToken && this.tokenExpiry && new Date() < this.tokenExpiry) {
      return this.accessToken;
    }

    const auth = Buffer.from(
      `${this.config.config.paypal_client_id}:${this.config.config.paypal_client_secret}`,
    ).toString("base64");

    try {
      const response = await axios.post(
        `${this.baseURL}/v1/oauth2/token`,
        "grant_type=client_credentials",
        {
          headers: {
            Authorization: `Basic ${auth}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
        },
      );

      this.accessToken = response.data.access_token;
      this.tokenExpiry = new Date(Date.now() + response.data.expires_in * 1000);
      return this.accessToken!;
    } catch (error) {
      throw new Error(`PayPal authentication failed: ${error}`);
    }
  }

  async createPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      const token = await this.getAccessToken();

      const paypalRequest = {
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: request.currency,
              value: (request.amount / 100).toFixed(2), // Convert paise to rupees
            },
            description: `Order ${request.order_id}`,
            custom_id: request.order_id,
          },
        ],
        payment_source: {
          paypal: {
            experience_context: {
              return_url: request.return_url,
              cancel_url: request.cancel_url,
              user_action: "PAY_NOW",
              payment_method_preference: "IMMEDIATE_PAYMENT_REQUIRED",
            },
          },
        },
      };

      const response = await axios.post(
        `${this.baseURL}/v2/checkout/orders`,
        paypalRequest,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      const approvalUrl = response.data.links.find(
        (link: any) => link.rel === "approve",
      )?.href;

      return {
        success: true,
        payment_intent_id: response.data.id,
        gateway: "paypal",
        gateway_order_id: response.data.id,
        payment_url: approvalUrl,
        metadata: { paypal_order: response.data },
      };
    } catch (error: any) {
      return {
        success: false,
        payment_intent_id: "",
        gateway: "paypal",
        error: error.response?.data?.message || error.message,
      };
    }
  }

  async verifyWebhook(
    payload: any,
    signature: string,
  ): Promise<PaymentWebhook> {
    // PayPal webhook verification implementation
    // This is a simplified version - in production, you should verify the signature
    return {
      gateway: "paypal",
      event_type: payload.event_type,
      payment_intent_id: payload.resource?.id || "",
      gateway_payment_id: payload.resource?.id || "",
      status: this.mapPayPalStatus(payload.resource?.status),
      amount: parseFloat(payload.resource?.amount?.value || "0") * 100,
      currency: payload.resource?.amount?.currency_code || "INR",
      raw_data: payload,
      verified: true, // Implement proper verification
    };
  }

  private mapPayPalStatus(status: string): any {
    const statusMap: Record<string, any> = {
      COMPLETED: "completed",
      FAILED: "failed",
      PENDING: "pending",
      CANCELLED: "cancelled",
    };
    return statusMap[status] || "pending";
  }

  async refundPayment(request: RefundRequest): Promise<RefundResponse> {
    try {
      const token = await this.getAccessToken();

      const refundRequest = {
        amount: {
          currency_code: "INR",
          value: ((request.amount || 0) / 100).toFixed(2),
        },
        note_to_payer: request.reason || "Refund processed",
      };

      const response = await axios.post(
        `${this.baseURL}/v2/payments/captures/${request.payment_intent_id}/refund`,
        refundRequest,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      return {
        success: true,
        refund_id: response.data.id,
        gateway_refund_id: response.data.id,
        amount: parseFloat(response.data.amount.value) * 100,
        status: response.data.status === "COMPLETED" ? "processed" : "pending",
      };
    } catch (error: any) {
      return {
        success: false,
        refund_id: "",
        amount: 0,
        status: "failed",
        error: error.response?.data?.message || error.message,
      };
    }
  }

  async getPaymentStatus(paymentId: string): Promise<any> {
    try {
      const token = await this.getAccessToken();
      const response = await axios.get(
        `${this.baseURL}/v2/checkout/orders/${paymentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get PayPal payment status: ${error}`);
    }
  }
}

// Razorpay Gateway Implementation
export class RazorpayGateway extends BasePaymentGateway {
  private baseURL: string = "https://api.razorpay.com/v1";

  async createPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      const auth = Buffer.from(
        `${this.config.config.razorpay_key_id}:${this.config.config.razorpay_key_secret}`,
      ).toString("base64");

      const razorpayRequest = {
        amount: request.amount, // Amount in paise
        currency: request.currency,
        receipt: request.order_id,
        notes: {
          order_id: request.order_id,
          customer_email: request.customer.email,
          ...request.metadata,
        },
      };

      const response = await axios.post(
        `${this.baseURL}/orders`,
        razorpayRequest,
        {
          headers: {
            Authorization: `Basic ${auth}`,
            "Content-Type": "application/json",
          },
        },
      );

      return {
        success: true,
        payment_intent_id: response.data.id,
        gateway: "razorpay",
        gateway_order_id: response.data.id,
        payment_url: `${process.env.CLIENT_URL || "http://localhost:5173"}/razorpay-payment?order_id=${response.data.id}&payment_intent=${request.metadata?.payment_intent_id}`,
        metadata: {
          razorpay_order: response.data,
          key_id: this.config.config.razorpay_key_id,
          order_id: response.data.id,
          amount: response.data.amount,
          currency: response.data.currency,
          customer_email: request.customer.email,
          customer_name: request.customer.name,
          customer_phone: request.customer.phone,
        },
      };
    } catch (error: any) {
      return {
        success: false,
        payment_intent_id: "",
        gateway: "razorpay",
        error: error.response?.data?.error?.description || error.message,
      };
    }
  }

  async verifyWebhook(
    payload: any,
    signature: string,
  ): Promise<PaymentWebhook> {
    try {
      const expectedSignature = crypto
        .createHmac("sha256", this.config.config.razorpay_webhook_secret || "")
        .update(JSON.stringify(payload))
        .digest("hex");

      const verified = signature === expectedSignature;

      return {
        gateway: "razorpay",
        event_type: payload.event,
        payment_intent_id: payload.payload?.payment?.entity?.order_id || "",
        gateway_payment_id: payload.payload?.payment?.entity?.id || "",
        status: this.mapRazorpayStatus(
          payload.payload?.payment?.entity?.status,
        ),
        amount: payload.payload?.payment?.entity?.amount || 0,
        currency: payload.payload?.payment?.entity?.currency || "INR",
        signature,
        raw_data: payload,
        verified,
      };
    } catch (error) {
      throw new Error(`Razorpay webhook verification failed: ${error}`);
    }
  }

  private mapRazorpayStatus(status: string): any {
    const statusMap: Record<string, any> = {
      captured: "completed",
      failed: "failed",
      created: "pending",
      authorized: "processing",
    };
    return statusMap[status] || "pending";
  }

  async refundPayment(request: RefundRequest): Promise<RefundResponse> {
    try {
      const auth = Buffer.from(
        `${this.config.config.razorpay_key_id}:${this.config.config.razorpay_key_secret}`,
      ).toString("base64");

      const refundRequest: any = {
        notes: request.notes || {},
      };

      if (request.amount) {
        refundRequest.amount = request.amount;
      }

      const response = await axios.post(
        `${this.baseURL}/payments/${request.payment_intent_id}/refund`,
        refundRequest,
        {
          headers: {
            Authorization: `Basic ${auth}`,
            "Content-Type": "application/json",
          },
        },
      );

      return {
        success: true,
        refund_id: response.data.id,
        gateway_refund_id: response.data.id,
        amount: response.data.amount,
        status: "processed",
      };
    } catch (error: any) {
      return {
        success: false,
        refund_id: "",
        amount: 0,
        status: "failed",
        error: error.response?.data?.error?.description || error.message,
      };
    }
  }

  async getPaymentStatus(paymentId: string): Promise<any> {
    try {
      const auth = Buffer.from(
        `${this.config.config.razorpay_key_id}:${this.config.config.razorpay_key_secret}`,
      ).toString("base64");

      const response = await axios.get(`${this.baseURL}/orders/${paymentId}`, {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get Razorpay payment status: ${error}`);
    }
  }
}

// Cashfree Gateway Implementation
export class CashfreeGateway extends BasePaymentGateway {
  private baseURL: string;

  constructor(config: PaymentGatewayConfig) {
    super(config);
    this.baseURL = config.sandbox
      ? "https://sandbox.cashfree.com/pg"
      : "https://api.cashfree.com/pg";
  }

  async createPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      const cashfreeRequest = {
        order_id: request.order_id,
        order_amount: request.amount / 100, // Convert paise to rupees
        order_currency: request.currency,
        customer_details: {
          customer_id: request.customer.email,
          customer_name: request.customer.name,
          customer_email: request.customer.email,
          customer_phone: request.customer.phone || "",
        },
        order_meta: {
          return_url: request.return_url,
          notify_url: request.webhook_url,
          ...request.metadata,
        },
      };

      const response = await axios.post(
        `${this.baseURL}/orders`,
        cashfreeRequest,
        {
          headers: {
            "x-api-version": "2023-08-01",
            "x-client-id": this.config.config.cashfree_app_id,
            "x-client-secret": this.config.config.cashfree_secret_key,
            "Content-Type": "application/json",
          },
        },
      );

      return {
        success: true,
        payment_intent_id: response.data.order_token,
        gateway: "cashfree",
        gateway_order_id: response.data.order_id,
        payment_url: response.data.payment_session_id,
        metadata: { cashfree_order: response.data },
      };
    } catch (error: any) {
      return {
        success: false,
        payment_intent_id: "",
        gateway: "cashfree",
        error: error.response?.data?.message || error.message,
      };
    }
  }

  async verifyWebhook(
    payload: any,
    signature: string,
  ): Promise<PaymentWebhook> {
    try {
      // Cashfree webhook verification
      const computedSignature = crypto
        .createHmac("sha256", this.config.config.cashfree_secret_key || "")
        .update(JSON.stringify(payload))
        .digest("base64");

      const verified = signature === computedSignature;

      return {
        gateway: "cashfree",
        event_type: payload.type,
        payment_intent_id: payload.data?.order?.order_id || "",
        gateway_payment_id: payload.data?.payment?.cf_payment_id || "",
        status: this.mapCashfreeStatus(payload.data?.payment?.payment_status),
        amount: (payload.data?.payment?.payment_amount || 0) * 100,
        currency: payload.data?.payment?.payment_currency || "INR",
        signature,
        raw_data: payload,
        verified,
      };
    } catch (error) {
      throw new Error(`Cashfree webhook verification failed: ${error}`);
    }
  }

  private mapCashfreeStatus(status: string): any {
    const statusMap: Record<string, any> = {
      SUCCESS: "completed",
      FAILED: "failed",
      PENDING: "pending",
      CANCELLED: "cancelled",
      USER_DROPPED: "cancelled",
    };
    return statusMap[status] || "pending";
  }

  async refundPayment(request: RefundRequest): Promise<RefundResponse> {
    try {
      const refundRequest = {
        refund_amount: (request.amount || 0) / 100,
        refund_id: `refund_${Date.now()}`,
        refund_note: request.reason || "Refund processed",
      };

      const response = await axios.post(
        `${this.baseURL}/orders/${request.payment_intent_id}/refunds`,
        refundRequest,
        {
          headers: {
            "x-api-version": "2023-08-01",
            "x-client-id": this.config.config.cashfree_app_id,
            "x-client-secret": this.config.config.cashfree_secret_key,
            "Content-Type": "application/json",
          },
        },
      );

      return {
        success: true,
        refund_id: response.data.refund_id,
        gateway_refund_id: response.data.cf_refund_id,
        amount: response.data.refund_amount * 100,
        status:
          response.data.refund_status === "SUCCESS" ? "processed" : "pending",
      };
    } catch (error: any) {
      return {
        success: false,
        refund_id: "",
        amount: 0,
        status: "failed",
        error: error.response?.data?.message || error.message,
      };
    }
  }

  async getPaymentStatus(paymentId: string): Promise<any> {
    try {
      const response = await axios.get(`${this.baseURL}/orders/${paymentId}`, {
        headers: {
          "x-api-version": "2023-08-01",
          "x-client-id": this.config.config.cashfree_app_id,
          "x-client-secret": this.config.config.cashfree_secret_key,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get Cashfree payment status: ${error}`);
    }
  }
}

// PhonePe Gateway Implementation
export class PhonePeGateway extends BasePaymentGateway {
  private baseURL: string;

  constructor(config: PaymentGatewayConfig) {
    super(config);
    this.baseURL = config.sandbox
      ? "https://api-preprod.phonepe.com/apis/pg-sandbox"
      : "https://api.phonepe.com/apis/hermes";
  }

  async createPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      const transactionId = `T${Date.now()}`;

      const payload = {
        merchantId: this.config.config.phonepe_merchant_id,
        merchantTransactionId: transactionId,
        merchantUserId: request.customer.email,
        amount: request.amount, // Amount in paise
        redirectUrl: request.return_url,
        redirectMode: "POST",
        callbackUrl: request.webhook_url,
        mobileNumber: request.customer.phone?.replace(/\+91/, "") || "",
        paymentInstrument: {
          type: "PAY_PAGE",
        },
      };

      const payloadString = JSON.stringify(payload);
      const payloadBase64 = Buffer.from(payloadString).toString("base64");

      const checksum =
        crypto
          .createHash("sha256")
          .update(
            payloadBase64 + "/pg/v1/pay" + this.config.config.phonepe_salt_key,
          )
          .digest("hex") +
        "###" +
        this.config.config.phonepe_salt_index;

      const response = await axios.post(
        `${this.baseURL}/pg/v1/pay`,
        {
          request: payloadBase64,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "X-VERIFY": checksum,
          },
        },
      );

      if (response.data.success) {
        return {
          success: true,
          payment_intent_id: transactionId,
          gateway: "phonepe",
          gateway_order_id: transactionId,
          payment_url: response.data.data.instrumentResponse.redirectInfo.url,
          metadata: { phonepe_response: response.data },
        };
      } else {
        return {
          success: false,
          payment_intent_id: "",
          gateway: "phonepe",
          error: response.data.message || "PhonePe payment creation failed",
        };
      }
    } catch (error: any) {
      return {
        success: false,
        payment_intent_id: "",
        gateway: "phonepe",
        error: error.response?.data?.message || error.message,
      };
    }
  }

  async verifyWebhook(
    payload: any,
    signature: string,
  ): Promise<PaymentWebhook> {
    try {
      // PhonePe webhook verification
      const expectedChecksum =
        crypto
          .createHash("sha256")
          .update(JSON.stringify(payload) + this.config.config.phonepe_salt_key)
          .digest("hex") +
        "###" +
        this.config.config.phonepe_salt_index;

      const verified = signature === expectedChecksum;

      return {
        gateway: "phonepe",
        event_type: "payment_status",
        payment_intent_id: payload.transactionId || "",
        gateway_payment_id: payload.transactionId || "",
        status: this.mapPhonePeStatus(payload.code),
        amount: payload.amount || 0,
        currency: "INR",
        signature,
        raw_data: payload,
        verified,
      };
    } catch (error) {
      throw new Error(`PhonePe webhook verification failed: ${error}`);
    }
  }

  private mapPhonePeStatus(code: string): any {
    const statusMap: Record<string, any> = {
      PAYMENT_SUCCESS: "completed",
      PAYMENT_ERROR: "failed",
      PAYMENT_PENDING: "pending",
      PAYMENT_DECLINED: "failed",
      INTERNAL_SERVER_ERROR: "failed",
    };
    return statusMap[code] || "pending";
  }

  async refundPayment(request: RefundRequest): Promise<RefundResponse> {
    try {
      const refundId = `R${Date.now()}`;

      const payload = {
        merchantId: this.config.config.phonepe_merchant_id,
        merchantUserId: "merchant_user_id",
        originalTransactionId: request.payment_intent_id,
        merchantTransactionId: refundId,
        amount: request.amount || 0,
        callbackUrl: request.notes?.callback_url || "",
      };

      const payloadString = JSON.stringify(payload);
      const payloadBase64 = Buffer.from(payloadString).toString("base64");

      const checksum =
        crypto
          .createHash("sha256")
          .update(
            payloadBase64 +
              "/pg/v1/refund" +
              this.config.config.phonepe_salt_key,
          )
          .digest("hex") +
        "###" +
        this.config.config.phonepe_salt_index;

      const response = await axios.post(
        `${this.baseURL}/pg/v1/refund`,
        {
          request: payloadBase64,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "X-VERIFY": checksum,
          },
        },
      );

      return {
        success: response.data.success,
        refund_id: refundId,
        gateway_refund_id: refundId,
        amount: request.amount || 0,
        status: response.data.success ? "processed" : "failed",
        error: response.data.success ? undefined : response.data.message,
      };
    } catch (error: any) {
      return {
        success: false,
        refund_id: "",
        amount: 0,
        status: "failed",
        error: error.response?.data?.message || error.message,
      };
    }
  }

  async getPaymentStatus(paymentId: string): Promise<any> {
    try {
      const checksum =
        crypto
          .createHash("sha256")
          .update(
            `/pg/v1/status/${this.config.config.phonepe_merchant_id}/${paymentId}` +
              this.config.config.phonepe_salt_key,
          )
          .digest("hex") +
        "###" +
        this.config.config.phonepe_salt_index;

      const response = await axios.get(
        `${this.baseURL}/pg/v1/status/${this.config.config.phonepe_merchant_id}/${paymentId}`,
        {
          headers: {
            "Content-Type": "application/json",
            "X-VERIFY": checksum,
            "X-MERCHANT-ID": this.config.config.phonepe_merchant_id,
          },
        },
      );
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get PhonePe payment status: ${error}`);
    }
  }
}

// Gateway Factory
export class PaymentGatewayFactory {
  static create(config: PaymentGatewayConfig): BasePaymentGateway {
    switch (config.id) {
      case "paypal":
        return new PayPalGateway(config);
      case "razorpay":
        return new RazorpayGateway(config);
      case "cashfree":
        return new CashfreeGateway(config);
      case "phonepe":
        return new PhonePeGateway(config);
      default:
        throw new Error(`Unsupported payment gateway: ${config.id}`);
    }
  }
}
