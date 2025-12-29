import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Configure CORS with environment variable
const allowedOrigins = process.env.CORS_ORIGIN 
  ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
  : ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173', 'http://127.0.0.1:3000'];

console.log('🔐 CORS Origins:', allowedOrigins);

// Middleware
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'Backend is running!', timestamp: new Date() });
});

// Try to load routes
async function loadRoutes() {
  try {
    const [admin, therapist, patient, appointment, booking, notification] = await Promise.all([
      import('./routes/adminRoutes.js').then(m => m.default),
      import('./routes/therapistRoutes.js').then(m => m.default),
      import('./routes/patientRoutes.js').then(m => m.default),
      import('./routes/appointmentRoutes.js').then(m => m.default),
      import('./routes/bookingRoutes.js').then(m => m.default),
      import('./routes/notificationRoutes.js').then(m => m.default),
    ]);
    
    app.use('/api/admin', admin);
    app.use('/api/therapists', therapist);
    app.use('/api/patients', patient);
    app.use('/api/appointments', appointment);
    app.use('/api/bookings', booking);
    app.use('/api/notifications', notification);
    console.log('✅ All routes loaded successfully');
  } catch (error) {
    console.error('⚠️ Warning: Could not load routes:', error.message);
    console.log('ℹ️  Health check endpoint is still available at /health');
  }
}

// Error handling middleware
app.use(errorHandler);

// Start server
(async () => {
  await loadRoutes();
  app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
    console.log(`📍 Health check: http://localhost:${PORT}/health`);
    console.log(`📚 API Documentation: http://localhost:${PORT}/api`);
  });
})();

export default app;
