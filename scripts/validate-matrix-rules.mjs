/**
 * Validates Decision_Tables_Excel_Matrix rules per function definition.
 */
import { getAllFunctionDefinitions, resolveConditionMarks, validateMappings } from './condition-mapping-engine.mjs';
import { buildExclusiveClusters, exclusiveGroupKey } from './matrix-rules-engine.mjs';

const CONFIRM = ['Return Status', 'Return Body', 'Exception', 'Log Message'];

function validateFn(fn) {
  const ctx = resolveConditionMarks(fn);
  const issues = [];
  const unmapped = validateMappings(fn, ctx);

  if (unmapped.length) {
    issues.push(`Rule 4: ${unmapped.length} unmapped row(s)`);
  }

  const clusters = buildExclusiveClusters(ctx.catalog);
  for (const utcidId of ctx.utcids) {
    const col = ctx.idx(utcidId);
    for (const rows of clusters) {
      const marked = rows.filter((r) => ctx.getMarks(r.group, r.sub)[col] === 'O');
      if (marked.length > 1) {
        issues.push(
          `Rule 2 @ ${utcidId}: ${exclusiveGroupKey(rows[0])} has ${marked.length} O (${marked.map((r) => r.sub).join(' | ')})`
        );
      }
    }
    for (const section of CONFIRM) {
      const rows = fn.returnStatus && section === 'Return Status' ? fn.returnStatus
        : fn.returnBody && section === 'Return Body' ? fn.returnBody
        : fn.exceptions && section === 'Exception' ? fn.exceptions
        : fn.logs;
      if (!rows) continue;
      const marked = rows.filter((r) => r[utcidId] === 'O');
      if (marked.length > 1) {
        issues.push(`Rule 2 Confirm ${section} @ ${utcidId}: ${marked.map((r) => r.label).join(' | ')}`);
      }
    }
  }

  return issues;
}

const fns = getAllFunctionDefinitions();
let total = 0;
for (const fn of fns) {
  const issues = validateFn(fn);
  if (issues.length) {
    console.log(`\n${fn.code}:`);
    for (const i of issues) console.log(`  - ${i}`);
    total += issues.length;
  }
}
console.log(`\n${total ? `Found ${total} issue group(s)` : 'All matrices pass rules.'}`);
