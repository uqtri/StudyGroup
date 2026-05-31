import { usersRepository } from './users.repository.js';
import { ApiError } from '../../utils/ApiError.js';
import { buildPaginatedResult, parsePagination, parseSort } from '../../utils/pagination.js';

const formatUser = (user) => ({
  ...user,
  roles: user.roles.map((r) => r.role.name),
});

export const usersService = {
  list: async (query) => {
    const { page, limit, skip } = parsePagination(query);
    const orderBy = parseSort(query, ['createdAt', 'fullName', 'email'], 'createdAt');
    const where = {};
    if (query.status) where.status = query.status;
    if (query.search) {
      where.OR = [
        { fullName: { contains: query.search, mode: 'insensitive' } },
        { email: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      usersRepository.findMany({ where, skip, take: limit, orderBy }),
      usersRepository.count(where),
    ]);

    return buildPaginatedResult(items.map(formatUser), total, { page, limit });
  },

  getById: async (id) => {
    const user = await usersRepository.findById(id);
    if (!user) throw ApiError.notFound('User not found');
    return formatUser(user);
  },

  update: async (id, data, requesterId) => {
    if (id !== requesterId) {
      const user = await usersRepository.findById(requesterId);
      const isAdmin = user?.roles?.some((r) => r.role.name === 'ADMIN');
      if (!isAdmin) throw ApiError.forbidden();
    }
    const updated = await usersRepository.update(id, {
      fullName: data.fullName,
      bio: data.bio,
      avatar: data.avatar,
    });
    return formatUser(updated);
  },

  remove: async (id) => {
    await usersRepository.softDelete(id);
    return true;
  },
};
