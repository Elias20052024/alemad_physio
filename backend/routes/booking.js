import express from 'express';

const router = express.Router();

// In-memory storage for bookings (in production, use a database)
const bookings = [];

// POST /api/booking - Create a new booking
router.post('/booking', (req, res) => {
  try {
    const { name, phone, service, date, message } = req.body;

    // Validation
    if (!name || !phone || !service || !date) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required fields',
      });
    }

    // Create booking object
    const booking = {
      id: bookings.length + 1,
      name,
      phone,
      service,
      date,
      message: message || '',
      createdAt: new Date().toISOString(),
    };

    // Store booking
    bookings.push(booking);

    // Log booking to console (for demonstration)
    console.log('New booking received:', booking);

    // In production, you would:
    // 1. Send an email notification
    // 2. Save to database
    // 3. Send SMS confirmation

    res.json({
      success: true,
      message: 'Booking received successfully',
      bookingId: booking.id,
    });
  } catch (error) {
    console.error('Error processing booking:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while processing your booking',
    });
  }
});

// GET /api/bookings - Get all bookings (for admin/testing)
router.get('/bookings', (req, res) => {
  res.json({
    success: true,
    count: bookings.length,
    bookings,
  });
});

// GET /api/booking/:id - Get specific booking
router.get('/booking/:id', (req, res) => {
  const { id } = req.params;
  const booking = bookings.find(b => b.id === parseInt(id));

  if (!booking) {
    return res.status(404).json({
      success: false,
      message: 'Booking not found',
    });
  }

  res.json({
    success: true,
    booking,
  });
});

export default router;
