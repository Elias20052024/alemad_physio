import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// Debug log
console.log('🔌 API URL:', API_BASE_URL);
console.log('📝 VITE_API_URL env:', import.meta.env.VITE_API_URL);

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
apiClient.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Handle responses
apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

// ============================================
// ADMIN ENDPOINTS
// ============================================
export const adminAPI = {
  login: (email, password) => apiClient.post('/admin/login', { email, password }),
  register: (name, email, password) => apiClient.post('/admin/register', { name, email, password }),
  getProfile: () => apiClient.get('/admin/profile'),
  updateProfile: (data) => apiClient.put('/admin/profile', data),
};

// ============================================
// PATIENT ENDPOINTS
// ============================================
export const patientAPI = {
  login: (email, password) => apiClient.post('/patients/login', { email, password }),
  register: (fullName, email, password, phone, age, gender) => 
    apiClient.post('/patients/register', { fullName, email, password, phone, age, gender }),
  getAll: () => apiClient.get('/patients'),
  getById: (id) => apiClient.get(`/patients/${id}`),
  create: (data) => apiClient.post('/patients', data),
  update: (id, data) => apiClient.put(`/patients/${id}`, data),
  delete: (id) => apiClient.delete(`/patients/${id}`),
  getByPhone: (phone) => apiClient.get(`/patients/phone/${phone}`),
};

// ============================================
// THERAPIST ENDPOINTS
// ============================================
export const therapistAPI = {
  getAll: () => apiClient.get('/therapists'),
  getById: (id) => apiClient.get(`/therapists/${id}`),
  create: (data) => apiClient.post('/therapists', data),
  update: (id, data) => apiClient.put(`/therapists/${id}`, data),
  delete: (id) => apiClient.delete(`/therapists/${id}`),
  getSchedule: (id) => apiClient.get(`/therapists/${id}/schedule`),
  setSchedule: (id, schedule) => apiClient.post(`/therapists/${id}/schedule`, schedule),
  addDayOff: (id, date) => apiClient.post(`/therapists/${id}/days-off`, { date }),
  removeDayOff: (id, date) => apiClient.delete(`/therapists/${id}/days-off/${date}`),
  addBreak: (id, data) => apiClient.post(`/therapists/${id}/breaks`, data),
  removeBreak: (id, breakId) => apiClient.delete(`/therapists/${id}/breaks/${breakId}`),
};

// ============================================
// APPOINTMENT ENDPOINTS
// ============================================
export const appointmentAPI = {
  getAll: (filters) => apiClient.get('/appointments', { params: filters }),
  getById: (id) => apiClient.get(`/appointments/${id}`),
  create: (data) => apiClient.post('/appointments', data),
  update: (id, data) => apiClient.put(`/appointments/${id}`, data),
  delete: (id) => apiClient.delete(`/appointments/${id}`),
  getAvailableSlots: (therapistId, date, duration) => 
    apiClient.get('/appointments/available-slots', { 
      params: { therapistId, date, duration } 
    }),
  updateStatus: (id, status) => apiClient.patch(`/appointments/${id}/status`, { status }),
  reschedule: (id, data) => apiClient.post(`/appointments/${id}/reschedule`, data),
};

// ============================================
// HEALTH CHECK
// ============================================
export const healthCheck = () => apiClient.get('/health');

export default apiClient;
