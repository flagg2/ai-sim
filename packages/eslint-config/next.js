const { resolve } = require("node:path");

const project = resolve(process.cwd(), "tsconfig.json");

/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    require.resolve("@vercel/style-guide/eslint/next"),
  ],
  globals: {
    React: true,
    JSX: true,
  },
  env: {
    node: true,
    browser: true,
  },
  plugins: ["only-warn", "@typescript-eslint"],
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
  rules: {
    "@next/next/no-html-link-for-pages": "off",
  },
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      parserOptions: {
        project,
      },
    },
  ],
};
