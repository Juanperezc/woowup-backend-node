module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: [
    "**/*.test.ts", // Look for .test.ts files
    "**/*.spec.ts", // Look for .spec.ts files
  ],
  // If you have tests inside __tests__ folders
  // testMatch: ["**/__tests__/**/*.ts"],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};
