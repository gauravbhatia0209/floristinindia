#!/usr/bin/env node

// Simple test script to verify meta tag generation
import { generateMetaData } from "./server/routes/meta.js";

async function testMetaTags() {
  console.log("🧪 Testing meta tag generation...\n");

  const testPaths = [
    "/",
    "/category/roses",
    "/product/red-roses",
    "/pages/about",
    "/contact",
  ];

  for (const path of testPaths) {
    try {
      console.log(`Testing path: ${path}`);
      const metaData = await generateMetaData(path);
      console.log(`✅ Title: ${metaData.title}`);
      console.log(
        `✅ Description: ${metaData.description.substring(0, 100)}...`,
      );
      console.log(`✅ Canonical: ${metaData.canonical}\n`);
    } catch (error) {
      console.error(`❌ Error for ${path}:`, error.message);
    }
  }
}

testMetaTags().catch(console.error);
