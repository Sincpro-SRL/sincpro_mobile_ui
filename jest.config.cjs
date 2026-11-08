const expoPreset = require("jest-expo/jest-preset");
const { transformIgnorePatterns } = expoPreset;

module.exports = {
  preset: "jest-expo",
  setupFiles: [
    ...(expoPreset.setupFiles ?? []),
    "react-native-gesture-handler/jestSetup",
    "<rootDir>/tests/jest-native-mocks.cjs",
  ],
  testMatch: ["<rootDir>/tests/**/*.test.tsx"],
  transformIgnorePatterns: transformIgnorePatterns.map((pattern) =>
    pattern.replace("(?!", "(?!@shopify/flash-list|"),
  ),
  moduleNameMapper: {
    "^@sincpro/mobile-ui/(.*)$": "<rootDir>/sincpro_mobile_ui/$1",
  },
};
