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
router.post('/', createBooking); // Create booking
router.get('/', getAllBookings); // Get all bookings
router.get('/:id', getBookingById); // Get single booking

// Admin routes (protected)
router.patch('/:id', updateBookingStatus); // Update status (PATCH)
router.put('/:id/status', authenticateAdmin, updateBookingStatus); // Update status (PUT - legacy)
router.delete('/:id', authenticateAdmin, deleteBooking); // Delete booking

export default router;
