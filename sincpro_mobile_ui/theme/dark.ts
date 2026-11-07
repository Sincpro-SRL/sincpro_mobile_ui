import { containerPair } from "@sincpro/mobile-ui/theme/color";
import { resolveOnColor } from "@sincpro/mobile-ui/theme/contrast";
import type { ThemeTokens } from "@sincpro/mobile-ui/theme/types";

/** Brand dark palette for iOS and Android, measured on #181614. */
const PRIMARY = "#8FA9E8";
const SECONDARY = "#B0C3F1";
const ACCENT = "#C89B3C";
const SUCCESS = "#6FCF8B";
const WARNING = "#E3B341";
const DANGER = "#F08D7F";
const INFO = "#5CC4D8";
const INK = "#ECE8E1";
const MUTED = "#A39B90";

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
    page: "#181614",
    card: "#221F1C",
    popover: "#221F1C",
    muted: "#302C28",
    accent: primaryC.container,
    hover: "#2A2622",
    disabled: "#3A342F",
    inverse: "#FAF9F7",
    containerLowest: "#141210",
    container: "#221F1C",
    containerHigh: "#302C28",
  },
  text: {
    primary: INK,
    secondary: MUTED,
    tertiary: "#8A8178",
    muted: MUTED,
    accent: PRIMARY,
    inverse: "#0A0A0A",
    disabled: "#8A8A8A",
    onPrimary: resolveOnColor(PRIMARY),
    onSecondary: resolveOnColor(SECONDARY),
    onAccent: resolveOnColor(ACCENT),
    onDanger: resolveOnColor(DANGER),
    onSuccess: resolveOnColor(SUCCESS),
  },
  icon: {
    primary: INK,
    secondary: MUTED,
    tertiary: "#8A8178",
    inverse: "#0A0A0A",
    disabled: "#8A8A8A",
  },
  border: {
    default: "#302C28",
    light: "#221F1C",
    strong: "#443F38",
    focus: PRIMARY,
  },
  success: SUCCESS,
  warning: WARNING,
  danger: DANGER,
  info: INFO,
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
  input: "#302C28",
  gradient: {
    primary: ["#1C3765", PRIMARY],
    accent: [ACCENT, "#DBB055"],
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
