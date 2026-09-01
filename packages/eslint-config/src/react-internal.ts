import { type Linter } from "eslint";
import eslintConfigPrettier from "eslint-config-prettier";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import globals from "globals";
import tseslint from "typescript-eslint";
import { baseConfig } from "./base.js";

export const config: Linter.Config[] = [
  ...baseConfig,
  {
    ...pluginReact.configs.flat.recommended,
    languageOptions: {
      ...pluginReact.configs.flat.recommended?.languageOptions,
      globals: {
        ...globals.node,
        ...globals.serviceworker,
        ...globals.browser,
      },
    },
  },
  ...tseslint.configs.recommendedTypeChecked,
  {
    plugins: {
      "react-hooks": {
        meta: pluginReactHooks.meta,
        rules: pluginReactHooks.rules,
      },
    },
    settings: { react: { version: "detect" } },
    rules: {
      ...pluginReactHooks.configs.recommended.rules,
      // React scope no longer necessary with new JSX transform.
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
    },
  },
  {
    name: "workspace/react-typescript",
    rules: {
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { fixStyle: "inline-type-imports" },
      ],
      "@typescript-eslint/no-unused-vars": [
        "error",
        { ignoreRestSiblings: true },
      ],
    },
  },
  eslintConfigPrettier,
];
