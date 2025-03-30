module.exports = {
  testEnvironment: 'node',
  testMatch: [
    '**/tests/**/*.js',
    '**/tests/*.js',
    '**/__tests__/**/*.js',
    '**/?(*.)+(spec|test).js'
  ],
  verbose: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'clover'],
  testTimeout: 10000
};
