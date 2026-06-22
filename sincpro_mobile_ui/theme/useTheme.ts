import {
  getActiveTheme,
  getThemeVersion,
  subscribeTheme,
} from "@sincpro/mobile-ui/theme/active";
import type { ThemeTokens } from "@sincpro/mobile-ui/theme/types";
import { useSyncExternalStore } from "react";

export function useTheme(): ThemeTokens {
  useSyncExternalStore(subscribeTheme, getThemeVersion, getThemeVersion);
  return getActiveTheme();
}

export const theme = getActiveTheme();
