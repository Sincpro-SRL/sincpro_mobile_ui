import { containerPair } from "@sincpro/mobile-ui/theme/color";
import { resolveOnColor } from "@sincpro/mobile-ui/theme/contrast";
import type { ThemeTokens } from "@sincpro/mobile-ui/theme/types";

const PRIMARY = "#C9A84C";
const SECONDARY = "#8B6914";
const ACCENT = "#C9A84C";
const SUCCESS = "#15803D";
const WARNING = "#B45309";
const DANGER = "#B91C1C";
const INFO = "#1D4ED8";

const primaryC = containerPair(PRIMARY, "light");
const secondaryC = containerPair(SECONDARY, "light");
const accentC = containerPair(ACCENT, "light");
const successC = containerPair(SUCCESS, "light");
const warningC = containerPair(WARNING, "light");
const dangerC = containerPair(DANGER, "light");
const infoC = containerPair(INFO, "light");

/**
 * Default light theme. Sample values — not the framework identity.
 * Prefer `buildThemeFromBrand` or `extendTheme` at app boot.
 */
export const DEFAULT_THEME: ThemeTokens = {
  name: "default-light",
  primary: PRIMARY,
  secondary: SECONDARY,
  accent: ACCENT,
  bg: {
    page: "#FAF8F3",
    card: "#FFFFFF",
    popover: "#FFFFFF",
    muted: "#F1ECDF",
    accent: "#FDF3C8",
    hover: "#EDE6D2",
    disabled: "#E5DEC8",
    inverse: "#0C0C0C",
    containerLowest: "#FAF8F3",
    container: "#F1ECDF",
    containerHigh: "#E5DEC8",
  },
  text: {
    primary: "#0A0A0A",
    secondary: "#4A3100",
    tertiary: "#A09060",
    muted: "#6B5A2E",
    accent: SECONDARY,
    inverse: "#FFFFFF",
    disabled: "#9A8B5C",
    onPrimary: resolveOnColor(PRIMARY),
    onSecondary: resolveOnColor(SECONDARY),
    onAccent: resolveOnColor(ACCENT),
    onDanger: resolveOnColor(DANGER),
    onSuccess: resolveOnColor(SUCCESS),
  },
  icon: {
    primary: "#0A0A0A",
    secondary: "#6B5A2E",
    tertiary: "#A09060",
    inverse: "#FFFFFF",
    disabled: "#9A8B5C",
  },
  border: {
    default: "#E5DEC8",
    light: "#F1ECDF",
    strong: "#C9C0A2",
    focus: SECONDARY,
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
  state: { hover: 0.08, press: 0.12, focus: 0.12, drag: 0.16 },
  material: { blur: 24, opacity: 0.78, borderOpacity: 0.18 },
  ring: SECONDARY,
  input: "#E5DEC8",
  gradient: {
    primary: ["#F0D060", PRIMARY],
    accent: [PRIMARY, SECONDARY],
  },
  shadow: {
    sm: {
      shadowColor: "#000000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.06,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: "#000000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 3,
    },
    lg: {
      shadowColor: "#000000",
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.14,
      shadowRadius: 15,
      elevation: 5,
    },
  },
  pattern: {
    mode: "light-pattern",
    size: 56,
  },
};
