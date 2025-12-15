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
      where.date = {
        gte: new Date(dateObj.setHours(0, 0, 0, 0)),
        lt: new Date(dateObj.setHours(23, 59, 59, 999))
      };
    }

    const appointments = await prisma.appointment.findMany({
      where,
      include: { therapist: true, patient: true },
      orderBy: { date: 'asc' }
    });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching appointments', error: error.message });
  }
};

export const getAvailableSlots = async (req, res) => {
  try {
    const { therapistId, date, duration = 60 } = req.query;

    if (!therapistId || !date) {
      return res.status(400).json({ message: 'Therapist ID and date required' });
    }

    const appointmentDate = new Date(date);
    const dayOfWeek = appointmentDate.getDay();

    // Get therapist schedule for this day
    const schedule = await prisma.therapistSchedule.findFirst({
      where: {
        therapistId: parseInt(therapistId),
        dayOfWeek: dayOfWeek === 0 ? 6 : dayOfWeek - 1 // Convert JS day (0-6) to DB day (0-6, Mon-Sun)
      }
    });

    if (!schedule) {
      return res.json({ slots: [], message: 'No schedule for this day' });
    }

    // Check if it's a day off
    const dayOff = await prisma.therapistDayOff.findFirst({
      where: {
        therapistId: parseInt(therapistId),
        date: {
          gte: new Date(appointmentDate.setHours(0, 0, 0, 0)),
          lt: new Date(appointmentDate.setHours(23, 59, 59, 999))
        }
      }
    });

    if (dayOff) {
      return res.json({ slots: [], message: 'Therapist is off this day' });
    }

    // Get existing appointments
    const appointments = await prisma.appointment.findMany({
      where: {
        therapistId: parseInt(therapistId),
        date: {
          gte: new Date(appointmentDate.setHours(0, 0, 0, 0)),
          lt: new Date(appointmentDate.setHours(23, 59, 59, 999))
        },
        status: 'scheduled'
      }
    });

    // Get breaks
    const breaks = await prisma.therapistBreak.findMany({
      where: {
        therapistId: parseInt(therapistId),
        startTime: {
          lte: new Date(appointmentDate.setHours(23, 59, 59, 999))
        },
        endTime: {
          gte: new Date(appointmentDate.setHours(0, 0, 0, 0))
        }
      }
    });

    // Generate available slots
    const slots = [];
    const startMinutes = timeToMinutes(schedule.startTime);
    const endMinutes = timeToMinutes(schedule.endTime);
    const durationNum = parseInt(duration);

    for (let minute = startMinutes; minute + durationNum <= endMinutes; minute += 30) {
      const slotStart = minute;
      const slotEnd = minute + durationNum;
      const slotTime = String(Math.floor(minute / 60)).padStart(2, '0') + ':' + String(minute % 60).padStart(2, '0');

      // Check conflicts with existing appointments
      const hasConflict = hasTimeConflict(slotStart, slotEnd, appointments);
      
      // Check breaks
      const inBreak = isTimeWithinBreak(appointmentDate, slotTime, durationNum, breaks);

      if (!hasConflict && !inBreak) {
        slots.push(slotTime);
      }
    }

    res.json({ slots, message: 'Available slots fetched' });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching slots', error: error.message });
  }
};

export const createAppointment = async (req, res) => {
  try {
    const { therapistId, patientId, service, date, time, duration = 60 } = req.body;

    if (!therapistId || !patientId || !service || !date || !time) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }

    if (!isValidTimeFormat(time)) {
      return res.status(400).json({ message: 'Invalid time format. Use HH:mm' });
    }

    const appointmentDate = new Date(date);
    const dayOfWeek = appointmentDate.getDay();

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

    // Check if therapist works this day
    const schedule = await prisma.therapistSchedule.findFirst({
      where: {
        therapistId: parseInt(therapistId),
        dayOfWeek: dayOfWeek === 0 ? 6 : dayOfWeek - 1
      }
    });

    if (!schedule) {
      return res.status(400).json({ message: 'Therapist does not work on this day' });
    }

    // Check day off
    const dayOff = await prisma.therapistDayOff.findFirst({
      where: {
        therapistId: parseInt(therapistId),
        date: {
          gte: new Date(appointmentDate.setHours(0, 0, 0, 0)),
          lt: new Date(appointmentDate.setHours(23, 59, 59, 999))
        }
      }
    });

    if (dayOff) {
      return res.status(400).json({ message: 'Therapist is off on this date' });
    }

    // Check working hours
    const [hours, minutes] = time.split(':').map(Number);
    const appointmentMinutes = hours * 60 + minutes;
    const scheduleStart = timeToMinutes(schedule.startTime);
    const scheduleEnd = timeToMinutes(schedule.endTime);
    const durationNum = parseInt(duration);

    if (appointmentMinutes < scheduleStart || appointmentMinutes + durationNum > scheduleEnd) {
      return res.status(400).json({ message: 'Appointment time is outside working hours' });
    }

    // Check for breaks
    const breaks = await prisma.therapistBreak.findMany({
      where: {
        therapistId: parseInt(therapistId),
        startTime: { lte: new Date(appointmentDate.setHours(23, 59, 59, 999)) },
        endTime: { gte: new Date(appointmentDate.setHours(0, 0, 0, 0)) }
      }
    });

    if (isTimeWithinBreak(appointmentDate, time, durationNum, breaks)) {
      return res.status(400).json({ message: 'Appointment time conflicts with a break' });
    }

    // Check for double booking
    const existingAppointments = await prisma.appointment.findMany({
      where: {
        therapistId: parseInt(therapistId),
        date: {
          gte: new Date(appointmentDate.setHours(0, 0, 0, 0)),
          lt: new Date(appointmentDate.setHours(23, 59, 59, 999))
        },
        status: 'scheduled'
      }
    });

    if (hasTimeConflict(appointmentMinutes, appointmentMinutes + durationNum, existingAppointments)) {
      return res.status(400).json({ message: 'Time slot is already booked' });
    }

    // Create appointment
    const appointment = await prisma.appointment.create({
      data: {
        therapistId: parseInt(therapistId),
        patientId: parseInt(patientId),
        service,
        date: appointmentDate,
        time,
        duration: durationNum
      },
      include: { therapist: true, patient: true }
    });

    res.status(201).json({ message: 'Appointment created', appointment });
  } catch (error) {
    res.status(500).json({ message: 'Error creating appointment', error: error.message });
  }
};

export const updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, time, status, service } = req.body;

    const appointment = await prisma.appointment.update({
      where: { id: parseInt(id) },
      data: {
        ...(date && { date: new Date(date) }),
        ...(time && { time }),
        ...(status && { status }),
        ...(service && { service })
      },
      include: { therapist: true, patient: true }
    });

    res.json({ message: 'Appointment updated', appointment });
  } catch (error) {
    res.status(500).json({ message: 'Error updating appointment', error: error.message });
  }
};

export const cancelAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await prisma.appointment.update({
      where: { id: parseInt(id) },
      data: { status: 'cancelled' },
      include: { therapist: true, patient: true }
    });

    res.json({ message: 'Appointment cancelled', appointment });
  } catch (error) {
    res.status(500).json({ message: 'Error cancelling appointment', error: error.message });
  }
};

export const deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.appointment.delete({ where: { id: parseInt(id) } });
    res.json({ message: 'Appointment deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting appointment', error: error.message });
  }
};
