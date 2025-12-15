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
  const { t } = useLanguage();
  const theme = useTheme();

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
    service: '',
    date: '',
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
      const response = await fetch('http://localhost:5000/api/booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        // Save appointment to localStorage so it appears in admin portal
        const appointments = JSON.parse(localStorage.getItem('patientAppointments') || '[]');
        const newAppointment = {
          id: Date.now(),
          patientName: formData.name,
          service: formData.service,
          date: formData.date,
          phone: formData.phone,
          message: formData.message,
          status: 'pending',
          createdAt: new Date().toISOString(),
        };
        appointments.push(newAppointment);
        localStorage.setItem('patientAppointments', JSON.stringify(appointments));

        setMessageType('success');
        setMessage(t('booking.success'));
        setFormData({ name: '', phone: '', service: '', date: '', message: '' });
      } else {
        setMessageType('error');
        setMessage(result.message || t('booking.error'));
      }
    } catch (error) {
      setMessageType('error');
      setMessage(t('booking.error'));
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
        <Alert severity={messageType} sx={{ mb: 3 }}>
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

      <Box sx={{ mt: 6, p: { xs: 2, sm: 3 }, bgcolor: 'background.paper', borderRadius: 2, border: '1px solid #e0e0e0' }}>
        <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
          📞 {t('contact.title') || 'Contact Us'}
        </Typography>
        <Typography variant="body2" paragraph sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
          {t('contact.title')}: <strong>{t('contact.phones')}</strong>
        </Typography>
        <Typography variant="body2" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
          {t('contact.title')}: <strong>{t('contact.whatsapp')}</strong>
        </Typography>
      </Box>
      </Container>
    </Box>
  );
};

export default Booking;
