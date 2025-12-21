import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function clearDatabase() {
  try {
    console.log('Ì∑ëÔ∏è Clearing all data from database...');
    
    await prisma.notification.deleteMany();
    console.log('‚úÖ Notifications cleared');
    
    await prisma.appointment.deleteMany();
    console.log('‚úÖ Appointments cleared');
    
    await prisma.patient.deleteMany();
    console.log('‚úÖ Patients cleared');
    
    await prisma.therapist.deleteMany();
    console.log('‚úÖ Therapists cleared');
    
    await prisma.admin.deleteMany();
    console.log('‚úÖ Admins cleared');
    
    await prisma.user.deleteMany();
    console.log('‚úÖ Users cleared');
    
    const appointmentCount = await prisma.appointment.count();
    const patientCount = await prisma.patient.count();
    const therapistCount = await prisma.therapist.count();
    const userCount = await prisma.user.count();
    
    console.log('\nÌ≥ä Database Status:');
    console.log(`   Users: ${userCount}`);
    console.log(`   Patients: ${patientCount}`);
    console.log(`   Therapists: ${therapistCount}`);
    console.log(`   Appointments: ${appointmentCount}`);
    
    if (appointmentCount === 0) {
      console.log('\n‚ú® Database is now completely empty!');
    }
  } catch (error) {
    console.error('‚ùå Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

clearDatabase();
