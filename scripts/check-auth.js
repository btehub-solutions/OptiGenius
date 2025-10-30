const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function checkAuth() {
  try {
    console.log('🔍 Checking authentication setup...\n');

    // Check all users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        password: true,
        createdAt: true,
      },
    });

    console.log(`📊 Total users in database: ${users.length}\n`);

    if (users.length === 0) {
      console.log('⚠️  No users found in database!');
      console.log('   This means registration might have failed or database was reset.\n');
    } else {
      console.log('👥 Users found:');
      users.forEach((user, index) => {
        console.log(`\n${index + 1}. User ID: ${user.id}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Name: ${user.name || 'Not set'}`);
        console.log(`   Has Password: ${user.password ? 'Yes (hashed)' : 'No'}`);
        console.log(`   Created: ${user.createdAt}`);
        
        if (user.password) {
          console.log(`   Password Hash: ${user.password.substring(0, 30)}...`);
        }
      });
    }

    // Test password comparison for the first user with a password
    const userWithPassword = users.find(u => u.password);
    if (userWithPassword) {
      console.log('\n\n🔐 Testing password verification...');
      console.log('   (This will test if bcrypt comparison works)');
      
      // Test with a sample password
      const testPassword = 'test123';
      const isMatch = await bcrypt.compare(testPassword, userWithPassword.password);
      console.log(`   Test password "${testPassword}" matches: ${isMatch}`);
      
      console.log('\n   ℹ️  To test your actual password, you need to know what you registered with.');
    }

    // Check OAuth accounts
    const accounts = await prisma.account.findMany({
      include: {
        user: {
          select: {
            email: true,
            name: true,
          },
        },
      },
    });

    console.log(`\n\n🔗 OAuth Accounts: ${accounts.length}`);
    if (accounts.length > 0) {
      accounts.forEach((account, index) => {
        console.log(`\n${index + 1}. Provider: ${account.provider}`);
        console.log(`   User: ${account.user.email}`);
      });
    } else {
      console.log('   No OAuth accounts found (Google/GitHub not used yet)');
    }

    console.log('\n\n✅ Diagnostic complete!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('\nFull error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAuth();
