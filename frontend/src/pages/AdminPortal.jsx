import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Box, Typography, Card, CardContent, Grid, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Tabs, Tab, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Snackbar, Alert, MenuItem, IconButton, InputAdornment, Menu, Avatar, Select, useTheme, FormControl, InputLabel } from '@mui/material';
import { LogoutSharp, Edit, Delete, Add as AddIcon, Visibility, VisibilityOff, MoreVert, WhatsApp as WhatsAppIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useLoading } from '../context/LoadingContext';
import { therapistService, patientService } from '@services/apiService.js';
import NotificationCenter from '../components/NotificationCenter';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// Clear browser cache to ensure fresh data is always loaded
const clearAppointmentsCache = () => {
  localStorage.removeItem('appointmentsCache');
  localStorage.removeItem('appointmentsList');
  sessionStorage.removeItem('appointmentsCache');
  sessionStorage.removeItem('appointmentsList');
};

// Helper functions for date conversion
const formatDateForInput = (dateString) => {
  if (!dateString) return '';

  // If already in yyyy-MM-dd format, return as-is
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return dateString;
  }

  // Convert from MM/DD/YYYY or other date formats
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  } catch (e) {
    return '';
  }
};

const formatDateForDisplay = (dateString) => {
  if (!dateString) return '';

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString();
  } catch (e) {
    return dateString;
  }
};

// Specialty options for therapists
const specialtyOptions = [
  { value: 'Physical Therapy', label: 'العلاج الطبيعي', labelEn: 'Physical Therapy' },
  { value: 'Occupational Therapy', label: 'العلاج الوظيفي', labelEn: 'Occupational Therapy' },
  { value: 'Speech Therapy', label: 'علاج النطق', labelEn: 'Speech Therapy' },
  { value: 'Orthopedic Rehabilitation', label: 'إعادة التأهيل العظمية', labelEn: 'Orthopedic Rehabilitation' },
  { value: 'Pediatric Physical Therapy', label: 'العلاج الطبيعي للأطفال', labelEn: 'Pediatric Physical Therapy' },
  { value: 'Neuromuscular Therapy', label: 'العلاج العصبي العضلي', labelEn: 'Neuromuscular Therapy' },
  { value: 'Sports Medicine', label: 'طب الرياضة', labelEn: 'Sports Medicine' },
  { value: 'Cardiopulmonary Rehabilitation', label: 'إعادة التأهيل القلبية الرئوية', labelEn: 'Cardiopulmonary Rehabilitation' }
];

const AdminPortal = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const theme = useTheme();
  const token = localStorage.getItem('token');
  const { showLoading, hideLoading } = useLoading();

  // Status color mapping
  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return '#4caf50'; // Green
      case 'inactive':
        return '#f44336'; // Red
      case 'pending':
        return '#ff9800'; // Orange
      case 'completed':
        return '#2196f3'; // Blue
      case 'scheduled':
        return '#4caf50'; // Green
      case 'cancelled':
        return '#f44336'; // Red
      default:
        return '#9e9e9e'; // Grey
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'active':
        return language === 'ar' ? 'نشط' : 'Active';
      case 'inactive':
        return language === 'ar' ? 'غير نشط' : 'Inactive';
      case 'pending':
        return language === 'ar' ? 'قيد الانتظار' : 'Pending';
      case 'completed':
        return language === 'ar' ? 'مكتمل' : 'Completed';
      default:
        return status;
    }
  };
  const adminName = localStorage.getItem('userName') || 'Admin';
  const [tabValue, setTabValue] = useState(() => {
    const savedTab = localStorage.getItem('adminPortalTab');
    return savedTab ? parseInt(savedTab, 10) : 0;
  });
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
  const [therapists, setTherapists] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0); // Force re-render key

  const [admins, setAdmins] = useState([]);

  const [patients, setPatients] = useState([]);

  // Function to refresh all data from API
  const refreshAllData = async () => {
    try {
      showLoading('Loading data...');
      console.log('🔄 Refreshing all data...');

      // Fetch patients
      const patientsResponse = await patientService.getAllPatients();
      const patientsData = patientsResponse.data || patientsResponse || [];
      const mappedPatients = Array.isArray(patientsData) ? patientsData.map(p => ({
        ...p,
        fullName: p.user?.name || p.fullName || 'Unknown'
      })) : [];
      console.log('📊 Refreshed patients:', mappedPatients);
      setPatients(mappedPatients);

      // Fetch therapists
      const therapistsResponse = await therapistService.getAllTherapists();
      const therapistsData = therapistsResponse.data || therapistsResponse || [];
      const mappedTherapists = Array.isArray(therapistsData) ? therapistsData.map(t => ({
        ...t,
        name: t.user?.name || t.name || 'Unknown',
        email: t.user?.email || t.email || 'N/A'
      })) : [];
      console.log('👨‍⚕️ Refreshed therapists:', mappedTherapists);
      setTherapists([...mappedTherapists]); // Force new array reference
      setRefreshKey(prev => prev + 1); // Force re-render

      // Fetch admins
      try {
        const adminsResponse = await axios.get(`${API_BASE_URL}/admin/list`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('🔐 Refreshed admins:', adminsResponse.data);
        setAdmins(adminsResponse.data || []);
      } catch (error) {
        console.error('Error refreshing admins:', error);
        setAdmins([]);
      }

      // Fetch appointments
      try {
        const appointmentsResponse = await axios.get(`${API_BASE_URL}/appointments`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const formattedAppointments = (appointmentsResponse.data || []).map(apt => ({
          id: apt.id,
          patientName: apt.patient?.user?.name || apt.patient?.fullName || 'Unknown',
          therapistName: apt.therapist?.user?.name || apt.therapist?.name || 'Unknown',
          date: apt.appointmentDate ? new Date(apt.appointmentDate).toLocaleDateString() : 'N/A',
          time: apt.startTime || 'N/A',
          status: apt.status || 'pending',
          ...apt
        }));
        console.log('📅 Refreshed appointments:', formattedAppointments);
        setAppointments(formattedAppointments);
      } catch (error) {
        console.error('Error refreshing appointments:', error);
        setAppointments([]);
      }

      console.log('✅ All data refreshed successfully');
      
      // Add a small delay to ensure state updates are processed
      await new Promise(resolve => setTimeout(resolve, 100));
      hideLoading();
    } catch (error) {
      console.error('Error refreshing patients or therapists:', error);
      hideLoading();
    }
  };

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // Clear any cached appointments to ensure fresh data
        clearAppointmentsCache();

        // Fetch patients
        const patientsResponse = await patientService.getAllPatients();
        console.log('📊 Fetched patients from API:', patientsResponse);
        const patientsData = patientsResponse.data || patientsResponse || [];
        console.log('📊 Patients data to set:', patientsData);
        const mappedPatients = Array.isArray(patientsData) ? patientsData.map(p => ({
          ...p,
          fullName: p.user?.name || p.fullName || 'Unknown'
        })) : [];
        console.log('📊 Mapped patients:', mappedPatients);
        setPatients(mappedPatients);

        // Fetch therapists
        const therapistsResponse = await therapistService.getAllTherapists();
        console.log('👨‍⚕️ Fetched therapists from API:', therapistsResponse);
        const therapistsData = therapistsResponse.data || therapistsResponse || [];
        console.log('👨‍⚕️ Therapists data to set:', therapistsData);
        const mappedTherapists = Array.isArray(therapistsData) ? therapistsData.map(t => ({
          ...t,
          name: t.user?.name || t.name || 'Unknown'
        })) : [];
        console.log('👨‍⚕️ Mapped therapists:', mappedTherapists);
        setTherapists(mappedTherapists);

        // Fetch admins (using API call)
        try {
          const adminsResponse = await axios.get(`${API_BASE_URL}/admin/list`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          console.log('👤 Fetched admins from API:', adminsResponse.data);
          setAdmins(adminsResponse.data || []);
        } catch (error) {
          console.error('Error fetching admins:', error);
          setAdmins([]);
        }

        // Fetch appointments
        try {
          const appointmentsResponse = await axios.get(`${API_BASE_URL}/appointments`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          console.log('📅 Fetched appointments from API:', appointmentsResponse.data);

          // Format appointments to include patient and therapist names
          const formattedAppointments = (appointmentsResponse.data || []).map((apt, idx) => {
            const formatted = {
              id: apt.id,
              patientName: apt.patient?.user?.name || apt.patient?.fullName || 'Unknown',
              therapistName: apt.therapist?.user?.name || apt.therapist?.name || (apt.therapistId ? 'Unassigned' : 'No Therapist'),
              date: apt.appointmentDate ? new Date(apt.appointmentDate).toLocaleDateString() : 'N/A',
              time: apt.startTime || 'N/A',
              status: (apt.status || 'pending').trim(),
              ...apt
            };
            console.log(`📍 Appointment ${idx}:`, formatted);
            return formatted;
          });

          console.log('✅ Setting appointments:', formattedAppointments);
          setAppointments(formattedAppointments);
        } catch (error) {
          console.error('Error fetching appointments:', error);
          setAppointments([]);
        }
      } catch (error) {
        console.error('Error fetching patients or therapists:', error);
        setPatients([]);
        setTherapists([]);
        setAdmins([]);
      }
    };

    if (token) {
      fetchAllData();
    }
  }, [token]);

  // Function to refresh appointments
  const refreshAppointments = async () => {
    console.log('🔄 Refreshing appointments...');
    try {
      const appointmentsResponse = await axios.get(`${API_BASE_URL}/appointments`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('📅 Raw appointments from API:', appointmentsResponse.data);

      if (!appointmentsResponse.data || appointmentsResponse.data.length === 0) {
        console.warn('⚠️ No appointments returned from API');
        setAppointments([]);
        return;
      }

      // Format appointments to include patient and therapist names
      const formattedAppointments = (appointmentsResponse.data || []).map((apt, idx) => {
        const formatted = {
          id: apt.id,
          patientName: apt.patient?.user?.name || apt.patient?.fullName || 'Unknown',
          therapistName: apt.therapist?.user?.name || apt.therapist?.name || (apt.therapistId ? 'Unassigned' : 'No Therapist'),
          date: apt.appointmentDate ? new Date(apt.appointmentDate).toLocaleDateString() : 'N/A',
          time: apt.startTime || 'N/A',
          status: (apt.status || 'pending').trim(),
          ...apt
        };
        console.log(`📍 Appointment ${idx}:`, formatted);
        return formatted;
      });

      console.log('✅ Total appointments to display:', formattedAppointments.length);
      setAppointments(formattedAppointments);
    } catch (error) {
      console.error('❌ Error refreshing appointments:', error);
      setAppointments([]);
    }
  };
  // Initialize appointments as empty array - will be fetched from database
  const [appointments, setAppointments] = useState(() => {
    // Don't use localStorage for appointments - always fetch from database
    return [];
  });

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState({ type: '', id: null });
  const [dialogType, setDialogType] = useState(''); // 'therapist' or 'patient'
  const [formData, setFormData] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [showAddPassword, setShowAddPassword] = useState(true);
  const [showEditPassword, setShowEditPassword] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    localStorage.setItem('adminPortalTab', newValue.toString());
  };

  // Load patient bookings from localStorage when component mounts or when bookings change
  useEffect(() => {
    const loadPatientBookings = () => {
      // Patient bookings are now created through the booking API as real appointments
      // No need to load from localStorage anymore - they're in the database
    };

    // Load patient bookings once on mount
    loadPatientBookings();
  }, []);

  // Listen for appointment creation event from NotificationCenter
  useEffect(() => {
    const handleAppointmentCreated = () => {
      console.log('🔔 Appointment created event received from NotificationCenter');
      refreshAppointments();
    };

    window.addEventListener('appointmentCreated', handleAppointmentCreated);
    console.log('✅ Registered appointmentCreated event listener');
    
    return () => {
      window.removeEventListener('appointmentCreated', handleAppointmentCreated);
      console.log('❌ Unregistered appointmentCreated event listener');
    };
  }, [token]);
 const handleOpenAddDialog = (type) => {
    setDialogType(type);
    if (type === 'therapist') {
      setFormData({ name: '', specialty: '', email: '', phone: '', password: '' });
    } else if (type === 'patient') {
      setFormData({ fullName: '', phone: '', email: '', age: '', gender: '', password: '' });
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

    // Map the item data to formData structure based on type
    let mappedData = {};
    if (type === 'patient') {
      mappedData = {
        fullName: item.user?.name || '',
        phone: item.phone || '',
        age: item.age || '',
        gender: item.gender || '',
        medicalHistory: item.medicalHistory || '',
        email: item.user?.email || ''
      };
    } else if (type === 'therapist') {
      mappedData = {
        name: item.user?.name || item.name || '',
        email: item.user?.email || item.email || '',
        phone: item.phone || '',
        specialty: item.specialization || item.specialty || '',
        password: ''
      };
    } else if (type === 'admin') {
      mappedData = {
        name: item.user?.name || item.name || '',
        email: item.user?.email || item.email || '',
        password: ''
      };
    } else if (type === 'appointment') {
      // Convert date format for appointment edit dialog
      mappedData = {
        ...item,
        date: formatDateForInput(item.date || item.appointmentDate)
      };
    }

    setFormData(mappedData);
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

  const handleConfirmDelete = async () => {
    const { type, id } = deleteTarget;
    try {
      if (type === 'therapist') {
        await axios.delete(`${API_BASE_URL}/therapists/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTherapists(therapists.filter(t => t.id !== id));
        setSnackbar({ open: true, message: 'Therapist deleted successfully!', severity: 'success' });
      } else if (type === 'patient') {
        await axios.delete(`${API_BASE_URL}/patients/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPatients(patients.filter(p => p.id !== id));
        setSnackbar({ open: true, message: 'Patient deleted successfully!', severity: 'success' });
      } else if (type === 'appointment') {
        await axios.delete(`${API_BASE_URL}/appointments/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAppointments(appointments.filter(a => a.id !== id));
        setSnackbar({ open: true, message: 'Appointment deleted successfully!', severity: 'success' });
      } else if (type === 'admin') {
        await axios.delete(`${API_BASE_URL}/admins/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAdmins(admins.filter(a => a.id !== id));
        setSnackbar({ open: true, message: 'Admin deleted successfully!', severity: 'success' });
      }
    } catch (error) {
      console.error('Error deleting:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Error deleting item. Please try again.',
        severity: 'error'
      });
      return;
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

  const handleSavePassword = async () => {
    try {
      // Validate passwords match
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        setSnackbar({
          open: true,
          message: language === 'ar' ? 'كلمات المرور غير متطابقة' : 'Passwords do not match',
          severity: 'error',
        });
        return;
      }

      // Validate new password length
      if (passwordData.newPassword.length < 6) {
        setSnackbar({
          open: true,
          message: language === 'ar' ? 'يجب أن تكون كلمة المرور 6 أحرف على الأقل' : 'Password must be at least 6 characters',
          severity: 'error',
        });
        return;
      }

      // Get current user ID from token or localStorage
      const userId = localStorage.getItem('userId');
      if (!userId) {
        setSnackbar({
          open: true,
          message: language === 'ar' ? 'معرف المستخدم غير متوفر' : 'User ID not available',
          severity: 'error',
        });
        return;
      }

      // Call backend API to change password
      const response = await axios.put(
        `${API_BASE_URL}/admin/${userId}/change-password`,
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
          confirmPassword: passwordData.confirmPassword
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setChangePasswordOpen(false);
      setSnackbar({
        open: true,
        message: language === 'ar' ? 'تم تغيير كلمة المرور بنجاح' : 'Password changed successfully',
        severity: 'success',
      });
    } catch (error) {
      const errorMessage = error.response?.data?.message || (language === 'ar' ? 'فشل تغيير كلمة المرور' : 'Failed to change password');
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error',
      });
      console.error('Password change error:', error);
    }
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
        const therapistData = {
          name: formData.name || undefined,
          specialty: formData.specialty || undefined,
          email: formData.email || undefined,
          phone: formData.phone || undefined,
          password: formData.password || undefined
        };

        // Remove undefined fields
        Object.keys(therapistData).forEach(key => therapistData[key] === undefined && delete therapistData[key]);

        console.log('Sending therapist update:', { id: editingId, data: therapistData });

        const response = await axios.put(`${API_BASE_URL}/therapists/${editingId}`, therapistData, {
          headers: { Authorization: `Bearer ${token}` }
        });

        console.log('Therapist update response:', response.data);

        setSnackbar({ open: true, message: 'Therapist updated successfully!', severity: 'success' });
        handleCloseEditDialog();
        await refreshAllData();
      } else if (dialogType === 'patient') {
        const patientData = {
          fullName: formData.fullName || undefined,
          phone: formData.phone || undefined,
          email: formData.email || undefined,
          age: formData.age || undefined,
          gender: formData.gender || undefined,
          medicalHistory: formData.medicalHistory || undefined,
          password: formData.password || undefined
        };

        // Remove undefined fields
        Object.keys(patientData).forEach(key => patientData[key] === undefined && delete patientData[key]);

        const response = await axios.put(`${API_BASE_URL}/patients/${editingId}`, patientData, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setSnackbar({ open: true, message: 'Patient updated successfully!', severity: 'success' });
        handleCloseEditDialog();
        await refreshAllData();
      } else if (dialogType === 'appointment') {
        // Create appointment data with IDs
        const appointmentData = {
          therapistId: parseInt(formData.therapistId),
          patientId: parseInt(formData.patientId),
          appointmentDate: formData.date,
          startTime: formData.time,
          endTime: formData.time,
          service: formData.service || 'General'
        };

        const response = await axios.put(`${API_BASE_URL}/appointments/${editingId}`, appointmentData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSnackbar({ open: true, message: 'Appointment updated successfully!', severity: 'success' });
        handleCloseEditDialog();
        await refreshAllData();
      } else if (dialogType === 'admin') {
        const response = await axios.put(`${API_BASE_URL}/admin/${editingId}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSnackbar({ open: true, message: 'Admin updated successfully!', severity: 'success' });
        handleCloseEditDialog();
        await refreshAllData();
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'An error occurred. Please try again.';
      setSnackbar({ open: true, message: errorMessage, severity: 'error' });
      console.error('Error updating item:', error);
    }
  };

  const handleAddSubmit = async () => {
    try {
      if (dialogType === 'therapist') {
        // Add therapist via API
        await axios.post(`${API_BASE_URL}/therapists`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSnackbar({
          open: true,
          message: 'Therapist added successfully!',
          severity: 'success',
        });
      } else if (dialogType === 'patient') {
        // Add patient via API
        const patientData = {
          fullName: formData.fullName,
          phone: formData.phone,
          age: formData.age ? parseInt(formData.age) : null,
          gender: formData.gender,
          email: formData.email,
          password: formData.password
        };
        await axios.post(`${API_BASE_URL}/patients`, patientData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSnackbar({
          open: true,
          message: 'Patient added successfully!',
          severity: 'success',
        });
      } else if (dialogType === 'appointment') {
        // Create appointment data with IDs
        const appointmentData = {
          therapistId: parseInt(formData.therapistId),
          patientId: parseInt(formData.patientId),
          appointmentDate: formData.date,
          startTime: formData.time,
          endTime: formData.time, // Set end time same as start time for now
          service: formData.service || 'General'
        };

        console.log('Sending appointment data:', appointmentData);

        // Add appointment via API
        await axios.post(`${API_BASE_URL}/appointments`, appointmentData, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setSnackbar({
          open: true,
          message: 'Appointment scheduled successfully!',
          severity: 'success',
        });
      } else if (dialogType === 'admin') {
        // Add admin via API
        await axios.post(`${API_BASE_URL}/admin/register`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSnackbar({
          open: true,
          message: 'Admin added successfully!',
          severity: 'success',
        });
      }
      handleCloseAddDialog();
      await refreshAllData();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'An error occurred. Please try again.';
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error',
      });
      console.error('Error adding item:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('isLoggedIn');
    navigate('/login');
  };

  const handleStatusChange = async (type, id, newStatus) => {
    try {
      if (type === 'therapist') {
        const response = await axios.put(`${API_BASE_URL}/therapists/${id}`, { status: newStatus }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        // Find the existing therapist and merge with response
        const updatedTherapist = therapists.find(t => t.id === id);
        setTherapists(therapists.map(t => t.id === id ? { ...updatedTherapist, status: newStatus, ...response.data } : t));
        setSnackbar({
          open: true,
          message: `Therapist status changed to ${newStatus}!`,
          severity: 'success',
        });
      } else if (type === 'patient') {
        const response = await axios.put(`${API_BASE_URL}/patients/${id}`, { status: newStatus }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        // Find the existing patient and merge with response
        const updatedPatient = patients.find(p => p.id === id);
        setPatients(patients.map(p => p.id === id ? { ...updatedPatient, status: newStatus, ...response.data } : p));
        setSnackbar({
          open: true,
          message: `Patient status changed to ${newStatus}!`,
          severity: 'success',
        });
      } else if (type === 'admin') {
        const response = await axios.put(`${API_BASE_URL}/admins/${id}`, { status: newStatus }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        // Find the existing admin and merge with response
        const updatedAdmin = admins.find(a => a.id === id);
        setAdmins(admins.map(a => a.id === id ? { ...updatedAdmin, status: newStatus, ...response.data } : a));
        setSnackbar({
          open: true,
          message: `Admin status changed to ${newStatus}!`,
          severity: 'success',
        });
      } else if (type === 'appointment') {
        const response = await axios.put(`${API_BASE_URL}/appointments/${id}`, { status: newStatus }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        // Find the existing appointment and merge with response
        const updatedAppointment = appointments.find(a => a.id === id);
        setAppointments(appointments.map(a => a.id === id ? { ...updatedAppointment, status: newStatus, ...response.data } : a));
        setSnackbar({
          open: true,
          message: `Appointment status changed to ${newStatus}!`,
          severity: 'success',
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to update status',
        severity: 'error',
      });
      console.error('Error updating status:', error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 3, md: 6 }, px: { xs: 1, sm: 2 } }}>
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 4,
        flexDirection: { xs: 'column', md: 'row' },
        gap: { xs: 2, md: 0 }
      }}>
        <Box sx={{ textAlign: { xs: 'center', md: 'left' }, width: { xs: '100%', md: 'auto' } }}>
          <Typography
            variant="h2"
            sx={{ color: '#1C6FB5', fontWeight: 'bold', fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' } }}
          >
            {language === 'ar' ? 'بوابة المسؤول' : 'Admin Portal'}
          </Typography>
          <Typography variant="body1" sx={{ color: '#666', mt: 1, fontSize: { xs: '0.9rem', md: '1rem' } }}>
            {language === 'ar' ? 'مرحباً ' + adminName : 'Welcome, ' + adminName}
          </Typography>
        </Box>
        <Box sx={{ 
          display: 'flex', 
          gap: { xs: 1, sm: 2 }, 
          alignItems: 'center',
          flexWrap: 'wrap',
          justifyContent: { xs: 'center', md: 'flex-end' },
          width: { xs: '100%', md: 'auto' }
        }}>
          {/* Profile Card */}
          <Card sx={{ 
            p: 1, 
            display: { xs: 'none', sm: 'flex' }, 
            alignItems: 'center', 
            gap: 1.5, 
            minWidth: '200px', 
            bgcolor: '#f5f5f5', 
            borderRadius: '10px' 
          }}>
            <Avatar
              sx={{
                width: 40,
                height: 40,
                bgcolor: '#1C6FB5',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '1rem'
              }}
            >
              {adminName.split(' ').map(n => n[0]).join('').toUpperCase()}
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography sx={{ fontWeight: 'bold', color: '#1C6FB5', fontSize: { xs: '0.8rem', md: '0.95rem' }, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {adminName}
              </Typography>
              <Typography sx={{ fontSize: { xs: '0.7rem', md: '0.8rem' }, color: '#666', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                @{adminName.toLowerCase().replace(/\s+/g, '')}
              </Typography>
            </Box>
          </Card>
          <NotificationCenter />
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
            <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
              {language === 'ar' ? 'تسجيل الخروج' : 'Logout'}
            </MenuItem>
          </Menu>
          <Button
            variant="contained"
            color="error"
            startIcon={<LogoutSharp />}
            onClick={handleLogout}
            sx={{ display: { xs: 'none', sm: 'flex' } }}
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
                {(() => {
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  const tomorrow = new Date(today);
                  tomorrow.setDate(tomorrow.getDate() + 1);

                  return appointments.filter(apt => {
                    const aptDate = new Date(apt.appointmentDate);
                    aptDate.setHours(0, 0, 0, 0);
                    return aptDate.getTime() === today.getTime();
                  }).length;
                })()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Card sx={{ mb: 3, p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: { xs: 'wrap', sm: 'nowrap' }, gap: 2 }}>
          <Box sx={{ flex: 1, overflow: 'auto' }}>
            <Tabs value={tabValue} onChange={handleTabChange} sx={{ minWidth: 'fit-content' }}>
              <Tab label={language === 'ar' ? 'المرضى' : 'Patients'} />
              <Tab label={language === 'ar' ? 'المعالجين' : 'Therapists'} />
              <Tab label={language === 'ar' ? 'المواعيد' : 'Appointments'} />
              <Tab label={language === 'ar' ? 'المسؤولين' : 'Admins'} />
            </Tabs>
          </Box>
          {tabValue === 0 && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenAddDialog('patient')}
              sx={{ flexShrink: 0 }}
            >
              {language === 'ar' ? 'إضافة مريض' : 'Add Patient'}
            </Button>
          )}
          {tabValue === 1 && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenAddDialog('therapist')}
              sx={{ flexShrink: 0 }}
            >
              {language === 'ar' ? 'إضافة معالج' : 'Add Therapist'}
            </Button>
          )}
          {tabValue === 2 && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenAddDialog('appointment')}
              sx={{ flexShrink: 0 }}
            >
              {language === 'ar' ? 'جدولة موعد' : 'Schedule Appointment'}
            </Button>
          )}
          {tabValue === 3 && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenAddDialog('admin')}
              sx={{ flexShrink: 0 }}
            >
              {language === 'ar' ? 'إضافة مسؤول' : 'Add Admin'}
            </Button>
          )}
        </Box>
      </Card>

      {/* Patients Table */}
      {tabValue === 0 && (
        <TableContainer component={Paper} sx={{
          backgroundColor: theme.palette.mode === 'dark' ? '#2a2a2a' : '#f5f5f5',
          borderRadius: '10px',
          marginTop: 3,
          overflowX: 'auto',
          overflowY: 'hidden',
          WebkitOverflowScrolling: 'touch'
        }}>
          <Table sx={{ minWidth: { xs: 600, sm: 800 } }}>
            <TableHead>
              <TableRow sx={{ bgcolor: '#1C6FB5' }}>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', padding: { xs: '10px', sm: '16px' }, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                  {language === 'ar' ? 'الاسم' : 'Name'}
                </TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', padding: { xs: '10px', sm: '16px' }, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                  {language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                </TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', padding: { xs: '10px', sm: '16px' }, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                  {language === 'ar' ? 'الهاتف' : 'Phone'}
                </TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', padding: { xs: '10px', sm: '16px' }, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                  {language === 'ar' ? 'العمر' : 'Age'}
                </TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', padding: { xs: '10px', sm: '16px' }, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                  {language === 'ar' ? 'تاريخ الانضمام' : 'Join Date'}
                </TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', padding: { xs: '10px', sm: '16px' }, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                  {language === 'ar' ? 'الحالة' : 'Status'}
                </TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', padding: { xs: '10px', sm: '16px' }, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                  {language === 'ar' ? 'الإجراءات' : 'Actions'}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody key={refreshKey}>
              {patients.map((patient, index) => (
                <TableRow key={`${patient.id}-${refreshKey}`} hover sx={{
                  backgroundColor: theme.palette.mode === 'dark'
                    ? (index % 2 === 0 ? '#333333' : '#3a3a3a')
                    : (index % 2 === 0 ? '#ffffff' : '#f9f9f9'),
                  '&:hover': { backgroundColor: theme.palette.mode === 'dark' ? '#404040' : '#e3f2fd' }
                }}>
                  <TableCell sx={{ color: theme.palette.mode === 'dark' ? '#e0e0e0' : '#333', padding: { xs: '10px', sm: '14px' }, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>{patient.user?.name || 'N/A'}</TableCell>
                  <TableCell sx={{ color: theme.palette.mode === 'dark' ? '#e0e0e0' : '#333', padding: { xs: '10px', sm: '14px' }, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>{patient.user?.email || 'N/A'}</TableCell>
                  <TableCell sx={{ color: theme.palette.mode === 'dark' ? '#e0e0e0' : '#333', padding: { xs: '10px', sm: '14px' }, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>{patient.phone || 'N/A'}</TableCell>
                  <TableCell sx={{ color: theme.palette.mode === 'dark' ? '#e0e0e0' : '#333', padding: { xs: '10px', sm: '14px' }, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>{patient.age || 'N/A'}</TableCell>
                  <TableCell sx={{ color: theme.palette.mode === 'dark' ? '#e0e0e0' : '#333', padding: { xs: '10px', sm: '14px' }, fontSize: { xs: '0.75rem', sm: '0.875rem' }, whiteSpace: 'nowrap' }}>{patient.createdAt ? new Date(patient.createdAt).toLocaleDateString() : 'N/A'}</TableCell>
                  <TableCell>
                    <Select
                      value={patient.status || 'active'}
                      onChange={(e) => handleStatusChange('patient', patient.id, e.target.value)}
                      size="small"
                      sx={{
                        minWidth: 100,
                        backgroundColor: getStatusColor(patient.status || 'active'),
                        color: 'white',
                        fontWeight: 'bold',
                        borderRadius: '4px',
                        '& .MuiOutlinedInput-notchedOutline': {
                          border: 'none'
                        },
                        '& .MuiSvgIcon-root': {
                          color: 'white'
                        }
                      }}
                    >
                      <MenuItem value="active" sx={{ backgroundColor: '#4caf50', color: 'white' }}>
                        {language === 'ar' ? 'نشط' : 'Active'}
                      </MenuItem>
                      <MenuItem value="inactive" sx={{ backgroundColor: '#f44336', color: 'white' }}>
                        {language === 'ar' ? 'غير نشط' : 'Inactive'}
                      </MenuItem>
                    </Select>
                  </TableCell>
                  <TableCell sx={{ padding: { xs: '10px', sm: '14px' }, display: 'flex', flexWrap: 'wrap', gap: { xs: 0.5, sm: 1 } }}>
                    <IconButton
                      size="small"
                      color="success"
                      href={`https://api.whatsapp.com/send?phone=${patient.phone}&text=%D9%85%D8%B1%D9%83%D8%B2%20%D8%A7%D9%84%D8%B9%D9%85%D8%A7%D8%AF%20%D9%84%D9%84%D8%B9%D9%84%D8%A7%D8%AC%20%D8%A7%D9%84%D8%B7%D8%A8%D9%8A%D8%B9%D9%8A%20%D9%88%D8%A7%D9%84%D8%AA%D8%A3%D9%87%D9%8A%D9%84%20%D9%8A%D8%B1%D8%AD%D8%A8%20%D8%A8%D9%83%D9%85%D8%8C%20%D9%88%D9%8A%D9%88%D8%AF%D9%91%20%D8%A7%D9%84%D8%AA%D8%A3%D9%83%D9%8A%D8%AF%20%D8%B9%D9%84%D9%89%20%D9%85%D9%88%D8%B9%D8%AF%20%D8%AC%D9%84%D8%B3%D8%A9%20%D8%A7%D9%84%D8%B9%D9%84%D8%A7%D8%AC:%20%F0%9F%95%92%20%D8%A7%D9%84%D8%B3%D8%A7%D8%B9%D8%A9:%2011:30%20%F0%9F%93%85%20%D8%A7%D9%84%D9%8A%D9%88%D9%85:%20(%D9%85%D8%AB%D8%A7%D9%84:%20%D8%A7%D9%84%D8%A7%D8%AB%D9%86%D9%8A%D9%86)%20%F0%9F%93%86%20%D8%A7%D9%84%D8%AA%D8%A7%D8%B1%D9%8A%D8%AE:%20(%D9%85%D8%AB%D8%A7%D9%84:%2025%20/%2012%20/%202025)%20%D8%B1%D8%A7%D8%AC%D9%8A%D9%86%20%D9%85%D9%86%D9%83%D9%85%20%D8%A7%D9%84%D8%A7%D9%84%D8%AA%D8%B2%D8%A7%D9%85%20%D8%A8%D8%A7%D9%84%D9%85%D9%88%D8%B9%D8%AF.%20%D8%B4%D8%A7%D9%83%D8%B1%D9%8A%D9%86%20%D8%AB%D9%82%D8%AA%D9%83%D9%85%20%D9%88%D8%A7%D8%AE%D8%AA%D9%8A%D8%A7%D8%B1%D9%83%D9%85%20%D9%84%D9%86%D8%A7`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <WhatsAppIcon />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      color="primary" 
                      onClick={() => handleOpenEditDialog('patient', patient)}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      color="error" 
                      onClick={() => handleDelete('patient', patient.id)}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Therapists Table */}
      {tabValue === 1 && (
        <TableContainer component={Paper} sx={{
          backgroundColor: theme.palette.mode === 'dark' ? '#2a2a2a' : '#f5f5f5',
          borderRadius: '10px',
          marginTop: 3,
          overflowX: 'auto',
          overflowY: 'hidden',
          WebkitOverflowScrolling: 'touch'
        }}>
          <Table sx={{ minWidth: { xs: 600, sm: 800 } }}>
            <TableHead>
              <TableRow sx={{ bgcolor: '#1C6FB5' }}>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', padding: { xs: '10px', sm: '16px' }, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                  {language === 'ar' ? 'الاسم' : 'Name'}
                </TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', padding: { xs: '10px', sm: '16px' }, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                  {language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                </TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', padding: { xs: '10px', sm: '16px' }, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                  {language === 'ar' ? 'رقم الهاتف' : 'Phone'}
                </TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', padding: { xs: '10px', sm: '16px' }, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                  {language === 'ar' ? 'الحالة' : 'Status'}
                </TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', padding: { xs: '10px', sm: '16px' }, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                  {language === 'ar' ? 'الإجراءات' : 'Actions'}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody key={refreshKey}>
              {therapists.map((therapist, index) => (
                <TableRow key={`${therapist.id}-${refreshKey}`} hover sx={{
                  backgroundColor: theme.palette.mode === 'dark'
                    ? (index % 2 === 0 ? '#333333' : '#3a3a3a')
                    : (index % 2 === 0 ? '#ffffff' : '#f9f9f9'),
                  '&:hover': { backgroundColor: theme.palette.mode === 'dark' ? '#404040' : '#e3f2fd' }
                }}>
                  <TableCell sx={{ color: theme.palette.mode === 'dark' ? '#e0e0e0' : '#333', padding: { xs: '10px', sm: '14px' }, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>{therapist.name}</TableCell>
                  <TableCell sx={{ color: theme.palette.mode === 'dark' ? '#e0e0e0' : '#333', padding: { xs: '10px', sm: '14px' }, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>{therapist.user?.email || therapist.email || 'N/A'}</TableCell>
                  <TableCell sx={{ color: theme.palette.mode === 'dark' ? '#e0e0e0' : '#333', padding: { xs: '10px', sm: '14px' }, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>{therapist.phone || 'N/A'}</TableCell>
                  <TableCell>
                    <Select
                      value={therapist.status || 'active'}
                      onChange={(e) => handleStatusChange('therapist', therapist.id, e.target.value)}
                      size="small"
                      sx={{
                        minWidth: 100,
                        backgroundColor: getStatusColor(therapist.status || 'active'),
                        color: 'white',
                        fontWeight: 'bold',
                        borderRadius: '4px',
                        padding: '6px 12px',
                        '& .MuiOutlinedInput-notchedOutline': {
                          border: 'none'
                        },
                        '& .MuiSvgIcon-root': {
                          color: 'white'
                        },
                        '&:hover': {
                          backgroundColor: getStatusColor(therapist.status || 'active'),
                          opacity: 0.9
                        }
                      }}
                    >
                      <MenuItem value="active" sx={{ backgroundColor: '#4caf50', color: 'white', '&:hover': { backgroundColor: '#45a049' } }}>
                        {language === 'ar' ? 'نشط' : 'Active'}
                      </MenuItem>
                      <MenuItem value="inactive" sx={{ backgroundColor: '#f44336', color: 'white', '&:hover': { backgroundColor: '#da190b' } }}>
                        {language === 'ar' ? 'غير نشط' : 'Inactive'}
                      </MenuItem>
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
        <TableContainer component={Paper} sx={{
          backgroundColor: theme.palette.mode === 'dark' ? '#2a2a2a' : '#f5f5f5',
          borderRadius: '10px',
          marginTop: 3,
          overflowX: 'auto',
          overflowY: 'hidden',
          WebkitOverflowScrolling: 'touch'
        }}>
          <Table sx={{ minWidth: { xs: 600, sm: 800 } }}>
            <TableHead>
              <TableRow sx={{ bgcolor: '#1C6FB5' }}>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', padding: { xs: '10px', sm: '16px' }, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                  {language === 'ar' ? 'اسم المريض' : 'Patient Name'}
                </TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', padding: { xs: '10px', sm: '16px' }, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                  {language === 'ar' ? 'اسم المعالج' : 'Therapist Name'}
                </TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', padding: { xs: '10px', sm: '16px' }, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                  {language === 'ar' ? 'التاريخ' : 'Date'}
                </TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', padding: { xs: '10px', sm: '16px' }, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                  {language === 'ar' ? 'الوقت' : 'Time'}
                </TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', padding: { xs: '10px', sm: '16px' }, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                  {language === 'ar' ? 'الحالة' : 'Status'}
                </TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', padding: { xs: '10px', sm: '16px' }, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                  {language === 'ar' ? 'الإجراءات' : 'Actions'}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody key={refreshKey}>
              {(() => {
                console.log('🎯 Rendering appointments table, appointments.length:', appointments?.length || 0, 'appointments:', appointments);
                
                if (!appointments || appointments.length === 0) {
                  return (
                    <TableRow>
                      <TableCell colSpan={6} sx={{ textAlign: 'center', py: 3, color: '#999' }}>
                        {language === 'ar' ? 'لا توجد مواعيد' : 'No appointments found'}
                      </TableCell>
                    </TableRow>
                  );
                }
                
                return appointments.map((appointment, index) => (
                <TableRow key={`${appointment.id}-${appointment.type || 'admin'}-${refreshKey}`} hover sx={{
                  backgroundColor: appointment.status === 'cancelled'
                    ? (theme.palette.mode === 'dark' ? '#4a2a2a' : '#ffe6e6')
                    : (theme.palette.mode === 'dark'
                      ? (index % 2 === 0 ? '#333333' : '#3a3a3a')
                      : (index % 2 === 0 ? '#ffffff' : '#f9f9f9')),
                  opacity: appointment.status === 'cancelled' ? 0.7 : 1,
                  '&:hover': { backgroundColor: theme.palette.mode === 'dark' ? '#404040' : '#e3f2fd' }
                }}>
                  <TableCell sx={{
                    color: appointment.status === 'cancelled' ? '#999' : (theme.palette.mode === 'dark' ? '#e0e0e0' : '#333'),
                    padding: '14px',
                    textDecoration: appointment.status === 'cancelled' ? 'line-through' : 'none'
                  }}>{appointment.patientName}</TableCell>
                  <TableCell sx={{
                    color: appointment.status === 'cancelled' ? '#999' : (theme.palette.mode === 'dark' ? '#e0e0e0' : '#333'),
                    padding: '14px',
                    textDecoration: appointment.status === 'cancelled' ? 'line-through' : 'none'
                  }}>{appointment.therapistName}</TableCell>
                  <TableCell sx={{
                    color: appointment.status === 'cancelled' ? '#999' : (theme.palette.mode === 'dark' ? '#e0e0e0' : '#333'),
                    padding: '14px',
                    textDecoration: appointment.status === 'cancelled' ? 'line-through' : 'none'
                  }}>{appointment.date}</TableCell>
                  <TableCell sx={{ color: theme.palette.mode === 'dark' ? '#e0e0e0' : '#333', padding: '14px' }}>{appointment.time}</TableCell>
                  <TableCell>
                    {(() => {
                      const statusValue = (appointment.status || 'pending').trim();
                      const validStatuses = ['pending', 'scheduled', 'completed', 'cancelled'];
                      const safeStatus = validStatuses.includes(statusValue) ? statusValue : 'pending';
                      return (
                        <Select
                          value={safeStatus}
                          onChange={(e) => handleStatusChange('appointment', appointment.id, e.target.value)}
                          size="small"
                          sx={{
                            minWidth: 100,
                            backgroundColor: getStatusColor(safeStatus),
                            color: 'white',
                            fontWeight: 'bold',
                            borderRadius: '4px',
                            padding: '6px 12px',
                            '& .MuiOutlinedInput-notchedOutline': {
                              border: 'none'
                            },
                            '& .MuiSvgIcon-root': {
                              color: 'white'
                            },
                            '&:hover': {
                              backgroundColor: getStatusColor(safeStatus),
                              opacity: 0.9
                            }
                          }}
                        >
                          <MenuItem value="pending" sx={{ backgroundColor: '#ff9800', color: 'white', '&:hover': { backgroundColor: '#e68900' } }}>
                            {language === 'ar' ? 'قيد الانتظار' : 'Pending'}
                          </MenuItem>
                          <MenuItem value="scheduled" sx={{ backgroundColor: '#4caf50', color: 'white', '&:hover': { backgroundColor: '#45a049' } }}>
                            {language === 'ar' ? 'مجدول' : 'Scheduled'}
                          </MenuItem>
                          <MenuItem value="completed" sx={{ backgroundColor: '#2196f3', color: 'white', '&:hover': { backgroundColor: '#0b7dda' } }}>
                            {language === 'ar' ? 'مكتمل' : 'Completed'}
                          </MenuItem>
                          <MenuItem value="cancelled" sx={{ backgroundColor: '#f44336', color: 'white', '&:hover': { backgroundColor: '#da190b' } }}>
                            {language === 'ar' ? 'ملغي' : 'Cancelled'}
                          </MenuItem>
                        </Select>
                      );
                    })()}
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
              ));
              })()}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Admins Table */}
      {tabValue === 3 && (
        <TableContainer component={Paper} sx={{
          backgroundColor: theme.palette.mode === 'dark' ? '#2a2a2a' : '#f5f5f5',
          borderRadius: '10px',
          marginTop: 3,
          overflowX: 'auto',
          overflowY: 'hidden',
          WebkitOverflowScrolling: 'touch'
        }}>
          <Table sx={{ minWidth: { xs: 600, sm: 800 } }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#1C6FB5' }}>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', padding: { xs: '10px', sm: '16px' }, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                  {language === 'ar' ? 'الاسم' : 'Name'}
                </TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', padding: { xs: '10px', sm: '16px' }, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                  {language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                </TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', padding: { xs: '10px', sm: '16px' }, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                  {language === 'ar' ? 'الدور' : 'Role'}
                </TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', padding: { xs: '10px', sm: '16px' }, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                  {language === 'ar' ? 'الحالة' : 'Status'}
                </TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', padding: { xs: '10px', sm: '16px' }, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                  {language === 'ar' ? 'الإجراءات' : 'Actions'}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody key={refreshKey}>
              {admins.map((admin, index) => (
                <TableRow key={`${admin.id}-${refreshKey}`} hover sx={{
                  backgroundColor: theme.palette.mode === 'dark'
                    ? (index % 2 === 0 ? '#333333' : '#3a3a3a')
                    : (index % 2 === 0 ? '#ffffff' : '#f9f9f9'),
                  '&:hover': { backgroundColor: theme.palette.mode === 'dark' ? '#404040' : '#e3f2fd' }
                }}>
                  <TableCell sx={{ color: theme.palette.mode === 'dark' ? '#e0e0e0' : '#333', padding: { xs: '10px', sm: '14px' }, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>{admin.name}</TableCell>
                  <TableCell sx={{ color: theme.palette.mode === 'dark' ? '#e0e0e0' : '#333', padding: { xs: '10px', sm: '14px' }, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>{admin.email}</TableCell>
                  <TableCell sx={{ color: theme.palette.mode === 'dark' ? '#e0e0e0' : '#333', padding: { xs: '10px', sm: '14px' }, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>{admin.role}</TableCell>
                  <TableCell>
                    <Select
                      value={admin.status || 'active'}
                      onChange={(e) => handleStatusChange('admin', admin.id, e.target.value)}
                      size="small"
                      sx={{
                        minWidth: 100,
                        backgroundColor: getStatusColor(admin.status || 'active'),
                        color: 'white',
                        fontWeight: 'bold',
                        borderRadius: '4px',
                        '& .MuiOutlinedInput-notchedOutline': {
                          border: 'none'
                        },
                        '& .MuiSvgIcon-root': {
                          color: 'white'
                        }
                      }}
                    >
                      <MenuItem value="active" sx={{ backgroundColor: '#4caf50', color: 'white' }}>
                        {language === 'ar' ? 'نشط' : 'Active'}
                      </MenuItem>
                      <MenuItem value="inactive" sx={{ backgroundColor: '#f44336', color: 'white' }}>
                        {language === 'ar' ? 'غير نشط' : 'Inactive'}
                      </MenuItem>
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
                label={language === "ar" ? "التخصص" : "Speciality"}
                value={formData.specialty || ""}
                onChange={(e) =>
                  setFormData({ ...formData, specialty: e.target.value })
                }
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
                select
                label={language === 'ar' ? 'الجنس' : 'Gender'}
                value={formData.gender || ''}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                margin="normal"
                required
              >
                <MenuItem value="Male">{language === 'ar' ? 'ذكر' : 'Male'}</MenuItem>
                <MenuItem value="Female">{language === 'ar' ? 'أنثى' : 'Female'}</MenuItem>
                <MenuItem value="Other">{language === 'ar' ? 'آخر' : 'Other'}</MenuItem>
              </TextField>
              <TextField
                fullWidth
                type="number"
                label={language === 'ar' ? 'العمر' : 'Age'}
                value={formData.age || ''}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                margin="normal"
                inputProps={{ min: '0', max: '120' }}
              />
              <TextField
                fullWidth
                label={language === 'ar' ? 'كلمة المرور' : 'Password'}
                type={showAddPassword ? 'text' : 'password'}
                value={formData.password || ''}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                margin="normal"
                required={!editingId}
                placeholder={editingId ? language === 'ar' ? 'اترك فارغاً للاحتفاظ بكلمة المرور الحالية' : 'Leave blank to keep current password' : ''}
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
                value={formData.patientId || ''}
                onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                margin="normal"
                required
              >
                <MenuItem value="">Select Patient</MenuItem>
                {patients && patients.length > 0 ? (
                  patients.map((p) => (
                    <MenuItem key={p.id} value={p.id}>
                      {p.fullName || p.user?.name || 'Unknown'}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>No patients available</MenuItem>
                )}
              </TextField>
              <TextField
                fullWidth
                select
                label={language === 'ar' ? 'اسم المعالج' : 'Therapist Name'}
                value={formData.therapistId || ''}
                onChange={(e) => setFormData({ ...formData, therapistId: e.target.value })}
                margin="normal"
                required
              >
                <MenuItem value="">Select Therapist</MenuItem>
                {therapists && therapists.length > 0 ? (
                  therapists.map((t) => (
                    <MenuItem key={t.id} value={t.id}>
                      {t.name || t.user?.name || 'Unknown'}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>No therapists available</MenuItem>
                )}
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
                label={language === "ar" ? "التخصص" : "Speciality"}
                value={formData.specialty || ""}
                onChange={(e) =>
                  setFormData({ ...formData, specialty: e.target.value })
                }
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
                select
                label={language === 'ar' ? 'الجنس' : 'Gender'}
                value={formData.gender || ''}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                margin="normal"
                required
              >
                <MenuItem value="Male">{language === 'ar' ? 'ذكر' : 'Male'}</MenuItem>
                <MenuItem value="Female">{language === 'ar' ? 'أنثى' : 'Female'}</MenuItem>
                <MenuItem value="Other">{language === 'ar' ? 'آخر' : 'Other'}</MenuItem>
              </TextField>
              <TextField
                fullWidth
                type="number"
                label={language === 'ar' ? 'العمر' : 'Age'}
                value={formData.age || ''}
                onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || '' })}
                margin="normal"
                inputProps={{ min: 0, max: 150 }}
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
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCancelDelete}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
          }
        }}
      >
        <DialogTitle sx={{
          bgcolor: 'linear-gradient(135deg, #ff5252 0%, #ff1744 100%)',
          color: 'white',
          fontWeight: 'bold',
          textAlign: 'center',
          padding: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1,
          fontSize: '1.3rem'
        }}>
          <span style={{ fontSize: '1.5rem' }}>🚨</span>
          {language === 'ar' ? 'تأكيد الحذف' : 'Confirm Delete'}
        </DialogTitle>
        <DialogContent sx={{
          pt: 4,
          pb: 3,
          textAlign: 'center',
          backgroundColor: '#fafafa'
        }}>
          <Box sx={{ mb: 3 }}>
            <Box sx={{
              width: '80px',
              height: '80px',
              margin: '0 auto 20px',
              backgroundColor: '#ffebee',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '40px',
              border: '2px solid #ff5252'
            }}>
              🗑️
            </Box>
          </Box>
          <Typography variant="h6" sx={{ mb: 2, color: '#1a1a1a', fontWeight: 600 }}>
            {language === 'ar'
              ? 'هل أنت متأكد من الحذف؟'
              : 'Are you sure?'
            }
          </Typography>
          <Typography variant="body2" sx={{ mb: 3, color: '#555', lineHeight: 1.6 }}>
            {language === 'ar'
              ? 'سيتم حذف هذا العنصر نهائياً. هذا الإجراء لا يمكن التراجع عنه.'
              : 'This item will be permanently deleted. This action cannot be undone.'
            }
          </Typography>
          <Box sx={{
            backgroundColor: '#fff3cd',
            border: '1px solid #ffc107',
            borderRadius: '8px',
            padding: '12px',
            mt: 2
          }}>
            <Typography variant="caption" sx={{ color: '#856404', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
              <span>⚠️</span>
              {language === 'ar' ? 'لا يمكن استعادة البيانات المحذوفة' : 'Deleted data cannot be recovered'}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{
          p: 3,
          justifyContent: 'center',
          gap: 2,
          backgroundColor: '#f5f5f5',
          borderTop: '1px solid #e0e0e0'
        }}>
          <Button
            onClick={handleCancelDelete}
            variant="outlined"
            sx={{
              minWidth: '140px',
              borderColor: '#1C6FB5',
              color: '#1C6FB5',
              fontWeight: 600,
              '&:hover': {
                backgroundColor: '#e3f2fd',
                borderColor: '#1C6FB5'
              }
            }}
          >
            {language === 'ar' ? 'إلغاء' : 'Cancel'}
          </Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            sx={{
              minWidth: '140px',
              background: 'linear-gradient(135deg, #ff5252 0%, #ff1744 100%)',
              fontWeight: 600,
              '&:hover': {
                background: 'linear-gradient(135deg, #ff3838 0%, #d32f2f 100%)',
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 16px rgba(255, 82, 82, 0.4)'
              },
              transition: 'all 0.3s ease'
            }}
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
