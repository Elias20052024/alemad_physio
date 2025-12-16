import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testDatabase() {
  try {
    console.log('🔍 Testing database connection...\n');

    // Get all patients
    const patients = await prisma.patient.findMany();
    console.log(`✅ Found ${patients.length} patients:`);
    patients.forEach((p, i) => {
      console.log(`  ${i + 1}. ${p.fullName} (Age: ${p.age}, Phone: ${p.phone})`);
    });

    console.log('\n' + '='.repeat(50) + '\n');

    // Get all therapists
    const therapists = await prisma.therapist.findMany();
    console.log(`✅ Found ${therapists.length} therapists:`);
    therapists.forEach((t, i) => {
      console.log(`  ${i + 1}. Dr. ${t.name} (${t.specialty})`);
    });

    console.log('\n' + '='.repeat(50) + '\n');

    // Get all appointments
    const appointments = await prisma.appointment.findMany({
      include: { patient: true, therapist: true }
    });
    console.log(`✅ Found ${appointments.length} appointments:`);
    appointments.forEach((a, i) => {
      console.log(`  ${i + 1}. ${a.patient.fullName} with Dr. ${a.therapist.name}`);
      console.log(`     Service: ${a.service} | Date: ${a.date} | Status: ${a.status}`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabase();
