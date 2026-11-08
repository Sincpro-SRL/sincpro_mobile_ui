import {
  getActiveTheme,
  getThemeVersion,
  subscribeTheme,
} from "@sincpro/mobile-ui/theme/active";
import { themeToVars } from "@sincpro/mobile-ui/theme/css-vars";
import { vars } from "nativewind";
import { useSyncExternalStore } from "react";

type ThemeVars = ReturnType<typeof vars>;

let cachedVersion = -1;
let cachedVars: ThemeVars | undefined;

function currentVars(): ThemeVars {
  const version = getThemeVersion();
  if (!cachedVars || cachedVersion !== version) {
    cachedVersion = version;
    cachedVars = vars(themeToVars(getActiveTheme()));
  }
  return cachedVars;
}

/**
 * NativeWind CSS variables for the active theme, as one stable object per
 * theme version. A new object on every render would make every `className`
 * consumer below re-resolve its styles.
 */
export function useThemeVars(): ThemeVars {
  return useSyncExternalStore(subscribeTheme, currentVars, currentVars);
}
