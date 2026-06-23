import type { ThemeTokens } from "@sincpro/mobile-ui/theme/types";

/**
 * SINCPRO brand-dark theme.
 * Identity: black (#0B0B0B) surfaces + neon-green (#00F58C) as primary CTA / accent.
 * Border/text tones shift to near-black warm neutrals (not blue-slate).
 */
export const DEFAULT_DARK_THEME: ThemeTokens = {
  name: "dark",
  primary: "#00F58C", // verde neón → primary action in dark (border, link, focus indicator)
  secondary: "#6B6963",
  accent: "#00F58C",
  bg: {
    page: "#0B0B0B",
    card: "#161616",
    popover: "#161616",
    muted: "#1E1E1E",
    accent: "#0D2B1F", // dark-green tint for selected/active rows
    hover: "#262626",
    disabled: "#161616",
    inverse: "#0B0B0B",
  },
  text: {
    primary: "#FFFFFF",
    secondary: "#B0B0B0",
    tertiary: "#7D7D7D",
    muted: "#9D9D9D",
    accent: "#00F58C",
    inverse: "#0B0B0B",
    disabled: "#4A4A4A",
    onPrimary: "#06170E", // texto sobre verde neón: oscuro para contraste
    onSecondary: "#0B0B0B",
    onAccent: "#06170E",
    onDanger: "#FFFFFF",
    onSuccess: "#FFFFFF",
  },
  icon: {
    primary: "#FFFFFF",
    secondary: "#9A9A9A",
    tertiary: "#7D7D7D",
    inverse: "#0B0B0B",
    disabled: "#4A4A4A",
  },
  border: {
    default: "#262626",
    light: "#1E1E1E",
    strong: "#3A3A3A",
    focus: "#00F58C",
  },
  success: "#00C357",
  warning: "#FFB020",
  danger: "#FF4D1F",
  info: "#5B8DEF",
  successLight: "#0D2B1A",
  warningLight: "#2B1E04",
  dangerLight: "#2B0A04",
  infoLight: "#0A143B",
  ring: "#00F58C",
  input: "#262626",
  gradient: {
    primary: ["#22E584", "#00F58C"], // verde gradient → primary btn en dark = CTA verde
    accent: ["#22E584", "#00F58C"],
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
};
