import { DEFAULT_THEME } from "./default";
import type { ThemeTokens } from "./types";

const activeTheme: ThemeTokens = { ...DEFAULT_THEME };

export function setActiveTheme(tokens: ThemeTokens): void {
  Object.assign(activeTheme as object, tokens);
}

export function getActiveTheme(): ThemeTokens {
  return activeTheme;
}
