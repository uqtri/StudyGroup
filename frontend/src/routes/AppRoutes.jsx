import { Routes, Route, Navigate } from 'react-router-dom';
import { WebsiteLayout } from '../layouts/WebsiteLayout';
import { AdminLayout } from '../layouts/AdminLayout';
import { AuthShell } from '../layouts/AuthShell';
import { StudentRoute, AdminRoute, GuestRoute } from './ProtectedRoute';
import { LandingPage } from '../pages/landing/LandingPage';
import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';
import { GroupsPage } from '../pages/groups/GroupsPage';
import { GroupDetailPage } from '../pages/groups/GroupDetailPage';
import { DiscussionDetailPage } from '../pages/groups/DiscussionDetailPage';
import { CreateGroupPage } from '../pages/groups/CreateGroupPage';
import { GroupManagePage } from '../pages/groups/GroupManagePage';
import { MyGroupsPage } from '../pages/my-groups/MyGroupsPage';
import { SessionsPage } from '../pages/sessions/SessionsPage';
import { SessionDetailPage } from '../pages/sessions/SessionDetailPage';
import { SessionMeetingPage } from '../pages/sessions/SessionMeetingPage';
import { ResourcesPage } from '../pages/resources/ResourcesPage';
import { DiscussionsPage } from '../pages/discussions/DiscussionsPage';
import { ProfilePage } from '../pages/profile/ProfilePage';
import { StaticPage } from '../pages/static/StaticPage';
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage';
import { AdminUsersPage } from '../pages/admin/AdminUsersPage';
import { AdminGroupsPage } from '../pages/admin/AdminGroupsPage';
import { AdminSessionsPage } from '../pages/admin/AdminSessionsPage';
import { AdminResourcesPage } from '../pages/admin/AdminResourcesPage';
import { AdminReportsPage } from '../pages/admin/AdminReportsPage';
import { AdminAnalyticsPage } from '../pages/admin/AdminAnalyticsPage';
import { AdminSettingsPage } from '../pages/admin/AdminSettingsPage';

export const AppRoutes = () => (
  <Routes>
    {/* Student & Leader website portal */}
    <Route element={<WebsiteLayout />}>
      <Route path="/" element={<LandingPage />} />
      <Route path="/groups" element={<GroupsPage />} />
      <Route path="/groups/:id/discussions/:postId" element={<DiscussionDetailPage />} />
      <Route path="/groups/:id" element={<GroupDetailPage />} />

      <Route path="/contact" element={<StaticPage title="Contact">Reach us at support@studyhub.com</StaticPage>} />
      <Route path="/faq" element={<StaticPage title="FAQ">Browse groups, join sessions, and share resources with your study community.</StaticPage>} />
      <Route path="/terms" element={<StaticPage title="Terms of Service">By using StudyHub you agree to our community guidelines.</StaticPage>} />
      <Route path="/privacy" element={<StaticPage title="Privacy Policy">We protect your data and never share it without consent.</StaticPage>} />

      <Route element={<GuestRoute />}>
        <Route
          path="/login"
          element={
            <AuthShell>
              <LoginPage />
            </AuthShell>
          }
        />
        <Route
          path="/register"
          element={
            <AuthShell>
              <RegisterPage />
            </AuthShell>
          }
        />
      </Route>

      <Route element={<StudentRoute />}>
        <Route path="/my-groups" element={<MyGroupsPage />} />
        <Route path="/sessions" element={<SessionsPage />} />
        <Route path="/sessions/:id/meeting" element={<SessionMeetingPage />} />
        <Route path="/sessions/:id" element={<SessionDetailPage />} />
        <Route path="/resources" element={<ResourcesPage />} />
        <Route path="/discussions" element={<DiscussionsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route
          path="/groups/create"
          element={
            <div className="mx-auto max-w-2xl px-4 py-10">
              <CreateGroupPage />
            </div>
          }
        />
        <Route path="/groups/:id/manage" element={<GroupManagePage />} />
      </Route>
    </Route>

    {/* Admin portal — separate layout, never shared with students */}
    <Route element={<AdminRoute />}>
      <Route element={<AdminLayout />}>
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        <Route path="/admin/users" element={<AdminUsersPage />} />
        <Route path="/admin/groups" element={<AdminGroupsPage />} />
        <Route path="/admin/sessions" element={<AdminSessionsPage />} />
        <Route path="/admin/resources" element={<AdminResourcesPage />} />
        <Route path="/admin/reports" element={<AdminReportsPage />} />
        <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />
        <Route path="/admin/settings" element={<AdminSettingsPage />} />
      </Route>
    </Route>

    {/* Legacy redirects */}
    <Route path="/dashboard" element={<Navigate to="/my-groups" replace />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);
