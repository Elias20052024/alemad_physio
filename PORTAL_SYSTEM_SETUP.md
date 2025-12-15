# Portal System Setup Guide

## Overview
The authentication and user portal system has been successfully integrated into the Alemad Physiotherapy Center website. Users can now log in with role-based access to their specific portals.

## Routes Overview

### Authentication Routes
- **`/login`** - Multi-role login page (Patient, Therapist, Admin)
  - Tab-based role selection
  - Email and password input
  - Form validation
  - Redirects to appropriate dashboard based on selected role

### User Portal Routes (Protected)
- **`/patient-dashboard`** - Patient appointment management portal
  - View all scheduled appointments
  - Edit appointment details
  - Cancel appointments
  - Book new appointments
  - **Access**: Requires `isLoggedIn: true` and `userRole: 'patient'`

- **`/therapist-portal`** - Therapist scheduling and management portal
  - View daily appointments statistics
  - Manage patient appointments
  - Track patient information
  - View pending appointments
  - **Access**: Requires `isLoggedIn: true` and `userRole: 'therapist'`

- **`/admin-portal`** - Administrative management portal
  - System statistics and analytics
  - Manage patients and therapists
  - View all appointments
  - User account management
  - **Access**: Requires `isLoggedIn: true` and `userRole: 'admin'`

### Legacy Admin Routes (Protected)
- **`/admin/login`** - Admin login page
- **`/admin/dashboard`** - Admin dashboard
- **`/admin/therapists`** - Therapist management
- **`/admin/patients`** - Patient management
- **`/admin/appointments`** - Appointment management

## Demo Credentials

### Patient Login
- **Role**: Patient (select from tab)
- **Email**: Any email (demo mode)
- **Password**: Any password (demo mode)

### Therapist Login
- **Role**: Therapist (select from tab)
- **Email**: Any email (demo mode)
- **Password**: Any password (demo mode)

### Admin Login
- **Role**: Admin (select from tab)
- **Email**: Any email (demo mode)
- **Password**: Any password (demo mode)

## Components

### Created Files

#### 1. `/frontend/src/pages/Login.jsx`
**Purpose**: Multi-role authentication entry point
- Tab-based role selection (Patient/Therapist/Admin)
- Email and password validation
- localStorage session persistence
- Form error handling
- Responsive design
- Full English/Arabic support

**Key Features**:
```javascript
- Tab switching for role selection
- Basic form validation
- localStorage.setItem('isLoggedIn', true)
- localStorage.setItem('userRole', selectedRole)
- Redirect on successful login
- Error message display
```

#### 2. `/frontend/src/pages/PatientDashboard.jsx`
**Purpose**: Patient appointment management
- Display all patient appointments in table format
- Edit appointment date/time
- Cancel appointments with confirmation
- Book new appointment button
- Appointment status indicators
- Logout functionality

**Key Features**:
```javascript
- DataGrid with appointment listings
- Edit Dialog for date/time modification
- Cancel Dialog with confirmation
- Status colors: confirmed (success), pending (warning), completed (info), cancelled (error)
- Mock data with 3 sample appointments
- Responsive table layout
```

#### 3. `/frontend/src/pages/TherapistPortal.jsx`
**Purpose**: Therapist scheduling and patient management
- Statistics cards (Today's Appointments, Pending, Total Patients, Completed)
- Tab navigation (All Appointments, Pending, Patient Notes)
- Appointment table with patient names and times
- View appointment details button

**Key Features**:
```javascript
- 4 analytics cards with styled left borders
- Responsive card grid layout
- Tab-based view management
- Color-coded status indicators
- Mock data with 3 appointments
- Patient name display
```

#### 4. `/frontend/src/pages/AdminPortal.jsx`
**Purpose**: System-wide management and oversight
- Administrator statistics (Patients, Therapists, Appointments, Revenue)
- Tab-based navigation (Patients, Therapists, Appointments)
- Patient management table with edit/delete
- Therapist management table
- Status indicators (active/inactive)

**Key Features**:
```javascript
- 4 analytics cards showing system metrics
- Tabbed interface for different management areas
- Patient and Therapist tables with CRUD buttons
- Status color coding (active = green, inactive = red)
- Mock data for demonstration
- Edit and Delete action buttons (UI prepared for backend)
```

#### 5. `/frontend/src/components/ProtectedRoute.jsx`
**Purpose**: Authentication and authorization wrapper
- Checks localStorage for authentication status
- Validates user role against required roles
- Redirects unauthorized users to login
- Redirects unauthenticated users appropriately

**Key Features**:
```javascript
const ProtectedRoute = ({ children, allowedRoles }) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  const userRole = localStorage.getItem('userRole');
  
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(userRole)) 
    return <Navigate to="/" replace />;
  
  return children;
};
```

## How It Works

### Login Flow
1. User navigates to `/login`
2. Selects role via tabs: Patient, Therapist, or Admin
3. Enters email and password (demo accepts any values)
4. Clicks "Login"
5. System stores:
   - `isLoggedIn: 'true'` in localStorage
   - `userRole: 'patient' | 'therapist' | 'admin'` in localStorage
6. User redirected to appropriate dashboard:
   - Patient → `/patient-dashboard`
   - Therapist → `/therapist-portal`
   - Admin → `/admin-portal`

### Protected Route Access
1. User tries to access protected route (e.g., `/patient-dashboard`)
2. `ProtectedRoute` component checks localStorage
3. If `isLoggedIn` not set → redirect to `/login`
4. If `userRole` not in `allowedRoles` → redirect to home
5. If authenticated and authorized → render dashboard

### Logout
All portals have a logout button that:
1. Clears localStorage
2. Redirects to home page

## Current Limitations (Demo Mode)

### Authentication
- ✅ Uses localStorage (demo only, not secure for production)
- ❌ No backend validation
- ❌ No password hashing
- ❌ No JWT tokens
- ❌ No email verification

### Appointment Management
- ✅ Frontend CRUD operations work
- ❌ Changes not persisted to backend
- ❌ No real appointment scheduling
- ❌ No conflict detection

### User Management
- ✅ UI for editing/deleting users
- ❌ No actual database operations
- ❌ No real user accounts
- ❌ No permission levels

## Next Steps for Production

### 1. Backend Integration
```javascript
// Replace localStorage mock with real API calls
// /api/auth/login - User authentication
// /api/appointments - Appointment CRUD
// /api/users - User management
// /api/therapists - Therapist management
```

### 2. Authentication Enhancement
- Implement JWT token-based authentication
- Add password hashing (bcrypt)
- Add email verification
- Add password reset functionality
- Implement refresh token rotation

### 3. Data Persistence
- Connect to real database (Prisma + MongoDB/PostgreSQL)
- Implement appointment storage and retrieval
- Add user account management
- Implement transaction handling

### 4. Additional Features
- Appointment reminders/notifications
- Therapist availability scheduling
- Payment gateway integration
- Patient medical history
- Therapist notes and progress tracking

## File Locations

```
frontend/
  src/
    pages/
      Login.jsx                    # Login page
      PatientDashboard.jsx         # Patient portal
      TherapistPortal.jsx          # Therapist portal
      AdminPortal.jsx              # Admin portal
    components/
      ProtectedRoute.jsx           # Route protection
    App.jsx                        # Updated routing
```

## Testing the System

1. **Start the frontend**:
   ```bash
   cd frontend
   npm run dev
   ```

2. **Visit login page**:
   ```
   http://localhost:5173/login
   ```

3. **Test Patient Flow**:
   - Select "Patient" tab
   - Enter any email and password
   - Click Login
   - Should redirect to `/patient-dashboard`
   - View sample appointments
   - Try editing/canceling appointments

4. **Test Therapist Flow**:
   - Select "Therapist" tab
   - Enter any email and password
   - Click Login
   - Should redirect to `/therapist-portal`
   - View statistics and appointments

5. **Test Admin Flow**:
   - Select "Admin" tab
   - Enter any email and password
   - Click Login
   - Should redirect to `/admin-portal`
   - View user management tables

6. **Test Logout**:
   - Click Logout button in any portal
   - Should return to home page
   - Attempting to visit protected route redirects to login

## Language Support

All portal components support full English/Arabic translation:
- Language switcher in header applies to portals
- All UI text uses translation context
- All form labels translated
- Status messages in user's selected language

## Mobile Responsiveness

All portal components are fully responsive:
- **Mobile** (xs): Single column, stacked layout
- **Tablet** (sm/md): Two column where appropriate
- **Desktop** (lg/xl): Full multi-column layouts
- Touch-friendly buttons and inputs
- Optimized table views for mobile
