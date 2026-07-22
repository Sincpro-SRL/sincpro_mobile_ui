import { DEFAULT_THEME } from "@sincpro/mobile-ui/theme/default";
import type { ThemeTokens } from "@sincpro/mobile-ui/theme/types";
import { validateTheme } from "@sincpro/mobile-ui/theme/validate";

const activeTheme: ThemeTokens = { ...DEFAULT_THEME };
const listeners = new Set<() => void>();
let version = 0;

// Detection helper: we don't want validation warnings to spam the console while running
// runtime tests under Node (they intentionally pass partial themes). The check is cheap
// and runs once at module load.
const isReactNative =
  typeof navigator !== "undefined" &&
  (navigator as { product?: string }).product === "ReactNative";

export function setActiveTheme(tokens: ThemeTokens): void {
  if (__DEV__ && isReactNative) {
    const issues = validateTheme(tokens);
    if (issues.length > 0) {
      const fmt = issues.map((i) => `  · ${i.path}: ${i.message}`).join("\n");

      console.warn(
        `[@sincpro/mobile-ui] setActiveTheme received a theme with issues:\n${fmt}\nRendering will fall back to default styles for missing keys.`,
      );
    }
  }
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
