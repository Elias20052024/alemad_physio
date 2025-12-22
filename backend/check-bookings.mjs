import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function checkBookings() {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        notifications: true
      }
    });
    console.log('Total bookings:', bookings.length);
    console.log(JSON.stringify(bookings, null, 2));
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkBookings();
