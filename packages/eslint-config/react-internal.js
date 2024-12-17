const { resolve } = require("node:path");

const project = resolve(process.cwd(), "tsconfig.json");

/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  plugins: ["only-warn", "@typescript-eslint"],
  globals: {
    React: true,
    JSX: true,
  },
  env: {
    browser: true,
  },
  settings: {
    "import/resolver": {
      typescript: {
        project,
      },
    },
  },
  ignorePatterns: [
    ".eslintrc.js",
    "**/dist/*",
    "**/node_modules/*",
    "**/*.config.{js,cjs,mjs,ts}",
    "**/.eslintrc.{js,cjs,mjs}",
    "**/packages/eslint-config/**/*",
    "**/tailwind.config.*",
    "**/playwright-report/**/*",
    "**/test-results/**/*",
  ],
  rules: {},
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
    },
  ],
};
