async function testNotifications() {
  try {
    console.log('Testing: GET /api/notifications');
    const response = await fetch('http://localhost:5001/api/notifications');
    console.log('Status:', response.status);
    const data = await response.json();
    console.log('Count:', Array.isArray(data) ? data.length : 'not an array');
    console.log('Sample:', data[0] ? { id: data[0].id, status: data[0].status } : 'no data');
    
    console.log('\nTesting: GET /api/notifications?status=pending');
    const response2 = await fetch('http://localhost:5001/api/notifications?status=pending');
    console.log('Status:', response2.status);
    const data2 = await response2.json();
    console.log('Count:', Array.isArray(data2) ? data2.length : 'not an array');
    console.log('Sample:', data2[0] ? { id: data2[0].id, status: data2[0].status } : 'no data');
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testNotifications();
