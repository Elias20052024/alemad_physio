import { PrismaClient } from '@prisma/client';

let prisma;

if (process.env.NODE_ENV === 'production') {
  // In production (Render), create instance once
  prisma = new PrismaClient({
    errorFormat: 'pretty',
    log: ['error', 'warn'],
  });
  console.log('✅ Prisma Client initialized (production mode)');
} else {
  // In development, prevent hot-reload from creating multiple instances
  if (!global.prisma) {
    global.prisma = new PrismaClient({
      errorFormat: 'pretty',
      log: ['query', 'error', 'warn'],
    });
    console.log('✅ Prisma Client initialized (development mode)');
  }
  prisma = global.prisma;
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

export default prisma;
