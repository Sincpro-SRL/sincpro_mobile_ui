import AsyncStorage from "@react-native-async-storage/async-storage";

import { storybookChrome } from "./chrome-theme";
import { view } from "./storybook.requires";

const StorybookUIRoot = view.getStorybookUI({
  storage: { getItem: AsyncStorage.getItem, setItem: AsyncStorage.setItem },
  onDeviceUI: process.env.EXPO_PUBLIC_STORYBOOK_TEST !== "1",
  shouldPersistSelection: true,
  theme: storybookChrome,
});

export default StorybookUIRoot;
