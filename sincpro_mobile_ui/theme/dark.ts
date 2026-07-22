import { containerPair } from "@sincpro/mobile-ui/theme/color";
import { resolveOnColor } from "@sincpro/mobile-ui/theme/contrast";
import type { ThemeTokens } from "@sincpro/mobile-ui/theme/types";

const PRIMARY = "#C9A84C";
const SECONDARY = "#8B6914";
const ACCENT = "#F0D060";
const SUCCESS = "#15803D";
const WARNING = "#B45309";
const DANGER = "#B91C1C";
const INFO = "#1D4ED8";

const primaryC = containerPair(PRIMARY, "dark");
const secondaryC = containerPair(SECONDARY, "dark");
const accentC = containerPair(ACCENT, "dark");
const successC = containerPair(SUCCESS, "dark");
const warningC = containerPair(WARNING, "dark");
const dangerC = containerPair(DANGER, "dark");
const infoC = containerPair(INFO, "dark");

/**
 * Default dark theme. Companion to `DEFAULT_THEME`.
 * Prefer `buildThemeFromBrand({ mode: "dark", ... })` for brand apps.
 */
export const DEFAULT_DARK_THEME: ThemeTokens = {
  name: "default-dark",
  primary: PRIMARY,
  secondary: SECONDARY,
  accent: ACCENT,
  bg: {
    page: "#0C0C0C",
    card: "#161616",
    popover: "#161616",
    muted: "#1E1E1E",
    accent: "#3D2F0A",
    hover: "#262626",
    disabled: "#2A2A2A",
    inverse: "#FAF8F3",
    containerLowest: "#0A0A0A",
    container: "#1E1E1E",
    containerHigh: "#2A2A2A",
  },
  text: {
    primary: "#FDF3C8",
    secondary: "#C9A84C",
    tertiary: "#8B6914",
    muted: "#9A8B5C",
    accent: ACCENT,
    inverse: "#0A0A0A",
    disabled: "#8A8A8A",
    onPrimary: resolveOnColor(PRIMARY),
    onSecondary: resolveOnColor(SECONDARY),
    onAccent: resolveOnColor(ACCENT),
    onDanger: resolveOnColor(DANGER),
    onSuccess: resolveOnColor(SUCCESS),
  },
  icon: {
    primary: "#FDF3C8",
    secondary: "#C9A84C",
    tertiary: "#8B6914",
    inverse: "#0A0A0A",
    disabled: "#8A8A8A",
  },
  border: {
    default: "#262626",
    light: "#1E1E1E",
    strong: "#3A3A3A",
    focus: PRIMARY,
  },
  success: SUCCESS,
  warning: WARNING,
  danger: DANGER,
  info: INFO,
  successLight: successC.container,
  warningLight: warningC.container,
  dangerLight: dangerC.container,
  infoLight: infoC.container,
  container: {
    primary: primaryC.container,
    onPrimary: primaryC.onContainer,
    secondary: secondaryC.container,
    onSecondary: secondaryC.onContainer,
    accent: accentC.container,
    onAccent: accentC.onContainer,
    success: successC.container,
    onSuccess: successC.onContainer,
    warning: warningC.container,
    onWarning: warningC.onContainer,
    danger: dangerC.container,
    onDanger: dangerC.onContainer,
    info: infoC.container,
    onInfo: infoC.onContainer,
  },
  state: { hover: 0.1, press: 0.16, focus: 0.14, drag: 0.2 },
  material: { blur: 28, opacity: 0.62, borderOpacity: 0.22 },
  ring: PRIMARY,
  input: "#262626",
  gradient: {
    primary: [ACCENT, PRIMARY],
    accent: [PRIMARY, SECONDARY],
  },
  shadow: {
    sm: {
      shadowColor: "#000000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.4,
      shadowRadius: 3,
      elevation: 2,
    },
    md: {
      shadowColor: "#000000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.55,
      shadowRadius: 8,
      elevation: 4,
    },
    lg: {
      shadowColor: "#000000",
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.65,
      shadowRadius: 18,
      elevation: 7,
    },
  },
  pattern: {
    mode: "dark-pattern",
    size: 56,
  },
};
