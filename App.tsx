import "./sincpro_mobile_ui/theme/globals.css";

import { SheetProvider } from "@sincpro/mobile-ui/Dialog/Dialog.Sheet";
import { configureFonts, useAppFonts } from "@sincpro/mobile-ui/theme/typography";
import { useFonts } from "expo-font";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";

import StorybookUIRoot from "./.rnstorybook";
import SatoshiBlack from "./assets/fonts/Satoshi-Black.otf";
import SatoshiBold from "./assets/fonts/Satoshi-Bold.otf";
import SatoshiMedium from "./assets/fonts/Satoshi-Medium.otf";
import SatoshiRegular from "./assets/fonts/Satoshi-Regular.otf";

// Manual de marca SINCPRO — 3 familias semánticas:
//   df  (display) → Satoshi       — títulos y encabezados
//   bf  (body)    → Inter         — cuerpo, labels, botones  [default DS]
//   cf/mono       → Fira Code     — captions, datos numéricos [default DS]
configureFonts({
  titleRegular: "Satoshi-Regular",
  titleMedium:  "Satoshi-Medium",
  title:        "Satoshi-Bold",
  titleBlack:   "Satoshi-Black",
  // body roles (light/regular/medium/semiBold/extraBold) → Inter (defaults, no tocar)
  // mono / monoMedium → Fira Code (defaults, no tocar)
});

export default function App() {
  // Inter + Fira Code (peer deps recomendadas) las carga el helper de la librería; Satoshi
  // (tipo de marca, ejemplo) lo carga este host. Sin esto la tipografía cae al sistema.
  const baseLoaded = useAppFonts();
  const [satoshiLoaded] = useFonts({
    "Satoshi-Regular": SatoshiRegular,
    "Satoshi-Medium": SatoshiMedium,
    "Satoshi-Bold": SatoshiBold,
    "Satoshi-Black": SatoshiBlack,
  });
  if (!baseLoaded || !satoshiLoaded) return null;

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
