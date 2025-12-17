import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('🌱 Reseeding database with new schema...');

    // Clear existing data in order
    console.log('🗑️  Clearing existing data...');
    await prisma.loginLog.deleteMany();
    await prisma.appointment.deleteMany();
    await prisma.booking.deleteMany();
    await prisma.therapistDayOff.deleteMany();
    await prisma.therapistBreak.deleteMany();
    await prisma.therapistSchedule.deleteMany();
    await prisma.patient.deleteMany();
    await prisma.therapist.deleteMany();
    await prisma.admin.deleteMany();
    await prisma.user.deleteMany();

    console.log('✅ Data cleared');

    // Create Admin User
    console.log('👤 Creating admin...');
    const adminUser = await prisma.user.create({
      data: {
        email: 'admin@alemad.com',
        password: await bcrypt.hash('admin123', 10),
        name: 'Admin User',
        role: 'admin'
      }
    });

    const admin = await prisma.admin.create({
      data: {
        userId: adminUser.id
      }
    });
    console.log('✅ Admin created:', { id: admin.id, name: adminUser.name });

    // Create Therapist Users
    console.log('👨‍⚕️  Creating therapists...');
    const therapistUsers = await Promise.all([
      prisma.user.create({
        data: {
          email: 'dr.ahmed@alemad.com',
          password: await bcrypt.hash('therapist123', 10),
          name: 'Dr. Ahmed Saleh',
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
          specialization: 'Rehabilitation',
          phone: '+966503456789'
        }
      })
    ]);
    console.log(`✅ ${therapists.length} therapists created`);

    // Create Patient Users
    console.log('👥 Creating patients...');
    const patientUsers = await Promise.all([
      prisma.user.create({
        data: {
          email: 'patient1@alemad.com',
          password: await bcrypt.hash('patient123', 10),
          name: 'Ahmed Hassan',
          role: 'patient'
        }
      }),
      prisma.user.create({
        data: {
          email: 'patient2@alemad.com',
          password: await bcrypt.hash('patient123', 10),
          name: 'Fatima Ali',
          role: 'patient'
        }
      }),
      prisma.user.create({
        data: {
          email: 'patient3@alemad.com',
          password: await bcrypt.hash('patient123', 10),
          name: 'Mohammad Karim',
          role: 'patient'
        }
      })
    ]);

    const patients = await Promise.all([
      prisma.patient.create({
        data: {
          userId: patientUsers[0].id,
          phone: '+966551234567',
          gender: 'Male',
          medicalHistory: 'Back pain, minor injuries'
        }
      }),
      prisma.patient.create({
        data: {
          userId: patientUsers[1].id,
          phone: '+966552345678',
          gender: 'Female',
          medicalHistory: 'Sports injury recovery'
        }
      }),
      prisma.patient.create({
        data: {
          userId: patientUsers[2].id,
          phone: '+966553456789',
          gender: 'Male',
          medicalHistory: 'Post-surgery rehabilitation'
        }
      })
    ]);
    console.log(`✅ ${patients.length} patients created`);

    console.log('\n✅ Database seeding completed successfully!');
    console.log('\n📋 Sample Credentials:');
    console.log('---');
    console.log('Admin: admin@alemad.com / admin123');
    console.log('Therapist: dr.ahmed@alemad.com / therapist123');
    console.log('Patient: patient1@alemad.com / patient123');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
