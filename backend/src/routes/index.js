import { Router } from 'express';
import authRoutes from '../modules/auth/auth.routes.js';
import usersRoutes from '../modules/users/users.routes.js';
import groupsRoutes from '../modules/groups/groups.routes.js';
import sessionsRoutes from '../modules/sessions/sessions.routes.js';
import attendanceRoutes from '../modules/attendance/attendance.routes.js';
import resourcesRoutes from '../modules/resources/resources.routes.js';
import postsRoutes from '../modules/posts/posts.routes.js';
import commentsRoutes from '../modules/comments/comments.routes.js';
import notificationsRoutes from '../modules/notifications/notifications.routes.js';
import reportsRoutes from '../modules/reports/reports.routes.js';
import dashboardRoutes from '../modules/dashboard/dashboard.routes.js';

const router = Router();

router.get('/health', (_req, res) => {
  res.json({ success: true, message: 'StudyHub API is running', data: { timestamp: new Date() } });
});

router.use('/auth', authRoutes);
router.use('/users', usersRoutes);
router.use('/groups', groupsRoutes);
router.use('/sessions', sessionsRoutes);
router.use('/attendance', attendanceRoutes);
router.use('/resources', resourcesRoutes);
router.use('/posts', postsRoutes);
router.use('/comments', commentsRoutes);
router.use('/notifications', notificationsRoutes);
router.use('/reports', reportsRoutes);
router.use('/dashboard', dashboardRoutes);

export default router;
