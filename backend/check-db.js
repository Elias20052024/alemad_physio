import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkDatabase() {
  try {
    const appointments = await prisma.appointment.findMany();
    console.log('Appointments:', appointments.length);
    console.log(JSON.stringify(appointments, null, 2));
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();
