# 🚀 API Quick Reference

## Import the API Services

```javascript
import { 
  adminAPI, 
  patientAPI, 
  therapistAPI, 
  appointmentAPI,
  healthCheck 
} from '@/services/api';
```

---

## 👨‍💼 Admin API

```javascript
// Login
const { data } = await adminAPI.login('admin@example.com', 'password');
localStorage.setItem('token', data.token);

// Get Profile
const profile = await adminAPI.getProfile();

// Update Profile
await adminAPI.updateProfile({ name: 'New Name' });

// Register (if allowed)
await adminAPI.register('Admin Name', 'email@example.com', 'password');
```

---

## 👥 Patient API

```javascript
// Get All Patients
const { data: patients } = await patientAPI.getAll();

// Get Single Patient
const { data: patient } = await patientAPI.getById(1);

// Create Patient
const { data: newPatient } = await patientAPI.create({
  fullName: "John Doe",
  phone: "+1234567890",
  age: 30,
  gender: "Male",
  medicalHistory: "No known allergies"
});

// Update Patient
await patientAPI.update(1, {
  fullName: "Jane Doe",
  age: 31
});

// Delete Patient
await patientAPI.delete(1);

// Get Patient by Phone
const { data: patient } = await patientAPI.getByPhone("+1234567890");
```

---

## 👨‍⚕️ Therapist API

```javascript
// Get All Therapists
const { data: therapists } = await therapistAPI.getAll();

// Get Single Therapist
const { data: therapist } = await therapistAPI.getById(1);

// Create Therapist
const { data: newTherapist } = await therapistAPI.create({
  name: "Dr. Smith",
  specialty: "Physiotherapy",
  email: "smith@example.com",
  phone: "+1234567890",
  status: "active"
});

// Update Therapist
await therapistAPI.update(1, {
  specialty: "Sports Medicine"
});

// Get Therapist Schedule
const { data: schedule } = await therapistAPI.getSchedule(1);

// Set Therapist Schedule (weekly)
await therapistAPI.setSchedule(1, [
  { dayOfWeek: 0, startTime: "09:00", endTime: "17:00" },  // Monday
  { dayOfWeek: 1, startTime: "09:00", endTime: "17:00" },  // Tuesday
  { dayOfWeek: 2, startTime: "09:00", endTime: "17:00" },  // Wednesday
  { dayOfWeek: 3, startTime: "09:00", endTime: "17:00" },  // Thursday
  { dayOfWeek: 4, startTime: "09:00", endTime: "17:00" },  // Friday
]);

// Add Day Off
await therapistAPI.addDayOff(1, "2024-12-25");

// Remove Day Off
await therapistAPI.removeDayOff(1, "2024-12-25");

// Add Break
await therapistAPI.addBreak(1, {
  startTime: "2024-12-20T12:00:00Z",
  endTime: "2024-12-20T13:00:00Z"
});

// Remove Break
await therapistAPI.removeBreak(1, breakId);

// Delete Therapist
await therapistAPI.delete(1);
```

---

## 📅 Appointment API

```javascript
// Get All Appointments (with optional filters)
const { data: appointments } = await appointmentAPI.getAll({
  therapistId: 1,
  patientId: 5,
  status: 'scheduled',
  date: '2024-12-20'
});

// Get Single Appointment
const { data: appointment } = await appointmentAPI.getById(1);

// Create Appointment
const { data: newAppointment } = await appointmentAPI.create({
  therapistId: 1,
  patientId: 5,
  service: "Physiotherapy",
  date: "2024-12-20T10:00:00Z",
  time: "10:00",
  duration: 60,
  status: "scheduled"
});

// Update Appointment Details
await appointmentAPI.update(1, {
  service: "Sports Massage",
  duration: 45
});

// Get Available Slots for Booking
const { data: slots } = await appointmentAPI.getAvailableSlots(
  therapistId = 1,
  date = "2024-12-20",
  duration = 60  // optional, default is 60
);
// Returns: { slots: ["09:00", "10:00", "11:00", ...] }

// Update Appointment Status
await appointmentAPI.updateStatus(1, 'completed');
// status options: 'scheduled', 'completed', 'cancelled'

// Reschedule Appointment
await appointmentAPI.reschedule(1, {
  newTherapistId: 2,
  newDate: "2024-12-21",
  newTime: "14:00"
});

// Delete Appointment
await appointmentAPI.delete(1);
```

---

## ⚙️ Error Handling

```javascript
try {
  const { data } = await patientAPI.getAll();
  console.log('Patients:', data);
} catch (error) {
  if (error.response?.status === 401) {
    console.log('Unauthorized - please login');
  } else if (error.response?.status === 404) {
    console.log('Not found');
  } else if (error.response?.status === 400) {
    console.log('Bad request:', error.response.data.message);
  } else {
    console.log('Error:', error.message);
  }
}
```

---

## 🔐 Authentication

```javascript
// All requests automatically include JWT token from localStorage
// Token is set after login:

const response = await adminAPI.login('admin@example.com', 'password');
localStorage.setItem('token', response.data.token);

// If token expires:
// - Response interceptor catches 401
// - Token is removed from localStorage
// - User is redirected to /admin/login
```

---

## 📊 Example Component Usage

```javascript
import { useState, useEffect } from 'react';
import { patientAPI, appointmentAPI } from '@/services/api';

function BookingForm() {
  const [patients, setPatients] = useState([]);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const { data } = await patientAPI.getAll();
      setPatients(data);
    } catch (error) {
      console.error('Failed to fetch patients:', error);
    }
  };

  const handleGetSlots = async (therapistId, date) => {
    try {
      setLoading(true);
      const { data } = await appointmentAPI.getAvailableSlots(
        therapistId,
        date,
        60
      );
      setSlots(data.slots);
    } catch (error) {
      console.error('Failed to fetch slots:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookAppointment = async (formData) => {
    try {
      await appointmentAPI.create(formData);
      alert('Appointment booked successfully!');
      // Refresh or redirect
    } catch (error) {
      alert('Failed to book appointment: ' + error.response?.data?.message);
    }
  };

  return (
    <div>
      {/* Your form JSX */}
    </div>
  );
}

export default BookingForm;
```

---

## 🧪 Testing in Browser Console

```javascript
// Health check
import { healthCheck } from '@/services/api';
await healthCheck();

// Get all patients
import { patientAPI } from '@/services/api';
await patientAPI.getAll();

// Create a test patient
await patientAPI.create({
  fullName: "Test User",
  phone: "+1234567890",
  age: 25,
  gender: "Male"
});
```

---

**API Base URL:** `http://localhost:5000/api`  
**Configured in:** `frontend/.env` (VITE_API_URL)
