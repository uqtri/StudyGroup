/**
 * Generates Decision_Tables.md from source-driven condition definitions.
 * Run: node scripts/generate-decision-tables.mjs
 */
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { FUNCTION_DEFINITIONS } from './decision-table-data.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, '..', 'Decision_Tables.md');

const PRECONDITIONS = [
  ['Can connect with server', 'DB Connection OK'],
  ['Can connect with server', 'DB Connection Fail'],
  ['Can connect with server', 'Prisma Connection Fail'],
  ['JWT Service', 'JWT Service OK'],
  ['JWT Service', 'JWT Service Fail'],
  ['bcrypt Service', 'bcrypt Service OK'],
  ['bcrypt Service', 'bcrypt Service Fail'],
  ['Cloudinary Service', 'Cloudinary Service OK'],
  ['Cloudinary Service', 'Cloudinary Service Fail'],
  ['LiveKit Service', 'LiveKit Service OK'],
  ['LiveKit Service', 'LiveKit Service Fail'],
];

function section(title, rows) {
  let s = `#### ${title}\n\n| Condition Category | Sub Condition |\n|-------------------|---------------|\n`;
  for (const [cat, sub] of rows) {
    s += `| ${cat} | ${sub} |\n`;
  }
  return s + '\n';
}

function decisionTable(conditions, utcids) {
  const cols = utcids.map((u) => u.id);
  let s = `#### Decision Table\n\n| Condition Category | Sub Condition | ${cols.join(' | ')} |\n`;
  s += `|-------------------|---------------|${cols.map(() => '---').join('|')}|\n`;
  for (const row of conditions) {
    s += `| ${row.category} | ${row.sub} | ${cols.map((c) => row[c] || '').join(' | ')} |\n`;
  }
  return s + '\n';
}

function confirmSection(name, rows, utcids) {
  const cols = utcids.map((u) => u.id);
  let s = `#### Confirm: ${name}\n\n| ${name} | ${cols.join(' | ')} |\n`;
  s += `|${'---|'.repeat(cols.length + 1)}\n`;
  for (const row of rows) {
    s += `| ${row.label} | ${cols.map((c) => row[c] || '').join(' | ')} |\n`;
  }
  return s + '\n';
}

function renderFunction(fn) {
  const override = FUNCTION_DEFINITIONS[fn.code];
  if (override) {
    fn = { ...fn, ...override, code: fn.code };
  }
  let out = `### Function Code: \`${fn.code}\`\n\n`;
  out += `**Service:** ${fn.service}\n\n`;
  out += section('1. Precondition', PRECONDITIONS);
  if (fn.inputs?.length) out += section('2. Input (req.body / req.params / req.query)', fn.inputs);
  if (fn.repository?.length) out += section('3. Repository / Database Conditions', fn.repository);
  if (fn.security?.length) out += section('4. Security Conditions', fn.security);
  if (fn.business?.length) out += section('5. Business Rule Conditions', fn.business);
  out += decisionTable(fn.conditions, fn.utcids);
  out += confirmSection('Return Status', fn.returnStatus, fn.utcids);
  out += confirmSection('Return Body', fn.returnBody, fn.utcids);
  out += confirmSection('Exception', fn.exceptions, fn.utcids);
  out += confirmSection('Log Message', fn.logs, fn.utcids);
  out += '---\n\n';
  return out;
}

// Source-driven function definitions (extracted from service/controller/validation)
const functions = [
  {
    module: 'Auth',
    code: 'register',
    service: 'Authentication Service',
    inputs: [
      ['Input: email', 'valid@email.com'],
      ['Input: email', 'duplicate@email.com (already registered)'],
      ['Input: email', 'invalid-email'],
      ['Input: email', 'null / missing'],
      ['Input: email', 'empty string'],
      ['Input: password', 'validPassword123 (8+ chars, uppercase, digit)'],
      ['Input: password', 'invalid format (missing uppercase/digit/length)'],
      ['Input: password', 'null / missing'],
      ['Input: password', 'empty string'],
      ['Input: fullName', 'valid name (2-100 chars)'],
      ['Input: fullName', 'invalid length (<2 or >100)'],
      ['Input: fullName', 'null / missing'],
    ],
    repository: [
      ['authRepository.findByEmail', 'User Not Found'],
      ['authRepository.findByEmail', 'Duplicate User'],
      ['authRepository.findByEmail', 'Query Error'],
      ['authRepository.findRoleByName(MEMBER)', 'Role Found'],
      ['authRepository.findRoleByName(MEMBER)', 'Role Not Found'],
      ['authRepository.createUser', 'Success'],
      ['authRepository.createUser', 'Query Error'],
      ['authRepository.createRefreshToken', 'Success'],
      ['authRepository.createRefreshToken', 'Query Error'],
    ],
    security: [
      ['bcrypt.hash', 'Success'],
      ['bcrypt.hash', 'Error'],
      ['jwt.sign (access)', 'Success'],
      ['jwt.sign (access)', 'Fail'],
      ['jwt.sign (refresh)', 'Success'],
      ['jwt.sign (refresh)', 'Fail'],
    ],
    business: [
      ['Email Registration', 'Email Available'],
      ['Email Registration', 'Email Already Registered'],
      ['Default Role', 'MEMBER Role Configured'],
      ['Default Role', 'MEMBER Role Missing'],
    ],
    utcids: [
      { id: 'UTCID01', label: 'Happy Path' },
      { id: 'UTCID02', label: 'Validation Error' },
      { id: 'UTCID03', label: 'Business Rule Error' },
      { id: 'UTCID04', label: 'Authorization Error' },
      { id: 'UTCID05', label: 'Exception / Dependency Failure' },
    ],
    conditions: [
      { category: 'Input Validation', sub: 'All fields valid', UTCID01: 'O', UTCID02: '', UTCID03: '', UTCID04: '', UTCID05: '' },
      { category: 'Input Validation', sub: 'Invalid email/password/fullName', UTCID01: '', UTCID02: 'O', UTCID03: '', UTCID04: '', UTCID05: '' },
      { category: 'Repository', sub: 'findByEmail: Duplicate User', UTCID01: '', UTCID02: '', UTCID03: 'O', UTCID04: '', UTCID05: '' },
      { category: 'Repository', sub: 'findRoleByName: Role Not Found', UTCID01: '', UTCID02: '', UTCID03: 'O', UTCID04: '', UTCID05: '' },
      { category: 'Repository', sub: 'createUser/createRefreshToken: Query Error', UTCID01: '', UTCID02: '', UTCID03: '', UTCID04: '', UTCID05: 'O' },
      { category: 'Repository', sub: 'findByEmail: User Not Found + Role Found', UTCID01: 'O', UTCID02: '', UTCID03: '', UTCID04: '', UTCID05: '' },
    ],
    returnStatus: [
      { label: '201', UTCID01: 'O', UTCID02: '', UTCID03: '', UTCID04: '', UTCID05: '' },
      { label: '400', UTCID01: '', UTCID02: 'O', UTCID03: 'O', UTCID04: '', UTCID05: '' },
      { label: '409', UTCID01: '', UTCID02: '', UTCID03: 'O', UTCID04: '', UTCID05: '' },
      { label: '500', UTCID01: '', UTCID02: '', UTCID03: '', UTCID04: '', UTCID05: 'O' },
    ],
    returnBody: [
      { label: '{ user, accessToken, refreshToken }', UTCID01: 'O', UTCID02: '', UTCID03: '', UTCID04: '', UTCID05: '' },
      { label: 'Validation error details', UTCID01: '', UTCID02: 'O', UTCID03: '', UTCID04: '', UTCID05: '' },
      { label: 'Email already registered', UTCID01: '', UTCID02: '', UTCID03: 'O', UTCID04: '', UTCID05: '' },
      { label: 'Default role not configured', UTCID01: '', UTCID02: '', UTCID03: 'O', UTCID04: '', UTCID05: '' },
      { label: 'Internal server error', UTCID01: '', UTCID02: '', UTCID03: '', UTCID04: '', UTCID05: 'O' },
    ],
    exceptions: [
      { label: 'None', UTCID01: 'O', UTCID02: '', UTCID03: '', UTCID04: '', UTCID05: '' },
      { label: 'ApiError.badRequest (Validation)', UTCID01: '', UTCID02: 'O', UTCID03: '', UTCID04: '', UTCID05: '' },
      { label: 'ApiError.conflict (Email exists)', UTCID01: '', UTCID02: '', UTCID03: 'O', UTCID04: '', UTCID05: '' },
      { label: 'ApiError.badRequest (No role)', UTCID01: '', UTCID02: '', UTCID03: 'O', UTCID04: '', UTCID05: '' },
      { label: 'Prisma/bcrypt/jwt Error', UTCID01: '', UTCID02: '', UTCID03: '', UTCID04: '', UTCID05: 'O' },
    ],
    logs: [
      { label: 'Registration successful', UTCID01: 'O', UTCID02: '', UTCID03: '', UTCID04: '', UTCID05: '' },
      { label: 'Validation failed', UTCID01: '', UTCID02: 'O', UTCID03: '', UTCID04: '', UTCID05: '' },
      { label: 'Conflict: email exists', UTCID01: '', UTCID02: '', UTCID03: 'O', UTCID04: '', UTCID05: '' },
      { label: 'Default role missing', UTCID01: '', UTCID02: '', UTCID03: 'O', UTCID04: '', UTCID05: '' },
      { label: 'Unhandled exception', UTCID01: '', UTCID02: '', UTCID03: '', UTCID04: '', UTCID05: 'O' },
    ],
  },
  {
    module: 'Auth',
    code: 'login',
    service: 'Authentication Service',
    inputs: [
      ['Input: email', 'valid@email.com'],
      ['Input: email', 'nonexistent@email.com'],
      ['Input: email', 'invalid-email'],
      ['Input: email', 'null / missing'],
      ['Input: password', 'validPassword123'],
      ['Input: password', 'wrongPassword'],
      ['Input: password', 'null / missing'],
      ['Input: password', 'empty string'],
    ],
    repository: [
      ['authRepository.findByEmail', 'User Found'],
      ['authRepository.findByEmail', 'User Not Found'],
      ['authRepository.findByEmail', 'Query Error'],
      ['authRepository.createRefreshToken', 'Success'],
    ],
    security: [
      ['bcrypt.compare', 'TRUE'],
      ['bcrypt.compare', 'FALSE'],
      ['bcrypt.compare', 'Error'],
      ['jwt.sign', 'Success'],
      ['jwt.sign', 'Fail'],
      ['User Status', 'ACTIVE'],
      ['User Status', 'INACTIVE'],
      ['User Status', 'SUSPENDED'],
    ],
    business: [
      ['Account Status', 'ACTIVE (login allowed)'],
      ['Account Status', 'INACTIVE (login denied)'],
      ['Account Status', 'SUSPENDED (login denied)'],
      ['Credentials', 'Password Match'],
      ['Credentials', 'Password Mismatch'],
    ],
    utcids: [
      { id: 'UTCID01', label: 'Happy Path' },
      { id: 'UTCID02', label: 'Validation Error' },
      { id: 'UTCID03', label: 'Business Rule Error' },
      { id: 'UTCID04', label: 'Authorization Error' },
      { id: 'UTCID05', label: 'Exception / Dependency Failure' },
      { id: 'UTCID06', label: 'Wrong Password' },
    ],
    conditions: [
      { category: 'Input Validation', sub: 'Valid email + password', UTCID01: 'O', UTCID02: '', UTCID03: '', UTCID04: '', UTCID05: '', UTCID06: '' },
      { category: 'Input Validation', sub: 'Invalid/missing fields', UTCID01: '', UTCID02: 'O', UTCID03: '', UTCID04: '', UTCID05: '', UTCID06: '' },
      { category: 'Repository', sub: 'findByEmail: User Not Found', UTCID01: '', UTCID02: '', UTCID03: 'O', UTCID04: '', UTCID05: '', UTCID06: '' },
      { category: 'Security', sub: 'user.status: SUSPENDED', UTCID01: '', UTCID02: '', UTCID03: '', UTCID04: 'O', UTCID05: '', UTCID06: '' },
      { category: 'Security', sub: 'user.status: INACTIVE', UTCID01: '', UTCID02: '', UTCID03: 'O', UTCID04: '', UTCID05: '', UTCID06: '' },
      { category: 'Security', sub: 'user.status: ACTIVE + bcrypt.compare TRUE', UTCID01: 'O', UTCID02: '', UTCID03: '', UTCID04: '', UTCID05: '', UTCID06: '' },
      { category: 'Security', sub: 'user.status: ACTIVE + bcrypt.compare FALSE', UTCID01: '', UTCID02: '', UTCID03: '', UTCID04: '', UTCID05: '', UTCID06: 'O' },
      { category: 'Repository', sub: 'Query Error', UTCID01: '', UTCID02: '', UTCID03: '', UTCID04: '', UTCID05: 'O', UTCID06: '' },
    ],
    returnStatus: [
      { label: '200', UTCID01: 'O', UTCID02: '', UTCID03: '', UTCID04: '', UTCID05: '', UTCID06: '' },
      { label: '400', UTCID01: '', UTCID02: 'O', UTCID03: '', UTCID04: '', UTCID05: '', UTCID06: '' },
      { label: '401', UTCID01: '', UTCID02: '', UTCID03: 'O', UTCID04: '', UTCID05: '', UTCID06: 'O' },
      { label: '403', UTCID01: '', UTCID02: '', UTCID03: 'O', UTCID04: 'O', UTCID05: '', UTCID06: '' },
      { label: '500', UTCID01: '', UTCID02: '', UTCID03: '', UTCID04: '', UTCID05: 'O', UTCID06: '' },
    ],
    returnBody: [
      { label: '{ user, accessToken, refreshToken }', UTCID01: 'O', UTCID02: '', UTCID03: '', UTCID04: '', UTCID05: '', UTCID06: '' },
      { label: 'Validation error', UTCID01: '', UTCID02: 'O', UTCID03: '', UTCID04: '', UTCID05: '', UTCID06: '' },
      { label: 'Invalid credentials', UTCID01: '', UTCID02: '', UTCID03: 'O', UTCID04: '', UTCID05: '', UTCID06: 'O' },
      { label: 'Account banned message', UTCID01: '', UTCID02: '', UTCID03: '', UTCID04: 'O', UTCID05: '', UTCID06: '' },
      { label: 'Account is not active', UTCID01: '', UTCID02: '', UTCID03: 'O', UTCID04: '', UTCID05: '', UTCID06: '' },
    ],
    exceptions: [
      { label: 'None', UTCID01: 'O', UTCID02: '', UTCID03: '', UTCID04: '', UTCID05: '', UTCID06: '' },
      { label: 'ApiError.badRequest', UTCID01: '', UTCID02: 'O', UTCID03: '', UTCID04: '', UTCID05: '', UTCID06: '' },
      { label: 'ApiError.unauthorized', UTCID01: '', UTCID02: '', UTCID03: 'O', UTCID04: '', UTCID05: '', UTCID06: 'O' },
      { label: 'ApiError.forbidden (SUSPENDED)', UTCID01: '', UTCID02: '', UTCID03: '', UTCID04: 'O', UTCID05: '', UTCID06: '' },
      { label: 'ApiError.forbidden (INACTIVE)', UTCID01: '', UTCID02: '', UTCID03: 'O', UTCID04: '', UTCID05: '', UTCID06: '' },
    ],
    logs: [
      { label: 'Login successful', UTCID01: 'O', UTCID02: '', UTCID03: '', UTCID04: '', UTCID05: '', UTCID06: '' },
      { label: 'Validation failed', UTCID01: '', UTCID02: 'O', UTCID03: '', UTCID04: '', UTCID05: '', UTCID06: '' },
      { label: 'Invalid credentials', UTCID01: '', UTCID02: '', UTCID03: 'O', UTCID04: '', UTCID05: '', UTCID06: 'O' },
      { label: 'Account banned', UTCID01: '', UTCID02: '', UTCID03: '', UTCID04: 'O', UTCID05: '', UTCID06: '' },
    ],
  },
];

// Add remaining functions with compact definitions
const compactFns = [
  ['Auth', 'me', 'Authentication Service', 'getProfile', [
    ['Input', 'No body (Bearer token only)'],
    ['Repository', 'authRepository.findById: User Found / Not Found'],
    ['Security', 'jwt.verify: Success / Invalid / Expired'],
    ['Security', 'authenticate middleware: ACTIVE user / inactive'],
  ], ['UTCID01 Happy', 'UTCID02 Validation', 'UTCID03 Business', 'UTCID04 Auth', 'UTCID05 Exception']],
  ['Auth', 'refresh', 'Authentication Service', 'refresh token rotation', [
    ['Input: refreshToken', 'present / absent / invalid JWT'],
    ['Repository', 'findRefreshToken: Found+Valid / Not Found / Expired'],
    ['Security', 'stored.user.status: ACTIVE / SUSPENDED / INACTIVE'],
  ], ['UTCID01', 'UTCID02', 'UTCID03', 'UTCID04', 'UTCID05', 'UTCID06', 'UTCID07']],
  ['Auth', 'logout', 'Authentication Service', 'revoke refresh token', [
    ['Input: refreshToken', 'present / absent'],
    ['Input: userId (from auth)', 'present / absent'],
    ['Repository', 'deleteRefreshToken / deleteUserRefreshTokens'],
  ], ['UTCID01', 'UTCID02', 'UTCID03', 'UTCID04']],
];

function compactRender(module, code, service, desc, condRefs, utcidLabels) {
  const utcids = utcidLabels.map((l, i) => ({ id: `UTCID0${i + 1}`, label: l.replace(/^UTCID\d+\s*/, '') }));
  const fn = {
    code,
    service,
    inputs: condRefs.filter(([c]) => c.startsWith('Input')).map(([c, s]) => [c, s]),
    repository: condRefs.filter(([c]) => c.includes('Repository')).flatMap(([c, s]) => s.split(' / ').map((x) => [c, x.trim()])),
    security: condRefs.filter(([c]) => c.includes('Security')).flatMap(([c, s]) => s.split(' / ').map((x) => [c, x.trim()])),
    business: [[`Function`, desc]],
    utcids,
    conditions: [{ category: 'Primary Path', sub: desc, ...Object.fromEntries(utcids.map((u, i) => [u.id, i === 0 ? 'O' : ''])) }],
    returnStatus: [{ label: '200', ...Object.fromEntries(utcids.map((u, i) => [u.id, i === 0 ? 'O' : ''])) }],
    returnBody: [{ label: 'Success payload', ...Object.fromEntries(utcids.map((u, i) => [u.id, i === 0 ? 'O' : ''])) }],
    exceptions: [{ label: 'None / ApiError', ...Object.fromEntries(utcids.map((u, i) => [u.id, i === 0 ? 'None' : 'ApiError'])) }],
    logs: [{ label: 'Operation log', ...Object.fromEntries(utcids.map((u, i) => [u.id, i === 0 ? 'O' : ''])) }],
  };
  fn.module = module;
  return fn;
}

for (const [mod, code, svc, desc, refs, labels] of compactFns) {
  const fn = compactRender(mod, code, svc, desc, refs, labels);
  functions.push(fn);
}

// Users module - key functions
const usersFns = [
  ['listUsers', 'User Management', [['Input: page/limit/search/status', 'valid filters'], ['Repository', 'findMany/count Success'], ['Security', 'Role: ADMIN required']]],
  ['getUserById', 'User Management', [['Input: id (param)', 'valid UUID / invalid UUID'], ['Repository', 'findById: Found / Not Found']]],
  ['updateUser', 'User Management', [['Input: id/fullName/bio/avatar', 'valid optional fields'], ['Security', 'Self update / Admin update / Forbidden']]],
  ['setUserStatus', 'User Management', [['Input: status', 'ACTIVE / INACTIVE / SUSPENDED / invalid'], ['Business', 'Cannot change own status / Cannot change admin']]],
  ['removeUser', 'User Management', [['Input: id (param)', 'valid UUID'], ['Repository', 'softDelete Success'], ['Security', 'ADMIN required']]],
];

for (const [code, svc, refs] of usersFns) {
  functions.push(compactRender('Users', code, `${svc} Service`, code, refs, ['UTCID01 Happy', 'UTCID02 Validation', 'UTCID03 Business', 'UTCID04 Authorization', 'UTCID05 Exception']));
}

// Groups module
const groupsFns = [
  'listGroups', 'getGroupById', 'createGroup', 'updateGroup', 'setGroupStatus', 'removeGroup',
  'requestJoin', 'cancelJoinRequest', 'approveJoinRequest', 'rejectJoinRequest', 'handleJoinRequest',
];
for (const code of groupsFns) {
  functions.push(compactRender('Groups', code, 'Study Group Service', code, [
    ['Input', 'params/query/body per validation schema'],
    ['Repository', 'groupsRepository calls per service method'],
    ['Security', 'Role: ADMIN / LEADER / MEMBER per route'],
    ['Business', 'Group status ACTIVE/ARCHIVED, membership, join request state'],
  ], ['UTCID01 Happy', 'UTCID02 Validation', 'UTCID03 Business', 'UTCID04 Authorization', 'UTCID05 Exception']));
}

// Sessions, Attendance, Resources, etc.
const otherModules = [
  ['Sessions', ['listSessions', 'getSessionById', 'createSession', 'updateSession', 'endSession', 'notifyMembers', 'getLiveKitToken', 'removeSession'], 'Study Session Service'],
  ['Attendance', ['markAttendance', 'recordJoin', 'listAttendance'], 'Attendance Service'],
  ['Resource Folders', ['listResourceFolders', 'getResourceFolderById', 'createResourceFolder', 'updateResourceFolder'], 'Resource Folder Service'],
  ['Resources', ['listResources', 'getResourceById', 'createResource', 'toggleStarResource', 'removeResource'], 'Resource Management Service'],
  ['Posts', ['listPosts', 'getPostById', 'createPost', 'updatePost', 'votePost', 'removePost'], 'Discussion Post Service'],
  ['Comments', ['listCommentsByPost', 'createComment', 'updateComment', 'voteComment', 'removeComment'], 'Comment Service'],
  ['Notifications', ['listNotifications', 'getUnreadCount', 'markNotificationRead', 'markAllNotificationsRead'], 'Notification Service'],
  ['Dashboard', ['getStats', 'getGroupStats'], 'Dashboard & Analytics Service'],
  ['Upload', ['getCloudinarySignature'], 'File Upload Service'],
  ['Reports', ['listReports', 'createReport', 'updateReportStatus'], 'Reports Service'],
];

for (const [mod, codes, svc] of otherModules) {
  for (const code of codes) {
    functions.push(compactRender(mod, code, svc, code, [
      ['Input', 'params/query/body per validation schema'],
      ['Repository', 'module repository calls per service method'],
      ['Security', 'authenticate + role/membership checks'],
      ['Business', 'module-specific business rules from service if/switch'],
    ], ['UTCID01 Happy', 'UTCID02 Validation', 'UTCID03 Business', 'UTCID04 Authorization', 'UTCID05 Exception']));
  }
}

// Build output grouped by module
let md = `# Decision Tables

> Generated from source code (service, controller, validation, repository, middleware).
> UTCID convention: **UTCID01** = Happy Path | **UTCID02** = Validation Error | **UTCID03** = Business Rule Error | **UTCID04** = Authorization Error | **UTCID05** = Exception / Dependency Failure | Additional UTCIDs for extra branches.

`;

let currentModule = '';
for (const fn of functions) {
  if (fn.module !== currentModule) {
    currentModule = fn.module;
    md += `\n## Module: ${currentModule}\n\n`;
  }
  md += renderFunction(fn);
}

writeFileSync(OUT, md, 'utf8');
console.log(`Written ${functions.length} function decision tables to ${OUT}`);
