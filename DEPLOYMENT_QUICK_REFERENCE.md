# 🚀 Deployment Quick Reference

## Overview

Your Alemad Physio application uses a **frontend + backend** architecture:

```
┌─────────────────────────────────────────────────────────────┐
│                      FRONTEND (React)                        │
│                   Deploy to Netlify                          │
│          https://your-site.netlify.app                       │
└────────────────────────────┬────────────────────────────────┘
                             │
                      API Calls Over HTTPS
                             │
┌────────────────────────────▼────────────────────────────────┐
│                    BACKEND (Node.js)                         │
│                   Deploy to Render                           │
│        https://your-service.onrender.com/api                 │
│                                                              │
│     ┌────────────────────────────────────────────────┐      │
│     │    PostgreSQL Database (on Render)            │      │
│     │    - Users, Patients, Appointments, etc.     │      │
│     └────────────────────────────────────────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

---

## Deployment Timeline

| Service | Time | Difficulty | Cost |
|---------|------|-----------|------|
| **Netlify (Frontend)** | 10 min | Easy | Free |
| **Render (Backend)** | 15 min | Medium | $7/month+ |
| **Render (Database)** | 5 min | Easy | $15/month+ |
| **Total Setup** | **30 min** | **Easy** | **~$22/month** |

---

## Files You Need to Read

### For Complete Guide:
📄 **`DEPLOYMENT_STEPS.md`** - **START HERE** ⭐
- Step-by-step instructions with exact commands
- Screenshots descriptions
- 30 minutes to full deployment

### For Detailed Information:
📄 **`NETLIFY_DEPLOYMENT_GUIDE.md`**
- Comprehensive Netlify documentation
- Environment variables
- Custom domains
- Troubleshooting

📄 **`RENDER_DEPLOYMENT.md`**
- Backend deployment details
- Database configuration
- Monitoring and scaling

---

## Quick Start (5 Minutes)

### What You Need:
- ✅ GitHub account (already have it)
- ✅ Code pushed to GitHub (already done)
- ✅ Netlify account (free at netlify.com)
- ✅ Render account (free at render.com)

### The Process:
1. **Frontend**: Connect GitHub repo to Netlify → Auto-deploys
2. **Backend**: Create Render web service → Deploy
3. **Database**: Create Render PostgreSQL → Connect
4. **Link**: Set API URL in Netlify env vars → Done!

---

## Configuration Files Added

### `netlify.toml` 📋
- Tells Netlify how to build and deploy
- Configures redirects for React Router
- Sets security headers
- **Already configured** ✅

### `.env.example` 📝
- Shows what environment variables you need
- Copy and update with your actual values
- Frontend: `VITE_API_BASE_URL`
- Backend: `DATABASE_URL`, `JWT_SECRET`, `CORS_ORIGIN`

### `deploy-to-netlify.sh` 🔧
- Shell script to automate frontend deployment
- Builds locally first to catch errors
- Pushes to GitHub automatically

### `deploy-to-render.sh` 🔧
- Shell script to prepare backend
- Installs dependencies
- Generates Prisma schema

---

## Essential Environment Variables

### Frontend (Netlify Dashboard)

```
VITE_API_BASE_URL = https://your-backend.onrender.com/api
```

### Backend (Render Dashboard)

```
DATABASE_URL = postgresql://user:pass@host:5432/db
JWT_SECRET = [generate-strong-key-32-chars-minimum]
CORS_ORIGIN = https://your-site.netlify.app
NODE_ENV = production
PORT = 3000
```

---

## Key URLs After Deployment

| Service | URL | Purpose |
|---------|-----|---------|
| **Frontend** | `https://your-site.netlify.app` | Your app for users |
| **Backend API** | `https://your-service.onrender.com/api` | API endpoint for frontend |
| **Database** | Internal (not public) | Stores all data |

---

## Monthly Costs Estimate

| Service | Plan | Cost |
|---------|------|------|
| Netlify | Free | $0 |
| Render Web (Backend) | Starter | $7 |
| Render PostgreSQL | Starter | $15 |
| **Total Monthly** | - | **~$22** |

> Can scale up or use free tiers for testing

---

## Deployment Checklist

### Before Starting:
- [ ] All code is pushed to GitHub
- [ ] Frontend builds locally: `npm run build`
- [ ] No console errors locally

### Netlify Deployment:
- [ ] Sign up at netlify.com
- [ ] Connect GitHub repository
- [ ] Set build command and directory
- [ ] Add `VITE_API_BASE_URL` environment variable
- [ ] Wait for deployment to complete
- [ ] Save your Netlify URL

### Render Deployment:
- [ ] Sign up at render.com
- [ ] Create PostgreSQL database
- [ ] Create Web Service
- [ ] Set build/start commands
- [ ] Add all environment variables
- [ ] Deploy and wait for success
- [ ] Save your Render URL

### Final Steps:
- [ ] Update `VITE_API_BASE_URL` in Netlify with Render URL
- [ ] Trigger Netlify redeploy
- [ ] Test frontend loads
- [ ] Test API calls work
- [ ] Test authentication works

---

## Common Issues & Quick Fixes

### ❌ "Cannot reach API"
```
✅ Solution:
1. Verify VITE_API_BASE_URL is set in Netlify
2. Check Render backend is running (green status)
3. Verify CORS_ORIGIN in Render matches Netlify URL
```

### ❌ "Database connection error"
```
✅ Solution:
1. Check DATABASE_URL is correct in Render env vars
2. Verify PostgreSQL database is running
3. Run migrations on Render
```

### ❌ "Build failed"
```
✅ Solution:
1. Check build logs in Netlify/Render dashboard
2. Verify dependencies are installed
3. Check Node version is 18+
```

### ❌ "Blank white page"
```
✅ Solution:
1. Open F12 console to see errors
2. Check API URL configuration
3. Clear cache and reload
```

---

## Deployment Architecture

```
GitHub Repository
      │
      ├─→ Netlify (Frontend)
      │   ├─ Builds on: npm run build
      │   ├─ Hosted: CDN globally
      │   └─ URL: *.netlify.app
      │
      └─→ Render (Backend)
          ├─ Builds on: npm install + migrations
          ├─ Hosted: Server + Database
          └─ URL: *.onrender.com
```

---

## Post-Deployment Tasks

After successful deployment:

### 1. Add Custom Domain (Optional)
- Purchase domain (GoDaddy, Namecheap, etc.)
- Point DNS to Netlify
- Update `CORS_ORIGIN` in backend

### 2. Set Up Monitoring
- Netlify: Enable analytics
- Render: Monitor logs and metrics
- Database: Check backup schedule

### 3. Configure Notifications (Optional)
- Email setup for user notifications
- Admin alerts for new bookings
- Appointment reminders

### 4. Security Hardening
- Enable HTTPS (automatic)
- Set up firewall rules
- Configure backup retention
- Enable audit logging

### 5. Performance Optimization
- Enable caching headers
- Optimize image sizes
- Monitor Core Web Vitals
- Set up CDN (Netlify has built-in)

---

## Next Steps

1. **Read**: `DEPLOYMENT_STEPS.md` for step-by-step guide
2. **Sign Up**: Create Netlify and Render accounts
3. **Deploy Frontend**: Connect to Netlify (5 minutes)
4. **Deploy Backend**: Create Render service (15 minutes)
5. **Test**: Verify everything works
6. **Monitor**: Check logs regularly

---

## Support Resources

- **Netlify Help**: https://docs.netlify.com
- **Render Docs**: https://docs.railway.app
- **Vite Guide**: https://vitejs.dev/guide/
- **Prisma Deployment**: https://www.prisma.io/docs/guides/deployment

---

## Questions?

Check these files in order:
1. `DEPLOYMENT_STEPS.md` - Most common questions
2. `NETLIFY_DEPLOYMENT_GUIDE.md` - Detailed setup
3. `RENDER_DEPLOYMENT.md` - Backend specifics
4. Search GitHub Issues for your problem

---

**Ready to deploy? Start with `DEPLOYMENT_STEPS.md`! 🚀**
