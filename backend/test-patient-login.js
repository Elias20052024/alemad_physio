import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

async function testPatientLogin() {
  console.log('🧪 Testing Patient Login...\n');

  try {
    console.log('📤 Sending login request...');
    const response = await axios.post(`${API_URL}/patients/login`, {
      email: 'ahmed@example.com',
      password: 'Patient@123'
    });

    console.log('✅ Login successful!\n');
    console.log('📋 Response:');
    console.log(JSON.stringify(response.data, null, 2));

    if (response.data.token) {
      console.log('\n✅ Token received:', response.data.token.substring(0, 20) + '...');
    }

    if (response.data.patient) {
      console.log('\n👤 Patient Info:');
      console.log(`   ID: ${response.data.patient.id}`);
      console.log(`   Name: ${response.data.patient.fullName}`);
      console.log(`   Email: ${response.data.patient.email}`);
      console.log(`   Phone: ${response.data.patient.phone}`);
    }
  } catch (error) {
    console.log('❌ Login failed!\n');
    if (error.response) {
      console.log('Error Response:');
      console.log(`Status: ${error.response.status}`);
      console.log(`Message: ${error.response.data?.message}`);
      console.log(`Full Response:`, error.response.data);
    } else {
      console.log('Error:', error.message);
    }
  }
}

testPatientLogin();
