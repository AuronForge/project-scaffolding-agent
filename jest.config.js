export default {
  testEnvironment: 'node',
  transform: {},
  testMatch: ['**/tests/**/*.test.js'],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/examples/output/',
  ],
  collectCoverageFrom: [
    'src/**/*.js',
    'api/**/*.js',
    '!**/node_modules/**',
    '!**/examples/**',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  verbose: true,
};
