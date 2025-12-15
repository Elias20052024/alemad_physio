import express from 'express';
import {
  getAllAppointments,
  getAvailableSlots,
  createAppointment,
  updateAppointment,
  cancelAppointment,
  deleteAppointment
} from '../controllers/appointmentController.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getAllAppointments);
router.get('/available-slots', getAvailableSlots);

// Create appointment (public)
router.post('/', createAppointment);

// Admin routes (protected)
router.put('/:id', authenticateAdmin, updateAppointment);
router.patch('/:id/cancel', authenticateAdmin, cancelAppointment);
router.delete('/:id', authenticateAdmin, deleteAppointment);

export default router;
