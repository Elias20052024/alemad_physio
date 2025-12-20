#!/bin/bash

# Alemad Physio - Backend Deployment Preparation
# This script prepares the backend for Render deployment

echo "🚀 Alemad Physio Backend Deployment Preparation"
echo "=============================================="
echo ""

echo "📦 Step 1: Installing backend dependencies..."
cd backend
npm install

echo ""
echo "🔧 Step 2: Building Prisma schema..."
npm run prisma:generate

echo ""
echo "✅ Backend preparation complete!"
echo ""

echo "Next steps:"
echo "1. Go to https://render.com"
echo "2. Click 'New +' → 'Web Service'"
echo "3. Connect to alemad_physio GitHub repository"
echo "4. Configure:"
echo "   - Name: alemad-physio-backend"
echo "   - Environment: Node"
echo "   - Build Command: cd backend && npm install && prisma generate && prisma migrate deploy"
echo "   - Start Command: cd backend && npm start"
echo "5. Create PostgreSQL database first"
echo "6. Set environment variables"
echo "7. Deploy!"
echo ""
echo "Environment variables needed:"
echo "- DATABASE_URL (from PostgreSQL)"
echo "- JWT_SECRET (generate with: openssl rand -base64 32)"
echo "- CORS_ORIGIN (your Netlify URL)"
echo "- NODE_ENV=production"
