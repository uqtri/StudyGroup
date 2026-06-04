import { describe, it, expect, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import { Routes, Route } from 'react-router-dom';
import { renderWithProviders } from '../../test/utils';
import {
  ProtectedRoute,
  StudentRoute,
  AdminRoute,
  GuestRoute,
} from '../ProtectedRoute';
import { useAuthStore } from '../../store/authStore';
import { UserFactory } from '../../test/factories';

const resetStore = () =>
  useAuthStore.setState({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false });

const setAuth = (user) =>
  useAuthStore.setState({ user, accessToken: 'tok', refreshToken: 'ref', isAuthenticated: true });

// Helper: render a guarded route at a given initial path
const renderGuarded = (Guard, protectedContent, initialPath = '/protected') =>
  renderWithProviders(
    <Routes>
      <Route element={<Guard />}>
        <Route path="/protected" element={<div>Protected content</div>} />
      </Route>
      <Route path="/login" element={<div>Login page</div>} />
      <Route path="/" element={<div>Home page</div>} />
      <Route path="/admin/dashboard" element={<div>Admin dashboard</div>} />
    </Routes>,
    { initialEntries: [initialPath] },
  );

describe('GuestRoute', () => {
  beforeEach(resetStore);

  it('renders children when not authenticated', () => {
    renderWithProviders(
      <Routes>
        <Route element={<GuestRoute />}>
          <Route path="/login" element={<div>Login page</div>} />
        </Route>
        <Route path="/" element={<div>Home</div>} />
      </Routes>,
      { initialEntries: ['/login'] },
    );
    expect(screen.getByText('Login page')).toBeInTheDocument();
  });

  it('redirects authenticated user away from guest route', () => {
    setAuth(UserFactory.build());
    renderWithProviders(
      <Routes>
        <Route element={<GuestRoute />}>
          <Route path="/login" element={<div>Login page</div>} />
        </Route>
        <Route path="/" element={<div>Home</div>} />
      </Routes>,
      { initialEntries: ['/login'] },
    );
    expect(screen.queryByText('Login page')).toBeNull();
    expect(screen.getByText('Home')).toBeInTheDocument();
  });
});

describe('StudentRoute', () => {
  beforeEach(resetStore);

  it('redirects unauthenticated user to /login', () => {
    renderGuarded(StudentRoute);
    expect(screen.getByText('Login page')).toBeInTheDocument();
  });

  it('renders protected content for authenticated student', () => {
    setAuth(UserFactory.build());
    renderGuarded(StudentRoute);
    expect(screen.getByText('Protected content')).toBeInTheDocument();
  });

  it('redirects admin user to /admin/dashboard', () => {
    setAuth(UserFactory.buildAdmin());
    renderGuarded(StudentRoute);
    expect(screen.getByText('Admin dashboard')).toBeInTheDocument();
  });
});

describe('AdminRoute', () => {
  beforeEach(resetStore);

  it('redirects unauthenticated user to /login', () => {
    renderGuarded(AdminRoute);
    expect(screen.getByText('Login page')).toBeInTheDocument();
  });

  it('renders content for admin user', () => {
    setAuth(UserFactory.buildAdmin());
    renderGuarded(AdminRoute);
    expect(screen.getByText('Protected content')).toBeInTheDocument();
  });

  it('redirects regular member to home', () => {
    setAuth(UserFactory.build());
    renderGuarded(AdminRoute);
    expect(screen.getByText('Home page')).toBeInTheDocument();
  });
});
