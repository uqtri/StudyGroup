# Testing Methodology Report

> **Project:** StudyHub — Group Study Management System
> **Scope:** Unit Tests & Automation (Integration) Tests
> **Date:** 2026-06-04

---

## 1. Test Folder Structure (from README)

```text
StudyGroup/
├── backend/
│   └── automation-tests/           # All backend test suites
│       ├── setup.js                # Shared env vars (DATABASE_URL, JWT secrets)
│       ├── jest.setup.js           # Jest entry → setup.js
│       ├── jest.config.js          # Jest + Supertest config
│       ├── vitest.config.js        # Vitest config
│       ├── mocks/                  # Prisma client mock for Jest ESM
│       ├── helpers/                # Shared fixtures
│       ├── vitest/                 # Vitest suites
│       │   ├── modules/            # *.service.test.js  (21 files)
│       │   ├── middlewares/
│       │   └── utils/
│       └── jest/                   # Jest suites
│           ├── modules/            # *.service.test.js + *.controller.test.js
│           └── e2e/                # *.e2e.test.js
└── frontend/
    ├── src/**/__tests__/           # Vitest unit tests  (27 files)
    └── e2e/                        # Playwright E2E tests (7 spec files)
        ├── auth/
        ├── groups/
        ├── sessions/
        ├── resources/
        ├── user/
        ├── admin/
        └── fixtures/               # factories.js, helpers.js
```

---

## 2. Key Distinction — Two Separate Layers

> The methodology must be understood at **two separate layers**:
> - **Layer 1 — Test Case Design:** how UTCIDs are generated (Black-box techniques)
> - **Layer 2 — Test Implementation:** how test code is written (Grey-box / Black-box)

---

## 3. Layer 1 — Test Case Design → Black-box

All test cases are generated from **`Decision_Tables_Excel_Matrix.md`** (4 037 lines).  
The designer reads only the **behavioral specification** of each function — not the source code.

### 3.1 Decision Table Testing (Primary Technique)

Each function has one decision table. **Column = one test case (UTCID). Row = one condition.**  
A cell marked `O` means that condition is active for that test case.

**Example — `register` function:**

| Condition | Sub Condition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
|-----------|---------------|:-------:|:-------:|:-------:|:-------:|:-------:|
| Precondition | DB Connection OK | O | O | O | O | |
| Precondition | DB Connection Fail | | | | | O |
| Input | email: valid@email.com | O | | | O | O |
| Input | email: duplicate (already registered) | | | O | | |
| Input | email: invalid-email | | O | | | |
| Input | password: validPassword123 | O | | O | O | O |
| Input | password: invalid format | | O | | | |
| Business Rule | Email Available | O | | | | O |
| Business Rule | Email Already Registered | | | O | | |
| Business Rule | MEMBER Role Configured | O | | | | O |
| Business Rule | MEMBER Role Missing | | | | O | |
| Return Status | 201 | O | | | | |
| Return Status | 400 | | O | | O | |
| Return Status | 409 | | | O | | |
| Return Status | 500 | | | | | O |
| **Type** | | Happy Path | Validation Err | Business Rule Err | Auth Err | Exception |

**UTCID convention** (defined at the top of `Decision_Tables_Excel_Matrix.md`):

| UTCID | Meaning |
|-------|---------|
| UTCID01 | Happy Path — nominal success flow |
| UTCID02 | Validation Error — malformed input |
| UTCID03 | Business Rule Error — rule violation |
| UTCID04 | Authorization Error — forbidden / unauthenticated |
| UTCID05 | Exception / Dependency Failure — DB down, JWT error, etc. |
| UTCID06+ | Extra branches specific to the function |

Each UTCID maps directly to a test in code:

```js
// backend/automation-tests/jest/modules/auth/auth.service.test.js
describe('register', () => {
  /* UTCIDs: UTCID01, UTCID03, UTCID04, UTCID05 */

  it('UTCID01 - should register a new user successfully', async () => { ... });
  it('UTCID03 - should throw conflict if email exists', async () => { ... });
  it('UTCID04 - should throw error if default role not found', async () => { ... });
  it('UTCID05 - should propagate error when createUser fails', async () => { ... });
});
```

---

### 3.2 Equivalence Partitioning

Each input field is divided into **equivalence classes** — only one representative value per class is needed.

**Example — `login` function inputs:**

| Input Field | Class | Value | UTCID |
|-------------|-------|-------|-------|
| email | Valid | `valid@email.com` | UTCID01 |
| email | Invalid format | `invalid-email` | UTCID02 |
| email | Null / missing | `null` | UTCID02 |
| password | Valid | `validPassword123` | UTCID01 |
| password | Wrong value | `wrongPassword` | UTCID06 |
| password | Null / missing | `null` | UTCID02 |

From `Decision_Tables_Excel_Matrix.md`:

```
| Input | email: valid@email.com     | O |   | O | O | O | O |
| Input | email: invalid-email       |   | O |   |   |   |   |
| Input | email: null / missing      |   |   |   |   |   |   |
| Input | password: validPassword123 | O |   | O | O | O |   |
| Input | password: wrongPassword    |   |   |   |   |   | O |
| Input | password: null / missing   |   | O |   |   |   |   |
```

---

### 3.3 Boundary Value Analysis

Boundary values are explicitly modeled as separate conditions.

**Example — `fullName` field:**

```
| Input | fullName: valid name (2-100 chars)    | O |   | O | O | O |
| Input | fullName: invalid length (<2 or >100) |   | O |   |   |   |
| Input | fullName: null / missing              |   |   |   |   |   |
```

The boundary `< 2` and `> 100` characters each become a dedicated test condition (UTCID02).

---

### 3.4 State-Based Testing

Each possible state of an entity is a separate condition row.

**Example — `User.status` in `login`:**

```
| Security | User Status: ACTIVE    | O |   |   |   |   | O |
| Security | User Status: INACTIVE  |   |   | O |   |   |   |
| Security | User Status: SUSPENDED |   |   |   | O |   |   |
```

In code:

```js
it('UTCID04 - should throw forbidden if account suspended', async () => {
  authRepository.findByEmail.mockResolvedValue({ ...mockUser, status: 'SUSPENDED' });
  await expect(authService.login({ email: 'test@example.com', password: 'pw' }))
    .rejects.toThrow('Your account has been banned');
});
```

---

## 4. Layer 2 — Test Implementation

### 4.1 Backend Unit Tests — Grey-box

#### Vitest (`automation-tests/vitest/`) — mock entire module

```js
// automation-tests/vitest/modules/auth/auth.service.test.js
vi.mock('../../../../src/modules/auth/auth.repository.js', () => ({
  authRepository: {
    findByEmail: vi.fn(),
    findRoleByName: vi.fn(),
    createUser: vi.fn(),
    createRefreshToken: vi.fn(),
    findRefreshToken: vi.fn(),
    deleteRefreshToken: vi.fn(),
    deleteUserRefreshTokens: vi.fn(),
  },
}));
```

`vi.mock()` **replaces the entire module** at import time. The real `authService` runs; only the database repository is faked. The tester must know which internal module to mock → **Grey-box**.

#### Jest (`automation-tests/jest/modules/*.service.test.js`) — spy on methods

```js
// automation-tests/jest/modules/auth/auth.service.test.js
jest.spyOn(authRepository, 'findByEmail');
jest.spyOn(authRepository, 'findRoleByName');
jest.spyOn(authRepository, 'createUser');
jest.spyOn(authRepository, 'createRefreshToken');
```

`jest.spyOn()` wraps individual methods. The tester must know the exact method names inside the service → **Grey-box**.

---

### 4.2 Backend Integration Tests — Grey-box

#### Jest Controller / API tests (`jest/modules/*.controller.test.js`)

```js
// automation-tests/jest/modules/auth/auth.controller.test.js
const app = express();
app.use(express.json());
app.use('/auth', authRoutes);

// Error handler
app.use((err, req, res, next) => {
  const status = err.statusCode || 500;
  res.status(status).json({ success: false, message: err.message });
});

jest.spyOn(authService, 'register');
jest.spyOn(authService, 'login');
jest.spyOn(authService, 'getProfile');
```

- Mounts a **real Express app** with actual routes
- Sends real HTTP requests via **Supertest**
- Mocks the **service layer** (one level below the controller)
- Tests HTTP routing, middleware validation, status codes, response bodies
- Must know that `authRoutes` uses `authService` internally → **Grey-box**

Sample test:

```js
it('UTCID01 - should validate request body and call register', async () => {
  authService.register.mockResolvedValue({ id: 1, email: 'test@test.com' });

  const res = await request(app)
    .post('/auth/register')
    .send({ email: 'test@test.com', password: 'Password123!', fullName: 'Test User' });

  expect(res.status).toBe(201);
  expect(res.body.data.email).toBe('test@test.com');
  expect(authService.register).toHaveBeenCalled();
});

it('UTCID02 - should return 400 for invalid email', async () => {
  const res = await request(app)
    .post('/auth/register')
    .send({ email: 'invalid', password: 'Password123!', fullName: 'Test' });

  expect(res.status).toBe(400);
  expect(authService.register).not.toHaveBeenCalled(); // validation blocked before service
});
```

---

### 4.3 Backend E2E (Flow) Tests — Grey-box

#### Jest E2E (`jest/e2e/*.e2e.test.js`)

```js
// automation-tests/jest/e2e/auth/auth.e2e.test.js
jest.spyOn(prisma.user, 'findFirst');
jest.spyOn(prisma.role, 'findUnique');
jest.spyOn(prisma.user, 'create');
jest.spyOn(prisma.refreshToken, 'create');
jest.spyOn(bcrypt, 'compare');
```

- Tests a **full user flow** across multiple requests (e.g. Register → Login)
- All application layers (route → controller → service → repository) run for real
- Only **Prisma model calls** are mocked (the deepest layer, no real DB)
- Must know which Prisma models are touched by each flow → **Grey-box**

Sample flow test:

```js
describe('E2E Auth Flow: Register -> Login', () => {
  it('should register a new user and then log them in', async () => {
    // Step 1 — mock DB calls for Register
    prisma.user.findFirst.mockResolvedValueOnce(null);          // no duplicate email
    prisma.role.findUnique.mockResolvedValueOnce({ id: 2, name: 'MEMBER' });
    prisma.user.create.mockResolvedValueOnce(mockUser);
    prisma.refreshToken.create.mockResolvedValueOnce({});

    // Step 2 — perform Register
    const registerRes = await request(app)
      .post('/auth/register')
      .send({ email: 'e2e@example.com', password: 'Password123!', fullName: 'E2E User' });

    expect(registerRes.status).toBe(201);
    expect(registerRes.body.data.accessToken).toBeDefined();

    // Step 3 — mock DB calls for Login
    prisma.user.findFirst.mockResolvedValueOnce(mockUser);
    prisma.refreshToken.create.mockResolvedValueOnce({});

    // Step 4 — perform Login
    const loginRes = await request(app)
      .post('/auth/login')
      .send({ email: 'e2e@example.com', password: 'Password123!' });

    expect(loginRes.status).toBe(200);
    expect(loginRes.body.data.accessToken).toBeDefined();
    expect(loginRes.body.data.user.email).toBe('e2e@example.com');
  });
});
```

---

### 4.4 Frontend Unit Tests — Grey-box

#### Vitest + React Testing Library (`src/**/__tests__/`)

```js
// frontend/src/components/common/__tests__/Button.test.jsx
describe('loading state', () => {
  it('does not fire onClick when loading', () => {
    const onClick = vi.fn();
    render(<Button loading onClick={onClick}>Save</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });
});
```

- `render()` mounts the component into a **jsdom** virtual DOM
- `screen.getByRole()` queries elements the way a real user would see them
- `vi.fn()` creates mock functions to track calls
- Needs to know the component's internal prop API (`loading`, `onClick`) → **Grey-box**

---

### 4.5 Frontend E2E Tests — Black-box

#### Playwright (`frontend/e2e/`)

```js
// frontend/e2e/fixtures/helpers.js
export async function loginAs(page, { email, password }) {
  await page.goto('/login');
  await page.getByLabel(/email/i).fill(email);
  await page.getByLabel(/password/i).fill(password);
  await page.getByRole('button', { name: /sign in/i }).click();
  await page.waitForURL((url) => !url.pathname.includes('/login'), { timeout: 10_000 });
}

export async function logout(page) {
  await page.evaluate(() => localStorage.removeItem('studyhub-auth'));
  await page.goto('/');
}
```

- Controls a **real browser** (Chrome and Firefox)
- No mocking of any kind
- Only knows URLs and visible UI labels
- Tests user journeys end-to-end through the full stack → **Black-box**

Sample access-control test:

```js
// frontend/e2e/sessions/sessions.spec.js
test('redirects unauthenticated user from /sessions to /login', async ({ page }) => {
  await logout(page);
  await page.goto('/sessions');
  await expect(page).toHaveURL('/login');
});

test('redirects admin user from /sessions to admin portal', async ({ page }) => {
  await loginAs(page, testUsers.admin);
  await page.goto('/sessions');
  await expect(page).toHaveURL('/admin/dashboard');
});
```

---

## 5. Traceability — UTCID links design to code

`backend/automation-tests/docs/Traceability_Matrix.md` maps every function to its UTCIDs and test files:

| Module | Function | UTCIDs Tested | Service Test | API Test | E2E Test | Status |
|--------|----------|---------------|-------------|----------|----------|--------|
| Auth | `register` | 01, 03, 04, 05 | auth.service.test.js | auth.controller.test.js | auth.e2e.test.js | Passed |
| Auth | `login` | 01, 02, 03, 04, 06 | auth.service.test.js | auth.controller.test.js | auth.e2e.test.js | Passed |
| Auth | `me` | 01, 04, 05 | auth.service.test.js | auth.controller.test.js | — | Passed |
| Auth | `refresh` | 03, 04 | auth.service.test.js | auth.controller.test.js | — | Partial |
| Auth | `logout` | 01, 02 | auth.service.test.js | auth.controller.test.js | — | Passed |

The `Partial` status on `refresh` means some UTCIDs from the decision table have no corresponding test yet.

---

## 6. Summary Table

| Test Type | Tool | Location | Test Design Method | Implementation Method |
|-----------|------|----------|--------------------|-----------------------|
| Backend Unit | Vitest | `automation-tests/vitest/` | Decision Table + EP + BVA | Grey-box (`vi.mock` module) |
| Backend Unit | Jest | `automation-tests/jest/modules/*.service.test.js` | Decision Table + EP + BVA | Grey-box (`jest.spyOn` method) |
| Backend Integration | Jest + Supertest | `automation-tests/jest/modules/*.controller.test.js` | Decision Table (UTCID) | Grey-box (mock service layer) |
| Backend E2E Flow | Jest + Supertest | `automation-tests/jest/e2e/` | Scenario / flow-based | Grey-box (mock Prisma layer) |
| Frontend Unit | Vitest + RTL | `frontend/src/**/__tests__/` | Behavior / component-based | Grey-box (`vi.fn`, prop API) |
| Frontend E2E | Playwright | `frontend/e2e/` | Scenario / use-case | Black-box (real browser, no mock) |

---

## 7. Conclusion

| Question | Answer |
|----------|--------|
| How are test cases **designed**? | **Black-box** — Decision Table Testing is the primary technique, combined with Equivalence Partitioning, Boundary Value Analysis, and State-Based Testing. Designers work from behavioral specs, not source code. |
| How are test cases **implemented** (backend)? | **Grey-box** — testers must know which internal modules/methods to mock (`authRepository`, `authService`, `prisma.*`). |
| How are test cases **implemented** (frontend Playwright)? | **Black-box** — real browser automation against URLs and visible UI labels; nothing is mocked. |
| What links design to code? | The **UTCID convention** and the **Traceability Matrix** — every test in code is annotated with its UTCID, which maps back to exactly one column in the decision table. |
