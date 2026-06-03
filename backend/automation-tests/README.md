# Backend automation tests

All executable tests and test support files for the StudyHub API live here.

## Layout

```text
automation-tests/
├── setup.js              # Shared env (DATABASE_URL, JWT secrets)
├── jest.setup.js         # Jest entry → setup.js
├── jest.config.js        # Jest + Supertest (service, API, E2E)
├── vitest.config.js      # Vitest (utils, middlewares, supplementary services)
├── mocks/                # Prisma client mock for Jest ESM
├── helpers/              # Shared fixtures
├── vitest/               # Vitest suites
│   ├── modules/
│   ├── middlewares/
│   └── utils/
└── jest/                 # Jest suites
    ├── modules/          # *.service.test.js, *.controller.test.js
    └── e2e/              # *.e2e.test.js
```

## Commands (from `backend/`)

```bash
npm test              # Vitest
npm run test:jest     # Jest (service + API + E2E)
npm run test:all      # Both
npm run test:cov      # Jest coverage
```

## QA docs

- `docs/Automation_Test_Report.md`
- `docs/Traceability_Matrix.md`
- `docs/Coverage_Report.md`
- `../API_Inventory_Table.md` (repo root, API source of truth)
