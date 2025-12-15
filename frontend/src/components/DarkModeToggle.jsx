import React from 'react';
import { IconButton, Box, Tooltip, useTheme as useMuiTheme } from '@mui/material';
import { DarkMode, LightMode } from '@mui/icons-material';
import { useTheme } from '../context/ThemeContext';

const DarkModeToggle = ({ variant = 'default', size = 'medium' }) => {
  const { isDark, toggleTheme } = useTheme();
  const muiTheme = useMuiTheme();

  const buttonSize = {
    small: { width: 40, height: 40, fontSize: '1rem' },
    medium: { width: 48, height: 48, fontSize: '1.25rem' },
    large: { width: 56, height: 56, fontSize: '1.5rem' },
  };

  const getButtonStyle = () => {
    switch (variant) {
      case 'floating':
        return {
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 999,
          ...buttonSize[size],
          backgroundColor: isDark ? '#2a2a3e' : '#f0f7ff',
          color: isDark ? '#CBDD71' : '#1C6FB5',
          boxShadow: isDark 
            ? '0 8px 24px rgba(0, 0, 0, 0.3)' 
            : '0 8px 24px rgba(28, 111, 181, 0.25)',
          '&:hover': {
            backgroundColor: isDark ? '#3a3a4e' : '#e3f2fd',
            transform: 'scale(1.1)',
            boxShadow: isDark 
              ? '0 12px 32px rgba(0, 0, 0, 0.4)' 
              : '0 12px 32px rgba(28, 111, 181, 0.35)',
          },
        };

      case 'header':
        return {
          ...buttonSize[size],
          backgroundColor: isDark ? '#2a2a3e' : '#f0f7ff',
          color: isDark ? '#CBDD71' : '#1C6FB5',
          borderRadius: '12px',
          transition: 'all 0.3s ease',
          '&:hover': {
            backgroundColor: isDark ? '#3a3a4e' : '#e3f2fd',
            transform: 'rotate(20deg) scale(1.1)',
          },
        };

      case 'outlined':
        return {
          ...buttonSize[size],
          border: `2px solid ${isDark ? '#CBDD71' : '#1C6FB5'}`,
          color: isDark ? '#CBDD71' : '#1C6FB5',
          borderRadius: '12px',
          backgroundColor: 'transparent',
          transition: 'all 0.3s ease',
          '&:hover': {
            backgroundColor: isDark ? 'rgba(203, 221, 113, 0.1)' : 'rgba(28, 111, 181, 0.1)',
            transform: 'rotate(20deg) scale(1.05)',
          },
        };

      default:
        return {
          ...buttonSize[size],
          backgroundColor: isDark ? '#2a2a3e' : '#f0f7ff',
          color: isDark ? '#CBDD71' : '#1C6FB5',
          borderRadius: '12px',
          transition: 'all 0.3s ease',
          '&:hover': {
            backgroundColor: isDark ? '#3a3a4e' : '#e3f2fd',
            transform: 'rotate(20deg) scale(1.1)',
          },
        };
    }
  };

  return (
    <Tooltip title={isDark ? 'Light Mode' : 'Dark Mode'} arrow>
      <IconButton
        onClick={toggleTheme}
        sx={getButtonStyle()}
        aria-label="toggle theme"
      >
        {isDark ? <LightMode /> : <DarkMode />}
      </IconButton>
    </Tooltip>
  );
};

export default DarkModeToggle;
