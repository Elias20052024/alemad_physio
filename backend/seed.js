import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data in reverse dependency order
    console.log('🗑️  Clearing existing data...');
    await prisma.notification.deleteMany();
    await prisma.appointment.deleteMany();
    await prisma.patient.deleteMany();
    await prisma.therapist.deleteMany();
    await prisma.admin.deleteMany();
    await prisma.user.deleteMany();

    // Create Admin User
    console.log('👤 Creating admin user...');
    const adminUser = await prisma.user.create({
      data: {
        email: 'admin@alemad.com',
        password: await bcrypt.hash('admin123', 10),
        name: 'Admin User',
        role: 'admin',
      },
    });

    const admin = await prisma.admin.create({
      data: {
        userId: adminUser.id,
        status: 'active',
      },
    });
    console.log('✅ Admin created');

    // Create Therapist Users
    console.log('👨‍⚕️ Creating therapist users...');
    const therapistUsers = await Promise.all([
      prisma.user.create({
        data: {
          email: 'ahmed@alemad.com',
          password: await bcrypt.hash('therapist123', 10),
          name: 'Dr. Ahmed',
          role: 'therapist',
        },
      }),
      prisma.user.create({
        data: {
          email: 'fatima@alemad.com',
          password: await bcrypt.hash('therapist123', 10),
          name: 'Dr. Fatima',
          role: 'therapist',
        },
      }),
      prisma.user.create({
        data: {
          email: 'zahra@alemad.com',
          password: await bcrypt.hash('therapist123', 10),
          name: 'Dr. Zahra',
          role: 'therapist',
        },
      }),
    ]);
    console.log(`✅ ${therapistUsers.length} therapist users created`);

    // Create Therapist records
    console.log('📋 Creating therapist profiles...');
    const therapists = await Promise.all([
      prisma.therapist.create({
        data: {
          userId: therapistUsers[0].id,
          specialization: 'Physiotherapy',
          phone: '+966501234567',
          availability: 'Mon-Fri 9AM-5PM',
          status: 'active',
        },
      }),
      prisma.therapist.create({
        data: {
          userId: therapistUsers[1].id,
          specialization: 'Sports Massage',
          phone: '+966502345678',
          availability: 'Mon-Fri 9AM-5PM',
          status: 'active',
        },
      }),
      prisma.therapist.create({
        data: {
          userId: therapistUsers[2].id,
          specialization: 'Manual Therapy',
          phone: '+966503456789',
          availability: 'Mon-Fri 9AM-5PM',
          status: 'active',
        },
      }),
    ]);
    console.log(`✅ ${therapists.length} therapist profiles created`);

    // Create Patient Users
    console.log('👥 Creating patient users...');
    const patientUsers = await Promise.all([
      prisma.user.create({
        data: {
          email: 'patient1@alemad.com',
          password: await bcrypt.hash('patient123', 10),
          name: 'Ahmed Al-Rashid',
          role: 'patient',
        },
      }),
      prisma.user.create({
        data: {
          email: 'patient2@alemad.com',
          password: await bcrypt.hash('patient123', 10),
          name: 'Fatima Al-Shehri',
          role: 'patient',
        },
      }),
      prisma.user.create({
        data: {
          email: 'patient3@alemad.com',
          password: await bcrypt.hash('patient123', 10),
          name: 'Mohammed Al-Dossary',
          role: 'patient',
        },
      }),
      prisma.user.create({
        data: {
          email: 'patient4@alemad.com',
          password: await bcrypt.hash('patient123', 10),
          name: 'Noor Al-Mansouri',
          role: 'patient',
        },
      }),
      prisma.user.create({
        data: {
          email: 'patient5@alemad.com',
          password: await bcrypt.hash('patient123', 10),
          name: 'Khalid Al-Otaibi',
          role: 'patient',
        },
      }),
    ]);
    console.log(`✅ ${patientUsers.length} patient users created`);

    // Create Patient records
    console.log('📋 Creating patient profiles...');
    const patients = await Promise.all([
      prisma.patient.create({
        data: {
          userId: patientUsers[0].id,
          phone: '+966551234567',
          age: 35,
          dateOfBirth: new Date('1989-06-15'),
          gender: 'Male',
          medicalHistory: 'Back pain, shoulder injury',
          status: 'active',
        },
      }),
      prisma.patient.create({
        data: {
          userId: patientUsers[1].id,
          phone: '+966552345678',
          age: 28,
          dateOfBirth: new Date('1996-03-22'),
          gender: 'Female',
          medicalHistory: 'Knee pain',
          status: 'active',
        },
      }),
      prisma.patient.create({
        data: {
          userId: patientUsers[2].id,
          phone: '+966553456789',
          age: 42,
          dateOfBirth: new Date('1982-11-10'),
          gender: 'Male',
          medicalHistory: 'Sports injury, rehabilitation needed',
          status: 'active',
        },
      }),
      prisma.patient.create({
        data: {
          userId: patientUsers[3].id,
          phone: '+966554567890',
          age: 31,
          dateOfBirth: new Date('1993-08-05'),
          gender: 'Female',
          medicalHistory: 'Neck strain',
          status: 'active',
        },
      }),
      prisma.patient.create({
        data: {
          userId: patientUsers[4].id,
          phone: '+966555678901',
          age: 25,
          dateOfBirth: new Date('1999-12-20'),
          gender: 'Male',
          medicalHistory: 'Ankle sprain',
          status: 'active',
        },
      }),
    ]);
    console.log(`✅ ${patients.length} patient profiles created`);

    // Create Appointments
    console.log('📅 Creating appointments...');
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const appointments = await Promise.all([
      prisma.appointment.create({
        data: {
          therapistId: therapists[0].id,
          patientId: patients[0].id,
          appointmentDate: new Date(today.getTime() + 24 * 60 * 60 * 1000), // Tomorrow
          startTime: '09:00',
          endTime: '10:00',
          status: 'confirmed',
          notes: 'Regular physiotherapy session',
        },
      }),
      prisma.appointment.create({
        data: {
          therapistId: therapists[1].id,
          patientId: patients[1].id,
          appointmentDate: new Date(today.getTime() + 24 * 60 * 60 * 1000),
          startTime: '10:00',
          endTime: '11:00',
          status: 'confirmed',
          notes: 'Sports massage therapy',
        },
      }),
      prisma.appointment.create({
        data: {
          therapistId: therapists[2].id,
          patientId: patients[2].id,
          appointmentDate: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000), // Day after tomorrow
          startTime: '11:00',
          endTime: '12:00',
          status: 'pending',
          notes: 'Manual therapy session',
        },
      }),
      prisma.appointment.create({
        data: {
          therapistId: therapists[0].id,
          patientId: patients[3].id,
          appointmentDate: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000),
          startTime: '14:00',
          endTime: '15:00',
          status: 'confirmed',
          notes: 'Neck treatment - Physiotherapy',
        },
      }),
      prisma.appointment.create({
        data: {
          therapistId: therapists[1].id,
          patientId: patients[4].id,
          appointmentDate: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
          startTime: '15:00',
          endTime: '16:00',
          status: 'confirmed',
          notes: 'Ankle rehabilitation therapy',
        },
      }),
    ]);
    console.log(`✅ ${appointments.length} appointments created`);

    // Create Services
    console.log('🏥 Creating services...');
    const services = await Promise.all([
      prisma.service.create({
        data: {
          name: 'Physiotherapy',
          description: 'Physical therapy for rehabilitation and pain management',
          duration: 60,
          price: 150,
        },
      }),
      prisma.service.create({
        data: {
          name: 'Sports Massage',
          description: 'Therapeutic massage for sports injuries',
          duration: 60,
          price: 120,
        },
      }),
      prisma.service.create({
        data: {
          name: 'Manual Therapy',
          description: 'Hands-on treatment for joint and muscle issues',
          duration: 60,
          price: 130,
        },
      }),
    ]);
    console.log(`✅ ${services.length} services created`);

    console.log('\n✨ Database seeding completed successfully!');
    console.log('📊 Summary:');
    console.log(`   - 1 Admin`);
    console.log(`   - ${therapists.length} Therapists`);
    console.log(`   - ${patients.length} Patients`);
    console.log(`   - ${appointments.length} Appointments`);
    console.log(`   - ${services.length} Services`);
    console.log('\n🔐 Login Credentials:');
    console.log('   Admin: admin@alemad.com / admin123');
    console.log('   Therapist: ahmed@alemad.com / therapist123');
    console.log('   Patient: patient1@alemad.com / patient123');
  } catch (error) {
    console.error('❌ Seeding error:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seedDatabase();
