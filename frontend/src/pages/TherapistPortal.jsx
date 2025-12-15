import React, { useState } from 'react';
import { Container, Box, Typography, Card, CardContent, Button, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Tabs, Tab, Menu, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, TextField, InputAdornment, IconButton, Avatar } from '@mui/material';
import { LogoutSharp, MoreVert, Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const TherapistPortal = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const therapistName = localStorage.getItem('userName') || 'Therapist';
  const [tabValue, setTabValue] = useState(0);
  const [profileMenuAnchor, setProfileMenuAnchor] = useState(null);
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profileData, setProfileData] = useState({
    name: localStorage.getItem('userName') || 'Therapist',
    email: localStorage.getItem('userEmail') || '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      patientName: 'Ahmed Hassan',
      date: '2025-01-15',
      time: '10:00 AM',
      service: 'Adult Physiotherapy',
      status: 'confirmed'
    },
    {
      id: 2,
      patientName: 'Fatima Ali',
      date: '2025-01-16',
      time: '2:30 PM',
      service: 'Pediatric Therapy',
      status: 'pending'
    },
    {
      id: 3,
      patientName: 'Mohammad Karim',
      date: '2025-01-17',
      time: '11:00 AM',
      service: 'Sports Medicine',
      status: 'confirmed'
    }
  ]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('isLoggedIn');
    navigate('/login');
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'confirmed': return 'success';
      case 'pending': return 'warning';
      case 'completed': return 'primary';
      default: return 'default';
    }
  };

  const handleCompleteAppointment = (appointmentId) => {
    setAppointments(appointments.map(apt => 
      apt.id === appointmentId ? { ...apt, status: 'completed' } : apt
    ));
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

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, md: 6 } }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography 
            variant="h2" 
            sx={{ color: '#1C6FB5', fontWeight: 'bold', fontSize: { xs: '1.8rem', md: '2.5rem' } }}
          >
            {language === 'ar' ? 'بوابة المعالج' : 'Therapist Portal'}
          </Typography>
          <Typography variant="body1" sx={{ color: '#666', mt: 1 }}>
            {language === 'ar' ? 'مرحباً ' + therapistName : 'Welcome, ' + therapistName}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          {/* Profile Card */}
          <Card sx={{ p: 1.5, display: 'flex', alignItems: 'center', gap: 1.5, minWidth: '200px', bgcolor: '#f5f5f5', borderRadius: '10px' }}>
            <Avatar
              sx={{
                width: 50,
                height: 50,
                bgcolor: '#1C6FB5',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '1.2rem'
              }}
            >
              {therapistName.split(' ').map(n => n[0]).join('').toUpperCase()}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontWeight: 'bold', color: '#1C6FB5', fontSize: '0.95rem' }}>
                {therapistName}
              </Typography>
              <Typography sx={{ fontSize: '0.8rem', color: '#666' }}>
                @{therapistName.toLowerCase().replace(/\s+/g, '')}
              </Typography>
            </Box>
          </Card>
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

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#e8f5e9', borderLeft: '5px solid #4caf50' }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                {language === 'ar' ? 'المواعيد اليوم' : 'Today Appointments'}
              </Typography>
              <Typography variant="h4" sx={{ color: '#4caf50' }}>
                3
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#e3f2fd', borderLeft: '5px solid #2196f3' }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                {language === 'ar' ? 'المواعيد المعلقة' : 'Pending Appointments'}
              </Typography>
              <Typography variant="h4" sx={{ color: '#2196f3' }}>
                2
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#fff3e0', borderLeft: '5px solid #ff9800' }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                {language === 'ar' ? 'المرضى' : 'Total Patients'}
              </Typography>
              <Typography variant="h4" sx={{ color: '#ff9800' }}>
                15
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#f3e5f5', borderLeft: '5px solid #9c27b0' }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                {language === 'ar' ? 'المواعيد المكتملة' : 'Completed'}
              </Typography>
              <Typography variant="h4" sx={{ color: '#9c27b0' }}>
                28
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Card sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label={language === 'ar' ? 'جميع المواعيد' : 'All Appointments'} />
          <Tab label={language === 'ar' ? 'المواعيد المعلقة' : 'Pending'} />
          <Tab label={language === 'ar' ? 'ملاحظات المريض' : 'Patient Notes'} />
        </Tabs>
      </Card>

      {/* Appointments Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#1C6FB5' }}>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                {language === 'ar' ? 'المريض' : 'Patient'}
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                {language === 'ar' ? 'التاريخ' : 'Date'}
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                {language === 'ar' ? 'الوقت' : 'Time'}
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                {language === 'ar' ? 'الخدمة' : 'Service'}
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                {language === 'ar' ? 'الحالة' : 'Status'}
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                {language === 'ar' ? 'الإجراءات' : 'Actions'}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {appointments.map((appointment) => (
              <TableRow key={appointment.id} hover>
                <TableCell>{appointment.patientName}</TableCell>
                <TableCell>{appointment.date}</TableCell>
                <TableCell>{appointment.time}</TableCell>
                <TableCell>{appointment.service}</TableCell>
                <TableCell>
                  <Chip 
                    label={appointment.status} 
                    color={getStatusColor(appointment.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Button 
                    size="small" 
                    variant="outlined"
                    sx={{ mr: 1, color: '#1C6FB5', borderColor: '#1C6FB5' }}
                  >
                    {language === 'ar' ? 'عرض' : 'View'}
                  </Button>
                  {appointment.status !== 'completed' && (
                    <Button 
                      size="small" 
                      variant="contained"
                      sx={{ bgcolor: '#4caf50', '&:hover': { bgcolor: '#45a049' } }}
                      onClick={() => handleCompleteAppointment(appointment.id)}
                    >
                      {language === 'ar' ? 'إنهاء' : 'Complete'}
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit Profile Dialog */}
      <Dialog open={editProfileOpen} onClose={() => setEditProfileOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {language === 'ar' ? 'تعديل الملف الشخصي' : 'Edit Profile'}
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            fullWidth
            label={language === 'ar' ? 'الاسم' : 'Name'}
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

export default TherapistPortal;
