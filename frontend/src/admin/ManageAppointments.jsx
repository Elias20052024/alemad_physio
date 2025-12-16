import React, { useEffect, useState } from 'react';
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box,
  CircularProgress,
  Chip,
  IconButton,
  Tooltip,
  Typography,
  TextField,
  Grid,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Alert,
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { appointmentAPI, patientAPI, therapistAPI } from '@/services/api';

const ManageAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [patients, setPatients] = useState([]);
  const [therapists, setTherapists] = useState([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [editData, setEditData] = useState({});
  const [filters, setFilters] = useState({
    status: '',
    therapistId: '',
    patientId: '',
    date: '',
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [filters]);

  const fetchInitialData = async () => {
    try {
      const [patientsRes, therapistsRes] = await Promise.all([
        patientAPI.getAll(),
        therapistAPI.getAll(),
      ]);
      setPatients(patientsRes.data);
      setTherapists(therapistsRes.data);
      fetchAppointments();
    } catch (error) {
      console.error('Error fetching initial data:', error);
    }
  };

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const { data } = await appointmentAPI.getAll({
        status: filters.status || undefined,
        therapistId: filters.therapistId || undefined,
        patientId: filters.patientId || undefined,
        date: filters.date || undefined,
      });
      setAppointments(data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (appointment) => {
    setSelectedAppointment(appointment);
    setEditData({
      ...appointment,
      date: new Date(appointment.date).toISOString().split('T')[0],
    });
    setEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    try {
      const appointmentDateTime = new Date(`${editData.date}T${editData.time}`);
      await appointmentAPI.update(selectedAppointment.id, {
        ...editData,
        date: appointmentDateTime.toISOString(),
      });
      setEditDialogOpen(false);
      await fetchAppointments();
    } catch (error) {
      console.error('Error updating appointment:', error);
      alert('Failed to update appointment');
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await appointmentAPI.updateStatus(id, newStatus);
      await fetchAppointments();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      try {
        await appointmentAPI.delete(id);
        await fetchAppointments();
      } catch (error) {
        console.error('Error deleting appointment:', error);
        alert('Failed to delete appointment');
      }
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

  const getPatientName = (patientId) => {
    const patient = patients.find(p => p.id === patientId);
    return patient?.fullName || 'Unknown';
  };

  const getTherapistName = (therapistId) => {
    const therapist = therapists.find(t => t.id === therapistId);
    return therapist?.name || 'Unknown';
  };

  if (loading && appointments.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
        📅 Manage Appointments
      </Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Filter by Status"
            select
            SelectProps={{ native: true }}
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="">All</option>
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Filter by Date"
            type="date"
            value={filters.date}
            onChange={(e) => setFilters({ ...filters, date: e.target.value })}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
      </Grid>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Patient</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Therapist</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Service</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Date & Time</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }} align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {appointments.map((appointment) => (
              <TableRow key={appointment.id} hover>
                <TableCell>{appointment.patient.fullName}</TableCell>
                <TableCell>{appointment.therapist.name}</TableCell>
                <TableCell>{appointment.service}</TableCell>
                <TableCell>
                  {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                </TableCell>
                <TableCell>
                  <Select
                    value={appointment.status}
                    onChange={(e) => handleStatusChange(appointment.id, e.target.value)}
                    size="small"
                    sx={{ minWidth: 120 }}
                  >
                    <MenuItem value="scheduled">Scheduled</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                    <MenuItem value="cancelled">Cancelled</MenuItem>
                  </Select>
                </TableCell>
                <TableCell align="center">
                  <Tooltip title="Delete">
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDelete(appointment.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default ManageAppointments;
