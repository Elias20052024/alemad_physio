# 🎯 Quick Reference Guide

## Fast Lookup for Modern Login Components

---

## DarkModeToggle Component

### Basic Usage
```jsx
import DarkModeToggle from './components/DarkModeToggle';

<DarkModeToggle variant="header" size="medium" />
```

### All Variants
```jsx
// Default - standard button
<DarkModeToggle variant="default" size="medium" />

// Header - rounded, suitable for card header
<DarkModeToggle variant="header" size="medium" />

// Outlined - border-only style
<DarkModeToggle variant="outlined" size="medium" />

// Floating - fixed position action button
<DarkModeToggle variant="floating" size="large" />
```

### All Sizes
```jsx
<DarkModeToggle size="small" />      {/* 40x40 */}
<DarkModeToggle size="medium" />     {/* 48x48 */}
<DarkModeToggle size="large" />      {/* 56x56 */}
```

### Props
```jsx
<DarkModeToggle
  variant="default"    // 'default' | 'header' | 'outlined' | 'floating'
  size="medium"        // 'small' | 'medium' | 'large'
/>
```

---

## ModernLoginButton Component

### Basic Usage
```jsx
import ModernLoginButton from './components/ModernLoginButton';

<ModernLoginButton variant="gradient" size="large">
  Login
</ModernLoginButton>
```

### All Variants
```jsx
// Gradient with shimmer (most popular)
<ModernLoginButton variant="gradient">
  Login
</ModernLoginButton>

// Solid color
<ModernLoginButton variant="solid">
  Login
</ModernLoginButton>

// Outlined
<ModernLoginButton variant="outlined">
  Login
</ModernLoginButton>

// Secondary (lime green)
<ModernLoginButton variant="secondary">
  Sign Up
</ModernLoginButton>
```

### All Sizes
```jsx
<ModernLoginButton size="small">Small</ModernLoginButton>
<ModernLoginButton size="medium">Medium</ModernLoginButton>
<ModernLoginButton size="large">Large</ModernLoginButton>
```

### With Loading State
```jsx
const [loading, setLoading] = useState(false);

<ModernLoginButton
  loading={loading}
  onClick={handleClick}
  disabled={loading}
>
  Process
</ModernLoginButton>
```

### All Props
```jsx
<ModernLoginButton
  children="Login"           // Button text
  loading={false}            // Show spinner
  disabled={false}           // Disable button
  onClick={() => {}}         // Click handler
  fullWidth={true}           // Full width
  variant="gradient"         // Style variant
  size="large"               // Size
  sx={{}}                    // MUI styles
/>
```

---

## Theme Context Hook

### Get Theme State
```jsx
import { useTheme } from '../context/ThemeContext';

function MyComponent() {
  const { isDark, toggleTheme, theme } = useTheme();
  
  return (
    <>
      <p>Current mode: {isDark ? 'Dark' : 'Light'}</p>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </>
  );
}
```

### Hook Return Values
```javascript
{
  isDark: boolean,                    // true if dark mode
  toggleTheme: () => void,            // Function to toggle
  theme: MuiTheme,                    // Current MUI theme object
}
```

---

## Common Patterns

### Header with Toggle
```jsx
import { Box, AppBar, Toolbar } from '@mui/material';
import DarkModeToggle from './DarkModeToggle';

<AppBar>
  <Toolbar>
    <Box sx={{ flex: 1 }}>Logo</Box>
    <DarkModeToggle variant="header" size="medium" />
  </Toolbar>
</AppBar>
```

### Login Card
```jsx
import { Card, Box, TextField } from '@mui/material';
import ModernLoginButton from './ModernLoginButton';
import DarkModeToggle from './DarkModeToggle';

<Card sx={{ p: 4, maxWidth: 500, mx: 'auto' }}>
  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
    <h1>Sign In</h1>
    <DarkModeToggle variant="header" size="medium" />
  </Box>
  
  <TextField fullWidth label="Email" margin="normal" />
  <TextField fullWidth label="Password" type="password" margin="normal" />
  
  <ModernLoginButton variant="gradient" size="large" sx={{ mt: 3 }}>
    Sign In
  </ModernLoginButton>
</Card>
```

### Form with Loading
```jsx
const [loading, setLoading] = useState(false);

const handleLogin = async () => {
  setLoading(true);
  try {
    // API call
    await api.login(email, password);
  } finally {
    setLoading(false);
  }
};

<ModernLoginButton
  loading={loading}
  onClick={handleLogin}
  disabled={loading || !email || !password}
  variant="gradient"
  size="large"
>
  {loading ? 'Logging in...' : 'Login'}
</ModernLoginButton>
```

### Button Group
```jsx
<Box sx={{ display: 'flex', gap: 2 }}>
  <ModernLoginButton variant="gradient" sx={{ flex: 1 }}>
    Login
  </ModernLoginButton>
  <ModernLoginButton variant="outlined" sx={{ flex: 1 }}>
    Sign Up
  </ModernLoginButton>
</Box>
```

---

## Styling Customization

### Custom Styles
```jsx
<ModernLoginButton
  sx={{
    fontSize: '1.2rem',
    py: 3,
    borderRadius: '16px',
    backgroundColor: 'custom-color',
  }}
>
  Custom Button
</ModernLoginButton>
```

### Responsive Styles
```jsx
<ModernLoginButton
  sx={{
    py: { xs: 1, sm: 1.5, md: 2 },
    fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
  }}
>
  Responsive Button
</ModernLoginButton>
```

### Theme-Aware Styles
```jsx
import { useTheme } from '@mui/material/styles';

function MyComponent() {
  const muiTheme = useTheme();
  
  return (
    <Box sx={{
      color: muiTheme.palette.primary.main,
      backgroundColor: muiTheme.palette.background.paper,
    }}>
      Content
    </Box>
  );
}
```

---

## Color References

### Light Mode
```javascript
Primary:        #1C6FB5  // Medical Blue
Secondary:      #CBDD71  // Muted Lime
Background:     #F9FAFB  // Light Gray
Paper:          #FFFFFF  // White
Text:           #1a1a1a  // Dark
Success:        #10B981  // Green
Warning:        #F59E0B  // Orange
Error:          #EF4444  // Red
```

### Dark Mode
```javascript
Primary:        #74C3E7  // Sky Blue
Secondary:      #CBDD71  // Muted Lime
Background:     #0F1117  // Very Dark
Paper:          #1A1D23  // Dark Gray
Text:           #FFFFFF  // White
Success:        #34D399  // Green
Warning:        #FBBF24  // Orange
Error:          #F87171  // Red
```

---

## Animations

### Durations
```javascript
Fast:       0.1s
Normal:     0.3s
Slow:       0.5s
```

### Easing
```javascript
Default:    cubic-bezier(0.4, 0, 0.2, 1)
Smooth:     ease
Linear:     linear
```

### Common Animations
```javascript
// Fade
transition: 'opacity 0.3s ease'

// Slide
transition: 'transform 0.3s ease'

// Scale
transition: 'transform 0.3s ease'

// Shadow
transition: 'box-shadow 0.3s ease'

// All
transition: 'all 0.3s ease'
```

---

## Debugging

### Check Current Theme
```javascript
// In browser console
localStorage.getItem('theme')  // 'light' or 'dark'
```

### Check Login Status
```javascript
// In browser console
localStorage.getItem('isLoggedIn')   // 'true' or 'false'
localStorage.getItem('userRole')     // 'patient', 'therapist', 'admin'
```

### Console Logging
```jsx
import { useTheme } from '../context/ThemeContext';

function MyComponent() {
  const { isDark, theme } = useTheme();
  
  console.log('Current theme:', isDark ? 'dark' : 'light');
  console.log('Theme object:', theme);
  
  return <div>Content</div>;
}
```

---

## File Locations

```
frontend/src/
├── components/
│   ├── DarkModeToggle.jsx
│   ├── ModernLoginButton.jsx
│   ├── ComponentShowcase.jsx
│   └── THEME_SETUP_GUIDE.md
├── context/
│   └── ThemeContext.jsx
├── pages/
│   └── Login.jsx
├── theme/
│   └── theme.js
└── App.jsx
```

---

## Quick Troubleshooting

| Issue | Solution |
|-------|----------|
| Components not showing | Check ThemeProvider in App.jsx |
| Dark mode not persisting | Check localStorage is enabled |
| Animations not smooth | Try hard refresh (Ctrl+Shift+R) |
| Wrong colors | Check theme.js color definitions |
| Button doesn't respond | Ensure onClick handler is provided |
| Spinner not showing | Set loading={true} prop |

---

## Performance Tips

- ✅ Use `variant="gradient"` for maximum impact
- ✅ Memoize heavy components with React.memo
- ✅ Lazy load ComponentShowcase if not needed immediately
- ✅ Use CSS-in-JS efficiently with MUI

---

## Accessibility Checklist

- ✅ Test with keyboard (Tab, Enter)
- ✅ Check with screen reader
- ✅ Verify color contrast
- ✅ Look for focus indicators
- ✅ Test with mouse and touch

---

## Browser Support

✅ Chrome 90+  
✅ Firefox 88+  
✅ Safari 14+  
✅ Edge 90+  
✅ Mobile browsers  

---

## Next Steps

1. View ComponentShowcase at `/showcase` route
2. Test theme toggle in your app
3. Customize colors to match your branding
4. Add components to your pages
5. Gather feedback and iterate

---

## Getting Help

📖 **Documentation**: `MODERN_LOGIN_README.md`  
📋 **Setup Guide**: `frontend/src/components/THEME_SETUP_GUIDE.md`  
🎨 **Showcase**: Visit `/showcase` route  
💻 **Source Code**: Check component files for comments

---

**Last Updated**: December 9, 2025  
**Quick Reference v1.0** ✅
