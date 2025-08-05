#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const serverViewsDir = path.join(__dirname, '../server/views');
const serverDistViewsDir = path.join(__dirname, '../server/dist/views');
const templatePath = path.join(serverViewsDir, 'index.html');

console.log('🔧 Post-build: Copying HTML template...');

try {
  // Ensure server dist views directory exists
  if (!fs.existsSync(serverDistViewsDir)) {
    fs.mkdirSync(serverDistViewsDir, { recursive: true });
    console.log('✅ Created server/dist/views directory');
  }

  // Copy HTML template to server dist
  if (fs.existsSync(templatePath)) {
    const destPath = path.join(serverDistViewsDir, 'index.html');
    fs.copyFileSync(templatePath, destPath);
    console.log('✅ Copied HTML template to server/dist/views/index.html');
  } else {
    console.warn('⚠️  HTML template not found at:', templatePath);
  }

  console.log('🎉 Post-build completed successfully!');
} catch (error) {
  console.error('❌ Post-build error:', error);
  process.exit(1);
}
