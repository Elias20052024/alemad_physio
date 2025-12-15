import React from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Tooltip,
  useTheme,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { useLanguage } from '../context/LanguageContext';
import { keyframes } from '@emotion/react';

const Home = () => {
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
      transform: translateX(-50px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  `;

  const slideInRight = keyframes`
    from {
      opacity: 0;
      transform: translateX(50px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  `;

  const pulse = keyframes`
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.7;
    }
  `;

  const float = keyframes`
    0%, 100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-10px);
    }
  `;

  const slideInUp = keyframes`
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  `;

  const whatsappNumber = '962795702165'; // AL-Emad WhatsApp number
  const whatsappMessage = encodeURIComponent('Hello! I would like to inquire about your services.');
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  const services = [
    {
      title: t('departments.adult.title'),
      description: t('departments.adult.intro'),
      image: '/Services images/Adult Physiotherapy Department.png',
      color: '#1C6FB5',
      link: '/services',
    },
    {
      title: t('departments.pediatric.title'),
      description: t('departments.pediatric.intro'),
      image: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=300&h=200&fit=crop',
      color: '#CBDD71',
      link: '/services',
    },
    {
      title: t('departments.intensive.title'),
      description: t('departments.intensive.intro'),
      image: '/Services images/Intensive Physiotherapy Program.png',
      color: '#74C3E7',
      link: '/services',
    },
  ];

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      bgcolor: theme.palette.mode === 'dark' ? '#1a1a1a' : '#f8f9fa',
      background: theme.palette.mode === 'dark' 
        ? 'linear-gradient(135deg, #1a1a1a 0%, #2d3d4d 100%)'
        : 'linear-gradient(135deg, #f8f9fa 0%, #e8f4ff 100%)',
      backgroundAttachment: 'fixed',
    }}>
      <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1C6FB5 0%, #154A88 100%)',
          color: 'white',
          py: { xs: 8, md: 12 },
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          minHeight: { xs: '400px', md: '500px' },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(203, 221, 113, 0.15) 0%, transparent 60%)',
            pointerEvents: 'none',
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Typography 
            variant="h1" 
            gutterBottom 
            sx={{ 
              mb: 2, 
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              animation: `${fadeInUp} 0.8s ease`,
              fontWeight: 'bold',
              textShadow: '2px 2px 8px rgba(0, 0, 0, 0.2)',
              letterSpacing: '0.5px',
            }}
          >
            {t('hero.title')}
          </Typography>
          <Typography 
            variant="h5" 
            sx={{ 
              mb: 4, 
              opacity: 0.95, 
              fontSize: { xs: '1.1rem', md: '1.25rem' },
              animation: `${fadeInUp} 0.8s ease 0.2s both`,
              textShadow: '1px 1px 4px rgba(0, 0, 0, 0.15)',
              fontWeight: '500',
            }}
          >
            {t('hero.subtitle')}
          </Typography>
          <Button
            component={RouterLink}
            to="/booking"
            variant="contained"
            color="secondary"
            size="large"
            sx={{
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 600,
              animation: `${slideInUp} 0.8s ease 0.4s both`,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'scale(1.05)',
                boxShadow: '0 8px 20px rgba(0, 0, 0, 0.3)',
              },
            }}
          >
            {t('hero.cta')}
          </Button>
        </Container>
      </Box>

      {/* Services Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
        <Typography 
          variant="h2" 
          align="center" 
          sx={{ 
            mb: 6, 
            color: '#1C6FB5', 
            fontWeight: 'bold', 
            fontSize: { xs: '2rem', md: '3rem' },
            animation: `${fadeInUp} 0.8s ease`,
          }}
        >
          {t('services.title')}
        </Typography>
        <Grid container spacing={4}>
          {services.map((service, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s ease',
                  border: `3px solid ${service.color}`,
                  borderRadius: 2,
                  animation: `${fadeInUp} 0.6s ease ${index * 0.1}s both`,
                  '&:hover': {
                    transform: 'translateY(-12px)',
                    boxShadow: `0 16px 32px ${service.color}40`,
                    borderColor: service.color,
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="220"
                  image={service.image}
                  alt={service.title}
                  sx={{ borderBottom: `4px solid ${service.color}` }}
                />
                <CardContent sx={{ flex: 1 }}>
                  <Typography 
                    variant="h5" 
                    gutterBottom 
                    sx={{ color: service.color, fontWeight: 'bold' }}
                  >
                    {service.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ lineHeight: 1.6 }}>
                    {service.description}
                  </Typography>
                  <Button
                    component={RouterLink}
                    to={service.link}
                    variant="text"
                    sx={{
                      color: service.color,
                      fontWeight: 'bold',
                      mt: 2,
                      '&:hover': {
                        backgroundColor: `rgba(45, 137, 179, 0.1)`,
                      },
                    }}
                  >
                    Learn More →
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* About Preview */}
      <Box sx={{ bgcolor: 'background.paper', py: 8, minHeight: '400px', position: 'relative', overflow: 'hidden' }}>
        <Box
          sx={{
            position: 'absolute',
            top: -50,
            right: -50,
            width: 200,
            height: 200,
            borderRadius: '50%',
            backgroundColor: 'rgba(203, 221, 113, 0.1)',
          }}
        />
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Typography 
            variant="h2" 
            align="center" 
            sx={{ 
              mb: 4, 
              fontWeight: 700,
              animation: `${fadeInUp} 0.8s ease`,
            }}
          >
            {t('about.title')}
          </Typography>
          <Typography
            variant="body1"
            align="center"
            sx={{ 
              maxWidth: 800, 
              mx: 'auto', 
              mb: 4, 
              fontSize: '1.1rem',
              animation: `${fadeInUp} 0.8s ease 0.2s both`,
            }}
          >
            {t('about.content')}
          </Typography>
          <Box sx={{ textAlign: 'center' }}>
            <Button
              component={RouterLink}
              to="/about"
              variant="outlined"
              color="primary"
              size="large"
              sx={{
                animation: `${fadeInUp} 0.8s ease 0.4s both`,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: '0 6px 16px rgba(28, 111, 181, 0.2)',
                },
              }}
            >
              Learn More
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Booking CTA */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #CBDD71 0%, #A7D676 100%)',
          color: '#1C6FB5',
          py: 6,
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: -50,
            right: -50,
            width: 200,
            height: 200,
            borderRadius: '50%',
            backgroundColor: 'rgba(28, 111, 181, 0.05)',
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: -50,
            left: -50,
            width: 200,
            height: 200,
            borderRadius: '50%',
            backgroundColor: 'rgba(28, 111, 181, 0.05)',
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Typography 
            variant="h3" 
            gutterBottom
            sx={{
              fontWeight: 'bold',
              animation: `${slideInLeft} 0.8s ease`,
            }}
          >
            {t('general.ready')}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 2, flexWrap: 'wrap' }}>
            <Button
              component={RouterLink}
              to="/booking"
              variant="contained"
              color="primary"
              size="large"
              sx={{
                animation: `${slideInUp} 0.8s ease 0.1s both`,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: '0 8px 20px rgba(28, 111, 181, 0.3)',
                },
              }}
            >
              {t('general.bookNow')}
            </Button>
            <Button
              component="a"
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              variant="contained"
              sx={{
                bgcolor: '#25D366',
                color: 'white',
                animation: `${slideInUp} 0.8s ease 0.2s both`,
                transition: 'all 0.3s ease',
                '&:hover': {
                  bgcolor: '#20BA5A',
                  transform: 'scale(1.05)',
                  boxShadow: '0 8px 20px rgba(37, 211, 102, 0.3)',
                },
              }}
              size="large"
              startIcon={<WhatsAppIcon />}
            >
              {t('general.whatsapp')}
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Floating WhatsApp Button */}
      <Tooltip title={t('general.whatsapp')}>
        <IconButton
          component="a"
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            bgcolor: '#25D366',
            color: 'white',
            width: 60,
            height: 60,
            animation: `${float} 3s ease-in-out infinite`,
            boxShadow: '0 4px 12px rgba(37, 211, 102, 0.4)',
            '&:hover': {
              bgcolor: '#20BA5A',
              transform: 'scale(1.15)',
              boxShadow: '0 8px 20px rgba(37, 211, 102, 0.6)',
            },
            transition: 'all 0.3s ease',
            zIndex: 1000,
          }}
        >
          <WhatsAppIcon sx={{ fontSize: 32 }} />
        </IconButton>
      </Tooltip>
      </Box>
    </Box>
  );
};

export default Home;
