import { PrismaClient } from '@prisma/client';

let prisma;
try {
  prisma = new PrismaClient({ errorFormat: 'minimal' });
} catch (error) {
  console.warn('⚠️ Prisma warning:', error.message);
  prisma = null;
}

export const getAllNotifications = async (req, res) => {
  try {
    const { status, isRead } = req.query;
    
    const where = {};
    if (status) where.status = status;
    if (isRead !== undefined) where.isRead = isRead === 'true';

    const notifications = await prisma.notification.findMany({
      where,
      include: {
        booking: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Error fetching notifications', error: error.message });
  }
};

export const getUnreadNotificationsCount = async (req, res) => {
  try {
    const count = await prisma.notification.count({
      where: { isRead: false, status: 'pending' }
    });

    res.json({ count });
  } catch (error) {
    console.error('Error fetching unread count:', error);
    res.status(500).json({ message: 'Error fetching unread count', error: error.message });
  }
};

export const createNotification = async (req, res) => {
  try {
    const { bookingId, type, title, message } = req.body;

    if (!bookingId || !title || !message) {
      return res.status(400).json({ message: 'bookingId, title, and message are required' });
    }

    // Verify booking exists
    const booking = await prisma.booking.findUnique({
      where: { id: parseInt(bookingId) }
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const notification = await prisma.notification.create({
      data: {
        bookingId: parseInt(bookingId),
        type: type || 'booking_request',
        title,
        message,
        isRead: false,
        status: 'pending'
      },
      include: {
        booking: true
      }
    });

    res.status(201).json({ message: 'Notification created successfully', notification });
  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(500).json({ message: 'Error creating notification', error: error.message });
  }
};

export const markNotificationAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await prisma.notification.update({
      where: { id: parseInt(id) },
      data: { isRead: true },
      include: {
        booking: true
      }
    });

    res.json({ message: 'Notification marked as read', notification });
  } catch (error) {
    console.error('Error updating notification:', error);
    res.status(500).json({ message: 'Error updating notification', error: error.message });
  }
};

export const updateNotificationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'accepted' or 'rejected'

    if (!['pending', 'accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Must be pending, accepted, or rejected' });
    }

    const notification = await prisma.notification.update({
      where: { id: parseInt(id) },
      data: { 
        status,
        isRead: true
      },
      include: {
        booking: true
      }
    });

    // If notification is accepted, update booking status
    if (status === 'accepted') {
      await prisma.booking.update({
        where: { id: notification.bookingId },
        data: { status: 'confirmed' }
      });
    }

    res.json({ message: 'Notification status updated', notification });
  } catch (error) {
    console.error('Error updating notification status:', error);
    res.status(500).json({ message: 'Error updating notification status', error: error.message });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.notification.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Notification deleted successfully' });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ message: 'Error deleting notification', error: error.message });
  }
};
