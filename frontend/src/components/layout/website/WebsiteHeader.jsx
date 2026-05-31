import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '../../../store/authStore';
import { NotificationDropdown } from '../../notifications/NotificationDropdown';
import { ThemeToggle } from '../../common/ThemeToggle';
import { Button } from '../../common/Button';
import { Logo } from '../../common/Logo';
import { cn } from '../../../utils/cn';
import { isAdmin } from '../../../utils/authRedirect';

const navLinks = [
  { to: '/', label: 'Home', end: true },
  { to: '/groups', label: 'Groups' },
  { to: '/my-groups', label: 'My Groups', auth: true },
  { to: '/sessions', label: 'Sessions' },
  { to: '/resources', label: 'Resources', auth: true },
  { to: '/discussions', label: 'Discussions', auth: true },
];

const navClass = ({ isActive }) =>
  cn(
    'rounded-[var(--radius-control)] px-3 py-2 text-sm font-medium transition',
    isActive ? 'nav-active' : 'text-muted hover:text-foreground',
  );

export const WebsiteHeader = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const visibleLinks = navLinks.filter((l) => !l.auth || isAuthenticated);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="text-lg">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {visibleLinks.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end} className={navClass}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {isAuthenticated ? (
            <>
              <NotificationDropdown />
              {isAdmin(user) ? (
                <Link to="/admin/dashboard">
                  <Button variant="outline" className="!py-2 !text-xs">
                    Admin
                  </Button>
                </Link>
              ) : null}
              <Link
                to="/profile"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-white transition hover:opacity-90"
              >
                {user?.fullName?.charAt(0) || 'U'}
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="hidden text-sm text-muted transition hover:text-foreground sm:block"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="outline" className="!py-2">
                  Log in
                </Button>
              </Link>
              <Link to="/register">
                <Button className="!py-2">Sign up</Button>
              </Link>
            </>
          )}
          <button
            type="button"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            className="rounded-[var(--radius-control)] p-2 text-muted lg:hidden"
            onClick={() => setMobileOpen((o) => !o)}
          >
            {mobileOpen ? <X size={22} strokeWidth={1.75} /> : <Menu size={22} strokeWidth={1.75} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="border-t border-border bg-surface px-4 py-3 lg:hidden">
          {visibleLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                cn('block rounded-lg px-3 py-2.5 text-sm font-medium', navClass({ isActive }))
              }
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  );
};

