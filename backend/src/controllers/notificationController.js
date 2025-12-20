import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllNotifications = async (req, res) => {
  try {
    const { status, isRead } = req.query;
    
    const where = {};
    if (status) where.status = status;
    if (isRead !== undefined) where.isRead = isRead === 'true';

    const notifications = await prisma.notification.findMany({
      where,
      include: {
        appointment: {
          include: {
            patient: { include: { user: true } },
            therapist: { include: { user: true } }
          }
        }
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
    const { appointmentId, type, title, message } = req.body;

    if (!appointmentId || !title || !message) {
      return res.status(400).json({ message: 'appointmentId, title, and message are required' });
    }

    // Verify appointment exists
    const appointment = await prisma.appointment.findUnique({
      where: { id: parseInt(appointmentId) }
    });

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    const notification = await prisma.notification.create({
      data: {
        appointmentId: parseInt(appointmentId),
        type: type || 'booking_request',
        title,
        message,
        isRead: false,
        status: 'pending'
      },
      include: {
        appointment: {
          include: {
            patient: { include: { user: true } },
            therapist: { include: { user: true } }
          }
        }
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
        appointment: {
          include: {
            patient: { include: { user: true } },
            therapist: { include: { user: true } }
          }
        }
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
        appointment: {
          include: {
            patient: { include: { user: true } },
            therapist: { include: { user: true } }
          }
        }
      }
    });

    // If notification is accepted, update appointment status
    if (status === 'accepted') {
      await prisma.appointment.update({
        where: { id: notification.appointmentId },
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
