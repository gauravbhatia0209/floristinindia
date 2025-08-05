// Test script to verify robots and canonical meta tag implementation
// Run with: node test-robots-canonical.js

const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function testMetaGeneration() {
  console.log('🧪 Testing Robots and Canonical Implementation\n');

  const testPaths = [
    '/',
    '/about',
    '/contact',
    '/category/birthday-flowers', 
    '/product/red-roses-bouquet',
    '/pages/privacy-policy'
  ];

  for (const path of testPaths) {
    try {
      console.log(`Testing: ${path}`);
      
      // Test meta API endpoint
      const metaResponse = await axios.get(`${BASE_URL}/api/meta?pathname=${encodeURIComponent(path)}`);
      const metaData = metaResponse.data;
      
      console.log(`  ✅ Meta API Response:`);
      console.log(`     Title: ${metaData.title}`);
      console.log(`     Description: ${metaData.description?.substring(0, 80)}...`);
      console.log(`     Canonical: ${metaData.canonical || 'Not set'}`);
      console.log(`     Robots: ${metaData.robots || 'Not set'}`);
      
      // Test actual HTML output
      const htmlResponse = await axios.get(`${BASE_URL}${path}`, {
        headers: { 'Accept': 'text/html' }
      });
      
      const html = htmlResponse.data;
      
      // Check for canonical tag
      const canonicalMatch = html.match(/<link rel="canonical" href="([^"]+)"/);
      const canonicalUrl = canonicalMatch ? canonicalMatch[1] : null;
      
      // Check for robots tag  
      const robotsMatch = html.match(/<meta name="robots" content="([^"]+)"/);
      const robotsContent = robotsMatch ? robotsMatch[1] : null;
      
      console.log(`  🔍 HTML Output:`);
      console.log(`     Canonical in HTML: ${canonicalUrl || 'Not found'}`);
      console.log(`     Robots in HTML: ${robotsContent || 'Not found'}`);
      
      if (canonicalUrl && robotsContent) {
        console.log(`  ✅ Both canonical and robots tags found in HTML`);
      } else {
        console.log(`  ❌ Missing tags in HTML output`);
      }
      
      console.log('');
      
    } catch (error) {
      console.log(`  ❌ Error testing ${path}: ${error.message}`);
      console.log('');
    }
  }
}

// Run the test
testMetaGeneration().catch(console.error);
