import React, { useState, useEffect } from 'react';
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Box,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import VisibilityIcon from '@mui/icons-material/Visibility';

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [actionType, setActionType] = useState(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  useEffect(() => {
    fetchBookings();
    // Refresh bookings every 30 seconds
    const interval = setInterval(fetchBookings, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://alemad-physio.onrender.com/api/booking');
      const data = await response.json();
      if (data.success) {
        // Sort by most recent first
        setBookings(data.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setMessage('Error loading bookings');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setOpenDialog(true);
    setActionType(null);
  };

  const handleAccept = () => {
    setActionType('accept');
  };

  const handleDecline = () => {
    setActionType('decline');
  };

  const handleConfirmAction = async () => {
    if (!selectedBooking || !actionType) return;

    try {
      const newStatus = actionType === 'accept' ? 'confirmed' : 'declined';
      const response = await fetch(
        `https://alemad-physio.onrender.com/api/booking/${selectedBooking.id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      const data = await response.json();
      if (data.success) {
        setMessage(`Booking ${newStatus} successfully!`);
        setMessageType('success');
        setOpenDialog(false);
        setActionType(null);
        fetchBookings();
      } else {
        setMessage('Error updating booking');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Error updating booking:', error);
      setMessage('Error updating booking');
      setMessageType('error');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'confirmed':
        return 'success';
      case 'declined':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
        📅 Manage Bookings
      </Typography>

      {message && (
        <Alert severity={messageType} sx={{ mb: 2 }} onClose={() => setMessage('')}>
          {message}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: '#1C6FB5' }}>
            <TableRow>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Client Name</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Phone</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Service</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Requested Date</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Status</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                  <Typography color="textSecondary">No bookings found</Typography>
                </TableCell>
              </TableRow>
            ) : (
              bookings.map((booking) => (
                <TableRow key={booking.id} hover>
                  <TableCell sx={{ fontWeight: '500' }}>{booking.name}</TableCell>
                  <TableCell>{booking.phone}</TableCell>
                  <TableCell>{booking.service}</TableCell>
                  <TableCell sx={{ fontSize: '0.9rem' }}>
                    {formatDate(booking.date)}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={booking.status?.toUpperCase()}
                      color={getStatusColor(booking.status)}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      startIcon={<VisibilityIcon />}
                      size="small"
                      variant="outlined"
                      onClick={() => handleViewDetails(booking)}
                      sx={{ mr: 1 }}
                    >
                      Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Details Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ backgroundColor: '#1C6FB5', color: 'white', fontWeight: 'bold' }}>
          Booking Details
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          {selectedBooking && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Typography variant="caption" color="textSecondary">
                  Client Name
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  {selectedBooking.name}
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="textSecondary">
                  Phone Number
                </Typography>
                <Typography variant="body1">{selectedBooking.phone}</Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="textSecondary">
                  Service
                </Typography>
                <Typography variant="body1">{selectedBooking.service}</Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="textSecondary">
                  Requested Date & Time
                </Typography>
                <Typography variant="body1">
                  {formatDate(selectedBooking.date)}
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="textSecondary">
                  Message
                </Typography>
                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', mt: 0.5 }}>
                  {selectedBooking.message || '(No message provided)'}
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="textSecondary">
                  Booking Date
                </Typography>
                <Typography variant="body2">
                  {formatDate(selectedBooking.createdAt)}
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="textSecondary">
                  Current Status
                </Typography>
                <Chip
                  label={selectedBooking.status?.toUpperCase()}
                  color={getStatusColor(selectedBooking.status)}
                  sx={{ mt: 0.5 }}
                />
              </Box>

              {actionType && (
                <Alert severity={actionType === 'accept' ? 'success' : 'error'} sx={{ mt: 2 }}>
                  {actionType === 'accept'
                    ? 'Are you sure you want to confirm this booking?'
                    : 'Are you sure you want to decline this booking?'}
                </Alert>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>

          {!actionType ? (
            <>
              <Button
                onClick={handleDecline}
                startIcon={<CancelIcon />}
                color="error"
                variant="outlined"
              >
                Decline
              </Button>
              <Button
                onClick={handleAccept}
                startIcon={<CheckCircleIcon />}
                color="success"
                variant="contained"
              >
                Accept
              </Button>
            </>
          ) : (
            <>
              <Button onClick={() => setActionType(null)}>Back</Button>
              <Button
                onClick={handleConfirmAction}
                color={actionType === 'accept' ? 'success' : 'error'}
                variant="contained"
              >
                Confirm {actionType === 'accept' ? 'Accept' : 'Decline'}
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ManageBookings;
