import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function resetPassword() {
  try {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const user = await prisma.user.update({
      where: { email: 'mohammadahmedwg@gmail.com' },
      data: { password: hashedPassword }
    });
    console.log('✅ Password reset successfully!');
    console.log('Email: mohammadahmedwg@gmail.com');
    console.log('Password: admin123');
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

resetPassword();
