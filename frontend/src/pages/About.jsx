import React from 'react';
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Divider,
  useTheme,
} from '@mui/material';
import { useLanguage } from '../context/LanguageContext';
import { keyframes } from '@emotion/react';

const About = () => {
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

  // Default team members data (can be replaced with API data)
  const teamMembers = [
    {
      id: 1,
      name: 'Professional Therapist 1',
      role: 'Senior Physiotherapist',
      image: 'https://via.placeholder.com/300x300?text=Therapist+1',
    },
    {
      id: 2,
      name: 'Professional Therapist 2',
      role: 'Rehabilitation Specialist',
      image: 'https://via.placeholder.com/300x300?text=Therapist+2',
    },
    {
      id: 3,
      name: 'Professional Therapist 3',
      role: 'Sports Medicine Expert',
      image: 'https://via.placeholder.com/300x300?text=Therapist+3',
    },
    {
      id: 4,
      name: 'Professional Therapist 4',
      role: 'Pediatric Therapist',
      image: 'https://via.placeholder.com/300x300?text=Therapist+4',
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
        {/* Center Name & Vision */}
        <Box sx={{ mb: { xs: 4, md: 6 }, textAlign: 'center', animation: `${fadeInUp} 0.8s ease` }}>
          <Typography variant="h2" sx={{ color: '#1C6FB5', fontWeight: 'bold', mb: 4, fontSize: { xs: '1.8rem', md: '2.5rem' } }}>
            {t('about.centerName')}
          </Typography>
        </Box>

        {/* Vision */}
        <Box sx={{ mb: { xs: 4, md: 6 }, p: { xs: 2, md: 3 }, backgroundColor: theme.palette.mode === 'dark' ? '#2d3d4d' : '#f5f5f5', borderRadius: 2, borderLeft: '5px solid #1C6FB5', animation: `${fadeInUp} 0.8s ease 0.2s both` }}>
          <Typography variant="h4" sx={{ color: '#1C6FB5', mb: 2, fontSize: { xs: '1.3rem', md: '1.5rem' } }}>
            Our Vision
          </Typography>
          <Typography variant="body1" sx={{ fontSize: { xs: '0.95rem', md: '1.1rem' }, lineHeight: 1.8, color: theme.palette.mode === 'dark' ? '#e0e0e0' : '#333' }}>
            {t('about.vision')}
          </Typography>
        </Box>

        {/* Values */}
        <Box sx={{ mb: { xs: 4, md: 6 }, animation: `${fadeInUp} 0.8s ease 0.4s both` }}>
          <Typography variant="h4" sx={{ color: '#1C6FB5', mb: 3, fontSize: { xs: '1.3rem', md: '1.5rem' } }}>
            Our Values & Principles
          </Typography>
          <Typography variant="body1" sx={{ fontSize: { xs: '0.95rem', md: '1rem' }, lineHeight: 1.8, color: theme.palette.mode === 'dark' ? '#e0e0e0' : '#333' }}>
            {t('about.values')}
          </Typography>
        </Box>

        <Divider sx={{ my: { xs: 4, md: 6 } }} />

        {/* Director Profile */}
        <Box sx={{ mb: { xs: 4, md: 6 }, animation: `${fadeInUp} 0.8s ease 0.6s both` }}>
          <Typography variant="h4" sx={{ color: '#1C6FB5', mb: 3, fontSize: { xs: '1.3rem', md: '1.5rem' } }}>
            {t('about.directorProfileHeading')}
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Card sx={{ boxShadow: 3, backgroundColor: theme.palette.mode === 'dark' ? '#2d3d4d' : '#ffffff' }}>
                <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                  <Typography variant="h5" sx={{ color: '#1C6FB5', fontWeight: 'bold', mb: 2, fontSize: { xs: '1.1rem', md: '1.25rem' } }}>
                    {t('about.directorName')}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 3, fontStyle: 'italic', color: theme.palette.mode === 'dark' ? '#999' : '#666', fontSize: { xs: '0.85rem', md: '0.95rem' } }}>
                    {t('about.directorPosition')}
                  </Typography>
                  
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mt: 3, mb: 2, fontSize: { xs: '1rem', md: '1.1rem' }, color: '#1C6FB5' }}>
                    {t('about.professionalBackground')}
                  </Typography>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" sx={{ mb: 1.5, fontSize: { xs: '0.85rem', md: '0.95rem' }, lineHeight: 1.6, color: theme.palette.mode === 'dark' ? '#e0e0e0' : '#333' }}>
                      <strong>Physiotherapy Specialist</strong> {t('about.bgPhysiotherapy')}
                    </Typography>
                    
                    <Typography variant="body2" sx={{ mb: 1.5, fontSize: { xs: '0.85rem', md: '0.95rem' }, lineHeight: 1.6, color: theme.palette.mode === 'dark' ? '#e0e0e0' : '#333' }}>
                      <strong>Former Lecturer</strong> {t('about.bgLecturer')}
                    </Typography>
                    
                    <Typography variant="body2" sx={{ mb: 1.5, fontSize: { xs: '0.85rem', md: '0.95rem' }, lineHeight: 1.6, color: theme.palette.mode === 'dark' ? '#e0e0e0' : '#333' }}>
                      {t('about.bgPioneer')}
                    </Typography>
                    
                    <Typography variant="body2" sx={{ mb: 1.5, fontSize: { xs: '0.85rem', md: '0.95rem' }, lineHeight: 1.6, color: theme.palette.mode === 'dark' ? '#e0e0e0' : '#333' }}>
                      {t('about.bgEIP')}
                    </Typography>
                    
                    <Typography variant="body2" sx={{ mb: 1.5, fontSize: { xs: '0.85rem', md: '0.95rem' }, lineHeight: 1.6, color: theme.palette.mode === 'dark' ? '#e0e0e0' : '#333' }}>
                      {t('about.bgCollaboration')}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ mb: { xs: 4, md: 6 }, animation: `${fadeInUp} 0.8s ease 0.8s both` }}>
          <Typography variant="h4" gutterBottom sx={{ fontSize: { xs: '1.3rem', md: '1.5rem' }, color: '#1C6FB5' }}>
            {t('about.team')}
          </Typography>
          <Typography variant="body1" paragraph sx={{ fontSize: { xs: '0.95rem', md: '1rem' }, lineHeight: 1.8, mb: 3, color: theme.palette.mode === 'dark' ? '#e0e0e0' : '#333' }}>
            {t('about.teamContent')}
          </Typography>
        </Box>

        <Box sx={{ mb: { xs: 4, md: 6 }, animation: `${fadeInUp} 0.8s ease 1s both` }}>
          <Typography variant="h4" gutterBottom sx={{ fontSize: { xs: '1.3rem', md: '1.5rem' }, color: '#1C6FB5' }}>
            {t('about.mission')}
          </Typography>
          <Typography variant="body1" paragraph sx={{ fontSize: { xs: '0.95rem', md: '1rem' }, lineHeight: 1.8, color: theme.palette.mode === 'dark' ? '#e0e0e0' : '#333' }}>
            {t('about.missionContent')}
          </Typography>
        </Box>

        <Box sx={{ p: { xs: 2, md: 3 }, backgroundColor: theme.palette.mode === 'dark' ? '#2d3d4d' : '#f5f5f5', borderRadius: 2, animation: `${fadeInUp} 0.8s ease 1.2s both` }}>
          <Typography variant="h4" gutterBottom sx={{ fontSize: { xs: '1.3rem', md: '1.5rem' }, color: '#1C6FB5' }}>
            {t('about.why')}
          </Typography>
          <Typography variant="body1" component="div" sx={{ fontSize: { xs: '0.95rem', md: '1rem' }, color: theme.palette.mode === 'dark' ? '#e0e0e0' : '#333' }}>
            <ul style={{ paddingLeft: 20 }}>
              {Array.isArray(t('about.whyList')) && t('about.whyList').map((item, i) => (
                <li key={i} style={{ marginBottom: '8px' }}>{item}</li>
              ))}
            </ul>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default About;
