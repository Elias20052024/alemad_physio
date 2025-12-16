# 🚀 Deploy Backend to Render (Monorepo Setup)

This guide will help you deploy **ONLY the backend** to Render while keeping your monorepo structure intact.

## ✅ Pre-Deployment Checklist

- [x] Backend runs on `process.env.PORT` (default: 5000)
- [x] `backend/package.json` has `"start": "node src/server.js"`
- [x] `.env` file is in `.gitignore` ✅
- [x] All code is pushed to GitHub ✅

---

## 📋 Step-by-Step Deployment

### Step 1: Create a Render Account

1. Go to [render.com](https://render.com)
2. Sign up with GitHub (recommended for easy integration)
3. Connect your GitHub account

---

### Step 2: Create a New Web Service

1. Click **"New +"** button
2. Select **"Web Service"**
3. Connect your GitHub repository (`alemad_physio`)
4. Select the repository and click **"Connect"**

---

### Step 3: Configure the Web Service

Fill in the following details:

| Field | Value |
|-------|-------|
| **Name** | `alemad-backend` |
| **Environment** | `Node` |
| **Region** | Select closest to you (e.g., `Singapore` for MENA) |
| **Branch** | `main` |
| **Build Command** | `cd backend && npm install && npx prisma generate` |
| **Start Command** | `cd backend && npm start` |

**Important:** The `cd backend` is needed because this is a monorepo!

---

### Step 4: Add Environment Variables

Click **"Advanced"** and add the following environment variables:

```env
DATABASE_URL="postgresql://neondb_owner:npg_fKdT8DLURFy6@ep-summer-cake-a14gqbh9-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
NODE_ENV=production
JWT_SECRET=your-secret-key-change-this-in-production
PORT=10000
```

⚠️ **Important:**
- Copy your exact `DATABASE_URL` from your `.env` file
- Change `JWT_SECRET` to a strong random value
- Keep `PORT=10000` (Render assigns ports dynamically)

---

### Step 5: Configure Prisma for Production

Add this build command to ensure Prisma is ready:

**Build Command:**
```bash
cd backend && npm install && npx prisma generate && npx prisma migrate deploy
```

This will:
1. Install dependencies
2. Generate Prisma Client
3. Run pending database migrations

---

### Step 6: Deploy

1. Click **"Create Web Service"**
2. Render will automatically start deploying
3. Watch the deployment logs in the **"Logs"** tab

**Deployment typically takes 2-5 minutes**

---

## ✅ Verify Deployment

Once deployed, you'll get a URL like:
```
https://alemad-backend-xxxx.onrender.com
```

Test your backend:

### Health Check
```bash
curl https://alemad-backend-xxxx.onrender.com/health
```

Expected response:
```json
{
  "status": "Backend is running!",
  "timestamp": "2025-12-16T10:30:00.000Z"
}
```

### Test Patient Login
```bash
curl -X POST https://alemad-backend-xxxx.onrender.com/api/patients/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "ahmed@example.com",
    "password": "Patient@123"
  }'
```

Expected response:
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "patient": {
    "id": 1,
    "fullName": "Ahmed Hassan",
    "email": "ahmed@example.com",
    "phone": "+966501234567",
    "age": 35,
    "gender": "Male"
  }
}
```

---

## 🔧 Update Frontend API URL

Now update your frontend to use the deployed backend:

**File:** `frontend/src/.env`

```env
VITE_API_URL=https://alemad-backend-xxxx.onrender.com/api
```

Replace `alemad-backend-xxxx` with your actual Render URL.

---

## 📊 Available API Endpoints

Once deployed, you can access:

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/health` | GET | Health check |
| `/api/patients/login` | POST | Patient login |
| `/api/patients/register` | POST | Patient registration |
| `/api/patients` | GET | Get all patients |
| `/api/patients/:id` | GET | Get patient by ID |
| `/api/appointments` | GET | Get all appointments |
| `/api/therapists` | GET | Get all therapists |

---

## 🚨 Troubleshooting

### Build Failed

**Error:** `Cannot find module '@prisma/client'`

**Solution:**
```bash
cd backend && npm install && npx prisma generate
```

Then redeploy.

---

### Database Connection Error

**Error:** `connect ECONNREFUSED`

**Solution:**
1. Verify `DATABASE_URL` is correct in environment variables
2. Check Neon dashboard for database status
3. Ensure database URL includes `?sslmode=require`

---

### 500 Internal Server Error

**Solution:**
1. Check Render logs for error details
2. Verify all environment variables are set
3. Check that Prisma migrations are applied

---

## 🔄 Continuous Deployment

Render automatically redeploys when you:
1. Push to `main` branch on GitHub
2. Or manually trigger via Render dashboard

---

## 📝 Environment Variables Reference

```env
# Database Connection
DATABASE_URL=postgresql://user:password@host:port/dbname?sslmode=require

# Security
JWT_SECRET=your-super-secret-key-min-32-chars-recommended

# Environment
NODE_ENV=production

# Server Port (Render specific)
PORT=10000
```

---

## ✨ Next Steps

1. ✅ Deploy backend to Render
2. ⏭️ Update frontend `.env` with Render URL
3. ⏭️ Test all API endpoints
4. ⏭️ Deploy frontend (optional - can use Vercel, Netlify, etc.)

---

## 📞 Support

If you encounter issues:

1. **Check Render Logs:** Dashboard → Your App → Logs
2. **Check GitHub Actions:** Verify deployment workflow
3. **Test API Locally:** Ensure backend works locally first
4. **Verify Database:** Check Neon console for connectivity

---

## 🎉 Success!

Your backend is now deployed! 🚀

**Your API is live at:**
```
https://alemad-backend-xxxx.onrender.com
```

Test it, integrate with frontend, and you're done!
