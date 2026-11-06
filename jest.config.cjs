module.exports = {
  preset: "jest-expo",
  testMatch: ["<rootDir>/tests/**/*.test.tsx"],
  moduleNameMapper: {
    "^@sincpro/mobile-ui/(.*)$": "<rootDir>/sincpro_mobile_ui/$1",
  },
};
