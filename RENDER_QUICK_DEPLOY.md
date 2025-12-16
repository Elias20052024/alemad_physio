# 🚀 Render Deployment - Quick Reference

## 1️⃣ Login to Render
- Go to [render.com](https://render.com)
- Connect GitHub

## 2️⃣ Create Web Service
- Click "New +" → "Web Service"
- Connect `alemad_physio` repository

## 3️⃣ Fill in These Fields

| Field | Value |
|-------|-------|
| **Name** | `alemad-backend` |
| **Environment** | `Node` |
| **Branch** | `main` |
| **Build Command** | `cd backend && npm install && npx prisma generate && npx prisma migrate deploy` |
| **Start Command** | `cd backend && npm start` |

## 4️⃣ Add Environment Variables (Click "Advanced")

```env
DATABASE_URL="postgresql://neondb_owner:npg_fKdT8DLURFy6@ep-summer-cake-a14gqbh9-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
NODE_ENV=production
JWT_SECRET=your-strong-secret-key-here
PORT=10000
```

## 5️⃣ Click "Create Web Service"

Wait 2-5 minutes for deployment...

## 6️⃣ Get Your URL

After successful deployment:
```
https://alemad-backend-xxxx.onrender.com
```

## 7️⃣ Test It Works

```bash
curl https://alemad-backend-xxxx.onrender.com/health
```

Should return:
```json
{"status": "Backend is running!", "timestamp": "..."}
```

## 8️⃣ Update Frontend

**File:** `frontend/src/.env`
```env
VITE_API_URL=https://alemad-backend-xxxx.onrender.com/api
```

## ✅ Done!

Your backend is now live in the cloud! 🎉
