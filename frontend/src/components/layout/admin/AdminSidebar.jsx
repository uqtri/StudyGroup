import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  FolderOpen,
  Calendar,
  FileText,
  Flag,
  BarChart3,
  Settings,
} from 'lucide-react';
import { Logo } from '../../common/Logo';
import { cn } from '../../../utils/cn';

const links = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/groups', label: 'Study Groups', icon: FolderOpen },
  { to: '/admin/sessions', label: 'Sessions', icon: Calendar },
  { to: '/admin/resources', label: 'Resources', icon: FileText },
  { to: '/admin/reports', label: 'Reports', icon: Flag },
  { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];

const linkClass = ({ isActive }) =>
  cn(
    'flex items-center gap-3 rounded-[var(--radius-control)] px-3 py-2.5 text-sm font-medium transition',
    isActive ? 'nav-active' : 'text-muted hover:bg-elevated hover:text-foreground',
  );

export const AdminSidebar = ({ open, onClose }) => (
  <>
    {open && (
      <div
        className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        onClick={onClose}
        aria-hidden
      />
    )}
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-surface p-4 transition-transform lg:static lg:translate-x-0',
        open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
      )}
    >
      <div className="mb-8 border-b border-border pb-4 px-2">
        <p className="text-xs font-medium text-muted">Admin portal</p>
        <Logo className="mt-1 text-lg" />
      </div>
      <nav className="flex-1 space-y-0.5">
        {links.map((item) => (
          <NavLink key={item.to} to={item.to} className={linkClass} onClick={onClose}>
            <item.icon size={18} strokeWidth={1.75} />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  </>
);
