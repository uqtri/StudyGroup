/**
 * Generates Decision_Tables_Excel_Matrix.md — single merged matrix per function.
 * Source: Decision_Tables.md
 * Run: node scripts/generate-decision-tables-excel-matrix.mjs
 */
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SRC = join(__dirname, '..', 'Decision_Tables.md');
const OUT = join(__dirname, '..', 'Decision_Tables_Excel_Matrix.md');

const UTCID_LABELS = {
  UTCID01: 'Happy Path',
  UTCID02: 'Validation Error',
  UTCID03: 'Business Rule Error',
  UTCID04: 'Authorization Error',
  UTCID05: 'Exception / Dependency Failure',
};

const DECISION_CATEGORY_MAP = {
  'Input Validation': 'Input (req.body)',
  Input: 'Input (req.body)',
  Repository: 'Repository',
  Security: 'Security',
  'Business Rule': 'Business Rule',
  'Primary Path': 'Business Rule',
  Function: 'Business Rule',
};

function parseTableLines(lines) {
  const rows = [];
  for (const line of lines) {
    if (!line.startsWith('|') || line.includes('---')) continue;
    const cells = line
      .split('|')
      .slice(1, -1)
      .map((c) => c.trim());
    if (cells.length >= 2) rows.push(cells);
  }
  return rows;
}

function parseMarkdownTables(content) {
  const sections = [];
  const lines = content.split(/\r?\n/);
  let i = 0;

  while (i < lines.length) {
    const heading = lines[i].match(/^#### (.+)$/);
    if (heading && i + 2 < lines.length && lines[i + 2].startsWith('|')) {
      const name = heading[1];
      const tableLines = [];
      i += 2;
      while (i < lines.length && lines[i].startsWith('|')) {
        tableLines.push(lines[i]);
        i++;
      }
      sections.push({ name, rows: parseTableLines(tableLines) });
      continue;
    }
    i++;
  }
  return sections;
}

function parseFunctions(md) {
  const normalized = md.replace(/\r\n/g, '\n');
  const chunks = normalized.split(/^### Function Code: `/m).slice(1);
  return chunks.map((chunk) => {
    const codeEnd = chunk.indexOf('`');
    const code = chunk.slice(0, codeEnd);
    const body = chunk.slice(codeEnd + 1);
    const serviceMatch = body.match(/\*\*Service:\*\* (.+)/);
    const service = serviceMatch ? serviceMatch[1].trim() : '';
    const moduleMatch = normalized.slice(0, normalized.indexOf(`### Function Code: \`${code}\``)).match(/## Module: (.+)\s*$/m);
    const module = moduleMatch ? moduleMatch[1].trim() : '';
    const sections = parseMarkdownTables(body);
    return { module, code, service, sections };
  });
}

function catalogSub(category, sub) {
  return sub.includes(category) || category === sub ? sub : `${category}: ${sub}`;
}

function extractUtcids(sections) {
  const decision = sections.find((s) => s.name === 'Decision Table');
  if (!decision?.rows.length) return ['UTCID01', 'UTCID02', 'UTCID03', 'UTCID04', 'UTCID05'];
  return decision.rows[0].slice(2);
}

function sectionRows(name, rows, utcids, withMarks = false) {
  return rows.slice(1).map((row) => {
    const category = row[0];
    const sub = row[1];
    const marks = withMarks ? row.slice(2) : utcids.map(() => '');
    return {
      condition: name,
      sub: withMarks ? `${category}: ${sub}` : catalogSub(category, sub),
      marks,
    };
  });
}

function confirmRows(name, rows, utcids) {
  return rows.slice(1).map((row) => ({
    condition: name,
    sub: row[0],
    marks: row.slice(1),
  }));
}

function padMarks(marks, len) {
  const out = marks.slice(0, len);
  while (out.length < len) out.push('');
  return out;
}

function buildMatrix(fn) {
  const sections = Object.fromEntries(fn.sections.map((s) => [s.name, s.rows]));
  const utcids = extractUtcids(fn.sections);
  const matrixRows = [];

  const add = (condition, sub, marks = []) => {
    matrixRows.push({ condition, sub, marks: padMarks(marks, utcids.length) });
  };

  // — Condition —
  add('— Condition —', '');

  if (sections['1. Precondition']) {
    for (const row of sectionRows('Precondition', sections['1. Precondition'], utcids)) add(row.condition, row.sub);
  }

  const inputSection = sections['2. Input (req.body / req.params / req.query)'];
  if (inputSection) {
    for (const row of sectionRows('Input (req.body)', inputSection, utcids)) add(row.condition, row.sub);
  }

  const repoSection = sections['3. Repository / Database Conditions'];
  if (repoSection) {
    for (const row of sectionRows('Repository', repoSection, utcids)) add(row.condition, row.sub);
  }

  const secSection = sections['4. Security Conditions'];
  if (secSection) {
    for (const row of sectionRows('Security', secSection, utcids)) add(row.condition, row.sub);
  }

  const bizSection = sections['5. Business Rule Conditions'];
  if (bizSection) {
    for (const row of sectionRows('Business Rule', bizSection, utcids)) add(row.condition, row.sub);
  }

  if (sections['Decision Table']) {
    for (const row of sections['Decision Table'].slice(1)) {
      const category = row[0];
      const sub = row[1];
      const marks = padMarks(row.slice(2), utcids.length);
      const group = DECISION_CATEGORY_MAP[category] || 'Business Rule';
      add(group, sub, marks);
    }
  }

  // — Confirm —
  add('— Confirm —', '');

  for (const key of ['Return Status', 'Return Body', 'Exception', 'Log Message']) {
    const sec = sections[`Confirm: ${key}`];
    if (sec) {
      for (const row of confirmRows(key, sec, utcids)) add(row.condition, row.sub, row.marks);
    }
  }

  // — Result —
  add('— Result —', '');

  add('Type', '', utcids.map((id) => UTCID_LABELS[id] || id));
  add('Pass/Fail', '', utcids.map(() => ''));
  add('Executed Date', '', utcids.map(() => ''));
  add('Defect ID', '', utcids.map(() => ''));

  return { utcids, matrixRows };
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

const md = readFileSync(SRC, 'utf8');
const functions = parseFunctions(md);

let out = `# Excel Matrix Format

> Single merged decision matrix per function code.
> Generated from \`Decision_Tables.md\`.
> UTCID convention: **UTCID01** = Happy Path | **UTCID02** = Validation Error | **UTCID03** = Business Rule Error | **UTCID04** = Authorization Error | **UTCID05** = Exception / Dependency Failure | Additional UTCIDs for extra branches.

**Column structure:** \`Condition\` | \`Sub Condition\` | \`UTCID01\` … \`UTCID0N\`

**Row groups:**
- **Condition** → Precondition, Input (req.body), Repository, Security, Business Rule
- **Confirm** → Return Status, Return Body, Exception, Log Message
- **Result** → Type, Pass/Fail, Executed Date, Defect ID

`;

let currentModule = '';
for (const fn of functions) {
  if (fn.module !== currentModule) {
    currentModule = fn.module;
    out += `\n## Module: ${currentModule}\n\n`;
  }
  out += renderFunction(fn);
}

writeFileSync(OUT, out, 'utf8');
console.log(`Written ${functions.length} Excel matrix tables to ${OUT}`);
