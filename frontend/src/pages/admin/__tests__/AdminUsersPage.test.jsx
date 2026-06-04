import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../../../test/utils';
import { AdminUsersPage } from '../AdminUsersPage';
import { UserFactory, paginatedResponse } from '../../../test/factories';

vi.mock('../../../api/userApi', () => ({ userApi: { list: vi.fn(), setStatus: vi.fn() } }));
vi.mock('../../../utils/statusStyles', () => ({
  StatusBadge: ({ label }) => <span data-testid="status-badge">{label}</span>,
  userStatusLabel: (s) => s,
  userStatusStyles: {},
}));

import { userApi } from '../../../api/userApi';

const setup = (users = []) => {
  userApi.list.mockResolvedValue({ data: { data: paginatedResponse(users) } });
  return renderWithProviders(<AdminUsersPage />, { route: '/admin/users' });
};

describe('AdminUsersPage', () => {
  beforeEach(() => vi.clearAllMocks());

  describe('table headers', () => {
    it('renders column headers', async () => {
      setup([]);
      await waitFor(() => {
        expect(screen.getByText('Name')).toBeInTheDocument();
        expect(screen.getByText('Email')).toBeInTheDocument();
        expect(screen.getByText('Roles')).toBeInTheDocument();
        expect(screen.getByText('Status')).toBeInTheDocument();
        expect(screen.getByText('Actions')).toBeInTheDocument();
      });
    });
  });

  describe('empty state', () => {
    it('renders table with no rows when no users', async () => {
      setup([]);
      await waitFor(() => screen.getByText('Name'));
      expect(screen.queryAllByRole('row')).toHaveLength(1); // header row only
    });
  });

  describe('with users', () => {
    it('renders user names and emails', async () => {
      const users = [
        UserFactory.build({ fullName: 'Alice Smith', email: 'alice@example.com' }),
      ];
      setup(users);
      await waitFor(() => {
        expect(screen.getByText('Alice Smith')).toBeInTheDocument();
        expect(screen.getByText('alice@example.com')).toBeInTheDocument();
      });
    });

    it('renders ban button for non-admin users', async () => {
      const users = [UserFactory.build()];
      setup(users);
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /ban user/i })).toBeInTheDocument();
      });
    });

    it('does not render ban button for admin users', async () => {
      const users = [UserFactory.buildAdmin()];
      setup(users);
      await waitFor(() => screen.getByText(users[0].fullName));
      expect(screen.queryByRole('button', { name: /ban user/i })).toBeNull();
    });

    it('renders Unban button for suspended users', async () => {
      const users = [UserFactory.build({ status: 'SUSPENDED' })];
      setup(users);
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /unban user/i })).toBeInTheDocument();
      });
    });
  });

  describe('ban/unban action', () => {
    it('calls userApi.setStatus with SUSPENDED on ban click', async () => {
      userApi.setStatus.mockResolvedValue({ data: { data: {} } });
      setup([UserFactory.build({ id: 'u1', status: 'ACTIVE' })]);

      await waitFor(() => screen.getByRole('button', { name: /ban user/i }));
      fireEvent.click(screen.getByRole('button', { name: /ban user/i }));

      await waitFor(() => {
        expect(userApi.setStatus).toHaveBeenCalledWith('u1', 'SUSPENDED');
      });
    });
  });
});
