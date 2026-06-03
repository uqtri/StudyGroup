import { jest } from '@jest/globals';
import { reportsService } from '../../../../src/modules/reports/reports.service.js';
import { reportsRepository } from '../../../../src/modules/reports/reports.repository.js';
import { ApiError } from '../../../../src/utils/ApiError.js';

jest.spyOn(reportsRepository, 'findMany').mockResolvedValue([]);
jest.spyOn(reportsRepository, 'count').mockResolvedValue(0);
jest.spyOn(reportsRepository, 'create').mockResolvedValue({});
jest.spyOn(reportsRepository, 'update').mockResolvedValue({});

afterEach(() => {
  jest.clearAllMocks();
});

describe('Reports Service', () => {
  describe('list', () => {
    /* UTCIDs: UTCID01, UTCID05 */

    it('UTCID01 - should list reports', async () => {
      reportsRepository.findMany.mockResolvedValue([{ id: 'report1' }]);
      reportsRepository.count.mockResolvedValue(1);

      const result = await reportsService.list({ page: 1, limit: 10, status: 'PENDING' });
      expect(result.items).toHaveLength(1);
    });

    it('UTCID05 - should propagate error when findMany fails', async () => {
      reportsRepository.findMany.mockRejectedValue(new Error('DB error'));
      await expect(reportsService.list({ page: 1, limit: 10 })).rejects.toThrow('DB error');
    });
  });

  describe('create', () => {
    /* UTCIDs: UTCID01, UTCID05 */

    it('UTCID01 - should create report', async () => {
      reportsRepository.create.mockResolvedValue({ id: 'report1' });
      const result = await reportsService.create({ reason: 'spam' }, 'user1');
      expect(result.id).toBe('report1');
      expect(reportsRepository.create).toHaveBeenCalledWith({ reason: 'spam', reporterId: 'user1' });
    });

    it('UTCID05 - should propagate error when create fails', async () => {
      reportsRepository.create.mockRejectedValue(new Error('DB error'));
      await expect(reportsService.create({ reason: 'spam' }, 'user1')).rejects.toThrow('DB error');
    });
  });

  describe('updateStatus', () => {
    /* UTCIDs: UTCID01, UTCID03 */

    it('UTCID01 - should update status', async () => {
      reportsRepository.update.mockResolvedValue({ id: 'report1', status: 'RESOLVED' });
      const result = await reportsService.updateStatus('report1', 'RESOLVED');
      expect(result.status).toBe('RESOLVED');
    });

    it('UTCID03 - should throw if report not found', async () => {
      reportsRepository.update.mockResolvedValue(null);
      await expect(reportsService.updateStatus('report1', 'RESOLVED')).rejects.toThrow('Report not found');
    });
  });
});
