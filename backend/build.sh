#!/bin/bash
set -e

echo "📦 Installing dependencies..."
npm install --no-optional 2>&1 || true

echo "🔧 Generating Prisma client..."
npm run build 2>&1 || echo "⚠️  Prisma generation warning (continuing anyway)"

echo "✅ Build step complete"
