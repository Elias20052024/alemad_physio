import { createTheme } from '@mui/material/styles';

const brandColors = {
  midBlue: '#1C6FB5',
  skyBlue: '#74C3E7',
  mutedLime: '#CBDD71',
  warmGray: '#8E8E8E',
  white: '#FFFFFF',
  lightBg: '#F9FAFB',
  darkBg: '#0F1117',
};

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: brandColors.midBlue,
      light: brandColors.skyBlue,
      dark: '#154A88',
    },
    secondary: {
      main: brandColors.mutedLime,
      light: '#DDE99D',
      dark: '#A8B85A',
    },
    background: {
      default: brandColors.lightBg,
      paper: brandColors.white,
    },
    text: {
      primary: '#1a1a1a',
      secondary: brandColors.warmGray,
    },
    divider: '#E5E7EB',
    success: {
      main: '#10B981',
    },
    warning: {
      main: '#F59E0B',
    },
    error: {
      main: '#EF4444',
    },
  },
  typography: {
    fontFamily: '"Segoe UI", "Tajawal", -apple-system, BlinkMacSystemFont, sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 700,
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 600,
    },
    h4: {
      fontSize: '1.25rem',
      fontWeight: 600,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(28, 111, 181, 0.15)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        },
      },
    },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: brandColors.skyBlue,
      light: '#A8D8F0',
      dark: '#5BA3C9',
    },
    secondary: {
      main: brandColors.mutedLime,
      light: '#DDE99D',
      dark: '#A8B85A',
    },
    background: {
      default: brandColors.darkBg,
      paper: '#1A1D23',
    },
    text: {
      primary: brandColors.white,
      secondary: '#B4B4B4',
    },
    divider: '#404854',
    success: {
      main: '#34D399',
    },
    warning: {
      main: '#FBBF24',
    },
    error: {
      main: '#F87171',
    },
  },
  typography: {
    fontFamily: '"Segoe UI", "Tajawal", -apple-system, BlinkMacSystemFont, sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 700,
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 600,
    },
    h4: {
      fontSize: '1.25rem',
      fontWeight: 600,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(116, 195, 231, 0.3)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
        },
      },
    },
  },
});
