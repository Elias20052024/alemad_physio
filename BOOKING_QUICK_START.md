# 🚀 QUICK START: Using the Booking System

## Step-by-Step Integration

### 1. Add Routes to Your App

Update your `App.jsx` or routing file:

```javascript
import AppointmentBookingForm from '@/components/AppointmentBookingForm';
import PatientDashboardDB from '@/pages/PatientDashboardDB';

// Add these routes
<Route path="/appointments/book" element={<AppointmentBookingForm />} />
<Route path="/patient/dashboard" element={<PatientDashboardDB />} />
```

### 2. Add Navigation Links

In your navigation/menu component:

```javascript
<Link to="/appointments/book">📅 Book Appointment</Link>
<Link to="/patient/dashboard">👤 My Dashboard</Link>
```

### 3. Test the System

**Backend must be running:**
```bash
cd backend
npm run dev
```

**Frontend must be running:**
```bash
cd frontend
npm run dev
```

**Then open browser:**
- Visit: http://localhost:3000
- Navigate to booking page
- Test booking an appointment

---

## 🎯 What Users See

### Patient Booking Flow
```
1. Click "Book Appointment"
   ↓
2. Select a patient (or create new)
   ↓
3. Pick a therapist
   ↓
4. Choose date & time slot
   ↓
5. Review & confirm
   ↓
6. ✅ Appointment booked!
```

### Admin View
```
1. Go to Admin Dashboard
   ↓
2. Click "Manage Appointments"
   ↓
3. See all appointments from database
   ↓
4. Filter by status/date/therapist
   ↓
5. Change status or delete
```

### Patient Dashboard
```
1. Go to "My Dashboard"
   ↓
2. See all your appointments
   ↓
3. Can cancel if needed
   ↓
4. Can book more appointments
```

---

## 💾 Data Flow

```
User selects patient
    ↓
API: GET /api/therapists (load list)
    ↓
User picks therapist & date
    ↓
API: GET /api/appointments/available-slots
    ↓
System shows available times
    ↓
User selects time
    ↓
User confirms booking
    ↓
API: POST /api/appointments
    ↓
Database saves
    ↓
✅ Success message
```

---

## 🧪 Quick Test

### Test 1: Create & Book
```javascript
// In browser console:
import { patientAPI } from '@/services/api';
import { appointmentAPI } from '@/services/api';

// Create patient
const patient = await patientAPI.create({
  fullName: "Test User",
  phone: "+966551234567",
  age: 25,
  gender: "Male"
});

// Get available slots
const slots = await appointmentAPI.getAvailableSlots(1, "2024-12-20", 60);
console.log(slots);

// Book appointment
const apt = await appointmentAPI.create({
  therapistId: 1,
  patientId: patient.data.id,
  service: "Physiotherapy",
  date: "2024-12-20T10:00:00Z",
  time: "10:00",
  duration: 60
});
console.log("Booked:", apt.data);
```

### Test 2: View in Database
1. Open Neon Console
2. Go to Tables
3. Click "appointments"
4. ✅ See your new appointment

---

## 📋 File Structure

```
frontend/src/
├── components/
│   └── AppointmentBookingForm.jsx     ← Main booking component
├── pages/
│   └── PatientDashboardDB.jsx         ← Patient view component
├── admin/
│   └── ManageAppointments.jsx         ← Admin appointments page
├── hooks/
│   └── useAppointmentManagement.js    ← Custom hooks
└── services/
    └── api.js                          ← API calls (already configured)
```

---

## 🎨 Customization

### Change Colors
```javascript
// In component files, change sx={{ color: '#1976d2' }} etc
<Chip color="primary" />  // Change to "success", "error", etc
```

### Add More Service Types
```javascript
// In AppointmentBookingForm.jsx, add to MenuItem:
<MenuItem value="New Service">New Service Name</MenuItem>
```

### Change Duration Options
```javascript
// Add new duration option
<MenuItem value={120}>120 minutes</MenuItem>
```

---

## 🔗 API Integration

All endpoints are in `frontend/src/services/api.js`

```javascript
// Patients
patientAPI.getAll()
patientAPI.create(data)

// Therapists
therapistAPI.getAll()

// Appointments
appointmentAPI.getAll(filters)
appointmentAPI.create(data)
appointmentAPI.getAvailableSlots(therapistId, date, duration)
appointmentAPI.updateStatus(id, status)
appointmentAPI.delete(id)
```

---

## ✅ Checklist

- [ ] Backend running (`npm run dev`)
- [ ] Frontend running (`npm run dev`)
- [ ] Routes added to App.jsx
- [ ] Navigation links added
- [ ] Visited booking page in browser
- [ ] Selected patient
- [ ] Selected therapist
- [ ] Picked time slot
- [ ] Confirmed booking
- [ ] Checked Neon console for appointment
- [ ] Viewed in patient dashboard
- [ ] Viewed in admin panel

---

## 🆘 Common Issues

| Issue | Solution |
|-------|----------|
| "No available slots" | Check therapist schedule in database |
| API error 404 | Backend not running - run `npm run dev` |
| Appointments not showing | Refresh page or check filter |
| Can't select patient | Create patient first |
| Time slots empty | Wrong date or therapist has no schedule |

---

## 📱 Mobile Testing

The components are fully responsive:
- ✅ Works on mobile phones
- ✅ Touch-friendly buttons
- ✅ Responsive grid layout
- ✅ Auto-adjusting font sizes

---

**Status:** ✅ READY TO USE  
**Complexity:** ⭐⭐☆ (Moderate - all setup done)  
**Time to integrate:** ~5 minutes

Start booking appointments now! 🎉
