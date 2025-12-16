import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Alert,
  CircularProgress,
  Stack,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { appointmentAPI, patientAPI } from '@/services/api';

const PatientDashboardDB = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const patientId = localStorage.getItem('patientId');

  const [appointments, setAppointments] = useState([]);
  const [patientData, setPatientData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [canceling, setCanceling] = useState(false);

  useEffect(() => {
    if (patientId) {
      fetchPatientData();
      fetchAppointments();
    } else {
      setError('Please log in first');
      setLoading(false);
    }
  }, [patientId]);

  const fetchPatientData = async () => {
    try {
      const { data } = await patientAPI.getById(patientId);
      setPatientData(data);
    } catch (err) {
      console.error('Error fetching patient data:', err);
      setError('Failed to load patient information');
    }
  };

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const { data } = await appointmentAPI.getAll({
        patientId: parseInt(patientId),
      });
      setAppointments(data || []);
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setError('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async () => {
    setCanceling(true);
    try {
      await appointmentAPI.updateStatus(selectedAppointmentId, 'cancelled');
      setCancelDialogOpen(false);
      setSelectedAppointmentId(null);
      await fetchAppointments();
    } catch (err) {
      setError('Failed to cancel appointment');
    } finally {
      setCanceling(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      scheduled: 'primary',
      completed: 'success',
      cancelled: 'error',
    };
    return colors[status] || 'default';
  };

  const getStatusLabel = (status) => {
    const labels = {
      scheduled: '📅 Scheduled',
      completed: '✅ Completed',
      cancelled: '❌ Cancelled',
    };
    return labels[status] || status;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Welcome Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
          👋 Welcome, {patientData?.fullName || 'Patient'}!
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      </Box>

      {/* Patient Info Cards */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                📱 Phone
              </Typography>
              <Typography variant="h6">{patientData?.phone}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                🎂 Age
              </Typography>
              <Typography variant="h6">{patientData?.age} years</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                👤 Gender
              </Typography>
              <Typography variant="h6">{patientData?.gender}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                📋 Total Appointments
              </Typography>
              <Typography variant="h6">{appointments.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Appointments Section */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            📅 My Appointments
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/appointments/book')}
          >
            + Book New Appointment
          </Button>
        </Box>

        {appointments.length > 0 ? (
          <TableContainer component={Paper}>
            <Table>
              <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Therapist</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Service</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Date & Time</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Duration</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }} align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {appointments.map((appointment) => (
                  <TableRow key={appointment.id} hover>
                    <TableCell>{appointment.therapist?.name}</TableCell>
                    <TableCell>{appointment.service}</TableCell>
                    <TableCell>
                      <Stack spacing={0.5}>
                        <span>{new Date(appointment.date).toLocaleDateString()}</span>
                        <span style={{ fontSize: '0.85rem', color: '#666' }}>
                          {appointment.time}
                        </span>
                      </Stack>
                    </TableCell>
                    <TableCell>{appointment.duration} min</TableCell>
                    <TableCell>
                      <Chip
                        label={getStatusLabel(appointment.status)}
                        color={getStatusColor(appointment.status)}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell align="center">
                      {appointment.status === 'scheduled' && (
                        <Button
                          size="small"
                          color="error"
                          onClick={() => {
                            setSelectedAppointmentId(appointment.id);
                            setCancelDialogOpen(true);
                          }}
                        >
                          Cancel
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Alert severity="info">
            No appointments yet. <strong>Book your first appointment now!</strong>
          </Alert>
        )}
      </Box>

      {/* Cancel Appointment Dialog */}
      <Dialog open={cancelDialogOpen} onClose={() => setCancelDialogOpen(false)}>
        <DialogTitle>Cancel Appointment</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to cancel this appointment? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelDialogOpen(false)} disabled={canceling}>
            No, Keep It
          </Button>
          <Button
            onClick={handleCancelAppointment}
            color="error"
            variant="contained"
            disabled={canceling}
          >
            {canceling ? 'Canceling...' : 'Yes, Cancel Appointment'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PatientDashboardDB;
