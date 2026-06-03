import { describe, it, expect, vi, beforeEach } from 'vitest';
import { usersService } from '../../../../src/modules/users/users.service.js';
import { usersRepository } from '../../../../src/modules/users/users.repository.js';

vi.mock('../../../../src/modules/users/users.repository.js', () => ({
  usersRepository: {
    findMany: vi.fn(),
    count: vi.fn(),
    findById: vi.fn(),
    update: vi.fn(),
    softDelete: vi.fn(),
    revokeRefreshTokens: vi.fn(),
  },
}));

const baseUser = {
  id: 'user-1',
  email: 'alice@example.com',
  fullName: 'Alice',
  bio: 'Student',
  avatar: null,
  status: 'ACTIVE',
  roles: [{ role: { name: 'MEMBER' } }],
};

describe('Quản lí tài khoản (usersService)', () => {
  beforeEach(() => vi.clearAllMocks());

  it('getById returns formatted user', async () => {
    usersRepository.findById.mockResolvedValue(baseUser);

    const user = await usersService.getById('user-1');

    expect(user.roles).toEqual(['MEMBER']);
    expect(user.fullName).toBe('Alice');
  });

  it('getById throws when user not found', async () => {
    usersRepository.findById.mockResolvedValue(null);

    await expect(usersService.getById('missing')).rejects.toMatchObject({ statusCode: 404 });
  });

  it('update allows user to update own profile', async () => {
    usersRepository.update.mockResolvedValue({
      ...baseUser,
      fullName: 'Alice Updated',
      bio: 'New bio',
    });

    const result = await usersService.update(
      'user-1',
      { fullName: 'Alice Updated', bio: 'New bio' },
      'user-1',
    );

    expect(usersRepository.update).toHaveBeenCalledWith('user-1', {
      fullName: 'Alice Updated',
      bio: 'New bio',
      avatar: undefined,
    });
    expect(result.fullName).toBe('Alice Updated');
  });

  it('update forbids non-admin from updating another user', async () => {
    usersRepository.findById.mockResolvedValue(baseUser);

    await expect(
      usersService.update('user-2', { fullName: 'Hacker' }, 'user-1'),
    ).rejects.toMatchObject({ statusCode: 403 });
  });

  it('update allows admin to update another user', async () => {
    usersRepository.findById.mockResolvedValue({
      ...baseUser,
      roles: [{ role: { name: 'ADMIN' } }],
    });
    usersRepository.update.mockResolvedValue({ ...baseUser, id: 'user-2', fullName: 'Bob' });

    const result = await usersService.update('user-2', { fullName: 'Bob' }, 'admin-1');

    expect(result.fullName).toBe('Bob');
  });

  it('list returns paginated users for admin query', async () => {
    usersRepository.findMany.mockResolvedValue([baseUser]);
    usersRepository.count.mockResolvedValue(1);

    const result = await usersService.list({ page: 1, limit: 10 });

    expect(result.items).toHaveLength(1);
    expect(result.pagination.total).toBe(1);
  });

  it('remove soft-deletes user', async () => {
    usersRepository.softDelete.mockResolvedValue({});

    await usersService.remove('user-2');

    expect(usersRepository.softDelete).toHaveBeenCalledWith('user-2');
  });

  describe('Khóa / mở khóa tài khoản', () => {
    const adminUser = {
      ...baseUser,
      id: 'admin-1',
      roles: [{ role: { name: 'ADMIN' } }],
    };

    it('setStatus forbids non-admin', async () => {
      usersRepository.findById.mockResolvedValue(baseUser);

      await expect(
        usersService.setStatus('user-2', 'SUSPENDED', 'user-1'),
      ).rejects.toMatchObject({ statusCode: 403 });
    });

    it('setStatus forbids changing own status', async () => {
      usersRepository.findById.mockResolvedValue(adminUser);

      await expect(
        usersService.setStatus('admin-1', 'SUSPENDED', 'admin-1'),
      ).rejects.toMatchObject({
        statusCode: 400,
        message: 'Cannot change your own account status',
      });
    });

    it('setStatus forbids changing another admin', async () => {
      usersRepository.findById
        .mockResolvedValueOnce(adminUser)
        .mockResolvedValueOnce({
          ...baseUser,
          id: 'admin-2',
          roles: [{ role: { name: 'ADMIN' } }],
        });

      await expect(
        usersService.setStatus('admin-2', 'SUSPENDED', 'admin-1'),
      ).rejects.toMatchObject({
        statusCode: 403,
        message: 'Cannot change an admin account status',
      });
    });

    it('setStatus suspends user and revokes refresh tokens', async () => {
      usersRepository.findById
        .mockResolvedValueOnce(adminUser)
        .mockResolvedValueOnce({ ...baseUser, id: 'user-2' });
      usersRepository.update.mockResolvedValue({
        ...baseUser,
        id: 'user-2',
        status: 'SUSPENDED',
      });
      usersRepository.revokeRefreshTokens.mockResolvedValue({});

      const result = await usersService.setStatus('user-2', 'SUSPENDED', 'admin-1');

      expect(usersRepository.revokeRefreshTokens).toHaveBeenCalledWith('user-2');
      expect(result.status).toBe('SUSPENDED');
    });
  });
});
