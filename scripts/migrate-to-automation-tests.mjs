/**
 * Moves all backend test files into backend/automation-tests/ and rewrites imports.
 * Run once: node scripts/migrate-to-automation-tests.mjs
 */
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
  unlinkSync,
  writeFileSync,
} from 'fs';
import { dirname, join, relative } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const BACKEND = join(ROOT, 'backend');
const AT = join(BACKEND, 'automation-tests');
const SRC = join(BACKEND, 'src');

const SRC_PREFIX = '../../../../src';

function rewriteJestContent(content, moduleName) {
  let c = content;

  c = c.replace(
    /jest\.unstable_mockModule\('\.\.\/\.\.\/utils\//g,
    `jest.unstable_mockModule('${SRC_PREFIX}/utils/`,
  );
  c = c.replace(
    /jest\.unstable_mockModule\('\.\.\/([a-z0-9-]+)\//g,
    `jest.unstable_mockModule('${SRC_PREFIX}/modules/$1/`,
  );

  c = c.replace(/from '\.\.\/\.\.\/utils\//g, `from '${SRC_PREFIX}/utils/`);
  c = c.replace(/from '\.\.\/\.\.\/config\//g, `from '${SRC_PREFIX}/config/`);
  c = c.replace(/from '\.\.\/\.\.\/middlewares\//g, `from '${SRC_PREFIX}/middlewares/`);
  c = c.replace(/from '\.\.\/\.\.\/constants\//g, `from '${SRC_PREFIX}/constants/`);

  c = c.replace(/from '\.\.\/([a-z0-9-]+)\//g, `from '${SRC_PREFIX}/modules/$1/`);
  c = c.replace(/import\('\.\.\/([a-z0-9-]+)\//g, `import('${SRC_PREFIX}/modules/$1/`);

  c = c.replace(/from '\.\/([^']+\.js)'/g, `from '${SRC_PREFIX}/modules/${moduleName}/$1'`);
  c = c.replace(/import\('\.\/([^']+\.js)'\)/g, `import('${SRC_PREFIX}/modules/${moduleName}/$1')`);

  return c;
}

function rewriteVitestContent(content) {
  return content.replace(/from '\.\.\/\.\.\/\.\.\/src\//g, `from '${SRC_PREFIX}/`);
}

function copyDir(srcDir, destDir, rewriteFn) {
  if (!existsSync(srcDir)) return;
  mkdirSync(destDir, { recursive: true });
  for (const entry of readdirSync(srcDir)) {
    const srcPath = join(srcDir, entry);
    const destPath = join(destDir, entry);
    if (statSync(srcPath).isDirectory()) {
      copyDir(srcPath, destPath, rewriteFn);
    } else if (entry.endsWith('.js')) {
      let content = readFileSync(srcPath, 'utf8');
      if (rewriteFn) content = rewriteFn(content, srcPath);
      writeFileSync(destPath, content);
    } else {
      copyFileSync(srcPath, destPath);
    }
  }
}

function moveJestTest(srcPath, destDir, moduleName) {
  mkdirSync(destDir, { recursive: true });
  const content = rewriteJestContent(readFileSync(srcPath, 'utf8'), moduleName);
  const base = srcPath.split(/[/\\]/).pop();
  writeFileSync(join(destDir, base), content);
  unlinkSync(srcPath);
}

function removeEmptyDirs(dir) {
  if (!existsSync(dir)) return;
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) removeEmptyDirs(p);
  }
  if (existsSync(dir) && readdirSync(dir).length === 0) {
    rmSync(dir, { recursive: true });
  }
}

// --- Create structure ---
mkdirSync(join(AT, 'vitest'), { recursive: true });
mkdirSync(join(AT, 'jest', 'modules'), { recursive: true });
mkdirSync(join(AT, 'jest', 'e2e'), { recursive: true });
mkdirSync(join(AT, 'mocks'), { recursive: true });
mkdirSync(join(AT, 'helpers'), { recursive: true });

// --- Move support files from tests/ ---
const testsDir = join(BACKEND, 'tests');
if (existsSync(join(testsDir, 'setup.js'))) {
  copyFileSync(join(testsDir, 'setup.js'), join(AT, 'setup.js'));
}
if (existsSync(join(testsDir, 'jest.setup.js'))) {
  writeFileSync(join(AT, 'jest.setup.js'), "import './setup.js';\n");
}
if (existsSync(join(testsDir, 'mocks', 'prisma-client.js'))) {
  copyFileSync(join(testsDir, 'mocks', 'prisma-client.js'), join(AT, 'mocks', 'prisma-client.js'));
}
if (existsSync(join(testsDir, 'helpers', 'fixtures.js'))) {
  copyFileSync(join(testsDir, 'helpers', 'fixtures.js'), join(AT, 'helpers', 'fixtures.js'));
}

// Vitest suites
copyDir(join(testsDir, 'modules'), join(AT, 'vitest', 'modules'), (content, path) =>
  rewriteVitestContent(content),
);
copyDir(join(testsDir, 'middlewares'), join(AT, 'vitest', 'middlewares'), (content) =>
  rewriteVitestContent(content),
);
copyDir(join(testsDir, 'utils'), join(AT, 'vitest', 'utils'), (content) =>
  rewriteVitestContent(content),
);

// Jest tests from src/modules
const modulesDir = join(SRC, 'modules');
for (const moduleName of readdirSync(modulesDir)) {
  const modPath = join(modulesDir, moduleName);
  if (!statSync(modPath).isDirectory()) continue;

  for (const file of readdirSync(modPath)) {
    if (file.endsWith('.service.test.js') || file.endsWith('.controller.test.js')) {
      moveJestTest(join(modPath, file), join(AT, 'jest', 'modules', moduleName), moduleName);
    } else if (file.endsWith('.e2e.test.js')) {
      moveJestTest(join(modPath, file), join(AT, 'jest', 'e2e', moduleName), moduleName);
    }
  }
}

// Remove old tests/ tree
if (existsSync(testsDir)) {
  rmSync(testsDir, { recursive: true, force: true });
}

removeEmptyDirs(modulesDir);

console.log('Migration complete:', relative(ROOT, AT));
