#!/bin/bash

echo "================================"
echo "Ì≥ä PATIENTS"
echo "================================"
curl -s "http://localhost:5001/api/patients" | grep -o '"name":"[^"]*"' | head -10

echo -e "\n================================"
echo "Ì±®‚Äç‚öïÔ∏è THERAPISTS"
echo "================================"
curl -s "http://localhost:5001/api/therapists" | grep -o '"name":"[^"]*"' | head -10

echo -e "\n================================"
echo "Ì≥Ö APPOINTMENTS"
echo "================================"
curl -s "http://localhost:5001/api/appointments" | grep -o '"status":"[^"]*"' | head -10

echo -e "\n================================"
echo "‚úÖ SUMMARY"
echo "================================"
echo "Patients: $(curl -s http://localhost:5001/api/patients | grep -o '"id":' | wc -l)"
echo "Therapists: $(curl -s http://localhost:5001/api/therapists | grep -o '"id":' | wc -l)"
echo "Appointments: $(curl -s http://localhost:5001/api/appointments | grep -o '"id":' | wc -l)"
