/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    globalSetup: '<rootDir>/test/globalSetup.ts',
    globalTeardown: '<rootDir>/test/globalTeardown.ts',
};
