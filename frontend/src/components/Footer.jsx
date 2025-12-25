import React from 'react';
import { Box, Container, Typography, Link, Grid, Divider } from '@mui/material';
import { Phone, WhatsApp, LocationOn, Facebook, Instagram } from '@mui/icons-material';
import { useLanguage } from '../context/LanguageContext';

const Footer = () => {
  const { t, language } = useLanguage();

  return (
    <Box
      sx={{
        bgcolor: '#1a1a1a',
        color: 'white',
        py: { xs: 4, md: 6 },
        mt: 8,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={{ xs: 3, md: 4 }} sx={{ mb: 4 }}>
          {/* About Section */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom sx={{ color: '#1C6FB5', fontWeight: 'bold', fontSize: { xs: '1rem', sm: '1.1rem' } }}>
              {t('centerName')}
            </Typography>
            <Typography variant="body2" sx={{ lineHeight: 1.8, mb: 2, fontSize: { xs: '0.875rem', sm: '1rem' } }}>
              {t('vision')}
            </Typography>
          </Grid>

          {/* Services Section */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom sx={{ color: '#1C6FB5', fontWeight: 'bold', fontSize: { xs: '1rem', sm: '1.1rem' } }}>
              {t('services.title')}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1, fontSize: { xs: '0.875rem', sm: '1rem' } }}>
              • {t('departments.adult.title')}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1, fontSize: { xs: '0.875rem', sm: '1rem' } }}>
              • {t('departments.pediatric.title')}
            </Typography>
            <Typography variant="body2" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
              • {t('departments.intensive.title')}
            </Typography>
          </Grid>

          {/* Contact Section */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom sx={{ color: '#1C6FB5', fontWeight: 'bold', fontSize: { xs: '1rem', sm: '1.1rem' } }}>
              {language === 'ar' ? 'تواصل معنا' : 'Contact Us'}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, minHeight: '32px' }}>
              <Phone sx={{ mr: 1, fontSize: { xs: 16, sm: 18 } }} />
              <Link href="tel:+962795520905" color="inherit" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' }, wordBreak: 'break-word' }}>
                +962 7 9570 2165
              </Link>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, minHeight: '32px' }}>
              <Phone sx={{ mr: 1, fontSize: { xs: 16, sm: 18 } }} />
              <Link href="tel:+962795552905" color="inherit" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' }, wordBreak: 'break-word' }}>
                +962 7 9552 0905
              </Link>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, minHeight: '32px' }}>
              <Phone sx={{ mr: 1, fontSize: { xs: 16, sm: 18 } }} />
              <Link href="tel:+96651338008" color="inherit" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' }, wordBreak: 'break-word' }}>
                06-2225228
              </Link>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, minHeight: '32px' }}>
              <WhatsApp sx={{ mr: 1, fontSize: { xs: 16, sm: 18 } }} />
              <Link href="https://wa.me/962795520905" color="inherit" target="_blank" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' }, wordBreak: 'break-word' }}>
                +962 7 9570 2165
              </Link>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', minHeight: '32px' }}>
              <LocationOn sx={{ mr: 1, fontSize: { xs: 16, sm: 18 }, mt: 0.3, flexShrink: 0 }} />
              <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                {t('contact.location')}
              </Typography>
            </Box>
          </Grid>

          {/* Quick Links Section */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom sx={{ color: '#1C6FB5', fontWeight: 'bold', fontSize: { xs: '1rem', sm: '1.1rem' } }}>
              {language === 'ar' ? 'روابط سريعة' : 'Quick Links'}
            </Typography>
            <Link href="/" color="inherit" sx={{ display: 'block', mb: 1, fontSize: { xs: '0.875rem', sm: '1rem' }, '&:hover': { color: '#1C6FB5' } }}>
              {language === 'ar' ? 'الرئيسية' : 'Home'}
            </Link>
            <Link href="/about" color="inherit" sx={{ display: 'block', mb: 1, fontSize: { xs: '0.875rem', sm: '1rem' }, '&:hover': { color: '#1C6FB5' } }}>
              {language === 'ar' ? 'عن مركزنا' : 'About'}
            </Link>
            <Link href="/services" color="inherit" sx={{ display: 'block', mb: 1, fontSize: { xs: '0.875rem', sm: '1rem' }, '&:hover': { color: '#1C6FB5' } }}>
              {language === 'ar' ? 'الخدمات' : 'Services'}
            </Link>
            <Link href="/contact" color="inherit" sx={{ display: 'block', fontSize: { xs: '0.875rem', sm: '1rem' }, '&:hover': { color: '#1C6FB5' } }}>
              {language === 'ar' ? 'تواصل معنا' : 'Contact'}
            </Link>
          </Grid>
        </Grid>

        <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)', my: 3 }} />

        {/* Social Media Section */}
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ color: '#1C6FB5', fontWeight: 'bold', fontSize: { xs: '1rem', sm: '1.1rem' } }}>
            {language === 'ar' ? 'تابعنا على وسائل التواصل' : 'Follow Us'}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Link 
              href={t('contact.facebook')} 
              target="_blank" 
              rel="noopener noreferrer"
              sx={{ color: 'white', '&:hover': { color: '#1C6FB5' } }}
            >
              <Facebook sx={{ fontSize: { xs: 24, sm: 28 } }} />
            </Link>
            <Link 
              href={t('contact.instagram')} 
              target="_blank" 
              rel="noopener noreferrer"
              sx={{ color: 'white', '&:hover': { color: '#1C6FB5' } }}
            >
              <Instagram sx={{ fontSize: { xs: 24, sm: 28 } }} />
            </Link>
          </Box>
        </Box>

        <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)', my: 3 }} />

        {/* Copyright Section */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" sx={{ mb: 1, fontSize: { xs: '0.75rem', sm: '1rem' } }}>
            {t('footer.copyright')}
          </Typography>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', fontSize: { xs: '0.7rem', sm: '0.875rem' } }}>
            {language === 'ar' ? 'جميع الحقوق محفوظة © 2025' : 'All Rights Reserved © 2025'}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
