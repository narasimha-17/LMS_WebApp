/**
 * Test Prisma Setup
 * This script verifies that Prisma is properly configured
 * Run with: node test-prisma-setup.js
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');

console.log('=== Prisma Setup Verification ===\n');

let allPassed = true;

// Test 1: Check if .env exists
console.log('1. Checking .env file...');
if (fs.existsSync('.env')) {
  console.log('   ✓ .env file exists');
  
  // Check DATABASE_URL
  const envContent = fs.readFileSync('.env', 'utf8');
  if (envContent.includes('DATABASE_URL=')) {
    console.log('   ✓ DATABASE_URL is configured');
  } else {
    console.log('   ✗ DATABASE_URL not found in .env');
    allPassed = false;
  }
} else {
  console.log('   ✗ .env file not found');
  allPassed = false;
}
console.log('');

// Test 2: Check if Prisma schema exists
console.log('2. Checking Prisma schema...');
if (fs.existsSync('prisma/schema.prisma')) {
  console.log('   ✓ schema.prisma exists');
  const schemaContent = fs.readFileSync('prisma/schema.prisma', 'utf8');
  
  // Check for generator
  if (schemaContent.includes('generator client')) {
    console.log('   ✓ Generator configured');
  } else {
    console.log('   ✗ Generator not found');
    allPassed = false;
  }
  
  // Check for datasource
  if (schemaContent.includes('datasource db')) {
    console.log('   ✓ Datasource configured');
  } else {
    console.log('   ✗ Datasource not found');
    allPassed = false;
  }
  
  // Count models
  const modelCount = (schemaContent.match(/^model /gm) || []).length;
  console.log(`   ✓ Found ${modelCount} models`);
} else {
  console.log('   ✗ schema.prisma not found');
  allPassed = false;
}
console.log('');

// Test 3: Check if Prisma Client is generated
console.log('3. Checking Prisma Client...');
if (fs.existsSync('generated/prisma')) {
  console.log('   ✓ Prisma Client generated');
  
  // Check for index files
  if (fs.existsSync('generated/prisma/index.js')) {
    console.log('   ✓ Client index.js exists');
  }
  if (fs.existsSync('generated/prisma/index.d.ts')) {
    console.log('   ✓ TypeScript definitions exist');
  }
} else {
  console.log('   ✗ Prisma Client not generated');
  console.log('   → Run: npm run prisma:generate');
  allPassed = false;
}
console.log('');

// Test 4: Check if node_modules has Prisma packages
console.log('4. Checking Prisma packages...');
if (fs.existsSync('node_modules/@prisma/client')) {
  console.log('   ✓ @prisma/client installed');
} else {
  console.log('   ✗ @prisma/client not installed');
  console.log('   → Run: npm install');
  allPassed = false;
}

if (fs.existsSync('node_modules/prisma')) {
  console.log('   ✓ prisma CLI installed');
} else {
  console.log('   ✗ prisma CLI not installed');
  console.log('   → Run: npm install');
  allPassed = false;
}
console.log('');

// Test 5: Try to load Prisma Client
console.log('5. Testing Prisma Client import...');
try {
  const { PrismaClient } = require('./generated/prisma');
  console.log('   ✓ Prisma Client can be imported');
  
  const prisma = new PrismaClient();
  console.log('   ✓ Prisma Client can be instantiated');
  
  // Test 6: Try to connect to database
  console.log('');
  console.log('6. Testing database connection...');
  
  (async () => {
    try {
      await prisma.$connect();
      console.log('   ✓ Successfully connected to database!');
      console.log('');
      
      // Try a simple query
      console.log('7. Testing database query...');
      const count = await prisma.certification.count();
      console.log(`   ✓ Query successful! Found ${count} certifications`);
      console.log('');
      
      console.log('=== All Tests Passed! ===');
      console.log('');
      console.log('Your Prisma setup is complete and working! 🎉');
      console.log('');
      console.log('Next steps:');
      console.log('  • Run: npm run start:prisma');
      console.log('  • Visit: http://localhost:4000/api/certifications');
      console.log('  • Explore: npm run prisma:studio');
      console.log('');
      
    } catch (error) {
      console.log('   ✗ Database connection failed');
      console.log(`   Error: ${error.message}`);
      console.log('');
      console.log('=== Setup Incomplete ===');
      console.log('');
      console.log('Database is not accessible. Please:');
      console.log('  1. Make sure MySQL is running');
      console.log('  2. Create database: CREATE DATABASE cms_dev;');
      console.log('  3. Import backup: mysql -u root -p cms_dev < emsdb_backup.sql');
      console.log('  4. Update DATABASE_URL in .env file');
      console.log('');
      console.log('Or run the automated setup:');
      console.log('  .\\setup-database.ps1');
      console.log('');
    } finally {
      await prisma.$disconnect();
    }
  })();
  
} catch (error) {
  console.log('   ✗ Failed to import Prisma Client');
  console.log(`   Error: ${error.message}`);
  console.log('');
  console.log('=== Setup Incomplete ===');
  console.log('');
  console.log('Please run:');
  console.log('  npm install');
  console.log('  npm run prisma:generate');
  console.log('');
  allPassed = false;
}
