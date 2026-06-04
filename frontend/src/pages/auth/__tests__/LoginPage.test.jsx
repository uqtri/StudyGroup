import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../../test/utils';
import { LoginPage } from '../LoginPage';
import { useAuthStore } from '../../../store/authStore';
import { AuthResponseFactory } from '../../../test/factories';

// Mock API and navigation dependencies
vi.mock('../../../api/authApi', () => ({
  authApi: { login: vi.fn() },
}));

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, useNavigate: () => vi.fn() };
});

import { authApi } from '../../../api/authApi';

const resetStore = () =>
  useAuthStore.setState({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false });

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetStore();
  });

  const renderLogin = () => renderWithProviders(<LoginPage />, { route: '/login' });

  describe('rendering', () => {
    it('renders heading and subtitle', () => {
      renderLogin();
      expect(screen.getByText(/welcome back/i)).toBeInTheDocument();
      expect(screen.getByText(/sign in to your studyhub account/i)).toBeInTheDocument();
    });

    it('renders email and password inputs', () => {
      renderLogin();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    });

    it('renders submit button', () => {
      renderLogin();
      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });

    it('renders link to register page', () => {
      renderLogin();
      expect(screen.getByRole('link', { name: /register/i })).toHaveAttribute('href', '/register');
    });

    it('renders demo credentials hint', () => {
      renderLogin();
      expect(screen.getByText(/demo:/i)).toBeInTheDocument();
    });
  });

  describe('form validation', () => {
    it('shows error when submitting empty form', async () => {
      const user = userEvent.setup();
      renderLogin();

      await user.click(screen.getByRole('button', { name: /sign in/i }));

      await waitFor(() => {
        expect(screen.getByText(/valid email required/i)).toBeInTheDocument();
      });
    });

    it('does not call API when email is empty', async () => {
      const user = userEvent.setup();
      renderLogin();

      // Leave email blank, fill password only
      await user.type(screen.getByLabelText(/password/i), 'pass');
      await user.click(screen.getByRole('button', { name: /sign in/i }));

      // Validation prevents the API call
      await waitFor(() => {
        expect(screen.getByText(/valid email required/i)).toBeInTheDocument();
      });
      expect(authApi.login).not.toHaveBeenCalled();
    });
  });

  describe('successful login', () => {
    it('calls authApi.login with entered credentials', async () => {
      const user = userEvent.setup();
      const authResponse = AuthResponseFactory.build();
      authApi.login.mockResolvedValue({ data: { data: authResponse } });

      renderLogin();

      await user.type(screen.getByLabelText(/email/i), 'user@example.com');
      await user.type(screen.getByLabelText(/password/i), 'Password1');
      await user.click(screen.getByRole('button', { name: /sign in/i }));

      await waitFor(() => {
        expect(authApi.login).toHaveBeenCalledWith({
          email: 'user@example.com',
          password: 'Password1',
        });
      });
    });

    it('sets auth store on success', async () => {
      const user = userEvent.setup();
      const authResponse = AuthResponseFactory.build();
      authApi.login.mockResolvedValue({ data: { data: authResponse } });

      renderLogin();

      await user.type(screen.getByLabelText(/email/i), 'user@example.com');
      await user.type(screen.getByLabelText(/password/i), 'Password1');
      await user.click(screen.getByRole('button', { name: /sign in/i }));

      await waitFor(() => {
        expect(useAuthStore.getState().isAuthenticated).toBe(true);
        expect(useAuthStore.getState().accessToken).toBe('mock-access-token');
      });
    });
  });

  describe('error handling', () => {
    it('displays API error message on failed login', async () => {
      const user = userEvent.setup();
      authApi.login.mockRejectedValue({
        response: { data: { message: 'Invalid credentials' } },
        message: 'Request failed',
      });

      renderLogin();

      await user.type(screen.getByLabelText(/email/i), 'wrong@example.com');
      await user.type(screen.getByLabelText(/password/i), 'WrongPass1');
      await user.click(screen.getByRole('button', { name: /sign in/i }));

      await waitFor(() => {
        expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
      });
    });
  });

  describe('loading state', () => {
    it('disables submit button while loading', async () => {
      const user = userEvent.setup();
      authApi.login.mockImplementation(() => new Promise(() => {})); // never resolves

      renderLogin();

      await user.type(screen.getByLabelText(/email/i), 'user@example.com');
      await user.type(screen.getByLabelText(/password/i), 'Password1');
      await user.click(screen.getByRole('button', { name: /sign in/i }));

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /loading/i })).toBeDisabled();
      });
    });
  });
});
