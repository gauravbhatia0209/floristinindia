const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://www.floristinindia.com"
    : "http://localhost:3000";

async function testPaymentCreation() {
  console.log("🧪 Testing payment creation with proper Razorpay order...");

  try {
    const paymentData = {
      gateway_id: "razorpay",
      amount: 50000, // ₹500 in paise
      currency: "INR",
      customer: {
        name: "Test Customer",
        email: "test@example.com",
        phone: "+919999999999",
        address: {
          line1: "Test Address",
          city: "Mumbai",
          state: "Maharashtra",
          pincode: "400001",
          country: "IN",
        },
      },
      return_url: `${BASE_URL}/checkout/success`,
      cancel_url: `${BASE_URL}/checkout`,
      metadata: {
        order_number: `TEST-ORDER-${Date.now()}`,
        test: true,
      },
    };

    console.log("📤 Sending payment creation request...");

    const response = await fetch(`${BASE_URL}/api/payments/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paymentData),
    });

    const result = await response.json();

    console.log("📥 Payment creation response:", result);

    if (result.success) {
      console.log("✅ Payment creation successful!");
      console.log(`📄 Payment Intent ID: ${result.payment_intent_id}`);
      console.log(`🔗 Payment URL: ${result.payment_url}`);
      console.log(`🎫 Razorpay Order ID: ${result.metadata.razorpay_order_id}`);
      console.log(`🔑 Razorpay Key ID: ${result.metadata.key_id}`);

      // Test the payment status endpoint
      console.log("\n🔍 Testing payment status endpoint...");
      const statusResponse = await fetch(
        `${BASE_URL}/api/payments/status/${result.payment_intent_id}`,
      );
      const statusResult = await statusResponse.json();

      if (statusResult.success) {
        console.log("✅ Payment status check successful!");
        console.log(
          "📊 Payment Intent Status:",
          statusResult.payment_intent.status,
        );
        console.log(
          "🆔 Gateway Order ID:",
          statusResult.payment_intent.gateway_order_id,
        );
      } else {
        console.log("❌ Payment status check failed:", statusResult.error);
      }
    } else {
      console.log("❌ Payment creation failed:", result.error);
      if (result.details) {
        console.log("📋 Error details:", result.details);
      }
      if (result.code) {
        console.log("🏷️ Error code:", result.code);
      }
    }
  } catch (error) {
    console.error("💥 Test failed with error:", error.message);
  }
}

// Run the test
testPaymentCreation();
