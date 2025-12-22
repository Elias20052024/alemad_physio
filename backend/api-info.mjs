import http from 'http';

const endpoints = {
  'HEALTH CHECK': 'GET /health',
  
  'ADMIN ENDPOINTS': [
    'POST /api/admin/login - Admin login',
    'POST /api/admin/register - Admin registration',
    'GET /api/admin/profile - Get admin profile',
    'PUT /api/admin/profile - Update admin profile',
    'GET /api/admin/list - Get all admins'
  ],
  
  'THERAPIST ENDPOINTS': [
    'GET /api/therapists - Get all therapists',
    'GET /api/therapists/:id - Get therapist by ID',
    'POST /api/therapists - Create therapist',
    'PUT /api/therapists/:id - Update therapist',
    'DELETE /api/therapists/:id - Delete therapist',
    'POST /api/therapists/login - Therapist login',
    'GET /api/therapists/:id/schedule - Get therapist schedule',
    'POST /api/therapists/:id/schedule - Create schedule',
    'POST /api/therapists/:id/breaks - Add break',
    'POST /api/therapists/:id/dayoff - Add day off'
  ],
  
  'PATIENT ENDPOINTS': [
    'GET /api/patients - Get all patients',
    'GET /api/patients/:id - Get patient by ID',
    'POST /api/patients - Create patient',
    'PUT /api/patients/:id - Update patient',
    'DELETE /api/patients/:id - Delete patient',
    'POST /api/patients/register - Patient registration',
    'POST /api/patients/login - Patient login',
    'GET /api/patients/:id/appointments - Get patient appointments'
  ],
  
  'APPOINTMENT ENDPOINTS': [
    'GET /api/appointments - Get all appointments',
    'GET /api/appointments/:id - Get appointment by ID',
    'POST /api/appointments - Create appointment',
    'PUT /api/appointments/:id - Update appointment',
    'DELETE /api/appointments/:id - Delete appointment',
    'PATCH /api/appointments/:id/cancel - Cancel appointment',
    'GET /api/appointments/available-slots - Get available slots'
  ],
  
  'BOOKING ENDPOINTS': [
    'GET /api/bookings - Get all bookings',
    'GET /api/bookings/:id - Get booking by ID',
    'POST /api/bookings - Create booking',
    'PUT /api/bookings/:id - Update booking',
    'DELETE /api/bookings/:id - Delete booking'
  ],
  
  'NOTIFICATION ENDPOINTS': [
    'GET /api/notifications - Get all notifications',
    'GET /api/notifications/:id - Get notification by ID',
    'POST /api/notifications - Create notification',
    'PUT /api/notifications/:id - Update notification',
    'DELETE /api/notifications/:id - Delete notification'
  ]
};

console.log('\n╔════════════════════════════════════════════════════════════╗');
console.log('║          ��� ALEMAD PHYSIOTHERAPY API DOCUMENTATION      ║');
console.log('╚════════════════════════════════════════════════════════════╝\n');

console.log('BASE URL: http://localhost:5001\n');

Object.entries(endpoints).forEach(([category, eps]) => {
  console.log(`\n${'═'.repeat(60)}`);
  console.log(`��� ${category}`);
  console.log(`${'═'.repeat(60)}`);
  
  if (Array.isArray(eps)) {
    eps.forEach(ep => console.log(`   ${ep}`));
  } else {
    console.log(`   ${eps}`);
  }
});

console.log('\n\n═══════════════════════════════════════════════════════════');
console.log('��� AUTHENTICATION');
console.log('═══════════════════════════════════════════════════════════');
console.log('All protected endpoints require:');
console.log('   Header: Authorization: Bearer {token}');

console.log('\n\n═══════════════════════════════════════════════════════════');
console.log('✅ Testing API Connection...');
console.log('═══════════════════════════════════════════════════════════\n');

http.get('http://localhost:5001/health', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('✓ API is RUNNING and ACCESSIBLE');
    console.log(`✓ Response: ${data}`);
  });
}).on('error', (e) => {
  console.log('✗ API is NOT accessible');
  console.log(`  Error: ${e.message}`);
});
