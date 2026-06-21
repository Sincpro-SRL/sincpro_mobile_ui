const path = require("path");
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const { withStorybook } = require("@storybook/react-native/metro/withStorybook");

const config = getDefaultConfig(__dirname);

const withNW = withNativeWind(config, {
  input: "./sincpro_mobile_ui/theme/globals.css",
});

module.exports = withStorybook(withNW, {
  enabled: true,
  configPath: path.resolve(__dirname, "./.rnstorybook"),
});
