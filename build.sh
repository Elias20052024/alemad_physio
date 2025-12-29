#!/bin/bash
# Render build script for Alemad Physio Backend

set -e

echo "📦 Installing dependencies..."
npm install

echo "🔧 Generating Prisma client..."
npx prisma generate

echo "📊 Applying database migrations..."
npx prisma migrate deploy --skip-generate

echo "✅ Build completed successfully!"
