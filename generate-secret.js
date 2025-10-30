// Quick script to generate NEXTAUTH_SECRET
// Run: node generate-secret.js

const crypto = require('crypto');

const secret = crypto.randomBytes(32).toString('base64');

console.log('\n=================================');
console.log('NEXTAUTH_SECRET Generated:');
console.log('=================================');
console.log(secret);
console.log('=================================\n');
console.log('Copy this value and add it to your Vercel environment variables as NEXTAUTH_SECRET');
console.log('\n');
