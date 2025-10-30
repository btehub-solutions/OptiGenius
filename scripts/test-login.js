const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const readline = require('readline');

const prisma = new PrismaClient();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function testLogin() {
  try {
    console.log('🔐 Login Test Tool\n');
    
    const email = await question('Enter your email: ');
    const password = await question('Enter your password: ');
    
    console.log('\n🔍 Looking up user...');
    
    const user = await prisma.user.findUnique({
      where: { email: email.trim() },
    });

    if (!user) {
      console.log('❌ User not found with that email!');
      console.log('   Make sure you entered the correct email address.');
      rl.close();
      await prisma.$disconnect();
      return;
    }

    console.log('✅ User found!');
    console.log(`   Name: ${user.name || 'Not set'}`);
    console.log(`   Email: ${user.email}`);

    if (!user.password) {
      console.log('❌ This user has no password set!');
      console.log('   This account might have been created via Google/GitHub.');
      rl.close();
      await prisma.$disconnect();
      return;
    }

    console.log('\n🔐 Testing password...');
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      console.log('✅ PASSWORD MATCHES! Login should work.');
      console.log('   If you still get "Invalid email or password", there might be a session issue.');
      console.log('   Try clearing your browser cache/cookies and try again.');
    } else {
      console.log('❌ PASSWORD DOES NOT MATCH!');
      console.log('   The password you entered is incorrect.');
      console.log('\n   Options:');
      console.log('   1. Try again with the correct password');
      console.log('   2. Use the reset-password.js script to set a new password');
      console.log('   3. Register a new account with a different email');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    rl.close();
    await prisma.$disconnect();
  }
}

testLogin();
