import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '../../../test/utils';
import { AdminDashboardPage } from '../AdminDashboardPage';

vi.mock('../../../api/dashboardApi', () => ({
  dashboardApi: { getStats: vi.fn() },
}));

// Mock chart components to avoid canvas/SVG rendering complexity
vi.mock('../../../components/charts/BarChartCard', () => ({
  BarChartCard: ({ title }) => <div data-testid="bar-chart">{title}</div>,
}));
vi.mock('../../../components/charts/PieChartCard', () => ({
  PieChartCard: ({ title }) => <div data-testid="pie-chart">{title}</div>,
}));

import { dashboardApi } from '../../../api/dashboardApi';

const mockStats = {
  totalUsers: 150,
  activeGroups: 12,
  charts: {
    usersByStatus: [{ name: 'Active', value: 100 }],
    groupsBySubject: [{ name: 'CS', value: 5 }],
    membersPerGroup: [{ name: 'Group A', value: 10 }],
  },
};

describe('AdminDashboardPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    dashboardApi.getStats.mockResolvedValue({ data: { data: mockStats } });
  });

  const renderPage = () => renderWithProviders(<AdminDashboardPage />, { route: '/admin/dashboard' });

  describe('loading state', () => {
    it('renders skeleton while loading', () => {
      dashboardApi.getStats.mockImplementation(() => new Promise(() => {}));
      renderPage();
      // No stat values while loading
      expect(screen.queryByText('150')).toBeNull();
    });
  });

  describe('data display', () => {
    it('renders total users stat card', async () => {
      renderPage();
      await waitFor(() => {
        // "Total Users" appears in both stat card and platform summary — use getAllByText
        const elements = screen.getAllByText('Total Users');
        expect(elements.length).toBeGreaterThan(0);
        expect(screen.getAllByText('150').length).toBeGreaterThan(0);
      });
    });

    it('renders active groups stat card', async () => {
      renderPage();
      await waitFor(() => {
        const elements = screen.getAllByText('Active Groups');
        expect(elements.length).toBeGreaterThan(0);
        expect(screen.getAllByText('12').length).toBeGreaterThan(0);
      });
    });

    it('renders platform health card', async () => {
      renderPage();
      await waitFor(() => {
        expect(screen.getByText('Platform Health')).toBeInTheDocument();
      });
    });

    it('renders pie chart for users by status', async () => {
      renderPage();
      await waitFor(() => {
        expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
        expect(screen.getByText('Users by Status')).toBeInTheDocument();
      });
    });

    it('renders bar charts', async () => {
      renderPage();
      await waitFor(() => {
        const charts = screen.getAllByTestId('bar-chart');
        expect(charts.length).toBeGreaterThanOrEqual(2);
      });
    });

    it('renders platform summary section', async () => {
      renderPage();
      await waitFor(() => {
        expect(screen.getByText(/platform summary/i)).toBeInTheDocument();
      });
    });
  });

  describe('zero state', () => {
    it('shows 0 when stats are missing', async () => {
      dashboardApi.getStats.mockResolvedValue({ data: { data: {} } });
      renderPage();
      await waitFor(() => {
        // Both stat cards show 0
        const zeros = screen.getAllByText('0');
        expect(zeros.length).toBeGreaterThan(0);
      });
    });
  });
});
