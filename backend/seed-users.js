import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function seedUsers() {
  try {
    console.log('🌱 Starting to seed users...');

    // Clear existing users and related data
    console.log('🗑️  Clearing existing data...');
    await prisma.appointment.deleteMany();
    await prisma.patient.deleteMany();
    await prisma.therapist.deleteMany();
    await prisma.admin.deleteMany();
    await prisma.user.deleteMany();
    console.log('✅ Data cleared');

    // Create Admin Users
    console.log('👤 Creating admin users...');
    const adminUsers = await Promise.all([
      prisma.user.create({
        data: {
          email: 'admin@alemad.com',
          password: await bcrypt.hash('admin123', 10),
          name: 'Admin User',
          role: 'admin'
        }
      }),
      prisma.user.create({
        data: {
          email: 'manager@alemad.com',
          password: await bcrypt.hash('manager123', 10),
          name: 'Manager Ali',
          role: 'admin'
        }
      }),
      prisma.user.create({
        data: {
          email: 'supervisor@alemad.com',
          password: await bcrypt.hash('supervisor123', 10),
          name: 'Supervisor Fatima',
          role: 'admin'
        }
      })
    ]);

    const admins = await Promise.all([
      prisma.admin.create({ data: { userId: adminUsers[0].id } }),
      prisma.admin.create({ data: { userId: adminUsers[1].id } }),
      prisma.admin.create({ data: { userId: adminUsers[2].id } })
    ]);
    console.log(`✅ ${admins.length} admins created`);

    // Create Therapist Users
    console.log('👨‍⚕️ Creating therapist users...');
    const therapistUsers = await Promise.all([
      prisma.user.create({
        data: {
          email: 'dr.ahmed@alemad.com',
          password: await bcrypt.hash('therapist123', 10),
          name: 'Dr. Ahmed Hassan',
          role: 'therapist'
        }
      }),
      prisma.user.create({
        data: {
          email: 'dr.fatima@alemad.com',
          password: await bcrypt.hash('therapist123', 10),
          name: 'Dr. Fatima Al-Shehri',
          role: 'therapist'
        }
      }),
      prisma.user.create({
        data: {
          email: 'dr.mohammed@alemad.com',
          password: await bcrypt.hash('therapist123', 10),
          name: 'Dr. Mohammed Al-Rashid',
          role: 'therapist'
        }
      }),
      prisma.user.create({
        data: {
          email: 'dr.sara@alemad.com',
          password: await bcrypt.hash('therapist123', 10),
          name: 'Dr. Sara Khalid',
          role: 'therapist'
        }
      }),
      prisma.user.create({
        data: {
          email: 'dr.omar@alemad.com',
          password: await bcrypt.hash('therapist123', 10),
          name: 'Dr. Omar Hussain',
          role: 'therapist'
        }
      })
    ]);

    const therapists = await Promise.all([
      prisma.therapist.create({
        data: {
          userId: therapistUsers[0].id,
          specialization: 'Physical Therapy',
          phone: '+966501234567'
        }
      }),
      prisma.therapist.create({
        data: {
          userId: therapistUsers[1].id,
          specialization: 'Sports Medicine',
          phone: '+966502345678'
        }
      }),
      prisma.therapist.create({
        data: {
          userId: therapistUsers[2].id,
          specialization: 'Orthopedic Rehabilitation',
          phone: '+966503456789'
        }
      }),
      prisma.therapist.create({
        data: {
          userId: therapistUsers[3].id,
          specialization: 'Neuromuscular Therapy',
          phone: '+966504567890'
        }
      }),
      prisma.therapist.create({
        data: {
          userId: therapistUsers[4].id,
          specialization: 'Pediatric Physical Therapy',
          phone: '+966505678901'
        }
      })
    ]);
    console.log(`✅ ${therapists.length} therapists created`);

    // Create Patient Users
    console.log('👥 Creating patient users...');
    const patientUsers = await Promise.all([
      prisma.user.create({
        data: {
          email: 'patient1@example.com',
          password: await bcrypt.hash('patient123', 10),
          name: 'Mohammad Elias',
          role: 'patient'
        }
      }),
      prisma.user.create({
        data: {
          email: 'patient2@example.com',
          password: await bcrypt.hash('patient123', 10),
          name: 'Emad Ali',
          role: 'patient'
        }
      }),
      prisma.user.create({
        data: {
          email: 'patient3@example.com',
          password: await bcrypt.hash('patient123', 10),
          name: 'Sarah Ahmed',
          role: 'patient'
        }
      }),
      prisma.user.create({
        data: {
          email: 'patient4@example.com',
          password: await bcrypt.hash('patient123', 10),
          name: 'Hassan Ibrahim',
          role: 'patient'
        }
      }),
      prisma.user.create({
        data: {
          email: 'patient5@example.com',
          password: await bcrypt.hash('patient123', 10),
          name: 'Aisha Mohammed',
          role: 'patient'
        }
      }),
      prisma.user.create({
        data: {
          email: 'patient6@example.com',
          password: await bcrypt.hash('patient123', 10),
          name: 'Karim Hassan',
          role: 'patient'
        }
      })
    ]);

    const patients = await Promise.all([
      prisma.patient.create({
        data: {
          userId: patientUsers[0].id,
          phone: '+966501234567',
          gender: 'Male'
        }
      }),
      prisma.patient.create({
        data: {
          userId: patientUsers[1].id,
          phone: '+966502345678',
          gender: 'Male'
        }
      }),
      prisma.patient.create({
        data: {
          userId: patientUsers[2].id,
          phone: '+966503456789',
          gender: 'Female'
        }
      }),
      prisma.patient.create({
        data: {
          userId: patientUsers[3].id,
          phone: '+966504567890',
          gender: 'Male'
        }
      }),
      prisma.patient.create({
        data: {
          userId: patientUsers[4].id,
          phone: '+966505678901',
          gender: 'Female'
        }
      }),
      prisma.patient.create({
        data: {
          userId: patientUsers[5].id,
          phone: '+966506789012',
          gender: 'Male'
        }
      })
    ]);
    console.log(`✅ ${patients.length} patients created`);

    console.log('\n✅ Database seeded successfully!');
    console.log('\n📋 Test Credentials:');
    console.log('\n👤 ADMIN:');
    console.log('  Email: admin@alemad.com');
    console.log('  Password: admin123');
    console.log('\n👨‍⚕️ THERAPIST:');
    console.log('  Email: dr.ahmed@alemad.com');
    console.log('  Password: therapist123');
    console.log('\n👥 PATIENT:');
    console.log('  Email: patient1@example.com');
    console.log('  Password: patient123');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedUsers();
