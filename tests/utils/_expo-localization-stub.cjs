// Inline stub of `expo-localization` for node:test. Replaces the native module so
// `utils/date.ts` (which imports `getLocales`) can be loaded without react-native.
exports.getLocales = () => [
  {
    languageTag: "es-CR",
    languageCode: "es",
    regionCode: "CR",
    textDirection: "ltr",
    decimalSeparator: ".",
    digitGroupingSeparator: ",",
  },
];