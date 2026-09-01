import js from "@eslint/js";
import { type Linter } from "eslint";
import eslintConfigPrettier from "eslint-config-prettier";
import importPlugin from "eslint-plugin-import";
import turboPlugin from "eslint-plugin-turbo";
import tseslint from "typescript-eslint";

export const baseConfig: Linter.Config[] = [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  importPlugin.flatConfigs.recommended,
  {
    ...importPlugin.flatConfigs.typescript,
    files: ["**/*.{ts,tsx,mts,cts}"],
  },
  {
    plugins: {
      turbo: turboPlugin,
    },
    rules: {
      "turbo/no-undeclared-env-vars": "warn",
    },
  },
  {
    ignores: [
      "dist/**",
      ".next/**",
      "**/.turbo/**",
      "**/coverage/**",
      "next-env.d.ts",
    ],
  },
  {
    name: "workspace/imports",
    rules: {
      "import/consistent-type-specifier-style": ["warn", "prefer-inline"],
      "import/no-anonymous-default-export": "off",
    },
    settings: {
      "import/resolver": {
        typescript: true,
      },
    },
  },
  eslintConfigPrettier,
];
