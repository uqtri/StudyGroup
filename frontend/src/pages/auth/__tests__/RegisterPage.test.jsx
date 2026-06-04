import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../../test/utils';
import { RegisterPage } from '../RegisterPage';
import { useAuthStore } from '../../../store/authStore';
import { AuthResponseFactory } from '../../../test/factories';

vi.mock('../../../api/authApi', () => ({
  authApi: { register: vi.fn() },
}));

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, useNavigate: () => vi.fn() };
});

import { authApi } from '../../../api/authApi';

const resetStore = () =>
  useAuthStore.setState({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false });

describe('RegisterPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetStore();
  });

  const renderRegister = () => renderWithProviders(<RegisterPage />, { route: '/register' });

  describe('rendering', () => {
    it('renders heading', () => {
      renderRegister();
      expect(screen.getByText(/create account/i)).toBeInTheDocument();
    });

    it('renders full name, email, password inputs', () => {
      renderRegister();
      expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    });

    it('renders register button', () => {
      renderRegister();
      expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
    });

    it('renders link to login page', () => {
      renderRegister();
      expect(screen.getByRole('link', { name: /sign in/i })).toHaveAttribute('href', '/login');
    });
  });

  describe('form validation', () => {
    it('shows error for short full name', async () => {
      const user = userEvent.setup();
      renderRegister();

      await user.type(screen.getByLabelText(/full name/i), 'A');
      await user.type(screen.getByLabelText(/email/i), 'a@b.com');
      await user.type(screen.getByLabelText(/password/i), 'Password1');
      await user.click(screen.getByRole('button', { name: /register/i }));

      await waitFor(() => {
        expect(screen.getByText(/2 character/i)).toBeInTheDocument();
      });
    });

    it('does not call API when email is empty', async () => {
      const user = userEvent.setup();
      renderRegister();

      // Fill name and password but leave email blank
      await user.type(screen.getByLabelText(/full name/i), 'Alice Smith');
      await user.type(screen.getByLabelText(/password/i), 'Password1');
      await user.click(screen.getByRole('button', { name: /register/i }));

      // Validation blocks the API call and shows the error
      await waitFor(() => {
        expect(screen.getByText(/valid email required/i)).toBeInTheDocument();
      });
      expect(authApi.register).not.toHaveBeenCalled();
    });

    it('shows error for weak password (no uppercase)', async () => {
      const user = userEvent.setup();
      renderRegister();

      await user.type(screen.getByLabelText(/full name/i), 'Alice Smith');
      await user.type(screen.getByLabelText(/email/i), 'alice@example.com');
      await user.type(screen.getByLabelText(/password/i), 'password1');
      await user.click(screen.getByRole('button', { name: /register/i }));

      await waitFor(() => {
        expect(screen.getByText(/uppercase/i)).toBeInTheDocument();
      });
    });

    it('shows error for weak password (no number)', async () => {
      const user = userEvent.setup();
      renderRegister();

      await user.type(screen.getByLabelText(/full name/i), 'Alice Smith');
      await user.type(screen.getByLabelText(/email/i), 'alice@example.com');
      await user.type(screen.getByLabelText(/password/i), 'PasswordABC');
      await user.click(screen.getByRole('button', { name: /register/i }));

      await waitFor(() => {
        expect(screen.getByText(/number/i)).toBeInTheDocument();
      });
    });
  });

  describe('successful registration', () => {
    it('calls authApi.register with form data', async () => {
      const user = userEvent.setup();
      const authResponse = AuthResponseFactory.build();
      authApi.register.mockResolvedValue({ data: { data: authResponse } });

      renderRegister();

      await user.type(screen.getByLabelText(/full name/i), 'Alice Smith');
      await user.type(screen.getByLabelText(/email/i), 'alice@example.com');
      await user.type(screen.getByLabelText(/password/i), 'Password1');
      await user.click(screen.getByRole('button', { name: /register/i }));

      await waitFor(() => {
        expect(authApi.register).toHaveBeenCalledWith({
          fullName: 'Alice Smith',
          email: 'alice@example.com',
          password: 'Password1',
        });
      });
    });

    it('sets auth store on success', async () => {
      const user = userEvent.setup();
      const authResponse = AuthResponseFactory.build();
      authApi.register.mockResolvedValue({ data: { data: authResponse } });

      renderRegister();

      await user.type(screen.getByLabelText(/full name/i), 'Alice Smith');
      await user.type(screen.getByLabelText(/email/i), 'alice@example.com');
      await user.type(screen.getByLabelText(/password/i), 'Password1');
      await user.click(screen.getByRole('button', { name: /register/i }));

      await waitFor(() => {
        expect(useAuthStore.getState().isAuthenticated).toBe(true);
      });
    });
  });

  describe('error handling', () => {
    it('shows API error message on duplicate email', async () => {
      const user = userEvent.setup();
      authApi.register.mockRejectedValue({
        response: { data: { message: 'Email already in use' } },
        message: 'Request failed',
      });

      renderRegister();

      await user.type(screen.getByLabelText(/full name/i), 'Alice Smith');
      await user.type(screen.getByLabelText(/email/i), 'alice@example.com');
      await user.type(screen.getByLabelText(/password/i), 'Password1');
      await user.click(screen.getByRole('button', { name: /register/i }));

      await waitFor(() => {
        expect(screen.getByText(/email already in use/i)).toBeInTheDocument();
      });
    });
  });
});
