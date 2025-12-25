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

// Update appointment (public - therapists and admins can update)
router.put('/:id', updateAppointment);
router.patch('/:id/cancel', cancelAppointment);
router.delete('/:id', deleteAppointment);

export default router;
