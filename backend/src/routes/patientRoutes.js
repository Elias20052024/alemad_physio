import express from 'express';
import {
  getAllPatients,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient,
  getPatientAppointments
} from '../controllers/patientController.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getAllPatients);
router.get('/:id', getPatientById);
router.get('/:id/appointments', getPatientAppointments);

// Admin routes (protected)
router.post('/', authenticateAdmin, createPatient);
router.put('/:id', authenticateAdmin, updatePatient);
router.delete('/:id', authenticateAdmin, deletePatient);

export default router;
