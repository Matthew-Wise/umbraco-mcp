/** @type {import('ts-jest').JestConfigWithTsJest} */
const config = {
  preset: "ts-jest/presets/js-with-ts-esm",
  testEnvironment: "node",
  extensionsToTreatAsEsm: [".ts"],
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
    "^@/clients/(.*)\\.js$": "<rootDir>/src/clients/$1",
    "^@/helpers/(.*)\\.js$": "<rootDir>/src/helpers/$1",
    "^@/umb-management-api/(.*)\\.js$":
      "<rootDir>/src/api/umbraco/management/$1",
    "^@/constants/(.*)\\.js$": "<rootDir>/src/constants/$1",
    "\\.md$": "<rootDir>/src/__mocks__/markdownMock.js"
  },
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        useESM: true,
      },
    ],
  },
  testMatch: ["**/src/**/__tests__/**/*.test.ts"],
  setupFilesAfterEnv: ["jest-extended/all"],
  setupFiles: ["<rootDir>/jest.setup.ts"],
  maxConcurrency: 1, // we have to this because Umbraco using SQLite and it doesn't support concurrent connections
  maxWorkers: 1,
};

module.exports = config;