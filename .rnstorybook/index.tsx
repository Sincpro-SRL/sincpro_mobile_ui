import AsyncStorage from "@react-native-async-storage/async-storage";

import { view } from "./storybook.requires";

const StorybookUIRoot = view.getStorybookUI({
  storage: { getItem: AsyncStorage.getItem, setItem: AsyncStorage.setItem },
  onDeviceUI: process.env.EXPO_PUBLIC_STORYBOOK_TEST !== "1",
});

export default StorybookUIRoot;
