const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkNotifications() {
  try {
    const notifications = await prisma.notification.findMany({
      include: {
        booking: true,
        appointment: true
      }
    });
    console.log('Total notifications:', notifications.length);
    console.log(JSON.stringify(notifications, null, 2));
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkNotifications();
