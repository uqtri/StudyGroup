export default {
  testEnvironment: 'node',
  testPathIgnorePatterns: ['<rootDir>/tests/'],
  transform: {},
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  collectCoverageFrom: [
    'src/modules/**/*.js',
    '!src/modules/**/*.test.js',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['json', 'lcov', 'text', 'clover'],
};
