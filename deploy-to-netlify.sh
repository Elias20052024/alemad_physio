#!/bin/bash

# Alemad Physio - Netlify Deployment Script
# This script helps you deploy to Netlify step by step

echo "🚀 Alemad Physio Netlify Deployment Helper"
echo "=========================================="
echo ""

# Check if Git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install Git first."
    exit 1
fi

echo "📦 Step 1: Checking Git status..."
git status

echo ""
echo "🔧 Step 2: Building frontend..."
cd frontend
npm install --legacy-peer-deps
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Frontend build failed!"
    exit 1
fi

echo "✅ Frontend built successfully!"
echo ""

echo "📤 Step 3: Pushing to GitHub..."
cd ..
git add -A
git commit -m "Deploy: Update for Netlify deployment"
git push origin main

if [ $? -ne 0 ]; then
    echo "❌ Git push failed!"
    exit 1
fi

echo "✅ Code pushed to GitHub!"
echo ""

echo "🎉 Deployment preparation complete!"
echo ""
echo "Next steps:"
echo "1. Go to https://app.netlify.com"
echo "2. Click 'New site from Git'"
echo "3. Select alemad_physio repository"
echo "4. Base directory: frontend"
echo "5. Build command: npm install && npm run build"
echo "6. Publish directory: frontend/dist"
echo "7. Add environment variables:"
echo "   - VITE_API_BASE_URL=https://your-backend.onrender.com/api"
echo "8. Click Deploy!"
echo ""
echo "For backend deployment, see RENDER_DEPLOYMENT.md"
