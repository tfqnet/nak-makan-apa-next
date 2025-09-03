#!/usr/bin/env node

/**
 * Build Number Incrementer
 * Run this script before deploying to increment build number
 * Usage: node increment-build.js
 */

const fs = require('fs');
const path = require('path');

const APP_FILE = path.join(__dirname, 'src', 'App.jsx');

try {
  // Read the App.jsx file
  let content = fs.readFileSync(APP_FILE, 'utf8');
  
  // Find current build number
  const buildMatch = content.match(/const BUILD_NUMBER = '(\d+)'/);
  
  if (!buildMatch) {
    console.error('❌ Could not find BUILD_NUMBER in App.jsx');
    process.exit(1);
  }
  
  const currentBuild = parseInt(buildMatch[1]);
  const newBuild = currentBuild + 1;
  const newBuildFormatted = newBuild.toString().padStart(3, '0');
  
  // Replace the build number
  const newContent = content.replace(
    /const BUILD_NUMBER = '\d+'/,
    `const BUILD_NUMBER = '${newBuildFormatted}'`
  );
  
  // Write back to file
  fs.writeFileSync(APP_FILE, newContent, 'utf8');
  
  console.log(`✅ Build number incremented: ${buildMatch[1]} → ${newBuildFormatted}`);
  console.log(`📦 New version: 2.2.0 Build ${newBuildFormatted}`);
  
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
