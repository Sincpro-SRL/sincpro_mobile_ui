import { DEFAULT_THEME } from "@sincpro/mobile-ui/theme/default";
import type { ThemeTokens } from "@sincpro/mobile-ui/theme/types";

const activeTheme: ThemeTokens = { ...DEFAULT_THEME };
const listeners = new Set<() => void>();
let version = 0;

export function setActiveTheme(tokens: ThemeTokens): void {
  Object.assign(activeTheme as object, tokens);
  version += 1;
  listeners.forEach((listener) => listener());
}

export function getActiveTheme(): ThemeTokens {
  return activeTheme;
}

export function subscribeTheme(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getThemeVersion(): number {
  return version;
}
