# Admin Password Reset Feature

## Overview
This feature allows admins to secretly reset passwords for users (patients, therapists) without the users knowing. This is useful when an admin forgets a user's password or needs to regain access.

## How It Works

### Backend Implementation

**New Endpoint:** `POST /api/admin/reset-user-password`
- **Route:** Requires admin authentication
- **Input:** 
  - `userId` (integer): The ID of the user whose password to reset
  - `newPassword` (string): The new password (minimum 6 characters)
- **Output:** Success message with user details

**New Endpoint:** `GET /api/admin/users`
- **Route:** Requires admin authentication  
- **Output:** List of all patients and therapists with their details

### Frontend Implementation

**New Component:** `ResetUserPassword.jsx`
- Located at: `frontend/src/admin/ResetUserPassword.jsx`
- Features:
  - Lists all users (patients and therapists)
  - Search functionality by name or email
  - Password reset dialog with confirmation
  - Real-time validation of password requirements
  - Success/error notifications

**New Route:** `/admin/reset-password`
- Only accessible to authenticated admins
- Protected by the AdminLayout wrapper

### Integration in Admin Panel

The feature is integrated into the admin sidebar with:
- New navigation link: "Reset User Passwords" (highlighted in orange)
- Easy access from main admin panel
- Consistent styling with existing admin features

## How to Use

### For Admins:

1. **Log in to Admin Portal** at `/admin/login`

2. **Navigate to Password Reset** - Click "Reset User Passwords" in the sidebar (orange link)

3. **Find the User** - Search by name or email in the user list

4. **Reset Password** - Click the reset icon (🔄) next to the user

5. **Enter New Password** - In the dialog:
   - Enter the new password
   - Confirm the password
   - Click "Reset Password"

6. **Confirmation** - Success message appears confirming the password reset

### Hidden/Discreet Operation

- The reset happens server-side without any notification to the user
- The user's old password is immediately replaced
- No audit log visible to regular users
- Only appears in admin dashboard

## API Request Examples

### Reset User Password

```bash
curl -X POST http://localhost:3000/api/admin/reset-user-password \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 5,
    "newPassword": "newSecurePassword123"
  }'
```

**Response:**
```json
{
  "message": "Password reset successfully",
  "user": {
    "id": 5,
    "email": "patient@example.com",
    "name": "John Doe",
    "role": "patient"
  }
}
```

### Get All Users

```bash
curl -X GET http://localhost:3000/api/admin/users \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

**Response:**
```json
[
  {
    "id": 1,
    "email": "ali@example.com",
    "name": "Ali Mohammad",
    "role": "patient",
    "createdAt": "2024-01-15T10:30:00Z",
    "patient": {
      "phone": "0799988855",
      "gender": "male"
    }
  },
  {
    "id": 2,
    "email": "dr.sara@example.com",
    "name": "Dr. Sara",
    "role": "therapist",
    "createdAt": "2024-01-10T08:00:00Z",
    "therapist": {
      "specialization": "Physical Therapy",
      "phone": "0791234567"
    }
  }
]
```

## Security Considerations

1. **Admin Authentication Required** - All endpoints require valid admin JWT token
2. **Server-Side Only** - Password changes happen only on the server
3. **No Notification** - The user is not notified of password changes
4. **Password Hashing** - All passwords are bcrypt hashed before storage

## File Changes

### Backend Files Modified:
- `/backend/src/controllers/adminController.js` - Added `resetUserPassword()` and `getAllUsers()`
- `/backend/src/routes/adminRoutes.js` - Added new routes

### Frontend Files Created:
- `/frontend/src/admin/ResetUserPassword.jsx` - New component

### Frontend Files Modified:
- `/frontend/src/App.jsx` - Added import and route for ResetUserPassword

## Troubleshooting

### Password Reset Not Working
- Verify admin is authenticated
- Check that userId exists
- Ensure password is at least 6 characters
- Check browser console for error messages

### User Not Showing in List
- User must have role 'patient' or 'therapist'
- Admins are not shown in the reset list
- Check database for user existence

### Authentication Issues
- Clear browser localStorage and re-login
- Verify admin token is valid
- Check network tab in browser dev tools

## Best Practices

1. **Notification** - Consider notifying the user via email that their password was reset
2. **Logging** - Keep logs of who reset passwords and when for audit purposes
3. **Policy** - Establish a policy for when/how this feature should be used
4. **Backup** - Have a backup admin account in case of lockout
