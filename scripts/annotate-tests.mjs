/**
 * Annotates test files with UTCID prefixes per Decision_Tables.md mapping.
 * Run: node scripts/annotate-tests.mjs
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

/** file path fragment -> describe name -> [[utcId, testNameSubstring], ...] */
const UTCID_MAP = {
  'auth/auth.service.test.js': {
    register: [
      ['UTCID01', 'should register a new user successfully'],
      ['UTCID03', 'should throw conflict if email exists'],
      ['UTCID04', 'should throw error if default role not found'],
    ],
    login: [
      ['UTCID01', 'should login successfully'],
      ['UTCID03', 'should throw unauthorized if user not found'],
      ['UTCID04', 'should throw forbidden if account suspended'],
      ['UTCID06', 'should throw unauthorized if wrong password'],
    ],
    getProfile: [
      ['UTCID01', 'should return sanitized user profile'],
      ['UTCID05', 'should throw not found if user does not exist'],
    ],
    refresh: [
      ['UTCID03', 'should throw unauthorized if no token'],
      ['UTCID04', 'should throw unauthorized if invalid token signature'],
    ],
    logout: [
      ['UTCID01', 'should delete token if refreshToken provided'],
      ['UTCID02', 'should delete all user tokens if userId provided'],
    ],
  },
  'auth/auth.controller.test.js': {
    'POST /auth/register': [
      ['UTCID01', 'should validate request body and call register'],
      ['UTCID02', 'should return 400 for invalid email'],
    ],
    'POST /auth/login': [['UTCID01', 'should call login and return data']],
    'GET /auth/me': [
      ['UTCID04', 'should require authentication'],
      ['UTCID01', 'should return user profile if authenticated'],
    ],
    'POST /auth/logout': [['UTCID01', 'should logout user']],
  },
  'users/users.service.test.js': {
    list: [['UTCID01', 'should return paginated list of users']],
    getById: [
      ['UTCID01', 'should return user by id'],
      ['UTCID03', 'should throw not found if user missing'],
    ],
    update: [
      ['UTCID01', 'should update user if requester is the user'],
      ['UTCID02', 'should update user if requester is admin'],
      ['UTCID04', 'should throw forbidden if requester is not user and not admin'],
    ],
    remove: [['UTCID01', 'should call softDelete on repository']],
    setStatus: [
      ['UTCID01', 'should update status if requester is admin'],
      ['UTCID06', 'should revoke tokens if status set to SUSPENDED'],
      ['UTCID04', 'should throw forbidden if requester is not admin'],
      ['UTCID03', 'should throw bad request if changing own status'],
      ['UTCID03', 'should throw not found if target user missing'],
      ['UTCID03', 'should throw forbidden if targeting another admin'],
    ],
  },
  'users/users.controller.test.js': {
    'GET /users': [
      ['UTCID04', 'should return 401 if not authenticated'],
      ['UTCID01', 'should return paginated list of users'],
    ],
    'GET /users/:id': [['UTCID01', 'should return user by id']],
    'PATCH /users/:id': [['UTCID01', 'should call update and return updated user']],
    'DELETE /users/:id': [['UTCID01', 'should call remove on user']],
    'PATCH /users/:id/status': [['UTCID01', 'should update user status']],
  },
  'groups/groups.service.test.js': {
    list: [['UTCID01', 'should return paginated list of groups']],
    getById: [
      ['UTCID01', 'should return group with join requests if user is leader'],
      ['UTCID01', 'should not return join requests if user is not leader'],
      ['UTCID07', 'should throw not found if group archived and not admin'],
      ['UTCID06', 'should return group if archived and user is admin'],
    ],
    create: [['UTCID01', 'should create a group']],
    update: [
      ['UTCID01', 'should update group if leader'],
      ['UTCID04', 'should throw forbidden if not leader'],
    ],
    remove: [
      ['UTCID01', 'should soft delete if creator'],
      ['UTCID01', 'should soft delete if admin'],
      ['UTCID04', 'should throw forbidden if not creator and not admin'],
    ],
    requestJoin: [
      ['UTCID01', 'should create join request'],
      ['UTCID03', 'should throw if group not ACTIVE'],
      ['UTCID06', 'should throw if already member'],
      ['UTCID03', 'should throw if group full'],
    ],
    handleJoinRequest: [
      ['UTCID01', 'should approve and add member'],
      ['UTCID06', 'should reject without adding member'],
      ['UTCID04', 'should throw forbidden if not leader'],
    ],
    cancelJoinRequest: [
      ['UTCID01', 'should delete join request'],
      ['UTCID03', 'should throw if not pending'],
    ],
    setStatus: [
      ['UTCID01', 'should update status and notify users'],
      ['UTCID04', 'should throw forbidden if not admin'],
    ],
  },
  'groups/groups.controller.test.js': {
    'GET /groups': [['UTCID01', 'should list groups without auth if not protected']],
    'GET /groups/:id': [['UTCID01', 'should get group by id without auth']],
    'POST /groups': [
      ['UTCID01', 'should create group if authenticated'],
      ['UTCID04', 'should return 401 if not auth'],
    ],
    'PATCH /groups/:id': [['UTCID01', 'should update group']],
    'DELETE /groups/:id': [['UTCID01', 'should delete group']],
    'POST /groups/:id/join': [['UTCID01', 'should request join']],
    'POST /groups/join-requests/:requestId/approve': [['UTCID01', 'should approve join request']],
    'POST /groups/join-requests/:requestId/reject': [['UTCID01', 'should reject join request']],
    'DELETE /groups/:id/join': [['UTCID01', 'should cancel join request']],
    'PATCH /groups/:id/status': [['UTCID01', 'should set status if admin']],
  },
  'sessions/sessions.service.test.js': {
    list: [['UTCID01', 'should return paginated list of sessions']],
    getById: [
      ['UTCID01', 'should return session by id'],
      ['UTCID03', 'should throw not found'],
    ],
    create: [
      ['UTCID01', 'should create a scheduled session'],
      ['UTCID01', 'should create an immediate session and notify'],
      ['UTCID04', 'should throw forbidden if not group member'],
    ],
    update: [
      ['UTCID01', 'should update session if creator'],
      ['UTCID01', 'should update session if leader'],
      ['UTCID04', 'should throw forbidden if not creator and not leader'],
    ],
    end: [
      ['UTCID01', 'should end session and delete livekit room if live'],
      ['UTCID06', 'should cancel scheduled session'],
    ],
    getLiveKitToken: [
      ['UTCID01', 'should return token if session is live'],
      ['UTCID03', 'should throw if session not in progress'],
      ['UTCID04', 'should throw if not group member'],
    ],
  },
  'sessions/sessions.controller.test.js': {
    'GET /sessions': [['UTCID01', 'should list sessions without auth']],
    'GET /sessions/:id': [['UTCID01', 'should return session']],
    'POST /sessions': [['UTCID01', 'should create session']],
    'PATCH /sessions/:id': [['UTCID01', 'should update session']],
    'POST /sessions/:id/end': [['UTCID01', 'should end session']],
    'POST /sessions/:id/notify': [['UTCID01', 'should notify members']],
    'GET /sessions/:id/livekit-token': [['UTCID01', 'should get livekit token']],
    'DELETE /sessions/:id': [['UTCID01', 'should delete session']],
  },
  'attendance/attendance.service.test.js': {
    mark: [
      ['UTCID01', 'should allow user to mark their own attendance'],
      ['UTCID02', 'should allow creator to mark attendance for others'],
      ['UTCID04', 'should throw forbidden if marking for others and not creator'],
      ['UTCID03', 'should throw not found if session missing'],
    ],
    recordJoin: [
      ['UTCID01', 'should mark present if session in progress and user is member'],
      ['UTCID03', 'should throw if session not in progress'],
      ['UTCID04', 'should throw if user not member'],
    ],
    listBySession: [['UTCID01', 'should return attendance records']],
    getUserRate: [['UTCID01', 'should return user stats']],
  },
  'attendance/attendance.controller.test.js': {
    'POST /attendance/:sessionId': [['UTCID01', 'should mark attendance']],
    'POST /attendance/:sessionId/join': [['UTCID01', 'should record join']],
    'GET /attendance/:sessionId': [['UTCID01', 'should list attendance']],
  },
  'resource-folders/resource-folders.service.test.js': {
    list: [
      ['UTCID01', 'should return paginated list of folders for myGroups'],
      ['UTCID01', 'should return list by groupId if member'],
      ['UTCID04', 'should throw forbidden if not group member'],
      ['UTCID03', 'should throw bad request if missing params'],
    ],
    getById: [
      ['UTCID01', 'should return folder if member'],
      ['UTCID03', 'should throw not found'],
      ['UTCID04', 'should throw forbidden if not member'],
    ],
    create: [
      ['UTCID01', 'should create folder if member'],
      ['UTCID04', 'should throw forbidden if not member'],
    ],
    update: [
      ['UTCID01', 'should update folder if leader'],
      ['UTCID04', 'should throw forbidden if not leader or group creator'],
    ],
  },
  'resources/resources.service.test.js': {
    list: [
      ['UTCID01', 'should list resources in group if member'],
      ['UTCID01', 'should list resources in folder if member'],
      ['UTCID03', 'should throw if folder not found'],
      ['UTCID04', 'should throw if not group member'],
    ],
    getById: [
      ['UTCID01', 'should return resource if member'],
      ['UTCID03', 'should throw if resource not found'],
    ],
    create: [
      ['UTCID01', 'should create resource'],
      ['UTCID03', 'should throw if folder belongs to different group'],
    ],
    remove: [
      ['UTCID01', 'should remove if uploader'],
      ['UTCID02', 'should remove and notify if leader'],
      ['UTCID04', 'should throw if not uploader and not leader'],
    ],
    toggleStar: [
      ['UTCID01', 'should add star if not starred'],
      ['UTCID02', 'should remove star if already starred'],
    ],
  },
  'posts/posts.service.test.js': {
    list: [
      ['UTCID01', 'should list posts ordered by createdAt'],
      ['UTCID02', 'should list posts ordered by votes'],
    ],
    getById: [
      ['UTCID01', 'should return post'],
      ['UTCID03', 'should throw if not found'],
    ],
    create: [
      ['UTCID01', 'should create post if member'],
      ['UTCID04', 'should throw if not member'],
    ],
    update: [
      ['UTCID01', 'should update post if author and member'],
      ['UTCID04', 'should throw if not author'],
      ['UTCID03', 'should throw if nothing to update'],
    ],
    vote: [
      ['UTCID01', 'should add upvote if no vote exists'],
      ['UTCID02', 'should remove vote if clicking same vote again'],
    ],
    remove: [['UTCID01', 'should remove if author']],
  },
  'comments/comments.service.test.js': {
    listByPost: [
      ['UTCID01', 'should return comments tree'],
      ['UTCID03', 'should throw if post not found'],
      ['UTCID04', 'should throw if not group member'],
    ],
    create: [
      ['UTCID01', 'should create comment and notify mentions'],
      ['UTCID03', 'should throw if replying to invalid parent'],
    ],
    update: [
      ['UTCID01', 'should update comment if author'],
      ['UTCID04', 'should throw if not author'],
    ],
    vote: [
      ['UTCID01', 'should add vote if new'],
      ['UTCID02', 'should remove vote if same'],
    ],
    remove: [['UTCID01', 'should remove if author']],
  },
  'notifications/notifications.service.test.js': {
    list: [['UTCID01', 'should list notifications']],
    getUnreadCount: [['UTCID01', 'should return count']],
    markRead: [['UTCID01', 'should mark read']],
    markAllRead: [['UTCID01', 'should mark all read']],
    notifyUsers: [
      ['UTCID01', 'should create notifications for users'],
      ['UTCID03', 'should do nothing if no users'],
    ],
  },
  'dashboard/dashboard.service.test.js': {
    getStats: [
      ['UTCID01', 'should return student stats for member'],
      ['UTCID02', 'should return leader stats for leader'],
      ['UTCID03', 'should return admin stats for admin'],
    ],
    getGroupStats: [
      ['UTCID04', 'should throw if not admin'],
      ['UTCID01', 'should return group stats if admin'],
      ['UTCID03', 'should throw if group not found'],
    ],
  },
  'reports/reports.service.test.js': {
    list: [['UTCID01', 'should list reports']],
    create: [['UTCID01', 'should create report']],
    updateStatus: [
      ['UTCID01', 'should update status'],
      ['UTCID03', 'should throw if report not found'],
    ],
  },
  'reports/reports.controller.test.js': {
    'GET /reports': [
      ['UTCID01', 'should list reports for admin'],
      ['UTCID04', 'should forbid non-admin'],
    ],
    'POST /reports': [['UTCID01', 'should create report']],
    'PATCH /reports/:id': [
      ['UTCID01', 'should update status if admin'],
      ['UTCID04', 'should forbid non-admin'],
    ],
  },
  'dashboard/dashboard.controller.test.js': {
    'GET /dashboard/stats': [['UTCID01', 'should get stats']],
    'GET /dashboard/groups/:groupId/stats': [
      ['UTCID04', 'should return 403 if not admin'],
      ['UTCID01', 'should get group stats if admin'],
    ],
  },
  'notifications/notifications.controller.test.js': {
    'GET /notifications': [['UTCID01', 'should list notifications']],
    'GET /notifications/unread-count': [['UTCID01', 'should return unread count']],
    'PATCH /notifications/:id/read': [['UTCID01', 'should mark as read']],
    'PATCH /notifications/read-all': [['UTCID01', 'should mark all as read']],
  },
  'comments/comments.controller.test.js': {
    'GET /comments/post/:postId': [['UTCID01', 'should list comments']],
    'POST /comments': [['UTCID01', 'should create comment']],
    'PATCH /comments/:id': [['UTCID01', 'should update comment']],
    'POST /comments/:id/vote': [['UTCID01', 'should vote on comment']],
    'DELETE /comments/:id': [['UTCID01', 'should delete comment']],
  },
  'posts/posts.controller.test.js': {
    'GET /posts': [['UTCID01', 'should list posts']],
    'GET /posts/:id': [['UTCID01', 'should get post']],
    'POST /posts': [['UTCID01', 'should create post']],
    'PATCH /posts/:id': [['UTCID01', 'should update post']],
    'POST /posts/:id/vote': [['UTCID01', 'should vote on post']],
    'DELETE /posts/:id': [['UTCID01', 'should delete post']],
  },
  'resources/resources.controller.test.js': {
    'GET /resources': [['UTCID01', 'should list resources']],
    'GET /resources/:id': [['UTCID01', 'should get resource']],
    'POST /resources': [['UTCID01', 'should create resource']],
    'POST /resources/:id/star': [['UTCID01', 'should toggle star']],
    'DELETE /resources/:id': [['UTCID01', 'should delete resource']],
  },
  'resource-folders/resource-folders.controller.test.js': {
    'GET /resource-folders': [['UTCID01', 'should list folders']],
    'GET /resource-folders/:id': [['UTCID01', 'should get folder']],
    'POST /resource-folders': [['UTCID01', 'should create folder']],
    'PATCH /resource-folders/:id': [['UTCID01', 'should update folder']],
  },
  'upload/upload.controller.test.js': {
    'GET /upload/cloudinary-signature': [
      ['UTCID02', 'should throw if cloudinary not configured'],
      ['UTCID01', 'should return signature if configured'],
    ],
  },
};

function walk(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) walk(p, files);
    else if (entry.endsWith('.test.js')) files.push(p);
  }
  return files;
}

function annotateFile(filePath) {
  const rel = filePath.replace(/\\/g, '/');
  const mapKey = Object.keys(UTCID_MAP).find((k) => rel.includes(k));
  if (!mapKey) return false;

  let content = readFileSync(filePath, 'utf8');
  let changed = false;
  const mapping = UTCID_MAP[mapKey];

  for (const [describe, tests] of Object.entries(mapping)) {
    for (const [utcId, testSubstr] of tests) {
      const escaped = testSubstr.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const pattern = new RegExp(`(it\\(')(?!${utcId} - )([^']*${escaped}[^']*)('\\s*,)`, 'g');
      const newContent = content.replace(pattern, `$1${utcId} - $2$3`);
      if (newContent !== content) {
        content = newContent;
        changed = true;
      }
    }
    const escapedDesc = describe.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const headerPattern = new RegExp(
      `(describe\\('${escapedDesc}'[^)]*\\)[^{]*\\{)(\\s*)(?!\\s*\\/\\* UTCIDs)`,
    );
    const utcList = [...new Set(tests.map(([id]) => id))].join(', ');
    const headerContent = content.replace(headerPattern, `$1$2/* UTCIDs: ${utcList} */\n$2`);
    if (headerContent !== content) {
      content = headerContent;
      changed = true;
    }
  }

  if (changed) {
    writeFileSync(filePath, content, 'utf8');
    console.log('Updated:', rel);
  }
  return changed;
}

const dirs = [
  join(ROOT, 'backend', 'automation-tests', 'jest', 'modules'),
  join(ROOT, 'backend', 'automation-tests', 'jest', 'e2e'),
  join(ROOT, 'backend', 'automation-tests', 'vitest', 'modules'),
  join(ROOT, 'backend', 'automation-tests', 'vitest', 'utils'),
  join(ROOT, 'backend', 'automation-tests', 'vitest', 'middlewares'),
];

let count = 0;
for (const dir of dirs) {
  try {
    for (const f of walk(dir)) {
      if (annotateFile(f)) count++;
    }
  } catch {
    // dir may not exist
  }
}
console.log(`Annotated ${count} test file(s)`);
