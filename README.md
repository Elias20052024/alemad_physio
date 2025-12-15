# 🏥 Physiotherapy Center Management Platform

A comprehensive full-stack management system for physiotherapy centers with advanced appointment scheduling, therapist management, and admin controls.

## 🚀 Quick Start

**Get running in 5 minutes:**

```bash
# 1. Setup database
createdb alemad_physio

# 2. Backend
cd backend
npm install && npm run migrate && npm run dev

# 3. Create admin (in new terminal)
node -e "const p = require('@prisma/client').PrismaClient; const b = require('bcryptjs');
(async()=>{const h = await b.hash('admin123', 10); await new p().admin.create({
data: {name:'Admin', email:'admin@alemad.com', password:h}}); process.exit(0);})()"

# 4. Frontend
cd ../frontend && npm install && npm run dev
```

**Access:**
- 🏠 Public: http://localhost:5173
- 🔐 Admin: http://localhost:5173/admin/login (admin@alemad.com / admin123)
- 📡 API: http://localhost:5000/api

## ✨ Key Features

### 🔐 Admin Dashboard
- **Secure Authentication**: JWT-based login system
- **Dashboard Statistics**: Real-time counts of therapists, patients, and appointments
- **Therapist Management**: Full CRUD operations with schedule management
- **Patient Management**: Complete patient database with medical history
- **Appointment Management**: View, edit, and manage all appointments

### 📅 Appointment Scheduling
- **Intelligent Availability**: Automatic time slot calculation
- **Schedule Constraints**:
  - Working hours enforcement
  - Break time management
  - Days off support
  - Double booking prevention
- **Flexible Booking**: Create patients on-the-fly during booking
- **Status Tracking**: scheduled/completed/cancelled

### 👨‍⚕️ Therapist Management
- **Profile Management**: Name, specialty, contact info
- **Schedule Control**: Set working hours for each day
- **Break Management**: Add specific break times
- **Days Off**: Mark unavailable dates
- **Appointment Tracking**: View all assigned appointments

### 👥 Patient Management
- **Patient Records**: Store full names, phone, age, gender
- **Medical History**: Track medical background
- **Appointment History**: View all past and upcoming appointments
- **Quick Entry**: Create patients during appointment booking

### 🎨 Modern UI
- **Material Design**: Professional Material UI components
- **Dark/Light Mode**: Theme toggle with localStorage persistence
- **Responsive**: Works on mobile, tablet, and desktop
- **Medical Theme**: Professional color palette
- **Smooth UX**: Loading states, confirmations, error handling

## 📋 System Requirements

### Technology Stack

**Backend:**
- Node.js v16+ with Express.js
- PostgreSQL 12+
- Prisma ORM
- JWT Authentication
- bcryptjs for password security

**Frontend:**
- React 18 with Vite
- Material UI v5
- React Router v6
- Axios for API calls

## 📁 Project Structure

```
alemad-physio/
├── backend/
│   ├── src/
│   │   ├── controllers/       (Business logic)
│   │   ├── routes/            (API endpoints)
│   │   ├── middleware/        (Auth & error handling)
│   │   ├── utils/             (JWT, validation, hashing)
│   │   └── server.js          (Express app)
│   ├── prisma/
│   │   └── schema.prisma      (Database schema)
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── admin/             (Admin pages)
    │   ├── appointments/      (Booking pages)
    │   ├── components/        (Reusable components)
    │   ├── pages/             (Public pages)
    │   ├── services/          (API client)
    │   ├── context/           (Theme provider)
    │   ├── theme/             (Material UI theme)
    │   └── App.jsx            (Main app)
    └── package.json
```

## 🔌 API Endpoints

### Authentication
- `POST /api/admin/login` - Admin login
- `POST /api/admin/register` - Register admin

### Admin
- `GET /api/admin/stats` - Dashboard statistics

### Therapists
- `GET /api/therapists` - List all
- `POST /api/therapists` - Create (admin)
- `PUT /api/therapists/:id` - Update (admin)
- `DELETE /api/therapists/:id` - Delete (admin)
- `GET /api/therapists/:id/schedule` - Get schedule
- `POST /api/therapists/:id/schedule` - Set schedule (admin)
- `POST /api/therapists/:id/breaks` - Add break (admin)
- `POST /api/therapists/:id/dayoff` - Add day off (admin)

### Patients
- `GET /api/patients` - List all
- `POST /api/patients` - Create (admin)
- `PUT /api/patients/:id` - Update (admin)
- `DELETE /api/patients/:id` - Delete (admin)
- `GET /api/patients/:id/appointments` - Get appointments

### Appointments
- `GET /api/appointments` - List (with filters)
- `GET /api/appointments/available-slots` - Get available times
- `POST /api/appointments` - Create
- `PUT /api/appointments/:id` - Update (admin)
- `PATCH /api/appointments/:id/cancel` - Cancel (admin)
- `DELETE /api/appointments/:id` - Delete (admin)

*See API_DOCUMENTATION.md for detailed endpoint documentation*

## 💾 Database Schema

### Tables
- **admins** - Admin users with hashed passwords
- **therapists** - Therapist profiles and specialties
- **therapist_schedules** - Working hours (Mon-Sun)
- **therapist_breaks** - Break time periods
- **therapist_days_off** - Unavailable dates
- **patients** - Patient information and medical history
- **appointments** - Appointment records with status

*See SETUP_GUIDE.md for detailed schema description*

## 🛠️ Business Logic

### Appointment Validation
✅ Time must be within therapist's working hours  
✅ Time cannot overlap with breaks  
✅ Cannot book on therapist's days off  
✅ Cannot double-book same therapist/time  
✅ Patient must exist or be created  

### Availability Calculation
- Dynamic slot generation based on schedules
- Automatic 30-minute intervals
- Real-time availability checking
- Considers all constraints

## 📚 Documentation

- **[QUICK_START.md](./QUICK_START.md)** - 5-minute setup guide
- **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - Detailed setup and configuration
- **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)** - Complete API reference
- **[FEATURE_CHECKLIST.md](./FEATURE_CHECKLIST.md)** - Full feature list

## 🎯 Usage

### For Patients
1. Visit home page
2. Browse therapists
3. Click "View Available Slots"
4. Fill booking form
5. Select existing patient or create new
6. Confirm appointment

### For Admin
1. Login to admin dashboard
2. Manage therapists, patients, and schedules
3. View and manage all appointments
4. Filter appointments by various criteria
5. Cancel or update appointments as needed

## 🔒 Security

- JWT token-based authentication
- bcryptjs password hashing
- Protected admin routes
- Input validation and sanitization
- SQL injection prevention via Prisma
- CORS enabled
- Environment variable secrets

## 🎨 Theme

### Light Theme
- Primary: #2D89B3
- Secondary: #A7D676
- Background: #F5F7F8

### Dark Theme
- Primary: #49A3D0
- Secondary: #A7D676
- Background: #121212

## ⚙️ Configuration

See `.env.example` files for required environment variables.

**Backend (.env):**
```env
DATABASE_URL="postgresql://user:password@localhost:5432/alemad_physio"
JWT_SECRET="your-secret-key"
PORT=5000
NODE_ENV="development"
```

**Frontend (.env.local):**
```env
VITE_API_URL=http://localhost:5000/api
```

## 📱 Responsive Design

- Mobile: 100% responsive
- Tablet: Optimized layout
- Desktop: Full features
- All Material UI components responsive

## 🚀 Production Deployment

See SETUP_GUIDE.md for:
- Backend deployment (Heroku, AWS, etc.)
- Frontend build and deployment (Vercel, Netlify, etc.)
- Database configuration
- Security checklist

## 📊 Statistics & Insights

Track in real-time:
- Total active therapists
- Total registered patients
- Appointments today
- Upcoming appointments
- Appointment statuses

## 🐛 Troubleshooting

See SETUP_GUIDE.md troubleshooting section for:
- Database connection issues
- API errors
- Authentication problems
- Port conflicts
- Migration issues

## 📞 Support

Check documentation files:
- Error messages explained
- Common issues resolved
- Contact information for therapists
- Booking confirmation details

## 📄 License

Private project for Alemad Physiotherapy Center

## 👥 Version

**Version**: 1.0.0  
**Status**: ✅ Production Ready  
**Last Updated**: December 2024

---

## 📖 Next Steps

1. **[QUICK_START.md](./QUICK_START.md)** - Get running immediately
2. **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - Detailed configuration
3. **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)** - API reference
4. **[FEATURE_CHECKLIST.md](./FEATURE_CHECKLIST.md)** - Complete features

---

**Ready to manage physiotherapy appointments like a pro!** 🎉

- **Gray**: `#6F6F6F`
- **Light Background**: `#F5F7F8`
- **Dark Background**: `#1A1D1F`

## 📁 Project Structure

```
alemad-physio/
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── About.jsx
│   │   │   ├── Services.jsx
│   │   │   ├── Booking.jsx
│   │   │   └── Contact.jsx
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── LanguageSwitcher.jsx
│   │   │   └── ThemeSwitcher.jsx
│   │   ├── context/
│   │   │   ├── LanguageContext.jsx
│   │   │   └── ThemeContext.jsx
│   │   ├── i18n/
│   │   │   ├── ar.json
│   │   │   └── en.json
│   │   ├── theme/
│   │   │   └── theme.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── README.md
├── backend/
│   ├── routes/
│   │   └── booking.js
│   ├── server.js
│   ├── package.json
│   └── README.md
├── README.md
└── .gitignore
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   cd alemad-physio
   ```

2. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   The frontend will run on `http://localhost:3000`

3. **Backend Setup** (in a new terminal)
   ```bash
   cd backend
   npm install
   npm run dev
   ```
   The backend will run on `http://localhost:5000`

## 📖 Usage

### Frontend

- **Home Page**: Hero section with services overview and booking CTA
- **About Page**: Information about the center and team
- **Services Page**: Detailed service offerings
- **Booking Page**: Form to book appointments
- **Contact Page**: Contact information and location map

### Language & Theme

- Use the **Language Switcher** button in the header to toggle between Arabic (RTL) and English (LTR)
- Use the **Theme Switcher** button to toggle between dark and light modes
- Settings are saved to localStorage and persist across sessions

### Backend API

#### POST /api/booking
Create a new booking

**Request Body:**
```json
{
  "name": "Ahmed Ali",
  "phone": "+966501234567",
  "service": "Physical Therapy",
  "date": "2025-01-15",
  "message": "Recovering from knee injury"
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

#### GET /api/bookings
Get all bookings (for admin purposes)

#### GET /api/booking/:id
Get specific booking by ID

## 🛠️ Technology Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **Material UI v5** - Component library
- **React Router v6** - Client-side routing
- **Emotion** - CSS-in-JS with RTL support
- **Tajawal Font** - Arabic typography

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **CORS** - Cross-origin resource sharing
- **Body Parser** - Request body parsing

## 📝 Environment Variables

### Frontend
No additional environment variables needed. API endpoint is configured to `http://localhost:5000`

### Backend
```
PORT=5000  # Default port
```

## 🌐 RTL/LTR Implementation

The application uses:
- **CacheProvider** from Emotion for RTL support
- **stylis-plugin-rtl** for RTL CSS generation
- **Dynamic document direction** based on selected language
- **Material UI RTL support** built-in

## 🔄 State Management

- **Language**: Context API with localStorage persistence
- **Theme**: Context API with localStorage persistence
- **Bookings**: Server-side state management

## 🎯 Future Enhancements

- Database integration (MongoDB, PostgreSQL)
- Email notifications for bookings
- SMS confirmations
- Admin dashboard
- Payment integration
- Doctor/therapist profiles
- Appointment scheduling calendar
- Patient medical records

## 📄 License

ISC

## 👨‍💻 Support

For issues or questions, please contact: info@alemad.com

---

**Built with ❤️ for Alemad Physiotherapy Center**
