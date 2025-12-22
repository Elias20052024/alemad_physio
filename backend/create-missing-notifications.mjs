import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function createMissingNotifications() {
  try {
    // Get all bookings without notifications
    const bookings = await prisma.booking.findMany({
      where: {
        notifications: {
          none: {}
        }
      }
    });

    console.log('Found', bookings.length, 'bookings without notifications');

    for (const booking of bookings) {
      const notification = await prisma.notification.create({
        data: {
          bookingId: booking.id,
          type: 'booking_request',
          title: `New Booking Request from ${booking.name}`,
          message: `Service: ${booking.service} - Phone: ${booking.phone}`,
          isRead: false,
          status: 'pending',
        },
      });
      console.log('✅ Created notification for booking:', booking.id, notification.id);
    }

    console.log('\n✅ All notifications created successfully');
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

createMissingNotifications();
