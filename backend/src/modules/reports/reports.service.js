import { reportsRepository } from './reports.repository.js';
import { buildPaginatedResult, parsePagination, parseSort } from '../../utils/pagination.js';
import { ApiError } from '../../utils/ApiError.js';

export const reportsService = {
  list: async (query) => {
    const { page, limit, skip } = parsePagination(query);
    const orderBy = parseSort(query, ['createdAt', 'status'], 'createdAt');
    const where = {};
    if (query.status) where.status = query.status;

    const [items, total] = await Promise.all([
      reportsRepository.findMany({ where, skip, take: limit, orderBy }),
      reportsRepository.count(where),
    ]);

    return buildPaginatedResult(items, total, { page, limit });
  },

  create: async (data, reporterId) =>
    reportsRepository.create({ ...data, reporterId }),

  updateStatus: async (id, status) => {
    const report = await reportsRepository.update(id, { status });
    if (!report) throw ApiError.notFound('Report not found');
    return report;
  },
};
