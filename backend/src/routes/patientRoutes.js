import express from 'express';
import {
  getAllPatients,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient,
  getPatientAppointments,
  registerPatient,
  loginPatient
} from '../controllers/patientController.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public auth routes
router.post('/register', registerPatient);
router.post('/login', loginPatient);

// Public routes
router.get('/', getAllPatients);
router.get('/:id', getPatientById);
router.get('/:id/appointments', getPatientAppointments);
router.post('/', createPatient);

// Admin routes (protected)
router.put('/:id', authenticateAdmin, updatePatient);
router.delete('/:id', authenticateAdmin, deletePatient);

export default router;
