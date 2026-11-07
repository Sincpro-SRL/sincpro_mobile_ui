const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");
const eslintPluginPrettierRecommended = require("eslint-plugin-prettier/recommended");
const simpleImportSort = require("eslint-plugin-simple-import-sort");
const reactPlugin = require("eslint-plugin-react");
const reactHooks = require("eslint-plugin-react-hooks");

module.exports = defineConfig([
  {
    ignores: ["lib/**", "dist/**", "node_modules/**", "**/storybook.requires.ts"],
  },
  expoConfig,
  reactHooks.configs.flat["recommended-latest"],
  eslintPluginPrettierRecommended,
  {
    plugins: {
      "simple-import-sort": simpleImportSort,
      react: reactPlugin,
    },
    settings: {
      react: { version: "detect" },
      "import/resolver": {
        typescript: { project: "./tsconfig.json" },
      },
    },
    rules: {
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
      "react/jsx-sort-props": ["warn", { ignoreCase: true }],
      // Off: our components export `default X` + `{ X }`; importing the default by its name is intentional.
      "import/no-named-as-default": "off",
    },
  },
]);
