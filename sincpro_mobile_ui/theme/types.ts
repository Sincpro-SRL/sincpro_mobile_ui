/**
 * ============================================================================
 * THEME SYSTEM - SIMPLE & SEMANTIC
 * ============================================================================
 *
 * Simplified theming system without hooks or context.
 * Tokens are read directly from the active theme.
 */

// ----------------------------------------------------------------------------
// Shadow Tokens (React Native)
// ----------------------------------------------------------------------------

export interface ShadowStyle {
  shadowColor: string;
  shadowOffset: { width: number; height: number };
  shadowOpacity: number;
  shadowRadius: number;
  elevation: number;
}

// ----------------------------------------------------------------------------
// Theme Tokens (SIMPLIFIED)
// ----------------------------------------------------------------------------

export interface ThemeTokens {
  /** Theme name */
  name: string;

  /** Primary color - main buttons, links, active states */
  primary: string;

  /** Secondary color - secondary buttons, low-profile elements (gray) */
  secondary: string;

  /** Accent color - highlights, important badges, secondary CTAs (orange/indigo) */
  accent: string;

  /** Backgrounds */
  bg: {
    page: string; // Screen background
    card: string; // Cards, modals, inputs
    popover: string; // Dropdowns, tooltips, context menus
    muted: string; // Secondary surfaces, alternating rows
    accent: string; // Selected states, active rows
    hover: string; // Hover states
    disabled: string; // Disabled states
  };

  /** Text */
  text: {
    primary: string; // Primary text
    secondary: string; // Secondary text
    tertiary: string; // Placeholders, tertiary text
    muted: string; // Text on bg.muted
    accent: string; // Text on bg.accent
    inverse: string; // Text on colors (white)
    disabled: string; // Disabled text
    onPrimary: string; // Text on primary
    onSecondary: string; // Text on secondary (gray)
    onAccent: string; // Text on accent
    onDanger: string; // Text on danger
    onSuccess: string; // Text on success
  };
  /** Icons */
  icon: {
    primary: string; // Primary icon
    secondary: string; // Secondary icon
    tertiary: string; // Tertiary icon
    inverse: string; // Icon on colors (white)
    disabled: string; // Disabled icon
  };
  /** Borders */
  border: {
    default: string; // Normal borders
    light: string; // Soft borders
    strong: string; // Strong borders
    focus: string; // Focus color
  };

  /** Semantic states */
  success: string;
  warning: string;
  danger: string;
  info: string;

  /** Semantic states - light variants */
  successLight: string;
  warningLight: string;
  dangerLight: string;
  infoLight: string;

  /** Focus & Input */
  ring: string; // Focus outline color
  input: string; // Input border color

  /** Gradients (for LinearGradient) */
  gradient: {
    primary: readonly [string, string];
    accent: readonly [string, string];
  };

  /** Shadows (React Native) */
  shadow: {
    sm: ShadowStyle;
    md: ShadowStyle;
    lg: ShadowStyle;
  };
}
