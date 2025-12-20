import express from 'express';
import { adminLogin, createAdmin, getDashboardStats, getAllAdmins, updateAdmin, deleteAdmin, changeAdminPassword, resetUserPassword, getAllUsers } from '../controllers/adminController.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = express.Router();

router.post('/login', adminLogin);
router.post('/register', createAdmin);
router.get('/stats', authenticateAdmin, getDashboardStats);
router.get('/list', authenticateAdmin, getAllAdmins);
router.get('/users', authenticateAdmin, getAllUsers); // Get all patients and therapists
router.put('/:id', authenticateAdmin, updateAdmin);
router.put('/:id/change-password', authenticateAdmin, changeAdminPassword);
router.post('/reset-user-password', authenticateAdmin, resetUserPassword); // Reset any user's password
router.delete('/:id', authenticateAdmin, deleteAdmin);

export default router;
