import { prisma } from '../../config/prisma.js';

export const attendanceRepository = {
  upsert: (sessionId, userId, data) =>
    prisma.attendance.upsert({
      where: { sessionId_userId: { sessionId, userId } },
      update: data,
      create: { sessionId, userId, ...data },
      include: { user: { select: { id: true, fullName: true, avatar: true } } },
    }),

  findBySession: (sessionId) =>
    prisma.attendance.findMany({
      where: { sessionId },
      include: { user: { select: { id: true, fullName: true, email: true, avatar: true } } },
    }),

  getUserStats: async (userId) => {
    const total = await prisma.attendance.count({ where: { userId } });
    const present = await prisma.attendance.count({
      where: { userId, status: 'PRESENT' },
    });
    return { total, present, rate: total ? Math.round((present / total) * 100) : 0 };
  },
};
