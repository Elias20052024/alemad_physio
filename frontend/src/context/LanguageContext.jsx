import React, { createContext, useState, useContext, useEffect } from 'react';
import ar from '../i18n/ar.json';
import en from '../i18n/en.json';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'ar' ? 'en' : 'ar');
  };

  const translations = language === 'ar' ? ar : en;

  const value = {
    language,
    setLanguage,
    toggleLanguage,
    t: (path) => {
      const keys = path.split('.');
      let current = translations;
      for (const key of keys) {
        current = current?.[key];
      }
      return current || path;
    },
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};
