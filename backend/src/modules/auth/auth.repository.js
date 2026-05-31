import { prisma } from '../../config/prisma.js';

const userInclude = {
  roles: { include: { role: true } },
};

export const authRepository = {
  findByEmail: (email) =>
    prisma.user.findFirst({
      where: { email, deletedAt: null },
      include: userInclude,
    }),

  findById: (id) =>
    prisma.user.findFirst({
      where: { id, deletedAt: null },
      include: userInclude,
    }),

  createUser: (data) =>
    prisma.user.create({
      data,
      include: userInclude,
    }),

  createRefreshToken: (data) => prisma.refreshToken.create({ data }),

  findRefreshToken: (token) =>
    prisma.refreshToken.findUnique({
      where: { token },
      include: { user: { include: userInclude } },
    }),

  deleteRefreshToken: (token) => prisma.refreshToken.delete({ where: { token } }),

  deleteUserRefreshTokens: (userId) => prisma.refreshToken.deleteMany({ where: { userId } }),

  findRoleByName: (name) => prisma.role.findUnique({ where: { name } }),
};
