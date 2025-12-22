import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function check() {
  try {
    const bookings = await prisma.booking.count();
    const notifications = await prisma.notification.count();
    console.log('Bookings:', bookings);
    console.log('Notifications:', notifications);
    
    if (bookings > 0) {
      const pendingNotif = await prisma.notification.count({
        where: { status: 'pending' }
      });
      console.log('Pending notifications:', pendingNotif);
    }
  } finally {
    await prisma.$disconnect();
  }
}

check();
