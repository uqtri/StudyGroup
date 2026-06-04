import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../../test/utils';
import { ProfilePage } from '../ProfilePage';
import { useAuthStore } from '../../../store/authStore';
import { UserFactory, GroupFactory, ResourceFactory, paginatedResponse } from '../../../test/factories';

vi.mock('../../../api/authApi', () => ({ authApi: { me: vi.fn() } }));
vi.mock('../../../api/userApi', () => ({ userApi: { update: vi.fn() } }));
vi.mock('../../../api/groupApi', () => ({ groupApi: { list: vi.fn() } }));
vi.mock('../../../api/resourceApi', () => ({ resourceApi: { list: vi.fn() } }));
vi.mock('../../../api/dashboardApi', () => ({ dashboardApi: { getStats: vi.fn() } }));

import { authApi } from '../../../api/authApi';
import { userApi } from '../../../api/userApi';
import { groupApi } from '../../../api/groupApi';
import { resourceApi } from '../../../api/resourceApi';
import { dashboardApi } from '../../../api/dashboardApi';

const currentUser = UserFactory.build({ id: 'user-1' });

const setupMocks = (overrides = {}) => {
  authApi.me.mockResolvedValue({ data: { data: currentUser } });
  dashboardApi.getStats.mockResolvedValue({
    data: { data: { attendanceRate: 85, totalUsers: 10, activeGroups: 3 } },
  });
  groupApi.list.mockResolvedValue({ data: { data: paginatedResponse([]) } });
  resourceApi.list.mockResolvedValue({ data: { data: paginatedResponse([]) } });
  Object.assign({}, overrides);
};

describe('ProfilePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuthStore.setState({ user: currentUser, accessToken: 'tok', isAuthenticated: true });
    setupMocks();
  });

  const renderProfile = () => renderWithProviders(<ProfilePage />, { route: '/profile' });

  describe('rendering', () => {
    it('renders Profile heading', async () => {
      renderProfile();
      await waitFor(() => {
        expect(screen.getByText('Profile')).toBeInTheDocument();
      });
    });

    it('renders Personal Information card', async () => {
      renderProfile();
      await waitFor(() => {
        expect(screen.getByText(/personal information/i)).toBeInTheDocument();
      });
    });

    it('displays user email', async () => {
      renderProfile();
      await waitFor(() => {
        expect(screen.getByText(currentUser.email)).toBeInTheDocument();
      });
    });

    it('renders stat cards', async () => {
      renderProfile();
      await waitFor(() => {
        expect(screen.getByText(/my groups/i)).toBeInTheDocument();
        expect(screen.getByText(/attendance rate/i)).toBeInTheDocument();
        expect(screen.getByText(/resources uploaded/i)).toBeInTheDocument();
      });
    });
  });

  describe('empty states', () => {
    it('shows no groups message', async () => {
      renderProfile();
      await waitFor(() => {
        expect(screen.getByText(/no groups joined/i)).toBeInTheDocument();
      });
    });

    it('shows no uploads message', async () => {
      renderProfile();
      await waitFor(() => {
        expect(screen.getByText(/no uploads yet/i)).toBeInTheDocument();
      });
    });
  });

  describe('with groups data', () => {
    it('renders joined group names', async () => {
      const groups = [GroupFactory.build({ id: 'g1', name: 'React Fundamentals' })];
      groupApi.list.mockResolvedValue({ data: { data: paginatedResponse(groups) } });

      renderProfile();

      await waitFor(() => {
        expect(screen.getByText(/React Fundamentals/)).toBeInTheDocument();
      });
    });
  });

  describe('form interaction', () => {
    it('renders save changes button', async () => {
      renderProfile();
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /save changes/i })).toBeInTheDocument();
      });
    });

    it('shows success message on profile update', async () => {
      const user = userEvent.setup();
      userApi.update.mockResolvedValue({ data: { data: currentUser } });

      renderProfile();

      await waitFor(() => screen.getByRole('button', { name: /save changes/i }));
      await user.click(screen.getByRole('button', { name: /save changes/i }));

      await waitFor(() => {
        expect(screen.getByText(/profile updated/i)).toBeInTheDocument();
      });
    });
  });
});
