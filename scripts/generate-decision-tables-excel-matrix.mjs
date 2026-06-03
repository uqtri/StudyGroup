/**
 * Generates Decision_Tables_Excel_Matrix.md — single merged matrix per function.
 * Condition rows are mapped to UTCIDs per the Condition Mapping Rule.
 * Run: node scripts/generate-decision-tables-excel-matrix.mjs
 */
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import {
  getAllFunctionDefinitions,
  resolveConditionMarks,
  validateMappings,
} from './condition-mapping-engine.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, '..', 'Decision_Tables_Excel_Matrix.md');

const UTCID_LABELS = {
  UTCID01: 'Happy Path',
  UTCID02: 'Validation Error',
  UTCID03: 'Business Rule Error',
  UTCID04: 'Authorization Error',
  UTCID05: 'Exception / Dependency Failure',
};

function padMarks(marks, len) {
  const out = marks.slice(0, len);
  while (out.length < len) out.push('');
  return out;
}

function confirmMarks(rows, utcids) {
  const ids = utcids.map((u) => u.id);
  return (rows || []).map((row) => ({
    condition: row._confirmGroup,
    sub: row.label,
    marks: padMarks(ids.map((id) => row[id] || ''), ids.length),
  }));
}

function buildMatrix(fn) {
  const utcids = fn.utcids.map((u) => u.id);
  const ctx = resolveConditionMarks(fn);
  const matrixRows = [];

  const add = (condition, sub, marks = []) => {
    matrixRows.push({ condition, sub, marks: padMarks(marks, utcids.length) });
  };

  add('— Condition —', '');

  for (const row of ctx.catalog) {
    add(row.group, row.sub, ctx.getMarks(row.group, row.sub));
  }

  add('— Confirm —', '');

  for (const row of confirmMarks(fn.returnStatus?.map((r) => ({ ...r, _confirmGroup: 'Return Status' })), fn.utcids)) {
    add(row.condition, row.sub, row.marks);
  }
  for (const row of confirmMarks(fn.returnBody?.map((r) => ({ ...r, _confirmGroup: 'Return Body' })), fn.utcids)) {
    add(row.condition, row.sub, row.marks);
  }
  for (const row of confirmMarks(fn.exceptions?.map((r) => ({ ...r, _confirmGroup: 'Exception' })), fn.utcids)) {
    add(row.condition, row.sub, row.marks);
  }
  for (const row of confirmMarks(fn.logs?.map((r) => ({ ...r, _confirmGroup: 'Log Message' })), fn.utcids)) {
    add(row.condition, row.sub, row.marks);
  }

  add('— Result —', '');
  add('Type', '', utcids.map((id) => fn.utcids.find((u) => u.id === id)?.label || UTCID_LABELS[id] || id));
  add('Pass/Fail', '', utcids.map(() => ''));
  add('Executed Date', '', utcids.map(() => ''));
  add('Defect ID', '', utcids.map(() => ''));

  return { utcids, matrixRows, ctx };
}

function renderMatrixTable(utcids, matrixRows) {
  const header = `| Condition | Sub Condition | ${utcids.join(' | ')} |`;
  const sep = `|-----------|---------------|${utcids.map(() => '---').join('|')}|`;
  const body = matrixRows
    .map(({ condition, sub, marks }) => `| ${condition} | ${sub} | ${marks.join(' | ')} |`)
    .join('\n');
  return `${header}\n${sep}\n${body}`;
}

function renderFunction(fn) {
  const { utcids, matrixRows } = buildMatrix(fn);
  let out = `### Function Code: \`${fn.code}\`\n\n`;
  out += `**Service:** ${fn.service}\n\n`;
  out += `#### Excel Matrix\n\n`;
  out += renderMatrixTable(utcids, matrixRows);
  out += '\n\n---\n\n';
  return out;
}

const functions = getAllFunctionDefinitions();
const warnings = [];

let out = `# Excel Matrix Format

> Single merged decision matrix per function code.
> **Decision Table Rules:** (1) Each UTCID = one execution path. (2) Within the same condition group, only one mutually-exclusive sub-condition is \`O\` per UTCID. (3) Every \`O\` maps to a real scenario. (4) Every condition row is mapped to at least one UTCID. (5) Sections: Precondition, Input, Repository, Security, Business Rule, Confirm, Result. (6) Preserve UTCIDs and scenarios.
> UTCID convention: **UTCID01** = Happy Path | **UTCID02** = Validation Error | **UTCID03** = Business Rule Error | **UTCID04** = Authorization Error | **UTCID05** = Exception / Dependency Failure | Additional UTCIDs for extra branches.

**Column structure:** \`Condition\` | \`Sub Condition\` | \`UTCID01\` … \`UTCID0N\`

**Row groups:**
- **Condition** → Precondition, Input (req.body), Repository, Security, Business Rule
- **Confirm** → Return Status, Return Body, Exception, Log Message
- **Result** → Type, Pass/Fail, Executed Date, Defect ID

`;

let currentModule = '';
for (const fn of functions) {
  const { ctx } = buildMatrix(fn);
  const unmapped = validateMappings(fn, ctx);
  if (unmapped.length) warnings.push({ code: fn.code, unmapped });

  if (fn.module !== currentModule) {
    currentModule = fn.module;
    out += `\n## Module: ${currentModule}\n\n`;
  }
  out += renderFunction(fn);
}

writeFileSync(OUT, out, 'utf8');
console.log(`Written ${functions.length} Excel matrix tables to ${OUT}`);
if (warnings.length) {
  console.warn(`\n${warnings.length} function(s) have unmapped (possibly unreachable) condition rows:`);
  for (const w of warnings.slice(0, 5)) {
    console.warn(`  ${w.code}: ${w.unmapped.length} row(s) — e.g. ${w.unmapped.slice(0, 2).join('; ')}`);
  }
  if (warnings.length > 5) console.warn(`  ... and ${warnings.length - 5} more`);
}
