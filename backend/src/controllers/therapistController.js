import { PrismaClient } from '@prisma/client';
import { isValidTimeFormat } from '../utils/validation.js';

const prisma = new PrismaClient();

export const getAllTherapists = async (req, res) => {
  try {
    const therapists = await prisma.therapist.findMany({
      include: {
        schedules: true,
        breaks: true,
        daysOff: true
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
        schedules: true,
        breaks: true,
        daysOff: true,
        appointments: {
          include: { patient: true }
        }
      }
    });

    if (!therapist) {
      return res.status(404).json({ message: 'Therapist not found' });
    }

    res.json(therapist);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching therapist', error: error.message });
  }
};

export const createTherapist = async (req, res) => {
  try {
    const { name, specialty, email, phone } = req.body;

    // Validate all fields are present
    if (!name || !specialty || !email || !phone) {
      return res.status(400).json({ message: 'All fields are required: name, specialty, email, phone' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Validate phone format (basic validation)
    const phoneRegex = /^[0-9+\-\s()]+$/;
    if (!phoneRegex.test(phone) || phone.length < 7) {
      return res.status(400).json({ message: 'Invalid phone number format' });
    }

    // Validate name and specialty are not just whitespace
    if (name.trim().length === 0 || specialty.trim().length === 0) {
      return res.status(400).json({ message: 'Name and specialty cannot be empty' });
    }

    // Check if email already exists
    const existingTherapist = await prisma.therapist.findUnique({ where: { email } });
    if (existingTherapist) {
      return res.status(409).json({ message: 'A therapist with this email already exists' });
    }

    const therapist = await prisma.therapist.create({
      data: { 
        name: name.trim(), 
        specialty: specialty.trim(), 
        email: email.toLowerCase().trim(), 
        phone: phone.trim() 
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
    const { name, specialty, email, phone, status } = req.body;

    // If email is being updated, validate format
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
      }

      // Check if email already exists for another therapist
      const existingTherapist = await prisma.therapist.findUnique({ where: { email } });
      if (existingTherapist && existingTherapist.id !== parseInt(id)) {
        return res.status(409).json({ message: 'A therapist with this email already exists' });
      }
    }

    // If phone is being updated, validate format
    if (phone) {
      const phoneRegex = /^[0-9+\-\s()]+$/;
      if (!phoneRegex.test(phone) || phone.length < 7) {
        return res.status(400).json({ message: 'Invalid phone number format' });
      }
    }

    // Validate status if provided
    if (status && !['active', 'inactive'].includes(status)) {
      return res.status(400).json({ message: 'Status must be either active or inactive' });
    }

    const therapist = await prisma.therapist.update({
      where: { id: parseInt(id) },
      data: {
        ...(name && { name: name.trim() }),
        ...(specialty && { specialty: specialty.trim() }),
        ...(email && { email: email.toLowerCase().trim() }),
        ...(phone && { phone: phone.trim() }),
        ...(status && { status })
      }
    });

    res.json({ message: 'Therapist updated successfully', therapist });
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
