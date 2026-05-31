import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar';
import { Navbar } from '../components/layout/Navbar';

const breadcrumbMap = {
  '/dashboard': 'Dashboard',
  '/groups': 'Groups',
  '/groups/create': 'Create Group',
  '/sessions': 'Sessions',
  '/resources': 'Resources',
  '/profile': 'Profile',
  '/admin/users': 'Admin / Users',
  '/admin/groups': 'Admin / Groups',
};

export const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { pathname } = useLocation();

  const breadcrumb =
    breadcrumbMap[pathname] ||
    (pathname.startsWith('/groups/') ? 'Group Details' : 'StudyHub');

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex flex-1 flex-col">
        <Navbar onMenuClick={() => setSidebarOpen(true)} breadcrumb={breadcrumb} />
        <main className="flex-1 p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
