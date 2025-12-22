import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  Badge,
  IconButton,
  Chip,
  Box,
  Typography,
  Divider,
  CircularProgress,
  Alert,
  Card,
  CardContent
} from '@mui/material';
import { Notifications as NotificationsIcon, Close as CloseIcon, CheckCircle, Cancel } from '@mui/icons-material';
import apiClient from '../services/api';
import { useLanguage } from '../context/LanguageContext';

const NotificationCenter = () => {
  const { language } = useLanguage();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/notifications?status=pending');
      setNotifications(response.data || []);
      
      // Count unread
      const unread = response.data?.filter(n => !n.isRead).length || 0;
      setUnreadCount(unread);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Refresh notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleOpenDialog = () => {
    setOpen(true);
    fetchNotifications();
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  const handleAccept = async (notificationId, appointmentId) => {
    try {
      await apiClient.put(`/notifications/${notificationId}/status`, { status: 'accepted' });
      fetchNotifications();
    } catch (error) {
      console.error('Error accepting notification:', error);
    }
  };

  const handleReject = async (notificationId) => {
    try {
      await apiClient.put(`/notifications/${notificationId}/status`, { status: 'rejected' });
      fetchNotifications();
    } catch (error) {
      console.error('Error rejecting notification:', error);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await apiClient.put(`/notifications/${notificationId}/read`);
      fetchNotifications();
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'accepted':
        return 'success';
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <>
      {/* Notification Bell Icon */}
      <IconButton
        onClick={handleOpenDialog}
        sx={{
          position: 'relative',
          color: '#1C6FB5',
          '&:hover': { backgroundColor: 'rgba(28, 111, 181, 0.1)' }
        }}
      >
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      {/* Notification Dialog */}
      <Dialog open={open} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ fontWeight: 'bold', fontSize: '1.25rem' }}>
            {language === 'ar' ? 'الإشعارات' : 'Notifications'}
          </Box>
          <IconButton size="small" onClick={handleCloseDialog}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <Divider />

        <DialogContent sx={{ minHeight: '300px', maxHeight: '500px', overflow: 'auto' }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
              <CircularProgress />
            </Box>
          ) : notifications.length === 0 ? (
            <Alert severity="info">
              {language === 'ar' ? 'لا توجد إشعارات' : 'No notifications'}
            </Alert>
          ) : (
            <List sx={{ width: '100%' }}>
              {notifications.map((notification, index) => (
                <React.Fragment key={notification.id}>
                  <ListItem
                    sx={{
                      mb: 2,
                      p: 2,
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                      backgroundColor: notification.isRead ? '#fafafa' : '#f0f7ff',
                      '&:hover': { backgroundColor: '#e3f2fd' }
                    }}
                  >
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', flex: 1 }}>
                            {notification.title}
                          </Typography>
                          <Chip
                            label={notification.status}
                            color={getStatusColor(notification.status)}
                            size="small"
                          />
                        </Box>
                      }
                      secondary={
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                            {notification.message}
                          </Typography>
                          
                          {/* Display booking details if available */}
                          {notification.appointment && (
                            <Box sx={{ mt: 2, p: 1.5, backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
                              <Typography variant="caption" sx={{ display: 'block', fontWeight: 'bold', mb: 1 }}>
                                {language === 'ar' ? 'تفاصيل الحجز:' : 'Booking Details:'}
                              </Typography>
                              
                              {notification.appointment.startTime && (
                                <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>
                                  <strong>{language === 'ar' ? 'الوقت:' : 'Time:'}</strong> {notification.appointment.startTime}
                                </Typography>
                              )}
                              
                              {notification.appointment.therapist?.specialization && (
                                <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>
                                  <strong>{language === 'ar' ? 'الخدمة:' : 'Service:'}</strong> {notification.appointment.therapist.specialization}
                                </Typography>
                              )}
                              
                              {notification.appointment.notes && (
                                <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>
                                  <strong>{language === 'ar' ? 'ملاحظات:' : 'Notes:'}</strong> {notification.appointment.notes}
                                </Typography>
                              )}
                            </Box>
                          )}
                          
                          <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mt: 1 }}>
                            {new Date(notification.createdAt).toLocaleString()}
                          </Typography>
                          {notification.status === 'pending' && (
                            <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                              <Button
                                size="small"
                                variant="contained"
                                color="success"
                                startIcon={<CheckCircle />}
                                onClick={() => handleAccept(notification.id, notification.appointmentId)}
                                sx={{ flex: 1 }}
                              >
                                {language === 'ar' ? 'قبول' : 'Accept'}
                              </Button>
                              <Button
                                size="small"
                                variant="outlined"
                                color="error"
                                startIcon={<Cancel />}
                                onClick={() => handleReject(notification.id)}
                                sx={{ flex: 1 }}
                              >
                                {language === 'ar' ? 'رفض' : 'Reject'}
                              </Button>
                            </Box>
                          )}
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < notifications.length - 1 && <Divider sx={{ my: 1 }} />}
                </React.Fragment>
              ))}
            </List>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseDialog} variant="contained">
            {language === 'ar' ? 'إغلاق' : 'Close'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default NotificationCenter;
