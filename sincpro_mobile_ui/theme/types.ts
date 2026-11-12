/**
 * ============================================================================
 * THEME SYSTEM — semantic + container (M3-era) tokens
 * ============================================================================
 *
 * Layers (framework contract, mid-2026):
 * 1. Semantic fills — `primary` / `accent` / `secondary` / state hues (chrome, CTAs).
 * 2. Containers — soft tonal surfaces + `on*` ink (badges, chips, tonal buttons).
 * 3. Surfaces — `bg.*` including tonal `containerLowest|container|containerHigh`.
 * 4. State layers — opacity overlays for press/hover/focus (Material state layers).
 * 5. Material — nav-chrome hints for Liquid Glass / blur peers (optional usage).
 *
 * Color roles:
 * - Fills/borders/tracks → `primary` / `accent` (never body text).
 * - Brand text/links → `text.accent` (AA on `bg.page` / `bg.card`).
 * - Ink on filled brand → `text.onPrimary` via `resolveOnColor`.
 * - Ink on soft containers → `container.onPrimary` / `container.onSuccess` / …
 */

import type { ImageSourcePropType } from "react-native";

export interface ShadowStyle {
  shadowColor: string;
  shadowOffset: { width: number; height: number };
  shadowOpacity: number;
  shadowRadius: number;
  elevation: number;
}

export interface ThemeTokens {
  name: string;

  /** Primary fill — CTA surfaces, active tracks, decorative borders. Not for body text. */
  primary: string;
  /** Secondary fill — low-profile surfaces and secondary actions. */
  secondary: string;
  /** Accent fill — highlights, secondary CTAs, decorative chrome. Not for body text. */
  accent: string;

  bg: {
    page: string;
    card: string;
    popover: string;
    muted: string;
    accent: string;
    hover: string;
    disabled: string;
    /** Opposite / hero surface (AppBar tone="dark"). Light themes: dark; dark themes: light. */
    inverse?: string;
    /**
     * Tonal elevation ladder (M3 surfaceContainer*). Prefer these over stacking
     * shadows for hierarchy on mobile.
     */
    containerLowest: string;
    container: string;
    containerHigh: string;
  };

  text: {
    primary: string;
    secondary: string;
    tertiary: string;
    muted: string;
    accent: string;
    inverse: string;
    disabled: string;
    onPrimary: string;
    onSecondary: string;
    onAccent: string;
    onDanger: string;
    onSuccess: string;
  };

  icon: {
    primary: string;
    secondary: string;
    tertiary: string;
    inverse: string;
    disabled: string;
  };

  border: {
    default: string;
    light: string;
    strong: string;
    focus: string;
  };

  success: string;
  warning: string;
  danger: string;
  info: string;

  /**
   * Soft tonal fills + on-colors — badges, chips, tonal CTAs, selected rows.
   * Prefer these over saturated `success` + white for body-sized labels.
   */
  container: {
    primary: string;
    onPrimary: string;
    secondary: string;
    onSecondary: string;
    accent: string;
    onAccent: string;
    success: string;
    onSuccess: string;
    warning: string;
    onWarning: string;
    danger: string;
    onDanger: string;
    info: string;
    onInfo: string;
  };

  /**
   * State-layer opacities (Material 3). Overlay brand/on-surface at this alpha
   * for press/hover/focus — do not invent per-component opacities.
   */
  state: {
    hover: number;
    press: number;
    focus: number;
    drag: number;
  };

  /**
   * Nav-chrome material hints (iOS Liquid Glass / frosted bars). Opt-in peers
   * (`expo-glass-effect`) read these; content layers stay solid `bg.*`.
   */
  material: {
    blur: number;
    opacity: number;
    borderOpacity: number;
  };

  ring: string;
  input: string;

  gradient: {
    primary: readonly [string, string];
    accent: readonly [string, string];
  };

  shadow: {
    sm: ShadowStyle;
    md: ShadowStyle;
    lg: ShadowStyle;
  };

  pattern?: {
    mode: PatternMode;
    size: number;
    source?: ImageSourcePropType;
  };

  /**
   * Categorical palette for `@sincpro/mobile-ui/Charts`, in slot order. Without it, charts use
   * the validated default for the theme's light or dark surface. Validate a brand palette for
   * color blindness and contrast against `bg.card` before setting it.
   */
  chart?: {
    series: readonly string[];
  };
}

export type PatternMode = "light-pattern" | "dark-pattern" | "dark-full";
