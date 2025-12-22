import axios from 'axios';

const API_URL = 'http://localhost:5001/api';

async function showAllData() {
  try {
    console.log('\nÌ≥ä ===== COMPLETE DATABASE DUMP =====\n');

    // Fetch Patients
    console.log('Ì±• PATIENTS:');
    const patientsRes = await axios.get(`${API_URL}/patients`);
    console.log(JSON.stringify(patientsRes.data, null, 2));

    // Fetch Therapists
    console.log('\nÌ±®‚Äç‚öïÔ∏è THERAPISTS:');
    const therapistsRes = await axios.get(`${API_URL}/therapists`);
    console.log(JSON.stringify(therapistsRes.data, null, 2));

    // Fetch Appointments
    console.log('\nÌ≥Ö APPOINTMENTS:');
    const appointmentsRes = await axios.get(`${API_URL}/appointments`);
    console.log(JSON.stringify(appointmentsRes.data, null, 2));

    console.log('\n‚úÖ Done!');
  } catch (error) {
    console.error('Error:', error.message);
  }
}

showAllData();
