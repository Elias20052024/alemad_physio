# Alemad Backend

Express.js Backend API for Alemad Physiotherapy Center

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Backend will start on `http://localhost:5000`

## 📦 Dependencies

- **express**: ^4.18.2
- **cors**: ^2.8.5
- **body-parser**: ^1.20.2

## 🏗️ File Structure

```
backend/
├── routes/
│   └── booking.js    # Booking routes and logic
├── server.js         # Express server setup
└── package.json      # Dependencies
```

## 🔌 API Endpoints

### POST /api/booking
Create a new booking

**Request:**
```json
{
  "name": "Ahmed Ali",
  "phone": "+966501234567",
  "service": "Physical Therapy",
  "date": "2025-01-15",
  "message": "Optional message"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Booking received successfully",
  "bookingId": 1
}
```

**Errors:**
- 400: Missing required fields
- 500: Server error

---

### GET /api/bookings
Get all bookings (useful for admin panel)

**Response:**
```json
{
  "success": true,
  "count": 5,
  "bookings": [
    {
      "id": 1,
      "name": "Ahmed Ali",
      "phone": "+966501234567",
      "service": "Physical Therapy",
      "date": "2025-01-15",
      "message": "Optional message",
      "createdAt": "2025-01-01T10:30:00Z"
    }
  ]
}
```

---

### GET /api/booking/:id
Get specific booking by ID

**Response:**
```json
{
  "success": true,
  "booking": {
    "id": 1,
    "name": "Ahmed Ali",
    "phone": "+966501234567",
    "service": "Physical Therapy",
    "date": "2025-01-15",
    "message": "Optional message",
    "createdAt": "2025-01-01T10:30:00Z"
  }
}
```

---

### GET /health
Health check endpoint

**Response:**
```json
{
  "status": "Backend is running!"
}
```

## 🔒 CORS Configuration

CORS is enabled for all origins. In production, restrict to specific domains:

```javascript
app.use(cors({
  origin: 'https://yourdomain.com'
}));
```

## 📝 Middleware

- **CORS**: Enable cross-origin requests
- **Body Parser (JSON)**: Parse JSON request bodies
- **Body Parser (URL)**: Parse URL-encoded bodies

## 💾 Data Storage

Currently uses in-memory storage (JavaScript array). For production:

### Options:
1. **MongoDB** - NoSQL database
2. **PostgreSQL** - SQL database
3. **Firebase** - Cloud database
4. **MySQL** - SQL database

Example MongoDB integration:
```javascript
const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  name: String,
  phone: String,
  service: String,
  date: Date,
  message: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', bookingSchema);
```

## 📧 Email Notifications (Optional)

Add Nodemailer for email confirmations:

```javascript
npm install nodemailer
```

Example:
```javascript
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD
  }
});

await transporter.sendMail({
  from: 'info@alemad.com',
  to: bookingData.email,
  subject: 'Booking Confirmation',
  html: `<p>Your booking is confirmed for ${bookingData.date}</p>`
});
```

## 🚀 Deployment

### Heroku:
```bash
heroku login
heroku create alemad-backend
git push heroku main
```

### Vercel:
```bash
vercel deploy
```

### AWS/DigitalOcean:
Use PM2 for process management:
```bash
npm install -g pm2
pm2 start server.js
pm2 save
pm2 startup
```

## 🔑 Environment Variables

Create `.env` file:
```
PORT=5000
NODE_ENV=development
```

## 📊 Monitoring

View all bookings:
```bash
curl http://localhost:5000/api/bookings
```

View specific booking:
```bash
curl http://localhost:5000/api/booking/1
```

## 🧪 Testing with cURL

```bash
# Create booking
curl -X POST http://localhost:5000/api/booking \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Ahmed Ali",
    "phone": "+966501234567",
    "service": "Physical Therapy",
    "date": "2025-01-15"
  }'

# Get all bookings
curl http://localhost:5000/api/bookings

# Get specific booking
curl http://localhost:5000/api/booking/1
```

## 📚 Resources

- [Express Documentation](https://expressjs.com)
- [Node.js Documentation](https://nodejs.org)
- [CORS Documentation](https://github.com/expressjs/cors)
