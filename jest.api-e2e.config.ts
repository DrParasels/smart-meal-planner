import nextJest from "next/jest.js";
const createJestConfig = nextJest({ dir: "./" });
export default createJestConfig({
  testEnvironment: "node",
  testMatch: ["<rootDir>/tests/**/*.api-e2e.test.ts", "<rootDir>/tests/api.e2e.test.ts"],
  testTimeout: 30000,
  setupFilesAfterEnv: [],
});
