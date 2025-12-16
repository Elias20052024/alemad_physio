import React, { useEffect, useState } from 'react';
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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Stack,
} from '@mui/material';
import { Calendar, Clock, User, Phone } from 'lucide-react';
import { patientAPI, therapistAPI, appointmentAPI } from '@/services/api';

const AppointmentBookingForm = () => {
  const [step, setStep] = useState(1); // Step 1: Patient, Step 2: Therapist, Step 3: Slot, Step 4: Confirm
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Step 1: Patient Selection
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [newPatientOpen, setNewPatientOpen] = useState(false);
  const [newPatientData, setNewPatientData] = useState({
    fullName: '',
    phone: '',
    age: '',
    gender: 'Male',
  });

  // Step 2: Therapist Selection
  const [therapists, setTherapists] = useState([]);
  const [selectedTherapist, setSelectedTherapist] = useState(null);

  // Step 3: Slot Selection
  const [selectedDate, setSelectedDate] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Step 4: Confirmation
  const [serviceType, setServiceType] = useState('Physiotherapy');
  const [duration, setDuration] = useState(60);

  // Load initial data
  useEffect(() => {
    fetchPatients();
    fetchTherapists();
  }, []);

  const fetchPatients = async () => {
    try {
      const { data } = await patientAPI.getAll();
      setPatients(data);
    } catch (err) {
      console.error('Error fetching patients:', err);
      setError('Failed to load patients');
    }
  };

  const fetchTherapists = async () => {
    try {
      const { data } = await therapistAPI.getAll();
      setTherapists(data);
    } catch (err) {
      console.error('Error fetching therapists:', err);
      setError('Failed to load therapists');
    }
  };

  const fetchAvailableSlots = async () => {
    if (!selectedTherapist || !selectedDate) return;

    setLoadingSlots(true);
    try {
      const { data } = await appointmentAPI.getAvailableSlots(
        selectedTherapist.id,
        selectedDate,
        duration
      );
      setAvailableSlots(data.slots || []);
    } catch (err) {
      console.error('Error fetching slots:', err);
      setError('Failed to load available slots');
      setAvailableSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  // Fetch slots when therapist or date changes
  useEffect(() => {
    if (selectedDate && selectedTherapist) {
      fetchAvailableSlots();
    }
  }, [selectedDate, selectedTherapist, duration]);

  const handleCreatePatient = async () => {
    if (!newPatientData.fullName || !newPatientData.phone || !newPatientData.age) {
      setError('Please fill in all patient details');
      return;
    }

    try {
      const { data } = await patientAPI.create({
        ...newPatientData,
        age: parseInt(newPatientData.age),
      });
      setSelectedPatient(data);
      setPatients([...patients, data]);
      setNewPatientOpen(false);
      setNewPatientData({ fullName: '', phone: '', age: '', gender: 'Male' });
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create patient');
    }
  };

  const handleConfirmBooking = async () => {
    if (!selectedPatient || !selectedTherapist || !selectedDate || !selectedSlot) {
      setError('Please complete all steps');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const appointmentDateTime = new Date(`${selectedDate}T${selectedSlot}`);

      const { data } = await appointmentAPI.create({
        therapistId: selectedTherapist.id,
        patientId: selectedPatient.id,
        service: serviceType,
        date: appointmentDateTime.toISOString(),
        time: selectedSlot,
        duration: parseInt(duration),
        status: 'scheduled',
      });

      setSuccess(true);
      setError('');
      // Reset form after 2 seconds
      setTimeout(() => {
        setStep(1);
        setSuccess(false);
        setSelectedPatient(null);
        setSelectedTherapist(null);
        setSelectedDate('');
        setSelectedSlot('');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to book appointment');
    } finally {
      setLoading(false);
    }
  };

  // Step 1: Patient Selection
  const renderPatientStep = () => (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
        Step 1: Select Patient
      </Typography>

      <Stack spacing={2}>
        {patients.length > 0 && (
          <FormControl fullWidth>
            <InputLabel>Patient</InputLabel>
            <Select
              value={selectedPatient?.id || ''}
              onChange={(e) => {
                const patient = patients.find(p => p.id === e.target.value);
                setSelectedPatient(patient);
              }}
              label="Patient"
            >
              {patients.map(patient => (
                <MenuItem key={patient.id} value={patient.id}>
                  {patient.fullName} - {patient.phone}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        <Typography variant="body2" align="center">
          or
        </Typography>

        <Button
          variant="outlined"
          onClick={() => setNewPatientOpen(true)}
          sx={{ py: 1.5 }}
        >
          Create New Patient
        </Button>

        <Button
          variant="contained"
          onClick={() => setStep(2)}
          disabled={!selectedPatient}
          sx={{ mt: 2 }}
        >
          Next: Select Therapist
        </Button>
      </Stack>

      {/* Create Patient Dialog */}
      <Dialog open={newPatientOpen} onClose={() => setNewPatientOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Patient</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Stack spacing={2}>
            <TextField
              label="Full Name"
              fullWidth
              value={newPatientData.fullName}
              onChange={(e) => setNewPatientData({ ...newPatientData, fullName: e.target.value })}
            />
            <TextField
              label="Phone Number"
              fullWidth
              value={newPatientData.phone}
              onChange={(e) => setNewPatientData({ ...newPatientData, phone: e.target.value })}
            />
            <TextField
              label="Age"
              type="number"
              fullWidth
              value={newPatientData.age}
              onChange={(e) => setNewPatientData({ ...newPatientData, age: e.target.value })}
            />
            <FormControl fullWidth>
              <InputLabel>Gender</InputLabel>
              <Select
                value={newPatientData.gender}
                onChange={(e) => setNewPatientData({ ...newPatientData, gender: e.target.value })}
                label="Gender"
              >
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewPatientOpen(false)}>Cancel</Button>
          <Button onClick={handleCreatePatient} variant="contained">
            Create Patient
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );

  // Step 2: Therapist Selection
  const renderTherapistStep = () => (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
        Step 2: Select Therapist
      </Typography>

      <Stack spacing={2}>
        <Typography variant="body2" color="textSecondary">
          Selected Patient: <strong>{selectedPatient?.fullName}</strong>
        </Typography>

        <Grid container spacing={2}>
          {therapists.map(therapist => (
            <Grid item xs={12} sm={6} key={therapist.id}>
              <Card
                sx={{
                  cursor: 'pointer',
                  border: selectedTherapist?.id === therapist.id ? '2px solid #1976d2' : '1px solid #e0e0e0',
                  backgroundColor: selectedTherapist?.id === therapist.id ? '#f0f7ff' : 'inherit',
                  transition: 'all 0.3s',
                  '&:hover': { boxShadow: 3 },
                }}
                onClick={() => setSelectedTherapist(therapist)}
              >
                <CardContent>
                  <Typography variant="h6">{therapist.name}</Typography>
                  <Typography color="textSecondary">{therapist.specialty}</Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    📧 {therapist.email}
                  </Typography>
                  <Typography variant="body2">☎️ {therapist.phone}</Typography>
                  <Chip
                    label={therapist.status}
                    color={therapist.status === 'active' ? 'success' : 'error'}
                    size="small"
                    sx={{ mt: 1 }}
                  />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
          <Button variant="outlined" onClick={() => setStep(1)}>
            Back
          </Button>
          <Button
            variant="contained"
            onClick={() => setStep(3)}
            disabled={!selectedTherapist}
          >
            Next: Select Date & Time
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );

  // Step 3: Date & Slot Selection
  const renderSlotStep = () => (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
        Step 3: Select Date & Time
      </Typography>

      <Stack spacing={2}>
        <Box>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
            Patient: <strong>{selectedPatient?.fullName}</strong>
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Therapist: <strong>{selectedTherapist?.name}</strong>
          </Typography>
        </Box>

        <TextField
          label="Select Date"
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          inputProps={{ min: new Date().toISOString().split('T')[0] }}
          fullWidth
        />

        {loadingSlots ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
            <CircularProgress size={30} />
          </Box>
        ) : availableSlots.length > 0 ? (
          <Box>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
              Available Time Slots:
            </Typography>
            <Grid container spacing={1}>
              {availableSlots.map(slot => (
                <Grid item xs={6} sm={4} key={slot}>
                  <Chip
                    label={slot}
                    onClick={() => setSelectedSlot(slot)}
                    color={selectedSlot === slot ? 'primary' : 'default'}
                    variant={selectedSlot === slot ? 'filled' : 'outlined'}
                    icon={<Clock size={16} />}
                    sx={{ width: '100%' }}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        ) : selectedDate ? (
          <Alert severity="warning">No available slots for this date</Alert>
        ) : null}

        <FormControl fullWidth>
          <InputLabel>Service Type</InputLabel>
          <Select
            value={serviceType}
            onChange={(e) => setServiceType(e.target.value)}
            label="Service Type"
          >
            <MenuItem value="Physiotherapy">Physiotherapy</MenuItem>
            <MenuItem value="Sports Massage">Sports Massage</MenuItem>
            <MenuItem value="Manual Therapy">Manual Therapy</MenuItem>
            <MenuItem value="Rehabilitation">Rehabilitation</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>Duration (minutes)</InputLabel>
          <Select
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            label="Duration (minutes)"
          >
            <MenuItem value={30}>30 minutes</MenuItem>
            <MenuItem value={45}>45 minutes</MenuItem>
            <MenuItem value={60}>60 minutes</MenuItem>
            <MenuItem value={90}>90 minutes</MenuItem>
          </Select>
        </FormControl>

        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
          <Button variant="outlined" onClick={() => setStep(2)}>
            Back
          </Button>
          <Button
            variant="contained"
            onClick={() => setStep(4)}
            disabled={!selectedDate || !selectedSlot}
          >
            Next: Confirm Booking
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );

  // Step 4: Confirmation
  const renderConfirmStep = () => (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
        Step 4: Confirm Booking
      </Typography>

      <Card sx={{ mb: 3, backgroundColor: '#f5f5f5' }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Box>
                <Typography variant="body2" color="textSecondary">Patient</Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 2 }}>
                  {selectedPatient?.fullName}
                </Typography>

                <Typography variant="body2" color="textSecondary">Phone</Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 2 }}>
                  {selectedPatient?.phone}
                </Typography>

                <Typography variant="body2" color="textSecondary">Age</Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  {selectedPatient?.age}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Box>
                <Typography variant="body2" color="textSecondary">Therapist</Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 2 }}>
                  {selectedTherapist?.name}
                </Typography>

                <Typography variant="body2" color="textSecondary">Specialty</Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 2 }}>
                  {selectedTherapist?.specialty}
                </Typography>

                <Typography variant="body2" color="textSecondary">Service</Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  {serviceType}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Box>
                <Typography variant="body2" color="textSecondary">Date</Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 2 }}>
                  {new Date(selectedDate).toLocaleDateString()}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Box>
                <Typography variant="body2" color="textSecondary">Time</Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 2 }}>
                  {selectedSlot}
                </Typography>

                <Typography variant="body2" color="textSecondary">Duration</Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  {duration} minutes
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success">✅ Appointment booked successfully!</Alert>}

      <Stack direction="row" spacing={2}>
        <Button variant="outlined" onClick={() => setStep(3)} disabled={loading}>
          Back
        </Button>
        <Button
          variant="contained"
          onClick={handleConfirmBooking}
          disabled={loading}
          sx={{ flex: 1 }}
        >
          {loading ? <CircularProgress size={24} /> : 'Confirm Booking'}
        </Button>
      </Stack>
    </Paper>
  );

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', textAlign: 'center' }}>
        📅 Book an Appointment
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Grid container spacing={1}>
          {[1, 2, 3, 4].map(s => (
            <Grid item xs={3} key={s}>
              <Box
                sx={{
                  py: 1,
                  px: 2,
                  backgroundColor: step >= s ? '#1976d2' : '#e0e0e0',
                  color: step >= s ? 'white' : 'textSecondary',
                  borderRadius: 1,
                  textAlign: 'center',
                  fontWeight: 'bold',
                  fontSize: '0.875rem',
                }}
              >
                Step {s}
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>

      {error && step !== 4 && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {step === 1 && renderPatientStep()}
      {step === 2 && renderTherapistStep()}
      {step === 3 && renderSlotStep()}
      {step === 4 && renderConfirmStep()}
    </Container>
  );
};

export default AppointmentBookingForm;
