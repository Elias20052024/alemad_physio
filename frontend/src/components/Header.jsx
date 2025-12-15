import React, { useState, useEffect } from 'react';
import {
  AppBar, Toolbar, Container, Box, Button, useMediaQuery, IconButton, Drawer, List, ListItem, ListItemText
} from '@mui/material';
import { useTheme as useMuiTheme } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import LanguageIcon from '@mui/icons-material/Language';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { keyframes } from '@emotion/react';

const Header = () => {
  const { isDark, toggleTheme } = useTheme();
  const { language, toggleLanguage } = useLanguage();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  const isSmallPhone = useMediaQuery(muiTheme.breakpoints.down('sm'));

  // Check if user is logged in
  useEffect(() => {
    const checkLoginStatus = () => {
      const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
      setIsLoggedIn(loggedIn);
    };

    checkLoginStatus();

    // Listen for storage changes from other tabs/windows
    window.addEventListener('storage', checkLoginStatus);
    
    // Also check when component mounts and on route changes
    const interval = setInterval(checkLoginStatus, 500);
    
    return () => {
      window.removeEventListener('storage', checkLoginStatus);
      clearInterval(interval);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    setIsLoggedIn(false);
    navigate('/');
    setMobileOpen(false);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: language === 'ar' ? 'الرئيسية' : 'Home', path: '/' },
    { label: language === 'ar' ? 'الخدمات' : 'Services', path: '/services' },
    { label: language === 'ar' ? 'حجز موعد' : 'Booking', path: '/booking' },
    { label: language === 'ar' ? 'عن مركزنا' : 'About', path: '/about' },
    { label: language === 'ar' ? 'تواصل معنا' : 'Contact', path: '/contact' },
  ];

  // Glow animation for logo
  const glow = keyframes`
    0%, 100% { filter: drop-shadow(0 0 0px rgba(203, 221, 113, 0)); }
    50% { filter: drop-shadow(0 0 8px rgba(203, 221, 113, 0.4)); }
  `;

  return (
    <AppBar 
      position="sticky" 
      elevation={isScrolled ? 6 : 0}
      sx={{
        backgroundColor: isScrolled ? (isDark ? '#0a0e27' : '#ffffff') : 'linear-gradient(135deg, #1C6FB5 0%, #154A88 100%)',
        color: isScrolled ? (isDark ? 'white' : 'text.primary') : 'white',
        transition: 'all 0.3s ease',
        backdropFilter: 'blur(10px)',
        borderBottom: isScrolled ? '1px solid rgba(203, 221, 113, 0.2)' : 'none',
        boxShadow: isScrolled 
          ? '0 4px 20px rgba(28, 111, 181, 0.15)' 
          : '0 2px 8px rgba(28, 111, 181, 0.1)',
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* Logo */}
            <Box
              component={RouterLink}
              to="/"
              sx={{
                display: 'flex',
                alignItems: 'center',
                textDecoration: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.08)',
                },
              }}
            >
              <Box
                component="img"
                src={language === 'ar' ? '/logo/logo.ar.png' : '/logo/logo.en.png'}
                alt="Alemad Physio"
                sx={{
                  height: { xs: 60, sm: 70, md: 80 },
                  width: 'auto',
                  maxWidth: { xs: 60, sm: 70, md: 80 },
                }}
              />
            </Box>
            
            {/* Brand Name */}
            <Button
              component={RouterLink}
              to="/"
              sx={{
                color: isScrolled ? (isDark ? 'white' : '#1C6FB5') : 'white',
                textDecoration: 'none',
                '&:hover': { opacity: 0.8 },
                padding: 0,
                minWidth: 'auto',
                fontWeight: 'bold',
                fontSize: '1.5rem',
              }}
            >
              
            </Button>
          </Box>

          {isMobile ? (
            <>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="end"
                onClick={handleDrawerToggle}
                sx={{ 
                  color: isScrolled ? (isDark ? 'white' : '#1C6FB5') : 'white',
                  padding: { xs: '8px', sm: '12px' },
                }}
              >
                <MenuIcon sx={{ fontSize: { xs: '1.5rem', sm: '1.75rem' } }} />
              </IconButton>
              <Drawer
                anchor="right"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{ keepMounted: true }}
                sx={{
                  '& .MuiDrawer-paper': {
                    boxSizing: 'border-box',
                    width: { xs: '100%', sm: 280 },
                    backgroundColor: isDark ? '#0a0e27' : '#ffffff',
                  },
                }}
              >
                <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center', p: { xs: 1.5, sm: 2 } }}>
                  <List sx={{ width: '100%' }}>
                    {navItems.map((item) => (
                      <ListItem button key={item.path} component={RouterLink} to={item.path} onClick={scrollToTop} sx={{ py: { xs: 1.5, sm: 2 } }}>
                        <ListItemText 
                          primary={item.label} 
                          sx={{ 
                            color: isDark ? 'white' : 'text.primary',
                            '& .MuiListItemText-primary': {
                              fontSize: { xs: '1rem', sm: '1.1rem' },
                            }
                          }} 
                        />
                      </ListItem>
                    ))}
                     <ListItem sx={{ py: 1 }}>
                      <Button
                        onClick={toggleLanguage}
                        fullWidth
                        variant="outlined"
                        startIcon={<LanguageIcon />}
                        sx={{ mt: 1, color: isDark ? 'white' : 'text.primary', py: 1 }}
                      >
                        {language === 'ar' ? 'English' : 'العربية'}
                      </Button>
                    </ListItem>
                    <ListItem sx={{ py: 1 }}>
                      <Button
                        onClick={toggleTheme}
                        fullWidth
                        variant="outlined"
                        startIcon={isDark ? <LightModeIcon /> : <DarkModeIcon />}
                        sx={{ mt: 1, color: isDark ? 'white' : 'text.primary', py: 1 }}
                      >
                        {isDark ? (language === 'ar' ? 'الوضع الفاتح' : 'Light Mode') : (language === 'ar' ? 'الوضع الداكن' : 'Dark Mode')}
                      </Button>
                    </ListItem>
                    <ListItem sx={{ py: 1 }}>
                      {isLoggedIn ? (
                        <>
                          <Button
                            onClick={() => {
                              const userRole = localStorage.getItem('userRole');
                              if (userRole === 'admin') navigate('/admin-portal');
                              else if (userRole === 'therapist') navigate('/therapist-portal');
                              else navigate('/patient-dashboard');
                              setMobileOpen(false);
                            }}
                            variant="contained"
                            fullWidth
                            sx={{ mt: 1, py: 1, backgroundColor: '#1C6FB5', mb: 1 }}
                          >
                            {language === 'ar' ? 'بوابتي' : 'My Portal'}
                          </Button>
                          <Button
                            onClick={handleLogout}
                            variant="contained"
                            color="error"
                            fullWidth
                            startIcon={<LogoutIcon />}
                            sx={{ py: 1 }}
                          >
                            {language === 'ar' ? 'تسجيل الخروج' : 'Logout'}
                          </Button>
                        </>
                      ) : (
                        <Button
                          component={RouterLink}
                          to="/login"
                          variant="contained"
                          fullWidth
                          startIcon={<LoginIcon />}
                          sx={{ mt: 1, py: 1, backgroundColor: '#1C6FB5' }}
                        >
                          {language === 'ar' ? 'دخول' : 'Login'}
                        </Button>
                      )}
                    </ListItem>
                  </List>
                </Box>
              </Drawer>
            </>
          ) : (
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              {navItems.map((item) => (
                <Button
                  key={item.path}
                  component={RouterLink}
                  to={item.path}
                  onClick={scrollToTop}
                  sx={{
                    fontSize: '0.95rem',
                    fontWeight: '500',
                    color: isScrolled ? (isDark ? '#CBDD71' : '#1C6FB5') : 'white',
                    textTransform: 'capitalize',
                    position: 'relative',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: -5,
                      left: 0,
                      width: 0,
                      height: 2,
                      backgroundColor: isScrolled ? (isDark ? '#CBDD71' : '#1C6FB5') : '#CBDD71',
                      transition: 'width 0.3s ease',
                    },
                    '&:hover::after': {
                      width: '100%',
                    },
                    '&:hover': {
                      backgroundColor: 'transparent',
                    },
                  }}
                >
                  {item.label}
                </Button>
              ))}

              <Box sx={{ display: 'flex', gap: 1.5, ml: 2, alignItems: 'center' }}>
                {isLoggedIn ? (
                  <>
                    <Button
                      onClick={() => {
                        const userRole = localStorage.getItem('userRole');
                        if (userRole === 'admin') navigate('/admin-portal');
                        else if (userRole === 'therapist') navigate('/therapist-portal');
                        else navigate('/patient-dashboard');
                      }}
                      variant="contained"
                      sx={{
                        background: 'linear-gradient(135deg, #1C6FB5 0%, #154A88 100%)',
                        color: 'white',
                        fontWeight: '700',
                        padding: '10px 24px',
                        borderRadius: '25px',
                        textTransform: 'capitalize',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        fontSize: '0.9rem',
                        boxShadow: '0 4px 15px rgba(28, 111, 181, 0.35)',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 8px 20px rgba(28, 111, 181, 0.5)',
                        },
                        '&:active': {
                          transform: 'translateY(0px)',
                        },
                      }}
                    >
                      {language === 'ar' ? 'بوابتي' : 'My Portal'}
                    </Button>
                    <Button
                      onClick={handleLogout}
                      variant="contained"
                      color="error"
                      startIcon={<LogoutIcon />}
                      sx={{
                        fontWeight: '700',
                        padding: '10px 22px',
                        borderRadius: '25px',
                        textTransform: 'capitalize',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        fontSize: '0.9rem',
                        boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 8px 20px rgba(239, 68, 68, 0.4)',
                        },
                        '&:active': {
                          transform: 'translateY(0px)',
                        },
                      }}
                    >
                      {language === 'ar' ? 'تسجيل الخروج' : 'Logout'}
                    </Button>
                  </>
                ) : (
                  <Button
                    component={RouterLink}
                    to="/login"
                    variant="contained"
                    startIcon={<LoginIcon />}
                    sx={{
                      background: 'linear-gradient(135deg, #CBDD71 0%, #B8CB5A 100%)',
                      color: '#1C6FB5',
                      fontWeight: '700',
                      padding: '10px 24px',
                      borderRadius: '25px',
                      textTransform: 'capitalize',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      fontSize: '0.9rem',
                      boxShadow: '0 4px 15px rgba(203, 221, 113, 0.35)',
                      position: 'relative',
                      overflow: 'hidden',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: '-100%',
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                        transition: 'left 0.5s ease',
                      },
                      '&:hover::before': {
                        left: '100%',
                      },
                      '&:hover': {
                        boxShadow: '0 8px 25px rgba(203, 221, 113, 0.5)',
                        transform: 'translateY(-2px)',
                      },
                      '&:active': {
                        transform: 'translateY(0px)',
                      },
                    }}
                  >
                    {language === 'ar' ? 'دخول' : 'Login'}
                  </Button>
                )}
                <Button
                  onClick={toggleLanguage}
                  startIcon={<LanguageIcon />}
                  sx={{
                    color: 'white',
                    fontWeight: '700',
                    fontSize: '0.9rem',
                    padding: '10px 18px',
                    borderRadius: '25px',
                    backgroundColor: isScrolled ? '#1C6FB5' : 'rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(10px)',
                    border: '2px solid rgba(255, 255, 255, 0.4)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    '&:hover': {
                      backgroundColor: '#CBDD71',
                      color: '#1C6FB5',
                      border: '2px solid #CBDD71',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 20px rgba(203, 221, 113, 0.35)',
                    },
                    '&:active': {
                      transform: 'translateY(0px)',
                    },
                  }}
                >
                  {language === 'ar' ? 'EN' : 'AR'}
                </Button>
                <IconButton
                  onClick={toggleTheme}
                  sx={{
                    color: 'white',
                    fontSize: '1.5rem',
                    padding: '10px',
                    borderRadius: '16px',
                    backgroundColor: isScrolled ? '#1C6FB5' : 'rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(10px)',
                    border: '2px solid rgba(255, 255, 255, 0.4)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    width: 44,
                    height: 44,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    '&:hover': {
                      backgroundColor: '#CBDD71',
                      border: '2px solid #CBDD71',
                      transform: 'rotate(20deg) scale(1.15)',
                      boxShadow: '0 8px 20px rgba(203, 221, 113, 0.35)',
                    },
                    '&:active': {
                      transform: 'rotate(20deg) scale(1)',
                    },
                  }}
                >
                  {isDark ? <LightModeIcon sx={{ fontSize: '1.5rem' }} /> : <DarkModeIcon sx={{ fontSize: '1.5rem' }} />}
                </IconButton>
              </Box>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
