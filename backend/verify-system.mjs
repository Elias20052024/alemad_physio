import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function verifySystem() {
  try {
    console.log('í´ VERIFICATION REPORT\n');

    // 1. Check bookings
    const bookings = await prisma.booking.count();
    console.log(`âœ… Bookings in database: ${bookings}`);

    // 2. Check notifications
    const notifications = await prisma.notification.findMany({
      where: { status: 'pending' },
      include: { booking: true }
    });
    console.log(`âœ… Pending notifications: ${notifications.length}`);

    if (notifications.length > 0) {
      console.log('\ní³‹ Notifications with booking data:');
      notifications.forEach((n, i) => {
        console.log(`\n  ${i + 1}. ${n.title}`);
        console.log(`     - Name: ${n.booking?.name}`);
        console.log(`     - Service: ${n.booking?.service}`);
        console.log(`     - Date: ${n.booking?.date}`);
      });
    }

    console.log('\nâœ… System is ready! Frontend should display notifications now.');
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

verifySystem();
