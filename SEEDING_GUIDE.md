# Database Seeding Guide

Great! Your backend is deployed and running. Now you need to seed the database with initial data.

## Option 1: Seed from Local Machine (Recommended)

### Step 1: Update Local DATABASE_URL
Edit `backend/.env`:
```
DATABASE_URL="your-production-neon-connection-string"
```

Get your production connection string from:
1. Go to https://console.neon.tech
2. Find your project
3. Get the **Pooled connection** string

### Step 2: Run the Seed Script
```bash
cd backend
npm install
node seed.js
```

This will:
- Create admin user
- Create therapist users
- Create patient users
- Create sample services
- Create sample bookings

## Option 2: Run Seed on Render (Advanced)

Connect to your Render service and run:
```bash
node seed.js
```

## What Gets Created
- **Admin User**: Can manage the system
- **Therapist Accounts**: Can view/manage appointments
- **Patient Accounts**: Can book appointments
- **Services**: Different therapy services
- **Sample Bookings**: Test data

## After Seeding

1. Frontend will be able to:
   - Login with test accounts
   - Create bookings
   - View appointments
   - Manage users (admin)

2. Test the API at:
   - `https://your-render-url/health` - Health check
   - `https://your-render-url/api/bookings` - View bookings

## Need Help?

If seeding fails:
1. Check the DATABASE_URL is correct
2. Ensure it's the **pooled** connection from Neon
3. Try running locally first before production
