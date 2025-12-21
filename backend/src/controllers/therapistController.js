import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { isValidTimeFormat } from '../utils/validation.js';

const prisma = new PrismaClient();

export const getAllTherapists = async (req, res) => {
  try {
    const therapists = await prisma.therapist.findMany({
      include: {
        user: true,
        appointments: true
      }
    });

    res.json(therapists);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching therapists', error: error.message });
  }
};

export const getTherapistById = async (req, res) => {
  try {
    const { id } = req.params;
    const therapist = await prisma.therapist.findUnique({
      where: { id: parseInt(id) },
      include: {
        user: true,
        appointments: {
          include: { patient: true }
        }
      }
    });

    if (!therapist) {
      c
      return res.status(404).json({ message: 'Therapist not found' });
    }

    res.json(therapist);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching therapist', error: error.message });
  }
};

export const createTherapist = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    // Validate all fields are present
    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: 'All fields are required: name, email, phone, password' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Validate phone format - must be valid phone number
    const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
    if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
      return res.status(400).json({ message: 'Invalid phone number format. Use format like: +966501234567 or (050) 123-4567' });
    }

    // Validate name is not just whitespace
    if (name.trim().length === 0) {
      return res.status(400).json({ message: 'Name cannot be empty' });
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: 'A therapist with this email already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with therapist role
    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        role: 'therapist'
      }
    });

    // Create therapist record linked to user
    const therapist = await prisma.therapist.create({
      data: {
        userId: user.id,
        phone: phone.trim()
      },
      include: {
        user: true
      }
    });

    res.status(201).json({ message: 'Therapist created successfully', therapist });
  } catch (error) {
    res.status(500).json({ message: 'Error creating therapist', error: error.message });
  }
};

export const updateTherapist = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, specialty, email, phone, password, status } = req.body;

    // Get the therapist with user info
    const therapist = await prisma.therapist.findUnique({
      where: { id: parseInt(id) },
      include: { user: true }
    });

    if (!therapist) {
      return res.status(404).json({ message: 'Therapist not found' });
    }

    // If email is being updated, validate format
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
      }

      // Check if email already exists for another user
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser && existingUser.id !== therapist.userId) {
        return res.status(409).json({ message: 'A user with this email already exists' });
      }
    }

    // If phone is being updated, validate format
    if (phone) {
      const phoneRegex = /^[0-9+\-\s()]+$/;
      if (!phoneRegex.test(phone) || phone.length < 7) {
        return res.status(400).json({ message: 'Invalid phone number format' });
      }
    }

    // Update therapist fields
    const updatedTherapist = await prisma.therapist.update({
      where: { id: parseInt(id) },
      data: {
        ...(specialty && { specialization: specialty.trim() }),
        ...(phone && { phone: phone.trim() }),
        ...(status && { status: status.trim() })
      },
      include: { user: true }
    });

    // Update user name if provided
    if (name) {
      await prisma.user.update({
        where: { id: therapist.userId },
        data: { name: name.trim() }
      });
      updatedTherapist.user.name = name.trim();
    }

    // Update user email if provided
    if (email) {
      await prisma.user.update({
        where: { id: therapist.userId },
        data: { email: email.toLowerCase().trim() }
      });
      updatedTherapist.user.email = email.toLowerCase().trim();
    }

    // Update password if provided
    if (password && password.trim().length > 0) {
      const hashedPassword = await bcrypt.hash(password, 10);
      const updatedUser = await prisma.user.update({
        where: { id: therapist.userId },
        data: { password: hashedPassword }
      });
      updatedTherapist.user = updatedUser; // Replace with fresh user data from database
    }

    res.json({ message: 'Therapist updated successfully', therapist: updatedTherapist });
  } catch (error) {
    res.status(500).json({ message: 'Error updating therapist', error: error.message });
  }
};

export const deleteTherapist = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.therapist.delete({ where: { id: parseInt(id) } });
    res.json({ message: 'Therapist deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting therapist', error: error.message });
  }
};

export const getTherapistSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    const schedule = await prisma.therapistSchedule.findMany({
      where: { therapistId: parseInt(id) }
    });
    res.json(schedule);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching schedule', error: error.message });
  }
};

export const createTherapistSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    const { dayOfWeek, startTime, endTime } = req.body;

    if (!dayOfWeek || !startTime || !endTime) {
      return res.status(400).json({ message: 'All fields required' });
    }

    if (!isValidTimeFormat(startTime) || !isValidTimeFormat(endTime)) {
      return res.status(400).json({ message: 'Invalid time format. Use HH:mm' });
    }

    const schedule = await prisma.therapistSchedule.upsert({
      where: { therapistId_dayOfWeek: { therapistId: parseInt(id), dayOfWeek } },
      update: { startTime, endTime },
      create: { therapistId: parseInt(id), dayOfWeek, startTime, endTime }
    });

    res.json({ message: 'Schedule updated', schedule });
  } catch (error) {
    res.status(500).json({ message: 'Error saving schedule', error: error.message });
  }
};

export const createTherapistBreak = async (req, res) => {
  try {
    const { id } = req.params;
    const { startTime, endTime } = req.body;

    if (!startTime || !endTime) {
      return res.status(400).json({ message: 'Start and end time required' });
    }

    const breakRecord = await prisma.therapistBreak.create({
      data: {
        therapistId: parseInt(id),
        startTime: new Date(startTime),
        endTime: new Date(endTime)
      }
    });

    res.status(201).json({ message: 'Break added', break: breakRecord });
  } catch (error) {
    res.status(500).json({ message: 'Error adding break', error: error.message });
  }
};

export const createTherapistDayOff = async (req, res) => {
  try {
    const { id } = req.params;
    const { date } = req.body;

    if (!date) {
      return res.status(400).json({ message: 'Date required' });
    }

    const dayOff = await prisma.therapistDayOff.upsert({
      where: {
        therapistId_date: {
          therapistId: parseInt(id),
          date: new Date(date)
        }
      },
      update: {},
      create: {
        therapistId: parseInt(id),
        date: new Date(date)
      }
    });

    res.status(201).json({ message: 'Day off added', dayOff });
  } catch (error) {
    res.status(500).json({ message: 'Error adding day off', error: error.message });
  }
};

export const loginTherapist = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Find user with role='therapist' and matching email
    const user = await prisma.user.findUnique({
      where: { email },
      include: { therapist: true }
    });

    if (!user || user.role !== 'therapist') {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: 'therapist' },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      therapist: {
        id: user.therapist.id,
        name: user.name,
        email: user.email,
        specialty: user.therapist?.specialization
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};
