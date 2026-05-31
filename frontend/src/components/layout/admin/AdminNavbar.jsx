import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Search, Bell, LogOut, ChevronDown } from 'lucide-react';
import { useAuthStore } from '../../../store/authStore';
import { authApi } from '../../../api/authApi';
import { ThemeToggle } from '../../common/ThemeToggle';

export const AdminNavbar = ({ onMenuClick, title }) => {
  const { user, refreshToken, logout } = useAuthStore();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await authApi.logout(refreshToken);
    } catch {
      /* ignore */
    }
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-border bg-surface/95 px-4 backdrop-blur-md lg:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          aria-label="Open sidebar"
          className="rounded-[var(--radius-control)] p-2 text-muted hover:bg-elevated lg:hidden"
          onClick={onMenuClick}
        >
          <Menu size={20} strokeWidth={1.75} />
        </button>
        {title && <h2 className="truncate text-lg font-semibold text-foreground">{title}</h2>}
      </div>

      <div className="hidden max-w-md flex-1 md:block">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
            strokeWidth={1.75}
          />
          <input
            type="search"
            placeholder="Search users, groups, reports..."
            className="w-full rounded-[var(--radius-control)] border border-border bg-elevated py-2 pl-10 pr-4 text-sm outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/15"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle />
        <button
          type="button"
          aria-label="Notifications"
          className="relative rounded-[var(--radius-control)] p-2 text-muted hover:bg-elevated hover:text-foreground"
        >
          <Bell size={20} strokeWidth={1.75} />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-danger" />
        </button>

        <div className="relative">
          <button
            type="button"
            onClick={() => setProfileOpen((o) => !o)}
            className="flex items-center gap-2 rounded-[var(--radius-control)] border border-border px-2 py-1.5 hover:bg-elevated"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
              {user?.fullName?.charAt(0) || 'A'}
            </div>
            <span className="hidden text-sm font-medium sm:block">{user?.fullName}</span>
            <ChevronDown size={16} className="text-muted" strokeWidth={1.75} />
          </button>
          {profileOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-[var(--radius-card)] border border-border bg-surface py-1 shadow-elevated">
              <Link
                to="/admin/settings"
                className="block px-4 py-2 text-sm hover:bg-elevated"
                onClick={() => setProfileOpen(false)}
              >
                Settings
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-danger hover:bg-elevated"
              >
                <LogOut size={16} strokeWidth={1.75} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
