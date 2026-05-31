import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  FolderOpen,
  Calendar,
  FileText,
  User,
  Shield,
  Flag,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { ROLES } from '../../constants/roles';
import { cn } from '../../utils/cn';

const linkClass = ({ isActive }) =>
  cn(
    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition',
    isActive ? 'bg-primary text-white' : 'text-slate-600 hover:bg-slate-100',
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
    { to: '/admin/reports', label: 'Reports', icon: Flag },
  ];

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={onClose} />
      )}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 border-r border-slate-200 bg-white p-4 transition-transform lg:static lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="mb-8 px-2">
          <h1 className="text-xl font-bold text-primary">StudyHub</h1>
          <p className="text-xs text-slate-500">Group Study Management</p>
        </div>

        <nav className="space-y-1">
          {nav.map((item) => (
            <NavLink key={item.to} to={item.to} className={linkClass} onClick={onClose}>
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {isAdmin && (
          <div className="mt-8">
            <p className="mb-2 px-3 text-xs font-semibold uppercase text-slate-400">Admin</p>
            <nav className="space-y-1">
              {adminNav.map((item) => (
                <NavLink key={item.to} to={item.to} className={linkClass} onClick={onClose}>
                  <item.icon size={18} />
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>
        )}

        {isLeader && !isAdmin && (
          <p className="mt-6 px-3 text-xs text-slate-500">Leader tools available on dashboard</p>
        )}
      </aside>
    </>
  );
};
