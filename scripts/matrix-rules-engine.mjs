/**
 * Enforces Decision Table Rules 1–6 when building Excel matrix marks.
 */
import { PRECONDITIONS, OK_PRECONDITIONS, catalogSub } from './condition-mapping-engine.mjs';

const GROUP = {
  PRE: 'Precondition',
  INPUT: 'Input (req.body)',
  REPO: 'Repository',
  SEC: 'Security',
  BIZ: 'Business Rule',
};

const CONFIRM_GROUPS = ['Return Status', 'Return Body', 'Exception', 'Log Message'];

/** Mutually exclusive row clusters within a condition section */
export function exclusiveGroupKey(row) {
  const sub = row.sub;
  if (row.group === GROUP.PRE) {
    if (sub.startsWith('Can connect with server')) return `${row.group}|Can connect with server`;
    if (sub.startsWith('JWT Service')) return `${row.group}|JWT Service`;
    if (sub.startsWith('bcrypt Service')) return `${row.group}|bcrypt Service`;
    if (sub.startsWith('Cloudinary Service')) return `${row.group}|Cloudinary Service`;
    if (sub.startsWith('LiveKit Service')) return `${row.group}|LiveKit Service`;
    return `${row.group}|${sub}`;
  }
  if (row.group === GROUP.INPUT) {
    const m = sub.match(/^Input:\s*([^:]+):/);
    return m ? `${row.group}|Input:${m[1].trim()}` : `${row.group}|${sub}`;
  }
  if (row.group === GROUP.REPO) {
    const m = sub.match(/^([^:]+):/);
    return m ? `${row.group}|${m[1].trim()}` : `${row.group}|${sub}`;
  }
  if (row.group === GROUP.SEC) {
    const m = sub.match(/^([^:]+):/);
    if (m) return `${row.group}|${m[1].trim()}`;
    if (sub.includes('middleware')) return `${row.group}|middleware`;
    if (sub.includes('jwt.verify')) return `${row.group}|jwt.verify`;
    if (sub.includes('verifyRefreshToken')) return `${row.group}|verifyRefreshToken`;
    if (sub.startsWith('User Status')) return `${row.group}|User Status`;
    if (sub.startsWith('stored.user.status')) return `${row.group}|stored.user.status`;
    return `${row.group}|${sub}`;
  }
  if (row.group === GROUP.BIZ) {
    const m = sub.match(/^([^:]+):/);
    return m ? `${row.group}|${m[1].trim()}` : `${row.group}|${sub}`;
  }
  if (CONFIRM_GROUPS.includes(row.group)) return `${row.group}`;
  return `${row.group}|${sub}`;
}

export function buildExclusiveClusters(catalog) {
  const map = new Map();
  for (const row of catalog) {
    const key = exclusiveGroupKey(row);
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(row);
  }
  return [...map.values()].filter((rows) => rows.length > 1);
}

/** Assign each summary condition row to UTCIDs; split duplicate UTCID targets onto free columns */
export function assignConditionRows(fn) {
  const ids = fn.utcids.map((u) => u.id);
  const claimed = new Map();
  const assignments = [];

  for (const cond of fn.conditions || []) {
    const targets = ids.filter((id) => cond[id] === 'O');
    for (const utcidId of targets) {
      let slot = utcidId;
      if (claimed.has(utcidId)) {
        const existing = claimed.get(utcidId);
        const list = Array.isArray(existing) ? existing : [existing];
        if (list.some((e) => canShareUtcid(cond, e))) {
          list.push(cond);
          claimed.set(utcidId, list);
          assignments.push({ utcidId, condition: cond, merge: true });
          continue;
        }
        slot = ids.find((id) => !claimed.has(id));
        if (!slot) continue;
      }
      claimed.set(slot, [cond]);
      assignments.push({ utcidId: slot, condition: cond, merge: false });
    }
  }
  return assignments;
}

function samePath(a, b) {
  return a.category === b.category && a.sub === b.sub;
}

/** Complementary summary conditions can share one UTCID (e.g. Input valid + Repository success). */
export function canShareUtcid(a, b) {
  if (samePath(a, b)) return true;
  if (a.category === b.category) {
    if (['Repository', 'Security', 'Business Rule'].includes(a.category)) return false;
  }
  const happy = (c) =>
    /all fields valid|user not found \+ role found|active \+ bcrypt\.compare true|valid email \+ password|refresh token present|all checks pass/i.test(
      `${c.category}|${c.sub}`
    );
  if (happy(a) || happy(b)) return true;
  if (['Repository', 'Security', 'Business Rule', 'Input Validation'].includes(a.category) &&
    ['Repository', 'Security', 'Business Rule', 'Input Validation'].includes(b.category)) {
    return false;
  }
  return true;
}

export function confirmMarksForUtcd(fn, utcidId) {
  const pick = (rows) => rows?.find((r) => r[utcidId] === 'O')?.label;
  return {
    status: pick(fn.returnStatus),
    body: pick(fn.returnBody),
    exception: pick(fn.exceptions),
    log: pick(fn.logs),
  };
}

/** Score catalog row for how well it matches a UTCID confirm outcome */
function scoreRow(row, confirm, utcidId) {
  const t = row.sub.toLowerCase();
  let score = 0;
  if (confirm.status === '201' || confirm.status === '200') {
    if (/success|found|available|configured|active|pass|true|>= now|not found.*user not found/i.test(t) && !/fail|error|invalid|duplicate|missing|inactive|suspended|expired|not found|wrong/.test(t)) score += 2;
  }
  if (confirm.status === '400') {
    if (/invalid|validation|missing|null|empty|wrong format|badrequest|role missing|not configured/.test(t)) score += 3;
    if (/null \/ missing|empty string/.test(t)) score += 5;
  }
  if (confirm.status === '401') {
    if (/unauthorized|not found|nonexistent|wrongpassword|wrong password|invalid credentials|absent|fail|not found/.test(t)) score += 3;
  }
  if (confirm.status === '403') {
    if (/forbidden|suspended|inactive|banned|denied|not active|fail.*admin|not leader/.test(t)) score += 3;
  }
  if (confirm.status === '404') {
    if (/not found|non existing|nonexistent/.test(t)) score += 3;
  }
  if (confirm.status === '409') {
    if (/duplicate|already|conflict|pending exists|already member/.test(t)) score += 3;
  }
  if (confirm.status === '500') {
    if (/connection fail|prisma connection|service fail|query error|hash: error|sign.*fail/.test(t)) score += 4;
    if (/connection ok|service ok|success/.test(t)) score -= 2;
  }
  if (confirm.body && confirm.body.toLowerCase().includes(t.slice(0, 12))) score += 2;
  if (confirm.exception && confirm.exception.toLowerCase().includes(t.slice(0, 8))) score += 1;
  return score;
}

export function enforceExclusivePerColumn(ctx, fn) {
  const clusters = buildExclusiveClusters(ctx.catalog);
  for (const utcidId of ctx.utcids) {
    const col = ctx.idx(utcidId);
    if (col < 0) continue;
    const confirm = confirmMarksForUtcd(fn, utcidId);
    const hasConfirm = confirm.status || confirm.body;
    for (const rows of clusters) {
      const marked = rows.filter((r) => ctx.getMarks(r.group, r.sub)[col] === 'O');
      if (marked.length <= 1) continue;
      let keeper = marked[0];
      if (hasConfirm) {
        let best = -1;
        for (const row of marked) {
          const s = scoreRow(row, confirm, utcidId);
          if (s > best) {
            best = s;
            keeper = row;
          }
        }
      } else {
        keeper = marked[marked.length - 1];
      }
      for (const row of marked) {
        if (row !== keeper) ctx.set(row.group, row.sub, utcidId, '');
      }
    }
  }
}

/** Map orphan catalog rows to at least one UTCID (Rule 4) without breaking Rule 2 in that column */
export function mapOrphanConditions(ctx, fn) {
  const clusters = buildExclusiveClusters(ctx.catalog);
  const hasException = fn.utcids.some((u) => u.id === 'UTCID05');
  const hasValidation = fn.utcids.some((u) => u.id === 'UTCID02');

  const clusterHasO = (cluster, col) =>
    cluster?.some((r) => ctx.getMarks(r.group, r.sub)[col] === 'O');

  for (const row of ctx.catalog) {
    if (ctx.getMarks(row.group, row.sub).some((m) => m === 'O')) continue;

    const key = exclusiveGroupKey(row);
    const cluster = clusters.find((c) => c.some((r) => exclusiveGroupKey(r) === key));

    let bestUtcd = null;
    let bestScore = -1;
    for (const utcidId of ctx.utcids) {
      const col = ctx.idx(utcidId);
      if (col < 0) continue;
      let score = scoreRow(row, confirmMarksForUtcd(fn, utcidId), utcidId);
      if (clusterHasO(cluster, col)) score -= 10;
      if (score > bestScore) {
        bestScore = score;
        bestUtcd = utcidId;
      }
    }

    if (bestUtcd && bestScore >= 0) {
      ctx.set(row.group, row.sub, bestUtcd);
      continue;
    }

    const sub = row.sub.toLowerCase();
    let placed = false;
    for (const utcidId of ctx.utcids) {
      const col = ctx.idx(utcidId);
      if (col >= 0 && !clusterHasO(cluster, col)) {
        ctx.set(row.group, row.sub, utcidId);
        placed = true;
        break;
      }
    }
    if (placed) continue;

    const fallback =
      ctx.idx('UTCID05') >= 0
        ? 'UTCID05'
        : ctx.idx('UTCID04') >= 0
          ? 'UTCID04'
          : ctx.utcids[ctx.utcids.length - 1]?.id;
    if (fallback) ctx.set(row.group, row.sub, fallback);
  }
}

export function enforceConfirmExclusive(fn) {
  for (const utcidId of fn.utcids.map((u) => u.id)) {
    for (const section of [fn.returnStatus, fn.returnBody, fn.exceptions, fn.logs]) {
      if (!section) continue;
      const marked = section.filter((r) => r[utcidId] === 'O');
      if (marked.length <= 1) continue;
      const confirm = confirmMarksForUtcd(fn, utcidId);
      const prefer =
        section === fn.returnStatus
          ? marked.find((r) => r.label === confirm.status)
          : section === fn.returnBody
            ? marked.find((r) => r.label === confirm.body)
            : section === fn.exceptions
              ? marked.find((r) => r.label === confirm.exception)
              : marked.find((r) => r.label === confirm.log);
      const keeper = prefer || marked[0];
      for (const row of section) {
        if (row[utcidId] === 'O' && row !== keeper) row[utcidId] = '';
      }
    }
  }
}
