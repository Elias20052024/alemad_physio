import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database with authentication...');

  // Clear existing data
  await prisma.appointment.deleteMany();
  await prisma.therapistDayOff.deleteMany();
  await prisma.therapistBreak.deleteMany();
  await prisma.therapistSchedule.deleteMany();
  await prisma.patient.deleteMany();
  await prisma.therapist.deleteMany();
  await prisma.admin.deleteMany();

  // Hash passwords
  const hashedPassword1 = await bcrypt.hash('Patient@123', 10);
  const hashedPassword2 = await bcrypt.hash('Patient@456', 10);
  const hashedPassword3 = await bcrypt.hash('Patient@789', 10);
  const hashedPassword4 = await bcrypt.hash('Patient@111', 10);
  const hashedPassword5 = await bcrypt.hash('Patient@222', 10);

  // Create patients with email and password
  const patient1 = await prisma.patient.create({
    data: {
      fullName: 'Ahmed Hassan',
      email: 'ahmed@example.com',
      password: hashedPassword1,
      phone: '+966501234567',
      age: 35,
      gender: 'Male',
      medicalHistory: 'Back pain, minor injuries'
    }
  });

  const patient2 = await prisma.patient.create({
    data: {
      fullName: 'Fatima Ali',
      email: 'fatima@example.com',
      password: hashedPassword2,
      phone: '+966502345678',
      age: 28,
      gender: 'Female',
      medicalHistory: 'Sports injury recovery'
    }
  });

  const patient3 = await prisma.patient.create({
    data: {
      fullName: 'Mohammad Karim',
      email: 'mohammad@example.com',
      password: hashedPassword3,
      phone: '+966503456789',
      age: 45,
      gender: 'Male',
      medicalHistory: 'Post-surgery rehabilitation'
    }
  });

  const patient4 = await prisma.patient.create({
    data: {
      fullName: 'Layla Ibrahim',
      email: 'layla@example.com',
      password: hashedPassword4,
      phone: '+966504567890',
      age: 32,
      gender: 'Female',
      medicalHistory: 'Chronic pain management'
    }
  });

  const patient5 = await prisma.patient.create({
    data: {
      fullName: 'Khalid Mansour',
      email: 'khalid@example.com',
      password: hashedPassword5,
      phone: '+966505678901',
      age: 50,
      gender: 'Male',
      medicalHistory: 'General wellness'
    }
  });

  console.log('✅ Created 5 patients');

  // Create therapists
  const therapist1 = await prisma.therapist.create({
    data: {
      name: 'Dr. Ahmed Saleh',
      specialty: 'Physical Therapy',
      email: 'dr.ahmed@example.com',
      phone: '+966551111111',
      status: 'active'
    }
  });

  const therapist2 = await prisma.therapist.create({
    data: {
      name: 'Dr. Fatima Al-Dosari',
      specialty: 'Sports Medicine',
      email: 'dr.fatima@example.com',
      phone: '+966552222222',
      status: 'active'
    }
  });

  const therapist3 = await prisma.therapist.create({
    data: {
      name: 'Dr. Mohammed Al-Otaibi',
      specialty: 'Rehabilitation',
      email: 'dr.mohammed@example.com',
      phone: '+966553333333',
      status: 'active'
    }
  });

  console.log('✅ Created 3 therapists');

  // Create therapist schedules (Mon-Fri, 9 AM - 5 PM)
  for (let i = 0; i < 5; i++) {
    await prisma.therapistSchedule.create({
      data: {
        therapistId: therapist1.id,
        dayOfWeek: i,
        startTime: '09:00',
        endTime: '17:00'
      }
    });
    await prisma.therapistSchedule.create({
      data: {
        therapistId: therapist2.id,
        dayOfWeek: i,
        startTime: '09:00',
        endTime: '17:00'
      }
    });
    await prisma.therapistSchedule.create({
      data: {
        therapistId: therapist3.id,
        dayOfWeek: i,
        startTime: '09:00',
        endTime: '17:00'
      }
    });
  }

  console.log('✅ Created therapist schedules');

  // Create appointments
  const today = new Date();
  const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
  const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

  const appointment1 = await prisma.appointment.create({
    data: {
      patientId: patient1.id,
      therapistId: therapist1.id,
      date: tomorrow,
      time: '10:00',
      duration: 60,
      service: 'Adult Physiotherapy',
      status: 'scheduled'
    }
  });

  const appointment2 = await prisma.appointment.create({
    data: {
      patientId: patient2.id,
      therapistId: therapist2.id,
      date: tomorrow,
      time: '14:30',
      duration: 45,
      service: 'Sports Medicine',
      status: 'scheduled'
    }
  });

  const appointment3 = await prisma.appointment.create({
    data: {
      patientId: patient3.id,
      therapistId: therapist3.id,
      date: nextWeek,
      time: '11:00',
      duration: 60,
      service: 'Rehabilitation',
      status: 'pending'
    }
  });

  const appointment4 = await prisma.appointment.create({
    data: {
      patientId: patient4.id,
      therapistId: therapist1.id,
      date: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000), // Last week
      time: '09:00',
      duration: 60,
      service: 'Pediatric Therapy',
      status: 'completed'
    }
  });

  console.log('✅ Created 4 appointments');

  console.log('🎉 Database seeding completed successfully!');
  console.log('\n📊 Summary:');
  console.log(`   • Patients: 5`);
  console.log(`   • Therapists: 3`);
  console.log(`   • Appointments: 4`);
  console.log('\n🔐 Test Credentials:');
  console.log(`   • Patient 1: ahmed@example.com / Patient@123`);
  console.log(`   • Patient 2: fatima@example.com / Patient@456`);
  console.log(`   • Patient 3: mohammad@example.com / Patient@789`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
