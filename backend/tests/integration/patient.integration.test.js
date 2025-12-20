import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

describe('Patient Integration Tests', () => {
  let userId, patientId;

  beforeAll(async () => {
    // Cleanup before tests
    const existingUsers = await prisma.user.findMany({
      where: { email: { contains: 'test-patient' } }
    });

    for (const user of existingUsers) {
      const patient = await prisma.patient.findFirst({
        where: { userId: user.id }
      });
      if (patient) {
        await prisma.patient.delete({ where: { id: patient.id } });
      }
      await prisma.user.delete({ where: { id: user.id } });
    }
  });

  afterAll(async () => {
    // Cleanup after tests
    if (patientId) {
      await prisma.patient.delete({
        where: { id: patientId }
      }).catch(() => {});
    }

    if (userId) {
      await prisma.user.delete({
        where: { id: userId }
      }).catch(() => {});
    }

    await prisma.$disconnect();
  });

  describe('Patient Creation and Management', () => {
    it('should create a patient with user account', async () => {
      const hashedPassword = await bcrypt.hash('testpassword123', 10);

      const user = await prisma.user.create({
        data: {
          email: `test-patient-${Date.now()}@test.com`,
          password: hashedPassword,
          name: 'Test Patient',
          role: 'patient'
        }
      });

      userId = user.id;

      const patient = await prisma.patient.create({
        data: {
          userId: user.id,
          fullName: 'Test Patient',
          phone: '050123456',
          gender: 'Male',
          age: 30,
          medicalHistory: 'No known allergies'
        }
      });

      patientId = patient.id;

      expect(patient).toBeDefined();
      expect(patient.userId).toBe(user.id);
      expect(patient.fullName).toBe('Test Patient');
      expect(patient.phone).toBe('050123456');
    });

    it('should retrieve patient with user details', async () => {
      const patient = await prisma.patient.findUnique({
        where: { id: patientId },
        include: { user: true }
      });

      expect(patient).toBeDefined();
      expect(patient.user).toBeDefined();
      expect(patient.user.email).toMatch(/test-patient-.*@test.com/);
    });

    it('should update patient information', async () => {
      const updated = await prisma.patient.update({
        where: { id: patientId },
        data: {
          age: 31,
          medicalHistory: 'Updated history'
        }
      });

      expect(updated.age).toBe(31);
      expect(updated.medicalHistory).toBe('Updated history');
    });

    it('should find patients by phone number', async () => {
      const patients = await prisma.patient.findMany({
        where: { phone: '050123456' }
      });

      expect(patients.length).toBeGreaterThan(0);
      expect(patients.some(p => p.id === patientId)).toBe(true);
    });
  });

  describe('Patient with Appointments', () => {
    let therapistId;

    beforeAll(async () => {
      // Create a therapist for testing
      const therapistUser = await prisma.user.create({
        data: {
          email: `therapist-${Date.now()}@test.com`,
          password: 'hashedpassword',
          name: 'Test Therapist',
          role: 'therapist'
        }
      });

      const therapist = await prisma.therapist.create({
        data: {
          userId: therapistUser.id,
          specialization: 'Physical Therapy',
          experience: 5
        }
      });

      therapistId = therapist.id;
    });

    afterAll(async () => {
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
    });

    it('should retrieve patient with appointments', async () => {
      // Create test appointment
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

      const patient = await prisma.patient.findUnique({
        where: { id: patientId },
        include: {
          appointments: {
            include: { therapist: true }
          }
        }
      });

      expect(patient.appointments).toBeDefined();
      expect(patient.appointments.length).toBeGreaterThan(0);
    });
  });

  describe('Patient Validation', () => {
    it('should handle duplicate email error', async () => {
      const hashedPassword = await bcrypt.hash('testpassword123', 10);
      const email = `duplicate-${Date.now()}@test.com`;

      await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name: 'First Patient',
          role: 'patient'
        }
      });

      try {
        await prisma.user.create({
          data: {
            email,
            password: hashedPassword,
            name: 'Second Patient',
            role: 'patient'
          }
        });
        expect.fail('Should have thrown an error for duplicate email');
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });
});
