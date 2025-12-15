import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  CircularProgress,
  Box,
  Chip,
} from '@mui/material';
import { therapistService } from '@services/apiService.js';

const TherapistList = () => {
  const [therapists, setTherapists] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, md: 4 } }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold', fontSize: { xs: '1.5rem', md: '2rem' } }}>
        Our Therapists
      </Typography>

      <Grid container spacing={{ xs: 2, md: 3 }}>
        {therapists.map((therapist) => (
          <Grid item xs={12} sm={6} md={4} key={therapist.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1, p: { xs: 1.5, md: 2 } }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, fontSize: { xs: '1rem', md: '1.1rem' } }}>
                  {therapist.name}
                </Typography>
                <Chip
                  label={therapist.specialty}
                  color="primary"
                  size="small"
                  sx={{ mb: 2, fontSize: { xs: '0.75rem', md: '0.85rem' } }}
                />
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize: { xs: '0.85rem', md: '0.95rem' } }}>
                  <strong>Email:</strong> {therapist.email}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.85rem', md: '0.95rem' } }}>
                  <strong>Phone:</strong> {therapist.phone}
                </Typography>
              </CardContent>
              <CardActions sx={{ p: { xs: 1, md: 1.5 } }}>
                <Button
                  size="small"
                  variant="contained"
                  fullWidth
                  onClick={() => navigate(`/booking?therapistId=${therapist.id}`)}
                  sx={{ fontSize: { xs: '0.8rem', md: '0.875rem' } }}
                >
                  View Available Slots
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default TherapistList;
