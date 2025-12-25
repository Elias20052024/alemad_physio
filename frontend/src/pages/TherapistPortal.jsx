import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, Card, CardContent, Button, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Tabs, Tab, Menu, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, TextField, InputAdornment, IconButton, Avatar, CircularProgress } from '@mui/material';
import { LogoutSharp, MoreVert, Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import apiClient from '../services/api';

const TherapistPortal = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const therapistName = localStorage.getItem('userName') || 'Therapist';
  const therapistId = localStorage.getItem('userId');
  const [tabValue, setTabValue] = useState(0);
  const [profileMenuAnchor, setProfileMenuAnchor] = useState(null);
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [viewDetailsOpen, setViewDetailsOpen] = useState(false);
  const [editNotesOpen, setEditNotesOpen] = useState(false);
  const [editingNotes, setEditingNotes] = useState('');
  const [profileData, setProfileData] = useState({
    name: localStorage.getItem('userName') || 'Therapist',
    email: localStorage.getItem('userEmail') || '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Fetch appointments on component mount
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        console.log('Fetching appointments for therapist:', therapistId);
        const response = await apiClient.get(`/appointments?therapistId=${therapistId}`);
        console.log('Appointments fetched:', response.data);
        setAppointments(response.data || []);
      } catch (error) {
        console.error('Error fetching appointments:', error);
        setAppointments([]);
      } finally {
        setLoading(false);
      }
    };

    if (therapistId) {
      fetchAppointments();
    }
  }, [therapistId]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('token');
    navigate('/login');
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'confirmed': 
      case 'scheduled': return 'success';
      case 'pending': return 'warning';
      case 'completed': return 'primary';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const getStatusLabel = (status) => {
    const statusMap = {
      'confirmed': language === 'ar' ? 'مؤكد' : 'Confirmed',
      'scheduled': language === 'ar' ? 'مجدول' : 'Scheduled',
      'pending': language === 'ar' ? 'قيد الانتظار' : 'Pending',
      'completed': language === 'ar' ? 'مكتمل' : 'Completed',
      'cancelled': language === 'ar' ? 'ملغى' : 'Cancelled'
    };
    return statusMap[status] || status;
  };

  const handleCompleteAppointment = async (appointmentId) => {
    try {
      await apiClient.put(`/appointments/${appointmentId}`, { status: 'completed' });
      setAppointments(appointments.map(apt => 
        apt.id === appointmentId ? { ...apt, status: 'completed' } : apt
      ));
    } catch (error) {
      console.error('Error updating appointment:', error);
    }
  };

  const handleOpenEditNotes = () => {
    if (selectedAppointment) {
      setEditingNotes(selectedAppointment.notes || '');
      setEditNotesOpen(true);
    }
  };

  const handleSaveNotes = async () => {
    try {
      const updatedAppointment = { ...selectedAppointment, notes: editingNotes };
      await apiClient.put(`/appointments/${selectedAppointment.id}`, { notes: editingNotes });
      setAppointments(appointments.map(apt => 
        apt.id === selectedAppointment.id ? updatedAppointment : apt
      ));
      setSelectedAppointment(updatedAppointment);
      setEditNotesOpen(false);
    } catch (error) {
      console.error('Error updating notes:', error);
    }
  };

  const handleCloseEditNotes = () => {
    setEditNotesOpen(false);
    setEditingNotes('');
  };

  const handleViewDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setViewDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setViewDetailsOpen(false);
    setSelectedAppointment(null);
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

  // Filter appointments based on tab
  const filteredAppointments = appointments.filter(apt => {
    if (tabValue === 0) return true; // All appointments
    if (tabValue === 1) return apt.status === 'pending'; // Pending only
    if (tabValue === 2) return true; // Patient notes - show all
    return true;
  });

  // Calculate stats
  const todayAppointments = appointments.filter(apt => {
    const today = new Date().toISOString().split('T')[0];
    const appointmentDateStr = new Date(apt.appointmentDate).toISOString().split('T')[0];
    return appointmentDateStr === today;
  }).length;

  const pendingAppointments = appointments.filter(apt => apt.status === 'pending').length;
  const uniquePatients = new Set(appointments.map(apt => apt.patientId)).size;
  const completedAppointments = appointments.filter(apt => apt.status === 'completed').length;

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
                {todayAppointments}
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
                {pendingAppointments}
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
                {uniquePatients}
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
                {completedAppointments}
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
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
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
                  {language === 'ar' ? 'الحالة' : 'Status'}
                </TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                  {language === 'ar' ? 'الإجراءات' : 'Actions'}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredAppointments.length > 0 ? (
                filteredAppointments.map((appointment) => {
                  const patientName = appointment.patient?.user?.name || appointment.patient?.fullName || 'Unknown Patient';
                  const appointmentDate = new Date(appointment.appointmentDate);
                  return (
                    <TableRow key={appointment.id} hover>
                      <TableCell>{patientName}</TableCell>
                      <TableCell>{appointmentDate.toLocaleDateString()}</TableCell>
                      <TableCell>{appointment.startTime}</TableCell>
                      <TableCell>
                        <Chip 
                          label={getStatusLabel(appointment.status)} 
                          color={getStatusColor(appointment.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {tabValue === 2 ? (
                          // Patient Notes tab - show only Notes button
                          <Button 
                            size="small" 
                            variant="contained"
                            sx={{ bgcolor: '#1C6FB5', '&:hover': { bgcolor: '#154A88' } }}
                            onClick={() => {
                              setSelectedAppointment(appointment);
                              setEditingNotes(appointment.notes || '');
                              setEditNotesOpen(true);
                            }}
                          >
                            {language === 'ar' ? 'ملاحظات' : 'Notes'}
                          </Button>
                        ) : (
                          // Other tabs - show Details and Complete buttons
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button 
                              size="small" 
                              variant="outlined"
                              onClick={() => {
                                setSelectedAppointment(appointment);
                                setViewDetailsOpen(true);
                              }}
                            >
                              {language === 'ar' ? 'التفاصيل' : 'Details'}
                            </Button>
                            {appointment.status !== 'completed' && appointment.status !== 'cancelled' && appointment.status !== 'pending' && (
                              <Button 
                                size="small" 
                                variant="contained"
                                sx={{ bgcolor: '#4caf50', '&:hover': { bgcolor: '#45a049' } }}
                                onClick={() => handleCompleteAppointment(appointment.id)}
                              >
                                {language === 'ar' ? 'إنهاء' : 'Complete'}
                              </Button>
                            )}
                          </Box>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={5} sx={{ textAlign: 'center', py: 3 }}>
                    {language === 'ar' ? 'لا توجد مواعيد' : 'No appointments'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

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

      {/* Appointment Details Dialog */}
      <Dialog open={viewDetailsOpen} onClose={handleCloseDetails} maxWidth="sm" fullWidth>
        <DialogTitle>
          {language === 'ar' ? 'تفاصيل الموعد' : 'Appointment Details'}
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          {selectedAppointment && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#1C6FB5' }}>
                  {language === 'ar' ? 'المريض' : 'Patient'}
                </Typography>
                <Typography>{selectedAppointment.patient?.user?.name || 'N/A'}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#1C6FB5' }}>
                  {language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                </Typography>
                <Typography>{selectedAppointment.patient?.user?.email || 'N/A'}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#1C6FB5' }}>
                  {language === 'ar' ? 'الهاتف' : 'Phone'}
                </Typography>
                <Typography>{selectedAppointment.patient?.phone || 'N/A'}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#1C6FB5' }}>
                  {language === 'ar' ? 'التاريخ' : 'Date'}
                </Typography>
                <Typography>{new Date(selectedAppointment.appointmentDate).toLocaleDateString()}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#1C6FB5' }}>
                  {language === 'ar' ? 'الوقت' : 'Time'}
                </Typography>
                <Typography>{selectedAppointment.startTime}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#1C6FB5' }}>
                  {language === 'ar' ? 'الخدمة' : 'Service'}
                </Typography>
                <Typography>{selectedAppointment.service || 'General'}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#1C6FB5' }}>
                  {language === 'ar' ? 'الحالة' : 'Status'}
                </Typography>
                <Chip 
                  label={getStatusLabel(selectedAppointment.status)} 
                  color={getStatusColor(selectedAppointment.status)}
                  size="small"
                />
              </Box>
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#1C6FB5' }}>
                  {language === 'ar' ? 'الملاحظات' : 'Notes'}
                </Typography>
                <Typography sx={{ mt: 1, p: 1, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                  {selectedAppointment.notes || 'No notes'}
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetails}>
            {language === 'ar' ? 'إغلاق' : 'Close'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Notes Dialog */}
      <Dialog open={editNotesOpen} onClose={handleCloseEditNotes} maxWidth="sm" fullWidth>
        <DialogTitle>
          {language === 'ar' ? 'تعديل الملاحظات' : 'Edit Notes'}
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            fullWidth
            multiline
            rows={6}
            label={language === 'ar' ? 'ملاحظات' : 'Notes'}
            value={editingNotes}
            onChange={(e) => setEditingNotes(e.target.value)}
            placeholder={language === 'ar' ? 'أضف ملاحظاتك هنا...' : 'Add your notes here...'}
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditNotes}>
            {language === 'ar' ? 'إلغاء' : 'Cancel'}
          </Button>
          <Button onClick={handleSaveNotes} variant="contained" color="primary">
            {language === 'ar' ? 'حفظ' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default TherapistPortal;
