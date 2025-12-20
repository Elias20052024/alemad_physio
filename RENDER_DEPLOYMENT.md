# Render.com Deployment Configuration for Alemad Physio Backend

This file documents how to deploy the backend to Render.com

## Quick Deploy Steps

### 1. Prepare Backend
- Ensure `package.json` has proper build script
- Create `.env.production` file with:
  ```
  PORT=3000
  NODE_ENV=production
  DATABASE_URL=postgresql://...
  JWT_SECRET=your-secret-key
  CORS_ORIGIN=https://your-netlify-domain.netlify.app
  ```

### 2. Connect to Render
- Go to render.com
- Click "New +" → "Web Service"
- Connect GitHub repository
- Select `alemad_physio` repository

### 3. Configure Service
- **Name**: alemad-physio-backend
- **Environment**: Node
- **Region**: Choose closest to your users
- **Build Command**: 
  ```bash
  cd backend && npm install && prisma generate && prisma migrate deploy
  ```
- **Start Command**: 
  ```bash
  cd backend && npm start
  ```

### 4. Add Environment Variables
Set in Render dashboard under Environment:
- DATABASE_URL (from Render PostgreSQL)
- JWT_SECRET (generate a strong key)
- CORS_ORIGIN (your Netlify URL)
- NODE_ENV (production)
- EMAIL_USER (for notifications)
- EMAIL_PASSWORD (app password)

### 5. Create PostgreSQL Database
- Click "New +" → "PostgreSQL"
- Name: alemad-physio-db
- PostgreSQL Version: 15+
- Copy connection string to DATABASE_URL

### 6. Deploy
- Click "Create Web Service"
- Render automatically deploys
- Get your URL: `https://your-service-name.onrender.com`

## Environment Variables Reference

```
PORT=3000
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@host:5432/alemad_physio
JWT_SECRET=your-32-character-secret-key-minimum
CORS_ORIGIN=https://your-site.netlify.app
JWT_EXPIRE=7d
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
RENDER_EXTERNAL_URL=https://your-service.onrender.com
```

## Monitoring

- **Logs**: Service → Logs tab
- **Metrics**: Service → Metrics tab
- **Database**: PostgreSQL → Metrics tab

## Scaling

- Upgrade instance type in Service settings
- Add read replicas for database
- Use caching layer (Redis) for performance

## Backups

Render automatically creates daily backups of PostgreSQL.
Download backups from Database → Backups tab.

## Custom Domain

1. Get your Render URL
2. Add DNS records (CNAME) pointing to Render
3. Add custom domain in Service settings
4. Update CORS_ORIGIN to custom domain

## Troubleshooting

**Build fails:**
- Check build log for specific errors
- Verify DATABASE_URL format
- Ensure Prisma migrations exist

**Database connection error:**
- Verify DATABASE_URL is correct
- Check database is running
- Run migrations manually if needed

**500 errors:**
- Check service logs
- Verify all environment variables set
- Check database connectivity
