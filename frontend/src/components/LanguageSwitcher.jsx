import React from 'react';
import { Button } from '@mui/material';
import { useLanguage } from '../context/LanguageContext';

const LanguageSwitcher = () => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <Button
      onClick={toggleLanguage}
      variant="outlined"
      color="inherit"
      sx={{
        border: '1px solid rgba(255,255,255,0.5)',
        '&:hover': {
          border: '1px solid white',
        },
      }}
    >
      {language === 'ar' ? 'EN' : 'AR'}
    </Button>
  );
};

export default LanguageSwitcher;
