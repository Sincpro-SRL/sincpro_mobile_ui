import { containerPair } from "@sincpro/mobile-ui/theme/color";
import { resolveOnColor } from "@sincpro/mobile-ui/theme/contrast";
import type { ThemeTokens } from "@sincpro/mobile-ui/theme/types";

/** Brand light palette for iOS and Android. Gold is a fill, never a border or a label. */
const PRIMARY = "#2A4A85";
const SECONDARY = "#1C3765";
const ACCENT = "#C89B3C";
const SUCCESS = "#2F6B3C";
const WARNING = "#7E5E12";
const DANGER = "#9B3B30";
const INFO = "#0F5C6E";
const INK = "#1A1714";
const MUTED = "#6B6459";

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
    page: "#FAF9F7",
    card: "#FFFFFF",
    popover: "#FFFFFF",
    muted: "#F3F0EA",
    accent: primaryC.container,
    hover: "#EBE6DE",
    disabled: "#E4DFD7",
    inverse: "#181614",
    containerLowest: "#FAF9F7",
    container: "#F3F0EA",
    containerHigh: "#E4DFD7",
  },
  text: {
    primary: INK,
    secondary: MUTED,
    tertiary: "#A39B90",
    muted: MUTED,
    accent: PRIMARY,
    inverse: "#FFFFFF",
    disabled: "#A39B90",
    onPrimary: "#FFFFFF",
    onSecondary: "#FFFFFF",
    onAccent: "#1A1714",
    onDanger: resolveOnColor(DANGER),
    onSuccess: resolveOnColor(SUCCESS),
  },
  icon: {
    primary: INK,
    secondary: MUTED,
    tertiary: "#A39B90",
    inverse: "#FFFFFF",
    disabled: "#A39B90",
  },
  border: {
    default: "#E4DFD7",
    light: "#F3F0EA",
    strong: "#D5CEC2",
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
  state: { hover: 0.08, press: 0.12, focus: 0.12, drag: 0.16 },
  material: { blur: 24, opacity: 0.78, borderOpacity: 0.18 },
  ring: PRIMARY,
  input: "#E4DFD7",
  gradient: {
    primary: [SECONDARY, PRIMARY],
    accent: ["#B88A2E", ACCENT],
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
