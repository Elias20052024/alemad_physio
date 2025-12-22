import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function addTherapist() {
  try {
    const therapistUser = await prisma.user.create({
      data: {
        email: 'therapist@alemad.com',
        password: await bcrypt.hash('therapist123', 10),
        name: 'Dr. Ahmed',
        role: 'therapist',
      },
    });

    const therapist = await prisma.therapist.create({
      data: {
        userId: therapistUser.id,
        specialization: 'Physiotherapy',
        phone: '+966501234567',
        availability: 'Mon-Fri 9AM-5PM',
        status: 'active',
      },
    });

    console.log('✅ Therapist created:', therapist.id);
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

addTherapist();
