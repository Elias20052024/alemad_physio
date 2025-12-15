# Modern Login & Dark/Light Mode Theme System

Complete implementation of a modern, clean, and responsive Login button with Dark/Light mode toggle using React + Material UI (MUI v5).

## Project Structure

```
src/
├── components/
│   ├── DarkModeToggle.jsx       # Theme toggle button component
│   ├── ModernLoginButton.jsx    # Modern login button component
│   └── Header.jsx               # Public header (uses DarkModeToggle)
├── context/
│   └── ThemeContext.jsx         # Theme state management
├── pages/
│   └── Login.jsx                # Login page (uses both components)
├── theme/
│   └── theme.js                 # Theme definitions (light & dark)
└── App.jsx                      # Main app with ThemeProvider
```

## Key Features

### 1. **Dark/Light Mode Toggle (`DarkModeToggle.jsx`)**
- Multiple style variants: `default`, `header`, `outlined`, `floating`
- Configurable sizes: `small`, `medium`, `large`
- Smooth transitions between themes
- LocalStorage persistence
- Tooltip on hover

**Variants:**
```javascript
<DarkModeToggle variant="header" size="medium" />       // Card header style
<DarkModeToggle variant="floating" size="large" />      // Floating action button
<DarkModeToggle variant="outlined" size="small" />      // Outlined button
<DarkModeToggle variant="default" size="medium" />      // Default style
```

### 2. **Modern Login Button (`ModernLoginButton.jsx`)**
- Multiple button styles: `gradient`, `solid`, `outlined`, `secondary`
- Configurable sizes: `small`, `medium`, `large`
- Shimmer effect on hover (gradient variant)
- Loading state with spinner
- Smooth animations and transitions
- Full dark mode support
- Bilingual text support

**Variants:**
```javascript
// Gradient with shimmer effect (default)
<ModernLoginButton variant="gradient" size="large">Login</ModernLoginButton>

// Solid color button
<ModernLoginButton variant="solid" size="medium">Login</ModernLoginButton>

// Outlined button
<ModernLoginButton variant="outlined" size="small">Login</ModernLoginButton>

// Secondary (lime green)
<ModernLoginButton variant="secondary" size="large">Sign Up</ModernLoginButton>
```

### 3. **Theme Context (`ThemeContext.jsx`)**
- Centralized theme state management
- LocalStorage persistence
- Automatic theme persistence on refresh
- useTheme hook for components

```javascript
import { useTheme } from '../context/ThemeContext';

function MyComponent() {
  const { isDark, toggleTheme, theme } = useTheme();
  
  return (
    <button onClick={toggleTheme}>
      {isDark ? 'Light Mode' : 'Dark Mode'}
    </button>
  );
}
```

### 4. **Theme Definitions (`theme.js`)**

#### Light Mode
- **Primary**: Medical blue (#1C6FB5)
- **Secondary**: Muted lime (#CBDD71)
- **Background**: Light gray (#F9FAFB)
- **Paper**: White (#FFFFFF)
- **Text**: Dark gray (#1a1a1a)

#### Dark Mode
- **Primary**: Sky blue (#74C3E7)
- **Secondary**: Muted lime (#CBDD71)
- **Background**: Very dark (#0F1117)
- **Paper**: Dark gray (#1A1D23)
- **Text**: White (#FFFFFF)

## Component Usage

### Basic Login Page Setup

```javascript
import React from 'react';
import { Box, Card, TextField, Typography } from '@mui/material';
import ModernLoginButton from '../components/ModernLoginButton';
import DarkModeToggle from '../components/DarkModeToggle';
import { useTheme } from '../context/ThemeContext';

export default function LoginPage() {
  const { isDark } = useTheme();
  const [loading, setLoading] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleLogin = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLoading(false);
  };

  return (
    <Card sx={{ p: 4, maxWidth: 500, mx: 'auto' }}>
      {/* Header with theme toggle */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">Sign In</Typography>
        <DarkModeToggle variant="header" size="medium" />
      </Box>

      {/* Form fields */}
      <TextField
        fullWidth
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        margin="normal"
      />
      
      <TextField
        fullWidth
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        margin="normal"
      />

      {/* Modern login button */}
      <ModernLoginButton
        onClick={handleLogin}
        loading={loading}
        disabled={loading}
        variant="gradient"
        size="large"
        sx={{ mt: 3 }}
      >
        Login
      </ModernLoginButton>
    </Card>
  );
}
```

### Header with Theme Toggle

```javascript
import { Box, AppBar, Toolbar } from '@mui/material';
import DarkModeToggle from '../components/DarkModeToggle';

export default function Header() {
  return (
    <AppBar position="sticky">
      <Toolbar>
        <Box sx={{ flex: 1 }}>Logo</Box>
        <DarkModeToggle variant="header" size="medium" />
      </Toolbar>
    </AppBar>
  );
}
```

## Color Palette

### Brand Colors (Used in All Themes)
```javascript
{
  midBlue: '#1C6FB5',           // Primary brand color
  skyBlue: '#74C3E7',           // Light blue (dark mode primary)
  mutedLime: '#CBDD71',         // Secondary/accent
  warmGray: '#8E8E8E',          // Gray text
  white: '#FFFFFF',             // White
  lightBg: '#F9FAFB',           // Light background
  darkBg: '#0F1117',            // Dark background
}
```

## Dark Mode Detection

The theme automatically:
1. Reads saved preference from `localStorage.theme`
2. Defaults to light mode if no preference exists
3. Persists user choice automatically
4. Works across browser sessions
5. Applies MUI theme globally

## Animations & Transitions

### DarkModeToggle Animations
- Smooth rotation (20deg) on hover
- Scale effect (1.1x)
- 0.3s cubic-bezier transition
- Adaptive shadows for dark/light modes

### ModernLoginButton Animations
- Shimmer effect (gradient variant) - 0.5s duration
- Hover lift effect (translateY -2px)
- Shadow growth on hover
- 0.3s cubic-bezier transitions
- Loading spinner appears on demand

## Accessibility Features

- ARIA labels on buttons
- Tooltip text on theme toggle
- Keyboard navigation support
- Sufficient color contrast in both themes
- Loading state feedback
- Focus states for all interactive elements

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## File Locations

```
frontend/
├── src/
│   ├── components/
│   │   ├── DarkModeToggle.jsx
│   │   ├── ModernLoginButton.jsx
│   │   └── Header.jsx
│   ├── context/
│   │   └── ThemeContext.jsx
│   ├── pages/
│   │   └── Login.jsx
│   ├── theme/
│   │   └── theme.js
│   └── App.jsx
```

## Customization Guide

### Change Primary Color

Edit `theme.js`:
```javascript
const brandColors = {
  midBlue: '#YOUR_COLOR', // Change light mode primary
  skyBlue: '#YOUR_COLOR', // Change dark mode primary
  // ...
};
```

### Change Button Appearance

Edit `ModernLoginButton.jsx` in the appropriate variant case:
```javascript
case 'gradient':
  return {
    background: 'your-gradient', // Change gradient
    boxShadow: 'your-shadow',    // Change shadow
    // ...
  };
```

### Add New Button Variant

In `ModernLoginButton.jsx`:
```javascript
case 'custom':
  return {
    // Your custom styles
  };
```

Then use:
```javascript
<ModernLoginButton variant="custom">Button</ModernLoginButton>
```

## Testing in Development

1. **Toggle Theme**: Click DarkModeToggle in any component
2. **Refresh Page**: Theme preference persists
3. **Check LocalStorage**: `localStorage.getItem('theme')`
4. **Responsive**: Test on different screen sizes

## Performance Optimization

- Minimal re-renders using useContext
- CSS-in-JS optimized by MUI
- Smooth transitions (hardware accelerated)
- LocalStorage for instant theme switching
- No additional dependencies beyond MUI

## Known Limitations

- Theme toggle requires page refresh in some older browsers
- Some animations may be reduced on mobile devices with low performance
- Emoji icons may render differently across platforms

## Future Enhancements

- [ ] System theme detection (prefers-color-scheme)
- [ ] Custom color picker for themes
- [ ] Multiple theme options (e.g., brand-specific)
- [ ] Animation preference (prefers-reduced-motion)
- [ ] Theme transition animations
- [ ] Per-page theme overrides

## Support

For issues or customizations, refer to:
- [Material UI Documentation](https://mui.com)
- [React Context API](https://react.dev/reference/react/useContext)
- [CSS-in-JS with emotion](https://emotion.sh/docs/introduction)
