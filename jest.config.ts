/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  testEnvironmentOptions: {
    testRunner: 'jest-circus/runner',
  },
  runner: 'jest-runner',
  extensionsToTreatAsEsm: ['.ts'],
  testMatch: ["<rootDir>/tests/**/*.test.ts"],
  transform: {
    '^.+\\.ts$': ['babel-jest', { configFile: './babel.config.json' }],
  },
  transformIgnorePatterns: [
    "/node_modules/(?!universal-user-agent)"
  ],
  globals: undefined,
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
};
