import { DEFAULT_THEME } from "@sincpro/mobile-ui/theme/default";
import type { ThemeTokens } from "@sincpro/mobile-ui/theme/types";

export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends readonly unknown[]
    ? T[K]
    : T[K] extends object
      ? DeepPartial<T[K]>
      : T[K];
};

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function deepMerge<T>(base: T, override: DeepPartial<T>): T {
  const out: Record<string, unknown> = { ...(base as Record<string, unknown>) };
  for (const key of Object.keys(override as object)) {
    const o = (override as Record<string, unknown>)[key];
    const b = (base as Record<string, unknown>)[key];
    out[key] =
      isPlainObject(o) && isPlainObject(b) ? deepMerge(b, o as DeepPartial<typeof b>) : o;
  }
  return out as T;
}

/**
 * Defines a complete, typed theme (powerful API: the framework parametrizes
 * every token explicitly).
 */
export function defineTheme(tokens: ThemeTokens): ThemeTokens {
  return tokens;
}

/**
 * Merges a base theme with partial overrides (typed deep merge). Primitive
 * to build simpler APIs on top (e.g. the core's createTheme).
 */
export function mergeTheme(
  base: ThemeTokens,
  overrides: DeepPartial<ThemeTokens> = {},
): ThemeTokens {
  return deepMerge(base, overrides);
}

/**
 * Default theme + partial overrides in a single step.
 */
export function extendTheme(overrides: DeepPartial<ThemeTokens> = {}): ThemeTokens {
  return deepMerge(DEFAULT_THEME, overrides);
}
