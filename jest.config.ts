import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  dir: "./",
});
const customJestConfig = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testMatch: ["<rootDir>/src/**/*.test.{ts,tsx}"],
  testPathIgnorePatterns: ["<rootDir>/tests/"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
};
export default createJestConfig(customJestConfig);
