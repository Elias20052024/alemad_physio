import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database with authentication...');

  // Clear existing data (in correct order to respect foreign keys)
  await prisma.notification.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.therapistBreak.deleteMany();
  await prisma.therapistSchedule.deleteMany();
  await prisma.patient.deleteMany();
  await prisma.therapist.deleteMany();
  await prisma.admin.deleteMany();
  await prisma.user.deleteMany();

  // Hash passwords
  const hashedPassword1 = await bcrypt.hash('Patient@123', 10);
  const hashedPassword2 = await bcrypt.hash('Patient@456', 10);
  const hashedPassword3 = await bcrypt.hash('Patient@789', 10);
  const hashedPassword4 = await bcrypt.hash('Patient@111', 10);
  const hashedPassword5 = await bcrypt.hash('Patient@222', 10);

  // Create User accounts for patients
  const user1 = await prisma.user.create({
    data: {
      email: 'ahmed@example.com',
      password: hashedPassword1,
      name: 'Ahmed Hassan',
      role: 'patient'
    }
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'fatima@example.com',
      password: hashedPassword2,
      name: 'Fatima Ali',
      role: 'patient'
    }
  });

  const user3 = await prisma.user.create({
    data: {
      email: 'mohammad@example.com',
      password: hashedPassword3,
      name: 'Mohammad Karim',
      role: 'patient'
    }
  });

  const user4 = await prisma.user.create({
    data: {
      email: 'layla@example.com',
      password: hashedPassword4,
      name: 'Layla Ibrahim',
      role: 'patient'
    }
  });

  const user5 = await prisma.user.create({
    data: {
      email: 'khalid@example.com',
      password: hashedPassword5,
      name: 'Khalid Mansour',
      role: 'patient'
    }
  });

  // Create Patient records linked to Users
  const patient1 = await prisma.patient.create({
    data: {
      userId: user1.id,
      phone: '+966501234567',
      age: 35,
      gender: 'Male',
      medicalHistory: 'Back pain, minor injuries'
    }
  });

  const patient2 = await prisma.patient.create({
    data: {
      userId: user2.id,
      phone: '+966502345678',
      age: 28,
      gender: 'Female',
      medicalHistory: 'Sports injury recovery'
    }
  });

  const patient3 = await prisma.patient.create({
    data: {
      userId: user3.id,
      phone: '+966503456789',
      age: 45,
      gender: 'Male',
      medicalHistory: 'Post-surgery rehabilitation'
    }
  });

  const patient4 = await prisma.patient.create({
    data: {
      userId: user4.id,
      phone: '+966504567890',
      age: 32,
      gender: 'Female',
      medicalHistory: 'Chronic pain management'
    }
  });

  const patient5 = await prisma.patient.create({
    data: {
      userId: user5.id,
      phone: '+966505678901',
      age: 50,
      gender: 'Male',
      medicalHistory: 'General wellness'
    }
  });

  console.log('✅ Created 5 patients with User accounts');

  // Create User accounts for therapists
  const therapistUser1 = await prisma.user.create({
    data: {
      email: 'dr.ahmed@example.com',
      password: await bcrypt.hash('Therapist@123', 10),
      name: 'Dr. Ahmed Saleh',
      role: 'therapist'
    }
  });

  const therapistUser2 = await prisma.user.create({
    data: {
      email: 'dr.fatima@example.com',
      password: await bcrypt.hash('Therapist@456', 10),
      name: 'Dr. Fatima Al-Dosari',
      role: 'therapist'
    }
  });

  const therapistUser3 = await prisma.user.create({
    data: {
      email: 'dr.mohammed@example.com',
      password: await bcrypt.hash('Therapist@789', 10),
      name: 'Dr. Mohammed Al-Otaibi',
      role: 'therapist'
    }
  });

  // Create Therapist records linked to Users
  const therapist1 = await prisma.therapist.create({
    data: {
      userId: therapistUser1.id,
      phone: '+966551111111',
      specialization: 'Physical Therapy'
    }
  });

  const therapist2 = await prisma.therapist.create({
    data: {
      userId: therapistUser2.id,
      phone: '+966552222222',
      specialization: 'Sports Medicine'
    }
  });

  const therapist3 = await prisma.therapist.create({
    data: {
      userId: therapistUser3.id,
      phone: '+966553333333',
      specialization: 'Rehabilitation'
    }
  });

  console.log('✅ Created 3 therapists with User accounts');

  // Create User account for admin
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      password: await bcrypt.hash('Admin@123', 10),
      name: 'Admin User',
      role: 'admin'
    }
  });

  // Create Admin record linked to User
  const admin = await prisma.admin.create({
    data: {
      userId: adminUser.id
    }
  });

  console.log('✅ Created admin account');

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
      appointmentDate: tomorrow,
      startTime: '10:00',
      endTime: '11:00',
      status: 'scheduled'
    }
  });

  const appointment2 = await prisma.appointment.create({
    data: {
      patientId: patient2.id,
      therapistId: therapist2.id,
      appointmentDate: tomorrow,
      startTime: '14:30',
      endTime: '15:15',
      status: 'scheduled'
    }
  });

  const appointment3 = await prisma.appointment.create({
    data: {
      patientId: patient3.id,
      therapistId: therapist3.id,
      appointmentDate: nextWeek,
      startTime: '11:00',
      endTime: '12:00',
      status: 'pending'
    }
  });

  const appointment4 = await prisma.appointment.create({
    data: {
      patientId: patient4.id,
      therapistId: therapist1.id,
      appointmentDate: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000),
      startTime: '09:00',
      endTime: '10:00',
      status: 'completed'
    }
  });

  console.log('✅ Created 4 appointments');

  console.log('🎉 Database seeding completed successfully!');
  console.log('\n📊 Summary:');
  console.log(`   • Patients: 5`);
  console.log(`   • Therapists: 3`);
  console.log(`   • Admin: 1`);
  console.log(`   • Appointments: 4`);
  console.log('\n🔐 Test Credentials:');
  console.log('\n   👨‍⚕️ ADMIN:');
  console.log(`   • Email: admin@example.com`);
  console.log(`   • Password: Admin@123`);
  console.log(`   • URL: http://localhost:3000/admin/login`);
  console.log('\n   🏥 PATIENTS:');
  console.log(`   • Patient 1: ahmed@example.com / Patient@123`);
  console.log(`   • Patient 2: fatima@example.com / Patient@456`);
  console.log(`   • Patient 3: mohammad@example.com / Patient@789`);
  console.log(`   • Patient 4: layla@example.com / Patient@111`);
  console.log(`   • Patient 5: khalid@example.com / Patient@222`);
  console.log(`   • URL: http://localhost:3000/login (select Patient tab)`);
  console.log('\n   👨‍⚕️ THERAPISTS:');
  console.log(`   • Therapist 1: dr.ahmed@example.com / Therapist@123`);
  console.log(`   • Therapist 2: dr.fatima@example.com / Therapist@456`);
  console.log(`   • Therapist 3: dr.mohammed@example.com / Therapist@789`);
  console.log(`   • URL: http://localhost:3000/login (select Therapist tab`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
