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

/* -------------------- Font Families & Weights --------------------
 * SINCPRO brand: body/UI = Inter, mono/code = Fira Code. (Título = Satoshi cuando se
 * provea el asset de Fontshare; por ahora Inter ExtraBold cumple el rol de título.) */
export const fontFamilies = {
  light: "Inter_300Light",
  regular: "Inter_400Regular",
  medium: "Inter_500Medium",
  semiBold: "Inter_600SemiBold",
  extraBold: "Inter_800ExtraBold",
  mono: "FiraCode_400Regular",
} as const;

export const fontWeights = {
  light: "300",
  regular: "400",
  medium: "500",
  semiBold: "600",
  extraBold: "800",
  mono: "400",
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
  // Display
  display: {
    fontSize: fontSizes["7xl"],
    fontFamily: fontFamilies.extraBold,
    fontWeight: fontWeights.extraBold,
    lineHeight: fontSizes["7xl"] * lineHeights.tight,
    letterSpacing: letterSpacing.tight,
  },

  // Headings
  h1: {
    fontSize: fontSizes["5xl"],
    fontFamily: fontFamilies.extraBold,
    fontWeight: fontWeights.extraBold,
    lineHeight: fontSizes["5xl"] * lineHeights.tight,
    letterSpacing: letterSpacing.tight,
  },
  h2: {
    fontSize: fontSizes["4xl"],
    fontFamily: fontFamilies.semiBold,
    fontWeight: fontWeights.semiBold,
    lineHeight: fontSizes["4xl"] * lineHeights.snug,
    letterSpacing: letterSpacing.normal,
  },
  h3: {
    fontSize: fontSizes["3xl"],
    fontFamily: fontFamilies.semiBold,
    fontWeight: fontWeights.semiBold,
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

  // Caption
  caption: {
    fontSize: fontSizes.sm,
    fontFamily: fontFamilies.regular,
    fontWeight: fontWeights.regular,
    lineHeight: fontSizes.sm * lineHeights.normal,
    letterSpacing: letterSpacing.normal,
  },
  captionSmall: {
    fontSize: fontSizes.xs,
    fontFamily: fontFamilies.regular,
    fontWeight: fontWeights.regular,
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

/* -------------------- Font Loader -------------------- */
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
  createTextStyle,
  createCustomTextStyle,
  useAppFonts,
} as const;

export default Typography;
