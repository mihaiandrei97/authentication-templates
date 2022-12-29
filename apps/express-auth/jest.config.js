/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
  globalTeardown: '<rootDir>/src/globalTeardown.ts',
  globalSetup: '<rootDir>/src/globalSetup.ts',
}
