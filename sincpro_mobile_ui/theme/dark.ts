import type { ThemeTokens } from "@sincpro/mobile-ui/theme/types";

/**
 * Default dark theme (starting point — adjustable per app via createTheme).
 * Dark surfaces (slate-900/800/700), light text, brand accents preserved
 * and slightly more vivid for contrast on a dark background.
 */
export const DEFAULT_DARK_THEME: ThemeTokens = {
  name: "dark",
  primary: "#3B82F6",
  secondary: "#94A3B8",
  accent: "#FBBF24",
  bg: {
    page: "#0F172A",
    card: "#1E293B",
    popover: "#1E293B",
    muted: "#334155",
    accent: "#1E3A8A",
    hover: "#334155",
    disabled: "#1E293B",
    inverse: "#0B0F0D",
  },
  text: {
    primary: "#F1F5F9",
    secondary: "#CBD5E1",
    tertiary: "#64748B",
    muted: "#94A3B8",
    accent: "#93C5FD",
    inverse: "#0F172A",
    disabled: "#475569",
    onPrimary: "#FFFFFF",
    onSecondary: "#0F172A",
    onAccent: "#0F172A",
    onDanger: "#FFFFFF",
    onSuccess: "#FFFFFF",
  },
  icon: {
    primary: "#F1F5F9",
    secondary: "#94A3B8",
    tertiary: "#64748B",
    inverse: "#0F172A",
    disabled: "#475569",
  },
  border: {
    default: "#334155",
    light: "#1E293B",
    strong: "#475569",
    focus: "#3B82F6",
  },
  success: "#22C55E",
  warning: "#FBBF24",
  danger: "#EF4444",
  info: "#3B82F6",
  successLight: "#14532D",
  warningLight: "#78350F",
  dangerLight: "#7F1D1D",
  infoLight: "#1E3A8A",
  ring: "#3B82F6",
  input: "#334155",
  gradient: {
    primary: ["#3B82F6", "#1E40AF"],
    accent: ["#FBBF24", "#D97706"],
  },
  shadow: {
    sm: {
      shadowColor: "#000000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: "#000000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 6,
      elevation: 3,
    },
    lg: {
      shadowColor: "#000000",
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.4,
      shadowRadius: 15,
      elevation: 5,
    },
  },
};
