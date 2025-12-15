# Alemad Frontend

React + Vite + Material UI Frontend Application

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Frontend will start on `http://localhost:3000`

## 📦 Dependencies

- **react**: ^18.2.0
- **react-dom**: ^18.2.0
- **react-router-dom**: ^6.20.0
- **@mui/material**: ^5.14.0
- **@mui/icons-material**: ^5.14.0
- **@emotion/react**: ^11.11.0
- **@emotion/styled**: ^11.11.0
- **stylis**: ^4.3.0
- **stylis-plugin-rtl**: ^2.1.1

## 🏗️ Folder Structure

```
src/
├── pages/           # Page components (Home, About, Services, etc.)
├── components/      # Reusable components (Header, Footer, Switchers)
├── context/         # Context providers (Language, Theme)
├── i18n/            # Translation files (ar.json, en.json)
├── theme/           # Material UI theme configuration
├── App.jsx          # Main app component
└── main.jsx         # Entry point
```

## 🌍 Multi-language Support

- **Arabic (AR)**: RTL layout
- **English (EN)**: LTR layout
- Translations stored in `src/i18n/`
- Language preference saved to localStorage

### Adding New Translations

1. Edit `src/i18n/ar.json` and `src/i18n/en.json`
2. Use in components: `const { t } = useLanguage(); t('key.path')`

## 🎨 Theme System

Light and dark themes with Material UI v5.

### Using Theme in Components

```jsx
import { useTheme } from './context/ThemeContext';

const MyComponent = () => {
  const { isDark, toggleTheme } = useTheme();
  // ...
};
```

## 🛣️ Routing

Routes defined in `App.jsx`:
- `/` - Home
- `/about` - About Us
- `/services` - Services
- `/booking` - Book Appointment
- `/contact` - Contact Us

## 🔌 API Integration

Backend API endpoint: `http://localhost:5000`

### Example: Booking Form
```jsx
const response = await fetch('http://localhost:5000/api/booking', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(bookingData),
});
```

## 📱 Responsive Design

All components are fully responsive using Material UI's Grid system:
- Mobile (xs): 0px+
- Tablet (sm): 600px+
- Desktop (md): 900px+
- Large (lg): 1200px+

## 🔨 Build

```bash
npm run build
npm run preview
```

## 📚 Resources

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Material UI Documentation](https://mui.com)
- [React Router Documentation](https://reactrouter.com)
