import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../../../test/utils';
import { GroupsPage } from '../GroupsPage';
import { useAuthStore } from '../../../store/authStore';
import { GroupFactory, paginatedResponse, UserFactory } from '../../../test/factories';

vi.mock('../../../api/groupApi', () => ({ groupApi: { list: vi.fn() } }));
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, useNavigate: () => vi.fn() };
});

import { groupApi } from '../../../api/groupApi';

const setup = (groups = [], authUser = null) => {
  groupApi.list.mockResolvedValue({ data: { data: paginatedResponse(groups) } });
  if (authUser) {
    useAuthStore.setState({ user: authUser, accessToken: 'tok', isAuthenticated: true });
  } else {
    useAuthStore.setState({ user: null, accessToken: null, isAuthenticated: false });
  }
  return renderWithProviders(<GroupsPage />, { route: '/groups' });
};

describe('GroupsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuthStore.setState({ user: null, accessToken: null, isAuthenticated: false });
  });

  describe('rendering', () => {
    it('renders explore groups heading', async () => {
      setup();
      await waitFor(() => {
        expect(screen.getByText(/explore groups/i)).toBeInTheDocument();
      });
    });

    it('renders search input', async () => {
      setup();
      await waitFor(() => {
        expect(screen.getByPlaceholderText(/search groups/i)).toBeInTheDocument();
      });
    });

    it('renders subject filter input', async () => {
      setup();
      await waitFor(() => {
        expect(screen.getByPlaceholderText(/filter by subject/i)).toBeInTheDocument();
      });
    });

    it('renders sort select', async () => {
      setup();
      await waitFor(() => {
        expect(screen.getByRole('combobox')).toBeInTheDocument();
      });
    });
  });

  describe('with groups', () => {
    it('renders group names', async () => {
      const groups = GroupFactory.buildList(2);
      setup(groups);
      await waitFor(() => {
        expect(screen.getByText(groups[0].name)).toBeInTheDocument();
        expect(screen.getByText(groups[1].name)).toBeInTheDocument();
      });
    });

    it('renders group subjects', async () => {
      const groups = [GroupFactory.build({ subject: 'Mathematics' })];
      setup(groups);
      await waitFor(() => {
        expect(screen.getByText('Mathematics')).toBeInTheDocument();
      });
    });

    it('renders member count', async () => {
      const groups = [GroupFactory.build({ _count: { members: 8 } })];
      setup(groups);
      await waitFor(() => {
        expect(screen.getByText(/8 members/i)).toBeInTheDocument();
      });
    });

    it('renders View and Join buttons per group', async () => {
      const groups = GroupFactory.buildList(1);
      setup(groups);
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /join/i })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /view/i })).toBeInTheDocument();
      });
    });
  });

  describe('empty state', () => {
    it('shows no results message when no groups', async () => {
      setup([]);
      await waitFor(() => {
        expect(screen.getByText(/no groups match/i)).toBeInTheDocument();
      });
    });
  });

  describe('subject filter', () => {
    it('filters groups client-side by subject', async () => {
      const groups = [
        GroupFactory.build({ subject: 'Mathematics' }),
        GroupFactory.build({ subject: 'Biology' }),
      ];
      setup(groups);
      await waitFor(() => screen.getByText('Mathematics'));

      fireEvent.change(screen.getByPlaceholderText(/filter by subject/i), {
        target: { value: 'Math' },
      });

      await waitFor(() => {
        expect(screen.getByText('Mathematics')).toBeInTheDocument();
        expect(screen.queryByText('Biology')).toBeNull();
      });
    });
  });

  describe('authenticated user', () => {
    it('shows Create group button for authenticated users', async () => {
      setup([], UserFactory.build());
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /create group/i })).toBeInTheDocument();
      });
    });

    it('does not show Create group button for guests', async () => {
      setup([]);
      await waitFor(() => screen.getByText(/explore groups/i));
      expect(screen.queryByRole('button', { name: /create group/i })).toBeNull();
    });
  });
});
