import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';

/**
 * Create a fresh QueryClient for each test to avoid cache pollution.
 */
export const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
      mutations: { retry: false },
    },
  });

/**
 * Render a component wrapped with all required providers.
 * @param {React.ReactElement} ui
 * @param {{ route?: string, initialEntries?: string[], queryClient?: QueryClient }} options
 */
export const renderWithProviders = (ui, options = {}) => {
  const {
    route = '/',
    initialEntries = [route],
    queryClient = createTestQueryClient(),
  } = options;

  const Wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
    </QueryClientProvider>
  );

  return render(ui, { wrapper: Wrapper });
};

/**
 * Render with a real BrowserRouter (for tests that need history manipulation).
 */
export const renderWithBrowserRouter = (ui, options = {}) => {
  const { queryClient = createTestQueryClient() } = options;

  const Wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{children}</BrowserRouter>
    </QueryClientProvider>
  );

  return render(ui, { wrapper: Wrapper });
};

export * from '@testing-library/react';
