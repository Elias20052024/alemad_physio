import nodemailer from 'nodemailer';

// Configure email service (using Gmail or your preferred service)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'alemad1pt@gmail.com',
    pass: process.env.EMAIL_PASSWORD || process.env.GMAIL_APP_PASSWORD,
  },
});

export const sendBookingNotificationToAdmin = async (booking) => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'alemad1pt@gmail.com';
    const bookingDate = new Date(booking.date).toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const mailOptions = {
      from: process.env.EMAIL_USER || 'alemad1pt@gmail.com',
      to: adminEmail,
      subject: `🔔 New Booking Request - ${booking.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
          <div style="background-color: #1C6FB5; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
            <h2 style="margin: 0;">🔔 New Booking Request</h2>
          </div>
          
          <div style="background-color: white; padding: 20px; border-radius: 0 0 8px 8px;">
            <p><strong>Client Name:</strong> ${booking.name}</p>
            <p><strong>Phone:</strong> ${booking.phone}</p>
            <p><strong>Service:</strong> ${booking.service}</p>
            <p><strong>Requested Date:</strong> ${bookingDate}</p>
            <p><strong>Message:</strong> ${booking.message || 'No message provided'}</p>
            <p><strong>Status:</strong> <span style="color: #FF9800; font-weight: bold;">PENDING</span></p>
            
            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
            
            <div style="text-align: center;">
              <p style="margin-bottom: 15px;">Would you like to accept or decline this booking?</p>
              <a href="${process.env.ADMIN_DASHBOARD_URL || 'http://localhost:3000'}/admin/bookings" 
                 style="display: inline-block; background-color: #1C6FB5; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-right: 10px;">
                View in Admin Dashboard
              </a>
            </div>
            
            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
            
            <p style="color: #999; font-size: 12px; text-align: center;">
              Booking ID: ${booking.id}<br>
              Created: ${new Date(booking.createdAt).toLocaleString()}
            </p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Booking notification email sent to admin:', adminEmail);
    return true;
  } catch (error) {
    console.error('❌ Error sending booking notification email:', error);
    return false;
  }
};

export const sendBookingConfirmationToClient = async (booking) => {
  try {
    const bookingDate = new Date(booking.date).toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const mailOptions = {
      from: process.env.EMAIL_USER || 'alemad1pt@gmail.com',
      to: booking.email || booking.phone, // Will need email field in booking
      subject: 'Booking Confirmation - AL-Emad Center for Physiotherapy',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
          <div style="background-color: #1C6FB5; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
            <h2 style="margin: 0;">✓ Booking Received</h2>
          </div>
          
          <div style="background-color: white; padding: 20px; border-radius: 0 0 8px 8px;">
            <p>Hello <strong>${booking.name}</strong>,</p>
            
            <p>Thank you for booking an appointment with AL-Emad Center for Physiotherapy!</p>
            
            <p><strong>Your Booking Details:</strong></p>
            <ul>
              <li><strong>Service:</strong> ${booking.service}</li>
              <li><strong>Requested Date:</strong> ${bookingDate}</li>
              <li><strong>Status:</strong> <span style="color: #FF9800;">Pending Confirmation</span></li>
            </ul>
            
            <p>Our admin team will review your booking and contact you shortly at <strong>${booking.phone}</strong> to confirm your appointment.</p>
            
            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
            
            <p style="color: #666; font-size: 14px;">
              If you have any questions, feel free to contact us:<br>
              📞 +962 7 9570 2165<br>
              💬 WhatsApp: +962 7 9570 2165
            </p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Booking confirmation email sent to client');
    return true;
  } catch (error) {
    console.error('❌ Error sending confirmation email to client:', error);
    return false;
  }
};
