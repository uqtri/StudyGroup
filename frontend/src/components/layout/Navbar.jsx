import { Menu, Bell, LogOut } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { authApi } from '../../api/authApi';
import { Button } from '../common/Button';

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
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 lg:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
          onClick={onMenuClick}
        >
          <Menu size={20} />
        </button>
        {breadcrumb && <div className="text-sm text-slate-500">{breadcrumb}</div>}
      </div>

      <div className="flex items-center gap-4">
        <button type="button" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100">
          <Bell size={20} />
        </button>
        <div className="hidden text-right sm:block">
          <p className="text-sm font-medium text-text">{user?.fullName}</p>
          <p className="text-xs text-slate-500">{user?.roles?.join(', ')}</p>
        </div>
        <Button variant="outline" onClick={handleLogout} className="!px-2 !py-2">
          <LogOut size={16} />
        </Button>
      </div>
    </header>
  );
};
