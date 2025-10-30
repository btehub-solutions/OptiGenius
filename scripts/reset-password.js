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

async function resetPassword() {
  try {
    console.log('🔄 Password Reset Tool\n');
    
    const email = await question('Enter your email: ');
    
    console.log('\n🔍 Looking up user...');
    
    const user = await prisma.user.findUnique({
      where: { email: email.trim() },
    });

    if (!user) {
      console.log('❌ User not found with that email!');
      rl.close();
      await prisma.$disconnect();
      return;
    }

    console.log('✅ User found!');
    console.log(`   Name: ${user.name || 'Not set'}`);
    console.log(`   Email: ${user.email}\n`);

    const newPassword = await question('Enter new password (min 6 characters): ');
    
    if (newPassword.length < 6) {
      console.log('❌ Password must be at least 6 characters!');
      rl.close();
      await prisma.$disconnect();
      return;
    }

    const confirmPassword = await question('Confirm new password: ');

    if (newPassword !== confirmPassword) {
      console.log('❌ Passwords do not match!');
      rl.close();
      await prisma.$disconnect();
      return;
    }

    console.log('\n🔐 Hashing new password...');
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    console.log('💾 Updating database...');
    await prisma.user.update({
      where: { email: email.trim() },
      data: { password: hashedPassword },
    });

    console.log('\n✅ Password updated successfully!');
    console.log('   You can now log in with your new password.');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    rl.close();
    await prisma.$disconnect();
  }
}

resetPassword();
