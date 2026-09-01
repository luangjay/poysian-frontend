import { type Linter } from "eslint";
import { nextJsConfig } from "@workspace/eslint-config/next-js";

const eslintConfig: Linter.Config[] = [
  ...nextJsConfig,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    settings: {
      "import/resolver": {
        typescript: {
          project: `${import.meta.dirname}/tsconfig.json`,
        },
      },
    },
  },
];

export default eslintConfig;
