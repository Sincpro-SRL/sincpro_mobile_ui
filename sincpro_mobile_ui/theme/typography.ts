import { FiraCode_400Regular, FiraCode_500Medium } from "@expo-google-fonts/fira-code";
import {
  Inter_300Light,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_800ExtraBold,
  useFonts,
} from "@expo-google-fonts/inter";
import type { TextStyle } from "react-native";

/* -------------------- Font Families ----------------------------------------
 * The DS ships NO font files — it only holds FAMILY NAME strings per role.
 * Each app (or Storybook) loads its own font files and wires them in via
 * `configureFonts({...})`. Safe defaults: Inter (body) + Fira Code (mono);
 * the "title" roles fall back to Inter until the app sets its brand typeface.
 *
 * `fontFamilies` is a MUTABLE singleton: `configureFonts` does Object.assign
 * in-place so components that read it at render time see the updated values. */
export type FontRole =
  | "light"
  | "regular"
  | "medium"
  | "semiBold"
  | "extraBold"
  | "mono"
  | "monoMedium"
  | "titleRegular"
  | "titleMedium"
  | "title"
  | "titleBlack";

const DEFAULT_FONT_FAMILIES: Record<FontRole, string> = {
  light: "Inter_300Light",
  regular: "Inter_400Regular",
  medium: "Inter_500Medium",
  semiBold: "Inter_600SemiBold",
  extraBold: "Inter_800ExtraBold",
  mono: "FiraCode_400Regular",
  monoMedium: "FiraCode_500Medium",
  // Title roles default to Inter until the app wires its brand typeface via configureFonts.
  titleRegular: "Inter_400Regular",
  titleMedium: "Inter_500Medium",
  title: "Inter_600SemiBold",
  titleBlack: "Inter_800ExtraBold",
};

export const fontFamilies: Record<FontRole, string> = { ...DEFAULT_FONT_FAMILIES };

/**
 * Override DS font family names (role → already-loaded family name).
 * Mutates the singleton in-place so components pick up the change at render time.
 * Example: `configureFonts({ title: "Satoshi-Bold", titleBlack: "Satoshi-Black" })`.
 */
export function configureFonts(overrides: Partial<Record<FontRole, string>>): void {
  Object.assign(fontFamilies, overrides);
}

/** Reset all font roles to the defaults (Inter + Fira Code). Useful in tests and stories. */
export function resetFonts(): void {
  Object.assign(fontFamilies, DEFAULT_FONT_FAMILIES);
}

export const fontWeights = {
  light: "300",
  regular: "400",
  medium: "500",
  semiBold: "600",
  extraBold: "800",
  mono: "400",
  monoMedium: "500",
  titleRegular: "400",
  titleMedium: "500",
  title: "700",
  titleBlack: "900",
} as const;

/* -------------------- Font Sizes -------------------- */
export const fontSizes = {
  xs: 10,
  sm: 13,
  base: 14,
  lg: 16,
  xl: 18,
  "2xl": 20,
  "3xl": 24,
  "4xl": 28,
  "5xl": 32,
  "6xl": 36,
  "7xl": 48,
  "8xl": 64,
} as const;

/* -------------------- Line Heights -------------------- */
export const lineHeights = {
  none: 1,
  tight: 1.25,
  snug: 1.375,
  normal: 1.5,
  relaxed: 1.625,
  loose: 2,
} as const;

/* -------------------- Letter Spacing -------------------- */
export const letterSpacing = {
  tighter: -0.5,
  tight: -0.25,
  normal: 0,
  wide: 0.25,
  wider: 0.5,
  widest: 1,
} as const;

/* -------------------- Typography Variants -------------------- */
export const typographyVariants = {
  // Display (Satoshi Black — brand character)
  display: {
    fontSize: fontSizes["7xl"],
    fontFamily: fontFamilies.titleBlack,
    fontWeight: fontWeights.titleBlack,
    lineHeight: fontSizes["7xl"] * lineHeights.tight,
    letterSpacing: letterSpacing.tight,
  },

  // Headings (Satoshi Bold)
  h1: {
    fontSize: fontSizes["5xl"],
    fontFamily: fontFamilies.title,
    fontWeight: fontWeights.title,
    lineHeight: fontSizes["5xl"] * lineHeights.tight,
    letterSpacing: letterSpacing.tight,
  },
  h2: {
    fontSize: fontSizes["4xl"],
    fontFamily: fontFamilies.title,
    fontWeight: fontWeights.title,
    lineHeight: fontSizes["4xl"] * lineHeights.snug,
    letterSpacing: letterSpacing.normal,
  },
  h3: {
    fontSize: fontSizes["3xl"],
    fontFamily: fontFamilies.title,
    fontWeight: fontWeights.title,
    lineHeight: fontSizes["3xl"] * lineHeights.snug,
    letterSpacing: letterSpacing.normal,
  },
  h4: {
    fontSize: fontSizes["2xl"],
    fontFamily: fontFamilies.medium,
    fontWeight: fontWeights.medium,
    lineHeight: fontSizes["2xl"] * lineHeights.normal,
    letterSpacing: letterSpacing.normal,
  },
  h5: {
    fontSize: fontSizes.xl,
    fontFamily: fontFamilies.medium,
    fontWeight: fontWeights.medium,
    lineHeight: fontSizes.xl * lineHeights.normal,
    letterSpacing: letterSpacing.normal,
  },
  h6: {
    fontSize: fontSizes.lg,
    fontFamily: fontFamilies.medium,
    fontWeight: fontWeights.medium,
    lineHeight: fontSizes.lg * lineHeights.normal,
    letterSpacing: letterSpacing.normal,
  },

  // Body
  bodyLarge: {
    fontSize: fontSizes.lg,
    fontFamily: fontFamilies.regular,
    fontWeight: fontWeights.regular,
    lineHeight: fontSizes.lg * lineHeights.relaxed,
    letterSpacing: letterSpacing.normal,
  },
  body: {
    fontSize: fontSizes.base,
    fontFamily: fontFamilies.regular,
    fontWeight: fontWeights.regular,
    lineHeight: fontSizes.base * lineHeights.relaxed,
    letterSpacing: letterSpacing.normal,
  },
  bodySmall: {
    fontSize: fontSizes.sm,
    fontFamily: fontFamilies.regular,
    fontWeight: fontWeights.regular,
    lineHeight: fontSizes.sm * lineHeights.normal,
    letterSpacing: letterSpacing.normal,
  },

  // Label
  label: {
    fontSize: fontSizes.base,
    fontFamily: fontFamilies.medium,
    fontWeight: fontWeights.medium,
    lineHeight: fontSizes.base * lineHeights.normal,
    letterSpacing: letterSpacing.wide,
  },
  labelSmall: {
    fontSize: fontSizes.sm,
    fontFamily: fontFamilies.medium,
    fontWeight: fontWeights.medium,
    lineHeight: fontSizes.sm * lineHeights.normal,
    letterSpacing: letterSpacing.wide,
  },

  // Data — amounts, SKU, % (Fira Code mono, medium weight). DS role "data".
  data: {
    fontSize: fontSizes.lg,
    fontFamily: fontFamilies.monoMedium,
    fontWeight: fontWeights.monoMedium,
    lineHeight: fontSizes.lg * lineHeights.tight,
    letterSpacing: letterSpacing.normal,
  },
  dataLarge: {
    fontSize: fontSizes["4xl"],
    fontFamily: fontFamilies.monoMedium,
    fontWeight: fontWeights.monoMedium,
    lineHeight: fontSizes["4xl"] * lineHeights.none,
    letterSpacing: letterSpacing.tight,
  },
  // Overline — UPPERCASE labels / metadata in mono with tracking. DS role "caption".
  overline: {
    fontSize: 11,
    fontFamily: fontFamilies.mono,
    fontWeight: fontWeights.mono,
    lineHeight: 11 * lineHeights.snug,
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },

  // Caption — Fira Code mono (secondary text, metadata, data labels)
  caption: {
    fontSize: fontSizes.sm,
    fontFamily: fontFamilies.mono,
    fontWeight: fontWeights.mono,
    lineHeight: fontSizes.sm * lineHeights.normal,
    letterSpacing: letterSpacing.normal,
  },
  captionSmall: {
    fontSize: fontSizes.xs,
    fontFamily: fontFamilies.mono,
    fontWeight: fontWeights.mono,
    lineHeight: fontSizes.xs * lineHeights.normal,
    letterSpacing: letterSpacing.normal,
  },

  // Buttons
  button: {
    fontSize: fontSizes.base,
    fontFamily: fontFamilies.semiBold,
    fontWeight: fontWeights.semiBold,
    lineHeight: fontSizes.base * lineHeights.none,
    letterSpacing: letterSpacing.wide,
  },
  buttonSmall: {
    fontSize: fontSizes.sm,
    fontFamily: fontFamilies.semiBold,
    fontWeight: fontWeights.semiBold,
    lineHeight: fontSizes.sm * lineHeights.none,
    letterSpacing: letterSpacing.wide,
  },
  buttonLarge: {
    fontSize: fontSizes.lg,
    fontFamily: fontFamilies.semiBold,
    fontWeight: fontWeights.semiBold,
    lineHeight: fontSizes.lg * lineHeights.none,
    letterSpacing: letterSpacing.wide,
  },

  // Legacy
  title: {
    fontSize: fontSizes.xl,
    fontFamily: fontFamilies.semiBold,
    fontWeight: fontWeights.semiBold,
    lineHeight: fontSizes.xl * lineHeights.snug,
    letterSpacing: letterSpacing.normal,
  },
  subtitle: {
    fontSize: fontSizes.lg,
    fontFamily: fontFamilies.medium,
    fontWeight: fontWeights.medium,
    lineHeight: fontSizes.lg * lineHeights.normal,
    letterSpacing: letterSpacing.normal,
  },
} as const;

/* -------------------- Variant → Font Role --------------------
 * Each variant points to a ROLE (not a fixed family) so `configureFonts` can
 * update it at runtime. `Typography.Text` resolves `fontFamilies[role]` on
 * render. The baked-in family in each variant above is a static fallback only. */
export const variantFontRole: Record<keyof typeof typographyVariants, FontRole> = {
  display: "titleBlack",
  h1: "titleBlack",
  h2: "title",
  h3: "title",
  h4: "medium",
  h5: "medium",
  h6: "medium",
  bodyLarge: "regular",
  body: "regular",
  bodySmall: "regular",
  label: "medium",
  labelSmall: "medium",
  data: "monoMedium",
  dataLarge: "monoMedium",
  overline: "mono",
  caption: "mono",
  captionSmall: "mono",
  button: "semiBold",
  buttonSmall: "semiBold",
  buttonLarge: "semiBold",
  title: "semiBold",
  subtitle: "medium",
};

/* -------------------- Utility Functions -------------------- */
export const createTextStyle = (
  variant: keyof typeof typographyVariants,
  overrides?: Partial<TextStyle>,
): TextStyle => ({
  ...typographyVariants[variant],
  ...overrides,
});

export const createCustomTextStyle = (
  fontSize: keyof typeof fontSizes,
  fontFamily: keyof typeof fontFamilies,
  options?: {
    lineHeight?: keyof typeof lineHeights;
    letterSpacing?: keyof typeof letterSpacing;
    color?: string;
  },
): TextStyle => {
  const size = fontSizes[fontSize];
  const line = options?.lineHeight ? lineHeights[options.lineHeight] : lineHeights.normal;
  const spacing = options?.letterSpacing ?? "normal";

  return {
    fontSize: size,
    fontFamily: fontFamilies[fontFamily],
    fontWeight: fontWeights[fontFamily],
    lineHeight: size * line,
    letterSpacing: letterSpacing[spacing],
    ...(options?.color && { color: options.color }),
  };
};

/* Re-export useFonts so consumers (e.g. the framework) can load fonts without
 * depending directly on expo-font — it's already a transitive dep via this package. */
export { useFonts };

/* -------------------- Font Loader (optional, convenience) ------------------
 * Loads the recommended base fonts (Inter + Fira Code) declared as peer deps.
 * The "title" role (e.g. Satoshi) is loaded and wired by the app/Storybook
 * via `configureFonts` — the DS never bundles font files. */
export const useAppFonts = () => {
  const [loaded] = useFonts({
    FiraCode_400Regular,
    FiraCode_500Medium,
    Inter_300Light,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_800ExtraBold,
  });
  return loaded;
};

/* -------------------- Typography Object -------------------- */
export const Typography = {
  fontFamilies,
  fontWeights,
  fontSizes,
  lineHeights,
  letterSpacing,
  variants: typographyVariants,
  variantFontRole,
  createTextStyle,
  createCustomTextStyle,
  configureFonts,
  resetFonts,
  useAppFonts,
} as const;

export default Typography;
