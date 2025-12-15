import React, { useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider as MUIThemeProvider } from '@mui/material/styles';
import { CssBaseline, Box, Drawer, IconButton, useMediaQuery } from '@mui/material';
import { useTheme as useMuiTheme } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';

import { ThemeProvider, useTheme } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { lightTheme, darkTheme } from './theme/theme';
import Header from './components/Header';
import Footer from './components/Footer';

// Public Pages
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Contact from './pages/Contact';
import TherapistList from './pages/TherapistList';

// Appointment Pages
import BookingPage from './appointments/BookingPage';

// Admin Pages
import AdminLogin from './admin/AdminLogin';
import AdminDashboard from './admin/AdminDashboard';
import ManageTherapists from './admin/ManageTherapists';
import ManagePatients from './admin/ManagePatients';
import ManageAppointments from './admin/ManageAppointments';

// User Portal Pages
import Login from './pages/Login';
import PatientDashboard from './pages/PatientDashboard';
import TherapistPortal from './pages/TherapistPortal';
import AdminPortal from './pages/AdminPortal';
import ProtectedRoute from './components/ProtectedRoute';

// Admin Layout Component
const AdminLayout = ({ children }) => {
  const { isDark, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));

  const sidebarContent = (
    <>
      <Box sx={{ mb: 3 }}>
        <h2 style={{ fontSize: isMobile ? '1.25rem' : '1.5rem', margin: 0 }}>Admin Panel</h2>
      </Box>
      <nav>
        <a href="/admin/dashboard" style={{ display: 'block', padding: '12px 0', textDecoration: 'none', fontSize: isMobile ? '0.95rem' : '1rem', color: isDark ? 'white' : 'black' }}>Dashboard</a>
        <a href="/admin/therapists" style={{ display: 'block', padding: '12px 0', textDecoration: 'none', fontSize: isMobile ? '0.95rem' : '1rem', color: isDark ? 'white' : 'black' }}>Manage Therapists</a>
        <a href="/admin/patients" style={{ display: 'block', padding: '12px 0', textDecoration: 'none', fontSize: isMobile ? '0.95rem' : '1rem', color: isDark ? 'white' : 'black' }}>Manage Patients</a>
        <a href="/admin/appointments" style={{ display: 'block', padding: '12px 0', textDecoration: 'none', fontSize: isMobile ? '0.95rem' : '1rem', color: isDark ? 'white' : 'black' }}>Manage Appointments</a>
        <button
          onClick={toggleTheme}
          style={{ display: 'block', padding: '12px 0', marginTop: '20px', background: 'none', border: 'none', cursor: 'pointer', fontSize: isMobile ? '0.95rem' : '1rem', color: isDark ? 'white' : 'black' }}
        >
          {isDark ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
        <a href="/" onClick={() => localStorage.removeItem('token')} style={{ display: 'block', padding: '12px 0', marginTop: '20px', textDecoration: 'none', color: 'red', fontSize: isMobile ? '0.95rem' : '1rem' }}>Logout</a>
      </nav>
    </>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', flexDirection: { xs: 'column', md: 'row' } }}>
      {isMobile && (
        <Box sx={{ p: 2, borderBottom: '1px solid #ddd', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Admin Panel</h2>
          <IconButton onClick={() => setSidebarOpen(!sidebarOpen)}>
            <MenuIcon />
          </IconButton>
        </Box>
      )}

      {/* Sidebar */}
      {isMobile ? (
        <Drawer
          anchor="left"
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          sx={{
            '& .MuiDrawer-paper': {
              width: 250,
              backgroundColor: isDark ? '#1e1e1e' : '#f5f5f5',
              p: 2,
            },
          }}
        >
          {sidebarContent}
        </Drawer>
      ) : (
        <Box sx={{
          width: { xs: '100%', md: 250 },
          backgroundColor: isDark ? '#1e1e1e' : '#f5f5f5',
          p: 2,
          borderRight: '1px solid #ddd',
        }}>
          {sidebarContent}
        </Box>
      )}

      {/* Main Content */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        {children}
      </Box>
    </Box>
  );
};

// Protected Route Component for Admin
const AdminProtectedRoute = ({ element }) => {
  const token = localStorage.getItem('token');
  return token ? element : <Navigate to="/admin/login" />;
};

const AppContent = () => {
  const { isDark } = useTheme();
  const currentTheme = isDark ? darkTheme : lightTheme;

  return (
    <MUIThemeProvider theme={currentTheme}>
      <CssBaseline />
      <Routes>
        {/* Public Routes with Header/Footer */}
        <Route
          path="/*"
          element={
            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
              <Header />
              <Box sx={{ flex: 1 }}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/services" element={<Services />} />
                  <Route path="/booking" element={<BookingPage />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/therapists" element={<TherapistList />} />
                  
                  {/* User Portal Routes */}
                  <Route path="/login" element={<Login />} />
                  <Route
                    path="/patient-dashboard"
                    element={
                      <ProtectedRoute allowedRoles={['patient']}>
                        <PatientDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/therapist-portal"
                    element={
                      <ProtectedRoute allowedRoles={['therapist']}>
                        <TherapistPortal />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin-portal"
                    element={
                      <ProtectedRoute allowedRoles={['admin']}>
                        <AdminPortal />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </Box>
              <Footer />
            </Box>
          }
        />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/dashboard"
          element={<AdminProtectedRoute element={<AdminLayout><AdminDashboard /></AdminLayout>} />}
        />
        <Route
          path="/admin/therapists"
          element={<AdminProtectedRoute element={<AdminLayout><ManageTherapists /></AdminLayout>} />}
        />
        <Route
          path="/admin/patients"
          element={<AdminProtectedRoute element={<AdminLayout><ManagePatients /></AdminLayout>} />}
        />
        <Route
          path="/admin/appointments"
          element={<AdminProtectedRoute element={<AdminLayout><ManageAppointments /></AdminLayout>} />}
        />
      </Routes>
    </MUIThemeProvider>
  );
};

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <Router>
          <AppContent />
        </Router>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;

