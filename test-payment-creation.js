// Test payment creation API
// Run with: node test-payment-creation.js

const BASE_URL = "https://www.floristinindia.com";

async function testPaymentCreation() {
  console.log("🧪 Testing Payment Creation API");
  console.log("===============================\n");

  const testPaymentData = {
    gateway_id: "razorpay",
    amount: 50000, // 500 INR in paise
    currency: "INR",
    customer: {
      name: "Test Customer",
      email: "test@example.com",
      phone: "+919999999999",
      address: {
        line1: "Test Address Line 1",
        city: "Test City",
        state: "Test State",
        pincode: "144001",
        country: "IN",
      },
    },
    return_url: `${BASE_URL}/checkout/success`,
    cancel_url: `${BASE_URL}/checkout`,
    metadata: {
      test_payment: true,
      order_number: `FII${Date.now().toString().slice(-5)}`,
    },
  };

  try {
    console.log("📤 Sending payment creation request...");
    console.log("Data:", JSON.stringify(testPaymentData, null, 2));

    const response = await fetch(`${BASE_URL}/api/payments/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(testPaymentData),
    });

    console.log(`📊 Response Status: ${response.status}`);

    const responseText = await response.text();
    console.log(`📝 Raw Response: ${responseText}`);

    if (response.ok) {
      try {
        const data = JSON.parse(responseText);
        console.log("✅ Payment creation successful!");
        console.log("Response data:", JSON.stringify(data, null, 2));

        if (data.payment_url) {
          console.log(`🔗 Payment URL: ${data.payment_url}`);

          // Test the payment status endpoint
          if (data.payment_intent_id) {
            await testPaymentStatus(data.payment_intent_id);
          }
        }
      } catch (e) {
        console.log("❌ Failed to parse JSON response:", e.message);
      }
    } else {
      console.log("❌ Payment creation failed");
    }
  } catch (error) {
    console.log("💥 Request failed:", error.message);
  }
}

async function testPaymentStatus(paymentIntentId) {
  console.log(`\n🔍 Testing Payment Status for: ${paymentIntentId}`);
  console.log("================================================");

  try {
    const response = await fetch(
      `${BASE_URL}/api/payments/status/${paymentIntentId}`,
    );
    const data = await response.json();

    console.log(`📊 Status Response: ${response.status}`);
    console.log("Status data:", JSON.stringify(data, null, 2));

    if (data.success && data.payment_intent) {
      const metadata = data.payment_intent.metadata;
      console.log("\n🔧 Razorpay Configuration Check:");
      console.log(`Key ID: ${metadata.key_id ? "✅ Present" : "❌ Missing"}`);
      console.log(
        `Order ID: ${metadata.order_id ? "✅ Present" : "❌ Missing"}`,
      );
      console.log(`Amount: ${metadata.amount ? "✅ Present" : "❌ Missing"}`);
      console.log(
        `Currency: ${metadata.currency ? "✅ Present" : "❌ Missing"}`,
      );
    }
  } catch (error) {
    console.log("💥 Status check failed:", error.message);
  }
}

// Check for fetch support
if (typeof fetch === "undefined") {
  try {
    global.fetch = require("node-fetch");
  } catch (e) {
    console.error("❌ Please install node-fetch: npm install node-fetch");
    process.exit(1);
  }
}

testPaymentCreation().catch(console.error);
