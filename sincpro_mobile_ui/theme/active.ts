import { DEFAULT_THEME } from "@sincpro/mobile-ui/theme/default";
import type { ThemeTokens } from "@sincpro/mobile-ui/theme/types";

const activeTheme: ThemeTokens = { ...DEFAULT_THEME };

export function setActiveTheme(tokens: ThemeTokens): void {
  Object.assign(activeTheme as object, tokens);
}

export function getActiveTheme(): ThemeTokens {
  return activeTheme;
}
