import { PrismaClient } from '@prisma/client';
import { sendBookingNotificationToAdmin, sendBookingConfirmationToClient } from '../utils/email.js';

const prisma = new PrismaClient();

export const createBooking = async (req, res) => {
  try {
    const { name, phone, service, date, message, email } = req.body;

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

    // Create booking in Booking table (not Appointment)
    const booking = await prisma.booking.create({
      data: {
        name,
        phone,
        service,
        date: bookingDate,
        message: message || '',
        status: 'pending',
      },
    });

    console.log('✅ New booking created:', {
      id: booking.id,
      name,
      phone,
      service,
      date,
      message,
    });

    // Send email notifications
    await sendBookingNotificationToAdmin(booking);
    if (email) {
      await sendBookingConfirmationToClient({ ...booking, email });
    }

    res.status(201).json({
      success: true,
      message: 'Booking received successfully. We will contact you soon!',
      bookingId: booking.id,
      booking: {
        id: booking.id,
        date: booking.date,
        status: booking.status,
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
