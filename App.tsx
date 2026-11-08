import "./sincpro_mobile_ui/theme/globals.css";

import { useTheme } from "@sincpro/mobile-ui/theme";
import { useAppFonts } from "@sincpro/mobile-ui/theme/typography";
import { requireOptionalNativeModule } from "expo";
import { useEffect } from "react";
import { ActivityIndicator, AppState, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";

import StorybookUIRoot from "./.rnstorybook";
import { SystemBars } from "./.rnstorybook/SystemBars";

function hideExpoToolsButton() {
  requireOptionalNativeModule<{
    setToolsButtonVisible?: (visible: boolean) => void;
  }>("ExpoDevMenu")?.setToolsButtonVisible?.(false);
}

// A dev client links ExpoDevMenu and can hide the tools button. Expo Go does
// not expose that module; open it with __expo_disable_fab=1. Closing the menu
// can put the button back, so retry after the app becomes active.
hideExpoToolsButton();

export default function App() {
  useEffect(() => {
    hideExpoToolsButton();
    const late = setTimeout(hideExpoToolsButton, 700);
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") hideExpoToolsButton();
    });
    return () => {
      clearTimeout(late);
      subscription.remove();
    };
  }, []);

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
