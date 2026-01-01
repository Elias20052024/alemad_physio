import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...\n');

    // Clear existing data (optional - comment out if you want to keep existing data)
    // await prisma.notification.deleteMany({});
    // await prisma.loginLog.deleteMany({});
    // await prisma.appointment.deleteMany({});
    // await prisma.booking.deleteMany({});
    // await prisma.service.deleteMany({});
    // await prisma.admin.deleteMany({});
    // await prisma.therapist.deleteMany({});
    // await prisma.patient.deleteMany({});
    // await prisma.user.deleteMany({});

    // 1. Create Admin User
    console.log('📝 Creating admin user...');
    const adminPassword = await bcrypt.hash('admin123', 10);
    const adminUser = await prisma.user.upsert({
      where: { email: 'admin@test.com' },
      update: {},
      create: {
        email: 'admin@test.com',
        password: adminPassword,
        name: 'Admin User',
        role: 'admin',
      },
    });
    
    await prisma.admin.upsert({
      where: { userId: adminUser.id },
      update: {},
      create: {
        userId: adminUser.id,
        status: 'active',
      },
    });
    console.log('✅ Admin user created\n');

    // 2. Create Therapists
    console.log('🧑‍⚕️ Creating therapists...');
    const therapistPassword = await bcrypt.hash('therapist123', 10);
    
    const therapists = [];
    for (let i = 1; i <= 3; i++) {
      const therapistUser = await prisma.user.upsert({
        where: { email: `therapist${i}@test.com` },
        update: {},
        create: {
          email: `therapist${i}@test.com`,
          password: therapistPassword,
          name: `Therapist ${i}`,
          role: 'therapist',
        },
      });

      const therapist = await prisma.therapist.upsert({
        where: { userId: therapistUser.id },
        update: {},
        create: {
          userId: therapistUser.id,
          phone: `+966912345${100 + i}`,
          specialization: ['Physiotherapy', 'Orthopedic Therapy', 'Sports Therapy'][i - 1],
          availability: 'Mon-Fri, 9AM-5PM',
          status: 'active',
        },
      });
      therapists.push(therapist);
    }
    console.log(`✅ ${therapists.length} therapists created\n`);

    // 3. Create Patients
    console.log('👥 Creating patients...');
    const patientPassword = await bcrypt.hash('patient123', 10);
    
    const patients = [];
    for (let i = 1; i <= 5; i++) {
      const patientUser = await prisma.user.upsert({
        where: { email: `patient${i}@test.com` },
        update: {},
        create: {
          email: `patient${i}@test.com`,
          password: patientPassword,
          name: `Patient ${i}`,
          role: 'patient',
        },
      });

      const patient = await prisma.patient.upsert({
        where: { userId: patientUser.id },
        update: {},
        create: {
          userId: patientUser.id,
          phone: `+966912345${200 + i}`,
          age: 25 + i * 5,
          dateOfBirth: new Date(1990 + i, 0, 1),
          gender: i % 2 === 0 ? 'Male' : 'Female',
          medicalHistory: `Patient history ${i}`,
          status: 'active',
        },
      });
      patients.push(patient);
    }
    console.log(`✅ ${patients.length} patients created\n`);

    // 4. Create Services
    console.log('💼 Creating services...');
    const services = [
      { name: 'Physical Therapy', description: 'General physical therapy sessions', duration: 60, price: 150 },
      { name: 'Orthopedic Therapy', description: 'Specialized orthopedic treatment', duration: 60, price: 200 },
      { name: 'Sports Injury Treatment', description: 'Treatment for sports-related injuries', duration: 60, price: 180 },
      { name: 'Rehabilitation', description: 'Post-surgery rehabilitation', duration: 90, price: 250 },
    ];

    for (const service of services) {
      await prisma.service.create({
        data: service,
      }).catch(() => {
        // Service might already exist, ignore
      });
    }
    console.log(`✅ ${services.length} services created\n`);

    // 5. Create Appointments
    console.log('📅 Creating appointments...');
    const appointments = [];
    const now = new Date();
    
    for (let i = 0; i < 5; i++) {
      const appointmentDate = new Date(now);
      appointmentDate.setDate(appointmentDate.getDate() + (i + 1));

      const appointment = await prisma.appointment.create({
        data: {
          patientId: patients[i % patients.length].id,
          therapistId: therapists[i % therapists.length].id,
          appointmentDate: appointmentDate,
          startTime: '10:00',
          endTime: '11:00',
          status: 'pending',
          notes: `Appointment ${i + 1} notes`,
        },
      });
      appointments.push(appointment);
    }
    console.log(`✅ ${appointments.length} appointments created\n`);

    // 6. Create Bookings
    console.log('🎫 Creating bookings...');
    const bookings = [];
    
    for (let i = 1; i <= 5; i++) {
      const bookingDate = new Date(now);
      bookingDate.setDate(bookingDate.getDate() + (i + 5));

      const booking = await prisma.booking.create({
        data: {
          name: `Client ${i}`,
          phone: `+966912345${300 + i}`,
          age: 30 + i,
          service: services[i % services.length].name,
          date: bookingDate,
          time: '2:00 PM',
          message: `Booking request for ${services[i % services.length].name}`,
          status: 'pending',
        },
      });
      bookings.push(booking);
    }
    console.log(`✅ ${bookings.length} bookings created\n`);

    // 7. Create Notifications
    console.log('🔔 Creating notifications...');
    const notifications = [];
    
    for (let i = 0; i < bookings.length; i++) {
      const notification = await prisma.notification.create({
        data: {
          bookingId: bookings[i].id,
          type: 'booking_request',
          title: `New Booking: ${bookings[i].name}`,
          message: `New booking request from ${bookings[i].name} for ${bookings[i].service}`,
          status: 'pending',
          isRead: false,
        },
      });
      notifications.push(notification);
    }
    console.log(`✅ ${notifications.length} notifications created\n`);

    // 8. Create Login Logs
    console.log('📋 Creating login logs...');
    const loginLogs = [];
    
    for (let i = 0; i < 3; i++) {
      const loginLog = await prisma.loginLog.create({
        data: {
          userId: adminUser.id,
          email: adminUser.email,
          role: 'admin',
          ipAddress: '192.168.1.' + (100 + i),
          userAgent: 'Mozilla/5.0...',
          status: 'success',
        },
      });
      loginLogs.push(loginLog);
    }
    console.log(`✅ ${loginLogs.length} login logs created\n`);

    console.log('✨ Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - Admins: 1`);
    console.log(`   - Therapists: ${therapists.length}`);
    console.log(`   - Patients: ${patients.length}`);
    console.log(`   - Services: ${services.length}`);
    console.log(`   - Appointments: ${appointments.length}`);
    console.log(`   - Bookings: ${bookings.length}`);
    console.log(`   - Notifications: ${notifications.length}`);
    console.log(`   - Login Logs: ${loginLogs.length}`);
    console.log('\n🔑 Test Credentials:');
    console.log('   Admin: admin@test.com / admin123');
    console.log('   Therapist: therapist1@test.com / therapist123');
    console.log('   Patient: patient1@test.com / patient123');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seedDatabase();
