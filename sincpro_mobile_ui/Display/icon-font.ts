import { MaterialSymbols_400Regular } from "@expo-google-fonts/material-symbols/400Regular";

export const ICON_FONT_FAMILY = "MaterialSymbols_400Regular";

/** Load once at startup with `useFonts(ICON_FONTS)`; Android and web draw icons from it. */
export const ICON_FONTS: Record<string, number> = {
  [ICON_FONT_FAMILY]: MaterialSymbols_400Regular,
};
