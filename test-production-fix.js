// Test the production payment API fix
// Run with: node test-production-fix.js

const BASE_URL = "https://www.floristinindia.com";

async function makeRequest(url) {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-cache",
      "User-Agent": "Production-Test/1.0",
    },
  });

  const text = await response.text();
  return {
    status: response.status,
    headers: Object.fromEntries(response.headers.entries()),
    text,
    json: (() => {
      try {
        return JSON.parse(text);
      } catch {
        return null;
      }
    })(),
  };
}

async function testPaymentEndpoints() {
  console.log("🧪 Testing Payment API Endpoints");
  console.log("================================\n");

  const tests = [
    {
      url: `${BASE_URL}/api/ping`,
      name: "Server Health Check",
      expectJson: true,
    },
    {
      url: `${BASE_URL}/api/payments/test`,
      name: "Payment Test Endpoint",
      expectJson: true,
    },
    {
      url: `${BASE_URL}/api/payments/health`,
      name: "Payment Health Check",
      expectJson: true,
    },
    {
      url: `${BASE_URL}/api/payments/methods-simple`,
      name: "Simple Payment Methods",
      expectJson: true,
    },
    {
      url: `${BASE_URL}/api/payments/methods`,
      name: "Main Payment Methods",
      expectJson: true,
    },
  ];

  let passCount = 0;

  for (const test of tests) {
    console.log(`Testing: ${test.name}`);
    console.log(`URL: ${test.url}`);

    try {
      const result = await makeRequest(test.url);

      console.log(`Status: ${result.status}`);
      console.log(
        `Content-Type: ${result.headers["content-type"] || "not set"}`,
      );

      if (result.status === 200) {
        if (test.expectJson && result.json) {
          console.log(`✅ SUCCESS - Valid JSON response`);
          console.log(`Response:`, JSON.stringify(result.json, null, 2));
          passCount++;
        } else if (test.expectJson && !result.json) {
          console.log(`❌ FAIL - Expected JSON but got:`);
          console.log(result.text.substring(0, 200));
        } else {
          console.log(`✅ SUCCESS - Response received`);
          passCount++;
        }
      } else {
        console.log(`❌ FAIL - HTTP ${result.status}`);
        console.log(`Response:`, result.text.substring(0, 200));
      }
    } catch (error) {
      console.log(`💥 ERROR - ${error.message}`);
    }

    console.log("---\n");

    // Small delay between requests
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  console.log(`📊 FINAL RESULTS: ${passCount}/${tests.length} tests passed\n`);

  if (passCount === tests.length) {
    console.log(
      "🎉 ALL TESTS PASSED! The payment API should be working correctly.",
    );
    console.log(
      "✅ The checkout page should now show payment methods properly.",
    );
  } else {
    console.log(
      "⚠️  Some tests failed. The payment methods might still have issues.",
    );

    if (passCount >= 2) {
      console.log(
        "💡 But some endpoints are working, so the server is responding.",
      );
    }
  }

  return passCount === tests.length;
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

testPaymentEndpoints().catch(console.error);
