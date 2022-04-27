module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  modulePathIgnorePatterns: [
    'dist',
    'cdk.out',
    'node_modules',
    '.blueprint-templates'
  ],
  testMatch: [
    '**/__tests__/**/*.ts',
    '!**/__fixtures__/**/*.ts'
  ],
  rootDir: './',
  reporters: [
    'default',
    ['jest-junit', {
      'suiteName': 'Vestry Tests',
      'outputDirectory': './test-reports/unit-tests/'
    }],
    ['./node_modules/jest-html-reporter', {
      'pageTitle': 'Vestry Test Report',
      'outputPath': './test-reports/unit-tests/index.html'
    }]
  ],
  collectCoverage: true,
  coverageProvider: 'babel',
  coverageDirectory: './test-reports/coverage/',
  coverageReporters: [
    'json',
    'lcov',
    'text', 
    'clover'
  ],
  collectCoverageFrom: [
    '<rootDir>/core/*/src/**/*.ts',
    '<rootDir>/lambda/**/src/**/*.ts',
    '!**/node_modules/**',
    '!**/__fixtures__/**/*.ts',
    '!**/__tests__/utils/**/*.ts'
  ],
  coverageThreshold: {
    './core/': {
      'branches': 80,
      'functions': 80,
      'lines': 80,
      'statements': 80
    }
  },
  moduleFileExtensions: [
    'ts',
    'js'
  ]
}
