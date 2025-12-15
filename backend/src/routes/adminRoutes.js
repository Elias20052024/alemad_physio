import express from 'express';
import { adminLogin, createAdmin, getDashboardStats } from '../controllers/adminController.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = express.Router();

router.post('/login', adminLogin);
router.post('/register', createAdmin);
router.get('/stats', authenticateAdmin, getDashboardStats);

export default router;
