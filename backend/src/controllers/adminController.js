import { PrismaClient } from '@prisma/client';
import { hashPassword, comparePassword } from '../utils/password.js';
import { generateToken } from '../utils/jwt.js';

const prisma = new PrismaClient();

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    const admin = await prisma.admin.findUnique({ where: { email } });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await comparePassword(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(admin.id, admin.email);
    res.json({
      token,
      admin: { id: admin.id, name: admin.name, email: admin.email }
    });
  } catch (error) {
    res.status(500).json({ message: 'Login error', error: error.message });
  }
};

export const createAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields required' });
    }

    const existingAdmin = await prisma.admin.findUnique({ where: { email } });
    if (existingAdmin) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const hashedPassword = await hashPassword(password);
    const admin = await prisma.admin.create({
      data: { name, email, password: hashedPassword }
    });

    res.status(201).json({
      message: 'Admin created',
      admin: { id: admin.id, name: admin.name, email: admin.email }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating admin', error: error.message });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    const [totalTherapists, totalPatients, appointmentsToday, upcomingAppointments] = await Promise.all([
      prisma.therapist.count(),
      prisma.patient.count(),
      prisma.appointment.count({
        where: {
          date: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
            lt: new Date(new Date().setHours(23, 59, 59, 999))
          }
        }
      }),
      prisma.appointment.count({
        where: {
          date: { gte: new Date() }
        }
      })
    ]);

    res.json({
      totalTherapists,
      totalPatients,
      appointmentsToday,
      upcomingAppointments
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stats', error: error.message });
  }
};
