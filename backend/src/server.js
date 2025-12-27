import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/auth.js';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

// Import routes
import adminRoutes from './routes/adminRoutes.js';
import therapistRoutes from './routes/therapistRoutes.js';
import patientRoutes from './routes/patientRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const prisma = new PrismaClient();

// Initialize default admin if it doesn't exist
const initializeAdmin = async () => {
  try {
    const adminExists = await prisma.user.findUnique({
      where: { email: 'admin@alemad.com' }
    });

    if (!adminExists) {
      console.log('📝 Creating default admin user...');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const adminUser = await prisma.user.create({
        data: {
          email: 'admin@alemad.com',
          password: hashedPassword,
          name: 'Admin User',
          role: 'admin',
        },
      });

      await prisma.admin.create({
        data: {
          userId: adminUser.id,
          status: 'active',
        },
      });

      console.log('✅ Default admin created: admin@alemad.com / admin123');
    } else {
      console.log('✅ Admin user already exists');
    }
  } catch (error) {
    console.error('⚠️ Error initializing admin:', error.message);
  }
};

// Seed test data if database is empty
const seedTestData = async () => {
  try {
    const patientCount = await prisma.patient.count();
    
    if (patientCount === 0) {
      console.log('🌱 Database is empty - skipping seeding on startup');
      // Seeding removed - use seed.js manually if needed
    } else {
      console.log('✅ Database already has data');
    }
  } catch (error) {
    console.error('⚠️ Error checking database:', error.message);
  }
};

// Configure CORS with environment variable
const allowedOrigins = process.env.CORS_ORIGIN 
  ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
  : ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173', 'http://127.0.0.1:3000', 'https://alemadphysio.netlify.app'];

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

// Routes
app.use('/api/admin', adminRoutes);
app.use('/api/therapists', therapistRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/notifications', notificationRoutes);

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(PORT, async () => {
  console.log(`✅ Server is running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/api`);
  
  // Initialize admin on startup
  await initializeAdmin();
  
  // Seed test data if database is empty
  await seedTestData();
});

export default app;
