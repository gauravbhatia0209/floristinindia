// Quick test for payment API endpoints
// Run with: node test-payment-api.js

const BASE_URL = process.env.TEST_URL || "https://www.floristinindia.com";

async function testAPI(endpoint, description) {
  try {
    console.log(`Testing: ${description}`);
    console.log(`URL: ${BASE_URL}${endpoint}`);

    const response = await fetch(`${BASE_URL}${endpoint}`);
    const text = await response.text();

    console.log(`Status: ${response.status}`);
    console.log(`Content-Type: ${response.headers.get("content-type")}`);

    if (response.headers.get("content-type")?.includes("application/json")) {
      try {
        const data = JSON.parse(text);
        console.log("✅ Valid JSON response:", data);
      } catch (e) {
        console.log("❌ Invalid JSON:", text.substring(0, 200));
      }
    } else {
      console.log("❌ Not JSON response:", text.substring(0, 200));
    }

    console.log("---");
    return response.ok;
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
    console.log("---");
    return false;
  }
}

async function runTests() {
  console.log(`🧪 Testing Payment API endpoints on: ${BASE_URL}\n`);

  const tests = [
    ["/api/payments/health", "Payment API Health Check"],
    ["/api/payments/methods", "Payment Methods"],
    ["/api/ping", "Server Health Check"],
  ];

  let passed = 0;

  for (const [endpoint, description] of tests) {
    const success = await testAPI(endpoint, description);
    if (success) passed++;
  }

  console.log(`\n📊 Results: ${passed}/${tests.length} tests passed`);

  if (passed === tests.length) {
    console.log("🎉 All tests passed! Payment API is working correctly.");
  } else {
    console.log("⚠️  Some tests failed. Check the logs above for details.");
  }
}

// Check if fetch is available (Node 18+)
if (typeof fetch === "undefined") {
  try {
    global.fetch = require("node-fetch");
  } catch (e) {
    console.error("❌ Please install node-fetch: npm install node-fetch");
    console.log("   Or use Node.js 18+ which has fetch built-in");
    process.exit(1);
  }
}

runTests();
