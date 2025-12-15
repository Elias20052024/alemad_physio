# API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## Admin Endpoints

### POST /admin/login
Login with admin credentials

**Request Body:**
```json
{
  "email": "admin@alemad.com",
  "password": "admin123"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGc...",
  "admin": {
    "id": 1,
    "name": "Admin User",
    "email": "admin@alemad.com"
  }
}
```

---

### POST /admin/register
Register a new admin account

**Request Body:**
```json
{
  "name": "New Admin",
  "email": "newadmin@alemad.com",
  "password": "securepassword"
}
```

**Response (201):**
```json
{
  "message": "Admin created",
  "admin": {
    "id": 2,
    "name": "New Admin",
    "email": "newadmin@alemad.com"
  }
}
```

---

### GET /admin/stats
Get dashboard statistics (Protected)

**Response (200):**
```json
{
  "totalTherapists": 5,
  "totalPatients": 25,
  "appointmentsToday": 8,
  "upcomingAppointments": 42
}
```

---

## Therapist Endpoints

### GET /therapists
Get all therapists (Public)

**Response (200):**
```json
[
  {
    "id": 1,
    "name": "Dr. Ahmed Hassan",
    "specialty": "Physical Therapy",
    "email": "ahmed@alemad.com",
    "phone": "+966501234567",
    "schedules": [...],
    "breaks": [...],
    "daysOff": [...]
  }
]
```

---

### GET /therapists/:id
Get specific therapist details (Public)

**Response (200):**
```json
{
  "id": 1,
  "name": "Dr. Ahmed Hassan",
  "specialty": "Physical Therapy",
  "email": "ahmed@alemad.com",
  "phone": "+966501234567",
  "schedules": [
    {
      "id": 1,
      "dayOfWeek": 0,
      "startTime": "09:00",
      "endTime": "17:00"
    }
  ],
  "appointments": [...]
}
```

---

### POST /therapists
Create a new therapist (Admin Only)

**Request Body:**
```json
{
  "name": "Dr. Mohammed Ali",
  "specialty": "Sports Injury",
  "email": "mohammed@alemad.com",
  "phone": "+966509876543"
}
```

**Response (201):**
```json
{
  "message": "Therapist created",
  "therapist": {
    "id": 6,
    "name": "Dr. Mohammed Ali",
    "specialty": "Sports Injury",
    "email": "mohammed@alemad.com",
    "phone": "+966509876543"
  }
}
```

---

### PUT /therapists/:id
Update therapist (Admin Only)

**Request Body:**
```json
{
  "name": "Dr. Mohammed Ali Updated",
  "phone": "+966505555555"
}
```

**Response (200):**
```json
{
  "message": "Therapist updated",
  "therapist": {...}
}
```

---

### DELETE /therapists/:id
Delete therapist (Admin Only)

**Response (200):**
```json
{
  "message": "Therapist deleted"
}
```

---

### GET /therapists/:id/schedule
Get therapist's work schedule (Public)

**Response (200):**
```json
[
  {
    "id": 1,
    "therapistId": 1,
    "dayOfWeek": 0,
    "startTime": "09:00",
    "endTime": "17:00"
  },
  {
    "id": 2,
    "therapistId": 1,
    "dayOfWeek": 1,
    "startTime": "09:00",
    "endTime": "17:00"
  }
]
```

---

### POST /therapists/:id/schedule
Create or update therapist schedule (Admin Only)

**Request Body:**
```json
{
  "dayOfWeek": 0,
  "startTime": "09:00",
  "endTime": "17:00"
}
```

**Response (200):**
```json
{
  "message": "Schedule updated",
  "schedule": {
    "id": 1,
    "therapistId": 1,
    "dayOfWeek": 0,
    "startTime": "09:00",
    "endTime": "17:00"
  }
}
```

**Note:** dayOfWeek: 0 = Monday, 1 = Tuesday, ..., 5 = Saturday, 6 = Sunday

---

### POST /therapists/:id/breaks
Add a break time (Admin Only)

**Request Body:**
```json
{
  "startTime": "2024-12-10T12:00:00Z",
  "endTime": "2024-12-10T13:00:00Z"
}
```

**Response (201):**
```json
{
  "message": "Break added",
  "break": {
    "id": 1,
    "therapistId": 1,
    "startTime": "2024-12-10T12:00:00.000Z",
    "endTime": "2024-12-10T13:00:00.000Z"
  }
}
```

---

### POST /therapists/:id/dayoff
Add a day off (Admin Only)

**Request Body:**
```json
{
  "date": "2024-12-25"
}
```

**Response (201):**
```json
{
  "message": "Day off added",
  "dayOff": {
    "id": 1,
    "therapistId": 1,
    "date": "2024-12-25T00:00:00.000Z"
  }
}
```

---

## Patient Endpoints

### GET /patients
Get all patients (Public)

**Response (200):**
```json
[
  {
    "id": 1,
    "fullName": "Hassan Mohammed",
    "phone": "+966501111111",
    "age": 35,
    "gender": "Male",
    "medicalHistory": "Previous knee injury",
    "appointments": [...]
  }
]
```

---

### GET /patients/:id
Get specific patient (Public)

**Response (200):**
```json
{
  "id": 1,
  "fullName": "Hassan Mohammed",
  "phone": "+966501111111",
  "age": 35,
  "gender": "Male",
  "medicalHistory": "Previous knee injury",
  "appointments": [
    {
      "id": 1,
      "therapistId": 1,
      "patientId": 1,
      "service": "Physical Therapy Session",
      "date": "2024-12-15T14:00:00.000Z",
      "time": "14:00",
      "status": "scheduled"
    }
  ]
}
```

---

### POST /patients
Create new patient (Admin Only)

**Request Body:**
```json
{
  "fullName": "Sarah Ahmed",
  "phone": "+966502222222",
  "age": 28,
  "gender": "Female",
  "medicalHistory": "No previous injuries"
}
```

**Response (201):**
```json
{
  "message": "Patient created",
  "patient": {
    "id": 2,
    "fullName": "Sarah Ahmed",
    "phone": "+966502222222",
    "age": 28,
    "gender": "Female"
  }
}
```

---

### PUT /patients/:id
Update patient (Admin Only)

**Request Body:**
```json
{
  "medicalHistory": "Recent shoulder injury"
}
```

**Response (200):**
```json
{
  "message": "Patient updated",
  "patient": {...}
}
```

---

### DELETE /patients/:id
Delete patient (Admin Only)

**Response (200):**
```json
{
  "message": "Patient deleted"
}
```

---

### GET /patients/:id/appointments
Get patient's appointments (Public)

**Response (200):**
```json
[
  {
    "id": 1,
    "therapistId": 1,
    "patientId": 1,
    "service": "Physical Therapy Session",
    "date": "2024-12-15T14:00:00.000Z",
    "time": "14:00",
    "status": "scheduled",
    "therapist": {
      "id": 1,
      "name": "Dr. Ahmed Hassan"
    }
  }
]
```

---

## Appointment Endpoints

### GET /appointments
Get appointments with optional filters (Public)

**Query Parameters:**
- `therapistId` - Filter by therapist
- `patientId` - Filter by patient
- `date` - Filter by date (YYYY-MM-DD)
- `status` - Filter by status (scheduled/completed/cancelled)

**Example:**
```
GET /appointments?therapistId=1&status=scheduled
```

**Response (200):**
```json
[
  {
    "id": 1,
    "therapistId": 1,
    "patientId": 1,
    "service": "Physical Therapy Session",
    "date": "2024-12-15T14:00:00.000Z",
    "time": "14:00",
    "status": "scheduled",
    "duration": 60,
    "therapist": {...},
    "patient": {...}
  }
]
```

---

### GET /appointments/available-slots
Get available time slots (Public)

**Query Parameters:**
- `therapistId` - Therapist ID (required)
- `date` - Date (YYYY-MM-DD) (required)
- `duration` - Session duration in minutes (default: 60)

**Example:**
```
GET /appointments/available-slots?therapistId=1&date=2024-12-20&duration=60
```

**Response (200):**
```json
{
  "slots": ["09:00", "09:30", "10:00", "10:30", "11:00", "14:00"],
  "message": "Available slots fetched"
}
```

---

### POST /appointments
Create new appointment (Public)

**Request Body:**
```json
{
  "therapistId": 1,
  "patientId": 1,
  "service": "Physical Therapy Session",
  "date": "2024-12-20",
  "time": "14:00",
  "duration": 60
}
```

**Response (201):**
```json
{
  "message": "Appointment created",
  "appointment": {
    "id": 5,
    "therapistId": 1,
    "patientId": 1,
    "service": "Physical Therapy Session",
    "date": "2024-12-20T14:00:00.000Z",
    "time": "14:00",
    "status": "scheduled",
    "duration": 60
  }
}
```

**Validation:**
- Time must be within therapist's working hours
- No breaks during appointment time
- No double booking
- Therapist must not be on day off

---

### PUT /appointments/:id
Update appointment (Admin Only)

**Request Body:**
```json
{
  "date": "2024-12-21",
  "time": "15:00",
  "service": "Extended Physical Therapy Session"
}
```

**Response (200):**
```json
{
  "message": "Appointment updated",
  "appointment": {...}
}
```

---

### PATCH /appointments/:id/cancel
Cancel appointment (Admin Only)

**Response (200):**
```json
{
  "message": "Appointment cancelled",
  "appointment": {
    "id": 5,
    "status": "cancelled"
  }
}
```

---

### DELETE /appointments/:id
Delete appointment (Admin Only)

**Response (200):**
```json
{
  "message": "Appointment deleted"
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "message": "All required fields must be provided"
}
```

### 401 Unauthorized
```json
{
  "message": "No token provided"
}
```

### 404 Not Found
```json
{
  "message": "Therapist not found"
}
```

### 409 Conflict
```json
{
  "message": "Email already in use"
}
```

### 500 Server Error
```json
{
  "message": "Error creating therapist",
  "error": "error details"
}
```

---

## Example Requests (cURL)

### Login as Admin
```bash
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@alemad.com","password":"admin123"}'
```

### Get All Therapists
```bash
curl http://localhost:5000/api/therapists
```

### Get Available Slots
```bash
curl "http://localhost:5000/api/appointments/available-slots?therapistId=1&date=2024-12-20"
```

### Book Appointment
```bash
curl -X POST http://localhost:5000/api/appointments \
  -H "Content-Type: application/json" \
  -d '{
    "therapistId": 1,
    "patientId": 1,
    "service": "Physical Therapy",
    "date": "2024-12-20",
    "time": "14:00"
  }'
```

### Create Therapist (Protected)
```bash
curl -X POST http://localhost:5000/api/therapists \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "Dr. Ahmed Hassan",
    "specialty": "Physical Therapy",
    "email": "ahmed@alemad.com",
    "phone": "+966501234567"
  }'
```

---

**API Version**: 1.0.0  
**Last Updated**: December 2024
