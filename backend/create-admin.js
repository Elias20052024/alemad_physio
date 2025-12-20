import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function createAdmin() {
  try {
    const user = await prisma.user.findUnique({
      where: { email: 'mohammadahmedwg@gmail.com' },
      include: { admin: true }
    });
    
    console.log('User found:', user);
    
    if (user && !user.admin) {
      const admin = await prisma.admin.create({
        data: { userId: user.id }
      });
      console.log('✅ Admin record created:', admin);
    } else if (user && user.admin) {
      console.log('✅ Admin record already exists');
    }
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
