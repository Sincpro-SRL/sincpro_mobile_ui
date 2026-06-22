const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");
const eslintPluginPrettierRecommended = require("eslint-plugin-prettier/recommended");
const simpleImportSort = require("eslint-plugin-simple-import-sort");
const reactPlugin = require("eslint-plugin-react");

module.exports = defineConfig([
  {
    ignores: ["lib/**", "dist/**", "node_modules/**", "**/storybook.requires.ts"],
  },
  expoConfig,
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
      "react-hooks/exhaustive-deps": "off",
      // refs/set-state-in-render flag the canonical RN patterns (useRef(new Animated.Value()).current,
      // PanResponder read in JSX) — kept as warn, they're not bugs.
      "react-hooks/refs": "warn",
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/set-state-in-render": "warn",
      // Off: our components export `default X` + `{ X }`; importing the default by its name is intentional.
      "import/no-named-as-default": "off",
    },
  },
]);
