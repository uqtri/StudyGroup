import { jest } from '@jest/globals';
import { reportsService } from './reports.service.js';
import { reportsRepository } from './reports.repository.js';
import { ApiError } from '../../utils/ApiError.js';

jest.spyOn(reportsRepository, 'findMany').mockResolvedValue([]);
jest.spyOn(reportsRepository, 'count').mockResolvedValue(0);
jest.spyOn(reportsRepository, 'create').mockResolvedValue({});
jest.spyOn(reportsRepository, 'update').mockResolvedValue({});

afterEach(() => {
  jest.clearAllMocks();
});

describe('Reports Service', () => {
  describe('list', () => {
    it('should list reports', async () => {
      reportsRepository.findMany.mockResolvedValue([{ id: 'report1' }]);
      reportsRepository.count.mockResolvedValue(1);

      const result = await reportsService.list({ page: 1, limit: 10, status: 'PENDING' });
      expect(result.items).toHaveLength(1);
    });
  });

  describe('create', () => {
    it('should create report', async () => {
      reportsRepository.create.mockResolvedValue({ id: 'report1' });
      const result = await reportsService.create({ reason: 'spam' }, 'user1');
      expect(result.id).toBe('report1');
      expect(reportsRepository.create).toHaveBeenCalledWith({ reason: 'spam', reporterId: 'user1' });
    });
  });

  describe('updateStatus', () => {
    it('should update status', async () => {
      reportsRepository.update.mockResolvedValue({ id: 'report1', status: 'RESOLVED' });
      const result = await reportsService.updateStatus('report1', 'RESOLVED');
      expect(result.status).toBe('RESOLVED');
    });

    it('should throw if report not found', async () => {
      reportsRepository.update.mockResolvedValue(null);
      await expect(reportsService.updateStatus('report1', 'RESOLVED')).rejects.toThrow('Report not found');
    });
  });
});
