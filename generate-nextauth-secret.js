#!/usr/bin/env node

/**
 * Generate NEXTAUTH_SECRET for OptiGenius
 * Run: node generate-nextauth-secret.js
 */

const crypto = require('crypto');

console.log('\n🔐 Generating NEXTAUTH_SECRET...\n');

const secret = crypto.randomBytes(32).toString('base64');

console.log('Your NEXTAUTH_SECRET:');
console.log('━'.repeat(60));
console.log(secret);
console.log('━'.repeat(60));
console.log('\n✅ Copy this value and add it to your Vercel environment variables');
console.log('   Variable name: NEXTAUTH_SECRET');
console.log('   Variable value: (the string above)');
console.log('\n📝 Make sure to set it for Production, Preview, and Development environments\n');
