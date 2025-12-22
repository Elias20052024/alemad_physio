import React from 'react';
import { Backdrop, CircularProgress, Box, Typography } from '@mui/material';
import { useLoading } from '../context/LoadingContext';

const LoadingOverlay = () => {
  const { isLoading, loadingMessage } = useLoading();

  return (
    <Backdrop
      sx={{
        color: '#fff',
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
      }}
      open={isLoading}
    >
      <CircularProgress color="inherit" size={60} />
      <Typography variant="h6" sx={{ mt: 2, textAlign: 'center' }}>
        {loadingMessage}
      </Typography>
    </Backdrop>
  );
};

export default LoadingOverlay;
