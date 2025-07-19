// Production API Debug Script
// Run with: node debug-production-api.js

const BASE_URL = "https://www.floristinindia.com";

async function testEndpoint(endpoint, description) {
  console.log(`\n🧪 Testing: ${description}`);
  console.log(`📍 URL: ${BASE_URL}${endpoint}`);

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "User-Agent": "Debug-Script/1.0",
      },
    });

    console.log(`📊 Status: ${response.status} ${response.statusText}`);
    console.log(`📋 Headers:`, Object.fromEntries(response.headers.entries()));

    const text = await response.text();
    console.log(`📝 Raw Response (first 500 chars):`, text.substring(0, 500));

    if (response.headers.get("content-type")?.includes("application/json")) {
      try {
        const data = JSON.parse(text);
        console.log(`✅ Parsed JSON:`, data);
        return { success: true, data };
      } catch (e) {
        console.log(`❌ JSON Parse Error:`, e.message);
        return { success: false, error: "Invalid JSON", raw: text };
      }
    } else {
      console.log(`⚠️  Non-JSON response`);
      return { success: false, error: "Non-JSON response", raw: text };
    }
  } catch (error) {
    console.log(`💥 Request Failed:`, error.message);
    return { success: false, error: error.message };
  }
}

async function runDiagnostics() {
  console.log(`🔍 API Diagnostics for: ${BASE_URL}`);
  console.log(`⏰ Started at: ${new Date().toISOString()}`);

  const endpoints = [
    ["/api/ping", "Server Health Check"],
    ["/api/payments/test", "Payment Test Endpoint"],
    ["/api/payments/health", "Payment Health Check"],
    ["/api/payments/methods", "Payment Methods (Main Issue)"],
  ];

  const results = [];

  for (const [endpoint, description] of endpoints) {
    const result = await testEndpoint(endpoint, description);
    results.push({ endpoint, description, ...result });

    // Small delay between requests
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  console.log(`\n📊 SUMMARY REPORT`);
  console.log(`================`);

  let passCount = 0;
  results.forEach((result) => {
    const status = result.success ? "✅ PASS" : "❌ FAIL";
    console.log(`${status} ${result.endpoint} - ${result.description}`);
    if (result.success) passCount++;
    if (!result.success && result.error) {
      console.log(`    Error: ${result.error}`);
    }
  });

  console.log(`\n🎯 Results: ${passCount}/${results.length} endpoints working`);

  if (passCount < results.length) {
    console.log(`\n🔧 TROUBLESHOOTING STEPS:`);
    console.log(`1. Check if the server is running properly`);
    console.log(`2. Verify payment routes are mounted correctly`);
    console.log(`3. Check server logs for detailed error information`);
    console.log(`4. Ensure latest code is deployed`);
  }

  return results;
}

// Check if fetch is available
if (typeof fetch === "undefined") {
  try {
    global.fetch = require("node-fetch");
  } catch (e) {
    console.error("❌ Please install node-fetch: npm install node-fetch");
    process.exit(1);
  }
}

runDiagnostics().catch(console.error);
