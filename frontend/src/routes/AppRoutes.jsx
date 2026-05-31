import { Routes, Route, Navigate } from 'react-router-dom';
import { PublicLayout } from '../layouts/PublicLayout';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { ProtectedRoute, AdminRoute } from './ProtectedRoute';
import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';
import { DashboardPage } from '../pages/dashboard/DashboardPage';
import { GroupsPage } from '../pages/groups/GroupsPage';
import { GroupDetailPage } from '../pages/groups/GroupDetailPage';
import { CreateGroupPage } from '../pages/groups/CreateGroupPage';
import { SessionsPage } from '../pages/sessions/SessionsPage';
import { SessionDetailPage } from '../pages/sessions/SessionDetailPage';
import { ResourcesPage } from '../pages/resources/ResourcesPage';
import { ProfilePage } from '../pages/profile/ProfilePage';
import { AdminUsersPage } from '../pages/admin/AdminUsersPage';
import { AdminGroupsPage } from '../pages/admin/AdminGroupsPage';
import { AdminReportsPage } from '../pages/admin/AdminReportsPage';

export const AppRoutes = () => (
  <Routes>
    <Route element={<PublicLayout />}>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
    </Route>

    <Route element={<ProtectedRoute />}>
      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/groups" element={<GroupsPage />} />
        <Route path="/groups/create" element={<CreateGroupPage />} />
        <Route path="/groups/:id" element={<GroupDetailPage />} />
        <Route path="/sessions" element={<SessionsPage />} />
        <Route path="/sessions/:id" element={<SessionDetailPage />} />
        <Route path="/resources" element={<ResourcesPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>
    </Route>

    <Route element={<AdminRoute />}>
      <Route element={<DashboardLayout />}>
        <Route path="/admin/users" element={<AdminUsersPage />} />
        <Route path="/admin/groups" element={<AdminGroupsPage />} />
        <Route path="/admin/reports" element={<AdminReportsPage />} />
      </Route>
    </Route>

    <Route path="/" element={<Navigate to="/dashboard" replace />} />
    <Route path="*" element={<Navigate to="/dashboard" replace />} />
  </Routes>
);
