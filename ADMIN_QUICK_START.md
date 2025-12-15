# Quick Start: Admin Add Feature

## What's New?
Admins can now easily add, edit, and delete therapists and patients from the admin panel with full validation and error handling.

## Accessing the Feature

### Admin Dashboard Navigation
```
/admin/therapists   → Manage Therapists
/admin/patients     → Manage Patients
```

## Quick Steps

### Add a Therapist
1. Go to `/admin/therapists`
2. Click "Add Therapist"
3. Enter: Name, Specialty, Email, Phone
4. Click "Add"
5. See success notification ✓

### Add a Patient
1. Go to `/admin/patients`
2. Click "Add Patient"
3. Enter: Full Name, Phone, Age, Gender
4. Optionally add Medical History
5. Click "Add"
6. See success notification ✓

### Edit Records
- Click the edit icon (✏️) in the Actions column
- Update fields
- Click "Update"

### Delete Records
- Click the delete icon (🗑️) in the Actions column
- Confirm deletion
- Record is removed

## Validation Rules

### Therapist Fields
| Field | Requirements |
|-------|--------------|
| Name | Non-empty, at least 1 character |
| Specialty | Non-empty, at least 1 character |
| Email | Valid email format (user@domain.com) |
| Phone | 7+ digits/characters, can include +, -, (), spaces |

### Patient Fields
| Field | Requirements |
|-------|--------------|
| Full Name | Non-empty, at least 1 character |
| Phone | 7+ digits/characters, can include +, -, (), spaces |
| Age | Number between 0 and 150 |
| Gender | Male, Female, or Other |
| Medical History | Optional, plain text |

## Error Messages

| Error | Meaning | Solution |
|-------|---------|----------|
| "Invalid email format" | Email doesn't match standard format | Use format: user@domain.com |
| "Invalid phone number format" | Phone too short or invalid characters | Use at least 7 digits, +, -, (), or spaces |
| "A therapist/patient with this email already exists" | Email already in database | Use a different email address |
| "Age must be a valid number between 0 and 150" | Age out of range | Enter age between 0-150 |
| "Gender must be Male, Female, or Other" | Invalid gender selection | Select from the dropdown |
| "All required fields missing" | Missing required information | Fill in all required fields |

## Features

✅ **Add Records** - Create new therapists and patients  
✅ **Edit Records** - Modify existing information  
✅ **Delete Records** - Remove therapists/patients with confirmation  
✅ **Input Validation** - Real-time error feedback  
✅ **Error Notifications** - Clear messages on failure  
✅ **Success Notifications** - Confirmation on successful operations  
✅ **Admin Authentication** - Only authenticated admins can access  

## Files Modified

### Frontend
- `/frontend/src/admin/ManageTherapists.jsx` - Enhanced with Snackbar notifications
- `/frontend/src/admin/ManagePatients.jsx` - Enhanced with Snackbar notifications

### Backend
- `/backend/src/controllers/therapistController.js` - Added comprehensive validation
- `/backend/src/controllers/patientController.js` - Added comprehensive validation

### Documentation
- `/ADMIN_ADD_FEATURE.md` - Complete implementation details

## API Endpoints

All endpoints require `Authorization: Bearer <token>` header

### Therapist Endpoints
```
POST   /api/therapists          - Create therapist
GET    /api/therapists          - List all therapists
GET    /api/therapists/:id      - Get therapist details
PUT    /api/therapists/:id      - Update therapist
DELETE /api/therapists/:id      - Delete therapist
```

### Patient Endpoints
```
POST   /api/patients            - Create patient
GET    /api/patients            - List all patients
GET    /api/patients/:id        - Get patient details
PUT    /api/patients/:id        - Update patient
DELETE /api/patients/:id        - Delete patient
```

## Troubleshooting

### "No token provided" error
- Make sure you're logged in as admin
- Check if token is stored in localStorage
- Try logging in again

### Form won't submit
- Check for red validation messages
- Ensure all required fields are filled
- Email and phone must match required formats

### Can't see added records
- Refresh the page
- Check if the record exists in the table
- Check browser console for any errors

## Example Data

### Therapist
```json
{
  "name": "Dr. Ahmed Hassan",
  "specialty": "Sports Medicine",
  "email": "ahmed@clinic.com",
  "phone": "+966-50-1234567"
}
```

### Patient
```json
{
  "fullName": "Mohammed Ali",
  "phone": "+966-50-9876543",
  "age": 35,
  "gender": "Male",
  "medicalHistory": "History of knee injury, recovering well"
}
```

## Security Notes
- All operations require valid admin authentication token
- Emails are stored in lowercase for consistency
- Phone numbers are trimmed of extra spaces
- Passwords are never exposed in API responses
- All input is validated on both frontend and backend

---

**Need Help?** Check `ADMIN_ADD_FEATURE.md` for detailed documentation
