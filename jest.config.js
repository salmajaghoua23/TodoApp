module.exports = {
  preset: '@react-native/jest-preset',
  setupFiles: ['<rootDir>/jest.setup.js'],
  testTimeout: 30000,
  collectCoverageFrom: [
    'src/v2/**/*.js',
    '!src/v2/**/*.test.js',
    '!src/v2/**/*.spec.js',
    '!src/v2/**/__tests__/**',
  ],
  coverageThreshold: {
    global: { statements: 70, functions: 65, lines: 70, branches: 55 },
  },
  reporters: [
      'default',
      [
        'jest-html-reporter',
        {
          pageTitle: 'TodoApp Unit Test Report',
          outputPath: 'reports/jest-report.html',
          includeFailureMsg: true,
        },
      ],
      [
        'jest-junit',
        {
          outputDirectory: 'reports',
          outputName: 'junit.xml',
        },
      ],
  ],

    // Rapports de couverture
  coverageReporters: [
      'text',
      'html',
      'lcov',
  ],
};
