# Physiotherapy Center Management Platform - Setup Guide

## Overview

This is a full-stack physiotherapy center management system built with:
- **Frontend**: React + Material UI + Vite
- **Backend**: Node.js + Express + PostgreSQL + Prisma
- **Features**: Admin Dashboard, Therapist Management, Patient Management, Appointment Scheduling with availability checking

## Project Structure

```
alemad physio/
├── backend/
│   ├── src/
│   │   ├── controllers/         # Business logic
│   │   ├── routes/              # API endpoints
│   │   ├── middleware/          # Authentication & error handling
│   │   ├── utils/               # Utilities (JWT, validation, password hashing)
│   │   └── server.js            # Entry point
│   ├── prisma/
│   │   └── schema.prisma        # Database schema
│   ├── package.json
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── components/          # Reusable components
    │   ├── pages/               # Public pages
    │   ├── admin/               # Admin dashboard pages
    │   ├── appointments/        # Appointment booking pages
    │   ├── services/            # API service layer
    │   ├── context/             # Theme context
    │   ├── theme/               # Material UI theme
    │   └── App.jsx              # Main app component
    ├── package.json
    └── .env.local
```

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Backend Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment

Create a `.env` file in the backend folder:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/alemad_physio"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
PORT=5000
NODE_ENV="development"
```

**Important**: Replace `user`, `password`, and database name with your PostgreSQL credentials.

### 3. Create PostgreSQL Database

```bash
createdb alemad_physio
```

Or use your PostgreSQL client (pgAdmin, DBeaver, etc.)

### 4. Run Prisma Migrations

```bash
npm run migrate
```

This will create all tables in your database based on `prisma/schema.prisma`.

### 5. Create an Admin Account

Run this Node.js script in the backend to create your first admin:

```bash
node -e "
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdmin() {
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.admin.create({
    data: {
      name: 'Admin User',
      email: 'admin@alemad.com',
      password: hashedPassword,
    },
  });
  console.log('Admin created:', admin);
  process.exit(0);
}

createAdmin().catch(e => {
  console.error(e);
  process.exit(1);
});
"
```

### 6. Start Backend Server

```bash
npm run dev
```

The backend will run on `http://localhost:5000`

Check health: `http://localhost:5000/health`

## Frontend Setup

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Configure Environment

Update `.env.local`:

```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Start Development Server

```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## API Endpoints Reference

### Authentication
- `POST /api/admin/login` - Admin login
- `POST /api/admin/register` - Register new admin
- `GET /api/admin/stats` - Dashboard statistics (requires token)

### Therapists
- `GET /api/therapists` - Get all therapists
- `GET /api/therapists/:id` - Get therapist details
- `POST /api/therapists` - Create therapist (admin only)
- `PUT /api/therapists/:id` - Update therapist (admin only)
- `DELETE /api/therapists/:id` - Delete therapist (admin only)
- `GET /api/therapists/:id/schedule` - Get therapist schedule
- `POST /api/therapists/:id/schedule` - Create/update schedule (admin only)
- `POST /api/therapists/:id/breaks` - Add break (admin only)
- `POST /api/therapists/:id/dayoff` - Add day off (admin only)

### Patients
- `GET /api/patients` - Get all patients
- `GET /api/patients/:id` - Get patient details
- `GET /api/patients/:id/appointments` - Get patient appointments
- `POST /api/patients` - Create patient (admin only)
- `PUT /api/patients/:id` - Update patient (admin only)
- `DELETE /api/patients/:id` - Delete patient (admin only)

### Appointments
- `GET /api/appointments` - Get appointments (with filters)
- `GET /api/appointments/available-slots` - Get available time slots
- `POST /api/appointments` - Create appointment (public)
- `PUT /api/appointments/:id` - Update appointment (admin only)
- `PATCH /api/appointments/:id/cancel` - Cancel appointment (admin only)
- `DELETE /api/appointments/:id` - Delete appointment (admin only)

## Application Features

### Public Pages
- **Home**: Landing page
- **Therapists**: View all therapists
- **Services**: Service information
- **Booking**: Book appointments with availability checking
- **About**: About page
- **Contact**: Contact page

### Admin Dashboard
- **Login**: Secure admin login with JWT
- **Dashboard**: Overview with statistics
  - Total therapists count
  - Total patients count
  - Appointments today
  - Upcoming appointments
- **Manage Therapists**: Full CRUD operations
- **Manage Patients**: Full CRUD operations
- **Manage Appointments**: View, filter, and manage appointments

### Business Logic
- ✅ Prevent appointments outside working hours
- ✅ Check break times and prevent double booking
- ✅ Prevent appointments on days off
- ✅ Automatic availability slot calculation
- ✅ Support for creating patients on-the-fly during booking

### Theme System
- Light and Dark mode toggle
- Theme persisted in localStorage
- Medical-themed color palette

## Usage

### Booking an Appointment

1. Go to **Home** → **Therapists** or **Booking**
2. Select a therapist
3. Choose a date
4. Select available time slot
5. Choose service
6. Either select existing patient or create new patient
7. Confirm booking

### Admin Operations

1. Go to **Admin** button in header
2. Login with admin credentials (default: `admin@alemad.com` / `admin123`)
3. Access dashboard with full management capabilities

### Managing Schedules

1. In **Manage Therapists**, select a therapist
2. Set working hours (Monday-Sunday)
3. Add breaks or days off as needed

## Database Schema

### Admins Table
- id (PK)
- name
- email (unique)
- password (hashed)
- createdAt
- updatedAt

### Therapists Table
- id (PK)
- name
- specialty
- email (unique)
- phone
- createdAt
- updatedAt

### TherapistSchedules Table
- id (PK)
- therapistId (FK)
- dayOfWeek (0-6)
- startTime (HH:mm)
- endTime (HH:mm)

### TherapistBreaks Table
- id (PK)
- therapistId (FK)
- startTime (DateTime)
- endTime (DateTime)

### TherapistDaysOff Table
- id (PK)
- therapistId (FK)
- date (DateTime)

### Patients Table
- id (PK)
- fullName
- phone
- age
- gender
- medicalHistory
- createdAt
- updatedAt

### Appointments Table
- id (PK)
- therapistId (FK)
- patientId (FK)
- service
- date (DateTime)
- time (HH:mm)
- status (scheduled/completed/cancelled)
- duration (minutes)
- createdAt
- updatedAt

## Testing the System

### Create Test Data

1. **Create Therapists**
   - Use Admin Dashboard → Manage Therapists
   - Add at least 2 therapists with different specialties

2. **Set Schedules**
   - For each therapist, set working hours (e.g., Mon-Fri 9am-5pm)
   - Add breaks (e.g., lunch 12pm-1pm)

3. **Create Patients**
   - Use Admin Dashboard → Manage Patients
   - Create 2-3 test patients

4. **Book Appointments**
   - Go to public booking page
   - Try booking appointments
   - System should show available slots based on schedules

## Troubleshooting

### Backend Connection Issues
- Ensure PostgreSQL is running
- Check DATABASE_URL in .env
- Verify port 5000 is not in use

### Frontend API Errors
- Check VITE_API_URL in .env.local
- Verify backend is running
- Check browser console for errors

### Database Migration Issues
```bash
# Reset database (development only)
npx prisma migrate reset

# Check migration status
npx prisma migrate status
```

### Authentication Issues
- Clear localStorage: `localStorage.clear()`
- Re-login to admin dashboard
- Check JWT_SECRET is set correctly

## Production Deployment

### Backend
1. Set `NODE_ENV=production`
2. Use strong JWT_SECRET
3. Configure proper DATABASE_URL
4. Deploy to server (Heroku, AWS, DigitalOcean, etc.)

### Frontend
1. Build: `npm run build`
2. Deploy dist folder to static hosting (Vercel, Netlify, etc.)
3. Update VITE_API_URL to production backend URL

## Security Notes

- Always use HTTPS in production
- Keep JWT_SECRET secret and strong
- Hash passwords with bcrypt (already implemented)
- Validate all inputs on backend
- Use CORS carefully in production
- Set secure headers

## Support & Documentation

For more information, refer to:
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Express.js Documentation](https://expressjs.com/)
- [Material UI Documentation](https://mui.com/)
- [React Router Documentation](https://reactrouter.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

---

**Version**: 1.0.0  
**Last Updated**: December 2024
