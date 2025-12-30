#!/usr/bin/env node

/**
 * Migration script to sync existing bookings from frontend localStorage to database
 * Run this after deploying the new code that uses the database
 */

import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

// Sample bookings that might exist in localStorage
// These are extracted from the screenshot
const existingBookings = [
  {
    name: "test booking",
    phone: "0777555666",
    age: 20,
    service: "General",
    date: new Date("2025-12-28"),
    status: "active"
  },
  {
    name: "test booking 2",
    phone: "0788457376",
    age: 21,
    service: "General",
    date: new Date("2025-12-28"),
    status: "active"
  },
  {
    name: "patient3",
    phone: "9627899944",
    age: 23,
    service: "General",
    date: new Date("2025-12-28"),
    status: "active"
  },
  {
    name: "Hassan Ibrahim",
    phone: "966504567890",
    age: 55,
    service: "General",
    date: new Date("2025-12-28"),
    status: "active"
  },
  {
    name: "Mohammad Elias",
    phone: "966501234567",
    age: 35,
    service: "General",
    date: new Date("2025-12-28"),
    status: "active"
  },
  {
    name: "Aisha Mohammed",
    phone: "966650567890",
    age: 31,
    service: "General",
    date: new Date("2025-12-28"),
    status: "active"
  },
  {
    name: "Emad Ali",
    phone: "966502345678",
    age: 42,
    service: "General",
    date: new Date("2025-12-28"),
    status: "active"
  },
  {
    name: "Karim Hassan",
    phone: "966650678901",
    age: 48,
    service: "General",
    date: new Date("2025-12-28"),
    status: "active"
  },
];

async function migrateBookings() {
  try {
    console.log('🔄 Starting booking migration...');
    console.log(`📊 Found ${existingBookings.length} bookings to migrate`);

    for (const booking of existingBookings) {
      try {
        const created = await prisma.booking.create({
          data: {
            name: booking.name,
            phone: booking.phone,
            age: booking.age || null,
            service: booking.service,
            date: booking.date,
            status: booking.status || 'pending'
          }
        });
        console.log(`✅ Created booking: ${created.name} (ID: ${created.id})`);
      } catch (error) {
        if (error.code === 'P2002') {
          console.log(`⚠️  Booking already exists: ${booking.name}`);
        } else {
          console.error(`❌ Error creating booking ${booking.name}:`, error.message);
        }
      }
    }

    // Verify migration
    const totalBookings = await prisma.booking.count();
    console.log(`\n✅ Migration complete! Total bookings in database: ${totalBookings}`);

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

migrateBookings();
