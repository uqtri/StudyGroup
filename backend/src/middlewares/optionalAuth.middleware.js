import { verifyAccessToken } from '../utils/jwt.js';
import { prisma } from '../config/prisma.js';

export const optionalAuthenticate = async (req, _res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) return next();

    const decoded = verifyAccessToken(token);
    const user = await prisma.user.findFirst({
      where: { id: decoded.userId, deletedAt: null, status: 'ACTIVE' },
      include: { roles: { include: { role: true } } },
    });

    if (user) {
      req.user = {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        roles: user.roles.map((ur) => ur.role.name),
      };
    }
  } catch {
    /* public access continues without user */
  }
  next();
};
