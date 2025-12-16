# 🔗 Alemad Physio - Full Integration Guide

## ✅ Integration Status

Your backend, database, and frontend are now **fully linked and operational**!

### 🚀 Current Setup

```
┌─────────────────────────────────────────────────────┐
│  FRONTEND                                           │
│  http://localhost:3000                              │
│  (Vite Development Server)                          │
└──────────────────────┬──────────────────────────────┘
                       │
                       │ HTTP Requests
                       │ (axios with auto token)
                       ▼
┌─────────────────────────────────────────────────────┐
│  BACKEND API                                        │
│  http://localhost:5000/api                          │
│  (Express.js - nodemon)                             │
└──────────────────────┬──────────────────────────────┘
                       │
                       │ Prisma ORM
                       │
                       ▼
┌─────────────────────────────────────────────────────┐
│  PostgreSQL DATABASE (Neon)                         │
│  ep-summer-cake-a14gqbh9-pooler.ap-southeast-1     │
│  Database: neondb                                   │
└─────────────────────────────────────────────────────┘
```

---

## 📋 Running the Application

### Terminal 1: Start Backend
```bash
cd backend
npm run dev
```
✅ Backend runs on: `http://localhost:5000`

### Terminal 2: Start Frontend
```bash
cd frontend
npm run dev
```
✅ Frontend runs on: `http://localhost:3000`

---

## 📡 API Endpoints Available

### Admin Authentication
- `POST /api/admin/login` - Login admin
- `POST /api/admin/register` - Register admin
- `GET /api/admin/profile` - Get admin profile
- `PUT /api/admin/profile` - Update admin profile

### Patients
- `GET /api/patients` - Get all patients
- `GET /api/patients/:id` - Get patient by ID
- `POST /api/patients` - Create new patient
- `PUT /api/patients/:id` - Update patient
- `DELETE /api/patients/:id` - Delete patient
- `GET /api/patients/phone/:phone` - Get patient by phone

### Therapists
- `GET /api/therapists` - Get all therapists
- `GET /api/therapists/:id` - Get therapist by ID
- `POST /api/therapists` - Create therapist
- `PUT /api/therapists/:id` - Update therapist
- `DELETE /api/therapists/:id` - Delete therapist
- `GET /api/therapists/:id/schedule` - Get therapist schedule
- `POST /api/therapists/:id/schedule` - Set therapist schedule
- `POST /api/therapists/:id/days-off` - Add day off
- `DELETE /api/therapists/:id/days-off/:date` - Remove day off
- `POST /api/therapists/:id/breaks` - Add break
- `DELETE /api/therapists/:id/breaks/:breakId` - Remove break

### Appointments
- `GET /api/appointments` - Get all appointments (with filters)
- `GET /api/appointments/:id` - Get appointment by ID
- `POST /api/appointments` - Create appointment
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Delete appointment
- `GET /api/appointments/available-slots` - Get available time slots
- `PATCH /api/appointments/:id/status` - Update appointment status
- `POST /api/appointments/:id/reschedule` - Reschedule appointment

### Health Check
- `GET /health` - Backend health status

---

## 🔧 Frontend API Configuration

Your frontend is configured with:

**File:** `frontend/.env`
```
VITE_API_URL=http://localhost:5000/api
```

**Usage in Components:**
```javascript
import { 
  adminAPI, 
  patientAPI, 
  therapistAPI, 
  appointmentAPI,
  healthCheck 
} from '@/services/api';

// Example: Create a patient
try {
  const response = await patientAPI.create({
    fullName: "John Doe",
    phone: "+1234567890",
    age: 30,
    gender: "Male",
    medicalHistory: "No allergies"
  });
  console.log("Patient created:", response.data);
} catch (error) {
  console.error("Error creating patient:", error);
}

// Example: Get available appointment slots
try {
  const slots = await appointmentAPI.getAvailableSlots(1, "2024-12-20", 60);
  console.log("Available slots:", slots.data);
} catch (error) {
  console.error("Error fetching slots:", error);
}
```

---

## 🔐 Authentication Flow

1. **Admin Login**: `adminAPI.login(email, password)`
   - Returns JWT token in response
   - Token stored in `localStorage` as `token`

2. **Request Interceptor**: Auto-attaches token to all requests
   ```javascript
   Authorization: Bearer {token}
   ```

3. **Response Interceptor**: Handles 401 errors
   - Clears token if expired
   - Redirects to `/admin/login`

---

## 📦 Database Schema

Your database includes these tables:

### admins
- id, name, email, password (hashed), createdAt, updatedAt

### therapists
- id, name, specialty, email, phone, status, createdAt, updatedAt

### therapist_schedules
- id, therapistId, dayOfWeek, startTime, endTime

### therapist_breaks
- id, therapistId, startTime, endTime, createdAt, updatedAt

### therapist_days_off
- id, therapistId, date, createdAt, updatedAt

### patients
- id, fullName, phone, age, gender, medicalHistory, createdAt, updatedAt

### appointments
- id, therapistId, patientId, service, date, time, status, duration, createdAt, updatedAt

---

## 🧪 Testing the Integration

### Test 1: Backend Health Check
```bash
curl http://localhost:5000/health
```
**Expected Response:**
```json
{
  "status": "Backend is running!",
  "timestamp": "2024-12-16T..."
}
```

### Test 2: Frontend → Backend Connection
Open browser console and run:
```javascript
import { healthCheck } from '@/services/api';
healthCheck().then(res => console.log(res.data));
```

### Test 3: Create Patient (with JWT)
```javascript
import { patientAPI } from '@/services/api';
await patientAPI.create({
  fullName: "Test Patient",
  phone: "+1234567890",
  age: 25,
  gender: "Male"
});
```

---

## 🚨 Troubleshooting

### Issue: CORS Error
- **Solution**: Backend has CORS enabled for all origins
- Check backend is running on port 5000

### Issue: 401 Unauthorized
- **Solution**: Login first to get JWT token
- Token automatically stored in localStorage
- Check `.env` has correct JWT_SECRET

### Issue: Database Connection Failed
- **Solution**: Verify `DATABASE_URL` in `backend/.env`
- Check Neon database is active and accessible

### Issue: Frontend Can't Reach Backend
- **Solution**: Ensure `VITE_API_URL` in `frontend/.env` is correct
- Check both servers are running
- Verify port 5000 isn't blocked by firewall

---

## 📚 Files Modified/Created

✅ **Created:**
- `frontend/.env` - Environment variables for frontend

✅ **Enhanced:**
- `frontend/src/services/api.js` - Added organized API endpoint functions

✅ **Already Set Up:**
- `backend/src/server.js` - Express server with all routes
- `backend/prisma/schema.prisma` - Database schema
- `backend/.env` - Database connection and JWT config

---

## 🎯 Next Steps

1. **Test the API** using Postman or curl
2. **Create sample data** via admin panel
3. **Build your components** using the API endpoints
4. **Deploy** backend and frontend separately

---

## 📞 Support

- Backend API Docs: `http://localhost:5000/api`
- Frontend runs on: `http://localhost:3000`
- Database managed via: Prisma Studio (`npx prisma studio`)

**Happy coding! 🚀**
