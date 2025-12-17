import express from 'express';
import {
  createBooking,
  getAllBookings,
  getBookingById,
  updateBookingStatus,
  deleteBooking,
} from '../controllers/bookingController.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/booking', createBooking); // Create booking
router.get('/booking', getAllBookings); // Get all bookings
router.get('/booking/:id', getBookingById); // Get single booking

// Admin routes (protected)
router.patch('/booking/:id', updateBookingStatus); // Update status (PATCH)
router.put('/booking/:id/status', authenticateAdmin, updateBookingStatus); // Update status (PUT - legacy)
router.delete('/booking/:id', authenticateAdmin, deleteBooking); // Delete booking

export default router;
