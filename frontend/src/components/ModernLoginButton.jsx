import React from 'react';
import { Button, CircularProgress, useTheme as useMuiTheme } from '@mui/material';
import { useTheme } from '../context/ThemeContext';

const ModernLoginButton = ({
  children = 'Login',
  loading = false,
  disabled = false,
  onClick,
  fullWidth = true,
  variant = 'gradient',
  size = 'large',
  sx = {},
  type = 'submit',
}) => {
  const muiTheme = useMuiTheme();
  const { isDark } = useTheme();

  const getButtonStyle = () => {
    const baseStyle = {
      fullWidth,
      fontWeight: '700',
      textTransform: 'none',
      borderRadius: '12px',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      position: 'relative',
      overflow: 'hidden',
      disabled: disabled || loading,
    };

    const sizeConfig = {
      small: { py: 1, fontSize: '0.875rem' },
      medium: { py: 1.5, fontSize: '0.95rem' },
      large: { py: 2, fontSize: '1.05rem' },
    };

    switch (variant) {
      case 'gradient':
        return {
          ...baseStyle,
          ...sizeConfig[size],
          background: isDark
            ? 'linear-gradient(135deg, #74C3E7 0%, #5BA3C9 100%)'
            : 'linear-gradient(135deg, #1C6FB5 0%, #154A88 100%)',
          color: isDark ? '#0F1117' : '#FFFFFF',
          boxShadow: isDark
            ? '0 4px 15px rgba(116, 195, 231, 0.3)'
            : '0 4px 15px rgba(28, 111, 181, 0.3)',
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
          '&:hover:not(:disabled)::before': {
            left: '100%',
          },
          '&:hover:not(:disabled)': {
            boxShadow: isDark
              ? '0 8px 25px rgba(116, 195, 231, 0.5)'
              : '0 8px 25px rgba(28, 111, 181, 0.5)',
            transform: 'translateY(-2px)',
          },
          '&:active:not(:disabled)': {
            transform: 'translateY(0px)',
          },
          '&:disabled': {
            opacity: 0.7,
            boxShadow: isDark
              ? '0 4px 15px rgba(116, 195, 231, 0.2)'
              : '0 4px 15px rgba(28, 111, 181, 0.2)',
          },
        };

      case 'solid':
        return {
          ...baseStyle,
          ...sizeConfig[size],
          backgroundColor: isDark ? '#74C3E7' : '#1C6FB5',
          color: isDark ? '#0F1117' : '#FFFFFF',
          boxShadow: isDark
            ? '0 4px 12px rgba(116, 195, 231, 0.25)'
            : '0 4px 12px rgba(28, 111, 181, 0.25)',
          '&:hover:not(:disabled)': {
            backgroundColor: isDark ? '#5BA3C9' : '#154A88',
            boxShadow: isDark
              ? '0 8px 20px rgba(116, 195, 231, 0.4)'
              : '0 8px 20px rgba(28, 111, 181, 0.4)',
            transform: 'translateY(-2px)',
          },
          '&:active:not(:disabled)': {
            transform: 'translateY(0px)',
          },
          '&:disabled': {
            opacity: 0.7,
          },
        };

      case 'outlined':
        return {
          ...baseStyle,
          ...sizeConfig[size],
          border: `2px solid ${isDark ? '#74C3E7' : '#1C6FB5'}`,
          color: isDark ? '#74C3E7' : '#1C6FB5',
          backgroundColor: 'transparent',
          boxShadow: 'none',
          '&:hover:not(:disabled)': {
            backgroundColor: isDark
              ? 'rgba(116, 195, 231, 0.1)'
              : 'rgba(28, 111, 181, 0.1)',
            boxShadow: isDark
              ? '0 4px 12px rgba(116, 195, 231, 0.2)'
              : '0 4px 12px rgba(28, 111, 181, 0.2)',
            transform: 'translateY(-2px)',
          },
          '&:active:not(:disabled)': {
            transform: 'translateY(0px)',
          },
          '&:disabled': {
            opacity: 0.5,
            borderColor: isDark ? 'rgba(116, 195, 231, 0.5)' : 'rgba(28, 111, 181, 0.5)',
          },
        };

      case 'secondary':
        return {
          ...baseStyle,
          ...sizeConfig[size],
          backgroundColor: isDark ? '#CBDD71' : '#CBDD71',
          color: isDark ? '#0F1117' : '#1a1a1a',
          boxShadow: isDark
            ? '0 4px 12px rgba(203, 221, 113, 0.3)'
            : '0 4px 12px rgba(203, 221, 113, 0.25)',
          '&:hover:not(:disabled)': {
            backgroundColor: isDark ? '#B8CB5A' : '#B8CB5A',
            boxShadow: isDark
              ? '0 8px 20px rgba(203, 221, 113, 0.4)'
              : '0 8px 20px rgba(203, 221, 113, 0.35)',
            transform: 'translateY(-2px)',
          },
          '&:active:not(:disabled)': {
            transform: 'translateY(0px)',
          },
          '&:disabled': {
            opacity: 0.7,
          },
        };

      default:
        return baseStyle;
    }
  };

  return (
    <Button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      sx={{ ...getButtonStyle(), ...sx }}
    >
      {loading ? (
        <CircularProgress
          size={24}
          color="inherit"
          sx={{ mr: 1 }}
        />
      ) : null}
      {children}
    </Button>
  );
};

export default ModernLoginButton;
