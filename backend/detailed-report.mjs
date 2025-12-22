import axios from 'axios';

const API_URL = 'http://localhost:5001/api';

async function showDetailedReport() {
  try {
    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║          ��� ALEMAD PHYSIOTHERAPY CENTER - FULL REPORT      ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');

    // THERAPISTS DETAILS
    console.log('═══════════════════════════════════════════════════════════');
    console.log('���‍⚕️  THERAPISTS DETAILED INFORMATION');
    console.log('═══════════════════════════════════════════════════════════\n');
    const therapistsRes = await axios.get(`${API_URL}/therapists`);
    therapistsRes.data.forEach((t, idx) => {
      console.log(`${idx + 1}. ${t.user.name} (ID: ${t.id})`);
      console.log(`   Email: ${t.user.email}`);
      console.log(`   Phone: ${t.phone}`);
      console.log(`   Specialization: ${t.specialization}`);
      console.log(`   Availability: ${t.availability}`);
      console.log(`   Status: ${t.status}`);
      console.log(`   Created: ${new Date(t.createdAt).toLocaleDateString()}`);
      console.log('');
    });

    // PATIENTS DETAILS
    console.log('═══════════════════════════════════════════════════════════');
    console.log('��� PATIENTS DETAILED INFORMATION');
    console.log('═══════════════════════════════════════════════════════════\n');
    const patientsRes = await axios.get(`${API_URL}/patients`);
    patientsRes.data.forEach((p, idx) => {
      console.log(`${idx + 1}. ${p.user.name} (ID: ${p.id})`);
      console.log(`   Email: ${p.user.email}`);
      console.log(`   Phone: ${p.phone}`);
      console.log(`   Age: ${p.age}`);
      console.log(`   Gender: ${p.gender}`);
      console.log(`   Date of Birth: ${new Date(p.dateOfBirth).toLocaleDateString()}`);
      console.log(`   Medical History: ${p.medicalHistory}`);
      console.log(`   Status: ${p.status}`);
      console.log(`   Created: ${new Date(p.createdAt).toLocaleDateString()}`);
      console.log('');
    });

    // APPOINTMENTS DETAILS
    console.log('═══════════════════════════════════════════════════════════');
    console.log('��� APPOINTMENTS DETAILED INFORMATION');
    console.log('═══════════════════════════════════════════════════════════\n');
    const appointmentsRes = await axios.get(`${API_URL}/appointments`);
    appointmentsRes.data.slice(0, 10).forEach((apt, idx) => {
      console.log(`${idx + 1}. Appointment ID: ${apt.id}`);
      console.log(`   Patient: ${apt.patient?.user?.name || 'N/A'}`);
      console.log(`   Therapist: ${apt.therapist?.user?.name || 'N/A'}`);
      console.log(`   Date: ${new Date(apt.appointmentDate).toLocaleDateString()}`);
      console.log(`   Start Time: ${apt.startTime}`);
      console.log(`   End Time: ${apt.endTime}`);
      console.log(`   Duration: ${apt.duration} minutes`);
      console.log(`   Status: ${apt.status}`);
      console.log(`   Notes: ${apt.notes || 'N/A'}`);
      console.log('');
    });

    // SUMMARY
    console.log('═══════════════════════════════════════════════════════════');
    console.log('��� DATABASE SUMMARY');
    console.log('═══════════════════════════════════════════════════════════');
    console.log(`✓ Total Therapists: ${therapistsRes.data.length}`);
    console.log(`✓ Total Patients: ${patientsRes.data.length}`);
    console.log(`✓ Total Appointments: ${appointmentsRes.data.length}`);
    console.log(`✓ System Status: OPERATIONAL\n`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

showDetailedReport();
