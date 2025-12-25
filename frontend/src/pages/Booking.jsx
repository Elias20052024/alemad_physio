import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  useTheme,
} from '@mui/material';
import { useLanguage } from '../context/LanguageContext';
import { keyframes } from '@emotion/react';

const Booking = () => {
  const { t, language } = useLanguage();
  const theme = useTheme();

  console.log('✅ Booking component loaded successfully');

  // Animation keyframes
  const fadeInUp = keyframes`
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  `;

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    service: '',
    date: '',
    time: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      
      // Call the booking API - it handles patient creation, appointment creation, and notification
      const bookingRes = await fetch(`${API_BASE_URL}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          age: formData.age,
          service: formData.service,
          date: formData.date,
          time: formData.time,
          message: formData.message,
        }),
      });

      const bookingData = await bookingRes.json();
      if (!bookingRes.ok) {
        throw new Error(bookingData.message || 'Failed to create booking');
      }

      setMessageType('success');
      setMessage(t('booking.success') || 'Booking successful! Admin will review and contact you soon.');
      setFormData({ name: '', phone: '', email: '', age: '', service: '', date: '', time: '', message: '' });
    } catch (error) {
      setMessageType('error');
      setMessage(error.message || t('booking.error') || 'Error booking appointment');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const services = [
    t('services.physiotherapy'),
    t('services.massage'),
    t('services.rehabilitation'),
    t('services.sports'),
  ];

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      py: { xs: 4, md: 8 },
      bgcolor: theme.palette.mode === 'dark' ? '#1a1a1a' : '#f8f9fa',
      background: theme.palette.mode === 'dark' 
        ? 'linear-gradient(135deg, #1a1a1a 0%, #2d3d4d 100%)'
        : 'linear-gradient(135deg, #f8f9fa 0%, #e8f4ff 100%)',
      backgroundAttachment: 'fixed',
    }}>
      <Container maxWidth="sm" sx={{ px: { xs: 1.5, sm: 2 } }}>
        <Typography variant="h2" align="center" gutterBottom sx={{ mb: 4, fontSize: { xs: '1.8rem', md: '2.5rem' }, color: '#1C6FB5', animation: `${fadeInUp} 0.8s ease` }}>
          {t('booking.title')}
        </Typography>

      {message && (
        <Alert 
          severity={messageType} 
          sx={{ mb: 2, animation: `${fadeInUp} 0.5s ease-out` }}
          onClose={() => setMessage('')}
        >
          {message}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 1.5, sm: 2 } }}>
        <TextField
          label={t('booking.name')}
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          required
          fullWidth
          variant="outlined"
          size="small"
        />

        <TextField
          label={t('booking.phone')}
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          required
          fullWidth
          variant="outlined"
          type="tel"
          size="small"
        />

        <TextField
          label={t('booking.email')}
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          fullWidth
          variant="outlined"
          type="email"
          size="small"
          placeholder="Optional"
          helperText="Optional - for appointment confirmations"
        />

        <TextField
          label={language === 'ar' ? 'العمر' : 'Age'}
          name="age"
          value={formData.age || ''}
          onChange={handleInputChange}
          fullWidth
          variant="outlined"
          type="number"
          size="small"
          inputProps={{ min: '1', max: '150' }}
        />

        <FormControl fullWidth required size="small">
          <InputLabel>{t('booking.service')}</InputLabel>
          <Select
            name="service"
            value={formData.service}
            onChange={handleInputChange}
            label={t('booking.service')}
          >
            <MenuItem value="">
              <em>{t('general.select')}</em>
            </MenuItem>
            {services.map((service, index) => (
              <MenuItem key={index} value={service}>
                {service}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label={t('booking.date')}
          name="date"
          value={formData.date}
          onChange={handleInputChange}
          required
          fullWidth
          type="date"
          InputLabelProps={{ shrink: true }}
          variant="outlined"
          size="small"
        />

        <TextField
          label={t('booking.time')}
          name="time"
          value={formData.time}
          onChange={handleInputChange}
          required
          fullWidth
          type="time"
          InputLabelProps={{ shrink: true }}
          variant="outlined"
          size="small"
        />

        <TextField
          label={t('booking.message')}
          name="message"
          value={formData.message}
          onChange={handleInputChange}
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          size="small"
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          size="large"
          disabled={loading}
          fullWidth
          sx={{ py: { xs: 1.2, sm: 1.5 }, fontSize: { xs: '0.9rem', sm: '1rem' } }}
        >
          {loading ? t('booking.loading') || 'Submitting...' : t('booking.submit')}
        </Button>
      </Box>

      </Container>
    </Box>
  );
};

export default Booking;
