async function testNotificationsAPI() {
  try {
    const response = await fetch('http://localhost:5001/api/notifications?status=pending');
    console.log('API Response Status:', response.status);
    const data = await response.json();
    console.log('Notifications found:', Array.isArray(data) ? data.length : 0);
    console.log(JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testNotificationsAPI();
