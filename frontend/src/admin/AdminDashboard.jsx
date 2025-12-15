import React, { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Box,
} from '@mui/material';
import { adminService } from '@services/apiService.js';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const admin = JSON.parse(localStorage.getItem('admin') || '{}');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await adminService.getStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  const StatCard = ({ label, value, color }) => (
    <Card sx={{ backgroundColor: color, color: 'white' }}>
      <CardContent>
        <Typography color="inherit" sx={{ fontSize: 14 }} gutterBottom>
          {label}
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          {value || 0}
        </Typography>
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>
        Welcome, {admin.name}!
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            label="Total Therapists"
            value={stats?.totalTherapists}
            color="#2D89B3"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            label="Total Patients"
            value={stats?.totalPatients}
            color="#A7D676"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            label="Appointments Today"
            value={stats?.appointmentsToday}
            color="#ff9800"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            label="Upcoming Appointments"
            value={stats?.upcomingAppointments}
            color="#4caf50"
          />
        </Grid>
      </Grid>

      <Paper sx={{ p: 3, mt: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          Quick Stats
        </Typography>
        <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
          Use the navigation menu to manage therapists, patients, and appointments.
        </Typography>
      </Paper>
    </Container>
  );
};

export default AdminDashboard;
