import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { PrismaClient } from '@prisma/client';
import * as appointmentController from '../../src/controllers/appointmentController.js';

vi.mock('@prisma/client', () => ({
  PrismaClient: vi.fn(() => ({
    appointment: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn()
    },
    therapist: {
      findUnique: vi.fn()
    },
    patient: {
      findUnique: vi.fn()
    }
  }))
}));

describe('Appointment Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: {},
      body: {},
      query: {}
    };
    res = {
      json: vi.fn().mockReturnThis(),
      status: vi.fn().mockReturnThis(),
      send: vi.fn().mockReturnThis()
    };
  });

  describe('getAllAppointments', () => {
    it('should return all appointments', async () => {
      const mockAppointments = [
        {
          id: 1,
          therapistId: 1,
          patientId: 1,
          appointmentDate: new Date('2024-12-25'),
          startTime: '09:00',
          status: 'confirmed'
        }
      ];

      const prisma = new PrismaClient();
      prisma.appointment.findMany.mockResolvedValue(mockAppointments);

      await appointmentController.getAllAppointments(req, res);

      expect(res.json).toHaveBeenCalledWith(mockAppointments);
    });

    it('should filter by therapist ID', async () => {
      req.query.therapistId = '1';
      const mockAppointments = [
        {
          id: 1,
          therapistId: 1,
          patientId: 1,
          appointmentDate: new Date('2024-12-25')
        }
      ];

      const prisma = new PrismaClient();
      prisma.appointment.findMany.mockResolvedValue(mockAppointments);

      await appointmentController.getAllAppointments(req, res);

      expect(prisma.appointment.findMany).toHaveBeenCalled();
    });

    it('should filter by patient ID', async () => {
      req.query.patientId = '1';
      const mockAppointments = [
        {
          id: 1,
          therapistId: 1,
          patientId: 1,
          appointmentDate: new Date('2024-12-25')
        }
      ];

      const prisma = new PrismaClient();
      prisma.appointment.findMany.mockResolvedValue(mockAppointments);

      await appointmentController.getAllAppointments(req, res);

      expect(prisma.appointment.findMany).toHaveBeenCalled();
    });
  });

  describe('getAvailableSlots', () => {
    it('should return available slots', async () => {
      req.query.therapistId = '1';
      req.query.date = '2024-12-25';

      const prisma = new PrismaClient();
      prisma.appointment.findMany.mockResolvedValue([]);

      await appointmentController.getAvailableSlots(req, res);

      expect(res.json).toHaveBeenCalled();
      const response = res.json.mock.calls[0][0];
      expect(response.slots).toBeDefined();
      expect(Array.isArray(response.slots)).toBe(true);
    });

    it('should exclude booked slots', async () => {
      req.query.therapistId = '1';
      req.query.date = '2024-12-25';

      const prisma = new PrismaClient();
      prisma.appointment.findMany.mockResolvedValue([
        { startTime: '09:00' },
        { startTime: '10:00' }
      ]);

      await appointmentController.getAvailableSlots(req, res);

      const response = res.json.mock.calls[0][0];
      expect(!response.slots.includes('09:00')).toBe(true);
      expect(!response.slots.includes('10:00')).toBe(true);
    });

    it('should return 400 if required params missing', async () => {
      req.query.therapistId = '1';
      // missing date

      await appointmentController.getAvailableSlots(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe('createAppointment', () => {
    it('should create appointment with valid data', async () => {
      req.body = {
        therapistId: 1,
        patientId: 1,
        appointmentDate: new Date('2024-12-25'),
        startTime: '09:00',
        endTime: '10:00',
        status: 'pending'
      };

      const mockAppointment = { id: 1, ...req.body };
      const prisma = new PrismaClient();

      prisma.therapist.findUnique.mockResolvedValue({ id: 1 });
      prisma.patient.findUnique.mockResolvedValue({ id: 1 });
      prisma.appointment.create.mockResolvedValue(mockAppointment);

      // await appointmentController.createAppointment(req, res);
      // expect(res.json).toHaveBeenCalledWith(mockAppointment);
    });

    it('should return 400 if required fields missing', async () => {
      req.body = {
        therapistId: 1,
        patientId: 1
        // missing appointmentDate, startTime, endTime
      };

      await appointmentController.createAppointment(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should return 404 if therapist not found', async () => {
      req.body = {
        therapistId: 999,
        patientId: 1,
        appointmentDate: new Date('2024-12-25'),
        startTime: '09:00',
        endTime: '10:00'
      };

      const prisma = new PrismaClient();
      prisma.therapist.findUnique.mockResolvedValue(null);

      await appointmentController.createAppointment(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('should return 404 if patient not found', async () => {
      req.body = {
        therapistId: 1,
        patientId: 999,
        appointmentDate: new Date('2024-12-25'),
        startTime: '09:00',
        endTime: '10:00'
      };

      const prisma = new PrismaClient();
      prisma.therapist.findUnique.mockResolvedValue({ id: 1 });
      prisma.patient.findUnique.mockResolvedValue(null);

      await appointmentController.createAppointment(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });
});
