/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
    testTimeout: 20000,
    preset: 'ts-jest',
    testEnvironment: 'node',
    globalSetup: '<rootDir>/test/globalSetup.ts',
    globalTeardown: '<rootDir>/test/globalTeardown.ts',
    testMatch: ['<rootDir>/test/specs/**'],
};
