/**
 * Maps catalog sub-conditions to UTCID columns per execution path.
 * Every reachable sub-condition row receives at least one "O" mark.
 */
import { AUTH_DEFINITIONS } from './decision-table-auth.mjs';
import { FUNCTION_DEFINITIONS } from './decision-table-data.mjs';

export const PRECONDITIONS = [
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

export const OK_PRECONDITIONS = [
  'Can connect with server: DB Connection OK',
  'JWT Service OK',
  'bcrypt Service OK',
  'Cloudinary Service OK',
  'LiveKit Service OK',
];

const GROUP = {
  PRE: 'Precondition',
  INPUT: 'Input (req.body)',
  REPO: 'Repository',
  SEC: 'Security',
  BIZ: 'Business Rule',
};

export function catalogSub(category, sub) {
  return sub.includes(category) || category === sub ? sub : `${category}: ${sub}`;
}

function rowKey(group, sub) {
  return `${group}|${sub}`;
}

class MappingContext {
  constructor(fn) {
    this.fn = fn;
    this.utcids = fn.utcids.map((u) => u.id);
    this.marks = new Map();
    this.catalog = this.buildCatalog();
  }

  buildCatalog() {
    const fn = this.fn;
    const rows = [];
    for (const [cat, sub] of PRECONDITIONS) {
      rows.push({ group: GROUP.PRE, category: cat, sub: catalogSub(cat, sub) });
    }
    for (const [cat, sub] of fn.inputs || []) {
      rows.push({ group: GROUP.INPUT, category: cat, sub: catalogSub(cat, sub) });
    }
    for (const [cat, sub] of fn.repository || []) {
      rows.push({ group: GROUP.REPO, category: cat, sub: catalogSub(cat, sub) });
    }
    for (const [cat, sub] of fn.security || []) {
      rows.push({ group: GROUP.SEC, category: cat, sub: catalogSub(cat, sub) });
    }
    for (const [cat, sub] of fn.business || []) {
      rows.push({ group: GROUP.BIZ, category: cat, sub: catalogSub(cat, sub) });
    }
    return rows;
  }

  idx(utcidId) {
    return this.utcids.indexOf(utcidId);
  }

  set(group, sub, utcidId, value = 'O') {
    const i = this.idx(utcidId);
    if (i < 0) return;
    const key = rowKey(group, sub);
    if (!this.marks.has(key)) this.marks.set(key, this.utcids.map(() => ''));
    this.marks.get(key)[i] = value;
  }

  markOkPreconditions(utcidId) {
    for (const sub of OK_PRECONDITIONS) this.set(GROUP.PRE, sub, utcidId);
  }

  markCatalog(group, category, sub, utcidId) {
    this.set(group, catalogSub(category, sub), utcidId);
  }

  markWhere(group, utcidId, predicate) {
    for (const row of this.catalog.filter((r) => r.group === group && predicate(r))) {
      this.set(row.group, row.sub, utcidId);
    }
  }

  markInputs(utcidId, predicate) {
    this.markWhere(GROUP.INPUT, utcidId, predicate);
  }

  markRepo(utcidId, predicate) {
    this.markWhere(GROUP.REPO, utcidId, predicate);
  }

  markSec(utcidId, predicate) {
    this.markWhere(GROUP.SEC, utcidId, predicate);
  }

  markBiz(utcidId, predicate) {
    this.markWhere(GROUP.BIZ, utcidId, predicate);
  }

  markFirstInputMatching(utcidId, predicate) {
    const row = this.catalog.find((r) => r.group === GROUP.INPUT && predicate(r));
    if (row) this.set(row.group, row.sub, utcidId);
  }

  markFirstRepoMatching(utcidId, predicate) {
    const row = this.catalog.find((r) => r.group === GROUP.REPO && predicate(r));
    if (row) this.set(row.group, row.sub, utcidId);
  }

  getMarks(group, sub) {
    return this.marks.get(rowKey(group, sub)) || this.utcids.map(() => '');
  }
}

/** Function-specific path resolvers keyed by `${code}|${category}|${sub}` or code-level handlers */
const EXPLICIT_HANDLERS = {
  register: {
    'Input Validation|All fields valid'(ctx, id) {
      ctx.markOkPreconditions(id);
      ctx.markCatalog(GROUP.INPUT, 'Input: email', 'valid@email.com', id);
      ctx.markCatalog(GROUP.INPUT, 'Input: password', 'validPassword123 (8+ chars, uppercase, digit)', id);
      ctx.markCatalog(GROUP.INPUT, 'Input: fullName', 'valid name (2-100 chars)', id);
      ctx.markRepo(id, (r) => r.sub.includes('findByEmail') && r.sub.includes('User Not Found'));
      ctx.markRepo(id, (r) => r.sub.includes('findRoleByName') && r.sub.includes('Role Found'));
      ctx.markRepo(id, (r) => r.sub.includes('createUser') && r.sub.includes('Success'));
      ctx.markRepo(id, (r) => r.sub.includes('createRefreshToken') && r.sub.includes('Success'));
      ctx.markSec(id, (r) => r.sub === 'bcrypt.hash: Success');
      ctx.markSec(id, (r) => r.sub.includes('jwt.sign (access)') && r.sub.includes('Success'));
      ctx.markSec(id, (r) => r.sub.includes('jwt.sign (refresh)') && r.sub.includes('Success'));
      ctx.markBiz(id, (r) => r.sub.includes('Email Available'));
      ctx.markBiz(id, (r) => r.sub.includes('MEMBER Role Configured'));
    },
    'Input Validation|Invalid email/password/fullName'(ctx, id) {
      ctx.markOkPreconditions(id);
      ctx.markCatalog(GROUP.INPUT, 'Input: email', 'invalid-email', id);
      ctx.markCatalog(GROUP.INPUT, 'Input: password', 'invalid format (missing uppercase/digit/length)', id);
      ctx.markCatalog(GROUP.INPUT, 'Input: fullName', 'invalid length (<2 or >100)', id);
    },
    'Repository|findByEmail: Duplicate User'(ctx, id) {
      ctx.markOkPreconditions(id);
      ctx.markCatalog(GROUP.INPUT, 'Input: email', 'duplicate@email.com (already registered)', id);
      ctx.markCatalog(GROUP.INPUT, 'Input: password', 'validPassword123 (8+ chars, uppercase, digit)', id);
      ctx.markCatalog(GROUP.INPUT, 'Input: fullName', 'valid name (2-100 chars)', id);
      ctx.markRepo(id, (r) => r.sub.includes('findByEmail') && r.sub.includes('Duplicate User'));
      ctx.markBiz(id, (r) => r.sub.includes('Email Already Registered'));
    },
    'Repository|findRoleByName: Role Not Found'(ctx, id) {
      ctx.markOkPreconditions(id);
      ctx.markCatalog(GROUP.INPUT, 'Input: email', 'valid@email.com', id);
      ctx.markCatalog(GROUP.INPUT, 'Input: password', 'validPassword123 (8+ chars, uppercase, digit)', id);
      ctx.markCatalog(GROUP.INPUT, 'Input: fullName', 'valid name (2-100 chars)', id);
      ctx.markRepo(id, (r) => r.sub.includes('findByEmail') && r.sub.includes('User Not Found'));
      ctx.markRepo(id, (r) => r.sub.includes('findRoleByName') && r.sub.includes('Role Not Found'));
      ctx.markBiz(id, (r) => r.sub.includes('MEMBER Role Missing'));
    },
    'Repository|createUser/createRefreshToken: Query Error'(ctx, id) {
      ctx.markOkPreconditions(id);
      ctx.markCatalog(GROUP.INPUT, 'Input: email', 'valid@email.com', id);
      ctx.markCatalog(GROUP.INPUT, 'Input: password', 'validPassword123 (8+ chars, uppercase, digit)', id);
      ctx.markCatalog(GROUP.INPUT, 'Input: fullName', 'valid name (2-100 chars)', id);
      ctx.markRepo(id, (r) => r.sub.includes('findByEmail') && r.sub.includes('User Not Found'));
      ctx.markRepo(id, (r) => r.sub.includes('findRoleByName') && r.sub.includes('Role Found'));
      ctx.markRepo(id, (r) => r.sub.includes('createUser') && r.sub.includes('Query Error'));
      ctx.markBiz(id, (r) => r.sub.includes('Email Available'));
      ctx.markBiz(id, (r) => r.sub.includes('MEMBER Role Configured'));
    },
    'Repository|findByEmail: User Not Found + Role Found'(ctx, id) {
      EXPLICIT_HANDLERS.register['Input Validation|All fields valid'](ctx, id);
    },
  },

  login: {
    'Input Validation|Valid email + password'(ctx, id) {
      ctx.markOkPreconditions(id);
      ctx.markCatalog(GROUP.INPUT, 'Input: email', 'valid@email.com', id);
      ctx.markCatalog(GROUP.INPUT, 'Input: password', 'validPassword123', id);
    },
    'Input Validation|Invalid/missing fields'(ctx, id) {
      ctx.markOkPreconditions(id);
      ctx.markCatalog(GROUP.INPUT, 'Input: email', 'invalid-email', id);
      ctx.markCatalog(GROUP.INPUT, 'Input: password', 'null / missing', id);
    },
    'Repository|findByEmail: User Not Found'(ctx, id) {
      ctx.markOkPreconditions(id);
      ctx.markCatalog(GROUP.INPUT, 'Input: email', 'nonexistent@email.com', id);
      ctx.markCatalog(GROUP.INPUT, 'Input: password', 'validPassword123', id);
      ctx.markRepo(id, (r) => r.sub.includes('findByEmail') && r.sub.includes('User Not Found'));
    },
    'Security|user.status: SUSPENDED'(ctx, id) {
      ctx.markOkPreconditions(id);
      ctx.markCatalog(GROUP.INPUT, 'Input: email', 'valid@email.com', id);
      ctx.markCatalog(GROUP.INPUT, 'Input: password', 'validPassword123', id);
      ctx.markRepo(id, (r) => r.sub.includes('findByEmail') && r.sub.includes('User Found'));
      ctx.markSec(id, (r) => r.sub === 'User Status: SUSPENDED');
      ctx.markBiz(id, (r) => r.sub.includes('SUSPENDED (login denied)'));
    },
    'Security|user.status: INACTIVE'(ctx, id) {
      ctx.markOkPreconditions(id);
      ctx.markCatalog(GROUP.INPUT, 'Input: email', 'valid@email.com', id);
      ctx.markCatalog(GROUP.INPUT, 'Input: password', 'validPassword123', id);
      ctx.markRepo(id, (r) => r.sub.includes('findByEmail') && r.sub.includes('User Found'));
      ctx.markSec(id, (r) => r.sub === 'User Status: INACTIVE');
      ctx.markBiz(id, (r) => r.sub.includes('INACTIVE (login denied)'));
    },
    'Security|user.status: ACTIVE + bcrypt.compare TRUE'(ctx, id) {
      ctx.markOkPreconditions(id);
      ctx.markCatalog(GROUP.INPUT, 'Input: email', 'valid@email.com', id);
      ctx.markCatalog(GROUP.INPUT, 'Input: password', 'validPassword123', id);
      ctx.markRepo(id, (r) => r.sub.includes('findByEmail') && r.sub.includes('User Found'));
      ctx.markRepo(id, (r) => r.sub.includes('createRefreshToken') && r.sub.includes('Success'));
      ctx.markSec(id, (r) => r.sub === 'User Status: ACTIVE');
      ctx.markSec(id, (r) => r.sub === 'bcrypt.compare: TRUE');
      ctx.markSec(id, (r) => r.sub.includes('jwt.sign') && r.sub.includes('Success'));
      ctx.markBiz(id, (r) => r.sub.includes('ACTIVE (login allowed)'));
      ctx.markBiz(id, (r) => r.sub.includes('Password Match'));
    },
    'Security|user.status: ACTIVE + bcrypt.compare FALSE'(ctx, id) {
      ctx.markOkPreconditions(id);
      ctx.markCatalog(GROUP.INPUT, 'Input: email', 'valid@email.com', id);
      ctx.markCatalog(GROUP.INPUT, 'Input: password', 'wrongPassword', id);
      ctx.markRepo(id, (r) => r.sub.includes('findByEmail') && r.sub.includes('User Found'));
      ctx.markSec(id, (r) => r.sub === 'User Status: ACTIVE');
      ctx.markSec(id, (r) => r.sub === 'bcrypt.compare: FALSE');
      ctx.markBiz(id, (r) => r.sub.includes('Password Mismatch'));
    },
    'Repository|Query Error'(ctx, id) {
      ctx.markOkPreconditions(id);
      ctx.markCatalog(GROUP.INPUT, 'Input: email', 'valid@email.com', id);
      ctx.markCatalog(GROUP.INPUT, 'Input: password', 'validPassword123', id);
      ctx.markRepo(id, (r) => r.sub.includes('findByEmail') && r.sub.includes('Query Error'));
    },
  },

  logout: {
    'Security|authenticate PASS + refreshToken present'(ctx, id) {
      ctx.markOkPreconditions(id);
      ctx.markCatalog(GROUP.INPUT, 'Input: refreshToken (body/cookie)', 'present', id);
      ctx.markCatalog(GROUP.INPUT, 'Input: req.user.id', 'present (from authenticate)', id);
      ctx.markSec(id, (r) => r.sub.includes('authenticate middleware') && r.sub.includes('PASS'));
      ctx.markRepo(id, (r) => r.sub.includes('deleteRefreshToken') && r.sub.includes('Called when'));
      ctx.markBiz(id, (r) => r.sub.includes('if (refreshToken)'));
    },
    'Security|authenticate PASS + no token + userId'(ctx, id) {
      ctx.markOkPreconditions(id);
      ctx.markCatalog(GROUP.INPUT, 'Input: refreshToken (body/cookie)', 'absent', id);
      ctx.markCatalog(GROUP.INPUT, 'Input: req.user.id', 'present (from authenticate)', id);
      ctx.markSec(id, (r) => r.sub.includes('authenticate middleware') && r.sub.includes('PASS'));
      ctx.markRepo(id, (r) => r.sub.includes('deleteUserRefreshTokens') && r.sub.includes('Called when'));
      ctx.markBiz(id, (r) => r.sub.includes('else if (userId)'));
    },
    'Security|authenticate PASS + neither token nor userId'(ctx, id) {
      ctx.markOkPreconditions(id);
      ctx.markCatalog(GROUP.INPUT, 'Input: refreshToken (body/cookie)', 'absent', id);
      ctx.markCatalog(GROUP.INPUT, 'Input: req.user.id', 'absent', id);
      ctx.markSec(id, (r) => r.sub.includes('authenticate middleware') && r.sub.includes('PASS'));
      ctx.markBiz(id, (r) => r.sub.includes('Always returns true'));
    },
    'Security|authenticate FAIL'(ctx, id) {
      ctx.markOkPreconditions(id);
      ctx.markSec(id, (r) => r.sub.includes('authenticate middleware') && r.sub.includes('FAIL'));
    },
  },
};

/** Generic pattern resolver for functions without explicit handlers */
function resolveGeneric(ctx, category, sub, utcidId) {
  const s = sub.toLowerCase();
  const c = category.toLowerCase();

  if (/^valid |all fields valid|valid query|valid uuid|valid id|valid payload|valid name|valid email|valid fields|valid session|valid request|valid group|present valid|valid query params/.test(s)) {
    ctx.markOkPreconditions(utcidId);
    ctx.markInputs(utcidId, (r) => /valid|present|true|non-empty|optional string|>= 1|1-100|3-100/.test(r.sub.toLowerCase()) && !/invalid|absent|null|missing|empty|wrong|non existing|fail/.test(r.sub.toLowerCase()));
    ctx.markRepo(utcidId, (r) => /success|found|>= now/.test(r.sub.toLowerCase()) && !/not found|error|fail|null|expired|< now/.test(r.sub.toLowerCase()));
    ctx.markSec(utcidId, (r) => /pass|success|active|optional|admin|leader|member|present|true/.test(r.sub.toLowerCase()) && !/fail|forbidden|inactive|suspended|absent|invalid|expired|error|not /.test(r.sub.toLowerCase()));
    ctx.markBiz(utcidId, (r) => !/denied|full|not accepting|already processed|already ended|mismatch|missing|!==|not pending|not found/.test(r.sub.toLowerCase()));
    return;
  }

  if (/invalid|missing fields|not string when|absent \/ null|wrong|invalid uuid|invalid page|invalid name|invalid id|invalid field|invalid status|invalid email/.test(s)) {
    ctx.markOkPreconditions(utcidId);
    ctx.markInputs(utcidId, (r) => /invalid|null \/ missing|empty|wrong|absent|fail|not string/.test(r.sub.toLowerCase()));
    return;
  }

  if (/query error|notify.*error|softdelete error|update.*error|delete.*error|create.*error|addmember error|findmany.*error|expired|stored null/.test(s)) {
    ctx.markOkPreconditions(utcidId);
    ctx.markInputs(utcidId, (r) => /valid|existing|present/.test(r.sub.toLowerCase()) && !/invalid|wrong|absent/.test(r.sub.toLowerCase()));
    ctx.markRepo(utcidId, (r) => /query error|error|expired|< now|not found/.test(r.sub.toLowerCase()));
    if (/livekit|deleteLiveKitRoom/.test(s)) {
      ctx.markBiz(utcidId, (r) => /fail|error/.test(r.sub.toLowerCase()));
    }
    return;
  }

  if (/not found|no longer pending|request not pending|folder not found|resource not found|session not found|group not found|user not found|stored null/.test(s)) {
    ctx.markOkPreconditions(utcidId);
    ctx.markInputs(utcidId, (r) => /valid uuid|existing|non existing|nonexistent/.test(r.sub.toLowerCase()));
    ctx.markRepo(utcidId, (r) => /not found|expired|null/.test(r.sub.toLowerCase()));
    return;
  }

  if (/authenticate.*fail|not authenticated|not admin|forbidden|not leader|not member|not creator|!isadmin|!membership|invalid\/expired jwt|no bearer|verify.*throws|middleware.*inactive|role !==/.test(s)) {
    ctx.markOkPreconditions(utcidId);
    ctx.markSec(utcidId, (r) => /fail|forbidden|absent|invalid|expired|inactive|suspended|unauthorized|not |!==/.test(r.sub.toLowerCase()));
    ctx.markInputs(utcidId, (r) => /valid|existing|present/.test(r.sub.toLowerCase()) && !/invalid uuid/.test(r.sub.toLowerCase()));
    return;
  }

  if (/duplicate|already member|already registered|pending exists|pending request|conflict|group full|not accepting|already processed|status !==|!== active|archived \+ non|wrong password|compare false|password mismatch/.test(s)) {
    ctx.markOkPreconditions(utcidId);
    ctx.markInputs(utcidId, (r) => /duplicate|existing|valid/.test(r.sub.toLowerCase()));
    ctx.markRepo(utcidId, (r) => /duplicate|already member|pending|found/.test(r.sub.toLowerCase()));
    ctx.markBiz(utcidId, (r) => /already|pending|full|not accepting|denied|mismatch|archived|!==|processed/.test(r.sub.toLowerCase()));
    ctx.markSec(utcidId, (r) => /false|inactive|suspended/.test(r.sub.toLowerCase()));
    return;
  }

  if (/inactive|suspended|banned|not active/.test(s) && c.includes('security')) {
    ctx.markOkPreconditions(utcidId);
    ctx.markInputs(utcidId, (r) => /valid|present/.test(r.sub.toLowerCase()));
    ctx.markRepo(utcidId, (r) => /found|success/.test(r.sub.toLowerCase()));
    ctx.markSec(utcidId, (r) => /inactive|suspended/.test(r.sub.toLowerCase()));
    ctx.markBiz(utcidId, (r) => /denied|not active|banned/.test(r.sub.toLowerCase()));
    return;
  }

  if (/token valid|active user|findbyid found|refreshToken present|authenticate pass|admin authenticated|self update|creator|uploader|leader|approve|reject|scheduled|in_progress|end live|cancel scheduled|rejected without|non-admin default|filter|mygroups|search →|createdby|auto-add|rotation|sha-256|delete old token|profile|getprofile|cloudinary|signature|mark.*read|unread|vote|star|attendance|record join|report|dashboard|stats|group stats/.test(s)) {
    ctx.markOkPreconditions(utcidId);
    ctx.markInputs(utcidId, (r) => /valid|present|existing|optional|true|approved|rejected|scheduled|active/.test(r.sub.toLowerCase()) && !/invalid|wrong|absent|fail|non existing/.test(r.sub.toLowerCase()));
    ctx.markRepo(utcidId, (r) => /success|found|>= now/.test(r.sub.toLowerCase()) && !/error|not found|expired/.test(r.sub.toLowerCase()));
    ctx.markSec(utcidId, (r) => /pass|success|active|admin|leader|member|present|optional|creator/.test(r.sub.toLowerCase()) && !/fail|forbidden|absent/.test(r.sub.toLowerCase()));
    ctx.markBiz(utcidId, (r) => {
      const t = r.sub.toLowerCase();
      if (/denied|full|not accepting|already ended|mismatch|missing|!== pending|not found|fail/.test(t)) return false;
      return /filter|active|approve|reject|scheduled|completed|cancelled|rotation|profile|creation|visibility|join|attendance|report|stats|signature|read|vote|star|folder|member|leader|admin|createdby|search|mygroups|status|end live|in_progress|sha-256|token|cloudinary|dashboard|notification|comment|post|resource|session|group|user|upload|mark|record|get|list|toggle|remove|update|create|notify|handle|request|cancel|approve|reject|end|livekit|live/.test(t) || t.length < 80;
    });
    return;
  }

  if (/badrequest|!startnow|folder mismatch|role not found|no role|maxmembers|business rule|not pending|already ended|completed or cancelled|status scheduled|status in_progress/.test(s)) {
    ctx.markOkPreconditions(utcidId);
    ctx.markInputs(utcidId, (r) => /valid|existing/.test(r.sub.toLowerCase()));
    ctx.markBiz(utcidId, (r) => /badrequest|mismatch|missing|!==|scheduled|cancelled|completed|in_progress|full|not accepting|pending|processed|ended|role missing|maxmembers|!startnow/.test(r.sub.toLowerCase()));
    ctx.markRepo(utcidId, (r) => /found|success/.test(r.sub.toLowerCase()));
    return;
  }

  // Fallback: mark catalog rows whose sub overlaps tokens from condition sub
  ctx.markOkPreconditions(utcidId);
  const tokens = s.split(/[^a-z0-9]+/).filter((t) => t.length > 3);
  for (const row of ctx.catalog) {
    const text = row.sub.toLowerCase();
    if (tokens.some((t) => text.includes(t))) ctx.set(row.group, row.sub, utcidId);
  }
}

function applyCondition(ctx, category, sub, utcidId) {
  const code = ctx.fn.code;
  const key = `${category}|${sub}`;
  const handler = EXPLICIT_HANDLERS[code]?.[key];
  if (handler) {
    handler(ctx, utcidId);
    return;
  }
  resolveGeneric(ctx, category, sub, utcidId);
}

export function resolveConditionMarks(fn) {
  const ctx = new MappingContext(fn);
  if (fn.pathMappings) {
    for (const [utcidId, groups] of Object.entries(fn.pathMappings)) {
      for (const [group, items] of Object.entries(groups)) {
        for (const item of items) {
          const sub = Array.isArray(item) ? catalogSub(item[0], item[1]) : item;
          ctx.set(group, sub, utcidId);
        }
      }
    }
    return ctx;
  }

  for (const cond of fn.conditions || []) {
    for (const utcidId of ctx.utcids) {
      if (cond[utcidId] === 'O') {
        applyCondition(ctx, cond.category, cond.sub, utcidId);
      }
    }
  }
  return ctx;
}

export function getAllFunctionDefinitions() {
  const byCode = new Map();
  for (const [code, def] of Object.entries(AUTH_DEFINITIONS)) {
    byCode.set(code, { code, ...def });
  }
  for (const [code, def] of Object.entries(FUNCTION_DEFINITIONS)) {
    byCode.set(code, { code, ...def });
  }
  const moduleOrder = ['Auth', 'Users', 'Groups', 'Sessions', 'Attendance', 'Resource Folders', 'Resources', 'Posts', 'Comments', 'Notifications', 'Dashboard', 'Upload', 'Reports'];
  const codeOrder = {
    Auth: ['register', 'login', 'me', 'refresh', 'logout'],
  };
  const fns = [...byCode.values()];
  fns.sort((a, b) => {
    const ma = moduleOrder.indexOf(a.module);
    const mb = moduleOrder.indexOf(b.module);
    if (ma !== mb) return ma - mb;
    const oa = codeOrder[a.module]?.indexOf(a.code) ?? -1;
    const ob = codeOrder[b.module]?.indexOf(b.code) ?? -1;
    if (oa >= 0 && ob >= 0) return oa - ob;
    if (oa >= 0) return -1;
    if (ob >= 0) return 1;
    return a.code.localeCompare(b.code);
  });
  return fns;
}

export function validateMappings(fn, ctx) {
  const unmapped = [];
  for (const row of ctx.catalog) {
    const marks = ctx.getMarks(row.group, row.sub);
    if (!marks.some((m) => m === 'O')) unmapped.push(`${row.group}: ${row.sub}`);
  }
  return unmapped;
}
