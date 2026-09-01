import { type Linter } from "eslint";
import { config } from "@workspace/eslint-config/react-internal";

const eslintConfig: Linter.Config[] = [
  ...config,
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
