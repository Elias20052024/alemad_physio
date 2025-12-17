import express from 'express';
import {
  getAllTherapists,
  getTherapistById,
  createTherapist,
  updateTherapist,
  deleteTherapist,
  getTherapistSchedule,
  createTherapistSchedule,
  createTherapistBreak,
  createTherapistDayOff,
  loginTherapist
} from '../controllers/therapistController.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getAllTherapists);
router.get('/:id', getTherapistById);
router.post('/login', loginTherapist);

// Admin routes (protected)
router.post('/', authenticateAdmin, createTherapist);
router.put('/:id', authenticateAdmin, updateTherapist);
router.delete('/:id', authenticateAdmin, deleteTherapist);

// Schedule routes
router.get('/:id/schedule', getTherapistSchedule);
router.post('/:id/schedule', authenticateAdmin, createTherapistSchedule);

// Breaks and days off
router.post('/:id/breaks', authenticateAdmin, createTherapistBreak);
router.post('/:id/dayoff', authenticateAdmin, createTherapistDayOff);

export default router;
