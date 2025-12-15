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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Box,
  IconButton,
  Tooltip,
  Typography,
  Snackbar,
  Alert,
  Select,
  MenuItem,
  Chip,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { therapistService } from '@services/apiService.js';

const ManageTherapists = () => {
  const [therapists, setTherapists] = useState([]);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    fetchTherapists();
  }, []);

  const fetchTherapists = async () => {
    try {
      const response = await therapistService.getAllTherapists();
      setTherapists(response.data);
    } catch (error) {
      console.error('Error fetching therapists:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (therapist = null) => {
    if (therapist) {
      setEditingId(therapist.id);
      setFormData({
        name: therapist.name,
        specialty: therapist.specialty,
        email: therapist.email,
        phone: therapist.phone,
      });
    } else {
      setEditingId(null);
      setFormData({ name: '', specialty: '', email: '', phone: '' });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingId(null);
    setFormData({ name: '', specialty: '', email: '', phone: '' });
  };

  const handleSave = async () => {
    try {
      if (editingId) {
        await therapistService.updateTherapist(editingId, formData);
        setSnackbar({
          open: true,
          message: 'Therapist updated successfully!',
          severity: 'success',
        });
      } else {
        await therapistService.createTherapist(formData);
        setSnackbar({
          open: true,
          message: 'Therapist added successfully!',
          severity: 'success',
        });
      }
      await fetchTherapists();
      handleCloseDialog();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'An error occurred. Please try again.';
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error',
      });
      console.error('Error saving therapist:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this therapist?')) {
      try {
        await therapistService.deleteTherapist(id);
        setSnackbar({
          open: true,
          message: 'Therapist deleted successfully!',
          severity: 'success',
        });
        await fetchTherapists();
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'An error occurred. Please try again.';
        setSnackbar({
          open: true,
          message: errorMessage,
          severity: 'error',
        });
        console.error('Error deleting therapist:', error);
      }
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await therapistService.updateTherapist(id, { status: newStatus });
      setSnackbar({
        open: true,
        message: `Therapist status changed to ${newStatus}!`,
        severity: 'success',
      });
      await fetchTherapists();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update status';
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error',
      });
      console.error('Error updating status:', error);
    }
  };

  const getStatusColor = (status) => {
    return status === 'active' ? 'success' : 'error';
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          Manage Therapists
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Therapist
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Specialty</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Phone</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }} align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {therapists.map((therapist) => (
              <TableRow key={therapist.id} hover>
                <TableCell>{therapist.name}</TableCell>
                <TableCell>{therapist.specialty}</TableCell>
                <TableCell>{therapist.email}</TableCell>
                <TableCell>{therapist.phone}</TableCell>
                <TableCell>
                  <Select
                    value={therapist.status || 'active'}
                    onChange={(e) => handleStatusChange(therapist.id, e.target.value)}
                    size="small"
                    sx={{ minWidth: 100 }}
                  >
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                  </Select>
                </TableCell>
                <TableCell align="center">
                  <Tooltip title="Edit">
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => handleOpenDialog(therapist)}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDelete(therapist.id)}
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

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingId ? 'Edit Therapist' : 'Add New Therapist'}
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            fullWidth
            label="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Specialty"
            value={formData.specialty}
            onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            margin="normal"
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">
            {editingId ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ManageTherapists;
