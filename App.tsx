import "./sincpro_mobile_ui/theme/globals.css";

import { useTheme } from "@sincpro/mobile-ui/theme";
import { useAppFonts } from "@sincpro/mobile-ui/theme/typography";
import { requireOptionalNativeModule } from "expo";
import { ActivityIndicator, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";

import StorybookUIRoot from "./.rnstorybook";
import { SystemBars } from "./.rnstorybook/SystemBars";

// Expo Go and development builds draw this over the canvas on iOS and Android.
requireOptionalNativeModule<{
  setToolsButtonVisible: (visible: boolean) => void;
}>("ExpoDevMenu")?.setToolsButtonVisible(false);

export default function App() {
  const baseLoaded = useAppFonts();
  const theme = useTheme();
  if (!baseLoaded) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.bg.page, justifyContent: "center" }}>
        <ActivityIndicator accessibilityLabel="Cargando fuentes" color={theme.text.accent} />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardProvider>
        <SystemBars>
          <StorybookUIRoot />
        </SystemBars>
      </KeyboardProvider>
    </GestureHandlerRootView>
  );
}
