import { PrismaClient } from '@prisma/client';

let prisma;

try {
  prisma = new PrismaClient({
    errorFormat: 'pretty',
  });
  console.log('✅ Prisma client initialized');
} catch (error) {
  console.error('⚠️ Warning: Prisma initialization error (continuing without DB):', error.message);
  prisma = null;
}

export default prisma;
