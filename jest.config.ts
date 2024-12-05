import type { Config } from "jest";
import nextJest from "next/jest";

const createJestConfig = nextJest({
  dir: "./",
});

const config: Config = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  collectCoverageFrom: [
    "**/*.{js,tsx,jsx,ts}",
    "!**/*.d.ts",
    "!**/node_modules/**",
    "!**/coverage/**",
    "!<rootDir>/.next/**",
    "!src/hooks/**",
    "!src/app/api/**",
    "!src/components/**",
    "!src/utils/**",
    "!src/lib/**",
    "!**/middleware.ts/**",
    "!**/prisma/**",
    "!**/*.config.ts/**",
  ],
  coverageProvider: "v8",
  testEnvironment: "jsdom",
};

export default createJestConfig(config);
