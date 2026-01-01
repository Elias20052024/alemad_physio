import React, { useState } from 'react';
import { Container, Box, TextField, Button, Typography, Card, Tab, Tabs, Alert, CircularProgress, InputAdornment, IconButton, LinearProgress, Divider, useTheme as useMuiTheme } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import DarkModeToggle from '../components/DarkModeToggle';
import ModernLoginButton from '../components/ModernLoginButton';
import { patientAPI } from '../services/api';
import { adminService, therapistService } from '../services/apiService';

const Login = () => {
  const { t, language } = useLanguage();
  const { isDark, toggleTheme } = useTheme();
  const muiTheme = useMuiTheme();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordMatchError, setPasswordMatchError] = useState('');
  const [loading, setLoading] = useState(false);

  // Email validation
  const validateEmail = (emailValue) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailValue);
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    if (value && !validateEmail(value)) {
      setEmailError(language === 'ar' ? 'البريد الإلكتروني غير صحيح' : 'Invalid email address');
    } else {
      setEmailError('');
    }
  };

  // Password strength calculation
  const calculatePasswordStrength = (pwd) => {
    let strength = 0;
    if (!pwd) return 0;
    if (pwd.length >= 8) strength += 25;
    if (pwd.length >= 12) strength += 25;
    if (/[a-z]/.test(pwd)) strength += 12.5;
    if (/[A-Z]/.test(pwd)) strength += 12.5;
    if (/[0-9]/.test(pwd)) strength += 12.5;
    if (/[^a-zA-Z0-9]/.test(pwd)) strength += 12.5;
    return Math.min(strength, 100);
  };

  const getPasswordStrengthColor = (strength) => {
    if (strength < 40) return 'error';
    if (strength < 70) return 'warning';
    return 'success';
  };

  const passwordStrength = calculatePasswordStrength(password);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setError('');
    setEmailError('');
    setPasswordMatchError('');
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setPhone('');
    setAge('');
    setGender('');
    setIsSignUp(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Patient signup
      if (tabValue === 0 && isSignUp) {
        // Sign Up validation
        if (!name || !email || !password || !confirmPassword || !phone || !age || !gender) {
          setError(language === 'ar' ? 'يرجى ملء جميع الحقول' : 'Please fill all fields');
          setLoading(false);
          return;
        }

        if (password !== confirmPassword) {
          setPasswordMatchError(language === 'ar' ? 'كلمات المرور غير متطابقة' : 'Passwords do not match');
          setLoading(false);
          return;
        }

        if (!validateEmail(email)) {
          setEmailError(language === 'ar' ? 'البريد الإلكتروني غير صحيح' : 'Invalid email address');
          setLoading(false);
          return;
        }

        if (passwordStrength < 40) {
          setError(language === 'ar' ? 'كلمة المرور ضعيفة جداً. استخدم أحرفاً كبيرة وصغيرة وأرقام' : 'Password is too weak. Use uppercase, lowercase, and numbers');
          setLoading(false);
          return;
        }

        if (!/^[0-9+\-\s()]{7,}$/.test(phone.replace(/\s/g, ''))) {
          setError(language === 'ar' ? 'رقم الهاتف غير صحيح' : 'Invalid phone number');
          setLoading(false);
          return;
        }

        try {
          // Call API to register patient
          const { data } = await patientAPI.register(name, email, password, phone, age, gender);
          
          // Store token and patient info
          localStorage.setItem('token', data.token);
          localStorage.setItem('userRole', 'patient');
          localStorage.setItem('patientId', data.patient.id);
          localStorage.setItem('userName', data.patient.fullName);
          localStorage.setItem('userEmail', data.patient.email);
          localStorage.setItem('isLoggedIn', 'true');

          setError('');
          setLoading(false);
          navigate('/patient-dashboard');
        } catch (err) {
          setError(err.response?.data?.message || 'Registration failed. Please try again.');
          setLoading(false);
        }
      } 
      // Patient login
      else if (tabValue === 0 && !isSignUp) {
        if (!email || !password) {
          setError(language === 'ar' ? 'يرجى ملء جميع الحقول' : 'Please fill all fields');
          setLoading(false);
          return;
        }

        try {
          // Call API to login patient
          console.log('🔐 Attempting patient login with:', { email, password: '***' });
          const { data } = await patientAPI.login(email, password);
          console.log('✅ Patient login response:', data);
          
          // Store token and patient info
          localStorage.setItem('token', data.token);
          localStorage.setItem('userRole', 'patient');
          localStorage.setItem('patientId', data.patient.id);
          localStorage.setItem('userName', data.patient.fullName);
          localStorage.setItem('userEmail', data.patient.email);
          localStorage.setItem('isLoggedIn', 'true');

          console.log('✅ localStorage updated, navigating to patient dashboard');
          setError('');
          setLoading(false);
          navigate('/patient-dashboard');
        } catch (err) {
          console.error('❌ Patient login error:', err.response?.data || err.message);
          setError(err.response?.data?.message || 'Login failed. Please try again.');
          setLoading(false);
        }
      }
      // Other roles (therapist, admin) - keep mock logic for now
      else {
        const roleMap = {
          0: 'patient',
          1: 'therapist',
          2: 'admin'
        };
        const role = roleMap[tabValue];

        // Validation for admin/therapist login
        if (!email || !password) {
          setError(language === 'ar' ? 'يرجى ملء جميع الحقول' : 'Please fill all fields');
          setLoading(false);
          return;
        }

        if (!validateEmail(email)) {
          setEmailError(language === 'ar' ? 'البريد الإلكتروني غير صحيح' : 'Invalid email address');
          setLoading(false);
          return;
        }

        // Call API for admin/therapist login
        try {
          if (role === 'admin') {
            const { data } = await adminService.login(email, password);
            
            // Store token and admin info
            localStorage.setItem('token', data.token);
            localStorage.setItem('userId', data.admin?.id || '');
            localStorage.setItem('userRole', 'admin');
            localStorage.setItem('userName', data.admin?.name || email);
            localStorage.setItem('userEmail', data.admin?.email || email);
            localStorage.setItem('isLoggedIn', 'true');

            setError('');
            setLoading(false);
            navigate('/admin-portal');
            return;
          } else if (role === 'therapist') {
            const { data } = await therapistService.login(email, password);
            
            localStorage.setItem('token', data.token);
            localStorage.setItem('userId', data.therapist?.id || '');
            localStorage.setItem('userRole', 'therapist');
            localStorage.setItem('userName', data.therapist?.name || email);
            localStorage.setItem('userEmail', data.therapist?.email || email);
            localStorage.setItem('isLoggedIn', 'true');

            setError('');
            setLoading(false);
            navigate('/therapist-portal');
            return;
          }
        } catch (error) {
          // Don't clear login state - just show error and keep user on login page
          setError(error.response?.data?.message || (language === 'ar' ? 'فشل تسجيل الدخول' : 'Login failed'));
          setLoading(false);
        }
      }
    } catch (err) {
      // Don't clear login state - just show error
      const errorMessage = err.response?.data?.message || (language === 'ar' ? 'فشل تسجيل الدخول' : 'Login failed');
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { label: language === 'ar' ? 'المريض' : 'Patient' },
    { label: language === 'ar' ? 'المعالج' : 'Therapist' },
    { label: language === 'ar' ? 'المسؤول' : 'Admin' }
  ];

  return (
    <Container maxWidth="sm" sx={{ py: { xs: 4, md: 8 } }}>
      <Card sx={{ 
        p: { xs: 3, md: 4 }, 
        boxShadow: isDark ? '0 8px 32px rgba(0, 0, 0, 0.3)' : '0 8px 32px rgba(28, 111, 181, 0.15)',
        backgroundColor: isDark ? muiTheme.palette.background.paper : '#ffffff',
        borderRadius: '16px',
        border: isDark ? '1px solid #333' : '1px solid rgba(28, 111, 181, 0.1)',
        transition: 'all 0.3s ease',
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography 
            variant="h3" 
            sx={{ color: '#1C6FB5', fontWeight: 'bold', fontSize: { xs: '1.8rem', md: '2.2rem' }, flex: 1 }}
          >
            {t('centerName')}
          </Typography>
          <DarkModeToggle variant="header" size="medium" />
        </Box>

        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{ 
            mb: 3, 
            borderBottom: isDark ? '2px solid #333' : '2px solid #1C6FB5',
            '& .MuiTab-root': {
              color: isDark ? '#999' : '#999',
              fontWeight: '600',
              textTransform: 'none',
              fontSize: '0.95rem',
              transition: 'all 0.3s ease',
            },
            '& .MuiTab-root.Mui-selected': {
              color: isDark ? '#CBDD71' : '#1C6FB5',
            },
            '& .MuiTabs-indicator': {
              backgroundColor: isDark ? '#CBDD71' : '#1C6FB5',
              height: '3px',
            }
          }}
        >
          {tabs.map((tab, index) => (
            <Tab key={index} label={tab.label} />
          ))}
        </Tabs>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleLogin}>
          <TextField
            fullWidth
            label={language === 'ar' ? 'الاسم الكامل' : 'Full Name'}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            margin="normal"
            variant="outlined"
            disabled={loading}
          />

          <TextField
            fullWidth
            label={language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
            type="email"
            value={email}
            onChange={handleEmailChange}
            margin="normal"
            variant="outlined"
            disabled={loading}
            error={!!emailError}
            helperText={emailError}
          />

          {/* Phone field for Sign Up */}
          {isSignUp && tabValue === 0 && (
            <TextField
              fullWidth
              label={language === 'ar' ? 'رقم الهاتف' : 'Phone Number'}
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              margin="normal"
              variant="outlined"
              disabled={loading}
              placeholder={language === 'ar' ? '+964 790 000 0000' : '+1 (555) 000-0000'}
            />
          )}

          <TextField
            fullWidth
            label={language === 'ar' ? 'كلمة المرور' : 'Password'}
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            variant="outlined"
            disabled={loading}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    disabled={loading}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {/* Confirm Password field for Sign Up */}
          {isSignUp && tabValue === 0 && (
            <>
              <TextField
                fullWidth
                label={language === 'ar' ? 'تأكيد كلمة المرور' : 'Confirm Password'}
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (password && e.target.value !== password) {
                    setPasswordMatchError(language === 'ar' ? 'كلمات المرور غير متطابقة' : 'Passwords do not match');
                  } else {
                    setPasswordMatchError('');
                  }
                }}
                margin="normal"
                variant="outlined"
                disabled={loading}
                error={!!passwordMatchError}
                helperText={passwordMatchError}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                        disabled={loading}
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </>
          )}

          {password && (
            <Box sx={{ mt: 2, mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="caption">
                  {language === 'ar' ? 'قوة كلمة المرور:' : 'Password Strength:'}
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: getPasswordStrengthColor(passwordStrength),
                    fontWeight: 'bold'
                  }}
                >
                  {passwordStrength < 40 
                    ? (language === 'ar' ? 'ضعيفة' : 'Weak')
                    : passwordStrength < 70
                    ? (language === 'ar' ? 'متوسطة' : 'Fair')
                    : (language === 'ar' ? 'قوية' : 'Strong')}
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={passwordStrength}
                sx={{
                  backgroundColor: '#e0e0e0',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: getPasswordStrengthColor(passwordStrength) === 'error' ? '#f44336' : 
                                     getPasswordStrengthColor(passwordStrength) === 'warning' ? '#ff9800' : '#4caf50'
                  }
                }}
              />
            </Box>
          )}

          <ModernLoginButton
            onClick={handleLogin}
            loading={loading}
            disabled={loading}
            variant="gradient"
            size="large"
            sx={{ mt: 3 }}
          >
            {isSignUp && tabValue === 0
              ? (language === 'ar' ? 'إنشاء حساب' : 'Create Account')
              : (language === 'ar' ? 'دخول' : 'Login')}
          </ModernLoginButton>



        </form>
      </Card>
    </Container>
  );
};

export default Login;
