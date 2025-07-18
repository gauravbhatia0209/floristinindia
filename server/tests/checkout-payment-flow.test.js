// Checkout and Payment Flow Integration Tests
// Run with: node tests/checkout-payment-flow.test.js

const fs = require("fs");
const path = require("path");

// Configuration
const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:3000";
const CLIENT_URL = process.env.TEST_CLIENT_URL || "http://localhost:5173";

// Test results storage
let testResults = [];
let passedTests = 0;
let failedTests = 0;

// Utility functions
function logTest(testName, passed, details = "") {
  const status = passed ? "✅ PASS" : "❌ FAIL";
  const result = `${status} - ${testName}${details ? ": " + details : ""}`;
  console.log(result);

  testResults.push({
    name: testName,
    passed,
    details,
    timestamp: new Date().toISOString(),
  });

  if (passed) passedTests++;
  else failedTests++;
}

function logSection(sectionName) {
  console.log(`\n🔍 ${sectionName}`);
  console.log("=".repeat(50));
}

// HTTP request helper
async function makeRequest(url, options = {}) {
  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();
    return {
      success: response.ok,
      status: response.status,
      data,
      response,
    };
  } catch (error) {
    return {
      success: false,
      status: 0,
      error: error.message,
      data: null,
    };
  }
}

// Test Functions
async function testPaymentMethodsEndpoint() {
  logSection("Payment Methods API Test");

  const result = await makeRequest(`${BASE_URL}/api/payments/methods`);

  logTest(
    "Payment methods endpoint responds",
    result.success && result.status === 200,
    result.success
      ? "OK"
      : `Status: ${result.status}, Error: ${result.error || "Unknown"}`,
  );

  if (result.success && result.data) {
    logTest(
      "Payment methods response has success field",
      result.data.success === true,
      `success: ${result.data.success}`,
    );

    logTest(
      "Payment methods response has methods array",
      Array.isArray(result.data.methods),
      `methods type: ${typeof result.data.methods}, length: ${result.data.methods?.length || 0}`,
    );

    if (Array.isArray(result.data.methods) && result.data.methods.length > 0) {
      const firstMethod = result.data.methods[0];
      logTest(
        "First payment method has required fields",
        firstMethod.gateway &&
          firstMethod.name &&
          typeof firstMethod.enabled === "boolean",
        `Gateway: ${firstMethod.gateway}, Name: ${firstMethod.name}, Enabled: ${firstMethod.enabled}`,
      );

      logTest(
        "Razorpay payment method exists",
        result.data.methods.some((m) => m.gateway === "razorpay"),
        "Razorpay found in methods",
      );
    }
  }

  return result;
}

async function testPaymentCreationEndpoint() {
  logSection("Payment Creation API Test");

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
    return_url: `${CLIENT_URL}/checkout/success`,
    cancel_url: `${CLIENT_URL}/checkout`,
    metadata: {
      test_payment: true,
      order_number: `TEST-${Date.now()}`,
    },
  };

  const result = await makeRequest(`${BASE_URL}/api/payments/create`, {
    method: "POST",
    body: JSON.stringify(testPaymentData),
  });

  logTest(
    "Payment creation endpoint responds",
    result.status !== 0,
    result.success
      ? "OK"
      : `Status: ${result.status}, Error: ${result.error || "Unknown"}`,
  );

  if (result.data) {
    logTest(
      "Payment creation response structure",
      typeof result.data === "object",
      `Response type: ${typeof result.data}`,
    );

    if (result.success && result.data.success) {
      logTest(
        "Payment intent ID returned",
        !!result.data.payment_intent_id,
        `ID: ${result.data.payment_intent_id ? "Present" : "Missing"}`,
      );

      logTest(
        "Payment URL returned",
        !!result.data.payment_url,
        `URL: ${result.data.payment_url ? "Present" : "Missing"}`,
      );

      if (result.data.payment_url) {
        logTest(
          "Payment URL contains required parameters",
          result.data.payment_url.includes("razorpay-payment") &&
            result.data.payment_url.includes("order_id") &&
            result.data.payment_url.includes("payment_intent"),
          `URL: ${result.data.payment_url}`,
        );
      }
    } else {
      logTest(
        "Payment creation error handling",
        !!result.data.error,
        `Error: ${result.data.error || "No error message"}`,
      );
    }
  }

  return result;
}

async function testPaymentStatusEndpoint() {
  logSection("Payment Status API Test");

  // Test with a dummy payment intent ID
  const dummyPaymentIntentId = "test-payment-intent-" + Date.now();

  const result = await makeRequest(
    `${BASE_URL}/api/payments/status/${dummyPaymentIntentId}`,
  );

  logTest(
    "Payment status endpoint responds",
    result.status !== 0,
    result.success
      ? "OK"
      : `Status: ${result.status}, Error: ${result.error || "Unknown"}`,
  );

  logTest(
    "Payment status handles not found correctly",
    result.status === 404 || (result.data && !result.data.success),
    `Status: ${result.status}, Expected 404 or success: false`,
  );

  return result;
}

async function testEnvironmentVariables() {
  logSection("Environment Configuration Test");

  // Test environment detection
  const isProduction = process.env.NODE_ENV === "production";
  logTest(
    "Environment detected",
    true,
    `NODE_ENV: ${process.env.NODE_ENV || "not set"}, Production: ${isProduction}`,
  );

  // Test critical URLs
  logTest("Base URL configured", !!BASE_URL, `Base URL: ${BASE_URL}`);

  logTest("Client URL configured", !!CLIENT_URL, `Client URL: ${CLIENT_URL}`);

  return true;
}

async function testShippingCalculation() {
  logSection("Shipping Calculation Test");

  // Test with a known pincode
  const testPincode = "144001"; // Jalandhar

  const result = await makeRequest(`${BASE_URL}/api/shipping/calculate`, {
    method: "POST",
    body: JSON.stringify({
      pincode: testPincode,
      items: [
        {
          product_id: "test-product",
          quantity: 1,
          weight: 500, // 500g
        },
      ],
    }),
  });

  logTest(
    "Shipping calculation endpoint responds",
    result.status !== 0,
    result.success
      ? "OK"
      : `Status: ${result.status}, Error: ${result.error || "Unknown"}`,
  );

  return result;
}

async function runAllTests() {
  console.log("🚀 Starting Checkout and Payment Flow Tests");
  console.log(`📅 Test run: ${new Date().toISOString()}`);
  console.log(`���� Testing against: ${BASE_URL}`);
  console.log(`💻 Client URL: ${CLIENT_URL}`);

  try {
    // Run all test suites
    await testEnvironmentVariables();
    await testPaymentMethodsEndpoint();
    await testPaymentCreationEndpoint();
    await testPaymentStatusEndpoint();
    await testShippingCalculation();

    // Summary
    logSection("Test Summary");
    console.log(`✅ Passed: ${passedTests}`);
    console.log(`❌ Failed: ${failedTests}`);
    console.log(`📊 Total: ${passedTests + failedTests}`);
    console.log(
      `🎯 Success Rate: ${((passedTests / (passedTests + failedTests)) * 100).toFixed(1)}%`,
    );

    // Save detailed results
    const resultsFile = path.join(__dirname, `test-results-${Date.now()}.json`);
    fs.writeFileSync(
      resultsFile,
      JSON.stringify(
        {
          summary: {
            passed: passedTests,
            failed: failedTests,
            total: passedTests + failedTests,
            successRate: (
              (passedTests / (passedTests + failedTests)) *
              100
            ).toFixed(1),
            timestamp: new Date().toISOString(),
            environment: {
              baseUrl: BASE_URL,
              clientUrl: CLIENT_URL,
              nodeEnv: process.env.NODE_ENV,
            },
          },
          tests: testResults,
        },
        null,
        2,
      ),
    );

    console.log(`\n📄 Detailed results saved to: ${resultsFile}`);

    // Exit with appropriate code
    process.exit(failedTests > 0 ? 1 : 0);
  } catch (error) {
    console.error("❌ Test suite failed:", error);
    process.exit(1);
  }
}

// Manual Testing Instructions
function printManualTestInstructions() {
  console.log("\n📋 Manual Testing Instructions:");
  console.log("=====================================");
  console.log("1. 🛒 Add items to cart at: " + CLIENT_URL);
  console.log("2. 📝 Fill checkout form (Step 1)");
  console.log("3. 💳 Select Razorpay payment (Step 2)");
  console.log("4. 🔄 Complete payment on Razorpay page");
  console.log("5. ✅ Verify success page shows");
  console.log("\n🔗 Key URLs to test:");
  console.log(`   • Cart: ${CLIENT_URL}/cart`);
  console.log(`   • Checkout: ${CLIENT_URL}/checkout`);
  console.log(`   • Payment Methods API: ${BASE_URL}/api/payments/methods`);
  console.log("\n🧪 Test Payment Details:");
  console.log("   • Use any email and phone number");
  console.log("   • Pincode: 144001 (Jalandhar - has shipping)");
  console.log("   • Razorpay test mode will show test payment options");
}

// Run tests if this file is executed directly
if (require.main === module) {
  // Check if we have fetch available (Node 18+)
  if (typeof fetch === "undefined") {
    console.log("⚠️  fetch not available, installing node-fetch...");
    try {
      global.fetch = require("node-fetch");
    } catch (e) {
      console.error("❌ Please install node-fetch: npm install node-fetch");
      console.log("   Or use Node.js 18+ which has fetch built-in");
      process.exit(1);
    }
  }

  runAllTests().then(() => {
    printManualTestInstructions();
  });
}

module.exports = {
  testPaymentMethodsEndpoint,
  testPaymentCreationEndpoint,
  testPaymentStatusEndpoint,
  runAllTests,
};
