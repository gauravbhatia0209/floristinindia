import express from "express";
import crypto from "crypto";
import { supabase } from "../lib/supabase.js";
import {
  PaymentGatewayFactory,
  BasePaymentGateway,
} from "../lib/payment-gateways.js";
import {
  PaymentRequest,
  PaymentGateway,
  PaymentGatewayConfig,
  PaymentIntent,
  RefundRequest,
} from "../types/payment.types.js";

const router = express.Router();

// Type guard for error handling
function isError(error: unknown): error is Error {
  return error instanceof Error;
}

// Get available payment methods
router.get("/methods", async (req, res) => {
  try {
    console.log("📡 Payment methods endpoint called");
    console.log("🌍 Environment:", process.env.NODE_ENV);
    console.log("🕐 Timestamp:", new Date().toISOString());

    const defaultMethods = [
      {
        gateway: "razorpay",
        name: "Razorpay",
        enabled: true,
        min_amount: 100,
        max_amount: 1000000,
        processing_fee: 0,
        fixed_fee: 0,
        supported_currencies: ["INR"],
        description: "Pay with cards, UPI, wallets & netbanking",
        icon: "💳",
      },
    ];

    console.log("✅ Payment methods prepared:", defaultMethods.length);
    res.status(200).json({ success: true, methods: defaultMethods });

    // Commented out database lookup for now
    /*
    const { data: configs, error } = await supabase
      .from("payment_gateway_configs")
      .select("*")
      .eq("enabled", true)
      .order("priority", { ascending: true });

    if (error) {
      console.error("Supabase error:", error);
      return res.status(500).json({
        success: false,
        error: "Failed to fetch payment methods",
        details: error instanceof Error ? error.message : String(error)
      });
    }

    const methods = configs?.map((config: any) => ({
      gateway: config.id,
      name: config.name,
      enabled: config.enabled,
      min_amount: config.min_amount,
      max_amount: config.max_amount,
      processing_fee: config.processing_fee,
      fixed_fee: config.fixed_fee,
      supported_currencies: config.supported_currencies,
    })) || defaultMethods;

    res.json({ success: true, methods });
    */
  } catch (error) {
    console.error("❌ Error in payment methods endpoint:", error);

    // Type-safe error handling
    const errorInfo =
      error instanceof Error
        ? {
            message: error.message,
            stack: error.stack,
            name: error.name,
          }
        : {
            message: String(error),
            stack: undefined,
            name: "UnknownError",
          };

    console.error("📊 Error details:", errorInfo);

    // Always return methods even if there's an error to prevent UI breaking
    const fallbackMethods = [
      {
        gateway: "razorpay",
        name: "Razorpay",
        enabled: true,
        min_amount: 100,
        max_amount: 1000000,
        processing_fee: 0,
        fixed_fee: 0,
        supported_currencies: ["INR"],
        description: "Pay with cards, UPI, wallets & netbanking",
        icon: "💳",
      },
    ];

    console.log("🔄 Returning fallback methods due to error");
    res.status(200).json({ success: true, methods: fallbackMethods });
  }
});

// Create payment intent
router.post("/create", async (req, res) => {
  try {
    const {
      gateway_id,
      order_id,
      amount,
      currency = "INR",
      customer,
      return_url,
      cancel_url,
      webhook_url,
      metadata,
    } = req.body;

    // Validate required fields with detailed logging
    const missingFields: string[] = [];
    if (!gateway_id) missingFields.push("gateway_id");
    if (!amount) missingFields.push("amount");
    if (!customer) missingFields.push("customer");
    if (!return_url) missingFields.push("return_url");
    if (!cancel_url) missingFields.push("cancel_url");

    // Validate customer object fields
    if (customer) {
      if (!customer.name) missingFields.push("customer.name");
      if (!customer.email) missingFields.push("customer.email");
      if (!customer.phone) missingFields.push("customer.phone");
      if (!customer.address) missingFields.push("customer.address");
      if (customer.address) {
        if (!customer.address.line1)
          missingFields.push("customer.address.line1");
        if (!customer.address.city) missingFields.push("customer.address.city");
        if (!customer.address.state)
          missingFields.push("customer.address.state");
        if (!customer.address.pincode)
          missingFields.push("customer.address.pincode");
      }
    }

    if (missingFields.length > 0) {
      console.error("Payment API - Missing required fields:", missingFields);
      console.error(
        "Payment API - Request body:",
        JSON.stringify(req.body, null, 2),
      );
      return res.status(400).json({
        success: false,
        error: "Missing required fields",
        missing_fields: missingFields,
      });
    }

    // Get gateway configuration or use default
    let config;

    // Try to get from database first
    const { data: dbConfig, error: configError } = await supabase
      .from("payment_gateway_configs")
      .select("*")
      .eq("id", gateway_id)
      .eq("enabled", true)
      .single();

    if (configError || !dbConfig) {
      console.log(
        "Gateway config not found in database, using default for:",
        gateway_id,
      );

      // Use default configuration for Razorpay
      if (gateway_id === "razorpay") {
        config = {
          id: "razorpay",
          name: "Razorpay",
          enabled: true,
          sandbox: process.env.NODE_ENV !== "production",
          priority: 1,
          min_amount: 100, // 1 INR in paise
          max_amount: 10000000, // 100,000 INR in paise
          processing_fee: 0,
          fixed_fee: 0,
          supported_currencies: ["INR"],
          config: {
            razorpay_key_id:
              process.env.RAZORPAY_KEY_ID || "rzp_test_11Hm26VEZT4FGR",
            razorpay_key_secret:
              process.env.RAZORPAY_KEY_SECRET || "dummy_secret_key_for_testing",
            razorpay_webhook_secret:
              process.env.RAZORPAY_WEBHOOK_SECRET || "test_webhook_secret",
          },
        };
      } else {
        return res.status(400).json({
          success: false,
          error: "Payment gateway not available",
        });
      }
    } else {
      config = dbConfig;
    }

    // Validate amount limits
    if (amount < config.min_amount || amount > config.max_amount) {
      return res.status(400).json({
        success: false,
        error: `Amount must be between ₹${config.min_amount / 100} and ₹${config.max_amount / 100}`,
      });
    }

    // Create payment intent record
    let finalOrderId = order_id;
    let orderNumber = metadata?.order_number || "";

    // If no order_id provided, create a placeholder order (payment-first flow)
    if (!order_id || order_id.trim() === "") {
      try {
        const tempOrderNumber = `TEMP-${Date.now()}`;
        const placeholderOrder = {
          order_number: tempOrderNumber,
          status: "pending",
          total_amount: amount / 100, // Convert paise to rupees
          shipping_amount: 0,
          discount_amount: 0,
          tax_amount: 0,
          items: [],
          shipping_address: customer.address || {},
          billing_address: customer.address || {},
          payment_status: "pending",
          customer_id: null, // Will be updated later
          delivery_date: null,
          delivery_slot: null,
          special_instructions: "Placeholder order for payment processing",
          notes:
            "This is a temporary order created for payment processing. Will be updated after payment completion.",
        };

        const { data: createdOrder, error: orderError } = await supabase
          .from("orders")
          .insert(placeholderOrder)
          .select("id, order_number")
          .single();

        if (orderError) {
          console.error("Error creating placeholder order:", orderError);
          throw new Error("Failed to create placeholder order");
        }

        finalOrderId = createdOrder.id;
        orderNumber = createdOrder.order_number;
        console.log(
          `Created placeholder order with ID: ${finalOrderId}, Order Number: ${orderNumber}`,
        );
      } catch (placeholderError) {
        console.error("Placeholder order creation failed:", placeholderError);
        return res.status(500).json({
          success: false,
          error: "Failed to initialize order for payment processing",
        });
      }
    }

    const paymentIntent: Partial<PaymentIntent> = {
      gateway: gateway_id,
      order_id: finalOrderId,
      amount,
      currency,
      status: "pending",
      metadata: {
        ...metadata,
        is_placeholder_order: !order_id, // Track if this uses a placeholder order
      },
    };

    const { data: intentData, error: intentError } = await supabase
      .from("payment_intents")
      .insert(paymentIntent)
      .select()
      .single();

    if (intentError) {
      console.error("Error creating payment intent:", intentError);
      return res.status(500).json({
        success: false,
        error: "Failed to create payment intent",
      });
    }

    // Create payment request
    const paymentRequest: PaymentRequest = {
      order_id: finalOrderId,
      amount,
      currency,
      customer,
      return_url: `${return_url}?payment_intent=${intentData.id}`,
      cancel_url: `${cancel_url}?payment_intent=${intentData.id}`,
      webhook_url: webhook_url || `${req.get("origin")}/api/payments/webhook`,
      metadata: {
        payment_intent_id: intentData.id,
        original_order_id: order_id, // Keep track of original (null) order_id
        placeholder_order_id: !order_id ? finalOrderId : null, // Track placeholder order
        customer_email: customer.email,
        // Filter out empty order_number from client metadata and use our server-generated one
        ...(metadata
          ? Object.fromEntries(
              Object.entries(metadata).filter(
                ([key, value]) =>
                  !(key === "order_number" && (!value || value === "")),
              ),
            )
          : {}),
        order_number: orderNumber, // Use actual order number (placed after filtered metadata to ensure it's not overridden)
      },
    };

    // Initialize gateway and create payment
    const gateway = PaymentGatewayFactory.create(config);
    const response = await gateway.createPayment(paymentRequest);

    if (response.success) {
      // Update payment intent with gateway details
      await supabase
        .from("payment_intents")
        .update({
          gateway_payment_id: response.payment_intent_id,
          gateway_order_id: response.gateway_order_id,
          metadata: {
            ...intentData.metadata,
            ...response.metadata,
          },
        })
        .eq("id", intentData.id);

      res.json({
        success: true,
        payment_intent_id: intentData.id,
        gateway: response.gateway,
        payment_url: response.payment_url,
        client_secret: response.client_secret,
        qr_code: response.qr_code,
        upi_intent: response.upi_intent,
        metadata: response.metadata,
      });
    } else {
      // Update payment intent with error
      await supabase
        .from("payment_intents")
        .update({
          status: "failed",
          error_message: response.error,
        })
        .eq("id", intentData.id);

      res.status(400).json({
        success: false,
        error: response.error,
      });
    }
  } catch (error) {
    console.error("Error creating payment:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

// Payment status check
router.get("/status/:payment_intent_id", async (req, res) => {
  try {
    const { payment_intent_id } = req.params;

    // First try to find by payment_intent_id
    let { data: intent, error } = await supabase
      .from("payment_intents")
      .select("*")
      .eq("id", payment_intent_id)
      .single();

    // If not found, try to find by gateway_order_id (for cases where order_id is passed)
    if (error || !intent) {
      console.log(
        `Payment intent not found by ID ${payment_intent_id}, trying by gateway_order_id`,
      );
      const { data: intentByOrderId, error: orderError } = await supabase
        .from("payment_intents")
        .select("*")
        .eq("gateway_order_id", payment_intent_id)
        .single();

      if (orderError || !intentByOrderId) {
        return res.status(404).json({
          success: false,
          error: "Payment intent not found",
        });
      }

      intent = intentByOrderId;
    }

    // Get gateway config and check status with gateway
    const { data: config } = await supabase
      .from("payment_gateway_configs")
      .select("*")
      .eq("id", intent.gateway)
      .single();

    if (config && intent.gateway_payment_id) {
      try {
        const gateway = PaymentGatewayFactory.create(config);
        const gatewayStatus = await gateway.getPaymentStatus(
          intent.gateway_payment_id,
        );

        // Update local status based on gateway response
        let newStatus = intent.status;
        if (gatewayStatus) {
          // Map gateway status to our status (implementation depends on gateway)
          // This is a simplified mapping
          if (
            gatewayStatus.status === "captured" ||
            gatewayStatus.status === "COMPLETED" ||
            gatewayStatus.state === "approved"
          ) {
            newStatus = "completed";
          } else if (
            gatewayStatus.status === "failed" ||
            gatewayStatus.status === "FAILED"
          ) {
            newStatus = "failed";
          }

          if (newStatus !== intent.status) {
            await supabase
              .from("payment_intents")
              .update({ status: newStatus })
              .eq("id", payment_intent_id);
          }
        }

        res.json({
          success: true,
          payment_intent: {
            ...intent,
            status: newStatus,
          },
          gateway_status: gatewayStatus,
        });
      } catch (gatewayError) {
        console.error("Gateway status check failed:", gatewayError);
        res.json({
          success: true,
          payment_intent: intent,
          gateway_error: "Failed to check gateway status",
        });
      }
    } else {
      res.json({
        success: true,
        payment_intent: intent,
      });
    }
  } catch (error) {
    console.error("Error checking payment status:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

// Payment webhook handler
router.post("/webhook", async (req, res) => {
  try {
    const signature = req.headers["x-signature"] as string;
    const gatewayHeader = req.headers["x-gateway"] as string;

    if (!signature || !gatewayHeader) {
      return res.status(400).json({ error: "Missing signature or gateway" });
    }

    // Get gateway config
    const { data: config, error } = await supabase
      .from("payment_gateway_configs")
      .select("*")
      .eq("id", gatewayHeader)
      .single();

    if (error || !config) {
      return res.status(400).json({ error: "Invalid gateway" });
    }

    // Verify webhook
    const gateway = PaymentGatewayFactory.create(config);
    const webhook = await gateway.verifyWebhook(req.body, signature);

    if (!webhook.verified) {
      return res.status(400).json({ error: "Webhook verification failed" });
    }

    // Find payment intent
    const { data: intent, error: intentError } = await supabase
      .from("payment_intents")
      .select("*")
      .or(
        `gateway_payment_id.eq.${webhook.gateway_payment_id},gateway_order_id.eq.${webhook.payment_intent_id}`,
      )
      .single();

    if (intentError || !intent) {
      console.log("Payment intent not found for webhook:", webhook);
      return res.status(404).json({ error: "Payment intent not found" });
    }

    // Update payment intent
    const updates: Partial<PaymentIntent> = {
      status: webhook.status,
      gateway_signature: webhook.signature,
      webhook_verified: webhook.verified,
      updated_at: new Date().toISOString(),
    };

    if (webhook.gateway_payment_id && !intent.gateway_payment_id) {
      updates.gateway_payment_id = webhook.gateway_payment_id;
    }

    await supabase.from("payment_intents").update(updates).eq("id", intent.id);

    // Update order status if payment completed
    if (webhook.status === "completed") {
      await supabase
        .from("orders")
        .update({
          payment_status: "paid",
          payment_method: config.name,
          payment_reference: webhook.gateway_payment_id,
        })
        .eq("id", intent.order_id);
    } else if (webhook.status === "failed") {
      await supabase
        .from("orders")
        .update({
          payment_status: "failed",
        })
        .eq("id", intent.order_id);
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Webhook processing error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Refund payment
router.post("/refund", async (req, res) => {
  try {
    const { payment_intent_id, amount, reason, notes } = req.body;

    if (!payment_intent_id) {
      return res.status(400).json({
        success: false,
        error: "Payment intent ID is required",
      });
    }

    // Get payment intent
    const { data: intent, error } = await supabase
      .from("payment_intents")
      .select("*")
      .eq("id", payment_intent_id)
      .single();

    if (error || !intent) {
      return res.status(404).json({
        success: false,
        error: "Payment intent not found",
      });
    }

    if (intent.status !== "completed") {
      return res.status(400).json({
        success: false,
        error: "Only completed payments can be refunded",
      });
    }

    // Get gateway config
    const { data: config } = await supabase
      .from("payment_gateway_configs")
      .select("*")
      .eq("id", intent.gateway)
      .single();

    if (!config) {
      return res.status(400).json({
        success: false,
        error: "Payment gateway configuration not found",
      });
    }

    // Process refund
    const gateway = PaymentGatewayFactory.create(config);
    const refundRequest: RefundRequest = {
      payment_intent_id: intent.gateway_payment_id || intent.id,
      amount: amount || intent.amount,
      reason,
      notes,
    };

    const refundResponse = await gateway.refundPayment(refundRequest);

    if (refundResponse.success) {
      // Update payment intent
      const refundAmount = intent.refund_amount || 0;
      const newRefundAmount = refundAmount + refundResponse.amount;
      const newStatus =
        newRefundAmount >= intent.amount ? "refunded" : "partial_refund";

      await supabase
        .from("payment_intents")
        .update({
          status: newStatus,
          refund_amount: newRefundAmount,
        })
        .eq("id", payment_intent_id);

      // Update order status
      await supabase
        .from("orders")
        .update({
          payment_status: newStatus,
        })
        .eq("id", intent.order_id);

      res.json({
        success: true,
        refund_id: refundResponse.refund_id,
        amount: refundResponse.amount,
        status: refundResponse.status,
      });
    } else {
      res.status(400).json({
        success: false,
        error: refundResponse.error || "Refund failed",
      });
    }
  } catch (error) {
    console.error("Error processing refund:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

// Admin routes
router.get("/admin/intents", async (req, res) => {
  try {
    const { page = 1, limit = 20, status, gateway } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    let query = supabase
      .from("payment_intents")
      .select("*, orders(order_number, customer_email)")
      .order("created_at", { ascending: false })
      .range(offset, offset + Number(limit) - 1);

    if (status) {
      query = query.eq("status", status);
    }

    if (gateway) {
      query = query.eq("gateway", gateway);
    }

    const { data: intents, error } = await query;

    if (error) {
      return res.status(500).json({ error: "Failed to fetch payment intents" });
    }

    res.json({ success: true, intents });
  } catch (error) {
    console.error("Error fetching payment intents:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
