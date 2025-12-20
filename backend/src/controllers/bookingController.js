import { PrismaClient } from '@prisma/client';
import { sendBookingNotificationToAdmin, sendBookingConfirmationToClient } from '../utils/email.js';

const prisma = new PrismaClient();

export const createBooking = async (req, res) => {
  try {
    const { name, phone, service, date, message } = req.body;

    // Validation
    if (!name || !phone || !date) {
      return res.status(400).json({
        success: false,
        message: 'Name, phone, and date are required',
      });
    }

    // Validate date is in future
    const bookingDate = new Date(date);
    if (bookingDate < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Booking date must be in the future',
      });
    }

    // Step 1: Create patient
    const patient = await prisma.patient.create({
      data: {
        phone: phone,
        gender: 'Other',
        user: {
          create: {
            name: name,
            email: `${name.toLowerCase().replace(/\s+/g, '.')}@booking.local`,
            password: 'temp123',
            role: 'patient',
          },
        },
      },
      include: {
        user: true,
      },
    });

    // Step 2: Get first available therapist
    const therapist = await prisma.therapist.findFirst({
      include: { user: true },
    });

    if (!therapist) {
      return res.status(404).json({
        success: false,
        message: 'No therapists available',
      });
    }

    // Step 3: Generate random time slot
    const availableTimes = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];
    const randomStartTime = availableTimes[Math.floor(Math.random() * availableTimes.length)];
    const endHour = (parseInt(randomStartTime.split(':')[0]) + 1).toString().padStart(2, '0');
    const randomEndTime = `${endHour}:00`;

    // Step 4: Create appointment
    const appointment = await prisma.appointment.create({
      data: {
        therapistId: therapist.id,
        patientId: patient.id,
        appointmentDate: bookingDate,
        startTime: randomStartTime,
        endTime: randomEndTime,
        status: 'pending',
        notes: message || null,
      },
      include: {
        therapist: { include: { user: true } },
        patient: { include: { user: true } },
      },
    });

    // Step 5: Create notification for admin
    const notification = await prisma.notification.create({
      data: {
        appointmentId: appointment.id,
        type: 'booking_request',
        title: `New Appointment Request from ${patient.user?.name || 'Patient'}`,
        message: `Patient ${patient.user?.name || 'Unknown'} - Phone: ${phone}`,
        isRead: false,
        status: 'pending',
      },
    });

    console.log('✅ New booking created with notification:', {
      bookingId: appointment.id,
      patientId: patient.id,
      patientName: name,
      notificationId: notification.id,
    });

    res.json({
      success: true,
      message: 'Booking created successfully',
      booking: {
        id: appointment.id,
        patientId: patient.id,
        patientName: patient.user?.name,
        therapistId: therapist.id,
        therapistName: therapist.user?.name,
        appointmentDate: appointment.appointmentDate,
        startTime: appointment.startTime,
        endTime: appointment.endTime,
      },
      notification: {
        id: notification.id,
        title: notification.title,
        status: notification.status,
      },
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating booking',
      error: error.message,
    });
  }
};

export const getAllBookings = async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching bookings',
      error: error.message,
    });
  }
};

export const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await prisma.booking.findUnique({
      where: { id: parseInt(id) },
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    res.json({
      success: true,
      data: booking,
    });
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching booking',
      error: error.message,
    });
  }
};

export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Status must be one of: ${validStatuses.join(', ')}`,
      });
    }

    const booking = await prisma.booking.update({
      where: { id: parseInt(id) },
      data: { status },
    });

    res.json({
      success: true,
      message: 'Booking status updated',
      data: booking,
    });
  } catch (error) {
    console.error('Error updating booking:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating booking',
      error: error.message,
    });
  }
};

export const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await prisma.booking.delete({
      where: { id: parseInt(id) },
    });

    res.json({
      success: true,
      message: 'Booking deleted successfully',
      data: booking,
    });
  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting booking',
      error: error.message,
    });
  }
};
