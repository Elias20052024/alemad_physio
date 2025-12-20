# Step-by-Step Deployment Quick Start

Follow these exact steps to deploy your Alemad Physio application.

## 🟢 STEP 1: Prepare Your Project (5 minutes)

### 1.1 Verify your code is pushed to GitHub
```bash
cd "c:/Users/Elias/Desktop/Projects/alemad physio"
git status
git push origin main
```

### 1.2 Build frontend locally to test
```bash
cd frontend
npm install
npm run build
```
✅ Should create a `dist/` folder with no errors.

### 1.3 Update frontend API URL
Edit `frontend/src/config/api.js` (or wherever your API URL is configured):
```javascript
const API_BASE_URL = process.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
```

---

## 🟢 STEP 2: Create Netlify Account (5 minutes)

### 2.1 Sign up for Netlify
- Go to: https://app.netlify.com/signup
- Click **"Sign up with GitHub"**
- Authorize Netlify to access your GitHub account
- Click **"Authorize"**

### 2.2 Create a new site from Git
- Click **"New site from Git"** button
- Choose **GitHub**
- Search for `alemad_physio`
- Click to select the repository

---

## 🟢 STEP 3: Configure Netlify Build (5 minutes)

When you see the build configuration screen:

### 3.1 Set build settings
- **Base directory**: `frontend`
- **Build command**: `npm install && npm run build`
- **Publish directory**: `frontend/dist`

### 3.2 Click **"Deploy"**
- Netlify will start building
- Wait 2-5 minutes for deployment to complete
- You'll get a URL like: `https://random-name.netlify.app`

✅ Save your Netlify URL!

---

## 🟢 STEP 4: Deploy Backend to Render (15 minutes)

### 4.1 Sign up for Render.com
- Go to: https://render.com
- Click **"Get Started"**
- Sign up with GitHub
- Authorize and create account

### 4.2 Create PostgreSQL database
1. Click **"New +"** in top menu
2. Select **"PostgreSQL"**
3. Configure:
   - **Name**: `alemad-physio-db`
   - **Database**: `alemad_physio`
   - **User**: `admin`
   - Leave region as default
4. Click **"Create Database"**
5. ⏳ Wait 2-3 minutes for database to be ready
6. Copy the connection string when ready

### 4.3 Create Web Service for backend
1. Click **"New +"** again
2. Select **"Web Service"**
3. Click **"Connect"** next to your GitHub account
4. Find and select `alemad_physio`
5. Click **"Connect"**

### 4.4 Configure Web Service
Fill in the form:
- **Name**: `alemad-physio-backend`
- **Environment**: `Node`
- **Region**: Choose one closest to you
- **Branch**: `main`
- **Build Command**: 
  ```
  cd backend && npm install && prisma generate && prisma migrate deploy
  ```
- **Start Command**: 
  ```
  cd backend && npm start
  ```

Click **"Create Web Service"**

### 4.5 Add environment variables
1. Go to **Settings** tab
2. Scroll to **Environment**
3. Add these variables:

| Key | Value |
|-----|-------|
| `DATABASE_URL` | Paste the PostgreSQL connection string from Step 4.2 |
| `NODE_ENV` | `production` |
| `JWT_SECRET` | Generate a strong key: `openssl rand -base64 32` |
| `CORS_ORIGIN` | Your Netlify URL from Step 3 (e.g., `https://random-name.netlify.app`) |
| `PORT` | `3000` |

Click **"Save"**

⏳ Service will redeploy automatically (2-3 minutes)

✅ When build succeeds, you'll get a URL like: `https://alemad-physio-backend.onrender.com`

---

## 🟢 STEP 5: Connect Frontend to Backend (5 minutes)

### 5.1 Update Netlify environment variables
1. Go to Netlify dashboard
2. Click on your site
3. **Settings** → **Build & deploy** → **Environment**
4. Click **"Edit variables"**
5. Add new variable:
   - **Key**: `VITE_API_BASE_URL`
   - **Value**: `https://alemad-physio-backend.onrender.com/api`
   (Replace with your actual Render backend URL)
6. Click **"Save"**

### 5.2 Trigger Netlify redeploy
1. Go to **Deploys** tab in Netlify
2. Click **"Trigger deploy"** → **"Deploy site"**
3. Wait for deployment to complete

✅ Your frontend will now be connected to your backend!

---

## 🟢 STEP 6: Test the Deployment (10 minutes)

### 6.1 Test Frontend
1. Visit your Netlify URL: `https://random-name.netlify.app`
2. Page should load without errors
3. Open browser console (F12) - should have no red errors
4. Check all navigation works

### 6.2 Test API Connection
1. Open browser console (F12)
2. Run this command:
```javascript
fetch('https://alemad-physio-backend.onrender.com/api/patients')
  .then(r => r.json())
  .then(d => console.log(d))
  .catch(e => console.error(e))
```
3. Should see patient data or proper error message (not CORS error)

### 6.3 Test Authentication
1. Try to log in with test credentials
2. Token should be stored in localStorage
3. Protected pages should require login
4. Logout should clear token

✅ Everything working? You're deployed!

---

## 🟢 STEP 7: Add Custom Domain (Optional, 10 minutes)

### 7.1 Get a domain
- Use GoDaddy, Namecheap, or Google Domains
- Purchase domain: `your-domain.com`

### 7.2 Connect to Netlify
1. Netlify dashboard → **Settings** → **Domain management**
2. Click **"Add custom domain"**
3. Enter your domain: `your-domain.com`
4. Follow DNS setup instructions
5. Add DNS records (usually CNAME pointing to Netlify)

### 7.3 Update backend CORS
1. Go to Render dashboard
2. Find your backend service
3. **Settings** → **Environment**
4. Update `CORS_ORIGIN` to your custom domain
5. Service will redeploy

---

## 📝 Summary of URLs

After deployment, you'll have:

- **Frontend URL**: `https://your-site.netlify.app`
- **Backend URL**: `https://your-service.onrender.com`
- **API Endpoint**: `https://your-service.onrender.com/api`
- **Database**: Hosted on Render PostgreSQL

---

## ❌ Common Issues & Fixes

### "Build failed" on Netlify
- Check build logs in **Logs** → **Deploy log**
- Verify `frontend/package.json` exists
- Check Node version is 18+

### "Cannot reach backend" error
- Verify `VITE_API_BASE_URL` is set in Netlify
- Check Render backend is running (green status)
- Verify CORS_ORIGIN matches your frontend URL

### "Database connection error"
- Check DATABASE_URL in Render environment
- Verify PostgreSQL database is running
- Run migrations: `prisma migrate deploy`

### Blank white page
- Open F12 console for error messages
- Check API URL is correct
- Verify React app built successfully

### CORS errors in console
- Update `CORS_ORIGIN` in backend to match frontend URL
- Restart backend service
- Clear browser cache and reload

---

## ✅ Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Frontend builds locally without errors
- [ ] Netlify account created
- [ ] Frontend deployed to Netlify
- [ ] Render account created
- [ ] PostgreSQL database created on Render
- [ ] Backend deployed to Render
- [ ] Environment variables set correctly
- [ ] Frontend connected to backend API
- [ ] Frontend redeployed after API URL change
- [ ] Frontend loads without errors
- [ ] API calls working (test in console)
- [ ] Login/authentication working
- [ ] All pages accessible and functional

---

## 🎉 You're Deployed!

Your Alemad Physio application is now live on the internet!

### Share your site:
- Frontend: `https://your-site.netlify.app`
- Tell users to visit this URL

### Monitor your site:
- Netlify: Check **Analytics** and **Logs**
- Render: Check **Logs** and **Metrics**

### Need to make changes?
1. Edit code locally
2. Push to GitHub: `git push origin main`
3. Netlify + Render auto-redeploy automatically

---

## 📞 Need Help?

If something doesn't work:

1. **Check the logs first**
   - Netlify: **Logs** → **Deploy log**
   - Render: Click service → **Logs** tab

2. **Look for error messages** - they tell you what's wrong

3. **Double-check environment variables** - typos cause 90% of issues

4. **Test API from console** - manually verify backend is working

5. **Check GitHub Actions** (if available) - shows build status

---

**Congratulations on deploying! 🚀**
