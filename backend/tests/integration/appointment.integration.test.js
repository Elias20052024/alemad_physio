import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('Appointment Integration Tests', () => {
  let therapistId, patientId, appointmentId;

  beforeAll(async () => {
    // Setup: Create a therapist and patient for testing
    const user1 = await prisma.user.create({
      data: {
        email: `therapist-${Date.now()}@test.com`,
        password: 'hashedpassword',
        name: 'Test Therapist',
        role: 'therapist'
      }
    });

    const therapist = await prisma.therapist.create({
      data: {
        userId: user1.id,
        specialization: 'Physical Therapy',
        experience: 5
      }
    });

    therapistId = therapist.id;

    const user2 = await prisma.user.create({
      data: {
        email: `patient-${Date.now()}@test.com`,
        password: 'hashedpassword',
        name: 'Test Patient',
        role: 'patient'
      }
    });

    const patient = await prisma.patient.create({
      data: {
        userId: user2.id,
        fullName: 'Test Patient',
        phone: '050123456',
        age: 30
      }
    });

    patientId = patient.id;
  });

  afterAll(async () => {
    // Cleanup
    if (appointmentId) {
      await prisma.appointment.delete({
        where: { id: appointmentId }
      }).catch(() => {});
    }

    if (patientId) {
      const patient = await prisma.patient.findUnique({
        where: { id: patientId },
        include: { user: true }
      });
      if (patient?.user) {
        await prisma.user.delete({ where: { id: patient.user.id } }).catch(() => {});
      }
      await prisma.patient.delete({ where: { id: patientId } }).catch(() => {});
    }

    if (therapistId) {
      const therapist = await prisma.therapist.findUnique({
        where: { id: therapistId },
        include: { user: true }
      });
      if (therapist?.user) {
        await prisma.user.delete({ where: { id: therapist.user.id } }).catch(() => {});
      }
      await prisma.therapist.delete({ where: { id: therapistId } }).catch(() => {});
    }

    await prisma.$disconnect();
  });

  describe('Appointment CRUD Operations', () => {
    it('should create an appointment', async () => {
      const appointmentData = {
        therapistId,
        patientId,
        appointmentDate: new Date('2024-12-25'),
        startTime: '09:00',
        endTime: '10:00',
        status: 'pending',
        notes: 'Test appointment'
      };

      const appointment = await prisma.appointment.create({
        data: appointmentData
      });

      appointmentId = appointment.id;

      expect(appointment).toBeDefined();
      expect(appointment.therapistId).toBe(therapistId);
      expect(appointment.patientId).toBe(patientId);
      expect(appointment.status).toBe('pending');
    });

    it('should read an appointment', async () => {
      const appointment = await prisma.appointment.findUnique({
        where: { id: appointmentId }
      });

      expect(appointment).toBeDefined();
      expect(appointment.id).toBe(appointmentId);
    });

    it('should update an appointment', async () => {
      const updated = await prisma.appointment.update({
        where: { id: appointmentId },
        data: { status: 'confirmed' }
      });

      expect(updated.status).toBe('confirmed');
    });

    it('should delete an appointment', async () => {
      const deleted = await prisma.appointment.delete({
        where: { id: appointmentId }
      });

      expect(deleted.id).toBe(appointmentId);

      const found = await prisma.appointment.findUnique({
        where: { id: appointmentId }
      });

      expect(found).toBeNull();
    });
  });

  describe('Appointment Queries', () => {
    beforeAll(async () => {
      // Create test appointments
      await prisma.appointment.create({
        data: {
          therapistId,
          patientId,
          appointmentDate: new Date('2024-12-25'),
          startTime: '09:00',
          endTime: '10:00',
          status: 'confirmed'
        }
      });

      await prisma.appointment.create({
        data: {
          therapistId,
          patientId,
          appointmentDate: new Date('2024-12-26'),
          startTime: '10:00',
          endTime: '11:00',
          status: 'cancelled'
        }
      });
    });

    it('should find appointments by therapist ID', async () => {
      const appointments = await prisma.appointment.findMany({
        where: { therapistId }
      });

      expect(appointments.length).toBeGreaterThan(0);
      expect(appointments.every(apt => apt.therapistId === therapistId)).toBe(true);
    });

    it('should find appointments by patient ID', async () => {
      const appointments = await prisma.appointment.findMany({
        where: { patientId }
      });

      expect(appointments.length).toBeGreaterThan(0);
      expect(appointments.every(apt => apt.patientId === patientId)).toBe(true);
    });

    it('should find appointments by status', async () => {
      const confirmed = await prisma.appointment.findMany({
        where: { status: 'confirmed' }
      });

      expect(confirmed.every(apt => apt.status === 'confirmed')).toBe(true);
    });
  });
});
