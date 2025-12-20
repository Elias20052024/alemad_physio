import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Box,
  Typography,
  Grid,
  CircularProgress,
  Alert,
  Card,
  CardContent,
} from '@mui/material';
import { useLanguage } from '../context/LanguageContext';
import { appointmentService, patientService, therapistService } from '@services/apiService.js';

const BookingPage = () => {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const [patients, setPatients] = useState([]);
  const [therapists, setTherapists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    patientId: '',
    therapistId: '',
    service: '',
    date: '',
    time: '',
    patientName: '',
    patientPhone: '',
    patientAge: '',
    patientGender: '',
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      try {
        const patientsRes = await patientService.getAllPatients();
        console.log('Patients response:', patientsRes);
        setPatients(patientsRes.data || patientsRes || []);
      } catch (error) {
        console.warn('Could not load patients:', error.message);
        setPatients([]); // Continue without patients
      }

      try {
        const therapistsRes = await therapistService.getAllTherapists();
        console.log('Therapists response:', therapistsRes);
        setTherapists(therapistsRes.data || therapistsRes || []);
      } catch (error) {
        console.warn('Could not load therapists:', error.message);
        setTherapists([]); // Continue without therapists
      }
    } catch (error) {
      setError('Error loading data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      let patientId = formData.patientId;

      // Create new patient if needed
      if (!patientId && formData.patientName) {
        const newPatientRes = await patientService.createPatient({
          fullName: formData.patientName,
          phone: formData.patientPhone,
          age: parseInt(formData.patientAge),
          gender: formData.patientGender,
        });
        patientId = newPatientRes.data.patient.id;
      }

      if (!patientId) {
        setError('Please select or create a patient');
        setSubmitting(false);
        return;
      }

      if (!formData.therapistId) {
        setError('Please select a therapist');
        setSubmitting(false);
        return;
      }

      await appointmentService.createAppointment({
        patientId: parseInt(patientId),
        therapistId: parseInt(formData.therapistId),
        service: formData.service,
        appointmentDate: formData.date,
        startTime: formData.time,
        endTime: formData.time,
        isFromBookingForm: true,
      });

      setSuccess(true);
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error booking appointment');
    } finally {
      setSubmitting(false);
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
    <Container maxWidth="sm" sx={{ py: { xs: 3, md: 4 }, px: { xs: 1.5, sm: 2 } }}>
      <Paper elevation={3} sx={{ p: { xs: 2.5, sm: 4 } }}>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', fontSize: { xs: '1.5rem', sm: '2rem' } }}>
          {t('booking.title') || 'Book an Appointment'}
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{t('booking.success') || 'Appointment booked successfully! Redirecting...'}</Alert>}

        <form onSubmit={handleBookAppointment}>
          <Grid container spacing={{ xs: 1.5, sm: 2 }}>
            <Grid item xs={12} md={6}>
              <TextField
                id="therapist-select"
                fullWidth
                label={t('booking.therapist') || 'Therapist Name'}
                select
                SelectProps={{ native: true }}
                value={formData.therapistId}
                onChange={(e) => setFormData({ ...formData, therapistId: e.target.value })}
                required
                disabled={submitting}
                variant="outlined"
                size="small"
              >
                <option value="">{t('booking.selectTherapist') || 'Select Therapist'}</option>
                {therapists && therapists.length > 0 ? (
                  therapists.map((th) => (
                    <option key={th.id} value={th.id}>{th.name || 'Unnamed'}</option>
                  ))
                ) : (
                  <option disabled>No therapists available</option>
                )}
              </TextField>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                id="service-input"
                fullWidth
                label={t('booking.service') || 'Service'}
                value={formData.service}
                onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                required
                disabled={submitting}
                variant="outlined"
                size="small"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                id="date-input"
                fullWidth
                label={t('booking.date') || 'Date'}
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                InputLabelProps={{ shrink: true }}
                required
                disabled={submitting}
                variant="outlined"
                size="small"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                id="time-input"
                fullWidth
                label={t('booking.time') || 'Time'}
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                InputLabelProps={{ shrink: true }}
                required
                disabled={submitting}
                variant="outlined"
                size="small"
              />
            </Grid>            <Grid item xs={12}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 1, mb: 1.5, fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                {t('booking.patientInfo') || 'Patient Information'}
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                id="patient-select"
                fullWidth
                label={t('booking.existingPatient') || 'Existing Patient'}
                select
                SelectProps={{ native: true }}
                value={formData.patientId}
                onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                disabled={submitting}
              >
                <option value="">{t('booking.selectPatient') || 'Select existing patient or create new'}</option>
                {patients && patients.length > 0 ? (
                  patients.map((p) => (
                    <option key={p.id} value={p.id}>{p.fullName || 'Unnamed'}</option>
                  ))
                ) : (
                  <option disabled>No patients available</option>
                )}
              </TextField>
            </Grid>

            {!formData.patientId && (
              <>
                <Grid item xs={12} md={6}>
                  <TextField
                    id="fullname-input"
                    fullWidth
                    label={t('booking.fullName') || 'Full Name'}
                    value={formData.patientName}
                    onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                    required
                    disabled={submitting}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    id="phone-input"
                    fullWidth
                    label={t('booking.phone') || 'Phone'}
                    value={formData.patientPhone}
                    onChange={(e) => setFormData({ ...formData, patientPhone: e.target.value })}
                    required
                    disabled={submitting}
                  />
                </Grid>

                <Grid item xs={12} md={3}>
                  <TextField
                    id="age-input"
                    fullWidth
                    label={t('booking.age') || 'Age'}
                    type="number"
                    value={formData.patientAge}
                    onChange={(e) => setFormData({ ...formData, patientAge: e.target.value })}
                    required
                    disabled={submitting}
                  />
                </Grid>

                <Grid item xs={12} md={3}>
                  <TextField
                    id="gender-select"
                    fullWidth
                    label={t('booking.gender') || 'Gender'}
                    select
                    SelectProps={{ native: true }}
                    value={formData.patientGender}
                    onChange={(e) => setFormData({ ...formData, patientGender: e.target.value })}
                    required
                    disabled={submitting}
                  >
                    <option value="">{t('general.select') || 'Select'}</option>
                    <option value="Male">{t('booking.male') || 'Male'}</option>
                    <option value="Female">{t('booking.female') || 'Female'}</option>
                    <option value="Other">{t('booking.other') || 'Other'}</option>
                  </TextField>
                </Grid>
              </>
            )}

            <Grid item xs={12}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                size="large"
                type="submit"
                disabled={submitting || !formData.date || !formData.therapistId}
                sx={{ py: { xs: 1.5, sm: 2 } }}
              >
                {submitting ? <CircularProgress size={24} /> : t('booking.submit') || 'Book Appointment'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default BookingPage;
