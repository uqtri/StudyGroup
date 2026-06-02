import { jest } from '@jest/globals';
import { usersService } from './users.service.js';
import { usersRepository } from './users.repository.js';
import { ApiError } from '../../utils/ApiError.js';

jest.spyOn(usersRepository, 'findMany');
jest.spyOn(usersRepository, 'count');
jest.spyOn(usersRepository, 'findById');
jest.spyOn(usersRepository, 'update');
jest.spyOn(usersRepository, 'softDelete');
jest.spyOn(usersRepository, 'revokeRefreshTokens');

const mockUser = {
  id: 1,
  email: 'test@example.com',
  fullName: 'Test User',
  status: 'ACTIVE',
  roles: [{ role: { name: 'MEMBER' } }],
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockAdmin = {
  ...mockUser,
  id: 99,
  roles: [{ role: { name: 'ADMIN' } }],
};

afterEach(() => {
  jest.clearAllMocks();
});

describe('Users Service', () => {
  describe('list', () => {
    it('should return paginated list of users', async () => {
      usersRepository.findMany.mockResolvedValue([mockUser]);
      usersRepository.count.mockResolvedValue(1);

      const result = await usersService.list({ page: 1, limit: 10, search: 'test', status: 'ACTIVE' });
      expect(result.items).toHaveLength(1);
      expect(result.pagination.total).toBe(1);
      expect(result.items[0].roles).toContain('MEMBER');
      expect(usersRepository.findMany).toHaveBeenCalled();
    });
  });

  describe('getById', () => {
    it('should return user by id', async () => {
      usersRepository.findById.mockResolvedValue(mockUser);
      const result = await usersService.getById(1);
      expect(result.email).toBe('test@example.com');
    });

    it('should throw not found if user missing', async () => {
      usersRepository.findById.mockResolvedValue(null);
      await expect(usersService.getById(999)).rejects.toThrow('User not found');
    });
  });

  describe('update', () => {
    it('should update user if requester is the user', async () => {
      usersRepository.update.mockResolvedValue({ ...mockUser, fullName: 'Updated Name' });
      const result = await usersService.update(1, { fullName: 'Updated Name' }, 1);
      expect(result.fullName).toBe('Updated Name');
    });

    it('should update user if requester is admin', async () => {
      usersRepository.findById.mockResolvedValue(mockAdmin);
      usersRepository.update.mockResolvedValue({ ...mockUser, fullName: 'Admin Updated' });
      const result = await usersService.update(1, { fullName: 'Admin Updated' }, 99);
      expect(result.fullName).toBe('Admin Updated');
    });

    it('should throw forbidden if requester is not user and not admin', async () => {
      usersRepository.findById.mockResolvedValue(mockUser); // Requester (id: 2) is just MEMBER
      await expect(usersService.update(1, { fullName: 'Hacker' }, 2)).rejects.toThrow(ApiError);
    });
  });

  describe('remove', () => {
    it('should call softDelete on repository', async () => {
      usersRepository.softDelete.mockResolvedValue(true);
      await usersService.remove(1);
      expect(usersRepository.softDelete).toHaveBeenCalledWith(1);
    });
  });

  describe('setStatus', () => {
    it('should update status if requester is admin', async () => {
      usersRepository.findById.mockResolvedValueOnce(mockAdmin); // Requester
      usersRepository.findById.mockResolvedValueOnce(mockUser); // Target User
      usersRepository.update.mockResolvedValue({ ...mockUser, status: 'INACTIVE' });
      
      const result = await usersService.setStatus(1, 'INACTIVE', 99);
      expect(result.status).toBe('INACTIVE');
    });

    it('should revoke tokens if status set to SUSPENDED', async () => {
      usersRepository.findById.mockResolvedValueOnce(mockAdmin);
      usersRepository.findById.mockResolvedValueOnce(mockUser);
      usersRepository.update.mockResolvedValue({ ...mockUser, status: 'SUSPENDED' });
      usersRepository.revokeRefreshTokens.mockResolvedValue({});
      
      await usersService.setStatus(1, 'SUSPENDED', 99);
      expect(usersRepository.revokeRefreshTokens).toHaveBeenCalledWith(1);
    });

    it('should throw forbidden if requester is not admin', async () => {
      usersRepository.findById.mockResolvedValueOnce(mockUser); // Requester is not admin
      await expect(usersService.setStatus(2, 'INACTIVE', 1)).rejects.toThrow(ApiError);
    });

    it('should throw bad request if changing own status', async () => {
      usersRepository.findById.mockResolvedValueOnce(mockAdmin);
      await expect(usersService.setStatus(99, 'INACTIVE', 99)).rejects.toThrow('Cannot change your own account status');
    });

    it('should throw not found if target user missing', async () => {
      usersRepository.findById.mockResolvedValueOnce(mockAdmin); // Requester
      usersRepository.findById.mockResolvedValueOnce(null); // Target
      await expect(usersService.setStatus(2, 'INACTIVE', 99)).rejects.toThrow('User not found');
    });

    it('should throw forbidden if targeting another admin', async () => {
      usersRepository.findById.mockResolvedValueOnce(mockAdmin); // Requester
      usersRepository.findById.mockResolvedValueOnce({ ...mockUser, id: 2, roles: [{ role: { name: 'ADMIN' } }] }); // Target Admin
      await expect(usersService.setStatus(2, 'INACTIVE', 99)).rejects.toThrow('Cannot change an admin account status');
    });
  });
});
