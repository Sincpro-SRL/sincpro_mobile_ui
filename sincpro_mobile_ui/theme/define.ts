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
 * Define un theme completo y tipado (API potente: el framework parametriza
 * todos los tokens explícitamente).
 */
export function defineTheme(tokens: ThemeTokens): ThemeTokens {
  return tokens;
}

/**
 * Combina un theme base con overrides parciales (deep merge tipado). Primitiva
 * para construir APIs simples encima (ej. createTheme del core).
 */
export function mergeTheme(
  base: ThemeTokens,
  overrides: DeepPartial<ThemeTokens> = {},
): ThemeTokens {
  return deepMerge(base, overrides);
}

/**
 * Theme por defecto + overrides parciales en un solo paso.
 */
export function extendTheme(overrides: DeepPartial<ThemeTokens> = {}): ThemeTokens {
  return deepMerge(DEFAULT_THEME, overrides);
}
