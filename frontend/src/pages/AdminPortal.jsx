import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, Card, CardContent, Grid, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Tabs, Tab, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Snackbar, Alert, MenuItem, IconButton, InputAdornment, Menu, Avatar, Select } from '@mui/material';
import { LogoutSharp, Edit, Delete, Add as AddIcon, Visibility, VisibilityOff, MoreVert } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { therapistService, patientService } from '@services/apiService.js';

const AdminPortal = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const adminName = localStorage.getItem('userName') || 'Admin';
  const [tabValue, setTabValue] = useState(0);
  const [profileMenuAnchor, setProfileMenuAnchor] = useState(null);
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profileData, setProfileData] = useState({
    name: localStorage.getItem('userName') || 'Admin',
    email: localStorage.getItem('userEmail') || '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [therapists, setTherapists] = useState([
    { id: 1, name: 'Dr. Ahmed Hassan', email: 'ahmed@email.com', specialty: 'Sports Medicine', status: 'active' },
    { id: 2, name: 'Dr. Fatima Ali', email: 'fatima@email.com', specialty: 'Pediatric', status: 'active' },
    { id: 3, name: 'Dr. Mohammad Karim', email: 'mohammad@email.com', specialty: 'Adult Therapy', status: 'inactive' }
  ]);

  const [admins, setAdmins] = useState([
    { id: 1, name: 'Admin User', email: 'admin@email.com', role: 'Super Admin', status: 'active' },
    { id: 2, name: 'Manager', email: 'manager@email.com', role: 'Manager', status: 'active' }
  ]);

  const [patients, setPatients] = useState([
    { id: 1, fullName: 'Patient 1', email: 'patient1@email.com', phone: '+962790000001', joinDate: '2024-10-15', status: 'active' },
    { id: 2, fullName: 'Patient 2', email: 'patient2@email.com', phone: '+962790000002', joinDate: '2024-11-20', status: 'active' },
    { id: 3, fullName: 'Patient 3', email: 'patient3@email.com', phone: '+962790000003', joinDate: '2024-12-01', status: 'inactive' }
  ]);

  const [appointments, setAppointments] = useState(() => {
    // Get admin-created appointments
    const adminAppointments = [
      { id: 1, patientName: 'Patient 1', therapistName: 'Dr. Ahmed Hassan', date: '2024-12-10', time: '10:00 AM', status: 'scheduled' },
      { id: 2, patientName: 'Patient 2', therapistName: 'Dr. Fatima Ali', date: '2024-12-11', time: '02:00 PM', status: 'scheduled' },
      { id: 3, patientName: 'Patient 3', therapistName: 'Dr. Mohammad Karim', date: '2024-12-12', time: '11:00 AM', status: 'completed' }
    ];
    
    // Get patient-booked appointments from localStorage
    const patientBookings = JSON.parse(localStorage.getItem('patientAppointments') || '[]');
    
    // Convert patient bookings to appointment format
    const convertedBookings = patientBookings.map(booking => ({
      id: booking.id,
      patientName: booking.patientName,
      therapistName: 'Not Assigned',
      date: booking.date,
      time: booking.time || '---',
      service: booking.service,
      phone: booking.phone,
      message: booking.message,
      status: booking.status || 'pending',
      type: 'patient-booking'
    }));
    
    // Combine and return all appointments
    return [...adminAppointments, ...convertedBookings];
  });

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState({ type: '', id: null });
  const [dialogType, setDialogType] = useState(''); // 'therapist' or 'patient'
  const [formData, setFormData] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [showAddPassword, setShowAddPassword] = useState(false);
  const [showEditPassword, setShowEditPassword] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Load patient bookings from localStorage when component mounts or when bookings change
  useEffect(() => {
    const loadPatientBookings = () => {
      const patientBookings = JSON.parse(localStorage.getItem('patientAppointments') || '[]');
      
      // Convert patient bookings to appointment format
      const convertedBookings = patientBookings.map(booking => ({
        id: booking.id,
        patientName: booking.patientName,
        therapistName: 'Not Assigned',
        date: booking.date,
        time: booking.time || '---',
        service: booking.service,
        phone: booking.phone,
        message: booking.message,
        status: booking.status || 'pending',
        type: 'patient-booking'
      }));
      
      // Get admin-created appointments from current state (only non-booking appointments)
      const adminAppointments = appointments.filter(app => app.type !== 'patient-booking');
      
      // Combine and update
      setAppointments([...adminAppointments, ...convertedBookings]);
    };

    // Set up interval to check for new bookings every 2 seconds
    const interval = setInterval(loadPatientBookings, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleOpenAddDialog = (type) => {
    setDialogType(type);
    if (type === 'therapist') {
      setFormData({ name: '', specialty: '', email: '', phone: '', password: '' });
    } else if (type === 'patient') {
      setFormData({ fullName: '', phone: '', email: '', password: '' });
    } else if (type === 'appointment') {
      setFormData({ patientName: '', therapistName: '', date: '', time: '' });
    } else if (type === 'admin') {
      setFormData({ name: '', email: '', role: 'Manager', password: '' });
    }
    setAddDialogOpen(true);
  };

  const handleCloseAddDialog = () => {
    setAddDialogOpen(false);
    setDialogType('');
    setFormData({});
  };

  const handleOpenEditDialog = (type, item) => {
    setDialogType(type);
    setEditingId(item.id);
    setFormData(item);
    setEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setDialogType('');
    setFormData({});
    setEditingId(null);
  };

  const handleDelete = (type, id) => {
    setDeleteTarget({ type, id });
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    const { type, id } = deleteTarget;
    if (type === 'therapist') {
      setTherapists(therapists.filter(t => t.id !== id));
      setSnackbar({ open: true, message: 'Therapist deleted successfully!', severity: 'success' });
    } else if (type === 'patient') {
      setPatients(patients.filter(p => p.id !== id));
      setSnackbar({ open: true, message: 'Patient deleted successfully!', severity: 'success' });
    } else if (type === 'appointment') {
      setAppointments(appointments.filter(a => a.id !== id));
      setSnackbar({ open: true, message: 'Appointment deleted successfully!', severity: 'success' });
    } else if (type === 'admin') {
      setAdmins(admins.filter(a => a.id !== id));
      setSnackbar({ open: true, message: 'Admin deleted successfully!', severity: 'success' });
    }
    setDeleteDialogOpen(false);
    setDeleteTarget({ type: '', id: null });
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

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setDeleteTarget({ type: '', id: null });
  };

  const getAvailableTimesForTherapist = (therapistName, date, excludeAppointmentId = null) => {
    // Business hours: 9 AM to 6 PM, 1-hour slots
    const allTimes = [
      '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'
    ];
    
    // Find booked times for this therapist on this date
    const bookedTimes = appointments
      .filter(app => 
        app.therapistName === therapistName && 
        app.date === date &&
        (excludeAppointmentId === null || app.id !== excludeAppointmentId)
      )
      .map(app => app.time);
    
    // Return available times
    return allTimes.filter(time => !bookedTimes.includes(time));
  };

  const checkTimeConflict = (therapistName, date, time, excludeAppointmentId = null) => {
    return appointments.some(app =>
      app.therapistName === therapistName &&
      app.date === date &&
      app.time === time &&
      (excludeAppointmentId === null || app.id !== excludeAppointmentId)
    );
  };

  const handleEditSubmit = async () => {
    try {
      if (dialogType === 'therapist') {
        setTherapists(therapists.map(t => t.id === editingId ? { ...t, ...formData } : t));
        setSnackbar({ open: true, message: 'Therapist updated successfully!', severity: 'success' });
      } else if (dialogType === 'patient') {
        setPatients(patients.map(p => p.id === editingId ? { ...p, ...formData } : p));
        setSnackbar({ open: true, message: 'Patient updated successfully!', severity: 'success' });
      } else if (dialogType === 'appointment') {
        // Check for time conflict (excluding current appointment being edited)
        if (checkTimeConflict(formData.therapistName, formData.date, formData.time, editingId)) {
          const availableTimes = getAvailableTimesForTherapist(formData.therapistName, formData.date, editingId);
          
          if (availableTimes.length === 0) {
            setSnackbar({
              open: true,
              message: language === 'ar'
                ? 'المعالج غير متاح في هذا التاريخ. يرجى اختيار تاريخ آخر.'
                : 'The therapist is fully booked on this date. Please choose another date.',
              severity: 'error',
            });
            return;
          } else {
            setSnackbar({
              open: true,
              message: language === 'ar'
                ? `هذا الوقت محجوز! الأوقات المتاحة: ${availableTimes.join(', ')}`
                : `This time is booked! Available times: ${availableTimes.join(', ')}`,
              severity: 'warning',
            });
            return;
          }
        }
        setAppointments(appointments.map(a => a.id === editingId ? { ...a, ...formData } : a));
        setSnackbar({ open: true, message: 'Appointment updated successfully!', severity: 'success' });
      } else if (dialogType === 'admin') {
        setAdmins(admins.map(a => a.id === editingId ? { ...a, ...formData } : a));
        setSnackbar({ open: true, message: 'Admin updated successfully!', severity: 'success' });
      }
      handleCloseEditDialog();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'An error occurred. Please try again.';
      setSnackbar({ open: true, message: errorMessage, severity: 'error' });
    }
  };

  const handleAddSubmit = async () => {
    try {
      if (dialogType === 'therapist') {
        // Add therapist to local state
        const newTherapist = {
          id: therapists.length + 1,
          ...formData,
          status: 'active'
        };
        setTherapists([...therapists, newTherapist]);
        setSnackbar({
          open: true,
          message: 'Therapist added successfully!',
          severity: 'success',
        });
      } else if (dialogType === 'patient') {
        // Add patient to local state
        const newPatient = {
          id: patients.length + 1,
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          joinDate: new Date().toISOString().split('T')[0],
          status: 'active'
        };
        setPatients([...patients, newPatient]);
        setSnackbar({
          open: true,
          message: 'Patient added successfully!',
          severity: 'success',
        });
      } else if (dialogType === 'appointment') {
        // Check for time conflict
        if (checkTimeConflict(formData.therapistName, formData.date, formData.time)) {
          const availableTimes = getAvailableTimesForTherapist(formData.therapistName, formData.date);
          
          if (availableTimes.length === 0) {
            setSnackbar({
              open: true,
              message: language === 'ar' 
                ? 'المعالج غير متاح في هذا التاريخ. يرجى اختيار تاريخ آخر.'
                : 'The therapist is fully booked on this date. Please choose another date.',
              severity: 'error',
            });
            return;
          } else {
            setSnackbar({
              open: true,
              message: language === 'ar'
                ? `هذا الوقت محجوز! الأوقات المتاحة: ${availableTimes.join(', ')}`
                : `This time is booked! Available times: ${availableTimes.join(', ')}`,
              severity: 'warning',
            });
            return;
          }
        }

        // Add appointment to local state
        const newAppointment = {
          id: appointments.length + 1,
          patientName: formData.patientName,
          therapistName: formData.therapistName,
          date: formData.date,
          time: formData.time,
          status: 'scheduled'
        };
        setAppointments([...appointments, newAppointment]);
        setSnackbar({
          open: true,
          message: 'Appointment scheduled successfully!',
          severity: 'success',
        });
      } else if (dialogType === 'admin') {
        // Add admin to local state
        const newAdmin = {
          id: admins.length + 1,
          name: formData.name,
          email: formData.email,
          role: formData.role || 'Manager',
          status: 'active'
        };
        setAdmins([...admins, newAdmin]);
        setSnackbar({
          open: true,
          message: 'Admin added successfully!',
          severity: 'success',
        });
      }
      handleCloseAddDialog();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'An error occurred. Please try again.';
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error',
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('isLoggedIn');
    navigate('/login');
  };

  const handleStatusChange = (type, id, newStatus) => {
    try {
      if (type === 'therapist') {
        setTherapists(therapists.map(t => t.id === id ? { ...t, status: newStatus } : t));
        setSnackbar({
          open: true,
          message: `Therapist status changed to ${newStatus}!`,
          severity: 'success',
        });
      } else if (type === 'patient') {
        setPatients(patients.map(p => p.id === id ? { ...p, status: newStatus } : p));
        setSnackbar({
          open: true,
          message: `Patient status changed to ${newStatus}!`,
          severity: 'success',
        });
      } else if (type === 'admin') {
        setAdmins(admins.map(a => a.id === id ? { ...a, status: newStatus } : a));
        setSnackbar({
          open: true,
          message: `Admin status changed to ${newStatus}!`,
          severity: 'success',
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to update status',
        severity: 'error',
      });
    }
  };

  const getStatusColor = (status) => {
    return status === 'active' ? 'success' : 'error';
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
            {language === 'ar' ? 'بوابة المسؤول' : 'Admin Portal'}
          </Typography>
          <Typography variant="body1" sx={{ color: '#666', mt: 1 }}>
            {language === 'ar' ? 'مرحباً ' + adminName : 'Welcome, ' + adminName}
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
              {adminName.split(' ').map(n => n[0]).join('').toUpperCase()}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontWeight: 'bold', color: '#1C6FB5', fontSize: '0.95rem' }}>
                {adminName}
              </Typography>
              <Typography sx={{ fontSize: '0.8rem', color: '#666' }}>
                @{adminName.toLowerCase().replace(/\s+/g, '')}
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

      {/* Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#e8f5e9', borderLeft: '5px solid #4caf50' }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                {language === 'ar' ? 'عدد المرضى' : 'Total Patients'}
              </Typography>
              <Typography variant="h4" sx={{ color: '#4caf50' }}>
                {patients.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#e3f2fd', borderLeft: '5px solid #2196f3' }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                {language === 'ar' ? 'عدد المعالجين' : 'Total Therapists'}
              </Typography>
              <Typography variant="h4" sx={{ color: '#2196f3' }}>
                {therapists.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#fff3e0', borderLeft: '5px solid #ff9800' }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                {language === 'ar' ? 'المواعيد اليوم' : 'Today Appointments'}
              </Typography>
              <Typography variant="h4" sx={{ color: '#ff9800' }}>
                5
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#f3e5f5', borderLeft: '5px solid #9c27b0' }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                {language === 'ar' ? 'الإيرادات' : 'Revenue'}
              </Typography>
              <Typography variant="h4" sx={{ color: '#9c27b0' }}>
                $5,230
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Card sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label={language === 'ar' ? 'المرضى' : 'Patients'} />
          <Tab label={language === 'ar' ? 'المعالجين' : 'Therapists'} />
          <Tab label={language === 'ar' ? 'المواعيد' : 'Appointments'} />
          <Tab label={language === 'ar' ? 'المسؤولين' : 'Admins'} />
        </Tabs>
        {tabValue === 0 && (
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={() => handleOpenAddDialog('patient')}
            sx={{ ml: 2 }}
          >
            {language === 'ar' ? 'إضافة مريض' : 'Add Patient'}
          </Button>
        )}
        {tabValue === 1 && (
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={() => handleOpenAddDialog('therapist')}
            sx={{ ml: 2 }}
          >
            {language === 'ar' ? 'إضافة معالج' : 'Add Therapist'}
          </Button>
        )}
        {tabValue === 2 && (
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={() => handleOpenAddDialog('appointment')}
            sx={{ ml: 2 }}
          >
            {language === 'ar' ? 'جدولة موعد' : 'Schedule Appointment'}
          </Button>
        )}
        {tabValue === 3 && (
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={() => handleOpenAddDialog('admin')}
            sx={{ ml: 2 }}
          >
            {language === 'ar' ? 'إضافة مسؤول' : 'Add Admin'}
          </Button>
        )}
      </Card>

      {/* Patients Table */}
      {tabValue === 0 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#1C6FB5' }}>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                  {language === 'ar' ? 'الاسم' : 'Name'}
                </TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                  {language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                </TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                  {language === 'ar' ? 'الهاتف' : 'Phone'}
                </TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                  {language === 'ar' ? 'تاريخ الانضمام' : 'Join Date'}
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
              {patients.map((patient) => (
                <TableRow key={patient.id} hover>
                  <TableCell>{patient.fullName}</TableCell>
                  <TableCell>{patient.email}</TableCell>
                  <TableCell>{patient.phone}</TableCell>
                  <TableCell>{patient.joinDate}</TableCell>
                  <TableCell>
                    <Select
                      value={patient.status}
                      onChange={(e) => handleStatusChange('patient', patient.id, e.target.value)}
                      size="small"
                      sx={{ minWidth: 100 }}
                    >
                      <MenuItem value="active">{language === 'ar' ? 'نشط' : 'Active'}</MenuItem>
                      <MenuItem value="inactive">{language === 'ar' ? 'غير نشط' : 'Inactive'}</MenuItem>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Button size="small" startIcon={<Edit />} sx={{ mr: 1, color: '#1C6FB5' }} onClick={() => handleOpenEditDialog('patient', patient)}>
                      {language === 'ar' ? 'تعديل' : 'Edit'}
                    </Button>
                    <Button size="small" startIcon={<Delete />} color="error" onClick={() => handleDelete('patient', patient.id)}>
                      {language === 'ar' ? 'حذف' : 'Delete'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Therapists Table */}
      {tabValue === 1 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#1C6FB5' }}>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                  {language === 'ar' ? 'الاسم' : 'Name'}
                </TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                  {language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                </TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                  {language === 'ar' ? 'التخصص' : 'Specialization'}
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
              {therapists.map((therapist) => (
                <TableRow key={therapist.id} hover>
                  <TableCell>{therapist.name}</TableCell>
                  <TableCell>{therapist.email}</TableCell>
                  <TableCell>{therapist.specialty}</TableCell>
                  <TableCell>
                    <Select
                      value={therapist.status}
                      onChange={(e) => handleStatusChange('therapist', therapist.id, e.target.value)}
                      size="small"
                      sx={{ minWidth: 100 }}
                    >
                      <MenuItem value="active">{language === 'ar' ? 'نشط' : 'Active'}</MenuItem>
                      <MenuItem value="inactive">{language === 'ar' ? 'غير نشط' : 'Inactive'}</MenuItem>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Button size="small" startIcon={<Edit />} sx={{ mr: 1, color: '#1C6FB5' }} onClick={() => handleOpenEditDialog('therapist', therapist)}>
                      {language === 'ar' ? 'تعديل' : 'Edit'}
                    </Button>
                    <Button size="small" startIcon={<Delete />} color="error" onClick={() => handleDelete('therapist', therapist.id)}>
                      {language === 'ar' ? 'حذف' : 'Delete'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Appointments Table */}
      {tabValue === 2 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#1C6FB5' }}>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                  {language === 'ar' ? 'اسم المريض' : 'Patient Name'}
                </TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                  {language === 'ar' ? 'اسم المعالج' : 'Therapist Name'}
                </TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                  {language === 'ar' ? 'التاريخ' : 'Date'}
                </TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                  {language === 'ar' ? 'الوقت' : 'Time'}
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
                  <TableCell>{appointment.therapistName}</TableCell>
                  <TableCell>{appointment.date}</TableCell>
                  <TableCell>{appointment.time}</TableCell>
                  <TableCell>
                    <Chip 
                      label={appointment.status} 
                      color={
                        appointment.status === 'pending' ? 'warning' :
                        appointment.status === 'scheduled' ? 'primary' : 'success'
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Button size="small" startIcon={<Edit />} sx={{ mr: 1, color: '#1C6FB5' }} onClick={() => handleOpenEditDialog('appointment', appointment)}>
                      {language === 'ar' ? 'تعديل' : 'Edit'}
                    </Button>
                    <Button size="small" startIcon={<Delete />} color="error" onClick={() => handleDelete('appointment', appointment.id)}>
                      {language === 'ar' ? 'حذف' : 'Delete'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Admins Table */}
      {tabValue === 3 && (
        <TableContainer component={Paper} sx={{ backgroundColor: '#f5f5f5', borderRadius: '10px', marginTop: 3 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#1C6FB5' }}>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                  {language === 'ar' ? 'الاسم' : 'Name'}
                </TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                  {language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                </TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                  {language === 'ar' ? 'الدور' : 'Role'}
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
              {admins.map((admin) => (
                <TableRow key={admin.id} hover>
                  <TableCell>{admin.name}</TableCell>
                  <TableCell>{admin.email}</TableCell>
                  <TableCell>{admin.role}</TableCell>
                  <TableCell>
                    <Select
                      value={admin.status}
                      onChange={(e) => handleStatusChange('admin', admin.id, e.target.value)}
                      size="small"
                      sx={{ minWidth: 100 }}
                    >
                      <MenuItem value="active">{language === 'ar' ? 'نشط' : 'Active'}</MenuItem>
                      <MenuItem value="inactive">{language === 'ar' ? 'غير نشط' : 'Inactive'}</MenuItem>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Button size="small" startIcon={<Edit />} sx={{ mr: 1, color: '#1C6FB5' }} onClick={() => handleOpenEditDialog('admin', admin)}>
                      {language === 'ar' ? 'تعديل' : 'Edit'}
                    </Button>
                    <Button size="small" startIcon={<Delete />} color="error" onClick={() => handleDelete('admin', admin.id)}>
                      {language === 'ar' ? 'حذف' : 'Delete'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Add Dialog */}
      <Dialog open={addDialogOpen} onClose={handleCloseAddDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {dialogType === 'therapist' 
            ? (language === 'ar' ? 'إضافة معالج جديد' : 'Add New Therapist')
            : dialogType === 'patient'
            ? (language === 'ar' ? 'إضافة مريض جديد' : 'Add New Patient')
            : dialogType === 'admin'
            ? (language === 'ar' ? 'إضافة مسؤول جديد' : 'Add New Admin')
            : (language === 'ar' ? 'جدولة موعد جديد' : 'Schedule New Appointment')
          }
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          {dialogType === 'therapist' ? (
            <>
              <TextField
                fullWidth
                label={language === 'ar' ? 'الاسم' : 'Name'}
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label={language === 'ar' ? 'التخصص' : 'Specialty'}
                value={formData.specialty || ''}
                onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label={language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                type="email"
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label={language === 'ar' ? 'الهاتف' : 'Phone'}
                value={formData.phone || ''}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label={language === 'ar' ? 'كلمة المرور' : 'Password'}
                type={showAddPassword ? 'text' : 'password'}
                value={formData.password || ''}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                margin="normal"
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowAddPassword(!showAddPassword)}
                        edge="end"
                      >
                        {showAddPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </>
          ) : dialogType === 'patient' ? (
            <>
              <TextField
                fullWidth
                label={language === 'ar' ? 'الاسم الكامل' : 'Full Name'}
                value={formData.fullName || ''}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label={language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                type="email"
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label={language === 'ar' ? 'الهاتف' : 'Phone'}
                value={formData.phone || ''}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label={language === 'ar' ? 'كلمة المرور' : 'Password'}
                type={showAddPassword ? 'text' : 'password'}
                value={formData.password || ''}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                margin="normal"
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowAddPassword(!showAddPassword)}
                        edge="end"
                      >
                        {showAddPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </>
          ) : dialogType === 'admin' ? (
            <>
              <TextField
                fullWidth
                label={language === 'ar' ? 'الاسم' : 'Name'}
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label={language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                type="email"
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                select
                label={language === 'ar' ? 'الدور' : 'Role'}
                value={formData.role || 'Manager'}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                margin="normal"
                required
              >
                <MenuItem value="Super Admin">{language === 'ar' ? 'مدير عام' : 'Super Admin'}</MenuItem>
                <MenuItem value="Manager">{language === 'ar' ? 'مدير' : 'Manager'}</MenuItem>
                <MenuItem value="User">{language === 'ar' ? 'مستخدم' : 'User'}</MenuItem>
              </TextField>
              <TextField
                fullWidth
                label={language === 'ar' ? 'كلمة المرور' : 'Password'}
                type={showAddPassword ? 'text' : 'password'}
                value={formData.password || ''}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                margin="normal"
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowAddPassword(!showAddPassword)}
                        edge="end"
                      >
                        {showAddPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </>
          ) : (
            <>
              <TextField
                fullWidth
                select
                label={language === 'ar' ? 'اسم المريض' : 'Patient Name'}
                value={formData.patientName || ''}
                onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                margin="normal"
                required
              >
                {patients.map((p) => (
                  <MenuItem key={p.id} value={p.fullName}>
                    {p.fullName}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                fullWidth
                select
                label={language === 'ar' ? 'اسم المعالج' : 'Therapist Name'}
                value={formData.therapistName || ''}
                onChange={(e) => setFormData({ ...formData, therapistName: e.target.value })}
                margin="normal"
                required
              >
                {therapists.map((t) => (
                  <MenuItem key={t.id} value={t.name}>
                    {t.name}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                fullWidth
                type="date"
                label={language === 'ar' ? 'التاريخ' : 'Date'}
                value={formData.date || ''}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                margin="normal"
                InputLabelProps={{ shrink: true }}
                required
              />
              <TextField
                fullWidth
                type="time"
                label={language === 'ar' ? 'الوقت' : 'Time'}
                value={formData.time || ''}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                margin="normal"
                InputLabelProps={{ shrink: true }}
                required
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddDialog}>
            {language === 'ar' ? 'إلغاء' : 'Cancel'}
          </Button>
          <Button onClick={handleAddSubmit} variant="contained">
            {language === 'ar' ? 'إضافة' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={handleCloseEditDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {dialogType === 'therapist' 
            ? (language === 'ar' ? 'تعديل المعالج' : 'Edit Therapist')
            : dialogType === 'patient'
            ? (language === 'ar' ? 'تعديل المريض' : 'Edit Patient')
            : dialogType === 'admin'
            ? (language === 'ar' ? 'تعديل المسؤول' : 'Edit Admin')
            : (language === 'ar' ? 'تعديل الموعد' : 'Edit Appointment')
          }
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          {dialogType === 'therapist' ? (
            <>
              <TextField
                fullWidth
                label={language === 'ar' ? 'الاسم' : 'Name'}
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label={language === 'ar' ? 'التخصص' : 'Specialty'}
                value={formData.specialty || ''}
                onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label={language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                type="email"
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label={language === 'ar' ? 'الهاتف' : 'Phone'}
                value={formData.phone || ''}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label={language === 'ar' ? 'كلمة المرور' : 'Password'}
                type={showEditPassword ? 'text' : 'password'}
                value={formData.password || ''}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                margin="normal"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowEditPassword(!showEditPassword)}
                        edge="end"
                      >
                        {showEditPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </>
          ) : dialogType === 'patient' ? (
            <>
              <TextField
                fullWidth
                label={language === 'ar' ? 'الاسم الكامل' : 'Full Name'}
                value={formData.fullName || ''}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label={language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                type="email"
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label={language === 'ar' ? 'الهاتف' : 'Phone'}
                value={formData.phone || ''}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label={language === 'ar' ? 'كلمة المرور' : 'Password'}
                type={showEditPassword ? 'text' : 'password'}
                value={formData.password || ''}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                margin="normal"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowEditPassword(!showEditPassword)}
                        edge="end"
                      >
                        {showEditPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </>
          ) : dialogType === 'admin' ? (
            <>
              <TextField
                fullWidth
                label={language === 'ar' ? 'الاسم' : 'Name'}
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label={language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                type="email"
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                select
                label={language === 'ar' ? 'الدور' : 'Role'}
                value={formData.role || 'Manager'}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                margin="normal"
                required
              >
                <MenuItem value="Super Admin">{language === 'ar' ? 'مدير عام' : 'Super Admin'}</MenuItem>
                <MenuItem value="Manager">{language === 'ar' ? 'مدير' : 'Manager'}</MenuItem>
                <MenuItem value="User">{language === 'ar' ? 'مستخدم' : 'User'}</MenuItem>
              </TextField>
              <TextField
                fullWidth
                label={language === 'ar' ? 'كلمة المرور' : 'Password'}
                type={showEditPassword ? 'text' : 'password'}
                value={formData.password || ''}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                margin="normal"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowEditPassword(!showEditPassword)}
                        edge="end"
                      >
                        {showEditPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </>
          ) : (
            <>
              <TextField
                fullWidth
                select
                label={language === 'ar' ? 'اسم المريض' : 'Patient Name'}
                value={formData.patientName || ''}
                onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                margin="normal"
                required
              >
                {patients.map((p) => (
                  <MenuItem key={p.id} value={p.fullName}>
                    {p.fullName}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                fullWidth
                select
                label={language === 'ar' ? 'اسم المعالج' : 'Therapist Name'}
                value={formData.therapistName || ''}
                onChange={(e) => setFormData({ ...formData, therapistName: e.target.value })}
                margin="normal"
                required
              >
                {therapists.map((t) => (
                  <MenuItem key={t.id} value={t.name}>
                    {t.name}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                fullWidth
                type="date"
                label={language === 'ar' ? 'التاريخ' : 'Date'}
                value={formData.date || ''}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                margin="normal"
                InputLabelProps={{ shrink: true }}
                required
              />
              <TextField
                fullWidth
                type="time"
                label={language === 'ar' ? 'الوقت' : 'Time'}
                value={formData.time || ''}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                margin="normal"
                InputLabelProps={{ shrink: true }}
                required
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>
            {language === 'ar' ? 'إلغاء' : 'Cancel'}
          </Button>
          <Button onClick={handleEditSubmit} variant="contained">
            {language === 'ar' ? 'تحديث' : 'Update'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleCancelDelete} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ bgcolor: '#ff5252', color: 'white', fontWeight: 'bold', textAlign: 'center' }}>
          {language === 'ar' ? '⚠️ تأكيد الحذف' : '⚠️ Confirm Delete'}
        </DialogTitle>
        <DialogContent sx={{ pt: 3, pb: 3, textAlign: 'center' }}>
          <Typography variant="body1" sx={{ mb: 2, color: '#333' }}>
            {language === 'ar' 
              ? 'هل أنت متأكد من أنك تريد حذف هذا العنصر؟ لا يمكن التراجع عن هذا الإجراء.'
              : 'Are you sure you want to delete this item? This action cannot be undone.'
            }
          </Typography>
          <Typography variant="caption" sx={{ color: '#666' }}>
            {language === 'ar' ? 'سيتم حذف البيانات بشكل نهائي' : 'This will permanently delete the data'}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, justifyContent: 'center', gap: 2 }}>
          <Button 
            onClick={handleCancelDelete} 
            variant="outlined"
            sx={{ minWidth: '120px' }}
          >
            {language === 'ar' ? 'إلغاء' : 'Cancel'}
          </Button>
          <Button 
            onClick={handleConfirmDelete} 
            variant="contained" 
            color="error"
            sx={{ minWidth: '120px' }}
          >
            {language === 'ar' ? 'حذف' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar Notification */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>

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

export default AdminPortal;
