import React, { useState } from 'react';
import { Container, Box, Typography, Card, CardContent, Button, Grid, Dialog, DialogTitle, DialogContent, DialogActions, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Alert, TextField, Menu, MenuItem, InputAdornment, IconButton, Avatar } from '@mui/material';
import { Edit, Delete, LogoutSharp, MoreVert, Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const PatientDashboard = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const patientName = localStorage.getItem('userName') || 'Patient';
  const [profileMenuAnchor, setProfileMenuAnchor] = useState(null);
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profileData, setProfileData] = useState({
    name: localStorage.getItem('userName') || 'Patient',
    email: localStorage.getItem('userEmail') || '',
    phone: localStorage.getItem('userPhone') || '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      date: '2025-01-15',
      time: '10:00 AM',
      therapist: 'Dr. Ahmed',
      service: 'Adult Physiotherapy',
      status: 'confirmed'
    },
    {
      id: 2,
      date: '2025-01-20',
      time: '2:30 PM',
      therapist: 'Dr. Fatima',
      service: 'Pediatric Therapy',
      status: 'pending'
    },
    {
      id: 3,
      date: '2024-12-25',
      time: '11:00 AM',
      therapist: 'Dr. Ahmed',
      service: 'Sports Medicine',
      status: 'completed'
    }
  ]);
  
  const [openCancel, setOpenCancel] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [editData, setEditData] = useState({});

  const handleCancelClick = (appointment) => {
    setSelectedAppointment(appointment);
    setOpenCancel(true);
  };

  const handleEditClick = (appointment) => {
    setSelectedAppointment(appointment);
    setEditData({ ...appointment });
    setOpenEdit(true);
  };

  const handleConfirmCancel = () => {
    setAppointments(appointments.filter(app => app.id !== selectedAppointment.id));
    setOpenCancel(false);
  };

  const handleSaveEdit = () => {
    setAppointments(appointments.map(app => 
      app.id === editData.id ? editData : app
    ));
    setOpenEdit(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('isLoggedIn');
    navigate('/login');
  };

  const handleProfileMenuOpen = (event) => {
    setProfileMenuAnchor(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileMenuAnchor(null);
  };

  const handleEditProfile = () => {
    setEditProfileOpen(true);
    handleProfileMenuClose();
  };

  const handleSaveProfile = () => {
    localStorage.setItem('userName', profileData.name);
    localStorage.setItem('userEmail', profileData.email);
    localStorage.setItem('userPhone', profileData.phone);
    setEditProfileOpen(false);
  };

  const handleChangePassword = () => {
    setChangePasswordOpen(true);
    handleProfileMenuClose();
  };

  const handleSavePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert(language === 'ar' ? 'كلمات المرور غير متطابقة' : 'Passwords do not match');
      return;
    }
    localStorage.setItem('userPassword', passwordData.newPassword);
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setChangePasswordOpen(false);
    alert(language === 'ar' ? 'تم تغيير كلمة المرور بنجاح' : 'Password changed successfully');
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'confirmed': return 'success';
      case 'pending': return 'warning';
      case 'completed': return 'default';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, md: 6 } }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography 
          variant="h2" 
          sx={{ color: '#1C6FB5', fontWeight: 'bold', fontSize: { xs: '1.8rem', md: '2.5rem' } }}
        >
          {language === 'ar' ? 'لوحة المريض' : 'Patient Dashboard'}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton onClick={handleProfileMenuOpen} sx={{ color: '#1C6FB5' }}>
            <MoreVert />
          </IconButton>
          <Menu
            anchorEl={profileMenuAnchor}
            open={Boolean(profileMenuAnchor)}
            onClose={handleProfileMenuClose}
          >
            <MenuItem onClick={handleEditProfile}>
              {language === 'ar' ? 'تعديل الملف الشخصي' : 'Edit Profile'}
            </MenuItem>
            <MenuItem onClick={handleChangePassword}>
              {language === 'ar' ? 'تغيير كلمة المرور' : 'Change Password'}
            </MenuItem>
          </Menu>
          <Button 
            variant="contained" 
            color="error"
            startIcon={<LogoutSharp />}
            onClick={handleLogout}
          >
            {language === 'ar' ? 'تسجيل الخروج' : 'Logout'}
          </Button>
        </Box>
      </Box>

      {/* Welcome Card */}
      <Card sx={{ mb: 4, bgcolor: '#f0f8ff', border: '2px solid #1C6FB5' }}>
        <CardContent>
          <Typography variant="h5" sx={{ color: '#1C6FB5', mb: 1 }}>
            {language === 'ar' ? 'مرحباً ' + patientName : 'Welcome, ' + patientName}
          </Typography>
          <Typography variant="body2" sx={{ color: '#666', mb: 2 }}>
            {language === 'ar' ? 'أهلا بك في مركز العماد' : 'AL-Emad Physiotherapy Center'}
          </Typography>
          <Typography variant="body1">
            {language === 'ar' 
              ? 'يمكنك هنا عرض جميع مواعيدك وتعديلها أو إلغاؤها'
              : 'Here you can view, edit, or cancel your appointments'
            }
          </Typography>
        </CardContent>
      </Card>

      {/* Book New Appointment Button */}
      <Box sx={{ mb: 4 }}>
        <Button 
          variant="contained"
          sx={{ 
            bgcolor: '#1C6FB5',
            '&:hover': { bgcolor: '#2D89B3' },
            py: 1.5,
            px: 3,
            fontSize: { xs: '0.9rem', md: '1rem' }
          }}
        >
          {language === 'ar' ? 'احجز موعد جديد' : 'Book New Appointment'}
        </Button>
      </Box>

      {/* Appointments Table */}
      <TableContainer component={Paper} sx={{
        overflowX: 'auto',
        overflowY: 'hidden',
        WebkitOverflowScrolling: 'touch'
      }}>
        <Table sx={{ minWidth: { xs: 600, sm: 800 } }}>
          <TableHead>
            <TableRow sx={{ bgcolor: '#1C6FB5' }}>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', padding: { xs: '10px', sm: '16px' }, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                {language === 'ar' ? 'التاريخ' : 'Date'}
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', padding: { xs: '10px', sm: '16px' }, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                {language === 'ar' ? 'الوقت' : 'Time'}
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', padding: { xs: '10px', sm: '16px' }, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                {language === 'ar' ? 'المعالج' : 'Therapist'}
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', padding: { xs: '10px', sm: '16px' }, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                {language === 'ar' ? 'الخدمة' : 'Service'}
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', padding: { xs: '10px', sm: '16px' }, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                {language === 'ar' ? 'الحالة' : 'Status'}
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', padding: { xs: '10px', sm: '16px' }, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                {language === 'ar' ? 'الإجراءات' : 'Actions'}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {appointments.map((appointment) => (
              <TableRow key={appointment.id} hover>
                <TableCell sx={{ padding: { xs: '10px', sm: '14px' }, fontSize: { xs: '0.75rem', sm: '0.875rem' }, whiteSpace: 'nowrap' }}>{appointment.date}</TableCell>
                <TableCell sx={{ padding: { xs: '10px', sm: '14px' }, fontSize: { xs: '0.75rem', sm: '0.875rem' }, whiteSpace: 'nowrap' }}>{appointment.time}</TableCell>
                <TableCell sx={{ padding: { xs: '10px', sm: '14px' }, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>{appointment.therapist}</TableCell>
                <TableCell sx={{ padding: { xs: '10px', sm: '14px' }, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>{appointment.service}</TableCell>
                <TableCell sx={{ padding: { xs: '10px', sm: '14px' } }}>
                  <Chip 
                    label={appointment.status} 
                    color={getStatusColor(appointment.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell sx={{ padding: { xs: '10px', sm: '14px' }, display: 'flex', flexWrap: 'wrap', gap: { xs: 0.5, sm: 1 } }}>
                  <IconButton 
                    size="small" 
                    color="primary"
                    onClick={() => handleEditClick(appointment)}
                    sx={{ display: { xs: 'inline-flex', sm: 'none' } }}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton 
                    size="small" 
                    color="error"
                    onClick={() => handleCancelClick(appointment)}
                    sx={{ display: { xs: 'inline-flex', sm: 'none' } }}
                  >
                    <Delete />
                  </IconButton>
                  <Button 
                    size="small" 
                    startIcon={<Edit />}
                    onClick={() => handleEditClick(appointment)}
                    sx={{ mr: 1, color: '#1C6FB5', display: { xs: 'none', sm: 'inline-flex' } }}
                  >
                    {language === 'ar' ? 'تعديل' : 'Edit'}
                  </Button>
                  <Button 
                    size="small" 
                    startIcon={<Delete />}
                    onClick={() => handleCancelClick(appointment)}
                    color="error"
                    sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
                  >
                    {language === 'ar' ? 'إلغاء' : 'Cancel'}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Cancel Dialog */}
      <Dialog open={openCancel} onClose={() => setOpenCancel(false)}>
        <DialogTitle>
          {language === 'ar' ? 'إلغاء الموعد' : 'Cancel Appointment'}
        </DialogTitle>
        <DialogContent>
          <Typography>
            {language === 'ar' 
              ? 'هل تريد فعلاً إلغاء هذا الموعد؟'
              : 'Are you sure you want to cancel this appointment?'
            }
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCancel(false)}>
            {language === 'ar' ? 'ليس' : 'No'}
          </Button>
          <Button onClick={handleConfirmCancel} color="error" variant="contained">
            {language === 'ar' ? 'نعم، إلغاء' : 'Yes, Cancel'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={openEdit} onClose={() => setOpenEdit(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {language === 'ar' ? 'تعديل الموعد' : 'Edit Appointment'}
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          {editData && (
            <Box>
              <TextField
                fullWidth
                label={language === 'ar' ? 'التاريخ' : 'Date'}
                type="date"
                value={editData.date || ''}
                onChange={(e) => setEditData({...editData, date: e.target.value})}
                margin="normal"
              />
              <TextField
                fullWidth
                label={language === 'ar' ? 'الوقت' : 'Time'}
                type="time"
                value={editData.time || ''}
                onChange={(e) => setEditData({...editData, time: e.target.value})}
                margin="normal"
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEdit(false)}>
            {language === 'ar' ? 'إغلاق' : 'Close'}
          </Button>
          <Button onClick={handleSaveEdit} variant="contained" sx={{ bgcolor: '#1C6FB5' }}>
            {language === 'ar' ? 'حفظ التغييرات' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Profile Dialog */}
      <Dialog open={editProfileOpen} onClose={() => setEditProfileOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {language === 'ar' ? 'تعديل الملف الشخصي' : 'Edit Profile'}
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            fullWidth
            label={language === 'ar' ? 'الاسم الكامل' : 'Full Name'}
            value={profileData.name}
            onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label={language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
            type="email"
            value={profileData.email}
            onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label={language === 'ar' ? 'رقم الهاتف' : 'Phone'}
            value={profileData.phone}
            onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditProfileOpen(false)}>
            {language === 'ar' ? 'إلغاء' : 'Cancel'}
          </Button>
          <Button onClick={handleSaveProfile} variant="contained">
            {language === 'ar' ? 'حفظ' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog open={changePasswordOpen} onClose={() => setChangePasswordOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {language === 'ar' ? 'تغيير كلمة المرور' : 'Change Password'}
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            fullWidth
            type="password"
            label={language === 'ar' ? 'كلمة المرور الحالية' : 'Current Password'}
            value={passwordData.currentPassword}
            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            type={showNewPassword ? 'text' : 'password'}
            label={language === 'ar' ? 'كلمة المرور الجديدة' : 'New Password'}
            value={passwordData.newPassword}
            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
            margin="normal"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    edge="end"
                  >
                    {showNewPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            fullWidth
            type={showConfirmPassword ? 'text' : 'password'}
            label={language === 'ar' ? 'تأكيد كلمة المرور' : 'Confirm Password'}
            value={passwordData.confirmPassword}
            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
            margin="normal"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setChangePasswordOpen(false)}>
            {language === 'ar' ? 'إلغاء' : 'Cancel'}
          </Button>
          <Button onClick={handleSavePassword} variant="contained">
            {language === 'ar' ? 'تغيير' : 'Change'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PatientDashboard;
