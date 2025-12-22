import { PrismaClient } from '@prisma/client';
import { sendBookingNotificationToAdmin, sendBookingConfirmationToClient } from '../utils/email.js';

const prisma = new PrismaClient();

export const createBooking = async (req, res) => {
  try {
    const { name, phone, email, service, date, time, message } = req.body;

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

    // Create booking record (no therapist required)
    const booking = await prisma.booking.create({
      data: {
        name,
        phone,
        service,
        date: bookingDate,
        message: message || null,
        status: 'pending',
      },
    });

    // Create notification for the booking
    try {
      await prisma.notification.create({
        data: {
          bookingId: booking.id,
          type: 'booking_request',
          title: `New Booking Request from ${name}`,
          message: `${name} has requested a booking for ${service} on ${bookingDate.toLocaleDateString()} - Phone: ${phone}`,
          isRead: false,
          status: 'pending'
        }
      });
    } catch (notificationError) {
      console.error('Error creating notification:', notificationError);
      // Continue even if notification fails
    }

    // Notify admin about new booking via email
    try {
      await sendBookingNotificationToAdmin({
        name,
        phone,
        email,
        service,
        date: bookingDate,
        time: time || '10:00',
        message,
      });
    } catch (emailError) {
      console.error('Error sending email notification:', emailError);
      // Continue even if email fails
    }

    res.status(201).json({
      success: true,
      message: 'Booking created successfully. Admin will review and confirm.',
      data: booking,
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
