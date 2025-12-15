# 🚀 Quick Start - 5 Minutes Setup

## Prerequisites
- Node.js v16+
- PostgreSQL running
- npm

## Step 1: Setup Database
```bash
createdb alemad_physio
```

## Step 2: Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env: Set DATABASE_URL and JWT_SECRET
npm run migrate
npm run dev
```

Backend: **http://localhost:5000**

## Step 3: Create Admin Account
```bash
# In new terminal (backend folder)
node -e "
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();
(async () => {
  const hash = await bcrypt.hash('admin123', 10);
  await prisma.admin.create({
    data: { name: 'Admin', email: 'admin@alemad.com', password: hash }
  });
  console.log('✅ Admin: admin@alemad.com / admin123');
  process.exit(0);
})();
"
```

## Step 4: Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```

Frontend: **http://localhost:5173**

## Step 5: Access
- 🏠 Public: http://localhost:5173
- 🔐 Admin: http://localhost:5173/admin/login
- 📚 API: http://localhost:5000/api

## Admin Credentials
- Email: `admin@alemad.com`
- Password: `admin123`

## Quick Demo
1. Login to admin panel
2. Add a therapist
3. Set therapist schedule (Mon-Fri 9am-5pm)
4. Go to booking page
5. Book an appointment

## Files to Know
- **SETUP_GUIDE.md** - Full setup instructions
- **API_DOCUMENTATION.md** - API reference
- **backend/prisma/schema.prisma** - Database schema
- **frontend/src/services/apiService.js** - API client

---

Ready to go! 🎉

```bash
cd frontend
npm install
```

### Step 2: Install Backend
```bash
cd backend
npm install
```

### Step 3a: Start Frontend (Terminal 1)
```bash
cd frontend
npm run dev
```
✅ Opens at: **http://localhost:3000**

### Step 3b: Start Backend (Terminal 2)
```bash
cd backend
npm run dev
```
✅ Runs at: **http://localhost:5000**

---

## ✨ Features Ready to Use

✅ **2 Languages**: Arabic (RTL) & English (LTR)
✅ **2 Themes**: Light & Dark mode
✅ **5 Pages**: Home, About, Services, Booking, Contact
✅ **Full API**: Booking form → Backend → Storage
✅ **Responsive**: Mobile, Tablet, Desktop
✅ **Accessible**: Material UI components
✅ **Professional**: Brand colors applied

---

## 🎨 Quick Settings

### Change Brand Colors
Edit: `frontend/src/theme/theme.js`
```javascript
primary: '#2D89B3'  // Blue
accentGreen: '#A7D676'  // Green
```

### Add Translations
Edit: `frontend/src/i18n/ar.json` and `en.json`
```json
{
  "myKey": {
    "myValue": "My translation"
  }
}
```

### Modify Content
Edit pages: `frontend/src/pages/*.jsx`

---

## 📞 Test Booking API

```bash
curl -X POST http://localhost:5000/api/booking \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Ahmed",
    "phone": "+966501234567",
    "service": "Physical Therapy",
    "date": "2025-01-20"
  }'
```

---

## 📁 Key Folders

| Folder | Purpose |
|--------|---------|
| `frontend/src/pages/` | Edit page content |
| `frontend/src/theme/` | Edit brand colors |
| `frontend/src/i18n/` | Edit translations |
| `backend/routes/` | Edit API logic |

---

## 🆘 Troubleshooting

**Port already in use?**
```bash
# Windows - Kill process on port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**Module not found?**
```bash
# Reinstall dependencies
rm -r node_modules package-lock.json
npm install
```

**API not responding?**
- Check backend is running on http://localhost:5000
- Check console for errors
- Ensure CORS is enabled in `backend/server.js`

---

## 📚 Documentation Files

1. **SETUP.md** - Detailed setup guide
2. **README.md** - Full project info
3. **PROJECT_SUMMARY.md** - What was built
4. **DOCUMENTATION_INDEX.md** - Doc guide
5. **FILE_TREE.md** - File structure
6. **frontend/README.md** - Frontend docs
7. **backend/README.md** - Backend docs

---

## 🔐 Environment Files

Create these files (templates provided as `.env.example`):

**frontend/.env** (optional)
```
VITE_API_URL=http://localhost:5000
```

**backend/.env** (optional)
```
PORT=5000
NODE_ENV=development
```

---

## 🎯 Next Steps

1. ✅ Get it running
2. ✅ Test all pages
3. ✅ Try language switcher (AR/EN)
4. ✅ Try theme switcher (Dark/Light)
5. ✅ Test booking form
6. ✅ Customize with your content
7. ✅ Deploy to production

---

## 💡 Common Edits

### Change Site Title
`frontend/index.html` → `<title>Your Title</title>`

### Change Logo
`frontend/src/components/Header.jsx` → Replace "💠 Alemad"

### Change Services
`frontend/src/pages/Home.jsx` → Edit services array

### Change Contact Info
`frontend/src/i18n/ar.json` and `en.json` → Edit contact section

---

## 🚀 Deploy

**Frontend:**
```bash
npm run build
# Deploy 'dist' folder to Vercel/Netlify
```

**Backend:**
```bash
# Deploy to Heroku/Railway/AWS
# Update frontend API URL to production
```

---

## 📞 Support

- Check documentation files
- Review component comments
- Check console for errors
- Review backend API examples in `backend/README.md`

---

## ✅ Verification

Before going live:
- [ ] Frontend loads on port 3000
- [ ] Backend runs on port 5000
- [ ] Language switcher works
- [ ] Theme switcher works
- [ ] Booking form submits
- [ ] All pages load
- [ ] No console errors
- [ ] Responsive on mobile

---

**🎉 You're ready to go! Start coding!**

*Project: Alemad Physiotherapy Center*
*Status: ✅ Complete & Ready to Use*
