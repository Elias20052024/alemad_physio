import React, { useState } from 'react';
import {
  Container,
  Box,
  Card,
  Typography,
  TextField,
  Divider,
  Grid,
  Paper,
  Stack,
} from '@mui/material';
import DarkModeToggle from './DarkModeToggle';
import ModernLoginButton from './ModernLoginButton';
import { useTheme } from '../context/ThemeContext';

/**
 * ComponentShowcase.jsx
 * 
 * This file demonstrates all the modern login and theme toggle components
 * in a comprehensive showcase. Use this as a reference for implementation.
 */

const ComponentShowcase = () => {
  const { isDark, theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSimulateLogin = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLoading(false);
    alert('Login would be processed here!');
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Hero Section */}
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Typography
          variant="h2"
          sx={{
            mb: 2,
            fontWeight: 'bold',
            background: isDark
              ? 'linear-gradient(135deg, #74C3E7 0%, #CBDD71 100%)'
              : 'linear-gradient(135deg, #1C6FB5 0%, #CBDD71 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Modern Components Showcase
        </Typography>
        <Typography variant="h6" sx={{ color: 'text.secondary', mb: 4 }}>
          Modern Login Button & Dark/Light Mode Toggle with React + Material UI
        </Typography>
      </Box>

      {/* Theme Toggle Showcase */}
      <Card sx={{ p: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            Theme Toggle Variants
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Typography sx={{ fontSize: '2rem' }}>
              {isDark ? '🌙 Dark Mode' : '☀️ Light Mode'}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Grid container spacing={3}>
          {/* Default Variant */}
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="caption" sx={{ display: 'block', mb: 2, fontWeight: 'bold' }}>
                Default
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <DarkModeToggle variant="default" size="medium" />
              </Box>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Standard style
              </Typography>
            </Paper>
          </Grid>

          {/* Header Variant */}
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="caption" sx={{ display: 'block', mb: 2, fontWeight: 'bold' }}>
                Header
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <DarkModeToggle variant="header" size="medium" />
              </Box>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Card header style
              </Typography>
            </Paper>
          </Grid>

          {/* Outlined Variant */}
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="caption" sx={{ display: 'block', mb: 2, fontWeight: 'bold' }}>
                Outlined
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <DarkModeToggle variant="outlined" size="medium" />
              </Box>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Border style
              </Typography>
            </Paper>
          </Grid>

          {/* Size Comparison */}
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="caption" sx={{ display: 'block', mb: 2, fontWeight: 'bold' }}>
                Sizes
              </Typography>
              <Stack direction="row" spacing={1} sx={{ justifyContent: 'center', mb: 2 }}>
                <DarkModeToggle variant="default" size="small" />
                <DarkModeToggle variant="default" size="medium" />
                <DarkModeToggle variant="default" size="large" />
              </Stack>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Small, Medium, Large
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Card>

      {/* Login Button Showcase */}
      <Card sx={{ p: 4, mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
          Modern Login Button Variants
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Grid container spacing={3}>
          {/* Gradient Variant */}
          <Grid item xs={12} sm={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="caption" sx={{ display: 'block', mb: 2, fontWeight: 'bold' }}>
                Gradient (Default)
              </Typography>
              <ModernLoginButton variant="gradient" size="large">
                Click Me
              </ModernLoginButton>
              <Typography variant="body2" sx={{ color: 'text.secondary', mt: 2 }}>
                With shimmer effect on hover
              </Typography>
            </Paper>
          </Grid>

          {/* Solid Variant */}
          <Grid item xs={12} sm={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="caption" sx={{ display: 'block', mb: 2, fontWeight: 'bold' }}>
                Solid Color
              </Typography>
              <ModernLoginButton variant="solid" size="large">
                Click Me
              </ModernLoginButton>
              <Typography variant="body2" sx={{ color: 'text.secondary', mt: 2 }}>
                Solid blue color
              </Typography>
            </Paper>
          </Grid>

          {/* Outlined Variant */}
          <Grid item xs={12} sm={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="caption" sx={{ display: 'block', mb: 2, fontWeight: 'bold' }}>
                Outlined
              </Typography>
              <ModernLoginButton variant="outlined" size="large">
                Click Me
              </ModernLoginButton>
              <Typography variant="body2" sx={{ color: 'text.secondary', mt: 2 }}>
                Border style button
              </Typography>
            </Paper>
          </Grid>

          {/* Secondary Variant */}
          <Grid item xs={12} sm={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="caption" sx={{ display: 'block', mb: 2, fontWeight: 'bold' }}>
                Secondary (Lime)
              </Typography>
              <ModernLoginButton variant="secondary" size="large">
                Click Me
              </ModernLoginButton>
              <Typography variant="body2" sx={{ color: 'text.secondary', mt: 2 }}>
                Lime green accent
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Size Showcase */}
        <Box sx={{ mt: 4, p: 2, bgcolor: isDark ? '#2a2a3e' : '#f5f5f5', borderRadius: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
            Size Variations
          </Typography>
          <Stack spacing={2}>
            <Box>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                Small
              </Typography>
              <ModernLoginButton variant="gradient" size="small">
                Small Button
              </ModernLoginButton>
            </Box>
            <Box>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                Medium
              </Typography>
              <ModernLoginButton variant="gradient" size="medium">
                Medium Button
              </ModernLoginButton>
            </Box>
            <Box>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                Large
              </Typography>
              <ModernLoginButton variant="gradient" size="large">
                Large Button
              </ModernLoginButton>
            </Box>
          </Stack>
        </Box>

        {/* Loading State */}
        <Box sx={{ mt: 4, p: 2, bgcolor: isDark ? '#2a2a3e' : '#f5f5f5', borderRadius: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
            Loading State
          </Typography>
          <ModernLoginButton
            variant="gradient"
            size="large"
            loading={loading}
            onClick={handleSimulateLogin}
          >
            {loading ? 'Processing...' : 'Click to Load'}
          </ModernLoginButton>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 2 }}>
            Try clicking to see loading animation with spinner
          </Typography>
        </Box>
      </Card>

      {/* Complete Login Form Example */}
      <Card sx={{ p: 4, maxWidth: 500, mx: 'auto' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            Complete Example
          </Typography>
          <DarkModeToggle variant="header" size="medium" />
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
          Full working login form with all components
        </Typography>

        <TextField
          fullWidth
          label="Email Address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          margin="normal"
          variant="outlined"
          placeholder="your@email.com"
        />

        <TextField
          fullWidth
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          margin="normal"
          variant="outlined"
          placeholder="••••••••"
        />

        <ModernLoginButton
          onClick={handleSimulateLogin}
          loading={loading}
          disabled={!email || !password}
          variant="gradient"
          size="large"
          sx={{ mt: 3, mb: 2 }}
        >
          Sign In
        </ModernLoginButton>

        <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center', mt: 2 }}>
          Don't have an account? <strong>Sign up</strong>
        </Typography>
      </Card>

      {/* Code Examples */}
      <Card sx={{ p: 4, mt: 4, bgcolor: isDark ? '#2a2a3e' : '#f5f5f5' }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
          Code Examples
        </Typography>

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
            Dark Mode Toggle
          </Typography>
          <Paper sx={{ p: 2, bgcolor: isDark ? '#1a1a2e' : '#fff', overflow: 'auto' }}>
            <Typography component="pre" variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
{`import DarkModeToggle from './DarkModeToggle';

// In your component:
<DarkModeToggle variant="header" size="medium" />

// Variants: 'default' | 'header' | 'outlined' | 'floating'
// Sizes: 'small' | 'medium' | 'large'`}
            </Typography>
          </Paper>
        </Box>

        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
            Modern Login Button
          </Typography>
          <Paper sx={{ p: 2, bgcolor: isDark ? '#1a1a2e' : '#fff', overflow: 'auto' }}>
            <Typography component="pre" variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
{`import ModernLoginButton from './ModernLoginButton';

// In your component:
<ModernLoginButton
  onClick={handleLogin}
  loading={loading}
  variant="gradient"
  size="large"
>
  Login
</ModernLoginButton>

// Variants: 'gradient' | 'solid' | 'outlined' | 'secondary'
// Sizes: 'small' | 'medium' | 'large'`}
            </Typography>
          </Paper>
        </Box>
      </Card>
    </Container>
  );
};

export default ComponentShowcase;
