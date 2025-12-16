import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await prisma.appointment.deleteMany();
    await prisma.therapistDayOff.deleteMany();
    await prisma.therapistBreak.deleteMany();
    await prisma.therapistSchedule.deleteMany();
    await prisma.patient.deleteMany();
    await prisma.therapist.deleteMany();
    await prisma.admin.deleteMany();

    // Create Admin
    console.log('👤 Creating admin...');
    const admin = await prisma.admin.create({
      data: {
        name: 'Admin User',
        email: 'admin@alemad.com',
        password: await bcrypt.hash('admin123', 10),
      },
    });
    console.log('✅ Admin created:', admin);

    // Create Therapists
    console.log('👨‍⚕️ Creating therapists...');
    const therapists = await Promise.all([
      prisma.therapist.create({
        data: {
          name: 'Dr. Ahmed',
          specialty: 'Physiotherapy',
          email: 'ahmed@alemad.com',
          phone: '+966501234567',
          status: 'active',
        },
      }),
      prisma.therapist.create({
        data: {
          name: 'Dr. Fatima',
          specialty: 'Sports Medicine',
          email: 'fatima@alemad.com',
          phone: '+966502345678',
          status: 'active',
        },
      }),
      prisma.therapist.create({
        data: {
          name: 'Dr. Mohammed',
          specialty: 'Rehabilitation',
          email: 'mohammed@alemad.com',
          phone: '+966503456789',
          status: 'active',
        },
      }),
    ]);
    console.log(`✅ ${therapists.length} therapists created`);

    // Create Therapist Schedules (Monday-Friday: 9 AM - 5 PM)
    console.log('📅 Creating therapist schedules...');
    for (const therapist of therapists) {
      for (let day = 0; day < 5; day++) {
        // Monday to Friday
        await prisma.therapistSchedule.create({
          data: {
            therapistId: therapist.id,
            dayOfWeek: day,
            startTime: '09:00',
            endTime: '17:00',
          },
        });
      }
    }
    console.log('✅ Schedules created');

    // Create Patients
    console.log('👥 Creating patients...');
    const patients = await Promise.all([
      prisma.patient.create({
        data: {
          fullName: 'Ahmed Al-Rashid',
          phone: '+966551234567',
          age: 35,
          gender: 'Male',
          medicalHistory: 'Back pain, shoulder injury',
        },
      }),
      prisma.patient.create({
        data: {
          fullName: 'Fatima Al-Shehri',
          phone: '+966552345678',
          age: 28,
          gender: 'Female',
          medicalHistory: 'Knee pain',
        },
      }),
      prisma.patient.create({
        data: {
          fullName: 'Mohammed Al-Dossary',
          phone: '+966553456789',
          age: 42,
          gender: 'Male',
          medicalHistory: 'Sports injury, rehabilitation needed',
        },
      }),
      prisma.patient.create({
        data: {
          fullName: 'Noor Al-Mansouri',
          phone: '+966554567890',
          age: 31,
          gender: 'Female',
          medicalHistory: 'Neck strain',
        },
      }),
      prisma.patient.create({
        data: {
          fullName: 'Khalid Al-Otaibi',
          phone: '+966555678901',
          age: 25,
          gender: 'Male',
          medicalHistory: 'Ankle sprain',
        },
      }),
    ]);
    console.log(`✅ ${patients.length} patients created`);

    // Create Appointments
    console.log('📅 Creating appointments...');
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const appointments = await Promise.all([
      prisma.appointment.create({
        data: {
          therapistId: therapists[0].id,
          patientId: patients[0].id,
          service: 'Physiotherapy',
          date: tomorrow,
          time: '10:00',
          status: 'scheduled',
          duration: 60,
        },
      }),
      prisma.appointment.create({
        data: {
          therapistId: therapists[1].id,
          patientId: patients[1].id,
          service: 'Sports Massage',
          date: tomorrow,
          time: '14:00',
          status: 'scheduled',
          duration: 45,
        },
      }),
      prisma.appointment.create({
        data: {
          therapistId: therapists[0].id,
          patientId: patients[2].id,
          service: 'Rehabilitation',
          date: tomorrow,
          time: '11:00',
          status: 'scheduled',
          duration: 60,
        },
      }),
      prisma.appointment.create({
        data: {
          therapistId: therapists[2].id,
          patientId: patients[3].id,
          service: 'Manual Therapy',
          date: tomorrow,
          time: '15:00',
          status: 'scheduled',
          duration: 50,
        },
      }),
    ]);
    console.log(`✅ ${appointments.length} appointments created`);

    console.log('\n✨ Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`  • Admins: 1`);
    console.log(`  • Therapists: ${therapists.length}`);
    console.log(`  • Patients: ${patients.length}`);
    console.log(`  • Appointments: ${appointments.length}`);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seedDatabase();
