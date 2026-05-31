import { Menu, Bell, LogOut } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { authApi } from '../../api/authApi';
import { Button } from '../common/Button';
import { ThemeToggle } from '../common/ThemeToggle';

export const Navbar = ({ onMenuClick, breadcrumb }) => {
  const { user, refreshToken, logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      await authApi.logout(refreshToken);
    } catch {
      /* ignore */
    }
    logout();
    window.location.href = '/login';
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-surface/80 px-4 backdrop-blur-xl lg:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="rounded-xl p-2 text-muted transition hover:bg-elevated hover:text-foreground lg:hidden"
          onClick={onMenuClick}
        >
          <Menu size={20} />
        </button>
        {breadcrumb && <div className="text-sm font-medium text-muted">{breadcrumb}</div>}
      </div>

      <div className="flex items-center gap-3">
        <ThemeToggle />
        <button
          type="button"
          className="rounded-xl p-2 text-muted transition hover:bg-elevated hover:text-foreground"
        >
          <Bell size={20} />
        </button>
        <div className="hidden text-right sm:block">
          <p className="text-sm font-medium text-foreground">{user?.fullName}</p>
          <p className="text-xs text-muted">{user?.roles?.join(', ')}</p>
        </div>
        <Button variant="outline" onClick={handleLogout} className="!px-2.5 !py-2.5">
          <LogOut size={16} />
        </Button>
      </div>
    </header>
  );
};
