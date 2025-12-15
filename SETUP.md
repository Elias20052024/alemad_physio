# 🚀 Setup & Run Guide

## Quick Start - 3 Simple Steps

### Step 1: Install Frontend Dependencies
```bash
cd frontend
npm install
```

### Step 2: Install Backend Dependencies
```bash
cd ../backend
npm install
```

### Step 3: Run Both Services

**Terminal 1 - Frontend:**
```bash
cd frontend
npm run dev
```
✅ Frontend: http://localhost:3000

**Terminal 2 - Backend:**
```bash
cd backend
npm run dev
```
✅ Backend: http://localhost:5000

---

## 📋 Project Features Checklist

✅ React + Vite with Vite config
✅ Material UI v5 with custom brand colors
✅ RTL/LTR support with CacheProvider + stylis-plugin-rtl
✅ Dark/Light theme toggle
✅ Multi-language (Arabic/English) with Context API
✅ LocalStorage for theme & language persistence
✅ 5 Pages: Home, About, Services, Booking, Contact
✅ Header with logo, nav, language & theme switchers
✅ Footer with company info and social links
✅ Responsive design (mobile, tablet, desktop)
✅ Booking form with backend integration
✅ Contact page with Google Maps iframe
✅ Express.js backend with booking API
✅ CORS enabled for frontend-backend communication
✅ Health check endpoint
✅ Complete documentation with README files

---

## 🎨 Brand Colors Applied

```
Primary:        #2D89B3  (Header, buttons, links)
Primary Light:  #49A3D0  (Hover states, alternatives)
Accent Green:   #A7D676  (Secondary actions, highlights)
Gray:           #6F6F6F  (Text secondary, borders)
Light BG:       #F5F7F8  (Light mode background)
Dark BG:        #1A1D1F  (Dark mode background)
```

---

## 🌍 Language & Theme

### Language Switching
- Click "AR" button for Arabic (RTL)
- Click "EN" button for English (LTR)
- Preference saved to localStorage

### Theme Switching
- Sun icon = Light mode
- Moon icon = Dark mode
- Preference saved to localStorage

---

## 📞 Contact Info (Demo)

- **Phone**: +966 50 123 4567
- **WhatsApp**: +966 50 123 4567
- **Email**: info@alemad.com
- **Address**: Riyadh, Saudi Arabia

---

## 🔗 Frontend Routes

| Route | Page | Description |
|-------|------|-------------|
| `/` | Home | Hero section, services overview, booking CTA |
| `/about` | About | Company info, mission, team |
| `/services` | Services | Detailed service descriptions |
| `/booking` | Booking | Appointment booking form |
| `/contact` | Contact | Contact info and map |

---

## 🔌 Backend API

### Health Check
```
GET http://localhost:5000/health
```

### Create Booking
```
POST http://localhost:5000/api/booking
```

### Get All Bookings
```
GET http://localhost:5000/api/bookings
```

### Get Specific Booking
```
GET http://localhost:5000/api/booking/:id
```

---

## 📁 Project Structure

```
alemad-physio/
├── frontend/
│   ├── src/
│   │   ├── pages/         # 5 page components
│   │   ├── components/    # Header, Footer, Switchers
│   │   ├── context/       # Language & Theme contexts
│   │   ├── i18n/          # ar.json, en.json
│   │   ├── theme/         # Material UI themes
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── README.md
├── backend/
│   ├── routes/
│   │   └── booking.js     # Booking API routes
│   ├── server.js          # Express setup
│   ├── package.json
│   └── README.md
├── README.md
└── .gitignore
```

---

## ⚡ Build for Production

**Frontend:**
```bash
cd frontend
npm run build
npm run preview
```

**Backend:**
```bash
cd backend
npm start
```

---

## 🔧 Troubleshooting

### Port Already in Use
```bash
# Frontend (port 3000)
# Find and kill process or change port in vite.config.js

# Backend (port 5000)
# Find and kill process or change PORT in server.js
```

### CORS Error
- Make sure backend is running on http://localhost:5000
- CORS is enabled in backend/server.js

### Translation Not Working
- Check i18n files exist: frontend/src/i18n/ar.json and en.json
- Clear localStorage and refresh

---

## 📚 Dependencies Installed

**Frontend:**
- react, react-dom, react-router-dom
- @mui/material, @mui/icons-material
- @emotion/react, @emotion/styled
- stylis, stylis-plugin-rtl
- vite, @vitejs/plugin-react

**Backend:**
- express, cors, body-parser

---

## 💡 Next Steps (Optional Enhancements)

1. Add database (MongoDB, PostgreSQL)
2. Implement email notifications (Nodemailer)
3. Add SMS confirmations
4. Create admin dashboard
5. Add payment integration (Stripe, PayPal)
6. Add patient login system
7. Implement appointment calendar
8. Add doctor/therapist profiles

---

## 📞 Support

For questions or issues:
- Check README files in frontend/ and backend/
- Review component documentation
- Check backend API routes

---

**✨ Your Alemad Physiotherapy Center website is ready to use!**
