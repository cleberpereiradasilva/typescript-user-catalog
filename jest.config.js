module.exports = {
  coverageProvider: "v8",
  testMatch: [
    "**/__tests__/**/*.[jt]s?(x)",
    "**/?(*.)+(spec|test).[tj]s?(x)"
  ],

  testPathIgnorePatterns: [
    "/node_modules/"
  ],
  "transform": {
    "^.+\\.(ts|tsx)$": "ts-jest"
  },
};
