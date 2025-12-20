import express from 'express';
import {
  getAllNotifications,
  getUnreadNotificationsCount,
  createNotification,
  markNotificationAsRead,
  updateNotificationStatus,
  deleteNotification
} from '../controllers/notificationController.js';

const router = express.Router();

// Get unread notifications count (must come before /:id routes)
router.get('/unread/count', getUnreadNotificationsCount);

// Get all notifications
router.get('/', getAllNotifications);

// Create notification
router.post('/', createNotification);

// Mark notification as read
router.put('/:id/read', markNotificationAsRead);

// Update notification status (accept/reject)
router.put('/:id/status', updateNotificationStatus);

// Delete notification
router.delete('/:id', deleteNotification);

export default router;
