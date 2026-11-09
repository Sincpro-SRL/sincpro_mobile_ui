import {
  getActiveTheme,
  getThemeSnapshot,
  subscribeTheme,
} from "@sincpro/mobile-ui/theme/active";
import type { ThemeTokens } from "@sincpro/mobile-ui/theme/types";
import { useSyncExternalStore } from "react";

/**
 * The active theme, as a new object after every `setActiveTheme`. Values memoized on it
 * (by hand or by React Compiler) recompute on a light/dark switch.
 */
export function useTheme(): ThemeTokens {
  return useSyncExternalStore(subscribeTheme, getThemeSnapshot, getThemeSnapshot);
}

export const theme = getActiveTheme();
