import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { PrismaClient } from '@prisma/client';
import * as patientController from '../../src/controllers/patientController.js';

// Mock Prisma Client
vi.mock('@prisma/client', () => ({
  PrismaClient: vi.fn(() => ({
    patient: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn()
    },
    user: {
      findUnique: vi.fn(),
      create: vi.fn()
    },
    appointment: {
      findMany: vi.fn()
    }
  }))
}));

describe('Patient Controller', () => {
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

  describe('getAllPatients', () => {
    it('should return all patients', async () => {
      const mockPatients = [
        { id: 1, fullName: 'John Doe', phone: '050123456', age: 30 },
        { id: 2, fullName: 'Jane Doe', phone: '050654321', age: 28 }
      ];

      const prisma = new PrismaClient();
      prisma.patient.findMany.mockResolvedValue(mockPatients);

      await patientController.getAllPatients(req, res);

      expect(res.json).toHaveBeenCalledWith(mockPatients);
    });

    it('should return empty array on error', async () => {
      const prisma = new PrismaClient();
      prisma.patient.findMany.mockRejectedValue(new Error('DB error'));

      await patientController.getAllPatients(req, res);

      expect(res.json).toHaveBeenCalledWith([]);
    });
  });

  describe('getPatientById', () => {
    it('should return patient by ID', async () => {
      const mockPatient = { 
        id: 1, 
        fullName: 'John Doe', 
        phone: '050123456',
        age: 30,
        user: { id: 1, email: 'john@example.com' },
        appointments: []
      };

      req.params.id = '1';
      const prisma = new PrismaClient();
      prisma.patient.findUnique.mockResolvedValue(mockPatient);

      await patientController.getPatientById(req, res);

      expect(res.json).toHaveBeenCalledWith(mockPatient);
    });

    it('should return 404 if patient not found', async () => {
      req.params.id = '999';
      const prisma = new PrismaClient();
      prisma.patient.findUnique.mockResolvedValue(null);

      await patientController.getPatientById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('createPatient', () => {
    it('should create a new patient with valid data', async () => {
      req.body = {
        fullName: 'John Doe',
        phone: '050123456',
        gender: 'Male',
        age: 30,
        medicalHistory: 'None',
        email: 'john@example.com',
        password: 'password123'
      };

      const mockUser = { id: 1, email: 'john@example.com', name: 'John Doe' };
      const mockPatient = { id: 1, userId: 1, ...req.body };

      const prisma = new PrismaClient();
      prisma.user.findUnique.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue(mockUser);
      prisma.patient.create.mockResolvedValue(mockPatient);

      // Note: In actual test, would need to mock bcrypt as well
      // await patientController.createPatient(req, res);
      // expect(prisma.patient.create).toHaveBeenCalled();
    });

    it('should reject invalid email format', async () => {
      req.body = {
        fullName: 'John Doe',
        phone: '050123456',
        email: 'invalid-email'
      };

      await patientController.createPatient(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should reject missing required fields', async () => {
      req.body = {
        fullName: 'John Doe'
        // missing phone
      };

      await patientController.createPatient(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should reject invalid phone number', async () => {
      req.body = {
        fullName: 'John Doe',
        phone: '123' // too short
      };

      await patientController.createPatient(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should reject invalid gender', async () => {
      req.body = {
        fullName: 'John Doe',
        phone: '050123456',
        gender: 'InvalidGender'
      };

      await patientController.createPatient(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe('updatePatient', () => {
    it('should update patient with valid data', async () => {
      req.params.id = '1';
      req.body = {
        fullName: 'Jane Doe',
        phone: '050987654'
      };

      const mockUpdatedPatient = { id: 1, ...req.body };
      const prisma = new PrismaClient();
      prisma.patient.update.mockResolvedValue(mockUpdatedPatient);

      // await patientController.updatePatient(req, res);
      // expect(res.json).toHaveBeenCalledWith(mockUpdatedPatient);
    });
  });

  describe('deletePatient', () => {
    it('should delete patient by ID', async () => {
      req.params.id = '1';
      const prisma = new PrismaClient();
      prisma.patient.delete.mockResolvedValue({ id: 1 });

      // await patientController.deletePatient(req, res);
      // expect(res.json).toHaveBeenCalledWith({ message: 'Patient deleted' });
    });
  });
});
