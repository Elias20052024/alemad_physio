import React from 'react';
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Link,
  Divider,
  useTheme,
} from '@mui/material';
import { Phone, WhatsApp, LocationOn, AccessTime } from '@mui/icons-material';
import { useLanguage } from '../context/LanguageContext';
import { keyframes } from '@emotion/react';

const Contact = () => {
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

  const slideInLeft = keyframes`
    from {
      opacity: 0;
      transform: translateX(-30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  `;

  // Extract contact information from translations
  const phones = ['+962 7 9570 2165', '+962 7 9552 0905'];
  const landline = t('contact.landline') || '+966 5 3133 8008';
  const location = t('contact.location') || 'Amman - Jordan';
  const whatsapp = t('contact.whatsapp') || '+962 7 9570 2165';

  const contactInfo = [
    {
      icon: <Phone sx={{ fontSize: 40, color: '#1C6FB5' }} />,
      title: 'Phone Numbers',
      value: phones,
      link: 'tel:+962795702165',
    },
    {
      icon: <WhatsApp sx={{ fontSize: 40, color: '#25D366' }} />,
      title: 'WhatsApp',
      value: whatsapp,
      link: `https://wa.me/962795702165?text=Hello%20AL-Emad%20Center`,
    },
    {
      icon: <LocationOn sx={{ fontSize: 40, color: '#74C3E7' }} />,
      title: 'Location',
      value: location,
      link: '#',
    },
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
      <Container maxWidth="lg">
        <Typography 
          variant="h2" 
          align="center" 
          sx={{ 
            mb: 2, 
            color: '#1C6FB5', 
            fontWeight: 'bold', 
            fontSize: { xs: '1.8rem', md: '2.5rem' },
            animation: `${fadeInUp} 0.8s ease`,
          }}
        >
          {t('contactPage.title')}
        </Typography>
        <Typography 
          variant="body1" 
          align="center" 
          sx={{ 
            mb: { xs: 4, md: 8 }, 
            fontSize: { xs: '1rem', md: '1.1rem' }, 
            color: '#666',
            animation: `${fadeInUp} 0.8s ease 0.2s both`,
          }}
        >
          {t('centerName')}
        </Typography>

        <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mb: { xs: 6, md: 8 } }}>
          {contactInfo.map((item, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  textAlign: 'center',
                  height: '100%',
                  transition: 'all 0.3s ease',
                  animation: `${fadeInUp} 0.6s ease ${index * 0.1}s both`,
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 24px rgba(28, 111, 181, 0.15)',
                  },
                  backgroundColor: theme.palette.mode === 'dark' ? '#2d3d4d' : '#ffffff',
                  border: `1px solid ${theme.palette.mode === 'dark' ? '#1C6FB5' : '#e0e0e0'}`,
                }}
              >
                <CardContent sx={{ py: { xs: 2.5, md: 4 } }}>
                  <Box sx={{ mb: 2 }}>
                    {React.cloneElement(item.icon, { sx: { fontSize: { xs: 32, md: 40 }, color: item.icon.props.sx.color } })}
                  </Box>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 2, fontSize: { xs: '1rem', md: '1.1rem' }, color: '#1C6FB5' }}>
                    {item.title}
                  </Typography>
                  {item.title === 'Phone Numbers' ? (
                    phones.map((phone, idx) => (
                      <Link
                        key={idx}
                        href={`tel:${phone.replace(/\s/g, '')}`}
                        sx={{ 
                          display: 'block',
                          mb: idx < phones.length - 1 ? 1 : 0,
                          color: '#1C6FB5', 
                          fontWeight: 500, 
                          wordBreak: 'break-word', 
                          fontSize: { xs: '0.9rem', md: '1rem' },
                          transition: 'all 0.3s ease',
                          textDecoration: 'none',
                          '&:hover': {
                            color: '#154A88',
                            textDecoration: 'underline',
                          },
                        }}
                      >
                        {phone}
                      </Link>
                    ))
                  ) : (
                    <Link
                      href={item.link}
                      target={item.link.startsWith('http') ? '_blank' : '_self'}
                      rel={item.link.startsWith('http') ? 'noopener noreferrer' : ''}
                      underline="hover"
                      sx={{ 
                        color: '#1C6FB5', 
                        fontWeight: 500, 
                        wordBreak: 'break-word', 
                        fontSize: { xs: '0.9rem', md: '1rem' },
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          color: '#154A88',
                          textDecoration: 'underline',
                        },
                      }}
                    >
                      {item.value}
                    </Link>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ my: { xs: 4, md: 6 } }} />

        {/* Additional Contact Details */}
        <Grid container spacing={{ xs: 2, md: 4 }} sx={{ mb: { xs: 6, md: 8 } }}>
          <Grid item xs={12} md={6}>
            <Card 
              sx={{ 
                p: { xs: 2, md: 3 }, 
                boxShadow: '0 4px 12px rgba(28, 111, 181, 0.1)', 
                height: '100%',
                backgroundColor: theme.palette.mode === 'dark' ? '#2d3d4d' : '#ffffff',
                animation: `${slideInLeft} 0.8s ease`,
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: '0 8px 20px rgba(28, 111, 181, 0.2)',
                },
              }}
            >
              <Typography variant="h5" sx={{ color: '#1C6FB5', fontWeight: 'bold', mb: 3, fontSize: { xs: '1.1rem', md: '1.25rem' } }}>
                📍 Location Map
              </Typography>
              <Box
                component="iframe"
                sx={{
                  width: '100%',
                  height: { xs: 300, md: 400 },
                  border: 'none',
                  borderRadius: 1,
                }}
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3354.8069365470426!2d35.8722784!3d32.0301009!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x151c9f61464cfd5d%3A0xd88e8108008fba7a!2sAL-Emad%20Center%20for%20Physiotherapy!5e0!3m2!1sen!2sjo!4v1670000000000"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card 
              sx={{ 
                p: { xs: 2, md: 3 }, 
                boxShadow: '0 4px 12px rgba(28, 111, 181, 0.1)',
                backgroundColor: theme.palette.mode === 'dark' ? '#2d3d4d' : '#ffffff',
                animation: `${fadeInUp} 0.8s ease`,
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: '0 8px 20px rgba(28, 111, 181, 0.2)',
                },
              }}
            >
              <Typography variant="h5" sx={{ color: '#1C6FB5', fontWeight: 'bold', mb: 3, fontSize: { xs: '1.1rem', md: '1.25rem' } }}>
                ⏰ Business Hours
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body1" sx={{ fontSize: { xs: '0.95rem', md: '1rem' }, color: theme.palette.mode === 'dark' ? '#e0e0e0' : '#333' }}>
                  <strong>Saturday - Thursday:</strong> 9:30 AM - 7:00 PM
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body1" sx={{ fontSize: { xs: '0.95rem', md: '1rem' }, color: theme.palette.mode === 'dark' ? '#e0e0e0' : '#333' }}>
                  <strong>Friday:</strong> Closed
                </Typography>
              </Box>
              
            </Card>
          </Grid>
        </Grid>

        {/* Quick Contact Card */}
        <Card 
          sx={{ 
            p: { xs: 2.5, md: 4 }, 
            bgcolor: theme.palette.mode === 'dark' ? '#2d3d4d' : 'linear-gradient(135deg, #f0f8ff 0%, #e8f4ff 100%)',
            border: `2px solid ${theme.palette.mode === 'dark' ? '#1C6FB5' : '#1C6FB5'}`, 
            borderRadius: 2,
            animation: `${fadeInUp} 0.8s ease 0.4s both`,
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: '0 8px 20px rgba(28, 111, 181, 0.2)',
              transform: 'translateY(-4px)',
            },
          }}
        >
          <Typography variant="h5" sx={{ color: '#1C6FB5', fontWeight: 'bold', mb: 2, fontSize: { xs: '1.1rem', md: '1.25rem' } }}>
            📞 {t('contactPage.quickContact')}
          </Typography>
          <Box sx={{ mb: 3 }}>
            <Typography variant="body1" sx={{ mb: 1, fontSize: { xs: '0.95rem', md: '1rem' }, color: theme.palette.mode === 'dark' ? '#e0e0e0' : '#333' }}>
              <strong>{t('contactPage.primaryNumbers')}</strong>
            </Typography>
            {phones.map((phone, idx) => (
              <Link
                key={idx}
                href={`tel:${phone.replace(/\s/g, '')}`}
                sx={{
                  display: 'block',
                  mb: 0.5,
                  color: '#1C6FB5',
                  fontWeight: 500,
                  fontSize: { xs: '0.9rem', md: '1rem' },
                  textDecoration: 'none',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    textDecoration: 'underline',
                    color: '#154A88',
                  },
                }}
              >
                {phone}
              </Link>
            ))}
          </Box>
          <Typography variant="body1" sx={{ mb: 3, fontSize: { xs: '0.95rem', md: '1rem' }, color: theme.palette.mode === 'dark' ? '#e0e0e0' : '#333' }}>
            <strong>{t('contactPage.landlineLabel')}</strong> 
            <Link
              href={`tel:${landline.replace(/\s/g, '')}`}
              sx={{
                display: 'block',
                mt: 0.5,
                color: '#1C6FB5',
                fontWeight: 500,
                fontSize: { xs: '0.9rem', md: '1rem' },
                textDecoration: 'none',
                transition: 'all 0.3s ease',
                '&:hover': {
                  textDecoration: 'underline',
                  color: '#154A88',
                },
              }}
            >
              {landline}
            </Link>
          </Typography>
          <Typography variant="body2" sx={{ color: theme.palette.mode === 'dark' ? '#b0b0b0' : '#666', fontSize: { xs: '0.85rem', md: '0.95rem' } }}>
            {t('contactPage.quickContactText')}
          </Typography>
        </Card>
      </Container>
    </Box>
  );
};

export default Contact;
