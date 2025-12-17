import express from 'express';
import { adminLogin, createAdmin, getDashboardStats, getAllAdmins, updateAdmin, deleteAdmin, changeAdminPassword } from '../controllers/adminController.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = express.Router();

router.post('/login', adminLogin);
router.post('/register', createAdmin);
router.get('/stats', authenticateAdmin, getDashboardStats);
router.get('/list', authenticateAdmin, getAllAdmins);
router.put('/:id', authenticateAdmin, updateAdmin);
router.put('/:id/change-password', authenticateAdmin, changeAdminPassword);
router.delete('/:id', authenticateAdmin, deleteAdmin);

export default router;
