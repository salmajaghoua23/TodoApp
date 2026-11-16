module.exports = {
  preset: '@react-native/jest-preset',
  setupFiles: ['<rootDir>/jest.setup.js'],
  testTimeout: 30000,
  collectCoverageFrom: [
    'src/v2/context/**/*.js',
    'src/v2/utils/**/*.js',
    'src/v2/storage.js',
    'src/v2/screens/AuthScreen.js',
    'src/v2/screens/SetupScreen.js',
    'src/v2/AppRoot.js',
  ],
  coverageThreshold: {
    global: { statements: 70, functions: 65, lines: 70, branches: 55 },
  },
  reporters: [
    'default',
    ['jest-junit', { outputDirectory: 'coverage', outputName: 'junit.xml' }],
  ],
};
