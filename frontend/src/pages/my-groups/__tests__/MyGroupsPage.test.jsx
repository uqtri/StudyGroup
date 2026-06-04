import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '../../../test/utils';
import { MyGroupsPage } from '../MyGroupsPage';
import { GroupFactory, SessionFactory, paginatedResponse } from '../../../test/factories';

vi.mock('../../../api/groupApi', () => ({
  groupApi: { list: vi.fn() },
}));
vi.mock('../../../api/sessionApi', () => ({
  sessionApi: { list: vi.fn() },
}));

import { groupApi } from '../../../api/groupApi';
import { sessionApi } from '../../../api/sessionApi';

describe('MyGroupsPage', () => {
  beforeEach(() => vi.clearAllMocks());

  const setup = (groups = [], sessions = []) => {
    groupApi.list.mockResolvedValue({
      data: { data: paginatedResponse(groups) },
    });
    sessionApi.list.mockResolvedValue({
      data: { data: paginatedResponse(sessions) },
    });
    return renderWithProviders(<MyGroupsPage />, { route: '/my-groups' });
  };

  describe('loading state', () => {
    it('renders skeleton while loading', () => {
      groupApi.list.mockImplementation(() => new Promise(() => {}));
      sessionApi.list.mockImplementation(() => new Promise(() => {}));
      renderWithProviders(<MyGroupsPage />, { route: '/my-groups' });
      // Skeleton renders — no heading visible yet
      expect(screen.queryByText(/my groups/i)).toBeNull();
    });
  });

  describe('empty state', () => {
    it('shows empty state message when no groups', async () => {
      setup([], []);

      await waitFor(() => {
        expect(screen.getByText(/haven't joined any groups yet/i)).toBeInTheDocument();
      });
    });

    it('shows explore groups link when no groups', async () => {
      setup([], []);

      await waitFor(() => {
        expect(screen.getByRole('link', { name: /explore groups/i })).toBeInTheDocument();
      });
    });

    it('shows no upcoming sessions message', async () => {
      setup([], []);

      await waitFor(() => {
        expect(screen.getByText(/no upcoming sessions/i)).toBeInTheDocument();
      });
    });
  });

  describe('with data', () => {
    it('renders group names', async () => {
      const groups = GroupFactory.buildList(2);
      setup(groups, []);

      await waitFor(() => {
        expect(screen.getByText(groups[0].name)).toBeInTheDocument();
        expect(screen.getByText(groups[1].name)).toBeInTheDocument();
      });
    });

    it('renders joined groups count in heading', async () => {
      const groups = GroupFactory.buildList(3);
      setup(groups, []);

      await waitFor(() => {
        expect(screen.getByText(/joined groups \(3\)/i)).toBeInTheDocument();
      });
    });

    it('renders upcoming session titles', async () => {
      const sessions = SessionFactory.buildList(2);
      setup([], sessions);

      await waitFor(() => {
        expect(screen.getByText(sessions[0].title)).toBeInTheDocument();
        expect(screen.getByText(sessions[1].title)).toBeInTheDocument();
      });
    });

    it('renders group link with correct href', async () => {
      const groups = [GroupFactory.build({ id: 'grp-1' })];
      setup(groups, []);

      await waitFor(() => {
        expect(screen.getByRole('link', { name: new RegExp(groups[0].name) })).toHaveAttribute(
          'href',
          '/groups/grp-1',
        );
      });
    });

    it('renders member and session counts', async () => {
      const groups = [GroupFactory.build({ _count: { members: 7, sessions: 4 } })];
      setup(groups, []);

      await waitFor(() => {
        expect(screen.getByText('7')).toBeInTheDocument();
        expect(screen.getByText(/4 sessions/i)).toBeInTheDocument();
      });
    });
  });
});
