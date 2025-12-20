import apiClient from './api.js';

export const adminService = {
  login: (email, password) => apiClient.post('/admin/login', { email, password }),
  register: (name, email, password) => apiClient.post('/admin/register', { name, email, password }),
  getStats: () => apiClient.get('/admin/stats'),
};

export const therapistService = {
  login: (email, password) => apiClient.post('/therapists/login', { email, password }),
  getAllTherapists: () => apiClient.get('/therapists'),
  getTherapistById: (id) => apiClient.get(`/therapists/${id}`),
  createTherapist: (data) => apiClient.post('/therapists', data),
  updateTherapist: (id, data) => apiClient.put(`/therapists/${id}`, data),
  deleteTherapist: (id) => apiClient.delete(`/therapists/${id}`),
  getSchedule: (id) => apiClient.get(`/therapists/${id}/schedule`),
  createSchedule: (id, data) => apiClient.post(`/therapists/${id}/schedule`, data),
  createBreak: (id, data) => apiClient.post(`/therapists/${id}/breaks`, data),
  createDayOff: (id, data) => apiClient.post(`/therapists/${id}/dayoff`, data),
};

export const patientService = {
  getAllPatients: () => apiClient.get('/patients'),
  getPatientById: (id) => apiClient.get(`/patients/${id}`),
  createPatient: (data) => apiClient.post('/patients', data),
  updatePatient: (id, data) => apiClient.put(`/patients/${id}`, data),
  deletePatient: (id) => apiClient.delete(`/patients/${id}`),
  getAppointments: (id) => apiClient.get(`/patients/${id}/appointments`),
};

export const appointmentService = {
  getAppointments: (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.therapistId) params.append('therapistId', filters.therapistId);
    if (filters.patientId) params.append('patientId', filters.patientId);
    if (filters.date) params.append('date', filters.date);
    if (filters.status) params.append('status', filters.status);
    return apiClient.get(`/appointments?${params.toString()}`);
  },
  getAvailableSlots: (therapistId, date, duration = 60) => {
    return apiClient.get('/appointments/available-slots', {
      params: { therapistId, date, duration },
    });
  },
  createAppointment: (data) => apiClient.post('/appointments', data),
  updateAppointment: (id, data) => apiClient.put(`/appointments/${id}`, data),
  cancelAppointment: (id) => apiClient.patch(`/appointments/${id}/cancel`),
  deleteAppointment: (id) => apiClient.delete(`/appointments/${id}`),
};
