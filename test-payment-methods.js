// Test payment methods API
// Run with: node test-payment-methods.js

const BASE_URL = "https://www.floristinindia.com";

async function testPaymentMethods() {
  console.log("🧪 Testing Payment Methods API");
  console.log("==============================\n");

  try {
    const response = await fetch(`${BASE_URL}/api/payments/methods`);
    const text = await response.text();

    console.log(`Status: ${response.status}`);
    console.log(`Content-Type: ${response.headers.get("content-type")}`);
    console.log(`Raw Response: ${text}`);

    if (response.ok) {
      try {
        const data = JSON.parse(text);
        console.log("\n✅ Parsed JSON:");
        console.log(JSON.stringify(data, null, 2));

        if (data.success && data.methods) {
          console.log(`\n📊 Found ${data.methods.length} payment methods:`);
          data.methods.forEach((method, index) => {
            console.log(`\n${index + 1}. ${method.name} (${method.gateway})`);
            console.log(`   Enabled: ${method.enabled}`);
            console.log(`   Description: ${method.description}`);
            console.log(`   Min Amount: ₹${method.min_amount / 100}`);
            console.log(`   Max Amount: ₹${method.max_amount / 100}`);
            console.log(`   Processing Fee: ${method.processing_fee}%`);
          });

          // Check if this looks like hardcoded vs database data
          const isHardcoded =
            data.methods.length === 1 &&
            data.methods[0].gateway === "razorpay" &&
            data.methods[0].description ===
              "Pay with cards, UPI, wallets & netbanking";

          if (isHardcoded) {
            console.log("\n⚠️  WARNING: This appears to be hardcoded data!");
          } else {
            console.log("\n✅ This appears to be dynamic data from database");
          }
        }
      } catch (e) {
        console.log("❌ Failed to parse JSON:", e.message);
      }
    } else {
      console.log("❌ API request failed");
    }
  } catch (error) {
    console.log("💥 Request error:", error.message);
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

testPaymentMethods().catch(console.error);
