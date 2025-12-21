import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verifyDatabase() {
  try {
    console.log('Ì¥ç Checking database counts...\n');
    
    const users = await prisma.user.count();
    const patients = await prisma.patient.count();
    const therapists = await prisma.therapist.count();
    const appointments = await prisma.appointment.count();
    const admins = await prisma.admin.count();
    
    console.log('Ì≥ä Database Status:');
    console.log(`   Users: ${users}`);
    console.log(`   Patients: ${patients}`);
    console.log(`   Therapists: ${therapists}`);
    console.log(`   Admins: ${admins}`);
    console.log(`   Appointments: ${appointments}`);
    
    if (appointments > 0) {
      console.log('\nÌ≥ã Appointments Details:');
      const appts = await prisma.appointment.findMany();
      appts.forEach(apt => {
        console.log(`   - ID: ${apt.id}, Therapist: ${apt.therapistId}, Patient: ${apt.patientId}, Date: ${apt.appointmentDate}`);
      });
    } else {
      console.log('\n‚úÖ Database is completely empty - no appointments found');
    }
  } catch (error) {
    console.error('‚ùå Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

verifyDatabase();
