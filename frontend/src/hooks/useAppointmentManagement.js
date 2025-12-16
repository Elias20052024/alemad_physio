import { useState, useCallback } from 'react';
import { appointmentAPI, patientAPI, therapistAPI } from '@/services/api';

export const useAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAppointments = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await appointmentAPI.getAll(filters);
      setAppointments(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const bookAppointment = useCallback(async (appointmentData) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await appointmentAPI.create(appointmentData);
      setAppointments([...appointments, data]);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [appointments]);

  const updateAppointment = useCallback(async (id, updates) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await appointmentAPI.update(id, updates);
      setAppointments(appointments.map(a => a.id === id ? data : a));
      return data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [appointments]);

  const cancelAppointment = useCallback(async (id) => {
    return updateAppointment(id, { status: 'cancelled' });
  }, [updateAppointment]);

  const deleteAppointment = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await appointmentAPI.delete(id);
      setAppointments(appointments.filter(a => a.id !== id));
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [appointments]);

  const getAvailableSlots = useCallback(async (therapistId, date, duration = 60) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await appointmentAPI.getAvailableSlots(therapistId, date, duration);
      return data.slots || [];
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    appointments,
    loading,
    error,
    fetchAppointments,
    bookAppointment,
    updateAppointment,
    cancelAppointment,
    deleteAppointment,
    getAvailableSlots,
  };
};

export const usePatients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPatients = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await patientAPI.getAll();
      setPatients(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createPatient = useCallback(async (patientData) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await patientAPI.create(patientData);
      setPatients([...patients, data]);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [patients]);

  const updatePatient = useCallback(async (id, updates) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await patientAPI.update(id, updates);
      setPatients(patients.map(p => p.id === id ? data : p));
      return data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [patients]);

  const deletePatient = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await patientAPI.delete(id);
      setPatients(patients.filter(p => p.id !== id));
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [patients]);

  return {
    patients,
    loading,
    error,
    fetchPatients,
    createPatient,
    updatePatient,
    deletePatient,
  };
};

export const useTherapists = () => {
  const [therapists, setTherapists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTherapists = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await therapistAPI.getAll();
      setTherapists(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createTherapist = useCallback(async (therapistData) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await therapistAPI.create(therapistData);
      setTherapists([...therapists, data]);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [therapists]);

  const updateTherapist = useCallback(async (id, updates) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await therapistAPI.update(id, updates);
      setTherapists(therapists.map(t => t.id === id ? data : t));
      return data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [therapists]);

  return {
    therapists,
    loading,
    error,
    fetchTherapists,
    createTherapist,
    updateTherapist,
  };
};
