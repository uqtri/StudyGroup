/** @type {import('jest').Config} */
export default {
  rootDir: '..',
  testEnvironment: 'node',
  setupFiles: ['<rootDir>/automation-tests/jest.setup.js'],
  testMatch: [
    '<rootDir>/automation-tests/jest/**/*.service.test.js',
    '<rootDir>/automation-tests/jest/**/*.controller.test.js',
    '<rootDir>/automation-tests/jest/**/*.e2e.test.js',
  ],
  transform: {},
  moduleNameMapper: {
    '^@prisma/client$': '<rootDir>/automation-tests/mocks/prisma-client.js',
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  collectCoverageFrom: [
    'src/modules/**/*.js',
    '!src/modules/**/*.test.js',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['json', 'lcov', 'text', 'clover'],
};
