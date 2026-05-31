import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  FolderOpen,
  Calendar,
  FileText,
  User,
  Shield,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { ROLES } from '../../constants/roles';
import { Logo } from '../common/Logo';
import { cn } from '../../utils/cn';

const linkClass = ({ isActive }) =>
  cn(
    'flex items-center gap-3 rounded-[var(--radius-control)] px-3 py-2.5 text-sm font-medium transition',
    isActive ? 'nav-active' : 'text-muted hover:bg-elevated hover:text-foreground',
  );

export const Sidebar = ({ open, onClose }) => {
  const user = useAuthStore((s) => s.user);
  const isAdmin = user?.roles?.includes(ROLES.ADMIN);
  const isLeader = user?.roles?.includes(ROLES.LEADER);

  const nav = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/groups', label: 'Groups', icon: Users },
    { to: '/sessions', label: 'Sessions', icon: Calendar },
    { to: '/resources', label: 'Resources', icon: FileText },
    { to: '/profile', label: 'Profile', icon: User },
  ];

  const adminNav = [
    { to: '/admin/users', label: 'Users', icon: Shield },
    { to: '/admin/groups', label: 'All Groups', icon: FolderOpen },
  ];

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-hidden
        />
      )}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-surface p-4 transition-transform lg:static lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="mb-8 px-2">
          <Logo className="text-lg" />
          <p className="mt-1 text-xs text-muted">Group study workspace</p>
        </div>

        <nav className="flex-1 space-y-0.5">
          {nav.map((item) => (
            <NavLink key={item.to} to={item.to} className={linkClass} onClick={onClose}>
              <item.icon size={18} strokeWidth={1.75} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {isAdmin && (
          <div className="mt-6 border-t border-border pt-4">
            <p className="mb-2 px-3 text-xs font-semibold text-muted">Admin</p>
            <nav className="space-y-0.5">
              {adminNav.map((item) => (
                <NavLink key={item.to} to={item.to} className={linkClass} onClick={onClose}>
                  <item.icon size={18} strokeWidth={1.75} />
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>
        )}

        {isLeader && !isAdmin && (
          <p className="mt-4 px-3 text-xs text-muted">Leader tools on dashboard</p>
        )}
      </aside>
    </>
  );
};
