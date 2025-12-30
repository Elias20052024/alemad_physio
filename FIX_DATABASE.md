# Fix Database Connection - Step by Step

## Problem
Your current DATABASE_URL points to a shadow database which doesn't work:
```
postgresql://neondb_owner:npg_fKdT8DLURFy6@...prisma_migrate_shadow_db_...
```

Shadow databases are temporary and can't be used for production.

## Solution - Create a Real Production Database

### Step 1: Go to Neon Console
1. Open https://console.neon.tech
2. Sign in with your account

### Step 2: Create a New Database (if needed)
1. Click "Create a new project" or go to existing project
2. Name it: `alemad_physio_production`
3. Select PostgreSQL version
4. Click "Create project"

### Step 3: Get Your Connection String
1. In the Neon console, go to your project
2. Click "Connection string" 
3. Select "Pooled connection" (important for Render)
4. Copy the full connection string - it will look like:
```
postgresql://neondb_owner:PASSWORD@ep-XXXXX-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
```

### Step 4: Update Render Environment
1. Go to https://dashboard.render.com
2. Find your `alemad-physio-backend` service
3. Go to "Environment" section
4. Find or create `DATABASE_URL` variable
5. Replace the entire value with your new connection string from Step 3
6. Click "Save"

### Step 5: Redeploy
1. Go to "Deploys" tab
2. Click the latest failed deployment
3. Click "Redeploy" button

## Local Testing (Optional)
To test the database URL locally before deploying:
```bash
cd backend
DATABASE_URL="YOUR_NEW_URL_HERE" npm run migrate
```

Replace `YOUR_NEW_URL_HERE` with the connection string from Step 3.

## Need Help?
- Make sure you're copying the **POOLED** connection string, not the direct one
- The URL should include `?sslmode=require`
- Never share your connection string publicly
