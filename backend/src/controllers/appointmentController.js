import { PrismaClient } from '@prisma/client';
import { timeToMinutes, hasTimeConflict, isTimeWithinBreak, isValidTimeFormat } from '../utils/validation.js';

const prisma = new PrismaClient();

export const getAllAppointments = async (req, res) => {
  try {
    const { therapistId, patientId, date, status } = req.query;
    
    const where = {};
    if (therapistId) where.therapistId = parseInt(therapistId);
    if (patientId) where.patientId = parseInt(patientId);
    if (status) where.status = status;
    if (date) {
      const dateObj = new Date(date);
      where.appointmentDate = {
        gte: new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate()),
        lt: new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate() + 1)
      };
    }

    const appointments = await prisma.appointment.findMany({
      where,
      include: { 
        therapist: { include: { user: true } },
        patient: { include: { user: true } }
      },
      orderBy: { appointmentDate: 'asc' }
    });

    res.json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ message: 'Error fetching appointments', error: error.message });
  }
};

export const getAvailableSlots = async (req, res) => {
  try {
    const { therapistId, date, duration = 60 } = req.query;

    if (!therapistId || !date) {
      return res.status(400).json({ message: 'Therapist ID and date required' });
    }

    // Define available time slots (9 AM to 5 PM, 1-hour slots)
    const slots = [
      '09:00', '10:00', '11:00', '12:00', 
      '13:00', '14:00', '15:00', '16:00', '17:00'
    ];

    const appointmentDate = new Date(date);
    
    // Get existing appointments for this therapist on this date
    const existingAppointments = await prisma.appointment.findMany({
      where: {
        therapistId: parseInt(therapistId),
        appointmentDate: {
          gte: new Date(appointmentDate.getFullYear(), appointmentDate.getMonth(), appointmentDate.getDate()),
          lt: new Date(appointmentDate.getFullYear(), appointmentDate.getMonth(), appointmentDate.getDate() + 1)
        }
      }
    });

    // Get booked times
    const bookedTimes = existingAppointments.map(apt => apt.startTime);

    // Filter out booked times
    const availableSlots = slots.filter(time => !bookedTimes.includes(time));

    res.json({ slots: availableSlots });
  } catch (error) {
    console.error('Error fetching available slots:', error);
    res.status(500).json({ message: 'Error fetching available slots', error: error.message });
  }
};

export const createAppointment = async (req, res) => {
  try {
    const { therapistId, patientId, appointmentDate, startTime, endTime, status = 'pending', notes } = req.body;

    if (!therapistId || !patientId || !appointmentDate || !startTime || !endTime) {
      return res.status(400).json({ message: 'All required fields must be provided: therapistId, patientId, appointmentDate, startTime, endTime' });
    }

    // Verify therapist exists
    const therapist = await prisma.therapist.findUnique({
      where: { id: parseInt(therapistId) }
    });

    if (!therapist) {
      return res.status(404).json({ message: 'Therapist not found' });
    }

    // Verify patient exists
    const patient = await prisma.patient.findUnique({
      where: { id: parseInt(patientId) }
    });

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Check for time conflicts
    const existingAppointment = await prisma.appointment.findFirst({
      where: {
        therapistId: parseInt(therapistId),
        appointmentDate: new Date(appointmentDate),
        startTime: startTime,
        status: { not: 'cancelled' }
      }
    });

    if (existingAppointment) {
      return res.status(409).json({ message: 'Time slot is already booked' });
    }

    // Create appointment
    const appointment = await prisma.appointment.create({
      data: {
        therapistId: parseInt(therapistId),
        patientId: parseInt(patientId),
        appointmentDate: new Date(appointmentDate),
        startTime,
        endTime,
        status,
        notes: notes || null
      },
      include: {
        therapist: { include: { user: true } },
        patient: { include: { user: true } }
      }
    });

    res.status(201).json({ message: 'Appointment created successfully', appointment });
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ message: 'Error creating appointment', error: error.message });
  }
};

export const updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { startTime, endTime, status, appointmentDate, notes } = req.body;

    const appointment = await prisma.appointment.update({
      where: { id: parseInt(id) },
      data: {
        ...(appointmentDate && { appointmentDate: new Date(appointmentDate) }),
        ...(startTime && { startTime }),
        ...(endTime && { endTime }),
        ...(status && { status: status.trim() }),
        ...(notes !== undefined && { notes })
      },
      include: { 
        therapist: { include: { user: true } },
        patient: { include: { user: true } }
      }
    });

    res.json(appointment);
  } catch (error) {
    console.error('Error updating appointment:', error);
    res.status(500).json({ message: 'Error updating appointment', error: error.message });
  }
};

export const cancelAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await prisma.appointment.update({
      where: { id: parseInt(id) },
      data: { status: 'cancelled' },
      include: { 
        therapist: { include: { user: true } },
        patient: { include: { user: true } }
      }
    });

    res.json({ message: 'Appointment cancelled', appointment });
  } catch (error) {
    console.error('Error cancelling appointment:', error);
    res.status(500).json({ message: 'Error cancelling appointment', error: error.message });
  }
};

export const deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.appointment.delete({ where: { id: parseInt(id) } });
    res.json({ message: 'Appointment deleted' });
  } catch (error) {
    console.error('Error deleting appointment:', error);
    res.status(500).json({ message: 'Error deleting appointment', error: error.message });
  }
};
