module.exports = {
  root: true,
  extends: ["@repo/eslint-config/library.js"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: ["./packages/*/tsconfig.json", "./apps/*/tsconfig.json"],
  },
  ignorePatterns: [
    "**/dist/*",
    "**/node_modules/*",
    "**/*.config.{js,cjs,mjs,ts}",
    "**/.eslintrc.{js,cjs,mjs}",
    "**/packages/eslint-config/**/*",
    "**/tailwind.config.*",
    "**/playwright-report/**/*",
    "**/test-results/**/*",
  ],
};
