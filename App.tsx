import "./sincpro_mobile_ui/theme/globals.css";

import { SheetProvider } from "@sincpro/mobile-ui/Dialog/Dialog.Sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";

import StorybookUIRoot from "./.rnstorybook";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <KeyboardProvider>
          <SheetProvider>
            <StorybookUIRoot />
          </SheetProvider>
        </KeyboardProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
