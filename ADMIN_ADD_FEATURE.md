# Admin Add Therapists and Patients Feature

## Overview
This document describes the implementation of the admin functionality to add, edit, and delete therapists and patients in the Alemad Physio system.

## Feature Description
The admin panel now provides a complete interface for managing therapists and patients, including:
- **Add new therapists** with name, specialty, email, and phone
- **Add new patients** with full name, phone, age, gender, and medical history
- **Edit existing records** with validation
- **Delete records** with confirmation
- **Real-time error feedback** with snackbar notifications
- **Input validation** on both frontend and backend

## Frontend Implementation

### Components Modified/Created

#### 1. **ManageTherapists.jsx** (`/frontend/src/admin/ManageTherapists.jsx`)
- **Features:**
  - Display list of therapists in a table
  - Add new therapist dialog with form validation
  - Edit therapist details
  - Delete therapist with confirmation
  - Error/success notifications via Snackbar
  
- **Key Functions:**
  - `fetchTherapists()` - Retrieves all therapists from backend
  - `handleOpenDialog()` - Opens dialog for add/edit
  - `handleSave()` - Saves therapist (create or update)
  - `handleDelete()` - Deletes therapist after confirmation

- **State Management:**
  ```javascript
  const [therapists, setTherapists] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    specialty: '',
    email: '',
    phone: '',
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  ```

#### 2. **ManagePatients.jsx** (`/frontend/src/admin/ManagePatients.jsx`)
- **Features:**
  - Display list of patients in a table
  - Add new patient dialog with form validation
  - Edit patient details
  - Delete patient with confirmation
  - Error/success notifications via Snackbar

- **Key Functions:**
  - `fetchPatients()` - Retrieves all patients from backend
  - `handleOpenDialog()` - Opens dialog for add/edit
  - `handleSave()` - Saves patient (create or update)
  - `handleDelete()` - Deletes patient after confirmation

- **State Management:**
  ```javascript
  const [patients, setPatients] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    age: '',
    gender: '',
    medicalHistory: '',
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  ```

### UI/UX Enhancements
- **Material-UI Components Used:**
  - `Dialog` - For add/edit forms
  - `Table` - For displaying records
  - `Snackbar` & `Alert` - For notifications
  - `TextField` - For form inputs
  - `Button` - For actions
  - `IconButton` - For quick actions (edit/delete)

- **Notifications:**
  - Success messages on add/edit/delete
  - Error messages with backend error details
  - Auto-dismiss after 6 seconds

## Backend Implementation

### Controllers Modified

#### 1. **therapistController.js** (`/backend/src/controllers/therapistController.js`)
- **createTherapist()** - Enhanced with validation:
  - Checks all required fields
  - Validates email format (regex)
  - Validates phone format (7+ digits)
  - Prevents duplicate emails
  - Trims whitespace from inputs
  - Normalizes email to lowercase

- **updateTherapist()** - Enhanced with validation:
  - Optional field validation
  - Email uniqueness check (excluding current record)
  - Phone format validation
  - Data normalization

#### 2. **patientController.js** (`/backend/src/controllers/patientController.js`)
- **createPatient()** - Enhanced with validation:
  - Checks all required fields
  - Validates phone format (7+ digits)
  - Validates age (0-150 range)
  - Validates gender against allowed values
  - Trims and normalizes input data

- **updatePatient()** - Enhanced with validation:
  - Optional field validation
  - Age range validation
  - Gender validation
  - Phone format validation

### Validation Rules

#### Therapist Validation
| Field | Rules |
|-------|-------|
| Name | Required, not empty after trim |
| Specialty | Required, not empty after trim |
| Email | Required, valid email format, unique in database |
| Phone | Required, 7+ characters, alphanumeric with allowed symbols |

#### Patient Validation
| Field | Rules |
|-------|-------|
| Full Name | Required, not empty after trim |
| Phone | Required, 7+ characters, alphanumeric with allowed symbols |
| Age | Required, integer 0-150 |
| Gender | Required, must be 'Male', 'Female', or 'Other' |
| Medical History | Optional, trimmed if provided |

### Routes
All routes are protected with `authenticateAdmin` middleware:

```javascript
// Therapist Routes
router.post('/', authenticateAdmin, createTherapist);
router.put('/:id', authenticateAdmin, updateTherapist);
router.delete('/:id', authenticateAdmin, deleteTherapist);

// Patient Routes
router.post('/', authenticateAdmin, createPatient);
router.put('/:id', authenticateAdmin, updatePatient);
router.delete('/:id', authenticateAdmin, deletePatient);
```

## API Service Layer

The frontend uses `apiService.js` to communicate with the backend:

```javascript
// Therapist Service
export const therapistService = {
  getAllTherapists: () => apiClient.get('/therapists'),
  createTherapist: (data) => apiClient.post('/therapists', data),
  updateTherapist: (id, data) => apiClient.put(`/therapists/${id}`, data),
  deleteTherapist: (id) => apiClient.delete(`/therapists/${id}`),
};

// Patient Service
export const patientService = {
  getAllPatients: () => apiClient.get('/patients'),
  createPatient: (data) => apiClient.post('/patients', data),
  updatePatient: (id, data) => apiClient.put(`/patients/${id}`, data),
  deletePatient: (id) => apiClient.delete(`/patients/${id}`),
};
```

## Routing
Admin users can access the management pages at:
- `/admin/therapists` - Manage therapists
- `/admin/patients` - Manage patients

Both routes are protected with `AdminProtectedRoute` component that checks for valid authentication token.

## How to Use

### Adding a Therapist
1. Navigate to `/admin/therapists`
2. Click the "Add Therapist" button
3. Fill in the form:
   - Name: Full name of the therapist
   - Specialty: Area of expertise (e.g., "Sports Medicine")
   - Email: Valid email address
   - Phone: Phone number with at least 7 digits
4. Click "Add" button
5. Success notification will appear if added successfully

### Adding a Patient
1. Navigate to `/admin/patients`
2. Click the "Add Patient" button
3. Fill in the form:
   - Full Name: Patient's full name
   - Phone: Phone number with at least 7 digits
   - Age: Number between 0-150
   - Gender: Select from Male, Female, or Other
   - Medical History: Optional detailed history
4. Click "Add" button
5. Success notification will appear if added successfully

### Editing a Record
1. Click the edit icon (pencil) in the Actions column
2. Modify the fields as needed
3. Click "Update" button
4. Success notification will appear

### Deleting a Record
1. Click the delete icon (trash) in the Actions column
2. Confirm the deletion in the dialog
3. Record will be deleted and notification will appear

## Error Handling
All operations include error handling:
- **Duplicate Email**: "A therapist with this email already exists"
- **Invalid Email**: "Invalid email format"
- **Invalid Phone**: "Invalid phone number format"
- **Invalid Age**: "Age must be a valid number between 0 and 150"
- **Invalid Gender**: "Gender must be Male, Female, or Other"
- **Missing Fields**: Lists which required fields are missing
- **Server Errors**: Generic error message with option to try again

## Security
- All admin operations require authentication via JWT token
- `authenticateAdmin` middleware validates token on all protected routes
- Email and phone inputs are normalized to prevent inconsistencies
- Input validation prevents malformed data from being stored

## Database Schema
The system uses Prisma ORM with the following models:

### Therapist Model
```prisma
model Therapist {
  id        Int     @id @default(autoincrement())
  name      String
  specialty String
  email     String  @unique
  phone     String
  schedules TherapistSchedule[]
  breaks    TherapistBreak[]
  daysOff   TherapistDayOff[]
  appointments Appointment[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  @@map("therapists")
}
```

### Patient Model
```prisma
model Patient {
  id           Int     @id @default(autoincrement())
  fullName     String
  phone        String
  age          Int
  gender       String
  medicalHistory String?
  appointments Appointment[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  @@map("patients")
}
```

## Testing the Feature

### Prerequisites
1. Admin must be logged in with a valid JWT token
2. Backend server must be running on configured port
3. Database must be accessible and migrations applied

### Test Cases
1. **Add Therapist with Valid Data** ✓
2. **Add Therapist with Duplicate Email** - Should show error
3. **Add Therapist with Invalid Email** - Should show error
4. **Add Therapist with Short Phone** - Should show error
5. **Add Patient with Valid Data** ✓
6. **Add Patient with Invalid Age** - Should show error
7. **Add Patient with Invalid Gender** - Should show error
8. **Edit Therapist Details** ✓
9. **Edit Patient Details** ✓
10. **Delete Therapist** ✓
11. **Delete Patient** ✓

## Future Enhancements
- Bulk import of therapists/patients (CSV)
- Advanced search and filtering
- Export functionality (PDF/Excel)
- Therapist availability scheduling
- Patient medical records attachment
- Activity logging and audit trail
- Email notifications on profile changes
