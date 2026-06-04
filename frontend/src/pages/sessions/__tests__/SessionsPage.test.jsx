import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../../../test/utils';
import { SessionsPage } from '../SessionsPage';
import { SessionFactory, paginatedResponse } from '../../../test/factories';

vi.mock('../../../api/sessionApi', () => ({ sessionApi: { list: vi.fn() } }));

import { sessionApi } from '../../../api/sessionApi';

const setup = (sessions = []) => {
  sessionApi.list.mockResolvedValue({ data: { data: paginatedResponse(sessions) } });
  return renderWithProviders(<SessionsPage />, { route: '/sessions' });
};

describe('SessionsPage', () => {
  beforeEach(() => vi.clearAllMocks());

  describe('rendering', () => {
    it('renders study sessions heading', async () => {
      setup();
      await waitFor(() => {
        expect(screen.getByText(/study sessions/i)).toBeInTheDocument();
      });
    });

    it('renders List and Calendar view toggle buttons', async () => {
      setup();
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /list/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /calendar/i })).toBeInTheDocument();
      });
    });
  });

  describe('empty state', () => {
    it('shows no sessions message', async () => {
      setup([]);
      await waitFor(() => {
        expect(screen.getByText(/no sessions found/i)).toBeInTheDocument();
      });
    });
  });

  describe('with sessions', () => {
    it('renders session titles in list view', async () => {
      const sessions = SessionFactory.buildList(2);
      setup(sessions);
      await waitFor(() => {
        expect(screen.getByText(sessions[0].title)).toBeInTheDocument();
        expect(screen.getByText(sessions[1].title)).toBeInTheDocument();
      });
    });

    it('renders session links to detail pages', async () => {
      const sessions = [SessionFactory.build({ id: 'sess-1' })];
      setup(sessions);
      await waitFor(() => {
        const link = screen.getByRole('link', { name: new RegExp(sessions[0].title) });
        expect(link).toHaveAttribute('href', '/sessions/sess-1');
      });
    });

    it('renders status badge', async () => {
      const sessions = [SessionFactory.build({ status: 'SCHEDULED' })];
      setup(sessions);
      await waitFor(() => {
        expect(screen.getByText('SCHEDULED')).toBeInTheDocument();
      });
    });
  });

  describe('view toggle', () => {
    it('switches to calendar view when Calendar button clicked', async () => {
      const sessions = SessionFactory.buildList(2);
      setup(sessions);
      await waitFor(() => screen.getByRole('button', { name: /calendar/i }));

      fireEvent.click(screen.getByRole('button', { name: /calendar/i }));

      await waitFor(() => {
        // In calendar view, sessions are grouped by date
        expect(screen.queryByRole('link', { name: new RegExp(sessions[0].title) })).toBeInTheDocument();
      });
    });

    it('switches back to list view', async () => {
      setup([]);
      await waitFor(() => screen.getByRole('button', { name: /list/i }));
      fireEvent.click(screen.getByRole('button', { name: /calendar/i }));
      fireEvent.click(screen.getByRole('button', { name: /list/i }));
      await waitFor(() => {
        expect(screen.getByText(/no sessions found/i)).toBeInTheDocument();
      });
    });
  });
});
