import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createBooking = async (req, res) => {
  try {
    const { name, phone, service, date, message } = req.body;

    // Validation
    if (!name || !phone || !service || !date) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required fields: name, phone, service, date',
      });
    }

    // Validate phone format (basic validation)
    if (!/^\d{10,}$/.test(phone.replace(/\D/g, ''))) {
      return res.status(400).json({
        success: false,
        message: 'Invalid phone number format',
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

    // Create appointment in database
    const appointment = await prisma.appointment.create({
      data: {
        patientId: 1, // Default patient ID (you can change this logic later)
        therapistId: 1, // Default therapist ID (you can change this logic later)
        appointmentDate: bookingDate,
        startTime: '10:00', // Default time
        endTime: '11:00', // Default duration 1 hour
        status: 'pending',
        notes: message || `Booking: ${service}`,
      },
    });

    console.log('✅ New booking created:', {
      id: appointment.id,
      name,
      phone,
      service,
      date,
      message,
    });

    res.status(201).json({
      success: true,
      message: 'Booking received successfully. We will contact you soon!',
      bookingId: appointment.id,
      appointment: {
        id: appointment.id,
        date: appointment.appointmentDate,
        status: appointment.status,
      },
    });
  } catch (error) {
    console.error('❌ Error creating booking:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing booking',
      error: error.message,
    });
  }
};

export const getAllBookings = async (req, res) => {
  try {
    const appointments = await prisma.appointment.findMany({
      where: {
        status: 'pending', // Get pending bookings
      },
      include: {
        patient: true,
        therapist: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      success: true,
      count: appointments.length,
      data: appointments,
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

    const appointment = await prisma.appointment.findUnique({
      where: { id: parseInt(id) },
      include: {
        patient: true,
        therapist: true,
      },
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    res.json({
      success: true,
      data: appointment,
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

    const appointment = await prisma.appointment.update({
      where: { id: parseInt(id) },
      data: { status },
      include: {
        patient: true,
        therapist: true,
      },
    });

    res.json({
      success: true,
      message: 'Booking status updated',
      data: appointment,
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

    const appointment = await prisma.appointment.delete({
      where: { id: parseInt(id) },
    });

    res.json({
      success: true,
      message: 'Booking deleted successfully',
      data: appointment,
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
