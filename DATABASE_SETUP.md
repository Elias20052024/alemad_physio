# Database Setup Required

## Issue
Your current DATABASE_URL points to a shadow database (`prisma_migrate_shadow_db_...`), which cannot be used for production deployments.

## Solution

### Step 1: Create a Production Database in Neon
1. Go to https://console.neon.tech
2. Create a new database project (if you don't have one)
3. Copy the connection string (it should look like: `postgresql://username:password@host/database_name`)

### Step 2: Update Render Environment Variables
1. Go to your Render dashboard
2. Navigate to your backend service
3. Go to Environment Variables
4. Update `DATABASE_URL` with your new production database connection string
5. Remove any `SHADOW_DATABASE_URL` variable if present

### Step 3: Deploy
Once the DATABASE_URL is updated in Render's environment, trigger a new deployment.

## Note
We've removed all migration and db push commands from the deployment process. The backend will:
1. Install dependencies
2. Generate Prisma client
3. Start the server

You can manually run database operations locally using:
- `npm run migrate` - Create migrations
- `npm run build` - Generate Prisma client
