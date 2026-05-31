import app from './src/app.js';
import { env } from './src/config/env.js';
import { prisma } from './src/config/prisma.js';

const start = async () => {
  try {
    await prisma.$connect();
    app.listen(env.port, () => {
      console.log(`StudyHub API running on http://localhost:${env.port}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

start();

const shutdown = async () => {
  await prisma.$disconnect();
  process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
