#!/bin/bash

echo "🔍 Testing Alemad Physio API Endpoints"
echo "========================================"
echo ""

echo "1️⃣  Health Check:"
curl -s http://localhost:5000/health | jq . 2>/dev/null || echo "No response or jq not available"
echo ""

echo "2️⃣  Get All Patients:"
curl -s http://localhost:5000/api/patients | jq . 2>/dev/null || echo "No response"
echo ""

echo "3️⃣  Get All Therapists:"
curl -s http://localhost:5000/api/therapists | jq . 2>/dev/null || echo "No response"
echo ""

echo "4️⃣  Get All Appointments:"
curl -s http://localhost:5000/api/appointments | jq . 2>/dev/null || echo "No response"
echo ""

echo "✅ API tests complete!"
