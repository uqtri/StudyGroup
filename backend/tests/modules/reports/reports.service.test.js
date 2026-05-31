import { describe, it, expect, vi, beforeEach } from 'vitest';
import { reportsService } from '../../../src/modules/reports/reports.service.js';
import { reportsRepository } from '../../../src/modules/reports/reports.repository.js';
import { userId } from '../../helpers/fixtures.js';

vi.mock('../../../src/modules/reports/reports.repository.js', () => ({
  reportsRepository: {
    findMany: vi.fn(),
    count: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
  },
}));

const mockReport = {
  id: 'report-1',
  reporterId: userId,
  reason: 'Spam',
  status: 'PENDING',
  createdAt: new Date('2026-01-01'),
};

describe('Báo cáo (reportsService)', () => {
  beforeEach(() => vi.clearAllMocks());

  describe('Gửi báo cáo', () => {
    it('create stores report with reporterId', async () => {
      reportsRepository.create.mockResolvedValue(mockReport);

      const result = await reportsService.create(
        { reason: 'Spam', targetType: 'POST', targetId: 'post-1' },
        userId,
      );

      expect(reportsRepository.create).toHaveBeenCalledWith({
        reason: 'Spam',
        targetType: 'POST',
        targetId: 'post-1',
        reporterId: userId,
      });
      expect(result.id).toBe('report-1');
    });
  });

  describe('Quản lý báo cáo', () => {
    it('list returns paginated reports', async () => {
      reportsRepository.findMany.mockResolvedValue([mockReport]);
      reportsRepository.count.mockResolvedValue(1);

      const result = await reportsService.list({});

      expect(result.items).toHaveLength(1);
      expect(result.pagination.total).toBe(1);
    });

    it('list filters by status when provided', async () => {
      reportsRepository.findMany.mockResolvedValue([]);
      reportsRepository.count.mockResolvedValue(0);

      await reportsService.list({ status: 'RESOLVED' });

      expect(reportsRepository.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { status: 'RESOLVED' },
        }),
      );
    });

    it('updateStatus returns updated report', async () => {
      reportsRepository.update.mockResolvedValue({ ...mockReport, status: 'RESOLVED' });

      const result = await reportsService.updateStatus('report-1', 'RESOLVED');

      expect(reportsRepository.update).toHaveBeenCalledWith('report-1', { status: 'RESOLVED' });
      expect(result.status).toBe('RESOLVED');
    });

    it('updateStatus throws when report not found', async () => {
      reportsRepository.update.mockResolvedValue(null);

      await expect(reportsService.updateStatus('missing', 'RESOLVED')).rejects.toMatchObject({
        statusCode: 404,
        message: 'Report not found',
      });
    });
  });
});
