module.exports = {
  collectCoverageFrom: ['src/**/*.{js,mjs}'],
  testMatch: ['<rootDir>/src/**/__tests__/**/*.spec.{js,mjs}'],
  testEnvironment: 'jsdom',
  testURL: 'http://localhost',
  transform: {
    '^.+\\.(js|mjs)$': 'babel-jest',
    '^.+\\.css$': '<rootDir>/config/jest/cssTransform.js',
    '^(?!.*\\.(js|mjs|css|json)$)': '<rootDir>/config/jest/fileTransform.js',
  },
  moduleFileExtensions: ['js', 'mjs', 'json'],
  coveragePathIgnorePatterns: ['index.js', 'App.js'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
