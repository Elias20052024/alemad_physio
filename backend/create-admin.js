import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    console.log('Ì±§ Creating admin user...');
    
    const adminUser = await prisma.user.create({
      data: {
        email: 'admin@alemad.com',
        password: await bcrypt.hash('admin123', 10),
        name: 'Admin User',
        role: 'admin',
      },
    });

    const admin = await prisma.admin.create({
      data: {
        userId: adminUser.id,
        status: 'active',
      },
    });

    console.log('‚úÖ Admin created successfully!');
    console.log('Ì≥ß Email: admin@alemad.com');
    console.log('Ì¥ê Password: admin123');
  } catch (error) {
    console.error('‚ùå Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
